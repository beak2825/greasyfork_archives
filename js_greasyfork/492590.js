// ==UserScript==
// @name         boss直聘
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  test
// @author       You
// @match        https://www.zhipin.com/*
// @license      AGPL License
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492590/boss%E7%9B%B4%E8%81%98.user.js
// @updateURL https://update.greasyfork.org/scripts/492590/boss%E7%9B%B4%E8%81%98.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // 全部消息列表
  function clickChatList() {
    // const els = document.getElementsByClassName('friend-content')
    const els = document.getElementsByClassName('geek-item-wrap')
    console.log('els', els)
    console.log('els length', els.length)
    els[1].click()
  }
  // 有未读消息：
  function noticeList() {
    const el = document.getElementsByClassName('notice-badge')
    el[0].click()
  }
  // 聊天输入框
  function chatInput() {
    const chat = document.getElementById('chat-input')
    chat.innerHTML = '你好！还在找工作吗？'
  }
  // 发送按钮
  function sendBtn() {
    const btn = document.getElementsByClassName('btn-send')
    Array.from(btn[0].classList).includes('disabled') &&
      btn[0].classList.remove('disabled')
    // btn[0].click()
  }
  const elWrap = document.createElement('div')
  elWrap.style.cssText = `
    position: fixed;
    top: 48%;
    right: 20px;
    z-index: 999999999;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
  `
  document.body.appendChild(elWrap)
  // 执行一键回复
  const btnStyle = `
  padding: 6px 10px;
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 6px;
`
  const el = document.createElement('button')
  el.style.cssText = btnStyle
  el.innerHTML = '回复第二条消息'
  elWrap.appendChild(el)
  const handleElClick = async () => {
    console.log('开始执行')
    try {
      await clickChatList()
      setTimeout(() => {
        chatInput()
      }, 300)
      setTimeout(() => {
        sendBtn()
      }, 600)
    } catch (e) {}
  }
  el.addEventListener('click', handleElClick)

  const el3 = document.createElement('button')
  el3.style.cssText = btnStyle
  el3.innerHTML = '点此自动发问候语'
  elWrap.appendChild(el3)
  const handleElClick2 = async () => {
    console.log('开始执行')
    try {
      chatInput()
      setTimeout(() => {
        sendBtn()
      }, 300)
    } catch (e) {}
  }
  el3.addEventListener('click', handleElClick2)

  // const el2 = document.createElement('button')
  // el2.style.cssText = btnStyle
  // el2.style.marginBottom = '0'
  // el2.innerHTML = '未读消息回复'
  // elWrap.appendChild(el2)
  // el.onclick = async () => {
  //   try {
  //     await noticeList()
  //     await chatInput()
  //     await sendBtn()
  //   } catch (e) {}
  // }
})()
