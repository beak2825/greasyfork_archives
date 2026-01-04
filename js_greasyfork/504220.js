// ==UserScript==
// @name         物语云样式调整
// @namespace    https://bingzi.online
// @version      2024-08-19
// @description  对物语云管理页面样式进行微调
// @author       BingZi-233
// @match        https://www.wuyuidc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuyuidc.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504220/%E7%89%A9%E8%AF%AD%E4%BA%91%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/504220/%E7%89%A9%E8%AF%AD%E4%BA%91%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        .el-main {
            padding-top: 1.0rem !important;
            padding-left: 0.50rem !important;
            padding-right: 0.50rem !important;
        }
    `);
})();