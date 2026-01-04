// ==UserScript==
// @name         极致净化百度贴吧页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11
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

    // 移除区域
    remove("左侧广告", `.j_click_close`, { getDom: (dom) => { if (dom) { dom.parentElement.remove() } } })
    remove("右侧导航", `.right_section`)
    remove("右侧分享", `.tbui_aside`)
    remove("右侧分享", `.tbui_aside_float_bar`)

    Array.from(document.querySelector(`#j_p_postlist`).children).forEach(i => {
        if (i.tagName == 'DIV' && i.classList.contains('l_post')) {
            if (i.getAttribute('data-field') == "{}") {
              i.remove();
            }
        } else {
            i.remove();
        }
    })

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