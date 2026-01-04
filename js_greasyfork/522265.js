// ==UserScript==
// @name         POE2 Trade ST工具箱
// @namespace    http://tampermonkey.net/
// @version      2.3.2
// @description  自动转换简繁中文（页面转简体，输入转繁体）- stomtian
// @author       stomtian
// @match        https://www.pathofexile.com/trade*
// @match        https://pathofexile.com/trade*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.min.js
// @run-at       document-end
// @noframes     true
// @downloadURL https://update.greasyfork.org/scripts/522265/POE2%20Trade%20ST%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/522265/POE2%20Trade%20ST%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==
    
(function() {
    'use strict';
    
    console.log('POE2 Trade ST工具箱已加载');
    
    const STATE = {
        pageSimplified: GM_getValue('pageSimplified', true),
        inputTraditional: GM_getValue('inputTraditional', true),
        originalTexts: new WeakMap(),
        configs: GM_getValue('savedConfigs', {}),  // 保存的配置
        autoLoadEnabled: GM_getValue('autoLoadEnabled', false),  // 自动加载开关
        matchedCards: [], // 添加匹配的卡片列表
        currentMatchIndex: -1, // 添加当前匹配索引
        showOnlyMatched: GM_getValue('showOnlyMatched', false), // 添加新的状态
        searchPresets: GM_getValue('searchPresets', {}) // 添加预设关键词存储
    };
    
    const CUSTOM_DICT = [
        ['回覆', '回復'],
        ['恢覆', '恢復'],
    ];
    
    const CONFIG = {
        maxAttempts: 50,
        checkInterval: 100,
        inputSelector: 'input[type="text"]:not(#config-name):not(#config-category), textarea',
        textSelector: '.search-bar, .search-advanced-pane, .results-container, .resultset',
        excludeSelector: 'script, style, input, textarea, select, .converter-controls'
    };
    
    function waitForElement(selector) {
        /**
         * 等待指定选择器的元素出现在页面上
         * @param {string} selector - CSS选择器
         * @returns {Promise} - 当元素出现时解析的Promise
         */
        return new Promise(resolve => {
            // 如果元素已经存在，立即解析
            if (document.querySelector(selector)) {
                resolve();
                return;
            }
    
            // 创建观察器监听DOM变化
            const observer = new MutationObserver(() => {
                try {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve();
                    }
                } catch (error) {
                    console.debug('等待元素时出错:', error);
                }
            });
    
            // 开始观察DOM变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
    function waitForOpenCC() {
        /**
         * 等待OpenCC库加载完成
         * @returns {Promise} - 当OpenCC可用时解析的Promise
         */
        return new Promise((resolve, reject) => {
            // 如果OpenCC已经加载，立即解析
            if (typeof window.OpenCC !== 'undefined') {
                resolve(window.OpenCC);
                return;
            }
    
            let attempts = 0;
            const maxAttempts = CONFIG.maxAttempts;
            const checkInterval = CONFIG.checkInterval;

            // 定期检查OpenCC是否已加载
            const checkOpenCC = setInterval(() => {
                attempts++;

                if (typeof window.OpenCC !== 'undefined') {
                    clearInterval(checkOpenCC);
                    resolve(window.OpenCC);
                    return;
                }
    
                // 超过最大尝试次数后放弃
                if (attempts >= maxAttempts) {
                    clearInterval(checkOpenCC);
                    reject(new Error('加载OpenCC超时'));
                }
            }, checkInterval);
        });
    }
    
    function createConverters(OpenCC) {
        /**
         * 创建简繁转换器
         * @param {Object} OpenCC - OpenCC库对象
         * @returns {Object} - 包含简体到繁体和繁体到简体的转换器
         */
        try {
            // 创建简体到繁体的转换器（输入转换用）
        const toTraditional = OpenCC.ConverterFactory(
            OpenCC.Locale.from.cn,
            OpenCC.Locale.to.tw.concat([CUSTOM_DICT])
        );
    
            // 创建繁体到简体的转换器（页面转换用）
        const toSimplified = OpenCC.ConverterFactory(
            OpenCC.Locale.from.tw,
            OpenCC.Locale.to.cn
        );
    
        return { toTraditional, toSimplified };
        } catch (error) {
            console.error('创建转换器时出错:', error);
            // 返回空转换器，避免脚本崩溃
            return {
                toTraditional: text => text,
                toSimplified: text => text
            };
        }
    }
    
    function createInputHandler(converter) {
        /**
         * 创建输入处理函数，用于将输入文本转换为繁体中文
         * @param {Object} converter - 文本转换器对象
         * @returns {Function} - 处理输入事件的函数
         */
        return function handleInput(e) {
            try {
                // 检查是否需要进行转换
                if (!e?.target || !STATE.inputTraditional) return;

            // 如果输入框标记了不需要转换，则直接返回
                if (e.target.dataset?.noConvert === 'true') return;

                // 检查输入值是否存在
                const text = e.target.value;
                if (!text) return;
    
                // 保存当前光标位置
            const cursorPosition = e.target.selectionStart;
    
                // 使用requestAnimationFrame优化性能
            requestAnimationFrame(() => {
                try {
                        // 转换文本
                    const convertedText = converter.toTraditional(text);

                        // 如果转换前后文本相同，则不需要更新
                    if (text === convertedText) return;
    
                        // 更新输入框的值
                    e.target.value = convertedText;
    
                        // 恢复光标位置
                    if (typeof cursorPosition === 'number') {
                        e.target.setSelectionRange(cursorPosition, cursorPosition);
                    }
    
                        // 触发输入事件，确保其他监听器能够接收到更新
                    e.target.dispatchEvent(new Event('input', {
                        bubbles: true,
                        cancelable: true
                    }));
                    } catch (error) {
                        console.debug('转换输入文本时出错:', error);
                    }
            });
            } catch (error) {
                console.debug('处理输入事件时出错:', error);
            }
        };
    }
    
    function convertPageText(converter, forceRestore = false) {
        /**
         * 转换页面上的文本内容（简繁转换）
         * @param {Object} converter - 文本转换器对象
         * @param {boolean} forceRestore - 是否强制恢复原始文本
         */
        // 如果不需要简体化且不是强制恢复，则直接返回
        if (!STATE.pageSimplified && !forceRestore) return;
    
        try {
            // 查找需要处理的元素
            const elements = document.querySelectorAll(CONFIG.textSelector);
            if (!elements.length) return;
    
            // 处理每个根元素
            elements.forEach(root => {
                try {
                    // 创建TreeWalker遍历文本节点
                    const walker = document.createTreeWalker(
                        root,
                        NodeFilter.SHOW_TEXT,
                        {
                            acceptNode: function(node) {
                                // 过滤空文本节点
                                    if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
    
                                // 检查父节点
                                    const parent = node.parentNode;
                                    if (!parent) return NodeFilter.FILTER_REJECT;
    
                                // 排除特定元素内的文本
                                    if (parent.closest?.(CONFIG.excludeSelector)) {
                                        return NodeFilter.FILTER_REJECT;
                                    }
    
                                    return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                    );
    
                    // 遍历并处理每个文本节点
                    let node;
                    while (node = walker.nextNode()) {
                            const text = node.textContent.trim();
                            if (!text) continue;
    
                        // 保存原始文本（如果尚未保存）
                            if (!STATE.originalTexts.has(node)) {
                                STATE.originalTexts.set(node, text);
                            }
    
                        // 根据当前状态进行转换或恢复
                            if (STATE.pageSimplified) {
                                const convertedText = converter.toSimplified(text);
                                if (text !== convertedText) {
                                    node.textContent = convertedText;
                                }
                            } else {
                                const originalText = STATE.originalTexts.get(node);
                                if (originalText && node.textContent !== originalText) {
                                    node.textContent = originalText;
                                }
                            }
                    }
                } catch (error) {
                    console.debug('处理文本节点时出错:', error);
                }
            });
        } catch (error) {
            console.debug('转换页面文本时出错:', error);
        }
    }
    
    function attachInputListener(handleInput) {
        /**
         * 为页面上的输入元素添加转换事件监听器
         * @param {Function} handleInput - 输入处理函数
         */
        try {
            const inputElements = document.querySelectorAll(CONFIG.inputSelector);
            if (!inputElements.length) return;
    
            inputElements.forEach(element => {
                try {
                    // 排除已处理的元素和搜索框
                    if (element?.dataset?.hasConverter || element?.dataset?.isSearchInput) {
                        return;
                    }

                    // 添加输入事件监听器
                    element.addEventListener('input', handleInput);

                    // 标记元素已添加转换器
                    element.dataset.hasConverter = 'true';
                } catch (error) {
                    console.debug('为输入元素添加事件监听器时出错:', error);
                }
            });
        } catch (error) {
            console.debug('查找输入元素时出错:', error);
        }
    }
    
    function createObserver(handleInput, converter) {
        /**
         * 创建DOM变化观察器，监听页面变化并处理新添加的元素
         * @param {Function} handleInput - 输入处理函数
         * @param {Object} converter - 文本转换器对象
         * @returns {MutationObserver} - 配置好的观察器实例
         */
        return new MutationObserver(mutations => {
                let needsTextConversion = false;
    
                for (const mutation of mutations) {
                // 跳过没有新增节点的变化
                    if (!mutation.addedNodes.length) continue;
    
                // 检查是否有新的输入元素
                const hasNewInputs = Array.from(mutation.addedNodes)
                    .some(node => {
                        try {
                            // 检查节点是否包含输入元素
                            return node.nodeType === Node.ELEMENT_NODE &&
                                   node.querySelectorAll?.(CONFIG.inputSelector)?.length > 0;
                            } catch (error) {
                            console.debug('检查新节点时出错:', error);
                                return false;
                            }
                        });
    
                // 如果有新的输入元素，为它们添加事件监听器
                        if (hasNewInputs) {
                            attachInputListener(handleInput);
                        }
    
                // 标记需要进行文本转换
                        needsTextConversion = true;
                }
    
            // 如果需要文本转换，延迟执行以确保DOM已完全更新
                if (needsTextConversion) {
                    setTimeout(() => convertPageText(converter), 100);
                }
        });
    }
    
    function createConfigModal() {
        const modalHtml = `
            <div id="config-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: #1a1a1a; padding: 20px; border-radius: 8px; z-index: 10000; min-width: 600px; color: #fff;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <h3 style="margin: 0;">ST工具箱</h3>
                    <button id="close-config-modal" style="background: none; border: none; color: #fff; cursor: pointer;">✕</button>
                </div>
    
                <!-- 标签栏 -->
                <div style="display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <button id="tab-configs" class="modal-tab active" style="padding: 8px 20px; background: #4a90e2; border: none; color: #fff; cursor: pointer; border-radius: 4px; transition: all 0.2s;">配置管理</button>
                    <button id="tab-presets" class="modal-tab" style="padding: 8px 20px; background: #3d3d3d; border: none; color: #fff; cursor: pointer; border-radius: 4px; transition: all 0.2s;">预设关键词</button>
                    <button id="tab-settings" class="modal-tab" style="padding: 8px 20px; background: #3d3d3d; border: none; color: #fff; cursor: pointer; border-radius: 4px; transition: all 0.2s;">设置</button>
                    <button id="tab-contact" class="modal-tab" style="padding: 8px 20px; background: #3d3d3d; border: none; color: #fff; cursor: pointer; border-radius: 4px; transition: all 0.2s;">联系我</button>
                </div>
    
                <!-- 配置管理面板 -->
                <div id="panel-configs" class="panel" style="display: block;">
                    <div style="padding: 15px; background: #2d2d2d; border-radius: 4px;">
                        <div style="margin-bottom: 15px;">
                            <input type="text" id="config-name" placeholder="配置名称"
                                style="padding: 5px; margin-right: 10px; background: #3d3d3d; border: 1px solid #444; color: #fff; width: 200px;">
                            <div class="custom-select" style="display: inline-block; position: relative; width: 150px; margin-right: 10px;">
                                <input type="text" id="config-category" placeholder="选择或输入分类"
                                    style="padding: 5px; background: #3d3d3d; border: 1px solid #444; color: #fff; width: 100%; cursor: pointer;">
                                <div id="category-dropdown" style="display: none; position: absolute; top: 100%; left: 0; width: 100%;
                                    background: #3d3d3d; border: 1px solid #444; border-top: none; max-height: 200px; overflow-y: auto; z-index: 1000;">
                                </div>
                            </div>
                            <button id="save-config" style="padding: 5px 10px; background: #4a90e2; border: none; color: #fff; cursor: pointer; border-radius: 3px;">
                                保存当前配置
                            </button>
                        </div>
                        <div id="category-tabs" style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;"></div>
                        <div id="config-list" style="max-height: 300px; overflow-y: auto;">
                        </div>
                    </div>
                </div>
    
                <!-- 设置面板 -->
                <div id="panel-settings" class="panel" style="display: none;">
                    <div style="padding: 15px; background: #2d2d2d; border-radius: 4px;">
                        <!-- 功能开关 -->
                        <div style="margin-bottom: 20px;">
                            <div style="font-weight: bold; margin-bottom: 10px; color: #4a90e2;">功能开关</div>
                            <div style="display: flex; gap: 10px;">
                                <button id="toggle-page-simplified" style="flex: 1; padding: 8px 15px; background: ${STATE.pageSimplified ? '#4a90e2' : '#3d3d3d'}; border: none; color: #fff; cursor: pointer; border-radius: 3px; transition: background-color 0.2s; text-align: center;">
                                    ${STATE.pageSimplified ? '✓ 页面简体' : '✗ 页面简体'}
                                </button>
                                <button id="toggle-input-traditional" style="flex: 1; padding: 8px 15px; background: ${STATE.inputTraditional ? '#4a90e2' : '#3d3d3d'}; border: none; color: #fff; cursor: pointer; border-radius: 3px; transition: background-color 0.2s; text-align: center;">
                                    ${STATE.inputTraditional ? '✓ 输入繁体' : '✗ 输入繁体'}
                                </button>
                                <button id="toggle-auto-load" style="flex: 1; padding: 8px 15px; background: ${STATE.autoLoadEnabled ? '#4a90e2' : '#3d3d3d'}; border: none; color: #fff; cursor: pointer; border-radius: 3px; transition: background-color 0.2s; text-align: center;">
                                    ${STATE.autoLoadEnabled ? '✓ 自动加载' : '✗ 自动加载'}
                                </button>
                            </div>
                        </div>
    
                        <!-- 配置导入导出 -->
                        <div style="margin-top: 20px;">
                            <div style="font-weight: bold; margin-bottom: 10px; color: #4a90e2;">配置导入导出</div>
                            <div style="display: flex; gap: 10px;">
                                <button id="export-configs" style="flex: 1; padding: 8px 15px; background: #27ae60; border: none; color: #fff; cursor: pointer; border-radius: 3px;">导出配置</button>
                                <button id="import-configs" style="flex: 1; padding: 8px 15px; background: #e67e22; border: none; color: #fff; cursor: pointer; border-radius: 3px;">导入配置</button>
                                <input type="file" id="import-file" accept=".json" style="display: none;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 预设关键词面板 -->
                <div id="panel-presets" class="panel" style="display: none;">
                    <div style="padding: 15px; background: #2d2d2d; border-radius: 4px;">
                        <div style="margin-bottom: 15px; display: flex; justify-content: flex-end;">
                            <button id="add-preset" style="padding: 8px 20px; background: #4a90e2; border: none; color: #fff; cursor: pointer; border-radius: 4px; transition: all 0.2s;">
                                添加预设
                            </button>
                        </div>
                        <div id="preset-list" style="max-height: 400px; overflow-y: auto;">
                        </div>
                    </div>
                </div>
                <!-- 联系我面板 -->
                <div id="panel-contact" class="panel" style="display: none;">
                    <div style="padding: 15px; background: #2d2d2d; border-radius: 4px;">
                        <div style="text-align: center; padding: 20px;">
                            <div style="font-size: 18px; color: #4a90e2; margin-bottom: 15px;">欢迎加入POE2 ST工具箱交流群</div>
                            <div style="font-size: 24px; color: #FFD700; margin-bottom: 15px;">QQ群：858024457</div>
                            <div style="color: #999; font-size: 14px;">
                                欢迎各位流亡者加入交流群，反馈使用问题，提出建议！
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 预设编辑弹窗 -->
            <div id="preset-edit-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: #1a1a1a; padding: 20px; border-radius: 8px; z-index: 10002; width: 800px; color: #fff; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <h3 style="margin: 0;" id="preset-edit-title">添加预设</h3>
                    <button id="close-preset-edit" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 20px;">✕</button>
                </div>
                <div style="margin-bottom: 15px;">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">预设名称</label>
                        <input type="text" id="preset-name" style="width: 100%; padding: 8px; background: #2d2d2d; border: 1px solid #444; color: #fff; border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px;">关键词（用;分隔）</label>
                        <textarea id="preset-keywords" style="width: 100%; height: 200px; padding: 8px; background: #2d2d2d; border: 1px solid #444; color: #fff; border-radius: 4px; resize: vertical; font-family: monospace;"></textarea>
                    </div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="cancel-preset-edit" style="padding: 8px 20px; background: #3d3d3d; border: none; color: #fff; cursor: pointer; border-radius: 4px;">
                        取消
                    </button>
                    <button id="save-preset" style="padding: 8px 20px; background: #4a90e2; border: none; color: #fff; cursor: pointer; border-radius: 4px;">
                        保存
                    </button>
                </div>
            </div>

            <!-- 添加遮罩层 -->
            <div id="preset-edit-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 10001;"></div>
        </div>
    `;
    
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    
        // 添加遮罩
        const overlay = document.createElement('div');
        overlay.id = 'config-modal-overlay';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;
        document.body.appendChild(overlay);
    
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .modal-tab.active {
                background: #4a90e2 !important;
            }
            .modal-tab:hover {
                background: #357abd !important;
            }
            .panel {
                transition: opacity 0.3s ease;
            }
            #config-list::-webkit-scrollbar {
                width: 8px;
            }
            #config-list::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            #config-list::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 4px;
            }
            #config-list::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(style);
    
        setupConfigModalEvents();
        updateConfigList();
        setupCategoryDropdown();
    }
    
    function setupCategoryDropdown() {
        const categoryInput = document.getElementById('config-category');
        const dropdown = document.getElementById('category-dropdown');
        let isDropdownVisible = false;
    
        function updateDropdown() {
            const categories = Object.keys(STATE.configs);
            const inputValue = categoryInput.value.toLowerCase();
    
            dropdown.innerHTML = '';
    
            categories
                .filter(category => category.toLowerCase().includes(inputValue))
                .forEach(category => {
                    const item = document.createElement('div');
                    item.className = 'dropdown-item';
                    item.textContent = category;
                    item.onclick = () => {
                        categoryInput.value = category;
                        hideDropdown();
                    };
                    dropdown.appendChild(item);
                });
    
            if (categories.length === 0) {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.textContent = '无已有分类';
                item.style.color = '#666';
                dropdown.appendChild(item);
            }
        }
    
        function showDropdown() {
            updateDropdown();
            dropdown.style.display = 'block';
            isDropdownVisible = true;
        }
    
        function hideDropdown() {
            dropdown.style.display = 'none';
            isDropdownVisible = false;
        }
    
        categoryInput.addEventListener('focus', showDropdown);
        categoryInput.addEventListener('input', updateDropdown);
    
        // 点击外部区域时隐藏下拉列表
        document.addEventListener('click', (e) => {
            const isClickInside = categoryInput.contains(e.target) || dropdown.contains(e.target);
            if (!isClickInside && isDropdownVisible) {
                hideDropdown();
            }
        });
    
        // 阻止事件冒泡，避免点击下拉列表时触发外部点击事件
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    function setupConfigModalEvents() {
        const modal = document.getElementById('config-modal');
        const overlay = document.getElementById('config-modal-overlay');
        const closeBtn = document.getElementById('close-config-modal');
        const saveBtn = document.getElementById('save-config');
        const togglePageBtn = document.getElementById('toggle-page-simplified');
        const toggleInputBtn = document.getElementById('toggle-input-traditional');
        const toggleAutoLoadBtn = document.getElementById('toggle-auto-load');
        const exportBtn = document.getElementById('export-configs');
        const importBtn = document.getElementById('import-configs');
        const importFile = document.getElementById('import-file');
        const tabConfigs = document.getElementById('tab-configs');
        const tabSettings = document.getElementById('tab-settings');
        const tabPresets = document.getElementById('tab-presets'); 
        const tabContact = document.getElementById('tab-contact');
        const panelConfigs = document.getElementById('panel-configs');
        const panelSettings = document.getElementById('panel-settings');
        const panelPresets = document.getElementById('panel-presets');
        const panelContact = document.getElementById('panel-contact');
        const savePresetBtn = document.getElementById('save-preset');

        const addPresetBtn = document.getElementById('add-preset');
        const presetEditModal = document.getElementById('preset-edit-modal');
        const presetEditOverlay = document.getElementById('preset-edit-overlay');
        const closePresetEdit = document.getElementById('close-preset-edit');
        const cancelPresetEdit = document.getElementById('cancel-preset-edit');
        const presetEditTitle = document.getElementById('preset-edit-title');

        // 标签切换函数
        function switchTab(activeTab) {
            // 重置所有标签和面板
            [tabConfigs, tabSettings, tabPresets, tabContact].forEach(tab => {
                tab.classList.remove('active');
                tab.style.background = '#3d3d3d';
            });
            [panelConfigs, panelSettings, panelPresets, panelContact].forEach(panel => {
                panel.style.display = 'none';
            });

            // 激活选中的标签和面板
            activeTab.classList.add('active');
            activeTab.style.background = '#4a90e2';
            
            // 显示对应的面板
            if (activeTab === tabConfigs) {
                panelConfigs.style.display = 'block';
            } else if (activeTab === tabSettings) {
                panelSettings.style.display = 'block';
            } else if (activeTab === tabPresets) {
                panelPresets.style.display = 'block';
                updatePresetList();
            } else if (activeTab === tabContact) {
                panelContact.style.display = 'block';
            }
        }

        // 标签切换事件
        tabConfigs.addEventListener('click', () => switchTab(tabConfigs));
        tabSettings.addEventListener('click', () => switchTab(tabSettings));
        tabPresets.addEventListener('click', () => switchTab(tabPresets));
        tabContact.addEventListener('click', () => switchTab(tabContact));
        
        // 初始化显示配置管理标签
        switchTab(tabConfigs);

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        });
    
        overlay.addEventListener('click', () => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        });
    
        togglePageBtn.addEventListener('click', () => {
            STATE.pageSimplified = !STATE.pageSimplified;
            GM_setValue('pageSimplified', STATE.pageSimplified);
            togglePageBtn.textContent = STATE.pageSimplified ? '✓ 页面简体' : '✗ 页面简体';
            togglePageBtn.style.backgroundColor = STATE.pageSimplified ? '#4a90e2' : '#3d3d3d';
            convertPageText(window.converter, true);
        });
    
        toggleInputBtn.addEventListener('click', () => {
            STATE.inputTraditional = !STATE.inputTraditional;
            GM_setValue('inputTraditional', STATE.inputTraditional);
            toggleInputBtn.textContent = STATE.inputTraditional ? '✓ 输入繁体' : '✗ 输入繁体';
            toggleInputBtn.style.backgroundColor = STATE.inputTraditional ? '#4a90e2' : '#3d3d3d';
        });
    
        toggleAutoLoadBtn.addEventListener('click', () => {
            STATE.autoLoadEnabled = !STATE.autoLoadEnabled;
            GM_setValue('autoLoadEnabled', STATE.autoLoadEnabled);
            toggleAutoLoadBtn.textContent = STATE.autoLoadEnabled ? '✓ 自动加载' : '✗ 自动加载';
            toggleAutoLoadBtn.style.backgroundColor = STATE.autoLoadEnabled ? '#4a90e2' : '#3d3d3d';
        });
    
        saveBtn.addEventListener('click', saveCurrentConfig);
    
        // 修改导出配置
        exportBtn.addEventListener('click', () => {
            const configData = {
                version: '2.0.0',
                configs: {},
                searchPresets: STATE.searchPresets
            };

            // 复制配置，但不包含 timestamp
            Object.keys(STATE.configs).forEach(category => {
                configData.configs[category] = {};
                Object.keys(STATE.configs[category]).forEach(name => {
                    configData.configs[category][name] = {
                        url: STATE.configs[category][name].url
                    };
                });
            });
            
            const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `poe2_trade_configs_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    
        // 导入配置按钮点击
        importBtn.addEventListener('click', () => {
            importFile.click();
        });
    
        // 处理文件导入
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
    
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    // 验证导入的数据
                    if (!importedData.version || (!importedData.configs && !importedData.searchPresets)) {
                        throw new Error('无效的配置文件格式');
                    }
    
                    // 确认导入
                    if (confirm(`确定要导入这些配置吗？\n这将会覆盖同名的现有配置和预设关键词。`)) {
                        // 合并配置
                        if (importedData.configs) {
                            Object.keys(importedData.configs).forEach(category => {
                                if (!STATE.configs[category]) {
                                    STATE.configs[category] = {};
                                }
                                Object.assign(STATE.configs[category], importedData.configs[category]);
                            });
                            GM_setValue('savedConfigs', STATE.configs);
                            updateConfigList();
                        }

                        // 合并预设关键词
                        if (importedData.searchPresets) {
                            Object.assign(STATE.searchPresets, importedData.searchPresets);
                            GM_setValue('searchPresets', STATE.searchPresets);
                            updatePresetList();
                        }

                        alert('配置导入成功！');
                    }
                } catch (error) {
                    alert('导入失败：' + error.message);
                }
                
                // 清除文件选择，允许重复导入同一个文件
                importFile.value = '';
            };
            reader.readAsText(file);
        });
    
        // 添加预设标签切换事件
        tabPresets.addEventListener('click', () => {
            tabPresets.classList.add('active');
            tabConfigs.classList.remove('active');
            tabSettings.classList.remove('active');
            tabConfigs.style.background = '#3d3d3d';
            tabSettings.style.background = '#3d3d3d';
            panelConfigs.style.display = 'none';
            panelSettings.style.display = 'none';
            panelPresets.style.display = 'block';
            updatePresetList();
        });
    
        // 添加保存预设事件
        savePresetBtn.addEventListener('click', saveSearchPreset);

        function closePresetEditModal() {
            presetEditModal.style.display = 'none';
            presetEditOverlay.style.display = 'none';
        }

        // 打开预设编辑弹窗
        addPresetBtn.addEventListener('click', () => {
            presetEditModal.style.display = 'block';
            presetEditOverlay.style.display = 'block';
            presetEditTitle.textContent = '添加预设';
            document.getElementById('preset-name').value = '';
            document.getElementById('preset-keywords').value = '';
            document.getElementById('preset-name').dataset.editMode = 'false';
        });

        // 关闭预设编辑弹窗
        [closePresetEdit, cancelPresetEdit, presetEditOverlay].forEach(btn => {
            btn.addEventListener('click', closePresetEditModal);
        });

        // 添加预设名称和关键词输入框的事件处理
        const presetNameInput = document.getElementById('preset-name');
        const presetKeywordsInput = document.getElementById('preset-keywords');

        // 标记这些输入框不需要转换
        presetNameInput.dataset.noConvert = 'true';
        presetKeywordsInput.dataset.noConvert = 'true';

        // 移除原有的输入转换处理
        [presetNameInput, presetKeywordsInput].forEach(input => {
            const oldInput = input.cloneNode(true);
            input.parentNode.replaceChild(oldInput, input);
        });
    }
    
    // 修改 saveCurrentConfig 函数
    function saveCurrentConfig() {
        const name = document.getElementById('config-name').value.trim();
        const category = document.getElementById('config-category').value.trim();

        if (!name) {
            alert('请输入配置名称');
            return;
        }

        if (!category) {
            alert('请输入分类名称');
            return;
        }

        if (!STATE.configs[category]) {
            STATE.configs[category] = {};
        }

        STATE.configs[category][name] = {
            url: window.location.href
        };

        GM_setValue('savedConfigs', STATE.configs);
        updateConfigList();

        document.getElementById('config-name').value = '';
        document.getElementById('config-category').value = '';
    }
    
    function updateConfigList() {
        const configList = document.getElementById('config-list');
        const categoryTabs = document.getElementById('category-tabs');
        configList.innerHTML = '';
        categoryTabs.innerHTML = '';
    
        // 获取所有分类
        const categories = Object.keys(STATE.configs);
    
        // 如果没有配置，显示提示信息
        if (categories.length === 0) {
            configList.innerHTML = '<div style="text-align: center; color: #666;">暂无保存的配置</div>';
            return;
        }
    
        // 创建标签
        categories.forEach((category, index) => {
            const tabButton = document.createElement('button');
            tabButton.textContent = category;
            tabButton.style.cssText = `
                background: ${index === 0 ? '#4a90e2' : '#3d3d3d'};
                border: none;
                color: #fff;
                padding: 5px 15px;
                cursor: pointer;
                border-radius: 3px;
                transition: background-color 0.2s;
                margin-right: 10px;
            `;
            tabButton.dataset.category = category;
            tabButton.title = '双击删除分类';
    
            tabButton.addEventListener('click', (e) => {
                document.querySelectorAll('#category-tabs button[data-category]').forEach(btn => {
                    btn.style.backgroundColor = '#3d3d3d';
                });
                tabButton.style.backgroundColor = '#4a90e2';
                showCategoryConfigs(category);
            });
    
            tabButton.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                deleteCategory(category);
            });
    
            categoryTabs.appendChild(tabButton);
        });
    
        // 默认显示第一个分类的配置
        showCategoryConfigs(categories[0]);
    }
    
    function deleteCategory(category) {
        /**
         * 删除指定的配置类别及其所有配置
         * @param {string} category - 要删除的配置类别
         */
        try {
            // 检查类别是否存在
            if (!STATE.configs[category]) {
                console.warn(`类别不存在: ${category}`);
                return;
            }

            // 获取该类别下的配置数量
        const configCount = Object.keys(STATE.configs[category]).length;

            // 确认删除操作
        if (confirm(`确定要删除分类 "${category}" 及其包含的 ${configCount} 个配置吗？`)) {
                // 删除类别
            delete STATE.configs[category];

                // 保存更新后的配置
            GM_setValue('savedConfigs', STATE.configs);

                // 更新配置列表显示
            updateConfigList();

                console.log(`已删除类别: ${category} (包含 ${configCount} 个配置)`);
            }
        } catch (error) {
            console.error('删除类别时出错:', error);
        }
    }
    
    function showCategoryConfigs(category) {
        /**
         * 显示指定类别的所有配置
         * @param {string} category - 配置类别
         */
        try {
            // 获取配置列表容器
        const configList = document.getElementById('config-list');
            if (!configList) {
                console.warn('无法找到配置列表容器');
                return;
            }

            // 清空当前列表
        configList.innerHTML = '';

            // 获取指定类别的配置
        const configs = STATE.configs[category];
            if (!configs || Object.keys(configs).length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.textContent = '该分类下没有配置';
                emptyMessage.style.padding = '10px';
                emptyMessage.style.color = '#999';
                configList.appendChild(emptyMessage);
                return;
            }

            // 遍历并显示每个配置
        Object.entries(configs).forEach(([name, data]) => {
                // 创建配置项容器
            const configItem = document.createElement('div');
            configItem.style.cssText = `
                display: grid;
                grid-template-columns: 1fr auto auto auto;
                align-items: center;
                padding: 8px;
                margin: 5px 0;
                background: #3d3d3d;
                border-radius: 4px;
                gap: 10px;
            `;
    
                // 创建配置名称元素
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.style.cssText = `
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
    
                // 创建读取按钮
            const loadBtn = document.createElement('button');
            loadBtn.textContent = '读取';
            loadBtn.style.cssText = `
                background: #4a90e2;
                border: none;
                color: #fff;
                padding: 3px 12px;
                cursor: pointer;
                border-radius: 3px;
                transition: background-color 0.2s;
            `;
                loadBtn.onclick = () => {
                    loadConfig(data.url);
                };
    
                // 创建更新按钮
            const updateBtn = document.createElement('button');
            updateBtn.textContent = '更新';
            updateBtn.style.cssText = `
                background: #27ae60;
                border: none;
                color: #fff;
                padding: 3px 12px;
                cursor: pointer;
                border-radius: 3px;
                transition: background-color 0.2s;
            `;
            updateBtn.onclick = (e) => {
                e.stopPropagation();
                updateConfig(category, name);
            };
    
                // 创建删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.cssText = `
                background: #e74c3c;
                border: none;
                color: #fff;
                padding: 3px 12px;
                cursor: pointer;
                border-radius: 3px;
                transition: background-color 0.2s;
            `;
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteConfig(category, name);
            };
    
                // 添加所有元素到配置项
            configItem.appendChild(nameSpan);
            configItem.appendChild(loadBtn);
            configItem.appendChild(updateBtn);
            configItem.appendChild(deleteBtn);

                // 添加配置项到列表
            configList.appendChild(configItem);
        });
        } catch (error) {
            console.error('显示配置列表时出错:', error);
        }
    }
    
    function loadConfig(url) {
        /**
         * 加载指定URL的配置
         * @param {string} url - 要加载的配置URL
         */
        try {
            if (!url) {
                console.warn('加载配置失败: URL为空');
                return;
            }

            // 导航到指定URL
        window.location.href = url;
            console.log('正在加载配置:', url);
        } catch (error) {
            console.error('加载配置时出错:', error);
        }
    }
    
    function deleteConfig(category, name) {
        /**
         * 删除指定类别和名称的配置
         * @param {string} category - 配置类别
         * @param {string} name - 配置名称
         */
        try {
            // 确认删除操作
        if (confirm(`确定要删除配置 "${name}" 吗？`)) {
                // 删除指定配置
                if (STATE.configs[category] && STATE.configs[category][name]) {
            delete STATE.configs[category][name];

                    // 如果类别下没有配置了，删除整个类别
            if (Object.keys(STATE.configs[category]).length === 0) {
                delete STATE.configs[category];
            }

                    // 保存更新后的配置
            GM_setValue('savedConfigs', STATE.configs);

                    // 更新配置列表显示
            updateConfigList();

                    console.log(`已删除配置: ${category}/${name}`);
                } else {
                    console.warn(`配置不存在: ${category}/${name}`);
                }
            }
        } catch (error) {
            console.error('删除配置时出错:', error);
        }
    }
    
    function createConfigButton() {
        const floatingButton = document.createElement('div');
        floatingButton.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #3c3c28 0%, #2a2a1c 100%);
            border-radius: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #ffd700;
            font-weight: bold;
            font-family: 'Fontin SmallCaps', Arial, sans-serif;
            font-size: 18px;
            box-shadow: 0 0 20px rgba(0,0,0,0.5),
                        inset 0 0 8px rgba(255, 215, 0, 0.3),
                        0 0 30px rgba(255, 215, 0, 0.2);
            border: 1px solid rgba(255, 215, 0, 0.4);
            z-index: 9998;
            transition: all 0.3s ease;
            user-select: none;
            touch-action: none;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
            animation: normalGlowing 2s ease-in-out infinite;
        `;
        floatingButton.textContent = 'ST';
        floatingButton.title = 'ST工具箱 (按住可拖动)';
    
        // 添加悬停效果
        floatingButton.addEventListener('mouseenter', () => {
            if (!isDragging) {
                floatingButton.style.transform = 'scale(1.1)';
                floatingButton.style.boxShadow = `
                    0 0 25px rgba(0,0,0,0.5),
                    inset 0 0 12px rgba(255, 215, 0, 0.5),
                    0 0 40px rgba(255, 215, 0, 0.3)
                `;
                floatingButton.style.color = '#ffe44d';
                floatingButton.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
                floatingButton.style.border = '1px solid rgba(255, 215, 0, 0.6)';
                floatingButton.style.animation = 'none';
    
                if (isHidden) {
                    showButton();
                }
            }
        });
    
        floatingButton.addEventListener('mouseleave', () => {
            if (!isDragging) {
                floatingButton.style.transform = 'scale(1)';
                floatingButton.style.boxShadow = `
                    0 0 20px rgba(0,0,0,0.5),
                    inset 0 0 8px rgba(255, 215, 0, 0.3),
                    0 0 30px rgba(255, 215, 0, 0.2)
                `;
                floatingButton.style.color = '#ffd700';
                floatingButton.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.6)';
                floatingButton.style.border = '1px solid rgba(255, 215, 0, 0.4)';
                floatingButton.style.animation = 'normalGlowing 2s ease-in-out infinite';
    
                checkAndHideButton();
            }
        });
    
        // 添加拖拽功能
        let isDragging = false;
        let startX, startY;
        let lastX = GM_getValue('floatingButtonX', window.innerWidth - 70);
        let lastY = GM_getValue('floatingButtonY', window.innerHeight / 2);
        let dragDistance = 0;
        let mouseDownTime = 0;
        let isHidden = false;
    
        function dragStart(e) {
            isDragging = true;
            dragDistance = 0;
            mouseDownTime = Date.now();
            const rect = floatingButton.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            floatingButton.style.transition = 'none';
            floatingButton.style.transform = 'scale(1)';
        }
    
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
    
            const x = e.clientX - startX;
            const y = e.clientY - startY;
    
            // 计算拖动距离
            const dx = x - lastX;
            const dy = y - lastY;
            dragDistance += Math.sqrt(dx * dx + dy * dy);
    
            // 限制拖动范围，添加边距防止完全贴边
            const margin = 20; // 边距
            const maxX = window.innerWidth - floatingButton.offsetWidth - margin;
            const maxY = window.innerHeight - floatingButton.offsetHeight - margin;
            const minX = margin;
            const minY = margin;
    
            lastX = Math.max(minX, Math.min(x, maxX));
            lastY = Math.max(minY, Math.min(y, maxY));
    
            floatingButton.style.left = lastX + 'px';
            floatingButton.style.top = lastY + 'px';
            floatingButton.style.right = 'auto';
        }
    
        function dragEnd(e) {
            if (!isDragging) return;
    
            const dragDuration = Date.now() - mouseDownTime;
            isDragging = false;
            floatingButton.style.transition = 'all 0.3s ease';
    
            // 保存位置
            GM_setValue('floatingButtonX', lastX);
            GM_setValue('floatingButtonY', lastY);
    
            // 如果拖动距离小于5像素且时间小于200ms，则认为是点击
            if (dragDistance < 5 && dragDuration < 200) {
                document.getElementById('config-modal').style.display = 'block';
                document.getElementById('config-modal-overlay').style.display = 'block';
            }
        }
    
        function checkAndHideButton() {
            const threshold = 20; // 距离边缘多少像素时触发隐藏
            const buttonWidth = floatingButton.offsetWidth;
            const buttonHeight = floatingButton.offsetHeight;
            const buttonRight = lastX + buttonWidth;
            const buttonBottom = lastY + buttonHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
    
            // 检查各个边缘
            if (buttonRight > windowWidth - threshold) {
                // 右边缘
                hideButton('right');
            } else if (lastX < threshold) {
                // 左边缘
                hideButton('left');
            } else if (lastY < threshold) {
                // 上边缘
                hideButton('top');
            } else if (buttonBottom > windowHeight - threshold) {
                // 下边缘
                hideButton('bottom');
            }
        }
    
        function hideButton(direction) {
            isHidden = true;
            floatingButton.style.transition = 'all 0.3s ease';
    
            // 添加金光动画
            floatingButton.style.animation = 'none';
            floatingButton.offsetHeight; // 触发重绘
            floatingButton.style.animation = 'glowing 1.5s ease-in-out infinite';
            floatingButton.style.background = 'linear-gradient(135deg, #5a5a42 0%, #3a3a2c 100%)';
    
            switch (direction) {
                case 'right':
                    floatingButton.style.transform = 'translateY(-50%) translateX(60%)';
                    floatingButton.style.borderRadius = '25px 0 0 25px';
                    break;
                case 'left':
                    floatingButton.style.transform = 'translateY(-50%) translateX(-60%)';
                    floatingButton.style.borderRadius = '0 25px 25px 0';
                    break;
                case 'top':
                    floatingButton.style.transform = 'translateX(-50%) translateY(-60%)';
                    floatingButton.style.borderRadius = '0 0 25px 25px';
                    break;
                case 'bottom':
                    floatingButton.style.transform = 'translateX(-50%) translateY(60%)';
                    floatingButton.style.borderRadius = '25px 25px 0 0';
                    break;
            }
        }
    
        function showButton() {
            isHidden = false;
            floatingButton.style.transition = 'all 0.3s ease';
            floatingButton.style.animation = 'normalGlowing 2s ease-in-out infinite';
            floatingButton.style.background = 'linear-gradient(135deg, #3c3c28 0%, #2a2a1c 100%)';
            floatingButton.style.transform = 'scale(1)';
            floatingButton.style.borderRadius = '25px';
        }
    
        // 添加金光动画样式
        const glowingStyle = document.createElement('style');
        glowingStyle.textContent = `
            @keyframes normalGlowing {
                0% {
                    box-shadow: 0 0 20px rgba(0,0,0,0.5),
                                inset 0 0 8px rgba(255, 215, 0, 0.3),
                                0 0 30px rgba(255, 215, 0, 0.2);
                    border-color: rgba(255, 215, 0, 0.4);
                    color: #ffd700;
                    text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
                }
                50% {
                    box-shadow: 0 0 25px rgba(0,0,0,0.5),
                                inset 0 0 12px rgba(255, 215, 0, 0.4),
                                0 0 40px rgba(255, 215, 0, 0.3),
                                0 0 60px rgba(255, 215, 0, 0.2);
                    border-color: rgba(255, 215, 0, 0.5);
                    color: #ffe44d;
                    text-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
                }
                100% {
                    box-shadow: 0 0 20px rgba(0,0,0,0.5),
                                inset 0 0 8px rgba(255, 215, 0, 0.3),
                                0 0 30px rgba(255, 215, 0, 0.2);
                    border-color: rgba(255, 215, 0, 0.4);
                    color: #ffd700;
                    text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
                }
            }
    
            @keyframes glowing {
                0% {
                    box-shadow: 0 0 20px rgba(0,0,0,0.5),
                                inset 0 0 8px rgba(255, 215, 0, 0.5),
                                0 0 30px rgba(255, 215, 0, 0.4),
                                0 0 50px rgba(255, 215, 0, 0.2);
                    border-color: rgba(255, 215, 0, 0.6);
                    color: #ffd700;
                    text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
                }
                50% {
                    box-shadow: 0 0 30px rgba(0,0,0,0.6),
                                inset 0 0 20px rgba(255, 215, 0, 0.8),
                                0 0 60px rgba(255, 215, 0, 0.6),
                                0 0 100px rgba(255, 215, 0, 0.4),
                                0 0 150px rgba(255, 215, 0, 0.2);
                    border-color: rgba(255, 223, 0, 1);
                    color: #ffe44d;
                    text-shadow: 0 0 25px rgba(255, 215, 0, 1),
                                0 0 35px rgba(255, 215, 0, 0.7),
                                0 0 45px rgba(255, 215, 0, 0.4);
                }
                100% {
                    box-shadow: 0 0 20px rgba(0,0,0,0.5),
                                inset 0 0 8px rgba(255, 215, 0, 0.5),
                                0 0 30px rgba(255, 215, 0, 0.4),
                                0 0 50px rgba(255, 215, 0, 0.2);
                    border-color: rgba(255, 215, 0, 0.6);
                    color: #ffd700;
                    text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
                }
            }
        `;
        document.head.appendChild(glowingStyle);
    
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            if (!isDragging) {
                const margin = 20;
                const maxX = window.innerWidth - floatingButton.offsetWidth - margin;
                const maxY = window.innerHeight - floatingButton.offsetHeight - margin;
                const minX = margin;
                const minY = margin;
    
                lastX = Math.max(minX, Math.min(lastX, maxX));
                lastY = Math.max(minY, Math.min(lastY, maxY));
    
                floatingButton.style.left = lastX + 'px';
                floatingButton.style.top = lastY + 'px';
            }
        });
    
        floatingButton.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
    
        // 恢复上次保存的位置或使用默认位置
        const margin = 20;
        const maxX = window.innerWidth - 70 - margin;
        const maxY = window.innerHeight / 2;
        const minX = margin;
        const minY = margin;
    
        lastX = Math.max(minX, Math.min(GM_getValue('floatingButtonX', maxX), maxX));
        lastY = Math.max(minY, Math.min(GM_getValue('floatingButtonY', maxY), maxY));
    
        floatingButton.style.right = 'auto';
        floatingButton.style.top = lastY + 'px';
        floatingButton.style.left = lastX + 'px';
        floatingButton.style.transform = 'scale(1)';
        floatingButton.style.transform = 'scale(1)';
    
        return floatingButton;
    }
    
    function createControls() {
        const floatingButton = createConfigButton();
        document.body.appendChild(floatingButton);

        // 创建搜索框但不立即显示
        createSearchBox();

        // 添加快捷键监听
        document.addEventListener('keydown', (e) => {
            if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault(); // 阻止默认行为
                toggleSearchBox();
            }
        });
    }

    // 切换搜索框显示状态
    function toggleSearchBox() {
        const searchBox = document.querySelector('.search-box-container');
        if (searchBox) {
            searchBox.style.display = searchBox.style.display === 'none' ? 'flex' : 'none';
            if (searchBox.style.display === 'flex') {
                // 当显示搜索框时，自动聚焦到输入框
                const searchInput = searchBox.querySelector('input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }
    }

    // 创建搜索框
    function createSearchBox(handleInput) {
        const searchBoxContainer = document.createElement('div');
        searchBoxContainer.className = 'search-box-container';
        searchBoxContainer.style.cssText = `
            position: fixed;
            top: 10px;
            left: 20px;
            z-index: 9999;
            background: rgba(28, 28, 28, 0.95);
            padding: 15px 10px 10px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            display: none;
            flex-direction: column;
            gap: 8px;
        `;

        const searchRow = document.createElement('div');
        searchRow.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `;

        const navigationRow = document.createElement('div');
        navigationRow.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
        `;

        // 创建搜索输入框
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '输入关键词(用;分隔)';
        searchInput.dataset.isSearchInput = 'true';
        searchInput.style.cssText = `
            width: 250px;
            padding: 5px 10px;
            border: 1px solid #666;
            border-radius: 4px;
            background: #2d2d2d;
            color: #fff;
        `;

        // 添加搜索事件
        searchInput.addEventListener('input', (e) => {
            if (!e?.target?.value) return;

            // 如果页面是繁体模式，则将输入转换为繁体
            if (!STATE.pageSimplified) {
                const cursorPosition = e.target.selectionStart;
                const text = e.target.value;

                requestAnimationFrame(() => {
                    try {
                        const convertedText = window.converter.toTraditional(text);
                        if (text === convertedText) return;

                        e.target.value = convertedText;

                        if (typeof cursorPosition === 'number') {
                            e.target.setSelectionRange(cursorPosition, cursorPosition);
                        }
                    } catch (error) {}
                });
            }
        });

        const searchButton = document.createElement('button');
        searchButton.textContent = '搜索';
        searchButton.style.cssText = `
            padding: 5px 15px;
            background: #4a90e2;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
        `;

        // 添加预设下拉框
        const presetSelectContainer = document.createElement('div');
        presetSelectContainer.style.cssText = `
            position: relative;
            width: 120px;
        `;

        const presetInput = document.createElement('input');
        presetInput.readOnly = true;
        presetInput.placeholder = '选择预设';
        presetInput.style.cssText = `
            width: 100%;
            padding: 5px;
            background: #2d2d2d;
            border: 1px solid #666;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
        `;

        // 修改预设选择框的样式
        const presetDropdown = document.createElement('div');
        presetDropdown.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 200px;
            max-height: 300px;
            overflow-y: auto;
            background: #2d2d2d;
            border: 1px solid #666;
            border-radius: 4px;
            z-index: 10000;
            margin-top: 4px;
            padding-top: 30px; // 为搜索框留出空间
            color: #fff; // 添加默认文字颜色
        `;

        // 添加预设搜索框
        const presetSearchInput = document.createElement('input');
        presetSearchInput.type = 'text';
        presetSearchInput.placeholder = '搜索预设...';
        presetSearchInput.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: calc(100% - 16px);
            margin: 8px;
            padding: 4px 8px;
            background: #3d3d3d;
            border: 1px solid #666;
            border-radius: 3px;
            color: #fff;
            font-size: 12px;
        `;

        // 阻止搜索框的点击事件冒泡，避免关闭下拉框
        presetSearchInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 添加搜索框的输入事件
        presetSearchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const options = presetDropdown.querySelectorAll('.preset-option');
            options.forEach(option => {
                const name = option.querySelector('span').textContent.toLowerCase();
                if (name.includes(searchText)) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            });
        });

        presetDropdown.appendChild(presetSearchInput);

        // 添加滚动条样式
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .preset-dropdown::-webkit-scrollbar {
                width: 8px;
            }
            .preset-dropdown::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            .preset-dropdown::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 4px;
            }
            .preset-dropdown::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(styleSheet);

        let selectedPresets = new Set();

        // 修改预设选项的样式
        function updatePresetOptions() {
            // 保留搜索框
            presetDropdown.innerHTML = '';
            presetDropdown.appendChild(presetSearchInput);
            presetSearchInput.value = ''; // 清空搜索框

            // 创建分隔线
            const createDivider = () => {
                const divider = document.createElement('div');
                divider.style.cssText = `
                    height: 1px;
                    background: #666;
                    margin: 5px 0;
                `;
                return divider;
            };

            // 创建预设选项
            const createPresetOption = (name, keywords, isSelected) => {
                const option = document.createElement('div');
                option.className = 'preset-option'; // 添加类名以便搜索
                option.style.cssText = `
                    padding: 6px 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                    color: #fff;
                    ${isSelected ? 'background: #2a4a6d;' : ''}
                `;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = isSelected;
                checkbox.style.cssText = `
                    margin: 0;
                    cursor: pointer;
                `;

                const label = document.createElement('span');
                label.textContent = name;
                label.style.cssText = `
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #fff;
                `;

                option.appendChild(checkbox);
                option.appendChild(label);

                option.addEventListener('mouseover', () => {
                    option.style.backgroundColor = isSelected ? '#2a5a8d' : '#3d3d3d';
                });

                option.addEventListener('mouseout', () => {
                    option.style.backgroundColor = isSelected ? '#2a4a6d' : 'transparent';
                });

                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    checkbox.checked = !checkbox.checked;
                    if (checkbox.checked) {
                        selectedPresets.add(name);
                    } else {
                        selectedPresets.delete(name);
                    }
                    updateSelectedPresets();
                    // 重新渲染预设列表以更新顺序
                    updatePresetOptions();
                });

                return option;
            };

            // 获取所有预设并分类
            const selectedOptions = [];
            const unselectedOptions = [];
            
            Object.entries(STATE.searchPresets).forEach(([name, keywords]) => {
                const isSelected = selectedPresets.has(name);
                const option = createPresetOption(name, keywords, isSelected);
                
                if (isSelected) {
                    selectedOptions.push(option);
                } else {
                    unselectedOptions.push(option);
                }
            });

            // 添加已选择的预设
            if (selectedOptions.length > 0) {
                const selectedTitle = document.createElement('div');
                selectedTitle.style.cssText = `
                    padding: 5px 10px;
                    color: #999;
                    font-size: 12px;
                    background: #262626;
                `;
                selectedTitle.textContent = '已选择的预设';
                presetDropdown.appendChild(selectedTitle);
                
                selectedOptions.forEach(option => presetDropdown.appendChild(option));
            }

            // 添加未选择的预设
            if (selectedOptions.length > 0 && unselectedOptions.length > 0) {
                presetDropdown.appendChild(createDivider());
            }

            if (unselectedOptions.length > 0) {
                if (selectedOptions.length > 0) {
                    const unselectedTitle = document.createElement('div');
                    unselectedTitle.style.cssText = `
                        padding: 5px 10px;
                        color: #999;
                        font-size: 12px;
                        background: #262626;
                    `;
                    unselectedTitle.textContent = '未选择的预设';
                    presetDropdown.appendChild(unselectedTitle);
                }
                
                unselectedOptions.forEach(option => presetDropdown.appendChild(option));
            }
        }

        function updateSelectedPresets() {
            if (selectedPresets.size === 0) {
                presetInput.value = '';
                presetInput.placeholder = '选择预设';
            } else {
                const names = Array.from(selectedPresets).join(', ');
                presetInput.value = names;
                presetInput.placeholder = '';
            }
        }

        function applySelectedPresets() {
            if (selectedPresets.size === 0) return;

            const keywords = Array.from(selectedPresets)
                .map(name => STATE.searchPresets[name])
                .join(';');

            searchInput.value = keywords;

            // 手动触发输入转换
            if (!STATE.pageSimplified) {
                try {
                    const convertedText = window.converter.toTraditional(keywords);
                    if (keywords !== convertedText) {
                        searchInput.value = convertedText;
                    }
                } catch (error) {}
            }

            // 触发搜索
            performSearch();
            // 清空选择
            selectedPresets.clear();
            updateSelectedPresets();
        }

        // 点击输入框时显示/隐藏下拉框
        presetInput.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = presetDropdown.style.display === 'block';
            presetDropdown.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                updatePresetOptions();
                // 聚焦搜索框
                setTimeout(() => {
                    presetSearchInput.focus();
                }, 0);
            }
        });

        // 点击其他地方时隐藏下拉框
        document.addEventListener('click', () => {
            presetDropdown.style.display = 'none';
        });

        // 添加搜索事件
        const performSearch = () => {
            // 获取所有预设关键词
            const presetKeywords = Array.from(selectedPresets)
                .map(name => STATE.searchPresets[name])
                .join(';');

            // 获取输入框关键词
            const inputKeywords = searchInput.value.trim();

            // 合并关键词
            const combinedKeywords = [presetKeywords, inputKeywords]
                .filter(k => k) // 过滤掉空字符串
                .join(';');

            // 如果页面是繁体模式，则将关键词转换为繁体
            let searchKeywords = combinedKeywords;
            if (!STATE.pageSimplified) {
                try {
                    searchKeywords = window.converter.toTraditional(combinedKeywords);
                } catch (error) {
                    console.error('转换繁体失败:', error);
                }
            }

            // 使用;或;作为分隔符
            const keywords = searchKeywords.toLowerCase().split(/[;；]/);
            // 过滤掉空字符串
            const filteredKeywords = keywords.filter(k => k.trim());
            
            if (!filteredKeywords.length) {
                clearHighlights();
                matchCounter.textContent = '';
                return;
            }
            searchAndHighlight(filteredKeywords, matchCounter);
        };

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        searchButton.addEventListener('click', performSearch);

        // 添加导航按钮
        const prevButton = document.createElement('button');
        prevButton.textContent = '上一个';
        prevButton.style.cssText = `
            padding: 5px 15px;
            background: #2d2d2d;
            border: 1px solid #666;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
            flex: 1;
        `;

        const nextButton = document.createElement('button');
        nextButton.textContent = '下一个';
        nextButton.style.cssText = `
            padding: 5px 15px;
            background: #2d2d2d;
            border: 1px solid #666;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s;
            flex: 1;
        `;

        const matchCounter = document.createElement('span');
        matchCounter.className = 'search-counter';
        matchCounter.style.cssText = `
            color: #fff;
            font-size: 12px;
            padding: 0 10px;
            min-width: 60px;
            text-align: center;
        `;

        // 添加导航事件
        prevButton.addEventListener('click', () => {
            navigateHighlight('prev');
        });

        nextButton.addEventListener('click', () => {
            navigateHighlight('next');
        });

        // 添加hover效果
        [searchButton, prevButton, nextButton].forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.background = button === searchButton ? '#357abd' : '#3d3d3d';
            });
            button.addEventListener('mouseout', () => {
                button.style.background = button === searchButton ? '#4a90e2' : '#2d2d2d';
            });
        });

        // 组装界面
        presetSelectContainer.appendChild(presetInput);
        presetSelectContainer.appendChild(presetDropdown);

        searchRow.appendChild(presetSelectContainer);
        searchRow.appendChild(searchInput);
        searchRow.appendChild(searchButton);

        navigationRow.appendChild(prevButton);
        navigationRow.appendChild(matchCounter);
        navigationRow.appendChild(nextButton);

        searchBoxContainer.appendChild(searchRow);
        searchBoxContainer.appendChild(navigationRow);

        // 添加选项行
        const optionsRow = document.createElement('div');
        optionsRow.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
            padding: 0 5px;
        `;

        const showOnlyMatchedLabel = document.createElement('label');
        showOnlyMatchedLabel.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
        `;

        const showOnlyMatchedCheckbox = document.createElement('input');
        showOnlyMatchedCheckbox.type = 'checkbox';
        showOnlyMatchedCheckbox.checked = STATE.showOnlyMatched;
        showOnlyMatchedCheckbox.style.cssText = `
            margin: 0;
            cursor: pointer;
        `;

        showOnlyMatchedLabel.appendChild(showOnlyMatchedCheckbox);
        showOnlyMatchedLabel.appendChild(document.createTextNode('只显示匹配项'));

        showOnlyMatchedCheckbox.addEventListener('change', (e) => {
            STATE.showOnlyMatched = e.target.checked;
            GM_setValue('showOnlyMatched', STATE.showOnlyMatched);
            if (STATE.matchedCards.length > 0) {
                updateCardVisibility();
            }
        });

        optionsRow.appendChild(showOnlyMatchedLabel);
        searchBoxContainer.insertBefore(optionsRow, navigationRow);

        document.body.appendChild(searchBoxContainer);

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            width: 20px;
            height: 20px;
            line-height: 1;
            padding: 0;
            background: #2d2d2d;
            border: 1px solid #666;
            border-radius: 50%;
            color: #999;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            z-index: 10000;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        `;

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = '#fff';
            closeButton.style.background = '#3d3d3d';
            closeButton.style.borderColor = '#999';
        });

        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = '#999';
            closeButton.style.background = '#2d2d2d';
            closeButton.style.borderColor = '#666';
        });

        closeButton.addEventListener('click', () => {
            searchBoxContainer.style.display = 'none';
            clearHighlights();
            searchInput.value = '';
            matchCounter.textContent = '';
            // 不清除选择的预设
        });

        searchBoxContainer.insertBefore(closeButton, searchBoxContainer.firstChild);

        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F3' || (e.ctrlKey && e.key === 'g')) {
                e.preventDefault();
                if (e.shiftKey) {
                    navigateHighlight('prev');
                } else {
                    navigateHighlight('next');
                }
            }
        });

        // 在搜索框显示时更新预设选项
        const originalToggleSearchBox = toggleSearchBox;
        toggleSearchBox = function() {
            const searchBox = document.querySelector('.search-box-container');
            if (searchBox) {
                const isCurrentlyHidden = searchBox.style.display === 'none';
                if (isCurrentlyHidden) {
                    updatePresetOptions();
                    // 不清除选择的预设
                    updateSelectedPresets();
                }
                searchBox.style.display = isCurrentlyHidden ? 'flex' : 'none';
                if (isCurrentlyHidden) {
                    const searchInput = searchBox.querySelector('input[type="text"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }
            }
        };

        return updatePresetOptions;
    }

    // 清除所有高亮
    function clearHighlights() {
        const highlights = document.querySelectorAll('.st-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        });

        // 清除所有高亮样式
        document.querySelectorAll('.current-highlight, .matched-card').forEach(card => {
            card.classList.remove('current-highlight', 'matched-card');
        });

        // 重置导航状态
        STATE.matchedCards = [];
        STATE.currentMatchIndex = -1;

        // 恢复所有卡片的可见性
        const allCards = document.querySelectorAll('.row[data-id]');
        allCards.forEach(card => {
            card.style.display = '';
        });
    }

    // 修改 searchAndHighlight 函数中的关键词处理部分
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function searchAndHighlight(keywords, matchCounter) {
        clearHighlights();

        const itemCards = document.querySelectorAll('.row[data-id]');
        STATE.matchedCards = [];
        let hasMatch = false;

        // 预处理关键词，处理特殊字符和通配符
        const processedKeywords = keywords.map(keyword => {
            keyword = keyword.trim();
            
            // 处理带条件的通配符
            // 匹配模式：(&>2) 或 (&>=2) 或 (&<2) 或 (&<=2) 或 (&=2)
            // 或带加号的版本：+(&>2) 等
            const conditionalPattern = /(\(?&(>=|<=|>|<|=)(\d+)\)?)/;
            if (conditionalPattern.test(keyword)) {
                const match = keyword.match(conditionalPattern);
                const fullMatch = match[0];
                const operator = match[2];
                const targetNum = parseInt(match[3]);
                
                // 将关键词分成前后两部分
                const [before, after] = keyword.split(fullMatch);
                
                // 构建正则表达式和验证函数
                const numPattern = '(\\d+)';
                const beforePattern = before ? escapeRegExp(before) : '';
                const afterPattern = after ? escapeRegExp(after) : '';
                
                return {
                    pattern: beforePattern + numPattern + afterPattern,
                    validate: (foundNum) => {
                        const num = parseInt(foundNum);
                        switch(operator) {
                            case '>': return num > targetNum;
                            case '>=': return num >= targetNum;
                            case '<': return num < targetNum;
                            case '<=': return num <= targetNum;
                            case '=': return num === targetNum;
                            default: return false;
                        }
                    }
                };
            }
            
            // 处理简单通配符
            if (keyword.includes('&')) {
                // 处理带加号的通配符
                if (keyword.includes('+&')) {
                    keyword = escapeRegExp(keyword).replace(/\\\+&/g, '\\+[0-9]+');
                } else {
                    // 处理不带加号的通配符
                    keyword = escapeRegExp(keyword).replace(/&/g, '[0-9]+');
                }
            } else {
                // 处理其他特殊字符
                keyword = escapeRegExp(keyword).replace(/\\\+/g, '[+＋]');
            }
            
            return { pattern: keyword };
        }).filter(k => k);

        itemCards.forEach(card => {
            const cardText = card.textContent;
            const matches = processedKeywords.map(keyword => {
                if (!keyword.validate) {
                    // 简单模式匹配
                    const regex = new RegExp(keyword.pattern, 'i');
                    return regex.test(cardText);
                } else {
                    // 条件模式匹配
                    const regex = new RegExp(keyword.pattern, 'i');
                    const match = cardText.match(regex);
                    if (!match) return false;
                    
                    // 提取数字并验证条件
                    const foundNum = match[1];
                    return keyword.validate(foundNum);
                }
            });
            const allMatch = matches.every(match => match);

            if (allMatch) {
                hasMatch = true;
                STATE.matchedCards.push(card);
                highlightKeywords(card, processedKeywords.map(k => k.pattern));
            } else if (STATE.showOnlyMatched) {
                card.style.display = 'none';
            }
        });

        if (!hasMatch) {
            alert('未找到匹配的结果');
            if (matchCounter) {
                matchCounter.textContent = '0/0';
            }
        } else {
            STATE.currentMatchIndex = 0;
            updateHighlightNavigation();
            updateCardVisibility();
        }
    }

    // 修改 highlightKeywords 函数
    function highlightKeywords(element, patterns) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    if (node.parentNode.nodeName === 'SCRIPT' ||
                        node.parentNode.nodeName === 'STYLE' ||
                        node.parentNode.classList.contains('st-highlight')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const text = node.textContent;
                    const containsAnyKeyword = patterns.some(pattern => {
                        const regex = new RegExp(pattern, 'i');
                        return regex.test(text);
                    });

                    return containsAnyKeyword ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }

        nodes.forEach(textNode => {
            let text = textNode.textContent;
            let tempText = text;

            patterns.forEach(pattern => {
                const regex = new RegExp(`(${pattern})`, 'gi');
                if (regex.test(text)) {
                    tempText = tempText.replace(regex, (match) => {
                        return `<span class="st-highlight">${match}</span>`;
                    });
                }
            });

            if (tempText !== text) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = tempText;
                const fragment = document.createDocumentFragment();
                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    // 更新高亮导航
    function updateHighlightNavigation() {
        const matchCounter = document.querySelector('.search-counter');
        if (!matchCounter) return;

        // 更新计数器
        matchCounter.textContent = `${STATE.currentMatchIndex + 1}/${STATE.matchedCards.length}`;

        // 移除之前的当前高亮
        document.querySelectorAll('.current-highlight, .matched-card').forEach(card => {
            card.classList.remove('current-highlight', 'matched-card');
        });

        // 添加新的当前高亮
        const currentCard = STATE.matchedCards[STATE.currentMatchIndex];
        if (currentCard) {
            currentCard.classList.add('current-highlight');
            // 滚动到当前卡片
            currentCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // 导航到上一个/下一个高亮
    function navigateHighlight(direction) {
        if (STATE.matchedCards.length === 0) return;

        if (direction === 'next') {
            STATE.currentMatchIndex = (STATE.currentMatchIndex + 1) % STATE.matchedCards.length;
        } else {
            STATE.currentMatchIndex = (STATE.currentMatchIndex - 1 + STATE.matchedCards.length) % STATE.matchedCards.length;
        }

        updateHighlightNavigation();
    }

    // 修改样式
    const style = document.createElement('style');
    style.textContent = `
        .current-highlight {
            background-color: rgba(255, 215, 0, 0.3) !important;
        }
        .matched-card {
            background-color: rgba(255, 215, 0, 0.1) !important;
        }
        .st-highlight {
            background-color: #ffd700;
            color: #000;
            border-radius: 2px;
            padding: 0 2px;
        }
    `;
    document.head.appendChild(style);
    
    function watchSearchResults(converter) {
        let lastUrl = location.href;
        const urlObserver = setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                STATE.originalTexts = new WeakMap();
                setTimeout(() => {
                    convertPageText(converter);
                }, 500);
            }
        }, 100);
    
        // 监视搜索结果变化
        const resultObserver = new MutationObserver((mutations) => {
            let needsConversion = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    needsConversion = true;
                    break;
                }
            }
            if (needsConversion) {
                setTimeout(() => convertPageText(converter), 100);
            }
        });
    
        const resultsContainer = document.querySelector('.results-container');
        if (resultsContainer) {
            resultObserver.observe(resultsContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }
    
    function findReactInstance(element) {
        const key = Object.keys(element).find(key => key.startsWith('__reactFiber$'));
        return key ? element[key] : null;
    }
    
    function findLoadMoreHandler() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (!loadMoreBtn) {
            console.log('未找到加载更多按钮');
            return null;
        }
    
        // 尝试获取React实例
        const instance = findReactInstance(loadMoreBtn);
        if (!instance) {
            console.log('未找到React实例');
            return null;
        }
    
        // 遍历查找onClick处理函数
        let current = instance;
        while (current) {
            if (current.memoizedProps && current.memoizedProps.onClick) {
                return current.memoizedProps.onClick;
            }
            current = current.return;
        }
    
        console.log('未找到onClick处理函数');
        return null;
    }
    
    function clickLoadMoreIfExists() {
        // 使用正确的选择器
        const loadMoreBtn = document.querySelector('.btn.load-more-btn');
        if (!loadMoreBtn) {
            console.log('未找到加载更多按钮');
            return false;
        }
    
        const results = document.querySelectorAll('.resultset, .trade-result, [class*="result-item"]');
        const currentResultCount = results.length;
    
        if (currentResultCount >= 100) {
            return false;
        }
    
        try {
            // 尝试多种方式触发点击
            // 1. 原生点击
            loadMoreBtn.click();
    
            // 2. 模拟鼠标事件序列
            ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                });
                loadMoreBtn.dispatchEvent(event);
            });
    
            // 3. 尝试点击内部的span
            const spanInButton = loadMoreBtn.querySelector('span');
            if (spanInButton) {
                spanInButton.click();
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        buttons: 1
                    });
                    spanInButton.dispatchEvent(event);
                });
            }
    
            // 4. 使用 HTMLElement 的 click 方法
            HTMLElement.prototype.click.call(loadMoreBtn);
    
            return true;
        } catch (error) {
            console.log('触发加载更多时出错:', error);
            return false;
        }
    }
    
    function autoLoadAllResults() {
        let attempts = 0;
        const maxAttempts = 20;
        let lastResultCount = 0;
    
        function tryLoadMore() {
            const results = document.querySelectorAll('.resultset');
            const currentResultCount = results.length;
    
            if (currentResultCount >= 100 || attempts >= maxAttempts ||
                (currentResultCount === lastResultCount && attempts > 0)) {
                return;
            }
    
            if (clickLoadMoreIfExists()) {
                lastResultCount = currentResultCount;
                attempts++;
                // 修改加载更多的处理方式
                setTimeout(() => {
                    // 确保新内容加载后计算DPS
                    const newResults = document.querySelectorAll('.row[data-id]').length;
                    if (newResults > currentResultCount) {
                        calculateDPS();
                    }
                    tryLoadMore();
                }, 1000);
            }
        }
    
        setTimeout(tryLoadMore, 1000);
    }
    
    // 检查URL是否是搜索结果页面
    function isSearchResultPage() {
        const isPOE2Trade = window.location.href.includes('pathofexile.com/trade2/search/poe2');
        const hasResults = document.querySelector('.results-container, .trade-results, .search-results, [class*="results"]') !== null;
        return isPOE2Trade && hasResults;
    }
    
    // 将这些函数移到init函数外部
            function createDPSPanel() {
                const panel = document.createElement('div');
                panel.id = 'dps-sort-panel';
                panel.style.cssText = `
                    position: fixed;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(28, 28, 28, 0.95);
                    padding: 8px;
                    border-radius: 6px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                    border: 1px solid #444;
                    width: 200px; // 增加宽度以适应价格显示
                    max-height: 60vh;
                    z-index: 9997;
                    display: none;
                `;

                // 添加标题
                const title = document.createElement('div');
                title.style.cssText = `
                    font-weight: bold;
                    color: #FFD700;
                    margin-bottom: 6px;
                    padding-bottom: 3px;
                    border-bottom: 1px solid #444;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    font-size: 14px;
                    user-select: none;
                    height: 18px;
                `;
                
                // 添加展开/收起指示器
                const indicator = document.createElement('span');
                indicator.textContent = '▼';
                indicator.style.marginRight = '3px';
                indicator.style.fontSize = '10px';
                indicator.id = 'integrated-panel-indicator';
                
                const titleText = document.createElement('span');
                titleText.textContent = 'DPS';
                
                const titleLeft = document.createElement('div');
                titleLeft.style.display = 'flex';
                titleLeft.style.alignItems = 'center';
                titleLeft.appendChild(indicator);
                titleLeft.appendChild(titleText);

                title.appendChild(titleLeft);

                // 添加关闭按钮
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '×';
                closeBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: #999;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0 5px;
                `;
                closeBtn.onclick = (e) => {
                    e.stopPropagation();
                    panel.style.display = 'none';
                };
                title.appendChild(closeBtn);

                // 添加内容容器
                const content = document.createElement('div');
                content.id = 'dps-sort-content';
                content.style.cssText = `
                    max-height: calc(60vh - 35px);
                    overflow-y: auto;
                    transition: max-height 0.3s ease-out;
                    padding-right: 2px;
                `;

                // 添加展开/收起功能
                let isExpanded = true;
                title.onclick = () => {
                    isExpanded = !isExpanded;
                    content.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
                    content.style.overflow = isExpanded ? 'auto' : 'hidden';
                    indicator.textContent = isExpanded ? '▼' : '▶';

            // 调整护盾面板位置
            const shieldPanel = document.getElementById('shield-sort-panel');
            if (shieldPanel) {
                if (isExpanded) {
                    shieldPanel.style.transform = 'translateY(calc(-50% + 200px))';
                } else {
                    shieldPanel.style.transform = 'translateY(calc(-50% + 50px))';
                }
            }
                };

                // 添加滚动条样式
                const style = document.createElement('style');
                style.textContent = `
                    #dps-sort-content::-webkit-scrollbar {
                        width: 6px;
                    }
                    #dps-sort-content::-webkit-scrollbar-track {
                        background: #1a1a1a;
                    }
                    #dps-sort-content::-webkit-scrollbar-thumb {
                        background: #444;
                        border-radius: 3px;
                    }
                    #dps-sort-content::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                    .dps-item {
                        padding: 4px 8px;
                        margin: 1px 0;
                        background: #2d2d2d;
                        border-radius: 3px;
                        cursor: pointer;
                        transition: background 0.2s;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 8px;
                        font-size: 13px;
                        white-space: nowrap;
                        user-select: none;
                        line-height: 1.2;
                    }
                    .dps-item:hover {
                        background: #3d3d3d;
                    }
                    .dps-item:last-child {
                        margin-bottom: 0;
                    }
                    .dps-value {
                        color: #FFD700;
                        font-weight: bold;
                    }
                    .price-value {
                        color: #8acdff;
                        font-size: 12px;
                        text-align: right;
                    }
                `;

                panel.appendChild(title);
                panel.appendChild(content);
                document.head.appendChild(style);
                document.body.appendChild(panel);

                return panel;
            }

    // 将convertCurrencyText函数移到全局作用域
                function convertCurrencyText(currencyText) {
        if (!currencyText) return '';
                    if (currencyText.includes('Exalted') || currencyText.includes('exalted')) return 'E';
                    if (currencyText.includes('Divine') || currencyText.includes('divine')) return 'D';
                    if (currencyText.includes('Chaos') || currencyText.includes('chaos')) return 'C';
                    if (currencyText.includes('崇高')) return 'E';
                    if (currencyText.includes('神圣')) return 'D';
                    if (currencyText.includes('混沌')) return 'C';
                    return currencyText; // 其他货币保持原样
                }

    function updateDPSPanel() {
        try {
            console.log('Updating DPS panel...');
            
            // 获取或创建面板
            const panel = document.getElementById('integrated-sort-panel') || createIntegratedPanel();
                const content = document.getElementById('dps-sort-content');
            if (!content) {
                console.error('DPS sort content not found');
                return;
            }

            // 清空现有内容
            content.innerHTML = '';
            
            // 清除可能存在的旧数据属性
            content.removeAttribute('data-shield-content');
            content.removeAttribute('data-evasion-content');
            content.removeAttribute('data-armour-content');
            content.removeAttribute('data-defence-content');

                const items = document.querySelectorAll('.row[data-id]');
                const dpsData = [];

                items.forEach(item => {
                    const dpsDisplay = item.querySelector('.dps-display');
                    if (dpsDisplay) {
                        const dps = parseInt(dpsDisplay.textContent.replace('DPS: ', ''));
                        // 修改价格获取逻辑
                        const priceElement = item.querySelector('.price [data-field="price"]');
                        let price = '未标价';
                        if (priceElement) {
                            const amount = priceElement.querySelector('span:not(.price-label):not(.currency-text)');
                            const currencyText = priceElement.querySelector('.currency-text');
                            if (amount && currencyText) {
                                // 获取数量和转换后的货币类型
                                const amountText = amount.textContent.trim();
                                const currency = currencyText.querySelector('span')?.textContent || currencyText.textContent;
                                const simpleCurrency = convertCurrencyText(currency);
                                price = `${amountText}${simpleCurrency}`;
                            }
                        }

                        dpsData.push({
                            dps,
                            price,
                            element: item
                        });
                    }
                });

            // 如果没有DPS数据，隐藏DPS选项卡
            const dpsTab = panel.querySelector('[data-tab="dps"]');
            if (dpsData.length === 0) {
                if (dpsTab) dpsTab.style.display = 'none';

                // 如果护盾选项卡也是隐藏的，则隐藏整个面板
                const shieldTab = panel.querySelector('[data-tab="shield"]');
                const evasionTab = panel.querySelector('[data-tab="evasion"]');
                const armourTab = panel.querySelector('[data-tab="armour"]');
                const defenceTab = panel.querySelector('[data-tab="defence"]');
                
                // 检查是否所有选项卡都隐藏了
                if ((shieldTab && shieldTab.style.display === 'none') &&
                    (evasionTab && evasionTab.style.display === 'none') &&
                    (armourTab && armourTab.style.display === 'none') &&
                    (defenceTab && defenceTab.style.display === 'none')) {
                    panel.style.display = 'none';
                }
                // 移除自动切换到护盾选项卡的代码，保留当前选项卡状态
                return;
            } else {
                // 有DPS数据，确保DPS选项卡可见
                if (dpsTab) dpsTab.style.display = '';
            }

                // 按DPS从高到低排序
                dpsData.sort((a, b) => b.dps - a.dps);

                // 更新面板内容
                dpsData.forEach(({dps, price, element}) => {
                    const dpsItem = document.createElement('div');
                    dpsItem.className = 'dps-item';
                    
                    // 创建DPS显示
                    const dpsText = document.createElement('span');
                    dpsText.className = 'dps-value';
                    dpsText.textContent = dps.toString();
                    
                    // 创建价格显示
                    const priceText = document.createElement('span');
                    priceText.className = 'price-value';
                    priceText.textContent = price;
                    
                    // 添加到DPS项
                    dpsItem.appendChild(dpsText);
                    dpsItem.appendChild(priceText);
                    
                    dpsItem.onclick = () => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // 添加高亮效果
                        element.style.transition = 'background-color 0.3s';
                        element.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                        setTimeout(() => {
                            element.style.backgroundColor = '';
                        }, 1500);
                    };
                    content.appendChild(dpsItem);
                });

                panel.style.display = 'block';
        } catch (error) {
            console.error('Error updating DPS panel:', error);
        }
            }

            function calculateDPS() {
                console.log('Calculating DPS...'); // 添加调试日志
                const items = document.querySelectorAll('.row[data-id]');
                console.log('Found items:', items.length); // 添加调试日志
                
                items.forEach(item => {
                    // 查找已有的DPS显示，如果存在则跳过
                    if (item.querySelector('.dps-display')) return;

                    // 获取元素伤害
                    const edamageSpan = item.querySelector('span[data-field="edamage"]');
                    if (!edamageSpan) return;

                    // 初始化伤害值
                    let minTotal = 0;
                    let maxTotal = 0;

                    // 获取所有元素伤害值
                    const damages = {
                        fire: edamageSpan.querySelector('.colourFireDamage'),
                        lightning: edamageSpan.querySelector('.colourLightningDamage'),
                        cold: edamageSpan.querySelector('.colourColdDamage')
                    };

                    // 处理每种元素伤害
                    Object.values(damages).forEach(dmg => {
                        if (dmg) {
                            const [min, max] = dmg.textContent.split('-').map(Number);
                            if (!isNaN(min) && !isNaN(max)) {
                                minTotal += min;
                                maxTotal += max;
                            }
                        }
                    });

                    // 获取元素增伤
                    let elementInc = 1;
                    const elementIncSpan = item.querySelector('span[data-field="stat.explicit.stat_387439868"]');
                    if (elementIncSpan) {
                        const incMatch = elementIncSpan.textContent.match(/(\d+)%/);
                        if (incMatch) {
                            elementInc = 1 + (parseInt(incMatch[1]) / 100);
                        }
                    }

                    // 获取攻击速度
                    let aps = 1;
                    const apsSpan = item.querySelector('span[data-field="aps"]');
                    if (apsSpan) {
                        let apsValue = apsSpan.querySelector('.colourDefault');
                        if (!apsValue) {
                            apsValue = apsSpan.querySelector('.colourAugmented');
                        }
                        if (apsValue) {
                            aps = parseFloat(apsValue.textContent) || 1;
                        }
                    }

                    // 计算DPS
                    const dps = ((minTotal + maxTotal) / 2) * elementInc * aps;
                    console.log('minTotal:', minTotal);
                    console.log('maxTotal:', maxTotal);
                    console.log('elementInc:', elementInc);
                    console.log('aps:', aps);
                    console.log('dps:', dps);

                    // 创建DPS显示元素
                    const dpsDisplay = document.createElement('span');
                    dpsDisplay.className = 'dps-display';
                    dpsDisplay.style.cssText = `
                        color: #FFD700;
                        font-weight: bold;
                        margin-left: 10px;
                    `;
                    dpsDisplay.textContent = `DPS: ${Math.round(dps)}`;

                    // 将DPS显示添加到元素伤害后面
                    edamageSpan.appendChild(dpsDisplay);
                });

                // 更新DPS排序面板
                updateDPSPanel();
            }

            // 创建一个防抖函数来避免过于频繁的计算
            function debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }

    async function init() {
        /**
         * 初始化脚本，设置转换器、观察器和UI元素
         */
        try {
            // 等待页面完全加载
            await new Promise(resolve => setTimeout(resolve, 100));

            // 等待OpenCC库加载
            const OpenCC = await waitForOpenCC();
            console.log('OpenCC已加载');

            // 创建转换器
            const converter = createConverters(OpenCC);
            window.converter = converter;

            // 创建输入处理函数
            const handleInput = createInputHandler(converter);

            // 为现有输入元素添加事件监听器
            attachInputListener(handleInput);

            // 创建观察器监听DOM变化
            const observer = createObserver(handleInput, converter);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 创建控制面板
            createControls();

            // 创建配置按钮
            createConfigButton();

            // 创建配置模态框
            createConfigModal();

            // 设置配置模态框事件
            setupConfigModalEvents();

            // 创建搜索框
            createSearchBox(handleInput);

            // 如果启用了页面简体化，转换页面文本
            if (STATE.pageSimplified) {
                convertPageText(converter);
            }

            // 监视搜索结果
            watchSearchResults(converter);

            // 定期转换页面文本
            setInterval(() => {
                if (STATE.pageSimplified) {
                    convertPageText(converter);
                }
            }, 1000);

            // 使用防抖包装calculateDPS和calculateShield
            const debouncedCalculateDPS = debounce(calculateDPS, 200);
            const debouncedCalculateShield = debounce(calculateShield, 200);
            const debouncedCalculateEvasion = debounce(calculateEvasion, 200);
            const debouncedCalculateArmour = debounce(calculateArmour, 200);
            const debouncedCalculateDefence = debounce(calculateDefence, 200);

            // 同时计算DPS、护盾、闪避、护甲和总防御的防抖函数
            const debouncedCalculate = debounce(() => {
                calculateDPS();
                calculateShield();
                calculateEvasion();
                calculateArmour();
                calculateDefence();
            }, 200);
            
            // 监听搜索按钮点击事件
            const setupSearchButtonListener = () => {
                // 使用MutationObserver监听搜索按钮的出现
                const searchBtnObserver = new MutationObserver((mutations, observer) => {
                    const searchBtn = document.querySelector('.controls-center .search-btn');
                    if (searchBtn) {
                        console.log('搜索按钮已找到，添加点击事件监听器');
                        searchBtn.addEventListener('click', () => {
                            console.log('搜索按钮被点击，触发计算...');
                            // 延迟执行计算，确保搜索结果已加载
                            setTimeout(() => {
                                debouncedCalculate();
                            }, 1000);
                        });
                        observer.disconnect(); // 找到按钮后停止观察
                    }
                });
                
                // 开始观察文档
                searchBtnObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                
                // 立即检查一次，以防按钮已经存在
                const searchBtn = document.querySelector('.controls-center .search-btn');
                if (searchBtn) {
                    console.log('搜索按钮已存在，添加点击事件监听器');
                    searchBtn.addEventListener('click', () => {
                        console.log('搜索按钮被点击，触发计算...');
                        // 延迟执行计算，确保搜索结果已加载
                        setTimeout(() => {
                            debouncedCalculate();
                        }, 1000);
                    });
                }
            };
            
            // 设置搜索按钮监听器
            setupSearchButtonListener();

            // 创建一个更强大的观察器来监视DOM变化
            const resultsObserver = new MutationObserver((mutations) => {
                let hasNewContent = false;
                mutations.forEach(mutation => {
                    // 检查是否有新的结果项被添加
                    if (mutation.type === 'childList' && 
                        mutation.addedNodes.length > 0 &&
                        Array.from(mutation.addedNodes).some(node => 
                            node.nodeType === 1 && // 元素节点
                            (node.classList?.contains('row') || node.querySelector?.('.row[data-id]'))
                        )) {
                        hasNewContent = true;
                    }
                });

                if (hasNewContent) {
                    console.log('New content detected, calculating DPS, Shield, Evasion and Armour...'); // 添加调试日志
                    // 使用延时确保DOM完全更新
                    setTimeout(() => {
                        debouncedCalculate();
                    }, 300);
                }
            });

            // 观察整个结果容器及其子元素
            const resultsContainer = document.querySelector('.results-container');
            if (resultsContainer) {
                resultsObserver.observe(resultsContainer, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true
                });

                // 同时观察父元素，以防结果容器被替换
                if (resultsContainer.parentNode) {
                    resultsObserver.observe(resultsContainer.parentNode, {
                        childList: true
                    });
                }
            }

            // 添加滚动事件监听器
            window.addEventListener('scroll', () => {
                // 检查是否滚动到底部附近
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                    debouncedCalculate();
                }
            });

            // 将函数添加到window对象，以便其他地方可以调用
            window.calculateDPS = calculateDPS;
            window.calculateShield = calculateShield;
            window.calculateEvasion = calculateEvasion;
            window.calculateArmour = calculateArmour;
            window.calculateDefence = calculateDefence;
            window.debouncedCalculateDPS = debouncedCalculateDPS;
            window.debouncedCalculateShield = debouncedCalculateShield;
            window.debouncedCalculateEvasion = debouncedCalculateEvasion;
            window.debouncedCalculateArmour = debouncedCalculateArmour;
            window.debouncedCalculateDefence = debouncedCalculateDefence;
            window.debouncedCalculate = debouncedCalculate;

            // 监听URL变化
            let lastUrl = location.href;
            const urlCheckInterval = setInterval(() => {
                const currentUrl = location.href;
                if ((currentUrl !== lastUrl || currentUrl.includes('pathofexile.com/trade2/search/poe2')) && STATE.autoLoadEnabled) {
                    lastUrl = currentUrl;
                    setTimeout(() => {
                        if (isSearchResultPage()) {
                            autoLoadAllResults();
                        }
                    }, 100);
                }
            }, 100);
    
            // 初始检查
            setTimeout(() => {
                if (isSearchResultPage() && STATE.autoLoadEnabled) {
                    autoLoadAllResults();
                }
            }, 100);
    
            // 延迟初始计算，确保页面元素已加载
            setTimeout(() => {
                // 初始计算DPS和护盾
                calculateDPS();
            calculateShield();
                calculateEvasion();
                calculateArmour();
                calculateDefence();

                // 如果没有找到物品，设置重试
                const retryCalculation = () => {
                    const items = document.querySelectorAll('.row[data-id]');
                    if (items.length > 0) {
                        console.log('重试计算，找到物品数量:', items.length);
                calculateDPS();
                calculateShield();
                        calculateEvasion();
                        calculateArmour();
                        calculateDefence();
                    } else {
                        console.log('未找到物品，500ms后重试...');
                        setTimeout(retryCalculation, 500);
                    }
                };

                // 如果初始计算没有找到物品，启动重试机制
                const items = document.querySelectorAll('.row[data-id]');
                if (items.length === 0) {
                    console.log('初始计算未找到物品，启动重试机制');
                    setTimeout(retryCalculation, 500);
                }
            }, 500);

        } catch (error) {
            console.error('初始化时出错:', error);
        }
    }
    
    // 修改 updateConfig 函数
    function updateConfig(category, name) {
        if (confirm(`确定要用当前页面更新配置 "${name}" 吗？`)) {
            STATE.configs[category][name] = {
                url: window.location.href
            };
            GM_setValue('savedConfigs', STATE.configs);
            updateConfigList();
        }
    }
    
    // 添加预设关键词相关函数
    function saveSearchPreset() {
        const nameInput = document.getElementById('preset-name');
        const keywordsInput = document.getElementById('preset-keywords');
        const name = nameInput.value.trim();
        const keywords = keywordsInput.value.trim();
        const saveBtn = document.getElementById('save-preset');

        if (!name || !keywords) {
            alert('请输入预设名称和关键词');
            return;
        }

        // 检查是否在编辑模式
        if (nameInput.dataset.editMode === 'true') {
            const originalName = nameInput.dataset.originalName;
            // 如果名称改变了，删除旧的预设
            if (originalName !== name) {
                delete STATE.searchPresets[originalName];
            }
            // 清除编辑模式标记
            delete nameInput.dataset.editMode;
            delete nameInput.dataset.originalName;
            saveBtn.textContent = '保存预设';
        } else if (STATE.searchPresets[name] && !confirm(`预设 "${name}" 已存在，是否覆盖？`)) {
            return;
        }

        STATE.searchPresets[name] = keywords;
        GM_setValue('searchPresets', STATE.searchPresets);
        updatePresetList();

        nameInput.value = '';
        keywordsInput.value = '';
    }

    function updatePresetList() {
        const presetList = document.getElementById('preset-list');
        presetList.innerHTML = '';

        Object.entries(STATE.searchPresets).forEach(([name, keywords]) => {
            const presetItem = document.createElement('div');
            presetItem.style.cssText = `
                display: grid;
                grid-template-columns: 1fr auto auto;
                align-items: center;
                padding: 8px;
                margin: 5px 0;
                background: #3d3d3d;
                border-radius: 4px;
                gap: 10px;
            `;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;  // 只显示预设名称
            nameSpan.title = keywords;    // 将关键词设置为提示文本
            nameSpan.style.cssText = `
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: help;  // 添加提示光标
            `;

            const editBtn = document.createElement('button');
            editBtn.textContent = '编辑';
            editBtn.style.cssText = `
                background: #27ae60;
                border: none;
                color: #fff;
                padding: 3px 12px;
                cursor: pointer;
                border-radius: 3px;
            `;
            editBtn.onclick = () => {
                const presetEditModal = document.getElementById('preset-edit-modal');
                const presetEditOverlay = document.getElementById('preset-edit-overlay');
                const presetEditTitle = document.getElementById('preset-edit-title');
                const nameInput = document.getElementById('preset-name');
                const keywordsInput = document.getElementById('preset-keywords');

                presetEditTitle.textContent = '编辑预设';
                nameInput.value = name;
                keywordsInput.value = keywords;
                nameInput.dataset.editMode = 'true';
                nameInput.dataset.originalName = name;

                presetEditModal.style.display = 'block';
                presetEditOverlay.style.display = 'block';
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.cssText = `
                background: #e74c3c;
                border: none;
                color: #fff;
                padding: 3px 12px;
                cursor: pointer;
                border-radius: 3px;
            `;
            deleteBtn.onclick = () => {
                if (confirm(`确定要删除预设 "${name}" 吗？`)) {
                    delete STATE.searchPresets[name];
                    GM_setValue('searchPresets', STATE.searchPresets);
                    updatePresetList();
                }
            };

            presetItem.appendChild(nameSpan);
            presetItem.appendChild(editBtn);
            presetItem.appendChild(deleteBtn);
            presetList.appendChild(presetItem);
        });
    }
    
    setTimeout(init, 2000);

    // 在clearHighlights函数后添加
    function updateCardVisibility() {
        const allCards = document.querySelectorAll('.row[data-id]');
        
        if (STATE.showOnlyMatched) {
            // 如果启用了"只显示匹配项"，隐藏所有非匹配卡片
            allCards.forEach(card => {
                if (STATE.matchedCards.includes(card)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        } else {
            // 如果禁用了"只显示匹配项"，显示所有卡片
            allCards.forEach(card => {
                card.style.display = '';
            });
        }
    }

    // 计算护盾值
    function calculateShield() {
        console.log('Calculating Shield...');
        const items = document.querySelectorAll('.row[data-id]');
        console.log('Found items:', items.length);
        
        let processedCount = 0;
        let successCount = 0;

        items.forEach((item, index) => {
            try {
            // 如果已经计算过护盾值，则跳过
                if (item.querySelector('.shield-display')) {
                    processedCount++;
                    return;
                }

            // 1. 获取符文孔数量
            const socketsDiv = item.querySelector('.sockets');
                if (!socketsDiv) {
                    console.debug(`Item ${index}: No sockets div found`);
                    return;
                }
            
            // 修改符文孔数量的获取逻辑
            let numSockets = 0;
            for (let i = 1; i <= 6; i++) { // 假设最多6个符文孔
                if (socketsDiv.classList.contains(`numSockets${i}`)) {
                    numSockets = i;
                    break;
                }
            }
                if (numSockets === 0) {
                    // 尝试其他方式获取符文孔数量
                    const socketText = socketsDiv.textContent.trim();
                    if (socketText) {
                        numSockets = socketText.length;
                    } else {
                        numSockets = 1; // 默认值
                    }
                    console.debug(`Item ${index}: Using alternative socket count: ${numSockets}`);
                }

            // 2. 获取能量护盾值
            const esSpan = item.querySelector('span[data-field="es"]');
                if (!esSpan) {
                    console.debug(`Item ${index}: No ES span found`);
                    return;
                }

                const esValue = esSpan.querySelector('.colourAugmented, .colourDefault');
                if (!esValue) {
                    console.debug(`Item ${index}: No ES value found`);
                    return;
                }
            
            const totalES = parseInt(esValue.textContent);
                if (isNaN(totalES)) {
                    console.debug(`Item ${index}: Invalid ES value: ${esValue.textContent}`);
                    return;
                }

            // 3. 获取当前品质
            let currentQuality = 0;
            const qualitySpan = item.querySelector('span[data-field="quality"]');
            if (qualitySpan) {
                const qualityMatch = qualitySpan.textContent.match(/\+(\d+)%/);
                if (qualityMatch) {
                    currentQuality = parseInt(qualityMatch[1]);
                }
            }
            // 计算品质差值
            const qualityDiff = 20 - currentQuality;

            // 4. 获取护盾增加百分比
            let esInc = 0;

                // 定义可能包含护盾增加的词缀ID列表
                const possibleESIncIds = [
                    'stat.explicit.stat_4015621042',  // 原有ID
                    'stat.explicit.stat_1999113824',  // 增加闪避与能量护盾
                    'stat.explicit.stat_2866361420',  // 增加能量护盾
                    'stat.explicit.stat_2511217560',  // 增加最大能量护盾
                    'stat.explicit.stat_3489782002',  // 增加能量护盾和魔力
                    'stat.explicit.stat_3321629045'   // 增加护甲与能量护盾
                ];

                // 遍历所有可能的词缀ID
                for (const statId of possibleESIncIds) {
                    const statSpan = item.querySelector(`span[data-field="${statId}"]`);
                    if (statSpan) {
                        // 检查词缀文本是否包含"能量护盾"或"Energy Shield"
                        const statText = statSpan.textContent;
                        if (statText.includes('能量护盾') || statText.includes('Energy Shield')) {
                            // 提取百分比数值
                            const incMatch = statText.match(/(\d+)%/);
                if (incMatch) {
                                esInc += parseInt(incMatch[1]);
                                console.debug(`Found ES increase: ${incMatch[1]}% from stat ${statId}`);
                            }
                        }
                    }
                }

                // 通用方法：查找所有包含"能量护盾"或"Energy Shield"的显式词缀
                const allExplicitStats = item.querySelectorAll('span[data-field^="stat.explicit.stat_"]');
                allExplicitStats.forEach(statSpan => {
                    // 检查是否已经在上面的特定ID列表中处理过
                    const statId = statSpan.getAttribute('data-field');
                    if (!possibleESIncIds.includes(statId)) {
                        const statText = statSpan.textContent;
                        // 检查是否包含能量护盾相关文本和百分比增加
                        if ((statText.includes('能量护盾') || statText.includes('Energy Shield')) &&
                            statText.includes('%') &&
                            (statText.includes('增加') || statText.includes('increased'))) {
                            const incMatch = statText.match(/(\d+)%/);
                            if (incMatch) {
                                esInc += parseInt(incMatch[1]);
                                console.debug(`Found additional ES increase: ${incMatch[1]}% from stat ${statId}`);
                                // 将新发现的ID添加到列表中，以便将来使用
                                possibleESIncIds.push(statId);
                            }
                        }
                    }
                });

            // 5. 获取已插入的符文提供的增益和数量
            let insertedRuneBonus = 0;
            let insertedRuneCount = 0;
            let esRuneInc = 0; // 新增：专门用于记录护盾符文的增益

            // 获取符文增益 - 能量护盾增加
            const esRuneStatSpan = item.querySelector('span[data-field="stat.rune.stat_3523867985"]');
            if (esRuneStatSpan) {
                const runeMatch = esRuneStatSpan.textContent.match(/(\d+)%/);
                if (runeMatch) {
                    insertedRuneBonus = parseInt(runeMatch[1]);
                    insertedRuneCount = insertedRuneBonus / 20;
                }
            }

            // 获取符文增益 - 能量护盾百分比增加
            const esIncRuneStatSpan = item.querySelector('span[data-field="stat.rune.stat_2866361420"]');
            if (esIncRuneStatSpan) {
                const esIncRuneMatch = esIncRuneStatSpan.textContent.match(/(\d+)%/);
                if (esIncRuneMatch) {
                    esRuneInc = parseInt(esIncRuneMatch[1]);
                }
            }

            // 6. 计算可用的符文孔位增益
            let availableRuneBonus = 0;
            // 计算剩余可用的孔数
            const remainingSlots = numSockets - insertedRuneCount;
            availableRuneBonus = remainingSlots * 20;

            // 7. 计算基础护盾
            // 当前护盾 = 基础护盾 * (1 + 当前品质/100) * (1 + (已插入符文增益 + 装备增益 + 护盾符文增益)/100)
            const baseES = Math.round(totalES / (1 + currentQuality/100) / (1 + (insertedRuneBonus + esInc + esRuneInc)/100));

            // 8. 计算最大可能护盾（考虑品质提升和剩余符文孔）
            // 最大护盾 = 基础护盾 * (1 + (当前品质 + 品质差值)/100) * (1 + (装备增益 + 已插入符文增益 + 可用符文增益)/100)
            const maxES = Math.round(baseES * (1 + (currentQuality + qualityDiff)/100) * (1 + (esInc + insertedRuneBonus + availableRuneBonus)/100));

            // 创建护盾显示元素
            const shieldDisplay = document.createElement('span');
            shieldDisplay.className = 'shield-display';
            shieldDisplay.style.cssText = `
                color: #6495ED;
                font-weight: bold;
                margin-left: 10px;
            `;
            shieldDisplay.textContent = `总护盾: ${maxES}`;

            // 将护盾显示添加到能量护盾后面
            esSpan.appendChild(shieldDisplay);

                successCount++;
                processedCount++;

            // 添加调试信息
                console.debug(`Item ${index} Shield calculation:`, {
                totalES,
                currentQuality,
                qualityDiff,
                esInc,
                insertedRuneBonus,
                insertedRuneCount,
                numSockets,
                availableRuneBonus,
                baseES,
                maxES
            });
            } catch (error) {
                console.error(`Error calculating shield for item ${index}:`, error);
            }
        });

        console.log(`Shield calculation completed: ${successCount} successful, ${processedCount} processed out of ${items.length} items`);

        // 更新护盾排序面板
        updateShieldPanel();
    }

    // 创建护盾排序面板
    function createShieldPanel() {
        const panel = document.createElement('div');
        panel.id = 'shield-sort-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(calc(-50% + 200px));
            background: rgba(28, 28, 28, 0.95);
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            width: 180px;
            max-height: 60vh;
            z-index: 9997;
            display: none;
        `;

        // 添加标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            color: #8acdff;
            margin-bottom: 6px;
            padding-bottom: 3px;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            user-select: none;
            height: 18px;
        `;
        
        // 添加展开/收起指示器
        const indicator = document.createElement('span');
        indicator.textContent = '▼';
        indicator.style.marginRight = '3px';
        indicator.style.fontSize = '10px';
        indicator.id = 'integrated-panel-indicator';
        
        const titleText = document.createElement('span');
        titleText.textContent = 'ES';
        
        const titleLeft = document.createElement('div');
        titleLeft.style.display = 'flex';
        titleLeft.style.alignItems = 'center';
        titleLeft.appendChild(indicator);
        titleLeft.appendChild(titleText);

        title.appendChild(titleLeft);

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        };
        title.appendChild(closeBtn);

        // 添加内容容器
        const content = document.createElement('div');
        content.id = 'shield-sort-content';
        content.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out;
            padding-right: 2px;
        `;

        // 添加展开/收起功能
        let isExpanded = true;
        title.onclick = () => {
            isExpanded = !isExpanded;
            content.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            content.style.overflow = isExpanded ? 'auto' : 'hidden';
            indicator.textContent = isExpanded ? '▼' : '▶';
        };

        // 添加组件到面板
        panel.appendChild(title);
        panel.appendChild(content);

        // 添加到文档
        document.body.appendChild(panel);

        console.log('Shield panel created successfully');
        return panel;
    }

    // 更新护盾排序面板
    function updateShieldPanel() {
        try {
            console.log('Updating shield panel...');

            // 获取或创建面板
            const panel = document.getElementById('integrated-sort-panel') || createIntegratedPanel();
            const content = document.getElementById('shield-sort-content');
            if (!content) {
                console.error('Shield sort content not found');
                return;
            }

            // 清空现有内容
            content.innerHTML = '';

            // 清除可能存在的旧数据属性
            content.removeAttribute('data-armour-content');
            content.removeAttribute('data-evasion-content');
            content.removeAttribute('data-dps-content');
            content.removeAttribute('data-defence-content');

            // 获取所有物品
            const items = document.querySelectorAll('.row[data-id]');
            const shieldData = [];

            // 收集护盾数据
            items.forEach(item => {
                const shieldDisplay = item.querySelector('.shield-display');
                if (shieldDisplay) {
                    const shield = parseInt(shieldDisplay.textContent.replace('总护盾: ', ''));
                    
                    // 获取价格
                    const priceElement = item.querySelector('.price [data-field="price"]');
                    let price = '未标价';
                    if (priceElement) {
                        const amount = priceElement.querySelector('span:not(.price-label):not(.currency-text)');
                        const currencyText = priceElement.querySelector('.currency-text');
                        if (amount && currencyText) {
                            const amountText = amount.textContent.trim();
                            const currency = currencyText.querySelector('span')?.textContent || currencyText.textContent;
                            // 使用全局的convertCurrencyText函数
                            const simpleCurrency = convertCurrencyText(currency);
                            price = `${amountText}${simpleCurrency}`;
                        }
                    }

                    shieldData.push({
                        shield,
                        price,
                        element: item
                    });
                }
            });

            console.log(`Found ${shieldData.length} items with shield data`);

            // 如果没有护盾数据，隐藏护盾选项卡
            const shieldTab = panel.querySelector('[data-tab="shield"]');
            if (shieldData.length === 0) {
                if (shieldTab) shieldTab.style.display = 'none';

                // 如果DPS选项卡也是隐藏的，则隐藏整个面板
                const dpsTab = panel.querySelector('[data-tab="dps"]');
                const evasionTab = panel.querySelector('[data-tab="evasion"]');
                const armourTab = panel.querySelector('[data-tab="armour"]');
                const defenceTab = panel.querySelector('[data-tab="defence"]');
                
                // 检查是否所有选项卡都隐藏了
                if ((dpsTab && dpsTab.style.display === 'none') &&
                    (evasionTab && evasionTab.style.display === 'none') &&
                    (armourTab && armourTab.style.display === 'none') &&
                    (defenceTab && defenceTab.style.display === 'none')) {
                    panel.style.display = 'none';
                }
                // 移除自动切换到护盾选项卡的代码，保留当前选项卡状态
                return;
            } else {
                // 有护盾数据，确保护盾选项卡可见
                if (shieldTab) shieldTab.style.display = '';
            }

            // 按护盾值从高到低排序
            shieldData.sort((a, b) => b.shield - a.shield);

            // 更新面板内容
            shieldData.forEach(({shield, price, element}) => {
                const shieldItem = document.createElement('div');
                shieldItem.className = 'dps-item'; // 复用DPS项的样式

                // 创建护盾显示
                const shieldText = document.createElement('span');
                shieldText.className = 'shield-value'; // 使用护盾专用的样式
                shieldText.textContent = shield.toString();

                // 创建价格显示
                const priceText = document.createElement('span');
                priceText.className = 'price-value';
                priceText.textContent = price;

                // 添加到护盾项
                shieldItem.appendChild(shieldText);
                shieldItem.appendChild(priceText);

                // 添加点击事件
                shieldItem.onclick = () => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 添加高亮效果
                    element.style.transition = 'background-color 0.3s';
                    element.style.backgroundColor = 'rgba(138, 205, 255, 0.2)';
                    setTimeout(() => {
                        element.style.backgroundColor = '';
                    }, 1500);
                };

                content.appendChild(shieldItem);
            });

            // 显示面板
            panel.style.display = 'block';
            console.log('Shield panel updated successfully');
        } catch (error) {
            console.error('Error updating shield panel:', error);
        }
    }

    // 辅助函数：安全地查询选择器
    function safeQuerySelector(element, selector) {
        try {
            return element.querySelector(selector);
        } catch (error) {
            console.error(`Error querying selector "${selector}":`, error);
            return null;
        }
    }

    // 创建整合面板，包含总防御、DPS、护盾、闪避和护甲五个选项卡
    function createIntegratedPanel() {
        // 检查是否已存在面板
        let panel = document.getElementById('integrated-sort-panel');
        if (panel) return panel;
        
        panel = document.createElement('div');
        panel.id = 'integrated-sort-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(28, 28, 28, 0.95);
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            width: 180px;
            max-height: 60vh;
            z-index: 9997;
            display: none;
        `;

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            padding-bottom: 3px;
            border-bottom: 1px solid #444;
            font-size: 13px;
            user-select: none;
            height: 18px;
        `;
        
        // 创建选项卡容器
        const tabsContainer = document.createElement('div');
        tabsContainer.style.cssText = `
            display: flex;
            gap: 4px;
            flex-wrap: nowrap;
        `;
        
        // 创建总防御选项卡（默认激活）
        const defenceTab = document.createElement('div');
        defenceTab.textContent = 'DEF';
        defenceTab.className = 'sort-tab active';
        defenceTab.dataset.tab = 'defence';
        defenceTab.style.cssText = `
            color: #9370DB;
            font-weight: bold;
            cursor: pointer;
            padding: 0 3px;
            font-size: 12px;
        `;
        
        // 创建DPS选项卡
        const dpsTab = document.createElement('div');
        dpsTab.textContent = 'DPS';
        dpsTab.className = 'sort-tab';
        dpsTab.dataset.tab = 'dps';
        dpsTab.style.cssText = `
            color: #FFD700;
            font-weight: bold;
            cursor: pointer;
            padding: 0 3px;
            opacity: 0.6;
            font-size: 12px;
        `;
        
        // 创建护盾选项卡
        const shieldTab = document.createElement('div');
        shieldTab.textContent = 'ES';
        shieldTab.className = 'sort-tab';
        shieldTab.dataset.tab = 'shield';
        shieldTab.style.cssText = `
            color: #8acdff;
            font-weight: bold;
            cursor: pointer;
            padding: 0 3px;
            opacity: 0.6;
            font-size: 12px;
        `;
        
        // 创建闪避选项卡
        const evasionTab = document.createElement('div');
        evasionTab.textContent = 'EV';
        evasionTab.className = 'sort-tab';
        evasionTab.dataset.tab = 'evasion';
        evasionTab.style.cssText = `
            color: #7FFF00;
            font-weight: bold;
            cursor: pointer;
            padding: 0 3px;
            opacity: 0.6;
            font-size: 12px;
        `;
        
        // 创建护甲选项卡
        const armourTab = document.createElement('div');
        armourTab.textContent = 'AR';
        armourTab.className = 'sort-tab';
        armourTab.dataset.tab = 'armour';
        armourTab.style.cssText = `
            color: #FF6347;
            font-weight: bold;
            cursor: pointer;
            padding: 0 3px;
            opacity: 0.6;
            font-size: 12px;
        `;
        
        // 添加选项卡到容器
        tabsContainer.appendChild(defenceTab);
        tabsContainer.appendChild(dpsTab);
        tabsContainer.appendChild(shieldTab);
        tabsContainer.appendChild(evasionTab);
        tabsContainer.appendChild(armourTab);
        
        // 创建展开/收起指示器
        const indicator = document.createElement('span');
        indicator.textContent = '▼';
        indicator.style.marginRight = '3px';
        indicator.style.fontSize = '10px';
        indicator.id = 'integrated-panel-indicator';
        
        // 创建左侧容器
        const titleLeft = document.createElement('div');
        titleLeft.style.cssText = `
            display: flex;
            align-items: center;
        `;
        titleLeft.appendChild(indicator);
        titleLeft.appendChild(tabsContainer);
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        };
        
        // 组装标题栏
        titleBar.appendChild(titleLeft);
        titleBar.appendChild(closeBtn);
        
        // 创建内容容器
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            position: relative;
        `;
        
        // 创建总防御内容
        const defenceContent = document.createElement('div');
        defenceContent.id = 'defence-sort-content';
        defenceContent.className = 'sort-content active';
        defenceContent.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
            padding-right: 2px;
        `;
        
        // 创建DPS内容
        const dpsContent = document.createElement('div');
        dpsContent.id = 'dps-sort-content';
        dpsContent.className = 'sort-content';
        dpsContent.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
            padding-right: 2px;
            display: none;
        `;
        
        // 创建护盾内容
        const shieldContent = document.createElement('div');
        shieldContent.id = 'shield-sort-content';
        shieldContent.className = 'sort-content';
        shieldContent.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
            padding-right: 2px;
            display: none;
        `;
        
        // 创建闪避内容
        const evasionContent = document.createElement('div');
        evasionContent.id = 'evasion-sort-content';
        evasionContent.className = 'sort-content';
        evasionContent.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
            padding-right: 2px;
            display: none;
        `;
        
        // 创建护甲内容
        const armourContent = document.createElement('div');
        armourContent.id = 'armour-sort-content';
        armourContent.className = 'sort-content';
        armourContent.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
            padding-right: 2px;
            display: none;
        `;
        
        // 添加内容到容器
        contentContainer.appendChild(defenceContent);
        contentContainer.appendChild(dpsContent);
        contentContainer.appendChild(shieldContent);
        contentContainer.appendChild(evasionContent);
        contentContainer.appendChild(armourContent);
        
        // 添加展开/收起功能
        let isExpanded = true;
        indicator.onclick = (e) => {
            e.stopPropagation();
            isExpanded = !isExpanded;
            defenceContent.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            dpsContent.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            shieldContent.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            evasionContent.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            armourContent.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            defenceContent.style.overflow = isExpanded ? 'auto' : 'hidden';
            dpsContent.style.overflow = isExpanded ? 'auto' : 'hidden';
            shieldContent.style.overflow = isExpanded ? 'auto' : 'hidden';
            evasionContent.style.overflow = isExpanded ? 'auto' : 'hidden';
            armourContent.style.overflow = isExpanded ? 'auto' : 'hidden';
            indicator.textContent = isExpanded ? '▼' : '▶';
        };

        // 添加选项卡切换功能
        defenceTab.onclick = () => {
            defenceTab.classList.add('active');
            dpsTab.classList.remove('active');
            shieldTab.classList.remove('active');
            evasionTab.classList.remove('active');
            armourTab.classList.remove('active');
            defenceContent.style.display = 'block';
            dpsContent.style.display = 'none';
            shieldContent.style.display = 'none';
            evasionContent.style.display = 'none';
            armourContent.style.display = 'none';
            defenceTab.style.opacity = '1';
            dpsTab.style.opacity = '0.6';
            shieldTab.style.opacity = '0.6';
            evasionTab.style.opacity = '0.6';
            armourTab.style.opacity = '0.6';
        };
        
        dpsTab.onclick = () => {
            dpsTab.classList.add('active');
            defenceTab.classList.remove('active');
            shieldTab.classList.remove('active');
            evasionTab.classList.remove('active');
            armourTab.classList.remove('active');
            dpsContent.style.display = 'block';
            defenceContent.style.display = 'none';
            shieldContent.style.display = 'none';
            evasionContent.style.display = 'none';
            armourContent.style.display = 'none';
            dpsTab.style.opacity = '1';
            defenceTab.style.opacity = '0.6';
            shieldTab.style.opacity = '0.6';
            evasionTab.style.opacity = '0.6';
            armourTab.style.opacity = '0.6';
        };
        
        shieldTab.onclick = () => {
            shieldTab.classList.add('active');
            defenceTab.classList.remove('active');
            dpsTab.classList.remove('active');
            evasionTab.classList.remove('active');
            armourTab.classList.remove('active');
            shieldContent.style.display = 'block';
            defenceContent.style.display = 'none';
            dpsContent.style.display = 'none';
            evasionContent.style.display = 'none';
            armourContent.style.display = 'none';
            shieldTab.style.opacity = '1';
            defenceTab.style.opacity = '0.6';
            dpsTab.style.opacity = '0.6';
            evasionTab.style.opacity = '0.6';
            armourTab.style.opacity = '0.6';
        };
        
        evasionTab.onclick = () => {
            evasionTab.classList.add('active');
            defenceTab.classList.remove('active');
            dpsTab.classList.remove('active');
            shieldTab.classList.remove('active');
            armourTab.classList.remove('active');
            evasionContent.style.display = 'block';
            defenceContent.style.display = 'none';
            dpsContent.style.display = 'none';
            shieldContent.style.display = 'none';
            armourContent.style.display = 'none';
            evasionTab.style.opacity = '1';
            defenceTab.style.opacity = '0.6';
            dpsTab.style.opacity = '0.6';
            shieldTab.style.opacity = '0.6';
            armourTab.style.opacity = '0.6';
        };
        
        armourTab.onclick = () => {
            armourTab.classList.add('active');
            defenceTab.classList.remove('active');
            dpsTab.classList.remove('active');
            shieldTab.classList.remove('active');
            evasionTab.classList.remove('active');
            armourContent.style.display = 'block';
            defenceContent.style.display = 'none';
            dpsContent.style.display = 'none';
            shieldContent.style.display = 'none';
            evasionContent.style.display = 'none';
            armourTab.style.opacity = '1';
            defenceTab.style.opacity = '0.6';
            dpsTab.style.opacity = '0.6';
            shieldTab.style.opacity = '0.6';
            evasionTab.style.opacity = '0.6';
        };

        // 添加滚动条样式
        const style = document.createElement('style');
        style.textContent = `
            #dps-sort-content::-webkit-scrollbar,
            #shield-sort-content::-webkit-scrollbar,
            #evasion-sort-content::-webkit-scrollbar,
            #armour-sort-content::-webkit-scrollbar {
                width: 6px;
            }
            #dps-sort-content::-webkit-scrollbar-track,
            #shield-sort-content::-webkit-scrollbar-track,
            #evasion-sort-content::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            #dps-sort-content::-webkit-scrollbar-thumb,
            #shield-sort-content::-webkit-scrollbar-thumb,
            #evasion-sort-content::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 3px;
            }
            #dps-sort-content::-webkit-scrollbar-thumb:hover,
            #shield-sort-content::-webkit-scrollbar-thumb:hover,
            #evasion-sort-content::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            .dps-item {
                    padding: 4px 8px;
                    margin: 1px 0;
                    background: #2d2d2d;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    white-space: nowrap;
                    user-select: none;
                    line-height: 1.2;
            }
            .dps-item:hover {
                background: #3d3d3d;
            }
            .dps-item:last-child {
                margin-bottom: 0;
            }
            .dps-value {
                color: #FFD700;
                font-weight: bold;
            }
            .shield-value {
                color: #8acdff;
                font-weight: bold;
            }
            .evasion-value {
                color: #7FFF00;
                font-weight: bold;
            }
            .price-value {
                color: #8acdff;
                font-size: 12px;
                text-align: right;
            }
        `;

        // 组装面板
        panel.appendChild(titleBar);
        panel.appendChild(contentContainer);
        document.head.appendChild(style);
        document.body.appendChild(panel);

        console.log('Integrated panel created successfully');
        return panel;
    }

    // 计算闪避值
    function calculateEvasion() {
        console.log('Calculating Evasion...');
        const items = document.querySelectorAll('.row[data-id]');
        console.log('Found items:', items.length);

        let processedCount = 0;
        let successCount = 0;

        items.forEach((item, index) => {
            try {
                // 如果已经计算过闪避值，则跳过
                if (item.querySelector('.evasion-display')) {
                    processedCount++;
                    return;
                }

                // 1. 获取符文孔数量
                const socketsDiv = item.querySelector('.sockets');
                if (!socketsDiv) {
                    console.debug(`Item ${index}: No sockets div found`);
                    return;
                }

                // 修改符文孔数量的获取逻辑
                let numSockets = 0;
                for (let i = 1; i <= 6; i++) { // 假设最多6个符文孔
                    if (socketsDiv.classList.contains(`numSockets${i}`)) {
                        numSockets = i;
                        break;
                    }
                }
                if (numSockets === 0) {
                    // 尝试其他方式获取符文孔数量
                    const socketText = socketsDiv.textContent.trim();
                    if (socketText) {
                        numSockets = socketText.length;
                    } else {
                        numSockets = 1; // 默认值
                    }
                    console.debug(`Item ${index}: Using alternative socket count: ${numSockets}`);
                }

                // 2. 获取闪避值
                const evasionSpan = item.querySelector('span[data-field="ev"]');
                if (!evasionSpan) {
                    console.debug(`Item ${index}: No Evasion span found`);
                    return;
                }

                const evasionValue = evasionSpan.querySelector('.colourAugmented, .colourDefault');
                if (!evasionValue) {
                    console.debug(`Item ${index}: No Evasion value found`);
                    return;
                }

                const totalEvasion = parseInt(evasionValue.textContent);
                if (isNaN(totalEvasion)) {
                    console.debug(`Item ${index}: Invalid Evasion value: ${evasionValue.textContent}`);
                    return;
                }

                // 3. 获取当前品质
                let currentQuality = 0;
                const qualitySpan = item.querySelector('span[data-field="quality"]');
                if (qualitySpan) {
                    const qualityMatch = qualitySpan.textContent.match(/\+(\d+)%/);
                    if (qualityMatch) {
                        currentQuality = parseInt(qualityMatch[1]);
                    }
                }
                // 计算品质差值
                const qualityDiff = 20 - currentQuality;

                // 4. 获取闪避增加百分比
                let evasionInc = 0;

                // 定义可能包含闪避增加的词缀ID列表
                const possibleEvasionIncIds = [
                    'stat.explicit.stat_1999113824',  // 增加闪避与能量护盾
                    'stat.explicit.stat_2144192051',  // 增加闪避
                    'stat.explicit.stat_3489782002',  // 增加闪避和生命
                    'stat.explicit.stat_3321629045'   // 增加护甲与闪避
                ];

                // 遍历所有可能的词缀ID
                for (const statId of possibleEvasionIncIds) {
                    const statSpan = item.querySelector(`span[data-field="${statId}"]`);
                    if (statSpan) {
                        // 检查词缀文本是否包含"闪避"或"Evasion"
                        const statText = statSpan.textContent;
                        if (statText.includes('闪避') || statText.includes('Evasion')) {
                            // 提取百分比数值
                            const incMatch = statText.match(/(\d+)%/);
                            if (incMatch) {
                                evasionInc += parseInt(incMatch[1]);
                                console.debug(`Found Evasion increase: ${incMatch[1]}% from stat ${statId}`);
                            }
                        }
                    }
                }

                // 通用方法：查找所有包含"闪避"或"Evasion"的显式词缀
                const allExplicitStats = item.querySelectorAll('span[data-field^="stat.explicit.stat_"]');
                allExplicitStats.forEach(statSpan => {
                    // 检查是否已经在上面的特定ID列表中处理过
                    const statId = statSpan.getAttribute('data-field');
                    if (!possibleEvasionIncIds.includes(statId)) {
                        const statText = statSpan.textContent;
                        // 检查是否包含闪避相关文本和百分比增加
                        if ((statText.includes('闪避') || statText.includes('Evasion')) &&
                            statText.includes('%') &&
                            (statText.includes('增加') || statText.includes('increased'))) {
                            const incMatch = statText.match(/(\d+)%/);
                            if (incMatch) {
                                evasionInc += parseInt(incMatch[1]);
                                console.debug(`Found additional Evasion increase: ${incMatch[1]}% from stat ${statId}`);
                                // 将新发现的ID添加到列表中，以便将来使用
                                possibleEvasionIncIds.push(statId);
                            }
                        }
                    }
                });

                // 5. 获取已插入的符文提供的增益和数量
                let insertedRuneBonus = 0;
                let insertedRuneCount = 0;
                let evasionRuneInc = 0; // 专门用于记录闪避符文的增益

                // 获取符文增益 - 闪避增加
                const evasionRuneStatSpan = item.querySelector('span[data-field="stat.rune.stat_3523867985"]');
                if (evasionRuneStatSpan) {
                    const runeMatch = evasionRuneStatSpan.textContent.match(/(\d+)%/);
                    if (runeMatch) {
                        insertedRuneBonus = parseInt(runeMatch[1]);
                        insertedRuneCount = insertedRuneBonus / 20;
                    }
                }

                // 获取符文增益 - 闪避百分比增加
                const evasionIncRuneStatSpan = item.querySelector('span[data-field="stat.rune.stat_2866361420"]');
                if (evasionIncRuneStatSpan) {
                    const evasionIncRuneMatch = evasionIncRuneStatSpan.textContent.match(/(\d+)%/);
                    if (evasionIncRuneMatch) {
                        evasionRuneInc = parseInt(evasionIncRuneMatch[1]);
                    }
                }

                // 6. 计算可用的符文孔位增益
                let availableRuneBonus = 0;
                // 计算剩余可用的孔数
                const remainingSlots = numSockets - insertedRuneCount;
                availableRuneBonus = remainingSlots * 20;

                // 7. 计算基础闪避
                // 当前闪避 = 基础闪避 * (1 + 当前品质/100) * (1 + (已插入符文增益 + 装备增益 + 闪避符文增益)/100)
                const baseEvasion = Math.round(totalEvasion / (1 + currentQuality/100) / (1 + (insertedRuneBonus + evasionInc + evasionRuneInc)/100));

                // 8. 计算最大可能闪避（考虑品质提升和剩余符文孔）
                // 最大闪避 = 基础闪避 * (1 + (当前品质 + 品质差值)/100) * (1 + (装备增益 + 已插入符文增益 + 可用符文增益)/100)
                const maxEvasion = Math.round(baseEvasion * (1 + (currentQuality + qualityDiff)/100) * (1 + (evasionInc + insertedRuneBonus + availableRuneBonus)/100));

                // 创建闪避显示元素
                const evasionDisplay = document.createElement('span');
                evasionDisplay.className = 'evasion-display';
                evasionDisplay.style.cssText = `
                    color: #32CD32;
                    font-weight: bold;
                    margin-left: 10px;
                `;
                evasionDisplay.textContent = `总闪避: ${maxEvasion}`;

                // 将闪避显示添加到闪避后面
                evasionSpan.appendChild(evasionDisplay);

                successCount++;
                processedCount++;

                // 添加调试信息
                console.debug(`Item ${index} Evasion calculation:`, {
                    totalEvasion,
                    currentQuality,
                    qualityDiff,
                    evasionInc,
                    insertedRuneBonus,
                    insertedRuneCount,
                    numSockets,
                    availableRuneBonus,
                    baseEvasion,
                    maxEvasion
                });
            } catch (error) {
                console.error(`Error calculating evasion for item ${index}:`, error);
            }
        });

        console.log(`Evasion calculation completed: ${successCount} successful, ${processedCount} processed out of ${items.length} items`);

        // 更新闪避排序面板
        updateEvasionPanel();
    }

    // 创建闪避排序面板
    function createEvasionPanel() {
        const panel = document.createElement('div');
        panel.id = 'evasion-sort-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(calc(-50% + 400px));
            background: rgba(28, 28, 28, 0.95);
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            width: 180px;
            max-height: 60vh;
            z-index: 9997;
            display: none;
        `;

        // 添加标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            color: #7FFF00;
            margin-bottom: 6px;
            padding-bottom: 3px;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            user-select: none;
            height: 18px;
        `;

        // 添加展开/收起指示器
        const indicator = document.createElement('span');
        indicator.textContent = '▼';
        indicator.style.marginRight = '3px';
        indicator.style.fontSize = '10px';
        indicator.id = 'integrated-panel-indicator';

        const titleText = document.createElement('span');
        titleText.textContent = 'EV';

        const titleLeft = document.createElement('div');
        titleLeft.style.display = 'flex';
        titleLeft.style.alignItems = 'center';
        titleLeft.appendChild(indicator);
        titleLeft.appendChild(titleText);

        title.appendChild(titleLeft);

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        };
        title.appendChild(closeBtn);

        // 添加内容容器
        const content = document.createElement('div');
        content.id = 'evasion-sort-content';
        content.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out;
            padding-right: 2px;
        `;

        // 添加展开/收起功能
        let isExpanded = true;
        title.onclick = () => {
            isExpanded = !isExpanded;
            content.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            content.style.overflow = isExpanded ? 'auto' : 'hidden';
            indicator.textContent = isExpanded ? '▼' : '▶';
        };

        // 添加组件到面板
        panel.appendChild(title);
        panel.appendChild(content);

        // 添加到文档
        document.body.appendChild(panel);

        console.log('Evasion panel created successfully');
        return panel;
    }

    // 更新闪避排序面板
    function updateEvasionPanel() {
        try {
            console.log('Updating evasion panel...');

            // 获取或创建面板
            const panel = document.getElementById('integrated-sort-panel') || createIntegratedPanel();
            const content = document.getElementById('evasion-sort-content');
            if (!content) {
                console.error('Evasion sort content not found');
                return;
            }

            // 清空现有内容
            content.innerHTML = '';

            // 清除可能存在的旧数据属性
            content.removeAttribute('data-armour-content');
            content.removeAttribute('data-shield-content');
            content.removeAttribute('data-dps-content');
            content.removeAttribute('data-defence-content');

            // 获取所有物品
            const items = document.querySelectorAll('.row[data-id]');
            const evasionData = [];

            // 收集闪避数据
            items.forEach(item => {
                const evasionDisplay = item.querySelector('.evasion-display');
                if (evasionDisplay) {
                    const evasion = parseInt(evasionDisplay.textContent.replace('总闪避: ', ''));

                    // 获取价格
                    const priceElement = item.querySelector('.price [data-field="price"]');
                    let price = '未标价';
                    if (priceElement) {
                        const amount = priceElement.querySelector('span:not(.price-label):not(.currency-text)');
                        const currencyText = priceElement.querySelector('.currency-text');
                        if (amount && currencyText) {
                            const amountText = amount.textContent.trim();
                            const currency = currencyText.querySelector('span')?.textContent || currencyText.textContent;
                            // 使用全局的convertCurrencyText函数
                            const simpleCurrency = convertCurrencyText(currency);
                            price = `${amountText}${simpleCurrency}`;
                        }
                    }

                    evasionData.push({
                        evasion,
                        price,
                        element: item
                    });
                }
            });

            console.log(`Found ${evasionData.length} items with evasion data`);

            // 如果没有闪避数据，隐藏闪避选项卡
            const evasionTab = panel.querySelector('[data-tab="evasion"]');
            if (evasionData.length === 0) {
                if (evasionTab) evasionTab.style.display = 'none';

                // 如果其他选项卡也是隐藏的，则隐藏整个面板
                const dpsTab = panel.querySelector('[data-tab="dps"]');
                const shieldTab = panel.querySelector('[data-tab="shield"]');
                const armourTab = panel.querySelector('[data-tab="armour"]');
                const defenceTab = panel.querySelector('[data-tab="defence"]');
                
                // 检查是否所有选项卡都隐藏了
                if ((dpsTab && dpsTab.style.display === 'none') &&
                    (shieldTab && shieldTab.style.display === 'none') &&
                    (armourTab && armourTab.style.display === 'none') &&
                    (defenceTab && defenceTab.style.display === 'none')) {
                    panel.style.display = 'none';
                }
                // 移除自动切换到其他选项卡的代码，保留当前选项卡状态
                return;
            } else {
                // 有闪避数据，确保闪避选项卡可见
                if (evasionTab) evasionTab.style.display = '';
            }

            // 按闪避值从高到低排序
            evasionData.sort((a, b) => b.evasion - a.evasion);

            // 更新面板内容
            evasionData.forEach(({evasion, price, element}) => {
                const evasionItem = document.createElement('div');
                evasionItem.className = 'dps-item'; // 复用DPS项的样式

                // 创建闪避显示
                const evasionText = document.createElement('span');
                evasionText.className = 'evasion-value'; // 使用闪避专用的样式
                evasionText.textContent = evasion.toString();

                // 创建价格显示
                const priceText = document.createElement('span');
                priceText.className = 'price-value';
                priceText.textContent = price;
                
                // 添加到闪避项
                evasionItem.appendChild(evasionText);
                evasionItem.appendChild(priceText);
                
                // 添加点击事件
                evasionItem.onclick = () => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 添加高亮效果
                    element.style.transition = 'background-color 0.3s';
                    element.style.backgroundColor = 'rgba(127, 255, 0, 0.2)';
                    setTimeout(() => {
                        element.style.backgroundColor = '';
                    }, 1500);
                };

                content.appendChild(evasionItem);
            });

            // 显示面板
            panel.style.display = 'block';
            console.log('Evasion panel updated successfully');
        } catch (error) {
            console.error('Error updating evasion panel:', error);
        }
    }

    // 计算护甲值
    function calculateArmour() {
        console.log('Calculating Armour...');
        const items = document.querySelectorAll('.row[data-id]');
        console.log('Found items:', items.length);

        let processedCount = 0;
        let successCount = 0;

        items.forEach((item, index) => {
            try {
                // 如果已经计算过护甲值，则跳过
                if (item.querySelector('.armour-display')) {
                    processedCount++;
                    return;
                }

                // 1. 获取符文孔数量
                const socketsDiv = item.querySelector('.sockets');
                if (!socketsDiv) {
                    console.debug(`Item ${index}: No sockets div found`);
                    return;
                }

                // 修改符文孔数量的获取逻辑
                let numSockets = 0;
                for (let i = 1; i <= 6; i++) { // 假设最多6个符文孔
                    if (socketsDiv.classList.contains(`numSockets${i}`)) {
                        numSockets = i;
                        break;
                    }
                }
                if (numSockets === 0) {
                    // 尝试其他方式获取符文孔数量
                    const socketText = socketsDiv.textContent.trim();
                    if (socketText) {
                        numSockets = socketText.length;
                    } else {
                        numSockets = 1; // 默认值
                    }
                    console.debug(`Item ${index}: Using alternative socket count: ${numSockets}`);
                }

                // 2. 获取护甲值
                const armourSpan = item.querySelector('span[data-field="ar"]');
                if (!armourSpan) {
                    console.debug(`Item ${index}: No Armour span found`);
                    return;
                }

                const armourValue = armourSpan.querySelector('.colourAugmented, .colourDefault');
                if (!armourValue) {
                    console.debug(`Item ${index}: No Armour value found`);
                    return;
                }

                const totalArmour = parseInt(armourValue.textContent);
                if (isNaN(totalArmour)) {
                    console.debug(`Item ${index}: Invalid Armour value: ${armourValue.textContent}`);
                    return;
                }

                // 3. 获取当前品质
                let currentQuality = 0;
                const qualitySpan = item.querySelector('span[data-field="quality"]');
                if (qualitySpan) {
                    const qualityMatch = qualitySpan.textContent.match(/\+(\d+)%/);
                    if (qualityMatch) {
                        currentQuality = parseInt(qualityMatch[1]);
                    }
                }
                // 计算品质差值
                const qualityDiff = 20 - currentQuality;

                // 4. 获取护甲增加百分比
                let armourInc = 0;

                // 定义可能包含护甲增加的词缀ID列表
                const possibleArmourIncIds = [
                    'stat.explicit.stat_3321629045',  // 增加护甲与能量护盾
                    'stat.explicit.stat_2866361420',  // 增加护甲
                    'stat.explicit.stat_2511217560',  // 增加最大护甲
                    'stat.explicit.stat_3489782002'   // 增加护甲和生命
                ];

                // 遍历所有可能的词缀ID
                for (const statId of possibleArmourIncIds) {
                    const statSpan = item.querySelector(`span[data-field="${statId}"]`);
                    if (statSpan) {
                        // 检查词缀文本是否包含"护甲"或"Armour"
                        const statText = statSpan.textContent;
                        if (statText.includes('护甲') || statText.includes('Armour')) {
                            // 提取百分比数值
                            const incMatch = statText.match(/(\d+)%/);
                            if (incMatch) {
                                armourInc += parseInt(incMatch[1]);
                                console.debug(`Found Armour increase: ${incMatch[1]}% from stat ${statId}`);
                            }
                        }
                    }
                }

                // 通用方法：查找所有包含"护甲"或"Armour"的显式词缀
                const allExplicitStats = item.querySelectorAll('span[data-field^="stat.explicit.stat_"]');
                allExplicitStats.forEach(statSpan => {
                    // 检查是否已经在上面的特定ID列表中处理过
                    const statId = statSpan.getAttribute('data-field');
                    if (!possibleArmourIncIds.includes(statId)) {
                        const statText = statSpan.textContent;
                        // 检查是否包含护甲相关文本和百分比增加
                        if ((statText.includes('护甲') || statText.includes('Armour')) &&
                            statText.includes('%') &&
                            (statText.includes('增加') || statText.includes('increased'))) {
                            const incMatch = statText.match(/(\d+)%/);
                            if (incMatch) {
                                armourInc += parseInt(incMatch[1]);
                                console.debug(`Found additional Armour increase: ${incMatch[1]}% from stat ${statId}`);
                                // 将新发现的ID添加到列表中，以便将来使用
                                possibleArmourIncIds.push(statId);
                            }
                        }
                    }
                });

                // 5. 获取已插入的符文提供的增益和数量
                let insertedRuneBonus = 0;
                let insertedRuneCount = 0;
                let armourRuneInc = 0; // 专门用于记录护甲符文的增益

                // 获取符文增益 - 护甲增加
                const armourRuneStatSpan = item.querySelector('span[data-field="stat.rune.stat_3523867985"]');
                if (armourRuneStatSpan) {
                    const runeMatch = armourRuneStatSpan.textContent.match(/(\d+)%/);
                    if (runeMatch) {
                        insertedRuneBonus = parseInt(runeMatch[1]);
                        insertedRuneCount = insertedRuneBonus / 20;
                    }
                }

                // 获取符文增益 - 护甲百分比增加
                const armourIncRuneStatSpan = item.querySelector('span[data-field="stat.rune.stat_2866361420"]');
                if (armourIncRuneStatSpan) {
                    const armourIncRuneMatch = armourIncRuneStatSpan.textContent.match(/(\d+)%/);
                    if (armourIncRuneMatch) {
                        armourRuneInc = parseInt(armourIncRuneMatch[1]);
                    }
                }

                // 6. 计算可用的符文孔位增益
                let availableRuneBonus = 0;
                // 计算剩余可用的孔数
                const remainingSlots = numSockets - insertedRuneCount;
                availableRuneBonus = remainingSlots * 20;

                // 7. 计算基础护甲
                // 当前护甲 = 基础护甲 * (1 + 当前品质/100) * (1 + (已插入符文增益 + 装备增益 + 护甲符文增益)/100)
                const baseArmour = Math.round(totalArmour / (1 + currentQuality/100) / (1 + (insertedRuneBonus + armourInc + armourRuneInc)/100));

                // 8. 计算最大可能护甲（考虑品质提升和剩余符文孔）
                // 最大护甲 = 基础护甲 * (1 + (当前品质 + 品质差值)/100) * (1 + (装备增益 + 已插入符文增益 + 可用符文增益)/100)
                const maxArmour = Math.round(baseArmour * (1 + (currentQuality + qualityDiff)/100) * (1 + (armourInc + insertedRuneBonus + availableRuneBonus)/100));

                // 创建护甲显示元素
                const armourDisplay = document.createElement('span');
                armourDisplay.className = 'armour-display';
                armourDisplay.style.cssText = `
                    color: #CD853F;
                    font-weight: bold;
                    margin-left: 10px;
                `;
                armourDisplay.textContent = `总护甲: ${maxArmour}`;

                // 将护甲显示添加到护甲后面
                armourSpan.appendChild(armourDisplay);

                successCount++;
                processedCount++;

                // 添加调试信息
                console.debug(`Item ${index} Armour calculation:`, {
                    totalArmour,
                    currentQuality,
                    qualityDiff,
                    armourInc,
                    insertedRuneBonus,
                    insertedRuneCount,
                    numSockets,
                    availableRuneBonus,
                    baseArmour,
                    maxArmour
                });
            } catch (error) {
                console.error(`Error calculating armour for item ${index}:`, error);
            }
        });

        console.log(`Armour calculation completed: ${successCount} successful, ${processedCount} processed out of ${items.length} items`);

        // 更新护甲排序面板
        updateArmourPanel();
    }

    // 创建护甲排序面板
    function createArmourPanel() {
        const panel = document.createElement('div');
        panel.id = 'armour-sort-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(calc(-50% + 600px));
            background: rgba(28, 28, 28, 0.95);
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            width: 180px;
            max-height: 60vh;
            z-index: 9997;
            display: none;
        `;

        // 添加标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            color: #FF6347;
            margin-bottom: 6px;
            padding-bottom: 3px;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-size: 14px;
            user-select: none;
            height: 18px;
        `;

        // 添加展开/收起指示器
        const indicator = document.createElement('span');
        indicator.textContent = '▼';
        indicator.style.marginRight = '3px';
        indicator.style.fontSize = '10px';
        indicator.id = 'integrated-panel-indicator';

        const titleText = document.createElement('span');
        titleText.textContent = 'AR';

        const titleLeft = document.createElement('div');
        titleLeft.style.display = 'flex';
        titleLeft.style.alignItems = 'center';
        titleLeft.appendChild(indicator);
        titleLeft.appendChild(titleText);

        title.appendChild(titleLeft);

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        };
        title.appendChild(closeBtn);

        // 添加内容容器
        const content = document.createElement('div');
        content.id = 'armour-sort-content';
        content.style.cssText = `
            max-height: calc(60vh - 35px);
            overflow-y: auto;
            transition: max-height 0.3s ease-out;
            padding-right: 2px;
        `;

        // 添加展开/收起功能
        let isExpanded = true;
        title.onclick = () => {
            isExpanded = !isExpanded;
            content.style.maxHeight = isExpanded ? 'calc(60vh - 35px)' : '0';
            content.style.overflow = isExpanded ? 'auto' : 'hidden';
            indicator.textContent = isExpanded ? '▼' : '▶';
        };

        // 添加组件到面板
        panel.appendChild(title);
        panel.appendChild(content);

        // 添加到文档
        document.body.appendChild(panel);

        console.log('Armour panel created successfully');
        return panel;
    }

    // 更新护甲排序面板
    function updateArmourPanel() {
        try {
            console.log('Updating armour panel...');

            // 获取或创建面板
            const panel = document.getElementById('integrated-sort-panel') || createIntegratedPanel();
            const content = document.getElementById('armour-sort-content');
            if (!content) {
                console.error('Armour sort content not found');
                return;
            }

            // 清空现有内容
            content.innerHTML = '';

            // 获取所有物品
            const items = document.querySelectorAll('.row[data-id]');
            const armourData = [];

            // 收集护甲数据
            items.forEach(item => {
                const armourDisplay = item.querySelector('.armour-display');
                if (armourDisplay) {
                    const armour = parseInt(armourDisplay.textContent.replace('总护甲: ', ''));

                    // 获取价格
                    const priceElement = item.querySelector('.price [data-field="price"]');
                    let price = '未标价';
                    if (priceElement) {
                        const amount = priceElement.querySelector('span:not(.price-label):not(.currency-text)');
                        const currencyText = priceElement.querySelector('.currency-text');
                        if (amount && currencyText) {
                            const amountText = amount.textContent.trim();
                            const currency = currencyText.querySelector('span')?.textContent || currencyText.textContent;
                            // 使用全局的convertCurrencyText函数
                            const simpleCurrency = convertCurrencyText(currency);
                            price = `${amountText}${simpleCurrency}`;
                        }
                    }

                    armourData.push({
                        armour,
                        price,
                        element: item
                    });
                }
            });

            console.log(`Found ${armourData.length} items with armour data`);

            // 如果没有护甲数据，隐藏护甲选项卡
            const armourTab = panel.querySelector('[data-tab="armour"]');
            if (armourData.length === 0) {
                if (armourTab) armourTab.style.display = 'none';

                // 如果其他选项卡也是隐藏的，则隐藏整个面板
                const dpsTab = panel.querySelector('[data-tab="dps"]');
                const shieldTab = panel.querySelector('[data-tab="shield"]');
                const evasionTab = panel.querySelector('[data-tab="evasion"]');
                const defenceTab = panel.querySelector('[data-tab="defence"]');
                
                // 检查是否所有选项卡都隐藏了
                if ((dpsTab && dpsTab.style.display === 'none') &&
                    (shieldTab && shieldTab.style.display === 'none') &&
                    (evasionTab && evasionTab.style.display === 'none') &&
                    (defenceTab && defenceTab.style.display === 'none')) {
                    panel.style.display = 'none';
                }
                // 移除自动切换到其他选项卡的代码，保留当前选项卡状态
                return;
            } else {
                // 有护甲数据，确保护甲选项卡可见
                if (armourTab) armourTab.style.display = '';
            }

            // 按护甲值从高到低排序
            armourData.sort((a, b) => b.armour - a.armour);

            // 更新面板内容
            armourData.forEach(({armour, price, element}) => {
                const armourItem = document.createElement('div');
                armourItem.className = 'dps-item'; // 复用DPS项的样式

                // 创建护甲显示
                const armourText = document.createElement('span');
                armourText.className = 'armour-value'; // 使用护甲专用的样式
                armourText.textContent = armour.toString();

                // 创建价格显示
                const priceText = document.createElement('span');
                priceText.className = 'price-value';
                priceText.textContent = price;

                // 添加到护甲项
                armourItem.appendChild(armourText);
                armourItem.appendChild(priceText);

                // 添加点击事件
                armourItem.onclick = () => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 添加高亮效果
                    element.style.transition = 'background-color 0.3s';
                    element.style.backgroundColor = 'rgba(255, 99, 71, 0.2)';
                    setTimeout(() => {
                        element.style.backgroundColor = '';
                    }, 1500);
                };

                content.appendChild(armourItem);
            });

            // 显示面板
            panel.style.display = 'block';
            console.log('Armour panel updated successfully');
        } catch (error) {
            console.error('Error updating armour panel:', error);
        }
    }

    // 计算总防御值（护盾+闪避+护甲）
    function calculateDefence() {
        console.log('Calculating Defence...');
        const items = document.querySelectorAll('.row[data-id]');
        console.log('Found items:', items.length);
        
        let processedCount = 0;
        let successCount = 0;
        
        items.forEach((item, index) => {
            try {
                // 如果已经计算过总防御值，则跳过
                if (item.querySelector('.defence-display')) {
                    processedCount++;
                    return;
                }

                // 获取护盾、闪避和护甲值
                let totalDefence = 0;
                
                // 获取护盾值
                const shieldDisplay = item.querySelector('.shield-display');
                if (shieldDisplay) {
                    const shield = parseInt(shieldDisplay.textContent.replace('总护盾: ', ''));
                    if (!isNaN(shield)) {
                        totalDefence += shield;
                    }
                }
                
                // 获取闪避值
                const evasionDisplay = item.querySelector('.evasion-display');
                if (evasionDisplay) {
                    const evasion = parseInt(evasionDisplay.textContent.replace('总闪避: ', ''));
                    if (!isNaN(evasion)) {
                        totalDefence += evasion;
                    }
                }
                
                // 获取护甲值
                const armourDisplay = item.querySelector('.armour-display');
                if (armourDisplay) {
                    const armour = parseInt(armourDisplay.textContent.replace('总护甲: ', ''));
                    if (!isNaN(armour)) {
                        totalDefence += armour;
                    }
                }

                // 创建总防御显示元素
                const defenceDisplay = document.createElement('span');
                defenceDisplay.className = 'defence-display';
                defenceDisplay.style.cssText = `
                    color: #9370DB;
                    font-weight: bold;
                    margin-left: 5px;
                    font-size: 14px;
                    background-color: rgba(147, 112, 219, 0.1);
                    padding: 1px 4px;
                    border-radius: 3px;
                `;
                defenceDisplay.textContent = `DEF: ${totalDefence}`;

                // 将总防御显示添加到装备名称旁边
                const itemHeader = item.querySelector('.itemHeader');
                if (itemHeader) {
                    // 找到装备名称元素
                    const itemName = itemHeader.querySelector('.itemName');
                    if (itemName) {
                        // 添加到装备名称后面
                        itemName.appendChild(defenceDisplay);
                    } else {
                        // 如果找不到装备名称，直接添加到itemHeader
                        itemHeader.appendChild(defenceDisplay);
                    }
                } else {
                    // 如果找不到itemHeader，尝试添加到其他位置
                    const esSpan = item.querySelector('span[data-field="es"]');
                    const evSpan = item.querySelector('span[data-field="ev"]');
                    const arSpan = item.querySelector('span[data-field="ar"]');
                    
                    if (esSpan) {
                        esSpan.appendChild(defenceDisplay);
                    } else if (evSpan) {
                        evSpan.appendChild(defenceDisplay);
                    } else if (arSpan) {
                        arSpan.appendChild(defenceDisplay);
                    }
                }
                
                successCount++;
                processedCount++;

                // 添加调试信息
                console.debug(`Item ${index} Defence calculation: ${totalDefence}`);
            } catch (error) {
                console.error(`Error calculating defence for item ${index}:`, error);
            }
        });

        console.log(`Defence calculation completed: ${successCount} successful, ${processedCount} processed out of ${items.length} items`);

        // 更新总防御排序面板
        updateDefencePanel();
    }

    // 更新总防御排序面板
    function updateDefencePanel() {
        try {
            console.log('Updating defence panel...');
            
            // 获取或创建面板
            const panel = document.getElementById('integrated-sort-panel') || createIntegratedPanel();
            const content = document.getElementById('defence-sort-content');
            if (!content) {
                console.error('Defence sort content not found');
                return;
            }

            // 清空现有内容
            content.innerHTML = '';
            
            // 清除可能存在的旧数据属性
            content.removeAttribute('data-shield-content');
            content.removeAttribute('data-evasion-content');
            content.removeAttribute('data-armour-content');
            content.removeAttribute('data-dps-content');

            // 获取所有物品
            const items = document.querySelectorAll('.row[data-id]');
            const defenceData = [];

            // 收集总防御数据
            items.forEach(item => {
                const defenceDisplay = item.querySelector('.defence-display');
                if (defenceDisplay) {
                    const defence = parseInt(defenceDisplay.textContent.replace('DEF: ', ''));
                    
                    // 获取价格
                    const priceElement = item.querySelector('.price [data-field="price"]');
                    let price = '未标价';
                    if (priceElement) {
                        const amount = priceElement.querySelector('span:not(.price-label):not(.currency-text)');
                        const currencyText = priceElement.querySelector('.currency-text');
                        if (amount && currencyText) {
                            const amountText = amount.textContent.trim();
                            const currency = currencyText.querySelector('span')?.textContent || currencyText.textContent;
                            // 使用全局的convertCurrencyText函数
                            const simpleCurrency = convertCurrencyText(currency);
                            price = `${amountText}${simpleCurrency}`;
                        }
                    }

                    defenceData.push({
                        defence,
                        price,
                        element: item
                    });
                }
            });

            console.log(`Found ${defenceData.length} items with defence data`);

            // 如果没有总防御数据，隐藏总防御选项卡
            const defenceTab = panel.querySelector('[data-tab="defence"]');
            if (defenceData.length === 0) {
                if (defenceTab) defenceTab.style.display = 'none';
                
                // 如果其他选项卡也是隐藏的，则隐藏整个面板
                const dpsTab = panel.querySelector('[data-tab="dps"]');
                const shieldTab = panel.querySelector('[data-tab="shield"]');
                const evasionTab = panel.querySelector('[data-tab="evasion"]');
                const armourTab = panel.querySelector('[data-tab="armour"]');
                
                // 检查是否所有选项卡都隐藏了
                if ((dpsTab && dpsTab.style.display === 'none') && 
                    (shieldTab && shieldTab.style.display === 'none') &&
                    (evasionTab && evasionTab.style.display === 'none') &&
                    (armourTab && armourTab.style.display === 'none')) {
                    panel.style.display = 'none';
                }
                // 移除自动切换到其他选项卡的代码，保留当前选项卡状态
                return;
            } else {
                // 有总防御数据，确保总防御选项卡可见
                if (defenceTab) defenceTab.style.display = '';
            }

            // 按总防御值从高到低排序
            defenceData.sort((a, b) => b.defence - a.defence);

            // 更新面板内容
            defenceData.forEach(({defence, price, element}) => {
                const defenceItem = document.createElement('div');
                defenceItem.className = 'dps-item'; // 复用DPS项的样式
                
                // 创建总防御显示
                const defenceText = document.createElement('span');
                defenceText.className = 'defence-value';
                defenceText.textContent = defence.toString();
                
                // 创建价格显示
                const priceText = document.createElement('span');
                priceText.className = 'price-value';
                priceText.textContent = price;
                
                // 添加到总防御项
                defenceItem.appendChild(defenceText);
                defenceItem.appendChild(priceText);
                
                // 添加点击事件
                defenceItem.onclick = () => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 添加高亮效果
                    element.style.transition = 'background-color 0.3s';
                    element.style.backgroundColor = 'rgba(147, 112, 219, 0.2)';
                    setTimeout(() => {
                        element.style.backgroundColor = '';
                    }, 1500);
                };

                content.appendChild(defenceItem);
            });

            // 显示面板
            panel.style.display = 'block';
            console.log('Defence panel updated successfully');
        } catch (error) {
            console.error('Error updating defence panel:', error);
        }
    }
})();