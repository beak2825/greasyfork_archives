// ==UserScript==
// @name         AI对话页面导航增强
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  在 Grok 和 AI Studio 等多个ai页面上添加可折叠的悬浮导航控件
// @author       Later
// @match        https://grok.com/*
// @match        https://*.x.ai/*
// @match        https://aistudio.google.com/*
// @match        https://chat.deepseek.com/*
// @match        https://chatgpt.com/*
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547582/AI%E5%AF%B9%E8%AF%9D%E9%A1%B5%E9%9D%A2%E5%AF%BC%E8%88%AA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/547582/AI%E5%AF%B9%E8%AF%9D%E9%A1%B5%E9%9D%A2%E5%AF%BC%E8%88%AA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置对象，定义选择器
    const config = {
        selectors: {
            'grok.com': 'div.relative.items-end',
            'x.ai': 'div.relative.items-end',
            'google.com': 'div.user-prompt-container',
            'deepseek.com': 'div._9663006',
            'chatgpt.com': '[data-turn="user"]',
            default: 'div'
        }
    };

    // 添加导航控件样式，使用CSS变量
    GM_addStyle(`
        :root {
            --background: rgba(255, 255, 255, 0.95);
            --shadow: rgba(0, 0, 0, 0.2);
            --border: #e0e0e0;
            --primary-color: #4285f4;
            --active-color: #34a853;
            --refresh-color: #fbbc05;
            --text-color: #333;
            --secondary-text: #666;
            --disabled-color: #cccccc;
            --disabled-text: #888888;
        }

        [data-theme="dark"] {
            --background: rgba(30, 30, 30, 0.95);
            --shadow: rgba(255, 255, 255, 0.1);
            --border: #444;
            --text-color: #ddd;
            --secondary-text: #aaa;
        }

        #grok-nav-container {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            background: var(--background);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 15px var(--shadow);
            border: 1px solid var(--border);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 300px;
            backdrop-filter: blur(5px);
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: all 0.3s ease;
        }

        .collapsed {
            width: 90px !important;
            // height: 150px !important;
            overflow: hidden;
            padding: 10px !important;
        }

        .collapsed .nav-header {
            justify-content: center;
            margin-bottom: 5px;
        }

        .collapsed .nav-title {
            display: none;
        }

        .collapsed .refresh-btn,
        .collapsed .close-btn {
            display: none;
        }

        .collapsed .nav-display {
            display: none;
        }

        .collapsed .nav-numbers {
            display: none;
        }

        .collapsed .debug-info {
            display: none;
        }

        .collapsed .nav-arrows {
            flex-direction: column;
            gap: 5px;
            justify-content: center;
            align-items: center;
        }

        .nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-title {
            font-weight: bold;
            font-size: 16px;
            color: var(--text-color);
            margin: 0;
        }

        .nav-btn-group {
            display: flex;
            gap: 3px;
        }

        .nav-btn {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary-color);
            color: white;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            border: none;
            font-size: 12px;
            transition: all 0.3s ease;
        }

        .toggle-btn {
            background: var(--active-color);
            font-size: 14px;
            width: 26px;
            height: 26px;
        }

        .refresh-btn {
            background: var(--refresh-color);
            font-size: 14px;
            width: 26px;
            height: 26px;
        }

        .close-btn {
            background: #ea4335;
            font-size: 14px;
            width: 26px;
            height: 26px;
        }

        .nav-btn:hover {
            background: #3367d6;
            transform: scale(1.1);
        }

        .nav-btn:disabled {
            background: var(--disabled-color);
            color: var(--disabled-text);
            cursor: not-allowed;
            transform: scale(1);
        }

        .nav-display {
            text-align: center;
            font-size: 14px;
            color: var(--secondary-text);
            padding: 5px 0;
            margin: 0;
        }

        .nav-arrows {
            display: flex;
            justify-content: center;
            gap: 15px;
        }

        .arrow-btn {
            width: 40px;
            height: 40px;
            font-size: 18px;
        }

        .nav-numbers {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            margin: 10px 0 0;
            /* 移除 max-height 限制，允许动态扩展 */
            overflow-y: auto; /* 仅在内容溢出时显示滚动条 */
            padding: 5px;
        }

        .no-results {
            color: #d93025;
            padding: 10px;
            text-align: center;
            font-size: 14px;
        }

        .debug-info {
            background-color: #f1f3f4;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            color: #d3d3d3;
            margin-top: 10px;
            max-height: 100px;
            overflow: auto;
        }
    `);

    // 创建导航控件容器
    const container = document.createElement('div');
    container.id = 'grok-nav-container';
    document.body.appendChild(container);

    // 添加标题
    const header = document.createElement('div');
    header.className = 'nav-header';
    container.appendChild(header);

    const title = document.createElement('div');
    title.className = 'nav-title';
    title.textContent = '定位会话'

    header.appendChild(title);

    // 添加按钮组
    const btnGroup = document.createElement('div');
    btnGroup.className = 'nav-btn-group';
    header.appendChild(btnGroup);

    // 添加折叠按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-btn toggle-btn';
    toggleBtn.title = '折叠/展开导航';
    toggleBtn.textContent = '−';
    btnGroup.appendChild(toggleBtn);

    // 添加刷新按钮
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'nav-btn refresh-btn';
    refreshBtn.title = '重新扫描页面';
    refreshBtn.textContent = '↻';
    btnGroup.appendChild(refreshBtn);

    // 添加关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'nav-btn close-btn';
    closeBtn.title = '关闭导航';
    closeBtn.textContent = '×';
    btnGroup.appendChild(closeBtn);

    // 添加位置显示
    const positionDisplay = document.createElement('p');
    positionDisplay.className = 'nav-display';
    positionDisplay.id = 'positionDisplay';
    positionDisplay.textContent = '0/0';
    container.appendChild(positionDisplay);

    // 添加箭头按钮容器
    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'nav-arrows';
    container.appendChild(arrowsContainer);

    // 添加上按钮
    const upBtn = document.createElement('button');
    upBtn.className = 'nav-btn arrow-btn';
    upBtn.id = 'upBtn';
    upBtn.textContent = '▲';
    arrowsContainer.appendChild(upBtn);

    // 添加下按钮
    const downBtn = document.createElement('button');
    downBtn.className = 'nav-btn arrow-btn';
    downBtn.id = 'downBtn';
    downBtn.textContent = '▼';
    arrowsContainer.appendChild(downBtn);

    // 添加数字按钮容器
    const numbersContainer = document.createElement('div');
    numbersContainer.className = 'nav-numbers';
    numbersContainer.id = 'numbersContainer';
    container.appendChild(numbersContainer);

    // 添加调试信息
    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    debugInfo.id = 'debugInfo';
    debugInfo.textContent = '调试信息将显示在这里...';
    container.appendChild(debugInfo);

    // 查找目标div元素
    let divs = [];
    let currentIndex = 0;

    // 添加日志到调试面板
    function logDebugInfo(message) {
        try {
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            debugInfo.appendChild(logEntry);
            debugInfo.scrollTop = debugInfo.scrollHeight;
        } catch (error) {
            console.error(`调试信息记录错误: ${error.message}`);
        }
    }

    // 查找目标元素
    function findTargetDivs() {
        try {
            const hostname = location.hostname || '';
            logDebugInfo(`当前主机名: ${hostname}`);
            const selectorKey = Object.keys(config.selectors).find(key => hostname.includes(key)) || 'default';
            const selector = config.selectors[selectorKey];
            logDebugInfo(`使用选择器: ${selector} (匹配的键: ${selectorKey})`);
            const result = document.querySelectorAll(selector);
            divs = Array.from(result);
            if (divs.length === 0) {
                logDebugInfo(`警告: 选择器 ${selector} 未找到任何内容块`);
            } else {
                logDebugInfo(`找到 ${divs.length} 个内容块`);
            }
            return divs;
        } catch (error) {
            logDebugInfo(`错误: ${error.message}`);
            console.error(`findTargetDivs 错误: ${error.message}`);
            return [];
        }
    }

    // 更新导航状态
    function updateNavStatus() {
        try {
            // 清空 numbersContainer 的所有子节点
            while (numbersContainer.firstChild) {
                numbersContainer.removeChild(numbersContainer.firstChild);
            }

            if (divs.length === 0) {
                const noResultsDiv = document.createElement('div');
                noResultsDiv.className = 'no-results';

                const textNode1 = document.createTextNode('未找到内容块');
                noResultsDiv.appendChild(textNode1);

                noResultsDiv.appendChild(document.createElement('br')); // 添加换行

                const textNode2 = document.createTextNode('(尝试点击刷新按钮)');
                noResultsDiv.appendChild(textNode2);

                numbersContainer.appendChild(noResultsDiv);
                positionDisplay.textContent = "0/0";
                return;
            }

            divs.forEach((div, index) => {
                const numBtn = document.createElement('button');
                numBtn.className = 'nav-btn';
                numBtn.textContent = index + 1;
                // numBtn.title = `跳转到第 ${index + 1} 个内容块`;
                numBtn.title = div.textContent;
                numBtn.style.background = index === currentIndex ? 'var(--active-color)' : 'var(--primary-color)';
                numBtn.addEventListener('click', () => {
                    try {
                        scrollToIndex(index);
                    } catch (error) {
                        logDebugInfo(`数字按钮点击错误: ${error.message}`);
                        console.error(`数字按钮点击错误: ${error.message}`);
                    }
                });
                numbersContainer.appendChild(numBtn);
                logDebugInfo(`创建按钮 ${index + 1}`);
            });

            upBtn.disabled = currentIndex === 0;
            downBtn.disabled = currentIndex === divs.length - 1;
            positionDisplay.textContent = `${currentIndex + 1}/${divs.length}`;
            positionDisplay.title = `当前内容块: ${currentIndex + 1}，共 ${divs.length} 个`;
        } catch (error) {
            logDebugInfo(`更新导航状态错误: ${error.message}`);
            console.error(`更新导航状态错误: ${error.message}`);
        }
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        try {
            // 对text进行处理，如果有`您说：`就替换为`## `，没有的话就在开头加上`## `。因为ChatGPT的div中包括了`您说：`
            if (text.includes('您说：')) {
                text = text.replace('您说：', '## ');
            } else {
                text = '## ' + text;
            }
            navigator.clipboard.writeText(text).then(() => {
                logDebugInfo(`已复制文本到剪贴板: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
            }).catch(err => {
                logDebugInfo(`复制到剪贴板失败: ${err.message}`);
                console.error(`复制到剪贴板失败: ${err.message}`);
            });
        } catch (error) {
            logDebugInfo(`复制文本错误: ${error.message}`);
            console.error(`复制文本错误: ${error.message}`);
        }
    }

    // 滚动到指定索引
    function scrollToIndex(index) {
        try {
            if (index < 0 || index >= divs.length || !divs[index]) {
                logDebugInfo(`无效索引: ${index}`);
                return;
            }
            currentIndex = index;
            divs[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
            logDebugInfo(`滚动到块 ${index + 1}`);
            updateNavStatus();
            
            // 自动复制当前内容块的文本到剪贴板
            const currentText = divs[index].textContent.trim();
            if (currentText) {
                copyToClipboard(currentText);
            }
        } catch (error) {
            logDebugInfo(`滚动错误: ${error.message}`);
            console.error(`滚动错误: ${error.message}`);
        }
    }

    // 初始化函数
    function initNavigation() {
        try {
            findTargetDivs();
            currentIndex = divs.length > 0 ? 0 : -1;
            updateNavStatus();
            if (divs.length > 0) {
                scrollToIndex(0);
            }
        } catch (error) {
            logDebugInfo(`初始化导航错误: ${error.message}`);
            console.error(`初始化导航错误: ${error.message}`);
        }
    }

    // 按钮事件监听
    upBtn.addEventListener('click', () => {
        try {
            if (currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            }
        } catch (error) {
            logDebugInfo(`上按钮错误: ${error.message}`);
            console.error(`上按钮错误: ${error.message}`);
        }
    });

    downBtn.addEventListener('click', () => {
        try {
            if (currentIndex < divs.length - 1) {
                scrollToIndex(currentIndex + 1);
            }
        } catch (error) {
            logDebugInfo(`下按钮错误: ${error.message}`);
            console.error(`下按钮错误: ${error.message}`);
        }
    });

    refreshBtn.addEventListener('click', () => {
        try {
            initNavigation();
        } catch (error) {
            logDebugInfo(`刷新按钮错误: ${error.message}`);
            console.error(`刷新按钮错误: ${error.message}`);
        }
    });

    toggleBtn.addEventListener('click', () => {
        try {
            container.classList.toggle('collapsed');
            toggleBtn.textContent = container.classList.contains('collapsed') ? '+' : '−';
            toggleBtn.title = container.classList.contains('collapsed')
                ? '展开导航'
                : '折叠导航';
        } catch (error) {
            logDebugInfo(`折叠按钮错误: ${error.message}`);
            console.error(`折叠按钮错误: ${error.message}`);
        }
    });

    closeBtn.addEventListener('click', () => {
        try {
            container.remove();
            logDebugInfo('导航控件已关闭');
        } catch (error) {
            logDebugInfo(`关闭按钮错误: ${error.message}`);
            console.error(`关闭按钮错误: ${error.message}`);
        }
    });

    // 全局错误处理
    window.addEventListener('error', (event) => {
        logDebugInfo(`未捕获的错误: ${event.message}`);
        console.error(`未捕获的错误: ${event.message}`);
    });

    // 初始化导航并自动刷新
    document.addEventListener('DOMContentLoaded', () => {
        try {
            logDebugInfo("导航工具启动...");
            const observer = new MutationObserver((mutations, obs) => {
                const hostname = location.hostname || '';
                const selector = config.selectors[Object.keys(config.selectors).find(key => hostname.includes(key)) || 'default'];
                if (document.querySelector(selector)) {
                    logDebugInfo("检测到目标元素，执行自动刷新...");
                    initNavigation();
                    obs.disconnect(); // 仅刷新一次后停止观察
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } catch (error) {
            logDebugInfo(`初始化错误: ${error.message}`);
            console.error(`初始化错误: ${error.message}`);
        }
    });
})();