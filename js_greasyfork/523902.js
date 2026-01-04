// ==UserScript==
// @name         华莘学堂刷题辅助
// @namespace    https://witcjzk.huashenxt.com
// @version      0.1
// @description  华莘学堂我的题库自动显示答案
// @author       flypig
// @match        https://witcjzk.huashenxt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523902/%E5%8D%8E%E8%8E%98%E5%AD%A6%E5%A0%82%E5%88%B7%E9%A2%98%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/523902/%E5%8D%8E%E8%8E%98%E5%AD%A6%E5%A0%82%E5%88%B7%E9%A2%98%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  let answers = []

  // 储存原始的open方法
  let originalOpen = XMLHttpRequest.prototype.open
  // 覆盖默认的open方法
  XMLHttpRequest.prototype.open = function (
    method,
    url,
    async,
    user,
    password
  ) {
    this.addEventListener('load', function () {
      if (
        this.responseURL.includes('/users/teachingprocController/getExamInfo')
      ) {
        try {
          const response = JSON.parse(this.responseText)
          if (response.data && response.data.content) {
            // 提取答案并存储到全局变量中
            answers = response.data.content.map(
              i => i.answer.equal ?? i.answer.consult.text
            )
            // 等待DOM加载完成后更新页面上的答案
            setTimeout(updateAnswersOnPage, 0)
          }
        } catch (error) {
          console.error('出错了:', error)
        }
      }
    })
    // 使用储存的原始open方法
    originalOpen.apply(this, arguments)
  }

  function updateAnswersOnPage() {
    // 确保DOM已经完全加载
    if (document.readyState !== 'complete') {
      document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') {
          performAnswerReplacement()
        }
      })
    } else {
      performAnswerReplacement()
    }
  }

  function performAnswerReplacement() {
    // 获取所有需要替换的元素
    const elements = document.querySelectorAll('.question_media')
    // 遍历元素并将答案依次替换文本内容
    elements.forEach((element, index) => {
      if (index < answers.length) {
        const newDiv = document.createElement('div')
        newDiv.textContent = answers[index]
        newDiv.style.color = '#2F5AFF'
        newDiv.style.margin = '10px 0'
        element.appendChild(newDiv)
      }
    })
  }
})()
