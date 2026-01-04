// ==UserScript==
// @name         福万通自动下一节
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  clickNextButton every 10 seconds
// @author       azhua
// @grant        none
// @match        *://fjnx.21tb.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469635/%E7%A6%8F%E4%B8%87%E9%80%9A%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/469635/%E7%A6%8F%E4%B8%87%E9%80%9A%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function clickNextButton() {
       const button = document.querySelector('.next-button');
        if (button) {
            console.log('找到 class 为 next-button 的元素, 进行点击');
            button.click();
        } else {
            console.log('未找到 class 为 next-button 的元素');
        }


        setTimeout(clickNextButton, 10000);

    }

    clickNextButton();
})();