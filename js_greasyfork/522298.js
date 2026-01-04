// ==UserScript==
// @name         家庭购买授权助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Microsoft Family Purchase Authorization
// @author       dianran
// @license       MIT
// @match        https://account.microsoft.com/family/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      account.microsoft.com
// @downloadURL https://update.greasyfork.org/scripts/522298/%E5%AE%B6%E5%BA%AD%E8%B4%AD%E4%B9%B0%E6%8E%88%E6%9D%83%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522298/%E5%AE%B6%E5%BA%AD%E8%B4%AD%E4%B9%B0%E6%8E%88%E6%9D%83%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createUI() {
        // 创建主窗口
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 35%;
            left: 0;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 0 5px 5px 0;
            z-index: 9999;
            width: 280px;
            user-select: none;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        `;

        // 创建侧边标签
        const minTab = document.createElement('div');
        minTab.style.cssText = `
            position: fixed;
            top: 35%;
            left: 0;
            background: #0078d4;
            color: white;
            padding: 6px;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            font-size: 14px;
        `;
        minTab.textContent = '购买授权';

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            margin: -15px -15px 15px -15px;
            padding: 10px 15px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
            border-radius: 0 5px 0 0;
            font-weight: bold;
        `;
        titleBar.innerHTML = '<span>Family 购买授权 助手</span>';

        // 创建内容区
        const contentArea = document.createElement('div');
        contentArea.style.cssText = `
            cursor: default;
        `;

        // 状态显示区域
        const statusArea = document.createElement('div');
        statusArea.style.cssText = `
            padding: 8px;
            margin-bottom: 15px;
            background: #f5f5f5;
            border-radius: 3px;
            font-size: 12px;
        `;
        statusArea.textContent = '等待获取成员信息...';

        // 发送按钮
        const sendButton = document.createElement('button');
        sendButton.textContent = '手动授权';
        sendButton.style.cssText = `
            padding: 8px 15px;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.2s;
        `;
        sendButton.disabled = true;

        // 组装界面
        contentArea.appendChild(statusArea);
        contentArea.appendChild(sendButton);
        container.appendChild(titleBar);
        container.appendChild(contentArea);

        if (!document.body) {
            throw new Error('Document body not found');
        }

        document.body.appendChild(container);
        document.body.appendChild(minTab);

        // 展开/收起状态管理
        let isMinimized = true;

        function togglePanel() {
            if (isMinimized) {
                // 展开面板
                container.style.transform = 'translateX(0)';
                minTab.style.backgroundColor = '#006cbd';
                minTab.style.left = '280px'; // 面板展开时，标签移到右侧
                minTab.textContent = '收起';
            } else {
                // 收起面板
                container.style.transform = 'translateX(-100%)';
                minTab.style.backgroundColor = '#0078d4';
                minTab.style.left = '0'; // 面板收起时，标签回到左侧
                minTab.textContent = '购买授权';
            }
            isMinimized = !isMinimized;
        }

        // 点击侧边标签时触发展开/收起
        minTab.addEventListener('click', togglePanel);

        // API 处理
        let requestVerificationToken = '';
        let childId = null;

        // 发送请求的函数
        async function sendRequest() {
            const id = childId || GM_getValue('childId', null);
            if (!id) {
                statusArea.textContent = '未找到成员ID';
                return;
            }

            sendButton.disabled = true;
            statusArea.textContent = '正在发送请求...';

            try {
                const response = await fetch('https://account.microsoft.com/family/api/ps/set-acquisition-policy', {
                    method: 'POST',
                    headers: {
                        'x-amc-jsonmode': 'CamelCase',
                        'x-requested-with': 'XMLHttpRequest',
                        'content-type': 'application/json',
                        '__requestverificationtoken': requestVerificationToken || GM_getValue('requestVerificationToken', ''),
                    },
                    body: JSON.stringify({
                        childId: id,
                        policy: 'freeOnly'
                    }),
                    credentials: 'include'
                });

                const text = await response.text();
                console.log('Response:', text);

                if (response.ok) {
                    statusArea.textContent = '请求成功完成';
                    // 发送系统通知
                    GM_notification({
                        text: '购买授权请求已成功完成',
                        title: 'Family 购买授权助手',
                        timeout: 3000,
                        onclick: () => {
                            if (isMinimized) togglePanel();
                        }
                    });
                    if (isMinimized) togglePanel(); // 成功时展开面板
                    // 3秒后自动收起
                    setTimeout(() => {
                        if (!isMinimized) togglePanel();
                    }, 3000);
                } else {
                    statusArea.textContent = `请求失败: ${response.status}`;
                    console.error('请求失败:', response.status, response.statusText);
                }
            } catch (error) {
                statusArea.textContent = '请求发生错误';
                console.error('请求异常:', error);
            }

            sendButton.disabled = false;
        }

        // XHR拦截
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        XMLHttpRequest.prototype.open = function() {
            this._url = arguments[1];
            return originalXHROpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (header.toLowerCase() === '__requestverificationtoken') {
                requestVerificationToken = value;
                GM_setValue('requestVerificationToken', value);
            }
            return originalXHRSetRequestHeader.apply(this, arguments);
        };

        // 监听网络请求
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('/family/api/app-limits/get-policy-v3')) {
                    try {
                        const urlObj = new URL(entry.name);
                        const id = urlObj.searchParams.get('childId');
                        if (id) {
                            childId = id;
                            GM_setValue('childId', id);
                            statusArea.textContent = '已获取成员信息，准备发送请求...';
                            sendButton.disabled = false;

                            // 自动发送请求
                            setTimeout(() => {
                                sendRequest();
                            }, 1000); // 延迟1秒后发送请求
                        }
                    } catch (error) {
                        console.error('处理成员信息时出错:', error);
                    }
                }
            }
        }).observe({ entryTypes: ['resource'] });

        // 手动发送按钮事件
        sendButton.addEventListener('click', sendRequest);

        // 初始化面板为收起状态
        container.style.transform = 'translateX(-100%)';

        return {
            container,
            minTab,
            statusArea,
            sendButton
        };
    }

    // 确保在 DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();