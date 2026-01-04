// ==UserScript==
// @name         LIB集成
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  生成下载按钮以获取文件内容、抓取内容、综合功能
// @author       huangyan
// @license      MIT
// @match        https://www.liblib.art/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502144/LIB%E9%9B%86%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/502144/LIB%E9%9B%86%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待网页完全加载
    window.addEventListener('load', function() {
        let content = '';

        // 获取第二个目标内容的div元素（ModelDetailCard）
        const detailDivs = document.querySelectorAll('.ModelDetailCard_item__8_inw');
        if (detailDivs.length > 0) {
            // 抓取第二个div中的触发词
            detailDivs.forEach(div => {
                const triggerTexts = div.querySelectorAll('.ModelDetailCard_triggerTxt__cKZOL');
                triggerTexts.forEach(trigger => {
                    content += trigger.innerText + '\n';
                });
            });
        }

        // 获取第一个目标内容的div元素（ModelDescription）
        const descriptionDiv = document.querySelector('.ModelDescription_desc__EoTMz');
        if (descriptionDiv) {
            // 抓取第一个div中的所有文本内容
            const descriptionParagraphs = descriptionDiv.querySelectorAll('p');
            descriptionParagraphs.forEach((para) => {
                content += para.innerText + '\n';
            });
        }

        // 获取文件名部分的文本信息
        const titleElement = document.querySelector('.ModelInfoHead_title__p5txd');

        // 确定文件名
        let fileName = '抓取内容.txt'; // 默认文件名

        const updateFileName = () => {
            const activeTab = document.querySelector('.ant-tabs-tab-active .vipUsedWrap');
            if (titleElement && activeTab) {
                fileName = `${titleElement.textContent.trim()}_${activeTab.textContent.trim()}.txt`;
            }
        };

        // 初始更新文件名
        updateFileName();

        if (content) {
            // 获取当前网页的网址
            const currentUrl = window.location.href;
            // 在内容结尾添加网址
            content += `\n\n当前网址: ${currentUrl}`;

            // 创建并添加抓取内容的下载按钮
            const scrapeButton = document.createElement('button');
            scrapeButton.textContent = '下载文本内容';
            scrapeButton.style.position = 'fixed';
            scrapeButton.style.top = '10px';
            scrapeButton.style.right = '10px';
            scrapeButton.style.padding = '10px';
            scrapeButton.style.backgroundColor = '#007bff';
            scrapeButton.style.color = '#fff';
            scrapeButton.style.border = 'none';
            scrapeButton.style.borderRadius = '5px';
            scrapeButton.style.cursor = 'pointer';
            scrapeButton.style.zIndex = '9999'; // 确保按钮位于最上层

            // 处理按钮点击事件
            scrapeButton.addEventListener('click', () => {
                // 更新文件名
                updateFileName();

                // 下载抓取内容
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const contentUrl = URL.createObjectURL(blob);

                // 创建一个隐藏的下载链接
                const contentLink = document.createElement('a');
                contentLink.href = contentUrl;
                contentLink.download = fileName; // 使用文件名
                contentLink.style.display = 'none';

                // 触发下载
                document.body.appendChild(contentLink);
                contentLink.click();

                // 清理
                document.body.removeChild(contentLink);
                URL.revokeObjectURL(contentUrl);
            });

            // 将抓取内容按钮添加到页面
            document.body.appendChild(scrapeButton);
        } else {
            console.log('未找到指定的内容');
        }

        // 获取下载按钮并创建新的下载按钮
        const downloadButtonDiv = document.querySelector('.ModelActionCard_downModel__Y8X5X');
        if (downloadButtonDiv) {
            // 创建并添加下载文件按钮
            const downloadFileButton = document.createElement('button');
            downloadFileButton.textContent = '下载文件';
            downloadFileButton.style.position = 'fixed';
            downloadFileButton.style.top = '50px';
            downloadFileButton.style.right = '10px';
            downloadFileButton.style.padding = '10px';
            downloadFileButton.style.backgroundColor = '#28a745';
            downloadFileButton.style.color = '#fff';
            downloadFileButton.style.border = 'none';
            downloadFileButton.style.borderRadius = '5px';
            downloadFileButton.style.cursor = 'pointer';
            downloadFileButton.style.zIndex = '9999'; // 确保按钮位于最上层

            // 处理按钮点击事件
            downloadFileButton.addEventListener('click', () => {
                // 触发下载按钮点击事件
                const existingButton = downloadButtonDiv.querySelector('i');
                if (existingButton) {
                    existingButton.click();
                }
            });

            // 将下载文件按钮添加到页面
            document.body.appendChild(downloadFileButton);
        } else {
            console.log('未找到文件下载按钮');
        }

        // 创建并添加综合下载按钮
        const combinedButton = document.createElement('button');
        combinedButton.textContent = '下载文本内容和文件';
        combinedButton.style.position = 'fixed';
        combinedButton.style.top = '90px';
        combinedButton.style.right = '10px';
        combinedButton.style.padding = '10px';
        combinedButton.style.backgroundColor = '#dc3545';
        combinedButton.style.color = '#fff';
        combinedButton.style.border = 'none';
        combinedButton.style.borderRadius = '5px';
        combinedButton.style.cursor = 'pointer';
        combinedButton.style.zIndex = '9999'; // 确保按钮位于最上层

        // 处理综合按钮点击事件
        combinedButton.addEventListener('click', () => {
            // 更新文件名
            updateFileName();

            // 下载抓取内容
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const contentUrl = URL.createObjectURL(blob);

            // 创建一个隐藏的下载链接
            const contentLink = document.createElement('a');
            contentLink.href = contentUrl;
            contentLink.download = fileName; // 使用文件名
            contentLink.style.display = 'none';

            // 触发下载
            document.body.appendChild(contentLink);
            contentLink.click();

            // 清理
            document.body.removeChild(contentLink);
            URL.revokeObjectURL(contentUrl);

            // 下载文件
            const downloadButtonDiv = document.querySelector('.ModelActionCard_downModel__Y8X5X');
            if (downloadButtonDiv) {
                const existingButton = downloadButtonDiv.querySelector('i');
                if (existingButton) {
                    existingButton.click();
                }
            } else {
                console.log('未找到文件下载按钮');
            }
        });

        // 将综合下载按钮添加到页面
        document.body.appendChild(combinedButton);

        // 监听选项卡变化以更新文件名
        const tabContainer = document.querySelector('.ant-tabs-nav-list');
        if (tabContainer) {
            const observer = new MutationObserver(() => {
                updateFileName();
            });
            observer.observe(tabContainer, { childList: true, subtree: true });

            // 处理初始选项卡的文件名更新
            updateFileName();
        }
    }, false);
})();
