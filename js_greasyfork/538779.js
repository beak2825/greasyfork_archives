// ==UserScript==
// @name         Dedao article2markdown
// @namespace    http://tampermonkey.net/
// @version      2025-06-02
// @description  Convert Dedao articles to Markdown format
// @author       AA
// @match        https://www.dedao.cn/course/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dedao.cn
// @grant        GM_setClipboard
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538779/Dedao%20article2markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/538779/Dedao%20article2markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function htmlToMarkdown(htmlElement) {
        let markdown = '';

        // Process each child node
        for (const child of htmlElement.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                // Handle headers
                if (child.classList.contains('header-2')) {
                    markdown += '### ' + child.textContent.trim() + '\n';
                }
                else if (child.classList.contains('header-3')) {
                    markdown += '#### ' + child.textContent.trim() + '\n';
                }
                else if (child.tagName === 'P') {
                    // 处理段落内容，包括<b>标签
                    let paragraphText = '';
                    for (const node of child.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            paragraphText += node.textContent;
                        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'B') {
                            paragraphText += ' **' + node.textContent + '** ';
                        }
                    }

                    // 检查<p>是否只包含<br>或空白
                    const hasOnlyBr = child.children.length === 1 &&
                                     child.children[0].tagName === 'BR' &&
                                     child.textContent.trim() === '';

                    if (hasOnlyBr) {
                        // 对于只包含<br>的<p>，转换为单个换行
                        markdown += '\n\n';
                    } else {
                        // 普通段落处理
                        const text = paragraphText.trim();
                        if (text) {
                            markdown += text + '\n';
                        } else {
                            // 完全空的段落
                            markdown += '\n';
                        }
                    }
                }
                else if (child.classList.contains('original-block-quote')) {
                    // Blockquote
                    const quoteText = child.querySelector('blockquote').textContent.trim();
                    markdown += '> ' + quoteText.replace(/\n/g, '\n> ') + '\n\n';
                }
                // 直接处理独立的<b>标签（非段落内）
                else if (child.tagName === 'B') {
                    markdown += '**' + child.textContent + '**';
                }
            }
        }

        // Clean up multiple consecutive newlines
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        return markdown.trim();
    }


    function showMarkdownModal(markdown) {
        // Create modal container
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50px';
        modal.style.left = '50%';
        modal.style.transform = 'translateX(-50%)';
        modal.style.width = '80%';
        modal.style.maxWidth = '800px';
        modal.style.maxHeight = '80vh';
        modal.style.backgroundColor = 'white';
        modal.style.border = '1px solid #ddd';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        modal.style.zIndex = '9999';
        modal.style.padding = '20px';
        modal.style.overflow = 'auto';

        // Create title
        const title = document.createElement('h3');
        title.textContent = 'Markdown Conversion';
        title.style.marginTop = '0';
        modal.appendChild(title);

        // Create code block
        const pre = document.createElement('pre');
        pre.style.backgroundColor = '#f5f5f5';
        pre.style.padding = '15px';
        pre.style.borderRadius = '4px';
        pre.style.overflow = 'auto';
        pre.style.whiteSpace = 'pre-wrap';

        const code = document.createElement('code');
        code.textContent = markdown;
        pre.appendChild(code);
        modal.appendChild(pre);

        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy to Clipboard';
        copyBtn.style.marginTop = '10px';
        copyBtn.style.padding = '8px 15px';
        copyBtn.style.backgroundColor = '#4CAF50';
        copyBtn.style.color = 'white';
        copyBtn.style.border = 'none';
        copyBtn.style.borderRadius = '4px';
        copyBtn.style.cursor = 'pointer';

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(markdown).then(() => {
                GM_notification({
                    title: 'Copied!',
                    text: 'Markdown content copied to clipboard',
                    timeout: 2000
                });
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });

        modal.appendChild(copyBtn);

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.marginLeft = '10px';
        closeBtn.style.padding = '8px 15px';
        closeBtn.style.backgroundColor = '#f44336';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.appendChild(closeBtn);

        // Add modal to document
            document.body.appendChild(modal);
        }

        // Wait for content to load

    const convertBtn = document.createElement('button');
    convertBtn.innerHTML = '转换为<br>Markdown';
    convertBtn.style.position = 'fixed';
    convertBtn.style.top = '5vh';
    convertBtn.style.right = '20px';
    convertBtn.style.zIndex = '9999';
    convertBtn.style.padding = '8px 16px';
    convertBtn.style.backgroundColor = '#4CAF50';
    convertBtn.style.color = 'white';
    convertBtn.style.border = 'none';
    convertBtn.style.borderRadius = '4px';
    convertBtn.style.cursor = 'pointer';
    convertBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    convertBtn.style.fontSize = '14px';

    // 添加悬停效果
    convertBtn.addEventListener('mouseover', () => {
        convertBtn.style.backgroundColor = '#45a049';
    });
    convertBtn.addEventListener('mouseout', () => {
        convertBtn.style.backgroundColor = '#4CAF50';
    });

    // 按钮点击事件处理
    convertBtn.addEventListener('click', () => {
        const editorShow = document.querySelector('.editor-show');
        if (editorShow) {
            const markdown = htmlToMarkdown(editorShow);
            showMarkdownModal(markdown);
        } else {
            GM_notification({
                title: '转换失败',
                text: '未找到文章内容，请确认是否在文章页面',
                timeout: 3000
            });
        }
    });


    // 将按钮添加到页面

    setTimeout(() => {
        document.body.appendChild(convertBtn);
    }, 1000);
})();