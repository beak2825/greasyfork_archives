// ==UserScript==
// @name         Webpage to Markdown
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Advanced webpage to Markdown converter with intelligent content extraction, image handling, and code block formatting.
// @author       Feiyt
// @homepageURL  https://github.com/Feiyt
// @license      MIT
// @match        *://*/*
// @require      https://unpkg.com/turndown/dist/turndown.js
// @require      https://unpkg.com/turndown-plugin-gfm@1.0.2/dist/turndown-plugin-gfm.js
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532670/Webpage%20to%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/532670/Webpage%20to%20Markdown.meta.js
// ==/UserScript==

// Copyright (c) 2025 Feiyt
// Released under the MIT license
// https://github.com/Feiyt (or specify the exact repo if available)

(function() {
    'use strict';
    console.log("Enhanced Webpage to Markdown script starting..."); // Version updated

    // --- Configuration ---
    const turndownOptions = {
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '*',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        strongDelimiter: '**',
        linkStyle: 'inlined',
        linkReferenceStyle: 'full',
        preformattedCode: false,
        blankReplacement: function(content, node) {
            return node.isBlock ? '\n\n' : '';
        },
        keepReplacement: function(content, node) {
            return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML;
        },
        defaultReplacement: function(content, node) {
            return node.isBlock ? '\n\n' + content + '\n\n' : content;
        }
    };


    // --- Helper Functions ---
    function sanitizeFilename(name) { /* ... function from previous version ... */ } // Placeholder comment
    // Sanitizes a string to be used as a filename.
    sanitizeFilename = function(name) {
        // Replace forbidden characters with underscore, collapse whitespace, trim, provide default.
        return name.replace(/[\/\\:*?"<>|#%\n\r]/g, '_').replace(/\s+/g, ' ').trim() || "markdown_export";
    };


    /**
     * Improved content selection and cleaning.
     * Prioritizes semantic tags and common content IDs/classes.
     * @returns {object|null} Object containing { title: string, contentNode: Node } or null on failure.
     */
    function getPageContentNode() {
        console.log("getPageContentNode: Starting content retrieval...");
        
        // 1. 获取页面标题
        let pageTitle = document.title;
        // 尝试从常见标题元素获取更准确的标题
        const potentialTitles = [
            document.querySelector('h1.entry-title'),
            document.querySelector('h1.post-title'),
            document.querySelector('h1.article-title'),
            document.querySelector('.article-title'),
            document.querySelector('h1')
        ];
        
        for (const t of potentialTitles) {
            if (t && t.textContent && t.textContent.trim().length > 5) {
                pageTitle = t.textContent.trim();
                break;
            }
        }
        pageTitle = pageTitle || window.location.hostname;

        let bestCandidate = null;
        let maxScore = -1;

        // 辅助函数：计算元素分数
        function calculateScore(element) {
            let score = 0;
            
            // 基础标签分
            const tagName = element.tagName.toLowerCase();
            if (['article', 'main'].includes(tagName)) score += 20;
            if (['div', 'section'].includes(tagName)) score += 5;
            
            // 类名和ID加减分
            const classAndId = (element.className + " " + element.id).toLowerCase();
            
            // 加分关键词
            if (/(article|body|content|entry|hentry|main|page|pagination|post|text|blog|story)/.test(classAndId)) score += 25;
            if (/(markdown|wiki|documentation|readme)/.test(classAndId)) score += 30;
            
            // 减分关键词
            if (/(copyright|combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-|agegate|pagination|pager|popup|tweet|twitter)/.test(classAndId)) score -= 50;
            
            // 内容质量评估
            const textContent = element.textContent.trim();
            const textLength = textContent.length;
            
            if (textLength < 20) return -9999; // 忽略太短的内容
            
            // 文本密度算分 (对数增长)
            score += Math.min(Math.log(textLength) * 10, 100);
            
            // 子元素统计
            const childCount = element.childElementCount;
            const paragraphCount = element.querySelectorAll('p').length;
            const linkCount = element.querySelectorAll('a').length;
            const headingsCount = element.querySelectorAll('h1, h2, h3, h4, h5, h6').length;
            
            score += paragraphCount * 3; // 段落多通常是正文
            score += headingsCount * 5; // 有标题结构加分
            
            // 链接密度惩罚
            const linkTextLength = Array.from(element.querySelectorAll('a')).reduce((acc, a) => acc + a.textContent.length, 0);
            const linkDensity = linkTextLength / Math.max(textLength, 1);
            
            if (linkDensity > 0.5) score -= 50; // 链接内容占比过高可能是导航
            if (linkDensity > 0.8) score -= 100;
            
            return score;
        }

        // More robust selectors with priorities implied by order
        const selectors = [
             // Highest Priority: Semantic & Specific Roles/IDs/Classes
            'article', '[role="article"]', '.article-body', '.post-content', '.entry-content', '#article-content', '.post-body', '.markdown-body',
            // High Priority: Main content areas
            'main', '[role="main"]', '#main-content', '#main', '.main-content', '.main', '#primary',
            // Specific Platforms
            '.notion-page-content', '.zhihu-content', '.daily-content.body', '#js_content',
            // Medium Priority: Common generic containers
            '#content', '.content',
            // News & Blogs
            '.news-article', '.story-body', '.blog-post',
            // Fallbacks
            'body'
        ];
        
        // 尝试查找最佳候选
        // 首先尝试常用的高优先级选择器
        let candidates = document.querySelectorAll(selectors.join(','));
        // 如果候选太少，尝试宽泛搜索
        if (candidates.length < 1) {
            candidates = document.querySelectorAll('div, section, article, main');
        }

        candidates.forEach(element => {
            // 排除明显的非内容元素
            if (['header', 'footer', 'nav', 'aside'].includes(element.tagName.toLowerCase())) return;
            // 排除隐藏元素
            if (element.offsetParent === null) return;

            const score = calculateScore(element);
            // console.log(`Candidate: <${element.tagName} class="${element.className}" id="${element.id}"> score: ${score}`);
            
            if (score > maxScore) {
                maxScore = score;
                bestCandidate = element;
            }
        });

        if (!bestCandidate) {
             console.warn("No suitable candidate found. Fallback to body.");
             bestCandidate = document.body;
        }
        
        console.log(`Selected final container: <${bestCandidate.tagName.toLowerCase()} class="${bestCandidate.className}" id="${bestCandidate.id}"> with score ${maxScore}`);

        // --- Clone and Clean ---
        try {
            console.log("Cloning selected container...");
            const clone = bestCandidate.cloneNode(true);

            // Define selectors for elements to exclude from the conversion.
            const excludeSelectors = [
                // 页面结构元素
                'header', 'footer', 'nav', '.header', '.footer', '.navbar', '.menu', '.toc', '#toc', 
                '.breadcrumb', '#breadcrumb', '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
                'aside', '.sidebar', '#sidebar', '.widget-area', '#secondary', '.left-column', '.right-column',
                '[role="complementary"]',
                
                // 交互和操作元素
                '.actions', '.share', '.social', '.buttons', '.post-meta', '.entry-meta', 
                '.feedback', '.related-posts', '.like-button-container', '.feedback-container',
                '.edit-link', '.print-link', '[role="search"]', '.search', '.search-form',
                '.login', '.register', '.signup', '.signin', '.auth-form',
                
                // 评论系统
                '#comments', '.comments', '.comment-section', '#respond', '.disqus',
                '.livefyre', '.facebook-comments', '.giscus', '.utterances',
                
                // 广告和推广
                '.ad', '.ads', '.advertisement', '.adsbygoogle', '[id*="ad-"]', '[class*="ad-"]', 
                '[class*="advert"]', '.sponsored', '.promoted', '.promo', '.banner-ad',
                '.google-ad', '.adsense', '.doubleclick', '.outbrain', '.taboola',
                
                // 弹窗和模态框
                '.popup', '.modal', '.overlay', '.lightbox', '.dialog', '.tooltip',
                '.cookie-banner', '.cookie-consent', '.tracking-consent', '.gdpr-notice',
                '.newsletter-popup', '.subscription-modal', '.survey', '.feedback-form',
                
                // 技术元素
                'script', 'style', 'noscript', 'template', 'link[rel="stylesheet"]', 'meta', 
                'input[type="hidden"]', '.visually-hidden', '.sr-only', '[aria-hidden="true"]',
                '.hidden', '.invisible', '.offscreen', 'iframe[src*="ads"]', 'iframe[src*="tracking"]',
                
                // 相关和推荐内容
                '.related-articles', '#related-articles', '.related_posts', '.related-content',
                '.recommended', '.suggestions', '.more-stories', '.you-might-like',
                '.trending', '.popular', '.most-read', '.external-links',
                
                // 导航和分页
                '.pagination', '.pager', '.page-nav', '.next-prev', '.post-navigation',
                '.tag-list', '.category-list', '.archive-list', '.recent-posts',
                
                // 表单元素
                'form:not(.content form)', '.form', '.newsletter', '.subscription',
                '.contact-form', '.feedback-form', 'input', 'textarea', 'select', 'button:not(.content button)',
                
                // 特定平台噪音
                '.csdn-side-toolbar', '.tool-box', '.reward-user', '.p-ext'
            ];

            // 批量移除干扰元素
            excludeSelectors.forEach(selector => {
                const elements = clone.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });

            // 移除空元素
            const allElements = clone.querySelectorAll('*');
            allElements.forEach(el => {
                const hasMedia = el.querySelector('img, video, iframe, svg, canvas');
                if (!hasMedia && el.textContent.trim() === '') {
                    el.remove();
                }
            });

            // 将相对链接转为绝对链接 (处理 clone 中的 a 标签)
            const links = clone.querySelectorAll('a');
            links.forEach(a => {
                if(a.href && !a.href.startsWith('javascript:') && !a.href.startsWith('#')) {
                   a.href = a.href; 
                }
            });
            // 处理图片的 src (全面增强版)
            const images = clone.querySelectorAll('img');
            images.forEach(img => {
                // 1. 搜集所有可能的懒加载属性
                const dataset = img.dataset;
                const potentialSrcs = [
                    img.getAttribute('data-src'),
                    img.getAttribute('data-original'),
                    img.getAttribute('data-origin'),
                    img.getAttribute('data-actualsrc'),
                    img.getAttribute('data-lazy-src'),
                    img.getAttribute('data-url'),
                    img.getAttribute('data-image'),
                    dataset.src,
                    dataset.original,
                    dataset.origin,
                    dataset.actualsrc,
                    dataset.lazySrc,
                    dataset.url
                ];

                // 找到第一个有效的非空 value
                let realSrc = potentialSrcs.find(s => s && s.trim().length > 0 && !s.startsWith('data:'));

                // 2. 如果没有找到 data 属性，尝试解析 srcset
                if (!realSrc && img.getAttribute('srcset')) {
                    const srcset = img.getAttribute('srcset');
                    // 简单的 Heuristic: 取逗号分隔的最后一部分（通常是最大图），然后取 URL 部分
                    const sources = srcset.split(',');
                    if (sources.length > 0) {
                        const lastSource = sources[sources.length - 1].trim();
                        // srcset 格式: "url 1x" 或 "url 200w"
                        realSrc = lastSource.split(/\s+/)[0];
                    }
                }

                // 3. 如果找到了更真实的路径，强制更新到 src 属性
                if (realSrc) {
                    img.src = realSrc;
                    img.setAttribute('src', realSrc); // 确保 attribute 也更新，供 Turndown 读取
                }

                // 4. 绝对路径转换 (处理相对路径)
                // clone 节点的 .src 属性getter通常会返回绝对路径，但为了保险，手动处理 attribute
                let currentAttrSrc = img.getAttribute('src');
                if (currentAttrSrc && !currentAttrSrc.startsWith('http') && !currentAttrSrc.startsWith('//') && !currentAttrSrc.startsWith('data:')) {
                    try {
                        const absoluteSrc = new URL(currentAttrSrc, window.location.href).href;
                        img.src = absoluteSrc;
                        img.setAttribute('src', absoluteSrc);
                    } catch(e) {
                         // ignore invalid urls
                    }
                }
                
                // 5. 再次检查，如果还是相对协议 //开头，补全协议
                if (img.getAttribute('src') && img.getAttribute('src').startsWith('//')) {
                     img.src = window.location.protocol + img.getAttribute('src');
                     img.setAttribute('src', img.src);
                }
            });

            // 额外处理：Picture 标签
            // 如果 img 被包裹在 picture 中，Turndown 可能处理不好 source，我们需要把 source 的 srcset 赋给 img
            const pictures = clone.querySelectorAll('picture');
            pictures.forEach(pic => {
                const img = pic.querySelector('img');
                const source = pic.querySelector('source');
                if (img && source && source.srcset) {
                     // 同样取 srcset 的最佳候选
                     const sources = source.srcset.split(',');
                     const lastSource = sources[sources.length - 1].trim().split(/\s+/)[0];
                     if (lastSource) {
                         img.src = lastSource;
                         img.setAttribute('src', lastSource);
                     }
                }
            });

            // --- 智能尾部截断 (Smart Truncation) ---
            // 很多页面在正文结束后会有"推荐阅读"、"相关文章"等区域，这些往往在容器内部但不是正文
            // 我们尝试识别这些分割点，并移除其后的所有内容
            const endMarkers = [
                '推荐阅读', '相关推荐', '相关文章', '猜你喜欢', '原文链接', 
                '更多精彩', '文章目录', 'Next Article', 'Previous Article'
            ];
            
            // 遍历一级子元素寻找截断点
            let cutoffFound = false;
            const children = Array.from(clone.children);
            
            for (const child of children) {
                if (cutoffFound) {
                    child.remove();
                    continue;
                }
                
                // 检查是否是分割线或特定标题
                const text = child.textContent.trim();
                const isHeading = /^h[1-6]$/i.test(child.tagName) || child.classList.contains('title') || child.classList.contains('header');
                
                // 1. 明确的分割线后跟"推荐"字样
                if (child.tagName === 'HR') {
                    const next = child.nextElementSibling;
                    if (next && endMarkers.some(m => next.textContent.includes(m))) {
                        child.remove(); // 移除HR
                        cutoffFound = true; // 标记后续全部移除
                        continue;
                    }
                }
                
                // 2. 包含特定关键词的标题
                if (isHeading && endMarkers.some(m => text === m || (text.length < 10 && text.includes(m)))) {
                    console.log(`Smart truncation triggered by marker: "${text}"`);
                    child.remove();
                    cutoffFound = true;
                }
                
                // 3. 特定的结束类名结构
                if (child.matches('.related, .recommend, .comments, .share-block, .article-footer')) {
                     console.log(`Smart truncation triggered by class: "${child.className}"`);
                     child.remove();
                     cutoffFound = true;
                }
            }

            return { title: pageTitle, contentNode: clone };


        } catch (error) {
            console.error("Critical error during cloning or cleaning:", error.message, error.stack);
            return null;
        }
    }

    /**
     * 后处理Markdown内容，清理和优化格式
     * @param {string} markdown - 原始markdown内容
     * @returns {string} 优化后的markdown内容
     */
    function postProcessMarkdown(markdown) {
        console.log("Post-processing Markdown content...");
        
        if (!markdown || typeof markdown !== 'string') {
            console.warn("Invalid markdown content for post-processing");
            return markdown || '';
        }
        
        let processed = markdown;
        
        // 1. 清理多余的空行（超过2个连续空行压缩为2个）
        processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // 2. 修复列表格式
        processed = processed.replace(/\n(\s*[\*\-\+])/g, '\n\n$1');
        processed = processed.replace(/(\n\s*[\*\-\+].*)\n([^\n\s\*\-\+])/g, '$1\n\n$2');
        
        // 3. 修复标题前后的空行
        processed = processed.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
        processed = processed.replace(/(#{1,6}.*)\n([^\n#\s])/g, '$1\n\n$2');
        
        // 4. 清理链接中的多余空格
        processed = processed.replace(/\[\s+([^\]]*?)\s+\]/g, '[$1]');
        processed = processed.replace(/\(\s+([^\)]*?)\s+\)/g, '($1)');
        
        // 5. 修复代码块格式
        processed = processed.replace(/([^\n])\n```/g, '$1\n\n```');
        processed = processed.replace(/```\n([^\n])/g, '```\n\n$1');
        
        // 6. 清理引用块格式
        processed = processed.replace(/([^\n])\n>/g, '$1\n\n>');
        processed = processed.replace(/>\s*\n\n>/g, '>\n>');
        
        // 7. (已移除) 移除孤立的HTML标签残留 
        // 这一步过于激进，会破坏 <details> 折叠块和未被 Turndown 转换的合法 HTML 元素
        // processed = processed.replace(/<\/?[^>]+(>|$)/g, '');
        
        // 8. 清理开头和结尾的多余空行
        processed = processed.trim();
        
        // 9. 确保文档以单个换行符结尾
        if (processed && !processed.endsWith('\n')) {
            processed += '\n';
        }
        
        console.log("Markdown post-processing completed");
        return processed;
    }

    // --- Main Conversion and Download Logic ---
    function convertAndDownload() {
        console.log("Convert to Markdown: Button clicked..."); // Version updated
        try {
            // --- Initialize Turndown, Apply GFM, Add Math Rule ---
             console.log("Initializing TurndownService...");
             if (typeof TurndownService === 'undefined') { throw new Error('TurndownService is not defined.'); }
             const turndownService = new TurndownService(turndownOptions);

             console.log("Applying GFM plugin...");
             if (typeof turndownPluginGfm !== 'undefined' && typeof turndownPluginGfm.gfm === 'function') {
                  try {
                      turndownService.use(turndownPluginGfm.gfm);
                      console.log("GFM applied.");
                    }
                  catch (gfmError) { console.error("Error applying GFM plugin:", gfmError); }
             } else { console.warn("GFM plugin not loaded."); }

            // Define and Add Math Rule (for KaTeX/MathJax)
            const mathRule = {}; // Simplified for brevity, keep full logic from previous step
             mathRule.filter = function (node, options) {
                 try {
                     return (
                         (node.nodeName === 'SPAN' && (node.classList.contains('katex') || node.classList.contains('MathJax_Preview'))) ||
                         (node.nodeName === 'DIV' && node.classList.contains('katex-display')) ||
                         (node.nodeName === 'SCRIPT' && node.getAttribute('type')?.startsWith('math/tex')) ||
                         (node.getAttribute('role') === 'math')
                     );
                 } catch (filterError) { console.error("Error inside MathJax filter function:", filterError, "Node:", node); return false; }
             };
             mathRule.replacement = function (content, node, options) {
                 let latex = '', delimiter = '$';
                 try {
                     if (node.nodeName === 'SCRIPT') {
                         latex = node.textContent || '';
                         if (node.getAttribute('type')?.includes('mode=display') || latex.trim().startsWith('\\display')) { delimiter = '$$'; }
                     } else if (node.dataset && node.dataset.originalLatex) {
                         latex = node.dataset.originalLatex;
                         if (node.classList.contains('katex-display') || node.closest('.MathJax_Display')) { delimiter = '$$'; }
                     } else if (node.getAttribute('aria-label')) {
                         latex = node.getAttribute('aria-label');
                          if (node.nodeName === 'DIV' || node.classList.contains('katex-display') || node.closest('.MathJax_Display')) { delimiter = '$$'; }
                     } else if (node.classList.contains('katex')) {
                         const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
                         if (annotation) {
                             latex = annotation.textContent || '';
                             if (node.classList.contains('katex-display')) { delimiter = '$$'; }
                         }
                     } else if (node.nodeName === 'MATH' && node.getAttribute('alttext')) {
                         latex = node.getAttribute('alttext');
                         if (node.getAttribute('display') === 'block') { delimiter = '$$'; }
                     }
                     if (latex) {
                         latex = latex.trim();
                         if ((latex.startsWith('$$') && latex.endsWith('$$')) || (latex.startsWith('$') && latex.endsWith('$') && !latex.startsWith('$$'))) { return latex; }
                         return `${delimiter}${latex}${delimiter}`;
                     }
                     return '';
                 } catch (ruleError) { console.error("Error processing math rule replacement for node:", node, ruleError); return ''; }
             };

            try {
                console.log("Adding Math rule...");
                if (typeof mathRule.filter !== 'function') { throw new Error("Math rule filter is not a function!"); }
                turndownService.addRule('mathjaxKatex', mathRule);
                console.log("Math rule added.");
            } catch (addRuleError) { console.error("Failed to add Math rule:", addRuleError); }

            // 添加图片处理规则
            turndownService.addRule('images', {
                filter: 'img',
                replacement: function(content, node) {
                    const alt = node.getAttribute('alt') || '';
                    const src = node.getAttribute('src') || node.getAttribute('data-src') || '';
                    const title = node.getAttribute('title') ? ` "${node.getAttribute('title')}"` : '';
                    
                    if (!src) return alt ? `[${alt}]` : '';
                    
                    // 处理相对URL
                    let fullSrc = src;
                    if (src.startsWith('//')) {
                        fullSrc = window.location.protocol + src;
                    } else if (src.startsWith('/')) {
                        fullSrc = window.location.origin + src;
                    } else if (!src.startsWith('http')) {
                        fullSrc = new URL(src, window.location.href).href;
                    }
                    
                    return `![${alt}](${fullSrc}${title})`;
                }
            });

            // 添加代码块处理规则
            turndownService.addRule('codeBlocks', {
                filter: ['pre'],
                replacement: function(content, node) {
                    // 获取语言标识
                    let language = '';
                    const codeLabel = node.querySelector('code');
                    if (codeLabel) {
                        language = (codeLabel.className.match(/language-(\w+)/) || 
                                  codeLabel.className.match(/lang-(\w+)/) ||
                                  [])[1] || '';
                    }
                    if (!language) {
                         language = (node.className.match(/language-(\w+)/) || 
                                   node.className.match(/lang-(\w+)/) ||
                                   [])[1] || '';
                    }

                    // 克隆节点以进行清理，避免影响页面
                    const clone = node.cloneNode(true);
                    
                    // 清理常见干扰元素 (行号、按钮、折叠遮罩等)
                    const trashSelectors = [
                        '.pre-numbering', '.hljs-button', '.signin', 
                        '.hide-preCode-box', '.code-hide-box', '.copy-btn', 
                        'div[onclick]', 'ul.pre-numbering', '.code-lines'
                    ];
                    
                    trashSelectors.forEach(sel => {
                        const trash = clone.querySelectorAll(sel);
                        trash.forEach(el => el.remove());
                    });

                    // 提取代码文本 - 优先取 code 标签，否则取 pre
                    const codeEl = clone.querySelector('code') || clone;
                    
                    // 处理换行：将 <br> 替换为换行符
                    codeEl.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
                    
                    // 尝试获取文本
                    // innerText 在某些并未渲染的 clone 节点上可能失效，稳妥起见结合使用
                    // 对于 <pre><code>...</code></pre> 结构，textContent 通常包含源码换行
                    let codeText = codeEl.textContent || '';
                    
                    return '\n\n```' + language + '\n' + codeText.trim() + '\n```\n\n';
                }
            });

            // 添加Details/Summary折叠块处理
            turndownService.addRule('details', {
                filter: 'details',
                replacement: function(content, node) {
                    const summary = node.querySelector('summary');
                    const summaryText = summary ? summary.textContent.trim() : 'Details';
                    // 尝试提取 summary 之后的内容
                    // 简单清洗：移除 content 中可能包含的 summary 文本重复（TURNDOWN 可能会把 summary 转成 markdown 放在 content 开头）
                    // 更好的方式是保留 HTML 结构，兼容性好
                    return '\n\n<details>\n<summary>' + summaryText + '</summary>\n\n' + content.replace(summaryText, '').trim() + '\n\n</details>\n\n';
                }
            });

            // 添加表格处理规则（增强）
            turndownService.addRule('tables', {
                filter: 'table',
                replacement: function(content, node) {
                    const rows = Array.from(node.querySelectorAll('tr'));
                    if (rows.length === 0) return content;
                    
                    let markdown = '\n\n';
                    let hasHeader = false;
                    
                    rows.forEach((row, index) => {
                        const cells = Array.from(row.querySelectorAll('td, th'));
                        if (cells.length === 0) return;
                        
                        const isHeader = row.querySelector('th') || (index === 0 && !hasHeader);
                        if (isHeader) hasHeader = true;
                        
                        const cellContents = cells.map(cell => {
                            return cell.textContent.trim().replace(/\|/g, '\\|').replace(/\n/g, ' ');
                        });
                        
                        markdown += '| ' + cellContents.join(' | ') + ' |\n';
                        
                        // 添加表头分隔行
                        if (isHeader && index === 0) {
                            markdown += '|' + ' --- |'.repeat(cells.length) + '\n';
                        }
                    });
                    
                    return markdown + '\n';
                }
            });

            // 添加引用块处理
            turndownService.addRule('blockquotes', {
                filter: 'blockquote',
                replacement: function(content, node) {
                    const cite = node.querySelector('cite');
                    const attribution = cite ? `\n\n— ${cite.textContent.trim()}` : '';
                    
                    return '\n\n> ' + content.trim().replace(/\n/g, '\n> ') + attribution + '\n\n';
                }
            });

            // 添加视频处理规则
            turndownService.addRule('videos', {
                filter: ['video', 'iframe'],
                replacement: function(content, node) {
                    if (node.tagName === 'VIDEO') {
                        const src = node.getAttribute('src') || node.querySelector('source')?.getAttribute('src') || '';
                        const poster = node.getAttribute('poster') || '';
                        const alt = node.getAttribute('alt') || 'Video';
                        
                        if (poster) {
                            return `[![${alt}](${poster})](${src})`;
                        }
                        return `[${alt}](${src})`;
                    }
                    
                    if (node.tagName === 'IFRAME') {
                        const src = node.getAttribute('src') || '';
                        const title = node.getAttribute('title') || 'Embedded content';
                        
                        // 检测YouTube等视频平台
                        if (src.includes('youtube.com') || src.includes('youtu.be')) {
                            const videoId = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/)?.[1];
                            if (videoId) {
                                return `\n\n[![YouTube Video](https://img.youtube.com/vi/${videoId}/0.jpg)](${src})\n\n`;
                            }
                        }
                        
                        return `\n\n[${title}](${src})\n\n`;
                    }
                    
                    return content;
                }
            });

            // --- Perform Conversion ---
            console.log("Getting page content node...");
            const pageData = getPageContentNode();

            if (!pageData || !pageData.contentNode) {
                 console.error("Failed to get valid page content node. Aborting.");
                 alert("Could not get a valid page content node for conversion.");
                 return;
            }
            console.log(`Content node retrieved. Title: ${pageData.title}. Starting conversion...`);

            let markdownContent = '';
            try {
                markdownContent = turndownService.turndown(pageData.contentNode);
                console.log("Markdown conversion complete. Applying post-processing...");
                
                // 应用后处理优化
                markdownContent = postProcessMarkdown(markdownContent);

                // --- Add Front Matter ---
                const now = new Date();
                const frontMatter = [
                    '---',
                    `title: "${pageData.title.replace(/"/g, '\\"')}"`,
                    `url: ${window.location.href}`,
                    `date: ${now.toLocaleString()}`,
                    `author: ${window.location.hostname}`,
                    '---',
                    '',
                    `# ${pageData.title}`,
                    '',
                    ''
                ].join('\n');
                
                markdownContent = frontMatter + markdownContent;
                
                console.log("Final markdown processing completed.");
            } catch (convertError) {
                 console.error("Error during Turndown conversion:", convertError.message, convertError.stack);
                 alert(`Error during Markdown conversion: ${convertError.message}`);
                 return;
            }

            // 内容质量检查
            const finalLength = markdownContent.trim().length;
            const lineCount = markdownContent.split('\n').length;
            const wordCount = markdownContent.split(/\s+/).length;
            
            console.log(`Conversion quality metrics: ${finalLength} chars, ${lineCount} lines, ~${wordCount} words`);

            if (!markdownContent || markdownContent.trim() === '') {
                 console.warn("Conversion resulted in empty Markdown content.");
                 alert("Warning: The converted Markdown content is empty. This might indicate that the page structure is not supported or contains mostly non-text content.");
                 return;
            }
            
            if (finalLength < 100) {
                const proceed = confirm(`Warning: The converted content is very short (${finalLength} characters). This might indicate incomplete conversion. Do you want to proceed with the download?`);
                if (!proceed) {
                    console.log("User chose to cancel due to short content length.");
                    return;
                }
            }

            // --- Prepare Filename & Download ---
            const dateStr = new Date().toISOString().split('T')[0];
            const sanitize = (name) => name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
            const filename = `${sanitize(pageData.title)}_${dateStr}.md`;
            
            /**
             * 尝试使用GM_download下载，失败时回退到浏览器下载
             */
            function downloadMarkdown(content, fileName) {
                console.log(`Attempting to download ${fileName}...`);
                
                // 方法1: 尝试使用GM_download (Tampermonkey原生方法)
                if (typeof GM_download === 'function') {
                    const dataUri = `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`;
                    
                    GM_download({
                        url: dataUri,
                        name: fileName,
                        saveAs: true,
                        onload: () => {
                            console.log("Download completed successfully via GM_download");
                        },
                        onerror: (err) => {
                            console.warn('GM_download failed:', err);
                            
                            if (err.error === 'not_whitelisted') {
                                console.log("File extension not whitelisted. Attempting fallback download method...");
                                // 显示友好的提示信息
                                const userChoice = confirm(
                                    "🚫 Tampermonkey下载被阻止\n\n" +
                                    "原因：.md文件扩展名未在Tampermonkey白名单中\n\n" +
                                    "解决方案：\n" +
                                    "✅ 点击'确定' - 使用浏览器下载（推荐，无需设置）\n" +
                                    "⚙️ 点击'取消' - 查看详细设置指南\n\n" +
                                    "注意：浏览器下载功能完全正常，您可以放心使用！"
                                );
                                
                                if (userChoice) {
                                    console.log("User chose browser download method");
                                    fallbackDownload(content, fileName);
                                } else {
                                    console.log("User wants to see setup guide");
                                    // 提示用户查看主菜单中的设置指南
                                    setTimeout(() => {
                                        alert("请在Tampermonkey菜单中点击 '📥 Download Settings Guide' 查看详细设置说明");
                                    }, 100);
                                }
                            } else {
                                console.error("GM_download error:", err.error || 'Unknown error');
                                // 其他错误也使用备用下载
                                console.log("Using fallback download due to GM_download error");
                                fallbackDownload(content, fileName);
                            }
                        }
                    });
                } else {
                    console.warn("GM_download not available, using fallback method");
                    fallbackDownload(content, fileName);
                }
            }
            
            /**
             * 备用下载方法：使用浏览器的下载API
             */
            function fallbackDownload(content, fileName) {
                console.log("Using fallback download method...");
                
                try {
                    // 方法2: 使用Blob和URL.createObjectURL
                    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    
                    // 创建临时下载链接
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = fileName;
                    downloadLink.style.display = 'none';
                    
                    // 添加到DOM，触发下载，然后清理
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    
                    // 清理对象URL
                    setTimeout(() => {
                        URL.revokeObjectURL(url);
                    }, 100);
                    
                    console.log("Fallback download initiated successfully");
                    
                    // 显示美观的成功提示
                    const notification = document.createElement('div');
                    notification.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #4caf50, #45a049);
                        color: white;
                        padding: 16px 24px;
                        border-radius: 8px;
                        z-index: 10000;
                        font-family: 'Segoe UI', Arial, sans-serif;
                        font-size: 14px;
                        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                        border-left: 4px solid #2e7d32;
                        min-width: 300px;
                        animation: slideIn 0.3s ease-out;
                    `;
                    notification.innerHTML = `
                        <div style="display: flex; align-items: center;">
                            <div style="font-size: 20px; margin-right: 10px;">✅</div>
                            <div>
                                <div style="font-weight: bold; margin-bottom: 4px;">下载成功！</div>
                                <div style="font-size: 12px; opacity: 0.9;">文件名: ${fileName}</div>
                            </div>
                        </div>
                    `;
                    
                    // 添加CSS动画
                    if (!document.getElementById('download-notification-style')) {
                        const style = document.createElement('style');
                        style.id = 'download-notification-style';
                        style.textContent = `
                            @keyframes slideIn {
                                from { transform: translateX(100%); opacity: 0; }
                                to { transform: translateX(0); opacity: 1; }
                            }
                            @keyframes slideOut {
                                from { transform: translateX(0); opacity: 1; }
                                to { transform: translateX(100%); opacity: 0; }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    document.body.appendChild(notification);
                    
                    // 3秒后淡出
                    setTimeout(() => {
                        notification.style.animation = 'slideOut 0.3s ease-in';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }, 3000);
                    
                } catch (fallbackError) {
                    console.error("Fallback download also failed:", fallbackError);
                    
                    // 方法3: 最后的备用方案 - 显示内容让用户手动复制
                    const modalContent = `
                        <div style="
                            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                            background: rgba(0,0,0,0.85); z-index: 10000; 
                            display: flex; align-items: center; justify-content: center;
                            font-family: 'Segoe UI', Arial, sans-serif;
                        ">
                            <div style="
                                background: white; padding: 30px; border-radius: 12px; 
                                max-width: 85%; max-height: 85%; overflow: hidden;
                                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                                display: flex; flex-direction: column;
                            ">
                                <div style="margin-bottom: 20px;">
                                    <h2 style="color: #333; margin: 0 0 10px 0; display: flex; align-items: center;">
                                        <span style="font-size: 24px; margin-right: 10px;">📋</span>
                                        手动保存 Markdown 文件
                                    </h2>
                                    <p style="color: #666; margin: 0; line-height: 1.5;">
                                        自动下载失败，请复制以下内容并手动保存为 
                                        <code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;color:#e91e63;">${fileName}</code>
                                    </p>
                                </div>
                                
                                <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                                    <textarea readonly style="
                                        width: 100%; 
                                        height: 400px; 
                                        font-family: 'Consolas', 'Monaco', monospace; 
                                        font-size: 13px; 
                                        border: 2px solid #e0e0e0; 
                                        border-radius: 6px;
                                        padding: 15px;
                                        resize: none;
                                        outline: none;
                                        background: #fafafa;
                                        line-height: 1.4;
                                        flex: 1;
                                    " id="markdown-content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
                                </div>
                                
                                <div style="margin-top: 20px; text-align: center;">
                                    <button onclick="
                                        const textarea = document.getElementById('markdown-content');
                                        textarea.select();
                                        textarea.setSelectionRange(0, 99999);
                                        
                                        try {
                                            const successful = document.execCommand('copy');
                                            if (successful) {
                                                this.innerHTML = '✅ 已复制到剪贴板！';
                                                this.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
                                                setTimeout(() => {
                                                    this.innerHTML = '📋 复制内容';
                                                    this.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
                                                }, 2000);
                                            } else {
                                                throw new Error('Copy command failed');
                                            }
                                        } catch (err) {
                                            // 使用现代 Clipboard API
                                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                                navigator.clipboard.writeText(textarea.value).then(() => {
                                                    this.innerHTML = '✅ 已复制到剪贴板！';
                                                    this.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
                                                    setTimeout(() => {
                                                        this.innerHTML = '📋 复制内容';
                                                        this.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
                                                    }, 2000);
                                                }).catch(() => {
                                                    alert('复制失败，请手动选择文本内容进行复制');
                                                });
                                            } else {
                                                alert('复制失败，请手动选择文本内容进行复制');
                                            }
                                        }
                                    " style="
                                        padding: 12px 24px; 
                                        background: linear-gradient(135deg, #2196f3, #1976d2); 
                                        color: white; 
                                        border: none; 
                                        border-radius: 6px; 
                                        cursor: pointer;
                                        font-size: 14px;
                                        font-weight: 500;
                                        margin-right: 10px;
                                        transition: all 0.3s ease;
                                    " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                                        📋 复制内容
                                    </button>
                                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                            style="
                                                padding: 12px 24px; 
                                                background: linear-gradient(135deg, #757575, #616161); 
                                                color: white; 
                                                border: none; 
                                                border-radius: 6px; 
                                                cursor: pointer;
                                                font-size: 14px;
                                                font-weight: 500;
                                                transition: all 0.3s ease;
                                            " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                                        ❌ 关闭
                                    </button>
                                </div>
                                
                                <div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 6px; font-size: 12px; color: #666; text-align: center;">
                                    💡 提示：复制后可以粘贴到任何文本编辑器中，然后保存为 .md 文件
                                </div>
                            </div>
                        </div>
                    `;
                    
                    const modalDiv = document.createElement('div');
                    modalDiv.innerHTML = modalContent;
                    document.body.appendChild(modalDiv);
                }
            }
            
            // 执行下载
            downloadMarkdown(markdownContent, filename);

        } catch (error) {
             console.error("Critical error during convertAndDownload:", error.message, error.stack);
             alert(`A critical error occurred while running the script: ${error.message}`);
        }
    }

    // --- Register Menu Command ---
    if (typeof GM_registerMenuCommand === 'function') {
        try {
             // 主要转换功能
             GM_registerMenuCommand("🔄 Convert Page to Markdown", convertAndDownload, "m");
             
             // 合并的下载设置指南 - 移至主菜单级别
             GM_registerMenuCommand("📥 Download Settings Guide", function() {
                 const unifiedHelpContent = `
                     <div style="
                         position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                         background: rgba(0,0,0,0.9); z-index: 10000; 
                         display: flex; align-items: center; justify-content: center;
                         font-family: 'Segoe UI', Arial, sans-serif;
                     ">
                         <div style="
                             background: white; padding: 30px; border-radius: 12px; 
                             max-width: 720px; max-height: 90%; overflow: auto;
                             box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                         ">
                             <h2 style="color: #333; margin-top: 0; text-align: center; display: flex; align-items: center; justify-content: center;">
                                 <span style="font-size: 28px; margin-right: 10px;">📥</span>
                                 下载设置完整指南
                             </h2>
                             
                             <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px; border-radius: 10px; margin: 20px 0; text-align: center;">
                                 <strong style="font-size: 16px;">🎯 目标：允许Tampermonkey下载.md文件</strong><br>
                                 <div style="margin-top: 8px; font-size: 14px; opacity: 0.9;">
                                     如果设置失败，脚本会自动使用浏览器下载，无需担心！
                                 </div>
                             </div>
                             
                             <h3 style="color: #555; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px;">🔧 详细设置步骤</h3>
                             <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; line-height: 1.7; margin: 15px 0;">
                                 <div style="margin-bottom: 20px;">
                                     <strong style="color: #2e7d32; font-size: 15px;">1️⃣ 打开Tampermonkey管理界面</strong>
                                     <ul style="margin: 8px 0; padding-left: 25px; color: #555;">
                                         <li>点击浏览器工具栏的Tampermonkey图标 🐒</li>
                                         <li>选择 "管理面板" 或 "Dashboard"</li>
                                     </ul>
                                 </div>
                                 
                                 <div style="margin-bottom: 20px;">
                                     <strong style="color: #2e7d32; font-size: 15px;">2️⃣ 进入设置页面</strong>
                                     <ul style="margin: 8px 0; padding-left: 25px; color: #555;">
                                         <li>点击页面顶部的 "设置" 或 "Settings" 标签</li>
                                         <li>向下滚动找到 "Advanced" 部分</li>
                                     </ul>
                                 </div>
                                 
                                 <div style="margin-bottom: 20px;">
                                     <strong style="color: #2e7d32; font-size: 15px;">3️⃣ 配置下载白名单</strong>
                                     <ul style="margin: 8px 0; padding-left: 25px; color: #555;">
                                         <li>找到 "Downloads BETA" 选项</li>
                                         <li>在 "Whitelist" 输入框中添加：</li>
                                     </ul>
                                     <div style="text-align: center; margin: 10px 0;">
                                         <code style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); color: #333; padding: 10px 20px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">*.md</code>
                                     </div>
                                 </div>
                                 
                                 <div>
                                     <strong style="color: #2e7d32; font-size: 15px;">4️⃣ 保存设置</strong>
                                     <ul style="margin: 8px 0; padding-left: 25px; color: #555;">
                                         <li>滚动到页面底部点击 "Save" 按钮</li>
                                         <li>刷新当前页面以使设置生效</li>
                                     </ul>
                                 </div>
                             </div>
                             
                             <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                 <strong style="color: #8a6d00;">💡 浏览器特殊说明</strong><br>
                                 <div style="margin-top: 8px; color: #6c5500; line-height: 1.5;">
                                     <strong>Edge浏览器用户：</strong> 如果无法直接访问设置，可以：<br>
                                     • 右键点击Tampermonkey图标 → 选择 "扩展选项"<br>
                                     • 或在地址栏输入：<code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 3px;">edge://extensions/</code>
                                 </div>
                             </div>
                             
                             <div style="background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                 <strong style="color: #2e7d32;">✅ 备用下载方案</strong><br>
                                 <div style="margin-top: 8px; color: #2e7d32; line-height: 1.5;">
                                     即使无法设置Tampermonkey权限，脚本也会自动使用浏览器原生下载功能，<br>
                                     保证您能够成功获取转换后的Markdown文件！
                                 </div>
                             </div>
                             
                             <div style="background: #f3e5f5; border-left: 4px solid #9c27b0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                 <strong style="color: #6a1b9a;">🔧 常见问题解答</strong><br>
                                 <div style="margin-top: 8px; color: #6a1b9a; line-height: 1.5;">
                                     <strong>Q:</strong> 下载被浏览器阻止？<br>
                                     <strong>A:</strong> 检查浏览器弹窗拦截设置，允许当前网站的下载<br><br>
                                     <strong>Q:</strong> 文件名显示乱码？<br>
                                     <strong>A:</strong> 使用支持UTF-8编码的文本编辑器打开文件<br><br>
                                     <strong>Q:</strong> 转换内容不完整？<br>
                                     <strong>A:</strong> 刷新页面后重新尝试转换
                                 </div>
                             </div>
                             
                             <div style="text-align: center; margin-top: 30px;">
                                 <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                                         style="
                                             padding: 15px 35px; 
                                             background: linear-gradient(135deg, #4caf50, #45a049); 
                                             color: white; 
                                             border: none; 
                                             border-radius: 8px; 
                                             cursor: pointer;
                                             font-size: 16px;
                                             font-weight: bold;
                                             box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                                             transition: all 0.3s ease;
                                         "
                                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(76, 175, 80, 0.4)'"
                                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(76, 175, 80, 0.3)'">
                                     ✓ 我已了解，关闭指南
                                 </button>
                             </div>
                         </div>
                     </div>
                 `;
                 
                 const unifiedHelpDiv = document.createElement('div');
                 unifiedHelpDiv.innerHTML = unifiedHelpContent;
                 document.body.appendChild(unifiedHelpDiv);
             }, "h");
             
             console.log("Menu commands registered.");
        } catch (registerError) { console.error("Failed to register menu command:", registerError); alert("Failed to register menu command!"); }
    } else { console.error("GM_registerMenuCommand is not available."); alert("GM_registerMenuCommand is not available!"); }

    console.log("Webpage to Markdown script finished loading."); // Version updated
})();