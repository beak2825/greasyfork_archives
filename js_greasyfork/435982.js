// ==UserScript==
// @name         cppreference自动跳转到中文版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从搜索引擎等进入cppreference后, 自动跳转到中文版
// @license MIT
// @author       ivytin
// @match        https://en.cppreference.com/*
// @icon         https://www.google.com/s2/favicons?domain=cppreference.com
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/435982/cppreference%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/435982/cppreference%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E4%B8%AD%E6%96%87%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.referrer.length > 0) {
        // 只有从外部进去才跳转, 手动切到en不跳转
        if (document.referrer.indexOf("cppreference") == -1) {
            // https://en.cppreference.com/
            var url_args = location.href.slice(10);
            location.href = "https://zh" + url_args;
        }
    }
})();