// ==UserScript==
// @name        KKTV 隱藏浮水印
// @namespace   https://github.com/jimmyorz
// @description 移除 KKTV 影片上的浮水印，移植自mickey87910@github
// @version     1.1
// @author      jimmyorz
// @match       https://www.kktv.me/*
// @match       https://kktv.me/*
// @connect     kktv.me
// @icon        https://www.kktv.me/static/images/favicon.ico
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534594/KKTV%20%E9%9A%B1%E8%97%8F%E6%B5%AE%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/534594/KKTV%20%E9%9A%B1%E8%97%8F%E6%B5%AE%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加入隱藏浮水印的 CSS
    GM_addStyle(`
        .player__logo {
            display: none !important;
        }
    `);
})();