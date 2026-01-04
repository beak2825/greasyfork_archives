// ==UserScript==
// @name         极致净化 Segmentfault 问题页
// @namespace    https://evgo2017.com/purify-page
// @version      0.12
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://segmentfault.com/a/*
// @match        https://segmentfault.com/q/*
// @icon         https://static.segmentfault.com/main_site_next/698c8080/touch-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457433/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20Segmentfault%20%E9%97%AE%E9%A2%98%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457433/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20Segmentfault%20%E9%97%AE%E9%A2%98%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove('顶部导航', `#sf-header`, { repeat: true })
    remove('底部广告', `#OA_holder_2`)
    remove('悬浮点赞', `.functional-area-left`)
    remove('悬浮文章标题', `#article-header`, { repeat: true })
    remove('边栏信息', `#right-side-wrap`, { repeat: true, getDom: (dom) => dom ? dom.parentElement : null })
    remove('底部点赞', `.functional-area-bottom`, { repeat: true })
    remove('文章顶部专栏信息', `#followUser`, { repeat: true, getDom: (dom) => dom ? dom.parentElement : null })
    remove('底部推荐阅读', `#comment-area`, { repeat: true, getDom: (dom) => dom ? dom.parentElement.nextSibling : null })
    remove('底部推荐阅读', `#answer-question`, { repeat: true, getDom: (dom) => dom ? dom.nextSibling : null })
    remove('底部推荐问题', `.answer-area`, { repeat: true, getDom: (dom) => dom ? dom.nextSibling : null })
    remove('撰写回答，注册登录', `#answer-question`, { repeat: true })
    remove('底部导航', `#footer`, { repeat: true })

    // Helper
    function remove(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false, getDom: (dom) => dom }, userOption)
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