// ==UserScript==
// @name         极致净化百度贴吧页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11.3
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容。同时优化删除了回帖内的隐藏广告。
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457438/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457438/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%A1%B5.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const maxRetryCount = 5; // 最大重试次数

    switch (window.location.hostname) {
      case 'tieba.baidu.com': {
        console.log('匹配到 百度贴吧 页面')
       
        remove('登录弹窗', `#tiebaCustomPassLogin > div.tieba-login-wrapper > span`, { isClick: true, isRepeat: true })
        remove('登录弹窗', `.custom-ad-container`)
        remove("右侧贴吧热议榜", `.topic_list_box`)

        // 移除帖子之间的广告
        Array.from(document.querySelector(`#j_p_postlist`).children).forEach(i => {
            if (i.tagName == 'DIV' && i.classList.contains('l_post')) {
                if (i.getAttribute('data-field') == "{}") {
                  i.remove();
                }
            } else {
                i.remove();
            }
        })
        break
      }
    }
 
    // Helper
    function remove(label, selector, option, count = 1) {
       const dom = document.querySelector(selector)
       if (dom) {
          option = Object.assign({ isClick: false, isRemove: false, isRepeat: false }, option)
          if (option.isClick) {
            dom.click()
          } else if (option.isRemove) {
            dom.remove()
          } else {
            dom.style.display = 'none'
          }
          if (option.isRepeat && count <= maxRetryCount) {
           setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
          }
          console.log(`${label}，%c已移除%c。（第 ${count} 次处理）`, "color: red; font-weight: bold", "color: black")
       } else {
         if (count <= maxRetryCount) {
           console.log(`${label}，未找到。（第 ${count} 次处理）`)
           setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
         } else {
           console.log(`${label}，%c停止查找%c。（第 ${count} 次处理）`, "color: orange; font-weight: bold", "color: black")
         }
       }
    }

    function $ (selector) {
        return document.querySelector(selector)
    }
})();