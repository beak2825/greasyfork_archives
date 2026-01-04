// ==UserScript==
// @name         Redbook Collect - 小红书笔记采集助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个提取小红书笔记信息写入到飞书多维表格的油猴脚本
// @author       观澜同学
// @match        *://*.xiaohongshu.com/*
// @license MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAS2SURBVGhD7ZpfaBNZGMXzIAgLCoJQEIqCIBaEUhCKQrEolIJQCoVSKJSFUlgohUJZWCgLRaFYKBaKhWJBKBaKD8WHIAhFoSgIwkIpCsKCIAjLQlko527OJPfOzE1mksm/Rfzgh2Yy95zvfN+5d3KT1CZp0qT/v9od6OarjcbR0dGvvV7vj8FgsLvZbP6y2+12UXZa/Gl5mU6nn9HG/eTk5O92u/0rvkfzeC5R4KTdbn8ej8df4lhxj7fBYPAV5fqZ3SgHNLYLyLOtra0vuPQfYmHCtwaDwRGbLgaIc4Lyvbe392MYDIJYzuYvMfz6jUbjQ3YGAVuwBVfARVKMwwdHIHwSw8WQUk7z1Mjh8DDj58BisehZ1GqXbAUCG/vY3BgbG8+wrY2NjY9t0p6cnHyM79wZwTDqD4fDeXx9h61Onj59+gHTIBuP/S5GqLXFMUkj4MnW1tYHiHjFoVdhBH0hXjIjGvZ3d3efYQp+RVh5yK+vr3/CVkQRDMeXl5fvoRUfFdoI+o5jYF5pAwYGg8HR/v7+G9iqSJgQVzjAEYX4YaNmD9D/lCZQM0gIcOCYndSA/i1NYxZMoN/va03UZOgqpkAgxLlqodvtMk1qvYJWYXMYJ0wCDzB9q0DfCXVg+lgFvQtrgBZMFRtqvRgPKWw7gf61arDqHDCFOjZbLTQDxCHFcA5oMdCEaUPZC5Oj7jF57A0wfepgTxUb8xGU1+AqkKqfA74DdYxwrOzFjY52wLJbEkydOmAS6PoUvgNVD4GjCJA9wAjHEvyq2PTQK2Ddm76rY+YwptiwCqSKY3fAAM1d6cBJwF5mV3UwdepAs4n9wA5Ym3HAEMgd0IfgnBvpHDwAZ8mMV2A6gVQBCa3Cfr9/xFYLTADy2tQO4CmXmQMiTBvbwp/TGKULchKpbMMB64BGjI6pTcJFncZYmTuA38/2nCJOAKeDx7SBucQM8H1gKWx0uQNGzKK5fPlkCGqFgM2YGmJTp+wRmzhgDDHLhJGFuINKKGbDJo+pFQYOYt0mDrgOTG0T5sFxfX19zjA5J2Uv9OZqhaZAXJsVG/OYBtVz9Kpu5TFR6MGwv5+9JoRJMVG+ZwJYWyDeLcUG/UdMJcqCPrQDsQ8LygE1RQpfC4rZA9l7AefF/r79HFAPVO0FGruwLSTCZGjYnN8YYZ/JNTFADtiqGBSzGLYK+0+zNGGyNNRcN2OEfSauDYG5z0PEukmWKU0W58NmZmamcgGTzU6nc8Qp5AhYdoug+P5wOHwXm62W+Ph+ZWXlU4pFfJkPH3T4HptNjm63+xdFYiHBb1G3Tk9P/8bmJgtrf1Dkl1BElAUc/HNhYeE9Nl8fYZG/KO4zKCYOGPQ7m68+sONLCouECcPpd/wFH1uoJrBTrLpfRcIkwfPaPs9Qw/8rRRSBw+G1tfyXQWTn5OTkn0hUJFBc/DXKjc3Nzf+S3hEgCl8pyNpuFTvF8Pl6dXX1HTaVXOh1v9PpXGB+R/8/EsUj9JtYjdcNXN5FGftL6x20KJrjTZp0d9Vo/AfvNDhO3qsbdAAAAABJRU5ErkJggg==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @downloadURL https://update.greasyfork.org/scripts/535530/Redbook%20Collect%20-%20%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535530/Redbook%20Collect%20-%20%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E9%87%87%E9%9B%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .redbook-collect-panel {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 300px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #333;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .redbook-collect-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(45deg, #ff2e4d, #ff4e65);
            color: white;
            padding: 12px 15px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .redbook-collect-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        .redbook-collect-close {
            cursor: pointer;
            font-size: 18px;
        }
        .redbook-collect-body {
            padding: 15px;
        }
        .redbook-collect-form-group {
            margin-bottom: 12px;
        }
        .redbook-collect-label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            font-weight: 500;
        }
        .redbook-collect-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }
        .redbook-collect-button {
            display: inline-block;
            padding: 8px 15px;
            background-color: #ff2e4d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin-top: 5px;
            transition: background-color 0.2s;
        }
        .redbook-collect-button:hover {
            background-color: #e01a3b;
        }
        .redbook-collect-secondary {
            background-color: #6c757d;
        }
        .redbook-collect-secondary:hover {
            background-color: #5a6268;
        }
        .redbook-collect-message {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            font-size: 14px;
        }
        .redbook-collect-success {
            background-color: #d4edda;
            color: #155724;
        }
        .redbook-collect-error {
            background-color: #f8d7da;
            color: #721c24;
        }
        .redbook-collect-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }
        .redbook-collect-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff2e4d;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .redbook-collect-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 15px;
        }
        .redbook-collect-tab {
            padding: 8px 15px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }
        .redbook-collect-tab.active {
            border-bottom: 2px solid #ff2e4d;
            color: #ff2e4d;
        }
        .redbook-collect-panel-minimized {
            width: 50px;
            height: 50px;
            overflow: hidden;
            border-radius: 50%;
            cursor: pointer;
        }
        .redbook-collect-panel-minimized .redbook-collect-header {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .redbook-collect-panel-minimized .redbook-collect-body {
            display: none;
        }
        .redbook-collect-btn-group {
            display: flex;
            justify-content: space-between;
        }
        /* 侧边栏悬浮按钮样式 */
        .redbook-collect-sidebar-btn {
            position: fixed;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 120px;
            background: linear-gradient(135deg, #ff2e4d, #ff4e65);
            color: white;
            border-radius: 0 8px 8px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transition: all 0.3s ease;
            writing-mode: vertical-rl;
            text-orientation: upright;
            padding: 10px 0;
            font-size: 14px;
            font-weight: 500;
        }
        .redbook-collect-sidebar-btn:hover {
            width: 45px;
            box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.3);
        }
        .redbook-collect-sidebar-btn-icon {
            margin-bottom: 5px;
            font-size: 20px;
        }
    `;
    document.head.appendChild(style);

    // 创建浮动面板
    const createPanel = () => {
        const panel = document.createElement('div');
        panel.className = 'redbook-collect-panel';
        panel.innerHTML = `
            <div class="redbook-collect-header">
                <h3>小红书笔记采集助手</h3>
                <span class="redbook-collect-close">×</span>
            </div>
            <div class="redbook-collect-body">
                <div class="redbook-collect-tabs">
                    <div class="redbook-collect-tab active" data-tab="action">采集</div>
                    <div class="redbook-collect-tab" data-tab="config">配置</div>
                </div>

                <div id="redbook-collect-action-panel">
                    <div class="redbook-collect-btn-group">
                        <button id="redbook-collect-btn" class="redbook-collect-button">采集笔记</button>
                        <button id="redbook-collect-minimize" class="redbook-collect-button redbook-collect-secondary">最小化</button>
                    </div>
                    <div id="redbook-collect-status" class="redbook-collect-message" style="display: none;"></div>
                </div>

                <div id="redbook-collect-config-panel" style="display: none;">
                    <div class="redbook-collect-form-group">
                        <label class="redbook-collect-label">飞书表格URL</label>
                        <input type="text" id="redbook-collect-table-url" class="redbook-collect-input" placeholder="飞书多维表格URL">
                    </div>
                    <div class="redbook-collect-form-group">
                        <label class="redbook-collect-label">飞书App Token</label>
                        <input type="text" id="redbook-collect-app-token" class="redbook-collect-input" placeholder="飞书应用的App Token">
                    </div>
                    <div class="redbook-collect-form-group">
                        <label class="redbook-collect-label">飞书App Secret</label>
                        <input type="password" id="redbook-collect-app-secret" class="redbook-collect-input" placeholder="飞书应用的App Secret">
                    </div>
                    <button id="redbook-collect-save-config" class="redbook-collect-button">保存配置</button>
                </div>

                <div id="redbook-collect-loading-panel" style="display: none;">
                    <div class="redbook-collect-loading">
                        <div class="redbook-collect-spinner"></div>
                        <span id="redbook-collect-loading-text">正在处理...</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 绑定事件
        const closeBtn = panel.querySelector('.redbook-collect-close');
        closeBtn.addEventListener('click', () => {
            panel.remove();
        });

        const tabs = panel.querySelectorAll('.redbook-collect-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabName = tab.dataset.tab;
                document.getElementById('redbook-collect-action-panel').style.display = tabName === 'action' ? 'block' : 'none';
                document.getElementById('redbook-collect-config-panel').style.display = tabName === 'config' ? 'block' : 'none';
                document.getElementById('redbook-collect-loading-panel').style.display = 'none';
            });
        });

        const minimizeBtn = document.getElementById('redbook-collect-minimize');
        minimizeBtn.addEventListener('click', () => {
            panel.classList.add('redbook-collect-panel-minimized');
        });

        panel.addEventListener('click', (e) => {
            if (panel.classList.contains('redbook-collect-panel-minimized') && e.target.closest('.redbook-collect-header')) {
                panel.classList.remove('redbook-collect-panel-minimized');
            }
        });

        // 加载保存的配置
        const tableUrlInput = document.getElementById('redbook-collect-table-url');
        const appTokenInput = document.getElementById('redbook-collect-app-token');
        const appSecretInput = document.getElementById('redbook-collect-app-secret');

        tableUrlInput.value = GM_getValue('tableUrl', '');
        appTokenInput.value = GM_getValue('appToken', '');
        appSecretInput.value = GM_getValue('appSecret', '');

        // 保存配置
        const saveConfigBtn = document.getElementById('redbook-collect-save-config');
        saveConfigBtn.addEventListener('click', () => {
            const tableUrl = tableUrlInput.value.trim();
            const appToken = appTokenInput.value.trim();
            const appSecret = appSecretInput.value.trim();

            if (!tableUrl || !appToken || !appSecret) {
                showStatus('请填写所有必要的配置信息', false);
                return;
            }

            // 解析表格URL获取app_token和table_id
            try {
                const urlParams = parseTableUrl(tableUrl);

                // 保存配置
                GM_setValue('tableUrl', tableUrl);
                GM_setValue('appToken', appToken);
                GM_setValue('appSecret', appSecret);
                GM_setValue('baseAppToken', urlParams.appToken);
                GM_setValue('tableId', urlParams.tableId);

                showStatus('配置已保存，可以开始采集笔记', true);

                // 切换到采集页面
                tabs[0].click();
            } catch (error) {
                showStatus(error.message, false);
            }
        });

        // 采集笔记按钮
        const collectBtn = document.getElementById('redbook-collect-btn');
        collectBtn.addEventListener('click', async () => {
            // 检查当前页面是否是小红书笔记详情页
            const isNotePage = document.querySelector('div[id="noteContainer"]') !== null;

            if (!isNotePage) {
                showStatus('当前页面不是小红书笔记详情页，请打开一篇笔记后再试', false);
                return;
            }

            // 获取配置信息
            const appToken = GM_getValue('appToken', '');
            const appSecret = GM_getValue('appSecret', '');
            const baseAppToken = GM_getValue('baseAppToken', '');
            const tableId = GM_getValue('tableId', '');

            if (!appToken || !appSecret || !baseAppToken || !tableId) {
                showStatus('配置信息不完整，请先完成配置', false);
                return;
            }

            try {
                showLoading('正在采集笔记数据...');
                // 提取笔记数据
                const noteData = collectNoteData();

                showLoading('正在获取飞书访问令牌...');
                // 获取飞书访问令牌
                const token = await getFeishuToken(appToken, appSecret);

                showLoading('正在提交数据到飞书...');
                // 构建请求数据
                const requestData = {
                    fields: {
                        "url": noteData.url,
                        "标题": noteData.title,
                        "作者": noteData.author,
                        "正文": noteData.content,
                        "标签": noteData.tags,
                        "点赞": noteData.likes,
                        "收藏": noteData.collects,
                        "评论": noteData.comments
                    }
                };

                // 提交数据到飞书
                await submitToFeishu(baseAppToken, tableId, token, requestData);

                showStatus('数据已成功提交到飞书多维表格', true);
            } catch (error) {
                showStatus('采集失败: ' + error.message, false);
            }
        });
    };

    // 显示状态消息
    const showStatus = (message, isSuccess) => {
        const statusElement = document.getElementById('redbook-collect-status');
        statusElement.textContent = message;
        statusElement.className = 'redbook-collect-message ' + (isSuccess ? 'redbook-collect-success' : 'redbook-collect-error');
        statusElement.style.display = 'block';

        document.getElementById('redbook-collect-loading-panel').style.display = 'none';
        document.getElementById('redbook-collect-action-panel').style.display = 'block';
    };

    // 显示加载状态
    const showLoading = (loadingText) => {
        document.getElementById('redbook-collect-action-panel').style.display = 'none';
        document.getElementById('redbook-collect-config-panel').style.display = 'none';
        document.getElementById('redbook-collect-loading-panel').style.display = 'block';
        document.getElementById('redbook-collect-loading-text').textContent = loadingText || '正在处理...';
    };

    // 解析表格URL
    function parseTableUrl(url) {
        try {
            // 示例URL: https://bytesmore.feishu.cn/base/UQxWbiiaSa7oqssbIxLclGeVnrV?table=tblQqWO7UfZ3JNTB&view=vewHNkTAcq
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const baseAppToken = pathParts[pathParts.length - 1];

            const params = new URLSearchParams(urlObj.search);
            const tableId = params.get('table');

            if (!baseAppToken || !tableId) {
                throw new Error('无法从URL中解析出app_token或table_id');
            }

            return {
                appToken: baseAppToken,
                tableId: tableId
            };
        } catch (error) {
            throw new Error('表格URL格式不正确，无法解析');
        }
    }

    // 提取笔记数据
    function collectNoteData() {
        // 提取页面URL
        const url = window.location.href;

        // 提取作者用户名
        const usernameElement = document.querySelector('span.username');
        const username = usernameElement ? usernameElement.textContent.trim() : '';

        // 提取标题
        const titleElement = document.querySelector('div.interaction-container div.note-scroller div.note-content div.title');
        const title = titleElement ? titleElement.textContent.trim() : '';

        // 提取正文内容
        const noteTextElement = document.querySelector('div.interaction-container div.note-scroller div.note-content div.desc span.note-text > span');
        const content = noteTextElement ? noteTextElement.textContent.trim() : '';

        // 提取标签
        const tagElements = document.querySelectorAll('a.tag');
        const tags = Array.from(tagElements).map(tag => tag.textContent.trim());

        // 提取点赞数
        const likeCountElement = document.querySelector('div.interaction-container div.interactions div.engage-bar-container div.engage-bar div.input-box div.interact-container div.left span.like-wrapper span.count');
        const likes = likeCountElement ? parseInt(likeCountElement.textContent.trim()) || 0 : 0;

        // 提取收藏数
        const collectCountElement = document.querySelector('div.interaction-container div.interactions div.engage-bar-container div.engage-bar div.input-box div.interact-container div.left span.collect-wrapper span.count');
        const collects = collectCountElement ? parseInt(collectCountElement.textContent.trim()) || 0 : 0;

        // 提取评论数
        const chatCountElement = document.querySelector('div.interaction-container div.interactions div.engage-bar-container div.engage-bar div.input-box div.interact-container div.left span.chat-wrapper span.count');
        const comments = chatCountElement ? parseInt(chatCountElement.textContent.trim()) || 0 : 0;

        return {
            url,
            author: username,
            title,
            content,
            tags,
            likes,
            collects,
            comments
        };
    }

    // 获取飞书访问令牌
    function getFeishuToken(appId, appSecret) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    app_id: appId,
                    app_secret: appSecret
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.tenant_access_token) {
                            resolve(data.tenant_access_token);
                        } else {
                            reject(new Error(data.msg || '获取飞书访问令牌失败'));
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 提交数据到飞书
    function submitToFeishu(appToken, tableId, accessToken, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result);
                        } else {
                            reject(new Error(result.msg || '提交数据到飞书失败'));
                        }
                    } catch (e) {
                        reject(new Error('解析响应失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 创建悬浮按钮
    const createFloatingButton = () => {
        const button = document.createElement('div');
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(45deg, #ff2e4d, #ff4e65);
            border-radius: 50%;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-size: 24px;
        `;
        button.innerHTML = '+';
        button.title = '小红书笔记采集助手';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            button.style.display = 'none';
            createPanel();
        });
    };

    // 创建侧边栏悬浮按钮
    const createSidebarButton = () => {
        const button = document.createElement('div');
        button.className = 'redbook-collect-sidebar-btn';
        button.innerHTML = `
            <span class="redbook-collect-sidebar-btn-icon">📝</span>
            <span>采集笔记</span>
        `;
        button.title = '小红书笔记采集助手';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            // 检查是否已经存在面板
            const existingPanel = document.querySelector('.redbook-collect-panel');
            if (existingPanel) {
                existingPanel.remove();
            }
            createPanel();
        });
    };

    // 在小红书笔记页面创建界面
    if (window.location.hostname.includes('xiaohongshu.com')) {
        // 等待页面完全加载
        window.addEventListener('load', () => {
            setTimeout(() => {
                createFloatingButton();
                createSidebarButton(); // 创建侧边栏按钮
            }, 1000);
        });
    }
})();