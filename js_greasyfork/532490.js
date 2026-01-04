// ==UserScript==
// @name         复制格式转换（Markdown）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  选中内容后浮现按钮（固定右上角），点击自动复制为完整 Markdown 格式，确保排版与原文一致。支持数学公式、代码块语言标识、表格对齐。简化浮现逻辑。
// @author       KiwiFruit
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532490/%E5%A4%8D%E5%88%B6%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%EF%BC%88Markdown%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532490/%E5%A4%8D%E5%88%B6%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%EF%BC%88Markdown%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const config = {
        preserveEmptyLines: false, // 是否保留空行
        addSeparators: true, // 数学公式使用 $$ 分隔符
        mathSelector: '.math-formula', // 数学公式自定义选择器
    };

    // 创建浮动按钮 (固定在右上角)
    const floatingButton = createFloatingButton();
    // 创建预览窗口 (固定在按钮下方)
    const previewWindow = createPreviewWindow();

    /**
     * 创建浮动按钮元素 (固定位置)
     * @returns {HTMLElement} 按钮元素
     */
    function createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'markdownCopyButton';
        button.innerText = '复制为 MD (Ctrl+Shift+C)';
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            right: '20px', // 固定在右上角
            padding: '8px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: '10000',
            display: 'none', // 初始隐藏
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'opacity 0.2s ease-in-out',
            fontSize: '13px',
            whiteSpace: 'nowrap'
        });
        document.body.appendChild(button);
        return button;
    }

    /**
     * 创建预览窗口元素 (固定在按钮下方)
     * @returns {HTMLElement} 预览窗口元素
     */
    function createPreviewWindow() {
        const preview = document.createElement('div');
        preview.id = 'markdownPreview';
        Object.assign(preview.style, {
            position: 'fixed',
            top: '60px', // 固定在按钮下方
            right: '20px',
            width: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            overflowX: 'auto',
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '9999',
            display: 'none', // 初始隐藏
            fontFamily: 'monospace',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            boxSizing: 'border-box'
        });
        document.body.appendChild(preview);
        return preview;
    }

    /**
     * 显示浮动按钮 (简单显示)
     */
    function showFloatingButton() {
        floatingButton.style.display = 'block';
    }

    /**
     * 隐藏浮动按钮和预览窗口
     */
    function hideFloatingButton() {
        floatingButton.style.display = 'none';
        previewWindow.style.display = 'none';
    }


    // --- Markdown 转换逻辑 (保持不变) ---

    function convertToMarkdown(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            return config.preserveEmptyLines ? text : text.trim() || '';
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            switch (tagName) {
                case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
                    return `\n${formatHeader(node)}\n`;
                case 'br':
                    return '\n';
                case 'p':
                    return `\n${formatParagraph(node)}\n`;
                case 'ul': case 'ol':
                    return `\n${formatList(node, tagName === 'ol')}\n`;
                case 'blockquote':
                    return `\n${formatBlockquote(node)}\n`;
                case 'pre':
                    return `\n${formatCodeBlock(node)}\n`;
                case 'code':
                    return formatInlineCode(node);
                case 'a':
                    return formatLink(node);
                case 'img':
                    return formatImage(node);
                case 'strong': case 'b':
                    return formatBold(node);
                case 'em': case 'i':
                    return formatItalic(node);
                case 'del':
                    return formatStrikethrough(node);
                case 'hr':
                    return '\n---\n';
                case 'table':
                    return `\n${formatTable(node)}\n`;
                case 'span': case 'div':
                    if (node.matches(config.mathSelector)) {
                        return `\n${formatMath(node)}\n`;
                    }
                    return processChildren(node);
                default:
                    return processChildren(node);
            }
        }
        return '';
    }

    function formatHeader(node) {
        const level = parseInt(node.tagName.slice(1));
        const content = processChildren(node).trim();
        return `${'#'.repeat(level)} ${content}`;
    }

    function formatParagraph(node) {
        const content = processChildren(node).trim();
        return `${content}`;
    }

    function formatList(node, isOrdered) {
        let markdown = '';
        let index = 1;
        for (const li of node.children) {
            const content = processChildren(li).trim();
            markdown += `${isOrdered ? `${index++}.` : '-' } ${content}\n`;
        }
        return `\n${markdown}\n`;
    }

    function formatBlockquote(node) {
        const content = processChildren(node).trim();
        return `> ${content.replace(/\n/g, '\n> ')}\n`;
    }

    // 改进代码块语言检测
    function formatCodeBlock(node) {
        let langMatch = node.className.match(/language-(\w+)/);
        let lang = langMatch ? langMatch[1] : '';
        if (!lang) {
            const codeEl = node.querySelector('code');
            if (codeEl) {
                langMatch = codeEl.className.match(/language-(\w+)/);
                lang = langMatch ? langMatch[1] : '';
            }
        }
        const code = node.textContent.trim();
        return `\`\`\`${lang}\n${code}\n\`\`\``;
    }

    function formatInlineCode(node) {
        return `\`${node.textContent.trim()}\``;
    }

    function formatLink(node) {
        const text = processChildren(node).trim();
        const href = node.href || '';
        return `[${text}](${href})`;
    }

    function formatImage(node) {
        const alt = node.alt || 'Image';
        const src = node.src || '';
        return `![${alt}](${src})`;
    }

    function formatBold(node) {
        const content = processChildren(node).trim();
        return ` **${content}** `;
    }

    function formatItalic(node) {
        const content = processChildren(node).trim();
        return ` *${content}* `;
    }

    function formatStrikethrough(node) {
        const content = processChildren(node).trim();
        return `~~${content}~~`;
    }

    // 改进表格对齐支持
    function formatTable(node) {
        const rows = Array.from(node.rows);
        if (rows.length === 0) return '';
        const headers = Array.from(rows[0].cells);
        const separatorCells = headers.map(cell => {
            const style = window.getComputedStyle(cell);
            const align = style.textAlign;
            if (align === 'right') return '---:';
            if (align === 'center') return ':---:';
            return '---';
        });
        const separator = `| ${separatorCells.join(' | ')} |`;

        const headerRow = `| ${headers.map(cell => cell.textContent.trim()).join(' | ')} |`;
        const dataRows = rows.slice(1).map(row => {
            const cells = Array.from(row.cells).map(cell => {
                return processChildren(cell).trim().replace(/\n/g, ' ');
            });
            return `| ${cells.join(' | ')} |`;
        }).join('\n');
        return `${headerRow}\n${separator}\n${dataRows}`;
    }

    function formatMath(node) {
        const formula = node.textContent.trim();
        if (config.addSeparators) {
            return `$$\n${formula}\n$$`;
        } else {
            return `$${formula}$ `;
        }
    }

    function processChildren(node) {
        let result = '';
        for (const child of node.childNodes) {
            result += convertToMarkdown(child);
        }
        return result;
    }

    function extractAndConvertToMarkdown(range) {
        const fragment = range.cloneContents();
        const nodes = Array.from(fragment.childNodes);
        return nodes.map(node => convertToMarkdown(node)).join('').trim();
    }

    async function copyToClipboard(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text);
                return true;
            } else {
                await navigator.clipboard.writeText(text);
                console.log('Markdown 已复制到剪贴板');
                return true;
            }
        } catch (err) {
            console.error('复制失败:', err);
            return false;
        }
    }

    /**
     * 显示提示信息 (修复动画)
     * @param {string} message 提示内容
     */
    function showToast(message) {
        // 动态注入关键帧动画样式
        if (!document.getElementById('markdown-copy-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'markdown-copy-toast-styles';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }

        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#333',
            color: '#fff',
            borderRadius: '5px',
            zIndex: '10001',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            animation: 'fadeInOut 2.5s ease-in-out forwards',
            pointerEvents: 'none'
        });
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
             if (toast.parentNode) { toast.remove(); }
        }, 2500);
    }

    // --- 事件监听器 ---
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    /**
     * 鼠标释放事件处理 (简化逻辑)
     * @param {Event} event 鼠标事件
     */
    function handleMouseUp(event) {
        // 添加小延迟，确保 selection 状态是最新的
        setTimeout(() => {
            const selection = window.getSelection();
            // 简化的浮现逻辑：只要选区存在且未折叠，就显示按钮
            if (selection && !selection.isCollapsed) {
                showFloatingButton();
                floatingButton.onclick = async () => {
                    try {
                        let currentRange;
                        try {
                            currentRange = selection.getRangeAt(0);
                        } catch (e) {
                            throw new Error("选区在复制时已丢失，请重新选择内容。");
                        }

                        const markdownContent = extractAndConvertToMarkdown(currentRange);

                        // 显示预览窗口
                        previewWindow.innerText = markdownContent;
                        previewWindow.style.display = 'block';

                        const success = await copyToClipboard(markdownContent);
                        if (success) {
                            showToast('内容已复制为 Markdown 格式！');
                        } else {
                            showToast('复制失败，请重试！');
                        }
                    } catch (err) {
                        console.error('处理内容时出错:', err);
                        showToast(`发生错误：${err.message}`);
                    } finally {
                        // 不再立即隐藏
                    }
                };
            } else {
                // 如果没有选区，则隐藏按钮
                hideFloatingButton();
            }
        }, 10); // 10ms 延迟
    }

    /**
     * 键盘事件处理
     * @param {Event} event 键盘事件
     */
    function handleKeyDown(event) {
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
            event.preventDefault(); // 阻止默认行为
            handleMouseUp(event); // 触发复制逻辑
        }
    }

    /**
     * 鼠标按下事件处理（用于点击外部区域隐藏按钮）
     * @param {Event} event 鼠标事件
     */
    function handleMouseDown(event) {
        // 如果点击的不是按钮或预览窗口本身，则隐藏它们
        if (!floatingButton.contains(event.target) && !previewWindow.contains(event.target)) {
            hideFloatingButton();
        }
    }

})();