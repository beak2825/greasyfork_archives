// ==UserScript==
// @name         Gitee去除小红点
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  小红点很讨厌！
// @author       SparkZhang
// @license      MIT
// @match        https://gitee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitee.com
// @grant        GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/545938/Gitee%E5%8E%BB%E9%99%A4%E5%B0%8F%E7%BA%A2%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/545938/Gitee%E5%8E%BB%E9%99%A4%E5%B0%8F%E7%BA%A2%E7%82%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var selectors = [
        ".setting-text.red-dot::after",
    ];
    hideRedDots();

    function hideRedDots() {
        selectors.forEach(selector => {
            GM_addStyle(`${selector} {content: none;}`);
        })
    }
})();