// ==UserScript==
// @name         全能搜索引擎切换助手
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在搜索结果页面添加智能搜索引擎切换功能,支持多种布局和自定义设置
// @match        *://www.google.com/search*
// @match        *://www.google.co*/search*
// @match        *://www.google.com.*/search*
// @match        *://google.*/search*
// @match        https://www.google.com.hk/search*
// @match        www.google.com.hk/search*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.baidu.com/s*
// @match        *://www.sogou.com/web*
// @match        *://www.so.com/s*
// @match        *://duckduckgo.com/*
// @match        *://newtab/
// @match        *://www.google.com/
// @match        *://www.google.co*/
// @match        *://www.google.com.*/
// @match        about:blank
// @match        chrome://newtab/
// @author       Yuze
// @copyright    2025, Yuze (https://greasyfork.org/users/Yuze Guitar)
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527991/%E5%85%A8%E8%83%BD%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527991/%E5%85%A8%E8%83%BD%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 记录调试信息
    const DEBUG = true;
    function log(...args) {
        if (DEBUG) {
            console.log('[搜索引擎切换助手]', ...args);
        }
    }

    // 全局错误处理增强
    let errorRecoveryAttempts = 0;
    const MAX_RECOVERY_ATTEMPTS = 3;
    const ERROR_RECOVERY_DELAY = 1000; // 毫秒

    // 错误处理升级
    function handleError(error, context) {
        console.error(`[搜索引擎切换助手] 错误 (${context}):`, error);
        
        // 记录更详细的错误信息
        if (error && error.stack) {
            console.error(`[搜索引擎切换助手] 错误堆栈:`, error.stack);
        }
        
        // 如果是特定类型的错误,尝试恢复
        if (context === '创建搜索引擎切换器UI') {
            // 尝试创建一个最小化版本的UI
            try {
                setTimeout(() => {
                    createMinimalUI();
                }, 1000);
            } catch (e) {
                console.error('[搜索引擎切换助手] 无法创建备用UI:', e);
            }
        }
    }

    // 创建最小化版本的UI作为备选
    function createMinimalUI() {
        try {
            const minimalUI = document.createElement('div');
            minimalUI.id = 'search-engine-switcher-minimal';
            minimalUI.style.position = 'fixed';
            minimalUI.style.top = '10px';
            minimalUI.style.left = '10px';
            minimalUI.style.zIndex = '9999';
            minimalUI.style.background = '#fff';
            minimalUI.style.padding = '5px 10px';
            minimalUI.style.borderRadius = '4px';
            minimalUI.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            minimalUI.style.fontSize = '14px';
            minimalUI.style.cursor = 'pointer';
            minimalUI.textContent = '搜索引擎切换';
            
            minimalUI.addEventListener('click', function() {
                const { currentEngine, query } = getCurrentEngineAndQuery();
                if (currentEngine && query) {
                    // 显示简单的引擎选择菜单
                    showSimpleEngineMenu(minimalUI, currentEngine, query);
                }
            });
            
            document.body.appendChild(minimalUI);
        } catch (error) {
            console.error('[搜索引擎切换助手] 创建最小化UI失败:', error);
        }
    }

    // 显示简单的引擎选择菜单
    function showSimpleEngineMenu(anchor, currentEngine, query) {
        try {
            // 移除现有菜单
            const existingMenu = document.getElementById('simple-engine-menu');
            if (existingMenu) {
                existingMenu.remove();
            }
            
            // 创建菜单
            const menu = document.createElement('div');
            menu.id = 'simple-engine-menu';
            menu.style.position = 'absolute';
            menu.style.top = '30px';
            menu.style.left = '0';
            menu.style.background = '#fff';
            menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            menu.style.borderRadius = '4px';
            menu.style.padding = '5px 0';
            menu.style.zIndex = '10000';
            
            // 添加引擎选项
            for (const engine of defaultEngines) {
                if (engine.name === currentEngine.name) continue;
                
                const item = document.createElement('div');
                item.style.padding = '8px 15px';
                item.style.cursor = 'pointer';
                item.style.hoverBackground = '#f5f5f5';
                item.textContent = engine.name;
                
                item.addEventListener('click', function() {
                    const url = engine.url.replace('{query}', encodeURIComponent(query));
                    window.location.href = url;
                });
                
                item.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f5f5f5';
                });
                
                item.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '';
                });
                
                menu.appendChild(item);
            }
            
            // 添加到页面
            anchor.appendChild(menu);
            
            // 点击外部关闭菜单
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== anchor) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        } catch (error) {
            console.error('[搜索引擎切换助手] 显示简单菜单失败:', error);
        }
    }

    // 检测操作系统
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? '⌘' : 'Alt+';
    const modifierKeyCode = isMac ? 'metaKey' : 'altKey';

    // 定义搜索引擎
    const defaultEngines = [
        {
            name: 'Google',
            icon: 'https://www.google.com/favicon.ico',
            url: 'https://www.google.com/search?q={query}',
            matchPattern: 'google\\.[^/]+/search',
            queryParam: 'q',
            shortcut: 'G'
        },
        {
            name: 'Bing',
            icon: 'https://www.bing.com/favicon.ico',
            url: 'https://www.bing.com/search?q={query}',
            matchPattern: 'bing\\.com/search',
            queryParam: 'q',
            shortcut: 'B'
        },
        {
            name: '百度',
            icon: 'https://www.baidu.com/favicon.ico',
            url: 'https://www.baidu.com/s?wd={query}',
            matchPattern: 'baidu\\.com/s',
            queryParam: 'wd',
            shortcut: 'D'
        },
        {
            name: 'DuckDuckGo',
            // 内置图标数据,确保在任何环境下都能显示
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0RFNTgzMyIgZD0iTTEyIDFDNS45MiAxIDEgNS45MiAxIDEyczQuOTIgMTEgMTEgMTEgMTEtNC45MiAxMS0xMVMxOC4wOCAxIDEyIDF6bTMuNTggMTQuMWMwIC4wOS0uMDUuMi0uMTMuMjdsLS45My43Ni0uMDIuMDJhLjM4LjM4IDAgMCAxLS4yOC4xMmgtNS4xM2MtLjIyIDAtLjQtLjE4LS40LS40di0uOTctLjAxYzAtLjIyLjE4LS40LjQtLjRoNS4xNWEuMzguMzggMCAwIDEgLjI2LjEybC4wMS4wMi45My43NmEuMzQuMzQgMCAwIDEgLjEzLjI3eiIvPjwvc3ZnPg==',
            url: 'https://duckduckgo.com/?q={query}',
            matchPattern: 'duckduckgo\\.com',
            queryParam: 'q',
            shortcut: 'K'
        }
    ];

    // 在defaultEngines数组后添加图标缓存系统
    const iconCache = {
        cache: {},
        
        // 获取图标,优先从缓存获取
        async getIcon(url) {
            try {
                // 如果是数据URL,直接返回
                if (!url || url.startsWith('data:')) {
                    return url;
                }
                
                // 检查缓存
                if (this.cache[url]) {
                    return this.cache[url];
                }
                
                // 尝试获取图标
                try {
                    // 简单地返回原始URL,不进行转换
                    // 在实际应用中,这里可以添加图标转换为dataURL的逻辑
                    this.cache[url] = url;
                    return url;
                } catch (error) {
                    console.warn(`无法获取图标: ${url}`, error);
                    return url;
                }
            } catch (e) {
                console.warn('图标缓存系统错误', e);
                return url;
            }
        },
        
        // 从字符串生成哈希值的辅助函数
        hashString(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 转换为32位整数
            }
            return Math.abs(hash).toString(16);
        }
    };

    // 在defaultEngines数组后添加快捷搜索前缀配置
    const quickSearchPrefixes = [
        {
            prefix: 'gh ',
            name: 'GitHub',
            url: 'https://github.com/search?q={query}&type=repositories',
            icon: 'https://github.com/favicon.ico',
            description: '在GitHub上搜索仓库'
        },
        {
            prefix: 'so ',
            name: 'Stack Overflow',
            url: 'https://stackoverflow.com/search?q={query}',
            icon: 'https://stackoverflow.com/favicon.ico',
            description: '在Stack Overflow上搜索问题'
        },
        {
            prefix: 'npm ',
            name: 'NPM包',
            url: 'https://www.npmjs.com/search?q={query}',
            icon: 'https://static.npmjs.com/favicon.ico',
            description: '搜索NPM包'
        },
        {
            prefix: 'yt ',
            name: 'YouTube',
            url: 'https://youtube.com/results?search_query={query}',
            icon: 'https://www.youtube.com/favicon.ico',
            description: '在YouTube上搜索视频'
        },
        {
            prefix: 'bili ',
            name: '哔哩哔哩',
            url: 'https://www.bilibili.com/search?keyword={query}',
            icon: 'https://www.bilibili.com/favicon.ico',
            description: '在B站搜索视频'
        },
        {
            prefix: 'zh ',
            name: '知乎',
            url: 'https://www.zhihu.com/search?type=content&q={query}',
            icon: 'https://static.zhihu.com/heifetz/favicon.ico',
            description: '在知乎搜索'
        }
    ];

    // 添加CSS样式
    function addStyles() {
        try {
            GM_addStyle(`
                /* 主容器 - 增加拖拽支持 */
                #search-engine-switcher {
                    position: fixed;
                    top: 120px;
                    left: 10px;
                    z-index: 9999;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    padding: 10px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    font-size: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    transition: background 0.3s ease, box-shadow 0.3s ease;
                    min-width: 120px;
                    max-width: 180px;
                    cursor: move; /* 指示可拖动 */
                    touch-action: none; /* 触摸设备支持 */
                    user-select: none; /* 防止拖动时选中文本 */
                }

                /* 深色模式 */
                @media (prefers-color-scheme: dark) {
                    #search-engine-switcher {
                        background: #333;
                        color: #fff;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
                    }
                    #search-engine-switcher .engine-btn {
                        color: #eee;
                    }
                    #search-engine-switcher .engine-btn:hover {
                        background: #444;
                    }
                    #search-engine-switcher .collapse-btn {
                        color: #ccc;
                    }
                    #search-engine-switcher.collapsed {
                        background: rgba(51, 51, 51, 0.9);
                    }
                }

                /* 折叠状态 - 优化折叠后的外观 */
                #search-engine-switcher.collapsed {
                    padding: 8px 10px;
                    min-width: unset;
                    max-width: unset;
                    width: auto;
                }

                #search-engine-switcher.collapsed .engine-container {
                    display: none;
                }

                #search-engine-switcher.collapsed .switcher-header {
                    margin: 0;
                    padding: 0;
                }

                #search-engine-switcher.collapsed .collapse-btn {
                    transform: rotate(180deg);
                    margin-left: 5px;
                }

                #search-engine-switcher.collapsed .switcher-title {
                    margin: 0;
                    font-size: 12px;
                    white-space: nowrap;
                }

                /* 头部样式 */
                .switcher-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }

                .switcher-title {
                    font-weight: bold;
                    font-size: 14px;
                    margin: 0;
                    user-select: none;
                }

                .settings-btn, .collapse-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }

                .settings-btn:hover, .collapse-btn:hover {
                    opacity: 1;
                }

                .header-actions {
                    display: flex;
                    gap: 8px;
                }

                /* 搜索引擎按钮容器 */
                .engine-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                /* 搜索引擎按钮 */
                .engine-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 8px;
                    border-radius: 6px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: #333;
                    font-size: 14px;
                    text-align: left;
                    transition: background 0.2s;
                }

                .engine-btn:hover {
                    background: #f0f0f0;
                }

                .engine-icon {
                    width: 16px;
                    height: 16px;
                    object-fit: contain;
                }

                .shortcut {
                    margin-left: auto;
                    padding: 2px 4px;
                    border-radius: 3px;
                    background: #f0f0f0;
                    color: #666;
                    font-size: 10px;
                }

                @media (prefers-color-scheme: dark) {
                    .shortcut {
                        background: #444;
                        color: #ccc;
                    }
                }

                /* 设置面板样式 */
                .settings-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }

                .settings-container {
                    background: #fff;
                    border-radius: 8px;
                    padding: 20px;
                    width: 90%;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow-y: auto;
                }

                @media (prefers-color-scheme: dark) {
                    .settings-container {
                        background: #333;
                        color: #fff;
                    }
                }

                .settings-header {
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 15px;
                }

                .settings-section {
                    margin-bottom: 20px;
                }

                .section-title {
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .checkbox-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .settings-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }

                .settings-button {
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                }

                .cancel-button {
                    background: #f0f0f0;
                    color: #333;
                }

                .save-button {
                    background: #4285f4;
                    color: white;
                }

                @media (prefers-color-scheme: dark) {
                    .cancel-button {
                        background: #555;
                        color: #eee;
                    }
                }

                /* Mac选项 */
                .mac-options {
                    display: flex;
                    gap: 15px;
                    margin-top: 10px;
                }

                .mac-option {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                /* 拖动手柄样式 */
                .drag-handle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    margin-right: 5px;
                    opacity: 0.5;
                    cursor: move;
                    transition: opacity 0.2s;
                }

                .drag-handle:hover {
                    opacity: 0.8;
                }

                .drag-handle svg {
                    width: 14px;
                    height: 14px;
                }

                /* 快捷搜索提示样式 */
                #quick-search-hint {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    border: 1px solid #e1e4e8;
                    color: #24292e;
                }
                
                @media (prefers-color-scheme: dark) {
                    #quick-search-hint {
                        background-color: #333;
                        color: #fff;
                        border-color: #444;
                    }
                    #quick-search-hint div[style*="color: #666"] {
                        color: #aaa !important;
                    }
                }
            `);
            log('样式已添加');
        } catch (error) {
            handleError(error, '添加样式');
        }
    }

    // 获取启用的搜索引擎
    function getEnabledEngines() {
        try {
            const settings = loadSettings();
            const enabledEngineNames = settings.enabledEngines || defaultEngines.map(e => e.name);

            return defaultEngines.filter(engine =>
                enabledEngineNames.includes(engine.name)
            );
        } catch (error) {
            handleError(error, '获取启用的搜索引擎');
            return defaultEngines;
        }
    }

    // 加载设置
    function loadSettings() {
        try {
            const defaultSettings = {
                enabledEngines: defaultEngines.map(engine => engine.name),
                position: { top: 120, left: 10 },
                autoPosition: true,
                collapsed: false,
                keyboardShortcuts: true,
                macModifierType: 'command',
                quickSearchEnabled: true  // 添加快捷搜索开关
            };
            
            // 尝试从GM_getValue加载
            let savedSettings = null;
            try {
                savedSettings = GM_getValue('searchEngineSettings');
                if (savedSettings) {
                    log('从GM_getValue加载设置成功');
                }
            } catch (e) {
                log('从GM_getValue加载设置失败', e);
            }
            
            // 如果GM_getValue失败,尝试从localStorage加载
            if (!savedSettings) {
                try {
                    const localStorageSettings = localStorage.getItem('searchEngineSwitcherSettings');
                    if (localStorageSettings) {
                        savedSettings = localStorageSettings;
                        log('从localStorage加载设置成功');
                    }
                } catch (e) {
                    log('从localStorage加载设置失败', e);
                }
            }
            
            // 如果没有找到保存的设置,使用默认设置
            if (!savedSettings) {
                log('未找到保存的设置,使用默认设置');
                return defaultSettings;
            }
            
            // 解析设置
            try {
                let parsedSettings;
                if (typeof savedSettings === 'string') {
                    parsedSettings = JSON.parse(savedSettings);
                } else {
                    parsedSettings = savedSettings;
                }
                
                // 确保position是有效的
                if (!parsedSettings.position || typeof parsedSettings.position !== 'object') {
                    parsedSettings.position = defaultSettings.position;
                }
                
                // 合并默认设置和保存的设置
                const mergedSettings = {
                    ...defaultSettings,
                    ...parsedSettings
                };
                
                log('成功加载设置:', mergedSettings);
                return mergedSettings;
            } catch (e) {
                log('解析设置失败,使用默认设置', e);
                return defaultSettings;
            }
        } catch (error) {
            handleError(error, '加载设置');
            return {
                enabledEngines: defaultEngines.map(engine => engine.name),
                position: { top: 120, left: 10 },
                autoPosition: true,
                collapsed: false,
                keyboardShortcuts: true,
                macModifierType: 'command',
                quickSearchEnabled: true
            };
        }
    }

    // 保存设置
    function saveSettings(settings) {
        try {
            // 确保position是有效的
            if (!settings.position || typeof settings.position !== 'object') {
                settings.position = { top: 120, left: 10 };
            }
            
            // 确保top和left是数字
            settings.position.top = parseInt(settings.position.top) || 120;
            settings.position.left = parseInt(settings.position.left) || 10;
            
            // 记录保存的设置
            log('保存设置:', settings);
            
            // 尝试使用GM_setValue保存
            let gmSaveSuccess = false;
            try {
                GM_setValue('searchEngineSettings', settings);
                gmSaveSuccess = true;
                log('使用GM_setValue保存设置成功');
            } catch (e) {
                log('使用GM_setValue保存设置失败', e);
            }
            
            // 同时保存到localStorage作为备份
            try {
                localStorage.setItem('searchEngineSwitcherSettings', JSON.stringify(settings));
                log('使用localStorage备份设置成功');
            } catch (e) {
                log('使用localStorage备份设置失败', e);
            }
            
            return gmSaveSuccess;
        } catch (error) {
            handleError(error, '保存设置');
            return false;
        }
    }

    // 获取当前搜索引擎和查询词
    function getCurrentEngineAndQuery() {
        try {
            const url = window.location.href;

            let currentEngine = null;
            let query = '';

            // 遍历搜索引擎进行匹配
            for (const engine of defaultEngines) {
                // 创建正则表达式
                const regexPattern = new RegExp(engine.matchPattern, 'i');

                if (regexPattern.test(url)) {
                    log(`匹配到搜索引擎: ${engine.name}`);
                    currentEngine = engine;

                    // 提取查询词
                    const urlObj = new URL(url);
                    query = urlObj.searchParams.get(engine.queryParam) || '';

                    // 特殊处理DuckDuckGo
                    if (engine.name === 'DuckDuckGo' && !query) {
                        // 检查URL中是否包含q=参数(可能在hash中)
                        if (url.includes('q=')) {
                            const match = url.match(/[?&#]q=([^&#]*)/);
                            if (match && match[1]) {
                                query = decodeURIComponent(match[1]);
                            }
                        }
                    }

                    break;
                }
            }

            if (currentEngine) {
                log(`当前引擎: ${currentEngine.name}, 查询词: ${query}`);
            } else {
                log('未匹配到搜索引擎');
            }

            return { currentEngine, query };
        } catch (error) {
            handleError(error, '获取当前搜索引擎和查询词');
            return { currentEngine: null, query: '' };
        }
    }

    // 切换到指定搜索引擎
    function switchToEngine(engine, query) {
        try {
            if (!query) {
                log('没有查询词,取消切换');
                return;
            }

            // 将查询参数编码并替换到URL中
            const encodedQuery = encodeURIComponent(query);
            const targetUrl = engine.url.replace('{query}', encodedQuery);

            log(`切换到 ${engine.name}, URL: ${targetUrl}`);

            // 导航到新的URL
            window.location.href = targetUrl;
        } catch (error) {
            handleError(error, '切换搜索引擎');
        }
    }

    // 自动定位函数 - 新增
    function calculateOptimalPosition() {
        try {
            const { currentEngine } = getCurrentEngineAndQuery();
            if (!currentEngine) return { top: 120, left: 10 };

            let top = 120, left = 10;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // 针对不同搜索引擎的特殊定位逻辑
            if (/google/.test(currentEngine.name.toLowerCase())) {
                // Google搜索页面,放在搜索框下方
                const searchBox = document.querySelector('form[role="search"]');
                if (searchBox) {
                    const rect = searchBox.getBoundingClientRect();
                    top = rect.bottom + 20;
                }
            } else if (/baidu/.test(currentEngine.name.toLowerCase())) {
                // 百度搜索页面,放在右侧
                left = windowWidth - 200;
                top = 150;
            } else if (/bing/.test(currentEngine.name.toLowerCase())) {
                // Bing搜索页面,优化位置
                const searchBox = document.querySelector('.b_searchbox');
                if (searchBox) {
                    const rect = searchBox.getBoundingClientRect();
                    top = rect.bottom + 15;
                }
            } else if (/duckduckgo/.test(currentEngine.name.toLowerCase())) {
                // DuckDuckGo搜索页面,放在左上角
                top = 80;
            }

            // 确保没有超出窗口边界
            top = Math.max(10, Math.min(windowHeight - 200, top));
            left = Math.max(10, Math.min(windowWidth - 200, left));

            return { top, left };
        } catch (error) {
            handleError(error, '计算最佳位置');
            return { top: 120, left: 10 };
        }
    }

    // 创建搜索引擎切换器UI
    function createSwitcherUI() {
        try {
            // 检查当前页面是否为搜索结果页
            const { currentEngine, query } = getCurrentEngineAndQuery();
            if (!currentEngine || !query) {
                log('未检测到搜索引擎或查询词,不创建UI');
                return;
            }

            // 检查是否已存在搜索引擎切换器,如果存在则移除
            let switcher = document.getElementById('search-engine-switcher');
            if (switcher) {
                log('搜索引擎切换器已存在,移除旧的');
                switcher.remove();
            }

            // 获取设置
            const settings = loadSettings();

            // 获取位置信息
            let position = settings.position;
            if (settings.autoPosition) {
                position = calculateOptimalPosition();
            }

            // 获取启用的搜索引擎
            const enabledEngines = getEnabledEngines();

            // 创建搜索引擎切换器容器
            switcher = document.createElement('div');
            switcher.id = 'search-engine-switcher';
            if (settings.collapsed) {
                switcher.classList.add('collapsed');
            }

            // 设置位置
            switcher.style.top = `${position.top}px`;
            switcher.style.left = `${position.left}px`;

            // 创建标题栏
            const header = document.createElement('div');
            header.className = 'switcher-header';

            // 添加拖动手柄
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9h14M5 15h14"></path></svg>';
            dragHandle.title = '拖动';
            header.appendChild(dragHandle);

            // 创建标题
            const title = document.createElement('div');
            title.className = 'switcher-title';
            title.textContent = '搜索引擎切换';
            header.appendChild(title);

            // 创建按钮容器
            const headerActions = document.createElement('div');
            headerActions.className = 'header-actions';

            // 创建设置按钮
            const settingsButton = document.createElement('button');
            settingsButton.className = 'settings-btn';
            settingsButton.title = '设置';
            settingsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
            settingsButton.addEventListener('click', function(e) {
                e.stopPropagation();
                showSettingsPanel();
            });
            headerActions.appendChild(settingsButton);

            // 创建折叠/展开按钮
            const collapseButton = document.createElement('button');
            collapseButton.className = 'collapse-btn';
            collapseButton.title = settings.collapsed ? '展开' : '折叠';
            collapseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';

            collapseButton.addEventListener('click', function(e) {
                e.stopPropagation();
                // 切换折叠状态
                switcher.classList.toggle('collapsed');
                // 更新设置
                const newSettings = {...settings, collapsed: switcher.classList.contains('collapsed')};
                saveSettings(newSettings);
                // 更新按钮提示
                this.title = newSettings.collapsed ? '展开' : '折叠';
            });
            headerActions.appendChild(collapseButton);

            header.appendChild(headerActions);
            switcher.appendChild(header);

            // 创建搜索引擎按钮容器
            const engineContainer = document.createElement('div');
            engineContainer.className = 'engine-container';

            // 创建每个搜索引擎按钮
            for (const engine of enabledEngines) {
                // 如果是当前搜索引擎,则跳过
                if (currentEngine && engine.name === currentEngine.name) {
                    continue;
                }

                // 创建按钮
                const engineBtn = document.createElement('button');
                engineBtn.className = 'engine-btn';
                engineBtn.title = `在${engine.name}中搜索 "${query}"`;
                engineBtn.addEventListener('click', function() {
                    switchToEngine(engine, query);
                });

                // 创建图标占位符
                const iconPlaceholder = document.createElement('div');
                iconPlaceholder.className = 'engine-icon-placeholder';
                iconPlaceholder.style.width = '16px';
                iconPlaceholder.style.height = '16px';
                iconPlaceholder.style.display = 'flex';
                iconPlaceholder.style.alignItems = 'center';
                iconPlaceholder.style.justifyContent = 'center';
                iconPlaceholder.style.backgroundColor = '#f0f0f0';
                iconPlaceholder.style.borderRadius = '3px';
                iconPlaceholder.style.fontSize = '10px';
                iconPlaceholder.style.fontWeight = 'bold';
                iconPlaceholder.textContent = engine.name.charAt(0);

                engineBtn.appendChild(iconPlaceholder);

                // 异步加载图标
                loadEngineIcon(engineBtn, iconPlaceholder, engine);

                // 添加搜索引擎名称
                engineBtn.appendChild(document.createTextNode(engine.name));

                // 如果启用快捷键,添加提示
                const settings = loadSettings();
                if (settings.keyboardShortcuts) {
                    const shortcutSpan = document.createElement('span');
                    shortcutSpan.className = 'shortcut';
                    shortcutSpan.textContent = `${modifierKey}${engine.shortcut}`;
                    engineBtn.appendChild(shortcutSpan);
                }

                engineContainer.appendChild(engineBtn);
            }

            // 如果没有其他搜索引擎按钮,添加一个提示
            if (engineContainer.children.length === 0) {
                const noEnginesMsg = document.createElement('div');
                noEnginesMsg.textContent = '没有其他可用的搜索引擎';
                noEnginesMsg.style.padding = '10px 0';
                noEnginesMsg.style.color = '#888';
                noEnginesMsg.style.fontSize = '12px';
                noEnginesMsg.style.textAlign = 'center';
                engineContainer.appendChild(noEnginesMsg);
            }

            switcher.appendChild(engineContainer);

            // 添加到页面
            document.body.appendChild(switcher);

            // 设置拖拽功能
            setupDraggable(switcher, dragHandle);

            // 添加点击事件,防止冒泡
            switcher.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            log('搜索引擎切换器UI已创建');
        } catch (error) {
            handleError(error, '创建搜索引擎切换器UI');
        }
    }

    // 添加加载图标的辅助函数
    async function loadEngineIcon(engineBtn, iconPlaceholder, engine) {
        try {
            // 获取图标URL (使用简单方式,不进行转换)
            const iconUrl = engine.icon;
            
            // 创建图标
            const img = document.createElement('img');
            img.src = iconUrl;
            img.className = 'engine-icon';
            img.alt = engine.name;
            
            // 当图标加载完成时替换占位符
            img.onload = function() {
                if (iconPlaceholder.parentNode) {
                    iconPlaceholder.replaceWith(img);
                }
            };
            
            img.onerror = function() {
                // 图标加载失败时使用文本替代
                const textIcon = document.createElement('div');
                textIcon.className = 'engine-icon text-icon';
                textIcon.textContent = engine.name.charAt(0);
                if (iconPlaceholder.parentNode) {
                    iconPlaceholder.replaceWith(textIcon);
                }
            };
            
            // 添加到DOM,但保持隐藏状态直到加载完成
            if (iconPlaceholder.parentNode) {
                iconPlaceholder.parentNode.appendChild(img);
                img.style.display = 'none';
            }
        } catch (error) {
            log(`加载图标出错: ${error.message}`);
            // 出错时使用文本图标
            try {
                const textIcon = document.createElement('div');
                textIcon.className = 'engine-icon text-icon';
                textIcon.textContent = engine.name.charAt(0);
                if (iconPlaceholder.parentNode) {
                    iconPlaceholder.replaceWith(textIcon);
                }
            } catch (e) {
                // 忽略
            }
        }
    }

    // 设置拖拽功能 - 新增
    function setupDraggable(element, handle) {
        try {
            if (!element || !handle) return;

            let isDragging = false;
            let offset = { x: 0, y: 0 };
            let debounceTimer = null;

            handle.addEventListener('mousedown', startDrag);
            handle.addEventListener('touchstart', startDrag, { passive: false });

            function startDrag(e) {
                e.preventDefault();
                e.stopPropagation();

                // 获取初始位置
                const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
                const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
                const rect = element.getBoundingClientRect();

                offset = {
                    x: clientX - rect.left,
                    y: clientY - rect.top
                };

                isDragging = true;

                // 添加拖动和结束事件监听
                document.addEventListener('mousemove', drag);
                document.addEventListener('touchmove', drag, { passive: false });
                document.addEventListener('mouseup', stopDrag);
                document.addEventListener('touchend', stopDrag);

                // 添加正在拖动的样式
                element.style.transition = 'none';
                element.style.opacity = '0.8';
            }

            function drag(e) {
                if (!isDragging) return;
                e.preventDefault();

                // 获取当前位置
                const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
                const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

                // 计算新位置
                let newLeft = clientX - offset.x;
                let newTop = clientY - offset.y;

                // 边界检查
                const maxLeft = window.innerWidth - element.offsetWidth;
                const maxTop = window.innerHeight - element.offsetHeight;

                newLeft = Math.max(0, Math.min(maxLeft, newLeft));
                newTop = Math.max(0, Math.min(maxTop, newTop));

                // 应用新位置
                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            }

            function stopDrag() {
                if (!isDragging) return;

                // 移除事件监听
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchend', stopDrag);

                // 恢复样式
                element.style.transition = '';
                element.style.opacity = '';

                // 获取最终位置并保存
                const rect = element.getBoundingClientRect();
                const finalPosition = {
                    top: rect.top,
                    left: rect.left
                };

                // 保存位置到设置
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const settings = loadSettings();
                    settings.position = finalPosition;
                    settings.autoPosition = false; // 用户手动拖动后禁用自动定位
                    saveSettings(settings);
                    log('拖动位置已保存', finalPosition);
                }, 300);

                isDragging = false;
            }

            log('拖拽功能已设置');
        } catch (error) {
            handleError(error, '设置拖拽功能');
        }
    }

    // 显示设置面板
    function showSettingsPanel() {
        try {
            log('显示设置面板');

            // 获取当前设置
            const settings = loadSettings();

            // 创建设置覆盖层
            const settingsOverlay = document.createElement('div');
            settingsOverlay.className = 'settings-overlay';

            // 创建设置容器
            const settingsContainer = document.createElement('div');
            settingsContainer.className = 'settings-container';

            // 创建设置标题
            const settingsHeader = document.createElement('div');
            settingsHeader.className = 'settings-header';
            settingsHeader.textContent = '搜索引擎切换工具设置';
            settingsContainer.appendChild(settingsHeader);

            // 创建搜索引擎选择部分
            const enginesSection = document.createElement('div');
            enginesSection.className = 'settings-section';

            const enginesTitle = document.createElement('div');
            enginesTitle.className = 'section-title';
            enginesTitle.textContent = '选择要显示的搜索引擎:';
            enginesSection.appendChild(enginesTitle);

            const checkboxGroup = document.createElement('div');
            checkboxGroup.className = 'checkbox-group';

            // 添加每个搜索引擎的复选框
            defaultEngines.forEach(engine => {
                const label = document.createElement('label');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'engine';
                checkbox.value = engine.name;
                checkbox.checked = settings.enabledEngines.includes(engine.name);
                label.appendChild(checkbox);

                label.appendChild(document.createTextNode(` ${engine.name}`));

                checkboxGroup.appendChild(label);
            });

            enginesSection.appendChild(checkboxGroup);
            settingsContainer.appendChild(enginesSection);

            // 创建快捷键部分
            const shortcutSection = document.createElement('div');
            shortcutSection.className = 'settings-section';

            const shortcutTitle = document.createElement('div');
            shortcutTitle.className = 'section-title';
            shortcutTitle.textContent = '快捷键设置:';
            shortcutSection.appendChild(shortcutTitle);

            const shortcutCheckbox = document.createElement('label');
            const shortcutInput = document.createElement('input');
            shortcutInput.type = 'checkbox';
            shortcutInput.name = 'keyboardShortcuts';
            shortcutInput.checked = settings.keyboardShortcuts;
            shortcutCheckbox.appendChild(shortcutInput);
            shortcutCheckbox.appendChild(document.createTextNode(' 启用键盘快捷键'));
            shortcutSection.appendChild(shortcutCheckbox);

            // Mac特定选项
            if (isMac) {
                const shortcutContent = document.createElement('div');
                shortcutContent.style.marginTop = '10px';
                shortcutContent.style.marginLeft = '20px';
                shortcutContent.style.display = settings.keyboardShortcuts ? 'block' : 'none';

                shortcutInput.addEventListener('change', function() {
                    shortcutContent.style.display = this.checked ? 'block' : 'none';
                });

                const shortcutDescription = document.createElement('div');
                shortcutDescription.style.marginTop = '10px';
                shortcutDescription.style.marginLeft = '20px';
                shortcutDescription.style.display = settings.keyboardShortcuts ? 'block' : 'none';

                // 根据平台和修饰键类型显示正确的快捷键描述
                const shortcutModifier = isMac ? 
                    (settings.macModifierType === 'command' ? '⌘ Command' : '⌥ Option') : 
                    'Alt';
                shortcutDescription.innerHTML = `按下 <b>${shortcutModifier}+搜索引擎首字母</b> 可快速切换搜索引擎<br><span style="color:#777;font-size:12px;">(例如: ${shortcutModifier}+B 切换到Bing)</span>`;

                shortcutContent.appendChild(shortcutDescription);

                const macOptions = document.createElement('div');
                macOptions.className = 'mac-options';

                // Command选项
                const commandOption = document.createElement('label');
                commandOption.className = 'mac-option';

                const commandRadio = document.createElement('input');
                commandRadio.type = 'radio';
                commandRadio.name = 'macModifier';
                commandRadio.value = 'command';
                commandRadio.checked = settings.macModifierType === 'command';

                commandOption.appendChild(commandRadio);
                commandOption.appendChild(document.createTextNode(' ⌘ (Command)'));

                // Option选项
                const optionOption = document.createElement('label');
                optionOption.className = 'mac-option';

                const optionRadio = document.createElement('input');
                optionRadio.type = 'radio';
                optionRadio.name = 'macModifier';
                optionRadio.value = 'option';
                optionRadio.checked = settings.macModifierType === 'option';

                optionOption.appendChild(optionRadio);
                optionOption.appendChild(document.createTextNode(' ⌥ (Option)'));

                macOptions.appendChild(commandOption);
                macOptions.appendChild(optionOption);

                shortcutContent.appendChild(macOptions);
                shortcutSection.appendChild(shortcutContent);
            } else {
                const shortcutDescription = document.createElement('div');
                shortcutDescription.style.marginTop = '10px';
                shortcutDescription.style.marginLeft = '20px';
                shortcutDescription.style.display = settings.keyboardShortcuts ? 'block' : 'none';
                shortcutDescription.textContent = '按下 Alt + 快捷键字母 可快速切换搜索引擎';

                shortcutInput.addEventListener('change', function() {
                    shortcutDescription.style.display = this.checked ? 'block' : 'none';
                });

                shortcutSection.appendChild(shortcutDescription);
            }

            settingsContainer.appendChild(shortcutSection);

            // 创建位置设置部分
            const positionSection = document.createElement('div');
            positionSection.className = 'settings-section';

            const positionTitle = document.createElement('div');
            positionTitle.className = 'section-title';
            positionTitle.textContent = '位置设置:';
            positionSection.appendChild(positionTitle);

            const positionCheckbox = document.createElement('label');
            const positionInput = document.createElement('input');
            positionInput.type = 'checkbox';
            positionInput.name = 'autoPosition';
            positionInput.checked = settings.autoPosition;
            positionCheckbox.appendChild(positionInput);
            positionCheckbox.appendChild(document.createTextNode(' 自动选择最佳位置'));

            const positionDescription = document.createElement('div');
            positionDescription.style.marginTop = '5px';
            positionDescription.style.marginLeft = '20px';
            positionDescription.style.fontSize = '12px';
            positionDescription.style.color = '#666';
            positionDescription.textContent = '禁用后可拖动切换器到任意位置';

            positionSection.appendChild(positionCheckbox);
            positionSection.appendChild(positionDescription);
            settingsContainer.appendChild(positionSection);

            // 创建折叠选项
            const collapseSection = document.createElement('div');
            collapseSection.className = 'settings-section';

            const collapseCheckbox = document.createElement('label');
            const collapseInput = document.createElement('input');
            collapseInput.type = 'checkbox';
            collapseInput.name = 'collapsed';
            collapseInput.checked = settings.collapsed;
            collapseCheckbox.appendChild(collapseInput);
            collapseCheckbox.appendChild(document.createTextNode(' 默认折叠'));

            collapseSection.appendChild(collapseCheckbox);
            settingsContainer.appendChild(collapseSection);

            // 添加快捷搜索设置部分
            const quickSearchSection = document.createElement('div');
            quickSearchSection.className = 'settings-section';
            
            const quickSearchTitle = document.createElement('div');
            quickSearchTitle.className = 'section-title';
            quickSearchTitle.textContent = '快捷搜索跳转:';
            quickSearchSection.appendChild(quickSearchTitle);
            
            const quickSearchCheckbox = document.createElement('label');
            const quickSearchInput = document.createElement('input');
            quickSearchInput.type = 'checkbox';
            quickSearchInput.name = 'quickSearchEnabled';
            quickSearchInput.checked = settings.quickSearchEnabled !== false; // 默认启用
            quickSearchCheckbox.appendChild(quickSearchInput);
            quickSearchCheckbox.appendChild(document.createTextNode(' 启用关键词快捷搜索'));
            quickSearchSection.appendChild(quickSearchCheckbox);
            
            const quickSearchDescription = document.createElement('div');
            quickSearchDescription.style.marginTop = '10px';
            quickSearchDescription.style.marginLeft = '20px';
            quickSearchDescription.style.fontSize = '12px';
            quickSearchDescription.style.color = '#666';
            quickSearchDescription.innerHTML = '例如: 输入 <b>gh react</b> 可快速跳转到GitHub搜索react<br>' +
                '支持的前缀: gh (GitHub), yt (YouTube), bili (哔哩哔哩), zh (知乎), so (Stack Overflow), npm (NPM包)';
            
            quickSearchSection.appendChild(quickSearchDescription);
            settingsContainer.appendChild(quickSearchSection);

            // 创建按钮
            const actions = document.createElement('div');
            actions.className = 'settings-actions';

            const cancelButton = document.createElement('button');
            cancelButton.className = 'settings-button cancel-button';
            cancelButton.textContent = '取消';
            cancelButton.addEventListener('click', function() {
                settingsOverlay.remove();
            });

            const saveButton = document.createElement('button');
            saveButton.className = 'settings-button save-button';
            saveButton.textContent = '保存';
            saveButton.addEventListener('click', function() {
                // 收集设置
                const newSettings = {
                    enabledEngines: Array.from(
                        settingsContainer.querySelectorAll('input[name="engine"]:checked')
                    ).map(checkbox => checkbox.value),
                    keyboardShortcuts: settingsContainer.querySelector('input[name="keyboardShortcuts"]').checked,
                    collapsed: settingsContainer.querySelector('input[name="collapsed"]').checked,
                    autoPosition: settingsContainer.querySelector('input[name="autoPosition"]').checked,
                    quickSearchEnabled: settingsContainer.querySelector('input[name="quickSearchEnabled"]').checked
                };

                // Mac特定选项
                if (isMac) {
                    const macModifier = settingsContainer.querySelector('input[name="macModifier"]:checked');
                    newSettings.macModifierType = macModifier ? macModifier.value : 'command';
                }

                // 保存设置
                const success = saveSettings(newSettings);
                if (success) {
                    settingsOverlay.remove();

                    // 刷新切换器界面
                    const switcher = document.getElementById('search-engine-switcher');
                    if (switcher) {
                        switcher.remove();
                    }
                    setTimeout(createSwitcherUI, 100);
                }
            });

            actions.appendChild(cancelButton);
            actions.appendChild(saveButton);

            settingsContainer.appendChild(actions);

            settingsOverlay.appendChild(settingsContainer);
            document.body.appendChild(settingsOverlay);

            // 点击外部区域关闭设置面板
            settingsOverlay.addEventListener('click', function(e) {
                if (e.target === settingsOverlay) {
                    settingsOverlay.remove();
                }
            });

            log('设置面板已显示');
        } catch (error) {
            handleError(error, '显示设置面板');
        }
    }

    // 设置键盘快捷键
    function setupKeyboardShortcuts() {
        try {
            const settings = loadSettings();
            if (!settings.keyboardShortcuts) {
                log('快捷键功能已禁用');
                return;
            }
            
            const { currentEngine, query } = getCurrentEngineAndQuery();
            if (!currentEngine || !query) {
                log('未检测到搜索引擎或查询词,不设置快捷键');
                return;
            }
            
            // 根据平台显示正确的快捷键提示
            const modifierKeyDisplay = isMac ? 
                (settings.macModifierType === 'command' ? '⌘+' : '⌥+') : 
                'Alt+';
            log(`设置键盘快捷键: ${modifierKeyDisplay}字母`);
            
            document.addEventListener('keydown', function(e) {
                // 检查修饰键是否按下 - 根据用户设置和平台正确检测
                let modifierPressed = false;
                
                if (isMac) {
                    if (settings.macModifierType === 'command') {
                        modifierPressed = e.metaKey;
                    } else if (settings.macModifierType === 'option') {
                        modifierPressed = e.altKey;
                    } else {
                        modifierPressed = e.metaKey; // 默认使用Command键
                    }
                } else {
                    modifierPressed = e.altKey; // 非Mac平台使用Alt键
                }
                
                // 如果没有按下修饰键,直接返回
                if (!modifierPressed) return;
                
                // 获取按下的键
                const key = e.key.toUpperCase();
                log(`检测到组合键: ${modifierKeyDisplay}${key}`);
                
                // 跳过输入框中的按键
                if (e.target.tagName === 'INPUT' || 
                    e.target.tagName === 'TEXTAREA' || 
                    e.target.isContentEditable) {
                    return;
                }
                
                // 查找匹配的搜索引擎
                const targetEngine = getEnabledEngines().find(engine => 
                    engine.shortcut && engine.shortcut.toUpperCase() === key && 
                    (!currentEngine || engine.name !== currentEngine.name)
                );
                
                if (targetEngine) {
                    // 阻止默认事件(如浏览器快捷键)
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 切换到目标搜索引擎
                    switchToEngine(targetEngine, query);
                    return false;
                }
            }, true); // 使用捕获阶段确保优先处理
            
            log('键盘快捷键设置完成');
        } catch (error) {
            handleError(error, '设置键盘快捷键');
        }
    }

    // 设置DOM变化观察器
    function setupMutationObserver() {
        try {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 检查是否需要重新创建UI
                        const switcherExists = document.querySelector('#search-engine-switcher');
                        if (!switcherExists) {
                            createSwitcherUI();
                        }
                        
                        // 检查新添加的搜索框
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const inputs = node.querySelectorAll('input[type="text"], input[type="search"], input:not([type])');
                                if (inputs.length > 0) {
                                    setupQuickSearch();
                                }
                            }
                        });
                    }
                }
            });

            // 观察整个文档的变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            log('MutationObserver 已设置');
        } catch (error) {
            handleError(error, '设置 MutationObserver');
        }
    }

    // 添加菜单项
    function setupUserMenu() {
        try {
            GM_registerMenuCommand('搜索引擎切换工具设置', showSettingsPanel);
            
            // 添加快捷搜索切换选项
            const settings = loadSettings();
            const menuText = settings.quickSearchEnabled ? 
                '✓ 快捷搜索跳转 (已启用)' : 
                '○ 快捷搜索跳转 (已禁用)';
                
            GM_registerMenuCommand(menuText, function() {
                const settings = loadSettings();
                settings.quickSearchEnabled = !settings.quickSearchEnabled;
                saveSettings(settings);
                alert(`快捷搜索跳转已${settings.quickSearchEnabled ? '启用' : '禁用'}.\n刷新页面后生效.`);
                location.reload();
            });
            
            log('用户菜单已设置');
        } catch (error) {
            handleError(error, '设置用户菜单');
        }
    }

    // 添加URL监控功能实现快捷搜索
    function setupURLMonitor() {
        // 检查是否启用了快捷搜索
        const settings = loadSettings();
        if (!settings.quickSearchEnabled) {
            log('快捷搜索跳转功能已禁用');
            return;
        }
        
        log('启用快捷搜索跳转功能');
        
        // 上次检查的URL
        let lastCheckedURL = '';
        
        // 检查当前URL是否符合快捷搜索模式
        function checkCurrentURL() {
            // 获取当前URL
            const currentURL = window.location.href;
            
            // 如果URL没有变化,跳过
            if (currentURL === lastCheckedURL) {
                return;
            }
            
            // 更新lastCheckedURL
            lastCheckedURL = currentURL;
            
            // 定义搜索引擎URL模式和查询参数
            const searchEnginePatterns = [
                { pattern: /google\.[^/]+\/search/, paramName: 'q' },
                { pattern: /bing\.com\/search/, paramName: 'q' },
                { pattern: /baidu\.com\/s/, paramName: 'wd' },
                { pattern: /duckduckgo\.com/, paramName: 'q' },
                { pattern: /sogou\.com\/web/, paramName: 'query' },
                { pattern: /so\.com\/s/, paramName: 'q' }
            ];
            
            // 检查是否匹配任何搜索引擎模式
            for (const engine of searchEnginePatterns) {
                if (engine.pattern.test(currentURL)) {
                    // 尝试从URL中提取查询参数
                    const urlParams = new URLSearchParams(window.location.search);
                    const query = urlParams.get(engine.paramName);
                    
                    // 检查查询是否以特定前缀开头
                    if (query) {
                        log('检测到搜索查询:', query);
                        
                        // 检查前缀
                        for (const prefix of quickSearchPrefixes) {
                            if (query.startsWith(prefix.prefix)) {
                                // 提取搜索词
                                const searchTerm = query.substring(prefix.prefix.length).trim();
                                if (searchTerm.length > 0) {
                                    log(`检测到快捷搜索: ${prefix.name}, 搜索词: ${searchTerm}`);
                                    
                                    // 构建目标URL
                                    const targetURL = prefix.url.replace('{query}', encodeURIComponent(searchTerm));
                                    
                                    // 跳转到目标URL
                                    log(`正在跳转到: ${targetURL}`);
                                    window.location.href = targetURL;
                                    return;
                                }
                            }
                        }
                    }
                    
                    // 找到了搜索引擎但没有匹配前缀,不需要检查其他搜索引擎
                    break;
                }
            }
        }
        
        // 立即检查一次
        checkCurrentURL();
        
        // 设置定期检查
        setInterval(checkCurrentURL, 200);
        
        // 监听URL变化(支持单页应用)
        let lastUrl = location.href; 
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                checkCurrentURL();
            }
        });
        
        observer.observe(document, {subtree: true, childList: true});
        
        // 监听popstate事件(浏览器前进/后退)
        window.addEventListener('popstate', checkCurrentURL);
        
        log('URL监控已设置');
    }

    // 添加新标签页快捷搜索功能
    function setupNewTabQuickSearch() {
        // 检查是否是新标签页
        if (!/newtab|about:blank|chrome:\/\/newtab/.test(window.location.href) && 
            !(/google\.com\/?$/.test(window.location.href))) {
            return;
        }
        
        log('检测到新标签页,设置快捷搜索');
        
        // 创建搜索框
        const searchContainer = document.createElement('div');
        searchContainer.id = 'quick-search-container';
        searchContainer.style.position = 'fixed';
        searchContainer.style.top = '30%';
        searchContainer.style.left = '50%';
        searchContainer.style.transform = 'translate(-50%, -50%)';
        searchContainer.style.zIndex = '9999';
        searchContainer.style.width = '500px';
        searchContainer.style.padding = '20px';
        searchContainer.style.backgroundColor = '#fff';
        searchContainer.style.borderRadius = '8px';
        searchContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        searchContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        
        // 添加标题
        const title = document.createElement('h2');
        title.textContent = '快捷搜索';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#333';
        searchContainer.appendChild(title);
        
        // 添加说明
        const description = document.createElement('p');
        description.textContent = '输入前缀+搜索词,按回车直接跳转到对应网站搜索结果';
        description.style.margin = '0 0 15px 0';
        description.style.color = '#666';
        description.style.fontSize = '14px';
        searchContainer.appendChild(description);
        
        // 添加前缀列表
        const prefixList = document.createElement('div');
        prefixList.style.display = 'flex';
        prefixList.style.gap = '10px';
        prefixList.style.marginBottom = '15px';
        
        for (const prefix of quickSearchPrefixes) {
            const badge = document.createElement('div');
            badge.style.padding = '3px 8px';
            badge.style.backgroundColor = '#f0f0f0';
            badge.style.borderRadius = '4px';
            badge.style.fontSize = '13px';
            badge.style.cursor = 'pointer';
            badge.innerHTML = `<strong>${prefix.prefix}</strong> ${prefix.description}`;
            
            badge.addEventListener('click', () => {
                searchInput.value = prefix.prefix;
                searchInput.focus();
            });
            
            prefixList.appendChild(badge);
        }
        
        searchContainer.appendChild(prefixList);
        
        // 添加搜索框
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '输入前缀+搜索词,如: gh cursor';
        searchInput.style.width = '100%';
        searchInput.style.padding = '10px 15px';
        searchInput.style.fontSize = '16px';
        searchInput.style.border = '1px solid #ddd';
        searchInput.style.borderRadius = '4px';
        searchInput.style.outline = 'none';
        searchInput.style.boxSizing = 'border-box';
        
        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = '#4285f4';
            searchInput.style.boxShadow = '0 0 0 2px rgba(66, 133, 244, 0.2)';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = '#ddd';
            searchInput.style.boxShadow = 'none';
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                
                // 检查是否匹配任何前缀
                for (const prefixConfig of quickSearchPrefixes) {
                    if (query.startsWith(prefixConfig.prefix)) {
                        const searchTerm = query.substring(prefixConfig.prefix.length).trim();
                        if (searchTerm.length > 0) {
                            // 构建URL并跳转
                            const targetUrl = prefixConfig.url.replace('{query}', encodeURIComponent(searchTerm));
                            log(`新标签页快捷搜索跳转: ${targetUrl}`);
                            window.location.href = targetUrl;
                            return;
                        }
                    }
                }
                
                // 如果没有匹配任何前缀,使用默认搜索引擎
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
        });
        
        searchContainer.appendChild(searchInput);
        
        // 添加到页面
        document.body.appendChild(searchContainer);
        
        // 自动聚焦搜索框
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    }

    // 添加 setupQuickSearch 函数的实现
    function setupQuickSearch() {
        try {
            const settings = loadSettings();
            if (!settings.quickSearchEnabled) {
                log('快捷搜索功能已禁用');
                return;
            }

            log('设置快捷搜索功能');

            // 定义快捷搜索前缀和对应URL
            const quickSearchPatterns = {
                'gh ': 'https://github.com/search?q={query}',
                'so ': 'https://stackoverflow.com/search?q={query}',
                'yt ': 'https://www.youtube.com/results?search_query={query}',
                'bili ': 'https://search.bilibili.com/all?keyword={query}',
                'zh ': 'https://www.zhihu.com/search?type=content&q={query}',
                'npm ': 'https://www.npmjs.com/search?q={query}'
            };

            // 查找页面上的搜索输入框
            const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"], input:not([type])');
            
            searchInputs.forEach(input => {
                // 避免重复添加事件监听
                if (input.dataset.quickSearchEnabled) return;
                
                input.dataset.quickSearchEnabled = 'true';
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        const value = this.value.trim();
                        
                        // 检查是否匹配任何前缀
                        for (const [prefix, url] of Object.entries(quickSearchPatterns)) {
                            if (value.startsWith(prefix)) {
                                const query = value.substring(prefix.length).trim();
                                if (query) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.location.href = url.replace('{query}', encodeURIComponent(query));
                                    return;
                                }
                            }
                        }
                    }
                }, true);
            });

            log('快捷搜索功能已设置');
        } catch (error) {
            handleError(error, '设置快捷搜索');
        }
    }

    // 初始化
    function initialize() {
        try {
            log('开始初始化搜索引擎切换助手');
            
            // 添加全局错误处理
            window.addEventListener('error', function(event) {
                if (event.filename && event.filename.includes('search-engine-switcher')) {
                    console.error('[搜索引擎切换助手] 全局错误:', event.message);
                    return true; // 阻止默认处理
                }
            }, true);
            
            // 添加unhandledrejection处理
            window.addEventListener('unhandledrejection', function(event) {
                handleError(event.reason || new Error('未处理的Promise拒绝'), 'Promise错误');
                event.preventDefault();
            });
            
            addStyles();
            setupUserMenu();
            
            // 设置URL监控(新增)
            setupURLMonitor();
            
            // 根据页面类型选择功能
            if (/newtab|about:blank|chrome:\/\/newtab/.test(window.location.href) || 
                /google\.[^/]+\/?$/.test(window.location.href)) {
                // 如果是新标签页,设置新标签页快捷搜索
                setupNewTabQuickSearch();
            } else {
                // 如果是搜索结果页,创建搜索引擎切换器UI
                setTimeout(() => {
                    try {
                        createSwitcherUI();
                        
                        // 设置快捷搜索功能
                        setupQuickSearch();
                        
                        // 然后设置键盘快捷键
                        setTimeout(() => {
                            try {
                                setupKeyboardShortcuts();
                                
                                // 最后设置MutationObserver
                                setTimeout(() => {
                                    try {
                                        setupMutationObserver();
                                    } catch (e) {
                                        handleError(e, '设置MutationObserver');
                                    }
                                }, 200);
                            } catch (e) {
                                handleError(e, '设置键盘快捷键');
                            }
                        }, 150);
                    } catch (e) {
                        handleError(e, '创建UI');
                    }
                }, 100);
            }
            
            log('初始化完成');
        } catch (error) {
            handleError(error, '初始化');
        }
    }

    // 立即执行初始化
    initialize();

    // 确保DOM加载后执行
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(createSwitcherUI, 300);
        });
    }

    // 页面完全加载后再次执行
    window.addEventListener('load', function() {
        setTimeout(createSwitcherUI, 500);
    });
})();