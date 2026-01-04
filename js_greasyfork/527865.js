// @ts-check
'use strict';

// ==UserScript==
// @name         Deepseek实时监控
// @version      1.1.0
// @description  实时监控并显示Deepseek的回答过程，自动保存被屏蔽的内容。支持历史记录、导出和深色模式。
// @match        https://chat.deepseek.com/*
// @grant        none
// @namespace    https://greasyfork.org/zh-CN/users/151723-cyborg-sexy
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527865/Deepseek%E5%AE%9E%E6%97%B6%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/527865/Deepseek%E5%AE%9E%E6%97%B6%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储系统
    let latestChatNum = 2;
    let previousContent = '';
    let longestContent = '';
    let historyContent = [];

    // UI组件创建
    const pluginUI = document.createElement('div');
    pluginUI.id = 'plugin-ui';
    pluginUI.style.cssText = `
        position: fixed;
        top: 0;
        right: 20px;
        width: 300px;
        height: 100%;
        overflow-y: scroll;
        background-color: #f9f9f9;
        color: #333;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        z-index: 9999;
        transition: right 0.3s ease;
        font-family: system-ui, -apple-system, sans-serif;
    `;

    // 创建按钮的通用函数
    function createButton(id, top, text, title) {
        const button = document.createElement('button');
        button.id = id;
        button.style.cssText = `
            position: fixed;
            top: ${top}px;
            right: 330px;
            width: 40px;
            height: 40px;
            background-color: #444;
            color: #fff;
            border: none;
            border-radius: 50%;
            font-size: 16px;
            z-index: 10000;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        button.textContent = text;
        button.title = title;
        return button;
    }

    // 创建所有按钮
    const returnButton = createButton('return-button', 10, '❌', 'Clear Interface');
    const toggleButton = createButton('toggle-button', 60, '➡️', 'Toggle Sidebar');
    const copyButton = createButton('copy-button', 110, '📋', 'Copy Content');
    const historyButton = createButton('history-button', 160, '🕒', 'View History');
    const exportButton = createButton('export-button', 210, '💾', 'Export History');

    // 按钮事件处理
    returnButton.addEventListener('click', () => {
        pluginUI.innerHTML = '';
    });

    toggleButton.addEventListener('click', () => {
        const isVisible = pluginUI.style.right === '20px';
        const newRight = isVisible ? '-300px' : '20px';
        const buttonRight = isVisible ? '20px' : '330px';
        
        [pluginUI.style.right, returnButton.style.right, toggleButton.style.right,
         copyButton.style.right, historyButton.style.right, exportButton.style.right] = 
        [newRight, buttonRight, buttonRight, buttonRight, buttonRight, buttonRight];
        
        toggleButton.textContent = isVisible ? '⬅️' : '➡️';
    });

    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(pluginUI.innerText);
            showNotification('内容已复制到剪贴板！', 'success');
        } catch {
            showNotification('复制失败，请重试', 'error');
        }
    });

    historyButton.addEventListener('click', () => {
        pluginUI.innerHTML = '';
        updateHistoryUI();
    });

    exportButton.addEventListener('click', () => {
        exportHistory();
    });

    // 通知系统
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
            z-index: 10001;
            animation: fadeInOut 2s ease forwards;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // 内容格式化
    function formatContent(content) {
        content = content.replace(/<[^>]+>/g, '');
        content = content.replace(/\s+/g, ' ').trim();
        return `[${new Date().toLocaleString()}]\n${content}\n${'='.repeat(30)}\n`;
    }

    // 导出功能
    function exportHistory() {
        const exportData = {
            timestamp: new Date().toISOString(),
            history: historyContent
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], 
            {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `deepseek-history-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        showNotification('历史记录已导出', 'success');
    }

    // 改进的内容获取函数
    function getLatestChatContent() {
        try {
            let retries = 1;
            let element = null;
            const getSelector = (num) => `#root > div > div.c3ecdb44 > div.f2eea526 > div > div.b83ee326 > div > div > div.dad65929 > div:nth-child(${num})`;
            
            while (retries >= 0) {
                while (true) {
                    const selector = getSelector(latestChatNum);
                    element = document.querySelector(selector);
                    if (!element) break;
                    latestChatNum += 2;
                }
                
                latestChatNum -= 2;
                element = document.querySelector(getSelector(latestChatNum));
                
                if (!element) {
                    console.log('Cannot find the latest chat');
                    latestChatNum = 2;
                    retries--;
                    if (retries < 0) return;
                } else {
                    break;
                }
            }

            // @ts-ignore
            const chatContentElement = element.querySelector('div.ds-markdown.ds-markdown--block');
            // @ts-ignore
            const thinkingContentElement = element.querySelector('div.edb250b1 > div.e1675d8b');
            
            let currentContent = '';
            if (thinkingContentElement) {
                const paragraphs = thinkingContentElement.querySelectorAll('p');
                paragraphs.forEach(p => {
                    currentContent += p.innerText + '\n';
                });
            }
            if (chatContentElement) {
                currentContent += chatContentElement.innerHTML;
            }

            if (currentContent) {
                // 检查是否包含中断文本
                if (currentContent.includes("你好，这个问题我暂时无法回答")) {
                    if (longestContent) {
                        // 保存之前的内容到历史记录
                        historyContent.push(longestContent);
                        // 显示保存提示
                        showNotification('已保存之前的回答', 'success');
                        // 重置最长内容
                        longestContent = '';
                    }
                    return;
                }

                // 格式化当前内容
                const formattedContent = formatContent(currentContent);
                
                // 更新最长内容
                if (currentContent.length > (longestContent?.length || 0)) {
                    longestContent = formattedContent;
                }
                
                // 实时显示当前内容
                pluginUI.innerHTML = formattedContent;
                
                // 更新前一次内容
                previousContent = currentContent;
            }
        } catch (error) {
            console.error('Error in getLatestChatContent:', error);
        }
    }

    // 历史记录UI更新
    function updateHistoryUI() {
        historyContent.forEach((content, index) => {
            const historyItem = document.createElement('div');
            historyItem.style.cssText = `
                border-bottom: 1px solid #ccc;
                padding: 10px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                margin-bottom: 5px;
            `;
            historyItem.textContent = `[${index + 1}] ${content.length > 50 ? content.substring(0, 50) + '...' : content}`;
            historyItem.addEventListener('click', () => {
                pluginUI.innerHTML = content;
            });
            historyItem.addEventListener('mouseover', () => {
                historyItem.style.backgroundColor = 'rgba(0,0,0,0.05)';
            });
            historyItem.addEventListener('mouseout', () => {
                historyItem.style.backgroundColor = 'transparent';
            });
            pluginUI.appendChild(historyItem);
        });
    }

    // 主题更新
    function updateTheme() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = {
            bg: isDark ? '#333' : '#f9f9f9',
            color: isDark ? '#fff' : '#333',
            border: isDark ? '#555' : '#ccc',
            buttonBg: isDark ? '#666' : '#888'
        };

        pluginUI.style.backgroundColor = theme.bg;
        pluginUI.style.color = theme.color;
        pluginUI.style.border = `1px solid ${theme.border}`;

        [returnButton, toggleButton, copyButton, historyButton, exportButton].forEach(button => {
            button.style.backgroundColor = theme.buttonBg;
            button.style.color = '#fff';
        });
    }

    // 初始化
    document.body.append(pluginUI, returnButton, toggleButton, copyButton, historyButton, exportButton);
    updateTheme();
    
    // 设置初始收起状态
    pluginUI.style.right = '-300px';
    [returnButton, toggleButton, copyButton, historyButton, exportButton].forEach(button => {
        button.style.right = '20px';
    });
    toggleButton.textContent = '⬅️';
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    // 观察器设置
    const observer = new MutationObserver(getLatestChatContent);
    const config = { childList: true, subtree: true, characterData: true };

    window.addEventListener('load', () => {
        setTimeout(() => {
            const targetNode = document.querySelector('#root');
            if (targetNode) {
                observer.observe(targetNode, config);
                showNotification('DeepSeek监控已启动', 'success');
            } else {
                console.log('Cannot find the target node');
            }
        }, 500);
    });
})();