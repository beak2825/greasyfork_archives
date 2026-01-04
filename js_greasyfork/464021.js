// ==UserScript==
// @name         禁用掘金标题动画
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  动画给他禁用！
// @author       You
// @match        https://juejin.cn/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464021/%E7%A6%81%E7%94%A8%E6%8E%98%E9%87%91%E6%A0%87%E9%A2%98%E5%8A%A8%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/464021/%E7%A6%81%E7%94%A8%E6%8E%98%E9%87%91%E6%A0%87%E9%A2%98%E5%8A%A8%E7%94%BB.meta.js
// ==/UserScript==

(function() {
  'use strict';
    const style = document.createElement('style');
    document.body.appendChild(style);
    style.innerText = `.article-content h3::after, .article-content h3::before { animation: null !important }`;
    style.innerText += `.markdown-body h3::after, .markdown-body h3::before { animation: null !important }; `;
})();
