// ==UserScript==
// @name         双融双创社区文档下载
// @namespace    http://tampermonkey.net/
// @version      2025-05-16
// @description  检测页面导航中的常见文件类型URL并在页面上方生成下载按钮
// @author       somiceast
// @include      *://srsc.gdedu.gov.cn/*
// @include      *://file-srsc.gdedu.gov.cn/*
// @include      *://210.76.80.96/*
// @grant        none
// @icon         https://srsc.gdedu.gov.cn/favicon.ico
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/536163/%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E7%A4%BE%E5%8C%BA%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/536163/%E5%8F%8C%E8%9E%8D%E5%8F%8C%E5%88%9B%E7%A4%BE%E5%8C%BA%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

   /**
     * MIT License
     * 
     * Copyright (c) 2025 somiceast
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    // 检测页面导航中的URL
    const navUrl = window.performance.getEntriesByType('navigation')[0].name;

    // 定义常见的文件类型扩展名
    const fileExtensions =[
        // 文本文件
        ".txt", ".csv", ".json", ".xml", ".log",
        // 图像文件
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".svg",
        // 音频文件
        ".mp3", ".wav", ".ogg", ".aac", ".flac",
        // 视频文件
        ".mp4", ".avi", ".mkv", ".mov", ".flv",
        // 编程语言文件
        ".py", ".java", ".cpp", ".h", ".js", ".html", ".css", ".php",
        // 办公文档文件
        ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
        // 压缩文件
        ".zip", ".7z",
        // 其他文件类型
        ".iso", ".exe", ".dll", ".apk", ".ipa", ".db", ".sql"
    ];

    // 检查URL是否包含以常见文件类型结尾的链接
    if (navUrl.includes('url=https://')) {
        // 提取下载网址
        const downloadUrl = navUrl.split('url=')[1];

        // 检查是否以常见文件类型结尾
        const isSupportedFileType = fileExtensions.some(ext => downloadUrl.endsWith(ext));

        if (isSupportedFileType) {
            // 创建下载按钮
            const downloadButton = document.createElement('button');
            downloadButton.className = 'custom-button';
            downloadButton.textContent = '下载文件';
            downloadButton.style.position = 'fixed';
            downloadButton.style.top = '40px';
            downloadButton.style.right = '20px';
            downloadButton.style.width = '120px';
            downloadButton.style.height = '60px';
            downloadButton.style.fontSize = '20px';
            downloadButton.style.backgroundColor = 'red'; // 设置为红色
            downloadButton.style.color = 'white';
            downloadButton.style.border = 'none';
            downloadButton.style.borderRadius = '10px';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.zIndex = '9999';

            // 添加点击事件，创建一个a标签用于下载
            downloadButton.onclick = function() {
                // 创建一个隐藏的a元素
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = ''; // 触发下载行为
                document.body.appendChild(a); // 添加到页面中
                a.click(); // 触发点击事件
                document.body.removeChild(a); // 移除临时元素
            };

            // 将按钮添加到页面
            document.body.appendChild(downloadButton);
        }
    }
})();
