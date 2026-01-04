// ==UserScript==
// @name         Facebook Alt+Q 回首頁
// @version      1.2.0
// @description  Facebook Alt+Q 回首頁，適用於任何 Facebook 子網域，直接回到 Facebook 首頁。
// @namespace    haer0248
// @homepage     https://haer0248.me
// @author       猫又おにぎり
// @match        https://*.facebook.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374540/Facebook%20Alt%2BQ%20%E5%9B%9E%E9%A6%96%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/374540/Facebook%20Alt%2BQ%20%E5%9B%9E%E9%A6%96%E9%A0%81.meta.js
// ==/UserScript==

// 需要增加網址或變更請增加/更改上方的 @match <網址>

(function () {
    'use strict';
    document.onkeydown = function (event) {
        var e = event || window.event;
        if (e.keyCode == 81 && e.altKey) {
            location.href = 'https://www.facebook.com/';
        }
    }
})();