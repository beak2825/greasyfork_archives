// ==UserScript==
// @name         提取百度网盘和磁力链接（追新番专用）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  一键提取追新番网页中的百度网盘链接、提取码和磁力链接，用于批量转存，支持一键复制
// @author       CNOS
// @match        https://*.fanxinzhui.com/rr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529944/%E6%8F%90%E5%8F%96%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%EF%BC%88%E8%BF%BD%E6%96%B0%E7%95%AA%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529944/%E6%8F%90%E5%8F%96%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%EF%BC%88%E8%BF%BD%E6%96%B0%E7%95%AA%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取百度网盘链接和提取码的函数
    function extractBaiduLinks() {
        const links = document.querySelectorAll('a[href*="pan.baidu.com/s/"]');
        const results = [];

        links.forEach(link => {
            const href = link.getAttribute('href');
            const passwordElement = link.parentElement.querySelector('.password');
            const password = passwordElement ? passwordElement.textContent.trim() : '';

            if (href && password) {
                results.push(`${href} ${password}`);
            } else if (href) {
                results.push(href);
            }
        });

        return results;
    }

    // 提取磁力链接的函数
    function extractMagnetLinks() {
        const links = document.querySelectorAll('a[href^="magnet:?"]');
        const results = [];

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                results.push(href);
            }
        });

        return results;
    }

    // 创建一个按钮用于触发提取操作
    const button = document.createElement('button');
    button.textContent = '提取百度盘和磁力链接';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '999999';
    button.style.padding = '5px 10px';
    button.style.fontSize = '14px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 添加按钮点击事件
    button.addEventListener('click', () => {
        const baiduLinks = extractBaiduLinks();
        const magnetLinks = extractMagnetLinks();

        if (baiduLinks.length === 0 && magnetLinks.length === 0) {
            alert('未找到百度网盘或磁力链接！');
            return;
        }

        // 在原页面中显示结果
        const resultDiv = document.createElement('div');
        resultDiv.id = 'extracted-links';
        resultDiv.style.position = 'fixed';
        resultDiv.style.top = '60px';
        resultDiv.style.right = '10px';
        resultDiv.style.width = '400px';
        resultDiv.style.maxHeight = '70vh';
        resultDiv.style.overflowY = 'auto';
        resultDiv.style.backgroundColor = '#f9f9f9';
        resultDiv.style.padding = '10px';
        resultDiv.style.border = '1px solid #ccc';
        resultDiv.style.borderRadius = '5px';
        resultDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        resultDiv.style.zIndex = '999998';

        const resultText = document.createElement('pre');
        resultText.style.whiteSpace = 'pre-wrap';
        resultText.style.wordWrap = 'break-word';

        let finalText = '';

        if (baiduLinks.length > 0) {
            finalText += '【百度网盘链接】\n' + baiduLinks.join('\n') + '\n\n';
        }

        if (magnetLinks.length > 0) {
            finalText += '【磁力链接】\n' + magnetLinks.join('\n');
        }

        resultText.textContent = finalText.trim();

        const copyButton = document.createElement('button');
        copyButton.textContent = '一键复制';
        copyButton.style.display = 'block';
        copyButton.style.margin = '10px 0';
        copyButton.style.padding = '5px 10px';
        copyButton.style.fontSize = '14px';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';

        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(finalText.trim());
                alert('已复制到剪贴板！');
            } catch (err) {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制内容。');
            }
        });

        resultDiv.appendChild(resultText);
        resultDiv.appendChild(copyButton);
        document.body.appendChild(resultDiv);
    });

    document.body.appendChild(button);
})();
