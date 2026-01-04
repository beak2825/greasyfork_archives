// ==UserScript==
// @name         Slack text Copy Button|Claude一键复制消息文本
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  在 Slack 的网页版消息块上添加复制按钮，特别是在使用Claude的时候，一键复制消息文本，非常方便。
// @author       kif
// @match        https://*.slack.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465478/Slack%20text%20Copy%20Button%7CClaude%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%B6%88%E6%81%AF%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/465478/Slack%20text%20Copy%20Button%7CClaude%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%B6%88%E6%81%AF%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict'
  // 创建一个观察器,监听 DOM 变化
  const observer = new MutationObserver(mutations => {
    // 当 <message> 元素插入页面时
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        // 查找插入的 <message> 元素
        const messages = mutation.target.querySelectorAll('.c-message_kit__blocks')
        // 遍历每个 <message> 并添加复制按钮
        messages.forEach(message => {
          // 在 <message> 上添加复制按钮
          if (message.querySelector('button')) {
            return
          }
          const copyButton = document.createElement('button')
          copyButton.innerText = '📋'
          copyButton.className = 'c-button-unstyled c-message_actions__button c-message_actions__emoji_button'
          copyButton.style.position = 'absolute'
          copyButton.style.right = 0
          copyButton.style.top = 0
          copyButton.style.opacity= 0.7
          message.style.position = 'relative'
          message.appendChild(copyButton)

          // 点击复制按钮,将 <message> 内容复制到剪贴板
          copyButton.addEventListener('click', () => {
            const button = message.querySelector('button')
            message.removeChild(button)
            const code = message.innerText
            // 将修复后的文本复制到剪贴板
            navigator.clipboard.writeText(code)
            // 显示成功提示
            const prompt = document.createElement('div')
            prompt.innerText = '复制成功!'
            prompt.style.position = 'fixed'
            prompt.style.top = '50px'
            prompt.style.right = '50%'
            prompt.style.transform = 'translateX(50%)'
            prompt.style.padding = '10px 20px'
            prompt.style.background = 'grey'
            prompt.style.borderRadius = '4px'
            prompt.style.zIndex = 222
            prompt.style.color = 'lightpink'
            document.body.appendChild(prompt)

            // 2 秒后自动移除提示
            setTimeout(() => {
              document.body.removeChild(prompt)
            }, 2000)
          })
        })
      }
    })
  })

  // 以根元素为监听目标,监听子节点变动
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})()