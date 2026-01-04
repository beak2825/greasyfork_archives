// ==UserScript==
// @name         页面加边框
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  wen
// @author       You
// @match        *:///*:/*/*
// @include      https://*/*
// @include      http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        wen
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433314/%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BE%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/433314/%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BE%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
javascript: (function () {
    if (typeof hasOutline == "undefined") window.hasOutline = false;
    document.querySelectorAll("*").forEach(item => {
        item.style.outline = window.hasOutline ? "none" : "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16);  });
    window.hasOutline = !window.hasOutline;})();
    // Your code here...
})();