// ==UserScript==
// @name         极致净化知乎专栏页
// @namespace    https://evgo2017.com/purify-page
// @version      0.1.4
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457432/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457432/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%E9%A1%B5.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const maxRetryCount = 5; // 最大重试次数
 
    // 移除区域
    remove('顶部导航', `.ColumnPageHeader-Wrapper`)
    remove('悬浮点赞', `.RichContent-actions`)
    remove('推荐阅读', `.Recommendations-Main`)
    remove('登录弹窗', `.Modal-closeButton`, { remove: (dom) => dom.click() })
    remove('登录知乎，你可以享受以下权益', `.css-1hwwfws`)
    remove('登录即可查看超5亿专业优质内容', `.css-1ynzxqw`)
    remove('右侧广告', `.AdvertImg`)
    remove('悬浮评论', `.css-805ti0`)
    remove('底部专栏', `.PostIndex-Contributions`, { remove: (dom) => { dom.innerHTML = '' } })
 
    // 最大化阅读区域
    setTimeout(() => {
      $('#mainContent').style.minWidth = '100%'
      const mainArea = $(`.forFlow`)
      mainArea.style.width = '100%'
      // mainArea.style.marginLeft = '10px'
    }, 1000)
 
    // Helper
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