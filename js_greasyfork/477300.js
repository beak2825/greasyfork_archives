// ==UserScript==
// @name         v2rayA增强
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  功能增强
// @author       You
// @match        http://192.168.20.16:2017/
// @match        http://v2mgr.nrp.fangstar.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=20.16
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477300/v2rayA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/477300/v2rayA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  function enhanceOperator(rightEl) {
    let selectAllBtnEl = document.createElement('button')
    selectAllBtnEl.type = 'button'
    selectAllBtnEl.classList.add('button', 'field', 'mobile-small', 'is-primary')
    selectAllBtnEl.innerText = '选择所有'
    selectAllBtnEl.style.marginLeft = '10px'
    selectAllBtnEl.addEventListener('click', () => {
      let allBox = document.querySelectorAll('.operate-box')

      let allOperatorButton = []
      // 增强for
      for (let item of allBox) {
        allOperatorButton.push(item.firstElementChild)
      }

      // 条件过滤
      allOperatorButton = Array.from(allOperatorButton).filter((item) => {
        return item.querySelector('.icon-lianjie')
      })

      console.log(allOperatorButton)

      // 点击按钮
      allOperatorButton.forEach((item, index) => {
        setTimeout(() => {
          item.click()
          if (index == allOperatorButton.length - 1) alert('已经全部选择')
        }, index * 500)
      })
    })

    let unselectAllBtnEl = document.createElement('button')
    unselectAllBtnEl.type = 'button'
    unselectAllBtnEl.classList.add('button', 'field', 'mobile-small', 'is-primary')
    unselectAllBtnEl.innerText = '取消所有'
    unselectAllBtnEl.style.marginLeft = '10px'
    unselectAllBtnEl.addEventListener('click', () => {
      let allBox = document.querySelectorAll('.operate-box')

      let allOperatorButton = []
      // 增强for
      for (let item of allBox) {
        allOperatorButton.push(item.firstElementChild)
      }

      // 条件过滤
      allOperatorButton = Array.from(allOperatorButton).filter((item) => {
        return item.querySelector('.icon-Link_disconnect')
      })

      console.log(allOperatorButton)

      // 点击按钮
      allOperatorButton.forEach((item, index) => {
        setTimeout(() => {
          item.click()
          if (index == allOperatorButton.length - 1) alert('已经全部取消选择')
        }, index * 500)
      })
    })

    rightEl.appendChild(selectAllBtnEl)
    rightEl.appendChild(unselectAllBtnEl)
  }

  // 将网页语音设置为中文
  let htmlEl = document.querySelector('html')
  htmlEl.setAttribute('lang', 'zh-CN')

  const observer = new MutationObserver(function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 向下查找
            let rightEls = node.getElementsByClassName('right')
            if (rightEls.length > 0) {
              enhanceOperator(rightEls[0])
              observer.disconnect()
            }
          }
        }
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
})()
