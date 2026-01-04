// ==UserScript==
// @name         B站删除所有动态的脚本
// @namespace    http://tampermonkey.net/
// @version      2024-09-28
// @description  点击按钮即可删除自己的所有动态
// @author       Juns
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510555/B%E7%AB%99%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E5%8A%A8%E6%80%81%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510555/B%E7%AB%99%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89%E5%8A%A8%E6%80%81%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

const buttonStyles = {
  border: 'none',
  borderRadius: '20px',
  background: 'linear-gradient(32deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4)',
  transition: 'all 1.5s ease',
  fontWeight: 'bold',
  letterSpacing: '0.05rem',
  padding: '0',
  cursor: 'pointer',
  height: '40px',
}

const spanStyles = {
  padding: '15px 18px',
  fontSize: '17px',
  borderRadius: '20px',
  background: '#ffffff10',
  color: '#ffffff',
  transition: '0.4s ease-in-out',
  transitionProperty: 'color',
  height: '100%',
  width: '100%',
}

;(function () {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  const deleteAll = async () => {
    const menus = document.querySelectorAll('.bili-dyn-more__menu')

    if (!menus || !menus.length) {
      alert('没有动态了')
      return
    }

    for (let menu of menus) {
      const deleteBtn = menu.childNodes[1]
      deleteBtn.click()
      await sleep(100)
      const confirmBtn = document.querySelector('.bili-modal__footer')
        .childNodes[2]
      confirmBtn.click()
      await sleep(1000)
    }

    window.scrollTo(0, document.body.scrollHeight)
    await sleep(1000)
    deleteAll()
  }

  const createButton = () => {
    const button = document.createElement('button')
    const span = document.createElement('span')
    span.innerText = '删除所有动态'
    button.appendChild(span)

    Object.entries(spanStyles).forEach(([name, value]) => {
      span.style[name] = value
    })
    Object.entries(buttonStyles).forEach(([name, value]) => {
      button.style[name] = value
    })
    button.onclick = deleteAll

    const box = document.createElement('div')
    box.appendChild(button)
    Object.entries({
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      display: 'flex',
      gap: '10px',
    }).forEach(([name, value]) => {
      box.style[name] = value
    })

    document.body.appendChild(box)
  }

  createButton()
})()
