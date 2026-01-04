// ==UserScript==
// @name                 推特|Twitter|X日期时间格式化
// @namespace            https://greasyfork.org/
// @author               usdf0380808
// @version              1.0
// @license              MIT
// @description          显示推特中的日期时间为 yy-mm-dd hh:ii:ss 格式。
// @match                https://twitter.com/*
// @match                https://mobile.twitter.com/*
// @match                https://x.com/*
// @match                https://mobile.x.com/*
// @grant                none
// @run-at               document-body
// @downloadURL https://update.greasyfork.org/scripts/519689/%E6%8E%A8%E7%89%B9%7CTwitter%7CX%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519689/%E6%8E%A8%E7%89%B9%7CTwitter%7CX%E6%97%A5%E6%9C%9F%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96.meta.js
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

    // 替换推文中的日期时间
    function replaceDatetime() {
        document.querySelectorAll('time[datetime]').forEach(function (timeElement) {
            const datetime = timeElement.getAttribute('datetime');
            const formatted = fmtDate(new Date(datetime));

            if (!timeElement.dataset.formatted) {
                timeElement.textContent = formatted;
                timeElement.dataset.formatted = true; // 防止重复格式化
            }
        });
    }

    // 观察 DOM 变化
    const observer = new MutationObserver(replaceDatetime);
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始替换
    replaceDatetime();
})();