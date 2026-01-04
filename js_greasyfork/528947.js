// ==UserScript==
// @name         Markdown 转 PDF 助手 - ChatGPT版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在ChatGPT网站添加Markdown转PDF功能，支持脚注转换
// @author       您
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://chatshare.xyz/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528947/Markdown%20%E8%BD%AC%20PDF%20%E5%8A%A9%E6%89%8B%20-%20ChatGPT%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528947/Markdown%20%E8%BD%AC%20PDF%20%E5%8A%A9%E6%89%8B%20-%20ChatGPT%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加菜单命令
    GM_registerMenuCommand("打开 Markdown 转换器", () => initAndOpenConverter());

    // 添加样式
    GM_addStyle(`
        #md2pdf-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            line-height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: transform 0.3s;
        }
        #md2pdf-button:hover {
            transform: scale(1.1);
        }
        
        /* 页面顶部按钮 */
        #md2pdf-page-button {
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            margin: 10px;
            display: inline-flex;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            position: fixed;
            top: 90px;
            right: 10px;
            z-index: 9998;
        }
        #md2pdf-page-button:hover {
            background-color: #45a049;
        }
        #md2pdf-page-button svg {
            margin-right: 8px;
        }
        
        #md2pdf-converter {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 800px;
            max-height: 90vh;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            overflow: auto;
            padding: 20px;
            font-family: 'Microsoft YaHei', SimSun, Arial, sans-serif;
        }
        #md2pdf-converter h1 {
            margin-top: 0;
            color: #333;
        }
        #md2pdf-close {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        #md2pdf-close:hover {
            color: #333;
        }
        #md2pdf-markdownInput {
            width: 100%;
            height: 300px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: Consolas, monospace;
            margin-bottom: 10px;
            box-sizing: border-box;
        }
        .md2pdf-button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
            color: white;
        }
        #md2pdf-pasteBtn {
            background-color: #4CAF50;
        }
        #md2pdf-convertBtn {
            background-color: #f44336;
        }
        #md2pdf-printBtn {
            background-color: #008CBA;
        }
        #md2pdf-saveBtn {
            background-color: #2196F3;
        }
        #md2pdf-preview {
            margin-top: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 20px;
            background-color: #fff;
            display: none;
        }
        
        /* 添加预览区域的表格样式 */
        #md2pdf-preview table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }
        #md2pdf-preview th, 
        #md2pdf-preview td {
            border: 1px solid #000;
            padding: 8px;
        }
        #md2pdf-preview th {
            background-color: #f2f2f2;
        }
        
        /* 打印样式优化 */
        #md2pdf-print-container {
            display: none;
        }
        
        @media print {
            html, body {
                width: 100%;
                height: auto;
                margin: 0;
                padding: 0;
            }
            body * {
                visibility: hidden;
                display: none;
            }
            #md2pdf-print-container, #md2pdf-print-container * {
                visibility: visible;
                display: block;
            }
            #md2pdf-print-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                padding: 20px;
                box-sizing: border-box;
                background-color: white;
                font-family: 'Microsoft YaHei', SimSun, Arial, sans-serif;
                line-height: 1.6;
            }
            #md2pdf-print-container img {
                max-width: 100%;
                height: auto;
            }
            #md2pdf-print-container pre {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            #md2pdf-print-container .references {
                margin-top: 30px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
                page-break-inside: avoid;
            }
            #md2pdf-print-container h1, 
            #md2pdf-print-container h2, 
            #md2pdf-print-container h3 {
                page-break-after: avoid;
            }
            #md2pdf-print-container p, 
            #md2pdf-print-container li {
                page-break-inside: avoid;
            }
            #md2pdf-print-container a {
                color: #0066cc;
                text-decoration: none;
            }
        }
    `);

    // 初始化标志
    let initialized = false;
    let waitingForInit = false;
    
    // 等待特定元素出现
    function waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
        let attempts = 0;
        
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return true;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
                console.log(`等待元素 ${selector} 超时，尝试直接初始化`);
                callback(null);
                return true;
            }
            
            return false;
        };
        
        if (checkElement()) return;
        
        const intervalId = setInterval(() => {
            if (checkElement()) {
                clearInterval(intervalId);
            }
        }, interval);
    }
    
    // 初始化函数
    function initialize() {
        if (initialized || waitingForInit) return;
        
        waitingForInit = true;
        console.log('Markdown 转 PDF 助手: 等待页面加载完成...');
        
        // 等待个人资料按钮出现，这表示页面已完全加载
        waitForElement('[data-testid="profile-button"]', (element) => {
            console.log('Markdown 转 PDF 助手: 页面加载完成，开始初始化...');
            
            // 创建转换器窗口
            const converter = document.createElement('div');
            converter.id = 'md2pdf-converter';
            converter.innerHTML = `
                <div id="md2pdf-close">&times;</div>
                <h1>Markdown 转 PDF 助手</h1>
                <p>粘贴 Markdown 内容，转换为带脚注的 HTML 并打印为 PDF</p>
                
                <button id="md2pdf-pasteBtn" class="md2pdf-button">粘贴 Markdown</button>
                <button id="md2pdf-extractBtn" class="md2pdf-button" style="background-color: #9C27B0;">从页面提取</button>
                <button id="md2pdf-copyLastBtn" class="md2pdf-button" style="background-color: #FF9800;">复制最后一轮</button>
                
                <textarea id="md2pdf-markdownInput" placeholder="在此粘贴 Markdown 内容..."></textarea>
                
                <div>
                    <button id="md2pdf-convertBtn" class="md2pdf-button">转换为 HTML</button>
                    <button id="md2pdf-printBtn" class="md2pdf-button" disabled>打印为 PDF</button>
                    <button id="md2pdf-saveBtn" class="md2pdf-button" disabled style="background-color: #2196F3;">另存为 MD</button>
                </div>
                
                <div id="md2pdf-preview"></div>
            `;
            document.body.appendChild(converter);
            
            // 创建打印容器
            const printContainer = document.createElement('div');
            printContainer.id = 'md2pdf-print-container';
            printContainer.style.position = 'absolute';
            printContainer.style.left = '-9999px';
            printContainer.style.top = '-9999px';
            printContainer.style.display = 'none';
            document.body.appendChild(printContainer);
            
            // 创建浮动按钮
            const button = document.createElement('div');
            button.id = 'md2pdf-button';
            button.textContent = 'MD';
            button.title = '打开 Markdown 转 PDF 助手';
            button.addEventListener('click', openConverter);
            document.body.appendChild(button);
            
            // 创建页面顶部按钮
            const pageButton = document.createElement('button');
            pageButton.id = 'md2pdf-page-button';
            pageButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                转换为PDF
            `;
            pageButton.title = '将聊天内容转换为PDF';
            pageButton.addEventListener('click', () => {
                openConverter();
                // 自动复制最后一轮对话
                setTimeout(() => {
                    const copyLastBtn = document.getElementById('md2pdf-copyLastBtn');
                    if (copyLastBtn) copyLastBtn.click();
                }, 100);
            });
            document.body.appendChild(pageButton);
            
            // 添加事件监听器
            document.getElementById('md2pdf-close').addEventListener('click', () => {
                document.getElementById('md2pdf-converter').style.display = 'none';
            });
            
            document.getElementById('md2pdf-pasteBtn').addEventListener('click', async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    document.getElementById('md2pdf-markdownInput').value = text;
                } catch (err) {
                    alert('无法读取剪贴板内容，请手动粘贴。');
                }
            });
            
            // 从页面提取内容
            document.getElementById('md2pdf-extractBtn').addEventListener('click', () => {
                // 查找页面上的聊天内容
                const chatContent = extractChatContent();
                if (chatContent) {
                    document.getElementById('md2pdf-markdownInput').value = chatContent;
                } else {
                    alert('无法从页面提取内容，请手动粘贴。');
                }
            });
            
            // 复制最后一轮对话
            document.getElementById('md2pdf-copyLastBtn').addEventListener('click', async () => {
                try {
                    // 查找并点击最后一轮对话的复制按钮
                    const copyButton = findLastCopyButton();
                    if (copyButton) {
                        // 模拟点击复制按钮
                        copyButton.click();
                        
                        // 等待复制操作完成
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // 从剪贴板获取内容
                        const text = await navigator.clipboard.readText();
                        document.getElementById('md2pdf-markdownInput').value = text;
                        
                        // 自动转换为HTML
                        setTimeout(() => {
                            document.getElementById('md2pdf-convertBtn').click();
                        }, 100);
                    } else {
                        alert('未找到复制按钮，请手动复制内容。');
                    }
                } catch (err) {
                    console.error('复制最后一轮对话失败:', err);
                    alert('复制失败，请手动复制内容。');
                }
            });
            
            document.getElementById('md2pdf-convertBtn').addEventListener('click', () => {
                const markdown = document.getElementById('md2pdf-markdownInput').value;
                if (markdown) {
                    const html = convertMarkdownToHTML(markdown);
                    document.getElementById('md2pdf-preview').innerHTML = html;
                    document.getElementById('md2pdf-preview').style.display = 'block';
                    document.getElementById('md2pdf-printBtn').disabled = false;
                    document.getElementById('md2pdf-saveBtn').disabled = false;
                }
            });
            
            document.getElementById('md2pdf-saveBtn').addEventListener('click', () => {
                const markdown = document.getElementById('md2pdf-markdownInput').value;
                if (markdown) {
                    // 创建一个 Blob 对象
                    const blob = new Blob([markdown], { type: 'text/markdown' });
                    
                    // 创建一个临时下载链接
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    
                    // 尝试提取标题作为文件名
                    let fileName = 'document.md';
                    const titleMatch = markdown.match(/^# (.+)$/m);
                    if (titleMatch && titleMatch[1]) {
                        fileName = titleMatch[1].trim().replace(/[\\/:*?"<>|]/g, '_') + '.md';
                    }
                    
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    
                    // 清理
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 100);
                }
            });
            
            document.getElementById('md2pdf-printBtn').addEventListener('click', () => {
                // 准备打印内容
                preparePrint();
                
                // 创建打印iframe以隔离打印环境
                let printFrame = document.getElementById('md2pdf-print-frame');
                if (printFrame) {
                    document.body.removeChild(printFrame);
                }
                
                printFrame = document.createElement('iframe');
                printFrame.id = 'md2pdf-print-frame';
                printFrame.style.position = 'fixed';
                printFrame.style.right = '0';
                printFrame.style.bottom = '0';
                printFrame.style.width = '0';
                printFrame.style.height = '0';
                printFrame.style.border = '0';
                document.body.appendChild(printFrame);
                
                // 等待iframe加载完成后设置内容并打印
                printFrame.onload = function() {
                    // 获取iframe的文档对象
                    const frameDoc = printFrame.contentDocument || printFrame.contentWindow.document;
                    
                    // 复制打印容器内容到iframe
                    frameDoc.open();
                    frameDoc.write('<!DOCTYPE html><html><head><title>打印文档</title>');
                    frameDoc.write('<meta charset="utf-8">');
                    frameDoc.write('<style>@page { margin: 2cm; }');
                    frameDoc.write(`
                        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                        th, td { border: 1px solid #000; padding: 8px; }
                        th { background-color: #f2f2f2; }
                    `);
                    frameDoc.write('</style>');
                    frameDoc.write('</head><body>');
                    frameDoc.write(document.getElementById('md2pdf-print-container').innerHTML);
                    frameDoc.write('</body></html>');
                    frameDoc.close();
                    
                    // 延迟一点时间确保内容已渲染好
                    setTimeout(() => {
                        try {
                            printFrame.contentWindow.focus();
                            printFrame.contentWindow.print();
                        } catch (e) {
                            console.error('打印失败:', e);
                            alert('打印失败，请检查浏览器设置或手动保存为PDF。');
                        }
                    }, 500);
                };
            });
            
            initialized = true;
            waitingForInit = false;
            console.log('Markdown 转 PDF 助手: 初始化完成');
            
            // 更新指示器状态
            const indicator = document.getElementById('md2pdf-indicator');
            if (indicator) {
                indicator.textContent = 'MD2PDF 脚本已加载完成';
                indicator.style.backgroundColor = 'rgba(76, 175, 80, 0.8)';
                
                // 2秒后自动隐藏指示器
                setTimeout(() => {
                    indicator.style.opacity = '0';
                    setTimeout(() => {
                        indicator.style.display = 'none';
                    }, 500);
                }, 2000);
            }
        });
    }
    
    // 准备打印内容
    function preparePrint() {
        const printContainer = document.getElementById('md2pdf-print-container');
        const previewContent = document.getElementById('md2pdf-preview').innerHTML;
        
        if (printContainer && previewContent) {
            // 尝试提取标题
            let title = "报告";
            const hasH1 = document.getElementById('md2pdf-preview').querySelector('h1');
            const shouldAddTitle = !hasH1; // 只有在没有 H1 标题时才添加标题
            
            if (hasH1) {
                title = hasH1.textContent;
            }
            
            // 清空打印容器并设置基本结构
            printContainer.innerHTML = '';
            
            // 创建样式元素
            const style = document.createElement('style');
            style.textContent = `
                body {
                    font-family: 'Microsoft YaHei', SimSun, Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .print-title {
                    text-align: center;
                    font-size: 24px;
                    margin-bottom: 30px;
                    font-weight: bold;
                }
                h1, h2, h3 {
                    color: #333;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                p {
                    margin: 10px 0;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                }
                sup {
                    color: #e53935;
                    font-size: 0.7em;
                    vertical-align: super;
                    margin-left: 1px;
                }
                pre {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 5px;
                    overflow-x: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                code {
                    font-family: Consolas, Monaco, monospace;
                    background-color: #f5f5f5;
                    padding: 2px 4px;
                    border-radius: 3px;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 15px 0;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
                .references {
                    margin-top: 30px;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                .footnote-marker {
                    color: #e53935;
                    font-weight: bold;
                    padding: 0 2px;
                }
                hr {
                    border: none;
                    border-top: 1px solid #ddd;
                    margin: 20px 0;
                }
                ul, ol {
                    padding-left: 30px;
                }
                li {
                    margin: 8px 0;
                }
                .print-content {
                    padding: 20px;
                }
            `;
            
            // 只有在需要时才创建并添加标题元素
            if (shouldAddTitle) {
                const titleElement = document.createElement('div');
                titleElement.className = 'print-title';
                titleElement.textContent = title;
                printContainer.appendChild(titleElement);
            }
            
            // 创建内容容器
            const contentDiv = document.createElement('div');
            contentDiv.className = 'print-content';
            contentDiv.innerHTML = previewContent;
            
            // 添加所有元素到打印容器
            printContainer.appendChild(style);
            if (shouldAddTitle) {
                printContainer.appendChild(titleElement); // 只有在需要时才添加
            }
            printContainer.appendChild(contentDiv);
            
            // 显示打印容器
            printContainer.style.display = 'block';
        }
    }
    
    // 查找最后一轮对话的复制按钮
    function findLastCopyButton() {
        // 查找所有复制按钮
        const copyButtons = document.querySelectorAll('[data-testid="copy-turn-action-button"]');
        
        // 返回最后一个复制按钮
        if (copyButtons && copyButtons.length > 0) {
            return copyButtons[copyButtons.length - 1];
        }
        
        return null;
    }
    
    // 初始化并打开转换器
    function initAndOpenConverter() {
        if (!initialized) {
            initialize();
        }
        openConverter();
    }
    
    // 打开转换器
    function openConverter() {
        if (!initialized) {
            initialize();
        }
        const converterElement = document.getElementById('md2pdf-converter');
        if (converterElement) {
            converterElement.style.display = 'block';
        } else {
            console.error('转换器元素不存在');
        }
    }
    
    // 从ChatGPT页面提取内容的函数
    function extractChatContent() {
        // 尝试找到聊天内容元素
        const chatElements = document.querySelectorAll('.message-content');
        if (chatElements && chatElements.length > 0) {
            let content = '';
            chatElements.forEach(element => {
                // 获取发送者名称
                const senderElement = element.closest('.message')?.querySelector('.sender');
                const sender = senderElement ? senderElement.textContent.trim() : '未知用户';
                
                // 获取消息内容
                const messageText = element.textContent.trim();
                
                // 添加到内容中，格式化为Markdown
                content += `## ${sender}\n\n${messageText}\n\n---\n\n`;
            });
            return content;
        }
        return null;
    }
    
    function convertMarkdownToHTML(markdown) {
        // 使用正则表达式查找所有链接
        const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        const links = [];
        const processedLinks = new Set(); // 用于跟踪已处理的链接
        
        while ((match = linkPattern.exec(markdown)) !== null) {
            links.push({
                text: match[1],
                url: match[2],
                original: match[0]
            });
        }
        
        // 如果没有找到链接，直接转换为HTML
        if (links.length === 0) {
            return markdownToHTML(markdown);
        }
        
        // 创建链接到脚注的映射
        const footnotes = {};
        let footnoteCounter = 1;
        
        // 替换链接为脚注标记
        for (const link of links) {
            // 如果链接已经在脚注中，使用已有的脚注编号
            if (!footnotes[link.url]) {
                footnotes[link.url] = footnoteCounter++;
            }
            
            // 避免重复替换相同的链接文本
            const key = `${link.text}|${link.url}`;
            if (!processedLinks.has(key)) {
                // 替换链接为脚注标记
                const footnoteNum = footnotes[link.url];
                const footnoteMarkup = `${link.text}<sup class="footnote-marker">[${footnoteNum}]</sup>`;
                
                // 使用全局替换，确保所有相同的链接都被替换
                const escapedOriginal = link.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedOriginal, 'g');
                markdown = markdown.replace(regex, footnoteMarkup);
                
                processedLinks.add(key);
            }
        }
        
        // 将处理后的Markdown转换为HTML
        let html = markdownToHTML(markdown);
        
        // 添加脚注列表
        let footnoteList = '';
        for (const [url, num] of Object.entries(footnotes).sort((a, b) => a[1] - b[1])) {
            footnoteList += `<p><span class="footnote-marker">[${num}]</span> <a href="${url}" target="_blank">${url}</a></p>\n`;
        }
        
        // 添加脚注区域
        html += `
        <div class="references">
            <h2>参考链接</h2>
            ${footnoteList}
        </div>
        `;
        
        return html;
    }
    
    // 更强大的Markdown转HTML函数
    function markdownToHTML(markdown) {
        // 处理标题
        markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        markdown = markdown.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        markdown = markdown.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        markdown = markdown.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
        
        // 处理粗体和斜体
        markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // 处理列表
        markdown = markdown.replace(/^\- (.*$)/gm, '<li>$1</li>');
        markdown = markdown.replace(/^\+ (.*$)/gm, '<li>$1</li>');
        markdown = markdown.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        
        // 将连续的li元素包装在ul或ol中
        let inList = false;
        let listType = '';
        const lines = markdown.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('<li>')) {
                if (!inList) {
                    inList = true;
                    // 检查是否是有序列表
                    const originalLine = lines[i-1] || '';
                    listType = /^\d+\./.test(originalLine) ? 'ol' : 'ul';
                    lines[i] = `<${listType}>${lines[i]}`;
                }
            } else if (inList) {
                inList = false;
                lines[i-1] = `${lines[i-1]}</${listType}>`;
            }
        }
        if (inList) {
            lines[lines.length-1] = `${lines[lines.length-1]}</${listType}>`;
        }
        markdown = lines.join('\n');
        
        // 处理代码块
        markdown = markdown.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // 处理行内代码
        markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 处理水平线
        markdown = markdown.replace(/^---$/gm, '<hr>');
        
        // 处理链接（已经被脚注替换，这里处理剩余的）
        markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // 处理图片
        markdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;">');
        
        // 处理表格
        // 表格正则匹配
        const tableRegex = /^\|(.+)\|$/gm;
        const headerSeparatorRegex = /^\|(\s*:?-+:?\s*\|)+$/gm;
        
        // 查找所有表格
        if (tableRegex.test(markdown)) {
            // 重置正则表达式状态
            tableRegex.lastIndex = 0;
            
            // 将markdown拆分为行
            const lines = markdown.split('\n');
            let inTable = false;
            let tableContent = '';
            let tableHTML = '';
            let i = 0;
            
            while (i < lines.length) {
                const line = lines[i];
                
                // 检测表格开始
                if (!inTable && line.match(tableRegex) && i + 1 < lines.length && lines[i + 1].match(headerSeparatorRegex)) {
                    inTable = true;
                    tableContent = line + '\n';
                    i++;
                    continue;
                }
                
                // 在表格中
                if (inTable) {
                    // 如果行是表格分隔符或表格内容
                    if (line.match(tableRegex) || line.match(headerSeparatorRegex)) {
                        tableContent += line + '\n';
                    } else {
                        // 表格结束，处理收集到的表格内容
                        inTable = false;
                        
                        // 解析表格内容
                        const tableLines = tableContent.trim().split('\n');
                        const headerRow = tableLines[0];
                        const separatorRow = tableLines[1];
                        const bodyRows = tableLines.slice(2);
                        
                        // 解析表头
                        const headers = headerRow.split('|').slice(1, -1).map(h => h.trim());
                        
                        // 开始构建HTML表格
                        tableHTML = '<table>\n<thead>\n<tr>\n';
                        
                        // 添加表头
                        headers.forEach(header => {
                            tableHTML += `<th>${header}</th>\n`;
                        });
                        
                        tableHTML += '</tr>\n</thead>\n<tbody>\n';
                        
                        // 添加表格内容
                        bodyRows.forEach(row => {
                            const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
                            tableHTML += '<tr>\n';
                            cells.forEach(cell => {
                                tableHTML += `<td>${cell}</td>\n`;
                            });
                            tableHTML += '</tr>\n';
                        });
                        
                        tableHTML += '</tbody>\n</table>';
                        
                        // 替换原始markdown中的表格内容
                        markdown = markdown.replace(tableContent, tableHTML);
                        
                        // 重置表格内容
                        tableContent = '';
                        
                        // 不增加i，因为当前行可能是新表格的开始
                        continue;
                    }
                }
                
                i++;
            }
            
            // 处理可能在文件末尾的表格
            if (inTable && tableContent) {
                // 解析表格内容
                const tableLines = tableContent.trim().split('\n');
                const headerRow = tableLines[0];
                const separatorRow = tableLines[1];
                const bodyRows = tableLines.slice(2);
                
                // 解析表头
                const headers = headerRow.split('|').slice(1, -1).map(h => h.trim());
                
                // 开始构建HTML表格
                tableHTML = '<table>\n<thead>\n<tr>\n';
                
                // 添加表头
                headers.forEach(header => {
                    tableHTML += `<th>${header}</th>\n`;
                });
                
                tableHTML += '</tr>\n</thead>\n<tbody>\n';
                
                // 添加表格内容
                bodyRows.forEach(row => {
                    const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
                    tableHTML += '<tr>\n';
                    cells.forEach(cell => {
                        tableHTML += `<td>${cell}</td>\n`;
                    });
                    tableHTML += '</tr>\n';
                });
                
                tableHTML += '</tbody>\n</table>';
                
                // 替换原始markdown中的表格内容
                markdown = markdown.replace(tableContent, tableHTML);
            }
        }
        
        // 处理段落（避免处理已经是HTML标签的内容）
        markdown = markdown.replace(/^(?!<[a-z\/])[^\n]+$/gm, '<p>$&</p>');
        
        // 处理换行
        markdown = markdown.replace(/\n\n/g, '<br>');
        
        return markdown;
    }
    
    // 添加一个可见的初始化指示器，确认脚本已加载
    const indicator = document.createElement('div');
    indicator.id = 'md2pdf-indicator';
    indicator.style.cssText = 'position:fixed;bottom:80px;right:20px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:4px;font-size:12px;z-index:9997;transition:opacity 0.5s;';
    indicator.textContent = 'MD2PDF 脚本已加载，等待页面初始化...';
    document.body.appendChild(indicator);
    
    // 开始初始化过程
    initialize();
})();

/*
MIT License

Copyright (c) 2023-2024 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
