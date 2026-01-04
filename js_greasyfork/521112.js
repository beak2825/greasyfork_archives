// ==UserScript==
// @name         推特 X.com 自动主题切换
// @version      1.1
// @description  根据系统主题自动切换 X.com (原 Twitter) 的主题，代码使用Devv.AI协助编写。
// @author       Devv.AI
// @match        https://x.com/*
// @icon         https://x.com/favicon.ico
// @namespace    hengyuan
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521112/%E6%8E%A8%E7%89%B9%20Xcom%20%E8%87%AA%E5%8A%A8%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/521112/%E6%8E%A8%E7%89%B9%20Xcom%20%E8%87%AA%E5%8A%A8%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyTheme(theme) {
        document.cookie = `night_mode=${theme}; domain=.x.com; path=/; secure; max-age=31536000`;
        // 立即应用主题更改，避免刷新页面前出现闪烁
        document.documentElement.setAttribute('data-night-mode', theme);
        // 触发 X.com 内部的主题更新机制 (如果存在)
        window.dispatchEvent(new Event('nightModeUpdated'));
    }

    function detectSystemTheme() {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        return darkModeQuery.matches ? '2' : '0'; // 2: 暗黑, 0: 默认
    }

    function updateTheme() {
        const systemTheme = detectSystemTheme();
        applyTheme(systemTheme);
    }

    // 初始应用主题
    updateTheme();

    // 监听系统主题变化
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', updateTheme);


    // 处理 X.com 异步加载内容的情况
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                updateTheme(); // 页面内容变化时重新应用主题
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();