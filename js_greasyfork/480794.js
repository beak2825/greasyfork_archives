// ==UserScript==
// @name         AA自律禁止涩涩 时间限制版
// @license MIT
// @namespace    http://your-namespace.com
// @version      1.1
// @description  Block specific websites with time restrictions
// @author       Your Name
// @match        https://supjav.com/*
// @match        https://avbebe.com/*
// @match        https://missav.com/*
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @match        https://cc.163.com/*
// @match        https://baidu.com/*
// @match        https://xxxxx528.com/*
// @match        https://www.gamer520.com/*
// @match        https://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480794/AA%E8%87%AA%E5%BE%8B%E7%A6%81%E6%AD%A2%E6%B6%A9%E6%B6%A9%20%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/480794/AA%E8%87%AA%E5%BE%8B%E7%A6%81%E6%AD%A2%E6%B6%A9%E6%B6%A9%20%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var blockedSites = [
        'supjav.com',
        'missav.com',
        'avbebe.com',
    ];

    function isBlockedTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();

        // Define the time periods during which the script should be active
        var morningStart =  1; // 1:00 AM
        var morningEnd = 12;  // 12:59 PM
        var afternoonStart = 13; // 1:00 PM
        var afternoonEnd = 17; // 5:59 PM
        var eveningStart = 18; // 6:00 PM
        var eveningEnd = 24; // 12:00 PM

        // Check if the current time falls within any of the specified time ranges
        if ((hours > morningStart && hours < morningEnd) ||
            (hours === morningStart && minutes >= 0) ||
            (hours === morningEnd && minutes <= 59) ||
            (hours > afternoonStart && hours < afternoonEnd) ||
            (hours === afternoonStart && minutes >= 0) ||
            (hours === afternoonEnd && minutes <= 59) ||
            (hours > eveningStart && hours < eveningEnd) ||
            (hours === eveningStart && minutes >= 0) ||
            (hours === eveningEnd && minutes === 0)) {
            return true;
        }

        return false;
    }

    function blockSites() {
        var currentURL = window.location.href;

        for (var i = 0; i < blockedSites.length; i++) {
            if (currentURL.includes(blockedSites[i]) && isBlockedTime()) {
                document.documentElement.style.backgroundColor = '#000';
                document.documentElement.innerHTML = '';
                return;
            }
        }
    }


    // Block sites when the page loads
    blockSites();

    // Monitor for navigation changes and block sites accordingly
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                blockSites();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
