// ==UserScript==
// @name         Slack Code Copy Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 Slack 的网页版代码块上添加复制按钮
// @author       sbill
// @match        https://*.slack.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464309/Slack%20Code%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/464309/Slack%20Code%20Copy%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict'
  // 创建一个观察器,监听 DOM 变化
  const observer = new MutationObserver(mutations => {
    // 当 <pre> 元素插入页面时
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        // 查找插入的 <pre> 元素
        const pres = mutation.target.querySelectorAll('.c-mrkdwn__pre')
        // 遍历每个 <pre> 并添加复制按钮
        pres.forEach(pre => {
          // 在 <pre> 上添加复制按钮
          if (pre.querySelector('button')) {
            return
          }
          const copyButton = document.createElement('button')
          copyButton.innerText = '复制'
          copyButton.className = 'c-button c-button--primary c-button--small'
          copyButton.style.position = 'absolute'
          copyButton.style.right = 0
          copyButton.style.top = 0
          pre.style.position = 'relative'
          pre.appendChild(copyButton)

          // 点击复制按钮,将 <pre> 内容复制到剪贴板
          copyButton.addEventListener('click', () => {
            const button = pre.querySelector('button')
            pre.removeChild(button)
            const code = pre.innerText
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