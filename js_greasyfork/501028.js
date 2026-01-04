// ==UserScript==
// @name         调整阅读更多容器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除class为page-sidebar的元素,并将id为readmore-container的元素高度设置为默认
// @match        https://programmercarl.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501028/%E8%B0%83%E6%95%B4%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%E5%AE%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501028/%E8%B0%83%E6%95%B4%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%E5%AE%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的样式元素
    const style = document.createElement('style');
    style.textContent = `
        .content__default {
            height: auto !important;
        }
    `;
    document.head.appendChild(style);

    // 删除class为page-sidebar的元素
  const sidebars = document.querySelectorAll('.page-sidebar');
  for (const sidebar of sidebars) {
    sidebar.parentNode.removeChild(sidebar);
  }

    // 将id为readmore-container的元素高度设置为默认
    const readmoreContainer = document.getElementById('readmore-container');
    if (readmoreContainer) {
        readmoreContainer.classList.add('auto-height');
    }
})();