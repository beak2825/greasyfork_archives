// ==UserScript==
// @name         NodeSeek Threads v1.6
// @name:zh-CN   NodeSeek 楼中楼 v1.6
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Optimized nested comments with reliable username extraction, fully asynchronous cross-page quoting and mention processing.
// @description:zh-CN 为 NodeSeek 网站提供优化版嵌套评论（楼中楼）功能，支持可靠的用户名提取、完全异步的跨页引用和提及处理。
// @author       Dean & Gemini
// @match        https://www.nodeseek.com/post-*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodeseek.com
// @license      MIT
// @homepageURL  https://github.com/deanhzed/NodeSeekThreads
// @downloadURL https://update.greasyfork.org/scripts/542426/NodeSeek%20Threads%20v16.user.js
// @updateURL https://update.greasyfork.org/scripts/542426/NodeSeek%20Threads%20v16.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Configuration & Settings / 配置与设置 ---
    const settings = {
        // Whether to show user signatures / 是否显示用户签名
        showSignatures: GM_getValue('showSignatures', true),
        // Mention nesting feature is always enabled (asynchronous processing) / 提及嵌套功能始终开启 (异步处理)
        enableMentions: true,
    };

    /**
     * Registers Tampermonkey menu commands.
     * 注册 Tampermonkey 菜单命令。
     */
    function registerMenuCommands() {
        GM_registerMenuCommand(`${settings.showSignatures ? '隐藏' : '显示'} 签名栏 / ${settings.showSignatures ? 'Hide' : 'Show'} Signatures`, () => {
            GM_setValue('showSignatures', !settings.showSignatures);
            window.location.reload(); // Reload page to apply settings / 重新加载页面以应用设置
        });
    }

    // --- 2. Page Cache (for cross-page quoting) / 页面缓存 (用于跨页引用) ---
    const pageCache = new Map();

    // --- 3. CSS Styles / CSS 样式 ---
    const nestedAvatarSize = 36; // Nested comment avatar size / 嵌套评论头像大小
    const avatarMargin = 8;      // Avatar margin / 头像外边距
    const nestedIndent = nestedAvatarSize + avatarMargin; // Nested comment indentation / 嵌套评论缩进量

    /**
     * Applies custom CSS styles to the page.
     * 应用自定义 CSS 样式到页面。
     */
    function applyStyles() {
        let styles = `
            /* --- Base Styles for Top-level Comments / 顶级评论基础样式 --- */
            .comments > .content-item {
                background: rgba(0,0,0,.05) !important;
                border: 1px solid rgba(0,0,0,.05) !important;
                padding: 10px 10px 10px 16px !important;
                margin-bottom: 10px !important;
                border-radius: 1px !important;
                transition: background .3s, border .3s;
                position: relative;
            }
            .comments > .content-item::before, .comments > .content-item::after {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                width: 3px;
            }
            .comments > .content-item::before { left: 0; background-color: rgba(0,0,0,.1); }
            .comments > .content-item::after { left: 3px; background-color: rgba(0,0,0,.2); }

            /* --- Base Styles for Nested Replies Container / 嵌套回复容器基础样式 --- */
            .nested-replies-container {
                border: 1px solid rgba(0,0,0,.1);
                border-left: none;
                margin-top: 10px;
                padding: 0 8px 5px 12px;
                border-radius: 1px;
                transition: border .3s;
                background: hsla(0,0%,100%,.01) !important;
                position: relative;
            }
            .nested-replies-container::before, .nested-replies-container::after {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                width: 2px;
            }
            .nested-replies-container::before { left: 0; background-color: rgba(0,0,0,.05); }
            .nested-replies-container::after { left: 2px; background-color: rgba(0,0,0,.1); }

            /* --- Base Styles for Nested Comment Items / 嵌套评论项基础样式 --- */
            .nested-replies-container > .content-item.is-nested {
                border: none !important;
                padding: 8px 0 0 0 !important;
                margin-bottom: 0 !important;
                border-bottom: 1px dashed rgba(0,0,0,.08) !important;
                background: transparent !important;
                transition: border .3s;
            }
            .nested-replies-container > .content-item.is-nested:last-child { border-bottom: none !important; }
            .nested-replies-container > .content-item.is-nested:first-child { padding-top: 5px !important; }

            /* --- Nested Elements Layout / 嵌套元素布局 --- */
            .is-nested .avatar-normal { width: ${nestedAvatarSize}px !important; height: ${nestedAvatarSize}px !important; }
            .is-nested > .post-content, .is-nested > .signature { margin-left: ${nestedIndent}px; }

            /* --- Cross-Page Quote Block Styles / 跨页引用块样式 --- */
            .cross-page-quote {
                border-left: 3px solid rgba(0,0,0,.15);
                padding: 12px;
                margin: 10px 0;
                font-size: 0.95em;
                color: #555;
                background: rgba(0,0,0,.03);
                border-radius: 1px 1px 1px 1px;
            }
            .cross-page-quote .quote-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 5px;
            }
            .cross-page-quote .quote-header .avatar-normal {
                width: 24px;
                height: 24px;
                border-radius: 15%;
            }
            .cross-page-quote .quote-meta {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 5px;
                flex-grow: 1;
            }
            
            .cross-page-quote .quote-author {
                font-weight: bold;
            }
            .cross-page-quote .quote-time {
                font-size: 0.8em;
                color: #888;
            }
            .cross-page-quote .quote-floor-id {
                background: rgba(0,0,0,.1);
                padding: 2px 6px;
                border-radius: 5px;
                font-size: 0.85em;
            }
            .cross-page-quote .quote-content {
                color: #666;
                padding-left: 10px;
                border-left: 1px dotted rgba(0,0,0,.1);
            }

            /* --- Dark Mode Overrides / 暗色模式覆盖样式 --- */
            body.dark-layout .comments > .content-item {
                background: hsla(0,0%,100%,.01) !important;
                border: 1px solid hsla(0,0%,100%,.05) !important;
            }
            body.dark-layout .comments > .content-item::before { background-color: hsla(0,0%,100%,.05); }
            body.dark-layout .comments > .content-item::after { background-color: hsla(0,0%,100%,.1); }
            body.dark-layout .nested-replies-container { border-color: hsla(0,0%,100%,.1) !important; }
            body.dark-layout .nested-replies-container::before { background-color: hsla(0,0%,100%,.05); }
            body.dark-layout .nested-replies-container::after { background-color: hsla(0,0%,100%,.1); }
            body.dark-layout .nested-replies-container > .content-item.is-nested { border-bottom-color: hsla(0,0%,100%,.08) !important; }
            body.dark-layout .cross-page-quote {
                border-left-color: hsla(0,0%,100%,.2);
                color: #bbb;
                background: hsla(0,0%,100%,.03);
            }
            body.dark-layout .cross-page-quote .quote-content {
                color: #aaa;
                border-left-color: hsla(0,0%,100%,.1);
            }
            body.dark-layout .quote-floor-id { background: hsla(0,0%,100%,.1); }
            body.dark-layout .cross-page-quote .quote-time {
                color: #999;
            }

            /* --- Floor Link Styles / 楼层链接样式 --- */
            .content-item:not(.is-nested) .floor-link {
                font-weight: bold;
                background: rgba(0,0,0,.1);
                padding: 2px 6px;
                border-radius: 5px;
                font-size: 0.85em;
                margin-right: 8px;
            }

            /* --- Nested Floor Link Styles / 嵌套楼层链接样式 --- */
            .is-nested .floor-link {
                color: #888;
                font-weight: normal;
                font-size: 0.9em;
            }
        `;

        if (!settings.showSignatures) {
            styles += `.signature { display: none !important; }`;
        }

        GM_addStyle(styles);
    }

    // --- 4. Core Logic Functions / 核心逻辑函数 --- 

    /**
     * Reliably extracts the author name from a comment element.
     * This function is designed to get the author of the comment itself, not who it mentions.
     * It prioritizes the .author-name element.
     * 从评论元素中可靠地提取作者名。
     * 此函数旨在获取评论本身的作者，而不是其提及的对象。
     * 优先从 .author-name 元素中获取。
     * @param {HTMLElement} element The comment element. / 评论元素。
     * @returns {string} The extracted author name or 'unknown'. / 提取到的作者名或 'unknown'。
     */
    function extractAuthorName(element) {
        const authorNameElement = element.querySelector('.author-name');
        if (authorNameElement) {
            const name = authorNameElement.textContent.trim();
            return name;
        }
        return 'unknown';
    }

    /**
     * Creates a cross-page quote block HTML element.
     * 创建一个跨页引用块的 HTML 元素。
     * @param {string} authorName The author's name. / 作者名。
     * @param {string} floorId The floor ID. / 楼层ID。
     * @param {string|null} content The quoted content HTML, or null if not available. / 引用内容 HTML，如果不可用则为 null。
     * @param {string} originalPostUrl The URL of the original post containing the quoted comment. / 包含被引用评论的原始帖子URL。
     * @param {string|null} avatarUrl The URL of the author's avatar. / 作者头像URL。
     * @param {string|null} postTime The formatted post time. / 格式化的发布时间。
     * @returns {HTMLElement} The created blockquote element. / 创建的 blockquote 元素。
     */
    function createCrossPageQuote(authorName, floorId, content = null, originalPostUrl = '', avatarUrl = null, postTime = null) {
        const blockquote = document.createElement('blockquote');
        blockquote.className = 'cross-page-quote';

        let contentHtml = content ? `<div class="quote-content">${content}</div>` : '<div>无法获取引用内容</div>';

        // Create clickable links for author and floor ID / 创建作者和楼层ID的可点击链接
        const authorLink = `<a href="/member?t=${encodeURIComponent(authorName)}" data-eusoft-scrollable-element="1">${authorName}</a>`;
        const floorLink = originalPostUrl ? `<a href="${originalPostUrl.split('#')[0]}#${floorId}" data-eusoft-scrollable-element="1">#${floorId}</a>` : `#${floorId}`;

        const avatarHtml = avatarUrl ? `
            <div class="avatar-wrapper">
                <a href="/member?t=${encodeURIComponent(authorName)}" data-eusoft-scrollable-element="1">
                    <img class="avatar-normal" src="${avatarUrl}" alt="${authorName}">
                </a>
            </div>` : '';
        const timeHtml = postTime ? `
            <span class="date-created">
                <time>${postTime}</time>
            </span>` : '';

        blockquote.innerHTML = `
            <div class="quote-header">
                ${avatarHtml}
                <div class="quote-meta">
                    <span class="quote-author">${authorLink}</span>
                    ${timeHtml}
                </div>
                <span class="quote-floor-id">${floorLink}</span>
            </div>
            ${contentHtml}
        `;
        return blockquote;
    }

    /**
     * Parses a comment's author, content, avatar, and post time from fetched HTML.
     * 从获取到的 HTML 中解析评论的作者、内容、头像和发布时间。
     * @param {string} html The HTML content of the page. / 页面的 HTML 内容。
     * @param {string} floorId The ID of the comment to parse. / 要解析的评论ID。
     * @returns {{author: string, content: string|null, avatarUrl: string|null, postTime: string|null}} The parsed data. / 解析后的数据。
     */
    function parseCommentFromHtml(html, floorId) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const commentElement = doc.getElementById(floorId);

        if (!commentElement) {
            return { author: 'unknown', content: null, avatarUrl: null, postTime: null };
        }

        const author = extractAuthorName(commentElement);
        const contentElement = commentElement.querySelector('.post-content');
        const content = contentElement ? contentElement.innerHTML : null;

        const avatarImg = commentElement.querySelector('.avatar-normal');
        const avatarUrl = avatarImg ? avatarImg.src : null;

        const timeElement = commentElement.querySelector('.date-created time');
        const postTime = timeElement ? timeElement.textContent.trim() : null;

        return { author, content, avatarUrl, postTime };
    }

    /**
     * Fetches a page and parses quote data from it.
     * 获取页面并从中解析引用数据。
     * @param {string} parentUrl The URL of the parent comment's page. / 父评论页面的URL。
     * @param {string} parentFloorId The floor ID of the parent comment. / 父评论的楼层ID。
     * @param {string|null} initialAuthorName An initial author name if available from the current comment. / 初始作者名（如果可用）。
     * @returns {Promise<Object>} A Promise that resolves with the quote data. / 包含引用数据的 Promise。
     */
    function fetchAndParseQuoteData(parentUrl, parentFloorId, initialAuthorName = null) {
        const pageUrl = parentUrl.split('#')[0];

        let finalAuthor = initialAuthorName || 'unknown';

        // Check cache first / 检查缓存
        if (pageCache.has(pageUrl)) {
            const cachedData = parseCommentFromHtml(pageCache.get(pageUrl), parentFloorId);
            if (cachedData.author !== 'unknown') {
                finalAuthor = cachedData.author;
            }
            return Promise.resolve({ ...cachedData, author: finalAuthor, originalPostUrl: pageUrl });
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: pageUrl,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 400) {
                        const htmlContent = response.responseText;
                        pageCache.set(pageUrl, htmlContent);

                        const parsedData = parseCommentFromHtml(htmlContent, parentFloorId);
                        if (parsedData.author !== 'unknown') {
                            finalAuthor = parsedData.author;
                        }
                        resolve({ ...parsedData, author: finalAuthor, originalPostUrl: pageUrl });
                    } else {
                        reject(new Error(`Failed to fetch page ${pageUrl}: Status ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Network error fetching page: ${pageUrl} - ${error}`));
                }
            });
        });
    }

    /**
     * Normalizes a username for consistent matching.
     * 规范化用户名以便一致匹配。
     * @param {string} name The username to normalize. / 要规范化的用户名。
     * @returns {string} The normalized username. / 规范化后的用户名。
     */
    function normalizeUsername(name) {
        return name.replace(/^@/, '')
                   .replace(/\s+/g, '')
                   .replace(/[^\w\u4e00-\u9fa5]/g, '')
                   .toLowerCase();
    }

    // --- 5. Main Comment Processing Logic / 主要评论处理逻辑 --- 
    let commentsToProcessForMentionsGlobal = []; // Global variable to store comments for mention nesting processing / 全局变量，存储需要进行提及嵌套处理的评论
    let userLastCommentMap = new Map(); // Global variable to map normalized usernames to their last comment element / 全局变量，存储规范化用户名到其最新评论元素的映射
    let commentsToProcessForCrossQuotesGlobal = []; // Global variable to store comments for cross-page quoting processing / 全局变量，存储需要进行跨页引用处理的评论数据

    /**
     * Processes comments for same-page nesting and collects data for asynchronous processing.
     * 处理评论以进行同页嵌套，并收集数据以进行异步处理。
     */
    function processComments() {
        const allCommentsInDOM = Array.from(document.querySelectorAll('.content-item')); // Get all comment elements in the DOM / 获取所有评论元素
        const commentMap = new Map(); // Maps floor ID to comment element / 存储楼层ID到评论元素的映射

        commentsToProcessForMentionsGlobal = []; // Reset global list / 重置全局列表
        userLastCommentMap = new Map(); // Reset global map / 重置全局映射
        commentsToProcessForCrossQuotesGlobal = []; // Reset global list / 重置全局列表

        // Iterate through all comments, populate maps, and attempt same-page floor nesting / 遍历所有评论，填充映射并尝试进行同页楼层嵌套处理
        allCommentsInDOM.forEach(comment => {
            comment.classList.remove('nested-processed', 'mention-processed'); // Reset processing flags / 重置处理标记

            const floorId = comment.getAttribute('id');
            if (floorId) {
                commentMap.set(floorId, comment);
            }

            const authorName = extractAuthorName(comment);
            if (authorName !== 'unknown') {
                userLastCommentMap.set(normalizeUsername(authorName), comment);
            }

            // Skip already nested comments, they should not be processed as top-level comments again / 跳过已嵌套的评论，它们不应再作为顶级评论处理
            if (comment.parentElement?.classList.contains('nested-replies-container')) {
                return;
            }

            let hasAnyFloorReference = false; // Flag indicating if the comment contains any floor reference / 标记评论是否包含任何楼层引用
            // let handledByFloorNesting = false; // Flag indicating if the comment has been successfully nested by floor / 标记评论是否已被楼层嵌套成功处理 (不再直接使用，因为跨页引用也异步化了)

            const replyLinks = comment.querySelectorAll('.post-content a[href*="/post-"]');
            for (const replyLink of replyLinks) {
                if (replyLink.closest('blockquote')) { // Skip links inside blockquotes / 跳过引用块内的链接
                    continue;
                }

                hasAnyFloorReference = true; // Mark that a floor reference exists / 标记存在楼层引用

                if (!replyLink.hash || replyLink.hash === '#0') { // If it's #0 or no hash, skip nesting processing / 如果是 #0 或没有哈希，跳过嵌套处理
                    continue;
                }

                const parentFloorId = replyLink.hash.substring(1);
                const parentComment = commentMap.get(parentFloorId);

                if (parentComment) { // Parent comment found on the current page (potential same-page nesting) / 在当前页面找到父评论 (同页嵌套)
                    if (parentComment !== comment && parseInt(parentFloorId) < parseInt(comment.id)) {
                        // Valid same-page nesting / 有效的同页嵌套
                        let container = parentComment.querySelector('.nested-replies-container');
                        if (!container) {
                            container = document.createElement('div');
                            container.className = 'nested-replies-container';
                            parentComment.appendChild(container);
                        }
                        container.appendChild(comment);
                        comment.classList.add('is-nested');
                        // handledByFloorNesting = true; // No longer needed as cross-page is async / 不再需要，因为跨页引用也异步化了
                        break; // Break after successful nesting / 成功嵌套后跳出循环
                    }
                } else { // Parent comment NOT found on the current page (cross-page reference) / 当前页面未找到父评论 (跨页引用)
                    if (!comment.classList.contains('cross-quote-processed')) {
                        comment.classList.add('cross-quote-processed'); // Add flag immediately to prevent duplicate processing / 立即添加标记，防止重复处理
                        // Add comment to cross-page quoting processing list, instead of calling fetchAndQuote immediately
                        // 将评论添加到跨页引用处理列表，而不是立即调用 fetchAndQuote
                        commentsToProcessForCrossQuotesGlobal.push({
                            replyLink: replyLink,
                            parentFloorId: parentFloorId,
                            currentComment: comment,
                            initialAuthorName: replyLink.textContent.match(/@([^#\s]+)/) ? replyLink.textContent.match(/@([^#\s]+)/)[1] : null
                        });
                        // handledByFloorNesting = true; // No longer needed as cross-page is async / 不再需要，因为跨页引用也异步化了
                        break; // Break after initiating cross-page quote / 启动跨页引用后跳出循环
                    }
                }
            }

            // If no floor reference was found, add to the list for mention processing / 如果没有楼层引用，则添加到待处理提及列表
            if (!hasAnyFloorReference) {
                commentsToProcessForMentionsGlobal.push(comment);
            }
            comment.classList.add('nested-processed'); // Mark as processed / 标记为已处理
        });
    }

    /**
     * Asynchronously processes mention nesting logic.
     * 异步处理提及嵌套逻辑。
     */
    function processMentionsSeparately() {
        if (!settings.enableMentions) { // Check if mention nesting is enabled / 检查是否启用提及嵌套
            return;
        }

        commentsToProcessForMentionsGlobal.forEach(comment => {
            // If the comment is already nested, skip mention processing / 如果评论已被嵌套，则跳过提及处理
            if (comment.classList.contains('is-nested')) {
                return;
            }

            const mentionLinks = comment.querySelectorAll('.post-content a[href^="/member?"]');
            for (const mentionLink of mentionLinks) {
                if (mentionLink.closest('blockquote') || !mentionLink.textContent.startsWith('@')) {
                    continue; 
                }

                const username = mentionLink.textContent.substring(1).trim();
                const normalizedUsername = normalizeUsername(username);

                if (normalizedUsername.length < 2) { 
                    continue;
                }

                const parentComment = userLastCommentMap.get(normalizedUsername);

                if (parentComment && parentComment !== comment && !comment.contains(parentComment) && parseInt(parentComment.id) < parseInt(comment.id)) {
                    let container = parentComment.querySelector('.nested-replies-container');
                    if (!container) {
                        container = document.createElement('div');
                        container.className = 'nested-replies-container';
                        parentComment.appendChild(container);
                    }
                    container.appendChild(comment);
                    comment.classList.add('is-nested');
                    break; 
                }
            }
        });
    }

    /**
     * Asynchronously processes cross-page quoting logic.
     * 异步处理跨页引用逻辑。
     */
    async function processCrossPageQuotesSeparately() {
        for (const quoteData of commentsToProcessForCrossQuotesGlobal) {
            try {
                const parsedQuoteData = await fetchAndParseQuoteData(
                    quoteData.replyLink.href,
                    quoteData.parentFloorId,
                    quoteData.initialAuthorName
                );
                const blockquote = createCrossPageQuote(
                    parsedQuoteData.author,
                    parsedQuoteData.floorId || quoteData.parentFloorId, // Use parsed floorId if available, else original / 如果可用，使用解析的楼层ID，否则使用原始楼层ID
                    parsedQuoteData.content,
                    parsedQuoteData.originalPostUrl,
                    parsedQuoteData.avatarUrl,
                    parsedQuoteData.postTime
                );
                quoteData.currentComment.querySelector('.post-content')?.prepend(blockquote);
            } catch (error) {
                // If fetching fails, still add a "failed to load" quote block / 如果获取失败，仍然添加一个“加载失败”的引用框
                const blockquote = createCrossPageQuote(
                    quoteData.initialAuthorName || 'unknown',
                    quoteData.parentFloorId,
                    '加载失败',
                    quoteData.replyLink.href,
                    null,
                    null
                );
                quoteData.currentComment.querySelector('.post-content')?.prepend(blockquote);
            }
        }
    }

    // --- 6. Initialization / 初始化 --- 
    window.addEventListener('load', () => {
        registerMenuCommands(); // Register menu commands / 注册菜单命令
        applyStyles();          // Apply styles / 应用样式

        // Initial processing of comments (including same-page floor nesting) / 初始处理评论 (包括同页楼层嵌套)
        processComments();

        // Asynchronously process mention nesting / 异步处理提及嵌套
        // Use setTimeout to ensure execution when the main thread is idle, not blocking page load
        // 使用 setTimeout 确保在主线程空闲时执行，不阻塞页面加载
        setTimeout(processMentionsSeparately, 100); 

        // Asynchronously process cross-page quoting / 异步处理跨页引用
        // Give mention nesting some time, then process cross-page quoting
        // 给予提及嵌套一些时间，再处理跨页引用
        setTimeout(processCrossPageQuotesSeparately, 200); 

        // Set up MutationObserver to listen for DOM changes, to re-process comments / 设置 MutationObserver 监听 DOM 变化，以便重新处理评论
        const commentsContainer = document.querySelector('.comments');
        if (commentsContainer) {
            const observer = new MutationObserver(() => {
                // Debounce processing to avoid excessive runs on rapid DOM changes / 防抖处理，避免在快速DOM变化时过度运行
                clearTimeout(window._nsThreadsProcessTimeout);
                window._nsThreadsProcessTimeout = setTimeout(() => {
                    processComments();
                    setTimeout(processMentionsSeparately, 100); // Re-process mention nesting / 重新处理提及嵌套
                    setTimeout(processCrossPageQuotesSeparately, 200); // Re-process cross-page quoting / 重新处理跨页引用
                }, 300);
            });
            observer.observe(commentsContainer, { childList: true, subtree: true });
        }
    });

})();