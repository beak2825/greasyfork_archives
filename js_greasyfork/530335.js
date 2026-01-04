// ==UserScript==
// @name         知网一键复制全文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为知网阅读器添加一键复制全文功能，保持文本结构
// @author       Cook John
// @license      AGPL License
// @match        https://kns.cnki.net/nzkhtml/xmlRead/*
// @match        https://*/nzkhtml/xmlRead/*
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/530335/%E7%9F%A5%E7%BD%91%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/530335/%E7%9F%A5%E7%BD%91%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建复制按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = '复制全文';
        button.id = 'copy-full-text';
        button.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        `;

        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#40a9ff';
        });

        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#1890ff';
        });

        button.addEventListener('click', copyFullText);
        document.body.appendChild(button);
    }

    // 提取文本内容，保持结构
    function extractStructuredContent() {
        let content = '';

        // 获取标题 - 不依赖特定ID
        const titleElement = document.querySelector('.ChapterH1 h1.Chapter, h1.Chapter[data-id*="-H"]');
        if (titleElement) {
            content += titleElement.textContent.trim() + '\n\n';
        }

        // 获取作者和机构信息 - 通过类名定位
        const authorElements = document.querySelectorAll('.ChapterMsg .Chapter-people');
        if (authorElements.length > 0) {
            authorElements.forEach(element => {
                content += processTextOnly(element) + '\n';
            });
            content += '\n';
        }

        // 获取摘要和关键词 - 查找带有"摘要："和"关键词："文本的段落
        const allParagraphs = document.querySelectorAll('p');
        let abstractFound = false;
        let keywordsFound = false;

        for (const p of allParagraphs) {
            const text = p.textContent.trim();
            if (!abstractFound && text.includes('摘要：')) {
                content += processTextOnly(p) + '\n\n';
                abstractFound = true;
            } else if (!keywordsFound && text.includes('关键词：')) {
                content += processTextOnly(p) + '\n\n';
                keywordsFound = true;
            }

            if (abstractFound && keywordsFound) break;
        }

        // 获取正文内容 - 通过 ChapterWrap Content 类来识别内容区块
        const contentDivs = document.querySelectorAll('.ChapterWrap.Content');

        contentDivs.forEach(div => {
            // 检查是否是章节标题
            const h1 = div.querySelector('h1.Chapter');
            const h2 = div.querySelector('h2.Chapter');

            if (h1) {
                content += h1.textContent.trim() + '\n\n';
            } else if (h2) {
                content += h2.textContent.trim() + '\n\n';
            }

            // 获取段落 - 选择所有p标签且不属于已处理过的标题等
            const paragraphs = Array.from(div.querySelectorAll('p')).filter(p => {
                // 排除已处理的标题段落或者作者信息段落
                const isTitle = p.parentElement.querySelector('h1, h2') === p;
                const isAuthorInfo = p.parentElement.classList.contains('Chapter-people');
                const isAbstract = p.textContent.includes('摘要：');
                const isKeywords = p.textContent.includes('关键词：');
                return !isTitle && !isAuthorInfo && !isAbstract && !isKeywords;
            });

            paragraphs.forEach(p => {
                const paragraphText = processTextOnly(p);
                if (paragraphText.trim()) {
                    content += paragraphText + '\n\n';
                }
            });
        });

        return content;
    }

    // 处理文本内容，去除HTML标签但保留脚注
    function processTextOnly(element) {
        let text = '';
        // 如果元素不存在，直接返回空字符串
        if (!element) return text;

        Array.from(element.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'SUP') {
                    // 保留脚注引用
                    text += node.textContent;
                } else if (node.tagName === 'SPAN') {
                    // 处理特殊的span元素
                    text += processTextOnly(node);
                } else if (node.tagName !== 'A' || !node.classList.contains('name-link')) {
                    // 递归处理子元素，但排除某些特定链接
                    text += processTextOnly(node);
                }
            }
        });
        return text.trim();
    }

    // 复制全文
    function copyFullText() {
        try {
            const content = extractStructuredContent();

            if (!content.trim()) {
                throw new Error('未能提取到文章内容');
            }

            // 使用GM_setClipboard复制到剪贴板
            GM_setClipboard(content, 'text');

            // 使用SweetAlert2显示成功消息
            Swal.fire({
                title: '复制成功！',
                text: '文章已复制到剪贴板',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('复制失败:', error);

            // 显示错误消息
            Swal.fire({
                title: '复制失败',
                text: '发生错误：' + error.message,
                icon: 'error',
                confirmButtonText: '确定'
            });
        }
    }

    // 添加调试功能，帮助分析页面结构
    function addDebugButton() {
        const button = document.createElement('button');
        button.textContent = '分析结构';
        button.id = 'analyze-structure';
        button.style.cssText = `
            position: fixed;
            top: 130px;
            right: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background-color: #722ed1;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        `;

        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#9254de';
        });

        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#722ed1';
        });

        button.addEventListener('click', analyzeStructure);
        document.body.appendChild(button);
    }

    // 分析页面结构
    function analyzeStructure() {
        console.group('知网文章结构分析');

        // 分析标题
        const title = document.querySelector('.ChapterH1 h1.Chapter, h1.Chapter[data-id*="-H"]');
        console.log('标题元素:', title);

        // 分析作者和机构
        const authors = document.querySelectorAll('.ChapterMsg .Chapter-people');
        console.log('作者和机构元素:', authors);

        // 分析摘要和关键词
        const abstractParagraphs = Array.from(document.querySelectorAll('p')).filter(p =>
            p.textContent.includes('摘要：')
        );
        console.log('摘要元素:', abstractParagraphs);

        const keywordParagraphs = Array.from(document.querySelectorAll('p')).filter(p =>
            p.textContent.includes('关键词：')
        );
        console.log('关键词元素:', keywordParagraphs);

        // 分析内容区块
        const contentDivs = document.querySelectorAll('.ChapterWrap.Content');
        console.log('内容区块数量:', contentDivs.length);
        console.log('内容区块示例:', contentDivs[0]);

        // 分析标题结构
        const h1Elements = document.querySelectorAll('h1.Chapter');
        const h2Elements = document.querySelectorAll('h2.Chapter');
        console.log('一级标题数量:', h1Elements.length);
        console.log('二级标题数量:', h2Elements.length);

        // 显示标题层次结构
        const headings = [];
        h1Elements.forEach(h1 => headings.push({level: 1, text: h1.textContent.trim()}));
        h2Elements.forEach(h2 => headings.push({level: 2, text: h2.textContent.trim()}));

        // 按在DOM中的顺序排序
        headings.sort((a, b) => {
            const posA = getPositionInDocument(a.text);
            const posB = getPositionInDocument(b.text);
            return posA - posB;
        });

        console.log('标题层次结构:', headings);

        console.groupEnd();

        // 显示分析完成提示
        Swal.fire({
            title: '分析完成',
            text: '文章结构已在控制台中输出，请按F12查看',
            icon: 'info',
            confirmButtonText: '确定'
        });
    }

    // 获取文本在文档中的位置
    function getPositionInDocument(text) {
        const allTextNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            allTextNodes.push(node);
        }

        for (let i = 0; i < allTextNodes.length; i++) {
            if (allTextNodes[i].textContent.includes(text)) {
                return i;
            }
        }
        return Infinity;
    }

    // 网页加载完成后执行初始化
    window.addEventListener('load', function() {
        // 延迟一点时间确保DOM已完全加载
        setTimeout(() => {
            createCopyButton();
        }, 1500);
    });
})();