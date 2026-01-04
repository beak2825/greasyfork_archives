// ==UserScript==
// @name         CosJiang图片自动加载
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动加载cosjiang.com网站的所有图片，避免重复，并屏蔽特定内容
// @author       0dUiK
// @match        https://www.cosjiang.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515844/CosJiang%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/515844/CosJiang%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // 首先移除 content-hidden 的 div
        const hiddenDivs = document.querySelectorAll('.content-hidden');
        hiddenDivs.forEach(div => div.remove());

        // 获取标题中的图片总数
        const title = document.title;
        const match = title.match(/(\d+)[pP]/);
        if (!match) return;

        const totalImages = parseInt(match[1]);
        if (!totalImages) return;

        // 收集页面上已存在的图片URL
        const existingImages = new Set();
        const images = document.querySelectorAll('img');
        let baseUrl = '';

        for (const img of images) {
            if (img.src.includes('/wp-content/uploads/') && img.src.includes('.jpg')) {
                existingImages.add(img.src);
                // 获取基础URL（仅从第一个匹配的图片获取）
                if (!baseUrl) {
                    baseUrl = img.src.replace(/-\d+\.jpg$/, '').replace(/\.jpg$/, '');
                }
            }
        }

        if (!baseUrl) return;

        // 创建图片容器
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; padding: 20px;';

        // 查找合适的插入位置
        const articleContent = document.querySelector('.entry-content');
        if (!articleContent) return;

        // 添加提示信息
        const info = document.createElement('div');
        info.style.cssText = 'padding: 10px; background: #f0f0f0; margin: 10px 0;';
        info.textContent = `正在加载额外图片...（总数：${totalImages}张）`;
        articleContent.appendChild(info);

        articleContent.appendChild(container);

        // 记录新加载的图片数量
        let newImagesCount = 0;

        // 加载未出现的图片
        for (let i = 0; i < totalImages; i++) {
            const imgUrl = i === 0 ? `${baseUrl}.jpg` : `${baseUrl}-${i}.jpg`;

            // 如果图片已经存在，跳过
            if (existingImages.has(imgUrl)) {
                continue;
            }

            newImagesCount++;

            const imgWrapper = document.createElement('div');
            imgWrapper.style.cssText = 'flex: 0 0 auto; max-width: 100%;';

            const img = document.createElement('img');
            img.src = imgUrl;
            img.style.cssText = 'max-width: 100%; height: auto;';
            img.loading = 'lazy'; // 启用延迟加载

            // 添加加载错误处理
            img.onerror = function() {
                imgWrapper.remove();
                newImagesCount--;
                updateInfo();
            };

            imgWrapper.appendChild(img);
            container.appendChild(imgWrapper);
        }

        function updateInfo() {
            info.textContent = `已加载剩余 ${newImagesCount} 张新图片（总数：${totalImages}张）`;
        }

        // 初始更新信息
        updateInfo();

        // 添加观察器，以防有新的 content-hidden div 被动态添加
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('content-hidden')) {
                        node.remove();
                    }
                });
            });
        });

        // 配置观察器
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();