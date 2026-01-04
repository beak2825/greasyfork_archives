// ==UserScript==
// @name         页面定时刷新
// @namespace    http://your-namespace.com
// @version      1.0.0
// @description  定时刷新页面
// @author       ghhgy
// @match        *://*/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/495012/%E9%A1%B5%E9%9D%A2%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/495012/%E9%A1%B5%E9%9D%A2%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从本地存储中获取上次保存的状态和刷新间隔
    const isRefreshEnabled = localStorage.getItem('isRefreshEnabled') === 'true';
    const savedRefreshInterval = localStorage.getItem('refreshInterval');

    // 如果启动了定时刷新，且存在刷新间隔，自动启动定时刷新
    if (isRefreshEnabled && savedRefreshInterval) {
        const refreshIntervalInMilliseconds = savedRefreshInterval * 1000;

        function refreshPage() {
            location.reload(true);
        }

        window.refreshIntervalId = setInterval(refreshPage, refreshIntervalInMilliseconds);
    }

    // 创建设置框
    const settingsBox = document.createElement('div');
    settingsBox.style.position = 'fixed';
    settingsBox.style.top = '10px';
    settingsBox.style.right = '10px';
    settingsBox.style.padding = '10px';
    settingsBox.style.backgroundColor = 'white';
    settingsBox.style.border = '1px solid #ccc';
    settingsBox.style.zIndex = '9999'; // 设置z-index确保在最上层
    document.body.appendChild(settingsBox);

    // 添加输入框和按钮
    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.placeholder = '刷新间隔（秒）';

    // 如果存在刷新间隔，显示在输入框中
    if (savedRefreshInterval) {
        inputField.value = savedRefreshInterval;
    }

    settingsBox.appendChild(inputField);

    const startButton = document.createElement('button');
    startButton.textContent = isRefreshEnabled ? '停止定时刷新' : '启动定时刷新';
    settingsBox.appendChild(startButton);

    // 启动/停止定时器
    startButton.addEventListener('click', function() {
        const refreshInterval = inputField.value;

        // 保存用户设置到本地存储
        localStorage.setItem('refreshInterval', refreshInterval);

        const refreshIntervalInMilliseconds = refreshInterval * 1000;

        function refreshPage() {
            location.reload(true);
        }

        // 切换启动/停止状态
        if (isRefreshEnabled) {
            clearInterval(window.refreshIntervalId);
            startButton.textContent = '启动定时刷新';
        } else {
            window.refreshIntervalId = setInterval(refreshPage, refreshIntervalInMilliseconds);
            startButton.textContent = '停止定时刷新';
        }

        // 保存状态到本地存储
        localStorage.setItem('isRefreshEnabled', !isRefreshEnabled);
    });
})();
