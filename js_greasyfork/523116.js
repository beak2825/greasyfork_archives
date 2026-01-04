// ==UserScript==
// @name         老板帮我去百度搜索广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动在百度搜索关键词后加上 -李彦宏
// @author       barnett
// @match        *://*.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523116/%E8%80%81%E6%9D%BF%E5%B8%AE%E6%88%91%E5%8E%BB%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/523116/%E8%80%81%E6%9D%BF%E5%B8%AE%E6%88%91%E5%8E%BB%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听百度搜索表单的提交事件
    const searchForm = document.getElementById('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            // 获取当前输入的搜索关键词
            const searchInput = document.getElementById('kw');
            if (searchInput) {
                // 检查是否已经包含 -李彦宏
                if (!searchInput.value.includes('-李彦宏')) {
                    // 在搜索关键词后面加上 -李彦宏
                    searchInput.value += ' -李彦宏';
                }
            }
        });
    }
})();