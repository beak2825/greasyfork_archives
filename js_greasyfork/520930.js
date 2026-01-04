// ==UserScript==
// @name         隐藏纳米搜索背景水印
// @namespace    https://zscc.in
// @version      0.1
// @description  隐藏n.cn纳米搜索背景水印
// @author       船长zscc.in
// @match        https://*.n.cn/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520930/%E9%9A%90%E8%97%8F%E7%BA%B3%E7%B1%B3%E6%90%9C%E7%B4%A2%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520930/%E9%9A%90%E8%97%8F%E7%BA%B3%E7%B1%B3%E6%90%9C%E7%B4%A2%E8%83%8C%E6%99%AF%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //  使用 CSS 隐藏
    GM_addStyle(`
        div[style*="z-index: 99"][style*="position: absolute"][style*="pointer-events: none"][style*="background-repeat: repeat"] {
            display: none !important;
            visibility: hidden !important;
        }
    `);
})();
