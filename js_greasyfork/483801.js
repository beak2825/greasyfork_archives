// ==UserScript==
// @name         磁力链接提取插件
// @author       观察君
// @namespace    http://www.futa404.org/
// @version      1.4
// @description  在网页内添加提取按钮，点击按钮后显示弹窗框包含该网页的磁力链接，并添加复制功能
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/483801/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/483801/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==





(function() {
    'use strict';

    // 在页面加载完成后执行
    window.addEventListener('load', function() {
        addExtractionButton();
    });

    // 添加提取按钮
    function addExtractionButton() {
        const extractionButton = document.createElement('button');
        extractionButton.textContent = '提取磁力链接';
        extractionButton.style.position = 'fixed';
        extractionButton.style.top = '50%';
        extractionButton.style.right = '10px';
        extractionButton.style.transform = 'translateY(-50%)';
        extractionButton.style.padding = '5px'; // 缩小一半
        extractionButton.style.backgroundColor = '#3498db';
        extractionButton.style.color = '#fff';
        extractionButton.style.border = 'none';
        extractionButton.style.borderRadius = '3px';
        extractionButton.style.cursor = 'pointer';
        extractionButton.addEventListener('click', extractAndDisplayMagnets);
        document.body.appendChild(extractionButton);
    }

    // 提取并显示磁力链接
    function extractAndDisplayMagnets() {
        // 获取页面内所有链接
        const allLinks = document.querySelectorAll('a');

        // 正则表达式匹配磁力链接
        const magnetRegex = /^magnet:\?xt=urn:btih:/i;

        // 存储提取到的磁力链接
        const extractedMagnets = [];

        // 遍历链接
        for (const link of allLinks) {
            const href = link.href;

            // 如果链接匹配磁力链接格式，则添加到提取列表
            if (magnetRegex.test(href)) {
                extractedMagnets.push(href);
            }
        }

        // 显示自适应弹窗框
        showMagnetsPopup(extractedMagnets);
    }

    // 显示自适应弹窗框
    function showMagnetsPopup(magnets) {
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.maxWidth = '90%'; // 设置最大宽度
        popupContainer.style.maxHeight = '90%'; // 设置最大高度
        popupContainer.style.overflow = 'auto'; // 允许滚动
        popupContainer.style.backgroundColor = '#fff';
        popupContainer.style.padding = '20px';
        popupContainer.style.border = '1px solid #ddd';
        popupContainer.style.zIndex = '9999';

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#3498db';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(popupContainer);
        });

        // 添加关闭按钮到弹窗框
        popupContainer.appendChild(closeButton);

        // 添加提取到的磁力链接到弹窗框
        magnets.forEach(magnet => {
            const magnetContainer = document.createElement('div');
            magnetContainer.textContent = magnet;

            // 添加复制按钮
            const copyButton = document.createElement('button');
            copyButton.textContent = '点击复制';
            copyButton.style.marginLeft = '10px';
            copyButton.style.padding = '5px 10px';
            copyButton.style.backgroundColor = '#2ecc71';
            copyButton.style.color = '#fff';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '3px';
            copyButton.style.cursor = 'pointer';
            copyButton.addEventListener('click', function() {
                copyTextToClipboard(magnet);
            });

            // 将复制按钮添加到磁力链接后面
            magnetContainer.appendChild(copyButton);
            popupContainer.appendChild(magnetContainer);
        });

        // 添加弹窗框到页面
        document.body.appendChild(popupContainer);
    }

    // 复制文本到剪贴板
    function copyTextToClipboard(text) {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.top = '-9999px';
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        alert('磁力链接已复制到剪贴板！');
    }
})();
