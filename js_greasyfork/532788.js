// ==UserScript==
// @name         强大图片提取和批量下载工具
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  适用于大多数网站的图片提取和批量下载工具，轻松抓取精准限制、无法直接保存的图片
// @author       shenfangda
// @match        *://*/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/532788/%E5%BC%BA%E5%A4%A7%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96%E5%92%8C%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/532788/%E5%BC%BA%E5%A4%A7%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96%E5%92%8C%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        // 默认设置
        defaultSettings: {
            autoFindLarger: true,
            minWidth: 200,
            minHeight: 200,
            maxSize: 100, // MB
            formatFilter: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            qualityThreshold: 0.5,
            customRules: []
        },
        // 特殊网站规则
        siteRules: {
            '588ku.com': { // 千库网
                selector: 'img[src*="588ku.com"]',
                exclude: ['.icon', '.logo'],
                replacePattern: [/!.*,/g, '']
            },
            'ibaotu.com': { // 包图网
                selector: 'img[src*="ibaotu.com"]',
                exclude: ['.icon', '.logo'],
                replacePattern: [/!.*,/g, '']
            },
            'doc88.com': { // 道客巴巴
                selector: 'img[src*="doc88.com"]',
                exclude: ['.icon', '.logo'],
                replacePattern: [/_thumb\.jpg/g, '.jpg']
            },
            'docin.com': { // 豆丁网
                selector: 'img[src*="docin.com"]',
                exclude: ['.icon', '.logo'],
                replacePattern: [/_thumb\.jpg/g, '.jpg']
            }
        }
    };

    // 主要功能类
    class ImageExtractor {
        constructor() {
            this.images = [];
            this.settings = {...config.defaultSettings};
            this.init();
        }

        init() {
            console.log('图片提取工具已启动');
            this.createUI();
            this.bindEvents();
        }

        // 创建用户界面
        createUI() {
            GM_addStyle(`
                #image-extractor-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 350px;
                    max-height: 80vh;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    overflow: hidden;
                    display: none;
                }
                
                #image-extractor-panel-header {
                    background: #4a90e2;
                    color: white;
                    padding: 10px 15px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #image-extractor-panel-title {
                    font-weight: bold;
                    font-size: 16px;
                }
                
                #image-extractor-panel-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                }
                
                #image-extractor-panel-content {
                    padding: 15px;
                    overflow-y: auto;
                    max-height: calc(80vh - 50px);
                }
                
                .image-extractor-section {
                    margin-bottom: 15px;
                }
                
                .image-extractor-section-title {
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: #333;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 4px;
                }
                
                #image-extractor-images-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin-top: 10px;
                }
                
                .image-extractor-image-item {
                    position: relative;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                }
                
                .image-extractor-image-item img {
                    width: 100%;
                    height: 80px;
                    object-fit: cover;
                    display: block;
                }
                
                .image-extractor-image-item.selected {
                    border-color: #4a90e2;
                    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
                }
                
                .image-extractor-image-info {
                    padding: 5px;
                    font-size: 12px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }
                
                .image-extractor-controls {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 10px;
                }
                
                .image-extractor-btn {
                    padding: 8px 12px;
                    background: #4a90e2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    flex: 1;
                    min-width: 100px;
                }
                
                .image-extractor-btn:hover {
                    background: #357ae8;
                }
                
                .image-extractor-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .image-extractor-btn.secondary {
                    background: #f0f0f0;
                    color: #333;
                }
                
                .image-extractor-btn.secondary:hover {
                    background: #e0e0e0;
                }
                
                .image-extractor-progress {
                    height: 6px;
                    background: #f0f0f0;
                    border-radius: 3px;
                    margin: 10px 0;
                    overflow: hidden;
                    display: none;
                }
                
                .image-extractor-progress-bar {
                    height: 100%;
                    background: #4a90e2;
                    width: 0%;
                    transition: width 0.3s;
                }
                
                .image-extractor-stats {
                    font-size: 13px;
                    color: #666;
                    margin: 10px 0;
                }
                
                .image-extractor-settings {
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 4px;
                    margin-top: 10px;
                }
                
                .image-extractor-setting-item {
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                }
                
                .image-extractor-setting-item label {
                    flex: 1;
                    font-size: 13px;
                }
                
                .image-extractor-setting-item input {
                    width: 60px;
                }
                
                #image-extractor-toggle-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    background: #4a90e2;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    cursor: pointer;
                    z-index: 9999;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #image-extractor-notification {
                    position: fixed;
                    top: 20px;
                    right: 70px;
                    background: #4a90e2;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 10001;
                    display: none;
                }
            `);

            // 创建主面板
            const panel = document.createElement('div');
            panel.id = 'image-extractor-panel';
            
            panel.innerHTML = `
                <div id="image-extractor-panel-header">
                    <div id="image-extractor-panel-title">图片提取工具</div>
                    <button id="image-extractor-panel-close">×</button>
                </div>
                <div id="image-extractor-panel-content">
                    <div class="image-extractor-section">
                        <div class="image-extractor-section-title">操作</div>
                        <div class="image-extractor-controls">
                            <button id="image-extractor-scan-btn" class="image-extractor-btn">扫描图片</button>
                            <button id="image-extractor-select-all-btn" class="image-extractor-btn secondary">全选</button>
                            <button id="image-extractor-deselect-all-btn" class="image-extractor-btn secondary">取消</button>
                        </div>
                    </div>
                    
                    <div class="image-extractor-section">
                        <div class="image-extractor-section-title">统计信息</div>
                        <div id="image-extractor-stats" class="image-extractor-stats">
                            未扫描图片
                        </div>
                    </div>
                    
                    <div class="image-extractor-section">
                        <div class="image-extractor-section-title">图片预览</div>
                        <div id="image-extractor-images-container">
                            <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #999;">
                                点击"扫描图片"开始查找页面中的图片
                            </div>
                        </div>
                    </div>
                    
                    <div class="image-extractor-section">
                        <div class="image-extractor-section-title">下载选项</div>
                        <div class="image-extractor-controls">
                            <button id="image-extractor-download-selected-btn" class="image-extractor-btn" disabled>下载选中</button>
                            <button id="image-extractor-download-zip-btn" class="image-extractor-btn" disabled>打包下载</button>
                        </div>
                    </div>
                    
                    <div class="image-extractor-progress">
                        <div class="image-extractor-progress-bar"></div>
                    </div>
                    
                    <div class="image-extractor-section">
                        <div class="image-extractor-section-title">设置</div>
                        <div class="image-extractor-settings">
                            <div class="image-extractor-setting-item">
                                <label>最小宽度:</label>
                                <input type="number" id="setting-min-width" value="${this.settings.minWidth}" min="50">
                            </div>
                            <div class="image-extractor-setting-item">
                                <label>最小高度:</label>
                                <input type="number" id="setting-min-height" value="${this.settings.minHeight}" min="50">
                            </div>
                            <div class="image-extractor-setting-item">
                                <label>自动查找大图:</label>
                                <input type="checkbox" id="setting-auto-find" ${this.settings.autoFindLarger ? 'checked' : ''}>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // 创建切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'image-extractor-toggle-btn';
            toggleBtn.innerHTML = '🖼️';
            document.body.appendChild(toggleBtn);
            
            // 创建通知元素
            const notification = document.createElement('div');
            notification.id = 'image-extractor-notification';
            document.body.appendChild(notification);
        }

        // 绑定事件
        bindEvents() {
            // 切换面板显示
            document.getElementById('image-extractor-toggle-btn').addEventListener('click', () => {
                const panel = document.getElementById('image-extractor-panel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            });
            
            // 关闭面板
            document.getElementById('image-extractor-panel-close').addEventListener('click', () => {
                document.getElementById('image-extractor-panel').style.display = 'none';
            });
            
            // 拖拽面板
            this.makeDraggable(document.getElementById('image-extractor-panel-header'), document.getElementById('image-extractor-panel'));
            
            // 扫描图片
            document.getElementById('image-extractor-scan-btn').addEventListener('click', () => {
                this.scanImages();
            });
            
            // 全选
            document.getElementById('image-extractor-select-all-btn').addEventListener('click', () => {
                this.selectAllImages();
            });
            
            // 取消全选
            document.getElementById('image-extractor-deselect-all-btn').addEventListener('click', () => {
                this.deselectAllImages();
            });
            
            // 下载选中
            document.getElementById('image-extractor-download-selected-btn').addEventListener('click', () => {
                this.downloadSelectedImages();
            });
            
            // 打包下载
            document.getElementById('image-extractor-download-zip-btn').addEventListener('click', () => {
                this.downloadAsZip();
            });
            
            // 设置变更
            document.getElementById('setting-min-width').addEventListener('change', (e) => {
                this.settings.minWidth = parseInt(e.target.value) || 200;
            });
            
            document.getElementById('setting-min-height').addEventListener('change', (e) => {
                this.settings.minHeight = parseInt(e.target.value) || 200;
            });
            
            document.getElementById('setting-auto-find').addEventListener('change', (e) => {
                this.settings.autoFindLarger = e.target.checked;
            });
        }

        // 使面板可拖拽
        makeDraggable(header, panel) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            header.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // 获取鼠标位置
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // 计算新位置
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // 设置元素新位置
                panel.style.top = (panel.offsetTop - pos2) + "px";
                panel.style.left = (panel.offsetLeft - pos1) + "px";
            }
            
            function closeDragElement() {
                // 停止移动
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // 扫描页面中的图片
        scanImages() {
            this.showNotification('正在扫描图片...');
            this.images = [];
            
            // 获取当前网站规则
            const hostname = window.location.hostname;
            let rule = null;
            for (const site in config.siteRules) {
                if (hostname.includes(site)) {
                    rule = config.siteRules[site];
                    break;
                }
            }
            
            // 查找所有图片元素
            const imgElements = document.querySelectorAll('img');
            const bgImages = this.extractBackgroundImages();
            const canvasImages = this.extractCanvasImages();
            
            // 合并所有图片
            const allImages = [...imgElements, ...bgImages, ...canvasImages];
            
            // 处理图片
            allImages.forEach((img, index) => {
                try {
                    let src = '';
                    let width = 0;
                    let height = 0;
                    
                    if (img.tagName === 'IMG') {
                        src = img.src || img.dataset.src || '';
                        width = img.naturalWidth || img.width || 0;
                        height = img.naturalHeight || img.height || 0;
                    } else if (img.type === 'background') {
                        src = img.src;
                        width = img.width || 0;
                        height = img.height || 0;
                    } else if (img.type === 'canvas') {
                        src = img.src;
                        width = img.width || 0;
                        height = img.height || 0;
                    }
                    
                    // 应用规则处理
                    if (rule && rule.replacePattern) {
                        rule.replacePattern.forEach(pattern => {
                            src = src.replace(pattern, '');
                        });
                    }
                    
                    // 过滤条件
                    if (!src || src.startsWith('data:')) return;
                    if (width < this.settings.minWidth || height < this.settings.minHeight) return;
                    
                    this.images.push({
                        id: index,
                        src: src,
                        width: width,
                        height: height,
                        element: img,
                        selected: false
                    });
                } catch (e) {
                    console.warn('处理图片时出错:', e);
                }
            });
            
            // 去重
            const uniqueImages = [];
            const seenUrls = new Set();
            
            this.images.forEach(img => {
                if (!seenUrls.has(img.src)) {
                    seenUrls.add(img.src);
                    uniqueImages.push(img);
                }
            });
            
            this.images = uniqueImages;
            
            // 更新UI
            this.updateImageList();
            this.updateStats();
            this.showNotification(`找到 ${this.images.length} 张图片`);
        }

        // 提取背景图片
        extractBackgroundImages() {
            const bgImages = [];
            const elements = document.querySelectorAll('*');
            
            elements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                const bgImage = computedStyle.backgroundImage;
                
                if (bgImage && bgImage !== 'none') {
                    // 提取URL
                    const urlMatch = bgImage.match(/url\(["']?(.*?)["']?\)/);
                    if (urlMatch && urlMatch[1]) {
                        const img = new Image();
                        img.src = urlMatch[1];
                        img.type = 'background';
                        
                        // 获取元素尺寸作为图片尺寸
                        const rect = el.getBoundingClientRect();
                        img.width = rect.width;
                        img.height = rect.height;
                        
                        bgImages.push(img);
                    }
                }
            });
            
            return bgImages;
        }

        // 提取Canvas图片
        extractCanvasImages() {
            const canvasImages = [];
            const canvases = document.querySelectorAll('canvas');
            
            canvases.forEach(canvas => {
                try {
                    const dataURL = canvas.toDataURL('image/png');
                    const img = new Image();
                    img.src = dataURL;
                    img.type = 'canvas';
                    
                    // 获取Canvas尺寸
                    img.width = canvas.width;
                    img.height = canvas.height;
                    
                    canvasImages.push(img);
                } catch (e) {
                    // 跨域Canvas无法提取
                    console.warn('无法提取Canvas图片:', e);
                }
            });
            
            return canvasImages;
        }

        // 更新图片列表
        updateImageList() {
            const container = document.getElementById('image-extractor-images-container');
            container.innerHTML = '';
            
            if (this.images.length === 0) {
                container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #999;">未找到符合条件的图片</div>';
                return;
            }
            
            this.images.forEach(img => {
                const item = document.createElement('div');
                item.className = 'image-extractor-image-item';
                item.dataset.id = img.id;
                
                item.innerHTML = `
                    <img src="${img.src}" onerror="this.parentElement.innerHTML='<div style=\'width:100%;height:80px;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;\'>图片加载失败</div>'">
                    <div class="image-extractor-image-info">${img.width}×${img.height}</div>
                `;
                
                if (img.selected) {
                    item.classList.add('selected');
                }
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleImageSelection(img.id);
                });
                
                container.appendChild(item);
            });
            
            // 更新按钮状态
            document.getElementById('image-extractor-download-selected-btn').disabled = this.images.filter(i => i.selected).length === 0;
            document.getElementById('image-extractor-download-zip-btn').disabled = this.images.length === 0;
        }

        // 切换图片选择状态
        toggleImageSelection(id) {
            const img = this.images.find(i => i.id === id);
            if (img) {
                img.selected = !img.selected;
                const item = document.querySelector(`.image-extractor-image-item[data-id="${id}"]`);
                if (item) {
                    if (img.selected) {
                        item.classList.add('selected');
                    } else {
                        item.classList.remove('selected');
                    }
                }
                
                // 更新按钮状态
                document.getElementById('image-extractor-download-selected-btn').disabled = this.images.filter(i => i.selected).length === 0;
            }
        }

        // 全选图片
        selectAllImages() {
            this.images.forEach(img => {
                img.selected = true;
            });
            this.updateImageList();
        }

        // 取消全选图片
        deselectAllImages() {
            this.images.forEach(img => {
                img.selected = false;
            });
            this.updateImageList();
        }

        // 更新统计信息
        updateStats() {
            const selectedCount = this.images.filter(i => i.selected).length;
            const stats = document.getElementById('image-extractor-stats');
            stats.textContent = `共找到 ${this.images.length} 张图片，已选择 ${selectedCount} 张`;
        }

        // 下载选中图片
        async downloadSelectedImages() {
            const selectedImages = this.images.filter(i => i.selected);
            if (selectedImages.length === 0) {
                this.showNotification('请先选择要下载的图片');
                return;
            }
            
            this.showProgress(0);
            
            for (let i = 0; i < selectedImages.length; i++) {
                const img = selectedImages[i];
                try {
                    await this.downloadImage(img.src, `image_${i + 1}.jpg`);
                    this.showProgress(((i + 1) / selectedImages.length) * 100);
                } catch (e) {
                    console.error('下载图片失败:', e);
                }
            }
            
            this.hideProgress();
            this.showNotification(`下载完成，共下载 ${selectedImages.length} 张图片`);
        }

        // 打包下载为ZIP
        async downloadAsZip() {
            if (this.images.length === 0) {
                this.showNotification('没有图片可以下载');
                return;
            }
            
            this.showProgress(0);
            
            try {
                const zip = new JSZip();
                const imgFolder = zip.folder("images");
                const selectedImages = this.images.filter(i => i.selected).length > 0 ? 
                                      this.images.filter(i => i.selected) : this.images;
                
                for (let i = 0; i < selectedImages.length; i++) {
                    const img = selectedImages[i];
                    try {
                        const blob = await this.fetchImageAsBlob(img.src);
                        const extension = this.getImageExtension(img.src);
                        imgFolder.file(`image_${i + 1}.${extension}`, blob);
                        this.showProgress(((i + 1) / selectedImages.length) * 100);
                    } catch (e) {
                        console.error('添加图片到ZIP失败:', e);
                    }
                }
                
                const content = await zip.generateAsync({type: "blob"});
                saveAs(content, `images_${new Date().getTime()}.zip`);
                
                this.hideProgress();
                this.showNotification(`ZIP打包完成，共包含 ${selectedImages.length} 张图片`);
            } catch (e) {
                this.hideProgress();
                this.showNotification('打包下载失败: ' + e.message);
                console.error('ZIP打包失败:', e);
            }
        }

        // 下载单张图片
        downloadImage(url, filename) {
            return new Promise((resolve, reject) => {
                GM_download({
                    url: url,
                    name: filename,
                    onload: () => resolve(),
                    onerror: (error) => reject(error)
                });
            });
        }

        // 获取图片Blob
        fetchImageAsBlob(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function(response) {
                        resolve(response.response);
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        // 获取图片扩展名
        getImageExtension(url) {
            const match = url.match(/\.([^.]+)(\?.*)?$/);
            return match ? match[1].toLowerCase() : 'jpg';
        }

        // 显示进度条
        showProgress(percent) {
            const progress = document.querySelector('.image-extractor-progress');
            const bar = document.querySelector('.image-extractor-progress-bar');
            progress.style.display = 'block';
            bar.style.width = percent + '%';
        }

        // 隐藏进度条
        hideProgress() {
            const progress = document.querySelector('.image-extractor-progress');
            progress.style.display = 'none';
        }

        // 显示通知
        showNotification(message) {
            const notification = document.getElementById('image-extractor-notification');
            notification.textContent = message;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // 初始化插件
    new ImageExtractor();
})();