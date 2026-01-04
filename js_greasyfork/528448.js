// ==UserScript==
// @name         VS Marketplace Direct Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在VS Code Marketplace页面添加直接下载链接
// @author       github.com/citizenll
// @match        https://marketplace.visualstudio.com/items*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528448/VS%20Marketplace%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/528448/VS%20Marketplace%20Direct%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(addDownloadLink, 1000);
    });

    function addDownloadLink() {
        // 获取版本号
        const versionElement = document.querySelector('td[role="definition"][aria-labelledby="version"]');
        if (!versionElement) {
            console.log('未找到版本号元素');
            return;
        }

        const version = versionElement.textContent.trim();
        console.log('找到版本号:', version);

        // 从URL中获取发布者和扩展名
        const url = window.location.href;
        const match = url.match(/items\?itemName=([^.]+)\.([^&]+)/);
        if (!match) {
            console.log('无法从URL解析发布者和扩展名');
            return;
        }

        const publisher = match[1];
        const extension = match[2];

        // 构建下载链接
        const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

        // 查找Resources列表
        const resourcesList = document.querySelector('.ux-section-resources ul');
        if (!resourcesList) {
            console.log('未找到Resources列表');
            return;
        }

        // 创建新的列表项
        const downloadLi = document.createElement('li');
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.target = '_blank';
        downloadLink.textContent = '直接下载';
        downloadLi.appendChild(downloadLink);

        // 添加到列表末尾
        resourcesList.appendChild(downloadLi);
        console.log('已添加下载链接');
    }
})();