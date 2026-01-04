// ==UserScript==
// @name         智能AI助手
// @namespace    https://example.com
// @version      1.3
// @description  鼠标左键选中文本后，根据日志自动生成原因和解决方案
// @author       wanghe
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      aiagent-server.x.digitalyili.com
// @downloadURL https://update.greasyfork.org/scripts/528119/%E6%99%BA%E8%83%BDAI%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528119/%E6%99%BA%E8%83%BDAI%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建气泡样式
    const tooltipStyle = `
        position: absolute;
        z-index: 9999;
        background-color: #333;
        color: #fff;
        padding: 10px;
        font-size: 14px;
        border-radius: 3px;
        max-width: 450px;
        max-height: 300px;
        overflow-y: auto;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
        pointer-events: auto;
    `;

    // 创建气泡元素
    function createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'ai-tooltip';
        tooltip.style.cssText = tooltipStyle;

        // 添加点击事件阻止冒泡
        tooltip.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });

        // 添加关闭按钮
        const closeButton = document.createElement('div');
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            background-color: #666;
            border-radius: 50%;
        `;
        closeButton.innerHTML = '×';
        closeButton.onclick = hideTooltip;
        tooltip.appendChild(closeButton);

        // 创建内容容器
        const content = document.createElement('div');
        content.style.cssText = 'margin-top: 15px;';
        tooltip.appendChild(content);

        return tooltip;
    }

    // 显示气泡
    function showTooltip(text, x, y) {
        let tooltip = document.getElementById('ai-tooltip');
        if (!tooltip) {
            tooltip = createTooltip();
            document.body.appendChild(tooltip);
        }
        
        // 转换 Markdown 为 HTML
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // 粗体
            .replace(/\*(.*?)\*/g, '<em>$1</em>')              // 斜体
            .replace(/`(.*?)`/g, '<code>$1</code>')            // 行内代码
            .replace(/\n/g, '<br>')                            // 换行
            .replace(/- (.*?)(?:\n|$)/g, '• $1<br>');         // 无序列表

        // 更新内容容器
        tooltip.querySelector('div:last-child').innerHTML = formattedText;

        // 调整气泡位置
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const tooltipX = Math.max(0, Math.min(x - tooltipWidth / 2, windowWidth - tooltipWidth));
        const tooltipY = Math.max(0, y - tooltipHeight - 10);

        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
    }

    // 隐藏气泡
    function hideTooltip() {
        const tooltip = document.getElementById('ai-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // 创建临时图标按钮样式
    const iconStyle = `
        position: absolute;
        z-index: 10000;
        width: 24px;
        height: 24px;
        background-color: #4CAF50;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        user-select: none;
    `;

    // 创建临时图标按钮
    function createIcon(x, y) {
        const icon = document.createElement('div');
        icon.id = 'ai-icon';
        icon.style.cssText = iconStyle;
        icon.style.left = x + 'px';
        icon.style.top = y + 'px';
        icon.textContent = 'AI';
        icon.title = '点击请求选中的文本';
        return icon;
    }

    let selectedText = '';  // 存储选中的文本
    let lastX = 0;
    let lastY = 0;
    let lastRange = null;  // 存储选中文本的范围

    // 添加用户配置
    let apiUrl = GM_getValue('apiUrl', '');
    let apiToken = GM_getValue('apiToken', '');

    // 注册配置菜单
    GM_registerMenuCommand('配置API地址和Token', function() {
        const newApiUrl = prompt('请输入API地址:', apiUrl);
        if (newApiUrl !== null) {
            apiUrl = newApiUrl;
            GM_setValue('apiUrl', apiUrl);
        }
        
        const newApiToken = prompt('请输入API Token:', apiToken);
        if (newApiToken !== null) {
            apiToken = newApiToken;
            GM_setValue('apiToken', apiToken);
        }
    });

    // 修改鼠标释放事件监听
    window.addEventListener('mouseup', function(event) {
        // 如果点击的是请求图标，则不处理
        if (event.target.matches('#ai-icon')) {
            return;
        }

        if (event.button === 0) {
            const selection = window.getSelection();
            const currentSelectedText = selection.toString().trim();
            
            // 移除已存在的图标和提示
            hideTooltip();
            const existingIcon = document.getElementById('ai-icon');
            if (existingIcon) {
                existingIcon.remove();
            }

            if (currentSelectedText !== '') {
                // 保存选中文本的范围和文本内容
                selectedText = currentSelectedText;  // 保存到全局变量
                lastRange = selection.getRangeAt(0);
                // 在选中文本旁显示图标
                lastX = event.pageX;
                lastY = event.pageY;
                const icon = createIcon(lastX + 10, lastY - 30);
                
                // 添加图标点击事件处理
                icon.addEventListener('click', () => {
                    showTooltip('正在请求...', lastX, lastY);
                    callAPI(selectedText, lastRange);
                });
                
                document.body.appendChild(icon);
            }
        }
    });

    // 创建可拖动窗口样式
    function createWindow() {
        const window = document.createElement('div');
        window.id = 'ai-result-window';
        window.style.cssText = `
            position: absolute;
            z-index: 10000;
            width: 600px;
            min-height: 200px;
            max-height: 80vh;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // 创建标题栏
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            padding: 16px 24px;
            background: #f8f9fa;
            border-bottom: 1px solid #dadce0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        
        const title = document.createElement('div');
        title.textContent = 'AI 分析结果';
        title.style.cssText = `
            font-size: 16px;
            color: #202124;
            font-weight: 500;
        `;

        const closeButton = document.createElement('div');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            font-size: 24px;
            color: #5f6368;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            margin: -4px;
            line-height: 1;
            &:hover {
                background: rgba(95,99,104,0.08);
            }
        `;
        closeButton.onclick = hideWindow;

        titleBar.appendChild(title);
        titleBar.appendChild(closeButton);

        // 创建内容区域
        const content = document.createElement('div');
        content.id = 'ai-result-content';
        content.style.cssText = `
            padding: 24px;
            flex: 1;
            overflow-y: auto;
            color: #202124;
            font-size: 14px;
            line-height: 1.6;
        `;

        // 添加滚动条样式
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.textContent = `
            #ai-result-content::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            #ai-result-content::-webkit-scrollbar-track {
                background: transparent;
            }
            #ai-result-content::-webkit-scrollbar-thumb {
                background-color: rgba(0,0,0,.2);
                border-radius: 4px;
            }
            #ai-result-content::-webkit-scrollbar-thumb:hover {
                background-color: rgba(0,0,0,.3);
            }
            #ai-result-content {
                scrollbar-width: thin;
                scrollbar-color: rgba(0,0,0,.2) transparent;
            }
        `;
        document.head.appendChild(scrollbarStyle);

        window.appendChild(titleBar);
        window.appendChild(content);

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        titleBar.addEventListener('mousedown', function(e) {
            isDragging = true;
            initialX = e.clientX - window.offsetLeft;
            initialY = e.clientY - window.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                // 限制窗口不超出视口
                const maxX = document.documentElement.clientWidth - window.offsetWidth;
                const maxY = document.documentElement.clientHeight - window.offsetHeight;
                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                window.style.left = currentX + 'px';
                window.style.top = currentY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        return window;
    }

    // 显示窗口
    function showWindow(text, x, y) {
        let window = document.getElementById('ai-result-window');
        if (!window) {
            window = createWindow();
            document.body.appendChild(window);
        }

        // 获取内容区域
        const contentDiv = document.getElementById('ai-result-content');
        if (contentDiv) {
            // 添加基础样式
            const baseStyles = document.createElement('style');
            baseStyles.textContent = `
                #ai-result-content {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                    line-height: 1.6;
                    color: #24292e;
                }
                #ai-result-content a {
                    color: #0366d6;
                    text-decoration: none;
                }
                #ai-result-content a:hover {
                    text-decoration: underline;
                }
                #ai-result-content code {
                    background-color: rgba(27,31,35,0.05);
                    padding: 0.2em 0.4em;
                    border-radius: 3px;
                    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
                    font-size: 85%;
                }
                #ai-result-content pre {
                    background-color: #f6f8fa;
                    padding: 16px;
                    border-radius: 6px;
                    overflow-x: auto;
                }
                #ai-result-content pre code {
                    background-color: transparent;
                    padding: 0;
                    border-radius: 0;
                }
                #ai-result-content ul, #ai-result-content ol {
                    padding-left: 2em;
                    margin: 8px 0;
                }
                #ai-result-content li {
                    margin: 4px 0;
                }
                #ai-result-content p {
                    margin: 8px 0;
                }
            `;
            document.head.appendChild(baseStyles);

            // 直接设置HTML内容
            contentDiv.innerHTML = text;

            // 为所有链接添加target="_blank"
            const links = contentDiv.getElementsByTagName('a');
            for (let link of links) {
                link.setAttribute('target', '_blank');
            }
        }

        // 调整窗口位置
        const windowWidth = 400;
        const windowHeight = 300;
        const maxX = document.documentElement.clientWidth - windowWidth;
        const maxY = document.documentElement.clientHeight - windowHeight;
        
        const windowX = Math.max(0, Math.min(x, maxX));
        const windowY = Math.max(0, Math.min(y, maxY));

        window.style.left = windowX + 'px';
        window.style.top = windowY + 'px';
    }

    // 隐藏窗口
    function hideWindow() {
        const window = document.getElementById('ai-result-window');
        if (window) {
            window.remove();
        }
    }

    // 修改 callAPI 函数
    function callAPI(text, range) {
        if (!apiUrl || !apiToken) {
            showWindow('请先配置API地址和Token\n(点击油猴图标 -> 智能AI脚本 -> 配置API地址和Token)', lastX, lastY);
            return;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "input": {
                    "input_text_0": text
                }
            }),
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                console.log('API响应:', result);
                
                let outputText = '内部接口错误，请联系开发者';
                if (result.code === 400) {
                    outputText = result.error;
                } else if (result.data && result.data.result && result.data.result.output_text_0) {
                    outputText = result.data.result.output_text_0;
                }

                // 使用新的窗口显示结果
                if (range) {
                    const rect = range.getBoundingClientRect();
                    const x = rect.left + window.pageXOffset;
                    const y = rect.top + window.pageYOffset;
                    showWindow(outputText, x, y);
                    
                    // 移除加载中的图标
                    const icon = document.getElementById('ai-icon');
                    if (icon) {
                        icon.remove();
                    }
                }
            },
            onerror: function(error) {
                console.error('API请求发生错误:', error);
                const icon = document.getElementById('ai-icon');
                if (icon) {
                    icon.remove();
                }
                // 显示错误信息
                if (range) {
                    const rect = range.getBoundingClientRect();
                    const x = rect.left + window.pageXOffset;
                    const y = rect.top + window.pageYOffset;
                    showWindow('网络请求失败', x, y);
                }
            }
        });
    }

    // 修改点击事件监听，只在点击页面空白处或关闭按钮时关闭气泡
    document.addEventListener('mousedown', function(event) {
        const tooltip = document.getElementById('ai-tooltip');
        const icon = document.getElementById('ai-icon');
        
        // 如果点击的不是图标且点击的是页面空白处（不是气泡内部）
        if (!event.target.matches('#ai-icon') && 
            !event.target.closest('#ai-tooltip')) {
            if (icon) {
                icon.remove();
            }
            if (tooltip) {
                hideTooltip();
            }
        }
    });
})();