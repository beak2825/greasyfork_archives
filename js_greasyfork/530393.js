// ==UserScript==
// @name         VSCode Marketplace Download Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为Visual Studio Code Marketplace插件添加直接下载链接
// @author       Your Name
// @match        https://marketplace.visualstudio.com/*
// @icon         https://marketplace.visualstudio.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530393/VSCode%20Marketplace%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/530393/VSCode%20Marketplace%20Download%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        // 等待关键元素加载
        const identifierElement = document.querySelector('#unique-identifier');
        const versionElement = document.querySelector('#version');
        const resourcesList = document.querySelector('.ux-section-resources ul');

        if (!identifierElement || !versionElement || !resourcesList) return;

        try {
            // 提取插件信息
            const identifier = identifierElement.nextElementSibling.innerText.split('.');
            const version = versionElement.nextElementSibling.innerText;

            // 构建下载链接
            const vsixUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${
                identifier[0]}/vsextensions/${identifier[1]}/${version}/vspackage`;

            // 创建下载按钮
            const li = document.createElement('li');
            li.innerHTML = `<a href="${vsixUrl}" class="ux-button ux-button-primary" style="margin-top:8px">
                               <span class="ux-button-text">Download VSIX</span>
                            </a>`;

            // 添加到资源列表
            resourcesList.appendChild(li);
        } catch (error) {
            console.error('Failed to add download button:', error);
        }
    }

    // 使用MutationObserver检测DOM变化
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('#unique-identifier')) {
            observer.disconnect();
            addDownloadButton();
        }
    });

    // 开始观察页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();