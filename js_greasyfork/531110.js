// ==UserScript==
// @name         DeepSeek Markdown Raw Viewer
// @namespace    徐智昊（weibo:智昊今天玩什么）
// @version      1.1
// @description  针对大语言模型对话时markdown渲染错误或希望能够自己复制大语言模型原始输出的结果自行渲染的情况，提供了在网页上不渲染markdown的能力；仅支持chat.deepseek.com
// @match        https://chat.deepseek.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531110/DeepSeek%20Markdown%20Raw%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/531110/DeepSeek%20Markdown%20Raw%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心处理器：从 DOM 精准重建 Markdown
    const reconstructMarkdown = (container) => {
        let md = '';
        const ignoredClasses = ['ds-markdown-code-copy-button', 'md-code-block-banner'];

        // 递归处理节点
        const processNode = (node, inCodeBlock = false) => {
            if (node.nodeType === Node.TEXT_NODE) {
                md += node.textContent.replace(/^#+/gm, '\\$&'); // 转义行首 #
            }
            else if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                const isIgnored = [...node.classList].some(c => ignoredClasses.includes(c));

                if (isIgnored) return;

                // 代码块边界检测
                const isCodeBlock = tag === 'pre' && node.querySelector('code');
                if (isCodeBlock && !inCodeBlock) {
                    md += '```\n';
                    inCodeBlock = true;
                } else if (inCodeBlock && !isCodeBlock) {
                    md += '\n```\n';
                    inCodeBlock = false;
                }

                switch (tag) {
                    case 'h1': md += `# ${node.textContent}\n\n`; break;
                    case 'h2': md += `## ${node.textContent}\n\n`; break;
                    case 'h3': md += `### ${node.textContent}\n\n`; break;
                    case 'strong': md += `**${node.textContent}**`; break;
                    case 'em': md += `*${node.textContent}*`; break;
                    case 'code':
                        if (!inCodeBlock) md += `\`${node.textContent}\``;
                        else md += node.textContent;
                        break;
                    case 'a':
                        const href = node.getAttribute('href') || '';
                        md += `[${node.textContent}](${href})`;
                        break;
                    case 'span':
                        // 处理数学公式
                        if (node.classList.contains('katex-mathml')) {
                            const annotation = node.querySelector('annotation');
                            if (annotation) md += annotation.textContent;
                        } else {
                            md += node.textContent;
                        }
                        break;
                    case 'div':
                    case 'p':
                        [...node.childNodes].forEach(child => processNode(child, inCodeBlock));
                        md += '\n';
                        break;
                    default:
                        [...node.childNodes].forEach(child => processNode(child, inCodeBlock));
                }
            }
        };

        [...container.childNodes].forEach(node => processNode(node));
        return md.trim();
    };

    // 渲染优化后的 Markdown 显示
    const renderRawMarkdown = (container) => {
        const rawMd = reconstructMarkdown(container);
        container.innerHTML = `
            <pre style="
                white-space: pre-wrap;
                font-family: 'Roboto Mono', monospace;
                background: #f8f8f8;
                padding: 12px;
                border-radius: 4px;
                border-left: 3px solid #6ce26c;
                margin: 0;
                overflow-x: auto;
            ">${escapeHtml(rawMd)}</pre>
        `;
        container.style.padding = '8px';
    };

    // HTML 转义
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML
            .replace(/^#+/gm, match => match.replace(/#/g, '&#35;')); // 保护标题符号
    };

    // 主处理器
    const processContainers = () => {
        document.querySelectorAll('.ds-markdown:not([data-raw-md])').forEach(container => {
            container.dataset.rawMd = "processed";
            renderRawMarkdown(container);
        });
    };

    // 监听动态内容
    new MutationObserver((mutations) => {
        const needsUpdate = [...mutations].some(mutation =>
            mutation.addedNodes.length > 0 ||
            (mutation.target.classList && mutation.target.classList.contains('ds-markdown'))
        );
        if (needsUpdate) processContainers();
    }).observe(document.body, { subtree: true, childList: true });

    // 初始处理
    processContainers();
})();

