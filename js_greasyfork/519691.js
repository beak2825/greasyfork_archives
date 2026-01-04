// ==UserScript==
// @name                 微博|weibo日期时间格式化
// @namespace            https://greasyfork.org/
// @author               usdf0380808
// @version              1.0
// @license              MIT
// @description          显示微博中的日期时间为 yy-mm-dd hh:ii:ss 格式
// @match                https://weibo.com/*
// @grant                none
// @run-at               document-body
// @downloadURL https://update.greasyfork.org/scripts/519691/%E5%BE%AE%E5%8D%9A%7Cweibo%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519691/%E5%BE%AE%E5%8D%9A%7Cweibo%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 格式化日期和时间为 YY-MM-DD HH:II:SS
    function fmtDate(date) {
        const pad = (num) => String(num).padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 替换微博中的日期时间
    function replaceDatetime() {
        document.querySelectorAll('a.head-info_time_6sFQg').forEach(function (timeElement) {
            const datetime = timeElement.getAttribute('title');
            if (datetime) {
                const formatted = fmtDate(new Date(datetime));

                if (!timeElement.dataset.formatted) {
                    timeElement.textContent = formatted;
                    timeElement.dataset.formatted = true; // 防止重复格式化
                }
            }
        });
    }

    // 观察 DOM 变化
    const observer = new MutationObserver(replaceDatetime);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始替换
    replaceDatetime();
})();