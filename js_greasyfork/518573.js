// ==UserScript==
// @name         干翻超星小组云盘
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击按钮时检查页面是否有文件列表，如果有则显示悬浮窗并列出文件名称
// @author       榛铭
// @match        https://groupweb.chaoxing.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518573/%E5%B9%B2%E7%BF%BB%E8%B6%85%E6%98%9F%E5%B0%8F%E7%BB%84%E4%BA%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/518573/%E5%B9%B2%E7%BF%BB%E8%B6%85%E6%98%9F%E5%B0%8F%E7%BB%84%E4%BA%91%E7%9B%98.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 创建 MutationObserver 来监听页面变化
    const observer = new MutationObserver(function(mutations) {
        if (document.body && !document.getElementById('showFloatingButton')) {
            createShowFloatingButton();
        }
    });

    // 开始观察整个文档
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 创建显示悬浮窗的按钮
    function createShowFloatingButton() {
        var button = document.createElement('button');
        button.id = 'showFloatingButton';
        button.textContent = '显示文件列表';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.onclick = function() {
            var fileList = document.querySelectorAll('.dataBody_td.dataBody_data');
            if (fileList.length > 0) {
                createFloatingDiv(fileList);
            } else {
                alert('当前页面没有文件列表！');
            }
        };

        document.body.appendChild(button);
    }

    // 创建悬浮窗的函数
    function createFloatingDiv(fileList) {
        var floatingDiv = document.createElement('div');
        floatingDiv.id = 'floatingDiv';
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.top = '50%';
        floatingDiv.style.left = '50%';
        floatingDiv.style.transform = 'translate(-50%, -50%)';
        floatingDiv.style.width = '600px';
        floatingDiv.style.maxHeight = '80vh';
        floatingDiv.style.backgroundColor = '#ffffff';
        floatingDiv.style.border = '1px solid #ccc';
        floatingDiv.style.padding = '20px';
        floatingDiv.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
        floatingDiv.style.zIndex = '9999';
        floatingDiv.style.overflowY = 'auto';
        floatingDiv.style.borderRadius = '8px';

        // 创建标题
        var title = document.createElement('h2');
        title.textContent = '文件列表';
        title.style.marginBottom = '20px';
        title.style.color = '#333';
        title.style.borderBottom = '2px solid #4CAF50';
        title.style.paddingBottom = '10px';

        // 创建关闭按钮
        var closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#666';
        closeButton.onclick = function() {
            floatingDiv.remove();
        };

        floatingDiv.appendChild(closeButton);
        floatingDiv.appendChild(title);

        // 创建文件列表容器
        var listContainer = document.createElement('div');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        listContainer.style.gap = '10px';

        // 列出文件信息
        fileList.forEach(function(file, index) {
            var fileContent = JSON.parse(file.getAttribute('content'));
            var fileBox = document.createElement('div');
            fileBox.style.padding = '15px';
            fileBox.style.backgroundColor = index % 2 === 0 ? '#f8f8f8' : '#ffffff';
            fileBox.style.borderRadius = '4px';
            fileBox.style.border = '1px solid #eee';
            fileBox.style.display = 'flex';
            fileBox.style.alignItems = 'center';
            fileBox.style.gap = '15px';

            // 文件图标
            var iconDiv = document.createElement('div');
            iconDiv.innerHTML = `<img src="${file.querySelector('.dataBody_data_file img').src}" style="width: 40px; height: 40px;">`;

            // 文件信息
            var infoDiv = document.createElement('div');
            infoDiv.style.flex = '1';

            // 文件名
            var nameDiv = document.createElement('div');
            nameDiv.style.fontWeight = 'bold';
            nameDiv.style.marginBottom = '5px';
            nameDiv.textContent = fileContent.name;

            // 文件详情
            var detailsDiv = document.createElement('div');
            detailsDiv.style.fontSize = '12px';
            detailsDiv.style.color = '#666';
            detailsDiv.innerHTML = `
                大小: ${formatFileSize(fileContent.size)} |
                类型: ${fileContent.suffix.toUpperCase()} |
                ${fileContent.duration ? '时长: ' + formatDuration(fileContent.duration) : ''}
            `;

            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(detailsDiv);

            // 操作按钮
            var actionsDiv = document.createElement('div');
            actionsDiv.style.display = 'flex';
            actionsDiv.style.gap = '10px';

            // 添加视频链接获取按钮
            const videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'rm', 'rmvb', 'm4v', 'webm'];
            if (videoFormats.includes(fileContent.suffix.toLowerCase())) {
                var getVideoLinkBtn = createGetVideoLinkButton(file, fileContent);
                actionsDiv.appendChild(getVideoLinkBtn);
            }

            // 如果是图片文件，添加复制图片链接按钮
            if (fileContent.isImg && fileContent.previewUrl) {
                var copyImgLinkBtn = createCopyImageLinkButton(fileContent.previewUrl);
                actionsDiv.appendChild(copyImgLinkBtn);
            }

            // 添加复制下载链接按钮
            var fileKey = file.getAttribute('key');
            var copyLinkBtn = createCopyLinkButton(fileKey);
            actionsDiv.appendChild(copyLinkBtn);

            fileBox.appendChild(iconDiv);
            fileBox.appendChild(infoDiv);
            fileBox.appendChild(actionsDiv);
            listContainer.appendChild(fileBox);
        });

        floatingDiv.appendChild(listContainer);
        document.body.appendChild(floatingDiv);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 格式化视频时长
    function formatDuration(seconds) {
        if (!seconds) return '0分钟';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}小时${minutes > 0 ? minutes + '���钟' : ''}`;
        }
        return `${minutes}分钟`;
    }

    // 添加通用按钮样式函数
    function applyButtonStyle(button, backgroundColor) {
        button.style.padding = '5px 10px';
        button.style.backgroundColor = backgroundColor;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.fontSize = '12px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '5px';
        return button;
    }

    // 添加通用按钮状态切换函数
    function toggleButtonState(button, originalText, originalColor) {
        button.textContent = '已复制!';
        button.style.backgroundColor = '#4CAF50';
        setTimeout(function() {
            button.textContent = originalText;
            button.style.backgroundColor = originalColor;
        }, 1000);
    }

    // 修改 createCopyLinkButton 函数
    function createCopyLinkButton(key) {
        var button = document.createElement('button');
        button.textContent = '复制下载链接';
        applyButtonStyle(button, '#2196F3');

        button.onclick = function() {
            var downloadLink = `https://jxpt.tiangong.edu.cn/download/${key}`;
            navigator.clipboard.writeText(downloadLink).then(function() {
                toggleButtonState(button, '复制下载链接', '#2196F3');
            }).catch(function(err) {
                console.error('复制失败:', err);
                alert('复制失败，请重试');
            });
        };

        return button;
    }

    // 修改 createCopyImageLinkButton 函数
    function createCopyImageLinkButton(imageUrl) {
        var button = document.createElement('button');
        button.textContent = '复制图片链接';
        applyButtonStyle(button, '#9C27B0');

        button.onclick = function() {
            navigator.clipboard.writeText(imageUrl).then(function() {
                toggleButtonState(button, '复制图片链接', '#9C27B0');
            }).catch(function(err) {
                console.error('复制失败:', err);
                alert('复制失败，请重试');
            });
        };

        return button;
    }

    // 修改 createGetVideoLinkButton 函数
    function createGetVideoLinkButton(file, fileContent) {
        var button = document.createElement('button');
        button.textContent = '获取视频链接';
        applyButtonStyle(button, '#FF5722');

        button.onclick = function() {
            var previewLink = file.querySelector('a[onclick*="cloudFilePreview"]');
            if (previewLink) {
                previewLink.click();

                let attempts = 0;
                const maxAttempts = 10;
                const checkVideo = setInterval(function() {
                    var videoElements = document.querySelectorAll('video');
                    attempts++;

                    for (let video of videoElements) {
                        if (video.src && video.src.includes('ananas.chaoxing.com')) {
                            clearInterval(checkVideo);
                            var realVideoUrl = video.src.replace('s2.ananas.chaoxing.com', 's3.ananas.chaoxing.com');
                            navigator.clipboard.writeText(realVideoUrl).then(function() {
                                toggleButtonState(button, '获取视频链接', '#FF5722');
                                alert('视频链接已复制！');
                            });
                            return;
                        }
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(checkVideo);
                        alert('未找到视频链接，请重试');
                    }
                }, 300);
            } else {
                alert('未找到预览按钮');
            }
        };

        return button;
    }
})();