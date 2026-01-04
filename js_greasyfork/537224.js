// ==UserScript==
// @name         Nodeloc文章下载器
// @namespace    http://www.nodeloc.com/
// @version      1.0.1
// @description  备份你珍贵的水贴为Markdown，包含图片下载，可拖拽调整按钮位置。
// @author       PastKing
// @match        https://www.nodeloc.com/t/topic/*
// @match        https://nodeloc.cc/t/topic/*
// @license      MIT
// @icon         https://www.nodeloc.com/uploads/default/original/1X/8ab9e33c8eed4135d9f2b8af6e6b7cc16ec4228e.png
// @grant        none
// @require      https://unpkg.com/turndown@7.1.3/dist/turndown.js
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/537224/Nodeloc%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537224/Nodeloc%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
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
            background: linear-gradient(135deg, #0f9f6f 0%, #16d085 100%);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 16px rgba(15, 159, 111, 0.35);
            position: fixed;
            z-index: 9999;
            display: flex;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            user-select: none;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        `;

        // 添加悬停效果
        button.onmouseover = function() {
            this.style.background = 'linear-gradient(135deg, #0d8a5f 0%, #13bd77 100%)';
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(15, 159, 111, 0.45)';
        };
        button.onmouseout = function() {
            this.style.background = 'linear-gradient(135deg, #0f9f6f 0%, #16d085 100%)';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 16px rgba(15, 159, 111, 0.35)';
        };

        // 添加点击效果
        button.onmousedown = function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        };
        button.onmouseup = function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        };

        // 从localStorage获取保存的位置
        const savedPosition = JSON.parse(localStorage.getItem('nodeloc-downloadButtonPosition'));
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
        const existingToast = document.getElementById('nodeloc-download-progress-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'nodeloc-download-progress-toast';
        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid #ffffff;
                    border-radius: 50%;
                    animation: nodeloc-spin 1s linear infinite;
                    margin-right: 12px;
                "></div>
                <span style="color: #ffffff; font-weight: 500;">${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0f9f6f 0%, #16d085 100%);
            color: white;
            padding: 18px 26px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(15, 159, 111, 0.4);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        // 添加旋转动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes nodeloc-spin {
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
        const toast = document.getElementById('nodeloc-download-progress-toast');
        if (toast) {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }
    }

    // 显示成功提示
    function showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 12px; color: #ffffff;">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span style="color: #ffffff; font-weight: 500;">${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 18px 26px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(34, 197, 94, 0.4);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
            }, 400);
        }, 3500);
    }

    // 显示错误提示
    function showErrorToast(message) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="display: flex; align-items: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 12px; color: #ffffff;">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                <span style="color: #ffffff; font-weight: 500;">${message}</span>
            </div>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 18px 26px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            font-size: 14px;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.25);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
            }, 400);
        }, 4000);
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
                localStorage.setItem('nodeloc-downloadButtonPosition', JSON.stringify({
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

    // 清理HTML内容
    function cleanHtmlContent(htmlContent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // 移除所有空的锚点链接（如 [](#p-470452-h-1)）
        const emptyAnchors = tempDiv.querySelectorAll('a[href^="#"]:empty, a[href^="#"]:not([title]):not([alt])');
        emptyAnchors.forEach(anchor => {
            // 只移除那些只包含锚点ID的空链接
            if (anchor.getAttribute('href').match(/^#[a-zA-Z0-9\-_]+$/)) {
                anchor.remove();
            }
        });
        
        // 移除包含锚点ID模式的无用链接
        const anchors = tempDiv.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            const href = anchor.getAttribute('href');
            const text = anchor.textContent.trim();
            // 如果链接文本为空或者只是锚点ID，就移除
            if (!text || href.match(/^#p-\d+-h-[\d\w\-]*$/)) {
                anchor.remove();
            }
        });
        
        // 移除空的标题（只包含锚点链接的标题）
        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const textContent = heading.textContent.trim();
            // 如果标题为空或只包含空白字符，移除它
            if (!textContent || textContent.length === 0) {
                heading.remove();
            }
        });
        
        // 移除多余的空白段落
        const paragraphs = tempDiv.querySelectorAll('p');
        paragraphs.forEach(p => {
            const textContent = p.textContent.trim();
            if (!textContent || textContent.length === 0) {
                // 检查是否包含图片或其他有用内容
                if (!p.querySelector('img, video, audio, iframe')) {
                    p.remove();
                }
            }
        });
        
        // 移除多余的换行和空白div
        const divs = tempDiv.querySelectorAll('div');
        divs.forEach(div => {
            const textContent = div.textContent.trim();
            if (!textContent && !div.querySelector('img, video, audio, iframe, pre, code')) {
                div.remove();
            }
        });
        
        return tempDiv.innerHTML;
    }

    // 获取文章内容
    function getArticleContent() {
        const titleElement = document.querySelector('#topic-title > div > h1');
        const contentElement = document.querySelector('#post_1 > div.row > div.topic-body.clearfix > div.regular.contents > div');

        if (!titleElement) {
            console.error('无法找到文章标题');
            return null;
        }

        if (!contentElement) {
            console.error('无法找到文章内容');
            return null;
        }

        // 清理HTML内容
        const cleanedContent = cleanHtmlContent(contentElement.innerHTML);

        return {
            title: titleElement.textContent.trim(),
            content: cleanedContent
        };
    }

    // 转换为Markdown并下载（包含图片）
    async function downloadAsMarkdown() {
        const article = getArticleContent();
        if (!article) {
            showErrorToast('无法获取文章内容，请检查网页结构是否变更');
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
                codeBlockStyle: 'fenced',
                emDelimiter: '*',
                strongDelimiter: '**'
            });

            // 添加规则过滤无用的锚点链接
            turndownService.addRule('filterEmptyAnchors', {
                filter: function (node) {
                    return node.nodeName === 'A' && 
                           node.getAttribute('href') && 
                           node.getAttribute('href').startsWith('#') &&
                           (!node.textContent || node.textContent.trim() === '');
                },
                replacement: function () {
                    return '';
                }
            });

            // 过滤包含特定模式的锚点链接
            turndownService.addRule('filterPatternAnchors', {
                filter: function (node) {
                    if (node.nodeName === 'A') {
                        const href = node.getAttribute('href');
                        return href && href.match(/^#p-\d+-h-[\d\w\-]*$/);
                    }
                    return false;
                },
                replacement: function () {
                    return '';
                }
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

            let markdown = `# ${article.title}\n\n${turndownService.turndown(article.content)}`;
            
            // 后处理：清理Markdown中的残留问题
            markdown = markdown
                // 移除空的锚点链接模式 [](#xxx)
                .replace(/\[]\(#[^)]*\)/g, '')
                // 移除多余的空行（超过2个连续空行合并为2个）
                .replace(/\n{3,}/g, '\n\n')
                // 清理标题前后的多余空行
                .replace(/\n+###\s*/g, '\n\n### ')
                .replace(/\n+##\s*/g, '\n\n## ')
                .replace(/\n+#\s*/g, '\n\n# ')
                // 移除行尾空白
                .replace(/[ \t]+$/gm, '')
                // 确保文件末尾有且仅有一个换行
                .replace(/\s+$/, '\n');

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
            showErrorToast('下载过程中出现错误，请查看控制台了解详情');
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