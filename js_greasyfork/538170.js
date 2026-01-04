// ==UserScript==
// @name         Chaoxing PDF Downloader Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  当访问https://mooc1.chaoxing.com/时，读取返回的数据包，如果存在指定结构的数据则以列表形式展示，并提供在新标签页打开PDF的功能。仅在找到文件时显示下载提示，并自动删去文件名的扩展名。
// @author       SkyDreamLG
// @match        https://mooc1.chaoxing.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538170/Chaoxing%20PDF%20Downloader%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/538170/Chaoxing%20PDF%20Downloader%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个容器用于存放文件列表
    const fileListContainer = document.createElement('div');
    fileListContainer.style.position = 'fixed';
    fileListContainer.style.top = '10px';
    fileListContainer.style.right = '10px';
    fileListContainer.style.backgroundColor = '#f9f9f9';
    fileListContainer.style.border = '1px solid #ccc';
    fileListContainer.style.padding = '10px';
    fileListContainer.style.zIndex = '10000';
    fileListContainer.style.width = '250px';
    fileListContainer.style.maxHeight = '400px';
    fileListContainer.style.overflowY = 'auto';
    fileListContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    fileListContainer.style.display = 'none'; // 默认隐藏
    document.body.appendChild(fileListContainer);

    let hasValidFiles = false;

    function hookFetchAndXHR() {
        // Hook fetch
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            try {
                const data = await response.clone().json();
                checkData(data);
            } catch (error) {
                console.error('Error parsing JSON from fetch:', error);
            }
            return response;
        };

        // Hook XHR
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this.addEventListener("load", function() {
                if (this.responseText) {
                    try {
                        const data = JSON.parse(this.responseText);
                        checkData(data);
                    } catch (error) {
                        console.error('Error parsing JSON from XHR:', error);
                    }
                }
            });
            originalXhrOpen.apply(this, arguments);
        };
    }

    function checkData(data) {
        if (data && data.filename && data.pdf) {
            console.log("找到匹配的文件：", data.filename);
            console.log("PDF URL: ", data.pdf);
            addFileToList(removeExtension(data.filename), data.pdf);
            hasValidFiles = true; // 标记已找到有效文件
            updateFileListVisibility(); // 更新文件列表的可见性
        }
    }

    function removeExtension(filename) {
        return filename.replace(/\.[^/.]+$/, ""); // 使用正则表达式移除最后一个点及其后面的部分
    }

    function addFileToList(filename, pdfUrl) {
        const fileItem = document.createElement('div');
        fileItem.style.display = 'flex';
        fileItem.style.justifyContent = 'space-between';
        fileItem.style.alignItems = 'center';
        fileItem.style.marginBottom = '10px';
        fileItem.style.padding = '5px';
        fileItem.style.borderBottom = '1px solid #ddd';

        const openButton = document.createElement('button');
        openButton.innerText = '下载该文件';
        openButton.onclick = () => openPdfInNewTab(pdfUrl);
        openButton.style.padding = '5px 10px';
        openButton.style.cursor = 'pointer';
        openButton.style.borderRadius = '3px';
        openButton.style.border = '1px solid #007bff';
        openButton.style.backgroundColor = '#007bff';
        openButton.style.color = '#fff';
        openButton.style.fontSize = '14px';
        openButton.style.transition = 'background-color .3s ease';
        openButton.onmouseover = () => openButton.style.backgroundColor = '#0056b3';
        openButton.onmouseout = () => openButton.style.backgroundColor = '#007bff';
        fileItem.appendChild(openButton);

        const fileNameSpan = document.createElement('span');
        fileNameSpan.style.flexGrow = '1';
        fileNameSpan.style.marginLeft = '10px';
        fileNameSpan.style.wordBreak = 'break-all';
        fileNameSpan.innerText = filename;
        fileItem.appendChild(fileNameSpan);

        fileListContainer.appendChild(fileItem);
    }

    function openPdfInNewTab(url) {
        window.open(url, '_blank');
    }

    function updateFileListVisibility() {
        if (hasValidFiles) {
            fileListContainer.style.display = 'block';
        } else {
            fileListContainer.style.display = 'none';
        }
    }

    hookFetchAndXHR();
})();