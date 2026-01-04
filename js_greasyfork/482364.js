// ==UserScript==
// @name         雪球网页宽屏
// @namespace    http://tampermonkey.net/
// @version      2023-12-16
// @description  雪球网页适配宽屏4K显示器
// @author       Damaike
// @match        https://xueqiu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueqiu.com
// @grant        GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482364/%E9%9B%AA%E7%90%83%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/482364/%E9%9B%AA%E7%90%83%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle(".article__container {   width: 960px; }  .user__container {   width: 1550px; }  .user__col--middle {   width: 1040px; }  .container, .container-md {   width: 1360px; }  .profiles__main {   width: 1040px; } ");
})();