// ==UserScript==
// @name         GitHub 图片 URL 重定向并添加复制按钮
// @namespace    https://github.com/
// @version      0.2
// @description  将 GitHub 图片 URL 重定向为原始格式，并在图片上添加复制按钮
// @author       QING-XIAO
// @match        https://github.com/*/*/blob/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/532059/GitHub%20%E5%9B%BE%E7%89%87%20URL%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%B9%B6%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/532059/GitHub%20%E5%9B%BE%E7%89%87%20URL%20%E9%87%8D%E5%AE%9A%E5%90%91%E5%B9%B6%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    const currentUrl = window.location.href;

    // 使用正则表达式提取仓库名、分支名和文件路径
    const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/;
    const match = currentUrl.match(regex);

    if (match) {
        const username = match[1];
        const repoName = match[2];
        const branchName = match[3];
        const filePath = match[4];

        // 构建原始图片的 URL
        const rawUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${branchName}/${filePath}`;

        // 查找页面中的所有图片元素
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // 获取图片的 src 属性
            const imgSrc = img.src;

            // 如果图片的 src 包含当前仓库和分支的信息
            if (imgSrc.includes(`github.com/${username}/${repoName}/blob/${branchName}`)) {
                // 将图片的 src 替换为原始图片的 URL
                img.src = rawUrl;

                // 创建复制按钮
                const copyButton = document.createElement('button');
                copyButton.textContent = '复制 URL';
                copyButton.style.position = 'absolute';
                copyButton.style.top = '0';
                copyButton.style.left = '0';
                copyButton.style.zIndex = '1000';
                copyButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                copyButton.style.color = '#fff';
                copyButton.style.border = 'none';
                copyButton.style.padding = '5px';
                copyButton.style.cursor = 'pointer';

                // 将按钮添加到图片的父元素
                img.parentElement.style.position = 'relative';
                img.parentElement.appendChild(copyButton);

                // 添加点击事件，复制 URL 到剪贴板
                copyButton.addEventListener('click', () => {
                    GM_setClipboard(rawUrl);
                    alert('URL 已复制到剪贴板');
                });
            }
        });
    } else {
        console.warn('未能从 URL 中提取仓库信息');
    }
})();