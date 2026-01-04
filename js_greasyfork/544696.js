// ==UserScript==
// @name         通用网页阅读模式 (Universal Reader Mode)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在任何受支持的文章页面上提供一个干净、无干扰的阅读模式，并支持自动翻页。
// @author       Gemini & YourName
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544696/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%20%28Universal%20Reader%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544696/%E9%80%9A%E7%94%A8%E7%BD%91%E9%A1%B5%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F%20%28Universal%20Reader%20Mode%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. 脚本作用域变量 ---
    let readableArticle = null; // 存储初次解析成功的文章对象
    let nextPageUrl = null; // 存储下一页的URL
    let isLoadingNextPage = false; // 防止重复点击加载
    let pageNumber = 1; // 页码计数器

    // --- 1. 环境检查 ---
    if (typeof Readability === "undefined") {
        console.error("Universal Reader Mode: Readability library not found. The script will terminate.");
        return;
    }

    // --- 2. 样式定义 ---
    GM_addStyle(`
        #reader-mode-prompt, #reader-mode-exit, #reader-mode-load-next {
            position: fixed;
            z-index: 99998;
            padding: 12px 18px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.2s ease-out, background-color 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #reader-mode-prompt:hover, #reader-mode-exit:hover, #reader-mode-load-next:hover {
            transform: scale(1.05);
            background-color: #555;
        }
        #reader-mode-prompt { bottom: 20px; right: 20px; }
        #reader-mode-exit { top: 20px; right: 20px; }
        #reader-mode-load-next {
            display: block;
            position: static;
            margin: 30px auto;
            width: fit-content;
        }
        #reader-mode-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #f5f3e8; /* 舒适的米黄色背景 */
            color: #333;
            z-index: 99999;
            overflow-y: scroll;
            padding: 40px;
            box-sizing: border-box;
        }
        #reader-mode-content {
            max-width: 800px;
            margin: 0 auto;
            font-family: Georgia, 'Times New Roman', Times, serif;
            font-size: 20px;
            line-height: 1.8;
        }
        #reader-mode-content h1, #reader-mode-content h2, #reader-mode-content h3 {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        #reader-mode-content h1 { font-size: 2.2em; margin-bottom: 1em; font-weight: bold; }
        #reader-mode-content img, #reader-mode-content video { max-width: 100%; height: auto; display: block; margin: 25px auto; border-radius: 4px; }
        .reader-mode-page-separator {
            margin: 40px auto;
            border: 0;
            border-top: 1px solid #ccc;
            max-width: 200px;
        }
    `);

    // --- 3. 功能实现 ---

    /**
     * 主函数，检测页面是否可读
     */
    function initializeReader() {
        try {
            const article = new Readability(document.cloneNode(true)).parse();
            if (article && article.content && article.title) {
                console.log("Universal Reader Mode: This page is readable.");
                readableArticle = article;
                createPromptButton();
            } else {
                console.log("Universal Reader Mode: This page is not suitable for reader mode.");
            }
        } catch (e) {
            console.error("Universal Reader Mode: An error occurred during initial check:", e);
        }
    }

    /**
     * 创建“进入阅读模式”按钮
     */
    function createPromptButton() {
        if (document.getElementById('reader-mode-prompt')) return;
        const promptButton = document.createElement('button');
        promptButton.id = 'reader-mode-prompt';
        promptButton.textContent = '进入阅读模式';
        promptButton.onclick = activateReaderMode;
        document.body.appendChild(promptButton);
    }

    /**
     * 激活阅读模式
     */
    function activateReaderMode() {
        if (!readableArticle) return;

        const promptButton = document.getElementById('reader-mode-prompt');
        if (promptButton) promptButton.remove();

        pageNumber = 1; // 重置页码
        const container = document.createElement('div');
        container.id = 'reader-mode-container';

        const contentDiv = document.createElement('div');
        contentDiv.id = 'reader-mode-content';
        contentDiv.innerHTML = `<h1>${readableArticle.title}</h1>${readableArticle.content}`;

        const exitButton = document.createElement('button');
        exitButton.id = 'reader-mode-exit';
        exitButton.textContent = '退出阅读模式';
        exitButton.onclick = () => {
            container.remove();
            document.body.style.overflow = 'auto';
            createPromptButton(); // **新增**: 退出后重新创建进入按钮
        };

        container.appendChild(contentDiv);
        container.appendChild(exitButton);
        document.body.appendChild(container);
        document.body.style.overflow = 'hidden';

        // 查找并准备下一页
        nextPageUrl = findNextPageLink(document);
        renderPagination(container);
    }

    /**
     * 查找下一页链接
     * @param {Document} doc - 要在其中搜索的文档对象
     * @returns {string|null} - 下一页的绝对URL或null
     */
    function findNextPageLink(doc) {
        const links = doc.getElementsByTagName('a');
        const nextPageRegex = /^(next|下一[页章]|continue|›|»)$/i;
        let potentialLink = null;

        for (const link of links) {
            // 优先使用 rel="next"
            if (link.rel === 'next') {
                potentialLink = link;
                break;
            }
            // 然后匹配文本内容
            if (nextPageRegex.test(link.textContent.trim())) {
                potentialLink = link;
                // 继续查找以防有更明确的 rel="next"
            }
        }
        if (potentialLink && potentialLink.href) {
            // 将相对URL转换为绝对URL
            return new URL(potentialLink.href, doc.baseURI).href;
        }
        return null;
    }

    /**
     * 渲染分页按钮
     * @param {HTMLElement} container - 阅读模式的主容器
     */
    function renderPagination(container) {
        // 先移除旧的按钮
        const oldButton = document.getElementById('reader-mode-load-next');
        if (oldButton) oldButton.remove();

        if (nextPageUrl) {
            const loadNextButton = document.createElement('button');
            loadNextButton.id = 'reader-mode-load-next';
            loadNextButton.textContent = '加载下一页';
            loadNextButton.onclick = loadNextPage;
            container.appendChild(loadNextButton);
        }
    }

    /**
     * 加载并追加下一页内容
     */
    function loadNextPage() {
        if (!nextPageUrl || isLoadingNextPage) return;

        isLoadingNextPage = true;
        const button = document.getElementById('reader-mode-load-next');
        if (button) button.textContent = '加载中...';

        GM_xmlhttpRequest({
            method: "GET",
            url: nextPageUrl,
            responseType: 'arraybuffer', // **FIX**: 以二进制形式获取，手动处理编码
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    let htmlText;
                    let detectedCharset;

                    // 先用UTF-8解码，以便于搜索meta标签
                    const preliminaryText = new TextDecoder('utf-8').decode(response.response);

                    // 从<meta>标签中寻找charset
                    const charsetMatch = preliminaryText.match(/<meta.*?charset=["']?([\w-]+)/i);
                    if (charsetMatch && charsetMatch[1]) {
                        detectedCharset = charsetMatch[1].toLowerCase();
                    } else {
                        const contentTypeMatch = preliminaryText.match(/<meta.*?http-equiv=["']?content-type["']?.*?content=["']?.*?charset=([\w-]+)/i);
                        if (contentTypeMatch && contentTypeMatch[1]) {
                            detectedCharset = contentTypeMatch[1].toLowerCase();
                        }
                    }

                    // 如果检测到非UTF-8的编码（如gbk），则用新编码重新解码
                    try {
                        if (detectedCharset && detectedCharset !== 'utf-8') {
                            console.log('Detected charset:', detectedCharset);
                            htmlText = new TextDecoder(detectedCharset).decode(response.response);
                        } else {
                            htmlText = preliminaryText; // 否则，使用之前UTF-8解码的内容
                        }
                    } catch (e) {
                        console.error(`Failed to decode with charset ${detectedCharset}, falling back to UTF-8.`, e);
                        htmlText = preliminaryText; // 解码失败时回退
                    }

                    const parser = new DOMParser();
                    const nextDoc = parser.parseFromString(htmlText, "text/html");

                    // 注入<base>标签以确保相对路径正确
                    const base = nextDoc.createElement('base');
                    base.href = response.finalUrl;
                    nextDoc.head.appendChild(base);

                    const article = new Readability(nextDoc).parse();

                    if (article && article.content) {
                        const contentDiv = document.getElementById('reader-mode-content');
                        if (contentDiv) {
                            const separator = document.createElement('hr');
                            separator.className = 'reader-mode-page-separator';

                            const pageContent = document.createElement('div');
                            pageContent.innerHTML = article.content;

                            contentDiv.appendChild(separator);
                            contentDiv.appendChild(pageContent);
                        }

                        // 从新加载的文档中寻找下一个链接
                        nextPageUrl = findNextPageLink(nextDoc);
                        const container = document.getElementById('reader-mode-container');
                        if (container) renderPagination(container);

                    } else {
                        if (button) button.textContent = '加载失败';
                        nextPageUrl = null;
                    }
                } else {
                     if (button) button.textContent = '加载失败';
                     nextPageUrl = null;
                }
                isLoadingNextPage = false;
            },
            onerror: function() {
                if (button) button.textContent = '加载错误';
                isLoadingNextPage = false;
                nextPageUrl = null;
            }
        });
    }


    // --- 4. 脚本启动 ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeReader);
    } else {
        initializeReader();
    }

})();
