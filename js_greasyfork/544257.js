// ==UserScript==
// @name         ChatGPT对话导出（2025年7月新版UI）
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  一键导出 ChatGPT 聊天记录为 HTML 或 Markdown（按钮放在了油猴菜单栏） (适配2025年7月新版UI，支持DeepResearch)
// @author       Marx (updated by schweigen)
// @license      MIT
// @match        https://chatgpt.com/
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @match        https://chatgpt.com/share/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @icon         https://www.chatgpt.com/apple-touch-icon.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544257/ChatGPT%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%EF%BC%882025%E5%B9%B47%E6%9C%88%E6%96%B0%E7%89%88UI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544257/ChatGPT%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%EF%BC%882025%E5%B9%B47%E6%9C%88%E6%96%B0%E7%89%88UI%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('ChatGPT导出脚本初始化中...');

    // 确保在页面加载完成后运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

    function initScript() {
        console.log('初始化导出脚本...');
        registerMenuCommands();
    }

    function registerMenuCommands() {
        // 注册油猴脚本菜单命令
        GM_registerMenuCommand('导出为 Markdown', async () => {
            await exportChatAsMarkdown();
        });

        GM_registerMenuCommand('导出为 HTML', async () => {
            await exportChatAsHTML();
        });
    }

    function createExportButton() {
        // 如果按钮已存在，先移除
        const existingButton = document.getElementById('export-chat');
        if (existingButton) {
            existingButton.remove();
        }

        const exportButton = document.createElement('button');
        exportButton.id = 'export-chat';
        exportButton.setAttribute('data-testid', 'export-chat-button');

        function updateButtonText() {
            if (window.innerWidth <= 768) {
                exportButton.textContent = '导';
                exportButton.style.fontSize = '10px';
                exportButton.style.width = '24px';
                exportButton.style.height = '24px';
            } else {
                exportButton.textContent = '导出聊天';
                exportButton.style.fontSize = '12px';
            }
        }

        window.addEventListener('resize', updateButtonText);
        updateButtonText();

        // 添加内联样式，确保按钮可见
        Object.assign(exportButton.style, {
            position: 'fixed',
            bottom: '15px',
            right: '15px',
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            lineHeight: '1.2',
            fontSize: '12px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            zIndex: '99999',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        });

        // 悬停效果
        exportButton.addEventListener('mouseenter', () => {
            exportButton.style.transform = 'translateY(-1px)';
            exportButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.5)';
        });

        exportButton.addEventListener('mouseleave', () => {
            exportButton.style.transform = 'translateY(0)';
            exportButton.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        });

        // 移动设备样式调整
        if (window.innerWidth <= 768) {
            Object.assign(exportButton.style, {
                width: '40px',
                height: '40px',
                right: '15px',
                bottom: '65px',
                padding: '0',
                fontSize: '10px',
                lineHeight: '40px',
                textAlign: 'center',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            });
        }

        // 全局样式
        const style = document.createElement('style');
        style.textContent = `
            #export-options {
              position: fixed;
              bottom: 75px;
              right: 15px;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 16px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              padding: 16px;
              z-index: 100000;
              min-width: 160px;
              animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            #export-options button {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 8px;
              padding: 10px 16px;
              margin: 4px 0;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              width: 100%;
              transition: all 0.2s ease;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            #export-options button:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            #export-options span {
              color: #666;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              transition: color 0.2s ease;
            }
            
            #export-options span:hover {
              color: #333;
            }
            
            @media (max-width: 768px) {
              #export-options {
                bottom: 115px;
                right: 15px;
                width: 140px;
                padding: 12px;
              }
              
              #export-options button {
                padding: 8px 12px;
                font-size: 13px;
              }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(exportButton);
        console.log('导出按钮已创建并添加到页面');

        exportButton.addEventListener('click', showExportOptions);
    }

    function showExportOptions() {
        console.log('显示导出选项...');
        const existingOptions = document.getElementById('export-options');
        if (existingOptions) {
            document.body.removeChild(existingOptions);
            return;
        }

        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'export-options';
        const buttonsContainer = document.createElement('div');
        Object.assign(buttonsContainer.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '5px'
        });

        const mdButton = document.createElement('button');
        mdButton.textContent = '导出为 Markdown';
        mdButton.addEventListener('click', async () => {
            await exportChatAsMarkdown();
            document.body.removeChild(optionsContainer);
        });

        const htmlButton = document.createElement('button');
        htmlButton.textContent = '导出为 HTML';
        htmlButton.addEventListener('click', async () => {
            await exportChatAsHTML();
            document.body.removeChild(optionsContainer);
        });

        const closeButton = document.createElement('span');
        closeButton.textContent = '✖';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(optionsContainer);
        });

        buttonsContainer.appendChild(mdButton);
        buttonsContainer.appendChild(htmlButton);

        optionsContainer.appendChild(closeButton);
        optionsContainer.appendChild(buttonsContainer);

        document.body.appendChild(optionsContainer);
    }

    async function exportChatAsMarkdown() {
        console.log('开始导出Markdown...');
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let formattedDate = `${year}年${month}月${day}日`;

        let markdownContent = `# ${formattedDate} ChatGPT对话记录\n\n`;

        // 2025年新版UI选择器
        const conversationTurns = document.querySelectorAll('article[data-testid^="conversation-turn-"]');
        console.log(`找到 ${conversationTurns.length} 个对话轮次`);

        if (conversationTurns.length === 0) {
            alert("未找到任何对话内容。请确保您已经在ChatGPT页面并且有对话历史。");
            return;
        }

        let userIndex = 1;
        let assistantIndex = 1;

        for (let turn of conversationTurns) {
            // 确定是用户消息还是AI回复
            const isUser = turn.querySelector('[data-message-author-role="user"]');
            const isAssistant = turn.querySelector('[data-message-author-role="assistant"]');

            if (isUser) {
                // 用户消息
                const messageDiv = isUser.querySelector('.whitespace-pre-wrap');
                if (!messageDiv) continue;

                let userText = messageDiv.innerHTML.trim();

                // 清理用户消息
                let tempDivUser = document.createElement('div');
                tempDivUser.innerHTML = userText;
                removeEditButtons(tempDivUser);
                await convertImagesToBase64(tempDivUser);
                userText = tempDivUser.innerHTML;
                userText = await htmlToMarkdown(userText);

                markdownContent += `## User ${userIndex}\n\n${userText}\n\n`;
                userIndex++;
            } else if (isAssistant) {
                // AI回复
                const messageDiv = isAssistant.querySelector('.markdown');
                if (!messageDiv) continue;

                let answerText = '';
                let researchInfo = '';
                let thinkingTime = '';

                // 检查是否有思考时间
                const thinkingTimeElement = turn.querySelector('span.text-token-text-secondary');
                if (thinkingTimeElement && thinkingTimeElement.textContent.includes('Thought for')) {
                    thinkingTime = thinkingTimeElement.textContent.trim();
                    console.log('找到思考时间:', thinkingTime);
                }

                // 检查是否是深度研究结果
                const deepResearchContainer = turn.querySelector('.border-token-border-sharp .markdown');
                const deepResearchResult = turn.querySelector('.deep-research-result');

                if (deepResearchResult) {
                    // 深度研究结果
                    answerText = deepResearchResult.innerHTML.trim();
                    console.log('找到深度研究结果');
                } else if (deepResearchContainer) {
                    // 新的深度研究容器结构
                    answerText = deepResearchContainer.innerHTML.trim();
                    console.log('找到新的深度研究容器');
                } else {
                    // 普通回复
                    answerText = messageDiv.innerHTML.trim();
                }

                // 检查是否有研究状态信息
                const researchButton = turn.querySelector('button.text-token-text-tertiary');
                if (researchButton) {
                    const researchText = researchButton.textContent.trim();
                    if (researchText.includes('Research completed') || researchText.includes('sources')) {
                        console.log('找到研究状态信息');
                        researchInfo = `*${researchText}*\n\n`;
                    }
                }

                // 清理回复内容
                let tempDivAnswer = document.createElement('div');
                tempDivAnswer.innerHTML = answerText;
                removeEditButtons(tempDivAnswer);
                await convertImagesToBase64(tempDivAnswer);
                answerText = tempDivAnswer.innerHTML;

                // 获取模型信息
                const modelSlug = isAssistant.getAttribute('data-message-model-slug') || '';
                const roleName = getRoleName(modelSlug);

                answerText = await htmlToMarkdown(answerText);

                markdownContent += `## ${roleName} ${assistantIndex}\n\n`;
                if (thinkingTime) {
                    markdownContent += `*${thinkingTime}*\n\n`;
                }
                if (researchInfo) {
                    markdownContent += researchInfo;
                }
                markdownContent += `${answerText}\n\n`;
                assistantIndex++;
            }
        }

        markdownContent = markdownContent.replace(/&amp;/g, '&');

        if (markdownContent.length > 0) {
            download(markdownContent, 'chat-export.md', 'text/markdown');
            console.log('Markdown导出完成');
        } else {
            alert("未找到任何问题或答案。");
        }
    }

    async function exportChatAsHTML() {
        console.log('开始导出HTML...');
        let htmlContent = `<!DOCTYPE html>
<html><head>
    <meta charset='UTF-8'>
    <title>ChatGPT对话导出</title>
    <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .conversation-container { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .message { margin-bottom: 20px; padding: 15px; border-radius: 8px; }
        .user-message { background: #e3f2fd; border-left: 4px solid #2196f3; }
        .assistant-message { background: #f3e5f5; border-left: 4px solid #9c27b0; }
        .research-info { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 10px; margin: 10px 0; font-style: italic; }
        .thinking-time { color: #666; font-size: 12px; font-style: italic; margin-bottom: 10px; }
        .timestamp { color: #666; font-size: 12px; margin-top: 5px; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        code { font-family: monospace; }
        h1 { color: #333; text-align: center; }
        h2 { color: #444; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    </style>
</head><body>
    <div class="conversation-container">
        <h1>ChatGPT对话导出</h1>`;

        // 2025年新版UI选择器
        const conversationTurns = document.querySelectorAll('article[data-testid^="conversation-turn-"]');
        console.log(`找到 ${conversationTurns.length} 个对话轮次`);

        if (conversationTurns.length === 0) {
            alert("未找到任何对话内容。请确保您已经在ChatGPT页面并且有对话历史。");
            return;
        }

        let userIndex = 1;
        let assistantIndex = 1;

        for (let turn of conversationTurns) {
            // 确定是用户消息还是AI回复
            const isUser = turn.querySelector('[data-message-author-role="user"]');
            const isAssistant = turn.querySelector('[data-message-author-role="assistant"]');

            if (isUser) {
                // 用户消息
                const messageDiv = isUser.querySelector('.whitespace-pre-wrap');
                if (!messageDiv) continue;

                let userText = messageDiv.innerHTML.trim();

                // 清理用户消息
                let tempDivUser = document.createElement('div');
                tempDivUser.innerHTML = userText;
                removeEditButtons(tempDivUser);
                await convertImagesToBase64(tempDivUser);
                userText = tempDivUser.innerHTML;

                // 获取时间戳
                const timestamp = turn.querySelector('time[datetime]');
                const timeText = timestamp ? timestamp.getAttribute('title') || timestamp.textContent : '';

                htmlContent += `
        <div class="message user-message">
            <h2>User ${userIndex}</h2>
            <div>${userText}</div>
            ${timeText ? `<div class="timestamp">${timeText}</div>` : ''}
        </div>`;
                userIndex++;
            } else if (isAssistant) {
                // AI回复
                const messageDiv = isAssistant.querySelector('.markdown');
                if (!messageDiv) continue;

                let answerText = '';
                let researchInfo = '';
                let thinkingTime = '';

                // 检查是否有思考时间
                const thinkingTimeElement = turn.querySelector('span.text-token-text-secondary');
                if (thinkingTimeElement && thinkingTimeElement.textContent.includes('Thought for')) {
                    thinkingTime = thinkingTimeElement.textContent.trim();
                    console.log('找到思考时间:', thinkingTime);
                }

                // 检查是否是深度研究结果
                const deepResearchContainer = turn.querySelector('.border-token-border-sharp .markdown');
                const deepResearchResult = turn.querySelector('.deep-research-result');

                if (deepResearchResult) {
                    // 深度研究结果
                    answerText = deepResearchResult.innerHTML.trim();
                    console.log('找到深度研究结果');
                } else if (deepResearchContainer) {
                    // 新的深度研究容器结构
                    answerText = deepResearchContainer.innerHTML.trim();
                    console.log('找到新的深度研究容器');
                } else {
                    // 普通回复
                    answerText = messageDiv.innerHTML.trim();
                }

                // 检查是否有研究状态信息
                const researchButton = turn.querySelector('button.text-token-text-tertiary');
                if (researchButton) {
                    const researchText = researchButton.textContent.trim();
                    if (researchText.includes('Research completed') || researchText.includes('sources')) {
                        console.log('找到研究状态信息');
                        researchInfo = `<div class="research-info">${researchText}</div>`;
                    }
                }

                // 清理回复内容
                let tempDivAnswer = document.createElement('div');
                tempDivAnswer.innerHTML = answerText;
                removeEditButtons(tempDivAnswer);
                await convertImagesToBase64(tempDivAnswer);
                answerText = tempDivAnswer.innerHTML;

                // 获取模型信息
                const modelSlug = isAssistant.getAttribute('data-message-model-slug') || '';
                const roleName = getRoleName(modelSlug);

                // 获取时间戳
                const timestamp = turn.querySelector('time[datetime]');
                const timeText = timestamp ? timestamp.getAttribute('title') || timestamp.textContent : '';

                htmlContent += `
        <div class="message assistant-message">
            <h2>${roleName} ${assistantIndex}</h2>
            ${thinkingTime ? `<div class="thinking-time">${thinkingTime}</div>` : ''}
            ${researchInfo}
            <div>${answerText}</div>
            ${timeText ? `<div class="timestamp">${timeText}</div>` : ''}
        </div>`;
                assistantIndex++;
            }
        }

        htmlContent += `
    </div>
</body></html>`;

        if (htmlContent.length > 100) {
            download(htmlContent, 'chat-export.html', 'text/html');
            console.log('HTML导出完成');
        } else {
            alert("未找到任何问题或答案。");
        }
    }

    function removeEditButtons(container) {
        // 移除编辑按钮和其他UI元素
        container.querySelectorAll('button[aria-label*="编辑"], button[aria-label*="Edit"], button[data-testid*="copy"]').forEach(button => {
            let parentDiv = button.closest('div');
            if (parentDiv && parentDiv.children.length <= 2) {
                parentDiv.remove();
            } else {
                button.remove();
            }
        });

        // 移除脚注按钮和其他交互元素
        container.querySelectorAll('button[class*="footnote"], div[class*="sources"]').forEach(element => {
            element.remove();
        });
    }

    function getRoleName(modelSlug) {
        // 根据模型slug返回角色名称
        if (modelSlug.includes('research')) {
            return 'DeepResearch';
        } else {
            return 'GPT';
        }
    }

    function download(data, filename, type) {
        const blob = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const a = document.createElement('a');
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    async function convertImagesToBase64(container) {
        const imgElements = container.querySelectorAll('img');
        for (let img of imgElements) {
            let src = img.src;
            try {
                let base64 = await getBase64FromImageUrl(src);
                img.src = base64;
            } catch (error) {
                console.error(`图片转换为Base64失败，使用原始链接: ${src}`, error);
            }
        }
    }

    function getBase64FromImageUrl(url) {
        return new Promise((resolve, reject) => {
            try {
                // 使用GM_xmlhttpRequest来避免跨域问题
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        onload: function(response) {
                            let reader = new FileReader();
                            reader.onloadend = function() {
                                resolve(reader.result);
                            };
                            reader.onerror = function(error) {
                                reject(error);
                            };
                            reader.readAsDataURL(response.response);
                        },
                        onerror: function(error) {
                            reject(error);
                        }
                    });
                } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
                    // 备选GM API
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        onload: function(response) {
                            let reader = new FileReader();
                            reader.onloadend = function() {
                                resolve(reader.result);
                            };
                            reader.onerror = function(error) {
                                reject(error);
                            };
                            reader.readAsDataURL(response.response);
                        },
                        onerror: function(error) {
                            reject(error);
                        }
                    });
                } else {
                    // 如果GM API不可用，尝试使用普通的fetch (可能会受跨域限制)
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            let reader = new FileReader();
                            reader.onloadend = function() {
                                resolve(reader.result);
                            };
                            reader.onerror = function(error) {
                                reject(error);
                            };
                            reader.readAsDataURL(blob);
                        })
                        .catch(error => reject(error));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async function htmlToMarkdown(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        removeEditButtons(doc.body);

        // 保留引用链接，不转换成普通链接
        doc.querySelectorAll('a[class*="inline-flex"]').forEach(a => {
            a.setAttribute('data-preserve', 'true');
        });

        // 处理数学公式
        doc.querySelectorAll('span.katex-html').forEach(element => element.remove());
        doc.querySelectorAll('mrow').forEach(mrow => mrow.remove());
        doc.querySelectorAll('annotation[encoding="application/x-tex"]').forEach(element => {
            if (element.closest('.katex-display')) {
                const latex = element.textContent;
                element.replaceWith(`\n$$\n${latex}\n$$\n`);
            } else {
                const latex = element.textContent;
                element.replaceWith(`$${latex}$`);
            }
        });

        // 处理代码块
        doc.querySelectorAll('pre').forEach(pre => {
            const codeContainer = pre.querySelector('code');
            if (!codeContainer) return;

            let codeType = '';
            const languageDiv = pre.querySelector('[data-testid="code-block-language"]');
            if (languageDiv) {
                codeType = languageDiv.textContent.trim();
            }

            const codeContent = codeContainer.textContent || '';
            pre.innerHTML = `\n\`\`\`${codeType}\n${codeContent}\n\`\`\`\n`;
        });

        // 处理行内代码
        doc.querySelectorAll('p code, li code, span code').forEach(code => {
            const markdownCode = `\`${code.textContent}\``;
            const codeTextNode = document.createTextNode(markdownCode);
            code.parentNode.replaceChild(codeTextNode, code);
        });

        // 处理粗体文本
        doc.querySelectorAll('strong, b').forEach(bold => {
            if (bold.closest('[data-preserve="true"]')) return;
            const markdownBold = `**${bold.textContent}**`;
            const boldTextNode = document.createTextNode(markdownBold);
            bold.parentNode.replaceChild(boldTextNode, bold);
        });

        // 处理斜体文本
        doc.querySelectorAll('em, i').forEach(italic => {
            if (italic.closest('[data-preserve="true"]')) return;
            const markdownItalic = `*${italic.textContent}*`;
            const italicTextNode = document.createTextNode(markdownItalic);
            italic.parentNode.replaceChild(italicTextNode, italic);
        });

        // 处理链接，但保留需要保留的链接
        doc.querySelectorAll('a').forEach(link => {
            if (link.hasAttribute('data-preserve')) return;
            const markdownLink = `[${link.textContent}](${link.href})`;
            const linkTextNode = document.createTextNode(markdownLink);
            link.parentNode.replaceChild(linkTextNode, link);
        });

        // 处理图片
        doc.querySelectorAll('img').forEach(img => {
            if (img.closest('[data-preserve="true"]')) return;
            const markdownImage = `![${img.alt}](${img.src})`;
            const imgTextNode = document.createTextNode(markdownImage);
            img.parentNode.replaceChild(imgTextNode, img);
        });

        // 处理无序列表
        doc.querySelectorAll('ul').forEach(ul => {
            if (ul.closest('[data-preserve="true"]')) return;
            let markdown = '';
            ul.querySelectorAll(':scope > li').forEach(li => {
                markdown += `- ${li.textContent.trim()}\n`;
            });
            const markdownTextNode = document.createTextNode('\n' + markdown.trim());
            ul.parentNode.replaceChild(markdownTextNode, ul);
        });

        // 处理有序列表
        doc.querySelectorAll('ol').forEach(ol => {
            if (ol.closest('[data-preserve="true"]')) return;
            let markdown = '';
            ol.querySelectorAll(':scope > li').forEach((li, index) => {
                markdown += `${index + 1}. ${li.textContent.trim()}\n`;
            });
            const markdownTextNode = document.createTextNode('\n' + markdown.trim());
            ol.parentNode.replaceChild(markdownTextNode, ol);
        });

        // 处理标题
        for (let i = 1; i <= 6; i++) {
            doc.querySelectorAll(`h${i}`).forEach(header => {
                if (header.closest('[data-preserve="true"]')) return;
                const markdownHeader = `\n${'#'.repeat(i)} ${header.textContent}\n`;
                const headerTextNode = document.createTextNode(markdownHeader);
                header.parentNode.replaceChild(headerTextNode, header);
            });
        }

        // 处理段落
        doc.querySelectorAll('p').forEach(p => {
            if (p.closest('[data-preserve="true"]')) return;
            const markdownParagraph = `\n${p.textContent}\n`;
            const paragraphTextNode = document.createTextNode(markdownParagraph);
            p.parentNode.replaceChild(paragraphTextNode, p);
        });

        // 处理表格
        doc.querySelectorAll('table').forEach(table => {
            if (table.closest('[data-preserve="true"]')) return;
            let markdown = '';
            table.querySelectorAll('thead tr').forEach(tr => {
                tr.querySelectorAll('th').forEach(th => {
                    markdown += `| ${th.textContent} `;
                });
                markdown += '|\n';
                tr.querySelectorAll('th').forEach(() => {
                    markdown += '| ---- ';
                });
                markdown += '|\n';
            });
            table.querySelectorAll('tbody tr').forEach(tr => {
                tr.querySelectorAll('td').forEach(td => {
                    markdown += `| ${td.textContent} `;
                });
                markdown += '|\n';
            });
            const markdownTextNode = document.createTextNode('\n' + markdown.trim() + '\n');
            table.parentNode.replaceChild(markdownTextNode, table);
        });

        // 移除所有剩余HTML标签
        let markdown = doc.body.innerHTML.replace(/<[^>]*>/g, '');

        // 清理额外的空白行和空格
        markdown = markdown.replace(/\n{3,}/g, '\n\n');

        return markdown.trim();
    }
})();
