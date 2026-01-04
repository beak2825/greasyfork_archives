// ==UserScript==
// @name         Synology Hide Notification
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Synology Hide Notification 《The default account "admin" is vulnerable to brute-force attacks, which may lead to ransomware attacks. 》
// @author       You
// @match        http://192.168.1.1:5000/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/480699/Synology%20Hide%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/480699/Synology%20Hide%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义计数器
    var iterationCount = 0;

    // 定义定时器
    var hideElementsInterval = setInterval(function() {
        // 获取所有带有.v-notification-container类的元素
        var elements = document.querySelectorAll('.v-notification-container');

        // 遍历元素并隐藏它们
        elements.forEach(function(element) {
            element.style.display = 'none';
        });

        // 增加计数器
        iterationCount++;

        // 检查是否达到100次循环
        if (iterationCount >= 100) {
            // 达到指定次数后清除定时器
            clearInterval(hideElementsInterval);
        }
    }, 200);
})();