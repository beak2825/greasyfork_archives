// ==UserScript==
// @name         护眼版掘金
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  护眼版掘金（杏木色）
// @author       me
// @match        https://*.juejin.cn/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540584/%E6%8A%A4%E7%9C%BC%E7%89%88%E6%8E%98%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/540584/%E6%8A%A4%E7%9C%BC%E7%89%88%E6%8E%98%E9%87%91.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function overrideStyle() {
        const style = document.createElement('style');
        style.textContent = `body, .light-theme {
        --juejin-font-1: #2e2e2e8c !important;
        --juejin-layer-1: rgb(250 249 222) !important;
        --juejin-background: #696861 !important;
        --juejin-gray-2: #efd78363;
        --juejin-brand-5-light: #e3e3e3;
        }`;
        document.head.appendChild(style);
    }

    if (document.readyState !== 'loading') {
        overrideStyle();
    } else {
        document.addEventListener('DOMContentLoaded', overrideStyle);
    }
})();
