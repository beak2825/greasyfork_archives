// ==UserScript==
// @name         全国新书目平台 去除禁止选择 User-select-enable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the user-select:none
// @author       mit
// @match        https://cnpub.com.cn/search.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnpub.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472323/%E5%85%A8%E5%9B%BD%E6%96%B0%E4%B9%A6%E7%9B%AE%E5%B9%B3%E5%8F%B0%20%E5%8E%BB%E9%99%A4%E7%A6%81%E6%AD%A2%E9%80%89%E6%8B%A9%20User-select-enable.user.js
// @updateURL https://update.greasyfork.org/scripts/472323/%E5%85%A8%E5%9B%BD%E6%96%B0%E4%B9%A6%E7%9B%AE%E5%B9%B3%E5%8F%B0%20%E5%8E%BB%E9%99%A4%E7%A6%81%E6%AD%A2%E9%80%89%E6%8B%A9%20User-select-enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '*, ::after, ::before { user-select: text !important; }';
    document.head.appendChild(style);
})();