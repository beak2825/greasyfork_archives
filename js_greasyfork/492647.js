// ==UserScript==
// @name         允许番茄小说正文文本选择
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  解除番茄小说正文禁止文本选择的限制
// @author       Gorry
// @match        https://fanqienovel.com/reader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanqienovel.com
// @grant        GM_addStyle
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/492647/%E5%85%81%E8%AE%B8%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E6%AD%A3%E6%96%87%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/492647/%E5%85%81%E8%AE%B8%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E6%AD%A3%E6%96%87%E6%96%87%E6%9C%AC%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let css = `
        body,.noselect {
            -webkit-touch-callout: auto;
            -webkit-user-select: auto;
            -khtml-user-select: auto;
            -moz-user-select: auto;
            -ms-user-select: auto;
            user-select: auto;
        }
    `;
    GM_addStyle(css);

})();