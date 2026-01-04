// ==UserScript==
// @name         LeetCode 使用快捷键在中国站和美国站间跳转
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license      MIT
// @description  按下Ctrl+`(esc下面的波浪键)时跳转到另一个站点对应的页面
// @match        *://*leetcode.cn/*
// @match        *://*leetcode.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469601/LeetCode%20%E4%BD%BF%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%9C%A8%E4%B8%AD%E5%9B%BD%E7%AB%99%E5%92%8C%E7%BE%8E%E5%9B%BD%E7%AB%99%E9%97%B4%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/469601/LeetCode%20%E4%BD%BF%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%9C%A8%E4%B8%AD%E5%9B%BD%E7%AB%99%E5%92%8C%E7%BE%8E%E5%9B%BD%E7%AB%99%E9%97%B4%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === '`') {
            event.preventDefault();
            let url = window.location.href;
            if (url.includes('leetcode.cn/u')) {
                window.open(url.replace('leetcode.cn/u', 'leetcode.com'), '_blank');
            } else if (url.includes('leetcode.com')) {
                window.open(url.replace('leetcode.com', 'leetcode.cn'), '_blank');
            } else {
                window.open(url.replace('leetcode.cn', 'leetcode.com'), '_blank');
            }
        }
    });
})();