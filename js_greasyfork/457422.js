// ==UserScript==
// @name         极致净化稀土掘金文章页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11.3
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @match        https://juejin.cn/post/*
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/apple-touch-icon.png
// @license      GNU GPLv2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457422/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457422/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E9%A1%B5.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const maxRetryCount = 10; // 最大重试次数

    switch (window.location.hostname) {
      case 'juejin.cn': {
        console.log('匹配到 掘金 页面')
        remove("顶部导航条", `#juejin > div.view-container > div.main-header-box`)
        remove("右侧作者信息", `.author-block`)
        remove("右侧精选内容", `.sidebar-block `)
        remove("右侧广告", `.ad-container `)
        remove("下方相关推荐", `.recommended-area`)
        remove("回到顶部", `.suspension-panel`)
        remove("登录掘金领取礼包", `.bottom-login-guide`)
        remove("相关推荐", `#sidebar-container > div:nth-child(2) > div:nth-child(2)`)
        remove("精选内容", `#sidebar-container > div:nth-child(2) > div:nth-child(3)`)
        remove("相关推荐", `#sidebar-container > div:nth-child(2) > div:nth-child(4))`)
        remove("找对属于你的技术圈子", `#sidebar-container > div.sidebar-block.wechat-sidebar-block.pure.wechat-ad`)
        break;
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