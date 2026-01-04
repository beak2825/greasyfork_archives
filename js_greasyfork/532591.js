// ==UserScript==
// @name         百度重定向Google搜索
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  当输入以"``"或"··"开头的查询时，自动重定向到Google搜索（支持页面搜索框 + 地址栏搜索）
// @author       wze (改进版)
// @match        *://www.baidu.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532591/%E7%99%BE%E5%BA%A6%E9%87%8D%E5%AE%9A%E5%90%91Google%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/532591/%E7%99%BE%E5%BA%A6%E9%87%8D%E5%AE%9A%E5%90%91Google%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const prefixes = ['``', '··'];

    /**
     * 判断查询是否需要重定向到 Google
     * @param {string} query
     * @returns {boolean} 是否已执行重定向
     */
    function redirectIfNeeded(query) {
        if (!query) return false;

        const trimmedQuery = query.trim();
        for (const prefix of prefixes) {
            if (trimmedQuery.startsWith(prefix)) {
                const googleQuery = trimmedQuery.substring(prefix.length).trim();
                if (googleQuery) {
                    window.location.replace(`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`);
                } else {
                    // 如果前缀后为空，直接去 Google 首页（可选）
                    window.location.replace('https://www.google.com/');
                }
                return true;
            }
        }
        return false;
    }

    /**
     * 从 URL（包括 ? 和 # 部分）中提取搜索关键词
     * @returns {boolean} 是否已执行重定向
     */
    function checkUrlParams() {
        let query = null;

        // 1. 检查 ? 后面的参数（如 /s?wd=xx）
        const searchParams = new URLSearchParams(window.location.search);
        query = searchParams.get('wd') || searchParams.get('word') || searchParams.get('oq');

        // 2. 如果没找到，再检查 #hash 后面的参数（地址栏搜索常这样）
        if (!query && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            query = hashParams.get('wd') || hashParams.get('word') || hashParams.get('oq');
        }

        return redirectIfNeeded(query);
    }

    // 页面加载最开始就检查 URL 参数（针对地址栏直接搜索）
    if (checkUrlParams()) {
        return; // 已重定向，直接结束脚本
    }

    /**
     * 获取百度搜索输入框
     */
    function getSearchInput() {
        return document.getElementById('kw') ||
               document.querySelector('input[name="wd"]') ||
               document.querySelector('input[type="search"]') ||
               document.querySelector('#search-input'); // 备用选择器
    }

    /**
     * 给搜索表单绑定提交事件，拦截带前缀的查询
     */
    function bindSearchEvent(searchInput) {
        if (!searchInput || searchInput._redirectBound) return;

        searchInput._redirectBound = true;

        const form = searchInput.closest('form') || document.querySelector('form[action="/s"]');
        if (form) {
            form.addEventListener('submit', function (e) {
                const query = searchInput.value;
                if (redirectIfNeeded(query)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }
    }

    // 初始绑定（页面加载时可能已存在输入框）
    const initialInput = getSearchInput();
    if (initialInput) {
        bindSearchEvent(initialInput);
    }

    // 使用 MutationObserver 监听动态加载的输入框（百度常 SPA 加载）
    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const input = getSearchInput();
                if (input) {
                    bindSearchEvent(input);
                    // 一旦找到输入框，可考虑停止观察以提升性能（可选）
                    // observer.disconnect();
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();