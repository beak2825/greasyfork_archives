// ==UserScript==
// @name         请求监听过滤器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  监听所有HTTP和HTTPS请求
// @author       晚风
// @match        http://*/*
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @inject-into  page
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520573/%E8%AF%B7%E6%B1%82%E7%9B%91%E5%90%AC%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520573/%E8%AF%B7%E6%B1%82%E7%9B%91%E5%90%AC%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

// 立即执行重定向检查，在任何其他代码执行之前
(function() {
    if (window.location.href.includes('cryptbox.sankuai.com/file/')) {
        // 阻止页面继续加载
        window.stop();

        const currentUrl = window.location.href;
        const newUrl = currentUrl.replace(
            /^https:\/\/cryptbox\.sankuai\.com\/file\/(.+)$/,
            'https://distribute-platform-pub.sankuai.com/distribute/download/v1/$1'
        );

        if (currentUrl !== newUrl) {
            // 创建一个隐藏的 iframe 来触发下载
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = newUrl;
            document.body.appendChild(iframe);

            // 等待一段时间后关闭页面
            setTimeout(() => {
                window.close();
            }, 1000); // 给予1秒时间让下载开始

            return;
        }
    }
})();

class RequestMonitor {
    constructor() {
        if (window._RequestMonitor) {
            return window._RequestMonitor;
        }
        window._RequestMonitor = this;

        // 初始化状态
        this.logs = [];
        this.filterKeyword = '';
        this.initialized = false;
        this.requestCount = {
            total: 0,
            xhr: 0,
            fetch: 0
        };

        // 重定向规则
        this.redirectRules = [
            {
                pattern: /^https:\/\/cryptbox\.sankuai\.com\/file\/(.+)$/,
                replacement: 'https://distribute-platform-pub.sankuai.com/distribute/download/v1/$1'
            }
        ];

        // SVG 图标
        this.icons = {
            copy: `<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor">
                <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" />
            </svg>`,
            success: `<svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor">
                <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"/>
            </svg>`
        };

        // 设置默认状态为折叠
        this.isPanelExpanded = false;

        this.init();
    }

    init() {
        if (this.initialized) return;
        this.setupRequestInterceptors();
        this.createUI();
        this.initialized = true;
    }

    // UI 相关方法
    createUI() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.renderUI(), { once: true });
        } else {
            this.renderUI();
        }
    }

    renderUI() {
        // 创建主容器
        const container = this.createMainContainer();

        // 创建头部
        const header = this.createHeader();
        container.appendChild(header);

        // 创建统计栏
        const stats = this.createStatsBar();
        container.appendChild(stats);

        // 创建请求列表
        const content = this.createRequestList();
        container.appendChild(content);

        // 创建详情面板
        this.createDetailPanel();

        // 添加到页面
        document.body.appendChild(container);
    }

    // 创建主容器
    createMainContainer() {
        const container = document.createElement('div');
        container.id = 'requestMonitor';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: ${this.isPanelExpanded ? '400px' : '40px'};
            height: ${this.isPanelExpanded ? '90vh' : '40px'};
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            overflow: hidden;
            transform-origin: right center;
            display: ${this.isPanelExpanded ? 'flex' : 'block'};
            flex-direction: column;
        `;

        // 创建折叠按钮
        const toggleButton = document.createElement('div');
        toggleButton.style.cssText = `
            position: ${this.isPanelExpanded ? 'absolute' : 'relative'};
            top: ${this.isPanelExpanded ? '12px' : '0'};
            right: ${this.isPanelExpanded ? '12px' : '0'};
            width: ${this.isPanelExpanded ? '24px' : '40px'};
            height: ${this.isPanelExpanded ? '24px' : '40px'};
            background: ${this.isPanelExpanded ? 'rgba(24, 144, 255, 0.1)' : '#1890ff'};
            border-radius: ${this.isPanelExpanded ? '4px' : '8px'};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${this.isPanelExpanded ? '#1890ff' : 'white'};
            font-size: 18px;
            transition: all 0.3s;
            z-index: 1;
        `;
        toggleButton.innerHTML = this.isPanelExpanded ? '−' : '+';

        toggleButton.onmouseover = () => {
            toggleButton.style.background = this.isPanelExpanded ?
                'rgba(24, 144, 255, 0.2)' :
                'rgba(24, 144, 255, 0.8)';
        };

        toggleButton.onmouseout = () => {
            toggleButton.style.background = this.isPanelExpanded ?
                'rgba(24, 144, 255, 0.1)' :
                '#1890ff';
        };

        toggleButton.onclick = (e) => {
            e.stopPropagation();
            this.togglePanel(!this.isPanelExpanded);
        };

        container.appendChild(toggleButton);
        return container;
    }

    // 创建头部
    createHeader() {
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 12px 16px;
            padding-right: 48px;
            background: rgba(245, 245, 245, 0.95);
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        `;

        // 标题
        const title = document.createElement('span');
        title.textContent = `${document.title} - 请求监听器`;
        title.style.cssText = `
            font-weight: 600;
            color: #333;
            font-size: 14px;
        `;

        // 搜索
        const filterInput = document.createElement('input');
        filterInput.placeholder = '搜索请求...';
        filterInput.style.cssText = `
            margin-left: 12px;
            padding: 6px 12px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            flex-grow: 1;
            font-size: 12px;
            outline: none;
            transition: all 0.3s;
            background: rgba(255, 255, 255, 0.9);
        `;

        // 添加拖拽功能
        this.setupDrag(header);

        // 添加事件监听
        filterInput.oninput = () => {
            this.filterKeyword = filterInput.value.toLowerCase();
            this.updateList();
        };

        header.appendChild(title);
        header.appendChild(filterInput);
        return header;
    }

    // 创建统计栏
    createStatsBar() {
        const stats = document.createElement('div');
        stats.id = 'requestStats';
        stats.style.cssText = `
            padding: 8px 16px;
            background: rgba(250, 250, 250, 0.95);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            font-size: 12px;
            color: #666;
            display: flex;
            gap: 16px;
        `;
        stats.innerHTML = `
            <span>总请求: <b id="totalCount">0</b></span>
            <span>XHR: <b id="xhrCount">0</b></span>
            <span>Fetch: <b id="fetchCount">0</b></span>
        `;
        return stats;
    }

    // 创建请求列表
    createRequestList() {
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            display: ${this.isPanelExpanded ? 'block' : 'none'};
            background: rgba(255, 255, 255, 0.95);
            padding: 0;
        `;

        const requestList = document.createElement('div');
        requestList.id = 'requestList';
        content.appendChild(requestList);

        return content;
    }

    // 创建详情面板
    createDetailPanel() {
        const detailPanel = document.createElement('div');
        detailPanel.id = 'requestDetail';
        detailPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            max-height: 80vh;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000000;
            display: none;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px;
            background: rgba(245, 245, 245, 0.95);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('h3');
        title.style.cssText = `
            margin: 0;
            font-size: 16px;
            color: #333;
        `;
        title.textContent = '请求详情';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 0 8px;
            line-height: 1;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 16px;
            overflow-y: auto;
            max-height: calc(80vh - 60px);
        `;

        closeBtn.onclick = () => detailPanel.style.display = 'none';

        header.appendChild(title);
        header.appendChild(closeBtn);
        detailPanel.appendChild(header);
        detailPanel.appendChild(content);
        document.body.appendChild(detailPanel);
    }

    // 设置拖拽功能
    setupDrag(header) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.onmousedown = (e) => {
            isDragging = true;
            const container = document.getElementById('requestMonitor');
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        };

        document.onmousemove = (e) => {
            if (isDragging) {
                const container = document.getElementById('requestMonitor');
                const viewportWidth = window.innerWidth;

                // 算新位置
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // 计算距离右侧的距离
                const rightDistance = viewportWidth - (currentX + container.offsetWidth);

                // 更新位置，使用 right 而不是 left
                container.style.right = `${rightDistance}px`;
                container.style.top = `${currentY}px`;
                container.style.left = 'auto';
            }
        };

        document.onmouseup = () => isDragging = false;
    }

    // 请求拦截相关方法
    setupRequestInterceptors() {
        this.interceptXHR();
        this.interceptFetch();
    }

    // XHR拦截实现
    interceptXHR() {
        const originalXHR = XMLHttpRequest.prototype;
        const originalOpen = originalXHR.open;
        const originalSend = originalXHR.send;
        const self = this;

        originalXHR.open = function(method, url) {
            if (self.shouldSkipRequest(url)) return;

            this._requestData = {
                method,
                url: url instanceof URL ? url.href : url,
                status: null,
                response: null,
                type: 'xhr',
                requestData: null,
                urlParams: self.getUrlParams(url),
                timestamp: new Date().toLocaleTimeString()
            };
            return originalOpen.apply(this, arguments);
        };

        originalXHR.send = function(data) {
            if (this._requestData) {
                if (data) {
                    try {
                        this._requestData.requestData = typeof data === 'string'
                            ? JSON.parse(data) : data;
                    } catch (e) {
                        this._requestData.requestData = data;
                    }
                }

                this.addEventListener('load', () => {
                    this._requestData.status = this.status;
                    try {
                        this._requestData.response = this.responseText;
                    } catch (e) {
                        this._requestData.response = '[无法读取响应内容]';
                    }

                    self.logs.push(this._requestData);
                    self.requestCount.total++;
                    self.requestCount.xhr++;
                    self.updateStats();
                    self.updateList();
                });
            }
            return originalSend.apply(this, arguments);
        };
    }

    // Fetch拦截实现
    interceptFetch() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = async function(input, init = {}) {
            const url = input instanceof Request ? input.url : input;
            if (self.shouldSkipRequest(url)) return;

            const method = init.method || (input instanceof Request ? input.method : 'GET');
            const logEntry = {
                method,
                url: url instanceof URL ? url.href : url,
                status: null,
                response: null,
                type: 'fetch',
                requestData: init.body || null,
                urlParams: self.getUrlParams(url),
                timestamp: new Date().toLocaleTimeString()
            };

            try {
                const response = await originalFetch.apply(this, arguments);
                const clone = response.clone();
                logEntry.status = clone.status;

                try {
                    const responseText = await clone.text();
                    logEntry.response = responseText;
                } catch (e) {
                    logEntry.response = '[无法读取响应内容]';
                }

                self.logs.push(logEntry);
                self.requestCount.total++;
                self.requestCount.fetch++;
                self.updateStats();
                self.updateList();
                return response;
            } catch (error) {
                logEntry.status = 'ERROR';
                logEntry.response = error.message;
                self.logs.push(logEntry);
                self.updateStats();
                self.updateList();
                throw error;
            }
        };
    }

    // 更新统计信息
    updateStats() {
        const totalEl = document.getElementById('totalCount');
        const xhrEl = document.getElementById('xhrCount');
        const fetchEl = document.getElementById('fetchCount');

        if (totalEl) totalEl.textContent = this.requestCount.total;
        if (xhrEl) xhrEl.textContent = this.requestCount.xhr;
        if (fetchEl) fetchEl.textContent = this.requestCount.fetch;
    }

    // 更新请求列表
    updateList() {
        const requestList = document.getElementById('requestList');
        if (!requestList) return;

        const filteredLogs = this.filterKeyword ?
            this.logs.filter(log => {
                const searchStr = this.filterKeyword.toLowerCase();
                return (
                    log.url.toLowerCase().includes(searchStr) ||
                    (log.response && log.response.toLowerCase().includes(searchStr))
                );
            }) :
            this.logs;

        requestList.innerHTML = '';
        filteredLogs.forEach(log => this.createRequestItem(log, requestList));
    }

    // 创建请求列表项
    createRequestItem(log, container) {
        const item = document.createElement('div');
        item.style.cssText = `
            padding: 12px 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            position: relative;
            background: rgba(255, 255, 255, 0.95);
        `;

        item.onmouseover = () => {
            item.style.backgroundColor = 'rgba(24, 144, 255, 0.05)';
        };

        item.onmouseout = () => {
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        };

        const statusColor = log.status >= 200 && log.status < 300 ? '#52c41a' : '#f5222d';

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="
                    font-weight: 600;
                    color: #1890ff;
                    padding: 2px 8px;
                    background: rgba(24, 144, 255, 0.1);
                    border-radius: 4px;
                ">${log.method}</span>
                <span style="
                    color: ${statusColor};
                    padding: 2px 8px;
                    background: ${log.status >= 200 && log.status < 300 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)'};
                    border-radius: 4px;
                ">${log.status || 'pending'}</span>
                <span style="color: #999; font-size: 11px;">${log.timestamp}</span>
            </div>
            <div style="
                word-break: break-all;
                color: #666;
                padding: 4px 8px;
                background: rgba(0, 0, 0, 0.02);
                border-radius: 4px;
                font-family: monospace;
            ">${log.url}</div>
        `;

        item.onclick = () => this.showRequestDetail(log);
        container.appendChild(item);
    }

    // 工具方法
    shouldSkipRequest(url) {
        return url.includes('cryptbox.sankuai.com/api_sdk/file_download/url_generate?current_url=') ||
               url.includes('cryptbox.sankuai.com/api_sdk/wenshu_url/judge_and_generate?current_url=');
    }

    getUrlParams(url) {
        try {
            const urlObj = new URL(url);
            const params = {};
            for (const [key, value] of urlObj.searchParams) {
                params[key] = value;
            }
            return Object.keys(params).length > 0 ? params : null;
        } catch (e) {
            return null;
        }
    }

    handleRedirect(url) {
        for (const rule of this.redirectRules) {
            if (rule.pattern.test(url)) {
                const newUrl = url.replace(rule.pattern, rule.replacement);
                console.log('重定向到:', newUrl);
                window.location.replace(newUrl);
                return true;
            }
        }
        return false;
    }

    // 显示请求详情
    showRequestDetail(log) {
        const detailPanel = document.getElementById('requestDetail');
        const detailContent = detailPanel.querySelector('div:last-child');

        // 创建复制按钮
        const createCopyButton = (text) => {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                position: absolute;
                right: 8px;
                top: 8px;
            `;

            const button = document.createElement('button');
            button.innerHTML = this.icons.copy;
            button.style.cssText = `
                padding: 4px 8px;
                background: rgba(24, 144, 255, 0.1);
                border: 1px solid rgba(24, 144, 255, 0.2);
                border-radius: 4px;
                color: #1890ff;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 28px;
                height: 28px;
                opacity: 0.8;
            `;

            button.onmouseover = () => {
                button.style.background = 'rgba(24, 144, 255, 0.2)';
                button.style.opacity = '1';
            };

            button.onmouseout = () => {
                button.style.background = 'rgba(24, 144, 255, 0.1)';
                button.style.opacity = '0.8';
            };

            button.onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(text).then(() => {
                    button.innerHTML = this.icons.success;
                    setTimeout(() => button.innerHTML = this.icons.copy, 1000);
                });
            };

            buttonContainer.appendChild(button);
            return buttonContainer;
        };

        // 格式化数据显示
        const formatData = (data, type = '') => {
            try {
                if (!data) return '';
                let formattedData = data;
                if (typeof data === 'string') {
                    try {
                        formattedData = JSON.stringify(JSON.parse(data), null, 2);
                    } catch {
                        if (data.trim().startsWith('<')) {
                            formattedData = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                        }
                    }
                } else {
                    formattedData = JSON.stringify(data, null, 2);
                }

                const container = document.createElement('div');
                container.style.cssText = 'margin-bottom: 16px; position: relative;';

                const title = document.createElement('div');
                title.style.cssText = 'font-weight: 600; color: #1890ff; margin-bottom: 4px;';
                title.textContent = `${type}：`;

                const pre = document.createElement('pre');
                pre.style.cssText = 'margin: 0; padding: 8px; background: rgba(0,0,0,0.02); border-radius: 4px; overflow-x: auto; max-height: 400px;';
                pre.textContent = formattedData;

                const copyButton = createCopyButton(formattedData);

                container.appendChild(title);
                container.appendChild(pre);
                pre.appendChild(copyButton);

                return container;
            } catch (e) {
                console.warn(`格式化${type}失败:`, e);
                return document.createElement('div');
            }
        };

        // 清空现内容
        detailContent.innerHTML = '';

        // 创建基本信息区
        const basicInfo = document.createElement('div');
        basicInfo.style.cssText = 'margin-bottom: 16px;';
        basicInfo.innerHTML = `
            <div style="display: flex; margin-bottom: 8px;">
                <span style="font-weight: 600; color: #1890ff; width: 80px;">方法：</span>
                <span>${log.method}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px;">
                <span style="font-weight: 600; color: #1890ff; width: 80px;">状态：</span>
                <span style="color: ${log.status >= 200 && log.status < 300 ? '#52c41a' : '#f5222d'}">${log.status || 'pending'}</span>
            </div>
        `;

        // URL 部分
        const urlContainer = document.createElement('div');
        urlContainer.style.cssText = 'margin-bottom: 8px; position: relative;';
        const urlTitle = document.createElement('div');
        urlTitle.style.cssText = 'font-weight: 600; color: #1890ff; margin-bottom: 4px;';
        urlTitle.textContent = 'URL：';
        const urlContent = document.createElement('div');
        urlContent.style.cssText = 'word-break: break-all; padding: 8px; background: rgba(0,0,0,0.02); border-radius: 4px;';
        urlContent.textContent = log.url;
        urlContainer.appendChild(urlTitle);
        urlContainer.appendChild(urlContent);
        urlContent.appendChild(createCopyButton(log.url));

        // 添加所有内容
        detailContent.appendChild(basicInfo);
        detailContent.appendChild(urlContainer);

        // URL参数
        if (log.urlParams) {
            detailContent.appendChild(formatData(log.urlParams, 'URL参数'));
        }

        // 请求数据
        if (log.requestData) {
            detailContent.appendChild(formatData(log.requestData, '请求数据'));
        }

        // 响应数据
        if (log.response) {
            detailContent.appendChild(formatData(log.response, '响应数据'));
        }

        detailPanel.style.display = 'block';
    }

    // 修改 togglePanel 方法
    togglePanel(expand) {
        this.isPanelExpanded = expand;
        const container = document.getElementById('requestMonitor');
        const toggleButton = container.querySelector('div:first-child');
        const content = container.querySelector('#requestList')?.parentElement;
        const stats = container.querySelector('#requestStats');
        const header = container.querySelector('div:nth-child(2)');

        // 更新容器样式
        container.style.width = expand ? '400px' : '40px';
        container.style.height = expand ? '90vh' : '40px';
        container.style.display = expand ? 'flex' : 'block';

        // 更新按钮样式
        toggleButton.style.position = expand ? 'absolute' : 'relative';
        toggleButton.style.top = expand ? '12px' : '0';
        toggleButton.style.right = expand ? '12px' : '0';
        toggleButton.style.width = expand ? '24px' : '40px';
        toggleButton.style.height = expand ? '24px' : '40px';
        toggleButton.style.background = expand ? 'rgba(24, 144, 255, 0.1)' : '#1890ff';
        toggleButton.style.borderRadius = expand ? '4px' : '8px';
        toggleButton.style.color = expand ? '#1890ff' : 'white';
        toggleButton.innerHTML = expand ? '−' : '+';

        // 显示/隐藏其他元素
        if (header) header.style.display = expand ? 'flex' : 'none';
        if (stats) stats.style.display = expand ? 'flex' : 'none';
        if (content) content.style.display = expand ? 'block' : 'none';

        // 展开时重新计算内容高度
        if (expand) {
            // 触发内容重新渲染
            this.updateList();
        }
    }
}

// 只有在不需要重定向时才初始化监控器
if (!window.location.href.includes('cryptbox.sankuai.com/file/')) {
    new RequestMonitor();
}