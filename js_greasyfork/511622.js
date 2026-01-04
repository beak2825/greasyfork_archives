// ==UserScript==
// @name         Linux.do 下崽器 (新版)
// @namespace    http://linux.do/
// @version      2.0.0
// @description  备份你珍贵的水贴为Markdown，包含图片下载，可拖拽调整按钮位置。
// @author       PastKing
// @match        https://www.linux.do/t/topic/*
// @match        https://linux.do/t/topic/*
// @license      MIT
// @icon         https://cdn.linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_32x32.png
// @grant        none
// @require      https://unpkg.com/turndown@7.1.3/dist/turndown.js
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/511622/Linuxdo%20%E4%B8%8B%E5%B4%BD%E5%99%A8%20%28%E6%96%B0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511622/Linuxdo%20%E4%B8%8B%E5%B4%BD%E5%99%A8%20%28%E6%96%B0%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let isMouseDown = false;

    // 创建并插入下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            下载为压缩包
        `;
        button.style.cssText = `
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            color: #ffffff;
            background: linear-gradient(135deg, #0088cc 0%, #0099dd 100%);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3);
            position: fixed;
            z-index: 9999;
            display: flex;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            user-select: none;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;

        // 添加悬停效果
        button.onmouseover = function() {
            this.style.background = 'linear-gradient(135deg, #0077bb 0%, #0088cc 100%)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 20px rgba(0, 136, 204, 0.4)';
        };
        button.onmouseout = function() {
            this.style.background = 'linear-gradient(135deg, #0088cc 0%, #0099dd 100%)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 136, 204, 0.3)';
        };

        // 添加点击效果
        button.onmousedown = function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        };
        button.onmouseup = function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        };

        // 从localStorage获取保存的位置
        const savedPosition = JSON.parse(localStorage.getItem('downloadButtonPosition'));
        if (savedPosition) {
            button.style.left = savedPosition.left;
            button.style.top = savedPosition.top;
        } else {
            button.style.right = '20px';
            button.style.bottom = '20px';
        }

        document.body.appendChild(button);

        return button;
    }

    // 创建进度提示组件
    function createProgressToast(message) {
        // 移除已存在的提示
        const existingToast = document.getElementById('download-progress-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'download-progress-toast';
        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid #ffffff;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 10px;
                "></div>
                <span style="color: #ffffff; font-weight: 500;">${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0088cc 0%, #0099dd 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 6px 20px rgba(0, 136, 204, 0.4);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        return toast;
    }

    // 移除进度提示
    function removeProgressToast() {
        const toast = document.getElementById('download-progress-toast');
        if (toast) {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }

    // 显示成功提示
    function showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 10px; color: #ffffff;">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span style="color: #ffffff; font-weight: 500;">${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // 添加拖拽功能
    function makeDraggable(element) {
        let startX, startY, startLeft, startTop;

        element.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            isMouseDown = true;
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left) || window.innerWidth - parseInt(element.style.right) - element.offsetWidth;
            startTop = parseInt(element.style.top) || window.innerHeight - parseInt(element.style.bottom) - element.offsetHeight;
            e.preventDefault();
        }

        function drag(e) {
            if (!isMouseDown) return;
            isDragging = true;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = `${startLeft + dx}px`;
            element.style.top = `${startTop + dy}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }

        function stopDragging() {
            if (isMouseDown && isDragging) {
                localStorage.setItem('downloadButtonPosition', JSON.stringify({
                    left: element.style.left,
                    top: element.style.top
                }));
            }
            isMouseDown = false;
            setTimeout(() => {
                isDragging = false;
            }, 10);
        }
    }

    // 下载图片
    async function downloadImage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }
            return await response.blob();
        } catch (error) {
            console.warn(`下载图片失败: ${url}`, error);
            return null;
        }
    }

    // 获取文件扩展名
    function getFileExtension(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const lastDot = pathname.lastIndexOf('.');
            if (lastDot !== -1) {
                return pathname.slice(lastDot);
            }
        } catch (e) {
            // 忽略URL解析错误
        }
        return '.jpg'; // 默认扩展名
    }

    // 生成安全的文件名
    function generateSafeFileName(originalName, index) {
        // 移除特殊字符
        const safeName = originalName.replace(/[<>:"/\\|?*]/g, '_');
        return `image_${index}_${safeName}`;
    }

    // 提取所有图片URL
    function extractImageUrls(htmlContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const images = tempDiv.querySelectorAll('img');
        const imageUrls = [];

        images.forEach((img, index) => {
            const src = img.getAttribute('src');
            if (src) {
                // 处理相对URL
                const absoluteUrl = new URL(src, window.location.href).href;
                const alt = img.getAttribute('alt') || `image_${index}`;
                const extension = getFileExtension(absoluteUrl);
                const fileName = generateSafeFileName(alt + extension, index);

                imageUrls.push({
                    originalUrl: src,
                    absoluteUrl: absoluteUrl,
                    fileName: fileName,
                    alt: alt
                });
            }
        });

        return imageUrls;
    }

    // 获取文章内容
    function getArticleContent() {
        const titleElement = document.querySelector('#topic-title > div > h1');
        const contentElement = document.querySelector('#post_1 > div.row > div.topic-body.clearfix > div.regular.contents > div.cooked');

        if (!titleElement) {
            console.error('无法找到文章标题');
            return null;
        }

        if (!contentElement) {
            console.error('无法找到文章内容');
            return null;
        }

        return {
            title: titleElement.textContent.trim(),
            content: contentElement.innerHTML
        };
    }

    // 转换为Markdown并下载（包含图片）
    async function downloadAsMarkdown() {
        const article = getArticleContent();
        if (!article) {
            alert('无法获取文章内容，请检查网页结构是否变更。');
            return;
        }

        const button = document.querySelector('button');
        const originalButtonHTML = button.innerHTML;

        // 禁用按钮并显示加载状态
        button.disabled = true;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';

        try {
            // 提取所有图片URL
            const imageUrls = extractImageUrls(article.content);

            let toast = createProgressToast('准备下载...');

            // 创建ZIP文件
            const zip = new JSZip();
            const imagesFolder = zip.folder("images");

            // 下载所有图片
            const imageDownloadPromises = imageUrls.map(async (imageInfo, index) => {
                toast.querySelector('span').textContent = `下载图片 ${index + 1}/${imageUrls.length}...`;
                const imageBlob = await downloadImage(imageInfo.absoluteUrl);
                if (imageBlob) {
                    imagesFolder.file(imageInfo.fileName, imageBlob);
                    return {
                        ...imageInfo,
                        downloaded: true
                    };
                }
                return {
                    ...imageInfo,
                    downloaded: false
                };
            });

            const downloadedImages = await Promise.all(imageDownloadPromises);

            // 创建图片映射
            const imageMap = new Map();
            downloadedImages.forEach(img => {
                if (img.downloaded) {
                    imageMap.set(img.originalUrl, `images/${img.fileName}`);
                }
            });

            toast.querySelector('span').textContent = '生成Markdown...';

            // 配置TurndownService
            const turndownService = new TurndownService({
                headingStyle: 'atx',
                codeBlockStyle: 'fenced'
            });

            // 自定义规则处理代码块
            turndownService.addRule('codeBlocks', {
                filter: function (node) {
                    return node.nodeName === 'PRE' && node.querySelector('code');
                },
                replacement: function (content, node) {
                    const codeElement = node.querySelector('code');
                    const codeContent = codeElement ? codeElement.textContent : node.textContent;
                    const language = codeElement ? (codeElement.className.match(/language-(\w+)/) || ['', ''])[1] : '';
                    return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n`;
                }
            });

            // 处理单独的code标签
            turndownService.addRule('standaloneCode', {
                filter: function (node) {
                    return node.nodeName === 'CODE' &&
                           node.parentNode &&
                           node.parentNode.nodeName !== 'PRE' &&
                           (node.textContent.includes('\n') || node.textContent.length > 50);
                },
                replacement: function (content, node) {
                    const codeContent = node.textContent;
                    const language = (node.className.match(/language-(\w+)/) || ['', ''])[1];
                    return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n`;
                }
            });

            // 自定义规则处理图片和链接
            turndownService.addRule('images_and_links', {
                filter: ['a', 'img'],
                replacement: function (content, node) {
                    // 处理图片
                    if (node.nodeName === 'IMG') {
                        const alt = node.alt || '';
                        const src = node.getAttribute('src') || '';
                        const title = node.title ? ` "${node.title}"` : '';

                        // 使用本地路径（如果图片已下载）
                        const localPath = imageMap.get(src) || src;
                        return `![${alt}](${localPath}${title})`;
                    }
                    // 处理链接
                    else if (node.nodeName === 'A') {
                        const href = node.getAttribute('href');
                        const title = node.title ? ` "${node.title}"` : '';
                        // 检查链接是否包含图片
                        const img = node.querySelector('img');
                        if (img) {
                            const alt = img.alt || '';
                            const src = img.getAttribute('src') || '';
                            const imgTitle = img.title ? ` "${img.title}"` : '';
                            const localPath = imageMap.get(src) || src;
                            return `[![${alt}](${localPath}${imgTitle})](${href}${title})`;
                        }
                        // 普通链接
                        return `[${node.textContent}](${href}${title})`;
                    }
                }
            });

            const markdown = `# ${article.title}\n\n${turndownService.turndown(article.content)}`;

            // 添加Markdown文件到ZIP
            zip.file(`${article.title}.md`, markdown);

            toast.querySelector('span').textContent = '生成压缩包...';
            const zipBlob = await zip.generateAsync({type: "blob"});

            // 下载ZIP文件
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${article.title}.zip`;
            a.click();
            URL.revokeObjectURL(url);

            // 移除进度提示
            removeProgressToast();

            // 显示成功消息
            const downloadedCount = downloadedImages.filter(img => img.downloaded).length;
            const totalCount = imageUrls.length;
            showSuccessToast(`下载完成！成功下载图片: ${downloadedCount}/${totalCount}`);

        } catch (error) {
            console.error('下载过程中出现错误:', error);
            removeProgressToast();
            alert('下载过程中出现错误，请查看控制台了解详情。');
        } finally {
            // 恢复按钮状态
            button.innerHTML = originalButtonHTML;
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }

    // 主函数
    function main() {
        const downloadButton = createDownloadButton();
        makeDraggable(downloadButton);
        downloadButton.addEventListener('click', function(e) {
            if (!isDragging) {
                downloadAsMarkdown();
            }
        });

        // 监听DOM变化，确保按钮始终存在
        const observer = new MutationObserver(function(mutations) {
            if (!document.body.contains(downloadButton)) {
                document.body.appendChild(downloadButton);
            }
        });

        // 观察document.body的子节点变化
        observer.observe(document.body, { childList: true, subtree: true });

        // 处理页面可见性变化
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible' && !document.body.contains(downloadButton)) {
                document.body.appendChild(downloadButton);
            }
        });
    }

    // 运行主函数
    main();
})();