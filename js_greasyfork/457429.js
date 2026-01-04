// ==UserScript==
// @name         极致净化 CNBlog 博客园文章页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://www.cnblogs.com/*/p/*
// @match        https://www.cnblogs.com/*/articles/*
// @match        https://www.cnblogs.com/*/archive/*
// @icon         https://common.cnblogs.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457429/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20CNBlog%20%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457429/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20CNBlog%20%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%96%87%E7%AB%A0%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove('顶部导航栏', `#top_nav`)
    remove('好文要顶、关注我、收藏该文、文章分享', `#blog_post_info`)
    remove('下方广告', `#cnblogs_ch`)
    remove('发表评论', `#comment_form_container`)
    remove('编辑推荐', `#under_post_card1`)
    remove('阅读排行', `#under_post_card2`)
    remove('分类、上一篇下一篇', `#blog_post_info_block`)
    remove('页面底部', `#footer`)
    remove('悬浮推荐、反对', `#div_digg`)
    remove('返回到顶部', `#back-to-top`)

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