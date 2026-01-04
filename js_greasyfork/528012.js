// ==UserScript==
// @name         e-hentai 连续阅读模式（黑色主题）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在 e-hentai 上启用连续阅读模式，并强制启用黑色主题。
// @author       776lucky
// @match        https://e-hentai.org/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528012/e-hentai%20%E8%BF%9E%E7%BB%AD%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%EF%BC%88%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528012/e-hentai%20%E8%BF%9E%E7%BB%AD%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%EF%BC%88%E9%BB%91%E8%89%B2%E4%B8%BB%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局黑色背景 + 文字白色
    document.documentElement.style.backgroundColor = "#000"; // 设置整个 HTML 的背景色
    document.body.style.backgroundColor = "#000"; // 设置 body 背景色
    document.body.style.color = "#fff"; // 文字颜色设为白色
    document.body.style.margin = "0"; // 移除默认边距

    // 获取画廊内所有图片页面的链接
    const pageLinks = Array.from(document.querySelectorAll('#gdt a')).map(a => a.href);

    // 清空页面内容
    const contentDiv = document.querySelector('#gdt');
    contentDiv.innerHTML = '';

    // 设置样式以适应连续阅读
    contentDiv.style.display = 'flex';
    contentDiv.style.flexDirection = 'column';
    contentDiv.style.alignItems = 'center';
    contentDiv.style.width = "100%";
    contentDiv.style.maxWidth = "1200px"; // 最大宽度，避免过宽
    contentDiv.style.margin = "auto"; // 居中显示

    // 创建并添加新的图片元素
    pageLinks.forEach((url, index) => {
        // 创建占位符
        const placeholder = document.createElement('div');
        placeholder.textContent = `正在加载第 ${index + 1} 页...`;
        placeholder.style.color = "#fff"; // 文字白色
        placeholder.style.marginBottom = '20px';
        contentDiv.appendChild(placeholder);

        // 获取每个图片页面的实际图片
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const img = doc.querySelector('#img');

                if (img) {
                    const newImg = document.createElement('img');
                    newImg.src = img.src;
                    newImg.style.width = 'auto';
                    newImg.style.maxWidth = '100%';
                    newImg.style.marginBottom = '20px';
                    newImg.style.backgroundColor = "transparent"; // 确保图片背景透明
                    newImg.style.display = "block"; // 防止 inline 样式影响
                    newImg.style.boxShadow = "0px 0px 20px rgba(255, 255, 255, 0.2)"; // 轻微阴影，增强可读性

                    // 替换占位符
                    contentDiv.replaceChild(newImg, placeholder);
                } else {
                    placeholder.textContent = `第 ${index + 1} 页加载失败。`;
                }
            })
            .catch(() => {
                placeholder.textContent = `第 ${index + 1} 页加载失败。`;
            });
    });

    // 隐藏非必要的元素（头部 & 尾部）
    const header = document.querySelector('#nb');
    const footer = document.querySelector('#fb');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';

})();
