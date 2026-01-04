// ==UserScript==
// @name        ntfy复制按钮
// @namespace   zaqai
// @match       *://ntfy.sh/*
// @grant       none
// @version     1.0
// @author      zaqai
// @description 为ntfy网页端消息添加复制按钮
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/465681/ntfy%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/465681/ntfy%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function () {
  'use strict'

  // 等待直到有class为MuiCard-root的元素出现
  function checkCards () {
    const cards = document.querySelectorAll('.MuiCard-root')
    if (cards.length > 0) {
      // 可以在此处调用另一个函数，来执行您的脚本代码
      runScript(cards)
    } else {
      setTimeout(checkCards, 500)
    }
  }

  // 这里是您希望执行的脚本代码
  function runScript (cards) {
    cards.forEach(card => {
      // 检查是否已经添加了按钮
      if (card.querySelector('.copy-button')) return
      // 创建复制按钮
      createAndAppendButton(card)
    })

    //observe new added item
    // 选择要监视的元素
    const target = document.querySelector('.MuiStack-root')
    // 创建一个MutationObserver对象
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 获取添加的节点
          const addedNode = mutation.addedNodes[0]
          createAndAppendButton(addedNode)
        }
      })
    })
    // 开始监听元素
    observer.observe(target, { subtree: false, childList: true })
  }

  function createAndAppendButton (node) {
    const buttonStyle = 'width: 80px; height: 30px; float: right;'
    // 创建复制按钮
    const copyButton = document.createElement('button')
    copyButton.innerText = '复制'
    copyButton.className = 'copy-button' // 添加类名
    copyButton.style = buttonStyle // 使用 CSS 样式

    // 添加点击事件
    copyButton.addEventListener('click', () => {
      const textToCopy = node.querySelector('.MuiTypography-body1:last-of-type').innerText
      navigator.clipboard.writeText(textToCopy)
        .then(() => console.log(`已复制：${textToCopy}`))
        .catch(err => console.error('复制失败', err))
    })
    node.querySelector('.MuiCardContent-root').appendChild(copyButton)
  }

  checkCards()
})()