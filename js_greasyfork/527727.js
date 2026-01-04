// ==UserScript==
// @name         为 Telegram Channel 的时间显示添加日期
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在Telegram消息时间显示中添加日期
// @author       YourName
// @match        https://t.me/s/*
// @icon         https://telegram.org/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527727/%E4%B8%BA%20Telegram%20Channel%20%E7%9A%84%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%E6%B7%BB%E5%8A%A0%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/527727/%E4%B8%BA%20Telegram%20Channel%20%E7%9A%84%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%E6%B7%BB%E5%8A%A0%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 格式化日期时间为 MM-DD HH:mm
    function formatDateTime(datetime) {
        const date = new Date(datetime);
        return [
            ('0' + (date.getMonth() + 1)).slice(-2),  // 月份补零
            ('0' + date.getDate()).slice(-2),          // 日期补零
        ].join('-') + ' ' +
        [
            ('0' + date.getHours()).slice(-2),         // 小时补零
            ('0' + date.getMinutes()).slice(-2)        // 分钟补零
        ].join(':');
    }

    // 更新所有时间显示
    function updateTimes() {
        document.querySelectorAll('time.time').forEach(timeEl => {
            const datetime = timeEl.getAttribute('datetime');
            if (datetime) {
                timeEl.textContent = formatDateTime(datetime);
            }
        });
    }

    // 使用MutationObserver监听动态内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                updateTimes();
            }
        });
    });

    // 初始化执行
    updateTimes();

    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();