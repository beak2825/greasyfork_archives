// ==UserScript==
// @name         Follow 阅读收藏
// @namespace    http://tampermonkey.net/
// @version      2025-01-05-001
// @description  自动收集链接并打开，并取消收藏（需要打开控制台！！!需要打开控制台！！!需要打开控制台！！!）
// @author       4Ark
// @match        https://app.follow.is/feeds/collections/pending?view=0*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=follow.is
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523076/Follow%20%E9%98%85%E8%AF%BB%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523076/Follow%20%E9%98%85%E8%AF%BB%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // 创建按钮
  const button = document.createElement('button')
  button.innerText = '阅读收藏'
  button.style.position = 'fixed'
  button.style.top = '10px'
  button.style.right = '10px'
  button.style.zIndex = 1000 // 确保按钮在最上层
  button.style.padding = '5px 10px'
  button.style.backgroundColor = '#eee'
  button.style.color = '#333'
  button.style.border = 'none'
  button.style.borderRadius = '5px'
  button.style.cursor = 'pointer'
  button.style.fontSize = '12px'
  document.body.appendChild(button)

  // 按钮点击事件
  button.onclick = async () => {
    const links = [] // 存储链接的数组
    const elements = [...document.querySelectorAll('#entry-column-scroller .group')].slice(0, 5)

    for (const e of elements) {
      // 创建右键点击事件
      const rightClickEvent = new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 100
      })

      // 分发事件
      e.dispatchEvent(rightClickEvent)

      // 延迟操作
      await new Promise(resolve => setTimeout(resolve, 350))

      // 点击菜单项以复制链接
      document.querySelector('body div[data-radix-popper-content-wrapper] div[role=menuitem]:nth-child(3)').click()

      // 延迟读取剪贴板
      await new Promise(resolve => setTimeout(resolve, 500))

      // 从剪贴板读取链接
      try {
        const clipboardText = await navigator.clipboard.readText()
        if (clipboardText) {
          links.push(clipboardText) // 将链接添加到数组中
        } else {
          console.error('剪贴板为空或无法读取内容。')
        }
      } catch (err) {
        console.error('无法读取剪贴板内容:', err)
      }

      // 分发事件
      e.dispatchEvent(rightClickEvent)

      // 延迟操作
      await new Promise(resolve => setTimeout(resolve, 350))

      // 取消收藏
      await new Promise(resolve => setTimeout(resolve, 350)) // 等待一段时间以确保操作顺利
      document.querySelector("body div[data-radix-popper-content-wrapper] div[role=menuitem]:nth-child(2)").click() // 点击取消收藏
    }

    // 一次性打开所有链接
    links.forEach(link => {
      const newTab = window.open(link, '_blank')
      if (newTab) {
        newTab.blur()
      } else {
        alert('请允许弹出窗口。')
      }
    })

    // 返回当前窗口焦点
    window.focus()
  }
})()
