// ==UserScript==
// @name         BCOI Problem Content to PDF (Print Preview)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  将 BCOI 问题内容通过打印预览导出为 PDF
// @description  Add a copy button to code blocks with improved styling
// @author       Y.V
// @license      AGPL-3.0-or-later
// @match        https://www.bcoi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522288/BCOI%20Problem%20Content%20to%20PDF%20%28Print%20Preview%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522288/BCOI%20Problem%20Content%20to%20PDF%20%28Print%20Preview%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取问题内容容器
        const problemContentContainer = document.querySelector('div.problem-content-container');
        if (!problemContentContainer) return;

        // 创建下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.innerText = '导出 PDF';
        downloadButton.style.position = 'fixed';
        downloadButton.style.right = '20px';
        downloadButton.style.top = '20px';
        downloadButton.style.zIndex = 1000;
        downloadButton.style.padding = '10px';
        downloadButton.style.backgroundColor = '#007bff';
        downloadButton.style.color = '#fff';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';

        // 添加按钮到页面
        document.body.appendChild(downloadButton);

        // 按钮点击事件
        downloadButton.addEventListener('click', function() {
            // 创建一个新的 iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            // 将问题内容复制到 iframe 中
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <!DOCTYPE html>
                <html lang="zh-CN">
                <head>
                    <meta charset="UTF-8">
                    <title>问题内容</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .problem-content-container { margin: 20px; }
                    </style>
                </head>
                <body>
                    <div class="problem-content-container">${problemContentContainer.innerHTML}</div>
                </body>
                </html>
            `);
            iframeDoc.close();

            // 等待 iframe 内容加载完成
            iframe.onload = function() {
                // 触发打印预览
                iframe.contentWindow.print();

                // 移除 iframe
                document.body.removeChild(iframe);
            };
        });
    });
})();