// ==UserScript==
// @name B站直播间弹幕发送
// @namespace qingxian
// @author 人间百般事哪个最清闲
// @copyright 人间百般事哪个最清闲
// @version 1.0.1
// @description B站直播间自动发送弹幕
// @grant GM_addStyle
// @grant GM_addElement
// @include https://live.bilibili.com/*
// @match *://live.bilibili.com/*
// @icon https://www.bilibili.com/favicon.ico
// @icon64 https://www.bilibili.com/favicon.ico
// @tag BiliBili
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530681/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/530681/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==
;(function () {
  ;('use strict')
  console.log('B站直播间弹幕发送:脚本启动')
  let interval = 3500
  let control
  let title
  let count
  let input
  let btn
  let isDragging = false
  let startX, startY, startLeft, startTop
  let sending = false
  let chatInput
  let sendButton
  function init() {
    control = document.createElement('div')
    control.style.position = 'fixed'
    control.style.top = '80px'
    control.style.left = '24px'
    control.style.width = '200px'
    control.style.height = '150px'
    control.style.zIndex = '9999999'
    control.style.borderRadius = '10px'
    control.style.boxShadow = '0 0 10px rgba(173, 216, 230, 0.8)'
    control.style.margin = '0'
    control.style.padding = '0'
    control.style.borderRadius = '6px'
    control.style.backgroundColor = '#ffffff'
    document.body.appendChild(control)
    title = document.createElement('p')
    title.innerText = '弹幕发送'
    title.style.backgroundColor = '#dfdfdf'
    title.style.color = '#000000'
    title.style.fontWeight = '600'
    title.style.alignContent = 'center'
    title.style.width = 'calc(100% - 8px)'
    title.style.height = '30px'
    title.style.margin = '0'
    title.style.padding = '0'
    title.style.paddingLeft = '8px'
    title.style.borderRadius = '6px 6px 0 0'
    title.style.boxShadow = '0 0 10px rgba(173, 216, 230, 0.8)'
    title.style.cursor = 'grab'
    control.appendChild(title)
    title.addEventListener('mousedown', e => {
      title.style.cursor = 'grabbing'
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      startLeft = parseInt(window.getComputedStyle(control).left, 10)
      startTop = parseInt(window.getComputedStyle(control).top, 10)
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
    count = document.createElement('p')
    count.innerText = '已点击: 0 次'
    count.style.color = 'black'
    count.style.alignContent = 'center'
    count.style.width = 'calc(100% - 8px)'
    count.style.height = '30px'
    count.style.margin = '0'
    count.style.padding = '0'
    count.style.paddingLeft = '8px'
    count.style.fontSize = '12px'
    control.appendChild(count)
    input = document.createElement('input')
    input.placeholder = '请输入要发送内容,多条用 ; 隔开'
    input.value = '1;2;3;4;5'
    input.style.width = 'calc(100% - 24px)'
    input.style.height = '24px'
    input.style.padding = '0'
    input.style.paddingLeft = '6px'
    input.style.margin = '8px'
    input.style.backgroundColor = 'white'
    input.style.color = 'black'
    input.style.border = '1px #dcdfe6 solid'
    input.style.outline = 'none'
    input.addEventListener('focus', () => {
      input.style.border = '2px #409EFF solid'
      input.style.width = 'calc(100% - 26px)'
    })
    input.addEventListener('blur', () => {
      input.style.border = '1px #dcdfe6 solid'
      input.style.width = 'calc(100% - 24px)'
    })
    control.appendChild(input)
    btn = document.createElement('button')
    btn.innerText = '发送'
    btn.style.margin = '4px 0 0 8px'
    btn.style.backgroundColor = '#409EFF'
    btn.style.borderRadius = '5px'
    btn.style.outline = 'none'
    btn.style.border = 'none'
    btn.style.alignContent = 'center'
    btn.style.color = 'white'
    btn.style.fontWeight = '600'
    btn.style.padding = '4px 8px'
    btn.style.cursor = 'pointer'
    control.appendChild(btn)
    btn.addEventListener('click', sendMsg)
  }
  let msgInterval
  function sendMsg() {
    if (!sending) {
      if (input.value) {
        console.log('开始发送消息')
        let msgCount = 0
        sending = true
        btn.innerText = '停止'
        const arr = input.value.split(';')
        let index = 0
        function toSend() {
          chatInput.focus()
          chatInput.value = arr[index]
          chatInput.dispatchEvent(new Event('input', { bubbles: true }))
          console.log('喵~ 文本已输入：' + arr[index])
          if (index === arr.length - 1) {
            index = 0
          } else {
            index++
          }
          simulateMouseEvent(sendButton, 'mousedown')
          simulateMouseEvent(sendButton, 'mouseup')
          simulateMouseEvent(sendButton, 'click')
          console.log('喵~ 已触发发送按钮点击事件！')
          msgCount++
          count.innerText = `已点击: ${msgCount} 次`
        }
        toSend()
        msgInterval = setInterval(() => {
          toSend()
        }, interval)
      } else {
        let position = 0
        let count = 0
        input.style.border = '2px solid red'
        const interval = setInterval(() => {
          position = position === 0 ? 5 : 0
          input.style.transform = `translateX(${position}px)`
          count++
          if (count > 10) {
            clearInterval(interval)
            input.style.transform = 'translateX(0)'
            input.style.border = '1px #dcdfe6 solid'
          }
        }, 50)
      }
    } else {
      console.log('取消发送消息')
      if (msgInterval) {
        clearInterval(msgInterval)
      }
      sending = false
      count.innerText = '已点击: 0 次'
      btn.innerText = '发送'
    }
  }
  function simulateMouseEvent(element, eventType) {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: document.defaultView
    })
    element.dispatchEvent(event)
  }
  function onMouseMove(e) {
    if (!isDragging) return
    let dx = e.clientX - startX
    let dy = e.clientY - startY
    control.style.left = startLeft + dx + 'px'
    control.style.top = startTop + dy + 'px'
  }
  function onMouseUp() {
    title.style.cursor = 'grab'
    isDragging = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  let checkExist = setTimeout(() => {
    chatInput = document.querySelector('textarea.chat-input.border-box')
    sendButton = document.querySelector(
      '.bl-button.live-skin-highlight-button-bg.live-skin-button-text.bl-button--primary.bl-button--small'
    )
    if (chatInput && sendButton) {
      console.log('✔️ 找到输入框和发送按钮！')
      clearTimeout(checkExist)
      init()
    } else {
      console.log('❌ 未找到找输入框和按钮...')
    }
  }, 10000)
})()
