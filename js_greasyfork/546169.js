// ==UserScript==
// @name         CSDN-PRO,CSDN优化工具
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  自动清理CSDN网站上的广告、垃圾内容和登录弹窗，支持自定义配置。优化UI设计，使用现代化美观样式，避免影响CSDN原有样式。
// @author       tanzz
// @match        https://*.csdn.net/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546169/CSDN-PRO%2CCSDN%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546169/CSDN-PRO%2CCSDN%E4%BC%98%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 脚本版本，用于检测更新
    const SCRIPT_VERSION = '1.0.8';
    
    // 调试开关配置 - 控制调试日志输出
    // 生产环境保持关闭，确保用户体验
    const DEBUG_CONFIG = {
        enabled: false,      // 生产环境静默模式 (关闭所有调试输出)
        logLevel: 'warn'     // 仅显示警告和错误
    };
    
    // 初始配置结构（树形）
    const defaultConfig = {
        version: SCRIPT_VERSION, // 添加版本信息
        login: {
            enabled: true,
            name: '登录清理',
            children: {
                loginPopups: {
                    enabled: true,
                    name: '登录弹窗',
                    selectors: ['.login-mark',
                        '.passport-login-container',
                        '.modal-backdrop',
                        '.passport-login-tip-container',
                        'body > div.passport-login-tip-container.false'
                    ]
                },
            }
        },
        leftSide: {
            enabled: true,
            name: '左侧栏清理',
            children: {
                author: {
                    enabled: true,
                    name: '作者信息',
                    selectors: ['#asideProfile']
                },
                carouselAds: {
                    enabled: true,
                    name: '轮播图广告',
                    selectors: ['.swiper-remuneration-container']
                },
                cKnow: {
                    enabled: true,
                    name: '知道',
                    selectors: ['#mainBox > aside > div.c-blog-side-box']
                },
                hisSelection: {
                    enabled: true,
                    name: 'TA的精选',
                    selectors: ['#his-selection']
                },
                hotArticle: {
                    enabled: true,
                    name: '热门文章',
                    selectors: ['#asideHotArticle']
                },
            }
        },
        ads: {
            enabled: true,
            name: '广告清理',
            children: {
                bannerAds: {
                    enabled: true,
                    name: '横幅广告',
                    selectors: ['.banner-ad', '.advertisement']
                },
                feedAds: {
                    enabled: true,
                    name: '信息流广告',
                    selectors: ['.feed-advert', '.flow-ad']
                },
                tracking: {
                    enabled: true,
                    name: '统计跟踪元素',
                    selectors: ['.csdn-tracking-statistics']
                },
            }
        },
        garbageContent: {
            enabled: true,
            name: '垃圾内容清理',
            children: {
                toolbar: {
                    enabled: true,
                    name: '标题栏',
                    children: {
                        vipIcon: {
                            enabled: true,
                            name: '会员图标',
                            selectors: ['.toolbar-btn-vip']
                        }
                    }
                },
                recommendedArticles: {
                    enabled: true,
                    name: '推荐文章',
                    selectors: ['.recommend-article', '.related-read']
                },
                footerContent: {
                    enabled: true,
                    name: '底部垃圾内容',
                    selectors: ['.blog-footer-bottom']
                },
                toolbox: {
                    enabled: true,
                    name: '工具栏',
                    children: {
                        aiAssistant: {
                            enabled: true,
                            name: 'AI助手',
                            selectors: ['.slide-details-cknows-box']
                        },
                        appBox: {
                            enabled: true,
                            name: '应用下载',
                            selectors: ['a.option-box.styleab[data-type="app"]']
                        },
                        chatBox: {
                            enabled: true,
                            name: '客服',
                            selectors: [
                                'a.option-box.styleab[data-type="cs"]',
                            ]
                        },
                        toolbox: {
                            enabled: true,
                            name: '收藏弹窗',
                            selectors: ['.tool-active-list'],
                        }
                    }
                }
            }
        },
        // 定期检查的时间间隔(毫秒)
        checkInterval: 1000
    };

    // 加载用户配置
    let userConfig;
    function loadConfig() {
        try {
            const savedConfig = localStorage.getItem('csdnCleanerConfig');
            debugLog('debug', '从localStorage读取的原始配置数据:', savedConfig);
            
            if (savedConfig) {
                const parsedConfig = JSON.parse(savedConfig);
                debugLog('debug', '从localStorage加载的配置:', parsedConfig);
                
                // 检查版本更新
                if (parsedConfig.version !== SCRIPT_VERSION) {
                    debugLog('info', `检测到脚本版本更新: ${parsedConfig.version} -> ${SCRIPT_VERSION}`);
                    debugLog('info', '将使用新的默认配置但保留用户设置');
                    
                    // 版本更新时，清理旧缓存并保留用户设置
                    userConfig = JSON.parse(JSON.stringify(defaultConfig));
                    
                    // 清理可能的旧版本缓存数据
                    const oldKeys = [
                        'csdnCleanerConfig_old',
                        'csdnCleanerCache',
                        'csdnCleanerSelectors',
                        'csdnCleanerVersion'
                    ];
                    oldKeys.forEach(key => {
                        if (localStorage.getItem(key)) {
                            localStorage.removeItem(key);
                            debugLog('debug', `已清理旧缓存: ${key}`);
                        }
                    });
                    
                    // 只保留用户的启用/禁用设置，使用新的选择器
                    function preserveUserSettings(target, source) {
                        for (let key in source) {
                            if (key === 'selectors' || key === 'version') {
                                // 选择器和版本号始终使用新的
                                continue;
                            }
                            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                                if (target[key] && target[key].enabled !== undefined) {
                                    source[key].enabled = target[key].enabled;
                                }
                                if (source[key].children) {
                                    preserveUserSettings(target[key]?.children || {}, source[key].children);
                                }
                            }
                        }
                    }
                    
                    preserveUserSettings(parsedConfig, userConfig);
                    saveConfig(); // 保存更新后的配置
                    
                    debugLog('info', '版本更新完成，旧缓存已清理');
                } else {
                    // 版本相同，正常合并
                    userConfig = JSON.parse(JSON.stringify(defaultConfig));
                    
                    // 深合并配置，确保结构完整
                    function deepMerge(target, source) {
                        for (let key in source) {
                            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                                if (!target[key]) target[key] = {};
                                if (typeof target[key] === 'object' && !Array.isArray(target[key])) {
                                    deepMerge(target[key], source[key]);
                                }
                            } else {
                                target[key] = source[key];
                            }
                        }
                        return target;
                    }

                    deepMerge(userConfig, parsedConfig);
                    debugLog('debug', '合并后的配置:', userConfig);
                }
            } else {
                debugLog('info', '未找到已保存的配置，使用默认配置');
                userConfig = JSON.parse(JSON.stringify(defaultConfig));
            }
        } catch (error) {
            debugLog('error', '加载配置失败:', error);
            userConfig = JSON.parse(JSON.stringify(defaultConfig));
        }
    }
    loadConfig();

    // 保存配置到localStorage
    function saveConfig() {
        try {
            const configToSave = JSON.stringify(userConfig, null, 2);
            debugLog('debug', '准备保存的配置:', configToSave);
            localStorage.setItem('csdnCleanerConfig', configToSave);
            debugLog('info', '配置已成功保存到localStorage');
            
            // 验证保存
            const savedConfig = localStorage.getItem('csdnCleanerConfig');
            debugLog('debug', '保存后验证:', savedConfig);
        } catch (error) {
            debugLog('error', '保存配置失败:', error);
            alert('保存配置失败: ' + error.message);
        }
    }

    // 强制清理缓存
    function forceClearCache() {
        try {
            debugLog('info', '开始强制清理缓存...');
            
            // 清理所有相关缓存
            const keysToRemove = [
                'csdnCleanerConfig',
                'csdnCleanerConfig_old',
                'csdnCleanerCache',
                'csdnCleanerSelectors',
                'csdnCleanerVersion'
            ];
            
            keysToRemove.forEach(key => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    debugLog('debug', `已清理缓存: ${key}`);
                }
            });
            
            debugLog('info', '缓存清理完成，将重新加载默认配置');
            
            // 重新加载配置
            userConfig = JSON.parse(JSON.stringify(defaultConfig));
            saveConfig();
            
            alert('缓存已清理！页面将刷新以应用最新配置。');
            location.reload();
            
        } catch (error) {
            debugLog('error', '清理缓存失败:', error);
            alert('清理缓存失败: ' + error.message);
        }
    }

    // 递归获取所有启用的选择器
    function getAllEnabledSelectors(configNode) {
        let selectors = [];

        // 如果节点本身不启用，直接返回空数组
        if (!configNode.enabled) {
            debugLog('debug', '节点已禁用，跳过:', configNode.name || 'unnamed');
            return selectors;
        }

        if (configNode.selectors) {
            selectors = selectors.concat(configNode.selectors);
            debugLog('debug', `节点 ${configNode.name || '未命名'} 的选择器:`, configNode.selectors);
        }

        if (configNode.children) {
            Object.values(configNode.children).forEach(child => {
                selectors = selectors.concat(getAllEnabledSelectors(child));
            });
        }

        return selectors;
    }

    // 移除元素函数
    function removeElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // 先尝试隐藏元素
                el.style.display = 'none';
                // 然后从DOM中移除
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        });
    }

    // 统一调试日志函数
    function debugLog(level, ...args) {
        if (!DEBUG_CONFIG.enabled) return;
        
        const levels = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = levels.indexOf(DEBUG_CONFIG.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        
        if (messageLevelIndex >= currentLevelIndex) {
            console[level](`[CSDN清理工具 ${level.toUpperCase()}]:`, ...args);
        }
    }

    // 主清理函数
    function cleanPage() {
        debugLog('info', '开始清理页面...');
        
        // 动态记录所有配置状态
        function logConfigStatus(config, prefix = '') {
            Object.entries(config).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null && key !== 'selectors') {
                    if (value.enabled !== undefined) {
                        debugLog('debug', `${prefix}${key}: ${value.enabled ? '启用' : '禁用'}`);
                    }
                    if (value.children) {
                        logConfigStatus(value.children, `${prefix}${key}.`);
                    }
                }
            });
        }
        
        // 记录所有配置状态
        logConfigStatus(userConfig);
        
        // 动态记录所有选择器匹配情况
        function logSelectors(config, prefix = '') {
            Object.entries(config).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    if (value.enabled && value.selectors) {
                        value.selectors.forEach(selector => {
                            const elements = document.querySelectorAll(selector);
                            debugLog('debug', `${prefix}${key} - 选择器 "${selector}" 匹配到 ${elements.length} 个元素`);
                        });
                    }
                    if (value.children) {
                        logSelectors(value.children, `${prefix}${key}.`);
                    }
                }
            });
        }
        
        // 记录所有选择器匹配情况（仅在调试模式下显示）
        logSelectors(userConfig);

        // 获取所有启用的选择器
        const allSelectors = [];
        
        function collectAllSelectors(config) {
            let selectors = [];
            Object.values(config).forEach(node => {
                if (typeof node === 'object' && node !== null) {
                    selectors = selectors.concat(getAllEnabledSelectors(node));
                }
            });
            return selectors;
        }
        
        const allEnabledSelectors = collectAllSelectors(userConfig);
        debugLog('debug', '启用的选择器统计:', {
            总选择器数量: allEnabledSelectors.length
        });

        // 移除所有匹配的元素
        removeElements(allEnabledSelectors);

        // 移除可能的弹窗事件监听
        document.body.style.overflow = 'auto'; // 恢复页面滚动
        debugLog('info', '页面清理完成');
    }

    // 显示版本信息
    debugLog('info', `CSDN Cleaner v${SCRIPT_VERSION} 正式版已加载`);

    // 初始清理
    cleanPage();

    // 设置定期检查，处理动态加载的内容
    setInterval(cleanPage, defaultConfig.checkInterval);

    // 创建配置面板UI
    function createConfigPanel() {
        // 添加样式 - 现代化的美观设计
        GM_addStyle(
            '#csdn-cleaner-panel {' +
            '    position: fixed;' +
            '    top: 50%;' +
            '    transform: translateY(-50%);' +
            '    right: 20px;' +
            '    width: 320px;' +
            '    max-height: 80vh;' +
            '    background: #ffffff;' +
            '    border: 1px solid #e2e8f0;' +
            '    border-radius: 12px;' +
            '    box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);' +
            '    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;' +
            '    font-size: 14px;' +
            '    line-height: 1.5;' +
            '    z-index: 9999;' +
            '    overflow: hidden;' +
            '    backdrop-filter: blur(10px);' +
            '    display: flex;' +
            '    flex-direction: column;' +
            '}' +
            '#csdn-cleaner-toggle {' +
            '    position: fixed;' +
            '    top: 50%;' +
            '    right: 0px;' +
            '    transform: translateY(-50%);' +
            '    width: 24px;' +
            '    height: 60px;' +
            '    background: linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%);' +
            '    border: none;' +
            '    border-radius: 12px 0 0 12px;' +
            '    color: white;' +
            '    cursor: pointer;' +
            '    font-size: 10px;' +
            '    line-height: 1.1;' +
            '    z-index: 1000;' +
            '    box-shadow: -1px 0 6px rgba(102, 126, 234, 0.15);' +
            '    transition: all 0.3s ease;' +
            '    display: flex;' +
            '    align-items: center;' +
            '    justify-content: center;' +
            '    opacity: 0.5;' +
            '    writing-mode: vertical-lr;' +
            '    text-orientation: mixed;' +
            '    padding: 6px 2px;' +
            '}' +
            '#csdn-cleaner-toggle:hover {' +
            '    opacity: 0.8;' +
            '    transform: translateY(-50%) translateX(-1px);' +
            '    box-shadow: -2px 0 8px rgba(102, 126, 234, 0.25);' +
            '}' +
            '#csdn-cleaner-panel h3 {' +
            '    margin: 0 0 20px 0;' +
            '    padding: 20px 20px 0 20px;' +
            '    font-size: 18px;' +
            '    font-weight: 700;' +
            '    color: #1a202c;' +
            '    text-align: center;' +
            '    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
            '    -webkit-background-clip: text;' +
            '    -webkit-text-fill-color: transparent;' +
            '    background-clip: text;' +
            '}' +
            '.config-group {' +
            '    margin-bottom: 12px;' +
            '}' +
            '.config-header {' +
            '    display: flex;' +
            '    align-items: center;' +
            '    margin-bottom: 6px;' +
            '    cursor: pointer;' +
            '    padding: 8px 0;' +
            '    border-radius: 6px;' +
            '    transition: all 0.2s ease;' +
            '}' +
            '.config-header:hover {' +
            '    background: #f7fafc;' +
            '    transform: translateX(2px);' +
            '}' +
            '.config-header input[type="checkbox"] {' +
            '    margin: 0 10px 0 0;' +
            '    width: 16px;' +
            '    height: 16px;' +
            '    cursor: pointer;' +
            '    accent-color: #667eea;' +
            '}' +
            '.config-header label {' +
            '    cursor: pointer;' +
            '    user-select: none;' +
            '    color: #2d3748;' +
            '    font-size: 14px;' +
            '    font-weight: 500;' +
            '}' +
            '.config-children {' +
            '    margin-left: 24px;' +
            '    margin-top: 6px;' +
            '    border-left: 2px solid #e2e8f0;' +
            '    padding-left: 12px;' +
            '}' +
            '.config-children .config-header label {' +
            '    font-size: 13px;' +
            '    color: #4a5568;' +
            '    font-weight: 400;' +
            '}' +
            '.button-container {' +
            '    padding: 0 20px 15px 20px;' +
            '    margin-top: 15px;' +
            '    border-top: 1px solid #e2e8f0;' +
            '    padding-top: 12px;' +
            '    flex-shrink: 0;' +
            '    display: flex;' +
            '    gap: 10px;' +
            '}' +
            '.save-btn, .reset-btn {' +
            '    border: none;' +
            '    padding: 10px 16px;' +
            '    border-radius: 8px;' +
            '    cursor: pointer;' +
            '    font-size: 14px;' +
            '    font-weight: 600;' +
            '    width: 50%;' +
            '    margin-top: 8px;' +
            '    transition: all 0.3s ease;' +
            '    font-family: inherit;' +
            '}' +
            '.save-btn {' +
            '    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);' +
            '    color: white;' +
            '    box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);' +
            '}' +
            '.save-btn:hover {' +
            '    transform: translateY(-1px);' +
            '    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);' +
            '}' +
            '.reset-btn {' +
            '    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);' +
            '    color: white;' +
            '    box-shadow: 0 2px 8px rgba(245, 101, 101, 0.3);' +
            '}' +
            '.reset-btn:hover {' +
            '    transform: translateY(-1px);' +
            '    box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);' +
            '}' +
            '.scroll-container {' +
            '    padding: 0 20px;' +
            '    max-height: 450px;' +
            '    overflow-y: auto;' +
            '    scrollbar-width: thin;' +
            '    scrollbar-color: #cbd5e0 #f7fafc;' +
            '    overscroll-behavior: contain;' +
            '}' +
            '.scroll-container::-webkit-scrollbar {' +
            '    width: 6px;' +
            '}' +
            '.scroll-container::-webkit-scrollbar-track {' +
            '    background: #f7fafc;' +
            '    border-radius: 3px;' +
            '}' +
            '.scroll-container::-webkit-scrollbar-thumb {' +
            '    background: #cbd5e0;' +
            '    border-radius: 3px;' +
            '}' +
            '.scroll-container::-webkit-scrollbar-thumb:hover {' +
            '    background: #a0aec0;' +
            '}'
        );

        // 切换按钮 - 可拖拽
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'csdn-cleaner-toggle';
        toggleBtn.textContent = '设置';
        toggleBtn.draggable = true;
        document.body.appendChild(toggleBtn);

        // 拖拽功能
        let isDragging = false;
        let currentY;
        let initialY;
        let yOffset = 0;

        // 从localStorage读取保存的位置
        const savedPosition = localStorage.getItem('csdnCleanerTogglePosition');
        if (savedPosition) {
            try {
                const pos = JSON.parse(savedPosition);
                toggleBtn.style.top = pos.top + 'px';
                toggleBtn.style.transform = 'translateY(0)';
                yOffset = pos.top;
            } catch (e) {
                // 如果位置数据无效，使用默认位置
            }
        }

        toggleBtn.addEventListener('dragstart', function(e) {
            isDragging = true;
            initialY = e.clientY - yOffset;
            toggleBtn.style.transition = 'none';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', '');
        });

        document.addEventListener('dragover', function(e) {
            if (isDragging) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        });

        document.addEventListener('drop', function(e) {
            if (isDragging) {
                e.preventDefault();
                isDragging = false;
                
                currentY = e.clientY;
                yOffset = currentY - initialY;
                
                // 限制在可视窗口内
                const maxY = window.innerHeight - toggleBtn.offsetHeight;
                const newTop = Math.max(0, Math.min(currentY - initialY, maxY));
                
                toggleBtn.style.top = newTop + 'px';
                toggleBtn.style.transform = 'translateY(0)';
                
                // 保存位置到localStorage
                localStorage.setItem('csdnCleanerTogglePosition', JSON.stringify({ top: newTop }));
                
                toggleBtn.style.transition = 'all 0.3s ease';
            }
        });

        toggleBtn.addEventListener('dragend', function(e) {
            if (isDragging) {
                isDragging = false;
                toggleBtn.style.transition = 'all 0.3s ease';
            }
        });

        // 触摸设备支持
        let touchStartY = 0;
        let touchCurrentY = 0;

        toggleBtn.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            toggleBtn.style.transition = 'none';
        });

        toggleBtn.addEventListener('touchmove', function(e) {
            e.preventDefault();
            touchCurrentY = e.touches[0].clientY;
            
            const deltaY = touchCurrentY - touchStartY;
            const currentTop = parseInt(toggleBtn.style.top) || (window.innerHeight / 2 - toggleBtn.offsetHeight / 2);
            
            // 限制在可视窗口内
            const maxY = window.innerHeight - toggleBtn.offsetHeight;
            const newTop = Math.max(0, Math.min(currentTop + deltaY, maxY));
            
            toggleBtn.style.top = newTop + 'px';
            toggleBtn.style.transform = 'translateY(0)';
            
            touchStartY = touchCurrentY;
            
            // 保存位置
            localStorage.setItem('csdnCleanerTogglePosition', JSON.stringify({ top: newTop }));
        });

        toggleBtn.addEventListener('touchend', function(e) {
            toggleBtn.style.transition = 'all 0.3s ease';
        });

        // 创建配置面板
        const panel = document.createElement('div');
        panel.id = 'csdn-cleaner-panel';
        panel.style.display = 'none';
        document.body.appendChild(panel);

        // 创建标题容器
        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 0 20px; margin-bottom: 20px;';
        
        // 创建面板标题
        const title = document.createElement('h3');
        title.textContent = 'CSDN清理工具';
        title.style.cssText = 'margin: 0; font-size: 18px; font-weight: 700; color: #1a202c; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;';
        
        // 创建清理缓存小按钮
        const clearCacheBtn = document.createElement('button');
        clearCacheBtn.textContent = '⚡';
        clearCacheBtn.title = '清理缓存';
        clearCacheBtn.style.cssText = 'width: 28px; height: 28px; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;';
        clearCacheBtn.addEventListener('mouseenter', function() {
            this.style.background = '#edf2f7';
            this.style.transform = 'scale(1.1)';
        });
        clearCacheBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f7fafc';
            this.style.transform = 'scale(1)';
        });
        clearCacheBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            debugLog('info', '清理缓存按钮被点击');
            if (confirm('确定要清理缓存并重新加载配置吗？')) {
                forceClearCache();
            }
        });
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(clearCacheBtn);
        panel.appendChild(titleContainer);

        // 创建可滚动的内容容器
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';
        scrollContainer.style.cssText = 'flex: 1; overflow-y: auto; padding: 0 20px;';
        panel.appendChild(scrollContainer);

        // 根据路径获取配置值
        function getConfigValueByPath(path) {
            const parts = path.split('.');
            let current = userConfig;

            // 处理顶层节点
            if (parts.length === 1) {
                return current[parts[0]] ? current[parts[0]].enabled : undefined;
            }

            // 处理嵌套节点
            for (let i = 0; i < parts.length - 1; i++) {
                if (current[parts[i]] && current[parts[i]].children) {
                    current = current[parts[i]].children;
                } else {
                    return undefined; // 路径无效
                }
            }

            // 获取最终节点
            if (current[parts[parts.length - 1]]) {
                return current[parts[parts.length - 1]].enabled;
            }
            return undefined;
        }

        // 根据路径更新配置
        function updateConfigByPath(path, key, value) {
            const parts = path.split('.');
            let current = userConfig;

            // 处理顶层节点
            if (parts.length === 1) {
                if (current[parts[0]]) {
                    current[parts[0]][key] = value;
                }
                return;
            }

            // 处理嵌套节点
            for (let i = 0; i < parts.length - 1; i++) {
                if (current[parts[i]] && current[parts[i]].children) {
                    current = current[parts[i]].children;
                } else {
                    return; // 路径无效
                }
            }

            // 更新最终节点
            if (current[parts[parts.length - 1]]) {
                current[parts[parts.length - 1]][key] = value;
            }
        }

        // 创建配置项
        function createConfigItems(configNode, parentElement, path) {
            const group = document.createElement('div');
            group.className = 'config-group';

            const header = document.createElement('div');
            header.className = 'config-header';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            // 根据当前保存的配置值设置复选框状态
            const savedValue = getConfigValueByPath(path);
            checkbox.checked = savedValue !== undefined ? savedValue : configNode.enabled;
            checkbox.dataset.path = path;

            checkbox.addEventListener('change', function () {
                updateConfigByPath(path, 'enabled', this.checked);
                debugLog('debug', `已更新 ${path}.enabled 为 ${this.checked}`);

                // 更新子节点
                const childCheckboxes = document.querySelectorAll(`input[data-path^="${path}."]`);
                childCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                    updateConfigByPath(cb.dataset.path, 'enabled', this.checked);
                    debugLog('debug', `已更新 ${cb.dataset.path}.enabled 为 ${this.checked}`);
                });

                // 更新父节点
                updateParentCheckboxState(this);

                // 自动保存配置
                saveConfig();
                debugLog('info', '配置已自动保存');
            });

            const label = document.createElement('label');
            label.textContent = configNode.name || path.split('.').pop();

            header.appendChild(checkbox);
            header.appendChild(label);
            group.appendChild(header);

            // 如果有子项，创建子项
            if (configNode.children) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'config-children';

                Object.entries(configNode.children).forEach(([key, childNode]) => {
                    const childPath = path ? `${path}.${key}` : key;
                    createConfigItems(childNode, childrenContainer, childPath);
                });

                group.appendChild(childrenContainer);
            }

            parentElement.appendChild(group);
        }

        // 更新父节点复选框状态
        function updateParentCheckboxState(childCheckbox) {
            const childPath = childCheckbox.dataset.path;
            const parentPath = childPath.substring(0, childPath.lastIndexOf('.'));

            if (parentPath) {
                const parentCheckbox = document.querySelector(`input[data-path="${parentPath}"]`);
                if (parentCheckbox) {
                    const childCheckboxes = document.querySelectorAll(`input[data-path^="${parentPath}."]`);
                    const allChecked = Array.from(childCheckboxes).every(cb => cb.checked);
                    const anyChecked = Array.from(childCheckboxes).some(cb => cb.checked);

                    if (allChecked) {
                        parentCheckbox.checked = true;
                        parentCheckbox.indeterminate = false;
                    } else if (anyChecked) {
                        parentCheckbox.checked = false;
                        parentCheckbox.indeterminate = true;
                    } else {
                        parentCheckbox.checked = false;
                        parentCheckbox.indeterminate = false;
                    }

                    // 更新父节点配置
                    updateConfigByPath(parentPath, 'enabled', allChecked);

                    // 递归更新更上层的父节点 - 限制递归深度以避免堆栈溢出
                    if (parentPath.split('.').length < 5) {
                        updateParentCheckboxState(parentCheckbox);
                    }
                }
            }
        }

        // 动态添加所有配置项
        function addAllConfigItems(config, container) {
            Object.entries(config).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null && key !== 'version' && key !== 'checkInterval') {
                    createConfigItems(value, container, key);
                }
            });
        }

        // 添加所有配置项
        addAllConfigItems(userConfig, scrollContainer);

        // 初始化所有父节点状态
        function initAllParentStates() {
            // 获取所有顶级配置项
            const topLevelKeys = Object.keys(userConfig).filter(key => 
                typeof userConfig[key] === 'object' && 
                userConfig[key] !== null && 
                key !== 'version' && 
                key !== 'checkInterval'
            );

            // 为每个顶级配置项初始化父节点状态
            topLevelKeys.forEach(key => {
                const childCheckboxes = document.querySelectorAll(`input[data-path^="${key}."]`);
                if (childCheckboxes.length > 0) {
                    updateParentCheckboxState(childCheckboxes[0]);
                }
            });
        }

        // 调用初始化函数
        initAllParentStates();

        // 创建按钮容器 - 精简布局
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #e2e8f0; background: #f8fafc; flex-shrink: 0;';
        buttonContainer.style.flexShrink = '0';
        buttonContainer.className = 'button-container';

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = 'flex: 1; padding: 8px 12px; font-size: 13px; font-weight: 600; color: white; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;';
        debugLog('debug', '保存按钮已创建');
        saveBtn.addEventListener('click', function () {
            debugLog('info', '保存按钮被点击');
            saveConfig();
            alert('配置已保存！页面将自动刷新以应用新配置。');
            location.reload();
        });

        // 重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.textContent = '重置';
        resetBtn.style.cssText = 'flex: 1; padding: 8px 12px; font-size: 13px; font-weight: 600; color: white; background: linear-gradient(135deg, #fc8181 0%, #f56565 100%); border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;';
        debugLog('debug', '重置按钮已创建');
        resetBtn.addEventListener('click', function () {
            debugLog('info', '重置按钮被点击');
            if (confirm('确定要重置为默认配置吗？此操作不可撤销！')) {
                userConfig = JSON.parse(JSON.stringify(defaultConfig));
                debugLog('debug', '重置后的配置:', userConfig);
                
                // 更新UI状态
                function updateCheckboxes(config, path = '') {
                    Object.entries(config).forEach(([key, node]) => {
                        if (typeof node === 'object' && node !== null) {
                            const currentPath = path ? `${path}.${key}` : key;
                            const checkbox = document.querySelector(`input[data-path="${currentPath}"]`);
                            if (checkbox) {
                                checkbox.checked = node.enabled;
                            }
                            if (node.children) {
                                updateCheckboxes(node.children, currentPath);
                            }
                        }
                    });
                }
                updateCheckboxes(defaultConfig);
                
                // 保存重置后的配置
                saveConfig();
                
                // 重新执行清理
                cleanPage();
                
                debugLog('info', '配置已重置为默认值');
                
                alert('配置已重置为默认值！页面将自动刷新以应用默认配置。');
                location.reload(); // 重新加载页面以应用默认配置
            }
        });

        // 将按钮添加到按钮容器
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(resetBtn);

        // 将按钮容器添加到面板
        panel.appendChild(buttonContainer);
        debugLog('debug', '按钮容器已添加到面板');
        debugLog('debug', '面板中的子元素数量:', panel.children.length);

        // 切换面板显示/隐藏
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            debugLog('debug', '切换按钮被点击');
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';

            // 控制下层页面滚动
            if (!isVisible) {
                // 不再修改body样式，让页面保持正常滚动
            }

            debugLog('debug', '面板显示状态:', !isVisible);
        });

        // 点击面板外部关闭面板
        document.addEventListener('click', function (e) {
            if (panel.style.display !== 'none') {
                const isClickInsidePanel = panel.contains(e.target);
                const isClickOnToggle = toggleBtn.contains(e.target);

                if (!isClickInsidePanel && !isClickOnToggle) {
                    panel.style.display = 'none';
                }
            }
        });

        // 阻止面板内部点击事件冒泡
        panel.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // 检查面板初始状态
        console.log('面板初始显示状态:', panel.style.display);
    }

    // 创建配置面板
    createConfigPanel();

    // 监控DOM变化，处理动态添加的元素
    const observer = new MutationObserver(cleanPage);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();