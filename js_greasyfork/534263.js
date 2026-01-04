// ==UserScript==
// @name         色花堂 图片下载器 (GIF/JPG, XHR Method)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在色花堂页面为GIF和JPG图片添加下载按钮 (使用 GM_xmlhttpRequest)。
// @author       南竹& gemini 2.5【Google AI】
// @match        https://www.sehuatang.org/*
// @match        https://www.sehuatang.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      tju.7pzzv.us // 已添加您确认过的域名
// @connect      tu.ymawv.la
// @connect      tu.2qq42.us
// @connect      * // 保留通配符以防图片域名变化，如果确认不需要可以移除
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534263/%E8%89%B2%E8%8A%B1%E5%A0%82%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28GIFJPG%2C%20XHR%20Method%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534263/%E8%89%B2%E8%8A%B1%E5%A0%82%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28GIFJPG%2C%20XHR%20Method%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .sht-download-btn {
            display: inline-block;
            margin-left: 10px;
            padding: 3px 8px;
            font-size: 12px;
            color: white;
            background-color: #28a745; /* Green color */
            border: none;
            border-radius: 3px;
            cursor: pointer;
            vertical-align: middle;
            transition: background-color 0.2s;
            opacity: 0.8;
        }
        .sht-download-btn:hover {
            background-color: #218838;
            opacity: 1;
        }
        .sht-download-btn.downloading {
            background-color: #ffc107; /* Yellow while downloading */
            color: black;
            cursor: not-allowed;
        }
        .sht-download-btn.error {
            background-color: #dc3545; /* Red on error */
             cursor: not-allowed;
        }
         /* Prevent button affecting layout */
        img.zoom + .sht-download-btn {
             margin-top: 5px;
        }
    `);

    const processedImages = new Set();
    // --- 修改点：更新选择器以包含 .jpg ---
    const imageSelector = 'img.zoom[src$=".gif"], img.zoom[src$=".jpg"]';

    function addDownloadButtons() {
        // 使用更新后的选择器查找图片
        const images = document.querySelectorAll(imageSelector);

        images.forEach(img => {
            if (processedImages.has(img)) {
                return;
            }

            const imageUrl = img.src;
            // 从 URL 中提取文件名 (适用于 .gif 和 .jpg)
            let filename = 'downloaded_image';
            try {
                const urlParts = imageUrl.split('/');
                const lastPart = urlParts[urlParts.length - 1];
                if (lastPart && lastPart.includes('.')) {
                    // 提取文件名主体和扩展名
                    filename = lastPart.split('?')[0]; // 移除可能的 URL 参数
                } else {
                    // 如果无法提取，根据图片类型猜测扩展名
                    filename += imageUrl.toLowerCase().endsWith('.jpg') ? '.jpg' : '.gif';
                }
            } catch (e) {
                console.error("Error extracting filename:", imageUrl, e);
                 filename += imageUrl.toLowerCase().endsWith('.jpg') ? '.jpg' : '.gif';
            }

            const downloadButton = document.createElement('button');
            downloadButton.textContent = '下载';
            downloadButton.className = 'sht-download-btn';
            downloadButton.dataset.imageUrl = imageUrl;
            downloadButton.dataset.filename = filename;

            downloadButton.addEventListener('click', handleDownloadClick);

             if (img.parentNode) {
                img.insertAdjacentElement('afterend', downloadButton);
                processedImages.add(img);
             } else {
                 console.warn("Image parent node not found for:", img);
             }
        });
    }

    function handleDownloadClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const button = event.target;
        const imageUrl = button.dataset.imageUrl;
        const filename = button.dataset.filename;

        if (button.classList.contains('downloading') || button.classList.contains('error')) {
            return;
        }

        button.textContent = '下载中...';
        button.classList.add('downloading');
        button.classList.remove('error');

        console.log(`Requesting download via GM_xmlhttpRequest: ${imageUrl} as ${filename}`);

        GM_xmlhttpRequest({
            method: "GET",
            url: imageUrl,
            responseType: 'blob',
            headers: {
                'Referer': window.location.href,
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully fetched ${filename}, Status: ${response.status}`);
                    try {
                        const blob = response.response;
                        const objectUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = objectUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(objectUrl);

                        button.textContent = '✓ 已下载';
                        button.classList.remove('downloading');
                        setTimeout(() => {
                             if (!button.classList.contains('error')) {
                                button.textContent = '下载';
                             }
                        }, 2000);

                    } catch (e) {
                        console.error("Error creating download link:", e);
                        button.textContent = '下载错误(脚本)';
                        button.classList.remove('downloading');
                        button.classList.add('error');
                    }
                } else {
                    console.error(`Failed to download ${filename}. Status: ${response.status} ${response.statusText}`);
                    console.error("Response details:", response);
                    button.textContent = `下载错误(${response.status})`;
                    button.classList.remove('downloading');
                    button.classList.add('error');
                }
            },
            onerror: function(response) {
                console.error(`GM_xmlhttpRequest onerror for ${filename}:`, response);
                button.textContent = '下载错误(网络)';
                button.classList.remove('downloading');
                button.classList.add('error');
            },
            ontimeout: function() {
                console.error(`GM_xmlhttpRequest timeout for ${filename}`);
                button.textContent = '下载超时';
                button.classList.remove('downloading');
                button.classList.add('error');
            }
        });
    }

    // --- MutationObserver: 使用更新后的选择器 ---
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                 mutation.addedNodes.forEach(node => {
                     if (node.nodeType === Node.ELEMENT_NODE) {
                         // 检查节点本身是否匹配
                         if (node.matches && node.matches(imageSelector)) { // 使用更新的选择器
                             addDownloadButtons();
                         }
                         // 检查子孙节点
                         if (node.querySelectorAll) {
                             const newImages = node.querySelectorAll(imageSelector); // 使用更新的选择器
                             if (newImages.length > 0) {
                                 addDownloadButtons();
                             }
                         }
                     }
                 });
            }
        }
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    addDownloadButtons(); // 初始运行

})();
