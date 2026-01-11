// ==UserScript==
// @name         哔哩哔哩工具箱 - Bilibili Toolbox
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  在哔哩哔哩视频页面上，提供用户选项来自动进入网页全屏、自动开启关灯模式（调暗页面背景）、悬浮评论区选项，以及重构播放页面最大化播放器功能。
// @author       twocold0451
// @homepage     https://github.com/twocold0451/bilibili-toolkit
// @supportURL   https://github.com/twocold0451/bilibili-toolkit/issues
// @match        https://www.bilibili.com/video/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546065/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20Bilibili%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/546065/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20Bilibili%20Toolbox.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // --- UI & Notifications ---
    const SHADOW_HIGHLIGHT_CSS = `
        :host(.gm-comment-match) {
            display: block !important;
            outline: 3px solid #FFD700 !important;
            outline-offset: -3px !important;
            background-color: rgba(255, 215, 0, 0.1) !important;
            transition: all 0.3s ease !important;
        }
        :host(.gm-comment-active) {
            display: block !important;
            outline: 4px solid #00a1d6 !important;
            outline-offset: -4px !important;
            background-color: rgba(0, 161, 214, 0.15) !important;
            box-shadow: inset 0 0 20px rgba(0, 161, 214, 0.3) !important;
            z-index: 10 !important;
        }
        /* 针对 B 站评论内容的特殊处理 */
        :host(.gm-comment-match) #contents, 
        :host(.gm-comment-match) #main {
            background-color: transparent !important;
        }
    `;

    GM_addStyle(`
        .gm-toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        .gm-toast-container.show {
            opacity: 1;
        }
        .gm-floating-comment {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 400px;
            height: 600px;
            background: white;
            border: 2px solid #00a1d6;
            border-radius: 8px;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .gm-floating-comment.collapsed {
            height: 40px;
        }
        .gm-floating-comment.dragging {
            opacity: 0.8;
            transition: none;
            cursor: move;
        }
        .gm-floating-comment-header {
            background: #00a1d6;
            color: white;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: bold;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .gm-floating-comment-toggle {
            cursor: pointer;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            font-weight: bold;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        .gm-floating-comment-toggle:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .gm-comment-search-container {
            flex: 1;
            display: flex;
            align-items: center;
            margin: 0 4px;
            background: white;
            border-radius: 3px;
            padding-right: 2px;
            overflow: hidden;
        }
        .gm-comment-search-input {
            flex: 1;
            padding: 2px 6px;
            font-size: 12px;
            border: none;
            outline: none;
            color: #000;
            background: transparent;
            width: 100%;
        }
        .gm-comment-clear-btn {
            cursor: pointer;
            background: none;
            border: none;
            color: #999;
            font-size: 14px;
            padding: 0 4px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }
        .gm-comment-clear-btn:hover {
            color: #ff4d4f;
        }
        
        /* 主文档中的辅助样式 */
        .gm-comment-match {
            display: block !important;
            position: relative !important;
        }
        .gm-comment-active {
            animation: gm-pulse 1.5s infinite alternate;
        }
        @keyframes gm-pulse {
            from { transform: scale(1); }
            to { transform: scale(1.01); }
        }

        .gm-search-nav-btn {
            cursor: pointer;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            font-weight: bold;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        .gm-search-nav-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        .gm-search-nav-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .gm-floating-comment-content {
            height: calc(100% - 40px);
            overflow-y: auto;
        }
        .gm-floating-comment.collapsed .gm-floating-comment-content {
            display: none;
        }

        /* Page restructure styles */
        .gm-page-restructure .left-container {
            position: fixed !important;
            left: 0 !important;
            width: calc(100% - 420px) !important;
            max-width: none !important;
            height: 100vh !important;
            overflow-y: auto !important;
            z-index: 100 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: rgb(255 255 255)!important;
            transition: top 0.3s ease, height 0.3s ease !important;
        }
        .gm-page-restructure .right-container {
            position: fixed !important;
            right: 0 !important;
            width: 420px !important;
            height: 100vh !important;
            overflow-y: auto !important;
            z-index: 99 !important;
            background: white !important;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1) !important;
            padding: 0 !important;
            margin: 0 !important;
            transition: top 0.3s ease, height 0.3s ease !important;
        }
        body.has-collapsed-header .gm-page-restructure .left-container,
        body.has-collapsed-header .gm-page-restructure .right-container {
            top: 0px !important;
            height: 100vh !important;
        }
        body.has-collapsed-header {
            margin: 0 !important;
            padding: 0 !important;
            height: 100vh !important;
            overflow: hidden !important;
        }

        /* 页面重构下的播放器尺寸优化 */
        .gm-page-restructure .main-container,
        .gm-page-restructure .video-page-container,
        .gm-page-restructure .video-container,
        .gm-page-restructure .video-page-video,
        .gm-page-restructure .video-page-detail,
        .gm-page-restructure .video-page-operator,
        .gm-page-restructure .video-page-module {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
        }

        .gm-page-restructure .video-area {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #000 !important;
        }

        .gm-page-restructure .bilibili-player-wrapper {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .gm-page-restructure #bilibili-player,
        .gm-page-restructure .bilibili-player {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            object-fit: contain !important;
        }

        .gm-page-restructure .bpx-player-container {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #000 !important;
        }

        .gm-page-restructure .bpx-player-video-wrap {
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .gm-page-restructure #playerWrap {
            height: auto !important;
            max-height: none !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        .gm-header-toggle {
            position: fixed !important;
            top: 10px !important;
            right: 20px !important;
            z-index: 1000 !important;
            width: 40px !important;
            height: 40px !important;
            background: #00a1d6 !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 18px !important;
            font-weight: bold !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            transition: all 0.3s ease !important;
        }
    `);

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "gm-toast-container";
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 10);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => { if (toast.parentNode) document.body.removeChild(toast); }, 300);
        }, 3000);
    }

    // --- Configuration ---
    const CONFIG_WEBFULLSCREEN_KEY = "config_auto_web_fullscreen";
    const CONFIG_LIGHTSOFF_KEY = "config_lights_off";
    const CONFIG_COMMENT_WINDOW_KEY = "config_comment_window";
    const CONFIG_PAGE_RESTRUCTURE_KEY = "config_page_restructure";

    let floatingCommentWindow = null;
    let commentAppOriginalParent = null;
    let commentAppElement = null;

    function injectStyleToShadowRecursive(element) {
        if (!element) return;
        
        const applyToRoot = (root) => {
            if (!root.querySelector("#gm-shadow-highlight-style")) {
                const style = document.createElement("style");
                style.id = "gm-shadow-highlight-style";
                style.textContent = SHADOW_HIGHLIGHT_CSS;
                root.appendChild(style);
            }
        };

        if (element.shadowRoot) {
            applyToRoot(element.shadowRoot);
            // 递归处理 Shadow DOM 内部的子元素
            Array.from(element.shadowRoot.querySelectorAll("*")).forEach(injectStyleToShadowRecursive);
        }
        
        // 处理 Light DOM 子元素
        Array.from(element.children).forEach(injectStyleToShadowRecursive);
    }

    function createFloatingCommentWindow() {
        if (floatingCommentWindow) return;

        commentAppElement = document.getElementById("commentapp") || document.getElementById("comment-module");
        if (!commentAppElement) {
            setTimeout(createFloatingCommentWindow, 1000);
            return;
        }

        commentAppOriginalParent = commentAppElement.parentNode;
        floatingCommentWindow = document.createElement("div");
        floatingCommentWindow.className = "gm-floating-comment";
        floatingCommentWindow.innerHTML = `
            <div class="gm-floating-comment-header">
                <span>评论区悬浮窗</span>
                <div class="gm-comment-search-container">
                    <input id="gm-comment-search-input" type="text" placeholder="搜索评论…" class="gm-comment-search-input" />
                    <button id="gm-comment-clear-btn" class="gm-comment-clear-btn" title="清空">✕</button>
                </div>
                <button id="gm-comment-prev-btn" class="gm-search-nav-btn" title="上一个">▲</button>
                <button id="gm-comment-next-btn" class="gm-search-nav-btn" title="下一个">▼</button>
                <button id="gm-comment-search-btn" class="gm-floating-comment-toggle">🔍</button>
                <button id="gm-comment-toggle" class="gm-floating-comment-toggle">−</button>
            </div>
            <div class="gm-floating-comment-content"></div>
        `;

        const content = floatingCommentWindow.querySelector(".gm-floating-comment-content");
        content.appendChild(commentAppElement);
        document.body.appendChild(floatingCommentWindow);

        // Drag & Collapse Logic
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;
        const header = floatingCommentWindow.querySelector(".gm-floating-comment-header");
        const toggleBtn = document.getElementById("gm-comment-toggle");

        header.addEventListener("mousedown", e => {
            if (
                e.target.tagName === "INPUT" || 
                e.target.tagName === "BUTTON" || 
                e.target.id === "gm-comment-clear-btn"
            ) return;
            isDragging = true;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            floatingCommentWindow.classList.add("dragging");
        });

        document.addEventListener("mousemove", e => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                floatingCommentWindow.style.left = currentX + "px";
                floatingCommentWindow.style.top = currentY + "px";
                floatingCommentWindow.style.right = "auto";
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            floatingCommentWindow.classList.remove("dragging");
        });

        toggleBtn.addEventListener("click", () => {
            const isCollapsed = floatingCommentWindow.classList.toggle("collapsed");
            toggleBtn.textContent = isCollapsed ? "+" : "−";
        });

        // --- Search Logic ---
        const searchInput = floatingCommentWindow.querySelector("#gm-comment-search-input");
        const clearBtn = floatingCommentWindow.querySelector("#gm-comment-clear-btn");
        const searchBtn = floatingCommentWindow.querySelector("#gm-comment-search-btn");
        const prevBtn = floatingCommentWindow.querySelector("#gm-comment-prev-btn");
        const nextBtn = floatingCommentWindow.querySelector("#gm-comment-next-btn");

        let matchedElements = [];
        let currentMatchIndex = -1;

        function deepQuerySelectorAll(selector, root) {
            const results = [];
            const walk = (node) => {
                if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
                if (node.matches(selector)) results.push(node);
                if (node.shadowRoot) Array.from(node.shadowRoot.children).forEach(walk);
                Array.from(node.children).forEach(walk);
            };
            walk(root);
            return results;
        }

        function getSearchTextFromBiliRichText(el) {
            if (el.shadowRoot) {
                const contents = el.shadowRoot.querySelector("#contents") || el.shadowRoot.querySelector(".contents");
                return (contents ? contents.textContent : el.shadowRoot.textContent || "").toLowerCase();
            }
            return (el.textContent || "").toLowerCase();
        }

        function getClosestCommentContainer(element) {
            const selectors = "bili-comment-renderer, bili-reply-renderer, .reply-item, .root-reply, .comment-item";
            let curr = element;
            while (curr && curr !== document.body) {
                if (curr.nodeType === Node.ELEMENT_NODE && curr.matches(selectors)) return curr;
                curr = curr.parentNode || (curr.getRootNode && curr.getRootNode().host);
            }
            return null;
        }

        function clearCommentHighlights() {
            if (!commentAppElement) return;
            const matches = deepQuerySelectorAll(".gm-comment-match, .gm-comment-active", commentAppElement);
            matches.forEach(el => {
                el.classList.remove("gm-comment-match");
                el.classList.remove("gm-comment-active");
            });
        }

        function highlightMatch(index) {
            const actives = deepQuerySelectorAll(".gm-comment-active", commentAppElement);
            actives.forEach(el => el.classList.remove("gm-comment-active"));

            if (matchedElements.length === 0 || index < 0 || index >= matchedElements.length) return;

            const elToHighlight = matchedElements[index];
            if (elToHighlight) {
                // 注入样式到 Shadow DOM
                injectStyleToShadowRecursive(elToHighlight);
                
                elToHighlight.classList.add("gm-comment-active");
                elToHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
                showToast(`找到 ${index + 1} / ${matchedElements.length} 个匹配项`);
            }
            
            prevBtn.disabled = index <= 0;
            nextBtn.disabled = index >= matchedElements.length - 1;
        }

        function searchCommentsInDom(keyword) {
            if (!commentAppElement) return;
            console.log("[BiliToolbox] 搜索关键词:", keyword);
            clearCommentHighlights();
            matchedElements = [];
            currentMatchIndex = -1;

            const kw = keyword.trim().toLowerCase();
            if (!kw) return;

            const allRichTextElements = deepQuerySelectorAll("bili-rich-text", commentAppElement);
            const uniqueMatchedContainers = new Set();

            allRichTextElements.forEach(richTextEl => {
                const text = getSearchTextFromBiliRichText(richTextEl);
                if (text && text.includes(kw)) {
                    const container = getClosestCommentContainer(richTextEl);
                    if (container) uniqueMatchedContainers.add(container);
                }
            });

            matchedElements = Array.from(uniqueMatchedContainers).sort((a, b) => {
                return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
            });

            if (matchedElements.length > 0) {
                matchedElements.forEach(el => {
                    el.classList.add("gm-comment-match");
                    injectStyleToShadowRecursive(el); // 预注入样式
                });
                currentMatchIndex = 0;
                highlightMatch(currentMatchIndex);
            } else {
                showToast("未找到匹配的评论");
            }
        }

        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            clearCommentHighlights();
            matchedElements = [];
            currentMatchIndex = -1;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        });

        prevBtn.addEventListener("click", () => { if (currentMatchIndex > 0) highlightMatch(--currentMatchIndex); });
        nextBtn.addEventListener("click", () => { if (currentMatchIndex < matchedElements.length - 1) highlightMatch(++currentMatchIndex); });
        
        async function preloadComments(maxScrollTimes = 10) {
            const contentEl = floatingCommentWindow.querySelector(".gm-floating-comment-content");
            if (!contentEl) return;

            let lastHeight = 0;
            for (let i = 0; i < maxScrollTimes; i++) {
                contentEl.scrollTop = contentEl.scrollHeight;
                // 增加 1-2 秒随机延迟，避免被封禁
                const delay = Math.floor(Math.random() * 1000) + 1000;
                await new Promise(r => setTimeout(r, delay));
                const newHeight = contentEl.scrollHeight;
                if (newHeight === lastHeight) break;
                lastHeight = newHeight;
            }
        }

        async function expandReplies(maxClick = 50) {
            if (!commentAppElement) return;
            const buttons = deepQuerySelectorAll("button, a", commentAppElement).filter(el => {
                const t = (el.innerText || "").trim();
                return t.includes("展开") || t.includes("更多回复") || t.includes("查看全部");
            });

            for (let i = 0; i < Math.min(buttons.length, maxClick); i++) {
                buttons[i].click();
                // 增加 1-2 秒随机延迟，避免被封禁
                const delay = Math.floor(Math.random() * 1000) + 1000;
                await new Promise(r => setTimeout(r, delay));
            }
        }

        async function searchCommentsWithPreload(keyword) {
            const kw = keyword.trim();
            if (!kw) {
                showToast("请输入要搜索的关键词");
                return;
            }

            showToast("正在加载更多评论并搜索，请稍候…");
            await preloadComments();
            await expandReplies();
            searchCommentsInDom(kw);
        }

        searchBtn.addEventListener("click", () => searchCommentsWithPreload(searchInput.value));
        searchInput.addEventListener("keydown", e => { if (e.key === "Enter") searchCommentsWithPreload(searchInput.value); });
    }

    // --- Menu & Init ---
    function buildMenu() {
        const configs = [
            { key: CONFIG_WEBFULLSCREEN_KEY, label: "自动网页全屏", def: true },
            { key: CONFIG_LIGHTSOFF_KEY, label: "自动关灯模式", def: false },
            { key: CONFIG_COMMENT_WINDOW_KEY, label: "评论区悬浮窗", def: false },
            { key: CONFIG_PAGE_RESTRUCTURE_KEY, label: "页面重构最大化", def: false }
        ];
        configs.forEach(cfg => {
            const val = GM_getValue(cfg.key, cfg.def);
            GM_registerMenuCommand(`${cfg.label}: ${val ? "✅" : "❌"}`, () => {
                GM_setValue(cfg.key, !val);
                showToast("设置已更改，刷新页面后生效");
            });
        });
    }

    function initializeFeatures() {
        if (GM_getValue(CONFIG_WEBFULLSCREEN_KEY, true)) {
            setTimeout(() => {
                const btn = document.querySelector(".bpx-player-ctrl-web, [aria-label*='网页全屏']");
                if (btn) btn.click();
            }, 2000);
        }
        if (GM_getValue(CONFIG_COMMENT_WINDOW_KEY, false)) {
            setTimeout(createFloatingCommentWindow, 3000);
        }
        if (GM_getValue(CONFIG_PAGE_RESTRUCTURE_KEY, false)) {
            setTimeout(() => {
                document.body.classList.add("gm-page-restructure");
                const header = document.querySelector("#biliMainHeader");
                if (header) {
                    header.classList.add("collapsed");
                    document.body.classList.add("has-collapsed-header");
                    const btn = document.createElement("button");
                    btn.className = "gm-header-toggle";
                    btn.innerHTML = "☰";
                    btn.onclick = () => {
                        const isCollapsed = header.classList.toggle("collapsed");
                        document.body.classList.toggle("has-collapsed-header", isCollapsed);
                        btn.innerHTML = isCollapsed ? "☰" : "✕";
                    };
                    document.body.appendChild(btn);
                }
            }, 1500);
        }
    }

    buildMenu();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeFeatures);
    else initializeFeatures();
})();
