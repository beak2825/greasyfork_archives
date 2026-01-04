// ==UserScript==
// @name         Max font size 15px
// @namespace    http://tampermonkey.net/
// @version      2025-06-28-2
// @description  set chiphell max font 14px
// @author       fengqi
// @match        *://www.chiphell.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chiphell.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541000/Max%20font%20size%2015px.user.js
// @updateURL https://update.greasyfork.org/scripts/541000/Max%20font%20size%2015px.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 GM_addStyle 来添加 CSS 规则
    // 这会选中 .pct 元素内的 .pcb 元素，并将其下所有子元素 (*) 的字体大小设置为 14px
    // !important 用于确保此规则覆盖其他样式
    GM_addStyle(`
        .pct .pcb * {
            font-size: 15px !important;
            font-weight: normal !important;
        }
    `);
})();
