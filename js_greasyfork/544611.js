// ==UserScript==
// @name         DeepSeek Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  导出 DeepSeek 聊天记录为 PDF、HTML、Markdown、JSON、TXT 和 Word
// @author       deepseek-ai.online
// @match        *://chat.deepseek.com/*
// @match        *://deepseek.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @resource     hljsCSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css
// @downloadURL https://update.greasyfork.org/scripts/544611/DeepSeek%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/544611/DeepSeek%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 国际化支持
    const i18n = {
        "export_btn": "导出聊天",
        "export_to_pdf": "导出为 PDF",
        "export_to_html": "导出为 HTML",
        "export_to_markdown": "导出为 Markdown",
        "export_to_json": "导出为 JSON",
        "export_to_txt": "导出为 TXT",
        "export_to_word": "导出为 Word",
        "export_progress": "导出中",
        "export_user": "用户",
        "export_pdf_error": "PDF导出失败，请重试",
        "export_success": "导出成功！"
    };

    // 添加样式
    GM_addStyle(`
        .export-button {
            position: fixed;
            top: 30px;
            right: 20px;
            background: #4a90e2;
            color: white;
            padding: 12px 20px;
            border-radius: 30px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transition: all 0.3s ease;
            border: none;
        }

        .export-button:hover {
            background: #3a7bc8;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }

        .export-icon {
            font-size: 18px;
            font-weight: bold;
        }

        .export-menu {
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            padding: 10px 0;
            z-index: 9998;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
            width: 220px;
        }

        .export-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .export-option {
            padding: 12px 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 15px;
            transition: all 0.2s;
        }

        .export-option:hover {
            background: #f5f7fa;
        }

        .export-option-icon {
            font-size: 18px;
            width: 24px;
            text-align: center;
        }

        .message {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
        }

        .user {
            background-color: #f5f5f5;
            border-left: 4px solid #4a90e2;
        }

        .assistant {
            background-color: #f8f9fa;
            border-left: 4px solid #6c757d;
        }

        .role {
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
        }

        .content {
            white-space: pre-wrap;
            color: #2c3e50;
            line-height: 1.6;
        }

        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 15px 0;
            border-left: 3px solid #4a90e2;
        }

        code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 14px;
        }

        .hljs {
            display: block;
            overflow-x: auto;
            padding: 1em;
            border-radius: 4px;
        }

        .citation-link {
            color: #4a90e2;
            text-decoration: none;
            font-weight: bold;
            margin: 0 2px;
        }

        .citation-link:hover {
            text-decoration: underline;
        }

        .progress-indicator {
            position: fixed;
            top: 70px;
            right: 20px;
            background: #4a90e2;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
    `);

    // 添加highlight.js样式
    const hljsCSS = GM_getResourceText("hljsCSS");
    GM_addStyle(hljsCSS);

    // 初始化
    $(document).ready(function() {
        // 只在DeepSeek网站上添加导出按钮
        if (window.location.hostname === 'chat.deepseek.com' ||
            window.location.hostname === 'deepseek.com') {
            // 如果元素存在且按钮还没有添加，则添加导出按钮
            if (!document.querySelector('.export-button')) {
                addExportButton();
            }
        }
    });

    // 页面加载完成后开始检查
    document.addEventListener('DOMContentLoaded', function() {
        // 检查是否在正确的域名下
        if (window.location.hostname === 'chat.deepseek.com' ||
            window.location.hostname === 'deepseek.com') {
            // 开始等待聊天元素加载
            waitForChatElements();

            // 监听DOM变化，处理动态加载的内容
            const observer = new MutationObserver(function(mutations) {
                if (!document.querySelector('.export-button')) {
                    waitForChatElements();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });

    function waitForChatElements() {
        const maxAttempts = 10;
        let attempts = 0;

        const checkInterval = setInterval(() => {
            const chatContainer = document.querySelector('.fbb737a4, .f9bf7997, ._4f9bf79');
            if (chatContainer || attempts >= maxAttempts) {
                clearInterval(checkInterval);
                if (chatContainer) {
                    addExportButton();
                }
            }
            attempts++;
        }, 500);
    }

    function addExportButton() {
        const button = $(`
            <div class="export-button">
                <span class="export-icon">↓</span>
                <span class="export-text">${i18n.export_btn}</span>
            </div>
        `);

        const menu = $(`
            <div class="export-menu">
                <div class="export-option" data-format="pdf">
                    <span class="export-option-icon">📄</span>
                    ${i18n.export_to_pdf}
                </div>
                <div class="export-option" data-format="html">
                    <span class="export-option-icon">🌐</span>
                    ${i18n.export_to_html}
                </div>
                <div class="export-option" data-format="markdown">
                    <span class="export-option-icon">📝</span>
                    ${i18n.export_to_markdown}
                </div>
                <div class="export-option" data-format="json">
                    <span class="export-option-icon">{ }</span>
                    ${i18n.export_to_json}
                </div>
                <div class="export-option" data-format="txt">
                    <span class="export-option-icon">📃</span>
                    ${i18n.export_to_txt}
                </div>
                <div class="export-option" data-format="word">
                    <span class="export-option-icon">📎</span>
                    ${i18n.export_to_word}
                </div>
            </div>
        `);

        $('body').append(button).append(menu);

        // 当用户开始导出时显示加载状态
        function showExporting(format) {
            button.html(`
                <span class="export-icon">⭕</span>
                <span class="export-text">${i18n.export_progress}...</span>
            `);
            button.css('pointer-events', 'none');
        }

        // 显示进度指示器
        function showProgressIndicator() {
            const progress = $(`
                <div class="progress-indicator">
                    ${i18n.export_progress}...
                </div>
            `);
            $('body').append(progress);
            return progress;
        }

        // 导出完成后恢复按钮状态
        function resetButton() {
            button.html(`
                <span class="export-icon">↓</span>
                <span class="export-text">${i18n.export_btn}</span>
            `);
            button.css('pointer-events', 'auto');
        }

        // 点击按钮显示/隐藏菜单
        button.click(function(e) {
            e.stopPropagation();
            menu.toggleClass('show');
        });

        // 点击其他地方关闭菜单
        $(document).click(function() {
            menu.removeClass('show');
        });

        // 处理导出选项点击
        $('.export-option').click(async function() {
    const format = $(this).data('format');
    const $this = $(this); // 保存当前按钮的引用
    menu.removeClass('show');
    showExporting(format);

    // 添加进度指示器
    const progress = showProgressIndicator();

    // 禁用按钮防止重复点击
    $('.export-option').prop('disabled', true);

    try {
        // 使用setTimeout确保UI更新
        await new Promise(resolve => setTimeout(resolve, 100));

        // 等待导出完成
        await exportChat(format);

        // 显示成功消息
        progress.text(i18n.export_success);
        setTimeout(() => progress.remove(), 2000);
    } catch (error) {
        console.error('导出错误:', error);
        progress.text('导出失败: ' + error.message);
        progress.css('background', '#e74c3c');
        setTimeout(() => progress.remove(), 3000);
    } finally {
        resetButton();
        // 重新启用按钮
        $('.export-option').prop('disabled', false);
    }
});
    }

    function convertCitationsToLinks(htmlString, urlList) {
        // 正则表达式匹配 <span class="ds-markdown-cite">数字</span>
        const regex = /<span class="ds-markdown-cite">(\d+)<\/span>/g;

        // 替换匹配项
        return htmlString.replace(regex, (match, number) => {
            const index = parseInt(number) - 1; // 转换为数组索引

            // 验证索引有效性
            if (index >= 0 && index < urlList.length && urlList[index]) {
                return `[<a href="${urlList[index]}" class="citation-link" target="_blank">${number}</a>]`;
            } else {
                return match; // 返回原始内容
            }
        });
    }

    function removeTokenTags(str) {
        // 匹配class以"token"开头后跟多个单词的span标签
        const regex = /<span\s+[^>]*class=(['"])token\s[^'"]*\1[^>]*>([\s\S]*?)<\/span>/g;

        let prev;
        do {
            prev = str;
            str = str.replace(regex, (_, quote, content) => {
                // 无条件转换所有实体
                return content
                    .replace(/&lt;/g, '<')  // 转换所有&lt;为<
                    .replace(/&gt;/g, '>'); // 转换所有&gt;为>
            });
        } while (str !== prev);

        return str;
    }

    function clickSearchButton(button){
        const propKey = Object.keys(button).filter(key => key.startsWith('__reactProps$'))[0];
        if (propKey) {
            button[propKey].onClick();
        } else {
            console.warn(`button has no react prop`);
        }
        return new Promise(resolve => setTimeout(resolve, 800));
    }

    async function getChatContent() {
        const messages = [];
        let urlList = [];
        const btnList = Array.from(document.querySelectorAll('._5255ff8._4d41763'))/*.filter((_, index) => index % 2 === 0)*/;
        const messageElements = document.querySelectorAll('.fbb737a4, .f9bf7997, ._4f9bf79');
        let cnt = 0;

        const propKey = Object.keys(btnList[0]).filter(key => key.startsWith('__reactProps$'))[0];
        const isSearched = btnList[0][propKey].children[1].includes("已深度思考") ? 0 : 1;

        function waitForElement(selector, timeout = 3000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const checkInterval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(checkInterval);
                        resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(checkInterval);
                        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    }
                }, 100);
            });
        }

        // 使用 for...of 循环替代 forEach 以支持 await
        for (const element of messageElements) {
            const role = element.classList.contains('fbb737a4') ? 'user' : 'assistant';
            let content = '';

            if (role === 'user') {
                // 获取用户消息内容
                urlList = [];
                content = element.textContent || '';

                if (cnt < btnList.length && isSearched === 1) {
                    const btnNow = btnList[cnt];
                    cnt++;

                    // 点击按钮展开引用
                    await clickSearchButton(btnNow);

                    try {
                        // 等待引用加载
                        await waitForElement('._426ebf9._79fcd13._5130389', 1000);
                        const citationList = document.querySelectorAll('._426ebf9._79fcd13._5130389');
                        console.log(`${citationList.length} citations found`);

                        // 收集引用链接
                        for (const node of citationList) {
                            const fiberKey = Object.keys(node).find(key => key.startsWith('__reactFiber$'));
                            if (fiberKey) {
                                const fiber = node[fiberKey];
                                if (fiber?.return?.key) {
                                    urlList.push(fiber.return.key);
                                }
                            }
                        }

                        // 再次点击关闭引用
                        await clickSearchButton(btnNow);
                    } catch (error) {
                        console.error('Error processing citations:', error);
                    }
                }
            } else {
                // 处理助手消息
                const thinkElement = element.querySelector('.e1675d8b');
                if (thinkElement) {
                    content += "<p>思考：</p><blockquote>" + thinkElement.innerHTML + "</blockquote><br/>";
                }

                const contentElement = element.querySelector('.ds-markdown');
                if (contentElement) {
                    content += contentElement.innerHTML;
                }

                // 处理代码块
                content = content.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (_, code) => {
                    return '\n```\n' + code + '\n```\n';
                });

                // 处理行内代码
                content = content.replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`');

                // 转换引用标记为链接
                content = convertCitationsToLinks(content, urlList);
                content = removeTokenTags(content);
            }

            messages.push({
                role,
                content: content.trim(),
                timestamp: new Date().toISOString()
            });
        }

        return messages;
    }

    async function exportAsPDF(content, contentName) {
        // 创建一个临时的 HTML 容器
        const container = document.createElement('div');
        container.innerHTML = formatContentAsHTML(content);

        // 将容器添加到文档中，但不可见
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        // 配置 html2pdf 选项
        const opt = {
            margin: [0.5, 0.75, 0.5, 0.75],
            filename: `${contentName}.pdf`,
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 1,
                useCORS: true,
                logging: false
            },
            jsPDF: {
                unit: 'in',
                format: 'letter',
                orientation: 'portrait'
            }
        };

        try {
            // 执行导出
            await html2pdf().set(opt).from(container).save();
        } catch (error) {
            console.error('PDF导出失败:', error);
            alert(i18n.export_pdf_error);
        } finally {
            // 清理临时容器
            document.body.removeChild(container);
        }
    }

    function exportAsHTML(content, contentName) {
        const html = formatContentAsHTML(content);
        downloadFile(html, `${contentName}.html`, 'text/html');
    }

    function exportAsJSON(content, contentName) {
        // 格式化 content 中每个消息，移除 HTML 标签和样式
        const formattedContent = content.map(msg => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(msg.content, 'text/html');
            const strippedContent = doc.body.textContent || doc.body.innerText; // 提取纯文本内容
            return {
                ...msg,
                content: strippedContent
            }; // 返回格式化后的消息
        });

        const json = JSON.stringify(formattedContent, null, 2); // 格式化 JSON 输出
        downloadFile(json, `${contentName}.json`, 'application/json');
    }

    function exportAsText(content, contentName) {
        const text = content.map(msg => {
            // 使用 DOMParser 解析 HTML 并提取纯文本
            const parser = new DOMParser();
            const doc = parser.parseFromString(msg.content, 'text/html');
            const strippedContent = doc.body.textContent || doc.body.innerText; // 提取纯文本内容

            return `${msg.role === 'user' ? i18n.export_user : 'DeepSeek AI'}: ${strippedContent}`;
        }).join('\n\n');

        downloadFile(text, `${contentName}.txt`, 'text/plain');
    }

    function exportAsMarkdown(content, contentName) {
        const markdown = content.map(msg => {
            return `### ${msg.role === 'user' ? i18n.export_user : 'DeepSeek AI'}\n\n${msg.content}\n\n`;
        }).join('---\n\n');

        downloadFile(markdown, `${contentName}.md`, 'text/markdown');
    }

    function exportAsWord(content, contentName) {
        // 格式化内容为适合 Word 的 HTML 格式
        const html = formatContentAsHTML(content);

        // 为了避免样式错乱，嵌入一些基本的样式和格式
        const wordHtml = `
            <html xmlns:w="urn:schemas-microsoft-com:office:word">
                <head>
                    <meta charset="UTF-8">
                    <title>${contentName}</title>
                    <style>
                        body { font-family: Calibri, sans-serif; font-size: 12pt; margin: 20px; }
                        .message { margin-bottom: 20px; }
                        .role { font-weight: bold; margin-bottom: 5px; }
                        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
                        code { font-family: Consolas, monospace; }
                    </style>
                </head>
                <body>
                    <div>${html}</div>
                </body>
            </html>
        `;

        downloadFile(wordHtml, `${contentName}.doc`, 'application/msword');
    }

    async function exportChat(format) {
        // 获取聊天内容
        const chatContent = await getChatContent();
        //let chatContent = {};

        const contentName = getChatContentName();

        switch (format) {
            case 'pdf':
                exportAsPDF(chatContent, contentName);
                break;
            case 'html':
                exportAsHTML(chatContent, contentName);
                break;
            case 'markdown':
                exportAsMarkdown(chatContent, contentName);
                break;
            case 'json':
                exportAsJSON(chatContent, contentName);
                break;
            case 'txt':
                exportAsText(chatContent, contentName);
                break;
            case 'word':
                exportAsWord(chatContent, contentName);
                break;
        }
    }

    function formatContentAsHTML(content) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>DeepSeek Chat Export</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                        color: #333;
                    }
                    .message {
                        margin-bottom: 25px;
                        padding: 18px;
                        border-radius: 8px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    }
                    .user {
                        background-color: #f0f7ff;
                        border-left: 4px solid #4a90e2;
                    }
                    .assistant {
                        background-color: #f8f9fa;
                        border-left: 4px solid #6c757d;
                    }
                    .role {
                        font-weight: bold;
                        margin-bottom: 10px;
                        color: #2c3e50;
                        font-size: 16px;
                    }
                    .content {
                        white-space: pre-wrap;
                        color: #2c3e50;
                        line-height: 1.7;
                    }
                    pre {
                        background-color: #f8f9fa;
                        padding: 15px;
                        border-radius: 6px;
                        overflow-x: auto;
                        margin: 15px 0;
                        border-left: 3px solid #4a90e2;
                    }
                    code {
                        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                        font-size: 14px;
                    }
                    .citation-link {
                        color: #4a90e2;
                        text-decoration: none;
                        font-weight: bold;
                        margin: 0 2px;
                    }
                    .citation-link:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center; margin-bottom: 30px; color: #2c3e50;">DeepSeek 聊天记录</h1>
                ${content.map(msg => `
                    <div class="message ${msg.role}">
                        <div class="role">${msg.role === 'user' ? i18n.export_user : 'DeepSeek AI'}</div>
                        <div class="content">${formatMessageContent(msg.content)}</div>
                    </div>
                `).join('')}
                <div style="text-align: center; margin-top: 40px; color: #7f8c8d; font-size: 14px;">
                    使用 DeepSeek Chat Exporter 导出 - ${new Date().toLocaleDateString()}
                </div>
            </body>
            </html>
        `;
    }

    // 添加消息内容格式化函数
    function formatMessageContent(content) {
        // 使用marked解析Markdown内容
        marked.setOptions({
            highlight: function(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            breaks: true,
            gfm: true
        });

        try {
            // 先处理可能的HTML实体
            content = content
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&');

            // 使用marked解析Markdown
            return marked.parse(content);
        } catch (error) {
            console.error('Markdown解析错误:', error);
            return content;
        }
    }

    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    function getChatContentName() {
        let content = "";

        // 尝试获取标题元素
        const titleElement = document.querySelector('h1, .d8ed659a, .b64fb9ae');
        if (titleElement) {
            content = titleElement.innerText.trim();
        }

        // 如果仍然没有内容，使用默认值
        if (!content) {
            content = "DeepSeek-Chat-Export";
        } else {
            // 清理文件名中的无效字符
            content = content.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-');
            content = `DeepSeek-${content}`;
        }

        // 添加日期时间戳
        const now = new Date();
        const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
        const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

        return `${content}-${dateStr}-${timeStr}`;
    }
})();