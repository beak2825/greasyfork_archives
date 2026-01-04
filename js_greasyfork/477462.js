// ==UserScript==
// @name         123网盘去广告
// @namespace    none
// @version      1.0.0
// @description  简单的把123网盘的头部广告和文件栏广告给去掉
// @author       gogofishman
// @license      MIT
// @match        *://*.123pan.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477462/123%E7%BD%91%E7%9B%98%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/477462/123%E7%BD%91%E7%9B%98%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle(`
        .ant-layout >div[class="ant-carousel"] {
            display: none;
        }

        div[class="advBanner"] {
            display: none !important;
        }
    `);
})();