// ==UserScript==
// @name         🥇智慧树网复制粘贴限制解除
// @version      3.0
// @description  🏆解除智慧树网复制粘贴限制，随意复制✅随意粘贴✅
// @author       Zhong
// @match        *://*.zhihuishu.com/*
// @icon         https://qah5.zhihuishu.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1080809
// @downloadURL https://update.greasyfork.org/scripts/466546/%F0%9F%A5%87%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/466546/%F0%9F%A5%87%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        // Set a timeout to run the functions after 10 seconds
        setTimeout(function () {
            // Override the document.getSelection method
            document.getSelection = function () {
                return {
                    removeAllRanges: function () {
                        // Do nothing or handle the function differently
                    }
                };
            };

            // Enable text selection and context menu actions
            // Allow text selection
            document.onselectstart = true;
            // Allow copy, cut, paste, and right-click menu actions
            document.oncopy = true;
            document.oncut = true;
            document.onpaste = true;
            document.oncontextmenu = true;
        }, 3000);

        // save original setInterval
        const originalSetInterval = window.setInterval;

        // define new setInterval
        window.setInterval = function (callback, delay) {
            const newDelay = delay * 10000; // 将间隔延长为原来的 10000 倍
            return originalSetInterval(callback, newDelay);
        };
    };
})();