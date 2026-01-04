// ==UserScript==
// @name         网页内容转Markdown（内容优化版）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  提取网页主要文章内容并转换为 Markdown 格式，避免垃圾内容干扰
// @author       YourName
// @match        *://*/*
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.1/turndown.min.js
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/521684/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E8%BD%ACMarkdown%EF%BC%88%E5%86%85%E5%AE%B9%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521684/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E8%BD%ACMarkdown%EF%BC%88%E5%86%85%E5%AE%B9%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';




        // 初始化 Turndown
        const turndownService = new TurndownService();

        // 自定义代码块规则
        turndownService.addRule('codeBlock', {
            filter: function (node) {
                return (
                    node.nodeName === 'PRE' ||
                    (node.nodeName === 'CODE' && node.parentNode.nodeName !== 'PRE')
                );
            },
            replacement: function (content, node) {
                return `\n\`\`\`\n${node.textContent}\n\`\`\`\n`;
            },
        });

        // 自动检测主要内容
        const contentElement = detectMainContent();
        if (!contentElement) {
            alert('未检测到主要内容，请手动检查网页结构。');
            return;
        }

        // 提取内容并转换为 Markdown
        const contentHTML = contentElement.innerHTML;
        const markdown = turndownService.turndown(contentHTML);

        // 显示结果
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <textarea style="width: 90%; height: 300px;">${markdown}</textarea>
            <button id="copyMarkdown" style="margin-top: 10px; padding: 10px;">复制到剪贴板</button>
        `;
        resultDiv.style.position = 'fixed';
        resultDiv.style.top = '20%';
        resultDiv.style.left = '5%';
        resultDiv.style.width = '90%';
        resultDiv.style.zIndex = '10000';
        resultDiv.style.backgroundColor = '#fff';
        resultDiv.style.border = '1px solid #ccc';
        resultDiv.style.borderRadius = '5px';
        resultDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        resultDiv.style.padding = '20px';
        resultDiv.style.overflowY = 'auto';
        document.body.appendChild(resultDiv);

        // 添加复制到剪贴板功能
        document.getElementById('copyMarkdown').addEventListener('click', () => {
            GM_setClipboard(markdown);
            alert('Markdown 已复制到剪贴板');
            document.body.removeChild(resultDiv); // 自动关闭弹窗
        });


    // 自动识别主要内容的方法
    function detectMainContent() {
        // 优先选择 <article> 标签
        let mainContent = document.querySelector('article');
        if (mainContent) return mainContent;

        // 检查常见的内容容器
        const selectors = [
            '#content',           // 通用内容容器
            '.article',           // 常见文章类
            '.post',              // 博客文章
            '.main-content',      // 主内容类
            '.entry-content',     // Wordpress 常用类
        ];
        for (const selector of selectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) return mainContent;
        }

        // 尝试直接返回 body 的主要部分
        return document.body;
    }
})();