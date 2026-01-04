// ==UserScript==
// @name         Discourse Markdown 主题导出
// @namespace    http://innjay.cn
// @version      1.1.0
// @description  将任意 Discourse 论坛的主题导出，支持动态页面加载
// @author       Hebaodan
// @match        http://*/*
// @match        https://*/*
// @license      MIT
// @icon         https://img.innjay.cn/i/2024/10/01/66fbf6914fe72.png
// @grant        GM_setClipboard
// @require      https://unpkg.com/turndown@7.1.3/dist/turndown.js
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/514330/Discourse%20Markdown%20%E4%B8%BB%E9%A2%98%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/514330/Discourse%20Markdown%20%E4%B8%BB%E9%A2%98%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonContainer = null;

    // 检查当前页面是否是 Discourse 论坛
    function isDiscourseForum() {
        return document.querySelector('meta[name="generator"][content*="Discourse"]') !== null;
    }

    // 检查是否在主题页面
    function isTopicPage() {
        return window.location.pathname.match(/\/t\/.*\/\d+/);
    }

    // 创建按钮容器
    function createButtonContainer() {
        if (buttonContainer) {
            buttonContainer.remove();
        }

        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        buttonContainer = container;
        return container;
    }

    // 创建按钮
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        button.addEventListener('click', onClick);
        return button;
    }

    // 获取文章内容
    function getArticleContent() {
        const titleElement = document.querySelector('#topic-title h1');
        const contentElement = document.querySelector('#post_1 .cooked');

        if (!titleElement || !contentElement) {
            console.error('无法找到文章标题或内容');
            return null;
        }

        return {
            title: titleElement.textContent.trim(),
            content: contentElement.innerHTML
        };
    }

    // 转换为Markdown
    function convertToMarkdown(article) {
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });

        // 自定义规则处理图片和链接
        turndownService.addRule('images_and_links', {
            filter: ['a', 'img'],
            replacement: function (content, node) {
                // 处理图片
                if (node.nodeName === 'IMG') {
                    const alt = node.alt || '';
                    const src = node.getAttribute('src') || '';
                    const title = node.title ? ` "${node.title}"` : '';
                    return `![${alt}](${src}${title})`;
                }
                // 处理链接
                else if (node.nodeName === 'A') {
                    const href = node.getAttribute('href');
                    const title = node.title ? ` "${node.title}"` : '';
                    // 检查链接是否包含图片
                    const img = node.querySelector('img');
                    if (img) {
                        const alt = img.alt || '';
                        const src = img.getAttribute('src') || '';
                        const imgTitle = img.title ? ` "${img.title}"` : '';
                        return `[![${alt}](${src}${imgTitle})](${href}${title})`;
                    }
                    // 普通链接
                    return `[${node.textContent}](${href}${title})`;
                }
            }
        });

        return `# ${article.title}\n\n${turndownService.turndown(article.content)}`;
    }

    // 下载为Markdown文件
    function downloadAsMarkdown() {
        const article = getArticleContent();
        if (!article) {
            alert('无法获取文章内容，请检查网页结构是否变更。');
            return;
        }

        const markdown = convertToMarkdown(article);

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${article.title}.md`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('Markdown 文件已下载');
    }

    // 复制到剪贴板
    function copyToClipboard() {
        const article = getArticleContent();
        if (!article) {
            alert('无法获取文章内容，请检查网页结构是否变更。');
            return;
        }

        const markdown = convertToMarkdown(article);
        GM_setClipboard(markdown);

        showNotification('内容已复制到剪贴板');
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // 主函数
    function main() {
        // 首先检查是否是 Discourse 论坛
        if (!isDiscourseForum()) {
            return;
        }

        if (isTopicPage()) {
            const container = createButtonContainer();
            const downloadButton = createButton('下载 Markdown', downloadAsMarkdown);
            const copyButton = createButton('复制到剪贴板', copyToClipboard);
            container.appendChild(downloadButton);
            container.appendChild(copyButton);
        } else {
            if (buttonContainer) {
                buttonContainer.remove();
                buttonContainer = null;
            }
        }
    }

    // 延迟执行主函数，确保页面完全加载
    setTimeout(main, 1000);

    // 监听 URL 变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(main, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();