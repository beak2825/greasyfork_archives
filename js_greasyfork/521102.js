// ==UserScript==
// @name         隐藏掘金手机号绑定弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制隐藏掘金手机号绑定弹窗
// @author       Your Name
// @match        https://juejin.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521102/%E9%9A%90%E8%97%8F%E6%8E%98%E9%87%91%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%BB%91%E5%AE%9A%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/521102/%E9%9A%90%E8%97%8F%E6%8E%98%E9%87%91%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%BB%91%E5%AE%9A%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        body {
            overflow: auto !important;
        }
        .global-component-box {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();