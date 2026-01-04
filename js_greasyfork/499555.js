// ==UserScript==
// @name         自动刷新插件
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动刷新页面，如果页面空白则使用时间戳来避免缓存
// @author       dlyuanone
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/499555/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/499555/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义基础刷新时间间隔（毫秒）
    const BASE_REFRESH_INTERVAL = 60 * 1000; // 30秒
    // 定义随机数的最大范围（毫秒）
    const RANDOM_MAX = 10 * 1000; // 10秒

    // 函数：生成随机刷新间隔
    function getRandomInterval() {
        return Math.floor(Math.random() * RANDOM_MAX) + 1; // 1ms 到 10秒之间的随机数
    }

    // 函数：检查页面是否空白
    function isPageBlank() {
        return document.body.innerText.trim() === '' && document.body.childNodes.length === 0;
    }

    // 函数：自动刷新页面
    function autoRefresh() {
        console.log("Auto-refresh triggered.");
        const refreshPage = () => {
            if (isPageBlank()) {
                console.log("Page is blank, refreshing with cache busting.");
                const currentUrl = window.location.href;
                const noCacheUrl = currentUrl + (currentUrl.indexOf('?') === -1 ? '?' : '&') + 'nocache=' + new Date().getTime();
                window.location.replace(noCacheUrl); // 使用时间戳刷新页面，避免缓存
            } else {
                console.log("Page is not blank.");
            }
        };
        refreshPage();
    }

    // 函数：开启或关闭自动刷新
    function toggleAutoRefresh() {
        const isAutoRefreshEnabled = window.name === 'autoRefreshEnabled';
        const button = document.getElementById('autoRefreshButton');
        if (isAutoRefreshEnabled) {
            window.name = ''; // 清除页面标识
            clearTimeout(window.autoRefreshTimeout); // 清除定时器
            button.textContent = '启用自动刷新';
        } else {
            window.name = 'autoRefreshEnabled'; // 设置页面标识
            autoRefresh(); // 立即刷新一次
            setRandomInterval(); // 设置随机刷新间隔
            button.textContent = '正在持续刷新中…';
        }
    }

    // 函数：设置随机刷新间隔
    function setRandomInterval() {
        const randomInterval = getRandomInterval();
        window.autoRefreshTimeout = setTimeout(autoRefresh, BASE_REFRESH_INTERVAL + randomInterval);
        console.log(`Next refresh in ${Math.floor(BASE_REFRESH_INTERVAL / 1000) + Math.floor(randomInterval / 1000)} seconds.`);
    }

    // 创建按钮并添加到页面
    const button = document.createElement('button');
    button.id = 'autoRefreshButton';
    button.textContent = window.name === 'autoRefreshEnabled' ? '正在持续刷新中…' : '启用自动刷新';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '10000';
    button.style.padding = '10px 20px';
    button.style.border = '1px solid #ccc';
    button.style.backgroundColor = '#f9f9f9';
    button.style.cursor = 'pointer';
    button.addEventListener('click', toggleAutoRefresh);
    document.body.appendChild(button);

    // 监听键盘事件，按下 F9 键时切换自动刷新状态
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F9') {
            toggleAutoRefresh();
        }
    });

    // 页面加载时检查页面标识，并根据状态执行相应的操作
    if (window.name === 'autoRefreshEnabled') {
        setRandomInterval();
    }
})();