// ==UserScript==
// @name         Remove React HMR iframe
// @namespace    http://tampermonkey.net/
// @version      2024-04-15
// @description  删除React热更新时产生页面遮罩iframe
// @author       djzhao
// @match        http://localhost/*
// @match        https://localhost/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492561/Remove%20React%20HMR%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/492561/Remove%20React%20HMR%20iframe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个样式元素
    var css = document.createElement('style');
    css.type = 'text/css';

    //  CSS 规则
    css.innerHTML = `
        body > iframe[style*="2147483647"]:not([id="webpack-dev-server-client-overlay"]) {
            display: none;
        }
    `;

    // 将样式元素添加到页面头部
    document.head.appendChild(css);
})();
