// ==UserScript==
// @name         哔哩哔哩专栏图片下载按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在哔哩哔哩专栏图片右上角显示下载原图按钮
// @author       Your Name
// @match        https://www.bilibili.com/opus/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533716/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/533716/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .download-button {
            background-color: rgba(255, 255, 255, 0.8);
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 5px;
            cursor: pointer;
            position: absolute;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);

    // 主功能函数
    function addDownloadButtons() {
        // 遍历所有图片
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // 检查是否已经添加过按钮
            if (img.dataset.hasDownloadButton) return;

            // 只匹配宽度大于300像素的图片
            if (img.width > 300) {
                // 标记已添加按钮
                img.dataset.hasDownloadButton = 'true';

                // 创建下载按钮
                const button = document.createElement('button');
                button.innerText = '下载原图';
                button.className = 'download-button';

                // 设置按钮点击事件
                button.onclick = async (event) => {
                    event.stopPropagation(); // 阻止事件冒泡，避免触发图片的点击事件
                    // 去掉@及其后面的字符串
                    const originalSrc = img.src.split('@')[0];
                    const fileName = originalSrc.substring(originalSrc.lastIndexOf('/') + 1); // 提取文件名
                    try {
                        const response = await fetch(originalSrc);
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;  // 设置下载文件名
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url); // 释放内存
                    } catch (error) {
                        console.error('下载失败:', error);
                    }
                };

                // 将按钮添加到页面
                document.body.appendChild(button);

                // 更新按钮位置函数
                const updateButtonPosition = () => {
                    const rect = img.getBoundingClientRect();
                    button.style.top = `${rect.top + window.scrollY - 30}px`; // 按钮位置在图片上方
                    button.style.left = `${rect.left + window.scrollX + rect.width - 65}px`; // 按钮位置在图片右侧
                };

                // 初始设置按钮位置
                updateButtonPosition();

                // 监听滚动和resize事件，更新按钮位置
                window.addEventListener('scroll', updateButtonPosition);
                window.addEventListener('resize', updateButtonPosition);

                // 当图片被移除时，也移除按钮和事件监听器
                const observer = new MutationObserver((mutations) => {
                    if (!document.body.contains(img)) {
                        button.remove();
                        window.removeEventListener('scroll', updateButtonPosition);
                        window.removeEventListener('resize', updateButtonPosition);
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    // 初始执行
    addDownloadButtons();

    // 使用MutationObserver监听动态加载的内容
    const observer = new MutationObserver(addDownloadButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();