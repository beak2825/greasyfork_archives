// ==UserScript==
// @name         VS Code Extension Download Helper
// @name:zh-CN   VS Code 插件下载助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description        Add download buttons in the VS Code Marketplace.
// @description:zh-CN  在VS Code插件市场添加下载按钮
// @author       Zeabin
// @match        https://marketplace.visualstudio.com/items?*
// @run-at       document-end
// @icon         https://marketplace.visualstudio.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535668/VS%20Code%20Extension%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/535668/VS%20Code%20Extension%20Download%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 详情页创建下载按钮
    function createDownloadButton() {
        try {
            // 获取插件标识符
            const params = new URLSearchParams(window.location.search);
            const itemName = params.get('itemName');
            const identifier = itemName.split('.');

            // 获取版本号
            const versionElement = document.querySelector('#version') || document.querySelector('#Version');
            if (!versionElement) {
                return;
            }
            const version = versionElement.nextElementSibling.innerText;

            // 构建下载URL
            const vsix_url = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${identifier[0]}/vsextensions/${identifier[1]}/${version}/vspackage`;
            console.log("下载链接：", vsix_url);

            // 查找资源列表
            const resourceList = document.querySelector('.ux-section-resources ul');
            if (!resourceList) {
                console.warn('未找到资源列表');
                return;
            }

            // 创建下载按钮
            const downloadItem = document.createElement('li');
            const downloadLink = document.createElement('a');
            downloadLink.href = vsix_url;
            downloadLink.textContent = 'Download VSIX';

            downloadItem.appendChild(downloadLink);
            resourceList.appendChild(downloadItem);

        } catch (error) {
            console.error('脚本执行出错:', error);
        }
    }

    // 历史版本注入下载按钮
    function injectButtons(container) {
        const params = new URLSearchParams(window.location.search);
        const itemName = params.get('itemName');
        const identifier = itemName.split('.');

        const items = container.querySelectorAll(config.versionItem);
        items.forEach(item => {
            if (item.querySelector('.vsix-download-btn')) return;

            const versionElement = item.querySelector(config.versionText);
            const version = versionElement?.innerText.trim();
            if (!version) return;

            if (identifier.length < 2) return;

            // 构建下载URL
            const vsixUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${identifier[0]}/vsextensions/${identifier[1]}/${version}/vspackage`;

            // 创建按钮
            let column = null;
            if (version == "Version") {
                column = document.createElement('th');
                column.className = 'vsix-download-btn';
                column.textContent = 'Operation';
            } else {
                column = document.createElement('td');
                column.className = 'vsix-download-btn';
                const downloadLink = document.createElement('a');
                downloadLink.href = vsixUrl;
                downloadLink.textContent = 'Download';
                column.appendChild(downloadLink);
            }

            // 插入到版本条目
            const textContainer = versionElement.parentElement;
            if (textContainer) {
                textContainer.appendChild(column);
            }
        });
    }

    // 监听配置
    const config = {
        versionContainer: '.version-history-table', // 版本列表容器选择器
        versionItem: '.version-history-container-row', // 单个版本条目选择器
        versionText: '.version-history-container-column', // 版本号元素选择器
        observerOptions: { // MutationObserver 配置
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        }
    };

    // 主控制器
    function init() {
        let observer;

        // 动态加载检测
        const checkAndInject = () => {
            const container = document.querySelector(config.versionContainer);
            if (container && !container.dataset.injected) {
                container.dataset.injected = 'true';
                injectButtons(container);
            }
            const resourceList = document.querySelector('.ux-section-resources ul');
            if (resourceList && !resourceList.dataset.injected) {
                resourceList.dataset.injected = 'true';
                createDownloadButton();
            }
        };

        // 初始化观察者
        const startObserver = () => {
            observer = new MutationObserver(checkAndInject);
            observer.observe(document.body, config.observerOptions);
        };

        // 启动
        checkAndInject();
        startObserver();
    }

    // 启动脚本
    setTimeout(init, 1000);
})();
