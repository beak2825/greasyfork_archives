// ==UserScript==
// @name         Firefox隐藏B站动态水平列表滚动条
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Firefox隐藏B站动态up主水平列表的滚动条
// @author       YourName
// @match        https://t.bilibili.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528948/Firefox%E9%9A%90%E8%97%8FB%E7%AB%99%E5%8A%A8%E6%80%81%E6%B0%B4%E5%B9%B3%E5%88%97%E8%A1%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/528948/Firefox%E9%9A%90%E8%97%8FB%E7%AB%99%E5%8A%A8%E6%80%81%E6%B0%B4%E5%B9%B3%E5%88%97%E8%A1%A8%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .bili-dyn-up-list__window {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
        }

        .bili-dyn-up-list__window::-webkit-scrollbar {
            display: none !important;
        }
    `);
})();