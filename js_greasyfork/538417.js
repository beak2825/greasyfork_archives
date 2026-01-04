// ==UserScript==
// @name         网页资源检测工具 (终极优化版)
// @namespace    https://viayoo.com/
// @version      1.5
// @description  引入悬浮球三态逻辑（收起/展开/面板打开），增加超时自动收起功能，交互体验登峰造极。
// @author       Doubao (Optimized by Gemini)
// @run-at       document-idle
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/538417/%E7%BD%91%E9%A1%B5%E8%B5%84%E6%BA%90%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7%20%28%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538417/%E7%BD%91%E9%A1%B5%E8%B5%84%E6%BA%90%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7%20%28%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS样式 ---
    GM_addStyle(`
        /* 悬浮球基础样式，默认完全隐藏 */
        #resourceDetectorBall {
            position: fixed; top: 80px; left: -55px; 
            width: 55px; height: 42px;
            border-radius: 0 21px 21px 0;
            background: linear-gradient(135deg, #4285f4, #34a853);
            color: white; display: flex; align-items: center; justify-content: flex-end;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); z-index: 9999;
            cursor: pointer; transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-weight: 500; font-size: 14px; text-align: center;
            padding-right: 8px; user-select: none; border: 2px solid white; border-left: none;
        }
        /* 新增：收起状态 (只露出15px) */
        #resourceDetectorBall.retracted {
            left: -40px; /* 55px宽度 - 15px露出 = 40px隐藏 */
        }
        /* 新增：展开状态 */
        #resourceDetectorBall.expanded {
            left: 0;
        }
        #resourceDetectorBall:hover { transform: scale(1.05); }
        #resourceBallBadge {
            position: absolute; top: -1px; right: -1px; width: 10px; height: 10px;
            background-color: #FF3B30; border-radius: 50%; border: 2px solid #fff; display: none;
        }
        .tab-badge {
            display: inline-block; min-width: 22px; height: 22px; border-radius: 11px;
            background-color: #FF3B30; color: white; font-size: 12px; line-height: 22px;
            text-align: center; margin-left: 8px; font-weight: bold;
        }
        #resourceDetectorPanel {
            position: fixed; top: 65px; left: 15px; width: 320px;
            background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(12px);
            border-radius: 14px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            z-index: 9998; display: none; overflow: hidden;
            border: 1px solid rgba(230, 236, 245, 0.7); opacity: 0;
            transform: translateX(-20px) scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            max-height: 75vh; font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
        }
        #resourceDetectorPanel.active {
            display: block; opacity: 1; transform: translateX(0) scale(1);
        }
        .panel-header {
            padding: 14px; font-size: 17px; font-weight: 600; color: #2c3e50;
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid #f0f3f7; background-color: rgba(245, 248, 255, 0.8);
        }
        .close-btn {
            width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center;
            justify-content: center; background: #f1f3f9; color: #7f8c8d;
            font-size: 17px; cursor: pointer; transition: all 0.2s;
        }
        .close-btn:hover { background: #e5e9f2; color: #e74c3c; }
        .category-tabs { display: flex; background: #f5f8ff; border-bottom: 1px solid #eef2f7; padding: 0 8px; }
        .tab-btn {
            flex: 1; text-align: center; padding: 12px 8px; font-size: 13px; font-weight: 500;
            color: #6b7c93; cursor: pointer; transition: all 0.2s ease;
            border-bottom: 3px solid transparent; display: flex; justify-content: center; align-items: center;
        }
        .tab-btn.active { color: #4285f4; border-bottom-color: #4285f4; background: rgba(66, 133, 244, 0.05); }
        .tab-content { max-height: calc(75vh - 115px); overflow-y: auto; padding: 8px; }
        .resource-list { list-style: none; padding: 0; margin: 0; }
        .resource-item {
            padding: 10px 14px; border-bottom: 1px solid #f0f3f7; display: flex;
            align-items: center; transition: background-color 0.2s;
        }
        .resource-item:hover { background-color: rgba(235, 245, 255, 0.6); }
        .resource-icon { font-size: 18px; width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; margin-right: 10px; flex-shrink: 0; }
        .video-icon { background-color: rgba(234, 67, 53, 0.15); color: #ea4335; }
        .audio-icon { background-color: rgba(52, 168, 83, 0.15); color: #34a853; }
        .image-icon { background-color: rgba(66, 133, 244, 0.15); color: #4285f4; }
        .resource-info { flex: 1; min-width: 0; }
        .resource-name { font-weight: 500; font-size: 13px; color: #2d3748; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
        .resource-meta { font-size: 11px; color: #718096; display: flex; gap: 8px; }
        .resource-actions { margin-left: 8px; flex-shrink: 0; display: flex; gap: 5px; }
        .action-btn {
            width: 28px; height: 28px; border-radius: 7px; display: inline-flex; align-items: center;
            justify-content: center; background: #f5f7fa; color: #5c6bc0; border: none;
            cursor: pointer; transition: all 0.2s; font-size: 14px;
        }
        .action-btn:hover { background: #e8ebf0; transform: scale(1.05); }
        .empty-message { padding: 30px; text-align: center; color: #718096; font-size: 13px; }
        .loading-indicator { text-align: center; padding: 20px; color: #4285f4; font-size: 13px; display: flex; align-items: center; justify-content: center; }
        .refresh-btn { display: flex; align-items: center; justify-content: center; width: calc(100% - 16px); margin: 8px auto 0; padding: 9px; background: #f5f7fa; border: none; border-radius: 7px; color: #4285f4; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .refresh-btn:hover:not(:disabled) { background: #e8ebf0; }
        .refresh-btn:disabled { cursor: not-allowed; background: #f5f7fa; color: #a0a0a0; }
        .site-optimized { display: inline-block; background: rgba(66, 133, 244, 0.1); color: #4285f4; padding: 2px 7px; border-radius: 5px; font-size: 10px; margin-left: 7px; vertical-align: middle; }
        
        /* 全新高对比度分页样式 */
        .pagination { 
            display: flex; 
            justify-content: center; 
            gap: 8px;
            margin-top: 12px; 
            padding-bottom: 5px; 
        }
        .pagination-btn { 
            padding: 6px 12px;
            border-radius: 7px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid;
            transition: all 0.2s ease;
        }
        .pagination-btn:not(:disabled):not(.active) {
            color: #4285f4;
            border-color: #4285f4;
            background: #ffffff;
            cursor: pointer;
        }
        .pagination-btn:not(:disabled):not(.active):hover {
            background: rgba(66, 133, 244, 0.08);
        }
        .pagination-btn.active { 
            background: #4285f4; 
            color: white; 
            border-color: #4285f4;
            cursor: default;
        }
        .pagination-btn:disabled {
            color: #cccccc;
            border-color: #eeeeee;
            background: #fafafa;
            cursor: not-allowed;
        }

        .image-preview-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
            z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 15px;
        }
        .image-preview-content { max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column; }
        .image-preview-content img { max-width: 100%; max-height: calc(90vh - 80px); object-fit: contain; border-radius: 7px; }
        .image-preview-info {
            background: rgba(30,30,30,0.8); padding: 10px; border-radius: 7px; font-size: 13px; color: #fff;
            margin-top: 10px; text-align: center; word-break: break-all;
        }
        .image-preview-controls { display: flex; justify-content: center; padding-top: 12px; gap: 12px; }
        .preview-action-btn {
            padding: 8px 16px; border-radius: 7px; background: #4a4a4a; color: #fff;
            border: 1px solid #666; cursor: pointer; transition: all 0.2s; font-size: 14px;
        }
        .preview-action-btn:hover { background: #5a5a5a; border-color: #888; }
        .loader {
            width: 18px; height: 18px; border: 3px solid rgba(66, 133, 244, 0.2);
            border-radius: 50%; border-top-color: #4285f4;
            animation: spin 1s ease-in-out infinite; display: inline-block; vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* 图片预览网格 */
        .preview-container { padding: 12px; }
        .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 8px; }
        .image-preview {
            border-radius: 7px; overflow: hidden; position: relative; padding-top: 100%;
            background-color: #f0f2f5; box-shadow: 0 3px 8px rgba(0,0,0,0.05); cursor: pointer;
        }
        .image-preview img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .image-preview:hover img { transform: scale(1.1); }
        .image-info { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.6); color: white; padding: 5px 7px; font-size: 10px; line-height: 1.3; text-align: center; }
    `);

    // --- 配置信息 ---
    const RESOURCE_TYPES = {
        video: { extensions: ['m3u8', 'm3u', 'mp4', 'webm', 'avi', 'mov', 'flv', 'wmv', 'mpd', 'ts', 'f4v', 'mkv'], label: '视频', icon: '📹' },
        audio: { extensions: ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'wma', 'opus'], label: '音频', icon: '🎵' },
        image: { extensions: ['png', 'jpg', 'jpeg', 'gif', 'ico', 'webp', 'svg', 'bmp'], label: '图片', icon: '🖼️' }
    };
    const SUPPORTED_SITES = {
        'douyin.com': '抖音', 'tiktok.com': 'TikTok', 'ixigua.com': '西瓜视频', 'kuaishou.com': '快手',
        'v.qq.com': '腾讯视频', 'iqiyi.com': '爱奇艺', 'mgtv.com': '芒果TV', 'youtube.com': 'YouTube',
        'youtu.be': 'YouTube', 'bilibili.com': '哔哩哔哩', 'b23.tv': '哔哩哔哩', 'youku.com': '优酷',
        'twitter.com': 'Twitter', 'instagram.com': 'Instagram', 'google.com': 'Google Images', 'baidu.com': '百度图片'
    };

    // --- 全局状态变量 ---
    let floatingBall = null, resourcePanel = null;
    let resources = { video: [], audio: [], image: [] };
    let isPanelVisible = false;
    let currentTab = 'video';
    let isScanning = false;
    const currentDomain = location.hostname;
    let currentPage = { video: 1, audio: 1, image: 1 };
    const pageSize = 20;
    let scanTimeout = null;
    const foundUrls = new Set();
    // 新增：悬浮球状态管理
    let ballState = 'hidden'; // 'hidden', 'retracted', 'expanded'
    let retractTimeout = null;

    // --- 核心功能函数 ---

    function init() {
        createUI();
        setupEventListeners();
        setTimeout(() => performScan('full'), 1500);
    }

    function createUI() {
        floatingBall = document.createElement('div');
        floatingBall.id = 'resourceDetectorBall';
        floatingBall.innerHTML = `<span><div id="resourceBallBadge"></div>资源</span>`;
        document.body.appendChild(floatingBall);

        resourcePanel = document.createElement('div');
        resourcePanel.id = 'resourceDetectorPanel';
        const siteName = Object.keys(SUPPORTED_SITES).find(domain => currentDomain.includes(domain));
        const optimizedTag = siteName ? `<span class="site-optimized">${SUPPORTED_SITES[siteName]} 优化</span>` : '';
        resourcePanel.innerHTML = `
            <div class="panel-header">
                <span>网页资源检测 ${optimizedTag}</span>
                <div class="close-btn">×</div>
            </div>
            <div class="category-tabs">
                ${Object.entries(RESOURCE_TYPES).map(([type, config]) => `
                    <div class="tab-btn ${type === currentTab ? 'active' : ''}" data-type="${type}">
                        ${config.label} <span class="tab-badge" id="badge-${type}">0</span>
                    </div>
                `).join('')}
            </div>
            <div class="tab-content"></div>
        `;
        document.body.appendChild(resourcePanel);
    }

    function setupEventListeners() {
        // 悬浮球点击事件现在管理三个状态
        floatingBall.addEventListener('click', handleBallClick);
        
        resourcePanel.querySelector('.close-btn').addEventListener('click', () => togglePanelVisibility(false));
        resourcePanel.querySelectorAll('.tab-btn').forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.type));
        });
        GM_registerMenuCommand('手动全量扫描资源', () => performScan('full'));
        GM_registerMenuCommand('打开/关闭面板', () => {
             if (isPanelVisible) {
                 togglePanelVisibility(false);
             } else {
                 setBallState('expanded');
                 togglePanelVisibility(true);
             }
        });

        const observer = new MutationObserver(() => debounceScan());
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'href'] });

        document.addEventListener('play', (event) => {
            if (event.target.src) {
                const type = getResourceTypeByUrl(event.target.src);
                if (type === 'video' || type === 'audio') {
                    if (addResource(event.target.src, type, event.target)) {
                        updateUI();
                    }
                }
            }
        }, true);
    }

    /**
     * 全新的悬浮球点击处理逻辑
     */
    function handleBallClick() {
        switch (ballState) {
            case 'retracted':
                // 从收起状态 -> 展开状态
                setBallState('expanded');
                break;
            case 'expanded':
                // 从展开状态 -> 打开面板
                togglePanelVisibility(true);
                break;
        }
    }

    /**
     * 统一管理悬浮球状态的函数
     * @param {'hidden' | 'retracted' | 'expanded'} newState 
     */
    function setBallState(newState) {
        ballState = newState;
        clearTimeout(retractTimeout); // 任何状态变更都清除旧的计时器

        floatingBall.classList.remove('retracted', 'expanded');

        if (newState === 'retracted') {
            floatingBall.classList.add('retracted');
        } else if (newState === 'expanded') {
            floatingBall.classList.add('expanded');
            // 展开后，如果面板没打开，则启动自动收回计时器
            if (!isPanelVisible) {
                retractTimeout = setTimeout(() => {
                    setBallState('retracted');
                }, 5000); // 5秒后自动收回
            }
        }
    }

    function togglePanelVisibility(forceShow = null) {
        isPanelVisible = forceShow !== null ? forceShow : !isPanelVisible;
        if (isPanelVisible) {
            // 打开面板前，确保球是展开的，并清除自动收回计时器
            setBallState('expanded');
            resourcePanel.classList.add('active');
            renderTabContent(currentTab);
        } else {
            resourcePanel.classList.remove('active');
            // 关闭面板后，球立即回到收起状态
            setBallState('retracted');
        }
    }

    function switchTab(type) {
        currentTab = type;
        currentPage[type] = 1;
        resourcePanel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        renderTabContent(type);
    }

    function renderTabContent(type) {
        const contentContainer = resourcePanel.querySelector('.tab-content');
        if (isScanning && contentContainer.dataset.scanMode === 'full') {
            contentContainer.innerHTML = `<div class="loading-indicator"><div class="loader"></div>正在进行全量扫描...</div>`;
            return;
        }

        const items = resources[type];
        const config = RESOURCE_TYPES[type];

        if (items.length === 0) {
            contentContainer.innerHTML = `
                <div class="empty-message">
                    未检测到${config.label}资源
                    ${createRefreshButtonHTML('full')}
                </div>`;
            contentContainer.querySelector('.refresh-btn').onclick = () => performScan('full');
            return;
        }

        if (type === 'image') {
            renderImagePreviewGrid(contentContainer, items, type);
        } else {
            renderResourceList(contentContainer, items, type);
        }
    }

    function renderResourceList(container, items, type) {
        const config = RESOURCE_TYPES[type];
        const pageItems = paginate(items, currentPage[type], pageSize);
        container.innerHTML = `
            <ul class="resource-list">
                ${pageItems.map(item => `
                    <li class="resource-item" data-url="${item.url}">
                        <div class="resource-icon ${type}-icon">${config.icon}</div>
                        <div class="resource-info">
                            <div class="resource-name" title="${item.url}">${getFileName(item.url)}</div>
                            <div class="resource-meta">
                                <span>${getFileType(item.url)}</span>
                                ${item.size ? `<span>${item.size}</span>` : ''}
                                ${item.duration ? `<span>${formatDuration(item.duration)}</span>` : ''}
                            </div>
                        </div>
                        <div class="resource-actions">
                            <button class="action-btn" data-action="copy" title="复制链接">📋</button>
                            <button class="action-btn" data-action="download" title="下载">↓</button>
                            <button class="action-btn" data-action="open" title="新标签页打开">↗</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
        container.appendChild(createPagination(items.length, currentPage[type], pageSize, (page) => {
            currentPage[type] = page;
            renderResourceList(container, items, type);
        }));
        container.insertAdjacentHTML('beforeend', createRefreshButtonHTML('full'));
        container.querySelector('.refresh-btn').onclick = () => performScan('full');
        
        container.querySelectorAll('.resource-item').forEach(item => {
            const url = item.dataset.url;
            item.querySelector('[data-action="copy"]').onclick = (e) => { e.stopPropagation(); copyToClipboard(url, '链接已复制'); };
            item.querySelector('[data-action="download"]').onclick = (e) => { e.stopPropagation(); GM_download(url, getFileName(url)); };
            item.querySelector('[data-action="open"]').onclick = (e) => { e.stopPropagation(); GM_openInTab(url, { active: true }); };
        });
    }

    function renderImagePreviewGrid(container, items, type) {
        const pageItems = paginate(items, currentPage[type], pageSize);
        container.innerHTML = `
            <div class="preview-container">
                <div id="imagePreviewGrid" class="preview-grid">
                    ${pageItems.map(item => `
                        <div class="image-preview" data-url="${item.url}" data-size="${item.size || '未知尺寸'}">
                            <img src="${item.url}" loading="lazy" alt="图片预览">
                            <div class="image-info">${item.size || '未知尺寸'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.appendChild(createPagination(items.length, currentPage[type], pageSize, (page) => {
            currentPage[type] = page;
            renderImagePreviewGrid(container, items, type);
        }));
        container.insertAdjacentHTML('beforeend', createRefreshButtonHTML('full'));
        container.querySelector('.refresh-btn').onclick = () => performScan('full');
        
        container.querySelectorAll('.image-preview').forEach(item => {
            item.onclick = () => showImagePreviewModal(item.dataset.url, item.dataset.size);
        });
    }

    function showImagePreviewModal(url, size) {
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';
        overlay.innerHTML = `
            <div class="image-preview-content">
                <img src="${url}" alt="预览图片">
                <div class="image-preview-info">
                    尺寸: ${size} | 格式: ${getFileType(url)}
                    <div class="image-preview-controls">
                        <button class="preview-action-btn" id="copyPreviewBtn">复制链接</button>
                        <button class="preview-action-btn" id="downloadPreviewBtn">下载</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        overlay.querySelector('#copyPreviewBtn').onclick = () => copyToClipboard(url, '图片链接已复制');
        overlay.querySelector('#downloadPreviewBtn').onclick = () => GM_download(url, getFileName(url));
    }

    async function performScan(mode = 'additive') {
        if (isScanning) return;
        isScanning = true;
        let newResourcesFound = 0;

        if (mode === 'full') {
            foundUrls.clear();
            resources = { video: [], audio: [], image: [] };
            const contentContainer = resourcePanel.querySelector('.tab-content');
            if(contentContainer) contentContainer.dataset.scanMode = 'full';
            updateUI();
        }

        const scanTasks = [
            () => document.querySelectorAll('video, audio, source').forEach(el => { if(addResource(el.src, getResourceTypeByUrl(el.src), el)) newResourcesFound++; }),
            () => document.querySelectorAll('img, image, [style*="background-image"]').forEach(el => {
                let src = el.src || el.dataset.src || el.dataset.original || el.href?.baseVal;
                if (el.style.backgroundImage) {
                    const match = el.style.backgroundImage.match(/url$['"]?(.*?)['"]?$/);
                    if (match) src = match[1];
                }
                if (src && getResourceTypeByUrl(src) === 'image' && addResource(src, 'image', el)) newResourcesFound++;
            }),
            () => document.querySelectorAll('a[href]').forEach(link => { if(addResource(link.href, getResourceTypeByUrl(link.href))) newResourcesFound++; }),
            () => document.querySelectorAll('script').forEach(script => { if(scanTextForUrls(script.textContent)) newResourcesFound++; }),
            () => performance.getEntriesByType('resource').forEach(res => { if(addResource(res.name, getResourceTypeByUrl(res.name))) newResourcesFound++; }),
            () => { // 特定网站优化
                if (currentDomain.includes('google.com')) document.querySelectorAll('img[data-iurl]').forEach(img => { if(addResource(img.dataset.iurl, 'image', img)) newResourcesFound++; });
                if (currentDomain.includes('baidu.com')) document.querySelectorAll('img[data-imgurl]').forEach(img => { if(addResource(img.dataset.imgurl, 'image', img)) newResourcesFound++; });
            }
        ];
        
        for (const task of scanTasks) {
            await new Promise(resolve => requestAnimationFrame(() => { task(); resolve(); }));
        }

        isScanning = false;
        resourcePanel.querySelector('.tab-content').dataset.scanMode = '';

        if (mode === 'full') {
            GM_notification({ title: '全量扫描完成', text: `共发现 ${foundUrls.size} 个资源`, timeout: 2500 });
        } else if (newResourcesFound > 0) {
            console.log(`[资源检测] 增量扫描发现 ${newResourcesFound} 个新资源。`);
        }
        
        updateUI();
    }

    function scanTextForUrls(text) {
        const urlRegex = /https?:\/\/[^\s"'<>]+/g;
        const matches = text.match(urlRegex) || [];
        let found = false;
        matches.forEach(url => {
            if(addResource(url, getResourceTypeByUrl(url))) found = true;
        });
        return found;
    }

    function addResource(url, type, element = null) {
        if (!url || !type || typeof url !== 'string') return false;
        const cleanUrl = url.split('?')[0];
        if (foundUrls.has(cleanUrl)) return false;

        foundUrls.add(cleanUrl);
        const resource = { url, type };
        if (type === 'image' && element?.naturalWidth > 1) resource.size = `${element.naturalWidth}×${element.naturalHeight}`;
        if ((type === 'video' || type === 'audio') && element?.duration) resource.duration = element.duration;
        
        resources[type].push(resource);
        resources[type].sort((a, b) => a.url.localeCompare(b.url));
        return true;
    }

    function updateUI() {
        const total = getTotalResources();
        
        // 更新悬浮球状态
        if (total > 0 && ballState === 'hidden') {
            setBallState('retracted');
        } else if (total === 0) {
            setBallState('hidden');
        }
        
        document.getElementById('resourceBallBadge').style.display = total > 0 ? 'block' : 'none';

        Object.keys(RESOURCE_TYPES).forEach(type => {
            const badge = document.getElementById(`badge-${type}`);
            if (badge) {
                const count = resources[type].length;
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline-block' : 'none';
            }
        });

        if (isPanelVisible) {
            renderTabContent(currentTab);
        }
    }
    
    // --- 辅助与工具函数 ---
    const debounceScan = (delay = 1200) => { clearTimeout(scanTimeout); scanTimeout = setTimeout(() => performScan('additive'), delay); };
    const getTotalResources = () => foundUrls.size;
    const getResourceTypeByUrl = (url) => {
        if (!url) return null;
        try {
            const ext = new URL(url, location.href).pathname.split('.').pop().toLowerCase();
            return Object.keys(RESOURCE_TYPES).find(type => RESOURCE_TYPES[type].extensions.includes(ext)) || null;
        } catch (e) { return null; }
    };
    const getFileName = (url) => { try { return decodeURIComponent(new URL(url, location.href).pathname.split('/').pop() || '未命名资源'); } catch (e) { return '未命名资源'; }};
    const getFileType = (url) => { try { return new URL(url, location.href).pathname.split('.').pop().toUpperCase() || '未知'; } catch (e) { return '未知'; }};
    const formatDuration = (sec) => {
        if (!sec || sec === Infinity) return '';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    const copyToClipboard = (text, message) => GM_setClipboard(text, 'text/plain', () => GM_notification({ title: '操作成功', text: message, timeout: 2000 }));
    const paginate = (items, page, size) => items.slice((page - 1) * size, page * size);
    
    function createPagination(totalItems, currentPage, pageSize, onPageChange) {
        const totalPages = Math.ceil(totalItems / pageSize);
        if (totalPages <= 1) return document.createDocumentFragment();

        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = '‹ 上一页';
        prevBtn.onclick = () => onPageChange(currentPage - 1);
        if (currentPage === 1) {
            prevBtn.disabled = true;
        }
        pagination.appendChild(prevBtn);

        const pageInfo = document.createElement('span');
        pageInfo.className = 'pagination-btn active';
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        pagination.appendChild(pageInfo);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = '下一页 ›';
        nextBtn.onclick = () => onPageChange(currentPage + 1);
        if (currentPage === totalPages) {
            nextBtn.disabled = true;
        }
        pagination.appendChild(nextBtn);
        
        return pagination;
    }

    function createRefreshButtonHTML(mode) {
        if (isScanning && mode ==='full') {
            return `<button class="refresh-btn" disabled><div class="loader"></div>正在扫描...</div>`;
        }
        return `<button class="refresh-btn">手动全量扫描</button>`;
    }

    // --- 启动脚本 ---
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();