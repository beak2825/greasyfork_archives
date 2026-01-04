// ==UserScript==
// @name         B站去adblock插件提示
// @namespace    https://github.com/marioplus/bilibili-adblock-tips-remover
// @version      1.0.0
// @description  B站去掉顶上adblock插件提示
// @author       marioplus
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495878/B%E7%AB%99%E5%8E%BBadblock%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495878/B%E7%AB%99%E5%8E%BBadblock%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';
    GM_addStyle(`
    .adblock-tips {
        display: none !important;
    }
    `);
})();