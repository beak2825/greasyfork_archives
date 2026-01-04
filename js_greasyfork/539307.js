// ==UserScript==
// @name         WHUT教学平台UMOOC PDF下载器
// @name:en      WHUT JXPT PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  【正式版】一款专为武汉理工大学教学平台(jxpt.whut.edu.cn)设计的PDF下载助手。拥有现代化UI、全自动后台扫描、智能识别页面类型、精准解析真实下载地址、支持批量下载和自由拖拽等特性，提供极致的用户体验。
// @description:en [Official Release] A PDF download helper for WHUT's teaching platform (jxpt.whut.edu.cn). Features a modern UI, automatic background scanning, smart page type detection, accurate real URL parsing, batch download support, and a draggable button for the ultimate user experience.
// @author       毫厘
// @match        https://jxpt.whut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whut.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539307/WHUT%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0UMOOC%20PDF%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539307/WHUT%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0UMOOC%20PDF%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInitialized = false;
    let scanningInProgress = false;
    let cachedFiles = [];
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // 防抖函数，避免重复初始化
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

    // 优化的监控逻辑
    const checkAndInit = debounce(() => {
        try {
            const mainFrame = document.querySelector('frame[name="mainFrame"]');
            if (!mainFrame || isInitialized) return;

            const doc = mainFrame.contentDocument;
            if (!doc || !doc.body || doc.getElementById('pdf-floating-btn')) return;

            isInitialized = true;
            initializeModernDownloader(mainFrame);
        } catch (error) {
            // Silently handle cross-origin errors
        }
    }, 500);

    setInterval(checkAndInit, 2000);

    /**
     * 现代化UI和智能扫描系统
     */
    async function initializeModernDownloader(frame) {
        const doc = frame.contentDocument;

        // 1. 注入现代化CSS样式
        injectModernStyles(doc);

        // 2. 创建现代化UI组件
        createModernUI(doc);

        // 3. 绑定交互事件
        bindUIEvents(doc, frame);

        // 4. 启动智能扫描
        await performIntelligentScan(frame, doc);
    }

    function injectModernStyles(doc) {
        const style = doc.createElement('style');
        style.textContent = `
            /* 主按钮 - 现代化设计，自由拖拽 */
            #pdf-floating-btn {
                position: fixed;
                top: 30px;
                right: 30px;
                z-index: 10000;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: grab;
                font-size: 28px;
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.1);
            }

            #pdf-floating-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
                background: linear-gradient(135deg, #7c8ef7 0%, #8a5fb8 100%);
            }

            #pdf-floating-btn.dragging {
                cursor: grabbing;
                transform: scale(1.1);
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.7);
                transition: none;
                z-index: 10001;
            }

            #pdf-floating-btn.scanning {
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3); }
                50% { box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6); }
                100% { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3); }
            }

            /* 计数标记 - 优化位置和样式 */
            #pdf-count-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
                color: white;
                border-radius: 50%;
                min-width: 22px;
                height: 22px;
                font-size: 11px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: scale(0);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                pointer-events: none;
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
            }

            #pdf-count-badge.show {
                transform: scale(1);
            }

            /* 侧边栏 - 重新设计布局 */
            #pdf-modern-sidebar {
                position: fixed;
                top: 0;
                right: -450px;
                width: 420px;
                height: 100vh;
                z-index: 9999;
                background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
                box-shadow: -8px 0 40px rgba(0, 0, 0, 0.12);
                transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                border-left: 1px solid rgba(226, 232, 240, 0.8);
            }

            #pdf-modern-sidebar.visible {
                transform: translateX(-450px);
            }

            /* 遮罩层 */
            #pdf-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(15, 23, 42, 0.5);
                z-index: 9998;
                backdrop-filter: blur(4px);
                transition: opacity 0.3s ease;
            }

            #pdf-modern-sidebar.visible + #pdf-overlay {
                display: block;
            }

            /* 头部区域 - 重新设计 */
            .pdf-header {
                padding: 28px 24px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                position: relative;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .pdf-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
            }

            .pdf-header h2 {
                margin: 0 0 8px 0;
                font-size: 22px;
                font-weight: 700;
                position: relative;
                letter-spacing: -0.5px;
            }

            .pdf-status {
                font-size: 14px;
                opacity: 0.95;
                position: relative;
                font-weight: 500;
            }

            .pdf-close-btn {
                position: absolute;
                top: 24px;
                right: 24px;
                background: rgba(255, 255, 255, 0.15);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
            }

            .pdf-close-btn:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: rotate(90deg);
            }

            /* 进度条区域 - 更清晰的视觉层次 */
            .pdf-progress {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                color: #92400e;
                padding: 16px 24px;
                font-size: 14px;
                border-left: 4px solid #f59e0b;
                margin: 0;
                font-weight: 500;
                display: flex;
                align-items: center;
                border-bottom: 1px solid rgba(245, 158, 11, 0.2);
            }

            /* 内容区域 - 优化滚动和间距 */
            .pdf-content {
                flex: 1;
                overflow-y: auto;
                padding: 0;
                background: #fafbfc;
            }

            .pdf-content::-webkit-scrollbar {
                width: 6px;
            }

            .pdf-content::-webkit-scrollbar-track {
                background: transparent;
            }

            .pdf-content::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }

            .pdf-content::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }

            /* 文件列表 - 更好的视觉组织 */
            .pdf-file-list {
                list-style: none;
                margin: 0;
                padding: 16px 0;
            }

            .pdf-file-item {
                display: flex;
                align-items: center;
                padding: 18px 24px;
                margin: 0 16px 12px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
                transition: all 0.3s;
                border: 1px solid rgba(226, 232, 240, 0.6);
            }

            .pdf-file-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(15, 23, 42, 0.12);
                border-color: rgba(102, 126, 234, 0.3);
            }

            .pdf-file-icon {
                width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
                margin-right: 16px;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
            }

            .pdf-file-info {
                flex: 1;
                min-width: 0;
                margin-right: 12px;
            }

            .pdf-file-name {
                font-weight: 600;
                color: #1e293b;
                margin-bottom: 6px;
                font-size: 14px;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .pdf-file-size {
                font-size: 12px;
                color: #64748b;
                font-weight: 500;
            }

            .pdf-download-single {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                padding: 10px 18px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 3px 10px rgba(59, 130, 246, 0.3);
                min-width: 70px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pdf-download-single:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            }

            .pdf-download-single:disabled {
                background: #94a3b8;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            /* 操作按钮区域 - 更突出的CTA */
            .pdf-actions {
                padding: 24px;
                background: white;
                border-top: 1px solid #e2e8f0;
                box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.05);
            }

            .pdf-download-all {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
                letter-spacing: 0.5px;
                text-transform: uppercase;
                position: relative;
                overflow: hidden;
            }

            .pdf-download-all::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }

            .pdf-download-all:hover:not(:disabled)::before {
                left: 100%;
            }

            .pdf-download-all:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
            }

            .pdf-download-all:disabled {
                background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            /* 加载状态 */
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: #ffffff;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            /* 空状态 - 更友好的设计 */
            .pdf-empty-state {
                text-align: center;
                padding: 60px 24px;
                color: #64748b;
            }

            .pdf-empty-icon {
                font-size: 64px;
                margin-bottom: 20px;
                opacity: 0.6;
                filter: grayscale(0.3);
            }

            .pdf-empty-text {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 8px;
                color: #475569;
            }

            .pdf-empty-hint {
                font-size: 14px;
                color: #94a3b8;
                line-height: 1.5;
            }

            /* 响应式适配 */
            @media (max-width: 480px) {
                #pdf-modern-sidebar {
                    width: 100vw;
                    right: -100vw;
                }

                #pdf-modern-sidebar.visible {
                    transform: translateX(-100vw);
                }

                .pdf-file-item {
                    margin: 0 8px 8px;
                    padding: 14px 16px;
                }

                .pdf-header {
                    padding: 20px 16px 16px;
                }

                .pdf-actions {
                    padding: 16px;
                }
            }
        `;
        doc.head.appendChild(style);
    }

    function createModernUI(doc) {
        // 主浮动按钮
        const floatingBtn = doc.createElement('button');
        floatingBtn.id = 'pdf-floating-btn';
        floatingBtn.innerHTML = '📄';
        floatingBtn.className = 'scanning';
        floatingBtn.title = '点击打开PDF下载器，拖拽可移动位置';
        doc.body.appendChild(floatingBtn);

        // 计数标记
        const countBadge = doc.createElement('div');
        countBadge.id = 'pdf-count-badge';
        countBadge.textContent = '0';
        floatingBtn.appendChild(countBadge);

        // 侧边栏
        const sidebar = doc.createElement('div');
        sidebar.id = 'pdf-modern-sidebar';
        sidebar.innerHTML = `
            <div class="pdf-header">
                <h2>📄 PDF 文档中心</h2>
                <div class="pdf-status" id="pdf-status">正在扫描...</div>
                <button class="pdf-close-btn" id="pdf-close-btn">×</button>
            </div>
            <div class="pdf-progress" id="pdf-progress" style="display: none;">
                <span class="loading-spinner"></span>
                <span id="progress-text">扫描中...</span>
            </div>
            <div class="pdf-content">
                <ul class="pdf-file-list" id="pdf-file-list"></ul>
            </div>
            <div class="pdf-actions">
                <button class="pdf-download-all" id="pdf-download-all" disabled>
                    📥 下载全部文档
                </button>
            </div>
        `;
        doc.body.appendChild(sidebar);

        // 遮罩层
        const overlay = doc.createElement('div');
        overlay.id = 'pdf-overlay';
        doc.body.appendChild(overlay);
    }

    function bindUIEvents(doc, frame) {
        const floatingBtn = doc.getElementById('pdf-floating-btn');
        const sidebar = doc.getElementById('pdf-modern-sidebar');
        const overlay = doc.getElementById('pdf-overlay');
        const closeBtn = doc.getElementById('pdf-close-btn');
        const downloadAllBtn = doc.getElementById('pdf-download-all');
        const fileList = doc.getElementById('pdf-file-list');

        // 简化的拖拽功能 - 移除吸附逻辑
        let clickStartTime = 0;
        let hasMoved = false;

        function getEventPos(e) {
            return {
                x: e.type.includes('touch') ? e.touches[0].clientX : e.clientX,
                y: e.type.includes('touch') ? e.touches[0].clientY : e.clientY
            };
        }

        function startDrag(e) {
            clickStartTime = Date.now();
            hasMoved = false;
            isDragging = true;

            const pos = getEventPos(e);
            const rect = floatingBtn.getBoundingClientRect();

            dragOffset.x = pos.x - rect.left;
            dragOffset.y = pos.y - rect.top;

            floatingBtn.classList.add('dragging');
            e.preventDefault();
        }

        function doDrag(e) {
            if (!isDragging) return;

            hasMoved = true;
            const pos = getEventPos(e);

            let newX = pos.x - dragOffset.x;
            let newY = pos.y - dragOffset.y;

            // 边界限制
            const margin = 10;
            const maxX = window.innerWidth - floatingBtn.offsetWidth - margin;
            const maxY = window.innerHeight - floatingBtn.offsetHeight - margin;

            newX = Math.max(margin, Math.min(newX, maxX));
            newY = Math.max(margin, Math.min(newY, maxY));

            floatingBtn.style.left = newX + 'px';
            floatingBtn.style.top = newY + 'px';
            floatingBtn.style.right = 'auto';
            floatingBtn.style.bottom = 'auto';

            e.preventDefault();
        }

        function endDrag(e) {
            if (!isDragging) return;

            isDragging = false;
            floatingBtn.classList.remove('dragging');

            // 如果是点击而非拖拽，则打开侧边栏
            const clickDuration = Date.now() - clickStartTime;
            if (!hasMoved && clickDuration < 300) {
                sidebar.classList.toggle('visible');
            }
        }

        // 事件绑定
        floatingBtn.addEventListener('mousedown', startDrag);
        doc.addEventListener('mousemove', doDrag);
        doc.addEventListener('mouseup', endDrag);

        floatingBtn.addEventListener('touchstart', startDrag, { passive: false });
        doc.addEventListener('touchmove', doDrag, { passive: false });
        doc.addEventListener('touchend', endDrag, { passive: false });

        floatingBtn.addEventListener('contextmenu', e => e.preventDefault());

        // 关闭侧边栏
        [overlay, closeBtn].forEach(el => {
            el.addEventListener('click', () => {
                sidebar.classList.remove('visible');
            });
        });

        // 全部下载
        downloadAllBtn.addEventListener('click', async (e) => {
            if (cachedFiles.length === 0) return;

            e.target.innerHTML = '<span class="loading-spinner"></span>正在下载...';
            e.target.disabled = true;

            await downloadFiles(doc, cachedFiles);

            setTimeout(() => {
                e.target.textContent = '下载全部文档';
                e.target.disabled = false;
            }, 3000);
        });

        // 单个文件下载
        fileList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('pdf-download-single')) {
                const index = parseInt(e.target.dataset.index);
                const file = cachedFiles[index];
                if (file) {
                    e.target.innerHTML = '<span class="loading-spinner"></span>';
                    e.target.disabled = true;

                    await downloadFiles(doc, [file]);

                    setTimeout(() => {
                        e.target.textContent = '下载';
                        e.target.disabled = false;
                    }, 2000);
                }
            }
        });
    }

    async function performIntelligentScan(frame, doc) {
        if (scanningInProgress) return;
        scanningInProgress = true;

        updateScanStatus(doc, '正在扫描...', true);

        try {
            const files = await optimizedUnifiedScraper(frame, doc);
            cachedFiles = files;

            updateUI(doc, files);
            updateScanStatus(doc, `找到 ${files.length} 个文档`, false);

        } catch (error) {
            console.error('扫描失败:', error);
            updateScanStatus(doc, '扫描失败', false);
        } finally {
            scanningInProgress = false;
            doc.getElementById('pdf-floating-btn').classList.remove('scanning');
        }
    }

    function updateScanStatus(doc, message, showProgress) {
        const statusEl = doc.getElementById('pdf-status');
        const progressEl = doc.getElementById('pdf-progress');
        const progressText = doc.getElementById('progress-text');

        if (statusEl) statusEl.textContent = message;
        if (progressText) progressText.textContent = message;
        if (progressEl) progressEl.style.display = showProgress ? 'block' : 'none';
    }

    function updateUI(doc, files) {
        const countBadge = doc.getElementById('pdf-count-badge');
        const fileList = doc.getElementById('pdf-file-list');
        const downloadAllBtn = doc.getElementById('pdf-download-all');

        // 更新计数标记
        countBadge.textContent = files.length > 99 ? '99+' : files.length;
        countBadge.className = files.length > 0 ? 'show' : '';

        // 更新文件列表
        if (files.length === 0) {
            fileList.innerHTML = `
                <div class="pdf-empty-state">
                    <div class="pdf-empty-icon">📄</div>
                    <div class="pdf-empty-text">暂无PDF文档</div>
                    <div class="pdf-empty-hint">当前页面没有找到可下载的PDF文档<br>请尝试切换到其他页面或等待内容加载</div>
                </div>
            `;
        } else {
            fileList.innerHTML = files.map((file, index) => `
                <li class="pdf-file-item">
                    <div class="pdf-file-icon">PDF</div>
                    <div class="pdf-file-info">
                        <div class="pdf-file-name" title="${file.fileName}">${file.fileName}</div>
                        <div class="pdf-file-size">PDF文档 • 点击下载</div>
                    </div>
                    <button class="pdf-download-single" data-index="${index}">下载</button>
                </li>
            `).join('');
        }

        // 更新下载按钮状态
        downloadAllBtn.disabled = files.length === 0;
        if (files.length > 0) {
            downloadAllBtn.innerHTML = `📥 下载全部文档 <span style="opacity: 0.8;">(${files.length})</span>`;
        } else {
            downloadAllBtn.textContent = '📥 暂无可下载文档';
        }
    }

    // 优化的扫描器
    async function optimizedUnifiedScraper(frame, doc) {
        const collectedPdfs = new Map();
        let usingPagination = false;
        let pageNum = 1;
        const maxPages = 10; // 限制最大页数防止无限循环

        updateScanStatus(doc, '扫描当前页面...', true);

        // 扫描分页
        while (pageNum <= maxPages) {
            const currentDoc = frame.contentDocument;
            findPdfsOnCurrentPage(currentDoc, collectedPdfs);

            const nextPageLink = findNextPageLink(currentDoc);
            if (nextPageLink && pageNum < maxPages) {
                usingPagination = true;
                updateScanStatus(doc, `扫描第 ${pageNum + 1} 页...`, true);
                await navigateAndAwaitLoad(frame, nextPageLink);
                pageNum++;

                // 小延迟确保页面加载完成
                await new Promise(r => setTimeout(r, 800));
            } else {
                break;
            }
        }

        // 如果没有分页，尝试滚动加载
        if (!usingPagination) {
            updateScanStatus(doc, '扫描动态内容...', true);
            await performScrollScan(frame, collectedPdfs, doc);
        }

        return Array.from(collectedPdfs.values());
    }

    async function performScrollScan(frame, collectedPdfs, doc) {
        let lastSize = -1;
        let scrollAttempts = 0;
        const maxScrollAttempts = 5;

        while (collectedPdfs.size > lastSize && scrollAttempts < maxScrollAttempts) {
            lastSize = collectedPdfs.size;

            const scrollElement = frame.contentDocument.scrollingElement || frame.contentDocument.documentElement;
            scrollElement.scrollTop = scrollElement.scrollHeight;

            updateScanStatus(doc, `滚动扫描... 已找到 ${collectedPdfs.size} 个文档`, true);

            await new Promise(r => setTimeout(r, 1200));
            findPdfsOnCurrentPage(frame.contentDocument, collectedPdfs);
            scrollAttempts++;
        }
    }

    function findPdfsOnCurrentPage(doc, collection) {
        const links = doc.querySelectorAll('a[href*="download_preview.jsp"]');

        links.forEach(link => {
            let realDownloadHref = '';
            try {
                const url = new URL(link.href);
                const resId = url.searchParams.get('resid');
                const lid = url.searchParams.get('lid');

                if (resId && lid) {
                    realDownloadHref = `${url.protocol}//${url.host}/meol/analytics/resPdfShow.do?resId=${resId}&lid=${lid}`;
                } else {
                    return;
                }
            } catch (e) {
                console.error("解析链接失败:", link.href, e);
                return;
            }

            const fromText = link.textContent.trim();
            const fromTitle = link.title.trim();
            let fileName = fromText || fromTitle;
            if (fileName && !fileName.toLowerCase().endsWith('.pdf')) {
                fileName += '.pdf';
            }
            if (!fileName) {
                 fileName = (new URL(link.href).searchParams.get('resid') || 'unnamed') + '.pdf';
            }

            if (realDownloadHref && !collection.has(realDownloadHref)) {
                collection.set(realDownloadHref, { href: realDownloadHref, fileName: fileName });
            }
        });
    }

    // -- 其他辅助函数 --
    function findNextPageLink(doc) {
        const t = ['下一页', 'Next', '›', '>'];
        const a = doc.querySelectorAll('a');
        for (const l of a) {
            if (t.includes(l.innerText.trim())) return l;
        }
        const i = doc.querySelector('img[alt="下一页"], img[title="下一页"]');
        return i ? i.closest('a') : null;
    }

    function navigateAndAwaitLoad(frame, target) {
        return new Promise(r => {
            const h = () => {
                frame.removeEventListener('load', h);
                r();
            };
            frame.addEventListener('load', h);
            target.click();
        });
    }

    async function downloadFiles(doc, files) {
        for (const file of files) {
            try {
                const a = doc.createElement('a');
                a.href = file.href;
                a.download = file.fileName;
                doc.body.appendChild(a);
                a.click();
                doc.body.removeChild(a);
            } catch (e) {
                console.error(`下载 ${file.fileName} 时失败:`, e);
            }
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    }
})();