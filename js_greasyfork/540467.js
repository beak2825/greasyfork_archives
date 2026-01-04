// ==UserScript==
// @name         图片下载助手
// @namespace    http://tampermonkey.net/
// @version      alpha 1.0
// @description  支持图片预览和多图批量下载，置顶批量下载按钮
// @author       Songlll
// @match        https://www.zqy.com/resource/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540467/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540467/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 免责声明内容
    const DISCLAIMER = `
        <strong>免责声明：</strong>
        <p>本脚本仅用于个人学习研究，请尊重网站版权。下载内容仅限个人使用，禁止传播或用于商业用途。</p>
        <p>使用本脚本产生的任何法律责任由用户自行承担。请支持正版资源，尊重创作者劳动成果。</p>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 整体布局 */
        .dh-container {
            position: fixed;
            bottom: 20px;
            right: 100px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* 浮动按钮 */
        .dh-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            border: none;
        }

        .dh-toggle:hover {
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 8px 25px rgba(74, 108, 247, 0.6);
        }

        /* 控制面板 */
        .dh-panel {
            width: 360px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            margin-bottom: 15px;
            display: none;
            max-height: 80vh;
        }

        .dh-panel.active {
            display: block;
        }

        /* 面板头部 */
        .dh-header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .dh-title {
            font-size: 18px;
            font-weight: 600;
        }

        .dh-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            font-size: 18px;
        }

        .dh-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }

        /* 面板内容 */
        .dh-content {
            padding: 20px;
            max-height: calc(80vh - 150px);
            overflow-y: auto;
        }

        /* 免责声明 */
        .dh-disclaimer {
            background: #fff8e1;
            border-left: 4px solid #ffc107;
            padding: 12px 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            font-size: 13px;
            line-height: 1.5;
        }

        /* 统计信息 */
        .dh-stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 12px;
        }

        .dh-stat-item {
            text-align: center;
        }

        .dh-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #4a6cf7;
            line-height: 1;
        }

        .dh-stat-label {
            color: #64748b;
            font-size: 14px;
        }

        /* 操作按钮 */
        .dh-action-buttons {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 20px;
        }

        .dh-action-btn {
            padding: 14px;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s ease;
            font-size: 16px;
        }

        .dh-download-all {
            background: linear-gradient(to right, #00c9a7, #00b09b);
            color: white;
            position: sticky;
            top: 60px;
            z-index: 5;
        }

        .dh-download-all:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 201, 167, 0.4);
        }

        /* 单张图片下载按钮 */
        .dh-single-download {
            background: #4A90E2;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            margin-left: 10px;
            transition: all 0.2s;
        }

        .dh-single-download:hover {
            background: #3a7bc8;
        }

        /* 进度条 */
        .dh-progress-container {
            background: #f1f5f9;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 15px;
        }

        .dh-progress-header {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            font-size: 14px;
            color: #64748b;
        }

        .dh-progress-bar {
            height: 8px;
            background: #e2e8f0;
            position: relative;
        }

        .dh-progress-fill {
            height: 100%;
            background: linear-gradient(to right, #ff9a9e, #fad0c4);
            width: 0%;
            transition: width 0.5s ease;
            border-radius: 0 4px 4px 0;
        }

        /* 当前文件信息 */
        .dh-current-file {
            padding: 15px;
            background: #f8fafc;
            border-radius: 12px;
            font-size: 14px;
            margin-top: 15px;
            display: none;
        }

        .dh-current-file.active {
            display: block;
        }

        .dh-filename {
            font-weight: 600;
            color: #4a6cf7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 5px;
        }

        /* 状态文本 */
        .dh-status {
            font-size: 14px;
            color: #4a5568;
            text-align: center;
            margin: 10px 0;
            font-weight: 500;
        }

        /* 图片预览区域 */
        .dh-preview-container {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }

        .dh-preview-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #4a5568;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .dh-preview-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .dh-preview-item {
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            position: relative;
            aspect-ratio: 4/3;
            background: #f5f7fa;
            border: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }

        .dh-preview-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-color: #4a6cf7;
        }

        .dh-preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .dh-preview-number {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }

        /* 预览弹窗 */
        .dh-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .dh-preview-modal.active {
            opacity: 1;
            pointer-events: all;
        }

        .dh-preview-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
        }

        .dh-preview-content img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .dh-preview-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .dh-preview-nav:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .dh-preview-prev {
            left: 20px;
        }

        .dh-preview-next {
            right: 20px;
        }

        .dh-preview-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .dh-preview-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }

        .dh-preview-info {
            color: white;
            margin-top: 15px;
            font-size: 16px;
        }

        /* VIP提示 */
        .vip-protection-notice {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #4CAF50;
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeInOut 5s forwards;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }

        /* 网站原有样式覆盖 */
        .cont_one {
            position: relative;
            margin-bottom: 25px;
            padding: 15px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }

        .cont_one:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }

        .cont_one p {
            display: flex;
            align-items: center;
            margin-top: 10px;
        }

        .cont_one em {
            font-weight: bold;
            color: #6a11cb;
        }
    `;
    document.head.appendChild(style);

    // 创建浮动控制面板容器
    const container = document.createElement('div');
    container.className = 'dh-container';
    document.body.appendChild(container);

    // 创建浮动按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'dh-toggle';
    toggleBtn.innerHTML = '⇩';
    container.appendChild(toggleBtn);

    // 创建控制面板
    const panel = document.createElement('div');
    panel.className = 'dh-panel';
    container.appendChild(panel);

    // 面板头部
    const header = document.createElement('div');
    header.className = 'dh-header';
    header.innerHTML = `
        <div class="dh-title">图片下载助手</div>
        <button class="dh-close">×</button>
    `;
    panel.appendChild(header);

    // 面板内容
    const content = document.createElement('div');
    content.className = 'dh-content';
    content.innerHTML = `
        <div class="dh-disclaimer">${DISCLAIMER}</div>
        <div class="dh-stats">
            <div class="dh-stat-item">
                <div class="dh-stat-value" id="dh-image-count">0</div>
                <div class="dh-stat-label">图片数量</div>
            </div>
            <div class="dh-stat-item">
                <div class="dh-stat-value" id="dh-vip-status">VIP</div>
                <div class="dh-stat-label">账户状态</div>
            </div>
        </div>
        <div class="dh-action-buttons">
            <button class="dh-action-btn dh-download-all" id="dh-download-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                批量下载所有图片
            </button>
        </div>
        <div class="dh-preview-container">
            <div class="dh-preview-title">
                <span>图片预览</span>
                <small>(点击预览大图)</small>
            </div>
            <div class="dh-preview-grid" id="dh-preview-grid"></div>
        </div>
        <div class="dh-progress-container">
            <div class="dh-progress-header">
                <span>下载进度</span>
                <span id="dh-progress-percent">0%</span>
            </div>
            <div class="dh-progress-bar">
                <div class="dh-progress-fill" id="dh-progress-fill"></div>
            </div>
        </div>
        <div class="dh-status" id="dh-status">就绪，等待操作</div>
        <div class="dh-current-file" id="dh-current-file">
            <div class="dh-filename" id="dh-filename">当前下载文件</div>
            <div id="dh-fileinfo">等待开始...</div>
        </div>
    `;
    panel.appendChild(content);

    // 创建预览弹窗
    const previewModal = document.createElement('div');
    previewModal.className = 'dh-preview-modal';
    previewModal.innerHTML = `
        <div class="dh-preview-close">×</div>
        <div class="dh-preview-nav dh-preview-prev">❮</div>
        <div class="dh-preview-content">
            <img id="dh-preview-large" src="" alt="预览图">
            <div class="dh-preview-info" id="dh-preview-info"></div>
        </div>
        <div class="dh-preview-nav dh-preview-next">❯</div>
    `;
    document.body.appendChild(previewModal);

    // 获取DOM元素
    const closeBtn = header.querySelector('.dh-close');
    const downloadAllBtn = document.getElementById('dh-download-all');
    const progressFill = document.getElementById('dh-progress-fill');
    const progressPercent = document.getElementById('dh-progress-percent');
    const statusText = document.getElementById('dh-status');
    const currentFile = document.getElementById('dh-current-file');
    const filename = document.getElementById('dh-filename');
    const fileInfo = document.getElementById('dh-fileinfo');
    const imageCount = document.getElementById('dh-image-count');
    const vipStatus = document.getElementById('dh-vip-status');
    const previewGrid = document.getElementById('dh-preview-grid');
    const previewLarge = document.getElementById('dh-preview-large');
    const previewInfo = document.getElementById('dh-preview-info');
    const modalClose = previewModal.querySelector('.dh-preview-close');
    const modalPrev = previewModal.querySelector('.dh-preview-prev');
    const modalNext = previewModal.querySelector('.dh-preview-next');

    // 按钮事件
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });

    modalClose.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    // 修复下载功能
    function downloadImage(imgUrl) {
        // 从URL中提取文件名
        const urlParts = imgUrl.split('/');
        let filename = urlParts[urlParts.length - 1];

        // 确保文件名有效
        if (!filename || !filename.includes('.')) {
            filename = `image_${Date.now()}.jpg`;
        }

        // 使用GM_download API确保下载行为
        if (typeof GM_download !== 'undefined') {
            GM_download({
                url: imgUrl,
                name: filename,
                onload: function() {
                    console.log('图片下载成功:', filename);
                },
                onerror: function(e) {
                    console.error('下载失败:', e);
                    fallbackDownload(imgUrl, filename);
                }
            });
        } else {
            // 回退方案
            fallbackDownload(imgUrl, filename);
        }

        return filename;
    }

    // 回退下载方法
    function fallbackDownload(imgUrl, filename) {
        // 创建隐藏的下载链接
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 更新进度条
    function updateProgress(current, total) {
        const percent = Math.round((current / total) * 100);
        progressFill.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
        statusText.textContent = `下载中: ${current}/${total}`;
        imageCount.textContent = total;
    }

    // 批量下载所有图片
    downloadAllBtn.addEventListener('click', function() {
        const images = document.querySelectorAll('.cont_one img.image_1');
        const total = images.length;

        if (total === 0) {
            statusText.textContent = "未找到图片!";
            return;
        }

        // 禁用按钮
        downloadAllBtn.disabled = true;
        downloadAllBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            下载中...
        `;
        currentFile.classList.add('active');

        let downloaded = 0;

        const downloadNext = () => {
            if (downloaded >= total) {
                statusText.textContent = "下载完成!";
                downloadAllBtn.disabled = false;
                downloadAllBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    批量下载所有图片
                `;
                currentFile.classList.remove('active');
                return;
            }

            const img = images[downloaded];
            const imgUrl = img.src;

            // 显示当前下载文件信息
            filename.textContent = `文件 ${downloaded + 1}/${total}`;
            fileInfo.textContent = `正在下载: ${imgUrl.split('/').pop().substring(0, 20)}...`;

            // 下载图片
            const filenameDownloaded = downloadImage(imgUrl);

            downloaded++;
            updateProgress(downloaded, total);

            // 间隔1.5秒下载下一张（避免浏览器限制）
            setTimeout(downloadNext, 1500);
        };

        downloadNext();
    });

    // 图片预览功能
    function createPreviewItems() {
        previewGrid.innerHTML = '';
        const images = document.querySelectorAll('.cont_one img.image_1');

        images.forEach((img, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'dh-preview-item';
            previewItem.innerHTML = `
                <img src="${img.src}" alt="预览图 ${index + 1}">
                <div class="dh-preview-number">${index + 1}</div>
            `;

            previewItem.addEventListener('click', () => {
                previewLarge.src = img.src;
                previewInfo.textContent = `图片 ${index + 1}/${images.length} - ${img.src.split('/').pop()}`;
                previewModal.classList.add('active');
                currentPreviewIndex = index;
            });

            previewGrid.appendChild(previewItem);
        });
    }

    // 预览导航
    let currentPreviewIndex = 0;

    modalNext.addEventListener('click', () => {
        const images = document.querySelectorAll('.cont_one img.image_1');
        currentPreviewIndex = (currentPreviewIndex + 1) % images.length;
        updatePreviewImage();
    });

    modalPrev.addEventListener('click', () => {
        const images = document.querySelectorAll('.cont_one img.image_1');
        currentPreviewIndex = (currentPreviewIndex - 1 + images.length) % images.length;
        updatePreviewImage();
    });

    function updatePreviewImage() {
        const images = document.querySelectorAll('.cont_one img.image_1');
        if (images.length > 0 && currentPreviewIndex < images.length) {
            const img = images[currentPreviewIndex];
            previewLarge.src = img.src;
            previewInfo.textContent = `图片 ${currentPreviewIndex + 1}/${images.length} - ${img.src.split('/').pop()}`;
        }
    }

    // 为每张图片添加下载按钮
    function addDownloadButtons() {
        const containers = document.querySelectorAll('.cont_one');

        containers.forEach(container => {
            // 检查是否已添加过按钮
            if (container.querySelector('.dh-single-download')) return;

            const img = container.querySelector('img.image_1');
            if (!img) return;

            const pElement = container.querySelector('p');
            if (pElement) {
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'dh-single-download';
                downloadBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    下载
                `;

                downloadBtn.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // 显示控制面板
                    panel.classList.add('active');

                    // 更新状态
                    statusText.textContent = "正在下载单张图片...";
                    currentFile.classList.add('active');

                    const imgUrl = img.src;
                    const filename = downloadImage(imgUrl);

                    filename.textContent = "单张图片下载";
                    fileInfo.textContent = `已下载: ${filename}`;

                    // 2秒后恢复状态
                    setTimeout(() => {
                        statusText.textContent = "单张图片下载完成";
                        setTimeout(() => {
                            statusText.textContent = "就绪，等待操作";
                            currentFile.classList.remove('active');
                        }, 2000);
                    }, 500);
                });

                pElement.appendChild(downloadBtn);
            }
        });

        // 更新图片计数
        imageCount.textContent = containers.length;

        // 创建预览项
        createPreviewItems();

        // 模拟VIP状态检测
        vipStatus.textContent = document.querySelector('.vip-indicator') ? 'VIP' : '普通用户';
    }

    // 初始添加按钮
    addDownloadButtons();

    // 监听DOM变化（处理动态加载内容）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(() => {
            addDownloadButtons();
        });
    });

    const targetNode = document.getElementById('allList');
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // 添加VIP保护提示
    const vipNotice = document.createElement('div');
    vipNotice.className = 'vip-protection-notice';
    vipNotice.innerHTML = 'VIP权益已受保护';
    document.body.appendChild(vipNotice);

    // 5秒后隐藏提示
    setTimeout(() => {
        vipNotice.style.display = 'none';
    }, 5000);
})();

(function() {
    'use strict';

    // 创建样式以修复移除工具栏后的布局
    const style = document.createElement('style');
    style.innerHTML = `
    `;
    document.head.appendChild(style);

    // 移除悬浮工具栏
    function removeSlideTool() {
        const slideTool = document.querySelector('.slide-tool.bg-white');
        if (slideTool) {
            slideTool.remove();
            console.log('悬浮工具栏已移除');

            // 显示移除通知
            showRemovalNotice();
        }
    }

    // 显示移除通知
    function showRemovalNotice() {
        const notice = document.createElement('div');
        notice.innerHTML = `
        `;

        document.body.appendChild(notice);

        // 5秒后移除通知
        setTimeout(() => {
            notice.style.opacity = '0';
            notice.style.transform = 'translateY(20px)';
            setTimeout(() => notice.remove(), 500);
        }, 5000);
    }

    // 初始尝试移除
    removeSlideTool();

    // 设置MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查是否有新增的悬浮工具栏
                const slideTool = document.querySelector('.slide-tool.bg-white');
                if (slideTool) {
                    slideTool.remove();
                    console.log('动态添加的悬浮工具栏已移除');
                }
            }
        });
    });

    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 10秒后停止观察
    setTimeout(() => {
        observer.disconnect();
        console.log('已停止观察DOM变化');
    }, 10000);
})();