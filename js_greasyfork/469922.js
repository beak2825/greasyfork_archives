// ==UserScript==
// @name         Auto Refresh Page with Random Interval
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically refreshes the page at a random interval between 8 and 15 seconds.
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469922/Auto%20Refresh%20Page%20with%20Random%20Interval.user.js
// @updateURL https://update.greasyfork.org/scripts/469922/Auto%20Refresh%20Page%20with%20Random%20Interval.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var refreshCount = parseInt(localStorage.getItem('refreshCount'));
    if (isNaN(refreshCount) || refreshCount < 1) {
        refreshCount = parseInt(prompt("请输入循环次数："));
        if (isNaN(refreshCount) || refreshCount < 1) {
            alert("请输入一个大于等于1的有效数字！");
            return;
        }
        localStorage.setItem('refreshCount', refreshCount);
    }
     var currentRefresh = parseInt(localStorage.getItem('currentRefresh')) || 0;
    if (currentRefresh >= refreshCount) {
        clearInterval(refreshTimer);
        return;
    }
     // Generate a random refresh interval between 8 and 15 seconds
    var minInterval = 8000; // 8 seconds (in milliseconds)
    var maxInterval = 15000; // 15 seconds (in milliseconds)
    var refreshInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
     // Timer to refresh the page
    setTimeout(function() {
        location.reload();
    }, refreshInterval);
     // Timer to stop refreshing after specified count
    var refreshTimer = setInterval(function() {
        currentRefresh++;
        localStorage.setItem('currentRefresh', currentRefresh);
        if (currentRefresh >= refreshCount) {
            clearInterval(refreshTimer);
        }
    }, refreshInterval);
})();