// ==UserScript==
// @name         图像识别助手(完整版)
// @namespace    http://your-namespace.com
// @version      2.0
// @description  完整的图像识别解决方案
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_getResourceURL
// @connect      api.jfbym.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-base64/3.7.5/base64.min.js
// @resource     iconOK https://img.icons8.com/color/48/000000/ok--v1.png
// @resource     iconERR https://img.icons8.com/color/48/000000/error--v1.png
// @downloadURL https://update.greasyfork.org/scripts/530577/%E5%9B%BE%E5%83%8F%E8%AF%86%E5%88%AB%E5%8A%A9%E6%89%8B%28%E5%AE%8C%E6%95%B4%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530577/%E5%9B%BE%E5%83%8F%E8%AF%86%E5%88%AB%E5%8A%A9%E6%89%8B%28%E5%AE%8C%E6%95%B4%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储管理
    const ConfigManager = {
        KEY_TOKEN: 'ocr_token_v2',
        KEY_TYPEID: 'ocr_typeid_v2',

        getConfig() {
            return {
                token: GM_getValue(this.KEY_TOKEN, ''),
                typeid: GM_getValue(this.KEY_TYPEID, '10110')
            };
        },

        saveConfig(token, typeid) {
            GM_setValue(this.KEY_TOKEN, token);
            GM_setValue(this.KEY_TYPEID, typeid);
        },

        validateInput(token, typeid) {
            if (!token || token.length < 32) {
                return { valid: false, message: 'Token格式无效' };
            }
            if (!/^\d{5}$/.test(typeid)) {
                return { valid: false, message: '类型ID需为5位数字' };
            }
            return { valid: true };
        }
    };

    // UI管理器
    const UIManager = {
        container: null,
        elements: {},

        init() {
            this.createContainer();
            this.createStyles();
            return this.elements;
        },

        createContainer() {
            this.container = document.createElement('div');
            this.container.className = 'ocr-container';
            
            this.container.innerHTML = `
                <div class="drop-zone">
                    <div class="drop-text">拖放图片到此区域</div>
                    <div class="preview-area"></div>
                </div>
                <div class="config-section">
                    <input type="password" class="config-input" id="token" 
                        placeholder="API Token" spellcheck="false">
                    <div class="token-status"></div>
                </div>
                <div class="config-section">
                    <input type="text" class="config-input" id="typeid" 
                        placeholder="类型ID" inputmode="numeric" pattern="\\d{5}">
                    <div class="help-text">示例：10110(通用识别)</div>
                </div>
                <div class="action-bar">
                    <button class="btn save-btn">保存配置</button>
                    <button class="btn reset-btn">重置配置</button>
                </div>
                <div class="result-container">
                    <div class="result-header">识别结果</div>
                    <div class="result-content"></div>
                </div>
            `;

            document.body.appendChild(this.container);
            
            this.elements = {
                dropZone: this.container.querySelector('.drop-zone'),
                previewArea: this.container.querySelector('.preview-area'),
                tokenInput: this.container.querySelector('#token'),
                typeidInput: this.container.querySelector('#typeid'),
                tokenStatus: this.container.querySelector('.token-status'),
                resultContent: this.container.querySelector('.result-content'),
                saveBtn: this.container.querySelector('.save-btn'),
                resetBtn: this.container.querySelector('.reset-btn')
            };

            return this.elements;
        },

        createStyles() {
            GM_addStyle(`
                .ocr-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 99999;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    width: 320px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    transform: translateY(0);
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }

                .ocr-container:hover {
                    transform: translateY(-2px);
                }

                .drop-zone {
                    border: 2px dashed #cccccc;
                    border-radius: 8px;
                    padding: 25px;
                    text-align: center;
                    margin-bottom: 20px;
                    position: relative;
                    transition: border-color 0.3s ease;
                }

                .drop-zone.active {
                    border-color: #2196F3;
                    background-color: #f8f9fa;
                }

                .preview-area {
                    max-width: 100%;
                    max-height: 200px;
                    margin-top: 15px;
                    display: none;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .preview-area img {
                    width: 100%;
                    height: auto;
                    object-fit: contain;
                }

                .config-section {
                    margin: 15px 0;
                    position: relative;
                }

                .config-input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }

                .config-input:focus {
                    border-color: #2196F3;
                    outline: none;
                }

                .token-status {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #ddd;
                    transition: background-color 0.3s ease;
                }

                .token-status.valid { background: #4CAF50; }
                .token-status.invalid { background: #f44336; }

                .help-text {
                    font-size: 12px;
                    color: #666;
                    margin-top: 6px;
                    text-align: left;
                }

                .action-bar {
                    display: flex;
                    gap: 10px;
                    margin: 20px 0;
                }

                .btn {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .save-btn {
                    background: #2196F3;
                    color: white;
                }

                .save-btn:hover {
                    background: #1976D2;
                }

                .reset-btn {
                    background: #f44336;
                    color: white;
                }

                .reset-btn:hover {
                    background: #d32f2f;
                }

                .result-container {
                    border: 1px solid #eee;
                    border-radius: 6px;
                    overflow: hidden;
                }

                .result-header {
                    background: #f8f9fa;
                    padding: 12px;
                    font-weight: 500;
                    border-bottom: 1px solid #eee;
                }

                .result-content {
                    padding: 15px;
                    min-height: 60px;
                    max-height: 300px;
                    overflow-y: auto;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-wrap;
                }
            `);
        },

        showNotification(type, message) {
            const icons = {
                success: GM_getResourceURL('iconOK'),
                error: GM_getResourceURL('iconERR')
            };

            GM_notification({
                text: message,
                title: type === 'success' ? '操作成功' : '发生错误',
                image: icons[type] || icons.error,
                silent: true
            });
        }
    };

    // API服务模块
    const OCRService = {
        ENDPOINT: 'http://api.jfbym.com/api/YmServer/customApi',

        async recognizeImage(token, typeid, imageFile) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = () => {
                    const base64Data = reader.result.split(',')[1];
                    
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: this.ENDPOINT,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            token,
                            type: typeid,
                            image: base64Data
                        }),
                        responseType: 'json',
                        timeout: 15000,
                        onload: (response) => {
                            if (response.status === 200) {
                                resolve(response.response);
                            } else {
                                reject(new Error(`API请求失败: HTTP ${response.status}`));
                            }
                        },
                        onerror: (error) => {
                            reject(new Error(`网络错误: ${error.error}`));
                        },
                        ontimeout: () => {
                            reject(new Error('请求超时，请检查网络连接'));
                        }
                    });
                };

                reader.onerror = (error) => {
                    reject(new Error('文件读取失败'));
                };

                reader.readAsDataURL(imageFile);
            });
        },

        async validateToken(token) {
            try {
                const testImage = new Blob(
                    [Base64.atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')], 
                    { type: 'image/png' }
                );
                const response = await this.recognizeToken(token, '10000', testImage);
                return response.code === 10000;
            } catch (error) {
                console.error('Token验证失败:', error);
                return false;
            }
        }
    };

    // 主应用逻辑
    class OCRApplication {
        constructor() {
            this.ui = UIManager.init();
            this.config = ConfigManager.getConfig();
            this.initEventListeners();
            this.loadSavedConfig();
        }

        loadSavedConfig() {
            this.ui.tokenInput.value = this.config.token;
            this.ui.typeidInput.value = this.config.typeid;
            this.validateTokenInput();
        }

        initEventListeners() {
            // Token输入验证
            let validateTimeout;
            this.ui.tokenInput.addEventListener('input', () => {
                clearTimeout(validateTimeout);
                validateTimeout = setTimeout(() => this.validateTokenInput(), 500);
            });

            // 类型ID输入验证
            this.ui.typeidInput.addEventListener('input', () => {
                this.ui.typeidInput.value = this.ui.typeidInput.value.replace(/\D/g, '');
            });

            // 保存按钮
            this.ui.saveBtn.addEventListener('click', async () => {
                const token = this.ui.tokenInput.value.trim();
                const typeid = this.ui.typeidInput.value.trim();

                const validation = ConfigManager.validateInput(token, typeid);
                if (!validation.valid) {
                    UIManager.showNotification('error', validation.message);
                    return;
                }

                try {
                    const isValid = await OCRService.validateToken(token);
                    if (!isValid) {
                        throw new Error('Token验证失败');
                    }

                    ConfigManager.saveConfig(token, typeid);
                    UIManager.showNotification('success', '配置保存成功');
                    this.ui.tokenStatus.classList.add('valid');
                } catch (error) {
                    UIManager.showNotification('error', error.message);
                    this.ui.tokenStatus.classList.add('invalid');
                }
            });

            // 重置按钮
            this.ui.resetBtn.addEventListener('click', () => {
                GM_setValue(ConfigManager.KEY_TOKEN, '');
                GM_setValue(ConfigManager.KEY_TYPEID, '10110');
                this.loadSavedConfig();
                UIManager.showNotification('success', '已重置为默认配置');
            });

            // 拖放事件处理
            ['dragenter', 'dragover'].forEach(eventName => {
                this.ui.dropZone.addEventListener(eventName, e => this.handleDrag(e));
            });

            ['dragleave', 'drop'].forEach(eventName => {
                this.ui.dropZone.addEventListener(eventName, e => this.handleDragEnd(e));
            });

            this.ui.dropZone.addEventListener('drop', e => this.handleDrop(e));
        }

        async validateTokenInput() {
            const token = this.ui.tokenInput.value.trim();
            this.ui.tokenStatus.className = 'token-status';

            if (!token) return;

            try {
                const isValid = await OCRService.validateToken(token);
                this.ui.tokenStatus.classList.add(isValid ? 'valid' : 'invalid');
                if (!isValid) {
                    throw new Error('无效的API Token');
                }
            } catch (error) {
                UIManager.showNotification('error', error.message);
            }
        }

        handleDrag(e) {
            e.preventDefault();
            this.ui.dropZone.classList.add('active');
        }

        handleDragEnd(e) {
            e.preventDefault();
            this.ui.dropZone.classList.remove('active');
        }

        async handleDrop(e) {
            e.preventDefault();
            this.ui.dropZone.classList.remove('active');

            const files = e.dataTransfer.files;
            if (files.length === 0) return;

            const file = files[0];
            if (!file.type.startsWith('image/')) {
                UIManager.showNotification('error', '仅支持图片文件');
                return;
            }

            try {
                // 显示预览
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.ui.previewArea.innerHTML = `<img src="${e.target.result}">`;
                    this.ui.previewArea.style.display = 'block';
                };
                reader.readAsDataURL(file);

                // 开始识别
                this.ui.resultContent.textContent = '识别中...';
                const response = await OCRService.recognizeImage(
                    this.ui.tokenInput.value.trim(),
                    this.ui.typeidInput.value.trim(),
                    file
                );

                if (response.code === 10000) {
                    this.ui.resultContent.textContent = response.data.data;
                } else {
                    throw new Error(response.msg || '识别失败');
                }
            } catch (error) {
                this.ui.resultContent.textContent = `错误: ${error.message}`;
                UIManager.showNotification('error', error.message);
            }
        }
    }

    // 初始化应用
    window.addEventListener('load', () => new OCRApplication());
})();