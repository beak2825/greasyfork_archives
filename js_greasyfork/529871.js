// ==UserScript==
// @name         Booru Enhance
// @namespace    http://tampermonkey.net/
// @version      2025-07-19
// @description  Booru功能增强
// @author       otokoneko
// @match        https://booru.loli.mom/media_assets
// @match        https://booru.loli.mom/uploads/*
// @match        https://www.amazon.co.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=danbooru.donmai.us
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529871/Booru%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/529871/Booru%20Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加主机配置
    const HOST = 'https://booru.loli.mom';
    const STORAGE_KEY = 'AMAZON_PRODUCT_DATA';
    const POLL_INTERVAL = 5000; // 5秒轮询一次
    const MAX_RETRIES = 3;

    // 进度阶段配置
    const PROGRESS_STAGES = {
        fetching: {
            text: '正在获取商品信息...',
            percent: 20
        },
        creating: {
            text: '正在创建上传任务...',
            percent: 40
        },
        polling: {
            text: '正在处理图片上传...',
            percent: 70
        },
        redirecting: {
            text: '准备跳转中...',
            percent: 100
        },
        error: {
            text: '发生错误',
            percent: 100,
            isError: true
        }
    };

    let progressTimer;

    if (location.href.includes('amazon.co.jp')) {
        initAmazonPage();
    } else if (/https:\/\/booru\.loli\.mom\/uploads\/.*/.test(location.href)) {
        const uploadId = location.href.split('/').pop();
        initUploadPage(uploadId);
    } else {
        initRequestPage();
    }

    function safeSetValue(element, value) {
        setTimeout(() => {
            element.focus();
            element.value = value;
            element.blur();
        }, 500);
    }

    function initRequestPage() {
        // 创建界面元素
        const container = document.createElement('div');
        container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: white;
        padding: 15px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        border-radius: 5px;
    `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入亚马逊书籍URL';
        input.style.width = '300px';
        input.style.marginRight = '10px';

        const button = document.createElement('button');
        button.textContent = '上传';
        button.style.padding = '5px 15px';

        container.appendChild(input);
        container.appendChild(button);
        document.body.appendChild(container);
        createProgressOverlay();


        // 修改点击事件处理
        button.addEventListener('click', async () => {
            const amazonUrl = input.value.trim();

            if (!amazonUrl.includes('amazon')) {
                alert("请输入有效的亚马逊URL");
                return;
            }

            try {
                updateProgress('fetching');
                const productInfo = await fetchProductInfo(amazonUrl);

                await handleUploadProcess(productInfo);

            } catch (error) {
                console.error("获取商品信息失败:", error);
                alert("获取商品信息失败，请检查控制台");
            }
        });
    }

    function initUploadPage(uploadId) {
        const tryFill = () => {
            // 获取存储的商品数据
            const storedData = GM_getValue(`${STORAGE_KEY}_${uploadId}`);
            if (!storedData) return;
            console.log(storedData);

            try {
                const productInfo = JSON.parse(storedData);

                // 定义目标字段映射
                const fieldMap = {
                    'post_artist_commentary_original_title': productInfo.title,
                    'post_artist_commentary_original_description': productInfo.description
                };

                // 自动填写表单
                Object.entries(fieldMap).forEach(([id, value]) => {
                    const input = document.querySelector(`#${id}`);
                    if (input) {
                        safeSetValue(input, value);
                    }
                });

                // 清空存储数据
                // GM_setValue(`${STORAGE_KEY}_${uploadId}`, null);
                console.log('自动填写完成！');

            } catch (error) {
                console.error('表单填写失败:', error);
            }
        };

        window.addEventListener('load', tryFill);
    }

    function initAmazonPage() {
        // 创建快速上传按钮
        const quickUploadBtn = document.createElement('button');
        quickUploadBtn.textContent = '一键上传到Booru';
        quickUploadBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(quickUploadBtn);
        createProgressOverlay();

        quickUploadBtn.addEventListener('click', async () => {
            try {
                updateProgress('fetching');
                const productInfo = await fetchProductInfo(location.href, true);
                await handleUploadProcess(productInfo);
            } catch (error) {
                console.error("上传失败:", error);
                updateProgress('error', `上传失败: ${error.message}`);
            }
        });
    }

    function createProgressOverlay() {
        const style = document.createElement('style');
        style.textContent = `
            .progress-overlay {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                padding: 30px 50px;
                border-radius: 10px;
                color: white;
                z-index: 10000;
                min-width: 300px;
                text-align: center;
                backdrop-filter: blur(5px);
                display: none;
            }
            .progress-bar {
                height: 20px;
                background: #333;
                border-radius: 10px;
                margin: 15px 0;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: #4CAF50;
                transition: width 0.3s ease, background 0.3s;
                width: 0;
            }
            .progress-text {
                font-size: 14px;
                margin-bottom: 10px;
                min-height: 20px;
            }
            .error-state .progress-fill {
                background: #f44336;
            }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.className = 'progress-overlay';
        overlay.innerHTML = `
            <div class="progress-text"></div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="time-elapsed">耗时: 0秒</div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    function updateProgress(stageKey, customMessage) {
        const overlay = document.querySelector('.progress-overlay');
        const stage = PROGRESS_STAGES[stageKey];
        const textElement = overlay.querySelector('.progress-text');
        const fillElement = overlay.querySelector('.progress-fill');
        const timeElement = overlay.querySelector('.time-elapsed');

        // 更新显示状态
        overlay.style.display = 'block';
        overlay.classList.toggle('error-state', stage.isError);
        textElement.textContent = customMessage || stage.text;
        fillElement.style.width = `${stage.percent}%`;

        // 更新时间显示
        if (stageKey === 'fetching') {
            const startTime = Date.now();
            progressTimer = setInterval(() => {
                const seconds = Math.floor((Date.now() - startTime) / 1000);
                timeElement.textContent = `耗时: ${seconds}秒`;
            }, 1000);
        }

        if (stageKey === 'redirecting' || stageKey === 'error') {
            clearInterval(progressTimer);
        }
    }

    // 处理商品信息获取
    async function fetchProductInfo(url, useCurrentPage = false) {
        function extractDescription(element) {
            if (!element) return "";
            // 获取HTML内容
            const html = element.innerHTML;
            // 将<br>和</p>标签转换为换行符
            const text = html
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>/gi, '\n')
                // 移除所有其他HTML标签
                .replace(/<[^>]+>/g, '')
                // 移除HTML实体
                .replace(/&nbsp;/g, ' ')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                // 清理空白行但保留有效换行
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .join('\n')
                .trim();
            return text;
        }

        return new Promise((resolve, reject) => {
            if (useCurrentPage) {
                try {
                    const productData = {
                        title: document.getElementById("productTitle")?.textContent?.trim() || "未找到标题",
                        image: document.getElementById("landingImage")?.getAttribute('data-old-hires') || "未找到图片",
                        description: extractDescription(document.querySelector("#bookDescription_feature_div span")) || ""
                    };
                    resolve(productData);
                } catch (error) {
                    reject(error);
                }
                return;
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    const productData = {
                        title: doc.getElementById("productTitle")?.textContent?.trim() || "未找到标题",
                        image: doc.getElementById("landingImage")?.getAttribute('data-old-hires') || "未找到图片",
                        description: extractDescription(doc.querySelector("#bookDescription_feature_div span")) || ""
                    };

                    resolve(productData);
                },
                onerror: reject
            });
        });
    }

    async function handleUploadProcess(productInfo) {
        try {
            // 第一步：创建上传任务
            updateProgress('creating', '正在初始化上传...');
            const uploadId = await createUploadTask(productInfo.image);

            // 第二步：轮询处理状态
            updateProgress('polling', '等待服务器处理...');
            const finalUrl = await pollUploadStatus(uploadId);

            // 存储最终数据
            updateProgress('redirecting');
            GM_setValue(`${STORAGE_KEY}_${uploadId}`, JSON.stringify({
                ...productInfo,
                finalUrl
            }));

            // 跳转到目标页面
            window.open(finalUrl, '_blank');
            location.reload();
        } catch (error) {
            console.error('上传流程失败:', error);
            alert(`上传失败: ${error.message}`);
        }
    }

    // 创建上传任务
    function createUploadTask(imageUrl) {
        return new Promise((resolve, reject) => {
            const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
            const formData = [
                `--${boundary}`,
                'Content-Disposition: form-data; name="upload[source]"',
                '',
                imageUrl,
                `--${boundary}`,
                'Content-Disposition: form-data; name="commit"',
                '',
                'Upload',
                `--${boundary}--`
            ].join('\r\n');

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${HOST}/uploads.json`,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Accept': 'application/json'
                },
                data: formData,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.id) {
                            resolve(data.id);
                        } else {
                            reject(new Error('无效的上传响应'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    // 轮询上传状态
    function pollUploadStatus(uploadId, retries = MAX_RETRIES) {
        return new Promise((resolve, reject) => {
            const checkStatus = () => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${HOST}/uploads/${uploadId}.json`,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            switch (data.status) {
                                case 'completed':
                                    resolve(`${HOST}/uploads/${uploadId}`);
                                    break;
                                case 'failed':
                                    reject(new Error('上传处理失败'));
                                    break;
                                default:
                                    if (retries > 0) {
                                        setTimeout(checkStatus, POLL_INTERVAL);
                                        retries--;
                                    } else {
                                        reject(new Error('轮询超时'));
                                    }
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            };
            checkStatus();
        });
    }
})();