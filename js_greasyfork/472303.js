// ==UserScript==
// @name         Civitai模型下载辅助
// @namespace    https://greasyfork.org/zh-CN/users/904778-blueccoffee
// @version      1.5
// @description  一键将下载模型介绍和图片。
// @author       AIGC知识库
// @match        https://civitai.com/models/*
// @grant        GM_download
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/472303/Civitai%E6%A8%A1%E5%9E%8B%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/472303/Civitai%E6%A8%A1%E5%9E%8B%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadMarkdownAndImage(text, fileName) {
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName + '.md';
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function extractFileInfo() {
        const fileInfo = {};

        // 提取文件名
        const fileNameElement = document.querySelector('h1.mantine-Text-root');
        if (fileNameElement) {
            fileInfo.fileName = fileNameElement.innerText.trim();
        }

        // 提取介绍内容
        const introductionElement = document.querySelector('div.mantine-Spoiler-content');
        if (introductionElement) {
            fileInfo.introduction = introductionElement.innerText.trim();
        }

        // 提取图片网址
        const imageElement = document.querySelector('img.mantine-7aj0so');
        if (imageElement) {
            fileInfo.imageUrl = imageElement.src;
        }

        // 提取元数据信息
        const metadataElement = document.querySelector('table.mantine-Table-root');
        if (metadataElement) {
            const rows = metadataElement.querySelectorAll('tr');
            rows.forEach((row) => {
                const keyElement = row.querySelector('td:nth-child(1) div.mantine-Text-root');
                const valueElement = row.querySelector('td:nth-child(2) div.mantine-Text-root');

                if (keyElement && valueElement) {
                    const key = keyElement.innerText.trim();
                    const value = valueElement.innerText.trim();

                    if (key === 'Trigger Words') {
                        fileInfo.triggerWords = value;
                    } else if (key === '源地址') {
                        fileInfo.sourceAddress = value;
                    } else if (key === '名称') {
                        fileInfo.name = value;
                    }
                }
            });

            fileInfo.metadata = metadataElement.innerText.trim();
        }

        return fileInfo;
    }

    function addButton() {
        // 添加【下载】按钮
        const downloadButton = document.createElement('button');
        downloadButton.innerText = '下载';
        downloadButton.style.position = 'fixed';
        downloadButton.style.top = '10px';
        downloadButton.style.right = '60px'; // 调整位置，留出悬浮窗的空间
        downloadButton.style.zIndex = '9999';

        downloadButton.addEventListener('click', async () => {
            const fileInfo = extractFileInfo();

            // 创建Markdown文本
            let markdownText = `---
Type:
Trigger: ${fileInfo.triggerWords}
note:
src: ${fileInfo.sourceAddress}
name: ${fileInfo.name}
---\n\n`;

            markdownText += `# ${fileInfo.fileName}\n\n`;
            markdownText += `## 介绍\n\n${fileInfo.introduction}\n\n`;

            // 下载图片并将其添加到Markdown文本中
            const imageData = await fetch(fileInfo.imageUrl).then(response => response.blob());
            const imageFileName = fileInfo.fileName.replace(/[^a-zA-Z0-9-_]/g, '_'); // 替换非法字符
            const imageBlob = new Blob([imageData], { type: 'image/png' });

            const imageLink = document.createElement('a');
            imageLink.href = URL.createObjectURL(imageBlob);
            imageLink.download = `${imageFileName}.png`;
            document.body.appendChild(imageLink);
            imageLink.click();

            document.body.removeChild(imageLink);
            URL.revokeObjectURL(imageLink.href);

            markdownText += `![${fileInfo.fileName}](${imageFileName}.png)\n\n`;

            // 添加元数据信息到Markdown文本中
            markdownText += `## 元数据\n\n${fileInfo.metadata}\n\n`;

            // 下载Markdown文件
            downloadMarkdownAndImage(markdownText, fileInfo.fileName);
        });

        document.body.appendChild(downloadButton);

// 添加【关于】按钮
        const aboutButton = document.createElement('button');
        aboutButton.innerText = '关于';
        aboutButton.style.position = 'fixed';
        aboutButton.style.top = '10px';
        aboutButton.style.right = '10px';
        aboutButton.style.zIndex = '9999';

        aboutButton.addEventListener('click', () => {
            // 创建悬浮窗
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            overlay.style.padding = '20px';
            overlay.style.borderRadius = '8px';
            overlay.style.zIndex = '9999';
            overlay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            overlay.style.maxWidth = '400px';
            overlay.style.maxHeight = '80vh';
            overlay.style.overflowY = 'auto';

            // 创建覆盖层
            const overlayCover = document.createElement('div');
            overlayCover.style.position = 'fixed';
            overlayCover.style.top = '0';
            overlayCover.style.left = '0';
            overlayCover.style.width = '100%';
            overlayCover.style.height = '100%';
            overlayCover.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 透明黑色背景
            overlayCover.style.zIndex = '9998'; // 设置较低的z-index，确保覆盖悬浮窗
            document.body.appendChild(overlayCover);

            overlayCover.addEventListener('click', () => {
                // 当用户点击覆盖层时，移除悬浮窗和覆盖层
                document.body.removeChild(overlay);
                document.body.removeChild(overlayCover);
            });


            // 模拟异步加载悬浮窗内容
            fetch('https://raw.githubusercontent.com/Guyungy/AIGC-knowbase/main/civitai.md') // 替换为实际网页URL
                .then(response => response.text())
                .then(html => {
                    overlay.innerHTML = html;
                    // 在悬浮窗内容加载完毕后，添加点击事件
                    overlay.addEventListener('click', (event) => {
                        if (!overlay.contains(event.target)) {
                            document.body.removeChild(overlay);
                        }
                    });
                })
                .catch(error => {
                    overlay.innerHTML = '加载悬浮窗内容时出现错误。';
                });

            document.body.appendChild(overlay);
        });

        document.body.appendChild(aboutButton);
    }

    // 添加按钮
    addButton();

})();
