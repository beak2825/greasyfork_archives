// ==UserScript==
// @name         极致净化知乎问题页
// @namespace    https://evgo2017.com/purify-page
// @version      0.1
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://www.zhihu.com/question/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457431/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457431/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove('上方话题推荐', `.css-wcswpi`)
    remove('登录后你可以', `.Question-mainColumnLogin`)
    remove('右侧导航', `.Question-sideColumn`)
    removes('悬浮点赞', `.Pc-word`)
    remove('登录弹窗', `.Modal-closeButton`, { repeat: true, remove: (dom) => dom.click() })
    remove('登录知乎，你可以享受以下权益', `.css-1hwwfws`)
    remove('登录即可查看超5亿专业优质内容', `.css-1ynzxqw`, { repeat: true })

    // 最大化阅读区域
    setTimeout(() => {
      $('.Question-mainColumn').style.minWidth = '1000px'

      const style = document.createElement('style')
      style.innerHTML = `.AnswerItem-authorInfo{ max-width: 100% }`
      $('head').appendChild(style);
    }, 1000)

    // Helper
    function removes(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false }, userOption)
       const doms = document.querySelectorAll(selector)
       if (doms.length > 0) {
          for (let i = 0, len = doms.length; i < len; i++) {
              doms[i].remove()
              console.log(`${label}，%c已移除%c。（第 ${count} 次处理）`, "color: red; font-weight: bold", "color: black")
          }
          if (option.repeat) {
            setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
          }
       } else {
         if (count < maxRetryCount) {
           console.log(`${label}，未找到。（第 ${count} 次处理）`)
           setTimeout(() => { removes(label, selector, option, count + 1) }, 1000)
         } else {
           console.log(`${label}，%c停止查找%c。（第 ${count} 次处理）`, "color: orange; font-weight: bold", "color: black")
         }
       }
    }
    function remove(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false, getDom: (dom) => dom, remove: (dom) => dom.remove() }, userOption)
       const dom = option.getDom($(selector))
       if (dom) {
          option.remove(dom)
          console.log(`${label}，%c已移除%c。（第 ${count} 次处理）`, "color: red; font-weight: bold", "color: black")
          if (option.repeat) {
            setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
          }
       } else {
         if (count < maxRetryCount) {
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