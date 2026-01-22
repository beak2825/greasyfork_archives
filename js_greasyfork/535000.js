// ==UserScript==
// @name         YouTube 增强工具包
// @name:zh-CN   YouTube 增强工具包 (网格布局 + Gemini总结)
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  YouTube enhancement toolkit: Grid layout controller (2/3/4/5 columns) + Gemini auto-summarize
// @description:zh-CN  YouTube增强工具包：网格布局控制器（2/3/4/5列）+ Gemini自动总结视频
// @author       hengyu
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @match        *://gemini.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535000/YouTube%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/535000/YouTube%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E5%8C%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============================================================
    //                    共享配置与工具函数
    // ============================================================

    const DEBUG = false;
    function debugLog(message) {
        if (DEBUG) console.log(`[YT-Toolkit] ${message}`);
    }

    // ============================================================
    //                    模块1: 网格布局控制器
    // ============================================================

    const GridLayout = (function () {
        const CONFIG = {
            DEFAULT_COLUMNS: 4,
            STORAGE_KEY: 'yt_grid_columns',
            COLUMN_OPTIONS: [2, 3, 4, 5],
            RETRY_INTERVAL: 500,
            MAX_RETRIES: 30
        };

        let currentColumns = CONFIG.DEFAULT_COLUMNS;

        try {
            currentColumns = GM_getValue(CONFIG.STORAGE_KEY, CONFIG.DEFAULT_COLUMNS);
        } catch (e) {
            debugLog('GM_getValue 不可用，使用默认值');
        }

        function saveColumns(columns) {
            currentColumns = columns;
            try {
                GM_setValue(CONFIG.STORAGE_KEY, columns);
            } catch (e) {
                localStorage.setItem(CONFIG.STORAGE_KEY, columns);
            }
        }

        function shouldApplyGrid() {
            const url = location.href;
            if (url.includes('/results') || url.includes('/watch') ||
                url.includes('/playlist') || url.includes('/shorts')) {
                return false;
            }
            return true;
        }

        function generateGridCSS(columns) {
            return `
                ytd-rich-grid-renderer {
                    --ytd-rich-grid-items-per-row: ${columns} !important;
                    --ytd-rich-grid-posts-per-row: ${columns} !important;
                    --ytd-rich-grid-slim-items-per-row: ${columns} !important;
                }
                ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer {
                    display: grid !important;
                    grid-template-columns: repeat(${columns}, minmax(0, 1fr)) !important;
                    gap: 16px 16px !important;
                    max-width: 100% !important;
                    padding: 0 24px !important;
                }
                ytd-rich-grid-row, ytd-rich-grid-row #contents {
                    display: contents !important;
                }
                ytd-rich-item-renderer {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                }
                ytd-rich-grid-media {
                    width: 100% !important;
                    max-width: 100% !important;
                }
                ytd-rich-grid-media ytd-thumbnail {
                    width: 100% !important;
                    max-width: 100% !important;
                }
                #details.ytd-rich-grid-media {
                    padding: 12px 0 24px 0 !important;
                }
                #video-title.ytd-rich-grid-media {
                    font-size: 14px !important;
                    line-height: 20px !important;
                    max-height: 40px !important;
                    overflow: hidden !important;
                }
                ytd-rich-grid-renderer[hide-chips-bar] {
                    padding-top: 24px !important;
                }
            `;
        }

        const controllerCSS = `
            #yt-grid-controller {
                display: flex !important;
                align-items: center !important;
                margin-right: 8px !important;
                position: relative !important;
                z-index: 9999 !important;
            }
            #yt-grid-btn {
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 8px 12px !important;
                background: rgba(255,255,255,0.1) !important;
                border: none !important;
                border-radius: 18px !important;
                cursor: pointer !important;
                font-family: 'YouTube Sans', 'Roboto', sans-serif !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                color: #fff !important;
                transition: background-color 0.2s !important;
            }
            #yt-grid-btn:hover {
                background: rgba(255,255,255,0.2) !important;
            }
            #yt-grid-btn svg {
                width: 20px !important;
                height: 20px !important;
                fill: currentColor !important;
            }
            #yt-grid-dropdown {
                display: none !important;
                position: absolute !important;
                top: 100% !important;
                right: 0 !important;
                margin-top: 4px !important;
                background: #282828 !important;
                border-radius: 12px !important;
                box-shadow: 0 4px 32px rgba(0,0,0,0.4) !important;
                overflow: hidden !important;
                z-index: 99999 !important;
                min-width: 120px !important;
            }
            #yt-grid-dropdown.show {
                display: block !important;
            }
            .yt-grid-option {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 10px 16px !important;
                cursor: pointer !important;
                font-family: 'YouTube Sans', 'Roboto', sans-serif !important;
                font-size: 14px !important;
                color: #fff !important;
                transition: background-color 0.15s !important;
                background: transparent !important;
            }
            .yt-grid-option:hover {
                background: rgba(255,255,255,0.1) !important;
            }
            .yt-grid-option.active {
                color: #3ea6ff !important;
            }
            .yt-grid-option.active::after {
                content: '✓' !important;
                margin-left: 8px !important;
            }
        `;

        function injectStyle(css, id) {
            const oldStyle = document.getElementById(id);
            if (oldStyle) oldStyle.remove();
            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
            return style;
        }

        function removeGridStyle() {
            const style = document.getElementById('yt-grid-style');
            if (style) style.remove();
        }

        function applyGridStyle(columns) {
            if (shouldApplyGrid()) {
                injectStyle(generateGridCSS(columns), 'yt-grid-style');
                debugLog('应用网格样式，列数: ' + columns);
            } else {
                removeGridStyle();
                debugLog('非目标页面，移除网格样式');
            }
        }

        function createController() {
            if (document.getElementById('yt-grid-controller')) return true;

            const controller = document.createElement('div');
            controller.id = 'yt-grid-controller';
            controller.innerHTML = '<button id="yt-grid-btn" title="调整网格布局"><svg viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg><span id="yt-grid-label">' + currentColumns + ' 列</span><svg width="12" height="12" viewBox="0 0 24 24" style="margin-left:2px"><path d="M7 10l5 5 5-5z"/></svg></button><div id="yt-grid-dropdown">' + CONFIG.COLUMN_OPTIONS.map(function (col) { return '<div class="yt-grid-option' + (col === currentColumns ? ' active' : '') + '" data-columns="' + col + '">' + col + ' 列</div>'; }).join('') + '</div>';

            const btn = controller.querySelector('#yt-grid-btn');
            const dropdown = controller.querySelector('#yt-grid-dropdown');
            const label = controller.querySelector('#yt-grid-label');

            btn.onclick = function (e) { e.stopPropagation(); dropdown.classList.toggle('show'); };

            dropdown.onclick = function (e) {
                const opt = e.target.closest('.yt-grid-option');
                if (opt) {
                    const cols = parseInt(opt.dataset.columns);
                    dropdown.querySelectorAll('.yt-grid-option').forEach(function (o) { o.classList.toggle('active', parseInt(o.dataset.columns) === cols); });
                    label.textContent = cols + ' 列';
                    applyGridStyle(cols);
                    saveColumns(cols);
                    dropdown.classList.remove('show');
                }
            };

            document.addEventListener('click', function () { dropdown.classList.remove('show'); });

            const targets = ['#end ytd-topbar-menu-button-renderer', '#buttons.ytd-masthead', '#end.ytd-masthead'];
            for (let i = 0; i < targets.length; i++) {
                const t = document.querySelector(targets[i]);
                if (t) {
                    if (targets[i].includes('button-renderer')) t.parentNode.insertBefore(controller, t);
                    else t.insertBefore(controller, t.firstChild);
                    return true;
                }
            }
            return false;
        }

        let lastURL = location.href;
        function checkURLChange() {
            if (location.href !== lastURL) {
                lastURL = location.href;
                setTimeout(function () { applyGridStyle(currentColumns); }, 100);
                setTimeout(function () { applyGridStyle(currentColumns); }, 500);
            }
        }

        function init() {
            injectStyle(controllerCSS, 'yt-grid-controller-style');
            applyGridStyle(currentColumns);

            let retries = 0;
            const check = setInterval(function () {
                if (document.querySelector('ytd-masthead') && createController()) {
                    clearInterval(check);
                    setInterval(checkURLChange, 300);
                    new MutationObserver(function () {
                        if (!document.getElementById('yt-grid-controller')) createController();
                    }).observe(document.documentElement, { childList: true, subtree: true });
                }
                if (++retries >= CONFIG.MAX_RETRIES) clearInterval(check);
            }, CONFIG.RETRY_INTERVAL);
        }

        return { init, applyGridStyle: function () { applyGridStyle(currentColumns); } };
    })();

    // ============================================================
    //                 模块2: Gemini 自动总结
    // ============================================================

    const GeminiSummarize = (function () {
        const CHECK_INTERVAL_MS = 200;
        const YOUTUBE_ELEMENT_TIMEOUT_MS = 10000;
        const GEMINI_ELEMENT_TIMEOUT_MS = 15000;
        const GEMINI_PROMPT_EXPIRY_MS = 300000;

        const YOUTUBE_NOTIFICATION_ID = 'gemini-yt-notification';
        const YOUTUBE_NOTIFICATION_STYLE = {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.85)', color: 'white', padding: '15px 35px 15px 20px',
            borderRadius: '8px', zIndex: '9999', maxWidth: 'calc(100% - 40px)', textAlign: 'left',
            boxSizing: 'border-box', whiteSpace: 'pre-wrap', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        };
        const BUTTON_ID = 'gemini-summarize-btn';
        const THUMBNAIL_BUTTON_CLASS = 'gemini-thumbnail-btn';

        // 辅助函数
        function waitForElement(selectors, timeoutMs, parent = document) {
            const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
            const combinedSelector = selectorArray.join(', ');

            return new Promise((resolve, reject) => {
                const initialElement = findVisibleElement(combinedSelector, parent);
                if (initialElement) return resolve(initialElement);

                let observer = null;
                let timeoutId = null;

                const cleanup = () => {
                    if (observer) { observer.disconnect(); observer = null; }
                    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
                };

                const onTimeout = () => {
                    cleanup();
                    reject(new Error(`Element not found: ${combinedSelector}`));
                };

                const checkNode = (node) => {
                    if (node && node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches(combinedSelector) && isElementVisible(node)) {
                            cleanup(); resolve(node); return true;
                        }
                        const foundDescendant = findVisibleElement(combinedSelector, node);
                        if (foundDescendant) { cleanup(); resolve(foundDescendant); return true; }
                    }
                    return false;
                };

                timeoutId = setTimeout(onTimeout, timeoutMs);

                observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            for (const node of mutation.addedNodes) {
                                if (checkNode(node)) return;
                            }
                        } else if (mutation.type === 'attributes') {
                            if (checkNode(mutation.target)) return;
                        }
                    }
                    const element = findVisibleElement(combinedSelector, parent);
                    if (element) { cleanup(); resolve(element); }
                });

                observer.observe(parent === document ? document.documentElement : parent, {
                    childList: true, subtree: true, attributes: true,
                    attributeFilter: ['style', 'class', 'disabled']
                });
            });
        }

        function findVisibleElement(selector, parent) {
            try {
                const elements = parent.querySelectorAll(selector);
                for (const el of elements) {
                    if (isElementVisible(el)) {
                        if (selector.includes('button') && el.disabled) continue;
                        return el;
                    }
                }
            } catch (e) { }
            return null;
        }

        function isElementVisible(el) {
            if (!el) return false;
            return (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).catch(err => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                try { document.execCommand('copy'); } catch (e) { }
                document.body.removeChild(textarea);
            });
        }

        function showNotification(elementId, message, styles, duration = 15000) {
            let existingNotification = document.getElementById(elementId);
            if (existingNotification) {
                const existingTimeoutId = existingNotification.dataset.timeoutId;
                if (existingTimeoutId) clearTimeout(parseInt(existingTimeoutId));
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.id = elementId;
            notification.textContent = message;
            Object.assign(notification.style, styles);
            document.body.appendChild(notification);

            const closeButton = document.createElement('button');
            closeButton.textContent = '✕';
            Object.assign(closeButton.style, {
                position: 'absolute', top: '5px', right: '10px', background: 'transparent',
                border: 'none', color: 'inherit', fontSize: '16px', cursor: 'pointer', padding: '0', lineHeight: '1'
            });
            closeButton.onclick = () => notification.remove();
            notification.appendChild(closeButton);

            const timeoutId = setTimeout(() => notification.remove(), duration);
            notification.dataset.timeoutId = timeoutId.toString();
        }

        function isVideoPage() {
            return window.location.pathname === '/watch' && new URLSearchParams(window.location.search).has('v');
        }

        function getVideoInfoFromElement(element) {
            try {
                let videoId = '';
                const linkElement = element.querySelector('a[href*="/watch?v="]');
                if (linkElement) {
                    const href = linkElement.getAttribute('href');
                    const match = href.match(/\/watch\?v=([^&]+)/);
                    if (match && match[1]) videoId = match[1];
                }

                let videoTitle = '';
                const titleElement = element.querySelector('#video-title, .title, [title]');
                if (titleElement) {
                    videoTitle = titleElement.textContent?.trim() || titleElement.getAttribute('title')?.trim() || '';
                }

                if (!videoId || !videoTitle) return null;
                return { id: videoId, title: videoTitle, url: `https://www.youtube.com/watch?v=${videoId}` };
            } catch (error) {
                return null;
            }
        }

        function handleThumbnailButtonClick(event, videoInfo) {
            event.preventDefault();
            event.stopPropagation();

            try {
                if (!videoInfo || !videoInfo.url || !videoInfo.title) throw new Error('视频信息不完整');

                const prompt = `请分析这个YouTube视频: ${videoInfo.url}\n\n提供一个全面的摘要，包括主要观点、关键见解和视频中讨论的重要细节，以结构化的方式分解内容，并包括任何重要的结论或要点。`;

                GM_setValue('geminiPrompt', prompt);
                GM_setValue('videoTitle', videoInfo.title);
                GM_setValue('timestamp', Date.now());

                window.open('https://gemini.google.com/', '_blank');

                const notificationMessage = `已跳转到 Gemini！\n系统将尝试自动输入提示词并发送请求。\n\n视频: "${videoInfo.title}"\n\n(如果自动操作失败，提示词已复制到剪贴板，请手动粘贴)`;
                showNotification(YOUTUBE_NOTIFICATION_ID, notificationMessage, YOUTUBE_NOTIFICATION_STYLE, 10000);
                copyToClipboard(prompt);

            } catch (error) {
                showNotification(YOUTUBE_NOTIFICATION_ID, `创建摘要时出错: ${error.message}`, { ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' }, 10000);
            }
        }

        function addThumbnailButtons() {
            const videoElementSelectors = [
                'ytd-rich-item-renderer', 'ytd-grid-video-renderer', 'ytd-video-renderer',
                'ytd-compact-video-renderer', 'ytd-playlist-video-renderer'
            ];

            const videoElements = document.querySelectorAll(videoElementSelectors.join(','));

            videoElements.forEach(element => {
                if (element.querySelector(`.${THUMBNAIL_BUTTON_CLASS}`)) return;

                const thumbnailContainer = element.querySelector('#thumbnail, .thumbnail, a[href*="/watch"]');
                if (!thumbnailContainer) return;

                const videoInfo = getVideoInfoFromElement(element);
                if (!videoInfo) return;

                const button = document.createElement('button');
                button.className = THUMBNAIL_BUTTON_CLASS;
                button.textContent = '📝 总结';
                button.title = '使用Gemini总结此视频';
                button.addEventListener('click', (e) => handleThumbnailButtonClick(e, videoInfo));

                // 只在容器没有定位属性时才添加 relative，避免破坏原有布局
                const computedStyle = window.getComputedStyle(thumbnailContainer);
                if (computedStyle.position === 'static') {
                    thumbnailContainer.style.position = 'relative';
                }
                thumbnailContainer.appendChild(button);
            });
        }

        function setupThumbnailButtonObserver() {
            addThumbnailButtons();

            const observer = new MutationObserver((mutations) => {
                let shouldAddButtons = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.tagName && (node.tagName.toLowerCase().includes('ytd-') ||
                                    node.querySelector('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer'))) {
                                    shouldAddButtons = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (shouldAddButtons) break;
                }

                if (shouldAddButtons) {
                    clearTimeout(window.thumbnailButtonTimeout);
                    window.thumbnailButtonTimeout = setTimeout(addThumbnailButtons, 200);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            window.addEventListener('yt-navigate-finish', () => {
                setTimeout(addThumbnailButtons, 300);
            });
        }

        async function addSummarizeButton() {
            if (!isVideoPage()) {
                removeSummarizeButtonIfExists();
                return;
            }

            if (document.getElementById(BUTTON_ID)) return;

            const containerSelectors = [
                '#top-row.ytd-watch-metadata > #subscribe-button',
                '#meta-contents #subscribe-button',
                '#owner #subscribe-button',
                '#meta-contents #top-row',
                '#above-the-fold #title',
                'ytd-watch-metadata #actions',
                '#masthead #end'
            ];

            try {
                const anchorElement = await waitForElement(containerSelectors, YOUTUBE_ELEMENT_TIMEOUT_MS);
                if (document.getElementById(BUTTON_ID)) return;

                const button = document.createElement('button');
                button.id = BUTTON_ID;
                button.textContent = '📝 Gemini摘要';

                Object.assign(button.style, {
                    backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '18px',
                    padding: '0 16px', margin: '0 8px', cursor: 'pointer', fontWeight: '500',
                    height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', zIndex: '100', whiteSpace: 'nowrap', transition: 'background-color 0.3s ease'
                });
                button.onmouseover = () => button.style.backgroundColor = '#185abc';
                button.onmouseout = () => button.style.backgroundColor = '#1a73e8';

                button.addEventListener('click', handleSummarizeClick);

                if (anchorElement.id?.includes('subscribe-button') || anchorElement.tagName === 'BUTTON') {
                    anchorElement.parentNode.insertBefore(button, anchorElement);
                } else if (anchorElement.id === 'actions' || anchorElement.id === 'end' || anchorElement.id === 'top-row') {
                    anchorElement.insertBefore(button, anchorElement.firstChild);
                } else {
                    anchorElement.appendChild(button);
                }

            } catch (error) {
                removeSummarizeButtonIfExists();
            }
        }

        function handleSummarizeClick() {
            try {
                const youtubeUrl = window.location.href;
                const titleElement = document.querySelector('h1.ytd-watch-metadata, #video-title, #title h1');
                const videoTitle = titleElement?.textContent?.trim() || document.title.replace(/ - YouTube$/, '').trim() || 'Unknown Video';

                const prompt = `请分析这个YouTube视频: ${youtubeUrl}\n\n提供一个全面的摘要，包括主要观点、关键见解和视频中讨论的重要细节，以结构化的方式分解内容，并包括任何重要的结论或要点。`;

                GM_setValue('geminiPrompt', prompt);
                GM_setValue('videoTitle', videoTitle);
                GM_setValue('timestamp', Date.now());

                window.open('https://gemini.google.com/', '_blank');

                const notificationMessage = `已跳转到 Gemini！\n系统将尝试自动输入提示词并发送请求。\n\n视频: "${videoTitle}"\n\n(如果自动操作失败，提示词已复制到剪贴板，请手动粘贴)`;
                showNotification(YOUTUBE_NOTIFICATION_ID, notificationMessage, YOUTUBE_NOTIFICATION_STYLE, 10000);
                copyToClipboard(prompt);

            } catch (error) {
                showNotification(YOUTUBE_NOTIFICATION_ID, `创建摘要时出错: ${error.message}`, { ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' }, 10000);
            }
        }

        function removeSummarizeButtonIfExists() {
            const button = document.getElementById(BUTTON_ID);
            if (button) button.remove();
        }

        // --- Gemini 页面处理 ---
        const GEMINI_NOTIFICATION_ID = 'gemini-auto-notification';
        const GEMINI_NOTIFICATION_STYLES = {
            info: { backgroundColor: '#e8f4fd', color: '#1967d2', border: '1px solid #a8c7fa' },
            warning: { backgroundColor: '#fef7e0', color: '#a56300', border: '1px solid #fdd663' },
            error: { backgroundColor: '#fce8e6', color: '#c5221f', border: '1px solid #f7a7a5' }
        };
        const BASE_GEMINI_NOTIFICATION_STYLE = {
            position: 'fixed', bottom: '20px', right: '20px', padding: '15px 35px 15px 20px',
            borderRadius: '8px', zIndex: '9999', maxWidth: '350px', textAlign: 'left',
            boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', whiteSpace: 'pre-wrap'
        };

        function showGeminiNotification(message, type = "info") {
            const style = { ...BASE_GEMINI_NOTIFICATION_STYLE, ...(GEMINI_NOTIFICATION_STYLES[type] || GEMINI_NOTIFICATION_STYLES.info) };
            showNotification(GEMINI_NOTIFICATION_ID, message, style, 12000);
        }

        async function handleGeminiPage() {
            const prompt = GM_getValue('geminiPrompt', '');
            const timestamp = GM_getValue('timestamp', 0);
            const videoTitle = GM_getValue('videoTitle', 'N/A');

            if (!prompt || Date.now() - timestamp > GEMINI_PROMPT_EXPIRY_MS) {
                GM_deleteValue('geminiPrompt');
                GM_deleteValue('timestamp');
                GM_deleteValue('videoTitle');
                return;
            }

            showGeminiNotification(`检测到来自 YouTube 的请求...\n视频: "${videoTitle}"\n\n正在等待 Gemini 加载...`, "info");

            // 等待2秒确保页面完全加载
            await new Promise(resolve => setTimeout(resolve, 2000));

            const textareaSelectors = [
                'div.input-area > div.input-box > div[contenteditable="true"]',
                'div[role="textbox"][contenteditable="true"]',
                'div[contenteditable="true"]',
                'textarea'
            ];
            const sendButtonSelectors = [
                'button[aria-label*="Send message"], button[aria-label*="发送消息"]',
                'button[aria-label*="Send"], button[aria-label*="发送"]',
                'button.send-button'
            ];

            try {
                const textarea = await waitForElement(textareaSelectors, GEMINI_ELEMENT_TIMEOUT_MS);
                textarea.focus();

                if (textarea.isContentEditable) {
                    textarea.textContent = prompt;
                } else if (textarea.tagName === 'TEXTAREA') {
                    textarea.value = prompt;
                }

                textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

                await new Promise(resolve => setTimeout(resolve, 300));

                const sendButton = await waitForElement(sendButtonSelectors, GEMINI_ELEMENT_TIMEOUT_MS);

                if (sendButton.disabled || sendButton.getAttribute('aria-disabled') === 'true') {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                if (!sendButton.disabled) {
                    sendButton.click();
                    const successMessage = `已自动发送视频摘要请求！\n正在为视频分析做准备:\n"${videoTitle}"\n\n请稍候...`;
                    showGeminiNotification(successMessage, "info");
                }

                GM_deleteValue('geminiPrompt');
                GM_deleteValue('timestamp');
                GM_deleteValue('videoTitle');

            } catch (error) {
                showGeminiNotification(`自动操作失败: ${error.message}\n\n提示词已复制到剪贴板，请手动粘贴并发送。`, "error");
                copyToClipboard(prompt);
                GM_deleteValue('geminiPrompt');
                GM_deleteValue('timestamp');
                GM_deleteValue('videoTitle');
            }
        }

        function initYouTube() {
            // 缩略图按钮样式
            GM_addStyle(`
                .${THUMBNAIL_BUTTON_CLASS} {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 12px;
                    cursor: pointer;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                #dismissible:hover .${THUMBNAIL_BUTTON_CLASS},
                ytd-grid-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
                ytd-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
                ytd-rich-item-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
                ytd-compact-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS} {
                    opacity: 1;
                }
                .${THUMBNAIL_BUTTON_CLASS}:hover {
                    background-color: rgba(0, 0, 0, 0.9);
                }
            `);

            setupThumbnailButtonObserver();
            addSummarizeButton();

            window.addEventListener('yt-navigate-finish', () => {
                requestAnimationFrame(addSummarizeButton);
            });

            window.addEventListener('popstate', () => {
                requestAnimationFrame(addSummarizeButton);
            });
        }

        function initGemini() {
            handleGeminiPage();
        }

        return { initYouTube, initGemini };
    })();

    // ============================================================
    //                       主程序入口
    // ============================================================

    debugLog("脚本开始执行...");

    if (window.location.hostname.includes('youtube.com')) {
        debugLog("YouTube 域名检测到");

        // 初始化网格布局
        if (document.documentElement) GridLayout.init();
        window.addEventListener('load', GridLayout.applyGridStyle);

        // 初始化 Gemini 总结功能
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            GeminiSummarize.initYouTube();
        } else {
            window.addEventListener('DOMContentLoaded', GeminiSummarize.initYouTube, { once: true });
        }

    } else if (window.location.hostname.includes('gemini.google.com')) {
        debugLog("Gemini 域名检测到");

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            GeminiSummarize.initGemini();
        } else {
            window.addEventListener('DOMContentLoaded', GeminiSummarize.initGemini, { once: true });
        }
    }

    debugLog("脚本加载完成");

})();
