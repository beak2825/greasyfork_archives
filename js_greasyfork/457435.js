// ==UserScript==
// @name         极致净化百度经验页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://jingyan.baidu.com/article/*
// @icon         https://jingyan.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457435/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457435/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove("顶部导航", `header`)
    remove("顶部导航", `.nav`)
    remove("左侧推荐", `#wgt-left-promo`)
    remove("右侧导航", `#aside`)
    remove("广告视频", `.feeds-video-box`)
    remove("多少人看了广告视频", `.feeds-video-one-view`)
    remove("左侧点赞", `.wgt-like`);
    remove("右侧广告", `#task-panel-wrap`)
    remove("右侧辅助模式", `#wgt-barrier-free`)
    remove("右侧分享", `#wgt-exp-share`)
    remove("推荐文章 ", `.main-content-bottom`)
    remove("底部导航 ", `footer`)

    // Helper
    function remove(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false, getDom: (dom) => dom, }, userOption)
       const dom = option.getDom($(selector))
       if (dom) {
          dom.remove()
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