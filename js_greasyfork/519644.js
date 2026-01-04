// ==UserScript==
// @name         AI Image Description Generator
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  使用AI生成网页图片描述
// @author       AlphaCat
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519644/AI%20Image%20Description%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/519644/AI%20Image%20Description%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let isSelectionMode = false;
    
    // 定义支持的视觉模型列表
    const supportedVLModels = [
        'Qwen/Qwen2-VL-72B-Instruct',
        'Pro/Qwen/Qwen2-VL-7B-Instruct',
        'OpenGVLab/InternVL2-Llama3-76B',
        'OpenGVLab/InternVL2-26B',
        'Pro/OpenGVLab/InternVL2-8B',
        'deepseek-ai/deepseek-vl2'
    ];

    // 定义GLM-4V系列模型
    const glm4vModels = [
        'glm-4v',
        'glm-4v-flash'
    ];

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
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
            white-space: pre-line;
            word-wrap: break-word;
            font-family: monospace;
            border: 1px solid #333;
            position: relative;
            max-height: 500px;
            overflow-y: auto;
            font-size: 12px;
            line-height: 1.2;
        }
        .ai-result-modal .description-code * {
            color: #ffffff !important;
            background: transparent !important;
        }
        .ai-result-modal .description-code code {
            display: block;
            width: 100%;
            white-space: pre-line;
            line-height: 1.2;
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
        .ai-result-modal .balance-info {
            font-size: 9px;
            color: #666;
            text-align: right;
            margin-top: 3px;
            padding-top: 3px;
            border-top: 1px solid #eee;
        }
        /* 移动端样式优化 */
        @media (max-width: 768px) {
            .ai-floating-btn {
                width: 40px;
                height: 40px;
                touch-action: none; /* 防止触屏滚动 */
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
                min-height: 44px; /* 增加按钮高度，更容易点击 */
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

            /* 确保模态框内的所有可点击元素都有足够的点击区域 */
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

            /* 修复移动端的滚动问题 */
            .ai-config-modal {
                max-height: 90vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
        }
    `);

    // 密码显示切换功能
    function togglePassword(element) {
        const input = element.parentElement.querySelector('input');
        if (input.type === 'password') {
            input.type = 'text';
            element.textContent = '👁️🗨️';
        } else {
            input.type = 'password';
            element.textContent = '👁️';
        }
    }

    // 检查API配置并获取可用模型
    async function checkApiAndGetModels(apiEndpoint, apiKey) {
        try {
            const response = await fetch(`${apiEndpoint}/v1/models`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.data && Array.isArray(result.data)) {
                // 过滤出多模态模型
                const multimodalModels = result.data
                    .filter(model => model.id.includes('vision') || model.id.includes('gpt-4-v'))
                    .map(model => ({
                        id: model.id,
                        name: model.id
                    }));
                return multimodalModels;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching models:', error);
            throw error;
        }
    }

    // 检查API配置
    async function checkApiConfig() {
        const apiEndpoint = GM_getValue('apiEndpoint', '').trim();
        const apiKey = GM_getValue('apiKey', '').trim();
        const selectedModel = GM_getValue('selectedModel', '').trim();

        if (!apiEndpoint || !apiKey || !selectedModel) {
            alert('请先配置API Endpoint、API Key和模型');
            showConfigModal();
            return false;
        }

        try {
            // 如果是智谱AI的endpoint,跳过API检查
            if(apiEndpoint.includes('bigmodel.cn')) {
                return true;
            }

            // 其他endpoint进行API检查
            const models = await checkApiAndGetModels(apiEndpoint, apiKey);
            if (models.length === 0) {
                alert('无法获取可用模型列表，请检查API配置是否正确');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking API config:', error);
            alert('API配置验证失败，请检查配置是否正确');
            return false;
        }
    }

    // 获取图片的Base64内容
    async function getImageBase64(imageUrl) {
        console.log('[Debug] Starting image to Base64 conversion for:', imageUrl);
        
        // 尝试HTTP URL换为HTTPS
        if (imageUrl.startsWith('http:')) {
            imageUrl = imageUrl.replace('http:', 'https:');
            console.log('[Debug] Converted to HTTPS URL:', imageUrl);
        }

        // 获取图片的多种方法
        async function tryFetchImage(method) {
            return new Promise((resolve, reject) => {
                switch(method) {
                    case 'direct':
                        // 直接请求
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: imageUrl,
                            responseType: 'blob',
                            headers: {
                                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            },
                            anonymous: true,
                            onload: response => resolve(response),
                            onerror: error => reject(error)
                        });
                        break;

                    case 'withReferer':
                        // 带原始Referer的请求
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: imageUrl,
                            responseType: 'blob',
                            headers: {
                                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache',
                                'Referer': new URL(imageUrl).origin,
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            },
                            anonymous: true,
                            onload: response => resolve(response),
                            onerror: error => reject(error)
                        });
                        break;

                    case 'proxy':
                        // 通过代理服务获取
                        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`;
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: proxyUrl,
                            responseType: 'blob',
                            headers: {
                                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            },
                            anonymous: true,
                            onload: response => resolve(response),
                            onerror: error => reject(error)
                        });
                        break;

                    case 'corsProxy':
                        // 通过CORS代理获取
                        const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: corsProxyUrl,
                            responseType: 'blob',
                            headers: {
                                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                                'Origin': window.location.origin
                            },
                            anonymous: true,
                            onload: response => resolve(response),
                            onerror: error => reject(error)
                        });
                        break;
                }
            });
        }

        // 处理响应
        async function handleResponse(response) {
            if (response.status === 200) {
                const blob = response.response;
                console.log('[Debug] Image blob size:', blob.size, 'bytes');
                
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = reader.result.split(',')[1];
                        console.log('[Debug] Base64 conversion completed, length:', base64.length);
                        resolve(base64);
                    };
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(blob);
                });
            }
            throw new Error(`Failed with status: ${response.status}`);
        }

        // 依次尝试不同的方法
        const methods = ['direct', 'withReferer', 'proxy', 'corsProxy'];
        for (const method of methods) {
            try {
                console.log(`[Debug] Trying method: ${method}`);
                const response = await tryFetchImage(method);
                if (response.status === 200) {
                    return await handleResponse(response);
                }
                console.log(`[Debug] Method ${method} failed with status:`, response.status);
            } catch (error) {
                console.log(`[Debug] Method ${method} failed:`, error);
            }
        }

        throw new Error('All methods to fetch image failed');
    }

    // 调用API获取图片描述
    async function getImageDescription(imageUrl, apiEndpoint, apiKey, selectedModel) {
        console.log('[Debug] Starting image description request:', {
            apiEndpoint,
            selectedModel,
            imageUrl,
            timestamp: new Date().toISOString()
        });

        try {
            // 获取所有API Keys
            const apiKeys = apiKey.split('\n').filter(key => key.trim() !== '');
            if (apiKeys.length === 0) {
                throw new Error('No valid API keys available');
            }

            // 使用第一个key
            const currentKey = apiKeys[0];

            const base64Image = await getImageBase64(imageUrl);
            console.log('[Debug] Image converted to base64, length:', base64Image.length);

            // 退出选择图片模式
            exitImageSelectionMode();
            
            const timeout = 30000; // 30秒超时
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const imageSize = base64Image.length * 0.75; // 转换为字节数
            
            // 获取当前余额
            const userInfo = await checkUserInfo(apiEndpoint, currentKey);
            const currentBalance = userInfo.totalBalance;
            
            // 计算每次调用的预估花费（根据图片大小和模型）
            const costPerCall = calculateCost(imageSize, selectedModel);
            
            // 计算识别的剩余图片量
            const remainingImages = Math.floor(currentBalance / costPerCall);

            // 根据不同的API构建不同的请求体和endpoint
            let requestBody;
            let finalEndpoint;

            if(selectedModel.startsWith('glm-')) {
                // GLM系列模型的请求格式
                requestBody = {
                    model: selectedModel,
                    messages: [{
                        role: "user",
                        content: [{
                            type: "text",
                            text: "请描述这张图片的主要内容。如果是人物图片,请至少用15个字描述人物。"
                        }, {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }]
                    }],
                    stream: true
                };
                finalEndpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
            } else {
                // 原有模型的请求格式
                requestBody = {
                    model: selectedModel,
                    messages: [{
                        role: "user",
                        content: [
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            },
                            {
                                type: "text",
                                text: "Describe the main content of the image. If there is a person, provide a description of the person with some beautiful words. Answer in Chinese."
                            }
                        ]
                    }],
                    stream: true
                };
                finalEndpoint = `${apiEndpoint}/chat/completions`;
            }

            console.log('[Debug] API Request body:', JSON.stringify(requestBody, null, 2));

            console.log('[Debug] Sending request to:', finalEndpoint);
            console.log('[Debug] Request headers:', {
                'Authorization': 'Bearer ***' + currentKey.slice(-4),
                'Content-Type': 'application/json'
            });
            console.log('[Debug] Request body:', requestBody);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: finalEndpoint,
                    headers: {
                        'Authorization': `Bearer ${currentKey}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(requestBody),
                    onload: async function(response) {
                        console.log('[Debug] Response received:', {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.responseHeaders
                        });

                        if (response.status === 200) {
                            try {
                                let description = '';
                                const lines = response.responseText.split('\n').filter(line => line.trim() !== '');
                                
                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        const jsonStr = line.slice(6);
                                        if (jsonStr === '[DONE]') continue;
                                        
                                        try {
                                            const jsonData = JSON.parse(jsonStr);
                                            console.log('[Debug] Parsed chunk:', jsonData);
                                            
                                            const content = jsonData.choices[0]?.delta?.content;
                                            if (content) {
                                                description += content;
                                                console.log('[Debug] Current description:', description);
                                            }
                                        } catch (e) {
                                            console.error('[Debug] Error parsing chunk JSON:', e);
                                        }
                                    }
                                }

                                console.log('[Debug] Final description:', description);
                                removeDescriptionTooltip();
                                const balanceInfo = `剩余额度为：${currentBalance.toFixed(4)}，大约还可以识别 ${remainingImages} 张图片`;
                                showDescriptionModal(description, balanceInfo);
                                resolve(description);
                            } catch (error) {
                                console.error('[Debug] Error processing response:', error);
                                reject(error);
                            }
                        } else {
                            console.error('[Debug] Error response:', {
                                status: response.status,
                                statusText: response.statusText,
                                response: response.responseText
                            });

                            // 检查是否是余额不足错误
                            try {
                                const errorResponse = JSON.parse(response.responseText);
                                if (errorResponse.code === 30001 || 
                                    (errorResponse.message && errorResponse.message.includes('insufficient'))) {
                                    showToast('当前key余不足，正在检测其他key...');
                                    // 自动运行一次key检测
                                    await checkAndUpdateKeys();
                                    // 重新获取更新后的key
                                    const newApiKeys = GM_getValue('apiKey', '').split('\n').filter(key => key.trim() !== '');
                                    if (newApiKeys.length > 0) {
                                        // 使用新的key重试
                                        getImageDescription(imageUrl, apiEndpoint, newApiKeys.join('\n'), selectedModel)
                                            .then(resolve)
                                            .catch(reject);
                                        return;
                                    }
                                }
                            } catch (e) {
                                console.error('[Debug] Error parsing error response:', e);
                            }
                            
                            reject(new Error(`Request failed with status ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error('[Debug] Request error:', error);
                        reject(error);
                    },
                    onprogress: function(progress) {
                        // 用于处理流式响应的进度
                        console.log('[Debug] Progress:', progress);
                        
                        try {
                            const lines = progress.responseText.split('\n').filter(line => line.trim() !== '');
                            let latestContent = '';
                            
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    const jsonStr = line.slice(6);
                                    if (jsonStr === '[DONE]') continue;
                                    
                                    try {
                                        const jsonData = JSON.parse(jsonStr);
                                        const content = jsonData.choices[0]?.delta?.content;
                                        if (content) {
                                            latestContent += content;
                                        }
                                    } catch (e) {
                                        console.error('[Debug] Error parsing progress JSON:', e);
                                    }
                                }
                            }
                            
                            if (latestContent) {
                                updateDescriptionTooltip('正在生成描述: ' + latestContent);
                            }
                        } catch (error) {
                            console.error('[Debug] Error processing progress:', error);
                        }
                    }
                });
            });
        } catch (error) {
            if (error.name === 'AbortError') {
                showToast('请求超时，请重试');
            }
            removeDescriptionTooltip();
            console.error('[Debug] Error in getImageDescription:', {
                error,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }

    // 显示描述tooltip
    function showDescriptionTooltip(description) {
        const tooltip = document.createElement('div');
        tooltip.className = 'ai-image-description';
        tooltip.textContent = description;
        
        // 获取视口宽度
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        
        // 计算tooltip位置（水平居中，距顶部20px��
        const tooltipX = Math.max(0, (viewportWidth - 300) / 2); // 300是tooltip的max-width
        
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = '20px';
        
        document.body.appendChild(tooltip);

        // 添加动态点的动画
        let dots = 1;
        const updateInterval = setInterval(() => {
            if (!document.body.contains(tooltip)) {
                clearInterval(updateInterval);
                return;
            }
            dots = dots % 6 + 1;
            tooltip.textContent = '正在生成描述' + '.'.repeat(dots);
        }, 500); // 每500ms更新一次

        return tooltip;
    }

    // 更新描述tooltip内容
    function updateDescriptionTooltip(description) {
        const tooltip = document.querySelector('.ai-image-description');
        if (tooltip) {
            tooltip.textContent = description;
        }
    }

    // 移除描述tooltip
    function removeDescriptionTooltip() {
        const tooltip = document.querySelector('.ai-image-description');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // 在全局变量部分添加日志函数
    function log(message, data = null) {
        const timestamp = new Date().toISOString();
        if (data) {
            console.log(`[AI Image] ${timestamp} ${message}:`, data);
        } else {
            console.log(`[AI Image] ${timestamp} ${message}`);
        }
    }

    // 修改 findImage 函数，增强图片元素检测能力
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
                // 检查属性名中是否包含关键字
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

        // 开始处理图片
        getImageDescription(imgSrc);
    }

    // 进入图片选择模式
    function enterImageSelectionMode() {
        console.log('[Debug] Entering image selection mode');
        if(isSelectionMode) return; // 防止重复进入选择模式
        
        isSelectionMode = true;

        // 隐藏悬浮按钮
        const floatingBtn = document.querySelector('.ai-floating-btn');
        if(floatingBtn) {
            floatingBtn.style.display = 'none';
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'ai-selection-overlay';
        document.body.appendChild(overlay);
        
        // 添加选择状态的类名
        document.body.classList.add('ai-selecting-image');

        // 创建点击事件处理函数
        const clickHandler = async function(e) {
            if (!isSelectionMode) return;

            if (e.target.tagName === 'IMG') {
                console.log('[Debug] Image clicked:', e.target.src);
                e.preventDefault();
                e.stopPropagation();
                
                // 获取配置
                const endpoint = GM_getValue('apiEndpoint', '');
                const apiKey = GM_getValue('apiKey', '');
                const selectedModel = GM_getValue('selectedModel', '');

                console.log('[Debug] Current configuration:', {
                    endpoint,
                    selectedModel,
                    hasApiKey: !!apiKey
                });

                if (!endpoint || !apiKey || !selectedModel) {
                    showToast('请先配置API配置');
                    exitImageSelectionMode();
                    return;
                }

                // 显示加载中的tooltip
                showDescriptionTooltip('正在生成描述...');

                try {
                    await getImageDescription(e.target.src, endpoint, apiKey, selectedModel);
                } catch (error) {
                    console.error('[Debug] Description generation failed:', error);
                    removeDescriptionTooltip();
                    showToast('生成描述失败: ' + error.message);
                }
            }
        };

        // 添加点击事件监听器
        document.addEventListener('click', clickHandler, true);
        
        // ESC键退选择模式
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                exitImageSelectionMode();
            }
        };
        document.addEventListener('keydown', escHandler);

        // 保存事件理函数以便后续移除
        window._imageSelectionHandlers = {
            click: clickHandler,
            keydown: escHandler
        };
    }

    // 退出图片选择模式
    function exitImageSelectionMode() {
        console.log('[Debug] Exiting image selection mode');
        isSelectionMode = false;

        // 显示悬浮按钮
        const floatingBtn = document.querySelector('.ai-floating-btn');
        if(floatingBtn) {
            floatingBtn.style.display = 'flex';
        }

        // 移除遮罩层
        const overlay = document.querySelector('.ai-selection-overlay');
        if (overlay) {
            overlay.remove();
        }

        // 移除选择状态的类名
        document.body.classList.remove('ai-selecting-image');

        // 移除所有事件监听器
        if (window._imageSelectionHandlers) {
            document.removeEventListener('click', window._imageSelectionHandlers.click, true);
            document.removeEventListener('keydown', window._imageSelectionHandlers.keydown);
            window._imageSelectionHandlers = null;
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

    // 检查用户信息
    async function checkUserInfo(apiEndpoint, apiKey) {
        try {
            // 对谱AI的endpoint返回默认值
            if(apiEndpoint.includes('bigmodel.cn')) {
                const defaultUserData = {
                    name: 'GLM User',
                    balance: 1000,  // 默认余额
                    chargeBalance: 0,
                    totalBalance: 1000
                };
                console.log('[Debug] Using default user data for GLM:', defaultUserData);
                return defaultUserData;
            }

            // 其他endpoint使用原有逻辑
            return new Promise((resolve, reject) => {
                console.log('[Debug] Sending user info request to:', `${apiEndpoint}/v1/user/info`);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${apiEndpoint}/v1/user/info`,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        console.log('[Debug] User Info Raw Response:', {
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText,
                            headers: response.responseHeaders
                        });

                        if (response.status === 200) {
                            try {
                                const result = JSON.parse(response.responseText);
                                console.log('[Debug] User Info Parsed Response:', result);
                                
                                if (result.code === 20000 && result.status && result.data) {
                                    const { name, balance, chargeBalance, totalBalance } = result.data;
                                    resolve({
                                        name,
                                        balance: parseFloat(balance),
                                        chargeBalance: parseFloat(chargeBalance),
                                        totalBalance: parseFloat(totalBalance)
                                    });
                                } else {
                                    throw new Error(result.message || 'Invalid response format');
                                }
                            } catch (error) {
                                console.error('[Debug] JSON Parse Error:', error);
                                reject(error);
                            }
                        } else {
                            console.error('[Debug] HTTP Error Response:', {
                                status: response.status,
                                statusText: response.statusText,
                                response: response.responseText
                            });
                            reject(new Error(`HTTP error! status: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error('[Debug] Request Error:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('[Debug] User Info Error:', error);
            throw error;
        }
    }

    // 获取可用模型列表
    async function getAvailableModels(apiEndpoint, apiKey) {
        console.log('[Debug] Getting available models from:', apiEndpoint);

        try {
            // 如果是智谱AI的endpoint,直接返回GLM模型列表
            if(apiEndpoint.includes('bigmodel.cn')) {
                const glmModels = [
                    {
                        id: 'glm-4',
                        name: 'GLM-4'
                    },
                    {
                        id: 'glm-4v',
                        name: 'GLM-4V'
                    },
                    {
                        id: 'glm-4v-flash',
                        name: 'GLM-4V-Flash'
                    }
                ];
                console.log('[Debug] Available GLM models:', glmModels);
                return glmModels;
            }

            // 其他endpoint使用原有逻辑
            return new Promise((resolve, reject) => {
                console.log('[Debug] Sending models request to:', `${apiEndpoint}/v1/models`);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${apiEndpoint}/v1/models`,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        console.log('[Debug] Models API Raw Response:', {
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText,
                            headers: response.responseHeaders
                        });

                        if (response.status === 200) {
                            try {
                                const result = JSON.parse(response.responseText);
                                console.log('[Debug] Models API Parsed Response:', result);
                                
                                if (result.object === 'list' && Array.isArray(result.data)) {
                                    const models = result.data
                                        .filter(model => supportedVLModels.includes(model.id))
                                        .map(model => ({
                                            id: model.id,
                                            name: model.id.split('/').pop()
                                                .replace('Qwen2-VL-', 'Qwen2-')
                                                .replace('InternVL2-Llama3-', 'InternVL2-')
                                                .replace('-Instruct', '')
                                        }));
                                    console.log('[Debug] Filtered and processed models:', models);
                                    resolve(models);
                                } else {
                                    console.error('[Debug] Invalid models response format:', result);
                                    reject(new Error('Invalid models response format'));
                                }
                            } catch (error) {
                                console.error('[Debug] JSON Parse Error:', error);
                                reject(error);
                            }
                        } else {
                            console.error('[Debug] HTTP Error Response:', {
                                status: response.status,
                                statusText: response.statusText,
                                response: response.responseText
                            });
                            reject(new Error(`HTTP error! status: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error('[Debug] Models API Request Error:', error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('[Debug] Models API Error:', error);
            throw error;
        }
    }

    // 更新模型拉菜单
    function updateModelSelect(selectElement, models) {
        if (models.length === 0) {
            selectElement.innerHTML = '<option value="">未找到可用的视觉模型</option>';
            selectElement.disabled = true;
            return;
        }

        selectElement.innerHTML = '<option value="">请选择视觉模型</option>' +
            models.map(model => 
                `<option value="${model.id}" title="${model.id}">${model.name}</option>`
            ).join('');
        selectElement.disabled = false;
    }

    // 保存模型列表到GM存储
    function saveModelList(models) {
        GM_setValue('availableModels', models);
    }

    // 从GM存储获取模型列表
    function getStoredModelList() {
        return GM_getValue('availableModels', []);
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

        // 设置初始位置
        const savedPos = JSON.parse(GM_getValue('btnPosition', '{"x": 20, "y": 20}'));
        btn.style.left = (savedPos.x || 20) + 'px';
        btn.style.top = (savedPos.y || 20) + 'px';
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';

        // 自动检测key的可用性
        setTimeout(async () => {
            await checkAndUpdateKeys();
        }, 1000);

        let isDragging = false;
        let hasMoved = false;
        let startX, startY;
        let initialLeft, initialTop;
        let longPressTimer;
        let touchStartTime;

        // 触屏事件处理
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touchStartTime = Date.now();
            
            // 置长按定时器
            longPressTimer = setTimeout(() => {
                exitImageSelectionMode();
                createConfigUI();
            }, 500); // 500ms长按触发

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            const rect = btn.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
        });

        btn.addEventListener('touchmove', function(e) {
            e.preventDefault();
            clearTimeout(longPressTimer); // 移动时取消长按

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

        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            clearTimeout(longPressTimer);
            
            const touchDuration = Date.now() - touchStartTime;
            
            if (!hasMoved && touchDuration < 500) {
                // 短按进入图片选择模式
                enterImageSelectionMode();
            }
            
            if (hasMoved) {
                // 保存新位置
                const rect = btn.getBoundingClientRect();
                GM_setValue('btnPosition', JSON.stringify({
                    x: rect.left,
                    y: rect.top
                }));
            }
            
            hasMoved = false;
        });

        // 保留原有的鼠标事件处理
        btn.addEventListener('click', function(e) {
            if (e.button === 0 && !hasMoved) { // 左键点击且没有移动
                enterImageSelectionMode();
                e.stopPropagation();
            }
            hasMoved = false;
        });

        btn.addEventListener('contextmenu', function(e) {
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

        // 将按钮添加到文档中
        document.body.appendChild(btn);
        return btn;
    }

    // 检查并更新key列表
    async function checkAndUpdateKeys() {
        const endpoint = GM_getValue('apiEndpoint', '');
        const apiKeys = GM_getValue('apiKey', '').split('\n').filter(key => key.trim() !== '');
        
        if (endpoint && apiKeys.length > 0) {
            const validKeys = [];
            const keyBalances = new Map();

            for (const apiKey of apiKeys) {
                try {
                    const userInfo = await checkUserInfo(endpoint, apiKey);
                    if (userInfo.totalBalance > 0) {
                        validKeys.push(apiKey);
                        keyBalances.set(apiKey, userInfo.totalBalance);
                    } else {
                        showToast(`${apiKey.slice(0, 8)}...可用余额为0，被移除。`);
                    }
                } catch (error) {
                    console.error('Key check failed:', error);
                }
            }

            // 按余额从小到大排序
            validKeys.sort((a, b) => keyBalances.get(a) - keyBalances.get(b));

            // 更新存储的key
            if (validKeys.length > 0) {
                GM_setValue('apiKey', validKeys.join('\n'));
                showToast(`自动检测完成，${validKeys.length}个有效key`);
            } else {
                showToast('没有可用的API Key，请更新配置');
            }
        }
    }

    // 创建配置界面
    function createConfigUI() {
        // 如果已经存在配置界面，先移除
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
                    <input type="text" id="ai-endpoint" placeholder="https://api.openai.com" value="${GM_getValue('apiEndpoint', '')}">
                    <span class="input-icon clear-icon" title="清空">✕</span>
                </div>
            </div>
            <div class="input-group">
                <label>API Key (每行一个):</label>
                <div class="input-wrapper">
                    <textarea id="ai-apikey" rows="5" style="width: 100%; resize: vertical;">${GM_getValue('apiKey', '')}</textarea>
                    <span class="input-icon clear-icon" title="清空">✕</span>
                </div>
                <div class="button-row">
                    <button class="check-button" id="check-api">检测可用性</button>
                </div>
            </div>
            <div class="input-group">
                <label>可用模型:</label>
                <select id="ai-model">
                    <option value="">加载中...</option>
                </select>
            </div>
            <div class="button-group">
                <button type="button" class="cancel-button" id="ai-cancel-config">取消</button>
                <button type="button" class="save-button" id="ai-save-config">保存</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 初始化模型下拉菜单
        const modelSelect = modal.querySelector('#ai-model');
        const storedModels = getStoredModelList();
        const selectedModel = GM_getValue('selectedModel', '');
        
        if (storedModels.length > 0) {
            updateModelSelect(modelSelect, storedModels);
            if (selectedModel) {
                modelSelect.value = selectedModel;
            }
        } else {
            modelSelect.innerHTML = '<option value="">请先检测API可用性</option>';
            modelSelect.disabled = true;
        }

        // 添加清空按钮事件
        const clearButtons = modal.querySelectorAll('.clear-icon');
        clearButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const input = this.parentElement.querySelector('input, textarea');
                if (input) {
                    input.value = '';
                    input.focus();
                }
            });
        });

        // 检测API可用性
        const checkButton = modal.querySelector('#check-api');
        if (checkButton) {
            checkButton.addEventListener('click', async function() {
                const endpoint = modal.querySelector('#ai-endpoint')?.value?.trim() || '';
                const apiKeys = modal.querySelector('#ai-apikey')?.value?.trim().split('\n').filter(key => key.trim() !== '') || [];

                if (!endpoint || apiKeys.length === 0) {
                    showToast('请先填写API Endpoint和至少一个API Key');
                    return;
                }

                checkButton.disabled = true;
                modelSelect.disabled = true;
                modelSelect.innerHTML = '<option value="">检测中...</option>';

                try {
                    // 检查每个key的可用性
                    const validKeys = [];
                    const keyBalances = new Map();

                    for (const apiKey of apiKeys) {
                        try {
                            const userInfo = await checkUserInfo(endpoint, apiKey);
                            if (userInfo.totalBalance > 0) {
                                validKeys.push(apiKey);
                                keyBalances.set(apiKey, userInfo.totalBalance);
                            } else {
                                showToast(`${apiKey.slice(0, 8)}...可用余额为0，被移除。`);
                            }
                        } catch (error) {
                            console.error('Key check failed:', error);
                            showToast(`${apiKey.slice(0, 8)}...验证失败，被移除。`);
                        }
                    }

                    // 按余额从小到大排序
                    validKeys.sort((a, b) => keyBalances.get(a) - keyBalances.get(b));

                    // 更新输入框中的key
                    const apiKeyInput = modal.querySelector('#ai-apikey');
                    if (apiKeyInput) {
                        apiKeyInput.value = validKeys.join('\n');
                    }

                    // 获取可用模型列表（使用第一个有效的key）
                    if (validKeys.length > 0) {
                        const models = await getAvailableModels(endpoint, validKeys[0]);
                        saveModelList(models);
                        updateModelSelect(modelSelect, models);
                        showToast(`检测完成，${validKeys.length}个有效key`);
                    } else {
                        showToast('没有可用的API Key');
                        modelSelect.innerHTML = '<option value="">无可用API Key</option>';
                        modelSelect.disabled = true;
                    }
                } catch (error) {
                    showToast('API检测失败：' + error.message);
                    modelSelect.innerHTML = '<option value="">获取模型列表失败</option>';
                    modelSelect.disabled = true;
                } finally {
                    checkButton.disabled = false;
                }
            });
        }

        // 保存配置
        const saveButton = modal.querySelector('#ai-save-config');
        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const endpoint = modal.querySelector('#ai-endpoint')?.value?.trim() || '';
                const apiKeys = modal.querySelector('#ai-apikey')?.value?.trim() || '';
                const selectedModel = modelSelect?.value || '';

                if (!endpoint || !apiKeys) {
                    showToast('请填写API Endpoint和至少一个API Key');
                    return;
                }

                if (!selectedModel) {
                    showToast('请选择一个视觉模型');
                    return;
                }

                GM_setValue('apiEndpoint', endpoint);
                GM_setValue('apiKey', apiKeys);
                GM_setValue('selectedModel', selectedModel);
                showToast('配置已保存');
                
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            });
        }

        // 取消配置
        const cancelButton = modal.querySelector('#ai-cancel-config');
        if (cancelButton) {
            cancelButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            });
        }

        // 点击遮罩层关闭
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }
        });

        // 阻止模态框内的点击事件冒泡
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 显示图像选择面
    function showImageSelectionModal() {
        const overlay = document.createElement('div');
        overlay.className = 'ai-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'ai-config-modal';
        modal.innerHTML = `
            <h3>选择要识别的图像</h3>
            <div class="ai-image-options">
                <button id="ai-all-images">识别所有图片</button>
                <button id="ai-visible-images">仅识别可见图片</button>
            </div>
            <button id="ai-cancel">取消</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 添加事件监听
        modal.querySelector('#ai-all-images').onclick = () => {
            if (checkApiConfig()) {
                describeAllImages();
                overlay.remove();
            }
        };

        modal.querySelector('#ai-visible-images').onclick = () => {
            if (checkApiConfig()) {
                describeVisibleImages();
                overlay.remove();
            }
        };

        modal.querySelector('#ai-cancel').onclick = () => {
            overlay.remove();
        };

        // 点击遮罩层关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    function showDescriptionModal(description, balanceInfo) {
        // 移除已存在的结果框
        const existingModal = document.querySelector('.ai-result-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'ai-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'ai-result-modal';
        modal.innerHTML = `
            <div class="result-content">
                <div class="description-code">
                    <code>${description}</code>
                </div>
                <div class="copy-hint">点击上方文本可复制</div>
                <button class="close-button">×</button>
                ${balanceInfo ? `<div class="balance-info">${balanceInfo}</div>` : ''}
            </div>
        `;

        // 添加复制功能
        const codeBlock = modal.querySelector('.description-code');
        codeBlock.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(description);
                showToast('已复制到剪贴板');
            } catch (err) {
                console.error('[Debug] Copy failed:', err);
                // 如果 clipboard API 失败，使用 GM_setClipboard 作为备选
                GM_setClipboard(description);
                showToast('已复制到剪贴板');
            }
        });

        // 添加关闭功能
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            overlay.remove();
        });

        // ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    // 添加计算成本的函数
    function calculateCost(imageSize, modelName) {
        let baseCost;
        switch (modelName) {
            case 'glm-4v':
                baseCost = 0.015; // GLM-4V的基础成本
                break;
            case 'glm-4v-flash':
                baseCost = 0.002; // GLM-4V-Flash的基础成本
                break;
            case 'Qwen/Qwen2-VL-72B-Instruct':
                baseCost = 0.015;
                break;
            case 'Pro/Qwen/Qwen2-VL-7B-Instruct':
                baseCost = 0.005;
                break;
            case 'OpenGVLab/InternVL2-Llama3-76B':
                baseCost = 0.015;
                break;
            case 'OpenGVLab/InternVL2-26B':
                baseCost = 0.008;
                break;
            case 'Pro/OpenGVLab/InternVL2-8B':
                baseCost = 0.003;
                break;
            case 'deepseek-ai/deepseek-vl2':
                baseCost = 0.012; // 设置deepseek-vl2的基础成本
                break;
            default:
                baseCost = 0.01;
        }

        // 图片大小影响因子（每MB增加一定成本）
        const imageSizeMB = imageSize / (1024 * 1024);
        const sizeMultiplier = 1 + (imageSizeMB * 0.1); // 每MB增加10%成本

        return baseCost * sizeMultiplier;
    }

    // 初始化
    function initialize() {
        // 确保DOM加载成后再创建按钮
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