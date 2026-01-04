// ==UserScript==
// @name         Docker镜像离线下载器
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在Docker Hub页面添加下载按钮，实现离线镜像下载功能
// @author       lfree
// @match        https://hub.docker.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      registry.lfree.org
// @connect      registry-1.docker.io
// @connect      auth.docker.io
// @connect      production.cloudflare.docker.com
// @connect      cloudflare.docker.com
// @connect      cdn.docker.com
// @connect      docker.com
// @connect      docker.io
// @connect      ghcr.io
// @connect      gcr.io
// @connect      quay.io
// @connect      registry.k8s.io
// @connect      *.docker.com
// @connect      *.docker.io
// @connect      *.cloudflare.com
// @connect      *
// @require      https://update.greasyfork.org/scripts/539732/1609156/tarballjs.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539734/Docker%E9%95%9C%E5%83%8F%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539734/Docker%E9%95%9C%E5%83%8F%E7%A6%BB%E7%BA%BF%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 全局变量和配置 ====================
    
    let downloadInProgress = false; // 下载进程状态标志
    let manifestData = null; // 镜像清单数据存储
    let downloadedLayers = new Map(); // 已下载镜像层的映射表
    let tempLayerCache = new Map(); // 临时层数据缓存
    let db = null; // IndexedDB数据库实例
    let cachedArchitectures = null; // 缓存的架构信息，包含架构和对应的SHA256
    let useTemporaryCache = false; // 是否使用临时缓存（minimal模式）
    let selectedMemoryMode = 'minimal'; // 内存模式选择，直接使用最小内存模式
    let downloadProgressMap = new Map(); // 实时下载进度映射
    let progressUpdateInterval = null; // 进度更新定时器
    let userManuallySelectedArch = false; // 标记用户是否手动选择过架构

    // API和Registry配置
    const API_BASE_URL = 'https://registry.lfree.org/api';
    let hub_host = 'registry-1.docker.io';
    const auth_url = 'https://auth.docker.io';
    
    // 下载模式配置
    let downloadMode = 'remote'; // 'remote' 或 'direct'
    const DOWNLOAD_MODES = {
        remote: '远程API',
        direct: '直接访问'
    };

    // ==================== GM_xmlhttpRequest包装函数 ====================

    /**
     * GM_xmlhttpRequest的Promise包装函数，用于替代fetch以避免CORS问题
     * 功能：将GM_xmlhttpRequest包装为Promise格式，提供与fetch相似的API
     * @param {string} url - 请求URL
     * @param {Object} options - 请求选项
     * @returns {Promise<Response>} 包装后的响应对象
     */
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                responseType: options.responseType || (options.stream ? 'arraybuffer' : 'json'),
                timeout: options.timeout || 30000, // 30秒超时
                onload: function(response) {
                    // 解析响应头为Headers对象格式
                    const headers = new Map();
                    if (response.responseHeaders) {
                        // GM_xmlhttpRequest返回的responseHeaders是字符串格式
                        const headersStr = response.responseHeaders;
                        const headerLines = headersStr.split('\r\n');
                        for (const line of headerLines) {
                            const colonIndex = line.indexOf(':');
                            if (colonIndex > 0) {
                                const key = line.substring(0, colonIndex).trim().toLowerCase();
                                const value = line.substring(colonIndex + 1).trim();
                                headers.set(key, value);
                            }
                        }
                    }
                    
                    // 创建类似fetch Response的对象
                    const responseObj = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        headers: {
                            get: function(name) {
                                return headers.get(name.toLowerCase());
                            },
                            has: function(name) {
                                return headers.has(name.toLowerCase());
                            },
                            entries: function() {
                                return headers.entries();
                            },
                            keys: function() {
                                return headers.keys();
                            },
                            values: function() {
                                return headers.values();
                            },
                            forEach: function(callback) {
                                headers.forEach(callback);
                            }
                        },
                        url: response.finalUrl || url,
                        json: async function() {
                            try {
                                if (typeof response.response === 'string') {
                                    return JSON.parse(response.response);
                                } else if (response.response instanceof ArrayBuffer) {
                                    const text = new TextDecoder().decode(response.response);
                                    return JSON.parse(text);
                                } else {
                                    return response.response;
                                }
                            } catch (e) {
                                throw new Error('Invalid JSON response: ' + e.message);
                            }
                        },
                        text: async function() {
                            if (typeof response.response === 'string') {
                                return response.response;
                            } else if (response.response instanceof ArrayBuffer) {
                                return new TextDecoder().decode(response.response);
                            } else {
                                return response.responseText || String(response.response);
                            }
                        },
                        arrayBuffer: async function() {
                            if (response.response instanceof ArrayBuffer) {
                                return response.response;
                            } else if (typeof response.response === 'string') {
                                return new TextEncoder().encode(response.response).buffer;
                            } else {
                                throw new Error('Cannot convert response to ArrayBuffer');
                            }
                        },
                        body: {
                            getReader: function() {
                                // 简化的流读取器实现，适用于GM_xmlhttpRequest
                                let consumed = false;
                                return {
                                    read: async function() {
                                        if (consumed) {
                                            return { done: true, value: undefined };
                                        }
                                        consumed = true;
                                        
                                        let data;
                                        if (response.response instanceof ArrayBuffer) {
                                            data = new Uint8Array(response.response);
                                        } else if (typeof response.response === 'string') {
                                            data = new TextEncoder().encode(response.response);
                                        } else {
                                            data = new Uint8Array(0);
                                        }
                                        
                                        return { done: false, value: data };
                                    }
                                };
                            }
                        }
                    };
                    resolve(responseObj);
                },
                onerror: function(response) {
                    const errorMsg = response.statusText || response.error || 'Network request failed';
                    reject(new Error(`GM_xmlhttpRequest error: ${errorMsg}`));
                },
                ontimeout: function() {
                    reject(new Error('Request timeout'));
                },
                onabort: function() {
                    reject(new Error('Request aborted'));
                }
            };

            // 如果有请求体，添加到选项中
            if (options.body) {
                requestOptions.data = options.body;
            }

            // 设置Content-Type（如果需要）
            if (options.body && !requestOptions.headers['Content-Type']) {
                requestOptions.headers['Content-Type'] = 'application/json';
            }

            try {
                GM_xmlhttpRequest(requestOptions);
            } catch (error) {
                reject(new Error('Failed to create GM_xmlhttpRequest: ' + error.message));
            }
        });
    }

    // ==================== 样式定义 ====================
    
    /**
     * 添加自定义CSS样式到页面
     * 功能：定义下载器界面的所有视觉样式
     */
    function addCustomStyles() {
        GM_addStyle(`
            /* 主要下载按钮样式 - 内联版本 */
            .docker-download-btn {
                background: linear-gradient(145deg, #28a745, #218838);
                color: white;
                border: 2px solid #28a745;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: inline-flex;
                align-items: center;
                gap: 6px;
                margin: 0 8px 0 0;
                box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
                text-decoration: none;
                position: relative;
                overflow: hidden;
                vertical-align: middle;
            }

            /* 按钮悬停效果 */
            .docker-download-btn:hover {
                background: linear-gradient(145deg, #218838, #1e7e34);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
                color: white;
                text-decoration: none;
            }

            /* 按钮禁用状态 */
            .docker-download-btn:disabled {
                background: linear-gradient(145deg, #6c757d, #5a6268);
                cursor: not-allowed;
                transform: none;
                animation: downloadProgress 2s infinite linear;
            }

            /* 架构选择下拉框样式 - 与按钮统一 */
            .arch-selector {
                margin: 0;
                padding: 8px 16px;
                border: 2px solid #28a745;
                border-radius: 6px;
                background: white;
                font-size: 13px;
                font-weight: 600;
                min-width: 120px;
                height: 34px;
                vertical-align: middle;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-sizing: border-box;
            }

            .arch-selector:hover {
                border-color: #218838;
                box-shadow: 0 2px 8px rgba(40, 167, 69, 0.25);
                transform: translateY(-1px);
            }

            .arch-selector:focus {
                outline: none;
                border-color: #218838;
                box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.25);
            }

            /* 移除进度显示区域样式，改为在按钮上显示 */

            /* 下载进度动画 */
            @keyframes downloadProgress {
                0% { background-position: -100% 0; }
                100% { background-position: 100% 0; }
            }

            /* 内联按钮容器样式 */
            .docker-download-container {
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                margin: 0 10px !important;
                vertical-align: middle !important;
                background: none !important;
                border: none !important;
                padding: 0 !important;
                box-shadow: none !important;
                font-family: inherit !important;
            }

            /* 检测架构按钮特殊样式 */
            .detect-arch-btn {
                background: linear-gradient(145deg, #6f42c1, #5a32a3);
                border-color: #6f42c1;
            }

            .detect-arch-btn:hover {
                background: linear-gradient(145deg, #5a32a3, #4e2a87);
                border-color: #5a32a3;
            }

            /* 模式切换按钮样式 */
            .mode-toggle-btn {
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            .mode-toggle-btn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }

            .mode-toggle-btn:active::before {
                width: 300px;
                height: 300px;
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                .docker-download-container {
                    flex-direction: column !important;
                    align-items: stretch !important;
                }
                
                .docker-download-btn,
                .arch-selector {
                    width: 100% !important;
                    margin: 5px 0 !important;
                    min-width: auto !important;
                }
            }
        `);
    }

    // ==================== 数据存储管理 ====================

    /**
     * 初始化IndexedDB数据库
     * 功能：创建和配置用于存储镜像层数据的本地数据库
     * @returns {Promise} 数据库初始化完成的Promise
     */
    function initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('DockerImageStore', 1);

            // 数据库连接失败处理
            request.onerror = () => reject(request.error);
            
            // 数据库连接成功处理
            request.onsuccess = () => {
                db = request.result;
                resolve();
            };

            // 数据库结构升级处理
            request.onupgradeneeded = (event) => {
                const database = event.target.result;

                // 创建镜像层存储表
                if (!database.objectStoreNames.contains('layers')) {
                    const layerStore = database.createObjectStore('layers', { keyPath: 'digest' });
                    layerStore.createIndex('imageName', 'imageName', { unique: false });
                }

                // 创建镜像清单存储表
                if (!database.objectStoreNames.contains('manifests')) {
                    const manifestStore = database.createObjectStore('manifests', { keyPath: 'key' });
                }
            };
        });
    }

    // ==================== 页面信息提取 ====================

    /**
     * 从当前Docker Hub页面提取镜像信息
     * 功能：自动识别并提取镜像名称和标签信息
     * @returns {Object} 包含imageName和imageTag的对象
     */
    function extractImageInfo() {
        const url = window.location.pathname;
        const pathParts = url.split('/').filter(part => part);

        let imageName = '';
        let imageTag = 'latest';

        // Docker Hub URL格式分析和处理
        // 支持的格式：
        // - 官方镜像: /r/nginx, /_/nginx
        // - 用户镜像: /r/username/imagename
        // - 组织镜像: /r/organization/imagename
        // - 镜像层页面: /layers/username/imagename/tag/images/sha256-...
        
        // 解析URL路径段
        
        if (pathParts.length >= 4 && pathParts[0] === 'layers') {
            // 处理 layers 页面格式: /layers/username/imagename/tag/...
            const namespace = pathParts[1];
            const repoName = pathParts[2];
            const tag = pathParts[3];
            
            if (namespace === '_') {
                // 官方镜像: /layers/_/nginx/latest/...
                imageName = repoName;
            } else {
                // 用户/组织镜像: /layers/username/imagename/tag/...
                imageName = namespace + '/' + repoName;
            }
            imageTag = tag;
            
            // 从layers URL提取镜像信息
            
        } else if (pathParts.length >= 2 && pathParts[0] === 'r') {
            // 处理 /r/ 路径格式
            if (pathParts.length === 2) {
                // 官方镜像: /r/nginx
                imageName = pathParts[1];
            } else if (pathParts.length >= 3) {
                // 用户/组织镜像: /r/username/imagename
                imageName = pathParts[1] + '/' + pathParts[2];
            }
            
            // 检查是否有tags路径来提取特定标签
            if (pathParts.includes('tags') && pathParts.length > pathParts.indexOf('tags') + 1) {
                const tagIndex = pathParts.indexOf('tags') + 1;
                imageTag = pathParts[tagIndex];
            }
            
            // 从/r/ URL提取镜像信息
            
        } else if (pathParts.length >= 2 && pathParts[0] === '_') {
            // 官方镜像的另一种格式: /_/nginx
            imageName = pathParts[1];
            // 从/_/ URL提取镜像信息
            
        } else if (pathParts.length >= 2) {
            // 其他格式的通用处理（保留原有逻辑作为备用）
            imageName = pathParts[0] + '/' + pathParts[1];
            // 通用格式提取镜像信息
        }

        // 从页面DOM元素提取信息作为备用方案
        if (!imageName) {
            // 尝试从页面标题获取镜像名称
            const titleSelectors = [
                'h1[data-testid="repository-title"]',
                '.RepositoryNameHeader__repositoryName',
                'h1.repository-title',
                '.repository-name'
            ];
            
            for (const selector of titleSelectors) {
                const titleElement = document.querySelector(selector);
                if (titleElement) {
                    imageName = titleElement.textContent.trim();
                    break;
                }
            }
            
            // 尝试从面包屑导航获取
            if (!imageName) {
                const breadcrumbLinks = document.querySelectorAll('[data-testid="breadcrumb"] a, .breadcrumb a');
                if (breadcrumbLinks.length >= 2) {
                    imageName = breadcrumbLinks[breadcrumbLinks.length - 1].textContent.trim();
                }
            }
        }

        // 提取标签信息
        const tagSelectors = [
            '[data-testid="tag-name"]',
            '.tag-name',
            '.current-tag',
            '.active-tag'
        ];
        
        for (const selector of tagSelectors) {
            const tagElement = document.querySelector(selector);
            if (tagElement) {
                const tagText = tagElement.textContent.trim();
                imageTag = tagText.replace(':', '').replace('Tag: ', '');
                break;
            }
        }

        // 从URL查询参数获取标签信息
        const urlParams = new URLSearchParams(window.location.search);
        const tagFromUrl = urlParams.get('tag');
        if (tagFromUrl) {
            imageTag = tagFromUrl;
        }

        // 最终结果处理和修正
        if (imageName) {
            // 对于官方镜像（不包含斜杠的镜像名），添加library前缀
            if (!imageName.includes('/') && imageName !== '') {
                imageName = 'library/' + imageName;
                // 添加library前缀
            }
        }

        console.log('最终提取的镜像信息:', { imageName, imageTag, url });
        return { imageName, imageTag };
    }

    // ==================== UI界面创建 ====================

    /**
     * 创建内联下载按钮
     * 功能：生成直接集成到Docker Hub界面中的下载按钮
     * @returns {HTMLElement} 下载按钮DOM元素
     */
    function createInlineDownloadButton() {
        const button = document.createElement('button');
        button.className = 'docker-download-btn';
        button.id = 'downloadBtn';
        button.innerHTML = '🚀 下载镜像';
        button.title = '点击下载Docker镜像';
        
        return button;
    }

    /**
     * 创建架构选择下拉框
     * 功能：生成紧凑的架构选择器，支持自动架构检测
     * @returns {HTMLElement} 架构选择器DOM元素
     */
    function createArchSelector() {
        const select = document.createElement('select');
        select.className = 'arch-selector';
        select.id = 'archSelector';
        select.title = '选择目标架构（将自动检测页面架构）';
        select.innerHTML = `
            <option value="">自动检测</option>
            <option value="linux/amd64">linux/amd64</option>
            <option value="linux/arm64">linux/arm64</option>
            <option value="linux/arm/v7">linux/arm/v7</option>
            <option value="linux/arm/v6">linux/arm/v6</option>
            <option value="linux/386">linux/386</option>
            <option value="windows/amd64">windows/amd64</option>
        `;
        
        // 添加用户手动选择监听器
        select.addEventListener('change', (e) => {
            if (e.target.value !== '') {
                userManuallySelectedArch = true;
                addLog(`用户手动选择架构: ${e.target.value}`);
                // 更新标题显示用户选择的架构
                e.target.title = `当前架构: ${e.target.value} (手动选择)`;
            } else {
                userManuallySelectedArch = false;
                addLog('用户选择自动检测架构');
                e.target.title = '选择目标架构（将自动检测页面架构）';
            }
        });
        
        // 异步设置自动检测的架构和更新可用架构列表
        setTimeout(async () => {
            const indicator = document.getElementById('archIndicator');
            try {
                // 显示检测状态
                if (indicator) {
                    indicator.style.display = 'inline';
                    indicator.textContent = '🔍 获取架构列表...';
                }
                
                // 首先获取镜像的可用架构列表
                const availableArchs = await getAvailableArchitectures();
                if (availableArchs && availableArchs.length > 0) {
                    // 更新架构选择器选项
                    updateArchSelectorOptions(select, availableArchs);
                    addLog(`已更新架构选择器，包含 ${availableArchs.length} 个可用架构`);
                    
                    // 架构信息已更新到选择器中
                    
                    if (indicator) {
                        indicator.textContent = '🔍 检测当前架构...';
                    }
                }
                
                // 只有在用户没有手动选择架构时才进行自动检测
                if (!userManuallySelectedArch) {
                    const detectedArch = await autoDetectArchitecture();
                    if (detectedArch) {
                        // 检查选项中是否存在检测到的架构
                        const existingOption = select.querySelector(`option[value="${detectedArch}"]`);
                        if (existingOption) {
                            select.value = detectedArch;
                            addLog(`架构选择器已设置为检测到的架构: ${detectedArch}`);
                        } else {
                            // 如果选项中不存在，添加新选项
                            const newOption = document.createElement('option');
                            newOption.value = detectedArch;
                            newOption.textContent = detectedArch;
                            newOption.selected = true;
                            select.appendChild(newOption);
                            addLog(`已添加并选择检测到的架构: ${detectedArch}`);
                        }
                        
                        // 更新选择器标题显示当前检测到的架构
                        select.title = `当前架构: ${detectedArch} (自动检测)`;
                        
                        // 更新状态指示器
                        if (indicator) {
                            indicator.textContent = `✅ ${detectedArch}`;
                            indicator.style.color = '#28a745';
                            setTimeout(() => {
                                indicator.style.display = 'none';
                            }, 3000);
                        }
                    } else {
                        // 检测失败时的处理
                        if (indicator) {
                            indicator.textContent = '❌ 检测失败';
                            indicator.style.color = '#dc3545';
                            setTimeout(() => {
                                indicator.style.display = 'none';
                            }, 3000);
                        }
                    }
                } else {
                    // 用户已手动选择，跳过自动检测
                    addLog('跳过自动架构检测（用户已手动选择）');
                    if (indicator) {
                        indicator.textContent = '✋ 已手动选择';
                        indicator.style.color = '#fd7e14';
                        setTimeout(() => {
                            indicator.style.display = 'none';
                        }, 2000);
                    }
                }
            } catch (error) {
                addLog(`自动架构检测失败: ${error.message}`, 'error');
                if (indicator) {
                    indicator.textContent = '❌ 检测失败';
                    indicator.style.color = '#dc3545';
                    setTimeout(() => {
                        indicator.style.display = 'none';
                    }, 3000);
                }
            }
        }, 1000); // 延迟1秒等待页面完全加载
        
        return select;
    }

    /**
     * 创建下载模式切换按钮
     * 功能：生成下载模式切换按钮，点击即可在远程API和直接访问之间切换
     * @returns {HTMLElement} 模式切换按钮DOM元素
     */
         function createModeToggleButton() {
        const button = document.createElement('button');
        button.className = 'docker-download-btn mode-toggle-btn';
        button.id = 'modeToggleBtn';
        // 基础样式（大小在外部统一设置）
        button.style.cssText = `
            background: linear-gradient(145deg, #6f42c1, #5a32a3);
            border-color: #6f42c1;
        `;
        
        // 根据当前模式设置按钮文本和样式
        function updateButtonText() {
            if (downloadMode === 'remote') {
                button.innerHTML = '🌐 远程API';
                button.title = '当前：远程API模式，点击切换到直接访问模式';
                button.style.background = 'linear-gradient(145deg, #007bff, #0056b3)';
                button.style.borderColor = '#007bff';
            } else {
                button.innerHTML = '🔗 直接访问';
                button.title = '当前：直接访问模式，点击切换到远程API模式';
                button.style.background = 'linear-gradient(145deg, #6f42c1, #5a32a3)';
                button.style.borderColor = '#6f42c1';
            }
        }
        
        updateButtonText();
        
        // 添加点击监听器
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // 切换模式
            downloadMode = downloadMode === 'remote' ? 'direct' : 'remote';
            addLog(`下载模式已切换为: ${DOWNLOAD_MODES[downloadMode]}`);
            
            // 更新按钮显示
            updateButtonText();
            
            // 显示切换动画
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
            
            // 清理缓存的架构信息，因为不同模式可能有不同的结果
            cachedArchitectures = null;
            
                         // 触发重新检测架构（保持用户的手动选择）
             try {
                 const availableArchs = await getAvailableArchitectures();
                 const archSelector = document.getElementById('archSelector');
                 if (availableArchs && availableArchs.length > 0 && archSelector) {
                     const currentUserSelection = archSelector.value; // 保存用户当前选择
                     updateArchSelectorOptions(archSelector, availableArchs);
                     
                     // 如果用户之前有手动选择，尝试恢复选择
                     if (userManuallySelectedArch && currentUserSelection) {
                         const optionExists = archSelector.querySelector(`option[value="${currentUserSelection}"]`);
                         if (optionExists) {
                             archSelector.value = currentUserSelection;
                             addLog(`已恢复用户手动选择的架构: ${currentUserSelection}`);
                         } else {
                             // 如果选项不存在，添加一个
                             const newOption = document.createElement('option');
                             newOption.value = currentUserSelection;
                             newOption.textContent = currentUserSelection;
                             newOption.selected = true;
                             archSelector.appendChild(newOption);
                             addLog(`已添加并恢复用户选择的架构: ${currentUserSelection}`);
                         }
                     }
                     
                     addLog(`已更新架构选择器（${DOWNLOAD_MODES[downloadMode]}模式）`);
                 }
             } catch (error) {
                 addLog(`切换模式后重新获取架构失败: ${error.message}`, 'error');
             }
        });
        
        // 添加悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 12px rgba(111, 66, 193, 0.3)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 8px rgba(111, 66, 193, 0.2)';
        });
        
        return button;
    }



    /**
     * 创建检测架构按钮
     * 功能：生成架构检测按钮
     * @returns {HTMLElement} 检测按钮DOM元素
     */
    function createDetectArchButton() {
        const button = document.createElement('button');
        button.className = 'docker-download-btn detect-arch-btn';
        button.id = 'detectArchBtn';
        button.innerHTML = '🔍 检测架构';
        button.title = '检测镜像支持的架构';
        
        return button;
    }

    // 移除进度显示区域创建函数，改为在按钮上显示进度

    // ==================== 日志和工具函数 ====================

    /**
     * 添加日志信息（仅在控制台显示）
     * 功能：在控制台记录下载进度和状态信息
     * @param {string} message - 要显示的日志消息
     * @param {string} type - 日志类型（info, error, success）
     */
    function addLog(message, type = 'info') {
        console.log('Docker Downloader:', message);
    }

    /**
     * 更新下载按钮上的进度显示（增强版）
     * 功能：在下载按钮上显示详细的下载信息和进度
     * @param {string} text - 要显示的文本
     * @param {string} status - 状态类型（downloading, complete, error）
     * @param {Object} details - 详细信息对象
     */
    function updateButtonProgress(text, status = 'downloading', details = {}) {
        const downloadBtn = document.getElementById('downloadBtn');
        if (!downloadBtn) return;

        // 构建详细的按钮文本
        let buttonText = text;
        
        // 如果有详细信息，添加到按钮文本中
        if (details.progress !== undefined) {
            buttonText += ` ${details.progress}%`;
        }
        
        if (details.speed && details.speed > 0) {
            buttonText += ` (${formatSpeed(details.speed)})`;
        }
        
        if (details.current && details.total) {
            buttonText += ` [${details.current}/${details.total}]`;
        }
        
        if (details.size && status !== 'downloading') {
            buttonText += ` ${formatSize(details.size)}`;
        }

        downloadBtn.textContent = buttonText;
        
        // 根据状态设置按钮样式
        switch (status) {
            case 'downloading':
                downloadBtn.style.background = 'linear-gradient(145deg, #007bff, #0056b3)';
                downloadBtn.style.color = 'white';
                downloadBtn.disabled = true;
                break;
            case 'complete':
                downloadBtn.style.background = 'linear-gradient(145deg, #28a745, #218838)';
                downloadBtn.style.color = 'white';
                downloadBtn.disabled = false;
                setTimeout(() => {
                    downloadBtn.textContent = '🚀 下载镜像';
                    downloadBtn.style.background = 'linear-gradient(145deg, #28a745, #218838)';
                }, 3000);
                break;
            case 'error':
                downloadBtn.style.background = 'linear-gradient(145deg, #dc3545, #c82333)';
                downloadBtn.style.color = 'white';
                downloadBtn.disabled = false;
                setTimeout(() => {
                    downloadBtn.textContent = '🚀 下载镜像';
                    downloadBtn.style.background = 'linear-gradient(145deg, #28a745, #218838)';
                }, 3000);
                break;
            case 'analyzing':
                downloadBtn.style.background = 'linear-gradient(145deg, #6f42c1, #5a32a3)';
                downloadBtn.style.color = 'white';
                downloadBtn.disabled = true;
                break;
            case 'assembling':
                downloadBtn.style.background = 'linear-gradient(145deg, #fd7e14, #e8690b)';
                downloadBtn.style.color = 'white';
                downloadBtn.disabled = true;
                break;
            default:
                downloadBtn.style.background = 'linear-gradient(145deg, #28a745, #218838)';
                downloadBtn.style.color = 'white';
                downloadBtn.disabled = false;
        }
    }

    /**
     * 智能选择内存策略
     * 功能：根据镜像大小和用户设置选择最适合的内存模式
     */
    function chooseMemoryStrategy() {
        if (!manifestData) return;
        
        const totalSize = manifestData.totalSize;
        
        addLog(`📊 镜像总大小: ${formatSize(totalSize)}`);
        
        // 根据用户选择的模式和镜像大小确定存储策略
        if (selectedMemoryMode === 'minimal') {
            useTemporaryCache = true;
            addLog(`💾 最小内存模式：所有层数据使用临时缓存`);
        } else if (selectedMemoryMode === 'normal') {
            useTemporaryCache = false;
            addLog(`💾 标准模式：所有层数据使用IndexedDB存储`);
        } else if (selectedMemoryMode === 'stream') {
            useTemporaryCache = totalSize > 200 * 1024 * 1024; // 200MB阈值
            if (useTemporaryCache) {
                addLog(`🌊 流式模式：镜像较大 (${formatSize(totalSize)})，使用临时缓存避免IndexedDB限制`);
            } else {
                addLog(`🌊 流式模式：镜像较小 (${formatSize(totalSize)})，使用IndexedDB存储`);
            }
        } else if (selectedMemoryMode === 'auto') {
            // 自动模式根据镜像总大小智能选择
            if (totalSize > 1024 * 1024 * 1024) { // 1GB+
                useTemporaryCache = true;
                addLog(`🤖 自动模式：检测到超大镜像 (${formatSize(totalSize)})，自动选择临时缓存模式避免OOM`);
            } else if (totalSize > 500 * 1024 * 1024) { // 500MB+
                useTemporaryCache = true;
                addLog(`🤖 自动模式：检测到大镜像 (${formatSize(totalSize)})，自动选择临时缓存模式`);
            } else {
                useTemporaryCache = false;
                addLog(`🤖 自动模式：检测到中小镜像 (${formatSize(totalSize)})，自动选择标准存储模式`);
            }
        }
        
        // 额外的智能提示
        if (totalSize > 2 * 1024 * 1024 * 1024) { // 2GB+
            addLog(`⚠️ 超大镜像警告: ${formatSize(totalSize)} - 建议使用最小内存模式，确保设备有足够内存`);
        } else if (totalSize > 1024 * 1024 * 1024) { // 1GB+
            addLog(`⚠️ 大镜像提示: ${formatSize(totalSize)} - 下载可能耗时较长，请保持网络连接稳定`);
        }
    }

    /**
     * 启动实时进度更新
     * 功能：定期更新下载进度显示，提供流畅的用户体验
     */
    function startRealTimeProgressUpdate() {
        if (progressUpdateInterval) {
            clearInterval(progressUpdateInterval);
        }
        
        progressUpdateInterval = setInterval(() => {
            updateRealTimeProgress();
        }, 500); // 每500ms更新一次进度
    }

    /**
     * 停止实时进度更新
     * 功能：清理进度更新定时器
     */
    function stopRealTimeProgressUpdate() {
        if (progressUpdateInterval) {
            clearInterval(progressUpdateInterval);
            progressUpdateInterval = null;
        }
    }

    /**
     * 更新实时进度显示
     * 功能：计算并显示当前的总体下载进度
     */
    function updateRealTimeProgress() {
        if (!manifestData || downloadProgressMap.size === 0) return;

        let totalDownloaded = 0;
        let totalSpeed = 0;
        let completedLayers = 0;
        
        // 统计所有层的下载进度
        for (const [digest, progressInfo] of downloadProgressMap.entries()) {
            totalDownloaded += progressInfo.downloaded;
            totalSpeed += progressInfo.speed;
            if (progressInfo.completed) {
                completedLayers++;
            }
        }
        
        const totalSize = manifestData.totalSize;
        const progress = totalSize > 0 ? Math.min(Math.round((totalDownloaded / totalSize) * 100), 100) : 0;
        
        // 更新按钮显示
        updateButtonProgress('⬇️ 下载镜像层', 'downloading', {
            progress: progress,
            current: completedLayers,
            total: manifestData.layers.length,
            speed: totalSpeed
        });
    }

    /**
     * 格式化文件大小显示
     * 功能：将字节数转换为人类可读的格式（B, KB, MB, GB）
     * @param {number} bytes - 要格式化的字节数
     * @returns {string} 格式化后的大小字符串
     */
    function formatSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * 格式化下载速度
     * 功能：将字节/秒转换为可读的速度单位
     * @param {number} bytesPerSecond - 字节/秒
     * @returns {string} 格式化的速度字符串
     */
    function formatSpeed(bytesPerSecond) {
        if (bytesPerSecond === 0) return '0 B/s';
        const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
        const i = parseInt(Math.floor(Math.log(bytesPerSecond) / Math.log(1024)));
        return Math.round(bytesPerSecond / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * 创建镜像信息展示区域
     * 功能：创建类似download.html的镜像信息展示卡片
     * @returns {HTMLElement} 镜像信息展示DOM元素
     */
    function createImageInfoDisplay() {
        const infoContainer = document.createElement('div');
        infoContainer.id = 'dockerImageInfo';
        infoContainer.className = 'docker-image-info';
        infoContainer.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 12px;
            margin-top: 8px;
            font-size: 12px;
            display: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 500px;
        `;

        infoContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h4 style="margin: 0; color: #495057; font-size: 14px;">📋 镜像信息</h4>
                <button id="toggleInfoBtn" style="background: none; border: none; cursor: pointer; color: #6c757d; font-size: 12px;">▼</button>
            </div>
            <div id="infoContent" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <div class="info-item">
                    <div class="info-label" style="color: #6c757d; font-weight: 600; margin-bottom: 2px;">镜像名称</div>
                    <div class="info-value" id="displayImageName" style="color: #495057; font-family: monospace; font-size: 11px;">-</div>
                </div>
                <div class="info-item">
                    <div class="info-label" style="color: #6c757d; font-weight: 600; margin-bottom: 2px;">当前架构</div>
                    <div class="info-value" id="displayArchitecture" style="color: #495057; font-family: monospace;">-</div>
                </div>
                <div class="info-item">
                    <div class="info-label" style="color: #6c757d; font-weight: 600; margin-bottom: 2px;">总大小</div>
                    <div class="info-value" id="displayTotalSize" style="color: #495057;">-</div>
                </div>
                <div class="info-item">
                    <div class="info-label" style="color: #6c757d; font-weight: 600; margin-bottom: 2px;">层数量</div>
                    <div class="info-value" id="displayLayerCount" style="color: #495057;">-</div>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label" style="color: #6c757d; font-weight: 600; margin-bottom: 2px;">下载进度</div>
                    <div id="displayProgress" style="color: #495057;">
                        <div style="background: #e9ecef; border-radius: 10px; height: 6px; margin: 4px 0;">
                            <div id="progressBar" style="background: #007bff; height: 100%; border-radius: 10px; width: 0%; transition: width 0.3s ease;"></div>
                        </div>
                        <div id="progressText" style="font-size: 11px; color: #6c757d;">准备中...</div>
                    </div>
                </div>
                <div class="info-item" style="grid-column: span 2;">
                    <div class="info-label" style="color: #6c757d; font-weight: 600; margin-bottom: 2px;">可用架构</div>
                    <div id="displayAvailableArchs" style="color: #495057; font-size: 11px;">检测中...</div>
                </div>
            </div>
        `;

        // 添加折叠/展开功能
        const toggleBtn = infoContainer.querySelector('#toggleInfoBtn');
        const content = infoContainer.querySelector('#infoContent');
        
        toggleBtn.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'grid';
                toggleBtn.textContent = '▼';
            } else {
                content.style.display = 'none';
                toggleBtn.textContent = '▶';
            }
        });

        return infoContainer;
    }

    /**
     * 更新镜像信息展示
     * 功能：更新信息展示区域的各项数据
     * @param {Object} info - 镜像信息对象
     */
    function updateImageInfoDisplay(info) {
        const infoContainer = document.getElementById('dockerImageInfo');
        if (!infoContainer) return;

        // 显示信息容器
        infoContainer.style.display = 'block';

        // 更新各项信息
        if (info.imageName) {
            document.getElementById('displayImageName').textContent = info.imageName;
        }
        if (info.architecture) {
            document.getElementById('displayArchitecture').textContent = info.architecture;
        }
        if (info.totalSize) {
            document.getElementById('displayTotalSize').textContent = formatSize(info.totalSize);
        }
        if (info.layerCount !== undefined) {
            document.getElementById('displayLayerCount').textContent = info.layerCount;
        }
        if (info.availableArchs) {
            const archsElement = document.getElementById('displayAvailableArchs');
            if (info.availableArchs.length > 0) {
                archsElement.innerHTML = info.availableArchs.map(arch => 
                    `<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px; margin: 1px; display: inline-block; font-family: monospace;">${arch}</span>`
                ).join('');
            } else {
                archsElement.textContent = '获取中...';
            }
        }
    }

    /**
     * 更新下载进度展示
     * 功能：更新进度条和进度文本
     * @param {number} percent - 进度百分比
     * @param {number} speed - 下载速度（字节/秒）
     */
    function updateProgressDisplay(percent, speed = 0) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${percent}%`;
            
            let statusText = '';
            if (percent === 0) {
                statusText = '准备中...';
                progressBar.style.background = '#6c757d';
            } else if (percent < 100) {
                statusText = `下载中 ${percent}%`;
                if (speed > 0) {
                    statusText += ` (${formatSpeed(speed)})`;
                }
                progressBar.style.background = '#007bff';
            } else {
                statusText = '下载完成';
                progressBar.style.background = '#28a745';
            }
            
            progressText.textContent = statusText;
        }
    }

    // ==================== 远程API访问功能 ====================

    /**
     * 通过远程API分析镜像信息
     * 功能：调用远程API获取镜像的层级结构和元数据
     * @param {string} imageName - 镜像名称
     * @param {string} imageTag - 镜像标签
     * @param {string} architecture - 目标架构（可选）
     * @returns {Promise<Object>} 镜像清单数据的Promise
     */
    async function analyzeImageRemote(imageName, imageTag, architecture = '') {
        addLog(`[远程API] 开始分析镜像: ${imageName}:${imageTag}`);
        
        // 构建API请求URL
        let apiUrl = `${API_BASE_URL}/manifest?image=${encodeURIComponent(imageName)}&tag=${encodeURIComponent(imageTag)}`;
        if (architecture) {
            apiUrl += `&architecture=${encodeURIComponent(architecture)}`;
            addLog(`[远程API] 指定架构: ${architecture}`);
        }

        try {
            const response = await gmFetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`获取镜像信息失败: ${response.status}`);
            }

            const data = await response.json();
            addLog(`[远程API] 镜像分析完成，共 ${data.layerCount} 层，总大小 ${formatSize(data.totalSize)}`);
            
            return data;
        } catch (error) {
            addLog(`[远程API] 分析失败: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * 通过远程API检测镜像支持的架构
     * 功能：获取镜像的所有可用架构平台信息
     * @param {string} imageName - 镜像名称  
     * @param {string} imageTag - 镜像标签
     * @returns {Promise<Array>} 可用架构列表的Promise
     */
    async function detectArchitecturesRemote(imageName, imageTag) {
        addLog(`[远程API] 开始检测镜像架构: ${imageName}:${imageTag}`);
        
        try {
            const response = await gmFetch(`${API_BASE_URL}/manifest?image=${encodeURIComponent(imageName)}&tag=${encodeURIComponent(imageTag)}`);
            
            if (!response.ok) {
                throw new Error(`获取镜像信息失败: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.multiArch && data.availablePlatforms) {
                addLog(`[远程API] 检测完成，发现 ${data.availablePlatforms.length} 种架构`);
                return data.availablePlatforms;
            } else {
                addLog('[远程API] 当前镜像仅支持单一架构');
                return [];
            }
        } catch (error) {
            addLog(`[远程API] 架构检测失败: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * 通过远程API下载单个镜像层
     * 功能：从远程API下载指定的镜像层数据并存储到本地缓存
     * @param {Object} layer - 层信息对象，包含digest、type、size等
     * @param {string} fullImageName - 完整的镜像名称
     * @returns {Promise} 下载完成的Promise
     */
    async function downloadLayerRemote(layer, fullImageName) {
        const layerIndex = manifestData.layers.indexOf(layer);
        
        try {
            addLog(`[远程API] 开始下载层: ${layer.digest.substring(0, 12)}... (类型: ${layer.type}, 大小: ${formatSize(layer.size || 0)}, 索引: ${layerIndex})`);

            // 初始化进度跟踪
            downloadProgressMap.set(layer.digest, {
                downloaded: 0,
                total: layer.size || 0,
                speed: 0,
                completed: false,
                startTime: Date.now()
            });

            // 根据层类型构建不同的API端点URL
            let apiEndpoint;
            if (layer.type === 'config') {
                // 配置层的下载端点
                apiEndpoint = `${API_BASE_URL}/config?image=${encodeURIComponent(fullImageName)}&digest=${encodeURIComponent(layer.digest)}`;
            } else {
                // 普通镜像层的下载端点
                apiEndpoint = `${API_BASE_URL}/layer?image=${encodeURIComponent(fullImageName)}&digest=${encodeURIComponent(layer.digest)}`;
            }

            // 发起HTTP下载请求
            const response = await gmFetch(apiEndpoint, { stream: true, responseType: 'arraybuffer' });
            
            if (!response.ok) {
                throw new Error(`下载层失败: ${response.status}`);
            }

            // 使用流式读取来支持实时进度更新
            const reader = response.body.getReader();
            const chunks = [];
            let receivedLength = 0;
            const progressInfo = downloadProgressMap.get(layer.digest);
            
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                receivedLength += value.length;
                
                // 更新进度信息
                const now = Date.now();
                const elapsed = (now - progressInfo.startTime) / 1000; // 秒
                progressInfo.downloaded = receivedLength;
                progressInfo.speed = elapsed > 0 ? receivedLength / elapsed : 0;
                
                downloadProgressMap.set(layer.digest, progressInfo);
            }

            // 组装完整的数据
            const arrayBuffer = new Uint8Array(receivedLength);
            let position = 0;
            for (const chunk of chunks) {
                arrayBuffer.set(chunk, position);
                position += chunk.length;
            }
            
            // 存储层数据
            if (useTemporaryCache) {
                // 使用临时缓存（minimal模式）
                tempLayerCache.set(layer.digest, arrayBuffer.buffer);
                addLog(`[远程API] 层数据存储到临时缓存: ${layer.digest.substring(0, 12)}... (${formatSize(arrayBuffer.byteLength)})`);
            } else {
                // 使用IndexedDB存储
                await storeLayerData(layer.digest, arrayBuffer.buffer);
                addLog(`[远程API] 层数据存储到IndexedDB: ${layer.digest.substring(0, 12)}... (${formatSize(arrayBuffer.byteLength)})`);
            }
            
            downloadedLayers.set(layer.digest, true);

            // 标记为完成
            progressInfo.completed = true;
            downloadProgressMap.set(layer.digest, progressInfo);

            addLog(`[远程API] 层下载完成: ${layer.digest.substring(0, 12)}... (${formatSize(arrayBuffer.byteLength)})`);
            
        } catch (error) {
            addLog(`[远程API] 层下载失败: ${layer.digest.substring(0, 12)}... - ${error.message}`, 'error');
            // 清理进度信息
            downloadProgressMap.delete(layer.digest);
            throw error;
        }
    }

    // ==================== Docker Registry 直接访问功能 ====================

    /**
     * 获取 Docker Token 用于认证
     * 功能：从 Docker Hub 认证服务获取访问 token
     * @param {string} imageName - 镜像名称
     * @param {string} registryHost - 注册表主机地址
     * @returns {Promise<string|null>} 认证 token
     */
    async function getDockerToken(imageName, registryHost = null) {
        try {
            const targetRegistry = registryHost || hub_host;
            
            if (targetRegistry === 'ghcr.io') {
                return "QQ==";
            } else if (targetRegistry === 'gcr.io') {
                return null;
            } else if (targetRegistry === 'quay.io') {
                return null;
            } else if (targetRegistry === 'registry.k8s.io') {
                return null;
            } else if (targetRegistry === 'registry-1.docker.io' || targetRegistry.includes('docker.io')) {
                const tokenUrl = `${auth_url}/token?service=registry.docker.io&scope=repository:${imageName}:pull`;
                
                const response = await gmFetch(tokenUrl, {
                    headers: {
                        'User-Agent': 'Docker-Client/19.03.12'
                    }
                });
                
                if (!response.ok) {
                    return null;
                }
                
                const data = await response.json();
                return data.token || null;
            } else {
                return null;
            }
            
        } catch (error) {
            addLog(`获取 Docker Token 失败: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * 解析镜像清单层信息（Schema Version 2）
     * 功能：解析标准的 Docker 镜像清单，提取层信息
     * @param {Object} manifest - 镜像清单对象
     * @param {string} imageName - 镜像名称
     * @returns {Object} 解析后的层信息
     */
    function parseManifestLayers(manifest, imageName) {
        const layers = [];
        let totalSize = 0;

        // 添加配置层
        if (manifest.config) {
            const configSize = manifest.config.size || 0;
            layers.push({
                type: 'config',
                digest: manifest.config.digest,
                size: configSize,
                mediaType: manifest.config.mediaType
            });
            totalSize += configSize;
        }

        // 添加镜像层
        if (manifest.layers && Array.isArray(manifest.layers) && manifest.layers.length > 0) {
            manifest.layers.forEach((layer, index) => {
                if (!layer.digest) {
                    return;
                }
                
                const layerSize = layer.size || 0;
                layers.push({
                    type: 'layer',
                    digest: layer.digest,
                    size: layerSize,
                    mediaType: layer.mediaType || 'application/vnd.docker.image.rootfs.diff.tar.gzip',
                    index: index
                });
                totalSize += layerSize;
            });
        }

        return {
            imageName,
            manifest,
            layers,
            totalSize,
            layerCount: layers.length
        };
    }

    /**
     * 解析 Schema Version 1 镜像清单
     * 功能：处理旧版本的 Docker 镜像清单格式
     * @param {Object} manifest - 镜像清单对象
     * @param {string} imageName - 镜像名称
     * @returns {Object} 解析后的层信息
     */
    function parseManifestV1Layers(manifest, imageName) {
        const layers = [];
        let totalSize = 0;

        if (manifest.fsLayers && Array.isArray(manifest.fsLayers)) {
            manifest.fsLayers.forEach((layer, index) => {
                layers.push({
                    type: 'layer',
                    digest: layer.blobSum,
                    size: 0, // V1 格式通常不包含大小信息
                    mediaType: 'application/vnd.docker.image.rootfs.diff.tar.gzip',
                    index: index
                });
            });
        }

        return {
            imageName,
            manifest,
            layers,
            totalSize,
            layerCount: layers.length
        };
    }

    /**
     * 解析 Docker 镜像清单
     * 功能：直接从 Docker Registry 获取并解析镜像清单
     * @param {string} imageName - 镜像名称
     * @param {string} tag - 镜像标签
     * @param {string} token - 认证 token
     * @param {string} registryHost - 注册表主机
     * @param {string} architecture - 目标架构
     * @returns {Promise<Object>} 解析后的镜像清单数据
     */
    async function parseDockerManifest(imageName, tag, token, registryHost = null, architecture = null) {
        try {
            const targetRegistry = registryHost || hub_host;
            const manifestUrl = `https://${targetRegistry}/v2/${imageName}/manifests/${tag}`;
            
            const headers = {
                'User-Agent': 'Docker-Client/19.03.12'
            };
            
            // 根据不同的注册表设置合适的 Accept 头
            if (targetRegistry === 'ghcr.io') {
                headers['Accept'] = 'application/vnd.oci.image.index.v1+json, application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.docker.distribution.manifest.v1+prettyjws';
            } else if (targetRegistry === 'gcr.io') {
                headers['Accept'] = 'application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json';
            } else if (targetRegistry === 'quay.io') {
                headers['Accept'] = 'application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json';
            } else if (targetRegistry === 'registry.k8s.io') {
                headers['Accept'] = 'application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json';
            } else {
                headers['Accept'] = 'application/vnd.docker.distribution.manifest.v2+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.v1+prettyjws';
            }
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await gmFetch(manifestUrl, { headers });
            
            if (!response.ok) {
                const errorText = await response.text();
                
                // 如果是401错误且没有token，尝试获取token
                if (response.status === 401 && !token) {
                    const newToken = await getDockerToken(imageName, targetRegistry);
                    if (newToken) {
                        return await parseDockerManifest(imageName, tag, newToken, targetRegistry, architecture);
                    }
                }
                
                throw new Error(`获取manifest失败: ${response.status} - ${errorText}`);
            }

            const contentType = response.headers.get('Content-Type');
            const manifest = await response.json();
            const mediaType = manifest.mediaType || contentType;

            // 处理多架构镜像
            if (mediaType === 'application/vnd.docker.distribution.manifest.list.v2+json' || 
                mediaType === 'application/vnd.oci.image.index.v1+json') {
                
                if (!manifest.manifests || !Array.isArray(manifest.manifests)) {
                    throw new Error('多架构镜像格式错误：缺少manifests数组');
                }
                
                addLog(`发现多架构镜像，包含 ${manifest.manifests.length} 个架构`);
                
                // 提取可用平台信息
                const availablePlatforms = manifest.manifests
                    .filter(m => m.platform && m.platform.architecture && m.platform.os)
                    .map(m => ({
                        architecture: m.platform.architecture,
                        os: m.platform.os,
                        variant: m.platform.variant || null,
                        digest: m.digest,
                        mediaType: m.mediaType,
                        platform: `${m.platform.os}/${m.platform.architecture}${m.platform.variant ? '/' + m.platform.variant : ''}`
                    }))
                    .filter(p => p.os !== 'unknown' && p.architecture !== 'unknown');
                
                addLog(`找到 ${availablePlatforms.length} 个有效架构`);
                
                // 选择合适的架构
                let selectedManifest = null;
                
                if (architecture) {
                    const [targetOS, targetArch, targetVariant] = architecture.split('/');
                    selectedManifest = manifest.manifests.find(m => {
                        if (!m.platform || !m.platform.architecture || !m.platform.os) return false;
                        if (m.platform.os === 'unknown' || m.platform.architecture === 'unknown') return false;
                        return m.platform.os === (targetOS || 'linux') && 
                               m.platform.architecture === targetArch &&
                               (m.platform.variant || '') === (targetVariant || '');
                    });
                }
                
                // 如果没有找到指定架构，尝试默认架构
                if (!selectedManifest) {
                    selectedManifest = manifest.manifests.find(m => 
                        m.platform && m.platform.architecture === 'amd64' && m.platform.os === 'linux'
                    );
                    
                    if (!selectedManifest) {
                        selectedManifest = manifest.manifests.find(m => 
                            m.platform && m.platform.architecture && m.platform.os &&
                            m.platform.os !== 'unknown' && m.platform.architecture !== 'unknown'
                        );
                    }
                    
                    if (!selectedManifest && manifest.manifests.length > 0) {
                        selectedManifest = manifest.manifests[0];
                    }
                }
                
                if (!selectedManifest) {
                    throw new Error('未找到合适的平台镜像');
                }
                
                // 获取特定架构的清单
                const specificManifestUrl = `https://${targetRegistry}/v2/${imageName}/manifests/${selectedManifest.digest}`;
                const specificResponse = await gmFetch(specificManifestUrl, { headers });
                
                if (!specificResponse.ok) {
                    throw new Error(`获取特定架构manifest失败: ${specificResponse.status}`);
                }
                
                const specificManifest = await specificResponse.json();
                const result = parseManifestLayers(specificManifest, imageName);
                
                result.multiArch = true;
                result.availablePlatforms = availablePlatforms;
                result.selectedPlatform = selectedManifest.platform;
                
                return result;
            }

            // 处理 Schema Version 1
            if (manifest.schemaVersion === 1 || 
                mediaType === 'application/vnd.docker.distribution.manifest.v1+prettyjws') {
                const result = parseManifestV1Layers(manifest, imageName);
                result.multiArch = false;
                result.availablePlatforms = [];
                result.selectedPlatform = { architecture: 'amd64', os: 'linux' };
                return result;
            }

            // 处理 Schema Version 2 和 OCI 格式
            if (manifest.schemaVersion === 2 || 
                mediaType === 'application/vnd.docker.distribution.manifest.v2+json' ||
                mediaType === 'application/vnd.oci.image.manifest.v1+json') {
                const result = parseManifestLayers(manifest, imageName);
                result.multiArch = false;
                result.availablePlatforms = [];
                result.selectedPlatform = { architecture: 'amd64', os: 'linux' };
                return result;
            }

            // 默认处理
            const result = parseManifestLayers(manifest, imageName);
            result.multiArch = false;
            result.availablePlatforms = [];
            result.selectedPlatform = { architecture: 'amd64', os: 'linux' };
            return result;
            
        } catch (error) {
            addLog(`解析 Docker 清单失败: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * 分析镜像信息，获取清单数据（统一接口）
     * 功能：根据配置的模式选择使用远程API或直接访问Registry
     * @param {string} imageName - 镜像名称
     * @param {string} imageTag - 镜像标签
     * @param {string} architecture - 目标架构（可选）
     * @returns {Promise<Object>} 镜像清单数据的Promise
     */
    async function analyzeImage(imageName, imageTag, architecture = '') {
        addLog(`[${DOWNLOAD_MODES[downloadMode]}] 开始分析镜像: ${imageName}:${imageTag}`);
        
        if (downloadMode === 'remote') {
            return await analyzeImageRemote(imageName, imageTag, architecture);
        } else {
            return await analyzeImageDirect(imageName, imageTag, architecture);
        }
    }

    /**
     * 直接从 Docker Registry 分析镜像信息
     * 功能：直接从 Docker Registry 获取镜像的层级结构和元数据
     * @param {string} imageName - 镜像名称
     * @param {string} imageTag - 镜像标签
     * @param {string} architecture - 目标架构（可选）
     * @returns {Promise<Object>} 镜像清单数据的Promise
     */
    async function analyzeImageDirect(imageName, imageTag, architecture = '') {
        addLog(`[直接访问] 开始分析镜像: ${imageName}:${imageTag}`);
        
        try {
            // 处理镜像名称和目标注册表
            let processedImageName = imageName;
            let targetRegistry = hub_host;
            
            // 检测是否为第三方注册表
            if (imageName.includes('.')) {
                const parts = imageName.split('/');
                const firstPart = parts[0];
                
                const registryMap = {
                    'ghcr.io': 'ghcr.io',
                    'gcr.io': 'gcr.io',
                    'quay.io': 'quay.io',
                    'registry.k8s.io': 'registry.k8s.io',
                    'k8s.gcr.io': 'k8s.gcr.io'
                };
                
                if (registryMap[firstPart]) {
                    targetRegistry = registryMap[firstPart];
                    processedImageName = parts.slice(1).join('/');
                }
            }
            
            // 对于 Docker Hub，为官方镜像添加 library 前缀
            if (targetRegistry === hub_host) {
                if (!processedImageName.includes('/') && !processedImageName.includes('@') && !processedImageName.includes(':')) {
                    processedImageName = 'library/' + processedImageName;
                }
            }

            addLog(`[直接访问] 目标注册表: ${targetRegistry}, 处理后镜像名: ${processedImageName}`);
            if (architecture) {
                addLog(`[直接访问] 指定架构: ${architecture}`);
            }

            // 获取认证token（如果需要）
            let token = null;
            try {
                const manifestData = await parseDockerManifest(processedImageName, imageTag, null, targetRegistry, architecture);
                addLog(`[直接访问] 镜像分析完成，共 ${manifestData.layerCount} 层，总大小 ${formatSize(manifestData.totalSize)}`);
                return manifestData;
            } catch (anonymousError) {
                // 如果匿名访问失败，尝试获取 token
                addLog('[直接访问] 匿名访问失败，尝试获取认证token...');
                token = await getDockerToken(processedImageName, targetRegistry);
                
                if (token) {
                    addLog('[直接访问] 已获取认证token，重新尝试...');
                    const manifestData = await parseDockerManifest(processedImageName, imageTag, token, targetRegistry, architecture);
                    addLog(`[直接访问] 镜像分析完成，共 ${manifestData.layerCount} 层，总大小 ${formatSize(manifestData.totalSize)}`);
                    return manifestData;
                } else {
                    throw anonymousError;
                }
            }
            
        } catch (error) {
            addLog(`[直接访问] 分析失败: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * 检测镜像支持的架构（统一接口）
     * 功能：根据配置的模式选择使用远程API或直接访问Registry
     * @param {string} imageName - 镜像名称  
     * @param {string} imageTag - 镜像标签
     * @returns {Promise<Array>} 可用架构列表的Promise
     */
    async function detectArchitectures(imageName, imageTag) {
        addLog(`[${DOWNLOAD_MODES[downloadMode]}] 开始检测镜像架构: ${imageName}:${imageTag}`);
        
        if (downloadMode === 'remote') {
            return await detectArchitecturesRemote(imageName, imageTag);
        } else {
            const manifestData = await analyzeImageDirect(imageName, imageTag, '');
            
            if (manifestData.multiArch && manifestData.availablePlatforms) {
                addLog(`[直接访问] 检测完成，发现 ${manifestData.availablePlatforms.length} 种架构`);
                return manifestData.availablePlatforms;
            } else {
                addLog('[直接访问] 当前镜像仅支持单一架构');
                return [];
            }
        }
    }

    // ==================== 下载功能 ====================

    /**
     * 下载单个镜像层（统一接口，支持实时进度更新）
     * 功能：根据配置的模式选择使用远程API或直接从Registry下载
     * @param {Object} layer - 层信息对象，包含digest、type、size等
     * @param {string} fullImageName - 完整的镜像名称
     * @param {string} targetRegistry - 目标注册表地址（仅直接模式使用）
     * @param {string} token - 认证token（仅直接模式使用）
     * @returns {Promise} 下载完成的Promise
     */
    async function downloadLayer(layer, fullImageName, targetRegistry, token) {
        const layerIndex = manifestData.layers.indexOf(layer);
        
        if (downloadMode === 'remote') {
            return await downloadLayerRemote(layer, fullImageName);
        } else {
            return await downloadLayerDirect(layer, fullImageName, targetRegistry, token);
        }
    }

    /**
     * 直接从 Docker Registry 下载单个镜像层
     * 功能：直接从 Docker Registry 下载指定的镜像层数据并存储到本地缓存，支持实时进度反馈
     * @param {Object} layer - 层信息对象，包含digest、type、size等
     * @param {string} fullImageName - 完整的镜像名称
     * @param {string} targetRegistry - 目标注册表地址
     * @param {string} token - 认证token
     * @returns {Promise} 下载完成的Promise
     */
    async function downloadLayerDirect(layer, fullImageName, targetRegistry, token) {
        const layerIndex = manifestData.layers.indexOf(layer);
        
        try {
            addLog(`[直接访问] 开始下载层: ${layer.digest.substring(0, 12)}... (类型: ${layer.type}, 大小: ${formatSize(layer.size || 0)}, 索引: ${layerIndex})`);

            // 初始化进度跟踪
            downloadProgressMap.set(layer.digest, {
                downloaded: 0,
                total: layer.size || 0,
                speed: 0,
                completed: false,
                startTime: Date.now()
            });

            // 构建 Docker Registry blob 下载 URL
            const blobUrl = `https://${targetRegistry}/v2/${fullImageName}/blobs/${layer.digest}`;
            
            // 设置请求头
            const headers = {
                'Accept': 'application/vnd.docker.image.rootfs.diff.tar.gzip, application/vnd.docker.container.image.v1+json, */*',
                'User-Agent': 'Docker-Client/19.03.12'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // 发起HTTP下载请求
            const response = await gmFetch(blobUrl, { headers, stream: true, responseType: 'arraybuffer' });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`下载层失败: ${response.status} - ${errorText}`);
            }

            // 使用流式读取来支持实时进度更新
            const reader = response.body.getReader();
            const chunks = [];
            let receivedLength = 0;
            const progressInfo = downloadProgressMap.get(layer.digest);
            
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                chunks.push(value);
                receivedLength += value.length;
                
                // 更新进度信息
                const now = Date.now();
                const elapsed = (now - progressInfo.startTime) / 1000; // 秒
                progressInfo.downloaded = receivedLength;
                progressInfo.speed = elapsed > 0 ? receivedLength / elapsed : 0;
                
                downloadProgressMap.set(layer.digest, progressInfo);
            }

            // 组装完整的数据
            const arrayBuffer = new Uint8Array(receivedLength);
            let position = 0;
            for (const chunk of chunks) {
                arrayBuffer.set(chunk, position);
                position += chunk.length;
            }
            
            // 存储层数据
            if (useTemporaryCache) {
                // 使用临时缓存（minimal模式）
                tempLayerCache.set(layer.digest, arrayBuffer.buffer);
                addLog(`[直接访问] 层数据存储到临时缓存: ${layer.digest.substring(0, 12)}... (${formatSize(arrayBuffer.byteLength)})`);
            } else {
                // 使用IndexedDB存储
                await storeLayerData(layer.digest, arrayBuffer.buffer);
                addLog(`[直接访问] 层数据存储到IndexedDB: ${layer.digest.substring(0, 12)}... (${formatSize(arrayBuffer.byteLength)})`);
            }
            
            downloadedLayers.set(layer.digest, true);

            // 标记为完成
            progressInfo.completed = true;
            downloadProgressMap.set(layer.digest, progressInfo);

            addLog(`[直接访问] 层下载完成: ${layer.digest.substring(0, 12)}... (${formatSize(arrayBuffer.byteLength)})`);
            
        } catch (error) {
            addLog(`[直接访问] 层下载失败: ${layer.digest.substring(0, 12)}... - ${error.message}`, 'error');
            // 清理进度信息
            downloadProgressMap.delete(layer.digest);
            throw error;
        }
    }

    /**
     * 存储层数据到IndexedDB
     * 功能：将下载的层数据存储到IndexedDB数据库
     * @param {string} digest - 层摘要
     * @param {ArrayBuffer} data - 层数据
     * @returns {Promise} 存储完成的Promise
     */
    async function storeLayerData(digest, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['layers'], 'readwrite');
            const store = transaction.objectStore('layers');
            
            const layerRecord = {
                digest: digest,
                data: data,
                timestamp: Date.now()
            };
            
            const request = store.put(layerRecord);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 从存储中获取层数据
     * 功能：优先从临时缓存获取，然后从IndexedDB获取
     * @param {string} digest - 层摘要
     * @returns {Promise<ArrayBuffer>} 层数据
     */
    async function getLayerData(digest) {
        // 首先检查临时缓存
        if (tempLayerCache.has(digest)) {
            return tempLayerCache.get(digest);
        }
        
        // 然后检查IndexedDB
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['layers'], 'readonly');
            const store = transaction.objectStore('layers');
            
            const request = store.get(digest);
            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result.data);
                } else {
                    reject(new Error('未找到层数据: ' + digest));
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // ==================== 文件生成功能 ====================

    /**
     * 生成下载文件名
     * 功能：根据镜像名称、标签和架构生成规范的文件名
     * @param {string} imageName - 镜像名称
     * @param {string} imageTag - 镜像标签
     * @param {string} architecture - 架构信息
     * @returns {string} 生成的TAR文件名
     */
    function generateFilename(imageName, imageTag, architecture) {
        // 处理镜像名称，移除Docker Hub的library前缀
        let cleanImageName = imageName;
        if (cleanImageName.startsWith('library/')) {
            cleanImageName = cleanImageName.substring(8);
        }
        
        // 替换文件名中的特殊字符为安全字符
        cleanImageName = cleanImageName.replace(/[\/\\:]/g, '_').replace(/[<>:"|?*]/g, '-');
        const cleanTag = imageTag.replace(/[\/\\:]/g, '_').replace(/[<>:"|?*]/g, '-');
        const cleanArch = architecture.replace(/[\/\\:]/g, '_').replace(/[<>:"|?*]/g, '-') || 'amd64';
        
        // 返回格式：imagename_tag_architecture.tar
        return `${cleanImageName}_${cleanTag}_${cleanArch}.tar`;
    }

    /**
     * 生成随机摘要值
     * 功能：当镜像配置不可用时生成伪随机SHA256摘要
     * @returns {string} 64位十六进制摘要字符串
     */
    function generateFakeDigest() {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 64; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * 使用tarballjs创建Docker TAR文件
     * 功能：将所有下载的层组装成符合Docker标准的TAR格式文件
     * @param {Map} layerDataMap - 层数据映射表
     * @param {string} filename - 输出文件名
     * @returns {Promise} 创建完成的Promise
     */
    async function createDockerTar(layerDataMap, filename) {
        addLog('开始创建Docker TAR文件...');
        
        // 检查tarballjs库是否可用
        if (!window.tarball || !window.tarball.TarWriter) {
            throw new Error('tarballjs库未加载，无法创建TAR文件');
        }

        try {
            const tar = new tarball.TarWriter();

            // 第一步：处理镜像配置文件
            const manifest = manifestData.manifest;
            let configDigest = null;
            let configData = null;

            // 尝试从manifest中获取配置摘要
            if (manifest.config && manifest.config.digest) {
                configDigest = manifest.config.digest;
                const rawConfigData = layerDataMap.get(configDigest);
                if (rawConfigData) {
                    configData = new Uint8Array(rawConfigData);
                    addLog(`配置数据准备完成，大小: ${configData.length} 字节`);
                }
            }

            // 如果没有配置数据，创建默认配置
            if (!configData) {
                configDigest = 'sha256:' + generateFakeDigest();
                const configObj = {
                    architecture: "amd64",
                    os: "linux", 
                    config: {},
                    rootfs: {
                        type: "layers",
                        diff_ids: manifestData.layers
                            .filter(l => l.type === 'layer')
                            .map(l => l.digest)
                    }
                };
                configData = new TextEncoder().encode(JSON.stringify(configObj));
                addLog(`生成默认配置，大小: ${configData.length} 字节`);
            }

            // 第二步：添加配置文件到TAR
            const configFileName = configDigest + '.json';
            const configBlob = new Blob([configData], { type: 'application/json' });
            const configFile = new File([configBlob], configFileName);
            tar.addFile(configFileName, configFile);
            addLog(`添加配置文件: ${configFileName}`);

            // 第三步：添加所有镜像层到TAR
            const layerDigests = [];
            let layerIndex = 0;
            for (const layer of manifestData.layers) {
                if (layer.type === 'layer' && layer.digest) {
                    const layerDigest = layer.digest;
                    layerDigests.push(layerDigest);

                    const layerData = layerDataMap.has(layerDigest) ? layerDataMap.get(layerDigest) : await getLayerData(layerDigest);
                    if (layerData) {
                        // 每个层创建独立目录结构: digest/layer.tar
                        const layerFileName = layerDigest + '/layer.tar';
                        const layerUint8Array = new Uint8Array(layerData);
                        const layerBlob = new Blob([layerUint8Array], { type: 'application/octet-stream' });
                        const layerFile = new File([layerBlob], 'layer.tar');

                        tar.addFile(layerFileName, layerFile);
                        addLog(`添加层文件 ${layerIndex + 1}/${manifestData.layers.filter(l => l.type === 'layer').length}: ${layerFileName}`);
                        layerIndex++;
                    }
                }
            }

            // 第四步：创建Docker manifest.json文件
            let repoTag = manifestData.imageName;
            if (repoTag.startsWith('library/')) {
                repoTag = repoTag.substring(8);
            }
            if (!repoTag.includes(':')) {
                repoTag += ':latest';
            }

            const dockerManifest = [{
                Config: configFileName,
                RepoTags: [repoTag],
                Layers: layerDigests.map(digest => digest + '/layer.tar')
            }];

            const manifestBlob = new Blob([JSON.stringify(dockerManifest)], { type: 'application/json' });
            const manifestFile = new File([manifestBlob], 'manifest.json');
            tar.addFile('manifest.json', manifestFile);
            addLog('添加manifest.json文件');

            // 第五步：创建repositories文件
            const repositories = {};
            let repoName, tag;
            if (manifestData.imageName.includes(':')) {
                const parts = manifestData.imageName.split(':');
                repoName = parts[0];
                tag = parts[1];
            } else {
                repoName = manifestData.imageName;
                tag = 'latest';
            }

            if (repoName.startsWith('library/')) {
                repoName = repoName.substring(8);
            }

            repositories[repoName] = {};
            repositories[repoName][tag] = configDigest.replace('sha256:', '');

            const repositoriesBlob = new Blob([JSON.stringify(repositories)], { type: 'application/json' });
            const repositoriesFile = new File([repositoriesBlob], 'repositories');
            tar.addFile('repositories', repositoriesFile);
            addLog('添加repositories文件');

            // 第六步：下载生成的TAR文件
            addLog('开始生成并下载TAR文件...');
            tar.download(filename);
            addLog(`TAR文件下载已触发: ${filename}`);

        } catch (error) {
            addLog(`创建TAR文件失败: ${error.message}`, 'error');
            throw error;
        }
    }

    // ==================== 完整下载流程 ====================

    /**
     * 执行完整的镜像下载流程
     * 功能：包括分析、下载、组装的完整自动化流程
     * @param {string} imageName - 镜像名称
     * @param {string} imageTag - 镜像标签  
     * @param {string} architecture - 目标架构
     */
    async function performDownload(imageName, imageTag, architecture) {
        // 防止重复下载
        if (downloadInProgress) {
            addLog('下载正在进行中，请等待当前下载完成', 'error');
            return;
        }

        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.textContent;

        try {
            // 设置下载状态
            downloadInProgress = true;

            // 清理之前的下载数据
            tempLayerCache.clear();
            downloadedLayers.clear();
            downloadProgressMap.clear();

            // 第一步：分析镜像
            addLog('=== 开始镜像下载流程 ===');
            addLog(`镜像: ${imageName}:${imageTag}`);
            if (architecture) {
                addLog(`架构: ${architecture}`);
            } else {
                addLog('架构: 自动检测');
            }
            
            updateButtonProgress('🔍 分析镜像', 'analyzing', {
                size: 0
            });
            manifestData = await analyzeImage(imageName, imageTag, architecture);

            // 第二步：选择内存策略
            chooseMemoryStrategy();

            // 第三步：启动实时进度更新并开始下载
            updateButtonProgress('⬇️ 下载镜像层', 'downloading', {
                progress: 0,
                current: 0,
                total: manifestData.layers.length,
                size: manifestData.totalSize
            });
            addLog(`开始下载 ${manifestData.layers.length} 个镜像层`);

            // 启动实时进度更新
            startRealTimeProgressUpdate();

            // 准备下载参数（根据模式不同处理）
            if (downloadMode === 'remote') {
                // 远程API模式：直接使用原始镜像名
                const downloadPromises = manifestData.layers.map(async (layer) => {
                    await downloadLayer(layer, imageName);
                });
                await Promise.all(downloadPromises);
            } else {
                // 直接访问模式：处理镜像名和注册表
                let processedImageName = imageName;
                let targetRegistry = hub_host;
                
                // 检测是否为第三方注册表
                if (imageName.includes('.')) {
                    const parts = imageName.split('/');
                    const firstPart = parts[0];
                    
                    const registryMap = {
                        'ghcr.io': 'ghcr.io',
                        'gcr.io': 'gcr.io',
                        'quay.io': 'quay.io',
                        'registry.k8s.io': 'registry.k8s.io',
                        'k8s.gcr.io': 'k8s.gcr.io'
                    };
                    
                    if (registryMap[firstPart]) {
                        targetRegistry = registryMap[firstPart];
                        processedImageName = parts.slice(1).join('/');
                    }
                }
                
                // 对于 Docker Hub，为官方镜像添加 library 前缀
                if (targetRegistry === hub_host) {
                    if (!processedImageName.includes('/') && !processedImageName.includes('@') && !processedImageName.includes(':')) {
                        processedImageName = 'library/' + processedImageName;
                    }
                }

                // 获取认证token
                const downloadToken = await getDockerToken(processedImageName, targetRegistry);
                if (downloadToken) {
                    addLog(`[直接访问] 已获取下载认证token`);
                }

                // 并行下载所有层
                const downloadPromises = manifestData.layers.map(async (layer) => {
                    await downloadLayer(layer, processedImageName, targetRegistry, downloadToken);
                });
                await Promise.all(downloadPromises);
            }
            
            // 停止实时进度更新
            stopRealTimeProgressUpdate();
            
            addLog('所有镜像层下载完成');

            // 第四步：组装Docker TAR文件
            updateButtonProgress('🔧 组装镜像', 'assembling', {
                progress: 100,
                current: manifestData.layers.length,
                total: manifestData.layers.length,
                size: manifestData.totalSize
            });
            addLog('开始组装Docker TAR文件');

            const filename = generateFilename(imageName, imageTag, architecture || 'amd64');
            
            // 根据存储模式传递不同的数据源
            if (useTemporaryCache) {
                await createDockerTar(tempLayerCache, filename);
            } else {
                // 对于IndexedDB模式，传递空Map，让createDockerTar使用getLayerData获取数据
                await createDockerTar(new Map(), filename);
            }

            addLog('=== 镜像下载流程完成 ===');
            updateButtonProgress('✅ 下载完成', 'complete', {
                size: manifestData.totalSize
            });

        } catch (error) {
            addLog(`下载失败: ${error.message}`, 'error');
            updateButtonProgress('❌ 下载失败', 'error');
            
            // 确保停止实时进度更新
            stopRealTimeProgressUpdate();
        } finally {
            downloadInProgress = false;
            
            // 清理进度数据
            downloadProgressMap.clear();
        }
    }

    // ==================== UI交互功能 ====================

    /**
     * 更新架构选择器选项
     * 功能：根据检测到的可用架构更新下拉选择器
     * @param {Array} platforms - 可用平台列表
     */
    function updateArchSelector(platforms) {
        const archSelector = document.getElementById('archSelector');
        if (!archSelector || !platforms || platforms.length === 0) return;

        // 清空现有选项
        archSelector.innerHTML = '';

        // 添加检测到的架构选项
        platforms.forEach(platform => {
            if (platform && platform.platform) {
                const option = document.createElement('option');
                option.value = platform.platform;
                option.textContent = platform.platform;
                archSelector.appendChild(option);
            }
        });

        // 智能选择首选架构
        // 优先级：linux/amd64 > linux/arm64 > 其他linux架构 > 第一个可用架构
        let selectedPlatform = platforms.find(p => p.platform === 'linux/amd64') ||
                              platforms.find(p => p.platform === 'linux/arm64') ||
                              platforms.find(p => p.os === 'linux') ||
                              platforms[0];

        if (selectedPlatform) {
            archSelector.value = selectedPlatform.platform;
            addLog(`自动选择架构: ${selectedPlatform.platform}`);
        }
    }

    /**
     * 绑定UI事件处理器
     * 功能：为下载按钮和架构检测按钮绑定点击事件
     */
    function bindEventHandlers() {
        // 主下载按钮点击事件
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', async () => {
                const { imageName, imageTag } = extractImageInfo();
                const archSelector = document.getElementById('archSelector');
                let architecture = archSelector ? archSelector.value : '';

                // 验证镜像信息是否提取成功
                if (!imageName) {
                    addLog('无法获取镜像名称，请确保在正确的Docker Hub页面', 'error');
                    alert('无法获取镜像名称！\n\n请确保您在正确的Docker Hub镜像页面：\n- 官方镜像：hub.docker.com/r/nginx\n- 用户镜像：hub.docker.com/r/username/imagename');
                    return;
                }

                // 如果没有手动选择架构或选择了"自动检测"，则使用自动检测功能
                if (!architecture || architecture === '') {
                    addLog('未手动选择架构，启用自动检测...');
                    architecture = await autoDetectArchitecture();
                    
                    // 更新架构选择器显示检测结果
                    if (archSelector && architecture) {
                        const existingOption = archSelector.querySelector(`option[value="${architecture}"]`);
                        if (existingOption) {
                            archSelector.value = architecture;
                        } else {
                            // 添加检测到的架构选项
                            const newOption = document.createElement('option');
                            newOption.value = architecture;
                            newOption.textContent = architecture;
                            newOption.selected = true;
                            archSelector.appendChild(newOption);
                        }
                        addLog(`自动检测并设置架构: ${architecture}`);
                    }
                }

                // 开始下载流程
                await performDownload(imageName, imageTag, architecture);
            });
        } else {
            console.log('下载按钮未找到，稍后重试绑定事件');
        }
    }

    // ==================== 页面集成功能 ====================

    /**
     * 查找合适的位置插入下载按钮
     * 功能：简化版本，直接查找页面标题
     * @returns {Array} 包含插入点信息的数组
     */
    function findInsertionPoints() {
        const insertionPoints = [];

        // 如果已经存在下载器，不重复添加
        if (document.querySelector('[data-docker-downloader]')) {
            console.log('页面已存在下载器，跳过插入点查找');
            return insertionPoints;
        }

        // 方法1: 查找h1标题
        const title = document.querySelector('h1');
        if (title) {
            console.log('找到h1标题:', title.textContent.substring(0, 50));
            insertionPoints.push({
                type: 'title',
                element: title.parentElement || title,
                position: 'inside',
                description: 'H1标题区域'
            });
        }

        // 方法2: 查找其他可能的标题元素
        const altTitles = document.querySelectorAll('h2, h3, [data-testid*="title"], .repository-title, .repo-title');
        altTitles.forEach((altTitle, index) => {
            if (altTitle.textContent.trim()) {
                console.log(`找到备用标题${index + 1}:`, altTitle.textContent.substring(0, 50));
                insertionPoints.push({
                    type: 'alt-title',
                    element: altTitle.parentElement || altTitle,
                    position: 'inside',
                    description: `备用标题区域${index + 1}`
                });
            }
        });

        // 方法3: 查找页面主要内容区域
        const mainContent = document.querySelector('main, .main-content, .content, #content');
        if (mainContent && insertionPoints.length === 0) {
            console.log('找到主要内容区域');
            insertionPoints.push({
                type: 'main',
                element: mainContent,
                position: 'prepend',
                description: '主要内容区域顶部'
            });
        }

        // 方法4: 最后的备用方案 - body元素
        if (insertionPoints.length === 0) {
            console.log('使用body作为最后的插入点');
            insertionPoints.push({
                type: 'body',
                element: document.body,
                position: 'prepend',
                description: '页面顶部'
            });
        }

        console.log(`找到 ${insertionPoints.length} 个可能的插入点`);
        return insertionPoints;
    }

    /**
     * 在指定位置插入下载按钮
     * 功能：根据插入点类型和位置插入相应的按钮
     * @param {Object} insertionPoint - 插入点信息对象
     */
    function insertDownloadButtons(insertionPoint) {
        const { element, position, type } = insertionPoint;
        
        if (!element) {
            console.error('插入点元素不存在');
            return;
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('span');
        buttonContainer.className = 'docker-download-container';
        buttonContainer.setAttribute('data-docker-downloader', 'true');
        buttonContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin: 0 10px;
            vertical-align: middle;
        `;

        // 创建下载按钮
        const downloadBtn = createInlineDownloadButton();
        
        // 创建模式切换按钮
        const modeToggleBtn = createModeToggleButton();
        
        // 创建架构选择器
        const archSelector = createArchSelector();
        
        // 统一所有元素的大小（以下载按钮为标准）
        const standardStyle = {
            fontSize: '13px',
            padding: '8px 16px',
            height: '34px', // 与下载按钮保持一致的高度
            marginLeft: '8px'
        };
        
        // 应用统一样式到模式切换按钮
        Object.assign(modeToggleBtn.style, {
            fontSize: standardStyle.fontSize,
            padding: standardStyle.padding,
            height: standardStyle.height,
            minWidth: '110px',
            marginRight: '0',
            marginLeft: '0'
        });
        
        // 应用统一样式到架构选择器
        Object.assign(archSelector.style, {
            fontSize: standardStyle.fontSize,
            padding: standardStyle.padding,
            height: standardStyle.height,
            minWidth: '120px',
            marginLeft: standardStyle.marginLeft,
            marginRight: '0'
        });

        // 创建架构检测状态指示器
        const archIndicator = document.createElement('span');
        archIndicator.id = 'archIndicator';
        archIndicator.style.cssText = `
            font-size: 11px;
            color: #666;
            margin-left: 5px;
            display: none;
        `;
        archIndicator.textContent = '🔍 检测中...';

        // 将元素添加到容器（重新排列顺序：模式切换按钮 -> 下载按钮 -> 架构选择器 -> 指示器）
        buttonContainer.appendChild(modeToggleBtn);
        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(archSelector);
        buttonContainer.appendChild(archIndicator);

        // 根据位置类型插入按钮
        switch (position) {
            case 'after':
                // 在元素后面插入
                if (element.nextSibling) {
                    element.parentNode.insertBefore(buttonContainer, element.nextSibling);
                } else {
                    element.parentNode.appendChild(buttonContainer);
                }
                break;
                
            case 'before':
                // 在元素前面插入
                element.parentNode.insertBefore(buttonContainer, element);
                break;
                
            case 'inside':
                // 在元素内部插入
                element.appendChild(buttonContainer);
                break;
                
            case 'prepend':
                // 在元素内部最前面插入
                element.insertBefore(buttonContainer, element.firstChild);
                break;
                
            default:
                // 默认在元素后面插入
                element.parentNode.appendChild(buttonContainer);
        }

        // 移除复杂的悬停逻辑，保持架构选择器始终可见
        // 进度信息直接显示在按钮上，不需要额外的进度区域

        console.log(`下载按钮已插入到: ${insertionPoint.description}`);
    }

    /**
     * 检查是否在Docker Hub镜像页面
     * 功能：验证当前页面是否适合显示下载器
     * @returns {boolean} 是否在合适的镜像页面
     */
    function isDockerHubImagePage() {
        const url = window.location.href;
        const pathname = window.location.pathname;
        
        // 首先检查是否在Docker Hub域名
        if (!url.includes('hub.docker.com')) {
            console.log('不在Docker Hub域名');
            return false;
        }

        // 排除首页和其他非镜像页面
        const excludePatterns = [
            /^\/$/,                                 // 首页
            /^\/search/,                           // 搜索页面
            /^\/explore/,                          // 探索页面
            /^\/extensions/,                       // 扩展页面
            /^\/pricing/,                          // 价格页面
            /^\/signup/,                           // 注册页面
            /^\/login/,                            // 登录页面
            /^\/u\//,                              // 用户页面
            /^\/orgs\//,                           // 组织页面
            /^\/repositories/,                     // 仓库列表页面
            /^\/settings/,                         // 设置页面
            /^\/billing/,                          // 账单页面
            /^\/support/                           // 支持页面
        ];

        // 如果匹配排除模式，直接返回false
        const isExcludedPage = excludePatterns.some(pattern => pattern.test(pathname));
        if (isExcludedPage) {
            console.log('页面被排除:', pathname);
            return false;
        }

        // 检查是否在镜像相关页面（严格检测）
        const imagePagePatterns = [
            /^\/r\/[^\/]+$/,                        // /r/nginx (官方镜像)
            /^\/r\/[^\/]+\/[^\/]+$/,                // /r/username/imagename (用户镜像)
            /^\/_\/[^\/]+$/,                        // /_/nginx (官方镜像另一格式)
            /^\/layers\/[^\/]+\/[^\/]+\/[^\/]+/,    // /layers/username/imagename/tag/... (镜像层详情页面)
            /^\/r\/[^\/]+\/tags/,                   // 官方镜像标签页面
            /^\/r\/[^\/]+\/[^\/]+\/tags/            // 用户镜像标签页面
        ];

        const isImagePage = imagePagePatterns.some(pattern => pattern.test(pathname));
        console.log('页面路径检测:', pathname, '是镜像页面:', isImagePage);
        
        return isImagePage;
    }

    // ==================== 初始化和启动 ====================

    /**
     * 清理旧的下载器界面
     * 功能：删除页面上任何已存在的下载器界面
     */
    function cleanupOldDownloaders() {
        // 删除旧的大型下载器界面
        const oldDownloaders = document.querySelectorAll('.docker-downloader-container');
        oldDownloaders.forEach(element => {
            if (element.querySelector('.docker-downloader-title')) {
                element.remove();
                console.log('已删除旧的下载器界面');
            }
        });

        // 删除重复的按钮容器
        const containers = document.querySelectorAll('.docker-download-container');
        if (containers.length > 1) {
            // 保留第一个，删除其余的
            for (let i = 1; i < containers.length; i++) {
                containers[i].remove();
                console.log('已删除重复的下载按钮');
            }
        }
    }

    /**
     * 初始化下载器主函数
     * 功能：执行所有必要的初始化步骤并启动下载器
     */
    async function initDownloader() {
        try {
            console.log('开始初始化Docker下载器...');
            console.log('当前URL:', window.location.href);
            console.log('当前路径:', window.location.pathname);
            
            // 等待页面DOM加载完成
            if (document.readyState === 'loading') {
                console.log('等待DOM加载完成...');
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // 检查是否在合适的Docker Hub页面
            const isImagePage = isDockerHubImagePage();
            console.log('是否为镜像页面:', isImagePage);
            if (!isImagePage) {
                console.log('不在Docker Hub镜像页面，跳过下载器初始化');
                return;
            }

            // 清理旧的下载器界面
            console.log('清理旧的下载器界面...');
            cleanupOldDownloaders();

            // 避免重复初始化 - 检查是否还有按钮存在
            const existingBtn = document.querySelector('.docker-download-btn');
            if (existingBtn) {
                console.log('下载按钮仍然存在，跳过初始化');
                return;
            }

            // 添加CSS样式
            addCustomStyles();

            // 初始化本地数据库
            await initIndexedDB();

            // 等待页面元素完全加载
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 查找插入点并插入下载按钮
            console.log('开始查找插入点...');
            const insertionPoints = findInsertionPoints();
            console.log('找到插入点数量:', insertionPoints.length);
            
            if (insertionPoints.length > 0) {
                // 选择最佳插入点
                let bestPoint = insertionPoints[0]; // 使用找到的第一个有效点
                console.log('选择插入点:', bestPoint.description, bestPoint);
                insertDownloadButtons(bestPoint);
                
                // 在按钮插入后绑定事件处理器
                setTimeout(() => {
                    bindEventHandlers();
                    // 设置架构变化监听器
                    setupArchChangeListener();
                }, 100);
            } else {
                console.log('未找到插入点，这不应该发生，因为findInsertionPoints已经有备用方案');
                
                // 强制备用方案：直接在body中插入
                const forcePoint = {
                    element: document.body,
                    position: 'prepend',
                    type: 'force',
                    description: '强制插入到页面顶部'
                };
                console.log('使用强制插入点:', forcePoint.description);
                insertDownloadButtons(forcePoint);
                
                // 在按钮插入后绑定事件处理器
                setTimeout(() => {
                    bindEventHandlers();
                    // 设置架构变化监听器
                    setupArchChangeListener();
                }, 100);
            }

            // 记录初始化完成
            addLog('Docker Hub 下载按钮已准备就绪');
            
            // 显示当前检测到的镜像信息
            const { imageName, imageTag } = extractImageInfo();
            if (imageName) {
                addLog(`检测到镜像: ${imageName}:${imageTag}`);
            } else {
                addLog('等待镜像信息加载...');
            }

        } catch (error) {
            console.error('初始化下载器失败:', error);
            // 即使初始化失败也不要影响页面正常使用
        }
    }

    /**
     * 设置页面变化监听器
     * 功能：监听单页应用的路由变化并重新初始化
     */
    function setupPageChangeListener() {
        let currentUrl = window.location.href;
        let initTimeout = null;
        
        // 防抖函数，避免频繁初始化
        function debouncedInit() {
            if (initTimeout) {
                clearTimeout(initTimeout);
            }
            initTimeout = setTimeout(() => {
                console.log('页面变化检测到，重新初始化下载器');
                initDownloader();
            }, 1000); // 减少延迟时间
        }
        
        // 更敏感的URL变化检测
        function checkUrlChange() {
            if (window.location.href !== currentUrl) {
                console.log('URL变化检测:', currentUrl, '->', window.location.href);
                currentUrl = window.location.href;
                debouncedInit();
            }
        }
        
        // 使用MutationObserver监听DOM变化
        let lastCheck = 0;
        const observer = new MutationObserver((mutations) => {
            const now = Date.now();
            if (now - lastCheck > 1000) { // 减少检查间隔
                lastCheck = now;
                checkUrlChange();
                
                // 检查是否有新的页面内容加载
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 检查是否包含镜像相关内容
                                const text = node.textContent || '';
                                if (text.includes('MANIFEST DIGEST') || 
                                    text.includes('OS/ARCH') || 
                                    text.includes('Image Layers') ||
                                    node.querySelector && node.querySelector('[data-testid]')) {
                                    console.log('检测到镜像页面内容加载');
                                    debouncedInit();
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        });

        // 开始观察页面内容变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // 监听浏览器前进后退按钮
        window.addEventListener('popstate', () => {
            console.log('浏览器导航事件');
            debouncedInit();
        });
        
        // 监听pushState和replaceState（SPA路由变化）
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            console.log('pushState事件');
            setTimeout(checkUrlChange, 100);
        };
        
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            console.log('replaceState事件');
            setTimeout(checkUrlChange, 100);
        };
        
        // 定期检查URL变化（备用方案）
        setInterval(checkUrlChange, 2000);
        
        console.log('页面变化监听器已设置');
    }

    // ==================== 架构自动检测功能 ====================

    /**
     * 从页面DOM自动检测当前选中的架构
     * 功能：从Docker Hub页面的架构选择器中提取当前选中的架构信息
     * @returns {string} 检测到的架构字符串，如 'linux/arm64'
     */
    function detectArchFromPageDOM() {
        try {
            // 方法1: 优先检测OS/ARCH部分的架构选择器（基于您的截图）
            // 查找包含"OS/ARCH"文本的区域附近的选择器
            const osArchHeaders = document.querySelectorAll('*');
            for (const header of osArchHeaders) {
                const headerText = header.textContent.trim();
                if (headerText === 'OS/ARCH' || headerText.includes('OS/ARCH')) {
                    // 在OS/ARCH标题附近查找选择器
                    const parent = header.parentElement;
                    if (parent) {
                        // 查找父元素及其兄弟元素中的选择器
                        const nearbySelectors = parent.querySelectorAll('select, [role="combobox"], .MuiSelect-select');
                        for (const selector of nearbySelectors) {
                            let archText = '';
                            
                            if (selector.tagName === 'SELECT') {
                                const selectedOption = selector.options[selector.selectedIndex];
                                archText = selectedOption ? selectedOption.textContent.trim() : selector.value;
                            } else {
                                archText = selector.textContent.trim();
                            }
                            
                            if (archText.match(/^(linux|windows|darwin)\/.+/i)) {
                                addLog(`从OS/ARCH区域检测到架构: ${archText}`);
                                return archText.toLowerCase();
                            }
                        }
                        
                        // 也检查父元素的下一个兄弟元素
                        let nextElement = parent.nextElementSibling;
                        while (nextElement) {
                            const selectors = nextElement.querySelectorAll('select, [role="combobox"], .MuiSelect-select');
                            for (const selector of selectors) {
                                let archText = '';
                                
                                if (selector.tagName === 'SELECT') {
                                    const selectedOption = selector.options[selector.selectedIndex];
                                    archText = selectedOption ? selectedOption.textContent.trim() : selector.value;
                                } else {
                                    archText = selector.textContent.trim();
                                }
                                
                                if (archText.match(/^(linux|windows|darwin)\/.+/i)) {
                                    addLog(`从OS/ARCH区域下方检测到架构: ${archText}`);
                                    return archText.toLowerCase();
                                }
                            }
                            nextElement = nextElement.nextElementSibling;
                            // 只检查接下来的几个兄弟元素，避免检查过远
                            if (nextElement && nextElement.getBoundingClientRect().top - parent.getBoundingClientRect().top > 200) {
                                break;
                            }
                        }
                    }
                }
            }

            // 方法2: 检测标准的架构下拉选择器
            const osArchSelectors = [
                'select', // 标准select元素
                'select[aria-label*="arch"]', // 带有arch标签的select
                'select[aria-label*="OS"]', // 带有OS标签的select
                '.MuiSelect-select', // MUI选择器
                '[role="combobox"]' // 下拉框角色
            ];

            // 收集所有可能的架构选择器及其文本
            const archCandidates = [];
            
            for (const selector of osArchSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    let archText = '';
                    let elementInfo = '';
                    
                    // 检查select元素的选中值
                    if (element.tagName === 'SELECT') {
                        const selectedValue = element.value;
                        const selectedOption = element.options[element.selectedIndex];
                        archText = selectedOption ? selectedOption.textContent.trim() : selectedValue;
                        elementInfo = `SELECT(${element.className})`;
                    } else {
                        // 检查其他元素的文本内容
                        archText = element.textContent.trim();
                        elementInfo = `${element.tagName}(${element.className})`;
                    }
                    
                    if (archText.match(/^(linux|windows|darwin)\/.+/i)) {
                        archCandidates.push({
                            text: archText.toLowerCase(),
                            element: element,
                            info: elementInfo,
                            position: element.getBoundingClientRect()
                        });
                    }
                }
            }

            // 如果找到多个候选者，选择最合适的一个
            if (archCandidates.length > 0) {
                addLog(`找到 ${archCandidates.length} 个架构候选:`);
                archCandidates.forEach((candidate, index) => {
                    addLog(`  候选${index + 1}: ${candidate.text} (${candidate.info}) 位置: ${Math.round(candidate.position.top)}`);
                });
                
                // 优先选择位置较低的（通常OS/ARCH部分在页面下方）
                archCandidates.sort((a, b) => b.position.top - a.position.top);
                const selected = archCandidates[0];
                addLog(`选择架构: ${selected.text} (${selected.info}) - 位置最低`);
                return selected.text;
            }

            // 方法2: 检测MUI架构选择器（基于您提供的DOM结构）
            const muiSelectors = [
                '.MuiSelect-select.MuiSelect-outlined.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall', // 完整MUI选择器
                '.MuiSelect-select.MuiSelect-outlined', // MUI下拉选择器
                '.MuiInputBase-input.MuiOutlinedInput-input', // MUI输入框
                'div[role="combobox"]' // div形式的下拉框
            ];

            for (const selector of muiSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const text = element.textContent.trim();
                    // 检查是否包含架构格式 (os/arch)
                    if (text.match(/^(linux|windows|darwin)\/.+/i)) {
                        addLog(`从MUI选择器检测到架构: ${text}`);
                        return text.toLowerCase();
                    }
                }
            }

            // 方法3: 专门检测您提供的MUI容器结构
            const muiContainers = document.querySelectorAll('.MuiInputBase-root.MuiOutlinedInput-root');
            for (const container of muiContainers) {
                const selectDiv = container.querySelector('div[role="combobox"]');
                if (selectDiv) {
                    const text = selectDiv.textContent.trim();
                    if (text.match(/^(linux|windows|darwin)\/.+/i)) {
                        addLog(`从MUI容器检测到架构: ${text}`);
                        return text.toLowerCase();
                    }
                }
            }

            // 方法2: 查找包含架构信息的其他元素
            const archPatterns = [
                /linux\/amd64/i,
                /linux\/arm64/i,
                /linux\/arm\/v7/i,
                /linux\/arm\/v6/i,
                /linux\/386/i,
                /windows\/amd64/i,
                /darwin\/amd64/i,
                /darwin\/arm64/i
            ];

            // 搜索页面中所有可能包含架构信息的元素
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                const text = element.textContent.trim();
                for (const pattern of archPatterns) {
                    if (pattern.test(text) && text.length < 50) { // 避免匹配过长的文本
                        const match = text.match(pattern);
                        if (match) {
                            addLog(`从页面元素检测到架构: ${match[0]}`);
                            return match[0].toLowerCase();
                        }
                    }
                }
            }

            addLog('未能从页面DOM检测到架构信息');
            return null;

        } catch (error) {
            addLog(`DOM架构检测失败: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * 从URL中的SHA256值检测架构（使用缓存信息）
     * 功能：使用缓存的架构-SHA256映射快速检测架构
     * @returns {Promise<string|null>} 检测到的架构字符串
     */
    async function detectArchFromSHA256() {
        try {
            const url = window.location.href;
            const sha256Match = url.match(/sha256-([a-f0-9]{64})/i);
            
            if (!sha256Match) {
                addLog('URL中未找到SHA256值');
                return null;
            }

            const sha256 = sha256Match[1];
            addLog(`从URL提取SHA256: ${sha256.substring(0, 12)}...`);

            // 确保有缓存的架构信息
            if (!cachedArchitectures) {
                addLog('没有缓存的架构信息，先获取架构列表');
                await getAvailableArchitectures();
            }

            if (!cachedArchitectures || !cachedArchitectures.platformMap) {
                addLog('无法获取架构信息进行SHA256检测');
                return null;
            }

            // 首先检查平台映射中是否有直接匹配的SHA256
            for (const [architecture, platformInfo] of cachedArchitectures.platformMap) {
                if (platformInfo.sha256 && platformInfo.sha256 === sha256) {
                    addLog(`✅ 通过缓存的平台信息匹配到架构: ${architecture}`);
                    return architecture;
                }
                if (platformInfo.digest && platformInfo.digest.includes(sha256)) {
                    addLog(`✅ 通过缓存的摘要信息匹配到架构: ${architecture}`);
                    return architecture;
                }
            }

            // 如果缓存中没有找到，需要深度检查每个架构的层信息
            addLog('缓存中未找到匹配，深度检查各架构的层信息...');
            
            const { imageName, imageTag } = extractImageInfo();
            if (!imageName) {
                addLog('无法提取镜像信息进行深度SHA256检测');
                return null;
            }

            for (const architecture of cachedArchitectures.architectures) {
                addLog(`  深度检查架构: ${architecture}`);
                
                try {
                    // 直接调用analyzeImage函数获取特定架构的清单
                    const archData = await analyzeImage(imageName, imageTag, architecture);
                    
                    if (archData) {
                        // 检查这个架构的所有层是否包含我们的SHA256
                        if (archData.layers) {
                            for (const layer of archData.layers) {
                                if (layer.digest && layer.digest.includes(sha256)) {
                                    addLog(`✅ SHA256匹配镜像层! 架构: ${architecture}`);
                                    
                                    // 更新缓存信息
                                    const platformInfo = cachedArchitectures.platformMap.get(architecture);
                                    if (platformInfo) {
                                        platformInfo.layerSha256 = sha256;
                                    }
                                    
                                    return architecture;
                                }
                            }
                        }
                        
                        // 也检查配置层
                        if (archData.manifest && archData.manifest.config && 
                            archData.manifest.config.digest && archData.manifest.config.digest.includes(sha256)) {
                            addLog(`✅ SHA256匹配配置层! 架构: ${architecture}`);
                            
                            // 更新缓存信息
                            const platformInfo = cachedArchitectures.platformMap.get(architecture);
                            if (platformInfo) {
                                platformInfo.configSha256 = sha256;
                            }
                            
                            return architecture;
                        }
                    }
                } catch (archError) {
                    addLog(`  检查架构 ${architecture} 时出错: ${archError.message}`);
                }
            }

            addLog('SHA256架构检测未找到匹配结果');
            return null;

        } catch (error) {
            addLog(`SHA256架构检测失败: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * 综合架构自动检测
     * 功能：结合多种方法自动检测当前页面的架构信息
     * @returns {Promise<string|null>} 检测到的架构字符串
     */
    async function autoDetectArchitecture() {
        addLog('开始自动架构检测...');

        // 优先级1: 从URL的SHA256检测（最准确）
        const sha256Arch = await detectArchFromSHA256();
        if (sha256Arch) {
            return sha256Arch;
        }

        // 优先级2: 从页面DOM检测
        const domArch = detectArchFromPageDOM();
        if (domArch) {
            return domArch;
        }

        // 优先级3: 使用默认架构
        const defaultArch = 'linux/amd64';
        addLog(`使用默认架构: ${defaultArch}`);
        return defaultArch;
    }

    /**
     * 获取镜像的可用架构列表并缓存架构-SHA256映射
     * 功能：直接从 Docker Registry 获取镜像支持的所有架构及其对应的SHA256
     * @returns {Promise<Array>} 可用架构列表
     */
    async function getAvailableArchitectures() {
        try {
            // 提取镜像信息
            const { imageName, imageTag } = extractImageInfo();
            if (!imageName) {
                addLog('无法提取镜像信息，跳过架构列表获取');
                return [];
            }

            // 检查是否已有缓存
            const cacheKey = `${imageName}:${imageTag}`;
            if (cachedArchitectures && cachedArchitectures.cacheKey === cacheKey) {
                addLog('使用缓存的架构信息');
                return cachedArchitectures.architectures;
            }

            addLog(`获取镜像架构列表: ${imageName}:${imageTag}`);

            // 直接调用分析镜像函数获取架构信息
            const manifestData = await analyzeImage(imageName, imageTag, '');
            
            if (manifestData.multiArch && manifestData.availablePlatforms) {
                addLog(`发现多架构镜像，包含 ${manifestData.availablePlatforms.length} 个架构`);
                
                // 缓存架构信息，包含架构和对应的SHA256/digest
                cachedArchitectures = {
                    cacheKey: cacheKey,
                    architectures: manifestData.availablePlatforms.map(platform => platform.platform),
                    platformMap: new Map(manifestData.availablePlatforms.map(platform => [
                        platform.platform, 
                        {
                            digest: platform.digest,
                            sha256: platform.digest ? platform.digest.replace('sha256:', '') : null
                        }
                    ]))
                };
                
                addLog(`已缓存 ${manifestData.availablePlatforms.length} 个架构的SHA256映射`);
                return cachedArchitectures.architectures;
            } else {
                addLog('发现单架构镜像，使用默认架构列表');
                
                // 为单架构镜像创建缓存
                cachedArchitectures = {
                    cacheKey: cacheKey,
                    architectures: ['linux/amd64'],
                    platformMap: new Map([['linux/amd64', { digest: null, sha256: null }]])
                };
                
                return cachedArchitectures.architectures;
            }
        } catch (error) {
            addLog(`获取架构列表失败: ${error.message}`, 'error');
            return [];
        }
    }

    /**
     * 更新架构选择器的选项
     * 功能：根据获取到的可用架构更新下拉选择器选项
     * @param {HTMLElement} selector - 架构选择器元素
     * @param {Array} architectures - 可用架构列表
     */
    function updateArchSelectorOptions(selector, architectures) {
        if (!selector || !architectures || architectures.length === 0) {
            return;
        }

        // 保存当前选中的值
        const currentValue = selector.value;
        
        // 清空现有选项，但保留"自动检测"选项
        selector.innerHTML = '<option value="">自动检测</option>';
        
        // 添加获取到的架构选项
        architectures.forEach(arch => {
            const option = document.createElement('option');
            option.value = arch;
            option.textContent = arch;
            selector.appendChild(option);
        });
        
        // 如果之前有选中的值且仍然存在，恢复选中状态
        if (currentValue && architectures.includes(currentValue)) {
            selector.value = currentValue;
        }
        
        addLog(`架构选择器已更新: ${architectures.join(', ')}`);
    }

    /**
     * 设置页面架构选择器变化监听
     * 功能：监听Docker Hub页面上的OS/ARCH选择器变化，自动更新我们的架构选择器
     */
    function setupArchChangeListener() {
        // 监听所有可能的架构选择器变化
        const archSelectors = [
            'select', // 标准select元素
            '.MuiSelect-select', // MUI选择器
            '[role="combobox"]' // 下拉框角色
        ];

        archSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 为每个可能的架构选择器添加变化监听
                if (element.tagName === 'SELECT') {
                    element.addEventListener('change', handleArchChange);
                    addLog(`为SELECT元素添加了变化监听: ${element.className}`);
                } else {
                    // 对于非select元素，使用MutationObserver监听内容变化
                    const observer = new MutationObserver(handleArchChange);
                    observer.observe(element, {
                        childList: true,
                        subtree: true,
                        characterData: true
                    });
                    addLog(`为元素添加了MutationObserver: ${element.className}`);
                }
            });
        });

        // 使用全局MutationObserver监听页面架构相关变化
        const globalObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                // 检查变化的节点是否包含架构信息
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const target = mutation.target;
                    if (target.textContent && target.textContent.match(/^(linux|windows|darwin)\/.+/i)) {
                        handleArchChange();
                    }
                }
            });
        });

        // 监听页面主要内容区域的变化
        const mainContent = document.querySelector('main, body');
        if (mainContent) {
            globalObserver.observe(mainContent, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        addLog('架构变化监听器已设置');
    }

    /**
     * 处理页面架构选择器变化
     * 功能：当页面架构选择器发生变化时，自动更新我们的架构选择器
     */
    async function handleArchChange() {
        try {
            // 防止频繁触发
            if (handleArchChange.timeout) {
                clearTimeout(handleArchChange.timeout);
            }

            handleArchChange.timeout = setTimeout(async () => {
                addLog('检测到页面架构变化，正在更新...');
                
                const ourArchSelector = document.getElementById('archSelector');
                const archIndicator = document.getElementById('archIndicator');
                
                // 显示更新状态
                if (archIndicator) {
                    archIndicator.style.display = 'inline';
                    archIndicator.textContent = '🔄 更新中...';
                    archIndicator.style.color = '#007bff';
                }
                
                // 重新获取可用架构列表
                const availableArchs = await getAvailableArchitectures();
                if (availableArchs && availableArchs.length > 0 && ourArchSelector) {
                    updateArchSelectorOptions(ourArchSelector, availableArchs);
                }
                
                // 只有在用户没有手动选择时才重新检测架构
                if (!userManuallySelectedArch) {
                    const detectedArch = await autoDetectArchitecture();
                    if (detectedArch && ourArchSelector) {
                        // 检查选项中是否存在检测到的架构
                        const existingOption = ourArchSelector.querySelector(`option[value="${detectedArch}"]`);
                        if (existingOption) {
                            ourArchSelector.value = detectedArch;
                        } else {
                            // 如果选项中不存在，添加新选项
                            const newOption = document.createElement('option');
                            newOption.value = detectedArch;
                            newOption.textContent = detectedArch;
                            newOption.selected = true;
                            ourArchSelector.appendChild(newOption);
                        }
                        
                        ourArchSelector.title = `当前架构: ${detectedArch} (页面同步)`;
                        addLog(`架构选择器已同步更新为: ${detectedArch}`);
                        
                        // 更新指示器
                        if (archIndicator) {
                            archIndicator.textContent = `✅ ${detectedArch}`;
                            archIndicator.style.color = '#28a745';
                            setTimeout(() => {
                                archIndicator.style.display = 'none';
                            }, 2000);
                        }
                    } else if (archIndicator) {
                        archIndicator.textContent = '❌ 更新失败';
                        archIndicator.style.color = '#dc3545';
                        setTimeout(() => {
                            archIndicator.style.display = 'none';
                        }, 2000);
                    }
                } else {
                    // 用户已手动选择，不进行自动更新
                    addLog('跳过页面架构同步（用户已手动选择）');
                    if (archIndicator) {
                        archIndicator.textContent = '✋ 保持手动选择';
                        archIndicator.style.color = '#fd7e14';
                        setTimeout(() => {
                            archIndicator.style.display = 'none';
                        }, 2000);
                    }
                }
            }, 500); // 500ms防抖
        } catch (error) {
            addLog(`架构变化处理失败: ${error.message}`, 'error');
        }
    }

    // ==================== 脚本入口点 ====================
    
    // 脚本启动日志
    console.log('Docker Hub 镜像下载器脚本已加载');
    
    // 启动初始化流程
    initDownloader();
    
    // 设置页面变化监听
    setupPageChangeListener();

})(); 