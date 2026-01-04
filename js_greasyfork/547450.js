// ==UserScript==
// @name         小鹅通内容复制助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  允许在小鹅通课程页面中复制文本和图片，支持一键复制全文(纯文本格式或Markdown格式)
// @author       观澜同学
// @match        https://appf7dltino5958.xet.citv.cn/p/course/text/*
// @match        https://*.xet.tech/s/*
// @license MIT
// @match        https://*.xet.tech/p/*
// @match        https://*.xet.citv.cn/s/*
// @match        https://*.xet.citv.cn/p/*
// @match        https://*.xiaoe-tech.com/*
// @match        https://*.xiaoe-tech.cn/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547450/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547450/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式用于指示用户脚本已激活和添加复制按钮样式
    GM_addStyle(`
        .copyable-enabled::after {
            content: "复制功能已启用";
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 128, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            z-index: 9999;
            font-size: 12px;
            transition: opacity 0.5s;
            opacity: 1;
        }

        .copyable-enabled.fade-out::after {
            opacity: 0;
        }

        /* 按钮容器样式 */
        #copy-buttons-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
        }

        /* 一键复制按钮样式 */
        .copy-button {
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 15px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
            white-space: nowrap;
        }

        .copy-button:hover {
            background: #2980b9;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        }

        /* 主要复制按钮样式 */
        #copy-all-button {
            background: #8e44ad;
            font-weight: bold;
            font-size: 15px;
        }

        #copy-all-button:hover {
            background: #6c3483;
        }

        /* 次要按钮样式 */
        .secondary-button {
            background: #7f8c8d;
            font-size: 13px;
        }

        .secondary-button:hover {
            background: #636e72;
        }

        /* 提示样式 */
        .copy-toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            font-size: 16px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .copy-toast.show {
            opacity: 1;
        }
    `);

    // 主函数
    function enableCopyFeatures() {
        console.log('小鹅通内容复制助手已激活');

        // 让所有内容可选择
        enableTextSelection();

        // 启用图片右键菜单和拖拽
        enableImageSaving();

        // 创建复制按钮
        createCopyButtons();

        // 添加提示并在5秒后淡出
        document.body.classList.add('copyable-enabled');
        setTimeout(() => {
            document.body.classList.add('fade-out');
        }, 5000);
    }

    // 创建复制按钮容器和复制按钮
    function createCopyButtons() {
        const container = document.createElement('div');
        container.id = 'copy-buttons-container';

        // 创建一键完整复制按钮（主按钮）
        const copyAllButton = document.createElement('button');
        copyAllButton.id = 'copy-all-button';
        copyAllButton.className = 'copy-button';
        copyAllButton.textContent = '✨ 一键完整复制(图片+格式)';
        copyAllButton.addEventListener('click', copyCompleteContent);

        // 创建备用的复制Markdown按钮
        const markdownButton = document.createElement('button');
        markdownButton.id = 'copy-markdown-button';
        markdownButton.className = 'copy-button secondary-button';
        markdownButton.textContent = '选项2: 复制为Markdown格式';
        markdownButton.addEventListener('click', copyAllAsMarkdown);

        // 创建备用的复制纯文本按钮
        const textButton = document.createElement('button');
        textButton.id = 'copy-text-button';
        textButton.className = 'copy-button secondary-button';
        textButton.textContent = '选项3: 仅复制纯文本内容';
        textButton.addEventListener('click', copyAsPlainText);

        // 将按钮添加到容器中
        container.appendChild(copyAllButton);
        container.appendChild(markdownButton);
        container.appendChild(textButton);

        // 将容器添加到页面
        document.body.appendChild(container);
    }

    // 显示提示信息
    function showToast(message, duration = 2000) {
        let toast = document.querySelector('.copy-toast');

        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'copy-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // 复制内容到剪贴板
    function copyToClipboard(text, formatName) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const success = document.execCommand('copy');
            if (success) {
                showToast(`内容已成功复制为${formatName}！`);
            } else {
                showToast('复制失败，请重试');
            }
        } catch (err) {
            showToast('复制失败: ' + err);
        }

        document.body.removeChild(textarea);
    }

    // 完整复制内容（合并功能，确保同时保留格式和图片）
    function copyCompleteContent() {
        // 查找主要内容容器
        const mainContent = document.querySelector('.article-box') ||
                           document.querySelector('.course-content') ||
                           document.querySelector('.se-preview__content') ||
                           document.querySelector('[class*="preview_content"]') ||
                           document.querySelector('[class*="content-box"]') ||
                           document.querySelector('main') ||
                           document.querySelector('.course-container') ||
                           document.body;

        // 克隆节点以避免修改原始DOM
        const contentClone = mainContent.cloneNode(true);

        // 移除可能不想要的元素，如各种工具栏、按钮等
        const unwantedSelectors = [
            'script', 'style', 'iframe',
            '.copy-toast', '#copy-buttons-container',
            '.nav-bar', '.footer', '.toolbar', '.control-bar',
            'button', '.button', '[role="button"]',
            '.comment', '.comments', '.comment-section',
            '.share', '.social', '.recommend'
        ];

        unwantedSelectors.forEach(selector => {
            const elements = contentClone.querySelectorAll(selector);
            elements.forEach(el => el.parentNode && el.parentNode.removeChild(el));
        });

        // 创建一个包含完整HTML结构的临时容器
        const tempContainer = document.createElement('div');

        // 添加文档类型和HTML结构
        const htmlStructure = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${document.title}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        margin: 10px 0;
                    }
                    table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 15px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        margin-top: 20px;
                        margin-bottom: 10px;
                        font-weight: bold;
                    }
                    a {
                        color: #3498db;
                        text-decoration: underline;
                    }
                    ul, ol {
                        padding-left: 20px;
                        margin-bottom: 15px;
                    }
                    p {
                        margin-bottom: 15px;
                    }
                </style>
            </head>
            <body>
                <h1>${document.title}</h1>
                <div id="content-container"></div>
            </body>
            </html>
        `;

        tempContainer.innerHTML = htmlStructure;

        // 获取内容容器
        const contentContainer = tempContainer.querySelector('#content-container');

        // 处理所有图片，确保使用完整的URL并设置最大宽度
        contentClone.querySelectorAll('img').forEach(img => {
            // 确保图片链接是绝对URL
            if(img.src) {
                img.setAttribute('src', img.src);
            }

            // 如果图片没有alt属性，添加一个
            if(!img.alt) {
                img.alt = '图片';
            }
        });

        // 处理链接，确保使用完整URL
        contentClone.querySelectorAll('a').forEach(link => {
            if(link.href) {
                link.setAttribute('href', link.href);
            }
        });

        // 复制内容原始CSS样式
        const originalStyles = {};
        const computedStyleProperties = [
            'font-family', 'font-size', 'font-weight', 'color', 'background-color',
            'text-align', 'line-height', 'margin', 'padding', 'border'
        ];

        contentClone.querySelectorAll('*').forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const inlineStyles = {};

            computedStyleProperties.forEach(prop => {
                const value = computedStyle.getPropertyValue(prop);
                if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
                    inlineStyles[prop] = value;
                }
            });

            // 保留重要的行内样式
            if (Object.keys(inlineStyles).length > 0) {
                let styleString = '';
                for (const [key, value] of Object.entries(inlineStyles)) {
                    styleString += `${key}: ${value}; `;
                }
                element.setAttribute('style', styleString + (element.getAttribute('style') || ''));
            }
        });

        // 将内容添加到容器中
        contentContainer.appendChild(contentClone);

        // 提取完整HTML内容
        const htmlContent = tempContainer.innerHTML;

        // 创建一个HTML blob
        const htmlBlob = new Blob([htmlContent], {type: 'text/html'});

        // 尝试使用现代剪贴板API
        if (navigator.clipboard && navigator.clipboard.write) {
            try {
                navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': htmlBlob
                    })
                ]).then(() => {
                    showToast('✅ 内容已完整复制！包含所有格式和图片，可直接粘贴使用', 3000);
                }).catch(err => {
                    console.error('现代剪贴板API复制失败:', err);
                    fallbackCompleteCopy(tempContainer);
                });
            } catch (err) {
                console.error('使用现代剪贴板API时出错:', err);
                fallbackCompleteCopy(tempContainer);
            }
        } else {
            fallbackCompleteCopy(tempContainer);
        }
    }

    // 完整复制的备选方法 - 改进版
    function fallbackCompleteCopy(tempContainer) {
        // 将临时容器添加到DOM中
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.opacity = '0';
        document.body.appendChild(tempContainer);

        try {
            // 创建一个范围和选择
            const range = document.createRange();
            range.selectNodeContents(tempContainer);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // 尝试复制到剪贴板
            const success = document.execCommand('copy');

            if (success) {
                showToast('✅ 内容已完整复制！包含所有格式和图片，可直接粘贴使用', 3000);
            } else {
                // 如果直接复制失败，尝试使用备选方法
                secondaryFallbackCopy(tempContainer);
            }
        } catch (err) {
            console.error('fallback复制失败:', err);
            secondaryFallbackCopy(tempContainer);
        } finally {
            // 清理
            if (window.getSelection) {
                if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            }
            if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
        }
    }

    // 第二备选复制方法
    function secondaryFallbackCopy(container) {
        try {
            // 提取HTML内容
            const htmlContent = container.innerHTML;

            // 创建隐藏的textarea用于复制
            const textarea = document.createElement('textarea');
            textarea.value = htmlContent;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);

            // 选择textarea中的内容
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);

            // 复制
            const successful = document.execCommand('copy');

            if (successful) {
                showToast('✅ 内容已复制！请注意格式可能有所简化', 3000);
            } else {
                showToast('复制失败，请尝试使用"复制为Markdown格式"选项', 3000);
            }

            // 清理
            document.body.removeChild(textarea);
        } catch (err) {
            console.error('二级fallback复制失败:', err);
            showToast('复制失败，请尝试使用其他复制选项', 3000);
        }
    }

    // 纯文本复制功能
    function copyAsPlainText() {
        // 查找主要内容容器
        const mainContent = document.querySelector('.article-box') ||
                          document.querySelector('.course-content') ||
                          document.querySelector('.se-preview__content') ||
                          document.querySelector('[class*="preview_content"]') ||
                          document.querySelector('[class*="content-box"]') ||
                          document.querySelector('main') ||
                          document.querySelector('.course-container') ||
                          document.body;

        // 克隆节点以避免修改原始DOM
        const contentClone = mainContent.cloneNode(true);

        // 移除可能不想要的元素
        const unwantedSelectors = [
            'script', 'style', 'iframe',
            '.copy-toast', '#copy-buttons-container',
            '.nav-bar', '.footer', '.toolbar', '.control-bar'
        ];

        unwantedSelectors.forEach(selector => {
            const elements = contentClone.querySelectorAll(selector);
            elements.forEach(el => el.parentNode && el.parentNode.removeChild(el));
        });

        // 提取文本内容，保留基本格式
        let plainText = "";

        // 添加标题
        plainText += document.title + "\n\n";

        // 递归处理所有内容节点，提取纯文本但保留基本格式
        function extractFormattedText(node, indent = 0) {
            let text = "";

            // 跳过隐藏的元素和脚本标签
            if (node.nodeType === Node.ELEMENT_NODE) {
                const style = window.getComputedStyle(node);
                if (style.display === 'none' || style.visibility === 'hidden' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                    return "";
                }
            }

            // 处理不同类型的节点
            if (node.nodeType === Node.TEXT_NODE) {
                const trimmedText = node.textContent.trim();
                if (trimmedText) {
                    text += "  ".repeat(indent) + trimmedText + "\n";
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 处理标题
                if (/^H[1-6]$/.test(node.tagName)) {
                    const level = parseInt(node.tagName[1]);
                    text += "\n" + "#".repeat(level) + " " + node.textContent.trim() + "\n\n";
                    return text;
                }

                // 处理图片
                if (node.tagName === 'IMG') {
                    const alt = node.alt || '图片';
                    const src = node.src || '';
                    text += `\n[${alt}]\n${src}\n\n`;
                    return text;
                }

                // 处理列表
                if (node.tagName === 'LI') {
                    text += "  ".repeat(indent) + "• ";
                }

                // 处理段落
                if (node.tagName === 'P' || node.tagName === 'DIV') {
                    if (node.textContent.trim()) {
                        text += "\n";
                    }
                }

                // 递归处理子节点
                for (const child of node.childNodes) {
                    text += extractFormattedText(child, indent + (node.tagName === 'LI' ? 1 : 0));
                }

                // 段落结束添加额外换行
                if (node.tagName === 'P' || node.tagName === 'DIV') {
                    if (node.textContent.trim()) {
                        text += "\n";
                    }
                }
            }

            return text;
        }

        plainText += extractFormattedText(contentClone);

        // 清理多余的空行
        plainText = plainText.replace(/\n{3,}/g, '\n\n');

        // 复制到剪贴板
        copyToClipboard(plainText, "纯文本格式");
    }

    // 将图片转换为Markdown格式
    function imageToMarkdown(img) {
        const imgAlt = img.alt || '图片';
        const imgSrc = img.src;
        return `![${imgAlt}](${imgSrc})`;
    }

    // 将HTML标题转换为Markdown格式
    function headingToMarkdown(element) {
        const level = parseInt(element.tagName.substring(1)); // 获取h1, h2, h3等级别
        const headingMarks = '#'.repeat(level);
        return `${headingMarks} ${element.textContent.trim()}`;
    }

    // 处理普通文本段落
    function paragraphToMarkdown(element) {
        // 保留段落内的换行
        let text = '';
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'BR') {
                    text += '  \n'; // Markdown中的软换行：两个空格加换行
                } else if (node.tagName === 'IMG') {
                    text += imageToMarkdown(node);
                } else {
                    text += node.textContent;
                }
            }
        }
        return text.trim();
    }

    // 获取页面内容并转换为Markdown格式
    function getContentAsMarkdown() {
        // 获取标题
        const title = document.title || '小鹅通课程内容';
        let markdownContent = `# ${title}\n\n`;

        // 查找主要内容容器
        // 适配更多小鹅通页面结构
        const mainContent = document.querySelector('.article-box') ||
                           document.querySelector('.course-content') ||
                           document.querySelector('.se-preview__content') ||
                           document.querySelector('[class*="preview_content"]') ||
                           document.querySelector('[class*="content-box"]') ||
                           document.querySelector('main') ||
                           document.querySelector('.course-container') ||
                           document.body;

        // 已处理节点的集合，用于避免重复处理
        const processedNodes = new WeakSet();

        // 递归处理所有内容节点
        function processNode(node, indentLevel = 0) {
            // 如果节点已处理过，则跳过
            if (processedNodes.has(node)) {
                return '';
            }

            // 标记节点为已处理
            processedNodes.add(node);

            let markdown = '';

            // 跳过隐藏的元素和脚本标签
            if (node.nodeType === Node.ELEMENT_NODE) {
                const style = window.getComputedStyle(node);
                if (style.display === 'none' || style.visibility === 'hidden' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                    return '';
                }
            }

            // 处理不同类型的节点
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text && node.parentNode.tagName !== 'SCRIPT' && node.parentNode.tagName !== 'STYLE') {
                    markdown += text + ' ';
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 处理不同类型的元素
                if (/^H[1-6]$/.test(node.tagName)) {
                    markdown += '\n\n' + headingToMarkdown(node) + '\n\n';
                    // 标题已完整处理，不需要处理其子元素
                    return markdown;
                } else if (node.tagName === 'IMG') {
                    // 确保图片处理正确
                    markdown += '\n\n' + imageToMarkdown(node) + '\n\n';
                    return markdown;
                } else if (node.tagName === 'P') {
                    if (node.textContent.trim() || node.querySelectorAll('img').length > 0) {
                        // 如果段落只包含单个图片或链接，则交由专门处理函数处理
                        if (node.children.length === 1 &&
                            (node.children[0].tagName === 'IMG' || node.children[0].tagName === 'A')) {
                            // 在这里递归处理子元素
                            for (const child of node.childNodes) {
                                markdown += processNode(child, indentLevel);
                            }
                        } else {
                            // 使用改进的paragraphToMarkdown函数保留换行
                            markdown += '\n\n' + paragraphToMarkdown(node) + '\n\n';
                            // 段落已完整处理，不需要处理其子元素
                            return markdown;
                        }
                    }
                } else if (node.tagName === 'DIV') {
                    // 检查是否包含图片
                    const hasImages = node.querySelectorAll('img').length > 0;

                    // 只有没有特殊子元素的div才直接处理为段落
                    const hasSpecialChild = Array.from(node.children).some(
                        child => /^H[1-6]$/.test(child.tagName) ||
                                child.tagName === 'P' ||
                                child.tagName === 'UL' ||
                                child.tagName === 'OL' ||
                                child.tagName === 'IMG'
                    );

                    if (!hasSpecialChild && (node.textContent.trim() || hasImages)) {
                        markdown += '\n\n' + paragraphToMarkdown(node) + '\n\n';
                        return markdown;
                    }
                    // 对于有特殊子元素的div，继续递归处理其子元素
                } else if (node.tagName === 'UL' || node.tagName === 'OL') {
                    markdown += '\n\n';
                    // 处理列表项将在子元素处理
                } else if (node.tagName === 'LI') {
                    const listMarker = node.parentNode.tagName === 'OL' ? `${indentLevel + 1}. ` : '- ';
                    markdown += listMarker + node.textContent.trim() + '\n';
                    return markdown;
                } else if (node.tagName === 'A') {
                    markdown += `[${node.textContent.trim()}](${node.href})`;
                    return markdown;
                } else if (node.tagName === 'BR') {
                    // 确保换行正确处理
                    markdown += '  \n'; // Markdown软换行需要两个空格
                    return markdown;
                }

                // 递归处理子元素
                // 只有没有被提前返回的节点才会处理其子元素
                let childIndentLevel = indentLevel;
                if (node.tagName === 'UL' || node.tagName === 'OL') {
                    childIndentLevel++;
                }

                for (const child of node.childNodes) {
                    markdown += processNode(child, childIndentLevel);
                }
            }

            return markdown;
        }

        let content = processNode(mainContent);

        // 清理处理可能产生的多余空行，但保留必要的换行
        content = content.replace(/\n{3,}/g, '\n\n');

        return markdownContent + content.trim();
    }

    // 复制全部内容为Markdown格式
    function copyAllAsMarkdown() {
        const markdown = getContentAsMarkdown();
        copyToClipboard(markdown, "Markdown格式");
    }

    // 使文本可选择和复制
    function enableTextSelection() {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
            }

            /* 修复可能的鼠标事件 */
            [oncontextmenu], [oncopy], [oncut], [onselectstart] {
                oncontextmenu: none !important;
                oncopy: none !important;
                oncut: none !important;
                onselectstart: none !important;
            }

            /* 修复小鹅通特殊页面的右键限制 */
            .se-preview__content, [class*="preview_content"], [class*="forbidden_contextmenu"] {
                -webkit-user-select: auto !important;
                -moz-user-select: auto !important;
                -ms-user-select: auto !important;
                user-select: auto !important;
                oncontextmenu: none !important;
            }
        `;
        document.head.appendChild(style);

        // 移除事件监听器
        removeEventListeners(['copy', 'cut', 'contextmenu', 'selectstart']);

        // 移除元素上的事件处理属性
        document.querySelectorAll('*').forEach(element => {
            element.oncontextmenu = null;
            element.oncopy = null;
            element.oncut = null;
            element.onselectstart = null;

            element.removeAttribute('oncontextmenu');
            element.removeAttribute('oncopy');
            element.removeAttribute('oncut');
            element.removeAttribute('onselectstart');

            // 移除特定的class
            if (element.className && typeof element.className === 'string') {
                if (element.className.includes('forbidden_contextmenu')) {
                    element.classList.remove('forbidden_contextmenu');
                }
            }
        });

        // 针对特定的小鹅通页面结构添加观察器
        handleSpecialXiaoeStructure();
    }

    // 处理特殊的小鹅通页面结构
    function handleSpecialXiaoeStructure() {
        // 添加定时检查，以处理可能的动态加载内容
        const checkAndFix = () => {
            // 处理预览内容区域
            const previewContents = document.querySelectorAll('.se-preview__content, [class*="preview_content"], [class*="forbidden_contextmenu"]');
            previewContents.forEach(element => {
                // 移除上下文菜单限制
                element.oncontextmenu = null;
                element.removeAttribute('oncontextmenu');

                // 确保内容可选择
                element.style.userSelect = 'auto';
                element.style.webkitUserSelect = 'auto';
                element.style.msUserSelect = 'auto';
                element.style.mozUserSelect = 'auto';

                // 移除特定的类
                if (element.className && typeof element.className === 'string') {
                    if (element.className.includes('forbidden_contextmenu')) {
                        element.classList.remove('forbidden_contextmenu');
                    }
                }
            });

            // 处理所有段落
            const paragraphs = document.querySelectorAll('p[style*="line-height"]');
            paragraphs.forEach(p => {
                p.style.userSelect = 'auto';
                p.style.webkitUserSelect = 'auto';
            });
        };

        // 立即执行一次
        checkAndFix();

        // 设置定时检查，应对动态加载的内容
        setInterval(checkAndFix, 2000);

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(mutations => {
            checkAndFix();
        });

        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // 使图片可以保存
    function enableImageSaving() {
        document.querySelectorAll('img').forEach(img => {
            // 使图片可拖拽
            img.style.pointerEvents = 'auto';
            img.draggable = true;

            // 移除图片上的事件监听
            removeEventListenersFromElement(img, ['contextmenu', 'dragstart']);

            // 清除oncontextmenu属性
            img.removeAttribute('oncontextmenu');
            img.oncontextmenu = null;
        });

        // 监视DOM变化，处理动态加载的图片
        observeNewImages();
    }

    // 移除全局事件监听器
    function removeEventListeners(eventTypes) {
        eventTypes.forEach(type => {
            window.removeEventListener(type, returnFalse, true);
            document.removeEventListener(type, returnFalse, true);
            document.documentElement.removeEventListener(type, returnFalse, true);
            document.body.removeEventListener(type, returnFalse, true);

            // 强制重新添加允许默认行为的事件处理程序
            window.addEventListener(type, returnTrue, true);
            document.addEventListener(type, returnTrue, true);
            document.documentElement.addEventListener(type, returnTrue, true);
            document.body.addEventListener(type, returnTrue, true);
        });
    }

    // 从特定元素移除事件监听器
    function removeEventListenersFromElement(element, eventTypes) {
        eventTypes.forEach(type => {
            element.removeEventListener(type, returnFalse, true);
            // 添加允许默认行为的事件处理程序
            element.addEventListener(type, returnTrue, true);
        });
    }

    // 返回true的函数，用于覆盖事件处理程序
    function returnTrue(e) {
        e.stopImmediatePropagation();
        return true;
    }

    // 返回false的函数
    function returnFalse() {
        return false;
    }

    // 观察DOM变化，处理新添加的图片
    function observeNewImages() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'IMG') {
                            // 处理新的IMG元素
                            node.style.pointerEvents = 'auto';
                            node.draggable = true;
                            node.removeAttribute('oncontextmenu');
                            node.oncontextmenu = null;
                        } else if (node.nodeType === 1) {
                            // 检查添加的DOM节点内部是否有图片
                            node.querySelectorAll('img').forEach(img => {
                                img.style.pointerEvents = 'auto';
                                img.draggable = true;
                                img.removeAttribute('oncontextmenu');
                                img.oncontextmenu = null;
                            });
                        }
                    });
                }
            });
        });

        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等待页面完全加载后执行
    window.addEventListener('load', function() {
        setTimeout(enableCopyFeatures, 1000);
    });

    // 也在DOMContentLoaded时执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(enableCopyFeatures, 1000);
        });
    } else {
        // 如果DOM已经加载完成，直接执行
        setTimeout(enableCopyFeatures, 1000);
    }
})();