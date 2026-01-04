// ==UserScript==
// @name         Automatic Button Clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click a button when it appears every 10 minutes
// @author       Your Virtual Assistant
// @match        https://public.sqrx.com/display/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487816/Automatic%20Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/487816/Automatic%20Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本已经运行，等待页面加载.');

    // 当页面加载完毕时执行函数
    window.addEventListener('load', function() {
        console.log('页面已加载.');

        function checkAndClickButton() {
            var extendButton = document.getElementById('db-time-ext-btn');
            if (extendButton) {
                console.log('找到按钮: ', extendButton);

                if (extendButton.offsetWidth > 0 || extendButton.offsetHeight > 0) {
                    console.log('按钮是可见的，正在点击它...');
                    extendButton.click();
                } else {
                    console.log('按钮不可见.');
                }
            } else {
                console.log('没有找到按钮.');
            }
        }

        // 以120秒为周期检查按钮
        setInterval(checkAndClickButton, 120000);
    });
})();