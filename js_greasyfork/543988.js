// ==UserScript==
// @name         Download VSPackage from VSCode Marketplace
// @name:zh-CN   从 VSCode 市场下载 VSPackage
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description        Adds a button to download the VSPackage from the VS Marketplace.
// @description:zh-CN  添加一个按钮来从 VS Marketplace 下载 VSPackage。
// @author       9540536
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543988/Download%20VSPackage%20from%20VSCode%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/543988/Download%20VSPackage%20from%20VSCode%20Marketplace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置与国际化 ---

    // 根据浏览器语言设置显示文本
    const isChinese = navigator.language.toLowerCase().startsWith('zh');
    const buttonText = isChinese ? '下载 VSPackage' : 'Download VSPackage';

    // 唯一的按钮ID，用于检查按钮是否存在
    const buttonId = 'vspackage-download-button-resilient';

    // --- 2. 从URL中解析关键信息 ---

    const urlParams = new URLSearchParams(window.location.search);
    const itemName = urlParams.get('itemName');

    // 如果URL中没有itemName参数，则脚本无法工作，直接停止
    if (!itemName) {
        console.error('VS Marketplace Downloader: Could not parse itemName from URL. Script stopped.');
        return;
    }
    const parts = itemName.split('.');
    const publisher = parts[0];
    const extensionName = parts.slice(1).join('.');

    // --- 3. 核心功能：检查并添加/修复按钮 (守护函数) ---

    // 使用XPath获取元素的辅助函数
    const getElementByXpath = (path) => {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    };

    function ensureButtonExists() {
        // 如果按钮已存在，则什么都不做。这是此函数的关键，以避免不必要的DOM操作。
        if (document.getElementById(buttonId)) {
            return;
        }

        // XPath定位版本号和按钮应被添加的位置
        const versionXpath = '//*[@id="overviewTab"]/div/table/tbody/tr/td[2]/div[3]/div[5]/div/table/tbody/tr[1]/td[2]';
        const buttonLocationXpath = '//*[@id="section-banner"]/div/table/tbody/tr/td[2]/div/div[3]/div[1]/div/span[1]';

        const versionElement = getElementByXpath(versionXpath);
        const buttonLocationElement = getElementByXpath(buttonLocationXpath);

        // 只有当版本号和按钮位置都成功找到时，才继续
        if (versionElement && versionElement.textContent.trim() && buttonLocationElement) {
            const version = versionElement.textContent.trim();

            // 创建下载按钮
            const downloadButton = document.createElement('a');
            downloadButton.id = buttonId;
            downloadButton.textContent = buttonText;
            downloadButton.setAttribute('class', 'vscode-gallery-button'); // 沿用页面已有样式
            downloadButton.setAttribute('role', 'button');
            downloadButton.style.marginLeft = '10px';
            downloadButton.style.whiteSpace = 'nowrap'; // 防止按钮文本换行

            // 构建下载链接
            const targetUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extensionName}/${version}/vspackage`;
            downloadButton.href = targetUrl;
            downloadButton.target = '_blank'; // 在新标签页打开

            // 将按钮添加到页面中
            buttonLocationElement.parentNode.appendChild(downloadButton);
        }
    }

    // --- 4. 启动持续监控 ---

    // 监控整个document.body以应对任何位置的DOM重新渲染
    const observer = new MutationObserver(ensureButtonExists);
    observer.observe(document.body, {
        childList: true, // 监控子节点的增加/删除
        subtree: true    // 监控所有后代节点的变化
    });

    // 初始运行时也执行一次，以应对页面初始加载就已完整的情况
    setTimeout(ensureButtonExists, 500);

})();
