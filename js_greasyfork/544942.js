// ==UserScript==
// @name         manhuagui 手機版跳轉電腦版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  手機版跳轉電腦版
// @author       You
// @match        https://m.manhuagui.com/*
// @match        https://tw.manhuagui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544942/manhuagui%20%E6%89%8B%E6%A9%9F%E7%89%88%E8%B7%B3%E8%BD%89%E9%9B%BB%E8%85%A6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544942/manhuagui%20%E6%89%8B%E6%A9%9F%E7%89%88%E8%B7%B3%E8%BD%89%E9%9B%BB%E8%85%A6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
                document.location.host = "www.manhuagui.com/";
            }, 500);
    // Your code here...
})();