// ==UserScript==
// @name         番號手动查询 (v12 - 性能监控版)
// @namespace    http://tampermonkey.net/
// @version      12.1
// @description  【性能监控版】点击按钮后显示查询耗时，方便调试响应速度问题
// @author       lxos110 (由 Gemini 优化)
// @license      MIT
// @match        https://javdb.com/*
// @include      https://javdb*.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/542795/%E7%95%AA%E8%99%9F%E6%89%8B%E5%8A%A8%E6%9F%A5%E8%AF%A2%20%28v12%20-%20%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542795/%E7%95%AA%E8%99%9F%E6%89%8B%E5%8A%A8%E6%9F%A5%E8%AF%A2%20%28v12%20-%20%E6%80%A7%E8%83%BD%E7%9B%91%E6%8E%A7%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const API_HOST = '192.168.31.95'; // 你的服务器局域网IP
    const POLLING_INTERVAL = 250;    // 每 250 毫秒检查一次页面
    const POLLING_TIMEOUT = 15000;   // 15 秒后自动停止检查

    // --- 创建唯一的、居中的通知面板和背景遮罩 ---
    let notificationPanel, notificationOverlay;
    function createNotificationPanel() {
        if (document.getElementById('local-query-notification-panel')) return;

        // 创建背景遮罩
        notificationOverlay = document.createElement('div');
        notificationOverlay.id = 'local-query-notification-overlay';
        notificationOverlay.onclick = () => {
            notificationPanel.style.display = 'none';
            notificationOverlay.style.display = 'none';
        };

        // 创建通知面板
        notificationPanel = document.createElement('div');
        notificationPanel.id = 'local-query-notification-panel';
        
        const content = document.createElement('span');
        content.id = 'local-query-notification-content';

        const closeButton = document.createElement('button');
        closeButton.id = 'local-query-notification-close';
        closeButton.textContent = '×';
        closeButton.onclick = () => {
            notificationPanel.style.display = 'none';
            notificationOverlay.style.display = 'none';
        };

        notificationPanel.appendChild(content);
        notificationPanel.appendChild(closeButton);
        document.body.appendChild(notificationOverlay);
        document.body.appendChild(notificationPanel);

        // 使用 GM_addStyle 添加样式
        GM_addStyle(`
            #local-query-notification-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 99998;
                display: none;
            }
            #local-query-notification-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                border-radius: 8px;
                padding: 20px 40px 20px 25px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.25);
                z-index: 99999;
                font-size: 16px;
                display: none;
                color: #333;
                min-width: 300px;
                text-align: center;
            }
            #local-query-notification-close {
                position: absolute;
                top: 5px;
                right: 8px;
                border: none;
                background: transparent;
                font-size: 24px;
                cursor: pointer;
                color: #aaa;
            }
            #local-query-notification-close:hover {
                color: #000;
            }
        `);
    }

    /**
     * 在通知面板中显示消息
     */
    function showNotification(message, color) {
        if (!notificationPanel) createNotificationPanel();
        
        const content = document.getElementById('local-query-notification-content');
        content.textContent = message;
        content.style.color = color;
        
        notificationOverlay.style.display = 'block';
        notificationPanel.style.display = 'block';
    }

    /**
     * 主函数：查找番号元素并自动查询
     */
    function findAndAutoQuery() {
        const strongTags = document.querySelectorAll('strong');
        let foundCount = 0;

        for (const strongTag of strongTags) {
            if (strongTag.textContent.includes('番號:') || strongTag.textContent.includes('番号:')) {
                const parentDiv = strongTag.closest('div.panel-block');
                if (parentDiv) {
                    const valueSpan = parentDiv.querySelector('span.value');
                    if (valueSpan) {
                        const videoCode = valueSpan.textContent.trim();
                        
                        // 避免重复查询：检查是否已查询过
                        if (videoCode && !valueSpan.dataset.queried) {
                            // 显示查询状态
                            const statusSpan = document.createElement('span');
                            statusSpan.textContent = ' (查询中...)';  
                            statusSpan.style.color = '#666';
                            statusSpan.style.fontSize = '0.9em';
                            valueSpan.insertAdjacentElement('afterend', statusSpan);
                            
                            // 标记为已查询并记录状态元素
                            valueSpan.dataset.queried = 'true';
                            valueSpan.dataset.statusElement = statusSpan;
                            
                            // 延迟查询避免阻塞页面渲染
                            setTimeout(() => {
                                queryApi(videoCode, statusSpan);
                            }, 500);
                            
                            foundCount++;
                        }
                    }
                }
            }
        }
        
        return foundCount > 0;
    }

    // 移除createCheckButton函数（不再需要按钮）

    /**
     * 通过 API 查询番号 (自动查询版)
     */
    function queryApi(searchedCode, statusElement) {
        const startTime = performance.now();
        
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://${API_HOST}:8000/check/${searchedCode}`,
            timeout: 15000,
            onload: function(response) {
                const endTime = performance.now();
                const responseTime = (endTime - startTime).toFixed(2);
                
                console.log(`自动查询${searchedCode}耗时: ${responseTime}ms`);
                
                // 更新状态显示
                if (statusElement) {
                    if (response.status === 200) {
                        statusElement.textContent = ` (已存在: ${responseTime}ms)`;
                        statusElement.style.color = '#4CAF50';
                    } else if (response.status === 404) {
                        statusElement.textContent = ` (未找到: ${responseTime}ms)`;
                        statusElement.style.color = '#F44336';
                    } else {
                        statusElement.textContent = ` (错误: ${response.status})`;
                        statusElement.style.color = '#FF9800';
                    }
                }
                
                // 只在首次查询时显示通知
                if (response.status === 200) {
                    showNotification(`【${searchedCode}】已在本地库中找到 (${responseTime}ms)`, '#4CAF50');
                }
                
                console.table({
                    '番号': searchedCode,
                    '响应时间': `${responseTime}ms`,
                    'HTTP状态': response.status,
                    '响应大小': `${response.responseText.length} 字节`
                });
            },
            onerror: function() {
                if (statusElement) {
                    statusElement.textContent = ' (查询失败)';
                    statusElement.style.color = '#FF9800';
                }
            },
            ontimeout: function() {
                if (statusElement) {
                    statusElement.textContent = ' (超时)';
                    statusElement.style.color = '#FF9800';
                }
            }
        });
    }

    // --- 启动逻辑 ---
    createNotificationPanel(); // 脚本启动时就准备好面板
    const startTime = Date.now();
    const pollingTimer = setInterval(() => {
        if (findAndAutoQuery() || (Date.now() - startTime > POLLING_TIMEOUT)) {
            clearInterval(pollingTimer);
        }
    }, POLLING_INTERVAL);
    
    // 监听页面变化，处理动态加载的内容
    const observer = new MutationObserver(() => {
        findAndAutoQuery();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
