// ==UserScript==
// @name         微信公众号文章转Markdown
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  将微信公众号文章转换为Markdown格式并下载
// @author       BigShuaiBee
// @match        https://mp.weixin.qq.com/s/*
// @match        https://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/cgi-bin/readtemplate*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541710/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E8%BD%ACMarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/541710/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E8%BD%ACMarkdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 创建下载按钮
     */
    function createDownloadButton() {
        console.log('[微信转MD] 开始创建下载按钮');
        
        // 检查是否已经存在按钮
        if (document.getElementById('markdown-download-btn')) {
            console.log('[微信转MD] 按钮已存在，跳过创建');
            return;
        }

        const button = document.createElement('button');
        button.id = 'markdown-download-btn';
        button.innerHTML = '📄 下载为Markdown';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #07c160;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.background = '#06ad56';
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#07c160';
            button.style.transform = 'translateY(0)';
        });

        // 点击事件
        button.addEventListener('click', convertToMarkdown);

        // 添加到页面
        document.body.appendChild(button);
        console.log('[微信转MD] 下载按钮创建成功');
    }

    /**
     * 获取文章标题
     * @returns {string} 文章标题
     */
    function getArticleTitle() {
        const titleElement = document.querySelector('#activity-name, .rich_media_title, h1');
        return titleElement ? titleElement.textContent.trim() : '微信文章';
    }

    /**
     * 获取文章作者
     * @returns {string} 文章作者
     */
    function getArticleAuthor() {
        const authorElement = document.querySelector('#js_name, .rich_media_meta_text, .profile_nickname');
        return authorElement ? authorElement.textContent.trim() : '';
    }

    /**
     * 获取发布时间
     * @returns {string} 发布时间
     */
    function getPublishTime() {
        const timeElement = document.querySelector('#publish_time, .rich_media_meta_text');
        if (timeElement) {
            const timeText = timeElement.textContent.trim();
            // 匹配时间格式
            const timeMatch = timeText.match(/\d{4}-\d{2}-\d{2}|\d{4}年\d{1,2}月\d{1,2}日/);
            return timeMatch ? timeMatch[0] : '';
        }
        return '';
    }

    /**
     * 处理图片元素
     * @param {Element} img 图片元素
     * @returns {string} Markdown格式的图片
     */
    function processImage(img) {
        // 尝试多种属性获取图片URL
        const urlAttributes = ['data-src', 'data-original', 'data-lazy-src', 'data-url', 'src', 'data-original-src', 'data-actualsrc'];
        let imageUrl = '';
        let usedAttribute = '';
        
        for (const attr of urlAttributes) {
            const url = img.getAttribute(attr);
            if (url && url.trim() && !url.startsWith('data:image/svg') && !url.includes('loading')) {
                imageUrl = url.trim();
                usedAttribute = attr;
                break;
            }
        }
        
        // 如果还是没找到，尝试从父元素或相关元素中查找
        if (!imageUrl) {
            const parent = img.parentElement;
            if (parent) {
                // 检查父元素的背景图片
                const bgImage = window.getComputedStyle(parent).backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const match = bgImage.match(/url\(["']?([^"'\)]+)["']?\)/);
                    if (match && match[1]) {
                        imageUrl = match[1];
                        usedAttribute = 'background-image';
                    }
                }
                
                // 检查父元素的data属性
                if (!imageUrl) {
                    for (const attr of urlAttributes) {
                        const url = parent.getAttribute(attr);
                        if (url && url.trim() && !url.startsWith('data:image/svg')) {
                            imageUrl = url.trim();
                            usedAttribute = `parent.${attr}`;
                            break;
                        }
                    }
                }
            }
        }
        
        if (!imageUrl) {
            console.log('[微信转MD] 图片URL获取失败，图片属性:', {
                src: img.getAttribute('src'),
                'data-src': img.getAttribute('data-src'),
                'data-original': img.getAttribute('data-original'),
                'data-lazy-src': img.getAttribute('data-lazy-src'),
                'data-url': img.getAttribute('data-url'),
                className: img.className,
                parentClassName: img.parentElement?.className,
                outerHTML: img.outerHTML.substring(0, 300)
            });
            return '';
        }
        
        console.log(`[微信转MD] 找到图片URL: ${imageUrl} (来源: ${usedAttribute})`);
        
        const alt = img.getAttribute('alt') || img.getAttribute('title') || '图片';
        return `![${alt}](${imageUrl})\n\n`;
    }

    /**
     * 处理链接元素
     * @param {Element} link 链接元素
     * @returns {string} Markdown格式的链接
     */
    function processLink(link) {
        const href = link.href;
        const text = link.textContent.trim();
        return `[${text}](${href})`;
    }

    /**
     * 处理文本样式
     * @param {Element} element 元素
     * @returns {string} 处理后的文本
     */
    function processTextStyle(element) {
        let text = element.textContent.trim();
        
        // 处理加粗
        if (element.style.fontWeight === 'bold' || element.tagName === 'STRONG' || element.tagName === 'B') {
            text = `**${text}**`;
        }
        
        // 处理斜体
        if (element.style.fontStyle === 'italic' || element.tagName === 'EM' || element.tagName === 'I') {
            text = `*${text}*`;
        }
        
        // 处理删除线
        if (element.style.textDecoration === 'line-through' || element.tagName === 'DEL' || element.tagName === 'S') {
            text = `~~${text}~~`;
        }
        
        return text;
    }

    /**
     * 处理代码块内容，保留原始格式
     * @param {string} codeText 代码文本
     * @returns {string} 处理后的代码文本
     */
    function processCodeContent(codeText) {
        // 保留所有原始格式，只做最基本的换行符统一
        return codeText
            .replace(/\r\n/g, '\n')  // 统一换行符为LF
            .replace(/\r/g, '\n')   // 将CR转换为LF
            .replace(/\t/g, '    '); // 将制表符转换为4个空格，保持一致性
    }

    /**
     * 从代码元素中提取文本，特别处理微信公众号的换行符问题
     * @param {Element} element 代码元素
     * @returns {string} 提取的代码文本
     */
    function extractCodeText(element) {
        let codeText = '';
        let hasStructuredContent = false;
        
        // 递归遍历所有子节点，特别处理br标签和文本节点
        function traverseNode(node, depth = 0) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                // 直接添加文本内容，不做任何清理
                codeText += text;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                
                if (tagName === 'br') {
                    // br标签转换为换行符
                    codeText += '\n';
                    hasStructuredContent = true;
                } else if (tagName === 'div' || tagName === 'p') {
                    // div和p标签通常表示新行
                    if (codeText && !codeText.endsWith('\n')) {
                        codeText += '\n';
                    }
                    // 递归处理子节点
                    for (const child of node.childNodes) {
                        traverseNode(child, depth + 1);
                    }
                    // 在div/p结束后添加换行符
                    if (!codeText.endsWith('\n')) {
                        codeText += '\n';
                    }
                    hasStructuredContent = true;
                } else if (tagName === 'span') {
                    // span标签可能包含行内代码，检查是否有特殊样式
                    const style = node.style || {};
                    const className = node.className || '';
                    
                    // 如果span有特殊的代码样式，可能需要特殊处理
                    if (className.includes('line') || style.display === 'block') {
                        // 可能是代码行，在前后添加换行符
                        if (codeText && !codeText.endsWith('\n')) {
                            codeText += '\n';
                        }
                        for (const child of node.childNodes) {
                            traverseNode(child, depth + 1);
                        }
                        if (!codeText.endsWith('\n')) {
                            codeText += '\n';
                        }
                        hasStructuredContent = true;
                    } else {
                        // 普通span，递归处理子节点
                        for (const child of node.childNodes) {
                            traverseNode(child, depth + 1);
                        }
                    }
                } else {
                    // 其他标签，递归处理子节点
                    for (const child of node.childNodes) {
                        traverseNode(child, depth + 1);
                    }
                }
            }
        }
        
        // 开始遍历
        for (const child of element.childNodes) {
            traverseNode(child);
        }
        
        // 如果没有通过DOM遍历得到有意义的内容，回退到textContent
        if (!codeText.trim() || (!hasStructuredContent && codeText.indexOf('\n') === -1)) {
            const fallbackText = element.textContent || element.innerText || '';
            
            // 如果textContent也没有换行符，尝试通过innerHTML分析
            if (fallbackText.indexOf('\n') === -1) {
                const innerHTML = element.innerHTML;
                
                // 如果innerHTML包含br标签，手动替换
                if (innerHTML.includes('<br')) {
                    const processedHTML = innerHTML
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]+>/g, '') // 移除其他HTML标签
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&');
                    codeText = processedHTML;
                } else {
                    codeText = fallbackText;
                }
            } else {
                codeText = fallbackText;
            }
        }
        
        // 应用基本的代码内容处理
        return processCodeContent(codeText);
    }

    /**
     * 处理表格转换
     * @param {Element} table 表格元素
     * @returns {string} Markdown表格
     */
    function processTable(table) {
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) return '';
        
        let markdown = '\n';
        let isFirstRow = true;
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            if (cells.length === 0) return;
            
            // 构建表格行
            const cellContents = Array.from(cells).map(cell => {
                return cell.textContent.trim().replace(/\|/g, '\\|');
            });
            
            markdown += '| ' + cellContents.join(' | ') + ' |\n';
            
            // 如果是第一行（表头），添加分隔符
            if (isFirstRow) {
                const separator = Array.from(cells).map(() => '---').join(' | ');
                markdown += '| ' + separator + ' |\n';
                isFirstRow = false;
            }
        });
        
        return markdown;
    }

    /**
     * 转换HTML元素为Markdown
     * @param {Element} element HTML元素
     * @returns {string} Markdown文本
     */
    function htmlToMarkdown(element) {
        let markdown = '';
        
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent;
                // 检查父元素链是否包含代码相关的元素
                const isInCodeBlock = (function() {
                    let current = node.parentElement;
                    while (current) {
                        const tagName = current.tagName.toLowerCase();
                        const className = current.className || '';
                        
                        // 检查标签名
                        if (tagName === 'pre' || tagName === 'code') {
                            return true;
                        }
                        
                        // 检查类名
                        if (className.includes('code') || 
                            className.includes('highlight') || 
                            className.includes('prism') || 
                            className.includes('hljs') ||
                            className.includes('language-') ||
                            className.includes('lang-') ||
                            className.includes('prettyprint') ||
                            className.includes('syntax')) {
                            return true;
                        }
                        
                        // 检查data属性
                        if (current.hasAttribute('data-lang') || 
                            current.hasAttribute('data-language') ||
                            current.hasAttribute('data-code')) {
                            return true;
                        }
                        
                        current = current.parentElement;
                    }
                    return false;
                })();
                
                if (isInCodeBlock) {
                    // 在代码块中，保留所有空白字符和换行符
                    markdown += text;
                } else {
                    // 在普通文本中，保留必要的空白字符，但清理多余的空白
                    text = text.replace(/\s+/g, ' ');
                    // 如果文本前后有换行符，保留它们
                    if (node.textContent.startsWith('\n') || node.textContent.startsWith('\r')) {
                        text = '\n' + text.trim();
                    }
                    if (node.textContent.endsWith('\n') || node.textContent.endsWith('\r')) {
                        text = text.trim() + '\n';
                    }
                    markdown += text;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                
                switch (tagName) {
                    case 'h1':
                        markdown += `\n# ${htmlToMarkdown(node).trim()}\n\n`;
                        break;
                    case 'h2':
                        markdown += `\n## ${htmlToMarkdown(node).trim()}\n\n`;
                        break;
                    case 'h3':
                        markdown += `\n### ${htmlToMarkdown(node).trim()}\n\n`;
                        break;
                    case 'h4':
                        markdown += `\n#### ${htmlToMarkdown(node).trim()}\n\n`;
                        break;
                    case 'h5':
                        markdown += `\n##### ${htmlToMarkdown(node).trim()}\n\n`;
                        break;
                    case 'h6':
                        markdown += `\n###### ${htmlToMarkdown(node).trim()}\n\n`;
                        break;
                    case 'p':
                        const pContent = htmlToMarkdown(node).trim();
                        if (pContent) {
                            markdown += `\n\n${pContent}\n\n`;
                        }
                        break;
                    case 'br':
                        markdown += '  \n'; // 使用两个空格+换行符来强制换行
                        break;
                    case 'img':
                        markdown += processImage(node) + '\n\n';
                        break;
                    case 'a':
                        // 检查链接前是否需要换行
                        const linkText = processLink(node);
                        // 如果前面不是空白字符，添加空格分隔
                        if (markdown && !markdown.endsWith(' ') && !markdown.endsWith('\n')) {
                            markdown += ' ';
                        }
                        markdown += linkText;
                        break;
                    case 'strong':
                    case 'b':
                        markdown += `**${htmlToMarkdown(node).trim()}**`;
                        break;
                    case 'em':
                    case 'i':
                        markdown += `*${htmlToMarkdown(node).trim()}*`;
                        break;
                    case 'code':
                        // 对于行内代码，保留内部空格但移除首尾空白
                        const inlineCode = node.textContent.replace(/^\s+|\s+$/g, '');
                        markdown += `\`${inlineCode}\``;
                        break;
                    case 'pre':
                        // 检查是否包含code标签
                        const codeElement = node.querySelector('code');
                        if (codeElement) {
                            // 尝试获取语言类型
                            const className = codeElement.className || '';
                            const langMatch = className.match(/language-(\w+)/);
                            const lang = langMatch ? langMatch[1] : '';
                            // 获取代码内容，特别处理换行符
                            const codeText = extractCodeText(codeElement);
                            markdown += `\n\`\`\`${lang}\n${codeText}\n\`\`\`\n\n`;
                        } else {
                            // 获取代码内容，特别处理换行符
                            const codeText = extractCodeText(node);
                            markdown += `\n\`\`\`\n${codeText}\n\`\`\`\n\n`;
                        }
                        break;
                    case 'table':
                        markdown += processTable(node) + '\n\n';
                        break;
                    case 'thead':
                    case 'tbody':
                    case 'tr':
                    case 'th':
                    case 'td':
                        // 在processTable中处理
                        break;
                    case 'blockquote':
                        const quoteContent = htmlToMarkdown(node);
                        markdown += `\n> ${quoteContent.trim().replace(/\n/g, '\n> ')}\n\n`;
                        break;
                    case 'ul':
                    case 'ol':
                        markdown += '\n';
                        const listItems = node.querySelectorAll('li');
                        listItems.forEach((li, index) => {
                            const prefix = tagName === 'ul' ? '- ' : `${index + 1}. `;
                            markdown += `${prefix}${htmlToMarkdown(li).trim()}\n`;
                        });
                        markdown += '\n';
                        break;
                    case 'li':
                        // 在上面的ul/ol中处理
                        break;
                    case 'hr':
                        markdown += '\n---\n\n';
                        break;
                    case 'del':
                    case 's':
                        markdown += `~~${htmlToMarkdown(node).trim()}~~`;
                        break;
                    case 'mark':
                        markdown += `==${htmlToMarkdown(node).trim()}==`;
                        break;
                    case 'sub':
                        markdown += `~${htmlToMarkdown(node).trim()}~`;
                        break;
                    case 'sup':
                        markdown += `^${htmlToMarkdown(node).trim()}^`;
                        break;
                    case 'div':
                    case 'span':
                    case 'section':
                        // 检查是否有特殊样式或类名
                        const className = node.className || '';
                        const style = node.style || {};
                        
                        // 处理代码块容器
                        if (className.includes('code') || className.includes('highlight') || 
                            className.includes('prism') || className.includes('hljs')) {
                            // 使用专门的函数处理代码内容，保留格式
                            const codeContent = extractCodeText(node);
                            if (codeContent.trim()) {
                                // 尝试从类名中提取语言信息
                                const langMatch = className.match(/(?:language|lang|hljs)-(\w+)/);
                                const lang = langMatch ? langMatch[1] : '';
                                markdown += `\n\`\`\`${lang}\n${codeContent}\n\`\`\`\n\n`;
                            }
                        }
                        // 处理引用框 - 更严格的判断条件，只有明确的引用样式才处理
                        else if (className.includes('blockquote') || 
                                (className.includes('quote') && 
                                 (className.includes('block') || className.includes('box'))) ||
                                (style.borderLeft && style.borderLeft.includes('solid') && 
                                 style.borderLeftWidth && parseInt(style.borderLeftWidth) >= 3)) {
                            const quoteContent = htmlToMarkdown(node);
                            if (quoteContent.trim()) {
                                markdown += `\n> ${quoteContent.trim().replace(/\n/g, '\n> ')}\n\n`;
                            }
                        }
                        // 检查是否包含图片
                        else {
                            const images = node.querySelectorAll('img');
                            if (images.length > 0) {
                                // 如果是纯图片容器（只包含一个img元素或主要是图片内容）
                                const textContent = node.textContent.trim();
                                if ((node.children.length === 1 && node.children[0].tagName === 'IMG') ||
                                    (images.length > 0 && textContent.length < 50)) {
                                    // 直接处理图片，避免重复
                                    images.forEach(img => {
                                        const imageMarkdown = processImage(img);
                                        if (imageMarkdown) {
                                            markdown += imageMarkdown;
                                        }
                                    });
                                } else {
                                    // 包含图片的混合内容，递归处理所有子元素
                                    markdown += htmlToMarkdown(node);
                                }
                            } else {
                                // 不包含图片，正常递归处理子元素
                                markdown += htmlToMarkdown(node);
                            }
                        }
                        break;
                    default:
                        // 对于其他标签，递归处理内容
                        markdown += htmlToMarkdown(node);
                        break;
                }
            }
        }
        
        return markdown;
    }

    /**
     * 清理和格式化Markdown文本
     * @param {string} markdown 原始Markdown文本
     * @returns {string} 清理后的Markdown文本
     */
    function cleanMarkdown(markdown) {
        // 先分离代码块和行内代码，避免清理时影响代码内容
        const codeBlocks = [];
        const inlineCodes = [];
        let codeBlockIndex = 0;
        let inlineCodeIndex = 0;
        
        // 提取代码块并用占位符替换
        let processedMarkdown = markdown.replace(/```[\s\S]*?```/g, (match) => {
            const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`;
            codeBlocks[codeBlockIndex] = match;
            codeBlockIndex++;
            return placeholder;
        });
        
        // 提取行内代码并用占位符替换
        processedMarkdown = processedMarkdown.replace(/`[^`\n]+`/g, (match) => {
            const placeholder = `__INLINE_CODE_${inlineCodeIndex}__`;
            inlineCodes[inlineCodeIndex] = match;
            inlineCodeIndex++;
            return placeholder;
        });
        
        // 对非代码内容进行清理
        processedMarkdown = processedMarkdown
            // 移除多余的空行（超过2个连续换行符）
            .replace(/\n{3,}/g, '\n\n')
            // 移除行首行尾的空格，但保留强制换行的两个空格
            .replace(/^[ \t]+|(?<!  )[ \t]+$/gm, '')
            // 清理多余的空格
            .replace(/ {3,}/g, ' ')
            // 移除重复的图片链接（连续出现的相同图片链接）
            .replace(/(![\[^\]]*\]\([^)]+\))\s*\n\s*\1/g, '$1')
            // 移除空白的图片链接
            .replace(/!\[\]\(\s*\)/g, '')
            .replace(/![\[^\]]*\]\(\s*\)/g, '')
            // 修复段落间距
            .replace(/\n\n\n+/g, '\n\n')
            // 确保标题前后有适当的空行
            .replace(/(\n|^)(#{1,6} .+)\n(?!\n)/g, '$1$2\n\n')
            // 移除文档开头的空行
            .replace(/^\n+/g, '')
            // 优化文档结尾：移除多余空行，确保以双换行符结尾（标准Markdown格式）
            .replace(/\n+$/g, '');
        
        // 恢复行内代码
        for (let i = 0; i < inlineCodes.length; i++) {
            processedMarkdown = processedMarkdown.replace(`__INLINE_CODE_${i}__`, inlineCodes[i]);
        }
        
        // 恢复代码块
        for (let i = 0; i < codeBlocks.length; i++) {
            processedMarkdown = processedMarkdown.replace(`__CODE_BLOCK_${i}__`, codeBlocks[i]);
        }
        
        return processedMarkdown + '\n\n';
    }

    /**
     * 展开所有折叠的内容
     * @param {Element} container 容器元素
     */
    function expandHiddenContent(container) {
        console.log('[微信转MD] 开始展开隐藏内容');
        
        // 查找并点击所有可能的展开按钮
        const expandButtons = container.querySelectorAll(
            '[data-action="expand"], .expand-btn, .show-more, .unfold, ' +
            '[onclick*="expand"], [onclick*="show"], [onclick*="unfold"], ' +
            'button[class*="expand"], button[class*="more"], ' +
            'a[class*="expand"], a[class*="more"], ' +
            '.js_unfold, .js_show_more, .js_expand'
        );
        
        console.log('[微信转MD] 找到展开按钮数量:', expandButtons.length);
        
        expandButtons.forEach((btn, index) => {
            try {
                console.log(`[微信转MD] 点击展开按钮 ${index + 1}:`, btn.className, btn.textContent.trim());
                btn.click();
            } catch (e) {
                console.log(`[微信转MD] 点击按钮 ${index + 1} 失败:`, e.message);
            }
        });
        
        // 查找并展开所有隐藏的div
        const hiddenElements = container.querySelectorAll(
            '[style*="display: none"], [style*="display:none"], ' +
            '.hidden, .collapse, .fold, .js_fold, ' +
            '[data-fold="true"], [data-hidden="true"]'
        );
        
        console.log('[微信转MD] 找到隐藏元素数量:', hiddenElements.length);
        
        hiddenElements.forEach((el, index) => {
            try {
                console.log(`[微信转MD] 展开隐藏元素 ${index + 1}:`, el.className);
                el.style.display = 'block';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.height = 'auto';
                el.style.maxHeight = 'none';
                
                // 移除隐藏相关的类名
                el.classList.remove('hidden', 'collapse', 'fold', 'js_fold');
                el.removeAttribute('data-fold');
                el.removeAttribute('data-hidden');
            } catch (e) {
                console.log(`[微信转MD] 展开元素 ${index + 1} 失败:`, e.message);
            }
        });
        
        // 特别处理图片相关的折叠内容
        const imageContainers = container.querySelectorAll('.img_loading, .img-box, .image-container, [data-src]');
        imageContainers.forEach((imgContainer, index) => {
            try {
                // 查找图片容器内的隐藏内容
                const hiddenInImg = imgContainer.querySelectorAll('[style*="display: none"], .hidden');
                hiddenInImg.forEach(hidden => {
                    hidden.style.display = 'block';
                    hidden.style.visibility = 'visible';
                });
                
                // 触发图片容器的点击事件
                if (imgContainer.onclick || imgContainer.getAttribute('onclick')) {
                    console.log(`[微信转MD] 触发图片容器 ${index + 1} 点击事件`);
                    imgContainer.click();
                }
            } catch (e) {
                console.log(`[微信转MD] 处理图片容器 ${index + 1} 失败:`, e.message);
            }
        });
        
        console.log('[微信转MD] 隐藏内容展开完成');
    }

    /**
     * 转换文章为Markdown格式
     */
    async function convertToMarkdown() {
        console.log('[微信转MD] 开始转换文章');
        try {
            // 获取文章信息
            const title = getArticleTitle();
            const author = getArticleAuthor();
            const publishTime = getPublishTime();
            
            console.log('[微信转MD] 文章信息:', { title, author, publishTime });
            
            // 获取文章内容 - 尝试多种选择器
            const selectors = [
                '#js_content',
                '.rich_media_content',
                '.article-content',
                '[data-role="content"]',
                '.rich_media_area_primary',
                '.rich_media_area_primary_inner',
                '.rich_media_wrp',
                '#page-content',
                '.page-content',
                '.content',
                '.post-content',
                '.article-body',
                '.entry-content',
                'main',
                '[role="main"]'
            ];
            
            let contentElement = null;
            let usedSelector = '';
            
            // 尝试所有预定义的选择器
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim().length > 100) {
                    contentElement = element;
                    usedSelector = selector;
                    console.log(`[微信转MD] 使用选择器 "${selector}" 找到内容，长度: ${element.textContent.length}`);
                    break;
                }
            }
            
            // 如果还没找到，尝试查找包含文章内容的最大容器
            if (!contentElement) {
                console.log('[微信转MD] 预定义选择器都未找到内容，尝试智能查找...');
                const candidates = document.querySelectorAll('div, section, article, main');
                let bestCandidate = null;
                let maxLength = 0;
                
                for (const candidate of candidates) {
                    const textLength = candidate.textContent.trim().length;
                    if (textLength > 500 && textLength > maxLength) {
                        // 排除一些明显不是文章内容的元素
                        const className = candidate.className || '';
                        const id = candidate.id || '';
                        if (!className.includes('nav') && !className.includes('header') && 
                            !className.includes('footer') && !className.includes('sidebar') &&
                            !id.includes('nav') && !id.includes('header') && !id.includes('footer')) {
                            bestCandidate = candidate;
                            maxLength = textLength;
                        }
                    }
                }
                
                if (bestCandidate) {
                    contentElement = bestCandidate;
                    usedSelector = `智能查找: ${bestCandidate.tagName}.${bestCandidate.className || 'no-class'}`;
                    console.log(`[微信转MD] 智能查找找到内容容器，长度: ${maxLength}`);
                }
            }
            
            // 如果仍然没找到，显示页面结构信息帮助调试
            if (!contentElement) {
                console.log('[微信转MD] 未找到文章内容，分析页面结构...');
                const allDivs = document.querySelectorAll('div');
                console.log(`[微信转MD] 页面共有 ${allDivs.length} 个div元素`);
                
                // 显示文本长度最大的前5个元素
                const elementsWithText = Array.from(document.querySelectorAll('*'))
                    .filter(el => el.textContent.trim().length > 50)
                    .sort((a, b) => b.textContent.length - a.textContent.length)
                    .slice(0, 5);
                    
                console.log('[微信转MD] 文本内容最多的前5个元素:');
                elementsWithText.forEach((el, index) => {
                    console.log(`${index + 1}. ${el.tagName}.${el.className || 'no-class'} (${el.textContent.length}字符)`);
                });
                
                // 检查是否在验证页面
                const pageText = document.body.textContent;
                if (pageText.includes('环境异常') || pageText.includes('验证') || pageText.includes('安全验证')) {
                    console.log('[微信转MD] 检测到验证页面，请先完成人工验证');
                    alert('检测到微信安全验证页面，请先完成人工验证后再使用脚本。');
                    return;
                }
            }
            
            if (!contentElement) {
                console.log('[微信转MD] 未找到文章内容');
                alert('未找到文章内容，请确保在微信公众号文章页面使用此脚本。');
                return;
            }
            
            console.log('[微信转MD] 使用的内容选择器:', usedSelector);
            console.log('[微信转MD] 内容元素:', contentElement.tagName, contentElement.className || 'no-class');
            console.log('[微信转MD] 内容长度:', contentElement.textContent.length);
            
            // 检查内容质量
            const contentText = contentElement.textContent.trim();
            const hasImages = contentElement.querySelectorAll('img').length;
            const hasParagraphs = contentElement.querySelectorAll('p').length;
            const hasHeadings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
            
            console.log('[微信转MD] 内容质量分析:', {
                textLength: contentText.length,
                imageCount: hasImages,
                paragraphCount: hasParagraphs,
                headingCount: hasHeadings,
                preview: contentText.substring(0, 200) + (contentText.length > 200 ? '...' : '')
            });
            
            // 展开所有隐藏的内容
            expandHiddenContent(contentElement);
            
            // 等待一下让展开操作完成
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('[微信转MD] 展开后内容长度:', contentElement.textContent.length);
            
            // 预处理图片元素
            const allImages = contentElement.querySelectorAll('img');
            console.log('[微信转MD] 找到图片数量:', allImages.length);
            
            // 分析图片属性
            allImages.forEach((img, index) => {
                const attributes = {};
                for (let attr of img.attributes) {
                    attributes[attr.name] = attr.value;
                }
                console.log(`[微信转MD] 图片 ${index + 1} 属性:`, attributes);
            });
            
            console.log('[微信转MD] 找到文章内容，开始转换');
            
            // 分析文章内容结构
            const allElements = contentElement.querySelectorAll('*');
            const elementTypes = new Set();
            allElements.forEach(el => elementTypes.add(el.tagName.toLowerCase()));
            console.log('[微信转MD] 文章包含的HTML元素类型:', Array.from(elementTypes).sort());
            
            // 特别检查代码相关元素
            const codeElements = contentElement.querySelectorAll('pre, code, .code, .highlight, .hljs, .prism');
            console.log('[微信转MD] 找到代码相关元素数量:', codeElements.length);
            if (codeElements.length > 0) {
                codeElements.forEach((el, index) => {
                    console.log(`[微信转MD] 代码元素 ${index + 1}:`, {
                        tagName: el.tagName,
                        className: el.className,
                        textLength: el.textContent.length,
                        preview: el.textContent.substring(0, 100) + (el.textContent.length > 100 ? '...' : '')
                    });
                });
            }
            
            // 检查表格元素
            const tableElements = contentElement.querySelectorAll('table');
            console.log('[微信转MD] 找到表格数量:', tableElements.length);
            
            // 转换内容为Markdown
            let markdown = '';
            
            // 添加文章头部信息
            markdown += `# ${title}\n\n`;
            if (author) {
                markdown += `**作者：** ${author}\n\n`;
            }
            if (publishTime) {
                markdown += `**发布时间：** ${publishTime}\n\n`;
            }
            markdown += '---\n\n';
            
            // 转换文章内容
            const contentMarkdown = htmlToMarkdown(contentElement);
            markdown += contentMarkdown;
            
            // 清理格式
            markdown = cleanMarkdown(markdown);
            
            console.log('[微信转MD] 转换完成，准备下载');
            
            // 创建下载
            downloadMarkdown(markdown, title);
            
        } catch (error) {
            console.error('[微信转MD] 转换过程中出现错误:', error);
            alert('转换失败，请查看控制台了解详细错误信息。');
        }
    }

    /**
     * 下载Markdown文件
     * @param {string} content Markdown内容
     * @param {string} filename 文件名
     */
    function downloadMarkdown(content, filename) {
        // 清理文件名中的非法字符
        const cleanFilename = filename.replace(/[<>:"/\\|?*]/g, '_');
        
        // 创建Blob对象
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cleanFilename}.md`;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 释放URL对象
        URL.revokeObjectURL(url);
        
        // 显示成功消息
        showSuccessMessage(`文章已成功转换并下载为：${cleanFilename}.md`);
    }

    /**
     * 显示成功消息
     * @param {string} message 消息内容
     */
    function showSuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(messageDiv);
        
        // 3秒后自动移除消息
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    /**
     * 初始化脚本
     */
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createDownloadButton);
        } else {
            createDownloadButton();
        }
    }

    // 启动脚本
    init();

})();