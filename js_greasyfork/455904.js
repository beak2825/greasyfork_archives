// ==UserScript==
// @name         去除bilibili网页端首页灰色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于去除bilibili网页端首页灰色，部分图片（如banner图和轮播图）本身就是灰度图，无法恢复彩色
// @author       You
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455904/%E5%8E%BB%E9%99%A4bilibili%E7%BD%91%E9%A1%B5%E7%AB%AF%E9%A6%96%E9%A1%B5%E7%81%B0%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455904/%E5%8E%BB%E9%99%A4bilibili%E7%BD%91%E9%A1%B5%E7%AB%AF%E9%A6%96%E9%A1%B5%E7%81%B0%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.documentElement.setAttribute('class',document.documentElement.getAttribute('class').replace('gray',''))
})();