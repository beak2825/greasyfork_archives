// ==UserScript==
// @name         98手机网页一键评分
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  修改帖子底部的评分按钮，实现自动评分
// @author       bbbyqq
// @match        *://*/forum.php?mod=viewthread*
// @license      bbbyqq
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523823/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/523823/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function () {
    'use strict'

    if (document.querySelector('#thread_btn_bar .btn:nth-child(4) span')?.innerText === '评分') {
      document.querySelector('#thread_btn_bar .btn:nth-child(4) span').innerText = '一键评分'
    }

    if (document.querySelector('#thread_btn_bar .btn:nth-child(4) span')?.innerText.includes('评分')) {
      // 为一键评分按钮添加点击事件
      document.querySelector('#thread_btn_bar .btn:nth-child(4)').addEventListener('click', function () {
        let attempts = 0
        let maxAttempts = 200
        let interval = setInterval(() => {
          const scoreElement = document.querySelector('#ntcmsg_popmenu #score8')
          // 元素存在，获取评分区间最大值，进行赋值操作
          if (scoreElement) {
            clearInterval(interval)
            scoreElement.value = Number(document.querySelector('#ntcmsg_popmenu table tr:nth-child(2) td:nth-child(3)').innerText.replace(/[^\d]/g, ''))
            document.querySelector('#ntcmsg_popmenu .pop_btn input[type=submit]').click()
          } else {
            attempts++
            if (attempts >= maxAttempts) {
              // 20秒还是检查不到元素，停止一键评分
              clearInterval(interval)
            }
          }
        }, 100)
      })
    }
  }
)
()
