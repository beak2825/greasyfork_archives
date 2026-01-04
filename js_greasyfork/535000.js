// ==UserScript==
// @name         YouTube to Gemini 自动总结与字幕 (优化版)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  YouTube 首页/搜索分段缩略图网格100%修复，Gemini一键总结/字幕 (性能优化版)
// @author       hengyu (优化 by Assistant)
// @match        *://www.youtube.com/*
// @match        *://gemini.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535000/YouTube%20to%20Gemini%20%E8%87%AA%E5%8A%A8%E6%80%BB%E7%BB%93%E4%B8%8E%E5%AD%97%E5%B9%95%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535000/YouTube%20to%20Gemini%20%E8%87%AA%E5%8A%A8%E6%80%BB%E7%BB%93%E4%B8%8E%E5%AD%97%E5%B9%95%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 性能优化变量 ---
    let debounceTimer = null;
    let lastProcessedCount = 0;
    // 修复问题2：使用Map替代WeakSet，可以清理和重新处理
    const processedElements = new Map(); // key: element, value: {videoId, timestamp}
    const ELEMENT_CACHE_TIME = 60000; // 1分钟后允许重新处理

    // --- 终极分段网格修复 CSS ---
    // 只对首页和搜索结果页面应用网格布局修复
    GM_addStyle(`
    /* 首页和搜索页面网格布局 */
    body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents,
    body[data-page-type="search"] ytd-rich-grid-renderer > #contents {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 24px 16px !important;
        width: 100% !important;
        margin: 0 auto !important;
        --ytd-rich-grid-items-per-row: 2 !important;
        --ytd-rich-grid-max-width: none !important;
    }
    @media (min-width: 1000px) {
        body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents,
        body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents,
        body[data-page-type="search"] ytd-rich-grid-renderer > #contents {
            grid-template-columns: repeat(3, 1fr) !important;
            --ytd-rich-grid-items-per-row: 3 !important;
        }
    }
    @media (min-width: 1400px) {
        body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents,
        body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents,
        body[data-page-type="search"] ytd-rich-grid-renderer > #contents {
            grid-template-columns: repeat(4, 1fr) !important;
            --ytd-rich-grid-items-per-row: 4 !important;
        }
    }
    @media (min-width: 1700px) {
        body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents,
        body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents,
        body[data-page-type="search"] ytd-rich-grid-renderer > #contents {
            grid-template-columns: repeat(5, 1fr) !important;
            --ytd-rich-grid-items-per-row: 5 !important;
        }
    }

    /* 确保只在首页和搜索页面修改布局结构 */
    body[data-is-home-page="true"] ytd-rich-grid-row,
    body[data-is-home-page="true"] ytd-rich-grid-row > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row > #dismissible,
    body[data-is-home-page="true"] ytd-rich-grid-row > div,
    body[data-is-home-page="true"] ytd-rich-grid-row > #dismissible > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row > div > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row > div > #dismissible,
    body[data-is-home-page="true"] ytd-rich-grid-row > div > #dismissible > #contents,
    body[data-is-home-page="true"] ytd-rich-grid-row > .ytd-rich-grid-row,
    body[data-is-home-page="true"] ytd-rich-grid-row > div > .ytd-rich-grid-row,
    body[data-is-home-page="true"] ytd-rich-grid-row > div > div,
    body[data-is-home-page="true"] ytd-rich-grid-row > div > div > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row,
    body[data-page-subtype="home"] ytd-rich-grid-row > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row > #dismissible,
    body[data-page-subtype="home"] ytd-rich-grid-row > div,
    body[data-page-subtype="home"] ytd-rich-grid-row > #dismissible > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row > div > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row > div > #dismissible,
    body[data-page-subtype="home"] ytd-rich-grid-row > div > #dismissible > #contents,
    body[data-page-subtype="home"] ytd-rich-grid-row > .ytd-rich-grid-row,
    body[data-page-subtype="home"] ytd-rich-grid-row > div > .ytd-rich-grid-row,
    body[data-page-subtype="home"] ytd-rich-grid-row > div > div,
    body[data-page-subtype="home"] ytd-rich-grid-row > div > div > #contents,
    body[data-page-type="search"] ytd-rich-grid-row,
    body[data-page-type="search"] ytd-rich-grid-row > #contents,
    body[data-page-type="search"] ytd-rich-grid-row > #dismissible,
    body[data-page-type="search"] ytd-rich-grid-row > div,
    body[data-page-type="search"] ytd-rich-grid-row > #dismissible > #contents,
    body[data-page-type="search"] ytd-rich-grid-row > div > #contents,
    body[data-page-type="search"] ytd-rich-grid-row > div > #dismissible,
    body[data-page-type="search"] ytd-rich-grid-row > div > #dismissible > #contents,
    body[data-page-type="search"] ytd-rich-grid-row > .ytd-rich-grid-row,
    body[data-page-type="search"] ytd-rich-grid-row > div > .ytd-rich-grid-row,
    body[data-page-type="search"] ytd-rich-grid-row > div > div,
    body[data-page-type="search"] ytd-rich-grid-row > div > div > #contents {
        display: contents !important;
    }

    /* 视频项修复 - 仅限首页和搜索页面 */
    body[data-is-home-page="true"] ytd-rich-item-renderer,
    body[data-is-home-page="true"] ytd-grid-video-renderer,
    body[data-is-home-page="true"] ytd-rich-grid-media,
    body[data-page-subtype="home"] ytd-rich-item-renderer,
    body[data-page-subtype="home"] ytd-grid-video-renderer,
    body[data-page-subtype="home"] ytd-rich-grid-media,
    body[data-page-type="search"] ytd-rich-item-renderer,
    body[data-page-type="search"] ytd-grid-video-renderer,
    body[data-page-type="search"] ytd-rich-grid-media {
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
    }

    /* 弹性项 - 仅首页和搜索页面 */
    body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer,
    body[data-is-home-page="true"] ytd-rich-grid-renderer > #contents > ytd-reel-shelf-renderer,
    body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer,
    body[data-page-subtype="home"] ytd-rich-grid-renderer > #contents > ytd-reel-shelf-renderer,
    body[data-page-type="search"] ytd-rich-grid-renderer > #contents > ytd-rich-section-renderer,
    body[data-page-type="search"] ytd-rich-grid-renderer > #contents > ytd-reel-shelf-renderer {
        grid-column: 1 / -1 !important;
        width: 100% !important;
        margin: 16px 0 !important;
    }

    /* 搜索页面修复 */
    ytd-search ytd-video-renderer {
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
    }

    ytd-search ytd-thumbnail {
        position: relative !important;
        z-index: 5 !important;
    }
    `);

    // --- Gemini 按钮与交互 ---
    const PROMPT_KEY = 'geminiPrompt';
    const TITLE_KEY = 'videoTitle';
    const ORIGINAL_TITLE_KEY = 'geminiOriginalVideoTitle';
    const TIMESTAMP_KEY = 'timestamp';
    const ACTION_TYPE_KEY = 'geminiActionType';
    const VIDEO_TOTAL_DURATION_KEY = 'geminiVideoTotalDuration';
    const FIRST_SEGMENT_END_TIME_KEY = 'geminiFirstSegmentEndTime';
    const SUMMARY_BUTTON_ID = 'gemini-summarize-btn';
    const SUBTITLE_BUTTON_ID = 'gemini-subtitle-btn';
    const THUMBNAIL_BUTTON_CLASS = 'gemini-thumbnail-btn';
    const THUMBNAIL_PROCESSED_FLAG = 'data-gemini-processed';
    const YOUTUBE_NOTIFICATION_ID = 'gemini-yt-notification';
    const YOUTUBE_CONFIRMATION_ID = 'gemini-yt-confirmation';
    // 修复问题3：添加唯一会话ID
    const SESSION_ID_KEY = 'geminiSessionId';

    // 恢复原始通知样式
    const YOUTUBE_NOTIFICATION_STYLE = {
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.85)', color: 'white', padding: '15px 35px 15px 20px',
        borderRadius: '8px', zIndex: '99999', maxWidth: 'calc(100% - 40px)', textAlign: 'left',
        boxSizing: 'border-box', whiteSpace: 'pre-wrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    };
    const YOUTUBE_CONFIRMATION_STYLE = {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(33, 33, 33, 0.95)', color: 'white', padding: '20px 25px',
        borderRadius: '12px', zIndex: '999999', maxWidth: 'calc(100% - 60px)', minWidth: '300px',
        boxSizing: 'border-box', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', gap: '15px'
    };

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
        z-index: 9999;
        display: flex;
        align-items: center;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: auto !important;
    }
    #dismissible:hover .${THUMBNAIL_BUTTON_CLASS},
    ytd-grid-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
    ytd-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
    ytd-rich-item-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
    ytd-compact-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
    ytd-playlist-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
    ytd-reel-item-renderer:hover .${THUMBNAIL_BUTTON_CLASS},
    ytd-search ytd-video-renderer:hover .${THUMBNAIL_BUTTON_CLASS} {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
    }
    .${THUMBNAIL_BUTTON_CLASS}:hover {
        background-color: rgba(0, 0, 0, 0.9);
        opacity: 1 !important;
        visibility: visible !important;
    }

    /* 搜索页面视频预览时的特殊处理 */
    ytd-search .ytp-inline-preview-scrim ~ .${THUMBNAIL_BUTTON_CLASS},
    ytd-search video ~ .${THUMBNAIL_BUTTON_CLASS},
    ytd-search .html5-video-player ~ .${THUMBNAIL_BUTTON_CLASS} {
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
        z-index: 99999 !important;
    }

    /* 确保搜索页面的按钮在视频预览时仍然可见 */
    ytd-search ytd-video-renderer:has(video) .${THUMBNAIL_BUTTON_CLASS},
    ytd-search ytd-video-renderer:has(.ytp-inline-preview-scrim) .${THUMBNAIL_BUTTON_CLASS} {
        opacity: 1 !important;
        z-index: 99999 !important;
    }

    .gemini-confirmation-btn {
        padding: 8px 20px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        transition: background-color 0.2s ease;
    }
    .gemini-confirmation-confirm {
        background-color: #1a73e8;
        color: white;
    }
    .gemini-confirmation-confirm:hover {
        background-color: #0d65d9;
    }
    .gemini-confirmation-cancel {
        background-color: #5f6368;
        color: white;
        margin-right: 10px;
    }
    .gemini-confirmation-cancel:hover {
        background-color: #494c50;
    }
    `);

    // 辅助函数
    function showNotification(elementId, message, styles, duration = 15000) {
        let existing = document.getElementById(elementId);
        if (existing) {
            clearTimeout(parseInt(existing.dataset.timeoutId));
            existing.remove();
        }
        const notif = document.createElement('div');
        notif.id = elementId;
        notif.textContent = message;
        Object.assign(notif.style, styles);
        document.body.appendChild(notif);
        const btn = document.createElement('button');
        btn.textContent = '✕';
        Object.assign(btn.style, { position: 'absolute', top: '5px', right: '10px', background: 'transparent', border: 'none', color: 'inherit', fontSize: '16px', cursor: 'pointer', padding: '0', lineHeight: '1' });
        btn.onclick = () => notif.remove();
        notif.appendChild(btn);
        notif.dataset.timeoutId = setTimeout(() => notif.remove(), duration).toString();
        return notif;
    }

    function showConfirmation(elementId, title, message, videoInfo, onConfirm, onCancel, styles) {
        let existing = document.getElementById(elementId);
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = elementId;
        Object.assign(dialog.style, styles);
        document.body.appendChild(dialog);

        const titleElem = document.createElement('h3');
        titleElem.textContent = title;
        titleElem.style.margin = '0 0 10px 0';
        titleElem.style.fontSize = '18px';

        const messageElem = document.createElement('div');
        messageElem.textContent = message;
        messageElem.style.marginBottom = '15px';
        messageElem.style.fontSize = '14px';

        const videoTitleElem = document.createElement('div');
        videoTitleElem.textContent = `视频标题: ${videoInfo.title}`;
        videoTitleElem.style.marginBottom = '5px';
        videoTitleElem.style.fontWeight = 'bold';

        const videoIdElem = document.createElement('div');
        videoIdElem.textContent = `视频ID: ${videoInfo.id}`;
        videoIdElem.style.fontSize = '12px';
        videoIdElem.style.color = '#aaa';
        videoIdElem.style.marginBottom = '15px';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'flex-end';
        buttonsContainer.style.gap = '10px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.className = 'gemini-confirmation-btn gemini-confirmation-cancel';
        cancelBtn.onclick = () => {
            dialog.remove();
            if (onCancel) onCancel();
        };

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.className = 'gemini-confirmation-btn gemini-confirmation-confirm';
        confirmBtn.onclick = () => {
            dialog.remove();
            if (onConfirm) onConfirm(videoInfo);
        };

        buttonsContainer.appendChild(cancelBtn);
        buttonsContainer.appendChild(confirmBtn);

        dialog.appendChild(titleElem);
        dialog.appendChild(messageElem);
        dialog.appendChild(videoTitleElem);
        dialog.appendChild(videoIdElem);
        dialog.appendChild(buttonsContainer);

        return dialog;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch {}
            document.body.removeChild(ta);
        });
    }

    function isVideoPage() {
        return window.location.pathname === '/watch' && new URLSearchParams(window.location.search).has('v');
    }

    // 验证YouTube视频ID格式
    function isValidYouTubeVideoId(id) {
        return id && typeof id === 'string' && /^[A-Za-z0-9_-]{11}$/.test(id);
    }

    // 生成唯一会话ID
    function generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // --- 优化后的视频信息提取函数 ---
    function getVideoInfoFromElement(element) {
        // 修复问题2：检查缓存是否过期
        const cached = processedElements.get(element);
        if (cached && (Date.now() - cached.timestamp < ELEMENT_CACHE_TIME)) {
            return null; // 仍在缓存期内
        }

        let videoId = '';
        let videoTitle = '';

        // 优化：优先检查最可能的数据属性
        const possibleIdSources = [
            () => element.dataset?.videoId,
            () => element.getAttribute('video-id'),
            () => {
                // 优化的链接查找 - 使用更精确的选择器
                const link = element.querySelector('a[href*="/watch?v="]:first-child');
                if (link) {
                    const match = link.href.match(/\/watch\?v=([^&]+)/);
                    return match?.[1];
                }
            },
            () => {
                // 优化的缩略图查找
                const img = element.querySelector('img[src*="/vi/"]:first-child, img[src*="i.ytimg.com"]:first-child');
                if (img) {
                    const match = img.src.match(/\/vi\/([^\/]+)\//) || img.src.match(/\/([A-Za-z0-9_-]{11})\/[\w]+\.jpg/);
                    return match?.[1];
                }
            }
        ];

        // 按优先级尝试获取视频ID
        for (const getSource of possibleIdSources) {
            const id = getSource();
            if (isValidYouTubeVideoId(id)) {
                videoId = id;
                break;
            }
        }

        // 优化的标题提取 - 按优先级排序
        const titleSelectors = [
            '#video-title',
            'h3 a[title]',
            '.title[title]',
            'yt-formatted-string[title]',
            'span[title]'
        ];

        for (const selector of titleSelectors) {
            const titleElement = element.querySelector(selector);
            if (titleElement) {
                const possibleTitle = titleElement.textContent?.trim() ||
                                     titleElement.getAttribute('title')?.trim();
                if (possibleTitle && possibleTitle.length > 5) {
                    videoTitle = possibleTitle;
                    break;
                }
            }
        }

        // 验证结果
        if (!isValidYouTubeVideoId(videoId) || !videoTitle) {
            return null;
        }

        // 更新缓存
        processedElements.set(element, {
            videoId: videoId,
            timestamp: Date.now()
        });

        return {
            id: videoId,
            title: videoTitle,
            url: `https://www.youtube.com/watch?v=${videoId}`
        };
    }

    function processVideoSummary(videoInfo) {
        const prompt = `请分析这个YouTube视频: ${videoInfo.url}\n\n提供一个全面的摘要，包括主要观点、关键见解和视频中讨论的重要细节，以结构化的方式分解内容，并包括任何重要的结论或要点。`;

        // 修复问题3：生成唯一会话ID
        const sessionId = generateSessionId();

        GM_setValue(PROMPT_KEY, prompt);
        GM_setValue(TITLE_KEY, videoInfo.title);
        GM_setValue(ORIGINAL_TITLE_KEY, videoInfo.title);
        GM_setValue(TIMESTAMP_KEY, Date.now());
        GM_setValue(ACTION_TYPE_KEY, 'summary');
        GM_setValue(SESSION_ID_KEY, sessionId);

        window.open('https://gemini.google.com/', '_blank');

        showNotification(
            YOUTUBE_NOTIFICATION_ID,
            `已跳转到 Gemini！\n系统将尝试自动输入提示词并发送请求。\n\n视频: "${videoInfo.title}"\n\n(如果自动操作失败，提示词已复制到剪贴板，请手动粘贴)`,
            YOUTUBE_NOTIFICATION_STYLE,
            10000
        );

        copyToClipboard(prompt);
    }

    function handleThumbnailButtonClick(event, videoInfo) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            if (event.cancelable) event.returnValue = false;
        }

        if (!videoInfo || !videoInfo.url || !videoInfo.title) {
            showNotification(
                YOUTUBE_NOTIFICATION_ID,
                "无法获取视频信息，请尝试直接在视频页面使用总结功能。",
                { ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' },
                5000
            );
            return false;
        }

        if (!isValidYouTubeVideoId(videoInfo.id)) {
            showNotification(
                YOUTUBE_NOTIFICATION_ID,
                `获取到的视频ID格式无效: ${videoInfo.id}\n请尝试直接在视频页面使用总结功能。`,
                { ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' },
                5000
            );
            return false;
        }

        showConfirmation(
            YOUTUBE_CONFIRMATION_ID,
            "确认视频信息",
            "请确认以下视频信息是否正确:",
            videoInfo,
            processVideoSummary,
            null,
            YOUTUBE_CONFIRMATION_STYLE
        );

        return false;
    }

    // --- 优化后的缩略图按钮添加函数 ---
    function addThumbnailButtons() {
        if (isVideoPage()) return;

        const isSearchPage = window.location.pathname === '/results';

        // 优化：使用更精确的选择器，减少误匹配
        const videoElementSelectors = isSearchPage ? [
            'ytd-search ytd-video-renderer:has(ytd-thumbnail)',
            'ytd-video-renderer:has(#thumbnail)'
        ] : [
            'ytd-rich-item-renderer:has(ytd-thumbnail)',
            'ytd-grid-video-renderer:has(#thumbnail)',
            'ytd-compact-video-renderer:has(ytd-thumbnail)',
            'ytd-playlist-video-renderer:has(ytd-thumbnail)'
        ];

        let processedCount = 0;
        const elements = document.querySelectorAll(videoElementSelectors.join(','));

        // 优化：如果元素数量没有变化，且已经处理过相同数量，则跳过
        if (elements.length === lastProcessedCount && elements.length > 0) {
            // 快速验证是否所有元素都已处理
            let allProcessed = true;
            for (const element of elements) {
                if (!element.hasAttribute(THUMBNAIL_PROCESSED_FLAG)) {
                    allProcessed = false;
                    break;
                }
            }
            if (allProcessed) return;
        }

        elements.forEach(element => {
            // 优化：更快的已处理检查
            if (element.hasAttribute(THUMBNAIL_PROCESSED_FLAG)) {
                processedCount++;
                return;
            }

            // 优化：更精确的缩略图容器查找
            let thumbnailContainer = element.querySelector('ytd-thumbnail a, #thumbnail');
            if (!thumbnailContainer) return;

            const videoInfo = getVideoInfoFromElement(element);
            if (!videoInfo) return;

            const button = document.createElement('button');
            button.className = THUMBNAIL_BUTTON_CLASS;
            button.textContent = '📝 总结';
            button.title = '使用Gemini总结此视频';

            // 优化：简化事件处理
            const eventHandler = (e) => {
                if (e.type === 'click') {
                    return handleThumbnailButtonClick(e, videoInfo);
                }
                e.stopPropagation();
                e.preventDefault();
                return false;
            };

            button.addEventListener('click', eventHandler, { capture: true, passive: false });
            button.addEventListener('mousedown', eventHandler, { capture: true, passive: false });

            // 搜索页面特殊处理
            if (isSearchPage) {
                // 监听视频预览
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length > 0) {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE &&
                                    (node.tagName === 'VIDEO' ||
                                     node.classList?.contains('ytp-inline-preview-scrim') ||
                                     node.classList?.contains('html5-video-player'))) {
                                    // 强制显示按钮
                                    button.style.opacity = '1';
                                    button.style.zIndex = '99999';
                                    button.style.pointerEvents = 'auto';
                                    button.style.visibility = 'visible';
                                }
                            }
                        }
                    }
                });

                observer.observe(element, {
                    childList: true,
                    subtree: true
                });

                // 保存observer引用以便清理
                button._observer = observer;
            }

            // 确保容器有相对定位
            if (getComputedStyle(thumbnailContainer).position === 'static') {
                thumbnailContainer.style.position = 'relative';
            }

            thumbnailContainer.appendChild(button);
            element.setAttribute(THUMBNAIL_PROCESSED_FLAG, 'true');
            processedCount++;
        });

        lastProcessedCount = elements.length;
    }

    // --- 优化后的智能防抖函数 ---
    function debouncedAddThumbnailButtons() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            addThumbnailButtons();
            debounceTimer = null;
        }, 200); // 200ms防抖，平衡响应性和性能
    }

    // --- 优化后的缩略图按钮系统设置 ---
    function setupThumbnailButtonSystem() {
        // 立即执行一次
        addThumbnailButtons();

        // 优化：使用防抖的MutationObserver
        const obs = new MutationObserver(() => {
            // 只在非视频页面执行
            if (!isVideoPage()) {
                debouncedAddThumbnailButtons();
            }
        });

        obs.observe(document.body, {
            childList: true,
            subtree: true,
            // 优化：只观察必要的属性变化
            attributes: false,
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        });

        // 优化：保留setInterval作为备用，但频率降低
        setInterval(() => {
            if (!isVideoPage()) {
                // 只在元素数量发生变化时才执行
                const currentElementCount = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer').length;
                if (currentElementCount !== lastProcessedCount) {
                    addThumbnailButtons();
                }
            }
        }, 3000); // 从1500ms增加到3000ms

        // 页面加载完成后执行
        if (document.readyState === 'complete') {
            setTimeout(addThumbnailButtons, 800);
        } else {
            window.addEventListener('load', () => setTimeout(addThumbnailButtons, 800), { once: true });
        }
    }

    // --- 视频页面按钮功能 (修复容器选择) ---
    function addYouTubeActionButtons() {
        if (!isVideoPage()) {
            removeYouTubeActionButtonsIfExists();
            return;
        }

        if (document.getElementById(SUMMARY_BUTTON_ID) || document.getElementById(SUBTITLE_BUTTON_ID)) return;

        // 修复：使用更可靠的容器选择逻辑
        const container = document.querySelector('ytd-masthead #end') ||
                          document.querySelector('ytd-masthead #buttons') ||
                          document.querySelector('ytd-masthead .ytd-masthead-right') ||
                          document.querySelector('#masthead-container #end') ||
                          document.querySelector('#container.ytd-masthead #end') ||
                          document.querySelector('ytd-masthead');

        if (!container) {
            console.log('YouTube Gemini Script: 无法找到合适的容器来放置按钮');
            return;
        }

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.style.display = 'inline-flex';
        buttonsWrapper.style.alignItems = 'center';
        buttonsWrapper.style.marginRight = '16px';

        const subtitleButton = document.createElement('button');
        subtitleButton.id = SUBTITLE_BUTTON_ID;
        subtitleButton.textContent = '🎯 生成字幕';
        Object.assign(subtitleButton.style, {
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '18px',
            padding: '0 16px',
            margin: '0 8px 0 0',
            cursor: 'pointer',
            fontWeight: '500',
            height: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            zIndex: '100',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
        });

        const summaryButton = document.createElement('button');
        summaryButton.id = SUMMARY_BUTTON_ID;
        summaryButton.textContent = '📝 Gemini摘要';
        Object.assign(summaryButton.style, {
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '18px',
            padding: '0 16px',
            margin: '0',
            cursor: 'pointer',
            fontWeight: '500',
            height: '36px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            zIndex: '100',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
        });

        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const adjustForMobile = () => {
            if (mediaQuery.matches) {
                subtitleButton.style.fontSize = '12px';
                subtitleButton.style.padding = '0 10px';
                subtitleButton.style.height = '32px';
                summaryButton.style.fontSize = '12px';
                summaryButton.style.padding = '0 10px';
                summaryButton.style.height = '32px';
            } else {
                subtitleButton.style.fontSize = '14px';
                subtitleButton.style.padding = '0 16px';
                subtitleButton.style.height = '36px';
                summaryButton.style.fontSize = '14px';
                summaryButton.style.padding = '0 16px';
                summaryButton.style.height = '36px';
            }
        };

        mediaQuery.addEventListener('change', adjustForMobile);
        adjustForMobile();

        subtitleButton.addEventListener('click', handleGenerateSubtitlesClick);
        summaryButton.addEventListener('click', handleSummarizeClick);

        buttonsWrapper.appendChild(subtitleButton);
        buttonsWrapper.appendChild(summaryButton);

        // 修复：改进插入逻辑，提供更多备选位置
        const insertTargets = [
            container.querySelector('#create-icon'),
            container.querySelector('button[aria-label*="创建"]'),
            container.querySelector('button[aria-label*="Create"]'),
            container.querySelector('#avatar-btn'),
            container.querySelector('ytd-notification-topbar-button-renderer'),
            container.querySelector('.ytd-masthead-right')
        ];

        let inserted = false;
        for (const target of insertTargets) {
            if (target) {
                container.insertBefore(buttonsWrapper, target);
                inserted = true;
                console.log('YouTube Gemini Script: 按钮已成功插入到', target);
                break;
            }
        }

        // 如果没有找到合适的插入位置，就插入到容器的开头
        if (!inserted) {
            if (container.firstChild) {
                container.insertBefore(buttonsWrapper, container.firstChild);
            } else {
                container.appendChild(buttonsWrapper);
            }
            console.log('YouTube Gemini Script: 按钮已插入到容器的默认位置');
        }
    }

    function handleSummarizeClick() {
        const youtubeUrl = window.location.href;
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');

        if (!isValidYouTubeVideoId(videoId)) {
            showNotification(
                YOUTUBE_NOTIFICATION_ID,
                "无法获取有效的视频ID，请确认当前是否在YouTube视频页面。",
                { ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' },
                5000
            );
            return;
        }

        const titleSelectors = [
            'h1.ytd-watch-metadata',
            '#video-title',
            '#title h1',
            '.title',
            'yt-formatted-string.ytd-watch-metadata'
        ];

        let videoTitle = '';
        for (const selector of titleSelectors) {
            const titleElement = document.querySelector(selector);
            if (titleElement) {
                videoTitle = titleElement.textContent?.trim();
                if (videoTitle) break;
            }
        }

        if (!videoTitle) {
            videoTitle = document.title.replace(/ - YouTube$/, '').trim() || 'Unknown Video';
        }

        const videoInfo = {
            id: videoId,
            title: videoTitle,
            url: youtubeUrl
        };

        processVideoSummary(videoInfo);
    }

    function handleGenerateSubtitlesClick() {
        const youtubeUrl = window.location.href;
        const titleElement = document.querySelector('h1.ytd-watch-metadata, #video-title, #title h1, .title');
        const videoTitle = titleElement?.textContent?.trim() || document.title.replace(/ - YouTube$/, '').trim() || 'Unknown Video';
        let videoDurationInSeconds = 0;
        const durationMeta = document.querySelector('meta[itemprop="duration"]');
        if (durationMeta?.content) {
            const match = durationMeta.content.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
            if (match) {
                videoDurationInSeconds = 0;
                if (match[1]) videoDurationInSeconds += parseInt(match[1].replace('H', '')) * 3600;
                if (match[2]) videoDurationInSeconds += parseInt(match[2].replace('M', '')) * 60;
                if (match[3]) videoDurationInSeconds += parseInt(match[3].replace('S', ''));
            }
        }

        if (videoDurationInSeconds <= 0) {
            showNotification(YOUTUBE_NOTIFICATION_ID, "无法获取视频时长，无法启动字幕任务。", { ...YOUTUBE_NOTIFICATION_STYLE, backgroundColor: '#d93025' }, 15000);
            return;
        }

        const firstSegmentEnd = Math.min(videoDurationInSeconds, 1200);
        const prompt = `${youtubeUrl}\n1.不要添加自己的语言\n2.变成简体中文，流畅版本。\n\nYouTube\n请提取此视频从00:00:00到${new Date(firstSegmentEnd * 1000).toISOString().substr(11, 8)}的完整字幕文本。`;

        // 修复问题3：生成唯一会话ID
        const sessionId = generateSessionId();

        GM_setValue(PROMPT_KEY, prompt);
        GM_setValue(TITLE_KEY, `${videoTitle} (字幕 00:00:00-${new Date(firstSegmentEnd * 1000).toISOString().substr(11, 8)})`);
        GM_setValue(ORIGINAL_TITLE_KEY, videoTitle);
        GM_setValue(TIMESTAMP_KEY, Date.now());
        GM_setValue(ACTION_TYPE_KEY, 'subtitle');
        GM_setValue(VIDEO_TOTAL_DURATION_KEY, videoDurationInSeconds);
        GM_setValue(FIRST_SEGMENT_END_TIME_KEY, firstSegmentEnd);
        GM_setValue(SESSION_ID_KEY, sessionId);

        showNotification(YOUTUBE_NOTIFICATION_ID, `已跳转到 Gemini 生成字幕: 00:00:00 - ${new Date(firstSegmentEnd * 1000).toISOString().substr(11, 8)}...\n"${videoTitle}"`, YOUTUBE_NOTIFICATION_STYLE, 15000);
        window.open('https://gemini.google.com/', '_blank');
        copyToClipboard(prompt);
    }

    function removeYouTubeActionButtonsIfExists() {
        [SUMMARY_BUTTON_ID, SUBTITLE_BUTTON_ID].forEach(id => {
            const button = document.getElementById(id);
            if (button) button.remove();
        });
    }

    // --- 页面类型检测函数 ---
    function detectYouTubePageType() {
        if (!document.body) return;

        let isHomePage = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
        let isChannelPage = window.location.pathname.includes('/channel/') ||
                          window.location.pathname.includes('/c/') ||
                          window.location.pathname.includes('/user/') ||
                          window.location.pathname.includes('/@');
        let isSearchPage = window.location.pathname === '/results';

        if (isHomePage) {
            document.body.setAttribute('data-is-home-page', 'true');
            document.body.setAttribute('data-page-subtype', 'home');
        } else {
            document.body.removeAttribute('data-is-home-page');
        }

        if (isChannelPage) {
            document.body.setAttribute('data-page-subtype', 'channels');
        } else if (isSearchPage) {
            document.body.setAttribute('data-page-type', 'search');
        }
    }

    // 修复问题1：添加更可靠的URL变化检测
    function setupUrlChangeDetection() {
        let lastUrl = location.href;

        // 监听popstate事件（浏览器前进/后退）
        window.addEventListener('popstate', function() {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                handleUrlChange();
            }
        });

        // 监听YouTube的导航事件
        document.addEventListener('yt-navigate-finish', function() {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                handleUrlChange();
            }
        });

        // 备用：仍然保留MutationObserver
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                handleUrlChange();
            }
        });

        urlObserver.observe(document, { subtree: true, childList: true });

        // 处理URL变化的函数
        function handleUrlChange() {
            // 清理缓存和observers
            processedElements.forEach((value, element) => {
                const button = element.querySelector(`.${THUMBNAIL_BUTTON_CLASS}`);
                if (button?._observer) {
                    button._observer.disconnect();
                }
            });
            processedElements.clear();
            lastProcessedCount = 0;

            setTimeout(() => {
                detectYouTubePageType();
                if (isVideoPage()) {
                    addYouTubeActionButtons();
                } else {
                    removeYouTubeActionButtonsIfExists();
                }
            }, 800);
        }
    }

    // --- 页面初始化 (优化版) ---
    if (window.location.hostname.includes('www.youtube.com')) {
        detectYouTubePageType();

        // 修复问题1：使用新的URL检测系统
        setupUrlChangeDetection();

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setupThumbnailButtonSystem();
            setTimeout(addYouTubeActionButtons, 800);

            // 优化：减少检查频率
            setInterval(() => {
                if (isVideoPage()) {
                    if (!document.getElementById(SUMMARY_BUTTON_ID) || !document.getElementById(SUBTITLE_BUTTON_ID)) {
                        console.log('YouTube Gemini Script: 检测到按钮缺失，尝试重新添加');
                        addYouTubeActionButtons();
                    }
                }
                detectYouTubePageType();
            }, 8000); // 从5000ms增加到8000ms
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                detectYouTubePageType();
                setupThumbnailButtonSystem();
                setTimeout(addYouTubeActionButtons, 800);
            }, { once: true });
        }
    } else if (window.location.hostname.includes('gemini.google.com')) {
        // 修复问题3：增加会话ID验证
        const prompt = GM_getValue(PROMPT_KEY);
        const timestamp = GM_getValue(TIMESTAMP_KEY, 0);
        const actionType = GM_getValue(ACTION_TYPE_KEY);
        const sessionId = GM_getValue(SESSION_ID_KEY);

        const referrerIsYouTube = document.referrer.includes('youtube.com');

        // 增加更严格的验证条件
        if (prompt && actionType && sessionId &&
            Date.now() - timestamp <= 60000 && // 缩短到1分钟
            referrerIsYouTube) {

            setTimeout(() => {
                const textarea = document.querySelector('textarea, div[contenteditable="true"]');
                if (textarea) {
                    if (textarea.isContentEditable) textarea.textContent = prompt;
                    else textarea.value = prompt;

                    textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

                    setTimeout(() => {
                        const sendBtn = document.querySelector('button[aria-label*="Send"],button[aria-label*="发送"],button[aria-label*="提交"],button[aria-label*="Run"],button[aria-label*="Submit"]');
                        if (sendBtn && !sendBtn.disabled) {
                            sendBtn.click();

                            // 立即清理，避免重复使用
                            setTimeout(() => {
                                GM_deleteValue(PROMPT_KEY);
                                GM_deleteValue(TITLE_KEY);
                                GM_deleteValue(ORIGINAL_TITLE_KEY);
                                GM_deleteValue(TIMESTAMP_KEY);
                                GM_deleteValue(ACTION_TYPE_KEY);
                                GM_deleteValue(VIDEO_TOTAL_DURATION_KEY);
                                GM_deleteValue(FIRST_SEGMENT_END_TIME_KEY);
                                GM_deleteValue(SESSION_ID_KEY);
                            }, 1000); // 缩短清理时间
                        }
                    }, 500);
                }
            }, 1200);
        }
    }
})();