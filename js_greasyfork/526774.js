// ==UserScript==
// @name         Kemono图片打包助手
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  自动获取kemono.su页面中的所有图片并打包下载
// @author       hoami523
// @match        https://kemono.cr/*/user/*
// @match        https://kemono.su/*/user/*
// @connect      kemono.su
// @connect      kemono.cr
// @connect      cdn.kemono.su
// @connect      img.kemono.su
// @connect      files.kemono.su
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526774/Kemono%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526774/Kemono%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isMenuOpen = false;
    let isDownloading = false;
    let lastZipBlob = null;
    let lastZipName = '图片打包助手.zip';

    // 简化的JSZip实现（核心功能）
    class SimpleZip {
        constructor() {
            this.files = [];
        }

        file(name, blob) {
            this.files.push({ name, blob });
        }

        async generateAsync() {
            // 简化的ZIP格式生成
            const encoder = new TextEncoder();
            let centralDirectory = [];
            let localFiles = [];
            let offset = 0;

            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                const fileData = await file.blob.arrayBuffer();
                const fileNameBytes = encoder.encode(file.name);
                
                // 本地文件头
                const localHeader = new ArrayBuffer(30 + fileNameBytes.length);
                const localView = new DataView(localHeader);
                
                // 本地文件头签名
                localView.setUint32(0, 0x04034b50, true);
                // 版本
                localView.setUint16(4, 10, true);
                // 标志
                localView.setUint16(6, 0, true);
                // 压缩方法（存储）
                localView.setUint16(8, 0, true);
                // 时间
                localView.setUint16(10, 0, true);
                // 日期
                localView.setUint16(12, 0, true);
                // CRC32（简化，实际应该计算）
                localView.setUint32(14, 0, true);
                // 压缩大小
                localView.setUint32(18, fileData.byteLength, true);
                // 未压缩大小
                localView.setUint32(22, fileData.byteLength, true);
                // 文件名长度
                localView.setUint16(26, fileNameBytes.length, true);
                // 额外字段长度
                localView.setUint16(28, 0, true);
                
                // 文件名
                const localBytes = new Uint8Array(localHeader);
                localBytes.set(fileNameBytes, 30);
                
                localFiles.push(localBytes);
                localFiles.push(new Uint8Array(fileData));
                
                // 中央目录条目
                const centralHeader = new ArrayBuffer(46 + fileNameBytes.length);
                const centralView = new DataView(centralHeader);
                
                // 中央目录文件头签名
                centralView.setUint32(0, 0x02014b50, true);
                // 版本
                centralView.setUint16(4, 10, true);
                // 需要的版本
                centralView.setUint16(6, 10, true);
                // 标志
                centralView.setUint16(8, 0, true);
                // 压缩方法
                centralView.setUint16(10, 0, true);
                // 时间
                centralView.setUint16(12, 0, true);
                // 日期
                centralView.setUint16(14, 0, true);
                // CRC32
                centralView.setUint32(16, 0, true);
                // 压缩大小
                centralView.setUint32(20, fileData.byteLength, true);
                // 未压缩大小
                centralView.setUint32(24, fileData.byteLength, true);
                // 文件名长度
                centralView.setUint16(28, fileNameBytes.length, true);
                // 额外字段长度
                centralView.setUint16(30, 0, true);
                // 注释长度
                centralView.setUint16(32, 0, true);
                // 磁盘号
                centralView.setUint16(34, 0, true);
                // 内部文件属性
                centralView.setUint16(36, 0, true);
                // 外部文件属性
                centralView.setUint32(38, 0, true);
                // 本地文件头偏移
                centralView.setUint32(42, offset, true);
                
                const centralBytes = new Uint8Array(centralHeader);
                centralBytes.set(fileNameBytes, 46);
                
                centralDirectory.push(centralBytes);
                
                offset += localBytes.length + fileData.byteLength;
            }
            
            // 连接所有部分
            const totalLength = localFiles.reduce((sum, arr) => sum + arr.length, 0) +
                              centralDirectory.reduce((sum, arr) => sum + arr.length, 0) +
                              22; // 结束记录长度
            
            const zipData = new Uint8Array(totalLength);
            let pos = 0;
            
            // 写入本地文件
            for (const local of localFiles) {
                zipData.set(local, pos);
                pos += local.length;
            }
            
            // 写入中央目录
            for (const central of centralDirectory) {
                zipData.set(central, pos);
                pos += central.length;
            }
            
            // 结束记录
            const endRecord = new ArrayBuffer(22);
            const endView = new DataView(endRecord);
            
            // 结束记录签名
            endView.setUint32(0, 0x06054b50, true);
            // 磁盘号
            endView.setUint16(4, 0, true);
            // 中央目录起始磁盘号
            endView.setUint16(6, 0, true);
            // 磁盘上的中央目录条目数
            endView.setUint16(8, this.files.length, true);
            // 中央目录条目总数
            endView.setUint16(10, this.files.length, true);
            // 中央目录大小
            endView.setUint32(12, centralDirectory.reduce((sum, arr) => sum + arr.length, 0), true);
            // 中央目录偏移
            endView.setUint32(16, offset, true);
            // 注释长度
            endView.setUint16(20, 0, true);
            
            zipData.set(new Uint8Array(endRecord), pos);
            
            return new Blob([zipData], { type: 'application/zip' });
        }
    }

    // 获取作者和标题
    function getAuthorAndTitle() {
        const author = document.querySelector('.post__user-name')?.textContent?.trim() || '未知作者';
        const titleElement = document.querySelector('.post__title span');
        let title = titleElement?.textContent?.trim() || '未知标题';
        
        // 去除文件名非法字符，包括更多特殊字符
        const safe = s => s.replace(/[\\/:*?"<>|\[\]()]/g, '_');
        return {
            author: safe(author),
            title: safe(title)
        };
    }

    // 创建悬浮面板
    function createFloatingIcon() {
        const container = document.createElement('div');
        container.className = 'image-pack-helper';
        container.innerHTML = `
            <div class="image-pack-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
            </div>
            <div class="image-pack-menu">
                <div class="menu-title">Kemono图片打包助手</div>
                <button class="download-btn" id="downloadBtn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    打包下载图片
                </button>
                <button class="download-btn" id="manualDownloadBtn" style="margin-top:8px;display:none;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 20h14v-2H5v2zm7-18C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    手动下载ZIP
                </button>
                <div class="progress-container" id="progressContainer">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="progress-text" id="progressText">准备中...</div>
                </div>
                <div id="debugInfo"></div>
            </div>
        `;
        document.body.appendChild(container);
        return container;
    }

    // 拖拽功能
    function initDragAndDrop(container) {
        const icon = container.querySelector('.image-pack-icon');
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        const DRAG_THRESHOLD = 10; // 拖拽阈值
        const TAP_TIMEOUT = 200; // 点击超时时间（毫秒）
        
        // 鼠标事件
        icon.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // 触摸事件处理
        icon.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            startDrag(e);
        }, { passive: false });
        
        document.addEventListener('touchmove', drag, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            // 计算触摸持续时间和移动距离
            const touchDuration = touchEndTime - touchStartTime;
            const moveX = Math.abs(touchEndX - touchStartX);
            const moveY = Math.abs(touchEndY - touchStartY);
            
            // 如果是轻触（时间短且移动距离小），则触发菜单切换
            if (touchDuration < TAP_TIMEOUT && moveX < DRAG_THRESHOLD && moveY < DRAG_THRESHOLD) {
                e.preventDefault();
                toggleMenu(e);
            }
            
            stopDrag(e);
        });
        
        // 鼠标点击事件
        icon.addEventListener('click', toggleMenu);
    }

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        const container = document.querySelector('.image-pack-helper');
        container.classList.add('dragging');
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        dragOffset.x = clientX - rect.left;
        dragOffset.y = clientY - rect.top;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const container = document.querySelector('.image-pack-helper');
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const x = clientX - dragOffset.x;
        const y = clientY - dragOffset.y;
        const maxX = window.innerWidth - container.offsetWidth;
        const maxY = window.innerHeight - container.offsetHeight;
        container.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        container.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        container.style.right = 'auto';
    }

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        const container = document.querySelector('.image-pack-helper');
        container.classList.remove('dragging');
    }

    function toggleMenu(e) {
        e.stopPropagation();
        const menu = document.querySelector('.image-pack-menu');
        if (isMenuOpen) {
            menu.classList.remove('show');
            isMenuOpen = false;
        } else {
            menu.classList.add('show');
            isMenuOpen = true;
        }
    }

    // 获取图片（带调试信息）
    function getAllImages(debugInfo) {
        const url = window.location.href;
        const container = document.querySelector('.post__files');
        debugInfo['页面URL'] = url;
        debugInfo['是否找到文件容器'] = !!container;
        if (!container) {
            debugInfo['图片数量'] = 0;
            return [];
        }
        
        // 获取所有图片链接
        const imgLinks = container.querySelectorAll('.fileThumb.image-link');
        debugInfo['图片链接数量'] = imgLinks.length;
        const images = [];
        let filteredCount = 0;
        
        imgLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('data:')) {
                let src = href;
                if (src && src.startsWith('//')) src = 'https:' + src;
                const urlLower = src.toLowerCase();
                const isImage = urlLower.includes('.jpg') || urlLower.includes('.jpeg') || 
                               urlLower.includes('.png') || urlLower.includes('.gif') || 
                               urlLower.includes('.webp') || urlLower.includes('.bmp') ||
                               urlLower.includes('.svg');
                if (isImage) {
                    images.push({
                        src: src,
                        index: index
                    });
                } else {
                    filteredCount++;
                }
            }
        });
        debugInfo['过滤掉的非图片文件'] = filteredCount;
        debugInfo['有效图片数量'] = images.length;
        return images;
    }

    // 下载图片
    async function downloadImage(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: function(response) {
                    const blob = response.response;
                    
                    // 过滤掉小文件（小于50KB的文件）
                    if (blob.size < 50 * 1024) {
                        console.log(`跳过小文件: ${url}, 大小: ${blob.size} bytes`);
                        resolve(null);
                        return;
                    }
                    
                    resolve(blob);
                },
                onerror: function(error) {
                    console.error(`下载失败: ${url}`, error);
                    resolve(null);
                }
            });
        });
    }

    // 自动下载和手动下载
    function triggerDownload(blob, zipName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = zipName || 'Kemono图片打包助手.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 显示调试信息
    function showDebugInfo(info) {
        const debugDiv = document.getElementById('debugInfo');
        debugDiv.innerHTML = '';
        for (const key in info) {
            const p = document.createElement('p');
            p.style.fontSize = '12px';
            p.style.margin = '2px 0';
            p.textContent = `${key}: ${info[key]}`;
            debugDiv.appendChild(p);
        }
    }

    // 进度UI
    function updateProgressUI(type, data) {
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        if (type === 'start') {
            progressContainer.classList.add('show');
            progressFill.style.width = '0%';
            progressText.textContent = `找到 ${data.total} 张图片，开始下载...`;
        } else if (type === 'downloading') {
            progressFill.style.width = `${(data.current / data.total) * 100}%`;
            progressText.textContent = `下载中... (${data.current}/${data.total})`;
        } else if (type === 'zipping') {
            progressFill.style.width = '100%';
            progressText.textContent = '正在生成ZIP文件...';
        } else if (type === 'done') {
            progressFill.style.width = '100%';
            progressText.textContent = `下载完成！共打包 ${data.count} 张图片`;
            progressContainer.classList.add('show');
        } else if (type === 'error') {
            progressText.textContent = data.message;
            progressContainer.classList.add('show');
        }
    }

    // 主打包逻辑
    async function packAndDownloadImages(debugMode) {
        if (isDownloading) return;
        isDownloading = true;
        lastZipBlob = null;
        lastZipName = 'Kemono图片打包助手.zip';
        const downloadBtn = document.getElementById('downloadBtn');
        const manualBtn = document.getElementById('manualDownloadBtn');
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>处理中...`;
        progressContainer.classList.add('show');
        progressText.textContent = '准备中...';
        progressFill.style.width = '0%';
        showDebugInfo({ 状态: '正在请求页面信息...' });

        // 获取作者和标题
        const { author, title } = getAuthorAndTitle();
        lastZipName = `${author}_${title}.zip`;

        const debugInfo = {};
        const images = getAllImages(debugInfo);
        if (debugMode) showDebugInfo(debugInfo);
        if (images.length === 0) {
            updateProgressUI('error', { message: '未找到图片' });
            showDebugInfo(debugInfo);
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>打包下载图片`;
            manualBtn.style.display = 'none';
            isDownloading = false;
            return;
        }
        updateProgressUI('start', { total: images.length });
        const zip = new SimpleZip();
        let downloadedCount = 0;
        let skippedCount = 0;
        for (let i = 0; i < images.length; i++) {
            updateProgressUI('downloading', { current: i + 1, total: images.length });
            showDebugInfo(debugInfo);
            const blob = await downloadImage(images[i].src);
            if (blob) {
                // 根据blob类型确定扩展名
                let extension = 'jpg'; // 默认扩展名
                if (blob.type.includes('png')) extension = 'png';
                else if (blob.type.includes('gif')) extension = 'gif';
                else if (blob.type.includes('webp')) extension = 'webp';
                else if (blob.type.includes('bmp')) extension = 'bmp';
                else if (blob.type.includes('svg')) extension = 'svg';
                // 只用序号命名
                const filename = `${String(downloadedCount + 1).padStart(3, '0')}.${extension}`;
                zip.file(filename, blob);
                downloadedCount++;
                debugInfo[`文件${downloadedCount}`] = `${filename} (${(blob.size / 1024).toFixed(1)}KB)`;
            } else {
                skippedCount++;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        debugInfo['跳过的小文件数量'] = skippedCount;
        debugInfo['实际下载文件数量'] = downloadedCount;
        if (downloadedCount === 0) {
            updateProgressUI('error', { message: '下载失败，请检查网络连接' });
            showDebugInfo(debugInfo);
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>打包下载图片`;
            manualBtn.style.display = 'none';
            isDownloading = false;
            return;
        }
        updateProgressUI('zipping', {});
        showDebugInfo(debugInfo);
        const zipBlob = await zip.generateAsync();
        lastZipBlob = zipBlob;
        updateProgressUI('done', { count: downloadedCount });
        showDebugInfo(debugInfo);
        // 自动下载
        triggerDownload(zipBlob, lastZipName);
        // 显示手动下载按钮
        manualBtn.style.display = 'block';
        manualBtn.onclick = () => {
            if (lastZipBlob) triggerDownload(lastZipBlob, lastZipName);
        };
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>打包下载图片`;
            progressContainer.classList.remove('show');
            progressFill.style.width = '0%';
            isDownloading = false;
        }, 3000);
    }

    // 添加CSS样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 悬浮面板容器 */
            .image-pack-helper {
                position: fixed;
                z-index: 999999;
                top: 20px;
                right: 20px;
                cursor: move;
                user-select: none;
                touch-action: none;
            }

            /* 悬浮图标 */
            .image-pack-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                border: 2px solid #fff;
            }

            .image-pack-icon:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            .image-pack-icon svg {
                width: 24px;
                height: 24px;
                fill: white;
            }

            /* 菜单容器 */
            .image-pack-menu {
                position: absolute;
                top: 60px;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                padding: 16px;
                min-width: 220px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                border: 1px solid #e1e5e9;
            }

            .image-pack-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .menu-title {
                font-size: 14px;
                font-weight: 600;
                color: #333;
                margin-bottom: 12px;
                text-align: center;
            }

            .download-btn {
                width: 100%;
                padding: 10px 16px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .download-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .download-btn:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .progress-container {
                margin-top: 12px;
                display: none;
            }

            .progress-container.show {
                display: block;
            }

            .progress-bar {
                width: 100%;
                height: 6px;
                background: #f0f0f0;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                width: 0%;
                transition: width 0.3s ease;
            }

            .progress-text {
                font-size: 12px;
                color: #666;
                text-align: center;
            }

            #debugInfo {
                margin-top: 10px;
                background: #f6f6f6;
                border-radius: 6px;
                padding: 6px;
                color: #666;
                word-break: break-all;
                font-family: monospace;
            }

            @media (max-width: 768px) {
                .image-pack-helper {
                    top: 10px;
                    right: 10px;
                }
                .image-pack-icon {
                    width: 45px;
                    height: 45px;
                }
                .image-pack-icon svg {
                    width: 20px;
                    height: 20px;
                }
                .image-pack-menu {
                    min-width: 180px;
                    padding: 12px;
                }
                .download-btn {
                    padding: 8px 12px;
                    font-size: 13px;
                }
            }

            .image-pack-helper.dragging {
                opacity: 0.8;
            }

            .image-pack-helper.dragging .image-pack-icon {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化
    function init() {
        if (!window.location.href.includes('kemono.cr/') && !window.location.href.includes('kemono.su/')) return;
        
        // 添加样式
        addStyles();
        
        const container = createFloatingIcon();
        initDragAndDrop(container);
        
        // 为下载按钮添加触摸事件支持
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', () => packAndDownloadImages(true));
        downloadBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            packAndDownloadImages(true);
        });
        
        // 为手动下载按钮添加触摸事件支持
        const manualBtn = document.getElementById('manualDownloadBtn');
        manualBtn.addEventListener('click', () => {
            if (lastZipBlob) triggerDownload(lastZipBlob, lastZipName);
        });
        manualBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (lastZipBlob) triggerDownload(lastZipBlob, lastZipName);
        });
        
        // 菜单常驻：点击菜单不关闭，点击icon才切换
        const menu = document.querySelector('.image-pack-menu');
        menu.addEventListener('mousedown', e => e.stopPropagation());
        menu.addEventListener('touchstart', e => e.stopPropagation());
        
        // 不再监听document的点击关闭菜单
        console.log('Kemono图片打包助手悬浮面板已启动');
        
        // 显示通知
        GM_notification({
            text: 'Kemono图片打包助手已启动！点击右上角图标开始使用。',
            title: 'Kemono图片打包助手',
            timeout: 3000
        });
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();