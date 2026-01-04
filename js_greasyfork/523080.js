// ==UserScript==
// @name         百度搜索自动加上 -李彦宏
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  在百度搜索时自动在搜索词后面加上 -李彦宏，支持地址栏搜索并避免自动触发搜索
// @author       你的名字
// @match        *://www.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523080/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E5%8A%A0%E4%B8%8A%20-%E6%9D%8E%E5%BD%A6%E5%AE%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/523080/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E5%8A%A0%E4%B8%8A%20-%E6%9D%8E%E5%BD%A6%E5%AE%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查并调整 -李彦宏
    function checkAndAdjustLiYanhong() {
        const searchInput = document.getElementById('kw');
        if (searchInput) {
            let searchQuery = searchInput.value;
            const liYanhong = ' -李彦宏';

            // 如果搜索词中还没有 -李彦宏，则加上
            if (!searchQuery.includes(liYanhong)) {
                searchQuery += liYanhong;
                searchInput.value = searchQuery;

                // 将光标定位在 -李彦宏 前面
                const cursorPosition = searchQuery.length - liYanhong.length;
                searchInput.setSelectionRange(cursorPosition, cursorPosition);
                return true; // 表示进行了修改
            }

            // 如果 -李彦宏 不在最后，则调整到前面
            const liYanhongIndex = searchQuery.indexOf(liYanhong);
            if (liYanhongIndex !== searchQuery.length - liYanhong.length) {
                // 提取 -李彦宏 之前和之后的内容
                const beforeLiYanhong = searchQuery.slice(0, liYanhongIndex);
                const afterLiYanhong = searchQuery.slice(liYanhongIndex + liYanhong.length);

                // 将 -李彦宏 调整到前面
                searchQuery = beforeLiYanhong + afterLiYanhong + liYanhong;
                searchInput.value = searchQuery;

                // 将光标定位在 -李彦宏 前面
                const cursorPosition = searchQuery.length - liYanhong.length;
                searchInput.setSelectionRange(cursorPosition, cursorPosition);
                return true; // 表示进行了修改
            }
        }
        return false; // 表示没有进行修改
    }

    // 拦截页面内搜索
    function interceptSearch() {
        const searchForm = document.getElementById('form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(event) {
                // 检查并调整 -李彦宏
                const isModified = checkAndAdjustLiYanhong();

                // 如果搜索词被修改，则阻止默认行为并重新提交
                if (isModified) {
                    event.preventDefault();
                    searchForm.submit();
                }
                // 否则允许默认行为
            });
        }
    }

    // 处理地址栏搜索
    function handleAddressBarSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('wd');
        if (query && !query.includes(' -李彦宏')) {
            urlParams.set('wd', query + ' -李彦宏');
            window.location.search = urlParams.toString();
        }
    }

    // 初始化
    function init() {
        checkAndAdjustLiYanhong(); // 检查并修正搜索词
        interceptSearch(); // 拦截页面内搜索
        handleAddressBarSearch(); // 处理地址栏搜索
    }

    // 页面加载完成后初始化
    init();

    // 监听动态内容变化（适用于百度搜索结果页面的动态更新）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.target === document.body) {
                // 重新初始化脚本
                init();
            }
        });
    });

    // 监听 body 的子节点变化
    observer.observe(document.body, { childList: true });
})();
