// ==UserScript==
// @name         Magnet Link Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取页面中的所有磁力链接并保存为txt文件
// @author       Uiharu
// @include      https://*nyaa.si*
// @grant        none
// @license GNU
// @downloadURL https://update.greasyfork.org/scripts/528658/Magnet%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/528658/Magnet%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮
    const button = document.createElement('button');
    button.textContent = '下载磁力链接';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 将按钮添加到页面中
    document.body.appendChild(button);

    // 按钮点击事件
    button.addEventListener('click', () => {
        // 查找所有包含 magnet:?xt=urn:btih: 的链接
        const magnetLinks = [];
        const links = document.querySelectorAll('a[href^="magnet:?xt=urn:btih:"]');

        links.forEach(link => {
            magnetLinks.push(link.href);
        });

        // 如果没有找到磁力链接，提示用户
        if (magnetLinks.length === 0) {
            alert('未找到磁力链接');
            return;
        }

        // 获取页面标题，并清理标题中的非法文件名字符
        const pageTitle = document.title.replace(/[<>:"/\\|?*]/g, '_').trim() || 'magnet_links';
        const fileName = `${pageTitle}.txt`;

        // 将磁力链接保存为txt文件
        const blob = new Blob([magnetLinks.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        // 创建一个下载链接
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';

        // 将下载链接添加到页面中并触发点击
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // 清理
        URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);

        console.log(`磁力链接已保存到 ${fileName}`);
    });
})();