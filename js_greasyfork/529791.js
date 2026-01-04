// ==UserScript==
// @name         AI Page Summarizer Pro
// @name:zh-CN   AI网页内容智能总结助手
// @namespace    http://tampermonkey.net/
// @version     1.3
// @description  网页内容智能总结，支持自定义API和提示词
// @description:zh-CN  网页内容智能总结，支持自定义API和提示词
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.addStyle
// @grant        window.fetch
// @grant        window.localStorage
// @connect      api.openai.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js
// @run-at       document-start
// @noframes
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @compatible   android
// @downloadURL https://update.greasyfork.org/scripts/529791/AI%20Page%20Summarizer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/529791/AI%20Page%20Summarizer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局错误处理
    window.addEventListener('error', function(event) {
        console.error('脚本错误:', event.error);
        if (event.error && event.error.stack) {
            console.error('错误堆栈:', event.error.stack);
        }
    });

    window.addEventListener('unhandledrejection', function(event) {
        console.error('未处理的Promise错误:', event.reason);
    });

    // 兼容性检查
    const browserSupport = {
        hasGM: typeof GM !== 'undefined',
        hasGMFunctions: typeof GM_getValue !== 'undefined',
        hasLocalStorage: (function() {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        })(),
        hasBackdropFilter: (function() {
            const el = document.createElement('div');
            return typeof el.style.backdropFilter !== 'undefined' || 
                   typeof el.style.webkitBackdropFilter !== 'undefined';
        })(),
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    };

    // 兼容性处理层
    const scriptHandler = {
        // 存储值
        setValue: async function(key, value) {
            try {
                if (browserSupport.hasGMFunctions) {
                    GM_setValue(key, value);
                    return true;
                } else if (browserSupport.hasGM && GM.setValue) {
                    await GM.setValue(key, value);
                    return true;
                } else if (browserSupport.hasLocalStorage) {
                    localStorage.setItem('ws_' + key, JSON.stringify(value));
                    return true;
                }
                return false;
            } catch (error) {
                console.error('存储值失败:', error);
                return false;
            }
        },
        
        // 获取值
        getValue: async function(key, defaultValue) {
            try {
                if (browserSupport.hasGMFunctions) {
                    return GM_getValue(key, defaultValue);
                } else if (browserSupport.hasGM && GM.getValue) {
                    return await GM.getValue(key, defaultValue);
                } else if (browserSupport.hasLocalStorage) {
                    const value = localStorage.getItem('ws_' + key);
                    return value ? JSON.parse(value) : defaultValue;
                }
                return defaultValue;
            } catch (error) {
                console.error('获取值失败:', error);
                return defaultValue;
            }
        },
        
        // HTTP请求
        xmlHttpRequest: function(details) {
            return new Promise((resolve, reject) => {
                const handleResponse = (response) => {
                    resolve(response);
                };

                const handleError = (error) => {
                    reject(new Error('请求错误: ' + error.message));
                };

                if (browserSupport.hasGMFunctions && typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        ...details,
                        onload: handleResponse,
                        onerror: handleError,
                        ontimeout: details.ontimeout
                    });
                } else if (browserSupport.hasGM && typeof GM !== 'undefined' && GM.xmlHttpRequest) {
                    GM.xmlHttpRequest({
                        ...details,
                        onload: handleResponse,
                        onerror: handleError,
                        ontimeout: details.ontimeout
                    });
                } else {
                    fetch(details.url, {
                        method: details.method,
                        headers: details.headers,
                        body: details.data,
                        mode: 'cors',
                        credentials: 'omit'
                    })
                    .then(async response => {
                        const text = await response.text();
                        handleResponse({
                            status: response.status,
                            responseText: text,
                            responseHeaders: [...response.headers].join('\n')
                        });
                    })
                    .catch(handleError);
                }
            }).then(response => {
                if (details.onload) {
                    details.onload(response);
                }
                return response;
            }).catch(error => {
                if (details.onerror) {
                    details.onerror(error);
                }
                throw error;
            });
        },
        
        // 注册菜单命令
        registerMenuCommand: function(name, fn) {
            try {
                if (browserSupport.hasGMFunctions) {
                    GM_registerMenuCommand(name, fn);
                    return true;
                } else if (browserSupport.hasGM && GM.registerMenuCommand) {
                    GM.registerMenuCommand(name, fn);
                    return true;
                }
                return false;
            } catch (error) {
                console.log('注册菜单命令失败:', error);
                return false;
            }
        },
        
        // 添加样式
        addStyle: function(css) {
            try {
                if (browserSupport.hasGMFunctions) {
                    GM_addStyle(css);
                    return true;
                } else if (browserSupport.hasGM && GM.addStyle) {
                    GM.addStyle(css);
                    return true;
                } else {
                    const style = document.createElement('style');
                    style.textContent = css;
                    document.head.appendChild(style);
                    return true;
                }
            } catch (error) {
                console.error('添加样式失败:', error);
                return false;
            }
        }
    };

    // 配置项
    let config = {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        model: 'gpt-3.5-turbo',
        theme: 'light',
        prompt: `You are a professional content summarizer in chinese. Your task is to create a clear, concise, and well-structured summary of the webpage content. Follow these guidelines:

1. Output Format:
   - Use ## for main sections
   - Use bullet points (•) for key points and details
   - Use bold for important terms
   - Use blockquotes for notable quotes

2. Content Structure:
   ## 核心观点
   • Key points here...

   ## 关键信息
   • Important details here...

   ## 市场情绪
   • Market sentiment here...

   ## 专家观点
   • Expert opinions here...

   ## 总结
   • Final summary here...

3. Writing Style:
   - Clear and concise language
   - Professional tone
   - Logical flow
   - Easy to understand
   - Focus on essential information

4. Important Rules:
   - DO NOT show your reasoning process
   - DO NOT include meta-commentary
   - DO NOT explain your methodology
   - DO NOT use phrases like "this summary shows" or "the content indicates"
   - Start directly with the content summary
   - Make sure bullet points (•) are in the same line with text
   - Use ## for main section headers

Remember: Focus on delivering the information directly without any meta-analysis or explanation of your process.`,
        iconPosition: { y: 20 },
        shortcut: 'option+a',
        summaryWindowPosition: null // 用于存储摘要窗口的位置 {left, top}
    };

    // 初始化配置
    async function initConfig() {
        config.apiUrl = await scriptHandler.getValue('apiUrl', config.apiUrl);
        config.apiKey = await scriptHandler.getValue('apiKey', config.apiKey);
        config.model = await scriptHandler.getValue('model', config.model);
        config.prompt = await scriptHandler.getValue('prompt', config.prompt);
        config.iconPosition = await scriptHandler.getValue('iconPosition', config.iconPosition || { y: 20 });
        config.shortcut = await scriptHandler.getValue('shortcut', config.shortcut);
        config.theme = await scriptHandler.getValue('theme', config.theme);
        config.summaryWindowPosition = await scriptHandler.getValue('summaryWindowPosition', null);
        
        console.log('加载的图标位置配置:', config.iconPosition);
        if (config.summaryWindowPosition) {
            console.log('加载的摘要窗口位置配置:', config.summaryWindowPosition);
        }
    }

    // DOM 元素引用
    const elements = {
        icon: null,
        container: null,
        settings: null,
        backdrop: null
    };

    // 全局变量用于判断是否已经监听了键盘事件
    let keyboardListenerActive = false;

    // 显示提示消息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        
        const baseStyle = `
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: ${browserSupport.isMobile ? '12px 24px' : '10px 20px'};
            border-radius: 4px;
            z-index: 1000001;
            font-size: ${browserSupport.isMobile ? '16px' : '14px'};
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            text-align: center;
            max-width: ${browserSupport.isMobile ? '90%' : '300px'};
            word-break: break-word;
        `;
        
        // 在移动设备上显示在底部，否则显示在顶部
        const position = browserSupport.isMobile ? 
            'bottom: 80px;' : 
            'top: 20px;';
        
        toast.style.cssText = baseStyle + position;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 快捷键处理
    const keyManager = {
        setup() {
            try {
                // 移除旧的监听器
                if (keyboardListenerActive) {
                    document.removeEventListener('keydown', this._handleKeyDown);
                }

                // 添加新的监听器
                this._handleKeyDown = (e) => {
                    // 忽略输入框中的按键
                    if (e.target.tagName === 'INPUT' || 
                        e.target.tagName === 'TEXTAREA' || 
                        e.target.isContentEditable ||
                        e.target.getAttribute('role') === 'textbox') {
                        return;
                    }

                    // 解析配置的快捷键
                    const shortcutParts = config.shortcut.toLowerCase().split('+');
                    
                    // 获取主键(非修饰键)
                    const mainKey = shortcutParts.filter(part => 
                        !['alt', 'option', 'ctrl', 'control', 'shift', 'cmd', 'command', 'meta']
                        .includes(part)
                    )[0] || 'a';
                    
                    // 检查所需的修饰键
                    const needAlt = shortcutParts.some(p => p === 'alt' || p === 'option');
                    const needCtrl = shortcutParts.some(p => p === 'ctrl' || p === 'control');
                    const needShift = shortcutParts.some(p => p === 'shift');
                    const needMeta = shortcutParts.some(p => p === 'cmd' || p === 'command' || p === 'meta');
                    
                    // 检查按键是否匹配
                    const isMainKeyMatched = 
                        e.key.toLowerCase() === mainKey || 
                        e.code.toLowerCase() === 'key' + mainKey ||
                        e.keyCode === mainKey.toUpperCase().charCodeAt(0);
                        
                    // 检查修饰键是否匹配
                    const modifiersMatch = 
                        e.altKey === needAlt && 
                        e.ctrlKey === needCtrl && 
                        e.shiftKey === needShift && 
                        e.metaKey === needMeta;
                    
                    if (isMainKeyMatched && modifiersMatch) {
                        console.log('快捷键触发成功:', config.shortcut);
                        e.preventDefault();
                        e.stopPropagation();
                        showSummary();
                        return false;
                    }
                };
                
                // 使用捕获阶段来确保我们能先捕获到事件
                document.addEventListener('keydown', this._handleKeyDown, true);
                keyboardListenerActive = true;
                
                // 设置全局访问方法
                window.activateSummary = showSummary;
                
                console.log('快捷键已设置:', config.shortcut);
                return true;
            } catch (error) {
                console.error('设置快捷键失败:', error);
                return false;
            }
        }
    };

    // 等待页面加载完成
    function waitForPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeScript);
        } else {
            initializeScript();
        }
    }

    // 保存配置数据
    async function saveConfig() {
        try {
            await scriptHandler.setValue('apiUrl', config.apiUrl);
            await scriptHandler.setValue('apiKey', config.apiKey);
            await scriptHandler.setValue('model', config.model);
            await scriptHandler.setValue('prompt', config.prompt);
            await scriptHandler.setValue('iconPosition', config.iconPosition);
            await scriptHandler.setValue('shortcut', config.shortcut);
            await scriptHandler.setValue('theme', config.theme);
            console.log('配置已保存');
            return true;
        } catch (error) {
            console.error('保存配置失败:', error);
            return false;
        }
    }

    // 为Safari创建专用存储对象
    function createSafariStorage() {
        // 内存缓存
        const memoryCache = {};
        
        return {
            getValue: async function(key, defaultValue) {
                try {
                    // 优先从localStorage获取
                    if (browserSupport.hasLocalStorage) {
                        const storedValue = localStorage.getItem('ws_' + key);
                        if (storedValue !== null) {
                            return JSON.parse(storedValue);
                        }
                    }
                    
                    // 返回内存缓存或默认值
                    return key in memoryCache ? memoryCache[key] : defaultValue;
                } catch (error) {
                    console.error(`Safari存储读取失败 [${key}]:`, error);
                    return defaultValue;
                }
            },
            
            setValue: async function(key, value) {
                try {
                    // 尝试写入localStorage
                    if (browserSupport.hasLocalStorage) {
                        localStorage.setItem('ws_' + key, JSON.stringify(value));
                    }
                    
                    // 同时写入内存缓存
                    memoryCache[key] = value;
                    return true;
                } catch (error) {
                    console.error(`Safari存储写入失败 [${key}]:`, error);
                    // 仅写入内存缓存
                    memoryCache[key] = value;
                    return false;
                }
            }
        };
    }

    // 修复Safari的拖拽和显示问题
    function fixSafariIssues() {
        if (!browserSupport.isSafari) return;
        
        console.log('应用Safari兼容性修复');
        
        // 为Safari添加特定CSS
        const safariCSS = `
            #website-summary-icon, 
            #website-summary-container,
            #website-summary-settings {
                -webkit-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                touch-action: none !important;
            }
            
            #website-summary-content {
                -webkit-user-select: text !important;
                user-select: text !important;
                touch-action: auto !important;
            }
        `;
        
        scriptHandler.addStyle(safariCSS);
    }

    // 初始化脚本处理程序
    function initScriptHandler() {
        // 检测Safari浏览器
        if (browserSupport.isSafari) {
            console.log('检测到Safari浏览器，应用特殊兼容');
            
            // 创建Safari特定存储
            const safariStorage = createSafariStorage();
            
            // 修改scriptHandler中的存储方法
            const originalGetValue = scriptHandler.getValue;
            const originalSetValue = scriptHandler.setValue;
            
            // 覆盖getValue方法
            scriptHandler.getValue = async function(key, defaultValue) {
                try {
                    // 先尝试原有方法
                    const result = await originalGetValue.call(scriptHandler, key, defaultValue);
                    
                    // 如果获取失败或返回undefined，使用Safari存储
                    if (result === undefined || result === null) {
                        console.log(`标准存储获取失败，使用Safari存储 [${key}]`);
                        return await safariStorage.getValue(key, defaultValue);
                    }
                    
                    return result;
                } catch (error) {
                    console.error(`getValue失败 [${key}]:`, error);
                    return await safariStorage.getValue(key, defaultValue);
                }
            };
            
            // 覆盖setValue方法
            scriptHandler.setValue = async function(key, value) {
                try {
                    // 同时尝试原有方法和Safari存储
                    const originalResult = await originalSetValue.call(scriptHandler, key, value);
                    const safariResult = await safariStorage.setValue(key, value);
                    
                    // 只要有一个成功就返回成功
                    return originalResult || safariResult;
                } catch (error) {
                    console.error(`setValue失败 [${key}]:`, error);
                    // 尝试使用Safari存储作为后备
                    return await safariStorage.setValue(key, value);
                }
            };
            
            // 应用Safari特定修复
            fixSafariIssues();
        }
    }

    // 初始化脚本
    async function initializeScript() {
        try {
            // 初始化ScriptHandler
            initScriptHandler();
            // 等待marked库加载
            await waitForMarked();
            // 初始化配置
            await initConfig();
            // 添加全局样式
            addGlobalStyles();
            // 创建图标
            createIcon();
            // 设置快捷键
            keyManager.setup();
            // 注册菜单命令
            registerMenuCommands();
            
            console.log('AI Page Summarizer Pro 初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 等待marked库加载
    function waitForMarked() {
        return new Promise((resolve) => {
            if (window.marked) {
                window.marked.setOptions({ breaks: true, gfm: true });
                resolve();
            } else {
                const checkMarked = setInterval(() => {
                    if (window.marked) {
                        clearInterval(checkMarked);
                        window.marked.setOptions({ breaks: true, gfm: true });
                        resolve();
                    }
                }, 100);
                // 10秒后超时
                setTimeout(() => {
                    clearInterval(checkMarked);
                    console.warn('marked库加载超时，继续初始化');
                    resolve();
                }, 10000);
            }
        });
    }

    // 添加全局样式
    function addGlobalStyles() {
        const css = `
            #website-summary-icon * {
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            #website-summary-icon span {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                line-height: 1 !important;
            }
        `;
        scriptHandler.addStyle(css);
    }

    // 创建图标
    function createIcon() {
        // 检查是否已存在图标
        const existingIcon = document.getElementById('website-summary-icon');
        if (existingIcon) {
            existingIcon.remove();
        }

        // 创建图标元素
        const icon = document.createElement('div');
        icon.id = 'website-summary-icon';
        icon.innerHTML = '💡';
        
        // 从配置中获取保存的位置
        const savedPosition = config.iconPosition || {};
        const hasValidPosition = typeof savedPosition.x === 'number' && typeof savedPosition.y === 'number';
        
        // 计算位置样式
        let positionStyle = '';
        if (hasValidPosition) {
            // 使用保存的精确位置
            positionStyle = `
                top: ${savedPosition.y}px !important;
                left: ${savedPosition.x}px !important;
                right: auto !important;
                bottom: auto !important;
            `;
        } else {
            // 使用默认位置
            positionStyle = `
                bottom: 20px !important;
                right: 20px !important;
            `;
        }
        
        // 设置图标样式 - macOS 26 液态玻璃风格
        const isDark = config.theme === 'dark';
        const glassStyle = isDark ? `
            background: linear-gradient(135deg, rgba(50, 50, 50, 0.7), rgba(30, 30, 30, 0.4)) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            box-shadow:
                0 8px 32px 0 rgba(0, 0, 0, 0.3) !important,
                inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        ` : `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)) !important;
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            box-shadow:
                0 8px 32px 0 rgba(31, 38, 135, 0.1) !important,
                inset 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
        `;

        icon.style.cssText = `
            position: fixed;
            z-index: 2147483647 !important;
            ${positionStyle}
            ${glassStyle}
            width: auto !important;
            height: auto !important;
            padding: 12px !important;
            font-size: ${browserSupport.isMobile ? '20px' : '24px'} !important;
            line-height: 1 !important;
            cursor: pointer !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            visibility: visible !important;
            opacity: 1;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            border-radius: 18px !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
        `;

        // 添加鼠标悬停效果
        icon.addEventListener('mouseover', () => {
            icon.style.opacity = '1';
        });

        icon.addEventListener('mouseout', () => {
            icon.style.opacity = '0.8';
        });

        // 添加点击事件
        icon.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await showSummary();
        });

        // 修改右键菜单处理方式
        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSettings();
        });

        // 支持双击打开设置（为Safari增加额外的交互方式）
        let lastClickTime = 0;
        icon.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < 300) { // 双击间隔300ms
                e.preventDefault();
                e.stopPropagation();
                showSettings();
            }
            lastClickTime = currentTime;
        });

        // 添加优化的拖动功能
        makeIconDraggable(icon);

        // 确保 body 存在后再添加图标
        if (document.body) {
            document.body.appendChild(icon);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(icon);
            });
        }

        // 将图标引用存储到elements对象中
        elements.icon = icon;
    }
    
    // 专门为图标设计的拖动函数
    function makeIconDraggable(icon) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        // 鼠标/触摸开始事件
        function handleStart(e) {
            isDragging = true;
            
            // 记录初始位置
            const rect = icon.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            // 记录鼠标/触摸起始位置
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
                e.preventDefault(); // 防止选中文本
            }
            
            // 设置拖动时的样式
            icon.style.transition = 'none';
            icon.style.opacity = '1';
            
            // 添加移动和结束事件监听
            if (e.type === 'touchstart') {
                document.addEventListener('touchmove', handleMove, { passive: false });
                document.addEventListener('touchend', handleEnd);
            } else {
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', handleEnd);
            }
        }
        
        // 鼠标/触摸移动事件
        function handleMove(e) {
            if (!isDragging) return;
            
            let moveX, moveY;
            if (e.type === 'touchmove') {
                moveX = e.touches[0].clientX - startX;
                moveY = e.touches[0].clientY - startY;
                e.preventDefault(); // 防止页面滚动
            } else {
                moveX = e.clientX - startX;
                moveY = e.clientY - startY;
            }
            
            // 计算新位置
            let newLeft = startLeft + moveX;
            let newTop = startTop + moveY;
            
            // 边界检查
            newLeft = Math.max(0, Math.min(window.innerWidth - icon.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - icon.offsetHeight, newTop));
            
            // 更新位置
            icon.style.left = `${newLeft}px`;
            icon.style.top = `${newTop}px`;
            icon.style.right = 'auto';
            icon.style.bottom = 'auto';
        }
        
        // 鼠标/触摸结束事件
        function handleEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            // 移除事件监听
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
            
            // 保存新位置
            const rect = icon.getBoundingClientRect();
            config.iconPosition = {
                x: rect.left,
                y: rect.top
            };
            
            // 持久化保存位置
            saveIconPosition();
            
            // 恢复透明度过渡效果
            icon.style.transition = 'opacity 0.3s ease';
            if (!icon.matches(':hover')) {
                icon.style.opacity = '0.8';
            }
        }
        
        // 添加事件监听
        icon.addEventListener('mousedown', handleStart);
        icon.addEventListener('touchstart', handleStart, { passive: false });
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => {
            const rect = icon.getBoundingClientRect();
            
            // 如果图标超出视口范围，调整位置
            if (rect.right > window.innerWidth) {
                icon.style.left = `${window.innerWidth - icon.offsetWidth}px`;
            }
            
            if (rect.bottom > window.innerHeight) {
                icon.style.top = `${window.innerHeight - icon.offsetHeight}px`;
            }
            
            // 更新保存的位置
            config.iconPosition = {
                x: parseInt(icon.style.left),
                y: parseInt(icon.style.top)
            };
            
            // 持久化保存位置
            saveIconPosition();
        });
    }

    // 保存图标位置
    function saveIconPosition() {
        scriptHandler.setValue('iconPosition', config.iconPosition);
        console.log('图标位置已保存:', config.iconPosition);
    }

    // 显示设置界面
    function showSettings() {
        try {
            const settings = elements.settings || createSettingsUI();
            settings.style.display = 'block';
            showBackdrop();
            setTimeout(() => settings.style.opacity = '1', 10);
        } catch (error) {
            console.error('显示设置界面失败:', error);
            alert('无法显示设置界面，请检查控制台以获取详细信息');
        }
    }

    // 显示摘要
    async function showSummary() {
        const container = elements.container || createSummaryUI();
        const content = container.querySelector('#website-summary-content');
        
        // 如果容器有自定义位置，保持原位置；否则重置到屏幕中心
        const hasCustomPosition = container.hasAttribute('data-positioned');
        if (!hasCustomPosition) {
            container.style.left = '50%';
            container.style.top = '50%';
            container.style.transform = 'translate(-50%, -50%)';
        }
        
        // 显示容器和背景
        showBackdrop();
        container.style.display = 'block';
        setTimeout(() => container.style.opacity = '1', 10);
        
        // 显示加载中
        content.innerHTML = `<p style="text-align: center; color: ${config.theme === 'dark' ? '#bdc1c6' : '#666'};">正在获取总结...</p>`;
        
        try {
            // 获取页面内容
            const pageContent = getPageContent();
            if (!pageContent || pageContent.trim().length === 0) {
                throw new Error('无法获取页面内容');
            }
            
            console.log('页面内容长度:', pageContent.length);
            console.log('API配置:', {
                url: config.apiUrl,
                model: config.model,
                contentLength: pageContent.length
            });
            
            // 获取总结
            const summary = await getSummary(pageContent);
            if (!summary || summary.trim().length === 0) {
                throw new Error('API返回内容为空');
            }
            
            // 添加样式并渲染内容
            addMarkdownStyles();
            await renderContent(summary);
        } catch (error) {
            console.error('总结失败:', error);
            content.innerHTML = `
                <p style="text-align: center; color: #ff4444;">
                    获取总结失败：${error.message}<br>
                    <small style="color: ${config.theme === 'dark' ? '#bdc1c6' : '#666'};">
                        请检查控制台以获取详细错误信息
                    </small>
                </p>`;
        }
    }

    // 创建/显示背景
    function showBackdrop() {
        if (!elements.backdrop) {
            const backdrop = document.createElement('div');
            backdrop.id = 'website-summary-backdrop';
            const isDark = config.theme === 'dark';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                z-index: 999997;
                display: none;
                opacity: 0;
                transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            `;
            
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    hideUI();
                }
            });
            
            document.body.appendChild(backdrop);
            elements.backdrop = backdrop;
        } else {
            // 更新背景颜色以匹配当前主题
            const isDark = config.theme === 'dark';
            elements.backdrop.style.backgroundColor = isDark ? 'rgba(32, 33, 36, 0.75)' : 'rgba(250, 250, 252, 0.75)';
        }
        
        elements.backdrop.style.display = 'block';
        setTimeout(() => elements.backdrop.style.opacity = '1', 10);
    }

    // 隐藏UI
    function hideUI() {
        // 隐藏背景
        if (elements.backdrop) {
            elements.backdrop.style.opacity = '0';
            setTimeout(() => elements.backdrop.style.display = 'none', 300);
        }
        
        // 隐藏摘要容器
        if (elements.container) {
            elements.container.style.opacity = '0';
            setTimeout(() => elements.container.style.display = 'none', 300);
        }
    }

    // 创建摘要UI
    function createSummaryUI() {
        const container = document.createElement('div');
        container.id = 'website-summary-container';
        
        const isDark = config.theme === 'dark';
        
        // macOS 26 液态玻璃风格
        const glassStyle = isDark ? `
            background: linear-gradient(135deg, rgba(40, 40, 40, 0.8), rgba(20, 20, 20, 0.6));
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow:
                0 20px 50px rgba(0, 0, 0, 0.5),
                inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        ` : `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow:
                0 20px 50px rgba(0, 0, 0, 0.1),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        `;

        let styles = `
            position: fixed;
            z-index: 999998;
            ${glassStyle}
            color: ${isDark ? darkColors.text : '#333'};
            border-radius: ${browserSupport.isMobile ? '20px' : '24px'};
            padding: ${browserSupport.isMobile ? '16px' : '24px'};
            width: ${browserSupport.isMobile ? '92%' : '80%'};
            max-width: ${browserSupport.isMobile ? '100%' : '800px'};
            max-height: ${browserSupport.isMobile ? '85vh' : '80vh'};
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Roboto, sans-serif;
            display: none;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            overflow: hidden;
            opacity: 0;
            transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            will-change: transform, opacity;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            backdrop-filter: blur(40px) saturate(180%);
            -webkit-backdrop-filter: blur(40px) saturate(180%);
        `;

        container.style.cssText = styles;

        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            cursor: move;
            padding-bottom: 8px;
            border-bottom: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            user-select: none;
            -webkit-user-select: none;
        `;

        // 标题
        const title = document.createElement('h3');
        // 获取当前页面标题并截断(如果过长)
        const pageTitle = document.title;
        const maxTitleLength = browserSupport.isMobile ? 30 : 50;
        title.textContent = pageTitle.length > maxTitleLength ? 
            pageTitle.substring(0, maxTitleLength) + '...' : 
            pageTitle;
        title.style.cssText = `
            margin: 0; 
            font-size: 16px; 
            color: ${isDark ? '#e8eaed' : '#333'};
            pointer-events: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: ${browserSupport.isMobile ? '160px' : '350px'};
            font-weight: 500;
        `;

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 12px; align-items: center;';

        // 复制按钮 - Mac风格SVG图标
        const copyBtn = document.createElement('button');
        copyBtn.title = '复制内容';
        copyBtn.style.cssText = `
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            transition: background-color 0.2s;
            color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
        `;

        // Mac风格的复制图标SVG
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;

        copyBtn.addEventListener('mouseover', () => {
            copyBtn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        });
        
        copyBtn.addEventListener('mouseout', () => {
            copyBtn.style.backgroundColor = 'transparent';
        });

        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const content = document.getElementById('website-summary-content').innerText;
            navigator.clipboard.writeText(content).then(() => {
                // 显示复制成功状态
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                `;
                copyBtn.style.color = isDark ? '#8ab4f8' : '#34c759';
                
                setTimeout(() => {
                    // 恢复原始图标
                    copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                    copyBtn.style.color = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
                }, 1500);
            });
        });

        // 设置按钮 - Mac风格SVG图标
        const settingsBtn = document.createElement('button');
        settingsBtn.title = '设置';
        settingsBtn.style.cssText = `
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            transition: background-color 0.2s;
            color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
        `;

        // Mac风格的设置图标SVG
        settingsBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51-1z"></path>
            </svg>
        `;

        settingsBtn.addEventListener('mouseover', () => {
            settingsBtn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        });

        settingsBtn.addEventListener('mouseout', () => {
            settingsBtn.style.backgroundColor = 'transparent';
        });

        settingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSettings(); // 调用显示设置界面的函数
        });

        // 关闭按钮 - Mac风格SVG图标
        const closeBtn = document.createElement('button');
        closeBtn.title = '关闭';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            transition: background-color 0.2s, color 0.2s;
            color: ${isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
        `;

        // Mac风格的关闭图标SVG
        closeBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;

        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            closeBtn.style.color = isDark ? '#ff4444' : '#ff3b30';
        });
        
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
        });

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideUI();
        });

        // 内容区域
        const content = document.createElement('div');
        content.id = 'website-summary-content';
        content.style.cssText = `
            max-height: calc(80vh - 60px);
            overflow-y: auto;
            font-size: 14px;
            line-height: 1.6;
            padding: 8px 0;
            color: ${isDark ? '#e8eaed' : '#333'};
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
        `;

        // 防止内容区域的滚动触发容器拖动
        content.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
        content.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        }, { passive: true });

        // 组装界面
        buttonContainer.appendChild(settingsBtn); // 添加设置按钮
        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(buttonContainer);
        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);
        elements.container = container; // 必须在 makeDraggableByHeader 之前赋值

        // 恢复窗口位置（如果已保存）
        if (config.summaryWindowPosition) {
            container.style.left = config.summaryWindowPosition.left + 'px';
            container.style.top = config.summaryWindowPosition.top + 'px';
            container.style.transform = 'none'; // 清除默认的transform居中
            container.setAttribute('data-positioned', 'true');
        } else {
            // 确保初次显示时居中
            container.style.left = '50%';
            container.style.top = '50%';
            container.style.transform = 'translate(-50%, -50%)';
        }
        
        // 专门使用标题栏拖动
        makeDraggableByHeader(container, header);
        return container;
    }

    // 专门用于通过标题栏拖动的函数
    function makeDraggableByHeader(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        // 鼠标/触摸开始事件
        function handleStart(e) {
            isDragging = true;
            
            // 记录初始位置
            const rect = element.getBoundingClientRect();
            
            // 如果使用了transform-translate，则切换到绝对定位
            if (element.style.transform && element.style.transform.includes('translate')) {
                element.style.transform = 'none';
                element.style.left = rect.left + 'px';
                element.style.top = rect.top + 'px';
                
                // 标记元素已被手动定位
                element.setAttribute('data-positioned', 'true');
            }
            
            startLeft = rect.left;
            startTop = rect.top;
            
            // 记录鼠标/触摸起始位置
            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                // 阻止默认行为只在触摸时需要
                e.preventDefault();
            } else {
                startX = e.clientX;
                startY = e.clientY;
                e.preventDefault();
            }
            
            // 移除过渡效果
            element.style.transition = 'none';
            
            // 添加移动和结束事件监听
            if (e.type === 'touchstart') {
                document.addEventListener('touchmove', handleMove, { passive: false });
                document.addEventListener('touchend', handleEnd);
                document.addEventListener('touchcancel', handleEnd);
            } else {
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('mouseup', handleEnd);
            }
        }
        
        // 鼠标/触摸移动事件
        function handleMove(e) {
            if (!isDragging) return;
            
            let moveX, moveY;
            if (e.type === 'touchmove') {
                moveX = e.touches[0].clientX - startX;
                moveY = e.touches[0].clientY - startY;
                // 阻止默认滚动
                e.preventDefault();
            } else {
                moveX = e.clientX - startX;
                moveY = e.clientY - startY;
            }
            
            // 计算新位置
            const newLeft = startLeft + moveX;
            const newTop = startTop + moveY;
            
            // 边界检查
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;
            
            // 应用新位置
            element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            element.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            
            // 标记元素已被手动定位
            element.setAttribute('data-positioned', 'true');
        }
        
        // 鼠标/触摸结束事件
        function handleEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            // 移除事件监听
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handleEnd);
            document.removeEventListener('touchcancel', handleEnd);
            
            // 恢复过渡效果
            element.style.transition = 'opacity 0.3s ease';
            
            // 保存位置状态
            saveWindowPosition(element);
        }
        
        // 保存窗口位置
        function saveWindowPosition(element) {
            if (element.id === 'website-summary-container' || element.id === 'website-summary-settings') {
                const rect = element.getBoundingClientRect();
                const position = { left: rect.left, top: rect.top };
                if (element.id === 'website-summary-container') {
                    config.summaryWindowPosition = position;
                    scriptHandler.setValue('summaryWindowPosition', position);
                } else if (element.id === 'website-summary-settings') {
                    // 注意：设置窗口目前没有独立的配置项来保存位置，如果需要，可以添加
                    // config.settingsWindowPosition = position;
                    // scriptHandler.setValue('settingsWindowPosition', position);
                }
                element.setAttribute('data-positioned', 'true'); // 标记已手动定位
            }
        }
        
        // 仅在指定的标题栏上添加事件监听
        handle.addEventListener('mousedown', handleStart);
        handle.addEventListener('touchstart', handleStart, { passive: false });
        
        // 处理窗口变化
        window.addEventListener('resize', () => {
            if (element.hasAttribute('data-positioned')) {
                const rect = element.getBoundingClientRect();
                let newLeft = rect.left;
                let newTop = rect.top;
                let positionChanged = false;

                // 如果窗口超出视口边界，调整位置
                if (rect.right > window.innerWidth) {
                    newLeft = Math.max(0, window.innerWidth - element.offsetWidth);
                    positionChanged = true;
                }
                
                if (rect.bottom > window.innerHeight) {
                    newTop = Math.max(0, window.innerHeight - element.offsetHeight);
                    positionChanged = true;
                }

                if (rect.left < 0) {
                    newLeft = 0;
                    positionChanged = true;
                }

                if (rect.top < 0) {
                    newTop = 0;
                    positionChanged = true;
                }

                if (positionChanged) {
                    element.style.left = newLeft + 'px';
                    element.style.top = newTop + 'px';
                    saveWindowPosition(element); // 保存调整后的位置
                }
            }
        });
        
        // 如果用户离开窗口，确保释放拖动状态
        window.addEventListener('blur', () => {
            if (isDragging) {
                handleEnd();
            }
        });
        
        // 检查是否应该恢复自定义位置
        if (element.id === 'website-summary-container' && config.summaryWindowPosition) {
            element.style.left = config.summaryWindowPosition.left + 'px';
            element.style.top = config.summaryWindowPosition.top + 'px';
            element.style.transform = 'none'; // 清除默认的transform居中
            element.setAttribute('data-positioned', 'true');
        }
        // 对于设置窗口，如果也需要位置恢复，可以添加类似逻辑
        // else if (element.id === 'website-summary-settings' && config.settingsWindowPosition) {
        //     element.style.left = config.settingsWindowPosition.left + 'px';
        //     element.style.top = config.settingsWindowPosition.top + 'px';
        //     element.style.transform = 'none';
        //     element.setAttribute('data-positioned', 'true');
        // }
    }

    // 创建设置界面
    function createSettingsUI() {
        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'website-summary-settings';
        
        // 基础样式
        const isDark = config.theme === 'dark';
        
        // macOS 26 液态玻璃风格
        const glassStyle = isDark ? `
            background: linear-gradient(135deg, rgba(40, 40, 40, 0.8), rgba(20, 20, 20, 0.6));
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow:
                0 20px 50px rgba(0, 0, 0, 0.5),
                inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        ` : `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow:
                0 20px 50px rgba(0, 0, 0, 0.1),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        `;

        settingsContainer.style.cssText = `
            position: fixed;
            z-index: 1000000;
            ${glassStyle}
            color: ${isDark ? '#e8eaed' : '#333'};
            border-radius: 24px;
            padding: 28px;
            width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: none;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            will-change: transform;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            backdrop-filter: blur(40px) saturate(180%);
            -webkit-backdrop-filter: blur(40px) saturate(180%);
            transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        `;

        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 20px; 
            cursor: move;
            user-select: none;
            -webkit-user-select: none;
        `;

        const title = document.createElement('h3');
        title.textContent = '设置';
        title.style.cssText = `
            margin: 0; 
            color: ${isDark ? '#e8eaed' : '#333'};
            pointer-events: none;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0 8px;
            color: ${isDark ? '#e8eaed' : '#666'};
        `;
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            settingsContainer.style.display = 'none';
            if (elements.backdrop) {
                elements.backdrop.style.opacity = '0';
                setTimeout(() => elements.backdrop.style.display = 'none', 300);
            }
        });

        // 表单
        const form = document.createElement('form');
        form.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
        
        // 创建输入字段函数
        function createField(id, label, value, type = 'text', placeholder = '') {
            const container = document.createElement('div');
            container.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
            
            const labelElem = document.createElement('label');
            labelElem.textContent = label;
            labelElem.style.cssText = `font-size: 14px; color: ${isDark ? '#e8eaed' : '#333'}; font-weight: 500;`;
            
            const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
            if (type !== 'textarea') input.type = type;
            input.id = id;
            input.value = value;
            input.placeholder = placeholder;
            input.autocomplete = 'off';
            input.setAttribute('data-form-type', 'other');
            
            const baseStyle = `
                width: 100%;
                padding: 8px;
                border: 1px solid ${isDark ? '#555' : '#ddd'};
                border-radius: 6px;
                font-family: inherit;
                background: ${isDark ? '#202124' : '#fff'};
                color: ${isDark ? '#e8eaed' : '#333'};
            `;
            input.style.cssText = type === 'textarea' ? baseStyle + 'height: 100px; resize: vertical;' : baseStyle;
            
            container.appendChild(labelElem);
            container.appendChild(input);
            return { container, input };
        }

        // 创建主题切换
        function createThemeSwitch() {
            const container = document.createElement('div');
            container.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 16px;';
            
            const label = document.createElement('label');
            label.textContent = '主题模式：';
            label.style.cssText = `font-size: 14px; color: ${isDark ? '#e8eaed' : '#333'}; font-weight: 500;`;
            
            const themeSwitch = document.createElement('div');
            themeSwitch.style.cssText = 'display: flex; gap: 8px;';
            
            const createThemeButton = (themeName, text) => {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.type = 'button';
                const isActive = config.theme === themeName;
                btn.style.cssText = `
                    padding: 6px 12px;
                    border-radius: 4px;
                    border: 1px solid ${isDark ? '#555' : '#ddd'};
                    background: ${isActive ? (isDark ? '#555' : '#007AFF') : 'transparent'};
                    color: ${isActive ? '#fff' : (isDark ? '#e8eaed' : '#333')};
                    cursor: pointer;
                    transition: all 0.2s;
                `;
                btn.addEventListener('click', async () => {
                    config.theme = themeName;
                    await scriptHandler.setValue('theme', themeName);
                    // 重新创建设置界面而不是移除
                    const oldSettings = elements.settings;
                    elements.settings = null;
                    showSettings();
                    if (oldSettings) {
                        oldSettings.remove();
                    }
                });
                return btn;
            };
            
            const lightBtn = createThemeButton('light', '浅色');
            const darkBtn = createThemeButton('dark', '深色');
            
            themeSwitch.appendChild(lightBtn);
            themeSwitch.appendChild(darkBtn);
            container.appendChild(label);
            container.appendChild(themeSwitch);
            
            return container;
        }
        
        // 创建字段
        const apiUrlField = createField('apiUrl', 'API URL', config.apiUrl, 'text', '输入API URL');
        const apiKeyField = createField('apiKey', 'API Key', config.apiKey, 'text', '输入API Key');
        const modelField = createField('model', 'AI 模型', config.model, 'text', '输入AI模型名称');
        const shortcutField = createField('shortcut', '快捷键', config.shortcut, 'text', '例如: option+a, ctrl+shift+s');
        const promptField = createField('prompt', '提示词', config.prompt, 'textarea', '输入提示词');
        
        // 添加主题切换
        form.appendChild(createThemeSwitch());
        
        // 添加字段到表单
        form.appendChild(apiUrlField.container);
        form.appendChild(apiKeyField.container);
        form.appendChild(modelField.container);
        form.appendChild(shortcutField.container);
        form.appendChild(promptField.container);
        
        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存设置';
        saveBtn.type = 'button';
        saveBtn.style.cssText = `
            background: ${isDark ? '#8ab4f8' : '#007AFF'};
            color: ${isDark ? '#202124' : 'white'};
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        `;

        saveBtn.addEventListener('mouseover', () => {
            saveBtn.style.backgroundColor = isDark ? '#aecbfa' : '#0056b3';
        });
        saveBtn.addEventListener('mouseout', () => {
            saveBtn.style.backgroundColor = isDark ? '#8ab4f8' : '#007AFF';
        });
        
        // 保存逻辑
        saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // 获取并验证表单值
            const newApiUrl = apiUrlField.input.value.trim();
            const newApiKey = apiKeyField.input.value.trim();
            const newModel = modelField.input.value.trim();
            const newPrompt = promptField.input.value.trim();
            const newShortcut = shortcutField.input.value.trim();
            
            if (!newApiUrl || !newApiKey) {
                alert('请至少填写API URL和API Key');
                return;
            }

            try {
                // 使用scriptHandler保存设置
                await scriptHandler.setValue('apiUrl', newApiUrl);
                await scriptHandler.setValue('apiKey', newApiKey);
                await scriptHandler.setValue('model', newModel);
                await scriptHandler.setValue('prompt', newPrompt);
                await scriptHandler.setValue('shortcut', newShortcut);
                await scriptHandler.setValue('theme', config.theme);

                // 更新内存配置
                config.apiUrl = newApiUrl;
                config.apiKey = newApiKey;
                config.model = newModel;
                config.prompt = newPrompt;
                config.shortcut = newShortcut;
                
                // 更新快捷键
                keyManager.setup();

                // 显示成功提示
                showToast('设置已保存');
                
                // 关闭设置
                settingsContainer.style.display = 'none';
            } catch (error) {
                console.error('保存设置失败:', error);
                showToast('保存设置失败，请重试');
            }
        });

        // 组装界面
        header.appendChild(title);
        header.appendChild(closeBtn);
        form.appendChild(saveBtn);
        settingsContainer.appendChild(header);
        settingsContainer.appendChild(form);
        document.body.appendChild(settingsContainer);
        elements.settings = settingsContainer; // 必须在 makeDraggableByHeader 之前赋值

        // 恢复设置窗口位置（如果已保存）- 此处假设 settingsWindowPosition 已在 config 中定义并加载
        // 注意：目前脚本没有为设置窗口单独保存位置的逻辑，以下代码为示例，如果需要此功能，
        // 需要在 config, initConfig, 和 makeDraggableByHeader 的 saveWindowPosition 中添加相应处理。
        // if (config.settingsWindowPosition) {
        //     settingsContainer.style.left = config.settingsWindowPosition.left + 'px';
        //     settingsContainer.style.top = config.settingsWindowPosition.top + 'px';
        //     settingsContainer.style.transform = 'none';
        //     settingsContainer.setAttribute('data-positioned', 'true');
        // } else {
        //     // 确保初次显示时居中 (如果未实现位置保存，则总是居中)
        //     settingsContainer.style.left = '50%';
        //     settingsContainer.style.top = '50%';
        //     settingsContainer.style.transform = 'translate(-50%, -50%)';
        // }

        // 使用优化的拖拽功能，只允许通过标题栏拖动
        makeDraggableByHeader(settingsContainer, header);
        return settingsContainer;
    }

    // 获取页面内容
    function getPageContent() {
        try {
            const clone = document.body.cloneNode(true);
            const elementsToRemove = clone.querySelectorAll('script, style, iframe, nav, header, footer, .ad, .advertisement, .social-share, .comment, .related-content');
            elementsToRemove.forEach(el => el.remove());
            return clone.innerText.replace(/\s+/g, ' ').trim().slice(0, 5000);
        } catch (error) {
            return document.body.innerText.slice(0, 5000);
        }
    }

    // 修改深色模式颜色方案
    const darkColors = {
        background: '#242526',           // 更柔和的深色背景
        containerBg: '#2d2d30',          // 容器背景色
        text: '#e4e6eb',                 // 更柔和的文字颜色
        secondaryText: '#b0b3b8',        // 次要文字颜色
        border: '#3e4042',               // 边框颜色
        codeBackground: '#3a3b3c',       // 代码块背景
        blockquoteBorder: '#4a4b4d',     // 引用块边框
        blockquoteText: '#cacbcc',       // 引用块文字
        linkColor: '#4e89e8'             // 链接颜色
    };

    // 修改 API 调用函数
    function getSummary(content) {
        return new Promise((resolve, reject) => {
            const apiKey = config.apiKey.trim();
            
            if (!apiKey) {
                reject(new Error('请先设置API Key'));
                return;
            }

            const requestData = {
                model: config.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的网页内容总结助手，善于使用markdown格式来组织信息。'
                    },
                    {
                        role: 'user',
                        content: config.prompt + '\n\n' + content
                    }
                ],
                temperature: 0.7,
                stream: false
            };

            // 处理 URL
            let apiUrl = config.apiUrl.trim();
            if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
                apiUrl = 'https://' + apiUrl;
            }

            // 打印请求信息用于调试
            console.log('发送请求到:', apiUrl);
            console.log('请求数据:', JSON.stringify(requestData, null, 2));

            // 发送请求
            const xhr = typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : (typeof GM !== 'undefined' && GM.xmlHttpRequest);
            
            if (!xhr) {
                reject(new Error('不支持的环境：无法发送跨域请求'));
                return;
            }

            xhr({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json'
                },
                data: JSON.stringify(requestData),
                timeout: 30000,
                onload: function(response) {
                    try {
                        console.log('收到响应:', response.status);
                        console.log('响应头:', response.responseHeaders);
                        console.log('响应内容:', response.responseText);

                        if (response.status === 429) {
                            reject(new Error('API请求过于频繁，请稍后再试'));
                            return;
                        }

                        if (response.status !== 200) {
                            reject(new Error(`API请求失败: HTTP ${response.status}`));
                            return;
                        }

                        let data;
                        try {
                            data = JSON.parse(response.responseText);
                        } catch (e) {
                            console.error('JSON解析失败:', e);
                            reject(new Error('API响应格式错误'));
                            return;
                        }

                        if (data.error) {
                            reject(new Error('API错误: ' + (data.error.message || JSON.stringify(data.error))));
                            return;
                        }

                        // 提取内容
                        let content = null;
                        
                        if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
                            const choice = data.choices[0];
                            if (choice.message && choice.message.content) {
                                content = choice.message.content;
                            } else if (choice.text) {
                                content = choice.text;
                            }
                        }

                        if (!content && data.response) {
                            content = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
                        }

                        if (!content && data.content) {
                            content = data.content;
                        }

                        if (content) {
                            resolve(content.trim());
                        } else {
                            reject(new Error('无法从API响应中提取内容'));
                        }
                    } catch (error) {
                        console.error('处理响应时出错:', error);
                        reject(new Error('处理响应失败: ' + error.message));
                    }
                },
                onerror: function(error) {
                    console.error('请求错误:', error);
                    reject(new Error('请求失败: ' + (error.message || '网络错误')));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 配置 Marked 渲染器
    function configureMarked() {
        if (typeof marked === 'undefined') return;

        // 配置 marked 选项
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: true,
            mangle: false,
            smartLists: true,
            smartypants: true,
            highlight: function(code, lang) {
                return code;
            }
        });

        // 自定义渲染器
        const renderer = new marked.Renderer();

        // 自定义标题渲染 - 移除 ## 前缀
        renderer.heading = function(text, level) {
            return `<h${level}>${text}</h${level}>`;
        };

        // 自定义列表项渲染
        renderer.listitem = function(text) {
            return `<li><span class="bullet">•</span><span class="text">${text}</span></li>`;
        };

        // 自定义段落渲染
        renderer.paragraph = function(text) {
            return `<p>${text}</p>`;
        };

        // 自定义代码块渲染
        renderer.code = function(code, language) {
            return `<pre><code class="language-${language}">${code}</code></pre>`;
        };

        // 自定义引用块渲染
        renderer.blockquote = function(quote) {
            return `<blockquote>${quote}</blockquote>`;
        };

        // 设置渲染器
        marked.setOptions({ renderer });
    }

    // 修改 Markdown 样式
    function addMarkdownStyles() {
        const styleId = 'website-summary-markdown-styles';
        if (document.getElementById(styleId)) return;

        const isDark = config.theme === 'dark';
        const style = document.createElement('style');
        style.id = styleId;
        
        // 定义颜色变量
        const colors = {
            light: {
                text: '#2c3e50',
                background: '#ffffff',
                border: '#e2e8f0',
                link: '#2563eb',
                linkHover: '#1d4ed8',
                code: '#f8fafc',
                codeBorder: '#e2e8f0',
                blockquote: '#f8fafc',
                blockquoteBorder: '#3b82f6',
                heading: '#1e293b',
                hr: '#e2e8f0',
                marker: '#64748b'
            },
            dark: {
                text: '#e2e8f0',
                background: '#1e293b',
                border: '#334155',
                link: '#60a5fa',
                linkHover: '#93c5fd',
                code: '#1e293b',
                codeBorder: '#334155',
                blockquote: '#1e293b',
                blockquoteBorder: '#60a5fa',
                heading: '#f1f5f9',
                hr: '#334155',
                marker: '#94a3b8'
            }
        };

        const c = isDark ? colors.dark : colors.light;

        style.textContent = `
            #website-summary-content {
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
                line-height: 1.7;
                color: ${c.text};
                font-size: 15px;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
            }

            #website-summary-content h2 {
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
                font-weight: 600;
                line-height: 1.3;
                margin: 1.8em 0 1em;
                color: ${c.heading};
                font-size: 1.6em;
                letter-spacing: -0.01em;
            }

            #website-summary-content h3 {
                font-size: 1.3em;
                margin: 1.5em 0 0.8em;
                color: ${c.heading};
                font-weight: 600;
                line-height: 1.4;
            }

            #website-summary-content p {
                margin: 0.8em 0;
                line-height: 1.75;
                letter-spacing: 0.01em;
            }

            #website-summary-content ul {
                margin: 0.6em 0;
                padding-left: 0.5em;
                list-style: none;
            }

            #website-summary-content ul li {
                display: flex;
                align-items: baseline;
                margin: 0.4em 0;
                line-height: 1.6;
                letter-spacing: 0.01em;
            }

            #website-summary-content ul li .bullet {
                color: ${c.marker};
                margin-right: 0.7em;
                font-weight: normal;
                flex-shrink: 0;
            }

            #website-summary-content ul li .text {
                flex: 1;
            }

            #website-summary-content blockquote {
                margin: 1.2em 0;
                padding: 0.8em 1.2em;
                background: ${c.blockquote};
                border-left: 4px solid ${c.blockquoteBorder};
                border-radius: 6px;
                color: ${isDark ? '#cbd5e1' : '#475569'};
                font-style: italic;
            }

            #website-summary-content blockquote p {
                margin: 0.4em 0;
            }

            #website-summary-content code {
                font-family: "SF Mono", Menlo, Monaco, Consolas, monospace;
                font-size: 0.9em;
                background: ${c.code};
                border: 1px solid ${c.codeBorder};
                border-radius: 4px;
                padding: 0.2em 0.4em;
            }

            #website-summary-content pre {
                background: ${c.code};
                border: 1px solid ${c.codeBorder};
                border-radius: 8px;
                padding: 1.2em;
                overflow-x: auto;
                margin: 1.2em 0;
            }

            #website-summary-content pre code {
                background: none;
                border: none;
                padding: 0;
                font-size: 0.9em;
                line-height: 1.6;
            }

            #website-summary-content strong {
                font-weight: 600;
                color: ${isDark ? '#f1f5f9' : '#1e293b'};
            }

            #website-summary-content em {
                font-style: italic;
                color: ${isDark ? '#cbd5e1' : '#475569'};
            }

            #website-summary-content hr {
                margin: 2em 0;
                border: none;
                border-top: 1px solid ${c.hr};
            }

            #website-summary-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.2em 0;
                font-size: 0.95em;
            }

            #website-summary-content th,
            #website-summary-content td {
                padding: 0.8em;
                border: 1px solid ${c.border};
                text-align: left;
            }

            #website-summary-content th {
                background: ${c.code};
                font-weight: 600;
            }

            #website-summary-content img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 1em 0;
            }

            @media (max-width: 768px) {
                #website-summary-content {
                    font-size: 14px;
                    padding: 16px;
                }

                #website-summary-content h2 {
                    font-size: 1.4em;
                }

                #website-summary-content h3 {
                    font-size: 1.2em;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // 修复打字机效果后内容消失的问题
    async function renderContent(content) {
        const container = document.getElementById('website-summary-content');
        if (!container) return;
        
        try {
            if (!content || content.trim().length === 0) {
                throw new Error('内容为空');
            }

            // 确保 marked 已加载并配置
            if (typeof marked === 'undefined') {
                throw new Error('Markdown 渲染器未加载');
            }
            
            // 配置 marked
            configureMarked();

            // 渲染 Markdown
            const html = marked.parse(content);
            
            // 清空容器
            container.innerHTML = '';
            
            // 创建临时容器
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // 始终启用打字机效果
            const backupContent = temp.cloneNode(true);
            
            try {
                // 真实的逐字符打字机效果
                const typeWriter = async () => {
                    // 首先添加所有元素到DOM，但设置为不可见
                    const fragments = Array.from(temp.children);
                    const allElementsWithText = [];
                    
                    // 添加所有HTML元素结构，但内容为空
                    for (let fragment of fragments) {
                        // 克隆元素，但清空文本内容
                        const emptyElement = fragment.cloneNode(true);
                        
                        // 递归查找所有文本节点并收集信息
                        const collectTextNodes = (node, parentElement) => {
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                // 保存文本节点信息
                                allElementsWithText.push({
                                    element: parentElement,
                                    originalText: node.textContent,
                                    currentPosition: 0
                                });
                                // 清空文本
                                node.textContent = '';
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                // 处理子元素中的文本节点
                                for (const child of Array.from(node.childNodes)) {
                                    collectTextNodes(child, node);
                                }
                            }
                        };
                        
                        collectTextNodes(fragment, emptyElement);
                        container.appendChild(emptyElement);
                    }
                    
                    // 打字速度调整 - 根据总字符数动态调整
                    const totalChars = allElementsWithText.reduce((sum, item) => sum + item.originalText.length, 0);
                    // 对于长内容，加快打字速度
                    const baseCharDelay = totalChars > 1000 ? 3 : 5; // 每个字符的基础延迟（毫秒）
                    
                    // 复制原始DOM结构，用于最终替换（避免打字过程中的可能问题）
                    const finalContent = backupContent.cloneNode(true);
                    
                    // 开始打字
                    let typedChars = 0;
                    const startTime = performance.now();
                    let lastScrollTime = 0;
                    
                    while (typedChars < totalChars) {
                        // 随机选择一个还有字符要显示的元素
                        const pendingElements = allElementsWithText.filter(item => 
                            item.currentPosition < item.originalText.length);
                        
                        if (pendingElements.length === 0) break;
                        
                        // 随机选择一个待处理元素
                        const randomIndex = Math.floor(Math.random() * pendingElements.length);
                        const selectedItem = pendingElements[randomIndex];
                        
                        // 添加下一个字符
                        const char = selectedItem.originalText[selectedItem.currentPosition];
                        selectedItem.currentPosition++;
                        typedChars++;
                        
                        // 更新DOM (查找元素中的第一个文本节点并添加字符)
                        const updateTextNode = (node) => {
                            if (node.nodeType === Node.TEXT_NODE) {
                                node.textContent += char;
                                return true;
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                for (const child of Array.from(node.childNodes)) {
                                    if (updateTextNode(child)) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };
                        
                        updateTextNode(selectedItem.element);
                        
                        // 智能滚动：每处理30个字符滚动一次，并加入时间限制，避免滚动过于频繁
                        const currentTime = performance.now();
                        if (typedChars % 30 === 0 && currentTime - lastScrollTime > 200) {
                            container.scrollTop = container.scrollHeight;
                            lastScrollTime = currentTime;
                        }
                        
                        // 动态调整延迟，以获得更自然的打字感觉
                        const progress = typedChars / totalChars;
                        let adjustedDelay = baseCharDelay;
                        
                        // 开始更快，中间变慢，结束再次加速
                        if (progress < 0.2) {
                            adjustedDelay = baseCharDelay * 0.5; // 开始阶段更快
                        } else if (progress > 0.8) {
                            adjustedDelay = baseCharDelay * 0.7; // 结束阶段也较快
                        }
                        
                        // 有时候添加一个随机的短暂停顿，模拟真人打字节奏（减少概率，避免过慢）
                        if (Math.random() < 0.03) {
                            adjustedDelay = baseCharDelay * 4; // 偶尔的停顿
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, adjustedDelay));
                        
                        // 检查是否超时（超过6秒），如果超时就直接显示全部内容
                        if (performance.now() - startTime > 6000) {
                            console.log('打字机效果超时，直接显示全部内容');
                            break;
                        }
                    }
                    
                    // 打字完成或超时后，确保显示完整内容
                    return finalContent;
                };
                
                // 开始打字效果
                const completedContent = await typeWriter();
                
                // 使用单独的 try-catch 确保内容不丢失
                try {
                    // 确保内容完整显示 - 使用替换节点而不是直接操作innerHTML
                    if (completedContent) {
                        // 先替换内容，再移除原来的内容
                        const tempDiv = document.createElement('div');
                        while (completedContent.firstChild) {
                            tempDiv.appendChild(completedContent.firstChild);
                        }
                        
                        // 清除旧内容
                        while (container.firstChild) {
                            container.removeChild(container.firstChild);
                        }
                        
                        // 添加新内容
                        while (tempDiv.firstChild) {
                            container.appendChild(tempDiv.firstChild);
                        }
                    }
                } catch (finalError) {
                    console.error('最终内容替换失败:', finalError);
                    // 如果替换失败，确保使用备份内容显示
                    container.innerHTML = '';
                    
                    // 再次尝试添加原始备份内容
                    try {
                        Array.from(backupContent.children).forEach(child => {
                            container.appendChild(child.cloneNode(true));
                        });
                    } catch (lastError) {
                        // 最终失败，直接使用原始HTML
                        container.innerHTML = html;
                    }
                }
            } catch (typewriterError) {
                console.error('打字机效果失败:', typewriterError);
                // 确保内容显示即使打字机效果失败
                container.innerHTML = '';
                while (backupContent.firstChild) {
                    container.appendChild(backupContent.firstChild);
                }
            }
            
            // 确保内容显示后滚动到顶部
            setTimeout(() => {
                container.scrollTop = 0;
            }, 100);
        } catch (error) {
            console.error('渲染内容失败:', error);
            container.innerHTML = `
                <p style="text-align: center; color: #ff4444;">
                    渲染内容失败：${error.message}<br>
                    <small style="color: ${config.theme === 'dark' ? '#bdc1c6' : '#666'};">
                        请刷新页面重试
                    </small>
                </p>`;
        }
    }

    // 添加菜单命令
    function registerMenuCommands() {
        scriptHandler.registerMenuCommand('显示网页总结 (快捷键: ' + config.shortcut + ')', showSummary);
        scriptHandler.registerMenuCommand('打开设置', showSettings);
    }

    // 启动脚本
    waitForPageLoad();
})();