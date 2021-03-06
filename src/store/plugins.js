/**
 *  creator: zheng
 *  date: 2017/8/15
 *  email: zhenglfsir@gmail.com
 */
import * as types from './mutation-types'

export default store => {
  let state = store.state
  state.socket && state.socket.on('connect', () => {
    console.log('[connected]')
  })
  state.socket && state.socket.on('discount', () => {
    console.log('[discount]')
  })
  state.socket && state.socket.on('data', data => {
    store.commit('receiveData', data)
  })

  state.socket && state.socket.on('message', data => {
    console.log(data)
  })

  state.socket && state.socket.on('syncMessage', fromId => {
    console.log('同步消息')
    store.dispatch('syncMessage', fromId)
  })

  state.socket && state.socket.on('syncUser', () => {
    console.log('同步好友')
    if (store.state.chat.session.uid) {
      store.dispatch('syncUser')
    }
  })

  state.socket && state.socket.on('login', uid => {
    console.log('[login]')
    if (store.state.chat.session.uid) {
      store.dispatch('userOnline', uid)
    }
  })

  store.subscribe(mutation => {
    switch (mutation.type) {
      case types.SEND_MESSAGE:
        state.socket.send(mutation.payload)
        setTimeout(() => {
          store.dispatch('scrollBottom', true)
        }, 1000)
        break
      case types.SCROLL_BOTTOM:
        const bodyBox = document.querySelector('.body-item-box')
        const el = store.state.chat.el
        const height = bodyBox.clientHeight
        const boxHeight = el.clientHeight
        if (height > boxHeight && el.scrollTop > el.clientHeight * 2) {
          let timer = setInterval(() => {
            if (el.scrollTop === (bodyBox.offsetTop + el.offsetTop + height - boxHeight - 58)) {
              console.log('clear')
              clearInterval(timer)
            }
            store.state.chat.el.scrollTop += 2
          }, 10)
        } else {
          el.scrollTop = bodyBox.offsetTop + el.offsetTop + height - boxHeight
        }
        break
    }
  })
}
