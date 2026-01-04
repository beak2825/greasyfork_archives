// ==UserScript==
// @name         修改pixeldrain网页样式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改指定CSS样式
// @author       as176590811
// @match        https://pixeldrain.com/*
// @grant        GM_addStyle
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/523795/%E4%BF%AE%E6%94%B9pixeldrain%E7%BD%91%E9%A1%B5%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523795/%E4%BF%AE%E6%94%B9pixeldrain%E7%BD%91%E9%A1%B5%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通过动态注入 CSS 修改样式
    GM_addStyle(`
        .file_selected.svelte-xbrph3.svelte-xbrph3 {
            border-color: red !important; /* 边框颜色修改为红色 */
            border-width: 3px !important; /* 边框加粗 */
            border-style: solid !important; /* 确保边框样式为实线 */
        }
    `);
})();
