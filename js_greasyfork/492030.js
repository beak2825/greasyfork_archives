// ==UserScript==
// @name         refactoringguruMarginChanger
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Change HTML Margin!
// @author       EddyLee88
// @match        *://*.refactoringguru.cn/*
// @match        *://refactoringguru.cn/*
// @icon         https://refactoringguru.cn/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492030/refactoringguruMarginChanger.user.js
// @updateURL https://update.greasyfork.org/scripts/492030/refactoringguruMarginChanger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取指定元素
    var element1 = document.querySelector('body.announcement .body-holder');
    var element2 = document.querySelector('body.announcement .navigation');
    var element3 = document.querySelector('body.announcement .main-menu');
    // 修改margin
    if (element1) {
        element1.style.marginTop = 0;
        console.log(".body-holder done");
    }
    if (element2) {
        element2.style.top = 0;
        console.log(".navigation done");
    }
    if (element3) {
        element3.style.top = 0;
        console.log(".main-menu done");
    }
})();
