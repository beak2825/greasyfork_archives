// ==UserScript==
// @name         CAU在线教育综合平台PDF课件下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测网页中的PDF文件并提供下载按钮
// @author       chatgpt
// @match        https://jx.cau.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528452/CAU%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E7%BB%BC%E5%90%88%E5%B9%B3%E5%8F%B0PDF%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/528452/CAU%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E7%BB%BC%E5%90%88%E5%B9%B3%E5%8F%B0PDF%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测页面中是否有PDF文件的iframe
    const pdfIframe = document.getElementById('pdfIframe');
    if (pdfIframe) {
        // 从iframe中提取PDF文件的URL
        const urlString = pdfIframe.src;
        const urlParams = new URLSearchParams(urlString.split('?')[1]);
        const fileUrl = decodeURIComponent(urlParams.get('file'));

        // 创建下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.innerText = '下载PDF文件';
        downloadButton.style.position = 'fixed';
        downloadButton.style.top = '10px';
        downloadButton.style.right = '10px';
        downloadButton.style.zIndex = '1000';
        downloadButton.style.padding = '10px';
        downloadButton.style.backgroundColor = '#4CAF50';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.cursor = 'pointer';

        // 按钮点击事件，下载PDF文件
        downloadButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'document.pdf'; // 默认下载时的文件名
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        // 添加下载按钮到页面
        document.body.appendChild(downloadButton);
    }
})();