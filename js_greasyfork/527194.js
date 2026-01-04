// ==UserScript==
// @name         知识星球图片保存（支持原图）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在知识星球帖子的大图和小图右上角添加保存按钮，优先下载原图，否则下载高质量图片，文件名包含作者、日期和序号。
// @author       Wenston
// @match        https://wx.zsxq.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      images.zsxq.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527194/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%9B%BE%E7%89%87%E4%BF%9D%E5%AD%98%EF%BC%88%E6%94%AF%E6%8C%81%E5%8E%9F%E5%9B%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527194/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%9B%BE%E7%89%87%E4%BF%9D%E5%AD%98%EF%BC%88%E6%94%AF%E6%8C%81%E5%8E%9F%E5%9B%BE%EF%BC%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 创建固定的进度条容器
    let fixedProgressContainer = document.getElementById('fixed-progress-container');
    if (!fixedProgressContainer) {
        fixedProgressContainer = document.createElement('div');
        fixedProgressContainer.id = 'fixed-progress-container';
        fixedProgressContainer.style.position = 'fixed';
        fixedProgressContainer.style.right = '20px';
        fixedProgressContainer.style.bottom = '20px';
        fixedProgressContainer.style.zIndex = '10000';
        document.body.appendChild(fixedProgressContainer);
    }
 
    function addSaveButton(imageElement, authorName, dateString, imageIndex, originalImageIndex) {
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        
        // 检查是否为大图模式
        const isLargeImage = imageElement.closest('app-image-full-screen');
        
        if (isLargeImage) {
            // 大图模式下的按钮样式
            saveButton.style.position = 'fixed';
            saveButton.style.top = '20px';
            saveButton.style.right = '20px';
        } else {
            // 小图模式下的按钮样式
            saveButton.style.position = 'absolute';
            saveButton.style.top = '10px';
            saveButton.style.right = '10px';
        }

        saveButton.style.zIndex = '10000'; // 确保按钮始终显示在最上层
        saveButton.style.padding = '5px 10px';
        saveButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
 
        const progressContainer = document.createElement('div');
        progressContainer.style.marginBottom = '10px';
        progressContainer.style.padding = '5px';
        progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        progressContainer.style.borderRadius = '5px';
        progressContainer.style.display = 'none';
 
        const fileNameLabel = document.createElement('div');
        fileNameLabel.style.color = 'white';
        fileNameLabel.style.fontSize = '12px';
        fileNameLabel.style.marginBottom = '5px';
        progressContainer.appendChild(fileNameLabel);
 
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.width = '200px';
        progressBarContainer.style.height = '10px';
        progressBarContainer.style.backgroundColor = 'lightgray';
        progressBarContainer.style.borderRadius = '5px';
        progressContainer.appendChild(progressBarContainer);
 
        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = 'green';
        progressBar.style.borderRadius = '5px';
        progressBarContainer.appendChild(progressBar);
 
        saveButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
 
            let imageUrl = null;
            const originalImageLink = imageElement.parentNode.querySelector('a.original-image');
            if (originalImageLink) {
                imageUrl = originalImageLink.href;
            } else {
                // 查找大图的高质量图片
                const topicElement = imageElement.closest('app-topic');
                const highQualityImage = topicElement.querySelector('img[src*="quality/100!"]');
                if (highQualityImage) {
                    imageUrl = highQualityImage.src;
                } else {
                    // 从小图的 URL 构建高质量 URL
                    imageUrl = imageElement.src;
                    if (imageUrl.includes('imageMogr2')) {
                        const urlParts = imageUrl.split('?');
                        const baseUrl = urlParts[0];
                        const params = new URLSearchParams(urlParts[1]);
                        imageUrl = baseUrl + '?imageMogr2/auto-orient/quality/100!/ignore-error/1';
                        if (params.has('token')) imageUrl += '&token=' + params.get('token');
                        if (params.has('e')) imageUrl += '&e=' + params.get('e');
                        if (params.has('s')) imageUrl += '&s=' + params.get('s');
                    }
                }
            }
 
            // 使用 originalImageIndex，如果为 undefined 则使用 imageIndex
            const indexToUse = (originalImageIndex !== undefined) ? originalImageIndex : imageIndex;
            // 修改日期格式
            const dateStr = dateString.replace(/ /g, '').replace(/:/g, '');
            const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})(\d{4})/); // 匹配原始日期格式
            const fileName = match ?
                `${authorName}_${match[1].slice(2)}${match[2]}${match[3]}${match[4]}_${indexToUse + 1}.jpg` :
                `${authorName}_${dateStr}_${indexToUse + 1}.jpg`;
 
            fixedProgressContainer.appendChild(progressContainer);
            fileNameLabel.textContent = fileName;
            progressContainer.style.display = 'block';
 
            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'blob',
                onload: function(response) {
                    GM_download({
                        url: URL.createObjectURL(response.response),
                        name: fileName,
                        saveAs: false,
                        onload: () => {
                            setTimeout(() => { progressContainer.remove(); }, 1000);
                        },
                        onerror: (err) => {
                            console.error("Download error:", err);
                            setTimeout(() => { progressContainer.remove(); }, 1000);
                        }
                    });
                },
                onprogress: function(event) {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        progressBar.style.width = percentComplete + '%';
                    }
                },
                onerror: (err) => {
                    console.error("Request error:", err);
                    setTimeout(() => { progressContainer.remove(); }, 1000);
                }
            });
        });
 
        imageElement.parentNode.appendChild(saveButton);
    }
 
 
    function processImages() {
        const topicElements = document.querySelectorAll('app-topic');
 
        topicElements.forEach(topicElement => {
            const authorElement = topicElement.querySelector('.author .role.member');
            const authorName = authorElement ? authorElement.textContent.trim() : 'unknown';
 
            const dateElement = topicElement.querySelector('.date');
            const dateString = dateElement ? dateElement.textContent.trim() : 'unknown';
 
            const imageContainers = topicElement.querySelectorAll('app-image-full-screen .image-container, app-image-gallery .image-container');
            let smallImageIndex = 0; // 小图索引计数器
 
            imageContainers.forEach(container => {
                const isOneImage = container.parentNode.classList.contains('one-image');
                const image = isOneImage ? container.querySelector('img.item.single-img') : container.querySelector('img.can-scale, img.item');
 
                if (image && !container.querySelector('button')) {
                    const isLargeImage = container.closest('app-image-full-screen');
                    let currentImageIndex = smallImageIndex; // 默认为小图索引
 
                    if (isLargeImage) {
                        // 如果是大图，找到它对应的小图container
                        // 通过比较src来找到大图小图的对应关系, 大图的src属性里会包含小图的src内容
                        const updateImageIndex = () => {
                            const smallImageContainers = topicElement.querySelectorAll('app-image-gallery .image-container');
                            for (let i = 0; i < smallImageContainers.length; i++) {
                                const smallImg = smallImageContainers[i].querySelector('img');
                                if (image.src.includes(smallImg.src.split('?')[0])) {
                                    currentImageIndex = i;
                                    break;
                                }
                            }
                        };
 
                        // 初始化时计算索引
                        updateImageIndex();
 
                        // 监听图片src变化
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                                    updateImageIndex();
                                    // 更新保存按钮的事件处理程序
                                    const saveButton = container.querySelector('button');
                                    if (saveButton) {
                                        container.removeChild(saveButton);
                                        addSaveButton(image, authorName, dateString, 0, currentImageIndex);
                                    }
                                }
                            });
                        });
 
                        observer.observe(image, {
                            attributes: true,
                            attributeFilter: ['src']
                        });
 
                    }
 
                    if (image.complete) {
                        addSaveButton(image, authorName, dateString, 0, currentImageIndex); // 始终传入 currentImageIndex
                    } else {
                        image.onload = () => addSaveButton(image, authorName, dateString, 0, currentImageIndex); // 始终传入 currentImageIndex
                    }
 
                    if (!isOneImage && !isLargeImage) {
                        smallImageIndex++; // 只有小图才增加索引
                    }
                }
            });
        });
    }
 
    processImages();
 
    const observer = new MutationObserver(processImages);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();