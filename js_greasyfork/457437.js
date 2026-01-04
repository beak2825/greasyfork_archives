// ==UserScript==
// @name         极致净化百度知道页
// @namespace    https://evgo2017.com/purify-page
// @version      0.1
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://zhidao.baidu.com/question/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457437/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457437/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove("顶部导航", `.head-wrap`)
    remove("顶部导航", `#j-nav-menu-container`)
    remove("右侧导航", `aside`)
    remove("右上角导航", `#userbar`)
    remove("我来答 - 红包", `#answer-bar`, { getDom: (dom) => { if (dom) { dom.classList.remove(`exp-answerbtn-yh`) } }})
    remove("热议", `.question-number-text-chain`)
    remove("列表广告", `.wgt-ads`)
    remove("申请认证", `.jump-top-box`)
    remove("赚礼品换积分", `.task-list-button`)
    remove("辅助模式", `.aria-div`)
    remove("您可能知道的内容", `#qbleftdown-container`)
    remove("其它类似问题", `#wgt-related`)
    remove("为你推荐", `.wgt-union-bottom`)
    remove("底部导航", `.wgt-footer-new`)

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