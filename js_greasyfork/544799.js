// ==UserScript==
// @name         资源嗅探器 Pro v4
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  强大的网页资源嗅探工具，支持自动检测、分类展示、预览和下载各类网页资源
// @author       CodeBuddy
// @match        *://*/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544799/%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2%E5%99%A8%20Pro%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/544799/%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2%E5%99%A8%20Pro%20v4.meta.js
// ==/UserScript==

class ResourceSniffer {
    constructor() {
        // 配置选项
        this.config = {
            // 支持的资源类型
            resourceTypes: {
                image: { enabled: true, extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'], icon: '📷' },
                video: { enabled: true, extensions: ['mp4', 'webm', 'avi', 'mov', 'flv', 'wmv', 'mkv'], icon: '🎬' },
                audio: { enabled: true, extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'], icon: '🎵' },
                document: { enabled: true, extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'], icon: '📄' },
                other: { enabled: true, icon: '📦' }
            },
            // 面板位置和大小
            panel: {
                width: '350px',
                height: '600px',
                left: '20px',
                top: '100px',
                opacity: 0.95
            },
            // 其他配置
            maxResources: 500,
            ignoreSmallResources: true,
            minResourceSize: 1024, // 1KB
            updateInterval: 5000 // 5秒更新一次UI
        };

        // 全局变量
        this.resources = new Map(); // 存储嗅探到的资源
        this.panelVisible = false; // 面板可见性
        this.activeTab = 'all'; // 当前激活的标签
        this.panelElement = null; // 面板元素
        this.toggleButton = null; // 切换按钮
        this.resourceCount = 0; // 资源计数
        this.isDragging = false; // 是否正在拖拽
        this.dragOffset = { x: 0, y: 0 }; // 拖拽偏移量
        this.previewModal = null; // 预览模态框
        this.lastUpdateTime = 0; // 上次更新时间

        // 初始化
        this.init();
    }

    // 初始化函数
    init() {
        // 确保文档就绪后初始化
        this.checkDocumentReady();

        // 拦截请求以嗅探资源
        this.interceptRequests();

        // 监听页面上的媒体元素
        this.monitorMediaElements();
    }

    // 检查文档是否就绪
    checkDocumentReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDocumentReady());
        } else {
            // 延迟一点执行，确保body已完全加载
            setTimeout(() => this.onDocumentReady(), 300);
        }
    }

    // 文档就绪后执行
    onDocumentReady() {
        console.log('资源嗅探器 Pro v4 已加载');

        // 创建悬浮按钮
        this.createToggleButton();

        // 创建样式
        this.injectStyles();

        // 定期更新UI
        setInterval(() => this.updateUI(), this.config.updateInterval);
    }

    // 创建视频播放器
    createVideoPlayer(resource) {
        // 检查是否已存在播放器
        if (document.getElementById('resource-player')) {
            document.getElementById('resource-player').remove();
        }

        // 创建播放器容器
        const playerContainer = document.createElement('div');
        playerContainer.id = 'resource-player';
        playerContainer.className = 'resource-player';
        playerContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 1000px;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 10px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        `;

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '关闭';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            z-index: 10;
        `;
        closeBtn.onclick = () => {
            playerContainer.remove();
        };

        // 创建视频元素
        const videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.style.width = '100%';
        videoElement.style.height = 'auto';
        videoElement.style.borderRadius = '5px';

        // 设置视频源
        const sourceElement = document.createElement('source');
        sourceElement.src = resource.url;
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);

        // 处理m3u8格式
        if (resource.url.includes('.m3u8')) {
            // 检查是否支持HLS
            if (window.Hls) {
                const hls = new Hls();
                hls.loadSource(resource.url);
                hls.attachMedia(videoElement);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    videoElement.play();
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error('HLS播放错误:', data);
                });
            } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                videoElement.src = resource.url;
                videoElement.addEventListener('loadedmetadata', () => {
                    videoElement.play();
                });
            } else {
                alert('您的浏览器不支持HLS播放，请安装HLS插件或使用其他浏览器');
                playerContainer.remove();
            }
        }

        // 添加标题
        const titleElement = document.createElement('div');
        titleElement.innerText = `正在播放: ${resource.name} ${resource.quality !== 'unknown' ? `(${resource.quality})` : ''}`;
        titleElement.style.cssText = `
            color: white;
            margin: 10px 0;
            font-weight: bold;
        `;

        // 添加下载按钮
        const downloadBtn = document.createElement('button');
        downloadBtn.innerText = '下载';
        downloadBtn.style.cssText = `
            background: rgba(0, 128, 255, 0.7);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            margin-right: 10px;
            cursor: pointer;
        `;
        downloadBtn.onclick = () => {
            this.downloadResource(resource);
        };

        // 添加控制栏
        const controlBar = document.createElement('div');
        controlBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
        `;
        controlBar.appendChild(downloadBtn);
        controlBar.appendChild(closeBtn);

        // 组装播放器
        playerContainer.appendChild(titleElement);
        playerContainer.appendChild(videoElement);
        playerContainer.appendChild(controlBar);

        // 添加到页面
        document.body.appendChild(playerContainer);

        // 添加HLS支持脚本（如果需要）
        if (resource.url.includes('.m3u8') && !window.Hls) {
            const hlsScript = document.createElement('script');
            hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            document.head.appendChild(hlsScript);
            hlsScript.onload = () => {
                this.createVideoPlayer(resource);
            };
        }
    }

    // 注入样式
    injectStyles() {
        GM_addStyle(`
            /* 面板样式 */
            #resource-sniffer-panel {
                position: fixed;
                width: ${this.config.panel.width};
                height: ${this.config.panel.height};
                left: ${this.config.panel.left};
                top: ${this.config.panel.top};
                background: #1e1e1e;
                border-radius: 8px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
                z-index: 30000;
                display: flex;
                flex-direction: column;
                opacity: ${this.config.panel.opacity};
                transition: opacity 0.3s;
                font-family: 'Microsoft YaHei', Arial, sans-serif;
            }

            /* 面板头部 */
            #sniffer-panel-header {
                padding: 10px 15px;
                background: #2d2d2d;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
            }

            #panel-title {
                color: white;
                font-size: 14px;
                font-weight: bold;
            }

            #panel-controls {
                display: flex;
                gap: 8px;
            }

            .panel-btn {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                transition: background 0.2s;
            }

            .panel-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            /* 标签栏 */
            #sniffer-tabs {
                display: flex;
                background: #252526;
                overflow-x: auto;
                white-space: nowrap;
                border-bottom: 1px solid #373737;
            }

            .tab-btn {
                padding: 8px 15px;
                color: #d4d4d4;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .tab-btn.active {
                color: white;
                background: #1e1e1e;
                border-bottom: 2px solid #0078d7;
            }

            .tab-btn:hover:not(.active) {
                background: rgba(255, 255, 255, 0.05);
            }

            /* 资源列表 */
            #resources-container {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }

            #resources-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .resource-item {
                background: #2d2d2d;
                border-radius: 6px;
                margin-bottom: 10px;
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .resource-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }

            .resource-header {
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #252526;
                cursor: pointer;
            }

            .resource-title {
                color: white;
                font-size: 13px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
                margin-right: 10px;
            }

            .resource-size {
                color: #999;
                font-size: 12px;
                margin-right: 10px;
            }

            .resource-type-badge {
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11px;
                color: white;
                display: flex;
                align-items: center;
                gap: 3px;
            }

            .type-image {
                background: #0078d7;
            }

            .type-video {
                background: #00bcf2;
            }

            .type-audio {
                background: #7c7cd9;
            }

            .type-document {
                background: #d83b01;
            }

            .type-other {
                background: #515151;
            }

            .resource-content {
                padding: 10px;
                display: none;
            }

            .resource-preview-container {
                width: 100%;
                height: 180px;
                background: #1e1e1e;
                border-radius: 4px;
                margin-bottom: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                position: relative;
            }

            .resource-thumbnail {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .resource-actions {
                display: flex;
                gap: 10px;
            }

            .resource-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                font-weight: bold;
                transition: background 0.2s;
            }

            .preview {
                background: #0078d7;
                color: white;
            }

            .preview:hover {
                background: #005a9e;
            }

            .download {
                background: #00b42a;
                color: white;
            }

            .download:hover {
                background: #008c22;
            }

            .resource-url {
                margin-top: 10px;
                padding: 8px;
                background: #1e1e1e;
                border-radius: 4px;
                font-size: 12px;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /* 空状态 */
            #empty-state {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                color: #666;
                text-align: center;
            }

            #empty-state svg {
                width: 64px;
                height: 64px;
                margin-bottom: 15px;
                opacity: 0.3;
            }

            /* 预览模态框 */
            #preview-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 30000;
                flex-direction: column;
            }

            #preview-modal .modal-content {
                background: #1e1e1e;
                border-radius: 8px;
                max-width: 90%;
                max-height: 90%;
                overflow: hidden;
                position: relative;
            }

            #preview-modal .modal-header {
                padding: 10px 15px;
                background: #2d2d2d;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #preview-modal .preview-title {
                font-size: 14px;
                font-weight: bold;
            }

            #preview-modal .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }

            #preview-modal .preview-body {
                padding: 10px;
                max-height: 70vh;
                overflow: auto;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #preview-modal img, #preview-modal video, #preview-modal audio {
                max-width: 100%;
                max-height: 70vh;
            }

            /* 切换按钮 */
            #resource-sniffer-toggle {
                position: fixed;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #0078d7, #00bcf2);
                color: white;
                border: none;
                cursor: pointer;
                font-size: 20px;
                z-index: 29999;
                box-shadow: 0 5px 15px rgba(0, 120, 215, 0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                right: 20px;
                bottom: 20px;
                transition: all 0.3s;
            }

            #resource-sniffer-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 20px rgba(0, 120, 215, 0.4);
            }

            #resource-sniffer-toggle .resource-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff3b30;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                border: 2px solid white;
            }

            /* 自定义样式类 */
            .current-video-badge {
                background-color: #ff3b30;
                color: white;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                margin-left: 5px;
            }

            .priority-video {
                background-color: #ff9500 !important;
            }

            /* 手机端响应式布局 */
            @media screen and (max-width: 768px) {
                #resource-sniffer-panel {
                    width: 95% !important;
                    height: 80% !important;
                    left: 2.5% !important;
                    top: 10% !important;
                }

                .resource-title {
                    font-size: 14px !important;
                    max-width: 60% !important;
                }

                .resource-size {
                    font-size: 12px !important;
                }

                .resource-type-badge {
                    font-size: 12px !important;
                    padding: 2px 5px !important;
                    margin-left: 5px !important;
                }

                .resource-btn {
                    padding: 6px !important;
                    font-size: 12px !important;
                }
            }

            /* 滚动条样式 */
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #2d2d2d;
            }

            ::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #777;
            }
        `);
    }

    // 创建切换按钮
    createToggleButton() {
        if (!document.body) {
            console.error('document.body 不存在，无法创建切换按钮');
            return;
        }

        // 避免重复创建
        if (this.toggleButton) {
            return;
        }

        try {
            this.toggleButton = document.createElement('button');
            this.toggleButton.id = 'resource-sniffer-toggle';
            this.toggleButton.innerHTML = `
                🕵️
                <span class="resource-count">0</span>
            `;
            this.toggleButton.title = '资源嗅探器 Pro v4';

            // 添加点击事件
            this.toggleButton.addEventListener('click', () => this.togglePanel());

            // 添加到页面
            document.body.appendChild(this.toggleButton);
            console.log('切换按钮已创建');
        } catch (error) {
            console.error('创建切换按钮失败:', error);
            // 尝试延迟后重试
            setTimeout(() => this.createToggleButton(), 500);
        }
    }

    // 切换面板显示/隐藏
    togglePanel() {
        this.panelVisible = !this.panelVisible;

        if (this.panelVisible) {
            this.createPanel();
            this.panelElement.style.display = 'flex';
        } else {
            if (this.panelElement) {
                this.panelElement.style.display = 'none';
            }
        }
    }

    // 创建面板
    createPanel() {
        if (this.panelElement) {
            return;
        }

        // 确保document.body已加载
        if (!document.body) {
            console.error('document.body 不存在，无法创建面板');
            setTimeout(() => this.createPanel(), 500);
            return;
        }

        try {
            // 创建面板元素
            this.panelElement = document.createElement('div');
            this.panelElement.id = 'resource-sniffer-panel';
            this.panelElement.style.display = 'none';

            // 面板头部
            const header = document.createElement('div');
            header.id = 'sniffer-panel-header';
            header.innerHTML = `
                <div id="panel-title">资源嗅探器 Pro v4</div>
                <div id="panel-controls">
                    <button class="panel-btn" id="minimize-btn" title="最小化">—</button>
                    <button class="panel-btn" id="refresh-btn" title="刷新">↻</button>
                    <button class="panel-btn" id="close-btn" title="关闭">×</button>
                </div>
            `;

            // 标签栏
            const tabs = document.createElement('div');
            tabs.id = 'sniffer-tabs';

            // 添加所有标签
            let tabsHTML = '<button class="tab-btn active" data-tab="all">全部</button>';
            for (const [type, config] of Object.entries(this.config.resourceTypes)) {
                if (config.enabled) {
                    tabsHTML += `<button class="tab-btn" data-tab="${type}">${config.icon} ${type}</button>`;
                }
            }
            tabs.innerHTML = tabsHTML;

            // 资源列表容器
            const resourcesContainer = document.createElement('div');
            resourcesContainer.id = 'resources-container';

            // 空状态
            const emptyState = document.createElement('div');
            emptyState.id = 'empty-state';
            emptyState.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <div>暂无检测到的资源</div>
                <div style="font-size: 12px; margin-top: 5px;">访问网页时会自动检测资源</div>
            `;
            resourcesContainer.appendChild(emptyState);

            // 资源列表
            const resourcesList = document.createElement('ul');
            resourcesList.id = 'resources-list';
            resourcesContainer.appendChild(resourcesList);

            // 组装面板
            this.panelElement.appendChild(header);
            this.panelElement.appendChild(tabs);
            this.panelElement.appendChild(resourcesContainer);

            // 添加到页面
            document.body.appendChild(this.panelElement);

            // 添加标签点击事件
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    // 移除所有激活状态
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    // 添加当前激活状态
                    btn.classList.add('active');
                    // 更新当前标签
                    this.activeTab = btn.dataset.tab;
                    // 更新资源列表
                    this.updateResourceList();
                });
            });

            // 添加面板控制事件
            document.getElementById('close-btn').addEventListener('click', () => {
                this.panelVisible = false;
                this.panelElement.style.display = 'none';
            });

            document.getElementById('minimize-btn').addEventListener('click', () => {
                this.panelElement.style.height = '40px';
                tabs.style.display = 'none';
                resourcesContainer.style.display = 'none';
            });

            document.getElementById('refresh-btn').addEventListener('click', () => {
                this.updateResourceList();
            });

            // 添加拖拽功能
            header.addEventListener('mousedown', (e) => {
                this.isDragging = true;
                this.dragOffset.x = e.clientX - this.panelElement.getBoundingClientRect().left;
                this.dragOffset.y = e.clientY - this.panelElement.getBoundingClientRect().top;
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                e.preventDefault();
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                this.panelElement.style.left = `${x}px`;
                this.panelElement.style.top = `${y}px`;
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
            });

            console.log('面板已创建');
        } catch (error) {
            console.error('创建面板失败:', error);
            // 尝试延迟后重试
            setTimeout(() => this.createPanel(), 500);
        }
    }

    // 更新UI
    updateUI() {
        const now = Date.now();
        if (now - this.lastUpdateTime < this.config.updateInterval) {
            return;
        }
        this.lastUpdateTime = now;

        // 更新资源计数
        this.updateResourceCount();

        // 如果面板可见，更新资源列表
        if (this.panelVisible) {
            this.updateResourceList();
        }
    }

    // 更新资源计数
    updateResourceCount() {
        const count = this.resources.size;
        this.resourceCount = count;

        // 更新按钮上的计数
        if (this.toggleButton) {
            const countElement = this.toggleButton.querySelector('.resource-count');
            if (countElement) {
                countElement.textContent = count;
            }
        }
    }

    // 更新资源列表
    updateResourceList() {
        const resourcesList = document.getElementById('resources-list');
        const emptyState = document.getElementById('empty-state');

        if (!resourcesList || !emptyState) {
            return;
        }

        // 清空列表
        resourcesList.innerHTML = '';

        // 筛选资源
        let filteredResources = Array.from(this.resources.values());

        if (this.activeTab !== 'all') {
            filteredResources = filteredResources.filter(resource => resource.type === this.activeTab);
        }

        // 优化排序：视频优先，当前播放视频优先，M3U8/MP4优先，最后按大小排序
        const currentVideoUrl = this.getCurrentVideoUrl();
        filteredResources.sort((a, b) => {
            // 1. 判断是否为视频类型
            const isVideoA = a.type === 'video' && (a.extension === 'mp4' || a.extension === 'm3u8' || a.url.includes('.mp4') || a.url.includes('.m3u8'));
            const isVideoB = b.type === 'video' && (b.extension === 'mp4' || b.extension === 'm3u8' || b.url.includes('.mp4') || b.url.includes('.m3u8'));

            if (isVideoA !== isVideoB) {
                return isVideoA ? -1 : 1;
            }

            // 2. 判断是否为当前播放视频
            const isCurrentA = currentVideoUrl && (a.url === currentVideoUrl || a.url.includes(currentVideoUrl.split('?')[0]));
            const isCurrentB = currentVideoUrl && (b.url === currentVideoUrl || b.url.includes(currentVideoUrl.split('?')[0]));

            if (isCurrentA !== isCurrentB) {
                return isCurrentA ? -1 : 1;
            }

            // 3. M3U8和MP4优先
            const isPriorityFormatA = a.extension === 'm3u8' || a.url.includes('.m3u8') || a.extension === 'mp4' || a.url.includes('.mp4');
            const isPriorityFormatB = b.extension === 'm3u8' || b.url.includes('.m3u8') || b.extension === 'mp4' || b.url.includes('.mp4');

            if (isPriorityFormatA !== isPriorityFormatB) {
                return isPriorityFormatA ? -1 : 1;
            }

            // 4. 最后按大小排序
            return b.size - a.size;
        });

        // 显示空状态或资源列表
        if (filteredResources.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';

            // 添加资源项
            filteredResources.forEach(resource => {
                const resourceItem = this.createResourceItem(resource);
                resourcesList.appendChild(resourceItem);
            });
        }
    }

    // 创建资源项
    createResourceItem(resource) {
        const item = document.createElement('li');
        item.className = 'resource-item';

        // 判断是否为优先视频格式
        const isPriorityVideo = resource.type === 'video' &&
                               (resource.extension === 'mp4' || resource.extension === 'm3u8' ||
                                resource.url.includes('.mp4') || resource.url.includes('.m3u8'));

        // 判断是否为当前播放视频
        const currentVideoUrl = this.getCurrentVideoUrl();
        const isCurrentVideo = currentVideoUrl &&
                              (resource.url === currentVideoUrl ||
                               resource.url.includes(currentVideoUrl.split('?')[0]));

        // 资源头部
        const header = document.createElement('div');
        header.className = 'resource-header';
        header.innerHTML = `
            <div class="resource-title">${this.truncateText(resource.name, 30)}${isCurrentVideo ? ' <span class="current-video-badge">正在播放</span>' : ''}</div>
            <div class="resource-size">${this.formatSize(resource.size)}</div>
            <div class="resource-type-badge type-${resource.type} ${isPriorityVideo ? 'priority-video' : ''}">
                ${isPriorityVideo ? '🎬' : this.config.resourceTypes[resource.type].icon} ${resource.type}${isPriorityVideo ? (resource.extension === 'm3u8' || resource.url.includes('.m3u8') ? ' (M3U8)' : ' (MP4)') : ''}
            </div>
        `;

        // 点击展开/折叠
        header.addEventListener('click', () => {
            const content = item.querySelector('.resource-content');
            if (content) {
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            }
        });

        // 资源内容
        const content = document.createElement('div');
        content.className = 'resource-content';

        // 资源预览
        const previewContainer = document.createElement('div');
        previewContainer.className = 'resource-preview-container';

        // 根据资源类型创建预览
        if (resource.type === 'image') {
            const img = document.createElement('img');
            img.className = 'resource-thumbnail';
            img.src = resource.url;
            img.alt = resource.name;
            previewContainer.appendChild(img);
        } else if (resource.type === 'video') {
            const video = document.createElement('video');
            video.className = 'resource-thumbnail';
            video.controls = true;
            video.src = resource.url;
            previewContainer.appendChild(video);
        } else if (resource.type === 'audio') {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = resource.url;
            previewContainer.appendChild(audio);
        } else {
            // 其他类型的资源，显示图标
            previewContainer.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 48px;">${this.config.resourceTypes[resource.type].icon}</div>
                    <div style="margin-top: 10px;">${resource.type.toUpperCase()}</div>
                </div>
            `;
        }

        // 资源操作
        const actions = document.createElement('div');
        actions.className = 'resource-actions';
        actions.innerHTML = `
            <button class="resource-btn preview" data-url="${resource.url}" data-type="${resource.type}" data-name="${resource.name}">预览</button>
            <button class="resource-btn download" data-url="${resource.url}" data-name="${resource.name}">下载</button>
        `;

        // 添加操作事件
        actions.querySelector('.preview').addEventListener('click', (e) => {
            e.stopPropagation();
            this.previewResource(resource);
        });

        actions.querySelector('.download').addEventListener('click', (e) => {
            e.stopPropagation();
            this.downloadResource(resource);
        });

        // 资源URL
        const url = document.createElement('div');
        url.className = 'resource-url';
        url.textContent = resource.url;

        // 组装资源项
        content.appendChild(previewContainer);
        content.appendChild(actions);
        content.appendChild(url);

        item.appendChild(header);
        item.appendChild(content);

        return item;
    }

    // 预览资源
    previewResource(resource) {
        // 创建预览模态框
        if (!this.previewModal) {
            this.createPreviewModal();
        }

        // 设置预览内容
        const previewBody = document.querySelector('#preview-modal .preview-body');
        const previewTitle = document.querySelector('#preview-modal .preview-title');

        if (previewBody && previewTitle) {
            previewTitle.textContent = resource.name;

            // 根据资源类型创建预览内容
            if (resource.type === 'image') {
                previewBody.innerHTML = `
                    <img src="${resource.url}" alt="${resource.name}">
                `;
            } else if (resource.type === 'video') {
                previewBody.innerHTML = `
                    <video controls autoplay>
                        <source src="${resource.url}" type="video/${resource.extension}">
                    </video>
                `;
            } else if (resource.type === 'audio') {
                previewBody.innerHTML = `
                    <audio controls autoplay>
                        <source src="${resource.url}" type="audio/${resource.extension}">
                    </audio>
                `;
            } else {
                // 其他类型资源，显示信息和下载按钮
                previewBody.innerHTML = `
                    <div style="text-align: center; color: white;">
                        <div style="font-size: 64px; margin-bottom: 20px;">${this.config.resourceTypes[resource.type].icon}</div>
                        <h3>${resource.name}</h3>
                        <p>类型: ${resource.type}</p>
                        <p>大小: ${this.formatSize(resource.size)}</p>
                        <button class="resource-btn download" style="margin-top: 20px;" data-url="${resource.url}" data-name="${resource.name}">下载</button>
                    </div>
                `;

                // 添加下载事件
                previewBody.querySelector('.download').addEventListener('click', () => {
                    this.downloadResource(resource);
                });
            }
        }

        // 显示预览模态框
        this.previewModal.style.display = 'flex';
    }

    // 创建预览模态框
    createPreviewModal() {
        if (this.previewModal) {
            return;
        }

        this.previewModal = document.createElement('div');
        this.previewModal.id = 'preview-modal';
        this.previewModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="preview-title"></div>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="preview-body"></div>
            </div>
        `;

        // 添加关闭事件
        this.previewModal.querySelector('.close-btn').addEventListener('click', () => {
            this.previewModal.style.display = 'none';
        });

        // 点击模态框外部关闭
        this.previewModal.addEventListener('click', (e) => {
            if (e.target === this.previewModal) {
                this.previewModal.style.display = 'none';
            }
        });

        // 添加到页面
        document.body.appendChild(this.previewModal);
    }

    // 下载资源
    downloadResource(resource) {
        try {
            console.log(`开始下载资源: ${resource.name}`);

            // 判断资源类型
            if (resource.url.includes('.m3u8') || resource.type === 'video') {
                // 视频资源，使用高级下载方法
                this.m3u8Download(resource);
            } else {
                // 普通资源下载
                GM_download({
                    url: resource.url,
                    name: resource.name,
                    saveAs: true,
                    headers: resource.headers || {},
                    onprogress: (event) => {
                        if (event) {
                            const progress = ((event.loaded / event.total) * 100).toFixed(2);
                            console.log(`下载进度: ${progress}% - ${resource.name}`);
                            // 这里可以添加进度显示逻辑
                        }
                    },
                    onload: () => {
                        console.log(`资源下载完成: ${resource.name}`);
                    },
                    onerror: (error) => {
                        console.error(`下载资源失败: ${resource.name}`, error);
                        // 尝试使用备用下载方法
                        this.fallbackDownload(resource);
                    }
                });
            }
        } catch (error) {
            console.error(`下载资源失败: ${resource.name}`, error);
            this.fallbackDownload(resource);
        }
    }

    // 降级下载方案
    fallbackDownload(resource) {
        const a = document.createElement('a');
        a.href = resource.url;
        a.download = resource.name;
        // 添加请求头信息
        if (resource.headers) {
            // 注意: 浏览器环境下无法通过a标签设置请求头
            console.warn('无法为a标签下载设置请求头，可能导致下载失败');
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // m3u8视频下载
    m3u8Download(resource) {
        console.log(`开始解析m3u8视频: ${resource.name}`);

        // 创建下载进度条
        this.createDownloadProgress(resource.id, resource.name);

        // 初始化变量
        const chunks = [];
        const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
        let totalSize = 0;
        let downloadedSize = 0;
        let isEncrypted = false;
        let keyUrl = null;
        let iv = null;

        // 获取m3u8文件
        this.fetchWithHeaders(resource.url, resource.headers || {})
            .then(response => response.text())
            .then(playlist => {
                // 解析m3u8播放列表
                const lines = playlist.split('\n').filter(line => line.trim() !== '');

                // 检查是否加密
                for (const line of lines) {
                    if (line.startsWith('#EXT-X-KEY')) {
                        isEncrypted = true;
                        const keyMatch = line.match(/URI="([^"]+)"/);
                        if (keyMatch) {
                            keyUrl = new URL(keyMatch[1], resource.url).href;
                        }
                        const ivMatch = line.match(/IV=([0-9A-Fa-f]+)/);
                        if (ivMatch) {
                            iv = ivMatch[1];
                        }
                        break;
                    }
                }

                // 提取TS片段
                const tsUrls = [];
                for (let i = 0; i < lines.length; i++) {
                    if (!lines[i].startsWith('#')) {
                        // 处理相对路径
                        tsUrls.push(new URL(lines[i], resource.url).href);
                    }
                }

                totalSize = tsUrls.length;
                console.log(`找到 ${totalSize} 个TS片段`);

                // 下载TS片段
                const downloadPromises = tsUrls.map((tsUrl, index) => {
                    return this.fetchWithHeaders(tsUrl, resource.headers || {})
                        .then(response => response.arrayBuffer())
                        .then(buffer => {
                            downloadedSize++;
                            const progress = ((downloadedSize / totalSize) * 100).toFixed(2);
                            console.log(`视频片段下载进度: ${progress}%`);
                            this.updateDownloadProgress(resource.id, progress);

                            // 如果加密，进行解密
                            if (isEncrypted && keyUrl) {
                                // 这里应该实现解密逻辑
                                console.warn('视频已加密，解密功能待实现');
                                return buffer;
                            }
                            return buffer;
                        });
                });

                // 等待所有片段下载完成
                Promise.all(downloadPromises)
                    .then(buffers => {
                        console.log(`所有TS片段下载完成，开始合并`);

                        // 合并所有片段
                        const mergedBuffer = new Uint8Array(buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0));
                        let offset = 0;
                        buffers.forEach(buffer => {
                            mergedBuffer.set(new Uint8Array(buffer), offset);
                            offset += buffer.byteLength;
                        });

                        // 创建下载链接
                        const blob = new Blob([mergedBuffer], { type: 'video/mp4' });
                        const url = URL.createObjectURL(blob);

                        const a = document.createElement('a');
                        a.href = url;
                        a.download = resource.name.replace(/\.m3u8$/, '.mp4');
                        document.body.appendChild(a);
                        a.click();

                        // 清理
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            this.removeDownloadProgress(resource.id);
                        }, 1000);
                    })
                    .catch(error => {
                        console.error('下载TS片段失败:', error);
                        this.updateDownloadProgress(resource.id, '错误', true);
                    });
            })
            .catch(error => {
                console.error('获取m3u8文件失败:', error);
                this.updateDownloadProgress(resource.id, '错误', true);
            });
    }

    // 创建带请求头的fetch
    fetchWithHeaders(url, headers) {
        return fetch(url, {
            headers: headers,
            credentials: 'include'
        });
    }

    // 创建下载进度条
    createDownloadProgress(id, name) {
        // 检查是否已存在进度条
        if (document.getElementById(`download-progress-${id}`)) {
            return;
        }

        const progressContainer = document.createElement('div');
        progressContainer.id = `download-progress-${id}`;
        progressContainer.className = 'download-progress';
        progressContainer.innerHTML = `
            <div class="progress-title">${this.truncateText(name, 30)}</div>
            <div class="progress-bar">
                <div class="progress-value">0%</div>
            </div>
        `;

        // 添加到面板
        if (this.panelElement) {
            this.panelElement.appendChild(progressContainer);
        } else {
            document.body.appendChild(progressContainer);
        }
    }

    // 更新下载进度
    updateDownloadProgress(id, progress, isError = false) {
        const progressContainer = document.getElementById(`download-progress-${id}`);
        if (!progressContainer) return;

        const progressBar = progressContainer.querySelector('.progress-bar');
        const progressValue = progressContainer.querySelector('.progress-value');

        if (progressBar && progressValue) {
            if (isError) {
                progressBar.style.backgroundColor = '#ff4d4f';
                progressValue.textContent = '下载失败';
            } else {
                progressBar.style.width = `${progress}%`;
                progressValue.textContent = `${progress}%`;
            }
        }
    }

    // 移除下载进度条
    removeDownloadProgress(id) {
        const progressContainer = document.getElementById(`download-progress-${id}`);
        if (progressContainer) {
            progressContainer.remove();
        }
    }

    // 拦截请求
    interceptRequests() {
        // 保存原始fetch和XMLHttpRequest
        const originalFetch = window.fetch;
        const originalXhrOpen = XMLHttpRequest.prototype.open;

        // 重写fetch
        window.fetch = async (url, options) => {
            // 处理请求
            this.handleRequest(url);
            // 执行原始fetch
            return originalFetch.apply(this, arguments);
        };

        // 重写XMLHttpRequest.open
        XMLHttpRequest.prototype.open = function(method, url) {
            // 处理请求
            this._url = url;
            this.addEventListener('load', () => {
                if (this.status >= 200 && this.status < 300) {
                    // 尝试获取响应大小
                    const size = this.getResponseHeader('Content-Length') || 0;
                    this.handleRequest(this._url, parseInt(size));
                }
            });
            // 执行原始open
            originalXhrOpen.apply(this, arguments);
        };
    }

    // 处理请求
    handleRequest(url, size = 0) {
        // 跳过本身的请求
        if (url.includes('resource-sniffer')) {
            return;
        }

        // 针对特定网站的视频URL处理
        const videoUrl = this.extractVideoUrl(url);
        if (videoUrl) {
            // 处理提取到的视频URL
            const resourceInfo = this.getResourceInfo(videoUrl, size);
            if (resourceInfo) {
                // 添加到资源列表
                this.addResource(resourceInfo);
            }
            return;
        }

        // 检查是否为有效的资源URL
        const resourceInfo = this.getResourceInfo(url, size);
        if (resourceInfo) {
            // 添加到资源列表
            this.addResource(resourceInfo);
        }
    }

    // 提取视频URL（针对特定网站）
    extractVideoUrl(url) {
        // 西瓜视频
        if (url.includes('ixigua.com')) {
            // 处理西瓜视频API请求
            if (url.includes('ixigua.com/api/albumv2/') ||
                url.includes('ixigua.com/api/videov2/pseries_more_v2') ||
                url.includes('ixigua.com/api/mixVideo/')) {
                return url;
            }
            // 普通西瓜视频URL
            return url;
        }

        // 抖音
        if (url.includes('douyin.com')) {
            // 抖音API处理
            if (url.includes('v3-web-prime.douyinvod.com/video/') ||
                url.includes('v26-web-prime.douyinvod.com/video/') ||
                url.includes('douyin.com/aweme/v1/play/?file_id=')) {
                return url;
            }
            return url;
        }

        // YouTube
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            // 提取真实视频URL
            if (url.includes('youtube.com/watch')) {
                const videoId = new URL(url).searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/get_video_info?video_id=${videoId}`;
                }
            }
            return url;
        }

        // B站
        if (url.includes('bilibili.com')) {
            // B站API处理
            if (url.includes('api.bilibili.com/x/player/playurl')) {
                return url;
            }
            // 视频页面URL
            if (url.includes('bilibili.com/video/') || url.includes('bilibili.com/bangumi/')) {
                // 提取avid和cid
                const match = url.match(/(av\d+|BV\w+)/);
                if (match) {
                    const aid = match[0];
                    return `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=0&qn=120`;
                }
            }
            return url;
        }

        // 央视网
        if (url.includes('cntv')) {
            if (url.includes('/asp/')) {
                // 央视网URL特殊处理
                const realUrl = url.replace(/.+?cntv.*?\/asp\/.*?hls\/(.*)/, 'https://hls.cntv.myalicdn.com/asp/hls/$1');
                return realUrl;
            }
            return url;
        }

        // 通用视频格式检测
        const videoExtensions = ['.m3u8', '.mp4', '.webm', '.flv', '.avi', '.mov',
                               '.f4v', '.mkv', '.rmvb', '.wmv', '.3gp', '.ts'];
        for (const ext of videoExtensions) {
            if (url.includes(ext)) {
                return url;
            }
        }

        // 处理没有扩展名但可能是视频的URL
        const videoKeywords = ['video', 'stream', 'media', 'play', 'source', 'file', 'vod'];
        for (const keyword of videoKeywords) {
            if (url.toLowerCase().includes(keyword)) {
                // 检查是否为PHP请求但没有明显视频扩展名
                if (url.includes('.php') && !url.includes('.jpg') && !url.includes('.png') &&
                    !url.includes('.gif') && !url.includes('.css') && !url.includes('.js')) {
                    return url + '&type=.m3u8'; // 尝试添加m3u8格式参数
                }
                return url;
            }
        }

        return null;
    }

    // 获取资源信息
    getResourceInfo(url, size = 0) {
        try {
            const parsedUrl = new URL(url);
            const pathname = parsedUrl.pathname;
            let filename = pathname.split('/').pop() || 'unknown';
            let extension = filename.split('.').pop().toLowerCase();
            const siteInfo = this.getSiteInfo(url);

            // 确定资源类型
            let type = 'other';
            let quality = 'unknown';
            let duration = 0;

            // 视频扩展名和关键词
            const videoExtensions = ['.m3u8', '.mp4', '.webm', '.flv', '.avi', '.mov',
                                   '.f4v', '.mkv', '.rmvb', '.wmv', '.3gp', '.ts'];
            const videoKeywords = ['video', 'stream', 'media', 'play', 'source', 'vod', 'watch'];

            // 音频扩展名
            const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.opus'];

            // 图片扩展名
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

            // 文档扩展名
            const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

            // 压缩包扩展名
            const archiveExtensions = ['.zip', '.rar', '.7z', '.tar', '.gz'];

            // 特殊处理没有扩展名但可能是视频的URL
            if (extension === filename) {
                // 检查是否为视频URL
                if (url.includes('.m3u8') || videoKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
                    type = 'video';
                    extension = 'mp4'; // 假设默认视频格式
                }
            } else {
                // 根据扩展名确定资源类型
                if (videoExtensions.includes('.' + extension)) {
                    type = 'video';
                } else if (audioExtensions.includes('.' + extension)) {
                    type = 'audio';
                } else if (imageExtensions.includes('.' + extension)) {
                    type = 'image';
                } else if (documentExtensions.includes('.' + extension)) {
                    type = 'document';
                } else if (archiveExtensions.includes('.' + extension)) {
                    type = 'archive';
                } else {
                    // 检查是否为视频URL关键词
                    if (videoKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
                        type = 'video';
                        extension = 'mp4';
                    }
                }
            }

            // 额外检查：如果URL包含视频相关关键词但类型不是视频
            if (type !== 'video' && (url.includes('.m3u8') || videoKeywords.some(keyword => url.toLowerCase().includes(keyword)))) {
                type = 'video';
                extension = 'mp4';
            }

            // 尝试提取视频质量
            if (type === 'video') {
                if (url.includes('quality')) {
                    const qualityMatch = url.match(/quality=(\d+)/);
                    if (qualityMatch) {
                        quality = `${qualityMatch[1]}p`;
                    }
                } else if (url.includes('resolution')) {
                    const resolutionMatch = url.match(/resolution=(\d+x\d+)/);
                    if (resolutionMatch) {
                        quality = resolutionMatch[1];
                    }
                } else if (url.includes('1080') || url.includes('fhd')) {
                    quality = '1080p';
                } else if (url.includes('720') || url.includes('hd')) {
                    quality = '720p';
                } else if (url.includes('480') || url.includes('sd')) {
                    quality = '480p';
                } else if (url.includes('360')) {
                    quality = '360p';
                }
            }

            // 网站特定处理
            let headers = {};
            if (siteInfo.name === 'ixigua') {
                headers.Referer = 'https://www.ixigua.com/';
                headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';
            } else if (siteInfo.name === 'douyin') {
                headers.Referer = 'https://www.douyin.com/';
                headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
            } else if (siteInfo.name === 'cntv') {
                headers.Referer = 'https://tv.cctv.com/';
                headers['Origin'] = 'https://tv.cctv.com';
                // 央视网特定处理
                if (url.includes('.m3u8')) {
                    // 处理不同分辨率
                    if (url.includes('main.m3u8')) {
                        // 提供多种分辨率选项
                        const url720p = url.replace(/main.m3u8.*/, '1200.m3u8').replace('hls/main/', 'hls/1200/');
                        const url1080p = url.replace(/main.m3u8.*/, '2000.m3u8').replace('hls/main/', 'hls/2000/');
                        // 这里可以在资源信息中添加多个分辨率选项
                    }
                }
            } else if (siteInfo.name === 'javplayer') {
                headers.Referer = 'https://javplayer.me/';
            } else if (siteInfo.name === 'aliyundrive') {
                headers.Referer = 'https://www.aliyundrive.com/';
            } else if (siteInfo.name === 'bilibili') {
                headers.Referer = 'https://www.bilibili.com/';
                headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';
            } else if (siteInfo.name === 'youtube') {
                headers.Referer = 'https://www.youtube.com/';
            }

            // 添加通用请求头以提高兼容性
            if (!headers['User-Agent']) {
                headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';
            }
            headers['Accept-Language'] = 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7';

            // 忽略小资源
            if (this.config.ignoreSmallResources && size > 0 && size < this.config.minResourceSize) {
                // 视频资源即使小也不忽略
                if (type !== 'video') {
                    return null;
                }
            }

            // 优化文件名
            if (filename === 'unknown' || filename.length > 100) {
                filename = `${type}_${Date.now()}.${extension}`;
            } else if (!filename.includes('.')) {
                filename = `${filename}.${extension}`;
            }

            return {
                id: url + Date.now().toString(), // 确保ID唯一
                url: url,
                name: filename,
                extension: extension,
                type: type,
                size: size,
                duration: duration,
                quality: quality,
                timestamp: Date.now(),
                // 添加网站特定信息
                site: siteInfo.name,
                siteIcon: siteInfo.icon,
                siteCategory: siteInfo.category,
                // 添加请求头信息
                headers: headers
            };
        } catch (error) {
            console.error('解析URL失败:', error);
            return null;
        }
    }

    // 获取网站信息
    getSiteInfo(url) {
        let name = 'other';
        let icon = '🔍';
        let category = 'general';

        if (url.includes('ixigua.com')) {
            name = 'ixigua';
            icon = '🍉';
            category = 'video';
        } else if (url.includes('douyin.com') || url.includes('douyinvod.com')) {
            name = 'douyin';
            icon = '🎵';
            category = 'video';
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            name = 'youtube';
            icon = '▶️';
            category = 'video';
        } else if (url.includes('bilibili.com') || url.includes('bilibili.tv')) {
            name = 'bilibili';
            icon = '📱';
            category = 'video';
        } else if (url.includes('cntv') || url.includes('cctv.com')) {
            name = 'cntv';
            icon = '📺';
            category = 'video';
        } else if (url.includes('javplayer.me')) {
            name = 'javplayer';
            icon = '🎬';
            category = 'video';
        } else if (url.includes('aliyundrive.com')) {
            name = 'aliyundrive';
            icon = '☁️';
            category = 'storage';
        } else if (url.includes('weibo.cn') || url.includes('weibo.com')) {
            name = 'weibo';
            icon = '🐦';
            category = 'social';
        } else if (url.includes('qq.com') || url.includes('qzone.qq.com') || url.includes('v.qq.com')) {
            name = 'qq';
            icon = '🐧';
            category = 'video';
        } else if (url.includes('music.163.com') || url.includes('netease.com')) {
            name = 'netease';
            icon = '🎶';
            category = 'music';
        } else if (url.includes('qqmusic.qq.com')) {
            name = 'qqmusic';
            icon = '🎵';
            category = 'music';
        } else if (url.includes('spotify.com')) {
            name = 'spotify';
            icon = '🎧';
            category = 'music';
        } else if (url.includes('iwara.tv')) {
            name = 'iwara';
            icon = '🎮';
            category = 'video';
        } else if (url.includes('telegram.org') || url.includes('t.me')) {
            name = 'telegram';
            icon = '✉️';
            category = 'social';
        } else if (url.includes('github.com')) {
            name = 'github';
            icon = '💻';
            category = 'code';
        }

        return {
            name: name,
            icon: icon,
            category: category
        };
    }

    // 添加资源
    addResource(resource) {
        // 检查是否已存在
        if (this.resources.has(resource.id)) {
            return;
        }

        // 检查是否超过最大资源数
        if (this.resources.size >= this.config.maxResources) {
            // 删除最早添加的资源
            const oldestResource = Array.from(this.resources.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
            this.resources.delete(oldestResource[0]);
        }

        // 添加资源
        this.resources.set(resource.id, resource);

        // 更新UI
        this.updateUI();
    }

    // 监听媒体元素
    monitorMediaElements() {
        // 定期检查新的媒体元素
        setInterval(() => {
            // 检查图片
            document.querySelectorAll('img:not([data-sniffed])').forEach(img => {
                img.dataset.sniffed = 'true';
                const url = img.src;
                this.handleRequest(url);
            });

            // 检查视频
            document.querySelectorAll('video:not([data-sniffed])').forEach(video => {
                video.dataset.sniffed = 'true';
                // 检查视频源
                video.querySelectorAll('source').forEach(source => {
                    const url = source.src;
                    this.handleRequest(url);
                });
                // 如果视频有直接src
                if (video.src) {
                    this.handleRequest(video.src);
                }

                // 监听视频属性变化
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.attributeName === 'src' && video.src) {
                            this.handleRequest(video.src);
                        }
                    });
                });
                observer.observe(video, { attributes: true });
            });

            // 检查音频
            document.querySelectorAll('audio:not([data-sniffed])').forEach(audio => {
                audio.dataset.sniffed = 'true';
                // 检查音频源
                audio.querySelectorAll('source').forEach(source => {
                    const url = source.src;
                    this.handleRequest(url);
                });
                // 如果音频有直接src
                if (audio.src) {
                    this.handleRequest(audio.src);
                }
            });

            // 检查iframe中的媒体元素
            document.querySelectorAll('iframe:not([data-sniffed])').forEach(iframe => {
                try {
                    iframe.dataset.sniffed = 'true';
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        // 检查iframe中的图片
                        iframeDoc.querySelectorAll('img:not([data-sniffed])').forEach(img => {
                            img.dataset.sniffed = 'true';
                            const url = img.src;
                            this.handleRequest(url);
                        });

                        // 检查iframe中的视频
                        iframeDoc.querySelectorAll('video:not([data-sniffed])').forEach(video => {
                            video.dataset.sniffed = 'true';
                            const url = video.src;
                            this.handleRequest(url);
                        });
                    }
                } catch (e) {
                    // 跨域iframe无法访问，忽略
                }
            });
        }, 2000);
    }

    // 获取当前播放的视频URL
    getCurrentVideoUrl() {
        try {
            // 检查页面中是否有正在播放的视频
            const videos = document.querySelectorAll('video');
            for (const video of videos) {
                if (!video.paused) {
                    return video.currentSrc || video.src;
                }
            }

            // 如果没有正在播放的视频，检查是否有最近加载的视频
            if (videos.length > 0) {
                return videos[videos.length - 1].currentSrc || videos[videos.length - 1].src;
            }

            return null;
        } catch (error) {
            console.error('获取当前播放视频URL失败:', error);
            return null;
        }
    }

    // 格式化大小
    formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 截断文本
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// 初始化资源嗅探器
window.addEventListener('load', () => {
    setTimeout(() => {
        const sniffer = new ResourceSniffer();
        // 为了测试，直接显示面板
        sniffer.panelVisible = true;
        sniffer.createPanel();
        sniffer.panelElement.style.display = 'flex';
    }, 1000);
});