// ==UserScript==
// @name         VS Code Extension Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 VS Code Marketplace 页面添加直接下载按钮
// @author       Trae AI
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527284/VS%20Code%20Extension%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527284/VS%20Code%20Extension%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function init() {
        // 获取 itemName 参数
        const urlParams = new URLSearchParams(window.location.search);
        const itemName = urlParams.get('itemName');
        if (!itemName) return;

        // 分割 publisher 和 extension 名称
        const [publisher, extension] = itemName.split('.');

        // 创建下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = '下载最新版本';
        downloadButton.style.cssText = `
            background-color: #0078d4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;

        // 点击事件处理
        downloadButton.addEventListener('click', async () => {
            // 跳转到版本历史页面
            window.location.hash = 'version-history';

            // 等待版本历史表格加载
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 获取最新版本号
            const versionCell = document.querySelector('.version-history-table-body .version-history-container-row:first-child .version-history-container-column:first-child');
            if (!versionCell) {
                alert('无法获取版本号');
                return;
            }

            const version = versionCell.textContent.trim();
            const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

            // 创建下载
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${itemName}-${version}.vsix`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // 添加按钮到页面
        document.body.appendChild(downloadButton);
    }

    // 启动脚本
    init();
})();