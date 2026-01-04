// ==UserScript==
// @name         移动端开发者工具（优化版）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为移动浏览器提供类似桌面版的开发者工具，优化性能和响应性，适应深浅色模式
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521570/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521570/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 样式定义
    const styles = `
        #mobile-devtools {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background-color: var(--devtools-bg-color, #fff);
            color: var(--devtools-text-color, #000);
            border-bottom: 1px solid var(--devtools-border-color, #ccc);
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        #mobile-devtools-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            background-color: var(--devtools-header-bg-color, #f0f0f0);
            border-bottom: 1px solid var(--devtools-border-color, #ccc);
        }
        #mobile-devtools-tabs {
            display: flex;
        }
        .mobile-devtools-tab {
            padding: 5px 10px;
            cursor: pointer;
            border-right: 1px solid var(--devtools-border-color, #ccc);
            color: var(--devtools-tab-text-color, #333);
        }
        .mobile-devtools-tab.active {
            background-color: var(--devtools-active-tab-bg-color, #fff);
            color: var(--devtools-active-tab-text-color, #000);
        }
        #mobile-devtools-content {
            height: calc(100% - 30px);
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }
        .mobile-devtools-panel {
            display: none;
            padding: 10px;
        }
        .mobile-devtools-panel.active {
            display: block;
        }
        #mobile-devtools-toggle {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 50px;
            height: 50px;
            background-color: var(--devtools-toggle-bg-color, #007bff);
            color: var(--devtools-toggle-text-color, #fff);
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            font-size: 16px;
            cursor: pointer;
            z-index: 10000;
            touch-action: none;
            user-select: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #mobile-devtools-arrow {
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 15px solid var(--devtools-toggle-bg-color, #007bff);
            cursor: pointer;
        }
        #network-requests {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
        }
        #network-requests th, #network-requests td {
            border: 1px solid var(--devtools-border-color, #ccc);
            padding: 5px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--devtools-text-color, #000);
        }
        #network-requests tr {
            cursor: pointer;
        }
        #network-requests tr:hover {
            background-color: var(--devtools-hover-bg-color, #f5f5f5);
        }
        #network-requests tr.active {
            background-color: var(--devtools-active-row-bg-color, #e6f3ff);
        }
        .network-detail-row td {
            padding: 0 !important;
        }
        .network-detail {
            padding: 10px;
            overflow-x: hidden;
            overflow-y: auto;
            max-height: 300px;
        }
        .network-detail p {
            word-wrap: break-word;
            word-break: break-all;
            margin: 5px 0;
        }
        .network-detail pre, .network-detail .response-body {
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;
            background-color: var(--devtools-code-bg-color, #f0f0f0);
            color: var(--devtools-code-text-color, #000);
            padding: 10px;
            border: 1px solid var(--devtools-border-color, #ccc);
            margin: 5px 0;
            max-height: 200px;
            overflow-y: auto;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --devtools-bg-color: #1e1e1e;
                --devtools-text-color: #ffffff;
                --devtools-border-color: #444;
                --devtools-header-bg-color: #2d2d2d;
                --devtools-tab-text-color: #ccc;
                --devtools-active-tab-bg-color: #3c3c3c;
                --devtools-active-tab-text-color: #fff;
                --devtools-toggle-bg-color: #0056b3;
                --devtools-toggle-text-color: #fff;
                --devtools-hover-bg-color: #2a2a2a;
                --devtools-active-row-bg-color: #264f78;
                --devtools-code-bg-color: #2d2d2d;
                --devtools-code-text-color: #d4d4d4;
            }
        }
    `;
    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    // HTML结构
    const devToolsHTML = `
        <div id="mobile-devtools">
            <div id="mobile-devtools-header">
                <div id="mobile-devtools-tabs">
                    <div class="mobile-devtools-tab active" data-tab="elements">元素</div>
                    <div class="mobile-devtools-tab" data-tab="console">控制台</div>
                    <div class="mobile-devtools-tab" data-tab="network">网络</div>
                    <div class="mobile-devtools-tab" data-tab="resources">资源</div>
                    <div class="mobile-devtools-tab" data-tab="storage">存储</div>
                </div>
            </div>
            <div id="mobile-devtools-content">
                <div class="mobile-devtools-panel active" id="elements-panel">
                    <div id="element-tree"></div>
                </div>
                <div class="mobile-devtools-panel" id="console-panel">
                    <div id="console-output"></div>
                    <input type="text" id="console-input" placeholder="输入JavaScript代码">
                </div>
                <div class="mobile-devtools-panel" id="network-panel">
                    <table id="network-requests">
                        <thead>
                            <tr>
                                <th style="width: 5%;">ID</th>
                                <th style="width: 30%;">名称</th>
                                <th style="width: 10%;">方法</th>
                                <th style="width: 10%;">状态</th>
                                <th style="width: 15%;">类型</th>
                                <th style="width: 15%;">大小</th>
                                <th style="width: 15%;">时间</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="mobile-devtools-panel" id="resources-panel">
                    <h3>资源列表</h3>
                    <ul id="resource-list"></ul>
                </div>
                <div class="mobile-devtools-panel" id="storage-panel">
                    <h3>本地存储</h3>
                    <div id="local-storage"></div>
                    <h3>会话存储</h3>
                    <div id="session-storage"></div>
                    <h3>Cookies</h3>
                    <div id="cookies"></div>
                </div>
            </div>
            <div id="mobile-devtools-arrow"></div>
        </div>
        <div id="mobile-devtools-toggle">开发</div>
    `;
    // 将HTML插入到页面中
    document.body.insertAdjacentHTML('beforeend', devToolsHTML);
    // 获取必要的DOM元素
    const devTools = document.getElementById('mobile-devtools');
    const devToolsToggle = document.getElementById('mobile-devtools-toggle');
    const devToolsArrow = document.getElementById('mobile-devtools-arrow');
    const tabs = document.querySelectorAll('.mobile-devtools-tab');
    const panels = document.querySelectorAll('.mobile-devtools-panel');
    // 跟踪最新的网络请求行
    let latestNetworkRow = null;
    // 优化1: 使用事件委托来处理标签切换
    document.getElementById('mobile-devtools-tabs').addEventListener('click', handleTabClick);
    // 优化2: 使用防抖函数来优化频繁触发的函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    // 优化3: 使用 requestAnimationFrame 来优化滚动和动画
    function smoothScroll(element, to, duration) {
        const start = element.scrollTop;
        const change = to - start;
        const startTime = performance.now();
        function animateScroll(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            element.scrollTop = start + change * easeInOutQuad(progress);
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        requestAnimationFrame(animateScroll);
    }
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    // 优化4: 优化触摸事件处理
    let touchStartX, touchStartY, touchStartTime;
let isDragging = false;
const CLICK_DELAY = 300; // 毫秒
const MOVE_THRESHOLD = 10; // 像素
devToolsToggle.addEventListener('touchstart', handleTouchStart, { passive: true });
devToolsToggle.addEventListener('touchmove', handleTouchMove, { passive: false });
devToolsToggle.addEventListener('touchend', handleTouchEnd);
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    isDragging = false;
}
function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    if (Math.abs(deltaX) > MOVE_THRESHOLD || Math.abs(deltaY) > MOVE_THRESHOLD) {
        isDragging = true;
        // 移动逻辑
        const newLeft = devToolsToggle.offsetLeft + deltaX;
        const newTop = devToolsToggle.offsetTop + deltaY;
        const maxX = window.innerWidth - devToolsToggle.offsetWidth;
        const maxY = window.innerHeight - devToolsToggle.offsetHeight;
        devToolsToggle.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
        devToolsToggle.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
        touchStartX = touchEndX;
        touchStartY = touchEndY;
    }
    e.preventDefault(); // 防止页面滚动
}
function handleTouchEnd(e) {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    if (!isDragging && touchDuration < CLICK_DELAY) {
        toggleDevTools(e);
    }
    touchStartX = null;
    touchStartY = null;
    isDragging = false;
}
// 显示/隐藏开发者工具
function toggleDevTools(e) {
    e.preventDefault();
    e.stopPropagation();
    if (devTools.style.display === 'none' || devTools.style.display === '') {
        devTools.style.display = 'block';
        devToolsToggle.textContent = '关闭';
    } else {
        devTools.style.display = 'none';
        devToolsToggle.textContent = '开发';
    }
}
    // 收起/展开开发者工具面板
    devToolsArrow.addEventListener('click', toggleDevToolsPanel);
    devToolsArrow.addEventListener('touchend', toggleDevToolsPanel);
    function toggleDevToolsPanel(e) {
        e.preventDefault();
        e.stopPropagation();
        if (devTools.style.height === '50%' || devTools.style.height === '') {
            devTools.style.height = '30px';
            devToolsArrow.style.transform = 'translateX(-50%) rotate(180deg)';
        } else {
            devTools.style.height = '50%';
            devToolsArrow.style.transform = 'translateX(-50%)';
        }
    }
    // 标签切换功能
    function handleTabClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickedTab = e.target;
        
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        clickedTab.classList.add('active');
        const panelId = `${clickedTab.dataset.tab}-panel`;
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.classList.add('active');
            
            // 如果切换到网络面板，滚动到最新的请求
            if (panelId === 'network-panel') {
                setTimeout(scrollToLatestRequest, 0);
            }
        }
    }
    // 滚动到最新的请求
    function scrollToLatestRequest() {
        if (latestNetworkRow) {
            latestNetworkRow.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
    // 确保面板内容可以滚动
    const mobileDevToolsContent = document.getElementById('mobile-devtools-content');
    mobileDevToolsContent.style.overflowY = 'auto';
    mobileDevToolsContent.style.webkitOverflowScrolling = 'touch';
    // 防止面板内容的滚动传播到整个页面
    mobileDevToolsContent.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: false });
    // 元素检查功能
    function inspectElement(element, level = 0) {
        const elementInfo = document.createElement('div');
        elementInfo.style.marginLeft = `${level * 20}px`;
        elementInfo.textContent = `<${element.tagName.toLowerCase()}${element.id ? ` id="${element.id}"` : ''}${element.className ? ` class="${element.className}"` : ''}>`;
        document.getElementById('element-tree').appendChild(elementInfo);
        Array.from(element.children).forEach(child => {
            inspectElement(child, level + 1);
        });
    }
    inspectElement(document.body);
    // 控制台功能
    const consoleOutput = document.getElementById('console-output');
    const consoleInput = document.getElementById('console-input');
    consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            try {
                const result = eval(consoleInput.value);
                consoleOutput.innerHTML += `<div>> ${consoleInput.value}</div><div>${result}</div>`;
            } catch (error) {
                consoleOutput.innerHTML += `<div>> ${consoleInput.value}</div><div style="color: red;">${error}</div>`;
            }
            consoleInput.value = '';
        }
    });
    // 重写console.log方法
    const originalConsoleLog = console.log;
    console.log = function(...args) {
        consoleOutput.innerHTML += `<div>${args.join(' ')}</div>`;
        originalConsoleLog.apply(console, args);
    };
    // 网络请求监控
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest.prototype.open;
    let requestId = 0;
    // 拦截 fetch 请求
    window.fetch = function(...args) {
        const id = requestId++;
        const startTime = Date.now();
        console.log(`Fetch request ${id} started:`, args);
        return originalFetch.apply(this, args).then(response => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const clone = response.clone();
            
            clone.text().then(body => {
                console.log(`Fetch request ${id} completed:`, response);
                addNetworkRequest(id, args[0], args[1]?.method || 'GET', response.status, response.headers.get('content-type'), body.length, duration, body, response.headers);
            }).catch(error => {
                console.error(`Error cloning response for fetch request ${id}:`, error);
                addNetworkRequest(id, args[0], args[1]?.method || 'GET', response.status, response.headers.get('content-type'), 'Unknown', duration, 'Unable to read response body', response.headers);
            });
            
            return response;
        }).catch(error => {
            console.error(`Fetch request ${id} failed:`, error);
            addNetworkRequest(id, args[0], args[1]?.method || 'GET', 'Failed', 'N/A', 'N/A', Date.now() - startTime, error.message, new Headers());
            throw error;
        });
    };
    // 拦截 XMLHttpRequest
    window.XMLHttpRequest.prototype.open = function(...args) {
        const id = requestId++;
        const startTime = Date.now();
        console.log(`XHR request ${id} started:`, args);
        this.addEventListener('load', function() {
            const endTime = Date.now();
            const duration = endTime - startTime;
            console.log(`XHR request ${id} completed:`, this);
            addNetworkRequest(id, args[1], args[0], this.status, this.getResponseHeader('Content-Type'), this.responseText.length, duration, this.responseText, this.getAllResponseHeaders());
        });
        this.addEventListener('error', function() {
            console.error(`XHR request ${id} failed:`, this);
            addNetworkRequest(id, args[1], args[0], 'Failed', 'N/A', 'N/A', Date.now() - startTime, 'Request failed', this.getAllResponseHeaders());
        });
        return originalXHR.apply(this, args);
    };
    function addNetworkRequest(id, url, method, status, type, size, time, body, headers) {
        const networkRequests = document.querySelector('#network-requests tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="width: 5%;">${id}</td>
            <td style="width: 30%;">${truncateString(url, 30)}</td>
            <td style="width: 10%;">${method}</td>
            <td style="width: 10%;">${status}</td>
            <td style="width: 15%;">${type || 'unknown'}</td>
            <td style="width: 15%;">${typeof size === 'number' ? formatSize(size) : size}</td>
            <td style="width: 15%;">${time} ms</td>
        `;
        row.addEventListener('click', () => toggleNetworkDetail(row, id, url, method, status, type, size, time, body, headers));
        networkRequests.appendChild(row);
        
        // 更新最新的网络请求行
        latestNetworkRow = row;
    }
    function toggleNetworkDetail(row, id, url, method, status, type, size, time, body, headers) {
        console.log('Request details:', { id, url, method, status, type, size, time, body, headers });
        
        // 检查是否已存在详情行
        let detailRow = row.nextElementSibling;
        if (detailRow && detailRow.classList.contains('network-detail-row')) {
            // 如果详情行已存在，则切换其显示状态
            if (detailRow.style.display === 'none') {
                detailRow.style.display = 'table-row';
                row.classList.add('active');
            } else {
                detailRow.style.display = 'none';
                row.classList.remove('active');
            }
        } else {
            // 如果详情行不存在，则创建新的详情行
            detailRow = document.createElement('tr');
            detailRow.classList.add('network-detail-row');
            detailRow.innerHTML = `
                <td colspan="7">
                    <div class="network-detail">
                        <h3>请求详情</h3>
                        <p><strong>ID:</strong> ${id}</p>
                        <p><strong>URL:</strong> ${url}</p>
                        <p><strong>方法:</strong> ${method}</p>
                        <p><strong>状态:</strong> ${status}</p>
                        <p><strong>类型:</strong> ${type || 'unknown'}</p>
                        <p><strong>大小:</strong> ${typeof size === 'number' ? formatSize(size) : size}</p>
                        <p><strong>时间:</strong> ${time} ms</p>
                        <h4>响应头:</h4>
                        <pre>${formatHeaders(headers)}</pre>
                        <h4>响应体:</h4>
                        <div class="response-body">${formatBody(body, type)}</div>
                    </div>
                </td>
            `;
            row.parentNode.insertBefore(detailRow, row.nextSibling);
            row.classList.add('active');
        }
    }
    function truncateString(str, maxLength) {
        if (str.length <= maxLength) return str;
        return str.substr(0, maxLength - 3) + '...';
    }
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    function formatHeaders(headers) {
        if (typeof headers === 'string') {
            return headers;
        }
        return Array.from(headers).map(([key, value]) => `${key}: ${value}`).join('\n');
    }
    function formatBody(body, type) {
        if (typeof body !== 'string') {
            return 'Unable to display response body (not a string)';
        }
        if (body.length > 100000) {
            return `<div>响应体过大，仅显示前 100000 个字符：</div>${escapeHTML(body.substr(0, 100000))}...`;
        }
        if (type && type.includes('json')) {
            try {
                const jsonObj = JSON.parse(body);
                return `<pre>${escapeHTML(JSON.stringify(jsonObj, null, 2))}</pre>`;
            } catch (e) {
                // 如果解析失败，按普通文本处理
            }
        }
        return escapeHTML(body);
    }
    function escapeHTML(str) {
        if (typeof str !== 'string') {
            return 'Unable to escape HTML (not a string)';
        }
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    // 资源列表
    function updateResourceList() {
        const resourceList = document.getElementById('resource-list');
        resourceList.innerHTML = '';
        performance.getEntriesByType('resource').forEach(resource => {
            const li = document.createElement('li');
            li.textContent = `${resource.name} (${resource.initiatorType})`;
            resourceList.appendChild(li);
        });
    }
    updateResourceList();
    // 存储信息
    function updateStorageInfo() {
        const localStorage = document.getElementById('local-storage');
        const sessionStorage = document.getElementById('session-storage');
        const cookies = document.getElementById('cookies');
        localStorage.innerHTML = '';
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            localStorage.innerHTML += `<div>${key}: ${window.localStorage.getItem(key)}</div>`;
        }
        sessionStorage.innerHTML = '';
        for (let i = 0; i < window.sessionStorage.length; i++) {
            const key = window.sessionStorage.key(i);
            sessionStorage.innerHTML += `<div>${key}: ${window.sessionStorage.getItem(key)}</div>`;
        }
        cookies.innerHTML = document.cookie.split(';').map(cookie => `<div>${cookie.trim()}</div>`).join('');
    }
    updateStorageInfo();
    // 添加深色模式检测和切换功能
    function updateColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
    // 初始化时调用一次
    updateColorScheme();
    // 监听系统颜色方案变化
    window.matchMedia('(prefers-color-scheme: dark)').addListener(updateColorScheme);
})();