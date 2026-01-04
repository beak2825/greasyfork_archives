// ==UserScript==
// @name         pinco导出题库脚本
// @namespace    http://pinco.seewo.com/
// @version      1.6
// @description  捕获目标请求并导出题库为JSON/MD文件，同时下载所有图片
// @author       YourName
// @match        *://pinco.seewo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535211/pinco%E5%AF%BC%E5%87%BA%E9%A2%98%E5%BA%93%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/535211/pinco%E5%AF%BC%E5%87%BA%E9%A2%98%E5%BA%93%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedData = {};  // 用于存储捕获的数据
    const IMAGE_FOLDER = 'images'; // 图片保存的文件夹名称

    // 监听 XMLHttpRequest 请求
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (url.includes('actionName=GetV1StudenthomeworkByStudentHomeworkIdQuestions')) {
            this.addEventListener('load', function() {
                if (this.status === 200) {
                    try {
                        capturedData = this.response;
                        console.log('Captured JSON Data:', capturedData);
                    } catch (e) {
                        console.error('Failed to capture JSON data', e);
                    }
                }
            });
        }
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    // 使用 fetch 拦截请求
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        console.log('Intercepted fetch request:', args[0]);

        if (args[0].includes('actionName=GetV1StudenthomeworkByStudentHomeworkIdQuestions')) {
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();
            capturedData = data;
            console.log('Captured JSON Data from fetch:', capturedData);
        }
        return response;
    };

    // 生成 Markdown 内容
    function generateMarkdown(data, imageMap = {}) {
        let mdContent = '# 作业题目\n\n';

        // 处理单选题
        if (data.singleChoices && data.singleChoices.length > 0) {
            mdContent += '## 单选题\n\n';
            data.singleChoices.forEach((question, index) => {
                mdContent += `### ${index + 1}. (${question.standardScore}分)\n\n`;

                // 处理题干内容，替换HTML标签
                let content = question.content
                    .replace(/<p>/g, '')
                    .replace(/<\/p>/g, '\n')
                    .replace(/<br\/>/g, '\n');

                // 替换题干中的图片链接为本地路径
                const contentImages = content.match(/<img[^>]*src="([^"]*)"/g) || [];
                contentImages.forEach(img => {
                    const imgUrl = img.match(/src="([^"]*)"/)[1];
                    const localPath = imageMap[imgUrl] || imgUrl;
                    content = content.replace(img, `![题目图片](${localPath})`);
                });

                mdContent += `${content}\n\n`;

                // 处理选项
                question.optionItems.forEach(option => {
                    let optionContent = option.content
                        .replace(/<p>/g, '')
                        .replace(/<\/p>/g, '')
                        .replace(/<br\/>/g, '\n');

                    // 替换选项中的图片链接为本地路径
                    const optionImages = optionContent.match(/<img[^>]*src="([^"]*)"/g) || [];
                    optionImages.forEach(img => {
                        const imgUrl = img.match(/src="([^"]*)"/)[1];
                        const localPath = imageMap[imgUrl] || imgUrl;
                        optionContent = optionContent.replace(img, `![选项图片](${localPath})`);
                    });

                    mdContent += `- ${option.option}. ${optionContent}\n`;
                });

                // 添加正确答案
                mdContent += `\n**正确答案：${question.standardSolution}**\n\n`;

                // 如果有解析，添加解析
                if (question.analyze) {
                    mdContent += `**解析：**\n${question.analyze.replace(/<[^>]+>/g, '')}\n\n`;
                }
            });
        }

        // 处理多选题
        if (data.multipleChoices && data.multipleChoices.length > 0) {
            // 可以按照类似单选题的方式处理
        }

        // 处理判断题
        if (data.trueOrFalses && data.trueOrFalses.length > 0) {
            mdContent += '## 判断题\n\n';
            data.trueOrFalses.forEach((question, index) => {
                mdContent += `### ${index + 1}. (${question.standardScore}分)\n\n`;
                mdContent += `${question.content.replace(/<[^>]+>/g, '')}\n\n`;
                mdContent += `**正确答案：${question.standardSolution === 'T' ? '正确' : '错误'}**\n\n`;
                if (question.analyze) {
                    mdContent += `**解析：**\n${question.analyze.replace(/<[^>]+>/g, '')}\n\n`;
                }
            });
        }

        return mdContent;
    }

    // 收集图片函数
    function collectImages(data) {
        const images = new Set();

        if (data && typeof data === 'object') {
            const searchForImages = (obj) => {
                if (typeof obj === 'string') {
                    const imgMatches = [
                        ...obj.matchAll(/src="(https:\/\/[^"]+)"/g),
                        ...obj.matchAll(/src='(https:\/\/[^']+)'/g),
                        ...obj.matchAll(/"rich-img-[^"]*" class="rich-img" src="([^"]+)"/g),
                        ...obj.matchAll(/"rich-formula-[^"]*" class="rich-formula" src="([^"]+)"/g)
                    ];

                    imgMatches.forEach(match => {
                        const url = match[1];
                        if (url.startsWith('https://')) {
                            images.add(url);
                        }
                    });
                } else if (Array.isArray(obj)) {
                    obj.forEach(item => searchForImages(item));
                } else if (obj && typeof obj === 'object') {
                    Object.values(obj).forEach(value => searchForImages(value));
                }
            };

            searchForImages(data);
        }

        return images;
    }

    // 下载图片并返回本地路径映射
    async function downloadImages() {
        if (Object.keys(capturedData).length === 0) {
            console.log('No data to download images');
            return {};
        }

        const images = collectImages(capturedData);
        console.log(`Found ${images.size} images to download`);

        const imageMap = {};
        let downloadCount = 0;

        for (const src of images) {
            try {
                const response = await fetch(src);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;

                const filename = src.split('/').pop();
                const extension = filename.includes('.') ? '' : '.png'; // Ensure file extension
                const localPath = `${filename}${extension}`;
                imageMap[src] = localPath;

                link.download = filename;
                link.click();

                URL.revokeObjectURL(url);
                downloadCount++;
                console.log(`Successfully downloaded image ${downloadCount}/${images.size}: ${filename}`);

                await new Promise(resolve => setTimeout(resolve, 1));
            } catch (err) {
                console.error(`Failed to download image: ${src}`, err);
            }
        }

        console.log(`Download completed. Successfully downloaded ${downloadCount} images.`);
        return imageMap;
    }

    // 导出 JSON 数据
    function exportCapturedData() {
        if (Object.keys(capturedData).length === 0) {
            console.log('No data to export');
            return;
        }
        const blob = new Blob([JSON.stringify(capturedData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'captured_data.json';
        link.click();
        URL.revokeObjectURL(link.href);
        console.log('Exported JSON file');
    }

    // 导出 Markdown 文件
    async function exportMarkdown() {
        if (Object.keys(capturedData).length === 0) {
            console.log('No data to export');
            return;
        }

        // 先下载图片并获取图片映射
        const imageMap = await downloadImages();

        // 生成 Markdown 内容
        const mdContent = generateMarkdown(capturedData.data, imageMap);

        // 导出 Markdown 文件
        const blob = new Blob([mdContent], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'homework.md';
        link.click();
        URL.revokeObjectURL(link.href);
        console.log('Exported Markdown file');
    }

    // 创建按钮
    function createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '20px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';

        const exportJsonButton = document.createElement('button');
        exportJsonButton.textContent = 'Export JSON';
        exportJsonButton.style.padding = '10px';
        exportJsonButton.style.backgroundColor = 'blue';
        exportJsonButton.style.color = 'white';
        exportJsonButton.style.border = 'none';
        exportJsonButton.style.cursor = 'pointer';
        exportJsonButton.addEventListener('click', exportCapturedData);
        buttonContainer.appendChild(exportJsonButton);

        const exportMdButton = document.createElement('button');
        exportMdButton.textContent = 'Export Markdown';
        exportMdButton.style.padding = '10px';
        exportMdButton.style.backgroundColor = 'green';
        exportMdButton.style.color = 'white';
        exportMdButton.style.border = 'none';
        exportMdButton.style.cursor = 'pointer';
        exportMdButton.addEventListener('click', exportMarkdown);
        buttonContainer.appendChild(exportMdButton);

        document.body.appendChild(buttonContainer);
    }

    // 页面加载时，添加按钮
    window.addEventListener('load', () => {
        createButtons();
    });

})();
