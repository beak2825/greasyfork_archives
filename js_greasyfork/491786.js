// ==UserScript==
// @name         8591 15秒刷新並禁止頁面休眠
// @name:zh-TW   8591 15秒刷新並禁止頁面休眠
// @name:zh-CN   8591 15秒刷新并禁止页面休眠
// @name:en      8591 Automatically refreshes
// @namespace    https://www.youtube.com/c/ScottDoha
// @version      1.3
// @description 15秒刷新並禁止頁面休眠
// @description:zh-cn 15秒刷新并禁止页面休眠
// @description:en  Automatically refreshes the page every 15 seconds and prevents the page from entering sleep mode.
// @author       Scott
// @match        *://www.8591.com.tw/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/491786/8591%2015%E7%A7%92%E5%88%B7%E6%96%B0%E4%B8%A6%E7%A6%81%E6%AD%A2%E9%A0%81%E9%9D%A2%E4%BC%91%E7%9C%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/491786/8591%2015%E7%A7%92%E5%88%B7%E6%96%B0%E4%B8%A6%E7%A6%81%E6%AD%A2%E9%A0%81%E9%9D%A2%E4%BC%91%E7%9C%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Refresh interval in milliseconds (15 seconds)
    const refreshInterval = 15000;

    // Function to reload the page
    function reloadPage() {
        location.reload();
    }

    // Function to prevent the page from entering sleep mode
    function preventSleep() {
        if (document.visibilityState === 'visible') {
            const preventSleepFrame = document.createElement('iframe');
            preventSleepFrame.style.width = '0';
            preventSleepFrame.style.height = '0';
            preventSleepFrame.style.border = 'none';
            document.body.appendChild(preventSleepFrame);
        }
    }

    // Reload the page every refreshInterval milliseconds
    setInterval(reloadPage, refreshInterval);

    // Prevent the page from entering sleep mode
    setInterval(preventSleep, 5000); // Execute every 5 seconds
})();