// ==UserScript==
// @name         知乎隐藏顶部的大标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎隐藏顶部的大标题(鼠标放上去可显示)
// @author       chikan
// @match        *.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438781/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E9%A1%B6%E9%83%A8%E7%9A%84%E5%A4%A7%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/438781/%E7%9F%A5%E4%B9%8E%E9%9A%90%E8%97%8F%E9%A1%B6%E9%83%A8%E7%9A%84%E5%A4%A7%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var AppHeader = document.getElementsByClassName("AppHeader")[0];
    AppHeader.style.opacity = 0;
    AppHeader.addEventListener("mouseover", function () {
        AppHeader.style.opacity = 1;
    })
    AppHeader.addEventListener("mouseout", function () {
        AppHeader.style.opacity = 0;
    })


    // Your code here...
})();