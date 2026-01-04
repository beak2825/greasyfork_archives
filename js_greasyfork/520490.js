// ==UserScript==
// @name         AI Image Description Generator Gimini
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  使用AI生成网页图片描述
// @author       AlphaCat
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520490/AI%20Image%20Description%20Generator%20Gimini.user.js
// @updateURL https://update.greasyfork.org/scripts/520490/AI%20Image%20Description%20Generator%20Gimini.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .ai-config-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            min-width: 500px;
            height: auto;
        }
        .ai-config-modal h3 {
            margin: 0 0 15px 0;
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
        .ai-config-modal label {
            display: inline-block;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin: 0;
            line-height: normal;
            height: auto;
        }
        .ai-config-modal .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .ai-config-modal input {
            display: block;
            width: 100%;
            padding: 2px 24px 2px 2px;
            margin: 2px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            line-height: normal;
            height: auto;
            box-sizing: border-box;
        }
        .ai-config-modal .input-icon {
            position: absolute;
            right: 4px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 12px;
            user-select: none;
        }
        .ai-config-modal .clear-icon {
            right: 24px;
        }
        .ai-config-modal .toggle-password {
            right: 4px;
        }
        .ai-config-modal .input-icon:hover {
            color: #333;
        }
        .ai-config-modal .input-group {
            margin-bottom: 12px;
            height: auto;
            display: flex;
            flex-direction: column;
        }
        .ai-config-modal .button-row {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-top: 5px;
        }
        .ai-config-modal .check-button {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 12px;
        }
        .ai-config-modal .check-button:hover {
            background: #0056b3;
        }
        .ai-config-modal .check-button:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        .ai-config-modal select {
            width: 100%;
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            margin-top: 2px;
        }
        .ai-config-modal .status-text {
            font-size: 12px;
            margin-left: 10px;
        }
        .ai-config-modal .status-success {
            color: #28a745;
        }
        .ai-config-modal .status-error {
            color: #dc3545;
        }
        .ai-config-modal button {
            margin: 10px 5px;
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .ai-config-modal button#ai-save-config {
            background: #4CAF50;
            color: white;
        }
        .ai-config-modal button#ai-cancel-config {
            background: #dc3545;
            color: white;
        }
        .ai-config-modal button:hover {
            opacity: 0.9;
        }
        .ai-floating-btn {
            position: fixed;
            width: 32px;
            height: 32px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            cursor: move;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            transition: background-color 0.3s;
        }
        .ai-floating-btn:hover {
            background: #45a049;
        }
        .ai-floating-btn svg {
            width: 20px;
            height: 20px;
            fill: white;
        }
        .ai-menu {
            position: absolute;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 8px;
            z-index: 10000;
            display: flex;
            gap: 8px;
        }
        .ai-menu-item {
            width: 32px;
            height: 32px;
            padding: 6px;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
        }
        .ai-menu-item:hover {
            background: #f5f5f5;
        }
        .ai-menu-item svg {
            width: 20px;
            height: 20px;
            fill: #666;
        }
        .ai-menu-item:hover svg {
            fill: #4CAF50;
        }
        .ai-image-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 15px 0;
        }
        .ai-image-options button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
            font-size: 14px;
        }
        .ai-image-options button:hover {
            background: #45a049;
        }
        #ai-cancel {
            background: #dc3545;
            color: white;
        }
        #ai-cancel:hover {
            opacity: 0.9;
        }
        .ai-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 3s ease;
            pointer-events: none;
            white-space: pre-line;
            text-align: center;
            max-width: 80%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, 10px); }
            10% { opacity: 1; transform: translate(-50%, 0); }
            90% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -10px); }
        }
        .ai-config-modal .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        .ai-config-modal .button-group button {
            padding: 6px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        }
        .ai-config-modal .save-button {
            background: #007bff;
            color: white;
        }
        .ai-config-modal .save-button:hover {
            background: #0056b3;
        }
        .ai-config-modal .save-button:disabled {
            background: #cccccc;
            cursor: not-allowed;
        }
        .ai-config-modal .cancel-button {
            background: #f8f9fa;
            color: #333;
        }
        .ai-config-modal .cancel-button:hover {
            background: #e2e6ea;
        }
        .ai-selecting-image {
            cursor: crosshair !important;
        }
        .ai-selecting-image * {
            cursor: crosshair !important;
        }
        .ai-image-description {
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.4;
            max-width: 300px;
            text-align: center;
            word-wrap: break-word;
            z-index: 10000;
            pointer-events: none;
            animation: fadeIn 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .ai-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .ai-result-modal {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: relative;
            min-width: 300px;
            max-width: 1000px;
            max-height: 540px;
            overflow-y: auto;
            width: 90%;
        }
        .ai-result-modal h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #333;
        }
        .ai-result-modal .description-code {
            background: #1e1e1e;
            color: #ffffff;
            padding: 6px;
            border-radius: 4px;
            margin: 5px 0;
            cursor: pointer;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: monospace;
            border: 1px solid #333;
            position: relative;
            max-height: 500px;
            overflow-y: auto;
            font-size: 12px;
            line-height: 1.4;
        }
        .ai-result-modal .description-code * {
            color: #ffffff !important;
            background: transparent !important;
        }
        .ai-result-modal .description-code code {
            color: #ffffff;
            display: block;
            width: 100%;
            background: transparent !important;
            padding: 0;
        }
        .ai-result-modal .description-code:hover {
            background: #2d2d2d;
        }
        .ai-result-modal .copy-hint {
            font-size: 11px;
            color: #666;
            text-align: center;
            margin: 2px 0;
        }
        .ai-result-modal .close-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 2px 6px;
            line-height: 1;
        }
        .ai-result-modal .close-button:hover {
            color: #333;
        }
        .ai-selection-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            z-index: 999999;
            cursor: crosshair;
            pointer-events: none;
        }

        .ai-selecting-image img {
            position: relative;
            z-index: 9999;
            cursor: pointer !important;
            transition: outline 0.2s ease;
        }

        .ai-selecting-image img:hover {
            outline: 2px solid white;
            outline-offset: 2px;
        }

        /* 移动端样式优化 */
        @media (max-width: 768px) {
            .ai-floating-btn {
                width: 40px;
                height: 40px;
                touch-action: none;
            }

            .ai-floating-btn svg {
                width: 24px;
                height: 24px;
            }

            .ai-config-modal {
                width: 90%;
                min-width: auto;
                max-width: 400px;
                padding: 15px;
                margin: 10px;
                box-sizing: border-box;
            }

            .ai-config-modal .button-group {
                margin-top: 15px;
                flex-direction: row;
                justify-content: space-between;
                gap: 10px;
            }

            .ai-config-modal .button-group button {
                flex: 1;
                min-height: 44px;
                font-size: 16px;
                padding: 10px;
                margin: 0;
            }

            .ai-result-modal {
                width: 95%;
                min-width: auto;
                max-width: 90%;
                margin: 10px;
                padding: 15px;
            }

            .ai-modal-overlay {
                padding: 10px;
                box-sizing: border-box;
            }

            .ai-config-modal button,
            .ai-config-modal .input-icon,
            .ai-config-modal select,
            .ai-config-modal input {
                min-height: 44px;
                padding: 10px;
                font-size: 16px;
            }

            .ai-config-modal textarea {
                min-height: 100px;
                font-size: 16px;
                padding: 10px;
            }

            .ai-config-modal .input-icon {
                width: 44px;
                height: 44px;
                font-size: 20px;
            }

            .ai-config-modal {
                max-height: 90vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
        }

        .ai-selection-overlay img,
        .ai-selection-overlay [style*="background-image"],
        .ai-selection-overlay [class*="img"],
        .ai-selection-overlay [class*="photo"],
        .ai-selection-overlay [class*="image"],
        .ai-selection-overlay [class*="thumb"],
        .ai-selection-overlay [class*="avatar"] {
            cursor: pointer !important;
            transition: outline 0.2s;
            pointer-events: auto;
        }

        .ai-selection-overlay img:hover,
        .ai-selection-overlay [style*="background-image"]:hover,
        .ai-selection-overlay [class*="img"]:hover,
        .ai-selection-overlay [class*="photo"]:hover,
        .ai-selection-overlay [class*="image"]:hover,
        .ai-selection-overlay [class*="thumb"]:hover,
        .ai-selection-overlay [class*="avatar"]:hover {
            outline: 3px solid #4CAF50 !important;
            outline-offset: 2px !important;
        }

        /* 结果框样式 */
        .ai-result-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000000;
            max-width: 80%;
            max-height: 80vh;
            overflow-y: auto;
        }

        .ai-result-modal .result-content {
            position: relative;
        }

        .ai-result-modal .description-code {
            background: #1e1e1e;
            color: #ffffff;
            padding: 6px;
            border-radius: 4px;
            margin: 5px 0;
            cursor: pointer;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: monospace;
            border: 1px solid #333;
            position: relative;
            max-height: 500px;
            overflow-y: auto;
            font-size: 12px;
            line-height: 1.4;
        }

        .ai-result-modal .description-code * {
            color: #ffffff !important;
            background: transparent !important;
        }

        .ai-result-modal .description-code code {
            color: #ffffff;
            display: block;
            width: 100%;
            background: transparent !important;
            padding: 0;
        }

        .ai-result-modal .description-code:hover {
            background: #2d2d2d;
        }

        .ai-result-modal .copy-hint {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 5px;
        }

        .ai-result-modal .close-button {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #ff4444;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            line-height: 1;
            padding: 0;
        }

        .ai-result-modal .close-button:hover {
            background: #ff6666;
        }
    `);

    // 全局变量
    let isSelectionMode = false;

    // 定义默认提示词
    const DEFAULT_PROMPT = "I will give you a picture, help me describe the main content of the picture. If there are people in the picture, describe their clothing, posture, and expressions, and give a simple compliment. Answer in Chinese";

    // 在全局变量部分添加
    const DEFAULT_API_KEY = '';
    const DEFAULT_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    const DEFAULT_MODEL = 'gemini-2.0-flash-exp';

    // 添加支持的图片格式
    const SUPPORTED_MIME_TYPES = [
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/heic',
        'image/heif'
    ];

    const MAX_FILE_SIZE = 7 * 1024 * 1024; // 7MB
    const TARGET_FILE_SIZE = 1 * 1024 * 1024; // 1MB

    // 添加日志函数
    function log(message, data = null) {
        const timestamp = new Date().toISOString();
        if (data) {
            console.log(`[Gemini] ${timestamp} ${message}:`, data);
        } else {
            console.log(`[Gemini] ${timestamp} ${message}`);
        }
    }

    // 修改图片压缩函数
    async function compressImage(base64Image, mimeType) {
        log('开始压缩图片', { mimeType });
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                let quality = 0.9;
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;
                log('原始图片尺寸', { width, height });

                const MAX_DIMENSION = 2048;
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
                    width *= ratio;
                    height *= ratio;
                    log('调整后的图片尺寸', { width, height });
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const compress = () => {
                    const base64 = canvas.toDataURL(mimeType, quality);
                    const size = Math.ceil((base64.length * 3) / 4);
                    log('当前压缩质量和大小', { quality, size: `${(size / 1024 / 1024).toFixed(2)}MB` });

                    if (size > TARGET_FILE_SIZE && quality > 0.1) {
                        quality -= 0.1;
                        compress();
                    } else {
                        log('压缩完成', { finalQuality: quality, finalSize: `${(size / 1024 / 1024).toFixed(2)}MB` });
                        resolve(base64.split(',')[1]);
                    }
                };

                compress();
            };
            img.onerror = (error) => {
                log('图片加载失败', error);
                reject(error);
            };
            img.src = `data:${mimeType};base64,${base64Image}`;
        });
    }

    // 修改图片上传函数
    async function uploadImageToGemini(base64Image, mimeType) {
        try {
            log('开始上传图片', { mimeType });

            // 转换为二进制数据
            const binaryData = atob(base64Image);
            const bytes = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                bytes[i] = binaryData.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: mimeType });
            log('准备上传的文件大小', `${(blob.size / 1024 / 1024).toFixed(2)}MB`);

            // 获取 API Key
            const apiKey = GM_getValue('apiKey', DEFAULT_API_KEY);
            if (!apiKey) {
                throw new Error('请先在配置中设置 API Key');
            }

            // 第一步：发起 resumable 上传请求
            log('发起 resumable 上传请求');
            const initResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'X-Goog-Upload-Protocol': 'resumable',
                    'X-Goog-Upload-Command': 'start',
                    'X-Goog-Upload-Header-Content-Length': blob.size.toString(),
                    'X-Goog-Upload-Header-Content-Type': mimeType,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    file: {
                        display_name: `image_${Date.now()}.${mimeType.split('/')[1]}`
                    }
                })
            });

            if (!initResponse.ok) {
                const errorData = await initResponse.text();
                throw new Error(`上传初始化失败: HTTP ${initResponse.status} - ${errorData}`);
            }

            // 从响应头中获取上传 URL
            const uploadUrl = initResponse.headers.get('x-goog-upload-url');
            if (!uploadUrl) {
                throw new Error('未能获取上传 URL');
            }

            // 第二步：上传实际的图片数据
            log('开��上传图片数据');
            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Content-Length': blob.size.toString(),
                    'X-Goog-Upload-Offset': '0',
                    'X-Goog-Upload-Command': 'upload, finalize'
                },
                body: blob
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.text();
                throw new Error(`上传文件失败: HTTP ${uploadResponse.status} - ${errorData}`);
            }

            const data = await uploadResponse.json();
            if (data.file && data.file.uri) {
                return data.file.uri;
            } else {
                throw new Error(`文件上传失败: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            log('上传图片失败', error);
            throw error;
        }
    }

    // 修改 fetchImageAsBase64 函数
    async function fetchImageAsBase64(url) {
        try {
            log('开始通过 fetch 获取图片', url);

            // 直接使用 GM_xmlhttpRequest 获取图片
            return await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    headers: {
                        'Accept': 'image/*'
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64 = reader.result.split(',')[1];
                                resolve({
                                    base64,
                                    mimeType: response.response.type || 'image/jpeg'
                                });
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(response.response);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        log('GM_xmlhttpRequest 失败', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            log('获取图片失败', error);

            // 如果直接获取失败，尝试使用代理
            const proxyServices = [
                // 使用 cors-anywhere 代理
                `https://cors-anywhere.herokuapp.com/${url}`,
                // 使用 allOrigins 代理
                `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
                // 使用 crossorigin.me 代理
                `https://crossorigin.me/${url}`,
                // 使用 cors.bridged.cc 代理
                `https://cors.bridged.cc/${url}`
            ];

            for (const proxyUrl of proxyServices) {
                try {
                    log('尝试使用代理', proxyUrl);
                    return await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: proxyUrl,
                            responseType: 'blob',
                            headers: {
                                'Accept': 'image/*'
                            },
                            onload: function(response) {
                                if (response.status === 200) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        const base64 = reader.result.split(',')[1];
                                        resolve({
                                            base64,
                                            mimeType: response.response.type || 'image/jpeg'
                                        });
                                    };
                                    reader.onerror = reject;
                                    reader.readAsDataURL(response.response);
                                } else {
                                    reject(new Error(`HTTP ${response.status}`));
                                }
                            },
                            onerror: reject
                        });
                    });
                } catch (proxyError) {
                    log(`代理 ${proxyUrl} 请求失败`, proxyError);
                    continue;
                }
            }

            throw new Error('无法获取图片数据: ' + error.message);
        }
    }

    // 修改 imageToBase64 函数，添加更多错误检查
    async function imageToBase64(imgElement) {
        return new Promise((resolve, reject) => {
            try {
                // 检查是否是效的图片元素
                if (!(imgElement instanceof HTMLImageElement)) {
                    throw new Error('无效的图片元素');
                }

                // 检查图片是否已加载
                if (!imgElement.complete || !imgElement.naturalWidth) {
                    // 如果图片未加载完成，等待加载
                    imgElement.onload = () => processImage();
                    imgElement.onerror = () => reject(new Error('图片加载失败'));
                    return;
                }

                processImage();

                function processImage() {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = imgElement.naturalWidth;
                        canvas.height = imgElement.naturalHeight;
                        const ctx = canvas.getContext('2d');

                        // 检查画布上下文是否创建成功
                        if (!ctx) {
                            throw new Error('无法创建 Canvas 上下文');
                        }

                        // 绘制图片到 canvas
                        ctx.drawImage(imgElement, 0, 0);

                        // 获取图片的实际 MIME 类型
                        let mimeType = 'image/jpeg'; // 默认格式
                        const src = imgElement.src;

                        // 检查图片源
                        if (!src) {
                            throw new Error('图片源无效');
                        }

                        // 从 src 获取 MIME 类型
                        if (src.startsWith('data:')) {
                            const match = src.match(/^data:([^;]+);/);
                            if (match) {
                                mimeType = match[1];
                            }
                        } else {
                            // 从文件扩展名获取 MIME 类型
                            const extension = src.toLowerCase().match(/\.([^.]+)$/);
                            if (extension) {
                                const ext = extension[1];
                                const mimeMap = {
                                    'jpg': 'image/jpeg',
                                    'jpeg': 'image/jpeg',
                                    'png': 'image/png',
                                    'webp': 'image/webp',
                                    'gif': 'image/gif'
                                };
                                mimeType = mimeMap[ext] || 'image/jpeg';
                            }
                        }

                        log('处理图片', {
                            width: imgElement.naturalWidth,
                            height: imgElement.naturalHeight,
                            src: src.substring(0, 100) + '...',
                            mimeType: mimeType
                        });

                        try {
                            // 尝试使用原始格式
                            const base64 = canvas.toDataURL(mimeType, 1.0).split(',')[1];
                            if (!base64) {
                                throw new Error('Base64 转换失败');
                            }
                            resolve({ base64, mimeType });
                        } catch (e) {
                            log('原始格式转换失败，尝试使用 JPEG', e);
                            try {
                                // 降级到 JPEG
                                const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
                                if (!base64) {
                                    throw new Error('JPEG 转换也失败了');
                                }
                                resolve({ base64, mimeType: 'image/jpeg' });
                            } catch (jpegError) {
                                // 如果 Canvas 转换都失败了，尝试直接获取图片数据
                                log('Canvas 转换失败，尝试直接获取图片', jpegError);
                                if (src.startsWith('data:')) {
                                    const [header, base64] = src.split(',');
                                    const mimeType = header.split(':')[1].split(';')[0];
                                    if (base64 && mimeType) {
                                        resolve({ base64, mimeType });
                                    } else {
                                        throw new Error('无法从 data URL 提取数据');
                                    }
                                } else {
                                    // 最后尝试通过 fetch 获取
                                    fetchImageAsBase64(src).then(resolve).catch(reject);
                                }
                            }
                        }
                    } catch (error) {
                        log('图片处理失败', error);
                        // 尝试通过 fetch 获取
                        fetchImageAsBase64(imgElement.src).then(resolve).catch(reject);
                    }
                }
            } catch (error) {
                log('图片处理过程出错', error);
                reject(error);
            }
        });
    }

    // 修改生成描述的函数
    async function generateImageDescription(imageBase64, prompt, mimeType) {
        try {
            log('开始生成图片描述');
            log('使用的提示词', prompt);

            const fileUri = await uploadImageToGemini(imageBase64, mimeType);
            log('开始调用生成接口');

            // 完全按照 demo-gemini.sh 的请求格式修改
            const requestBody = {
                contents: [{
                    parts: [
                        {
                            text: prompt || DEFAULT_PROMPT
                        },
                        {
                            file_data: {  // 注意这里是 file_data 而不是 fileData
                                mime_type: mimeType,  // 使用下划线格式
                                file_uri: fileUri  // 使用下划线格式
                            }
                        }
                    ]
                }]
            };
            log('请求参数', requestBody);

            // 修改请求 URL，使用 v1beta 版本的 API
            const apiKey = GM_getValue('apiKey', DEFAULT_API_KEY);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            log('生成接口响应', data);

            // 解析响应数据
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const text = data.candidates[0].content.parts[0].text;
                log('成功生成描述');
                return text;
            } else {
                throw new Error(data.error?.message || '无法获取图片描述');
            }
        } catch (error) {
            log('生成描述失��', error);
            throw error;
        }
    }

    // 修改 API 检测功能
    async function checkApiKey(apiKey) {
        try {
            log('开始验证 API Key');
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp`, {
                headers: {
                    'x-goog-api-key': apiKey
                }
            });

            const data = await response.json();
            log('API 验证响应', data);

            if (data.name && data.name.includes('gemini-2.0-flash-exp')) {
                log('API Key 验证成功');
                return [data];
            }
            throw new Error('无效的 API Key 或模型不可用');
        } catch (error) {
            log('API 验证失败', error);
            throw new Error(`API 验证失败: ${error.message}`);
        }
    }

    // 显示toast提示
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'ai-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    // 修改 findImage 函数，增强懒加载图片的检测
    function findImage(target) {
        let img = null;
        let imgSrc = null;

        // 检查是否为图片元素
        if (target.nodeName === 'IMG') {
            img = target;
            // 优先获取 data-src（懒加载原图）
            imgSrc = target.getAttribute('data-src') ||
                     target.getAttribute('data-original') ||
                     target.getAttribute('data-actualsrc') ||
                     target.getAttribute('data-url') ||
                     target.getAttribute('data-echo') ||
                     target.getAttribute('data-lazy-src') ||
                     target.getAttribute('data-original-src') ||
                     target.src;  // 最后才使用 src 属性
        }
        // 检查背景图
        else if (target.style && target.style.backgroundImage) {
            let bgImg = target.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (bgImg) {
                imgSrc = bgImg[1];
                img = target;
            }
        }
        // 检查父元素的背景图
        else {
            let parent = target.parentElement;
            if (parent && parent.style && parent.style.backgroundImage) {
                let bgImg = parent.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (bgImg) {
                    imgSrc = bgImg[1];
                    img = parent;
                }
            }
        }

        // 检查常见的图片容器
        if (!img) {
            // 检查父元素是否为图片容器
            let imgWrapper = target.closest('[class*="img"],[class*="photo"],[class*="image"],[class*="thumb"],[class*="avatar"],[class*="masonry"]');
            if (imgWrapper) {
                // 在容器中查找图片元素
                let possibleImg = imgWrapper.querySelector('img');
                if (possibleImg) {
                    img = possibleImg;
                    // 同样优先获取懒加载原图
                    imgSrc = possibleImg.getAttribute('data-src') ||
                            possibleImg.getAttribute('data-original') ||
                            possibleImg.getAttribute('data-actualsrc') ||
                            possibleImg.getAttribute('data-url') ||
                            possibleImg.getAttribute('data-echo') ||
                            possibleImg.getAttribute('data-lazy-src') ||
                            possibleImg.getAttribute('data-original-src') ||
                            possibleImg.src;
                } else {
                    // 检查容器的背景图
                    let bgImg = getComputedStyle(imgWrapper).backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (bgImg) {
                        imgSrc = bgImg[1];
                        img = imgWrapper;
                    }
                }
            }
        }

        // 检查特殊情况：某些网站使用自定义属性存储真实图片地址
        if (img && !imgSrc) {
            // 获取元素的所有属性
            const attrs = img.attributes;
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                // 检查属性名中���否包含关键字
                if (attr.name.toLowerCase().includes('src') ||
                    attr.name.toLowerCase().includes('url') ||
                    attr.name.toLowerCase().includes('img') ||
                    attr.name.toLowerCase().includes('thumb') ||
                    attr.name.toLowerCase().includes('original') ||
                    attr.name.toLowerCase().includes('data')) {
                    const value = attr.value;
                    if (value && /^https?:\/\//.test(value)) {
                        imgSrc = value;
                        break;
                    }
                }
            }
        }

        // 检查父级链接
        if (img && !imgSrc) {
            let parentLink = img.closest('a');
            if (parentLink && parentLink.href) {
                if (/\.(jpe?g|png|webp|gif)$/i.test(parentLink.href)) {
                    imgSrc = parentLink.href;
                }
            }
        }

        // 如果找到了图片但没有找到有效的 URL，记录日志
        if (img && !imgSrc) {
            log('找到图片元素但未找到有效的图片URL', {
                element: img,
                attributes: Array.from(img.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', ')
            });
        }

        return { img, imgSrc };
    }

    // 修改点击处理函数
    function clickHandler(e) {
        if (!isSelectionMode) return;

        const { img, imgSrc } = findImage(e.target);

        if (!img || !imgSrc) return;

        e.preventDefault();
        e.stopPropagation();

        // 检查图片是否有效
        if (img instanceof HTMLImageElement) {
            if (!img.complete || !img.naturalWidth) {
                showToast('图片未加载完成或无效');
                return;
            }
            if (img.naturalWidth < 10 || img.naturalHeight < 10) {
                showToast('图片太小，无法处理');
                return;
            }
        }

        processImage(img, imgSrc);
    }

    // 进入图片选择模式
    function enterImageSelectionMode() {
        if (isSelectionMode) return;

        isSelectionMode = true;

        const floatingBtn = document.querySelector('.ai-floating-btn');
        if (floatingBtn) {
            floatingBtn.style.display = 'none';
        }

        const overlay = document.createElement('div');
        overlay.className = 'ai-selection-overlay';
        document.body.appendChild(overlay);

        document.body.classList.add('ai-selecting-image');

        document.addEventListener('click', clickHandler, true);

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                exitImageSelectionMode();
            }
        };
        document.addEventListener('keydown', escHandler);

        window._imageSelectionHandlers = {
            click: clickHandler,
            keydown: escHandler
        };
    }

    // 退出图片选择模式
    function exitImageSelectionMode() {
        isSelectionMode = false;

        const floatingBtn = document.querySelector('.ai-floating-btn');
        if (floatingBtn) {
            floatingBtn.style.display = 'flex';
        }

        const overlay = document.querySelector('.ai-selection-overlay');
        if (overlay) {
            overlay.remove();
        }

        document.body.classList.remove('ai-selecting-image');

        if (window._imageSelectionHandlers) {
            document.removeEventListener('click', window._imageSelectionHandlers.click, true);
            document.removeEventListener('keydown', window._imageSelectionHandlers.keydown);
            window._imageSelectionHandlers = null;
        }
    }

    // 修改配置界面创建函数
    function createConfigUI() {
        const existingModal = document.querySelector('.ai-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'ai-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'ai-config-modal';
        modal.innerHTML = `
            <h3>AI图像描述配置</h3>
            <div class="input-group">
                <label>API Endpoint:</label>
                <div class="input-wrapper">
                    <input type="text" id="ai-endpoint" placeholder="https://api.openai.com" value="${DEFAULT_API_ENDPOINT}" readonly>
                </div>
            </div>
            <div class="input-group">
                <label>API Key:</label>
                <div class="input-wrapper">
                    <input type="password" id="ai-apikey" placeholder="输入你的 API Key" value="${GM_getValue('apiKey', DEFAULT_API_KEY)}">
                    <span class="input-icon toggle-password" title="显示/隐藏">👁️</span>
                </div>
            </div>
            <div class="input-group">
                <label>使用模型:</label>
                <select id="ai-model" disabled>
                    <option value="${DEFAULT_MODEL}">${DEFAULT_MODEL}</option>
                </select>
            </div>
            <div class="input-group">
                <label>提示词:</label>
                <div class="input-wrapper">
                    <textarea id="ai-prompt" rows="4" style="width: 100%; resize: vertical;">${GM_getValue('customPrompt', DEFAULT_PROMPT)}</textarea>
                    <span class="input-icon clear-icon" title="重置为默认值">↺</span>
                </div>
            </div>
            <div class="button-group">
                <button type="button" class="cancel-button" id="ai-cancel-config">取消</button>
                <button type="button" class="save-button" id="ai-save-config">保存</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 添加密码显示/隐藏功能
        const togglePassword = modal.querySelector('.toggle-password');
        const apiKeyInput = modal.querySelector('#ai-apikey');
        if (togglePassword && apiKeyInput) {
            togglePassword.addEventListener('click', function() {
                const type = apiKeyInput.type === 'password' ? 'text' : 'password';
                apiKeyInput.type = type;
                this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }

        // 保留提示词的重置功能
        const clearButtons = modal.querySelectorAll('.clear-icon');
        clearButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const input = this.parentElement.querySelector('textarea');
                if (input && input.id === 'ai-prompt') {
                    input.value = DEFAULT_PROMPT;
                    input.focus();
                }
            });
        });

        // 修改保存按钮事件
        const saveButton = modal.querySelector('#ai-save-config');
        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const apiKey = modal.querySelector('#ai-apikey').value.trim();
                const customPrompt = modal.querySelector('#ai-prompt').value.trim();

                // 保存配置
                if (apiKey) {
                    GM_setValue('apiKey', apiKey);
                }
                if (customPrompt) {
                    GM_setValue('customPrompt', customPrompt);
                }

                showToast('配置已保存');
                overlay.remove();
            });
        }

        // 取消配置
        const cancelButton = modal.querySelector('#ai-cancel-config');
        if (cancelButton) {
            cancelButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                overlay.remove();
            });
        }

        // 点击遮罩层关闭
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // 阻止模态框内的点击事件冒泡
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        const btn = document.createElement('div');
        btn.className = 'ai-floating-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
            </svg>
        `;

        const savedPos = JSON.parse(GM_getValue('btnPosition', '{"x": 20, "y": 20}'));
        btn.style.left = (savedPos.x || 20) + 'px';
        btn.style.top = (savedPos.y || 20) + 'px';
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';

        let isDragging = false;
        let hasMoved = false;
        let startX, startY;
        let initialLeft, initialTop;
        let longPressTimer;
        let touchStartTime;

        // 触屏事件处理
        btn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            touchStartTime = Date.now();

            longPressTimer = setTimeout(() => {
                exitImageSelectionMode();
                createConfigUI();
            }, 500);

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            const rect = btn.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
        });

        btn.addEventListener('touchmove', function (e) {
            e.preventDefault();
            clearTimeout(longPressTimer);

            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasMoved = true;
            }

            const newLeft = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, initialLeft + deltaX));
            const newTop = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, initialTop + deltaY));

            btn.style.left = newLeft + 'px';
            btn.style.top = newTop + 'px';
        });

        btn.addEventListener('touchend', function (e) {
            e.preventDefault();
            clearTimeout(longPressTimer);

            const touchDuration = Date.now() - touchStartTime;

            if (!hasMoved && touchDuration < 500) {
                enterImageSelectionMode();
            }

            if (hasMoved) {
                const rect = btn.getBoundingClientRect();
                GM_setValue('btnPosition', JSON.stringify({
                    x: rect.left,
                    y: rect.top
                }));
            }

            hasMoved = false;
        });

        // 鼠标事件处理
        btn.addEventListener('click', function (e) {
            if (e.button === 0 && !hasMoved) {
                enterImageSelectionMode();
                e.stopPropagation();
            }
            hasMoved = false;
        });

        btn.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            exitImageSelectionMode();
            createConfigUI();
        });

        // 拖拽相关事件
        function dragStart(e) {
            if (e.target === btn || btn.contains(e.target)) {
                isDragging = true;
                hasMoved = false;
                const rect = btn.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = rect.left;
                initialTop = rect.top;
                e.preventDefault();
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    hasMoved = true;
                }

                const newLeft = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, initialLeft + deltaX));
                const newTop = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, initialTop + deltaY));

                btn.style.left = newLeft + 'px';
                btn.style.top = newTop + 'px';
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                isDragging = false;
                const rect = btn.getBoundingClientRect();
                GM_setValue('btnPosition', JSON.stringify({
                    x: rect.left,
                    y: rect.top
                }));
            }
        }

        btn.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        document.body.appendChild(btn);
        return btn;
    }

    // 添加 processImage 函数
    async function processImage(img, imgSrc) {
        try {
            showToast('正在处理图片...');

            // 获取图片数据
            let imgData;
            if (img instanceof HTMLImageElement) {
                imgData = await imageToBase64(img);
            } else {
                // 对于背景图等情况，直接获取图片
                imgData = await fetchImageAsBase64(imgSrc);
            }

            if (!imgData || !imgData.base64) {
                throw new Error('无法获取图片数据');
            }

            log('获取到图片数据', {
                mimeType: imgData.mimeType,
                dataLength: imgData.base64.length,
                source: imgSrc
            });

            // 获取用户设置的提示词
            const customPrompt = GM_getValue('customPrompt', DEFAULT_PROMPT);

            // 调用 Gemini API 获取描述
            const description = await generateImageDescription(imgData.base64, customPrompt, imgData.mimeType);

            // 显示结果
            showResult(description);

            // 处理完成后退出选择模式
            exitImageSelectionMode();
        } catch (error) {
            log('处理图片失败', error);
            showToast(`处理失败: ${error.message}`);
        }
    }

    // 添加显示结果的函数
    function showResult(description) {
        // 移除已存在的结果框
        const existingResult = document.querySelector('.ai-result-modal');
        if (existingResult) {
            existingResult.remove();
        }

        // 创建结果框
        const resultModal = document.createElement('div');
        resultModal.className = 'ai-result-modal';
        resultModal.innerHTML = `
            <div class="result-content">
                <div class="description-code">
                    <code>${description}</code>
                </div>
                <div class="copy-hint">点击上方文本可复制</div>
                <button class="close-button">×</button>
            </div>
        `;

        // 添加复制功能
        const codeBlock = resultModal.querySelector('.description-code');
        codeBlock.addEventListener('click', () => {
            const text = codeBlock.textContent;
            GM_setClipboard(text);
            showToast('已复制到剪贴板');
        });

        // 添加关闭功能
        const closeButton = resultModal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            resultModal.remove();
        });

        document.body.appendChild(resultModal);
    }

    // 初始化
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createFloatingButton();
            });
        } else {
            createFloatingButton();
        }
    }

    // 启动脚本
    initialize();
})();