// ==UserScript==
// @name         虎牙隐藏评分面板
// @namespace    https://greasyfork.org/zh-CN/scripts/544503
// @version      1.0
// @description  隐藏烦人的评分面板
// @author       monat151
// @match        http*://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544503/%E8%99%8E%E7%89%99%E9%9A%90%E8%97%8F%E8%AF%84%E5%88%86%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/544503/%E8%99%8E%E7%89%99%E9%9A%90%E8%97%8F%E8%AF%84%E5%88%86%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

GM_addStyle(`
    .match-score-popup {
        display: none !important;
    }
`)

(function() {
    'use strict';
})();