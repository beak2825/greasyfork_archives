// ==UserScript==
// @name         AA自律禁止访问 时间限制版
// @license MIT
// @namespace    http://your-namespace.com
// @version      1.40
// @description  Block specific websites with time restrictions
// @author       Your Name
// @match        https://www.youtube.com/*
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://cc.163.com/*
// @match        https://baidu.com/*
// @match        https://xxxxx528.com/*
// @match        https://www.gamer520.com/*
// @match        https://live.douyin.com/*
// @match        https://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477469/AA%E8%87%AA%E5%BE%8B%E7%A6%81%E6%AD%A2%E8%AE%BF%E9%97%AE%20%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/477469/AA%E8%87%AA%E5%BE%8B%E7%A6%81%E6%AD%A2%E8%AE%BF%E9%97%AE%20%E6%97%B6%E9%97%B4%E9%99%90%E5%88%B6%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var blockedSites = [
        'https://www.bilibili.com/',
        'https://www.youtube.com/',
        'https://www.youtube.com/results?search_query=%E8%A7%82%E7%82%B9',
        'https://www.youtube.com/results?search_query=%E5%B0%91%E5%BA%B7',
        'https://www.youtube.com/results?search_query=%E4%B8%AD%E5%A4%A9',
        'https://www.youtube.com/results?search_query=%E9%87%8E%E7%A4%BC',
        'https://www.youtube.com/results?search_query=%E6%96%B0%E9%97%BB%E5%A4%A7%E7%99%BD%E8%AF%9D',
        'https://www.youtube.com/results?search_query=%E7%8E%8B%E7%82%B3%E5%BF%A0',
        'https://www.youtube.com/results?search_query=%E6%9B%BE%E5%B0%8F%E5%A6%B9',
        'https://www.youtube.com/results?search_query=%E9%BB%84%E6%99%BA%E8%B4%A4',
        'https://www.youtube.com/results?search_query=%E9%A3%9E%E7%A2%9F',
        'https://www.youtube.com/results?search_query=%E6%96%B0%E9%97%BB',
        'https://www.youtube.com/results?search_query=%E6%9E%97%E6%98%8E%E6%AD%A3',
        'https://www.youtube.com/results?search_query=%E6%9F%AF%E6%96%87%E5%93%B2',
        'xxxxx528.com',
        'gamer520.com',
        'https://cc.163.com/',
        'https://www.bilibili.com/?spm_id_from=',
    ];

function isBlockedTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();

    // Define the time periods during which the script should be active
    var morningStart =  1; // 1:00 AM
    var morningEnd = 12;  // 12:40 PM
    var afternoonStart = 13; // 1:00 PM
    var afternoonEnd = 17; // 5:55 PM
    var eveningStart = 18; // 6:10 PM
    var eveningEnd = 24; // 12:00 PM

    // Check if the current time falls within any of the specified time ranges
    if ((hours > morningStart && hours < morningEnd) ||
        (hours === morningStart && minutes >= 0) ||
        (hours === morningEnd && minutes <= 40) ||
        (hours > afternoonStart && hours < afternoonEnd) ||
        (hours === afternoonStart && minutes >= 0) ||
        (hours === afternoonEnd && minutes <= 55) ||
        (hours > eveningStart && hours < eveningEnd) ||
        (hours === eveningStart && minutes >= 10) ||
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
