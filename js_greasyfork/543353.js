// ==UserScript==
// @name         百度贴吧图片解码器 (美化版-原图增强)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  【美化版】在百度贴吧页面解码 class="BDE_Image" 的图片中隐藏的文件。新增“显示原图”功能，解决因图片压缩导致的解码失败问题。
// @author       YourName & Gemini & Claude
// @match        *://tieba.baidu.com/p/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      tiebapic.baidu.com
// @connect      imgsrc.baidu.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543353/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%A7%A3%E7%A0%81%E5%99%A8%20%28%E7%BE%8E%E5%8C%96%E7%89%88-%E5%8E%9F%E5%9B%BE%E5%A2%9E%E5%BC%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543353/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%A7%A3%E7%A0%81%E5%99%A8%20%28%E7%BE%8E%E5%8C%96%E7%89%88-%E5%8E%9F%E5%9B%BE%E5%A2%9E%E5%BC%BA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局样式 ---
    GM_addStyle(`
        /* 按钮容器样式 */
        .decode-button-container {
            text-align: center;
            margin-top: 8px;
            margin-bottom: 15px;
            display: flex; /* 使用flex布局 */
            justify-content: center; /* 居中对齐 */
            gap: 10px; /* 按钮间距 */
        }
        /* 通用按钮样式 */
        .decode-button, .show-original-button {
            position: relative;
            padding: 8px 18px;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        }
        .decode-button:hover, .show-original-button:hover {
            transform: translateY(-2px);
        }
        .decode-button:disabled, .show-original-button:disabled {
            cursor: not-allowed;
            transform: translateY(0);
            box-shadow: none;
            opacity: 0.7;
        }
        /* 解码按钮特定样式 */
        .decode-button {
            background-image: linear-gradient(135deg, #4c87e0 0%, #3e84e2 100%);
        }
        .decode-button:hover {
            box-shadow: 0 4px 10px rgba(62, 132, 226, 0.4);
        }
        .decode-button:disabled {
            background-image: linear-gradient(135deg, #b0b0b0 0%, #999999 100%);
        }

        /* 新增：显示原图按钮特定样式 */
        .show-original-button {
            background-image: linear-gradient(135deg, #28a745 0%, #218838 100%);
        }
        .show-original-button:hover {
            box-shadow: 0 4px 10px rgba(40, 167, 69, 0.4);
        }
        .show-original-button:disabled {
            background-image: linear-gradient(135deg, #99c7a2 0%, #85b38e 100%);
        }

        .decode-button .loader {
            display: inline-block;
            margin-right: 8px;
            width: 14px;
            height: 14px;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            vertical-align: middle;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* 弹窗样式 (无修改) */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

        #decoder-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        #decoder-modal-overlay.modal-fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        #decoder-modal-content {
            background-color: #f0f2f5;
            padding: 25px;
            border-radius: 12px;
            max-width: 85vw;
            max-height: 90vh;
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            text-align: center;
            position: relative;
        }
        #decoder-modal-content h2 {
            margin: 0 0 20px 0;
            color: #333;
            font-size: 22px;
        }
        #decoder-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #999;
            cursor: pointer;
            line-height: 1;
            transition: color 0.2s;
        }
        #decoder-modal-close:hover {
            color: #333;
        }
        .decoded-file-item {
            margin-bottom: 20px;
            padding: 20px;
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            text-align: left;
        }
        .decoded-file-item img, .decoded-file-item video, .decoded-file-item audio {
            max-width: 100%;
            max-height: 65vh;
            display: block;
            margin: 0 auto 15px;
            border-radius: 6px;
        }
        .decoded-file-item video, .decoded-file-item audio {
            width: 100%; /* 让播放器宽度占满卡片 */
        }
        .decoded-file-item .file-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }
        .decoded-file-item .file-info span {
            font-size: 14px;
            color: #555;
            word-break: break-all;
        }
        .decoded-file-item .file-info a {
            padding: 6px 14px;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            transition: background-color 0.2s;
            white-space: nowrap;
        }
        .decoded-file-item .file-info a:hover {
            background-color: #218838;
        }

        /* Toast 提示样式 (无修改) */
        #toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .toast-message {
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-size: 15px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .toast-show {
             opacity: 1;
             transform: translateX(0);
        }
        .toast-success { background-color: #28a745; }
        .toast-error { background-color: #dc3545; }
        .toast-info { background-color: #17a2b8; }
    `);


    // --- 非阻塞式 Toast 提示系统 (无修改) ---
    function showToast(message, type = 'info', duration = 4000) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;

        container.prepend(toast);

        setTimeout(() => toast.classList.add('toast-show'), 10);

        setTimeout(() => {
            toast.classList.remove('toast-show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }


    // --- 解码逻辑核心 (无修改) ---
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder('utf-8');
    const DELIMITER = textEncoder.encode('|||ENCRYPT_DELIMITER|||');
    const FILENAME_DELIMITER = textEncoder.encode('|||FILENAME_DELIMITER|||');
    const FILE_DELIMITER = textEncoder.encode('|||FILE_DELIMITER|||');

    function findSubarray(haystack, needle, startIndex = 0) {
        for (let i = startIndex; i <= haystack.length - needle.length; i++) {
            let found = true;
            for (let j = 0; j < needle.length; j++) {
                if (haystack[i + j] !== needle[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }
        return -1;
    }

    function extractFilesFromBuffer(arrayBuffer) {
        const data = new Uint8Array(arrayBuffer);
        const extractedFiles = [];
        const startIndex = findSubarray(data, DELIMITER);
        if (startIndex === -1) return null;

        const hiddenData = data.slice(startIndex + DELIMITER.length);
        let currentPos = 0;
        while (currentPos < hiddenData.length) {
            const fn_start = findSubarray(hiddenData, FILENAME_DELIMITER, currentPos);
            if (fn_start === -1) break;
            const fn_end = findSubarray(hiddenData, FILENAME_DELIMITER, fn_start + FILENAME_DELIMITER.length);
            if (fn_end === -1) break;
            const filenameBytes = hiddenData.slice(fn_start + FILENAME_DELIMITER.length, fn_end);
            const filename = textDecoder.decode(filenameBytes);
            const file_content_delim_pos = findSubarray(hiddenData, FILE_DELIMITER, fn_end);
            if (file_content_delim_pos === -1) break;
            const content_start_pos = file_content_delim_pos + FILE_DELIMITER.length;
            const next_file_start = findSubarray(hiddenData, FILENAME_DELIMITER, content_start_pos);
            let file_content = (next_file_start === -1) ? hiddenData.slice(content_start_pos) : hiddenData.slice(content_start_pos, next_file_start);
            const fileType = getMimeType(filename);
            const blob = new Blob([file_content], { type: fileType });
            const blobUrl = URL.createObjectURL(blob);
            extractedFiles.push({ filename: filename, blobUrl: blobUrl, type: fileType.split('/')[0] });
            if (next_file_start === -1) break;
            currentPos = next_file_start;
        }
        return extractedFiles;
    }

    function getMimeType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif', 'webp': 'image/webp', 'bmp': 'image/bmp',
            'mp4': 'video/mp4', 'webm': 'video/webm', 'ogv': 'video/ogg',
            'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg', 'm4a': 'audio/mp4',
            'zip': 'application/zip', 'rar': 'application/x-rar-compressed', '7z': 'application/x-7z-compressed',
            'txt': 'text/plain', 'json': 'application/json', 'pdf': 'application/pdf',
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }


    // --- UI 相关函数 (无修改) ---
    function showModal(files) {
        closeModal();
        const overlay = document.createElement('div');
        overlay.id = 'decoder-modal-overlay';
        const content = document.createElement('div');
        content.id = 'decoder-modal-content';
        const closeButton = document.createElement('span');
        closeButton.id = 'decoder-modal-close';
        closeButton.innerHTML = '×';
        const title = document.createElement('h2');
        title.textContent = '解码结果';
        content.appendChild(closeButton);
        content.appendChild(title);

        if (files.length === 0) {
            content.innerHTML += '<p>解码完成，但未能提取出任何文件。</p>';
        } else {
            files.forEach(file => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'decoded-file-item';
                let element;
                if (file.type === 'image') element = document.createElement('img');
                else if (file.type === 'video') { element = document.createElement('video'); element.controls = true; }
                else if (file.type === 'audio') { element = document.createElement('audio'); element.controls = true; }
                if (element) { element.src = file.blobUrl; itemDiv.appendChild(element); }

                const infoDiv = document.createElement('div');
                infoDiv.className = 'file-info';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = `文件名: ${file.filename}`;
                const downloadLink = document.createElement('a');
                downloadLink.href = file.blobUrl;
                downloadLink.download = file.filename;
                downloadLink.textContent = '下载文件';
                infoDiv.appendChild(nameSpan);
                infoDiv.appendChild(downloadLink);
                itemDiv.appendChild(infoDiv);
                content.appendChild(itemDiv);
            });
        }
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        const closeFunc = () => closeModal(files);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeFunc(); });
        closeButton.addEventListener('click', closeFunc);
    }

    function closeModal(files) {
        const overlay = document.getElementById('decoder-modal-overlay');
        if (overlay) {
            overlay.classList.add('modal-fade-out');
            overlay.addEventListener('animationend', () => {
                if (files && files.length > 0) {
                    files.forEach(file => URL.revokeObjectURL(file.blobUrl));
                }
                overlay.remove();
            });
        }
    }


    // --- 主函数 (已修改) ---
    function initialize() {
        const images = document.querySelectorAll('img.BDE_Image:not([data-decoder-added])');
        images.forEach(img => {
            img.dataset.decoderAdded = 'true';
            const container = document.createElement('div');
            container.className = 'decode-button-container';

            // 1. 新增 "显示原图" 按钮
            const originalButton = document.createElement('button');
            originalButton.className = 'show-original-button';
            originalButton.textContent = '显示原图';
            container.appendChild(originalButton);

            // 2. 创建原有的 "解码图片" 按钮
            const decodeButton = document.createElement('button');
            decodeButton.className = 'decode-button';
            const buttonText = document.createElement('span');
            buttonText.textContent = '解码图片';
            decodeButton.appendChild(buttonText);
            container.appendChild(decodeButton);

            // 3. 将按钮容器插入到页面
            const parentElement = img.parentElement;
            if (parentElement) {
                // 如果图片在链接中，则插在链接外面，否则插在图片外面
                const targetElement = parentElement.tagName === 'A' ? parentElement : img;
                targetElement.insertAdjacentElement('afterend', container);
            }

            // 4. "显示原图" 按钮的事件监听
            originalButton.addEventListener('click', () => {
                originalButton.disabled = true;
                originalButton.textContent = '加载中...';

                // 使用正则表达式解析出原图URL
                const tbpic = /https?:\/\/(\w+)\.baidu\.com\/.+\/(\w+\.[a-zA-Z]{3,4})/.exec(img.src);

                if (tbpic && tbpic[2]) {
                    // 优先使用 imgsrc.baidu.com，通常是最高质量的原图
                    const originalUrl = `https://imgsrc.baidu.com/forum/pic/item/${tbpic[2]}`;

                    // 创建一个临时Image对象来预加载，以确认URL有效
                    const preloader = new Image();
                    preloader.onload = () => {
                        img.src = originalUrl; // 确认有效后，更新页面上图片的src
                        showToast('原图加载成功！', 'success');
                        originalButton.textContent = '已加载原图';
                        // 按钮保持禁用状态，因为任务已完成
                    };
                    preloader.onerror = () => {
                        showToast('加载原图失败，可能已被删除或无法访问。', 'error');
                        originalButton.textContent = '加载失败';
                        originalButton.disabled = false; // 允许用户重试
                    };
                    preloader.src = originalUrl;

                } else {
                    showToast('无法解析当前图片URL，可能已经是原图。', 'info');
                    originalButton.textContent = '无法解析';
                    // 按钮保持禁用
                }
            });

            // 5. "解码图片" 按钮的事件监听 (逻辑不变，它会自动使用更新后的 img.src)
            decodeButton.addEventListener('click', () => {
                decodeButton.disabled = true;
                buttonText.innerHTML = '<span class="loader"></span>解码中...';

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: img.src, // 这里会自动使用最新的src，无论是原始的还是点击“显示原图”后更新的
                    responseType: 'arraybuffer',
                    onload: function(response) {
                        try {
                            const extractedFiles = extractFilesFromBuffer(response.response);
                            if (extractedFiles === null) {
                                showToast('解码失败：未找到数据。图片可能未包含文件或已被压缩。请先尝试点击“显示原图”。', 'error');
                                buttonText.textContent = '解码失败';
                            } else {
                                showToast(`解码成功！共发现 ${extractedFiles.length} 个文件。`, 'success');
                                showModal(extractedFiles);
                                buttonText.textContent = '再次解码';
                            }
                        } catch (error) {
                            console.error('解码过程中发生意外错误:', error);
                            showToast(`解码出错: ${error.message}`, 'error');
                            buttonText.textContent = '解码出错';
                        } finally {
                            decodeButton.disabled = false;
                        }
                    },
                    onerror: function(error) {
                        console.error('图片下载失败:', error);
                        showToast('图片下载失败，请检查网络或控制台。', 'error');
                        buttonText.textContent = '下载失败';
                        decodeButton.disabled = false;
                    }
                });
            });
        });
    }

    // 首次运行 & 使用 MutationObserver 监听动态内容 (无修改)
    initialize();
    const observer = new MutationObserver((mutations) => {
        // 简单优化，避免不必要的重复执行
        const hasImageAdded = mutations.some(mutation =>
            Array.from(mutation.addedNodes).some(node =>
                node.nodeType === 1 && (node.matches('img.BDE_Image') || node.querySelector('img.BDE_Image'))
            )
        );
        if (hasImageAdded) {
            initialize();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();