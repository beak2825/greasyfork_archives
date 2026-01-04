// ==UserScript==
// @name         autologin
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically clicks a button on the page after it loads.
// @author       Your Name
// @match        https://login.dingtalk.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491070/autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/491070/autologin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 延迟1000毫秒后执行点击操作
        setTimeout(function() {
            // 查找具有特定类名的按钮
            var button = document.querySelector('.module-confirm-button');

            // 如果找到了按钮，就执行点击
            if (button) {
                button.click();
            }
       }, 1000);  // 设置1000毫秒的延时
    }, false);
})();