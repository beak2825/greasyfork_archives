// ==UserScript==
// @name         网页图片下载
// @version      v2.1
// @description  生成一个批量下载网页图片的按钮，支持选择性下载。目前支持网站：1. 微信公众号网页 2. 微博网页 3.其他网页使用通用方法下载
// @author       nixingshiguang
// @match        http*://mp.weixin.qq.com/s*
// @match        https://m.weibo.cn/*
// @match        https://weibo.com/*
// @match        https://www.threads.com/*
// @icon         https://cftc.160621.xyz/file/8d23583061c79384c94e0.png
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @namespace https://greasyfork.org/users/943170
// @downloadURL https://update.greasyfork.org/scripts/490068/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/490068/%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 图片下载工具类
     */
    class ImageDownloader {
        constructor() {
            this.imgElements = null;
            this.formattedDate = this.getFormattedDate();
            this.downloadButton = null;
            this.selectButton = null;
            this.modal = null;
            this.selectedImages = new Set();
            this.imageData = [];
            this.init();
        }

        /**
         * 初始化
         */
        init() {
            this.createButtons();
            this.createModal();
            this.setupDownloadHandler();
        }

        /**
         * 获取格式化的日期字符串
         * @returns {string} 格式化的日期 "yyyy-mm-dd"
         */
        getFormattedDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = ('0' + (today.getMonth() + 1)).slice(-2);
            const day = ('0' + today.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        }

        /**
         * 生成随机字符串
         * @param {number} length 字符串长度
         * @returns {string} 随机字符串
         */
        generateRandomString(length = 4) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        /**
         * 创建按钮
         */
        createButtons() {
            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            Object.assign(buttonContainer.style, {
                position: 'fixed',
                top: '100px',
                right: '10px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            });

            // 创建直接下载按钮
            this.downloadButton = document.createElement('button');
            Object.assign(this.downloadButton.style, {
                borderRadius: '10px',
                padding: '10px',
                border: '0',
                color: 'black',
                backgroundColor: 'white',
                boxShadow: '0 0 5px 5px skyblue',
                opacity: '0.8',
                cursor: 'pointer',
                fontSize: '14px'
            });
            this.downloadButton.textContent = '直接下载';

            // 创建选择下载按钮
            this.selectButton = document.createElement('button');
            Object.assign(this.selectButton.style, {
                borderRadius: '10px',
                padding: '10px',
                border: '0',
                color: 'white',
                backgroundColor: '#007bff',
                boxShadow: '0 0 5px 5px rgba(0,123,255,0.3)',
                opacity: '0.8',
                cursor: 'pointer',
                fontSize: '14px'
            });
            this.selectButton.textContent = '选择下载';

            buttonContainer.appendChild(this.downloadButton);
            buttonContainer.appendChild(this.selectButton);
            document.body.appendChild(buttonContainer);

            // 绑定选择下载按钮事件
            this.selectButton.addEventListener('click', () => {
                this.showImageSelector();
            });

            console.log('添加下载按钮完成');
        }

        /**
         * 创建模态弹窗
         */
        createModal() {
            this.modal = document.createElement('div');
            this.modal.style.cssText = `
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background-color: white;
                margin: 2% auto;
                padding: 20px;
                border-radius: 10px;
                width: 90%;
                max-width: 800px;
                max-height: 90%;
                overflow-y: auto;
                position: relative;
            `;

            // 模态框标题
            const title = document.createElement('h2');
            title.textContent = '选择要下载的图片';
            title.style.cssText = `
                margin: 0 0 20px 0;
                color: #333;
                text-align: center;
            `;

            // 关闭按钮
            const closeBtn = document.createElement('span');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = `
                position: absolute;
                right: 15px;
                top: 15px;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                color: #aaa;
            `;
            closeBtn.onclick = () => this.hideModal();

            // 控制按钮区域
            const controlArea = document.createElement('div');
            controlArea.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 10px;
            `;

            // 全选按钮
            const selectAllBtn = document.createElement('button');
            selectAllBtn.textContent = '全选';
            selectAllBtn.style.cssText = `
                padding: 8px 16px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `;
            selectAllBtn.onclick = () => this.selectAll();

            // 反选按钮
            const invertBtn = document.createElement('button');
            invertBtn.textContent = '反选';
            invertBtn.style.cssText = `
                padding: 8px 16px;
                background: #ffc107;
                color: black;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `;
            invertBtn.onclick = () => this.invertSelection();

            // 选中计数
            const countLabel = document.createElement('span');
            countLabel.id = 'selectedCount';
            countLabel.style.cssText = `
                font-weight: bold;
                color: #007bff;
            `;

            controlArea.appendChild(selectAllBtn);
            controlArea.appendChild(invertBtn);
            controlArea.appendChild(countLabel);

            // 图片网格容器
            const imageGrid = document.createElement('div');
            imageGrid.id = 'imageGrid';
            imageGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            `;

            // 下载按钮区域
            const downloadArea = document.createElement('div');
            downloadArea.style.cssText = `
                text-align: center;
                border-top: 1px solid #eee;
                padding-top: 20px;
            `;

            const downloadSelectedBtn = document.createElement('button');
            downloadSelectedBtn.textContent = '下载选中图片';
            downloadSelectedBtn.style.cssText = `
                padding: 12px 24px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin-right: 10px;
            `;
            downloadSelectedBtn.onclick = () => this.downloadSelected();

            const downloadZipBtn = document.createElement('button');
            downloadZipBtn.textContent = '打包下载ZIP';
            downloadZipBtn.style.cssText = `
                padding: 12px 24px;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            `;
            downloadZipBtn.onclick = () => this.downloadAsZip();

            // 进度条
            const progressContainer = document.createElement('div');
            progressContainer.id = 'progressContainer';
            progressContainer.style.cssText = `
                display: none;
                margin-top: 20px;
            `;

            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                width: 100%;
                height: 20px;
                background-color: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
            `;

            const progressFill = document.createElement('div');
            progressFill.id = 'progressFill';
            progressFill.style.cssText = `
                height: 100%;
                background-color: #007bff;
                width: 0%;
                transition: width 0.3s ease;
            `;

            const progressText = document.createElement('div');
            progressText.id = 'progressText';
            progressText.style.cssText = `
                text-align: center;
                margin-top: 10px;
                font-weight: bold;
            `;

            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);

            downloadArea.appendChild(downloadSelectedBtn);
            downloadArea.appendChild(downloadZipBtn);
            downloadArea.appendChild(progressContainer);

            modalContent.appendChild(closeBtn);
            modalContent.appendChild(title);
            modalContent.appendChild(controlArea);
            modalContent.appendChild(imageGrid);
            modalContent.appendChild(downloadArea);

            this.modal.appendChild(modalContent);
            document.body.appendChild(this.modal);
        }

        /**
         * 通过XMLHttpRequest下载单个图片
         * @param {string} url 图片URL
         * @param {string} filename 文件名
         */
        downloadImageByXHR(url, filename = null) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const blob = xhr.response;
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    document.body.appendChild(link);

                    const blobUrl = window.URL.createObjectURL(blob);
                    link.href = blobUrl;
                    link.download = filename || `${this.formattedDate}_${this.generateRandomString()}.jpg`;
                    
                    link.click();
                    
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(link);
                }
            };

            xhr.onerror = () => {
                console.error(`下载失败: ${url}`);
            };

            xhr.send();
        }

        /**
         * 通过GM_download下载图片
         * @param {string} url 图片URL
         * @param {string} filename 文件名
         */
        downloadImageByGM(url, filename = null) {
            GM_download({
                url: url,
                name: filename || `${this.formattedDate}_${this.generateRandomString()}.jpg`
            });
        }

        /**
         * 批量下载图片（通用方法）
         * @param {NodeList} imgElements 图片元素列表
         * @param {Function} urlProcessor URL处理函数
         * @param {boolean} useXHR 是否使用XHR下载
         */
        batchDownload(imgElements, urlProcessor = null, useXHR = false) {
            console.group("图片下载脚本");
            
            const imageUrls = [];
            let count = 1;

            imgElements.forEach(img => {
                let url = img.getAttribute('data-src') || img.getAttribute('src');
                
                if (urlProcessor && typeof urlProcessor === 'function') {
                    url = urlProcessor(url);
                }

                if (url) {
                    console.log(`获取第${count}张图片链接: ${url}`);
                    imageUrls.push(url);
                    count++;
                }
            });

            console.log("开始下载，共", imageUrls.length, "张图片");
            
            imageUrls.forEach((url, index) => {
                const filename = `${this.formattedDate}_${this.generateRandomString()}.jpg`;
                
                if (useXHR) {
                    this.downloadImageByXHR(url, filename);
                } else {
                    this.downloadImageByGM(url, filename);
                }
            });

            console.log("下载任务已启动");
            console.groupEnd();
        }

        /**
         * 显示图片选择器
         */
        async showImageSelector() {
            // 显示加载提示
            this.showLoadingModal();
            
            try {
                // 先自动滚动页面加载懒加载图片
                await this.autoScrollAndLoadImages();
                
                // 获取图片数据
                await this.collectImageData();
                
                if (this.imageData.length === 0) {
                    this.hideLoadingModal();
                    alert('未找到可下载的图片');
                    return;
                }

                // 隐藏加载提示，显示选择界面
                this.hideLoadingModal();
                
                // 渲染图片网格
                this.renderImageGrid();
                
                // 显示模态框
                this.modal.style.display = 'block';
                
                // 更新选中计数
                this.updateSelectedCount();
                
            } catch (error) {
                this.hideLoadingModal();
                console.error('加载图片时出错:', error);
                alert('加载图片时出错，请重试');
            }
        }

        /**
         * 显示加载模态框
         */
        showLoadingModal() {
            // 创建加载遮罩
            this.loadingModal = document.createElement('div');
            this.loadingModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10001;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            `;

            const loadingContent = document.createElement('div');
            loadingContent.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                max-width: 400px;
            `;

            const spinner = document.createElement('div');
            spinner.style.cssText = `
                border: 4px solid #f3f3f3;
                border-top: 4px solid #007bff;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px auto;
            `;

            // 添加旋转动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);

            const loadingText = document.createElement('div');
            loadingText.id = 'loadingText';
            loadingText.style.cssText = `
                font-size: 16px;
                color: #333;
                margin-bottom: 10px;
            `;
            loadingText.textContent = '正在加载页面图片...';

            const progressText = document.createElement('div');
            progressText.id = 'loadingProgress';
            progressText.style.cssText = `
                font-size: 14px;
                color: #666;
            `;
            progressText.textContent = '请稍候，正在滚动页面加载所有图片';

            loadingContent.appendChild(spinner);
            loadingContent.appendChild(loadingText);
            loadingContent.appendChild(progressText);
            this.loadingModal.appendChild(loadingContent);
            document.body.appendChild(this.loadingModal);
        }

        /**
         * 隐藏加载模态框
         */
        hideLoadingModal() {
            if (this.loadingModal) {
                document.body.removeChild(this.loadingModal);
                this.loadingModal = null;
            }
        }

        /**
         * 自动滚动页面并加载懒加载图片
         */
        async autoScrollAndLoadImages() {
            const updateProgress = (message) => {
                const progressElement = document.getElementById('loadingProgress');
                if (progressElement) {
                    progressElement.textContent = message;
                }
            };

            // 保存当前滚动位置
            const originalScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            updateProgress('正在扫描页面高度...');
            
            // 获取页面总高度
            const getPageHeight = () => Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            let lastHeight = getPageHeight();
            let scrollPosition = 0;
            const scrollStep = window.innerHeight * 0.8; // 每次滚动80%的视窗高度
            let noNewContentCount = 0;
            const maxNoNewContentCount = 3; // 连续3次没有新内容就停止

            updateProgress('开始自动滚动加载图片...');

            while (scrollPosition < lastHeight && noNewContentCount < maxNoNewContentCount) {
                // 滚动到指定位置
                window.scrollTo(0, scrollPosition);
                
                updateProgress(`正在滚动加载... (${Math.round((scrollPosition / lastHeight) * 100)}%)`);
                
                // 等待图片加载
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // 触发懒加载
                await this.triggerLazyLoad();
                
                // 再等待一下让图片完全加载
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // 检查页面高度是否有变化
                const newHeight = getPageHeight();
                if (newHeight > lastHeight) {
                    lastHeight = newHeight;
                    noNewContentCount = 0; // 重置计数器
                } else {
                    noNewContentCount++;
                }
                
                scrollPosition += scrollStep;
            }

            updateProgress('滚动完成，正在收集图片信息...');
            
            // 最后滚动到底部确保所有内容都加载了
            window.scrollTo(0, lastHeight);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 再次触发懒加载
            await this.triggerLazyLoad();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            updateProgress('图片加载完成，正在生成选择界面...');
            
            // 恢复原始滚动位置
            window.scrollTo(0, originalScrollTop);
        }

        /**
         * 触发懒加载
         */
        async triggerLazyLoad() {
            // 触发滚动事件
            window.dispatchEvent(new Event('scroll'));
            window.dispatchEvent(new Event('resize'));
            
            // 查找所有可能的懒加载图片并尝试加载
            const lazyImages = document.querySelectorAll('img[data-src], img[data-original], img[loading="lazy"]');
            
            lazyImages.forEach(img => {
                // 模拟图片进入视窗
                if (img.dataset.src && !img.src) {
                    img.src = img.dataset.src;
                }
                if (img.dataset.original && !img.src) {
                    img.src = img.dataset.original;
                }
                
                // 触发 Intersection Observer (如果页面使用了的话)
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // 图片在视窗内，触发加载
                    img.dispatchEvent(new Event('load'));
                }
            });

            // 查找并点击可能的"加载更多"按钮
            this.findAndClickLoadMoreButtons();
        }

        /**
         * 查找并点击"加载更多"按钮
         */
        findAndClickLoadMoreButtons() {
            // 通过类名查找
            const classSelectorButtons = document.querySelectorAll('.load-more, .show-more, .btn-load-more, .more-btn, .load-btn');
            
            // 通过文本内容查找按钮和链接
            const allButtons = document.querySelectorAll('button, a');
            const textBasedButtons = Array.from(allButtons).filter(btn => {
                const text = btn.textContent.trim().toLowerCase();
                return text.includes('加载更多') || 
                       text.includes('查看更多') || 
                       text.includes('显示更多') ||
                       text.includes('load more') || 
                       text.includes('show more') ||
                       text.includes('更多');
            });
            
            // 合并所有找到的按钮
            const allLoadMoreButtons = [...classSelectorButtons, ...textBasedButtons];
            
            // 去重并点击可见的按钮
            const uniqueButtons = [...new Set(allLoadMoreButtons)];
            
            uniqueButtons.forEach(btn => {
                if (btn.offsetParent !== null && !btn.disabled) { // 确保按钮可见且未禁用
                    try {
                        btn.click();
                        console.log('点击了加载更多按钮:', btn.textContent.trim());
                    } catch (error) {
                        console.warn('点击按钮时出错:', error);
                    }
                }
            });
        }

        /**
         * 收集图片数据
         */
        async collectImageData() {
            const currentUrl = window.location.href;
            this.imageData = [];
            
            let imgElements;
            let urlProcessor = null;

            // 根据网站类型获取图片元素
            switch (true) {
                case currentUrl.includes("mp.weixin.qq.com/s"):
                    const articleElement = document.querySelector("#js_article");
                    if (articleElement) {
                        if (articleElement.classList.contains('share_content_page')) {
                            imgElements = document.querySelectorAll('.swiper_item img');
                        } else {
                            imgElements = document.querySelectorAll('#img-content img');
                        }
                    } else {
                        imgElements = document.querySelectorAll('img');
                    }
                    break;
                    
                case currentUrl.includes("https://weibo.com/"):
                    imgElements = document.querySelectorAll(".Viewer_prevItem_McSJ4 img");
                    urlProcessor = (url) => url.replace("orj360", "large");
                    break;
                    
                case currentUrl.includes("https://m.weibo.cn/"):
                    imgElements = document.querySelectorAll("img[data-v-5deaae85]");
                    urlProcessor = (url) => url.replace("orj360", "large");
                    break;
                    
                case currentUrl.includes("https://www.threads.com/"):
                    const elements = document.querySelectorAll('picture.x87ps6o');
                    this.imageData = [];
                    Array.from(elements).forEach((element, index) => {
                        try {
                            if (element.firstChild && element.firstChild.srcset) {
                                const url = element.firstChild.srcset.split(' ')[0];
                                if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                                    this.imageData.push({
                                        id: index,
                                        url: url,
                                        thumbnail: url
                                    });
                                }
                            }
                        } catch (error) {
                            console.error('处理Threads图片时出错:', error);
                        }
                    });
                    return;
                    
                default:
                    imgElements = document.querySelectorAll('img');
            }

            // 处理图片元素
            if (imgElements) {
                Array.from(imgElements).forEach((img, index) => {
                    let url = img.getAttribute('data-src') || img.getAttribute('src');
                    
                    if (urlProcessor && typeof urlProcessor === 'function') {
                        url = urlProcessor(url);
                    }

                    if (url && url.startsWith('http')) {
                        this.imageData.push({
                            id: index,
                            url: url,
                            thumbnail: img.src || url
                        });
                    }
                });
            }
        }

        /**
         * 渲染图片网格
         */
        async renderImageGrid() {
            const imageGrid = document.getElementById('imageGrid');
            imageGrid.innerHTML = '';

            // 显示加载状态
            const loadingDiv = document.createElement('div');
            loadingDiv.textContent = '正在生成图片预览...';
            loadingDiv.style.cssText = `
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 16px;
            `;
            imageGrid.appendChild(loadingDiv);

            // 预加载所有图片的缩略图
            await this.preloadThumbnails();

            // 清除加载状态
            imageGrid.innerHTML = '';

            this.imageData.forEach((imageInfo) => {
                const imageItem = document.createElement('div');
                imageItem.style.cssText = `
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `img_${imageInfo.id}`;
                checkbox.style.cssText = `
                    margin-bottom: 10px;
                    transform: scale(1.2);
                `;
                checkbox.onchange = () => this.toggleImageSelection(imageInfo.id);

                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = `
                    position: relative;
                    width: 100%;
                    height: 120px;
                    margin-bottom: 10px;
                    background: #f5f5f5;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                const img = document.createElement('img');
                img.style.cssText = `
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: cover;
                    border-radius: 5px;
                `;

                // 使用预加载的缩略图或原图
                const thumbnailUrl = imageInfo.preloadedThumbnail || imageInfo.thumbnail || imageInfo.url;
                
                if (thumbnailUrl) {
                    img.src = thumbnailUrl;
                } else {
                    // 显示占位符
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik02MCA0MEw4MCA3MEg0MEw2MCA0MFoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
                }

                img.onerror = () => {
                    // 如果缩略图加载失败，尝试加载原图
                    if (img.src !== imageInfo.url && imageInfo.url) {
                        img.src = imageInfo.url;
                    } else {
                        // 显示占位符
                        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik02MCA0MEw4MCA3MEg0MEw2MCA0MFoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
                    }
                };

                imgContainer.appendChild(img);

                const label = document.createElement('label');
                label.htmlFor = `img_${imageInfo.id}`;
                label.textContent = `图片 ${imageInfo.id + 1}`;
                label.style.cssText = `
                    display: block;
                    font-size: 12px;
                    color: #666;
                    cursor: pointer;
                `;

                // 添加图片尺寸信息
                const sizeInfo = document.createElement('div');
                sizeInfo.style.cssText = `
                    font-size: 10px;
                    color: #999;
                    margin-top: 2px;
                `;
                
                // 尝试获取图片尺寸信息
                if (imageInfo.dimensions) {
                    sizeInfo.textContent = `${imageInfo.dimensions.width}×${imageInfo.dimensions.height}`;
                } else {
                    sizeInfo.textContent = '获取尺寸中...';
                    this.getImageDimensions(imageInfo.url).then(dimensions => {
                        if (dimensions) {
                            sizeInfo.textContent = `${dimensions.width}×${dimensions.height}`;
                            imageInfo.dimensions = dimensions;
                        } else {
                            sizeInfo.textContent = '未知尺寸';
                        }
                    });
                }

                imageItem.appendChild(checkbox);
                imageItem.appendChild(imgContainer);
                imageItem.appendChild(label);
                imageItem.appendChild(sizeInfo);

                // 点击整个项目来切换选择
                imageItem.onclick = (e) => {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        this.toggleImageSelection(imageInfo.id);
                    }
                };

                imageGrid.appendChild(imageItem);
            });
        }

        /**
         * 预加载缩略图
         */
        async preloadThumbnails() {
            const updateProgress = (current, total) => {
                const progressElement = document.getElementById('loadingProgress');
                if (progressElement) {
                    progressElement.textContent = `正在预加载图片缩略图... (${current}/${total})`;
                }
            };

            const promises = this.imageData.map(async (imageInfo, index) => {
                try {
                    updateProgress(index + 1, this.imageData.length);
                    
                    // 尝试创建缩略图
                    const thumbnailUrl = await this.createThumbnail(imageInfo.url);
                    if (thumbnailUrl) {
                        imageInfo.preloadedThumbnail = thumbnailUrl;
                    }
                } catch (error) {
                    console.warn(`预加载图片 ${imageInfo.url} 失败:`, error);
                }
            });

            await Promise.all(promises);
        }

        /**
         * 创建图片缩略图
         */
        async createThumbnail(imageUrl, maxWidth = 200, maxHeight = 200) {
            return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // 计算缩略图尺寸
                        let { width, height } = img;
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        
                        if (ratio < 1) {
                            width *= ratio;
                            height *= ratio;
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // 绘制缩略图
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // 转换为 data URL
                        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
                        resolve(thumbnailUrl);
                    } catch (error) {
                        console.warn('创建缩略图失败:', error);
                        resolve(imageUrl); // 返回原图URL
                    }
                };
                
                img.onerror = () => {
                    resolve(imageUrl); // 返回原图URL
                };
                
                img.src = imageUrl;
                
                // 设置超时
                setTimeout(() => {
                    resolve(imageUrl);
                }, 5000);
            });
        }

        /**
         * 获取图片尺寸
         */
        async getImageDimensions(imageUrl) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    resolve({ width: img.naturalWidth, height: img.naturalHeight });
                };
                img.onerror = () => {
                    resolve(null);
                };
                img.src = imageUrl;
                
                // 设置超时
                setTimeout(() => {
                    resolve(null);
                }, 3000);
            });
        }

        /**
         * 切换图片选择状态
         */
        toggleImageSelection(imageId) {
            const checkbox = document.getElementById(`img_${imageId}`);
            const imageItem = checkbox.parentElement;
            
            if (checkbox.checked) {
                this.selectedImages.add(imageId);
                imageItem.style.borderColor = '#007bff';
                imageItem.style.backgroundColor = '#f8f9fa';
            } else {
                this.selectedImages.delete(imageId);
                imageItem.style.borderColor = '#ddd';
                imageItem.style.backgroundColor = 'white';
            }
            
            this.updateSelectedCount();
        }

        /**
         * 全选
         */
        selectAll() {
            this.selectedImages.clear();
            this.imageData.forEach(imageInfo => {
                this.selectedImages.add(imageInfo.id);
                const checkbox = document.getElementById(`img_${imageInfo.id}`);
                const imageItem = checkbox.parentElement;
                checkbox.checked = true;
                imageItem.style.borderColor = '#007bff';
                imageItem.style.backgroundColor = '#f8f9fa';
            });
            this.updateSelectedCount();
        }

        /**
         * 反选
         */
        invertSelection() {
            const newSelection = new Set();
            this.imageData.forEach(imageInfo => {
                const checkbox = document.getElementById(`img_${imageInfo.id}`);
                const imageItem = checkbox.parentElement;
                
                if (!this.selectedImages.has(imageInfo.id)) {
                    newSelection.add(imageInfo.id);
                    checkbox.checked = true;
                    imageItem.style.borderColor = '#007bff';
                    imageItem.style.backgroundColor = '#f8f9fa';
                } else {
                    checkbox.checked = false;
                    imageItem.style.borderColor = '#ddd';
                    imageItem.style.backgroundColor = 'white';
                }
            });
            this.selectedImages = newSelection;
            this.updateSelectedCount();
        }

        /**
         * 更新选中计数
         */
        updateSelectedCount() {
            const countLabel = document.getElementById('selectedCount');
            countLabel.textContent = `已选择 ${this.selectedImages.size} / ${this.imageData.length} 张图片`;
        }

        /**
         * 下载选中的图片
         */
        async downloadSelected() {
            if (this.selectedImages.size === 0) {
                alert('请先选择要下载的图片');
                return;
            }

            this.showProgress();
            const selectedImageData = this.imageData.filter(img => this.selectedImages.has(img.id));
            
            for (let i = 0; i < selectedImageData.length; i++) {
                const imageInfo = selectedImageData[i];
                const filename = `${this.formattedDate}_${this.generateRandomString()}.jpg`;
                
                try {
                    this.downloadImageByGM(imageInfo.url, filename);
                    this.updateProgress(i + 1, selectedImageData.length, `正在下载第 ${i + 1} 张图片...`);
                    
                    // 添加延迟避免过快下载
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (error) {
                    console.error(`下载图片失败: ${imageInfo.url}`, error);
                }
            }

            this.updateProgress(selectedImageData.length, selectedImageData.length, '下载完成！');
            setTimeout(() => {
                this.hideProgress();
                this.hideModal();
            }, 2000);
        }

        /**
         * 打包下载为ZIP
         */
        async downloadAsZip() {
            if (this.selectedImages.size === 0) {
                alert('请先选择要下载的图片');
                return;
            }

            if (typeof JSZip === 'undefined') {
                alert('ZIP功能不可用，请使用普通下载');
                return;
            }

            this.showProgress();
            const zip = new JSZip();
            const selectedImageData = this.imageData.filter(img => this.selectedImages.has(img.id));
            
            for (let i = 0; i < selectedImageData.length; i++) {
                const imageInfo = selectedImageData[i];
                const filename = `image_${i + 1}_${this.generateRandomString()}.jpg`;
                
                try {
                    this.updateProgress(i + 1, selectedImageData.length, `正在处理第 ${i + 1} 张图片...`);
                    
                    const response = await fetch(imageInfo.url);
                    const blob = await response.blob();
                    zip.file(filename, blob);
                    
                } catch (error) {
                    console.error(`处理图片失败: ${imageInfo.url}`, error);
                }
            }

            this.updateProgress(selectedImageData.length, selectedImageData.length, '正在生成ZIP文件...');
            
            try {
                const zipBlob = await zip.generateAsync({type: 'blob'});
                const link = document.createElement('a');
                link.href = URL.createObjectURL(zipBlob);
                link.download = `images_${this.formattedDate}.zip`;
                link.click();
                
                this.updateProgress(selectedImageData.length, selectedImageData.length, 'ZIP文件下载完成！');
            } catch (error) {
                console.error('生成ZIP文件失败:', error);
                alert('生成ZIP文件失败，请使用普通下载');
            }

            setTimeout(() => {
                this.hideProgress();
                this.hideModal();
            }, 2000);
        }

        /**
         * 显示进度条
         */
        showProgress() {
            const progressContainer = document.getElementById('progressContainer');
            progressContainer.style.display = 'block';
        }

        /**
         * 隐藏进度条
         */
        hideProgress() {
            const progressContainer = document.getElementById('progressContainer');
            progressContainer.style.display = 'none';
        }

        /**
         * 更新进度
         */
        updateProgress(current, total, message) {
            const progressFill = document.getElementById('progressFill');
            const progressText = document.getElementById('progressText');
            
            const percentage = Math.round((current / total) * 100);
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${message} (${current}/${total})`;
        }

        /**
         * 隐藏模态框
         */
        hideModal() {
            this.modal.style.display = 'none';
            this.selectedImages.clear();
        }

        /**
         * 添加按钮点击事件监听器
         * @param {Function} handler 点击处理函数
         */
        addClickListener(handler) {
            this.downloadButton.addEventListener('click', handler);
        }

        /**
         * 根据当前网站设置下载处理器
         */
        setupDownloadHandler() {
            const currentUrl = window.location.href;

            switch (true) {
                case currentUrl.includes("mp.weixin.qq.com/s"):
                    this.setupWeixinHandler();
                    break;
                case currentUrl.includes("https://weibo.com/"):
                    this.setupWeiboHandler();
                    break;
                case currentUrl.includes("https://m.weibo.cn/"):
                    this.setupWeiboMobileHandler();
                    break;
                case currentUrl.includes("https://www.threads.com/"):
                    this.setupThreadsHandler();
                    break;
                default:
                    this.setupUniversalHandler();
            }
        }

        /**
         * 微信公众号处理器
         */
        setupWeixinHandler() {
            // 移除二维码
            const qrCode = document.getElementById('js_pc_qr_code');
            if (qrCode) {
                qrCode.remove();
            }

            this.addClickListener(() => {
                const articleElement = document.querySelector("#js_article");
                
                if (articleElement) {
                    if (articleElement.classList.contains('share_content_page')) {
                        this.imgElements = document.querySelectorAll('.swiper_item img');
                    } else {
                        this.imgElements = document.querySelectorAll('#img-content img');
                    }
                } else {
                    this.imgElements = document.querySelectorAll('img');
                }

                this.batchDownload(this.imgElements);
            });
        }

        /**
         * 微博处理器
         */
        setupWeiboHandler() {
            this.addClickListener(() => {
                console.clear();
                console.group("微博图片下载");
                
                this.imgElements = document.querySelectorAll(".Viewer_prevItem_McSJ4 img");
                
                // URL处理函数：替换为大图
                const urlProcessor = (url) => url.replace("orj360", "large");
                
                this.batchDownload(this.imgElements, urlProcessor, true);
                console.groupEnd();
            });
        }

        /**
         * 微博手机版处理器
         */
        setupWeiboMobileHandler() {
            this.addClickListener(() => {
                console.clear();
                console.group("微博手机版图片下载");
                
                this.imgElements = document.querySelectorAll("img[data-v-5deaae85]");
                
                // URL处理函数：替换为大图
                const urlProcessor = (url) => url.replace("orj360", "large");
                
                this.batchDownload(this.imgElements, urlProcessor, true);
                console.groupEnd();
            });
        }

        /**
         * Threads处理器
         */
        setupThreadsHandler() {
            this.addClickListener(() => {
                console.clear();
                console.group("Threads图片下载");
                
                const elements = document.querySelectorAll('picture.x87ps6o');
                const imageUrls = [];

                Array.from(elements).forEach(element => {
                    try {
                        if (element.firstChild && element.firstChild.srcset) {
                            const url = element.firstChild.srcset.split(' ')[0];
                            
                            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                                imageUrls.push(url);
                                console.log(`已获取图片URL: ${url}`);
                            } else {
                                console.warn(`无效的图片URL: ${url}`);
                            }
                        }
                    } catch (error) {
                        console.error('处理元素时出错:', error);
                    }
                });

                // 下载所有图片
                imageUrls.forEach(url => {
                    this.downloadImageByXHR(url, `${this.formattedDate}_${this.generateRandomString()}.jpg`);
                });

                console.log(`开始下载 ${imageUrls.length} 张图片`);
                console.groupEnd();
            });
        }

        /**
         * 通用处理器
         */
        setupUniversalHandler() {
            this.addClickListener(() => {
                this.imgElements = document.querySelectorAll('img');
                this.batchDownload(this.imgElements);
            });
        }
    }

    /**
     * 页面加载完成后初始化
     */
    window.addEventListener('load', () => {
        new ImageDownloader();
    });

})();