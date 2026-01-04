// ==UserScript==
// @name         sk oneapi模型检测
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Mobile-friendly AI model availability tester
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/521571/sk%20oneapi%E6%A8%A1%E5%9E%8B%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521571/sk%20oneapi%E6%A8%A1%E5%9E%8B%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    // 添加存储前缀，用于跨站点共享数据
    const STORAGE_PREFIX = 'model_tester_';
    
    // 存储相关的辅助函数
    function saveToStorage(key, value) {
        localStorage.setItem(STORAGE_PREFIX + key, value);
    }
    
    function getFromStorage(key, defaultValue = null) {
        const value = localStorage.getItem(STORAGE_PREFIX + key);
        return value !== null ? value : defaultValue;
    }
    
    function removeFromStorage(key) {
        localStorage.removeItem(STORAGE_PREFIX + key);
    }
    
    // === 初始化变量 ===
    let isDragging = false;
    let lastTouchTime = Date.now();
    let isButtonOnRight = JSON.parse(getFromStorage('isButtonOnRight', 'true'));
    let isTestingRunning = false;
    let currentUrlIndex = parseInt(getFromStorage('currentUrlIndex', '0'));
    let isAutoResume = JSON.parse(getFromStorage('isAutoResume', 'false'));
    let isUserInteracting = false;
    let scrollTimer = null;
    let lastScrollTime = Date.now();
    let currentUrlCount = parseInt(getFromStorage('currentUrlCount', '0'));
    let totalUrlCount = parseInt(getFromStorage('totalUrlCount', '0'));
    let hideTimeout = null;
    let isButtonHidden = false;
    let autoAttachTimer = null;
    
    // 测试结果存储
    const testResults = {
        available: JSON.parse(getFromStorage('availableResults', '[]')),
        all: JSON.parse(getFromStorage('allResults', '[]'))
    };
    
   // 优先级关键词
const PRIORITY_KEYWORDS = [
    'o3',
    'deepseek-r1',
    'gemini-2',
    'o1',
    'claude-3-5',
    'claude-3.5',
    'gemini-1.5-pro', 
    'gemini-exp',
    'llama3.1-405',
    'qwen2.5-72b',
    'qwq',
    'gpt-4o'
];

// 基础样式
    const style = document.createElement('style');
    style.textContent = `
        [id^="fmt-"] {
            all: revert;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        #fmt-floatingButton.fmt-hidden-right {
            transform: translateX(50%) !important;
        }
        #fmt-floatingButton.fmt-hidden-left {
            transform: translateX(-50%) !important;
        }
        .fmt-export-item {
            padding: 10px 15px !important;
            cursor: pointer !important;
            border-bottom: 1px solid #eee !important;
        }
        .fmt-export-item:last-child {
            border-bottom: none !important;
        }
        .fmt-export-item:hover {
            background: #f5f5f5 !important;
        }
        #fmt-exportToggle.active .fmt-arrow {
            transform: rotate(180deg) !important;
        }
        .fmt-export-container {
            position: relative !important;
        }
        #fmt-results {
            white-space: pre-wrap !important;
            word-break: break-all !important;
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch !important;
        }
    `;
    document.head.appendChild(style);
    function startHideTimeout() {
        clearTimeout(hideTimeout);
    }
    class ModelTester {
        constructor(url) {
            this.url = url.replace(/\/$/, '');
            const apiKey = document.getElementById('fmt-apiKey').value.trim() || 'sk-fastgpt';
            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
        }
        async testModel(model) {
            try {
                const response = await this.makeRequest(`${this.url}/v1/chat/completions`, {
                    method: 'POST',
                    data: JSON.stringify({
                        model: model,
                        messages: [{role: 'user', content: 'Hi'}],
                        max_tokens: 3
                    })
                });
                if (response.error) {
                    throw new Error(response.error.message || '模型返回错误');
                }
                if (!response.choices || 
                    !response.choices[0] || 
                    !response.choices[0].message ||
                    !response.choices[0].message.content) {
                    throw new Error('无效响应');
                }
                const errorKeywords = [
                    'error',
                    'invalid',
                    'not available',
                    'unavailable',
                    'not found',
                    'cannot',
                    'unsupported',
                    'disabled',
                    '不可用',
                    '未知',
                    '错误',
                    '无效'
                ];
                const content = response.choices[0].message.content.toLowerCase();
                if (errorKeywords.some(keyword => content.includes(keyword))) {
                    throw new Error('模型响应错误');
                }
                return true;
            } catch (e) {
                const message = e.message || '渠道不可用';
                if (message.includes('Panic detected') || message.includes('runtime error')) {
                    throw new Error('服务器错误');
                }
                if (message.includes('quota')) {
                    const quotaMatch = message.match(/quota \[(\d+)\]/);
                    const remainingQuota = quotaMatch ? quotaMatch[1] : '未知';
                    throw new Error(`配额不足(${remainingQuota})`);
                }
                if (message.includes('饱和')) {
                    throw new Error('上游饱和');
                }
                if (message.includes('concurrent') || message.includes('rate limit')) {
                    throw new Error('并发受限');
                }
                if (message.includes('Model does not exist')) {
                    throw new Error('模型不存在');
                }
                if (message.includes('无可用渠道')) {
                    throw new Error('无可用渠道');
                }
                if (message.includes('Unauthorized') || message.includes('invalid_api_key')) {
                    throw new Error('未授权');
                }
                if (message.includes('maintenance')) {
                    throw new Error('模型维护中');
                }
                if (message.includes('timeout')) {
                    throw new Error('请求超时');
                }
                if (message.includes('busy') || message.includes('overloaded')) {
                    throw new Error('模型繁忙');
                }
                if (message.includes('invalid') || message.includes('parameter')) {
                    throw new Error('参数错误');
                }
                throw new Error('请求失败');
            }
        }

async getModels() {
            try {
                const response = await this.makeRequest(`${this.url}/v1/models`, {
                    method: 'GET'
                });
                
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('获取模型列表失败');
                }
                
                return response.data.map(model => model.id);
            } catch (e) {
                throw new Error('渠道不可用');
            }
        }
        makeRequest(url, options) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url,
                    ...options,
                    headers: this.headers,
                    timeout: 3000,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (response.status === 200) {
                                resolve(data);
                            } else {
                                reject(new Error(data.error?.message || '请求失败'));
                            }
                        } catch (e) {
                            reject(new Error('解析响应失败'));
                        }
                    },
                    onerror: () => reject(new Error('网络请求失败')),
                    ontimeout: () => reject(new Error('请求超时'))
                });
            });
        }
    }
    function setupDragBehavior() {
        const button = document.getElementById('fmt-floatingButton');
        let startX, startY;
        let lastClickTime = 0;
        let initialButtonX, initialButtonY;
        
        function handleTouchStart(e) {
            e.preventDefault();
            const touch = e.touches[0];
            isDragging = true;
            lastTouchTime = Date.now();
            
            startX = touch.clientX;
            startY = touch.clientY;
            
            initialButtonX = button.offsetLeft;
            initialButtonY = button.offsetTop;
            
            button.style.transition = 'none';
            clearTimeout(autoAttachTimer);
        }
        
        function handleTouchMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            const newX = Math.max(-25, Math.min(window.innerWidth - 25, initialButtonX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - 50, initialButtonY + deltaY));
            
            button.style.left = `${newX}px`;
            button.style.top = `${newY}px`;
            
            clearTimeout(autoAttachTimer);
        }
        
        function attachToEdge() {
            button.style.transition = 'all 0.3s';
            const currentX = button.offsetLeft;
            const screenWidth = window.innerWidth;
            
            if (currentX < screenWidth / 2) {
                button.style.left = '-25px';
                isButtonOnRight = false;
            } else {
                button.style.left = `${screenWidth - 25}px`;
                isButtonOnRight = true;
            }
            
            saveToStorage('isButtonOnRight', JSON.stringify(isButtonOnRight));
        }

function handleTouchEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            
            if (Math.abs(e.changedTouches[0].clientX - startX) < 5 && 
                Math.abs(e.changedTouches[0].clientY - startY) < 5) {
                const currentTime = Date.now();
                const currentX = button.offsetLeft;
                const screenWidth = window.innerWidth;
                
                const isFullyExpanded = (currentX === 0 || currentX === screenWidth - 50);
                
                if (isFullyExpanded) {
                    togglePanel();
                } else if (currentTime - lastClickTime < 300) {
                    togglePanel();
                    lastClickTime = 0;
                } else {
                    button.style.transition = 'all 0.3s';
                    
                    if (currentX < screenWidth / 2) {
                        button.style.left = '0px';
                    } else {
                        button.style.left = `${screenWidth - 50}px`;
                    }
                    lastClickTime = currentTime;
                }
            }
            
            clearTimeout(autoAttachTimer);
            autoAttachTimer = setTimeout(attachToEdge, 2000);
        }
        
        autoAttachTimer = setTimeout(attachToEdge, 2000);
        
        button.addEventListener('touchstart', handleTouchStart, {passive: false});
        button.addEventListener('touchmove', handleTouchMove, {passive: false});
        button.addEventListener('touchend', handleTouchEnd);
    }
    function createUI() {
        // 添加viewport meta标签
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
        
        const container = document.createElement('div');
        container.innerHTML = `
            <div id="fmt-floatingButton" style="
                position: fixed;
                top: 50%;
                ${isButtonOnRight ? 'right: 0;' : 'left: 0;'}
                width: 50px;
                height: 50px;
                background: #007bff;
                border-radius: 50%;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 2147483647;
                transition: all 0.3s;
                font-size: 12px;
                text-align: center;
                line-height: 1.2;
                pointer-events: auto;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
                touch-action: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">
                模型<br>检测
            </div>
            <div id="fmt-mainPanel" style="
                position: fixed;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 2147483646;
                transition: left 0.3s;
                display: flex;
                flex-direction: column;
                padding: 20px;
                box-sizing: border-box;
                overflow: hidden;
            ">

<div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px; color: #333;">Model Tester</h2>
                    <div style="display: flex; gap: 10px;">
                        <button id="fmt-refreshButton" style="
                            padding: 8px 12px;
                            background: #28a745;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 5px;">
                            <span>↻</span>
                            <span>刷新</span>
                        </button>
                        <button id="fmt-toggleButton" style="
                            padding: 8px 12px;
                            background: #dc3545;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 5px;">
                            <span class="fmt-toggle-icon">||</span>
                            <span class="fmt-toggle-text">暂停</span>
                        </button>
                        <div class="fmt-export-container" style="position: relative;">
                            <button id="fmt-exportToggle" style="
                                padding: 8px 12px;
                                background: #007bff;
                                color: white;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                                width: 70px;
                                height: 38px;
                                justify-content: center;">
                                <span>导出</span>
                                <span class="fmt-arrow">▼</span>
                            </button>
                            <div id="fmt-exportMenu" style="
                                position: absolute;
                                top: 100%;
                                right: 0;
                                display: none;
                                background: white;
                                border-radius: 5px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                z-index: 1000;
                                min-width: 140px;
                                margin-top: 5px;">
                                <div class="fmt-export-item" data-action="exportAvailable">导出可用模型</div>
                                <div class="fmt-export-item" data-action="exportAll">导出检测模型</div>
                                <div class="fmt-export-item" data-action="copyAvailable">复制可用模型</div>
                                <div class="fmt-export-item" data-action="copyAll">复制检测模型</div>
                            </div>
                        </div>
                        <button id="fmt-closeButton" style="
                            padding: 8px 12px;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                            width: 38px;
                            height: 38px;">
                            ×
                        </button>
                    </div>
                </div>

<input type="text" id="fmt-apiKey" placeholder="API Key (可选)" style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    width: 100%;
                    box-sizing: border-box;">
                <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    gap: 10px;">
                    <textarea id="fmt-serverUrls" placeholder="输入服务器地址，每行一个" style="
                        flex: 1;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        height: 100px;
                        resize: none;
                        box-sizing: border-box;"></textarea>
                    <button id="fmt-clearUrls" style="
                        padding: 8px;
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #666;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;">
                        ×
                    </button>
                </div>
                <label style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    color: #666;">
                    <input type="checkbox" id="fmt-backgroundMode" 
                        style="margin-right: 8px;
                        width: 16px;
                        height: 16px;"
                        checked>
                    保存检测进度（可关闭页面后继续）
                </label>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;">
                    <button id="fmt-startTest" style="
                        padding: 8px 16px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;">
                        开始测试
                    </button>
                    <span id="fmt-progress" style="
                        color: #666;
                        font-size: 14px;">0/0</span>
                </div>
                <div id="fmt-results" style="
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    overflow-y: auto;
                    background: #f8f9fa;
                    font-family: monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    word-break: break-all;
                    -webkit-overflow-scrolling: touch;">点击开始测试按钮开始检测
                </div>
            </div>`;
        const floatingButton = container.querySelector('#fmt-floatingButton');
        const mainPanel = container.querySelector('#fmt-mainPanel');
        const results = container.querySelector('#fmt-results');
        
        // 先检查并删除已存在的元素
        const existingButton = document.getElementById('fmt-floatingButton');
        const existingPanel = document.getElementById('fmt-mainPanel');
        if (existingButton) existingButton.remove();
        if (existingPanel) existingPanel.remove();
        
        // 添加到 document.documentElement
        document.documentElement.appendChild(floatingButton);
        document.documentElement.appendChild(mainPanel);

// 阻止结果区域的滚动冒泡
        results.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });
        
        results.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
        
        setupDragBehavior();
        setupRefreshBehavior();
        setupToggleButton();
        setupClearButtons();
        setupExportBehavior();
        setupScrollBehavior();
        setupCloseButton();
    }
    function setupRefreshBehavior() {
        const refreshButton = document.getElementById('fmt-refreshButton');
        refreshButton.addEventListener('click', () => {
            isTestingRunning = false;
            currentUrlCount = 0;
            totalUrlCount = 0;
            updateProgress();
            isAutoResume = false;
            currentUrlIndex = 0;
            
            document.getElementById('fmt-apiKey').value = '';
            document.getElementById('fmt-serverUrls').value = '';
            document.getElementById('fmt-results').innerHTML = '点击开始测试按钮开始检测\n';
            document.getElementById('fmt-backgroundMode').checked = true;
            
            testResults.available = [];
            testResults.all = [];
            
            // 使用新的存储方式清除数据
            removeFromStorage('apiKey');
            removeFromStorage('serverUrls');
            removeFromStorage('results');
            removeFromStorage('availableResults');
            removeFromStorage('allResults');
            removeFromStorage('isAutoResume');
            removeFromStorage('currentUrlIndex');
            removeFromStorage('lastTestTime');
            removeFromStorage('backgroundMode');
            removeFromStorage('currentUrlCount');
            removeFromStorage('totalUrlCount');
            
            const toggleButton = document.getElementById('fmt-toggleButton');
            const toggleIcon = toggleButton.querySelector('.fmt-toggle-icon');
            const toggleText = toggleButton.querySelector('.fmt-toggle-text');
            toggleIcon.textContent = '||';
            toggleText.textContent = '暂停';
            toggleButton.style.background = '#dc3545';
        });
    }
    function setupToggleButton() {
        const toggleButton = document.getElementById('fmt-toggleButton');
        const toggleIcon = toggleButton.querySelector('.fmt-toggle-icon');
        const toggleText = toggleButton.querySelector('.fmt-toggle-text');
        
        toggleButton.addEventListener('click', () => {
            isTestingRunning = !isTestingRunning;
            if (isTestingRunning) {
                toggleIcon.textContent = '||';
                toggleText.textContent = '暂停';
                toggleButton.style.background = '#dc3545';
                startTesting();
            } else {
                toggleIcon.textContent = '▶';
                toggleText.textContent = '继续';
                toggleButton.style.background = '#28a745';
            }
        });
    }
    function setupClearButtons() {
        const clearUrls = document.getElementById('fmt-clearUrls');
        const urlsTextarea = document.getElementById('fmt-serverUrls');
        
        function clearUrlsHandler(e) {
            e.stopPropagation();
            urlsTextarea.value = '';
        }
        
        clearUrls.addEventListener('click', clearUrlsHandler);
        clearUrls.addEventListener('touchstart', clearUrlsHandler);
    }

function setupExportBehavior() {
        const exportToggle = document.getElementById('fmt-exportToggle');
        const exportMenu = document.getElementById('fmt-exportMenu');
        let isMenuOpen = false;
        
        exportToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isMenuOpen = !isMenuOpen;
            exportMenu.style.display = isMenuOpen ? 'block' : 'none';
            exportToggle.classList.toggle('active', isMenuOpen);
        });
        document.addEventListener('click', (e) => {
            if (!exportToggle.contains(e.target) && !exportMenu.contains(e.target)) {
                isMenuOpen = false;
                exportMenu.style.display = 'none';
                exportToggle.classList.remove('active');
            }
        });
        exportMenu.addEventListener('click', async (e) => {
            const action = e.target.dataset.action;
            if (!action) return;
            
            let content = '';
            if (action === 'exportAvailable' || action === 'copyAvailable') {
                const urlMap = new Map();
                testResults.available.forEach(result => {
                    const [url, model] = result.split(' - ');
                    if (!urlMap.has(url)) {
                        urlMap.set(url, []);
                    }
                    urlMap.get(url).push(model);
                });
                // 将URL分成两组：有优先级模型的和没有优先级模型的
                const urlsWithPriority = [];
                const urlsWithoutPriority = [];
                
                urlMap.forEach((models, url) => {
                    const priorityCount = models.filter(model => 
                        PRIORITY_KEYWORDS.some(keyword => 
                            model.toLowerCase().includes(keyword.toLowerCase())
                        )
                    ).length;
                    
                    if (priorityCount > 0) {
                        urlsWithPriority.push({
                            url,
                            priorityCount,
                            totalCount: models.length
                        });
                    } else {
                        urlsWithoutPriority.push({
                            url,
                            totalCount: models.length
                        });
                    }
                });
                // 有优先级模型的按优先级数量排序
                urlsWithPriority.sort((a, b) => {
                    if (a.priorityCount !== b.priorityCount) {
                        return b.priorityCount - a.priorityCount;
                    }
                    return b.totalCount - a.totalCount;
                });
                // 没有优先级模型的按总数量排序
                urlsWithoutPriority.sort((a, b) => b.totalCount - a.totalCount);
                // 合并两组排序后的URL
                const sortedUrls = [
                    ...urlsWithPriority.map(item => item.url),
                    ...urlsWithoutPriority.map(item => item.url)
                ];
                // 对每个URL的模型进行排序
                urlMap.forEach((models, url) => {
                    models.sort((a, b) => {
                        const aIndex = PRIORITY_KEYWORDS.findIndex(keyword => 
                            a.toLowerCase().includes(keyword.toLowerCase())
                        );
                        const bIndex = PRIORITY_KEYWORDS.findIndex(keyword => 
                            b.toLowerCase().includes(keyword.toLowerCase())
                        );
                        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
                        if (aIndex === -1) return 1;
                        if (bIndex === -1) return -1;
                        return aIndex - bIndex;
                    });
                });
                
                content = sortedUrls
                    .map(url => `${url}\n${urlMap.get(url).join('、')}`)
                    .join('\n\n');
            }

else if (action === 'exportAll' || action === 'copyAll') {
                const urlMap = new Map();
                testResults.all.forEach(result => {
                    const [url, modelWithStatus] = result.split(' - ');
                    const model = modelWithStatus.split(' - ')[0];
                    if (!urlMap.has(url)) {
                        urlMap.set(url, new Set());
                    }
                    urlMap.get(url).add(model);
                });
                // 将URL分成两组：有优先级模型的和没有优先级模型的
                const urlsWithPriority = [];
                const urlsWithoutPriority = [];
                
                urlMap.forEach((modelSet, url) => {
                    const models = Array.from(modelSet);
                    const priorityCount = models.filter(model => 
                        PRIORITY_KEYWORDS.some(keyword => 
                            model.toLowerCase().includes(keyword.toLowerCase())
                        )
                    ).length;
                    
                    if (priorityCount > 0) {
                        urlsWithPriority.push({
                            url,
                            priorityCount,
                            totalCount: models.length
                        });
                    } else {
                        urlsWithoutPriority.push({
                            url,
                            totalCount: models.length
                        });
                    }
                });
                // 有优先级模型的按优先级数量排序
                urlsWithPriority.sort((a, b) => {
                    if (a.priorityCount !== b.priorityCount) {
                        return b.priorityCount - a.priorityCount;
                    }
                    return b.totalCount - a.totalCount;
                });
                // 没有优先级模型的按总数量排序
                urlsWithoutPriority.sort((a, b) => b.totalCount - a.totalCount);
                // 合并两组排序后的URL
                const sortedUrls = [
                    ...urlsWithPriority.map(item => item.url),
                    ...urlsWithoutPriority.map(item => item.url)
                ];
                // 对每个URL的模型进行排序
                urlMap.forEach((modelSet, url) => {
                    const sortedModels = Array.from(modelSet).sort((a, b) => {
                        const aIndex = PRIORITY_KEYWORDS.findIndex(keyword => 
                            a.toLowerCase().includes(keyword.toLowerCase())
                        );
                        const bIndex = PRIORITY_KEYWORDS.findIndex(keyword => 
                            b.toLowerCase().includes(keyword.toLowerCase())
                        );
                        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
                        if (aIndex === -1) return 1;
                        if (bIndex === -1) return -1;
                        return aIndex - bIndex;
                    });
                    urlMap.set(url, sortedModels);
                });
                
                content = sortedUrls
                    .map(url => `${url}\n${urlMap.get(url).join('、')}`)
                    .join('\n\n');
            }
            if (action.startsWith('export')) {
                const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `model_list_${action === 'exportAvailable' ? 'available' : 'all'}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else if (action.startsWith('copy')) {
                try {
                    await navigator.clipboard.writeText(content);
                } catch (err) {
                    console.error('复制失败:', err);
                }
            }
            
            isMenuOpen = false;
            exportMenu.style.display = 'none';
            exportToggle.classList.remove('active');
        });
    }

function setupScrollBehavior() {
        const results = document.getElementById('fmt-results');
        
        const updateScrollTime = () => {
            lastScrollTime = Date.now();
        };
        
        results.addEventListener('wheel', updateScrollTime, { passive: true });
        results.addEventListener('mousedown', updateScrollTime);
        results.addEventListener('touchstart', updateScrollTime, { passive: true });
        results.addEventListener('touchmove', (e) => {
            updateScrollTime();
            e.stopPropagation();
        }, { passive: true });
    }
    function setupCloseButton() {
        const closeButton = document.getElementById('fmt-closeButton');
        closeButton.addEventListener('click', () => {
            togglePanel();
        });
    }
    function togglePanel() {
        const panel = document.getElementById('fmt-mainPanel');
        const button = document.getElementById('fmt-floatingButton');
        const isHidden = panel.style.left === '-100%';
        
        panel.style.left = isHidden ? '0' : '-100%';
        button.style.display = isHidden ? 'none' : 'flex';
    }
    function checkFloatingButton() {
        const button = document.getElementById('fmt-floatingButton');
        if (!button) {
            console.log('按钮丢失，正在重新创建...');
            createUI();
        }
    }
    function showNotification(message, autoHide = false) {
        const oldNotification = document.getElementById('fmt-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        const notification = document.createElement('div');
        notification.id = 'fmt-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 2147483647;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        const contentDiv = document.createElement('div');
        contentDiv.style.marginBottom = '15px';
        contentDiv.textContent = message;
        
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确认';
        confirmButton.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        confirmButton.addEventListener('click', () => {
            notification.remove();
        });
        
        notification.appendChild(contentDiv);
        notification.appendChild(confirmButton);
        
        if (document.body) {
            document.body.appendChild(notification);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(notification);
            });
        }
        
        if (autoHide) {
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
    function updateProgress() {
        const progressElement = document.getElementById('fmt-progress');
        progressElement.textContent = `${currentUrlCount}/${totalUrlCount}`;
        
        saveToStorage('currentUrlCount', currentUrlCount.toString());
        saveToStorage('totalUrlCount', totalUrlCount.toString());
    }

function updateResults(text) {
        const results = document.getElementById('fmt-results');
        results.innerHTML += text;
        
        const currentTime = Date.now();
        if (currentTime - lastScrollTime >= 2000) {
            results.scrollTop = results.scrollHeight;
        }
        
        saveState();
    }
    function saveState() {
        saveToStorage('apiKey', document.getElementById('fmt-apiKey').value);
        saveToStorage('serverUrls', document.getElementById('fmt-serverUrls').value);
        saveToStorage('results', document.getElementById('fmt-results').innerHTML);
        saveToStorage('backgroundMode', document.getElementById('fmt-backgroundMode').checked);
        saveToStorage('availableResults', JSON.stringify(testResults.available));
        saveToStorage('allResults', JSON.stringify(testResults.all));
    }
    function checkAndAutoResume() {
        const serverUrls = getFromStorage('serverUrls', '');
        const lastTestTime = parseInt(getFromStorage('lastTestTime', '0'));
        const currentTime = Date.now();
        const currentIndex = parseInt(getFromStorage('currentUrlIndex', '0'));
        
        if (serverUrls && 
            currentIndex > 0 && 
            currentIndex < serverUrls.split('\n').filter(url => url.trim()).length &&
            (currentTime - lastTestTime < 24 * 60 * 60 * 1000)) {
            
            console.log('检测到未完成的测试，正在恢复...');
            showNotification('检测到未完成的测试，正在恢复...', true);
            
            isTestingRunning = true;
            isAutoResume = true;
            
            setTimeout(() => {
                const toggleButton = document.getElementById('fmt-toggleButton');
                const toggleIcon = toggleButton.querySelector('.fmt-toggle-icon');
                const toggleText = toggleButton.querySelector('.fmt-toggle-text');
                
                toggleIcon.textContent = '||';
                toggleText.textContent = '暂停';
                toggleButton.style.background = '#dc3545';
                
                startTesting();
            }, 1500);
        }
    }
    async function startTesting() {
        try {
            saveToStorage('lastTestTime', Date.now().toString());
            saveToStorage('isAutoResume', 'true');
            
            const urls = document.getElementById('fmt-serverUrls').value
                .split('\n')
                .map(url => url.trim())
                .filter(url => url.match(/^https?:\/\/.+/));
            
            if (urls.length === 0) {
                updateResults('请输入有效的服务器地址！\n');
                return;
            }
            if (currentUrlIndex === 0) {
                currentUrlCount = 0;
                totalUrlCount = urls.length;
            }
            
            isTestingRunning = true;
            updateProgress();
            
            const saveInterval = setInterval(() => {
                if (isTestingRunning) {
                    saveState();
                }
            }, 10000);
            
            const buttonCheckInterval = setInterval(checkFloatingButton, 2000);

try {
                const testBatchSize = 14; // URL并发数改为14
                for (let i = currentUrlIndex; i < urls.length; i += testBatchSize) {
                    if (!isTestingRunning) break;
                    
                    currentUrlIndex = i;
                    currentUrlCount = i;
                    updateProgress();
                    
                    saveToStorage('currentUrlIndex', currentUrlIndex.toString());
                    saveToStorage('serverUrls', document.getElementById('fmt-serverUrls').value);
                    
                    const batch = urls.slice(i, i + testBatchSize);
                    await Promise.all(batch.map(url => testServer(url)));
                    await new Promise(resolve => setTimeout(resolve, 15));
                }
                
                if (isTestingRunning && currentUrlIndex >= urls.length) {
                    isAutoResume = false;
                    currentUrlIndex = 0;
                    currentUrlCount = totalUrlCount;
                    updateProgress();
                    
                    saveToStorage('isAutoResume', 'false');
                    saveToStorage('currentUrlIndex', '0');
                    
                    showNotification('所有URL模型检测完成！');
                }
            } catch (error) {
                console.error('Testing error:', error);
                updateResults(`测试过程中出错: ${error.message}\n`);
            } finally {
                clearInterval(buttonCheckInterval);
                clearInterval(saveInterval);
                if (currentUrlIndex >= urls.length) {
                    isTestingRunning = false;
                }
                checkFloatingButton();
            }
        } catch (error) {
            console.error('Global error:', error);
            updateResults(`全局错误: ${error.message}\n`);
            saveState();
        }
    }
    async function testServer(url) {
        try {
            const tester = new ModelTester(url);
            const models = await tester.getModels();
            updateResults(`\n正在检测 ${url}\n获取到 ${models.length} 个模型\n`);
            
            const priorityModels = models.filter(model => 
                PRIORITY_KEYWORDS.some(keyword => 
                    model.toLowerCase().includes(keyword.toLowerCase())
                )
            ).sort((a, b) => {
                const aIndex = PRIORITY_KEYWORDS.findIndex(keyword => 
                    a.toLowerCase().includes(keyword.toLowerCase())
                );
                const bIndex = PRIORITY_KEYWORDS.findIndex(keyword => 
                    b.toLowerCase().includes(keyword.toLowerCase())
                );
                return aIndex - bIndex;
            });
            const otherModels = models.filter(model => 
                !PRIORITY_KEYWORDS.some(keyword => 
                    model.toLowerCase().includes(keyword.toLowerCase())
                )
            ).sort((a, b) => a.localeCompare(b));
            
            const sortedModels = [...priorityModels, ...otherModels];
            const availableModels = [];
            
            const modelBatchSize = 8; // 模型并发数保持8
            for (let i = 0; i < sortedModels.length; i += modelBatchSize) {
                if (!isTestingRunning) break;
                
                const modelBatch = sortedModels.slice(i, i + modelBatchSize);
                await Promise.all(modelBatch.map(async model => {
                    try {
                        await tester.testModel(model);
                        updateResults(`✓ ${model}\n`);
                        availableModels.push(model);
                        
                        const modelInfo = `${url} - ${model}`;
                        if (!testResults.available.includes(modelInfo)) {
                            testResults.available.push(modelInfo);
                        }
                        if (!testResults.all.includes(modelInfo)) {
                            testResults.all.push(modelInfo);
                        }
                        
                    } catch (error) {
                        updateResults(`✗ ${model} - ${error.message}\n`);
                        
                        const modelInfo = `${url} - ${model} - ${error.message}`;
                        if (!testResults.all.includes(modelInfo)) {
                            testResults.all.push(modelInfo);
                        }
                    }
                }));
                
                saveState();
            }
            
            updateResults(`\n${url}------可用模型:${availableModels.length}/${sortedModels.length}\n${availableModels.join('、')}\n\n`);
            
        } catch (error) {
            updateResults(`✗ ${url} - ${error.message}\n`);
        }
    }
    function init() {
        createUI();
        
        const apiKey = getFromStorage('apiKey', '');
        const serverUrls = getFromStorage('serverUrls', '');
        const results = getFromStorage('results', '点击开始测试按钮开始检测\n');
        const backgroundMode = JSON.parse(getFromStorage('backgroundMode', 'true'));
        
        currentUrlIndex = parseInt(getFromStorage('currentUrlIndex', '0'));
        currentUrlCount = parseInt(getFromStorage('currentUrlCount', '0'));
        totalUrlCount = parseInt(getFromStorage('totalUrlCount', '0'));
        isAutoResume = JSON.parse(getFromStorage('isAutoResume', 'false'));
        
        document.getElementById('fmt-apiKey').value = apiKey;
        document.getElementById('fmt-serverUrls').value = serverUrls;
        document.getElementById('fmt-results').innerHTML = results;
        document.getElementById('fmt-backgroundMode').checked = backgroundMode;
        
        if(totalUrlCount > 0) {
            updateProgress();
        }
        
        const button = document.getElementById('fmt-floatingButton');
        if (button) {
            const initialX = isButtonOnRight ? window.innerWidth - 25 : -25;
            const initialY = window.innerHeight / 2 - 25;
            button.style.left = `${initialX}px`;
            button.style.top = `${initialY}px`;
        }
        
        document.getElementById('fmt-startTest').addEventListener('click', startTesting);
        
        setTimeout(checkAndAutoResume, 1500);
    }
    // 初始化脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();