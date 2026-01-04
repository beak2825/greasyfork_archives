// ==UserScript==
// @name         即梦AI全能助手
// @namespace    http://tampermonkey.net/
// @version      3.31
// @description  支持图片/视频下载的即梦AI增强工具（悬浮按钮版+优化图片预览+视频缩略图）
// @author       Jackey
// @license      GPL-3.0
// @match        https://jimeng.jianying.com/*
// @icon         https://lf3-lv-buz.vlabstatic.com/obj/image-lvweb-buz/common/images/dreamina-v5.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        window.open
// @connect      byteimg.com
// @connect      *.byteimg.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/528695/%E5%8D%B3%E6%A2%A6AI%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528695/%E5%8D%B3%E6%A2%A6AI%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        FLOATING_CONTAINER_STYLE: `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `,
        BUTTON_STYLE: `
            cursor: pointer;
            border-radius: 8px;
            padding: 8px 16px;
            transition: all 0.2s;
            background: rgba(255,255,255,0.9);
            border: 1px solid #d9d9d9;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 8px;
        `,
        HOVER_STYLE: `
            background: #e6f7ff;
            border-color: #91d5ff;
        `,
        VIDEO_PANEL_STYLE: `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(255,255,255,0.95);
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 400px;
            max-height: 70vh;
            overflow: hidden;
            z-index: 9999;
            display: flex;
            flex-direction: column;
        `,
        VIDEO_ITEM_STYLE: `
            display: flex;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid #eee;
            gap: 12px;
        `,
        PREVIEW_STYLE: `
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.9);
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
        `,
        VIDEO_SCAN_INTERVAL: 3000,
        PREVIEW_UPDATE_INTERVAL: 1000,
        DEFAULT_THUMBNAIL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAMAAABTa4nrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRF4eHh+/v78PDw9fX17u7u/f396Ojo5OTk/v7+/Pz8+fn59vb25+fn8/Pz5ubmBUUEgAAAAPFJREFUeNrs1kEKg0AMBND4n0ST+5+3ZSibQltJJFPnbQRxHsOoRj+J8bWzbQYQIECA/wFGwm2tl4CmQvECNCqw/fYCNCCwBSBAgAABAnyE71kKM1sCmlKgBKBRgbrqCmgqB1oCGpXIVlOA3VIIrQO7HBMuAeUoqA4UGymgObDH3pXAJaBQoEGBfSG0CWhuBWICFQNFQDWQsLjVQMJ6qgYSZlY10N1DiS/Ag4Hx8M7hIyYQIECAAAECBAgQ4Ba47zfFMQuBlM9WJiCHlc9ZJqC8YO0EysvWTqC8cO0EykvXTqD8AfRkK0APcKO1AK9/J/vQ2AH8FeA7Ft9K2QAAAABJRU5ErkJggg=='
    };

    class JimengEnhancer {
        constructor() {
            this.videoList = new Map();
            this.floatingContainer = null;
            this.videoPanel = null;
            this.previewArea = null;
            this.isVideoPanelExpanded = false;
            this.currentImageSrc = null;
            this.init();
        }

        init() {
            this.setupDOMObserver();
            this.setupGlobalListener();
            this.initVideoMonitor();
            this.createFloatingButtons();
            this.createVideoPanel();
            this.startPreviewUpdate();
        }

        setupDOMObserver() {
            const Observer = window.MutationObserver || window.WebKitMutationObserver;
            this.observer = new Observer(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        this.scanVideos();
                    }
                });
            });

            this.observer.observe(document, {
                childList: true,
                subtree: true
            });
        }

        setupGlobalListener() {
            document.addEventListener('click', this.handleGlobalClick.bind(this));
        }

        createFloatingButtons() {
            if (this.floatingContainer) return;

            this.floatingContainer = document.createElement('div');
            this.floatingContainer.style = CONFIG.FLOATING_CONTAINER_STYLE;

            this.previewArea = document.createElement('div');
            this.previewArea.style = CONFIG.PREVIEW_STYLE;
            this.updatePreview();
            this.floatingContainer.appendChild(this.previewArea);

            ['download', 'video', 'open'].forEach(type => {
                const button = this.generateButton(type);
                this.floatingContainer.appendChild(button);
            });

            document.body.appendChild(this.floatingContainer);
            this.setupDrag(this.floatingContainer);
        }

        generateButton(type) {
            const button = document.createElement('div');
            button.className = `jimeng-${type}-btn`;
            button.style = CONFIG.BUTTON_STYLE;
            button.onmouseover = () => button.style = `${CONFIG.BUTTON_STYLE}${CONFIG.HOVER_STYLE}`;
            button.onmouseout = () => button.style = CONFIG.BUTTON_STYLE;

            const templates = {
                download: () => `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1890ff">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    <span style="color:#1890ff">下载PNG</span>
                `,
                video: () => `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#eb2f96">
                        <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
                    </svg>
                    <span style="color:#eb2f96">
                        视频下载
                        <span class="video-count" style="margin-left:4px;background:#ff4d4f;color:white;border-radius:10px;padding:0 6px;">
                            ${this.videoList.size}
                        </span>
                    </span>
                `,
                open: () => `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#52c41a">
                        <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                    <span style="color:#52c41a">打开图片</span>
                `
            };

            button.innerHTML = templates[type]();
            button.onclick = {
                download: () => this.handleDownload(),
                video: () => this.toggleVideoPanel(),
                open: () => this.handleOpen()
            }[type];

            return button;
        }

        getCurrentImage() {
            try {
                const activeImage = document.querySelector('.selected img, .active img, .current img') ||
                    document.querySelector('.imageResult img, .generatedImage img, .previewResult img') ||
                    Array.from(document.querySelectorAll('img'))
                        .filter(img => img.src?.includes('byteimg.com') && img.width > 200 && img.height > 200)
                        .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
                return activeImage;
            } catch (error) {
                console.error('图片查找失败:', error);
                return null;
            }
        }

        async updatePreview() {
            const img = this.getCurrentImage();
            const newSrc = img?.src || null;

            if (newSrc !== this.currentImageSrc) {
                this.currentImageSrc = newSrc;
                if (newSrc) {
                    try {
                        const blob = await this.fetchImageBlob(newSrc);
                        const url = URL.createObjectURL(blob);
                        const imgElement = document.createElement('img');
                        imgElement.src = url;
                        imgElement.style = 'max-width:100%;max-height:100%;object-fit:contain;';
                        imgElement.alt = '预览图片';
                        imgElement.onload = () => {
                            this.previewArea.innerHTML = '';
                            this.previewArea.appendChild(imgElement);
                            if (this.lastPreviewUrl && this.lastPreviewUrl !== url) {
                                URL.revokeObjectURL(this.lastPreviewUrl);
                            }
                            this.lastPreviewUrl = url;
                        };
                        imgElement.onerror = () => {
                            this.previewArea.innerHTML = `<span style="color:#888;font-size:12px;text-align:center;">图片加载失败</span>`;
                            URL.revokeObjectURL(url);
                        };
                    } catch (error) {
                        console.error('预览图片加载失败:', error);
                        this.previewArea.innerHTML = `<span style="color:#888;font-size:12px;text-align:center;">图片加载失败</span>`;
                    }
                } else {
                    this.previewArea.innerHTML = `<span style="color:#888;font-size:12px;text-align:center;">未找到有效图片</span>`;
                    if (this.lastPreviewUrl) {
                        URL.revokeObjectURL(this.lastPreviewUrl);
                        this.lastPreviewUrl = null;
                    }
                }
            }
        }

        startPreviewUpdate() {
            setInterval(() => this.updatePreview(), CONFIG.PREVIEW_UPDATE_INTERVAL);
        }

        async handleDownload() {
            const img = this.getCurrentImage();
            if (!img?.src) {
                alert('未找到有效图片');
                return;
            }

            try {
                const { blob, fileName } = await this.convertWebpToPng(img.src);
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
            } catch (error) {
                alert(`下载失败: ${error.message}`);
            }
        }

        handleOpen() {
            const img = this.getCurrentImage();
            if (img?.src) window.open(img.src, '_blank');
        }

        async convertWebpToPng(src) {
            const blob = await this.fetchImageBlob(src);
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    canvas.toBlob(pngBlob => resolve({
                        blob: pngBlob,
                        fileName: `jimeng-ai-${Date.now()}.png`
                    }), 'image/png');
                };
                img.src = URL.createObjectURL(blob);
            });
        }

        fetchImageBlob(url) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: res => resolve(res.response),
                    onerror: err => reject(new Error('图片请求失败: ' + err.statusText))
                });
            });
        }

        initVideoMonitor() {
            setInterval(() => this.scanVideos(), CONFIG.VIDEO_SCAN_INTERVAL);
        }

        scanVideos() {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                const src = this.cleanVideoUrl(video.src || video.querySelector('source')?.src);
                if (src && !this.videoList.has(src)) {
                    // 保存视频元素的引用，方便后续获取poster或截图
                    this.videoList.set(src, { 
                        timestamp: Date.now(),
                        videoElement: video,
                        poster: video.poster || null
                    });
                    this.updateVideoCount();
                }
            });
        }

        cleanVideoUrl(url) {
            if (!url || url === 'about:blank') return '';
            try {
                const u = new URL(url.startsWith('/') ? window.location.origin + url : url);
                ['watermark', 'logo', 'w', 'h', 'quality'].forEach(param => u.searchParams.delete(param));
                return u.toString();
            } catch (e) {
                return url;
            }
        }

        createVideoPanel() {
            this.videoPanel = document.createElement('div');
            this.videoPanel.style = `${CONFIG.VIDEO_PANEL_STYLE};display:none;`;
            this.updateVideoPanelContent();
            document.body.appendChild(this.videoPanel);
            this.setupDrag(this.videoPanel);
        }

        updateVideoPanelContent() {
            this.videoPanel.innerHTML = `
                <div style="padding:12px;border-bottom:1px solid #eee;background:#f8f9fa;display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-weight:500;">检测到 ${this.videoList.size} 个视频</span>
                    <button class="collapse-btn" style="padding:4px 8px;background:#ff4d4f;color:white;border:none;border-radius:4px;cursor:pointer;">收起</button>
                </div>
                <div style="flex:1;overflow-y:auto;padding:8px;">
                    ${Array.from(this.videoList.entries()).map(([url, info], index) => `
                        <div style="${CONFIG.VIDEO_ITEM_STYLE}">
                            <img class="video-thumbnail" data-url="${url}" 
                                 src="${info.poster || CONFIG.DEFAULT_THUMBNAIL}" 
                                 style="width:80px;height:60px;object-fit:cover;border-radius:4px;" 
                                 alt="视频缩略图">
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                    视频 ${index + 1} - ${new Date(info.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                            <button class="download-btn" data-url="${url}" style="padding:4px 8px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;white-space:nowrap;">
                                下载无水印版
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            this.videoPanel.className = 'jimeng-enhancer-video-panel';

            const collapseBtn = this.videoPanel.querySelector('.collapse-btn');
            collapseBtn.addEventListener('click', () => this.toggleVideoPanel());

            const downloadBtns = this.videoPanel.querySelectorAll('.download-btn');
            downloadBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const url = btn.getAttribute('data-url');
                    GM_download({
                        url: url,
                        name: `即梦视频_${Date.now()}.mp4`,
                        onload: () => {
                            this.videoList.delete(url);
                            this.updateVideoCount();
                            this.updateVideoPanelContent();
                        }
                    });
                });
            });

            const thumbnails = this.videoPanel.querySelectorAll('.video-thumbnail');
            thumbnails.forEach(thumbnail => {
                const url = thumbnail.getAttribute('data-url');
                const videoInfo = this.videoList.get(url);
                
                // 如果没有poster，尝试生成缩略图
                if (!videoInfo.poster) {
                    this.generateVideoThumbnail(url, thumbnail, videoInfo.videoElement);
                }
            });
        }

        generateVideoThumbnail(url, imgElement, videoElement) {
            // 优先使用视频元素生成缩略图
            if (videoElement && !videoElement.seeking && videoElement.readyState >= 2) {
                try {
                    // 直接使用已加载的视频元素生成缩略图
                    const canvas = document.createElement('canvas');
                    canvas.width = 80;
                    canvas.height = 60;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    imgElement.src = canvas.toDataURL('image/jpeg', 0.7);
                    
                    // 更新视频列表中的poster信息
                    const videoInfo = this.videoList.get(url);
                    if (videoInfo) {
                        videoInfo.poster = imgElement.src;
                    }
                    return;
                } catch (e) {
                    console.warn('使用已有视频元素生成缩略图失败:', e);
                    // 失败后继续尝试下面的方法
                }
            }
            
            // 创建新的视频元素加载视频
            const tempVideo = document.createElement('video');
            tempVideo.muted = true;
            tempVideo.crossOrigin = "anonymous"; // 允许跨域访问
            tempVideo.preload = "metadata";
            
            // 设置超时以避免长时间加载
            const timeoutId = setTimeout(() => {
                cleanupAndShowFallback();
            }, 5000);
            
            const cleanupAndShowFallback = () => {
                clearTimeout(timeoutId);
                if (document.body.contains(tempVideo)) {
                    document.body.removeChild(tempVideo);
                }
                if (imgElement.src === CONFIG.DEFAULT_THUMBNAIL) {
                    // 只有当图片还是默认图时才需要更新
                    imgElement.src = CONFIG.DEFAULT_THUMBNAIL;
                }
            };
            
            tempVideo.onloadedmetadata = function() {
                try {
                    tempVideo.currentTime = Math.min(1, tempVideo.duration / 3);
                } catch (e) {
                    cleanupAndShowFallback();
                }
            };
            
            tempVideo.onseeked = function() {
                try {
                    // 视频已经跳转到指定时间点，创建缩略图
                    const canvas = document.createElement('canvas');
                    canvas.width = 80;
                    canvas.height = 60;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
                    imgElement.src = canvas.toDataURL('image/jpeg', 0.7);
                    
                    // 更新视频列表中的poster信息
                    const videoInfo = this.videoList?.get?.(url);
                    if (videoInfo) {
                        videoInfo.poster = imgElement.src;
                    }
                    
                    clearTimeout(timeoutId);
                    document.body.removeChild(tempVideo);
                } catch (e) {
                    cleanupAndShowFallback();
                }
            }.bind(this);
            
            tempVideo.onerror = cleanupAndShowFallback;
            
            // 隐藏视频元素并添加到DOM
            tempVideo.style.display = 'none';
            document.body.appendChild(tempVideo);
            
            // 最后设置src以开始加载
            tempVideo.src = url;
        }

        updateVideoCount() {
            const countBadge = this.floatingContainer?.querySelector('.video-count');
            if (countBadge) countBadge.textContent = this.videoList.size;
            if (this.isVideoPanelExpanded) this.updateVideoPanelContent();
        }

        toggleVideoPanel() {
            this.isVideoPanelExpanded = !this.isVideoPanelExpanded;
            this.videoPanel.style.display = this.isVideoPanelExpanded ? 'flex' : 'none';
            const videoBtn = this.floatingContainer.querySelector('.jimeng-video-btn');
            if (videoBtn) videoBtn.style.display = this.isVideoPanelExpanded ? 'none' : 'flex';
            if (this.isVideoPanelExpanded) this.updateVideoPanelContent();
        }

        setupDrag(element) {
            let isDragging = false, startX, startY, initialX, initialY;
            const header = element.querySelector('div:first-child');

            header.addEventListener('mousedown', e => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialX = element.offsetLeft;
                initialY = element.offsetTop;
            });

            document.addEventListener('mousemove', e => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                element.style.right = 'auto';
                element.style.bottom = 'auto';
                element.style.left = `${initialX + dx}px`;
                element.style.top = `${initialY + dy}px`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        handleGlobalClick(event) {
            if (!event.target.closest('.jimeng-enhancer-video-panel, .jimeng-download-btn, .jimeng-video-btn, .jimeng-open-btn')) {
                return;
            }
            event.stopImmediatePropagation();
        }
    }

    new JimengEnhancer();
})();