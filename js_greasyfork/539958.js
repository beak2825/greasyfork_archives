// ==UserScript==
// @name         Ajax请求监听器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监听Ajax请求，按F3启动/关闭
// @author       xiaoma
// @match         *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539958/Ajax%E8%AF%B7%E6%B1%82%E7%9B%91%E5%90%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539958/Ajax%E8%AF%B7%E6%B1%82%E7%9B%91%E5%90%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        hotkey: 'F3', // 激活热键
        maxRecords: 200, // 最大记录数
        autoScroll: true // 自动滚动到最新记录
    };

    // 状态管理
    let isListening = false;
    let ajaxRecords = [];
    let recordIndex = 0;
    let monitorPanel = null;
    let currentFilters = {
        searchText: '',
        method: 'all',
        status: 'all',
        searchReverse: false,
        methodReverse: false,
        statusReverse: false
    };

    // 原始Ajax方法备份
    const originalXHR = window.XMLHttpRequest;
    const originalFetch = window.fetch;

    // 创建监控面板
    function createMonitorPanel() {
        if (monitorPanel) return;

        // 创建面板容器
        monitorPanel = document.createElement('div');
        monitorPanel.id = 'ajax-monitor-panel';
        monitorPanel.innerHTML = `
            <div class="ajax-monitor-header">
                <h3>🔍 Ajax监听器</h3>
                <div class="ajax-monitor-controls">
                    <button id="clear-records" title="清空所有记录">🗑️ 清空</button>
                    <button id="export-records" title="导出为JSON文件">📥 导出</button>
                    <button id="toggle-auto-scroll" title="开启/关闭自动滚动">📜 滚动</button>
                    <button id="close-monitor" title="关闭监听器">❌ 关闭</button>
                </div>
            </div>
            <div class="ajax-monitor-stats">
                <span>📊 总请求: <span id="total-count">0</span></span>
                <span>✅ 成功: <span id="success-count">0</span></span>
                <span>❌ 失败: <span id="error-count">0</span></span>
                <span>⏱️ 平均耗时: <span id="avg-time">0</span>ms</span>
            </div>
            <div class="ajax-monitor-filters">
                <div class="filter-group">
                    <label>🔍 搜索:</label>
                    <input type="text" id="filter-search" placeholder="搜索URL、状态码..." />
                    <button id="search-reverse" class="reverse-btn" title="启用反向搜索，排除匹配的记录">🚫 反向</button>
                </div>
                <div class="filter-group">
                    <label>📝 方法:</label>
                    <select id="filter-method">
                        <option value="all">全部</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                    <button id="method-reverse" class="reverse-btn" title="启用反向方法过滤，排除选中的方法">🚫 反向</button>
                </div>
                <div class="filter-group">
                    <label>📊 状态:</label>
                    <select id="filter-status">
                        <option value="all">全部</option>
                        <option value="success">成功 (2xx)</option>
                        <option value="error">失败 (4xx/5xx)</option>
                        <option value="pending">进行中</option>
                    </select>
                    <button id="status-reverse" class="reverse-btn" title="启用反向状态过滤，排除选中的状态">🚫 反向</button>
                </div>
                <div class="filter-group">
                    <button id="clear-filters" title="清空所有过滤条件">🗑️ 清空过滤</button>
                </div>
            </div>
            <div class="ajax-monitor-content">
                <div class="ajax-records-list" id="ajax-records-list">
                    <div class="ajax-record-header">
                        <div class="col-time">时间</div>
                        <div class="col-method">方法</div>
                        <div class="col-url">URL</div>
                        <div class="col-status">状态</div>
                        <div class="col-duration">耗时</div>
                        <div class="col-actions">操作</div>
                    </div>
                </div>
            </div>
            <div class="ajax-monitor-footer">
                <span>💡 提示: 按 F3 关闭监听 | 最多显示 ${CONFIG.maxRecords} 条记录</span>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #ajax-monitor-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 900px;
                max-height: 80vh;
                background: #fff;
                border: 2px solid #007acc;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,122,204,0.2);
                z-index: 2147483647;
                font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
                font-size: 13px;
                backdrop-filter: blur(10px);
                resize: both;
                overflow: hidden;
                min-width: 600px;
                min-height: 400px;
            }

            /* 缩放指示器 */
            #ajax-monitor-panel::after {
                content: '';
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 16px;
                height: 16px;
                background: linear-gradient(-45deg, transparent 40%, #007acc 40%, #007acc 60%, transparent 60%);
                cursor: nw-resize;
                opacity: 0.6;
                border-radius: 0 0 10px 0;
            }

            #ajax-monitor-panel:hover::after {
                opacity: 1;
            }

            .ajax-monitor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: linear-gradient(135deg, #007acc, #0099ff);
                color: white;
                border-radius: 10px 10px 0 0;
                cursor: move;
            }

            .ajax-monitor-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .ajax-monitor-controls button {
                margin-left: 8px;
                padding: 6px 12px;
                border: none;
                background: rgba(255,255,255,0.2);
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                backdrop-filter: blur(5px);
            }

            .ajax-monitor-controls button:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-1px);
            }

            .ajax-monitor-stats {
                padding: 10px 16px;
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
                font-size: 12px;
                display: flex;
                gap: 20px;
            }

            .ajax-monitor-stats span {
                color: #495057;
                font-weight: 500;
            }

            .ajax-monitor-filters {
                padding: 12px 16px;
                background: #ffffff;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                gap: 16px;
                align-items: center;
                flex-wrap: wrap;
            }

            .filter-group {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .filter-group label {
                font-size: 12px;
                color: #495057;
                font-weight: 500;
                white-space: nowrap;
            }

            .filter-group input,
            .filter-group select {
                padding: 6px 10px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 12px;
                background: white;
                min-width: 120px;
                transition: all 0.2s;
            }

            .filter-group input:focus,
            .filter-group select:focus {
                outline: none;
                border-color: #007acc;
                box-shadow: 0 0 0 2px rgba(0,122,204,0.1);
            }

            #clear-filters {
                padding: 6px 12px;
                border: 1px solid #6c757d;
                background: #f8f9fa;
                color: #495057;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }

            #clear-filters:hover {
                background: #e9ecef;
                border-color: #495057;
            }

            .reverse-btn {
                padding: 4px 8px;
                border: 1px solid #6c757d;
                background: #f8f9fa;
                color: #495057;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                margin-left: 4px;
                transition: all 0.2s;
                white-space: nowrap;
            }

            .reverse-btn:hover {
                background: #e9ecef;
                border-color: #495057;
            }

            .reverse-btn.active {
                background: #fd7e14;
                color: white;
                border-color: #fd7e14;
                box-shadow: 0 0 0 2px rgba(253,126,20,0.2);
            }

            .reverse-btn.active:hover {
                background: #e8690b;
                border-color: #e8690b;
            }

            .ajax-monitor-content {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 400px;
            }

            .ajax-records-list {
                flex: 1;
                overflow-y: auto;
                overflow-x:hidden;
                max-height: calc(80vh - 160px);
            }

            .ajax-record-header {
                display: grid;
                grid-template-columns: 80px 60px 1fr 80px 80px 160px;
                gap: 8px;
                padding: 10px 16px;
                background: #e9ecef;
                border-bottom: 2px solid #dee2e6;
                font-weight: 600;
                font-size: 12px;
                color: #495057;
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .ajax-record {
                display: grid;
                grid-template-columns: 80px 60px 1fr 80px 80px 160px;
                gap: 8px;
                padding: 10px 16px;
                border-bottom: 1px solid #e9ecef;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                position: relative;
            }

            .ajax-record:hover {
                background: #f8f9fa;
                transform: translateX(2px);
            }

            .ajax-record.success {
                border-left: 4px solid #28a745;
            }

            .ajax-record.error {
                border-left: 4px solid #dc3545;
            }

            .ajax-record.pending {
                border-left: 4px solid #ffc107;
            }

            .ajax-record-url {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-family: 'Courier New', monospace;
                min-width: 0; /* 确保在flex/grid布局中正确处理文本溢出 */
            }

            .ajax-monitor-footer {
                padding: 8px 16px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
                font-size: 11px;
                color: #6c757d;
                text-align: center;
            }

            .ajax-detail-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 2147483648;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(3px);
            }

            .ajax-detail-content {
                background: #fff;
                width: 95%;
                max-width: 1200px;
                max-height: 90%;
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }

            .ajax-detail-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, #007acc, #0099ff);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .ajax-detail-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .ajax-detail-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
                background: #f8f9fa;
            }

            .ajax-detail-section {
                margin-bottom: 24px;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .ajax-detail-section h4 {
                margin: 0;
                padding: 12px 16px;
                color: #495057;
                font-size: 14px;
                font-weight: 600;
                background: #e9ecef;
                border-bottom: 1px solid #dee2e6;
            }

            .ajax-detail-code {
                padding: 16px;
                overflow-x: auto;
                white-space: pre-wrap;
                word-break: break-all;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.5;
                max-height: 300px;
                overflow-y: auto;
                background: #f8f9fa;
            }

            .close-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }

            .close-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .view-btn {
                background: #007acc;
                color: white;
                border: none;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }

            .view-btn:hover {
                background: #0099ff;
                transform: scale(1.05);
            }

            .copy-btn {
                background: #17a2b8;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                margin-left: 4px;
            }

            .resend-btn {
                background: #28a745;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                margin-left: 4px;
            }

            .resend-btn:hover {
                background: #218838;
                transform: scale(1.05);
            }

            .curl-btn {
                background: #6f42c1;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                margin-left: 4px;
            }

            .curl-btn:hover {
                background: #5a32a3;
                transform: scale(1.05);
            }

            .status-success {
                color: #28a745;
                font-weight: 600;
            }

            .status-error {
                color: #dc3545;
                font-weight: 600;
            }

            .status-pending {
                color: #ffc107;
                font-weight: 600;
            }

            .duration-fast {
                color: #28a745;
            }

            .duration-medium {
                color: #ffc107;
            }

            .duration-slow {
                color: #dc3545;
            }

            /* 滚动条美化 */
            .ajax-records-list::-webkit-scrollbar,
            .ajax-detail-code::-webkit-scrollbar {
                width: 8px;
            }

            .ajax-records-list::-webkit-scrollbar-track,
            .ajax-detail-code::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }

            .ajax-records-list::-webkit-scrollbar-thumb,
            .ajax-detail-code::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }

            .ajax-records-list::-webkit-scrollbar-thumb:hover,
            .ajax-detail-code::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }

            /* 编辑请求模态框样式 */
            .ajax-edit-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.6);
                z-index: 2147483649;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(3px);
            }

            .ajax-edit-content {
                background: #fff;
                width: 95%;
                max-width: 800px;
                max-height: 90%;
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }

            .ajax-edit-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
                background: #f8f9fa;
            }

            .ajax-edit-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .ajax-edit-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .ajax-edit-group label {
                font-weight: 600;
                color: #495057;
                font-size: 14px;
            }

            .ajax-edit-group input,
            .ajax-edit-group select,
            .ajax-edit-group textarea {
                padding: 10px 12px;
                border: 1px solid #ced4da;
                border-radius: 6px;
                font-size: 13px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            }

            .ajax-edit-group textarea {
                min-height: 120px;
                resize: vertical;
            }

            .ajax-edit-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                padding: 16px 20px;
                background: #f8f9fa;
                border-top: 1px solid #dee2e6;
            }

            .ajax-edit-actions button {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s;
            }

            .send-btn {
                background: #007acc;
                color: white;
            }

            .send-btn:hover {
                background: #0099ff;
            }

            .cancel-btn {
                background: #6c757d;
                color: white;
            }

            .cancel-btn:hover {
                background: #5a6268;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(monitorPanel);

        // 使面板可拖拽
        makeDraggable();

        // 绑定事件
        bindPanelEvents();
    }

    // 使面板可拖拽
    function makeDraggable() {
        const header = monitorPanel.querySelector('.ajax-monitor-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                monitorPanel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // 绑定面板事件
    function bindPanelEvents() {
        // 清空记录
        document.getElementById('clear-records').onclick = () => {
            ajaxRecords = [];
            recordIndex = 0;
            // 重置过滤器
            currentFilters = {
                searchText: '',
                method: 'all',
                status: 'all',
                searchReverse: false,
                methodReverse: false,
                statusReverse: false
            };
            // 重置过滤器UI
            if (document.getElementById('filter-search')) {
                document.getElementById('filter-search').value = '';
                document.getElementById('filter-method').value = 'all';
                document.getElementById('filter-status').value = 'all';

                // 重置反向按钮状态
                const searchReverseBtn = document.getElementById('search-reverse');
                const methodReverseBtn = document.getElementById('method-reverse');
                const statusReverseBtn = document.getElementById('status-reverse');
                if (searchReverseBtn) searchReverseBtn.classList.remove('active');
                if (methodReverseBtn) methodReverseBtn.classList.remove('active');
                if (statusReverseBtn) statusReverseBtn.classList.remove('active');
            }
            updateRecordsList();
            updateStats();
        };

        // 导出数据
        document.getElementById('export-records').onclick = exportRecords;

        // 切换自动滚动
        document.getElementById('toggle-auto-scroll').onclick = () => {
            CONFIG.autoScroll = !CONFIG.autoScroll;
            const btn = document.getElementById('toggle-auto-scroll');
            btn.style.background = CONFIG.autoScroll ? 'rgba(40,167,69,0.3)' : 'rgba(255,255,255,0.2)';
        };

        // 关闭监控
        document.getElementById('close-monitor').onclick = stopMonitoring;

        // 绑定过滤器事件
        bindFilterEvents();
    }

    // 过滤记录
    function filterRecords() {
        return ajaxRecords.filter(record => {
            // 搜索文本过滤
            if (currentFilters.searchText) {
                const searchText = currentFilters.searchText.toLowerCase();
                const matchUrl = record.url.toLowerCase().includes(searchText);
                const matchStatus = record.status.toString().includes(searchText);
                const matchMethod = record.method.toLowerCase().includes(searchText);
                const hasMatch = matchUrl || matchStatus || matchMethod;

                if (currentFilters.searchReverse) {
                    // 反向搜索：排除匹配的
                    if (hasMatch) {
                        return false;
                    }
                } else {
                    // 正向搜索：包含匹配的
                    if (!hasMatch) {
                        return false;
                    }
                }
            }

            // 方法过滤
            if (currentFilters.method !== 'all') {
                const methodMatches = record.method === currentFilters.method;

                if (currentFilters.methodReverse) {
                    // 反向方法过滤：排除选中的方法
                    if (methodMatches) {
                        return false;
                    }
                } else {
                    // 正向方法过滤：只显示选中的方法
                    if (!methodMatches) {
                        return false;
                    }
                }
            }

            // 状态过滤
            if (currentFilters.status !== 'all') {
                let statusMatches = false;
                switch (currentFilters.status) {
                    case 'success':
                        statusMatches = record.success && record.status >= 200 && record.status < 300;
                        break;
                    case 'error':
                        statusMatches = !record.success && record.status >= 400;
                        break;
                    case 'pending':
                        statusMatches = record.status === 0;
                        break;
                }

                if (currentFilters.statusReverse) {
                    // 反向状态过滤：排除选中的状态
                    if (statusMatches) {
                        return false;
                    }
                } else {
                    // 正向状态过滤：只显示选中的状态
                    if (!statusMatches) {
                        return false;
                    }
                }
            }

            return true;
        });
    }

    // 更新记录列表
    function updateRecordsList() {
        const listContainer = document.getElementById('ajax-records-list');
        const filteredRecords = filterRecords();

        const recordsHtml = filteredRecords.map(record => {
            const statusClass = record.success ? 'success' : 'error';
            const durationClass = record.duration < 200 ? 'duration-fast' :
                                  record.duration < 1000 ? 'duration-medium' : 'duration-slow';

            return `
                <div class="ajax-record ${statusClass}" onclick="showRecordDetail(${record.id})">
                    <div>${record.time}</div>
                    <div><span class="method-${record.method.toLowerCase()}">${record.method}</span></div>
                    <div class="ajax-record-url" title="${record.url}">${record.url}</div>
                    <div class="${record.success ? 'status-success' : 'status-error'}">${record.status}</div>
                    <div class="${durationClass}">${record.duration}ms</div>
                    <div>
                        <button class="view-btn" onclick="event.stopPropagation(); showRecordDetail(${record.id})">详情</button>
                        <button class="copy-btn" onclick="event.stopPropagation(); copyUrl('${record.url}')" title="复制URL">📋</button>
                        <button class="resend-btn" onclick="event.stopPropagation(); editAndResendRequest(${record.id})" title="修改并重发">🔄</button>
                        <button class="curl-btn" onclick="event.stopPropagation(); copyCurlCommand(${record.id})" title="复制curl">📜</button>
                    </div>
                </div>
            `;
        }).join('');

        const noResultsHtml = filteredRecords.length === 0 && ajaxRecords.length > 0 ?
            `<div style="padding: 20px; text-align: center; color: #6c757d;">
                <div>🔍 没有找到符合条件的请求</div>
                <div style="font-size: 11px; margin-top: 4px;">尝试调整过滤条件或清空过滤器</div>
            </div>` : '';

        listContainer.innerHTML = `
            <div class="ajax-record-header">
                <div class="col-time">时间</div>
                <div class="col-method">方法</div>
                <div class="col-url">URL</div>
                <div class="col-status">状态</div>
                <div class="col-duration">耗时</div>
                <div class="col-actions">操作</div>
            </div>
            ${recordsHtml}
            ${noResultsHtml}
        `;

        if (CONFIG.autoScroll && filteredRecords.length > 0) {
            listContainer.scrollTop = listContainer.scrollHeight;
        }

        // 更新过滤器状态显示
        updateFilterStatus(filteredRecords.length);
    }

    // 绑定过滤器事件
    function bindFilterEvents() {
        // 搜索框
        const searchInput = document.getElementById('filter-search');
        searchInput.addEventListener('input', (e) => {
            currentFilters.searchText = e.target.value;
            updateRecordsList();
        });

        // 方法选择器
        const methodSelect = document.getElementById('filter-method');
        methodSelect.addEventListener('change', (e) => {
            currentFilters.method = e.target.value;
            updateRecordsList();
        });

        // 状态选择器
        const statusSelect = document.getElementById('filter-status');
        statusSelect.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            updateRecordsList();
        });

        // 反向搜索按钮
        const searchReverseBtn = document.getElementById('search-reverse');
        searchReverseBtn.addEventListener('click', () => {
            currentFilters.searchReverse = !currentFilters.searchReverse;
            searchReverseBtn.classList.toggle('active', currentFilters.searchReverse);
            updateRecordsList();
        });

        // 反向方法按钮
        const methodReverseBtn = document.getElementById('method-reverse');
        methodReverseBtn.addEventListener('click', () => {
            currentFilters.methodReverse = !currentFilters.methodReverse;
            methodReverseBtn.classList.toggle('active', currentFilters.methodReverse);
            updateRecordsList();
        });

        // 反向状态按钮
        const statusReverseBtn = document.getElementById('status-reverse');
        statusReverseBtn.addEventListener('click', () => {
            currentFilters.statusReverse = !currentFilters.statusReverse;
            statusReverseBtn.classList.toggle('active', currentFilters.statusReverse);
            updateRecordsList();
        });

        // 清空过滤器
        document.getElementById('clear-filters').addEventListener('click', () => {
            currentFilters = {
                searchText: '',
                method: 'all',
                status: 'all',
                searchReverse: false,
                methodReverse: false,
                statusReverse: false
            };

            // 重置UI
            searchInput.value = '';
            methodSelect.value = 'all';
            statusSelect.value = 'all';

            // 重置反向按钮状态
            searchReverseBtn.classList.remove('active');
            methodReverseBtn.classList.remove('active');
            statusReverseBtn.classList.remove('active');

            updateRecordsList();
        });
    }

    // 更新过滤器状态显示
    function updateFilterStatus(filteredCount) {
        const totalCount = ajaxRecords.length;
        const isFiltered = currentFilters.searchText ||
                          currentFilters.method !== 'all' ||
                          currentFilters.status !== 'all';

        const hasReverse = currentFilters.searchReverse ||
                          currentFilters.methodReverse ||
                          currentFilters.statusReverse;

        if (isFiltered && filteredCount !== totalCount) {
            let filterText = '(已过滤';
            if (hasReverse) {
                filterText += ' 🚫反向';
            }
            filterText += ')';

            document.getElementById('total-count').innerHTML =
                `${filteredCount} / ${totalCount} <span style="color: #007acc; font-size: 10px;">${filterText}</span>`;
        } else {
            document.getElementById('total-count').textContent = totalCount;
        }
    }

    // 复制URL到剪贴板
    window.copyUrl = function(url) {
        navigator.clipboard.writeText(url).then(() => {
            console.log('📋 URL已复制到剪贴板:', url);
        }).catch(err => {
            console.error('复制失败:', err);
        });
    };

    // 复制curl命令
    window.copyCurlCommand = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const curlCommand = generateCurlCommand(record);
        navigator.clipboard.writeText(curlCommand).then(() => {
            console.log('📜 cURL命令已复制到剪贴板');
            // 显示成功提示
            showToast('cURL命令已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
        });
    };

    // 编辑并重发请求
    window.editAndResendRequest = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const bodyFormat = record.bodyFormat || 'text';
        const modal = document.createElement('div');
        modal.className = 'ajax-edit-modal';
        modal.innerHTML = `
            <div class="ajax-edit-content">
                <div class="ajax-detail-header">
                    <h3>🔄 修改并重发请求</h3>
                    <button class="close-btn" onclick="this.closest('.ajax-edit-modal').remove()">关闭</button>
                </div>
                <div class="ajax-edit-body">
                    <form class="ajax-edit-form" id="edit-form-${recordId}">
                        <div class="ajax-edit-group">
                            <label for="edit-method-${recordId}">请求方法</label>
                            <select id="edit-method-${recordId}" name="method">
                                <option value="GET" ${record.method === 'GET' ? 'selected' : ''}>GET</option>
                                <option value="POST" ${record.method === 'POST' ? 'selected' : ''}>POST</option>
                                <option value="PUT" ${record.method === 'PUT' ? 'selected' : ''}>PUT</option>
                                <option value="DELETE" ${record.method === 'DELETE' ? 'selected' : ''}>DELETE</option>
                                <option value="PATCH" ${record.method === 'PATCH' ? 'selected' : ''}>PATCH</option>
                            </select>
                        </div>
                        <div class="ajax-edit-group">
                            <label for="edit-url-${recordId}">请求URL</label>
                            <input type="text" id="edit-url-${recordId}" name="url" value="${record.url}" />
                        </div>
                        <div class="ajax-edit-group">
                            <label for="edit-headers-${recordId}">请求头 (JSON格式)</label>
                            <textarea id="edit-headers-${recordId}" name="headers" placeholder='{"Content-Type": "application/json"}'>${JSON.stringify(record.requestHeaders, null, 2)}</textarea>
                        </div>
                        <div class="ajax-edit-group">
                            <label for="edit-body-format-${recordId}">请求体格式</label>
                            <select id="edit-body-format-${recordId}" name="bodyFormat" onchange="handleBodyFormatChange(${recordId})">
                                <option value="none" ${bodyFormat === 'none' ? 'selected' : ''}>无请求体</option>
                                <option value="text" ${bodyFormat === 'text' ? 'selected' : ''}>文本/字符串</option>
                                <option value="json" ${bodyFormat === 'json' ? 'selected' : ''}>JSON</option>
                                <option value="form" ${bodyFormat === 'form' ? 'selected' : ''}>表单数据</option>
                            </select>
                        </div>
                        <div class="ajax-edit-group" id="body-group-${recordId}" ${bodyFormat === 'none' ? 'style="display:none"' : ''}>
                            <label for="edit-body-${recordId}">请求体内容</label>
                            <textarea id="edit-body-${recordId}" name="body" placeholder="请求体内容..." rows="6">${formatRequestBodyForEdit(record.requestBody, bodyFormat)}</textarea>
                            <small id="body-hint-${recordId}" style="color: #6c757d; font-size: 11px;">
                                ${getBodyFormatHint(bodyFormat)}
                            </small>
                        </div>
                    </form>
                </div>
                <div class="ajax-edit-actions">
                    <button class="cancel-btn" onclick="this.closest('.ajax-edit-modal').remove()">取消</button>
                    <button class="send-btn" onclick="sendEditedRequest(${recordId})">发送请求</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    };

    // 格式化请求体用于编辑
    function formatRequestBodyForEdit(body, format) {
        if (!body) return '';

        switch (format) {
            case 'json':
                if (typeof body === 'string') {
                    try {
                        return JSON.stringify(JSON.parse(body), null, 2);
                    } catch {
                        return body;
                    }
                }
                return JSON.stringify(body, null, 2);
            case 'form':
                if (body instanceof FormData) {
                    const entries = [];
                    for (let pair of body.entries()) {
                        entries.push(`${pair[0]}=${pair[1]}`);
                    }
                    return entries.join('&');
                }
                return body.toString();
            case 'text':
            default:
                return body.toString();
        }
    }

    // 获取请求体格式提示
    function getBodyFormatHint(format) {
        switch (format) {
            case 'json':
                return '请输入有效的JSON格式数据，例如: {"key": "value"}';
            case 'form':
                return '请输入表单数据格式，例如: key1=value1&key2=value2';
            case 'text':
                return '请输入纯文本内容';
            case 'none':
                return '该请求不包含请求体';
            default:
                return '';
        }
    }

    // 处理请求体格式变化
    window.handleBodyFormatChange = function(recordId) {
        const formatSelect = document.getElementById(`edit-body-format-${recordId}`);
        const bodyGroup = document.getElementById(`body-group-${recordId}`);
        const bodyHint = document.getElementById(`body-hint-${recordId}`);

        const selectedFormat = formatSelect.value;

        if (selectedFormat === 'none') {
            bodyGroup.style.display = 'none';
        } else {
            bodyGroup.style.display = 'block';
            bodyHint.textContent = getBodyFormatHint(selectedFormat);
        }
    };

    // 发送编辑后的请求
    window.sendEditedRequest = function(recordId) {
        const form = document.getElementById(`edit-form-${recordId}`);
        const formData = new FormData(form);

        const method = formData.get('method');
        const url = formData.get('url');
        const headersText = formData.get('headers');
        const bodyText = formData.get('body');
        const bodyFormat = formData.get('bodyFormat');

        let headers = {};
        try {
            if (headersText.trim()) {
                headers = JSON.parse(headersText);
            }
        } catch (e) {
            showToast('请求头格式错误，请使用正确的JSON格式', 'error');
            return;
        }

        // 根据格式处理请求体
        let processedBody = null;
        if (bodyFormat !== 'none' && bodyText && method !== 'GET') {
            switch (bodyFormat) {
                case 'json':
                    try {
                        // 验证JSON格式
                        JSON.parse(bodyText);
                        processedBody = bodyText;
                        // 确保Content-Type正确
                        if (!headers['Content-Type'] && !headers['content-type']) {
                            headers['Content-Type'] = 'application/json';
                        }
                    } catch (e) {
                        showToast('JSON格式错误，请检查请求体内容', 'error');
                        return;
                    }
                    break;
                case 'form':
                    processedBody = bodyText;
                    // 确保Content-Type正确
                    if (!headers['Content-Type'] && !headers['content-type']) {
                        headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                    break;
                case 'text':
                default:
                    processedBody = bodyText;
                    break;
            }
        }

        // 发送请求
        const requestOptions = {
            method: method,
            headers: headers
        };

        if (processedBody !== null) {
            requestOptions.body = processedBody;
        }

        console.log('🚀 发送编辑后的请求:', {
            method,
            url,
            headers,
            body: processedBody,
            bodyFormat
        });

        fetch(url, requestOptions)
            .then(response => {
                console.log('✅ 请求发送成功，状态:', response.status);
                showToast(`请求已发送，状态: ${response.status}`, response.ok ? 'success' : 'error');
                // 关闭模态框
                document.querySelector('.ajax-edit-modal').remove();
            })
            .catch(error => {
                console.error('❌ 请求发送失败:', error);
                showToast(`请求发送失败: ${error.message}`, 'error');
            });
    };

     // 显示提示信息
     function showToast(message, type = 'info') {
         const toast = document.createElement('div');
         toast.style.cssText = `
             position: fixed;
             top: 20px;
             left: 50%;
             transform: translateX(-50%);
             padding: 12px 24px;
             border-radius: 6px;
             color: white;
             font-size: 14px;
             font-weight: 500;
             z-index: 2147483650;
             box-shadow: 0 4px 16px rgba(0,0,0,0.2);
             transition: all 0.3s ease;
             backdrop-filter: blur(10px);
         `;

         switch (type) {
             case 'success':
                 toast.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                 break;
             case 'error':
                 toast.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
                 break;
             default:
                 toast.style.background = 'linear-gradient(135deg, #007acc, #0099ff)';
         }

         toast.textContent = message;
         document.body.appendChild(toast);

         // 3秒后移除
         setTimeout(() => {
             toast.style.opacity = '0';
             toast.style.transform = 'translateX(-50%) translateY(-20px)';
             setTimeout(() => {
                 if (toast.parentNode) {
                     toast.parentNode.removeChild(toast);
                 }
             }, 300);
         }, 3000);
     }

     // 更新统计数据
    function updateStats() {
        const filteredRecords = filterRecords();
        const total = ajaxRecords.length;
        const success = ajaxRecords.filter(r => r.success).length;
        const error = total - success;
        const avgTime = total > 0 ? Math.round(ajaxRecords.reduce((sum, r) => sum + r.duration, 0) / total) : 0;

        // 检查是否有过滤条件
        const isFiltered = currentFilters.searchText ||
                          currentFilters.method !== 'all' ||
                          currentFilters.status !== 'all';

        const hasReverse = currentFilters.searchReverse ||
                          currentFilters.methodReverse ||
                          currentFilters.statusReverse;

        if (isFiltered && filteredRecords.length !== total) {
            let filterText = '(已过滤';
            if (hasReverse) {
                filterText += ' 🚫反向';
            }
            filterText += ')';

            document.getElementById('total-count').innerHTML =
                `${filteredRecords.length} / ${total} <span style="color: #007acc; font-size: 10px;">${filterText}</span>`;
        } else {
            document.getElementById('total-count').textContent = total;
        }

        document.getElementById('success-count').textContent = success;
        document.getElementById('error-count').textContent = error;
        document.getElementById('avg-time').textContent = avgTime;
    }

    // 显示记录详情
    window.showRecordDetail = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const modal = document.createElement('div');
        modal.className = 'ajax-detail-modal';
        modal.innerHTML = `
            <div class="ajax-detail-content">
                <div class="ajax-detail-header">
                    <h3>🔍 ${record.method} ${record.url}</h3>
                    <button class="close-btn" onclick="this.closest('.ajax-detail-modal').remove()">关闭</button>
                </div>
                <div class="ajax-detail-body">
                    <div class="ajax-detail-section">
                        <h4>📊 基本信息</h4>
                        <div class="ajax-detail-code">时间: ${record.time}
方法: ${record.method}
URL: ${record.url}
状态: ${record.status} ${record.success ? '✅' : '❌'}
耗时: ${record.duration}ms
用户代理: ${navigator.userAgent}</div>
                    </div>
                    <div class="ajax-detail-section">
                        <h4>📤 请求头
                            <button class="copy-btn" onclick="copyRequestHeaders(${recordId})">复制</button>
                        </h4>
                        <div class="ajax-detail-code">${JSON.stringify(record.requestHeaders, null, 2)}</div>
                    </div>
                    <div class="ajax-detail-section">
                        <h4>📝 请求参数 (格式: ${record.bodyFormat || 'auto'})
                            <button class="copy-btn" onclick="copyRequestBody(${recordId})">复制</button>
                        </h4>
                        <div class="ajax-detail-code">${formatRequestBody(record.requestBody, record.bodyFormat)}</div>
                    </div>
                    <div class="ajax-detail-section">
                        <h4>📥 响应头
                            <button class="copy-btn" onclick="copyResponseHeaders(${recordId})">复制</button>
                        </h4>
                        <div class="ajax-detail-code">${JSON.stringify(record.responseHeaders, null, 2)}</div>
                    </div>
                    <div class="ajax-detail-section">
                        <h4>📋 响应数据
                            <button class="copy-btn" onclick="copyResponseData(${recordId})">复制</button>
                        </h4>
                        <div class="ajax-detail-code">${formatResponse(record.response)}</div>
                    </div>
                    <div class="ajax-detail-section">
                        <h4>🔄 cURL命令
                        <button class="copy-btn" onclick="copyCurlCommand(${recordId})">复制</button>
                        </h4>
                        <div class="ajax-detail-code">${generateCurlCommand(record)}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    };

    // 复制到剪贴板
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('📋 内容已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
        });
    };

    // 复制响应数据
    window.copyResponseData = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const responseText = record.response || '';
        navigator.clipboard.writeText(responseText).then(() => {
            console.log('📋 响应数据已复制到剪贴板');
            showToast('响应数据已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
        });
    };
    window.copyCurlCommand = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const curlCommand = generateCurlCommand(record);
        navigator.clipboard.writeText(curlCommand).then(() => {
            console.log('📋 cURL命令已复制到剪贴板');
            showToast('cURL命令已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
        });
    };
    // 复制请求头
    window.copyRequestHeaders = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const headersText = JSON.stringify(record.requestHeaders, null, 2);
        navigator.clipboard.writeText(headersText).then(() => {
            console.log('📋 请求头已复制到剪贴板');
            showToast('请求头已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
        });
    };

    // 复制请求体
    window.copyRequestBody = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const bodyText = formatRequestBodyForCopy(record.requestBody);
        navigator.clipboard.writeText(bodyText).then(() => {
            console.log('📋 请求体已复制到剪贴板');
            showToast('请求体已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
        });
    };

    // 复制响应头
    window.copyResponseHeaders = function(recordId) {
        const record = ajaxRecords.find(r => r.id === recordId);
        if (!record) return;

        const headersText = JSON.stringify(record.responseHeaders, null, 2);
        navigator.clipboard.writeText(headersText).then(() => {
            console.log('📋 响应头已复制到剪贴板');
            showToast('响应头已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败', 'error');
        });
    };

    // 生成cURL命令
    function generateCurlCommand(record) {
        let curl = `curl -X ${record.method} '${record.url}'`;

        // 添加请求头
        Object.entries(record.requestHeaders).forEach(([key, value]) => {
            curl += ` \\\n  -H '${key}: ${value}'`;
        });

        // 添加请求体
        if (record.requestBody) {
            curl += ` \\\n  -d '${record.requestBody}'`;
        }

        return curl;
    }

    // 格式化请求体
    function formatRequestBody(body, bodyFormat) {
        if (!body) return '无请求体';

        // 如果有格式信息，按格式处理
        if (bodyFormat) {
            switch (bodyFormat) {
                case 'json':
                    if (typeof body === 'string') {
                        try {
                            return JSON.stringify(JSON.parse(body), null, 2);
                        } catch {
                            return body;
                        }
                    }
                    return JSON.stringify(body, null, 2);
                case 'form':
                    if (body instanceof FormData) {
                        const entries = [];
                        for (let pair of body.entries()) {
                            entries.push(`${pair[0]}: ${pair[1]}`);
                        }
                        return entries.join('\n');
                    }
                    return body.toString();
                case 'text':
                case 'none':
                default:
                    return body.toString();
            }
        }

        // 回退到原有逻辑（为了兼容性）
        if (typeof body === 'string') {
            // 只在确实是JSON格式时才格式化
            try {
                const parsed = JSON.parse(body);
                // 检查是否真的是对象/数组
                if (typeof parsed === 'object' && parsed !== null) {
                    return JSON.stringify(parsed, null, 2);
                }
                return body;
            } catch {
                return body;
            }
        }
        if (body instanceof FormData) {
            const entries = [];
            for (let pair of body.entries()) {
                entries.push(`${pair[0]}: ${pair[1]}`);
            }
            return entries.join('\n');
        }
        return JSON.stringify(body, null, 2);
    }

    // 格式化请求体用于复制
    function formatRequestBodyForCopy(body) {
        if (!body) return '';
        return typeof body === 'string' ? body.replace(/'/g, "\\'") : JSON.stringify(body).replace(/'/g, "\\'");
    }

    // 格式化响应数据
    function formatResponse(response) {
        if (!response) return '无响应数据';
        if (typeof response === 'string') {
            try {
                return JSON.stringify(JSON.parse(response), null, 2);
            } catch {
                return response;
            }
        }
        return JSON.stringify(response, null, 2);
    }

    // 导出记录
    function exportRecords() {
        const exportData = {
            exportTime: new Date().toISOString(),
            environment: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now()
            },
            records: ajaxRecords
        };

        const data = JSON.stringify(exportData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ajax_records_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log('📥 导出完成，包含', ajaxRecords.length, '条记录');
    }

    // 检测请求体格式
    function detectBodyFormat(body, contentType) {
        if (!body) return 'none';

        contentType = (contentType || '').toLowerCase();

        if (contentType.includes('application/json')) {
            return 'json';
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            return 'form';
        } else if (contentType.includes('multipart/form-data')) {
            return 'multipart';
        } else if (contentType.includes('text/')) {
            return 'text';
        }

        // 尝试检测是否是JSON字符串
        if (typeof body === 'string') {
            try {
                JSON.parse(body);
                return 'json';
            } catch {
                return 'text';
            }
        }

        if (body instanceof FormData) {
            return 'form';
        }

        return 'text';
    }

    // 记录Ajax请求
    function recordAjaxRequest(data) {
        if (ajaxRecords.length >= CONFIG.maxRecords) {
            ajaxRecords.shift(); // 删除最早的记录
        }

        // 检测请求体格式
        const contentType = data.requestHeaders['Content-Type'] || data.requestHeaders['content-type'] || '';
        const bodyFormat = detectBodyFormat(data.requestBody, contentType);

        ajaxRecords.push({
            id: ++recordIndex,
            time: new Date().toLocaleTimeString(),
            timestamp: Date.now(),
            bodyFormat: bodyFormat,
            ...data
        });

        if (monitorPanel) {
            updateRecordsList();
            updateStats();
        }
    }

    // 拦截XMLHttpRequest
    function interceptXMLHttpRequest() {
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const startTime = Date.now();
            let requestData = {
                method: 'GET',
                url: '',
                requestHeaders: {},
                requestBody: null,
                responseHeaders: {},
                response: '',
                status: 0,
                success: false,
                duration: 0
            };

            // 拦截open方法
            const originalOpen = xhr.open;
            xhr.open = function(method, url, async, user, password) {
                requestData.method = method.toUpperCase();
                requestData.url = url;
                return originalOpen.apply(this, arguments);
            };

            // 拦截setRequestHeader方法
            const originalSetRequestHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function(name, value) {
                requestData.requestHeaders[name] = value;
                return originalSetRequestHeader.apply(this, arguments);
            };

            // 拦截send方法
            const originalSend = xhr.send;
            xhr.send = function(body) {
                requestData.requestBody = body;

                // 监听状态变化
                const originalOnReadyStateChange = xhr.onreadystatechange;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        requestData.duration = Date.now() - startTime;
                        requestData.status = xhr.status;
                        requestData.success = xhr.status >= 200 && xhr.status < 400;
                        requestData.response = xhr.responseText;

                        // 获取响应头
                        const responseHeadersStr = xhr.getAllResponseHeaders();
                        if (responseHeadersStr) {
                            responseHeadersStr.split('\r\n').forEach(line => {
                                const parts = line.split(': ');
                                if (parts.length === 2) {
                                    requestData.responseHeaders[parts[0]] = parts[1];
                                }
                            });
                        }

                        if (isListening) {
                            recordAjaxRequest(requestData);
                        }
                    }

                    if (originalOnReadyStateChange) {
                        originalOnReadyStateChange.apply(this, arguments);
                    }
                };

                return originalSend.apply(this, arguments);
            };

            return xhr;
        };

        // 复制原始构造函数的静态属性
        Object.setPrototypeOf(window.XMLHttpRequest, originalXHR);
        Object.setPrototypeOf(window.XMLHttpRequest.prototype, originalXHR.prototype);
    }

    // 拦截fetch请求
    function interceptFetch() {
        window.fetch = function(input, init = {}) {
            const startTime = Date.now();
            const url = typeof input === 'string' ? input : input.url;
            const method = (init.method || 'GET').toUpperCase();

            const requestData = {
                method: method,
                url: url,
                requestHeaders: init.headers || {},
                requestBody: init.body || null,
                responseHeaders: {},
                response: '',
                status: 0,
                success: false,
                duration: 0
            };

            return originalFetch(input, init).then(response => {
                requestData.duration = Date.now() - startTime;
                requestData.status = response.status;
                requestData.success = response.ok;

                // 获取响应头
                response.headers.forEach((value, name) => {
                    requestData.responseHeaders[name] = value;
                });

                // 克隆响应以读取内容
                const responseClone = response.clone();
                responseClone.text().then(text => {
                    requestData.response = text;
                    if (isListening) {
                        recordAjaxRequest(requestData);
                    }
                }).catch(() => {
                    // 如果无法读取响应内容，仍然记录请求
                    if (isListening) {
                        recordAjaxRequest(requestData);
                    }
                });

                return response;
            }).catch(error => {
                requestData.duration = Date.now() - startTime;
                requestData.status = 0;
                requestData.success = false;
                requestData.response = error.message;

                if (isListening) {
                    recordAjaxRequest(requestData);
                }

                throw error;
            });
        };
    }

    // 开始监听
    function startMonitoring() {
        if (isListening) return;

        isListening = true;
        ajaxRecords = [];
        recordIndex = 0;

        // 安装拦截器
        interceptXMLHttpRequest();
        interceptFetch();

        // 创建监控面板
        createMonitorPanel();

        console.log('🎯 Ajax监听已启动');
        console.log('📍 当前URL:', window.location.href);
        console.log('🔧 按 F3 可关闭监听');
    }

    // 停止监听
    function stopMonitoring() {
        isListening = false;

        // 恢复原始方法
        window.XMLHttpRequest = originalXHR;
        window.fetch = originalFetch;

        // 移除监控面板
        if (monitorPanel) {
            monitorPanel.remove();
            monitorPanel = null;
        }

        console.log('🔴 Ajax监听已停止');
    }

    // 热键监听
    function setupHotkey() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F3') {
                e.preventDefault();

                if (isListening) {
                    stopMonitoring();
                } else {
                    startMonitoring();
                }
            }
        });
    }

    // 初始化
    function init() {
        setupHotkey();
        console.log('📡 Ajax监听器已加载');
        console.log('🚀 按 F3 启动Ajax请求监听');
        console.log('🌐 当前环境:', window.location.href);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();