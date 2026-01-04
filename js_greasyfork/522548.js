// ==UserScript==
// @name         Discord 字體更改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更改 Discord 網頁版的字體
// @author       Weiren
// @match        https://discord.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522548/Discord%20%E5%AD%97%E9%AB%94%E6%9B%B4%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/522548/Discord%20%E5%AD%97%E9%AB%94%E6%9B%B4%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap'); /* 替換為你想要的字體 */
        * {
            font-family: 'Roboto', sans-serif !important;
        }
    `);
})();