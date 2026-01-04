// ==UserScript==
// @name         修复知乎加载图片
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  用于处理知乎图片加载失败，但从浏览器打开图片地址能正常加载问题
// @author       此夏非夏
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473150/%E4%BF%AE%E5%A4%8D%E7%9F%A5%E4%B9%8E%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/473150/%E4%BF%AE%E5%A4%8D%E7%9F%A5%E4%B9%8E%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面上所有的 img 标签
    const imgTags = document.querySelectorAll('img');

    // 遍历每个 img 标签并设置 referrerpolicy 属性
   imgTags.forEach(imgTag => {
      imgTag.setAttribute('referrerpolicy', 'no-referrer');
   });
})();