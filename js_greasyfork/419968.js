// ==UserScript==
// @name         V2EX自动更多时间轴
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419968/V2EX%E8%87%AA%E5%8A%A8%E6%9B%B4%E5%A4%9A%E6%97%B6%E9%97%B4%E8%BD%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/419968/V2EX%E8%87%AA%E5%8A%A8%E6%9B%B4%E5%A4%9A%E6%97%B6%E9%97%B4%E8%BD%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let tops = document.getElementsByClassName("top");
    for (let top of tops) {
        if (top.href == "https://www.v2ex.com/t") {
            top.href = "/t/home/more";
        }
    }
})();