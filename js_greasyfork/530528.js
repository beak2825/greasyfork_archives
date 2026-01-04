// ==UserScript==
// @name         知识星球文章去水印、复制为 Markdown
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  知识星球辅助，文章去水印、可手动复制，可以一键复制为 Markdown
// @author       Loner1024
// @match        https://articles.zsxq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zsxq.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.1/turndown.min.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530528/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%96%87%E7%AB%A0%E5%8E%BB%E6%B0%B4%E5%8D%B0%E3%80%81%E5%A4%8D%E5%88%B6%E4%B8%BA%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/530528/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%96%87%E7%AB%A0%E5%8E%BB%E6%B0%B4%E5%8D%B0%E3%80%81%E5%A4%8D%E5%88%B6%E4%B8%BA%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("js-disable-copy");
    let post = document.getElementsByClassName('post')[0];
    post.style.removeProperty('background-image');
    post.style.removeProperty('background-repeat');
    post.style.removeProperty("background-size");

      // 添加样式
    GM_addStyle(`
        #md-copy-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }
        #md-copy-btn:hover {
            background-color: #45a049;
        }
        #md-status {
            position: fixed;
            bottom: 70px;
            right: 20px;
            padding: 8px 12px;
            background-color: rgba(0,0,0,0.7);
            color: white;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9999;
            display: none;
        }
    `);

    // 创建复制按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.id = 'md-copy-btn';
        button.textContent = '复制文章为Markdown';
        button.addEventListener('click', extractAndCopyArticle);

        const status = document.createElement('div');
        status.id = 'md-status';
        status.textContent = '';

        document.body.appendChild(button);
        document.body.appendChild(status);
    }

    // 显示状态消息
    function showStatus(message, isError = false) {
        const status = document.getElementById('md-status');
        status.textContent = message;
        status.style.backgroundColor = isError ? 'rgba(255,0,0,0.7)' : 'rgba(0,0,0,0.7)';
        status.style.display = 'block';

        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }

    // 在转换前预处理HTML，保留空白
    // 在turndown处理前运行此函数
    function preserveCodeIndentation() {
        // 找到所有代码块容器
        const codeContainers = document.querySelectorAll('.ql-code-block-container');

        codeContainers.forEach(container => {
            // 处理每个代码行
            const codeBlocks = container.querySelectorAll('.ql-code-block');

            codeBlocks.forEach(block => {
                // 获取原始HTML
                const originalHtml = block.innerHTML;

                // 检查是否有前导空格
                const leadingWhitespaceMatch = originalHtml.match(/^(\s|&nbsp;)+/);

                if (leadingWhitespaceMatch) {
                    // 计算空格数量
                    const whitespace = leadingWhitespaceMatch[0]
                    .replace(/&nbsp;/g, ' ')
                    .replace(/\s/g, ' ');

                    // 创建用于显示空格的元素
                    const spacesSpan = document.createElement('span');
                    spacesSpan.className = 'preserved-indent';
                    spacesSpan.setAttribute('data-spaces', whitespace.length);
                    spacesSpan.textContent = whitespace;

                    // 替换原始HTML中的空格
                    const contentWithoutIndent = originalHtml.substring(leadingWhitespaceMatch[0].length);
                    block.innerHTML = '';
                    block.appendChild(spacesSpan);

                    // 添加剩余内容
                    const contentSpan = document.createElement('span');
                    contentSpan.innerHTML = contentWithoutIndent;
                    block.appendChild(contentSpan);
                }
            });
        });
    }


    // 提取文章内容并复制到剪贴板
    function extractAndCopyArticle() {
        const articles = document.getElementsByClassName('content');

        if (articles.length === 0) {
            showStatus('未找到内容', true);
            return;
        }
        preserveCodeIndentation()

        // 创建Turndown实例
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            emDelimiter: '*'
        });

        // 增强Turndown以更好地处理代码块
        turndownService.addRule('codeBlocks', {
            filter: function (node, options) {
                return (
                    node.nodeName === 'DIV' &&
                    node.classList.contains('ql-code-block-container')
                );
            },
            replacement: function(content, node) {
                // 提取代码块内容
                let codeLines = [];
                const codeBlocks = node.querySelectorAll('.ql-code-block');

                // 检测语言
                let language = 'go'; // 假设是Go语言，可根据实际情况调整

                // 处理每一行代码
                codeBlocks.forEach(block => {
                    // 查找缩进元素
                    const indentSpan = block.querySelector('.preserved-indent');
                    let indentSpaces = 0;

                    // 如果找到缩进元素，获取缩进数量
                    if (indentSpan) {
                        indentSpaces = parseInt(indentSpan.getAttribute('data-spaces') || '0', 10);
                        // 移除缩进元素以便获取纯文本内容
                        indentSpan.remove();
                    }

                    // 获取纯文本内容
                    let textContent = block.textContent;

                    // 添加缩进和内容
                    codeLines.push(' '.repeat(indentSpaces) + textContent);
                });

                // 将所有行组合
                const codeContent = codeLines.join('\n');

                // 返回Markdown格式的代码块
                return '```' + language + '\n' + codeContent + '\n```\n\n';
            }
        });

        // 增强对图片的处理
        turndownService.addRule('images', {
            filter: 'img',
            replacement: function(content, node) {
                const alt = node.alt || '';
                let src = node.getAttribute('src') || '';

                // 处理相对URL
                if (src && !src.match(/^(https?:)?\/\//)) {
                    if (src.startsWith('/')) {
                        // 域名根路径
                        const domain = window.location.origin;
                        src = domain + src;
                    } else {
                        // 相对当前路径
                        const base = window.location.href.split('/').slice(0, -1).join('/');
                        src = base + '/' + src;
                    }
                }

                return '![' + alt + '](' + src + ')';
            }
        });

        let allMarkdown = '';
        const title = document.getElementsByClassName('title')[0];
        allMarkdown += '## ' + title.textContent + '\n\n'

        for (let i = 0; i < articles.length; i++) {
            // 创建一个新的文档片段作为工作区域
            const tempContainer = document.createElement('div');
            // 克隆节点以避免修改原始DOM
            tempContainer.appendChild(articles[i].cloneNode(true));

            // 移除其他可能不需要的元素
            const elementsToRemove = tempContainer.querySelectorAll('.comments, .related-posts, .share-buttons, nav, .navigation, .ads, script, style');
            elementsToRemove.forEach(el => el.remove());

            // 获取第一个article元素（在tempContainer中）
            const processedArticle = tempContainer.getElementsByClassName('content')[0];
            if (processedArticle) {
                // 转换为Markdown
                const markdown = turndownService.turndown(processedArticle.innerHTML);
                allMarkdown += markdown + '';
            }
        }

        if (allMarkdown) {
            // 复制到剪贴板
            GM_setClipboard(allMarkdown);
            showStatus('文章已转换为Markdown并复制');
        } else {
            showStatus('处理文章内容失败', true);
        }
    }

    // 添加快捷键(Alt+M)
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'm') {
            extractAndCopyArticle();
        }
    });

    // 初始化
    function init() {
        createCopyButton();
    }

    // 等待页面完全加载
    window.addEventListener('load', init);
})();