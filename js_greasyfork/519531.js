// ==UserScript==
// @name         自动刷新脚本
// @namespace    http://example.com/your-namespace
// @version      1.0
// @description  自动刷新页面并允许用户自定义每个网站的刷新时间，支持快捷键开启/关闭，并显示设置页面，支持清除设置
// @author       Mike
// @license      MIT
// @match        *://ggfw.hrss.gd.gov.cn/zjjyweb/user/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/519531/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/519531/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let refreshTimeout;
    let countdownInterval;
    let remainingTime = 0;

    // 初始化
    function initialize() {
        const initialized = GM_getValue('scriptInitialized', false);
        if (!initialized) {
             alert('欢迎使用自动刷新脚本！\n\n您可以通过快捷键“*”调出设置页面，自定义刷新时间。\n\n“-”关闭刷新\n\n“+”开启刷新');
            GM_setValue('scriptInitialized', true);
            createGUI(); // 初次访问时显示设置界面
        }
    }

    // 创建GUI界面
    function createGUI() {
        // 如果设置界面已经存在则显示它
        let existingContainer = document.getElementById('autoRefreshSettings');
        if (existingContainer) {
            existingContainer.style.display = 'block';
            return;
        }

        const container = document.createElement('div');
        container.id = 'autoRefreshSettings';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.width = '250px';
        container.style.backgroundColor = '#f9f9f9';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        container.style.padding = '10px';
        container.style.zIndex = 9999;
        container.style.fontFamily = 'Arial, sans-serif';

        const title = document.createElement('h4');
        title.innerText = '自动刷新设置';
        title.style.marginTop = '0';
        title.style.fontSize = '16px';
        title.style.borderBottom = '1px solid #ddd';
        title.style.paddingBottom = '5px';
        container.appendChild(title);

        const infoDiv = document.createElement('div');
        infoDiv.style.marginBottom = '10px';

        const intervalLabel = document.createElement('p');
        intervalLabel.innerText = '设定的时间：' + (GM_getValue('refreshInterval_' + window.location.hostname) || '未设置');
        intervalLabel.style.margin = '5px 0';
        infoDiv.appendChild(intervalLabel);

        const countdownLabel = document.createElement('p');
        countdownLabel.innerText = '离下次刷新还有：-- 秒';
        countdownLabel.style.margin = '5px 0';
        infoDiv.appendChild(countdownLabel);

        const statusLabel = document.createElement('p');
        const autoRefreshEnabled = GM_getValue('autoRefreshEnabled_' + window.location.hostname, false);
        statusLabel.innerText = '自动刷新状态：' + (autoRefreshEnabled ? '已开启' : '已关闭');
        statusLabel.style.margin = '5px 0';
        infoDiv.appendChild(statusLabel);

        container.appendChild(infoDiv);

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.placeholder = '秒';
        intervalInput.value = GM_getValue('refreshInterval_' + window.location.hostname) || '';
        intervalInput.style.width = '100%';
        intervalInput.style.marginBottom = '10px';
        intervalInput.style.padding = '5px';
        intervalInput.style.border = '1px solid #ccc';
        intervalInput.style.borderRadius = '3px';
        container.appendChild(intervalInput);

        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.style.width = '100%';
        saveButton.style.padding = '5px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '3px';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = function () {
            const interval = parseInt(intervalInput.value, 10);
            if (isNaN(interval) || interval <= 0) {
                alert('请输入有效的时间（秒）');
                return;
            }
            GM_setValue('refreshInterval_' + window.location.hostname, interval);
            alert('设置已保存！页面将每 ' + interval + ' 秒刷新一次。');
            intervalLabel.innerText = '设定的时间：' + interval + ' 秒';
            startAutoRefresh(interval);
            statusLabel.innerText = '自动刷新状态：已开启';
        };
        container.appendChild(saveButton);

        const clearCurrentButton = document.createElement('button');
        clearCurrentButton.innerText = '清除当前网页设置';
        clearCurrentButton.style.width = '100%';
        clearCurrentButton.style.padding = '5px';
        clearCurrentButton.style.backgroundColor = '#f44336';
        clearCurrentButton.style.color = 'white';
        clearCurrentButton.style.border = 'none';
        clearCurrentButton.style.borderRadius = '3px';
        clearCurrentButton.style.cursor = 'pointer';
        clearCurrentButton.style.marginTop = '5px';
        clearCurrentButton.onclick = function () {
            GM_setValue('refreshInterval_' + window.location.hostname, null);
            GM_setValue('autoRefreshEnabled_' + window.location.hostname, false);
            alert('当前网页设置已清除！自动刷新已关闭。');
            intervalLabel.innerText = '设定的时间：未设置';
            statusLabel.innerText = '自动刷新状态：已关闭';
            stopAutoRefresh();
        };
        container.appendChild(clearCurrentButton);

        const clearAllButton = document.createElement('button');
        clearAllButton.innerText = '清除所有设置';
        clearAllButton.style.width = '100%';
        clearAllButton.style.padding = '5px';
        clearAllButton.style.backgroundColor = '#f44336';
        clearAllButton.style.color = 'white';
        clearAllButton.style.border = 'none';
        clearAllButton.style.borderRadius = '3px';
        clearAllButton.style.cursor = 'pointer';
        clearAllButton.style.marginTop = '5px';
        clearAllButton.onclick = function () {
            const confirmation = confirm('确定要清除所有设置吗？此操作将影响所有已设置的网页。');
            if (confirmation) {
                clearAllSettings();
                alert('所有设置已清除！');
                intervalLabel.innerText = '设定的时间：未设置';
                statusLabel.innerText = '自动刷新状态：已关闭';
                stopAutoRefresh();
            }
        };
        container.appendChild(clearAllButton);

        const closeButton = document.createElement('button');
        closeButton.innerText = '关闭';
        closeButton.style.width = '100%';
        closeButton.style.padding = '5px';
        closeButton.style.backgroundColor = '#999';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginTop = '5px';
        closeButton.onclick = function () {
            container.style.display = 'none';
        };
        container.appendChild(closeButton);

        document.body.appendChild(container);

        // 更新倒计时显示
        function updateCountdown() {
            countdownLabel.innerText = '离下次刷新还有：' + remainingTime + ' 秒';
            remainingTime--;
        }

        if (autoRefreshEnabled) {
            countdownInterval = setInterval(updateCountdown, 1000);
        }
    }

    // 清除所有设置
    function clearAllSettings() {
        const keys = GM_listValues();
        keys.forEach(key => {
            if (key.startsWith('refreshInterval_') || key.startsWith('autoRefreshEnabled_')) {
                GM_deleteValue(key);
            }
        });
    }

    // 开始自动刷新
    function startAutoRefresh(interval) {
        stopAutoRefresh(); // 清除任何现有的刷新定时器
        remainingTime = interval;
        refreshTimeout = setTimeout(() => {
            location.reload();
        }, interval * 1000);
        countdownInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                document.getElementById('autoRefreshSettings').querySelector('p:nth-child(2)').innerText = '离下次刷新还有：' + remainingTime + ' 秒';
            }
        }, 1000);
        GM_setValue('autoRefreshEnabled_' + window.location.hostname, true);
    }

    // 停止自动刷新
    function stopAutoRefresh() {
        clearTimeout(refreshTimeout);
        clearInterval(countdownInterval);
        GM_setValue('autoRefreshEnabled_' + window.location.hostname, false);
    }

    // 检查并启动自动刷新
    function checkAndStartAutoRefresh() {
        const savedInterval = GM_getValue('refreshInterval_' + window.location.hostname, null);
        const autoRefreshEnabled = GM_getValue('autoRefreshEnabled_' + window.location.hostname, false);
        if (savedInterval && autoRefreshEnabled) {
            startAutoRefresh(savedInterval);
        }
    }

    // 监听快捷键
    document.addEventListener('keydown', function (event) {
        if (event.key === '-') {
            stopAutoRefresh();
            alert('自动刷新已关闭');
        } else if (event.key === '=') {
            const savedInterval = GM_getValue('refreshInterval_' + window.location.hostname);
            if (savedInterval) {
                startAutoRefresh(savedInterval);
                alert('自动刷新已开启，每 ' + savedInterval + ' 秒刷新一次');
            } else {
                alert('请先设置自动刷新时间！');
            }
        } else if (event.key === '*') {
            createGUI(); // 显示设置界面
        }
    });

    // 注册菜单命令
    GM_registerMenuCommand('设置自动刷新', createGUI);

    // 页面加载时检查并启动自动刷新
    checkAndStartAutoRefresh();

    // 初始化
    initialize();

})();
