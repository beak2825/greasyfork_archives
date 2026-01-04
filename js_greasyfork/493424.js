// ==UserScript==
// @name         With Robin
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  与罗宾一起，使用纯净的百度搜索。每次搜索都会自动加入 -robin，开启探索之旅。
// @author       你的名字
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493424/With%20Robin.user.js
// @updateURL https://update.greasyfork.org/scripts/493424/With%20Robin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查并处理 URL 的函数
    function checkAndRedirect() {
        // 获取当前页面的 URL
        const currentUrl = window.location.href;

        // 定义正则表达式，匹配 wd= 后面的关键词
        const keywordRegex = /wd=([^&]+)/;
        const match = currentUrl.match(keywordRegex);

        // 如果匹配到 wd= 参数
        if (match) {
            // 提取当前关键词
            const currentKeyword = decodeURIComponent(match[1]);

            // 检查关键词是否已经包含 -robin
            if (!currentKeyword.includes('-robin')) {
                // 在关键词后面加上 -robin
                const newKeyword = `${currentKeyword}-robin`;

                // 替换 URL 中的关键词
                const newUrl = currentUrl.replace(keywordRegex, `wd=${encodeURIComponent(newKeyword)}`);

                // 跳转到新的 URL
                window.location.href = newUrl;
            }
        }
    }

    // 监听搜索栏的输入事件
    function setupSearchBarListener() {
        // 百度搜索栏的输入框通常有一个 id 或 class
        const searchInput = document.getElementById('kw') || document.querySelector('input[name="wd"]');

        if (searchInput) {
            // 监听输入框的 keydown 事件
            searchInput.addEventListener('keydown', (event) => {
                // 如果按下的是回车键
                if (event.key === 'Enter') {
                    // 延迟一小段时间，等待 URL 更新
                    setTimeout(checkAndRedirect, 100);
                }
            });
        }
    }

    // 初始化
    function init() {
        // 页面加载时立即检查一次
        checkAndRedirect();

        // 设置搜索栏监听器
        setupSearchBarListener();
    }

    // 延迟初始化，确保页面加载完成
    window.addEventListener('load', init);
})();