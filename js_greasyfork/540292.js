// ==UserScript==
// @name         MiniMax对话Markdown导出
// @name:en       MiniMax to Markdown Exporter
// @version      1.2
// @description  导出MiniMax网站上的对话为Markdown格式，思考过程使用引用格式
// @description:en  Export chat history from MiniMax website to Markdown format with thinking process in quote format
// @author       dennischancs
// @license      MIT
// @match        https://chat.minimax.io/*
// @match        https://*.minimax.io/*
// @grant        none
// @namespace    https://greasyfork.org/users/1486487-dennischancs
// @downloadURL https://update.greasyfork.org/scripts/540292/MiniMax%E5%AF%B9%E8%AF%9DMarkdown%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540292/MiniMax%E5%AF%B9%E8%AF%9DMarkdown%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取对话元素
    function getConversationElements() {
        return document.querySelectorAll('.chat-card-item-wrapper');
    }

    // 提取用户消息
    function extractUserMessage(element) {
        const userCard = element.querySelector('.user-card-wrapper');
        if (userCard) {
            const contentDiv = userCard.querySelector('[id^="content-"]');
            return contentDiv ? contentDiv.textContent.trim() : '';
        }
        return '';
    }

    // 提取系统消息和思考过程
    function extractSystemMessage(element, removeThinking = true) {
        const systemCard = element.querySelector('.system-card-wrapper');
        if (systemCard) {
            const contentDiv = systemCard.querySelector('[id^="content-"]');
            if (contentDiv) {
                // 克隆元素以避免修改原始DOM
                const clonedContent = contentDiv.cloneNode(true);

                let thinkingContent = '';
                let mainContent = '';

                // 提取思考过程部分
                const thinkingProcess = clonedContent.querySelector('.mb-3');
                if (thinkingProcess) {
                    thinkingContent = thinkingProcess.textContent.trim();
                    thinkingProcess.remove();
                }

                // 提取主要回答内容
                mainContent = clonedContent.textContent.trim();

                if (removeThinking) {
                    return mainContent;
                } else {
                    // 将思考过程格式化为引用格式
                    let result = '';
                    if (thinkingContent) {
                        const thinkingLines = thinkingContent.split('\n');
                        const quotedThinking = thinkingLines.map(line =>
                            line.trim() ? `> ${line.trim()}` : '>'
                        ).join('\n');
                        result += quotedThinking + '\n\n';
                    }
                    result += mainContent;
                    return result;
                }
            }
        }
        return '';
    }

    // 转换HTML为Markdown
    function htmlToMarkdown(html) {
        if (!html) return '';

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

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

        // 粗体文本
        doc.querySelectorAll('strong, b').forEach(bold => {
            bold.parentNode.replaceChild(document.createTextNode(`**${bold.textContent}**`), bold);
        });

        // 斜体文本
        doc.querySelectorAll('em, i').forEach(italic => {
            italic.parentNode.replaceChild(document.createTextNode(`*${italic.textContent}*`), italic);
        });

        // 行内代码
        doc.querySelectorAll('p code').forEach(code => {
            code.parentNode.replaceChild(document.createTextNode(`\`${code.textContent}\``), code);
        });

        // 链接
        doc.querySelectorAll('a').forEach(link => {
            link.parentNode.replaceChild(document.createTextNode(`[${link.textContent}](${link.href})`), link);
        });

        // 图片
        doc.querySelectorAll('img').forEach(img => {
            img.parentNode.replaceChild(document.createTextNode(`![${img.alt || ''}](${img.src})`), img);
        });

        // 代码块
        doc.querySelectorAll('pre').forEach(pre => {
            const codeType = pre.querySelector('div > div:first-child')?.textContent || '';
            const markdownCode = pre.querySelector('code')?.textContent || pre.textContent;
            pre.innerHTML = `\n\`\`\`${codeType}\n${markdownCode}\n\`\`\`\n`;
        });

        // 无序列表
        doc.querySelectorAll('ul').forEach(ul => {
            let markdown = '';
            ul.querySelectorAll(':scope > li').forEach(li => {
                markdown += `- ${li.textContent.trim()}\n`;
            });
            ul.parentNode.replaceChild(document.createTextNode('\n' + markdown.trim()), ul);
        });

        // 有序列表
        doc.querySelectorAll('ol').forEach(ol => {
            let markdown = '';
            ol.querySelectorAll(':scope > li').forEach((li, index) => {
                markdown += `${index + 1}. ${li.textContent.trim()}\n`;
            });
            ol.parentNode.replaceChild(document.createTextNode('\n' + markdown.trim()), ol);
        });

        // 标题
        for (let i = 1; i <= 6; i++) {
            doc.querySelectorAll(`h${i}`).forEach(header => {
                header.parentNode.replaceChild(document.createTextNode('\n' + `${'#'.repeat(i)} ${header.textContent}\n`), header);
            });
        }

        // 段落
        doc.querySelectorAll('p').forEach(p => {
            p.parentNode.replaceChild(document.createTextNode('\n' + p.textContent + '\n'), p);
        });

        // 表格
        doc.querySelectorAll('table').forEach(table => {
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
            table.parentNode.replaceChild(document.createTextNode('\n' + markdown.trim() + '\n'), table);
        });

        let markdown = doc.body.innerHTML.replace(/<[^>]*>/g, '');
        markdown = markdown.replaceAll('&gt;', '>')
                          .replaceAll('&lt;', '<')
                          .replaceAll('&amp;', '&')
                          .replaceAll('≥', '>=')
                          .replaceAll('≤', '<=')
                          .replaceAll('≠', '\\neq');
        return markdown.trim();
    }

    // 下载文件
    function download(data, filename, type) {
        const file = new Blob([data], { type: type });
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    // 生成Markdown内容
    function generateMarkdown(removeThinking = true) {
        let markdownContent = "";
        const conversationElements = getConversationElements();

        conversationElements.forEach(element => {
            const userMessage = extractUserMessage(element);
            const systemMessage = extractSystemMessage(element, removeThinking);

            if (userMessage) {
                const userMarkdown = htmlToMarkdown(userMessage);
                markdownContent += `\n# User Question\n${userMarkdown}\n`;
            }

            if (systemMessage) {
                const systemMarkdown = htmlToMarkdown(systemMessage);
                markdownContent += `# MiniMax AI\n${systemMarkdown}\n`;
            }
        });

        return markdownContent.trim();
    }

    // 显示导出模态框
    function showExportModal() {
        const conversationElements = getConversationElements();

        if (conversationElements.length === 0) {
            alert("未找到对话内容。");
            return;
        }

        // 创建模态框
        const modal = document.createElement('div');
        modal.id = 'minimax-markdown-modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000'
        });

        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            backgroundColor: '#fff',
            color: '#000',
            padding: '20px',
            borderRadius: '8px',
            width: '60%',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        });

        const title = document.createElement('h3');
        title.textContent = 'MiniMax 对话导出';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        title.style.color = '#333';

        // 创建选项区域
        const optionsContainer = document.createElement('div');
        Object.assign(optionsContainer.style, {
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #ddd'
        });

        const checkboxContainer = document.createElement('div');
        Object.assign(checkboxContainer.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        });

        const removeThinkingCheckbox = document.createElement('input');
        removeThinkingCheckbox.type = 'checkbox';
        removeThinkingCheckbox.id = 'remove-thinking-checkbox';
        removeThinkingCheckbox.checked = false; // 默认不勾选
        Object.assign(removeThinkingCheckbox.style, {
            margin: '0',
            cursor: 'pointer'
        });

        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = '移除思考过程（取消勾选将以引用格式显示思考过程）';
        checkboxLabel.setAttribute('for', 'remove-thinking-checkbox');
        Object.assign(checkboxLabel.style, {
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333'
        });

        checkboxContainer.appendChild(removeThinkingCheckbox);
        checkboxContainer.appendChild(checkboxLabel);
        optionsContainer.appendChild(checkboxContainer);

        const textarea = document.createElement('textarea');
        // 初始化内容
        textarea.value = generateMarkdown(removeThinkingCheckbox.checked);
        Object.assign(textarea.style, {
            flex: '1',
            resize: 'none',
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginBottom: '10px',
            boxSizing: 'border-box',
            color: '#000',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '4px'
        });
        textarea.setAttribute('readonly', true);

        // 监听复选框变化
        removeThinkingCheckbox.addEventListener('change', () => {
            const newContent = generateMarkdown(removeThinkingCheckbox.checked);
            textarea.value = newContent;
        });

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
        });

        const copyButton = document.createElement('button');
        copyButton.textContent = '复制';
        Object.assign(copyButton.style, {
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#28A745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        });

        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载';
        Object.assign(downloadButton.style, {
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        Object.assign(closeButton.style, {
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#DC3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        });

        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(closeButton);

        modalContent.appendChild(title);
        modalContent.appendChild(optionsContainer);
        modalContent.appendChild(textarea);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 按钮事件监听器
        copyButton.addEventListener('click', () => {
            textarea.select();
            navigator.clipboard.writeText(textarea.value)
                .then(() => {
                    copyButton.textContent = '已复制';
                    setTimeout(() => copyButton.textContent = '复制', 2000);
                })
                .catch(err => {
                    console.error('复制失败', err);
                    // 备用复制方法
                    try {
                        document.execCommand('copy');
                        copyButton.textContent = '已复制';
                        setTimeout(() => copyButton.textContent = '复制', 2000);
                    } catch (e) {
                        alert('复制失败，请手动复制');
                    }
                });
        });

        downloadButton.addEventListener('click', () => {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const suffix = removeThinkingCheckbox.checked ? '' : '-with-thinking';
            download(textarea.value, `minimax-chat-${timestamp}${suffix}.md`, 'text/markdown');
        });

        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // ESC键和点击外部关闭模态框
        const escListener = (e) => {
            if (e.key === 'Escape' && document.getElementById('minimax-markdown-modal')) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escListener);
            }
        };
        document.addEventListener('keydown', escListener);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escListener);
            }
        });
    }

    // 创建导出按钮
    function createExportButton() {
        // 移除已存在的按钮
        const existingButton = document.getElementById('minimax-export-chat');
        if (existingButton) {
            existingButton.remove();
        }

        const exportButton = document.createElement('button');
        exportButton.textContent = '导出对话';
        exportButton.id = 'minimax-export-chat';

        const styles = {
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: '9999',
            padding: '10px 15px',
            backgroundColor: '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 10px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.2s ease'
        };

        Object.assign(exportButton.style, styles);

        // 鼠标悬停效果
        exportButton.addEventListener('mouseenter', () => {
            exportButton.style.backgroundColor = '#4338CA';
            exportButton.style.transform = 'translateY(-1px)';
        });

        exportButton.addEventListener('mouseleave', () => {
            exportButton.style.backgroundColor = '#4F46E5';
            exportButton.style.transform = 'translateY(0)';
        });

        exportButton.addEventListener('click', showExportModal);
        document.body.appendChild(exportButton);
    }

    // 等待页面加载完成后初始化
    function init() {
        // 等待对话内容加载
        const checkContent = () => {
            const conversations = getConversationElements();
            if (conversations.length > 0) {
                createExportButton();
            }
        };

        // 立即检查一次
        checkContent();

        // 定期检查并创建按钮（处理动态加载的内容）
        setInterval(() => {
            checkContent();
        }, 2000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();