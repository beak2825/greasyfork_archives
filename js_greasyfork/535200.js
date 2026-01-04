// ==UserScript==
// @name         豆包图片源地址提取器
// @namespace    http://tampermonkey.net/
// @version      0.46
// @description  从豆包界面提取图片的源地址、提示词并支持下载，支持点击预览大图，一键复制表格数据
// @author       You
// @match        *://www.doubao.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_download
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/535200/%E8%B1%86%E5%8C%85%E5%9B%BE%E7%89%87%E6%BA%90%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535200/%E8%B1%86%E5%8C%85%E5%9B%BE%E7%89%87%E6%BA%90%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止脚本多次运行
    if (window.doubaoPicExtractorLoaded) return;
    window.doubaoPicExtractorLoaded = true;

    // 创建样式
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .doubao-extractor-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 15px;
                background-color: #007bff;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
                font-size: 14px;
                border: none;
                transition: background-color 0.2s ease;
                user-select: none;
            }

            .doubao-extractor-btn:hover {
                background-color: #0069d9;
            }

            img[data-testid="in_painting_picture"],
            img.preview-img-uz4sQR {
                cursor: pointer;
            }

            img[data-testid="in_painting_picture"]:hover,
            img.preview-img-uz4sQR:hover {
                outline: 2px solid #007bff;
            }
        `;
        document.head.appendChild(style);
    };

    // 创建悬浮按钮
    const createFloatingButton = () => {
        // 检查是否已存在按钮，避免重复创建
        if (document.querySelector('.doubao-extractor-btn')) {
            console.log('悬浮按钮已存在，跳过创建');
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = '提取图片';
        button.className = 'doubao-extractor-btn';

        // 添加点击事件
        button.addEventListener('click', () => {
            extractImageUrls();
        });

        // 确保按钮被添加到文档中
        document.body.appendChild(button);
        console.log('图片提取按钮已创建并添加到页面');
    };

    // 提取图片URL的函数
    const extractImageUrls = () => {
        // 查找所有图片元素，特别是带有特定属性的图片
        const images = document.querySelectorAll('img[data-testid="in_painting_picture"], img.preview-img-uz4sQR');
        console.log('找到图片数量:', images.length);

        if (images.length === 0) {
            // 尝试查找通过更广泛的选择器
            const allImages = document.querySelectorAll('img');
            console.log('页面上所有图片数量:', allImages.length);

            // 过滤可能的生成图片
            const possibleImages = Array.from(allImages).filter(img => {
                // 检查图片URL是否像是豆包生成的图片
                const src = img.src || '';
                return src.includes('doubao') || src.includes('baai.ac.cn') ||
                       src.includes('image') || src.length > 100;
            });

            if (possibleImages.length > 0) {
                console.log('找到可能的生成图片:', possibleImages.length);
                processImages(possibleImages);
            } else {
                GM_notification({
                    text: '未找到符合条件的图片',
                    title: '豆包图片提取器',
                    timeout: 3000
                });
            }
            return;
        }

        // 处理找到的图片
        processImages(images);
    };

    // 查找最近的消息文本内容
    const findNearestMessageText = (imgElement) => {
        // 先尝试查找2025年新版UI中的消息文本元素
        let currentElement = imgElement;
        let messageTextElement = null;

        // 向上查找最多15层父元素
        for (let i = 0; i < 15; i++) {
            if (!currentElement || currentElement === document.body) break;

            // 尝试在当前元素的父级或祖先元素中查找新版UI的消息文本
            const parentElement = currentElement.parentElement;
            if (!parentElement) break;

            // 2025年新版UI选择器
            messageTextElement = parentElement.querySelector('.container-mhps2t[data-testid="message_text_content"]');
            if (messageTextElement) {
                console.log("找到2025年新版UI提示词元素");
                break;
            }

            // 如果在当前父级没找到，继续向上查找
            currentElement = parentElement;
        }

        // 如果没有找到2025年新版UI的消息文本元素，尝试查找其他版本UI的元素
        if (!messageTextElement) {
            currentElement = imgElement;

            // 向上查找最多15层父元素
            for (let i = 0; i < 15; i++) {
                if (!currentElement || currentElement === document.body) break;

                const parentElement = currentElement.parentElement;
                if (!parentElement) break;

                // 尝试其他版本UI的选择器
                messageTextElement = parentElement.querySelector(
                    '.auto-hide-last-sibling-br.paragraph-fz9qvc, ' +
                    '.container-zfZG7J.flow-markdown-body .paragraph-fz9qvc, ' +
                    'div[data-testid="message_text_content"] p, ' +
                    '.whitespace-break-spaces.message-text-qdFq8c[data-testid="message_text_content"], ' +
                    '.whitespace-break-spaces.message-text-UeSMY7[data-testid="message_text_content"]'
                );

                if (messageTextElement) {
                    console.log("找到旧版UI提示词元素");
                    break;
                }

                currentElement = parentElement;
            }
        }

        // 如果仍然没有找到，尝试查找整个聊天消息容器中的文本元素
        if (!messageTextElement) {
            // 获取图片所在的聊天消息容器
            const messageContainer = findMessageContainer(imgElement);

            if (messageContainer) {
                // 2025年新版UI中的消息文本查找
                messageTextElement = messageContainer.querySelector('.container-mhps2t[data-testid="message_text_content"]');

                // 如果2025年新版UI没找到，尝试其他版本
                if (!messageTextElement) {
                    messageTextElement = messageContainer.querySelector(
                        '.auto-hide-last-sibling-br.paragraph-fz9qvc, ' +
                        '.container-zfZG7J.flow-markdown-body .paragraph-fz9qvc, ' +
                        'div[data-testid="message_text_content"] p, ' +
                        '.whitespace-break-spaces.message-text-qdFq8c[data-testid="message_text_content"], ' +
                        '.whitespace-break-spaces.message-text-UeSMY7[data-testid="message_text_content"]'
                    );
                }
            }

            // 如果仍然没找到，尝试在更广泛的范围内查找
            if (!messageTextElement) {
                // 查找所有消息容器
                const allMessageContainers = document.querySelectorAll(
                    '[data-testid="message-block-container"], ' +
                    '[data-testid="receive_message"], ' +
                    '[data-testid="union_message"], ' +
                    '[data-testid="send_message"]'
                );

                // 找到包含图片的消息容器的索引
                let containerWithImage = null;
                let containerIndex = -1;

                for (let i = 0; i < allMessageContainers.length; i++) {
                    if (allMessageContainers[i].contains(imgElement)) {
                        containerWithImage = allMessageContainers[i];
                        containerIndex = i;
                        break;
                    }
                }

                // 如果找到了包含图片的容器，尝试查找前一个消息容器中的文本
                if (containerIndex > 0) {
                    const previousContainer = allMessageContainers[containerIndex - 1];

                    // 2025年新版UI中的消息文本查找
                    messageTextElement = previousContainer.querySelector('.container-mhps2t[data-testid="message_text_content"]');

                    // 如果2025年新版UI没找到，尝试其他版本
                    if (!messageTextElement) {
                        messageTextElement = previousContainer.querySelector(
                            '.auto-hide-last-sibling-br.paragraph-fz9qvc, ' +
                            '.container-zfZG7J.flow-markdown-body .paragraph-fz9qvc, ' +
                            'div[data-testid="message_text_content"] p, ' +
                            '.whitespace-break-spaces.message-text-qdFq8c[data-testid="message_text_content"], ' +
                            '.whitespace-break-spaces.message-text-UeSMY7[data-testid="message_text_content"]'
                        );
                    }
                }
            }
        }

        return messageTextElement;
    };

    // 查找图片所在的消息容器
    const findMessageContainer = (imgElement) => {
        let currentElement = imgElement;

        // 向上查找最多15层父元素
        for (let i = 0; i < 15; i++) {
            if (!currentElement || currentElement === document.body) break;

            // 检查当前元素是否是消息容器
            if (currentElement.classList &&
                (currentElement.classList.contains('message-container') ||
                 currentElement.hasAttribute('data-testid') &&
                 (currentElement.getAttribute('data-testid').includes('message') ||
                  currentElement.getAttribute('data-testid') === 'receive_message' ||
                  currentElement.getAttribute('data-testid') === 'message-block-container' ||
                  currentElement.getAttribute('data-testid') === 'union_message' ||
                  currentElement.getAttribute('data-testid') === 'send_message'))) {
                return currentElement;
            }

            // 继续向上查找
            currentElement = currentElement.parentElement;
        }

        return null;
    };

    // 创建大图预览功能
    const createImagePreview = (imgUrl) => {
        // 创建预览遮罩层
        const previewOverlay = document.createElement('div');
        previewOverlay.style.position = 'fixed';
        previewOverlay.style.top = '0';
        previewOverlay.style.left = '0';
        previewOverlay.style.width = '100%';
        previewOverlay.style.height = '100%';
        previewOverlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
        previewOverlay.style.zIndex = '10001';
        previewOverlay.style.display = 'flex';
        previewOverlay.style.alignItems = 'center';
        previewOverlay.style.justifyContent = 'center';
        previewOverlay.style.cursor = 'pointer';

        // 创建大图元素
        const previewImg = document.createElement('img');
        previewImg.src = imgUrl;
        previewImg.style.maxWidth = '90%';
        previewImg.style.maxHeight = '90%';
        previewImg.style.objectFit = 'contain';
        previewImg.style.borderRadius = '8px';
        previewImg.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';

        // 创建关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '30px';
        closeBtn.style.fontSize = '40px';
        closeBtn.style.color = 'white';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        closeBtn.style.userSelect = 'none';

        // 添加悬停效果
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#ff6b6b';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = 'white';
        });

        // 关闭预览的函数
        const closePreview = () => {
            if (document.body.contains(previewOverlay)) {
                document.body.removeChild(previewOverlay);
            }
            document.removeEventListener('keydown', handlePreviewKeyDown);
        };

        // 键盘事件处理
        const handlePreviewKeyDown = (e) => {
            if (e.key === 'Escape') {
                closePreview();
            }
        };

        // 添加事件监听器
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closePreview();
        });

        previewOverlay.addEventListener('click', closePreview);

        // 防止点击图片时关闭预览
        previewImg.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.addEventListener('keydown', handlePreviewKeyDown);

        // 组装预览界面
        previewOverlay.appendChild(previewImg);
        previewOverlay.appendChild(closeBtn);
        document.body.appendChild(previewOverlay);

        // 添加加载动画
        previewImg.style.opacity = '0';
        previewImg.addEventListener('load', () => {
            previewImg.style.transition = 'opacity 0.3s ease';
            previewImg.style.opacity = '1';
        });
    };

    // 将图片URL转换为Base64格式
    const imageUrlToBase64 = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('转换图片为Base64失败:', error);
            return null;
        }
    };

    // 复制表格数据到剪贴板（修改版本）
    const copyTableData = async (promptText, imgUrl) => {
        try {
            // 方案1：复制图片文件到剪贴板（推荐）
            const copyImageAsFile = async () => {
                try {
                    const response = await fetch(imgUrl);
                    const blob = await response.blob();

                    // 创建包含图片文件的剪贴板项
                    const clipboardItem = new ClipboardItem({
                        [blob.type]: blob,
                        'text/plain': new Blob([`${promptText || ''}\t${imgUrl}`], { type: 'text/plain' })
                    });

                    await navigator.clipboard.write([clipboardItem]);

                    GM_notification({
                        text: '图片文件已复制到剪贴板，可直接粘贴到飞书表格',
                        title: '豆包图片提取器',
                        timeout: 3000
                    });
                    return true;
                } catch (error) {
                    console.log('图片文件复制失败，尝试其他方案:', error);
                    return false;
                }
            };

            // 方案2：创建可粘贴的HTML表格（备用）
            const copyAsHTMLTable = async () => {
                try {
                    const response = await fetch(imgUrl);
                    const blob = await response.blob();
                    const base64Data = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });

                    // 创建更兼容的HTML表格
                    const htmlTable = `
                    <table border="1" cellpadding="5" cellspacing="0">
                        <tr>
                            <td>${promptText || ''}</td>
                            <td>${imgUrl}</td>
                            <td><img src="${base64Data}" style="max-width:150px;max-height:150px;object-fit:contain;"/></td>
                        </tr>
                    </table>`;

                    const textData = `${promptText || ''}\t${imgUrl}\t图片`;

                    const clipboardItem = new ClipboardItem({
                        'text/html': new Blob([htmlTable], { type: 'text/html' }),
                        'text/plain': new Blob([textData], { type: 'text/plain' })
                    });

                    await navigator.clipboard.write([clipboardItem]);

                    GM_notification({
                        text: 'HTML表格已复制，可尝试粘贴到飞书表格',
                        title: '豆包图片提取器',
                        timeout: 3000
                    });
                    return true;
                } catch (error) {
                    console.log('HTML表格复制失败:', error);
                    return false;
                }
            };

            // 方案3：纯文本格式（最终备用）
            const copyAsText = () => {
                const textData = `${promptText || ''}\t${imgUrl}\t${imgUrl}`;
                GM_setClipboard(textData);
                GM_notification({
                    text: '文本数据已复制（制表符分隔），图片需手动下载',
                    title: '豆包图片提取器',
                    timeout: 3000
                });
            };

            // 按优先级尝试不同的复制方案
            if (navigator.clipboard && navigator.clipboard.write) {
                // 首先尝试复制图片文件
                const imageSuccess = await copyImageAsFile();
                if (!imageSuccess) {
                    // 如果失败，尝试HTML表格
                    const htmlSuccess = await copyAsHTMLTable();
                    if (!htmlSuccess) {
                        // 最后使用纯文本
                        copyAsText();
                    }
                }
            } else {
                // 浏览器不支持现代剪贴板API，使用纯文本
                copyAsText();
            }

        } catch (error) {
            console.error('复制表格数据失败:', error);
            // 最终降级方案
            const fallbackText = `${promptText || ''}\t${imgUrl}\t${imgUrl}`;
            GM_setClipboard(fallbackText);
            GM_notification({
                text: '已复制基本文本数据（制表符分隔）',
                title: '豆包图片提取器',
                timeout: 3000
            });
        }
    };

    // 备用下载方法
    const downloadFallback = (url, filename) => {
        // 创建一个隐藏的a标签
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;

        // 添加到文档并触发点击
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
        }, 100);
    };

    // 处理找到的图片（重新设计的大图预览界面）
    const processImages = (images) => {
        if (images.length === 0) return;

        let currentImageIndex = 0;

        // 创建全屏预览界面
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.95)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '20px';
        overlay.style.boxSizing = 'border-box';

        // 主容器
        const mainContainer = document.createElement('div');
        mainContainer.style.position = 'relative';
        mainContainer.style.width = '100%';
        mainContainer.style.height = '100%';
        mainContainer.style.display = 'flex';
        mainContainer.style.alignItems = 'center';
        mainContainer.style.justifyContent = 'center';

        // 图片容器
        const imageContainer = document.createElement('div');
        imageContainer.style.position = 'relative';
        imageContainer.style.maxWidth = 'calc(100% - 200px)';
        imageContainer.style.maxHeight = '100%';
        imageContainer.style.display = 'flex';
        imageContainer.style.alignItems = 'center';
        imageContainer.style.justifyContent = 'center';

        // 主图片元素
        const mainImage = document.createElement('img');
        mainImage.style.maxWidth = '100%';
        mainImage.style.maxHeight = 'calc(100% - 100px)';
        mainImage.style.objectFit = 'contain';
        mainImage.style.borderRadius = '8px';
        mainImage.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';

        // 按钮容器（始终在图片右侧）
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.right = '-180px';
        buttonContainer.style.top = '50%';
        buttonContainer.style.transform = 'translateY(-50%)';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '15px';
        buttonContainer.style.width = '160px';

        // 复制按钮（整合提示词+图片链接+图片）
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制到表格';
        copyButton.style.padding = '12px 16px';
        copyButton.style.backgroundColor = '#28a745';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '6px';
        copyButton.style.cursor = 'pointer';
        copyButton.style.fontSize = '14px';
        copyButton.style.fontWeight = 'bold';
        copyButton.style.transition = 'all 0.2s ease';

        // 下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载图片';
        downloadButton.style.padding = '12px 16px';
        downloadButton.style.backgroundColor = '#007bff';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '6px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.fontSize = '14px';
        downloadButton.style.fontWeight = 'bold';
        downloadButton.style.transition = 'all 0.2s ease';

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.padding = '12px 16px';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '6px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.transition = 'all 0.2s ease';

        // 按钮悬停效果
        [copyButton, downloadButton, closeButton].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.05)';
                btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
            });
        });

        // 翻页按钮（左）
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '‹';
        prevButton.style.position = 'absolute';
        prevButton.style.left = '20px';
        prevButton.style.top = '50%';
        prevButton.style.transform = 'translateY(-50%)';
        prevButton.style.width = '50px';
        prevButton.style.height = '50px';
        prevButton.style.backgroundColor = 'rgba(255,255,255,0.8)';
        prevButton.style.border = 'none';
        prevButton.style.borderRadius = '50%';
        prevButton.style.fontSize = '24px';
        prevButton.style.fontWeight = 'bold';
        prevButton.style.cursor = 'pointer';
        prevButton.style.display = images.length > 1 ? 'flex' : 'none';
        prevButton.style.alignItems = 'center';
        prevButton.style.justifyContent = 'center';
        prevButton.style.transition = 'all 0.2s ease';

        // 翻页按钮（右）
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '›';
        nextButton.style.position = 'absolute';
        nextButton.style.right = '20px';
        nextButton.style.top = '50%';
        nextButton.style.transform = 'translateY(-50%)';
        nextButton.style.width = '50px';
        nextButton.style.height = '50px';
        nextButton.style.backgroundColor = 'rgba(255,255,255,0.8)';
        nextButton.style.border = 'none';
        nextButton.style.borderRadius = '50%';
        nextButton.style.fontSize = '24px';
        nextButton.style.fontWeight = 'bold';
        nextButton.style.cursor = 'pointer';
        nextButton.style.display = images.length > 1 ? 'flex' : 'none';
        nextButton.style.alignItems = 'center';
        nextButton.style.justifyContent = 'center';
        nextButton.style.transition = 'all 0.2s ease';

        // 底部小图导航
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.style.position = 'absolute';
        thumbnailContainer.style.bottom = '20px';
        thumbnailContainer.style.left = '50%';
        thumbnailContainer.style.transform = 'translateX(-50%)';
        thumbnailContainer.style.display = 'flex';
        thumbnailContainer.style.gap = '10px';
        thumbnailContainer.style.padding = '10px';
        thumbnailContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
        thumbnailContainer.style.borderRadius = '25px';
        thumbnailContainer.style.maxWidth = '80%';
        thumbnailContainer.style.overflowX = 'auto';

        // 创建小图缩略图
        const thumbnails = [];
        images.forEach((img, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = img.src;
            thumbnail.style.width = '60px';
            thumbnail.style.height = '60px';
            thumbnail.style.objectFit = 'cover';
            thumbnail.style.borderRadius = '8px';
            thumbnail.style.cursor = 'pointer';
            thumbnail.style.border = '2px solid transparent';
            thumbnail.style.transition = 'all 0.2s ease';

            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateDisplay();
            });

            thumbnail.addEventListener('mouseenter', () => {
                thumbnail.style.transform = 'scale(1.1)';
            });

            thumbnail.addEventListener('mouseleave', () => {
                thumbnail.style.transform = 'scale(1)';
            });

            thumbnails.push(thumbnail);
            thumbnailContainer.appendChild(thumbnail);
        });

        // 更新显示函数
        const updateDisplay = async () => {
            const currentImage = images[currentImageIndex];
            mainImage.src = currentImage.src;

            // 更新缩略图边框
            thumbnails.forEach((thumb, index) => {
                thumb.style.border = index === currentImageIndex ? '2px solid #007bff' : '2px solid transparent';
            });

            // 更新按钮状态
            prevButton.style.opacity = currentImageIndex > 0 ? '1' : '0.5';
            nextButton.style.opacity = currentImageIndex < images.length - 1 ? '1' : '0.5';

            // 获取当前图片的提示词
            const messageText = findNearestMessageText(currentImage);
            const promptText = messageText ? messageText.textContent.trim() : '';

            // 更新复制按钮事件
            copyButton.onclick = async () => {
                copyButton.textContent = '复制中...';
                copyButton.disabled = true;
                await copyTableData(promptText, currentImage.src);
                copyButton.textContent = '复制到表格';
                copyButton.disabled = false;
            };

            // 更新下载按钮事件
            downloadButton.onclick = () => {
                const filename = `doubao_image_${currentImageIndex + 1}_${Date.now()}.jpg`;
                try {
                    GM_download(currentImage.src, filename);
                    GM_notification({
                        text: `开始下载: ${filename}`,
                        title: '豆包图片提取器',
                        timeout: 2000
                    });
                } catch (error) {
                    console.error('GM_download失败，使用备用方法:', error);
                    downloadFallback(currentImage.src, filename);
                }
            };
        };

        // 翻页事件
        prevButton.addEventListener('click', () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateDisplay();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentImageIndex < images.length - 1) {
                currentImageIndex++;
                updateDisplay();
            }
        });

        // 关闭事件
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleKeyDown);
        });

        // 键盘事件
        const handleKeyDown = (e) => {
            switch(e.key) {
                case 'Escape':
                    closeButton.click();
                    break;
                case 'ArrowLeft':
                    if (currentImageIndex > 0) {
                        currentImageIndex--;
                        updateDisplay();
                    }
                    break;
                case 'ArrowRight':
                    if (currentImageIndex < images.length - 1) {
                        currentImageIndex++;
                        updateDisplay();
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // 组装界面
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(closeButton);

        imageContainer.appendChild(mainImage);
        imageContainer.appendChild(buttonContainer);

        mainContainer.appendChild(imageContainer);
        mainContainer.appendChild(prevButton);
        mainContainer.appendChild(nextButton);
        mainContainer.appendChild(thumbnailContainer);

        overlay.appendChild(mainContainer);
        document.body.appendChild(overlay);

        // 初始化显示
        updateDisplay();

        // 添加加载动画
        mainImage.style.opacity = '0';
        mainImage.addEventListener('load', () => {
            mainImage.style.transition = 'opacity 0.3s ease';
            mainImage.style.opacity = '1';
        });
    };

    // 为页面上的图片添加点击事件
    const addImageClickEvents = () => {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                // 检查是否是目标图片
                if (e.target.getAttribute('data-testid') === 'in_painting_picture' ||
                    e.target.classList.contains('preview-img-uz4sQR')) {
                    const imgUrl = e.target.src;
                    if (imgUrl) {
                        if (e.altKey) { // 按住Alt键点击直接复制
                            GM_setClipboard(imgUrl);
                            GM_notification({
                                text: '图片链接已复制到剪贴板',
                                title: '豆包图片提取器',
                                timeout: 2000
                            });
                        }
                    }
                }
            }
        });
    };

    // 添加对页面上新加载的图片的检测
    const observeImageAddition = () => {
        // 创建MutationObserver实例，监听DOM变化
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // 检查是否有新的图片被添加
                    let hasNewImage = false;
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // 元素节点
                            if (node.tagName === 'IMG') {
                                hasNewImage = true;
                            } else {
                                const images = node.querySelectorAll('img');
                                if (images.length > 0) hasNewImage = true;
                            }
                        }
                    });

                    // 如果发现新的图片，确保样式被正确应用
                    if (hasNewImage) {
                        console.log('检测到新的图片加载');
                    }
                }
            }
        });

        // 开始观察整个文档
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // 初始化
    const init = () => {
        console.log('豆包图片源地址提取器初始化开始');
        // 添加样式
        addStyles();
        // 创建按钮
        createFloatingButton();
        // 添加图片点击事件
        addImageClickEvents();
        // 观察图片添加
        observeImageAddition();

        // 确保按钮存在
        const checkButtonInterval = setInterval(() => {
            if (!document.querySelector('.doubao-extractor-btn')) {
                console.log('按钮不存在，重新创建');
                createFloatingButton();
            } else {
                clearInterval(checkButtonInterval);
            }
        }, 5000);

        console.log('豆包图片源地址提取器初始化完成');
    };

    // 确保DOM加载完成后再初始化
    if (document.readyState === 'loading') {
        console.log('文档加载中，等待DOMContentLoaded事件');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('文档已加载完成，直接初始化');
        init();
    }

    // 在页面刷新或重载时重新初始化
    window.addEventListener('load', () => {
        console.log('页面加载完成，确保按钮存在');
        if (!document.querySelector('.doubao-extractor-btn')) {
            createFloatingButton();
        }
    });
})();