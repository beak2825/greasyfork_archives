// ==UserScript==
// @name         获取并保存 Cursor 登录凭证
// @namespace    cursor.token.grabber
// @version      1.0.0
// @description  获取 Cursor 登录凭证，包括 WorkosCursorSessionToken 和其他认证信息
// @author       Claude Assistant
// @match        https://www.cursor.com/*
// @match        https://cursor.com/*
// @match        https://authentication.cursor.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cursor.com
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545734/%E8%8E%B7%E5%8F%96%E5%B9%B6%E4%BF%9D%E5%AD%98%20Cursor%20%E7%99%BB%E5%BD%95%E5%87%AD%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/545734/%E8%8E%B7%E5%8F%96%E5%B9%B6%E4%BF%9D%E5%AD%98%20Cursor%20%E7%99%BB%E5%BD%95%E5%87%AD%E8%AF%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .cursor-token-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #007acc;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        .cursor-token-btn:hover {
            background: #005a9e;
            transform: translateY(-2px);
        }
        .cursor-token-btn:active {
            transform: translateY(0);
        }
        .cursor-token-panel {
            position: fixed;
            top: 70px;
            right: 20px;
            z-index: 10000;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            width: 400px;
            max-height: 500px;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: none;
        }
        .cursor-token-panel.show {
            display: block;
        }
        .token-item {
            margin-bottom: 10px;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
            border-left: 3px solid #007acc;
        }
        .token-label {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .token-value {
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
            background: #fff;
            padding: 5px;
            border-radius: 3px;
            border: 1px solid #ddd;
        }
        .copy-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            margin-top: 5px;
        }
        .copy-btn:hover {
            background: #218838;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        }
        .close-btn:hover {
            background: #c82333;
        }
    `);

    // 存储捕获的 Token
    let capturedTokens = {
        workosSessionToken: null,
        authorizationToken: null,
        clientKey: null,
        checksum: null,
        sessionId: null,
        clientVersion: null,
        configVersion: null,
        timezone: null,
        cookies: {},
        requests: []
    };

    // 创建 UI 元素
    function createUI() {
        // 创建主按钮
        const mainBtn = document.createElement('button');
        mainBtn.className = 'cursor-token-btn';
        mainBtn.textContent = '🔍 Cursor Token';
        mainBtn.onclick = togglePanel;
        document.body.appendChild(mainBtn);

        // 创建面板
        const panel = document.createElement('div');
        panel.className = 'cursor-token-panel';
        panel.innerHTML = `
            <button class="close-btn" onclick="this.parentElement.classList.remove('show')">×</button>
            <h3 style="margin: 0 0 15px 0; color: #007acc;">Cursor Token 抓取器</h3>
            <div id="token-content">
                <p>正在监控 Cursor 网络请求...</p>
            </div>
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="copyAllTokens()" style="background: #007acc; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">复制所有 Token</button>
                <button onclick="clearTokens()" style="background: #6c757d; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-left: 10px;">清空数据</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 添加全局函数
        window.togglePanel = togglePanel;
        window.copyAllTokens = copyAllTokens;
        window.clearTokens = clearTokens;
    }

    // 切换面板显示
    function togglePanel() {
        const panel = document.querySelector('.cursor-token-panel');
        panel.classList.toggle('show');
        if (panel.classList.contains('show')) {
            updatePanel();
        }
    }

    // 更新面板内容
    function updatePanel() {
        const content = document.getElementById('token-content');
        if (!content) return;

        let html = '';
        
        // 显示 WorkosCursorSessionToken
        if (capturedTokens.workosSessionToken) {
            html += createTokenItem('WorkosCursorSessionToken', capturedTokens.workosSessionToken);
        }

        // 显示 Authorization Token
        if (capturedTokens.authorizationToken) {
            html += createTokenItem('Authorization Token', capturedTokens.authorizationToken);
        }

        // 显示其他 Token
        const otherTokens = {
            'Client Key': capturedTokens.clientKey,
            'Checksum': capturedTokens.checksum,
            'Session ID': capturedTokens.sessionId,
            'Client Version': capturedTokens.clientVersion,
            'Config Version': capturedTokens.configVersion,
            'Timezone': capturedTokens.timezone
        };

        for (const [label, value] of Object.entries(otherTokens)) {
            if (value) {
                html += createTokenItem(label, value);
            }
        }

        // 显示 Cookie 信息
        if (Object.keys(capturedTokens.cookies).length > 0) {
            html += '<div class="token-item"><div class="token-label">Cookies:</div>';
            for (const [name, value] of Object.entries(capturedTokens.cookies)) {
                html += `<div style="margin: 5px 0;"><strong>${name}:</strong><br><div class="token-value">${value}</div></div>`;
            }
            html += '</div>';
        }

        // 显示请求统计
        if (capturedTokens.requests.length > 0) {
            html += `<div class="token-item">
                <div class="token-label">捕获的请求: ${capturedTokens.requests.length}</div>
                <div style="font-size: 12px; color: #666;">
                    最后更新: ${new Date().toLocaleTimeString()}
                </div>
            </div>`;
        }

        if (!html) {
            html = '<p style="color: #666;">尚未捕获到 Token，请进行 Cursor 相关操作...</p>';
        }

        content.innerHTML = html;
    }

    // 创建 Token 项
    function createTokenItem(label, value) {
        return `
            <div class="token-item">
                <div class="token-label">${label}:</div>
                <div class="token-value">${value}</div>
                <button class="copy-btn" onclick="copyToClipboard('${label}', '${value.replace(/'/g, "\\'")}')">复制</button>
            </div>
        `;
    }

    // 复制到剪贴板
    function copyToClipboard(label, value) {
        GM_setClipboard(value, 'text', () => {
            alert(`${label} 已复制到剪贴板！`);
        });
    }

    // 复制所有 Token
    function copyAllTokens() {
        const allTokens = {
            workosSessionToken: capturedTokens.workosSessionToken,
            authorizationToken: capturedTokens.authorizationToken,
            clientKey: capturedTokens.clientKey,
            checksum: capturedTokens.checksum,
            sessionId: capturedTokens.sessionId,
            clientVersion: capturedTokens.clientVersion,
            configVersion: capturedTokens.configVersion,
            timezone: capturedTokens.timezone,
            cookies: capturedTokens.cookies
        };

        const tokenText = JSON.stringify(allTokens, null, 2);
        GM_setClipboard(tokenText, 'text', () => {
            alert('所有 Token 已复制到剪贴板！');
        });
    }

    // 清空 Token
    function clearTokens() {
        capturedTokens = {
            workosSessionToken: null,
            authorizationToken: null,
            clientKey: null,
            checksum: null,
            sessionId: null,
            clientVersion: null,
            configVersion: null,
            timezone: null,
            cookies: {},
            requests: []
        };
        updatePanel();
        alert('Token 数据已清空！');
    }

    // 监控 Cookie 变化
    function monitorCookies() {
        const originalDocumentCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
        
        Object.defineProperty(document, 'cookie', {
            get: function() {
                return originalDocumentCookie.get.call(this);
            },
            set: function(value) {
                // 检查是否是 Cursor 相关的 Cookie
                if (value.includes('WorkosCursorSessionToken') || 
                    value.includes('cursor') || 
                    value.includes('workos')) {
                    
                    const [name, ...parts] = value.split('=');
                    const cookieValue = parts.join('=').split(';')[0];
                    
                    capturedTokens.cookies[name] = cookieValue;
                    
                    // 特别处理 WorkosCursorSessionToken
                    if (name === 'WorkosCursorSessionToken') {
                        capturedTokens.workosSessionToken = cookieValue;
                        console.log('🍪 捕获到 WorkosCursorSessionToken:', cookieValue.substring(0, 50) + '...');
                    }
                    
                    updatePanel();
                }
                return originalDocumentCookie.set.call(this, value);
            }
        });
    }

    // 监控网络请求
    function monitorNetworkRequests() {
        // 监控 fetch 请求
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options = {}] = args;
            
            if (isCursorRequest(url)) {
                console.log('🔍 检测到 Cursor 请求:', url);
                
                const requestInfo = {
                    timestamp: new Date().toISOString(),
                    url: url,
                    method: options.method || 'GET',
                    headers: options.headers || {}
                };
                
                // 提取认证信息
                extractAuthInfo(requestInfo);
                capturedTokens.requests.push(requestInfo);
                updatePanel();
            }
            
            return originalFetch.apply(this, args);
        };

        // 监控 XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._cursorMonitor = {
                method: method,
                url: url,
                timestamp: new Date().toISOString()
            };
            return originalXHROpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(data) {
            if (this._cursorMonitor && isCursorRequest(this._cursorMonitor.url)) {
                console.log('🔍 检测到 Cursor XHR 请求:', this._cursorMonitor.url);
                
                const requestInfo = {
                    ...this._cursorMonitor,
                    headers: this.getAllResponseHeaders()
                };
                
                extractAuthInfo(requestInfo);
                capturedTokens.requests.push(requestInfo);
                updatePanel();
            }
            
            return originalXHRSend.apply(this, arguments);
        };
    }

    // 检查是否是 Cursor 相关请求
    function isCursorRequest(url) {
        const cursorDomains = [
            'cursor.com',
            'api.cursor.sh',
            'api2.cursor.sh',
            'api4.cursor.sh',
            'authentication.cursor.sh',
            'us-asia.gcpp.cursor.sh',
            'us-eu.gcpp.cursor.sh',
            'us-only.gcpp.cursor.sh'
        ];
        
        return cursorDomains.some(domain => url.includes(domain));
    }

    // 提取认证信息
    function extractAuthInfo(requestInfo) {
        if (requestInfo.headers) {
            // Authorization 头
            if (requestInfo.headers.Authorization) {
                const token = requestInfo.headers.Authorization.replace('Bearer ', '');
                capturedTokens.authorizationToken = token;
                console.log('🔑 提取到 Authorization Token:', token.substring(0, 50) + '...');
            }
            
            // Cursor 特有头部
            const cursorHeaders = {
                'x-client-key': 'clientKey',
                'x-cursor-checksum': 'checksum',
                'x-session-id': 'sessionId',
                'x-cursor-client-version': 'clientVersion',
                'x-cursor-config-version': 'configVersion',
                'x-cursor-timezone': 'timezone'
            };
            
            for (const [headerName, keyName] of Object.entries(cursorHeaders)) {
                if (requestInfo.headers[headerName]) {
                    const value = requestInfo.headers[headerName];
                    capturedTokens[keyName] = value;
                    console.log(`📋 提取到 ${keyName}:`, value);
                }
            }
        }
    }

    // 定期检查现有 Cookie
    function checkExistingCookies() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                if (name === 'WorkosCursorSessionToken') {
                    capturedTokens.workosSessionToken = value;
                    console.log('🍪 发现现有 WorkosCursorSessionToken:', value.substring(0, 50) + '...');
                } else if (name.includes('cursor') || name.includes('workos')) {
                    capturedTokens.cookies[name] = value;
                }
            }
        }
        updatePanel();
    }

    // 初始化
    function init() {
        console.log('🚀 Cursor Token 抓取器已启动');
        
        // 创建 UI
        createUI();
        
        // 监控 Cookie
        monitorCookies();
        
        // 监控网络请求
        monitorNetworkRequests();
        
        // 检查现有 Cookie
        setTimeout(checkExistingCookies, 1000);
        
        // 定期更新面板
        setInterval(updatePanel, 2000);
    }

    // 启动监控
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
