// ==UserScript==
// @name         极致净化百度百科页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://baike.baidu.com/*
// @icon         https://baike.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457436/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457436/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove("顶部导航", `.header`)
    remove("顶部导航", `.navbar-wrapper`)
    remove("顶部导航", `.header-wrapper`)
    remove("顶部悬浮导航", `.lemmaWgt-searchHeader`)
    remove("右侧导航", `.side-content`)
    remove("右侧广告", `.right-ad`)
    remove("右侧分享", `.new-bdsharebuttonbox`)
    remove("搜索发现", `.after-content`)
    remove("搜索发现", `#J-wgt-footer-main`, { getDom: (dom) => { if (dom) { dom.innerHTML = '' } } })

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