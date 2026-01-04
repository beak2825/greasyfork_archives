// ==UserScript==
// @name         智慧教育平台PDF获取
// @version      0.0.1
// @description  自动获取中小学智慧教育平台电子教材的PDF URL
// @match        https://basic.smartedu.cn/*
// @author       白弹汲
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @icon         https://basic.smartedu.cn/favicon.ico
// @license      AGPL-3.0  
// @namespace https://greasyfork.org/users/1128263
// @downloadURL https://update.greasyfork.org/scripts/471028/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0PDF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/471028/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0PDF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮并添加到页面上
    const createButton = () => {
        // 检查当前页面是否为目标页面
        const regex = /\/pdfjs\/.+/;
        if (regex.test(window.location.href)) {
            const button = document.createElement('button');
            button.textContent = '获取 PDF URL';
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.right = '10px';
            button.style.zIndex = '9999';
            button.addEventListener('click', filterPDFUrl);
            document.body.appendChild(button);
        }
    };

    // 筛选PDF URL并弹出窗口显示结果
    const filterPDFUrl = () => {
        const requests = performance.getEntriesByType('resource');
        let filteredUrl = null;

        for (const request of requests) {
            if (request.name.includes('pdf.pdf')) {
                const originalUrl = request.name;
                const modifiedUrl = originalUrl.replace('-private', '');
                filteredUrl = modifiedUrl;
                break;
            }
        }

        if (filteredUrl) {
            GM_setClipboard(filteredUrl);
            window.alert('URL已被复制到剪贴板内:\n' + filteredUrl);
            window.open(filteredUrl, '_blank');
        } else {
            window.alert('找不到 PDF URL.');
        }
    };

    // 初始化脚本
    const initScript = () => {
        createButton();
        GM_addStyle(`
            button {
                color: #fff;
                background-color: #09AAFF;
                border: none;
                border-radius: 4px;
                padding: 10px;
            }
        `);
    };

    // 当页面加载完成时运行脚本
    window.addEventListener('load', initScript);
})();
