// ==UserScript==
// @name         油管黑名单及页面优化
// @namespace    http://tampermonkey.net/
// @version      1.37
// @description  建立黑名单，隐藏拉黑用户的视频或评论；添加隐藏/显示“已看视频和MIX视频”的切换按钮；在历史记录页面不隐藏视频；净化左侧导航栏；搜索结果去重；部分链接在新窗口打开；隐藏视频结束后的推荐内容；隐藏部分弹窗；隐藏带货橱窗；在搜索结果页隐藏“People also search for”的ytd-horizontal-card-list-renderer
// @author       AI
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532686/%E6%B2%B9%E7%AE%A1%E9%BB%91%E5%90%8D%E5%8D%95%E5%8F%8A%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532686/%E6%B2%B9%E7%AE%A1%E9%BB%91%E5%90%8D%E5%8D%95%E5%8F%8A%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 常量和缓存 ---
    const videoSelectors = 'ytd-video-renderer,ytd-compact-video-renderer,ytd-rich-item-renderer,ytd-grid-video-renderer,ytd-reel-item-renderer';
    const commentSelectors = 'ytd-comment-thread-renderer,ytd-comment-view-model';
    const endscreenSelector = 'div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles';
    const popupSelector = 'div.ab4yt-popup';
    const channelRendererSelector = 'ytd-channel-renderer';
    const BUTTON_SELECTOR = 'ytd-masthead button.yt-spec-button-shape-next[aria-label="Create"]';
    const BLOCK_FLAG = 'data-yt-block';
    const usernameCache = new WeakMap();
    const seenVideoIds = new Set();
    let pendingProcess = false;
    let replacedButton = null;
    let isScrollTriggered = false;

    // 导航栏移除项
    const guideTitlesToRemove = new Set([
        'Shorts', 'Your videos', 'Your clips', 'Music', 'Movies & TV', 'Live',
        'Gaming', 'News', 'Sports', 'Courses', 'Report history', 'Help', 'Send feedback',
        'Movies', 'Podcasts', 'Watch later', 'Liked videos', 'Subscriptions', 'Learning'
    ]);

    // Create 按钮关键词
    const createKeywords = new Set(['create', '创建', 'créer', 'erstellen']);

    // --- 工具函数 ---

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function parseViewCount(viewText) {
        if (!viewText) return 0;
        const cleanedText = viewText.toLowerCase().replace('views', '').trim();
        if (cleanedText === 'no') return 0; // 明确处理“No views”
        const match = cleanedText.match(/^([\d.]+)([km]?)$/i);
        if (!match) return 0;
        const number = parseFloat(match[1]);
        return match[2] === 'k' ? number * 1000 : match[2] === 'm' ? number * 1000000 : number;
    }

    // --- 用户名提取 ---

    function getUsernameTextFromRenderer(renderer) {
        if (usernameCache.has(renderer)) return usernameCache.get(renderer);
        const selectors = [
            'ytd-channel-name a.yt-simple-endpoint yt-formatted-string',
            '#channel-name yt-formatted-string',
            'ytd-channel-name a[href*="@"],ytd-channel-name a[href*="/channel/"]'
        ];
        for (const selector of selectors) {
            const element = renderer.querySelector(selector);
            if (!element) continue;
            const text = element.textContent.trim();
            if (text) {
                const username = text.replace(/^@/, '');
                usernameCache.set(renderer, username);
                return username;
            }
            const href = element.getAttribute('href') || '';
            const atMatch = href.match(/\/@([^\/?]+)/);
            const channelMatch = href.match(/\/channel\/([^\/?]+)/);
            const username = atMatch?.[1] || channelMatch?.[1];
            if (username) {
                usernameCache.set(renderer, username);
                return username;
            }
        }
        return null;
    }

    function getUsernameTextFromCommentElement(element) {
        const usernameElement = element.querySelector('#author-text,h3 span.style-scope.ytd-comment-view-model');
        return usernameElement?.textContent.trim().replace(/^@/, '').replace(/\n/g, '') || null;
    }

    // --- 与黑名单对比 ---

    function shouldHideVideo(video) {
        const blockedUsers = GM_getValue('blockedUsers', []).map(user => user.trim().replace(/^@/, '').toLowerCase());
        const username = getUsernameTextFromRenderer(video);
        return username && blockedUsers.includes(username.toLowerCase());
    }

    function shouldHideComment(comment) {
        const blockedCommentUsers = GM_getValue('blockedCommentUsers', []).map(user => user.trim().replace(/^@/, '').toLowerCase());
        const username = getUsernameTextFromCommentElement(comment);
        return username && blockedCommentUsers.includes(username.toLowerCase());
    }

    // --- 检查 Mix 内容 ---

    function isMixContent(video) {
        return !!video.querySelector('.badge-shape-wiz__text:where(:text("Mix")),a.yt-lockup-view-model-wiz__content-image[href*="start_radio=1"]');
    }

    // --- 视频和评论处理 ---

    function processVideoNode(video) {
        if (video.hasAttribute(BLOCK_FLAG) && video.getAttribute(BLOCK_FLAG) === 'true') {
            video.style.display = 'none';
            return;
        }
        if (shouldHideVideo(video)) {
            video.style.display = 'none';
            video.setAttribute(BLOCK_FLAG, 'true');
            return;
        }
        const isHistoryPage = location.pathname === '/feed/history';
        const isHidden = localStorage.getItem('hideWatchedState') === 'true';
        if (isHidden && !isHistoryPage) {
            const progress = video.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress,#progress');
            if (progress?.style.width && progress.style.width !== '0%') {
                video.style.display = 'none';
                return;
            }
            if (isMixContent(video)) {
                video.style.display = 'none';
                return;
            }
            const viewElement = video.querySelector('ytd-video-meta-block #metadata-line .inline-metadata-item');
            if (viewElement) {
                const viewCount = parseViewCount(viewElement.textContent.trim());
                if (viewCount < 10000) { // 包括 viewCount === 0 的情况
                    video.style.display = 'none';
                    return;
                }
            }
        }
        video.style.display = '';
    }

    function processCommentNode(comment) {
        if (comment.hasAttribute(BLOCK_FLAG)) return;
        if (shouldHideComment(comment)) {
            comment.style.display = 'none';
            comment.setAttribute(BLOCK_FLAG, 'true');
        }
    }

    function processSearchDedupe(videos, isFromScroll) {
        if (!isFromScroll || !location.pathname.startsWith('/results')) return;
        videos.forEach(video => {
            if (video.hasAttribute('data-dedupe-checked')) return;
            const a = video.querySelector('ytd-thumbnail a#thumbnail,a[href*="/watch?v="],a[href*="/shorts/"],a[href]');
            if (!a) return;
            try {
                const url = new URL(a.href, window.location.origin);
                let videoId = url.searchParams.get('v') || (url.pathname.includes('/shorts/') ? url.pathname.split('/shorts/')[1]?.split('/')[0] : null);
                if (videoId) {
                    if (seenVideoIds.has(videoId)) {
                        video.style.display = 'none';
                        video.classList.add('dedupe-hidden');
                    } else {
                        seenVideoIds.add(videoId);
                    }
                    video.setAttribute('data-dedupe-checked', 'true');
                }
            } catch (e) {}
        });
    }

    function scheduleProcessDOM(nodes = document.querySelectorAll(videoSelectors + ',' + commentSelectors), immediate = false) {
        if (pendingProcess && !immediate) return;
        pendingProcess = true;
        const delay = immediate ? 0 : 1000;
        setTimeout(() => {
            try {
                const videos = Array.from(document.querySelectorAll(videoSelectors)).filter(node => node.matches(videoSelectors));
                const comments = Array.from(nodes).filter(node => node.matches(commentSelectors));
                videos.forEach(processVideoNode);
                comments.forEach(processCommentNode);
                if (location.pathname.startsWith('/results')) {
                    processSearchDedupe(videos, isScrollTriggered);
                }
            } finally {
                pendingProcess = false;
            }
        }, delay);
    }

    // --- 右键用户名弹出菜单 ---

    document.addEventListener('contextmenu', e => {
        const oldMenu = document.getElementById('custom-block-menu');
        if (oldMenu) oldMenu.remove();

        const menu = document.createElement('div');
        Object.assign(menu.style, {
            position: 'fixed', background: '#fff', border: '1px solid #ccc', padding: '5px',
            boxShadow: '2px 2px 5px rgba(0,0,0,.2)', zIndex: '10000', borderRadius: '3px', fontSize: '14px'
        });
        menu.id = 'custom-block-menu';
        menu.onmouseover = () => menu.style.background = 'pink';
        menu.onmouseout = () => menu.style.background = '#fff';

        const videoTarget = e.target.closest(videoSelectors);
        if (videoTarget) {
            const usernameText = getUsernameTextFromRenderer(videoTarget);
            if (usernameText) {
                const blockVideoButton = document.createElement('div');
                blockVideoButton.textContent = '屏蔽该用户视频';
                blockVideoButton.style.cssText = 'padding: 5px; cursor: pointer;';
                blockVideoButton.addEventListener('click', () => {
                    const blockedUsers = GM_getValue('blockedUsers', []);
                    if (!blockedUsers.includes(usernameText)) {
                        blockedUsers.push(usernameText);
                        GM_setValue('blockedUsers', blockedUsers);
                        processVideoNode(videoTarget);
                        scheduleProcessDOM(document.querySelectorAll(videoSelectors), true);
                    }
                    menu.remove();
                });
                menu.appendChild(blockVideoButton);
            }
        }

        const commentTarget = e.target.closest(commentSelectors);
        if (commentTarget) {
            const usernameText = getUsernameTextFromCommentElement(commentTarget);
            if (usernameText) {
                const blockCommentButton = document.createElement('div');
                blockCommentButton.textContent = '屏蔽该用户评论';
                blockCommentButton.style.cssText = 'padding: 5px; cursor: pointer;';
                blockCommentButton.addEventListener('click', () => {
                    const blockedCommentUsers = GM_getValue('blockedCommentUsers', []);
                    if (!blockedCommentUsers.includes(usernameText)) {
                        blockedCommentUsers.unshift(usernameText);
                        GM_setValue('blockedCommentUsers', blockedCommentUsers);
                        processCommentNode(commentTarget);
                        scheduleProcessDOM(document.querySelectorAll(commentSelectors), true);
                    }
                    menu.remove();
                });
                menu.appendChild(blockCommentButton);
            }
        }

        if (menu.children.length > 0) {
            e.preventDefault();
            document.body.appendChild(menu);
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;
            document.addEventListener('click', event => {
                if (!menu.contains(event.target)) {
                    menu.remove();
                }
            }, { once: true });
        }
    });

    // --- 替换 Create 按钮 ---

    function replaceCreateButton() {
        const createButtons = document.querySelectorAll(BUTTON_SELECTOR);
        createButtons.forEach(createButton => {
            if (createButton.textContent.includes('隐藏') || createButton.textContent.includes('显示')) {
                replacedButton = createButton;
                return;
            }
            const textContent = createButton.textContent.toLowerCase();
            const ariaLabel = createButton.getAttribute('aria-label')?.toLowerCase() || '';
            if (!createKeywords.has(textContent) && !createKeywords.has(ariaLabel)) return;

            const newButton = document.createElement('button');
            const isHidden = localStorage.getItem('hideWatchedState') === 'true';
            newButton.textContent = isHidden ? '显示' : '隐藏';
            Object.assign(newButton.style, {
                display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Roboto,Arial,sans-serif', fontSize: '14px', fontWeight: '500', lineHeight: '36px',
                height: '36px', padding: '0 16px', borderRadius: '18px', color: 'rgb(15, 15, 15)',
                background: 'rgba(0, 0, 0, 0.05)', borderWidth: '3px', borderStyle: 'solid',
                borderColor: isHidden ? 'transparent' : 'rgb(255, 0, 0)', cursor: 'pointer',
                whiteSpace: 'nowrap', textTransform: 'none', boxSizing: 'border-box', marginRight: '8px'
            });

            newButton.addEventListener('click', () => {
                const newHidden = localStorage.getItem('hideWatchedState') !== 'true';
                localStorage.setItem('hideWatchedState', newHidden.toString());
                newButton.textContent = newHidden ? '显示' : '隐藏';
                newButton.style.borderColor = newHidden ? 'transparent' : 'rgb(255, 0, 0)';
                scheduleProcessDOM(document.querySelectorAll(videoSelectors));
            });

            createButton.parentNode.replaceChild(newButton, createButton);
            createButton.dataset.replaced = true;
            replacedButton = newButton;
        });
    }

    // --- 净化页面 ---

    function cleanYouTubeUI() {
        document.querySelectorAll('ytd-merch-shelf-renderer').forEach(el => el.remove());
        document.querySelectorAll('ytd-guide-entry-renderer').forEach(entry => {
            const titleText = entry.querySelector('yt-formatted-string')?.textContent.trim();
            if (titleText && guideTitlesToRemove.has(titleText) && titleText !== 'Trending') {
                entry.remove();
            }
        });
        document.querySelectorAll('ytd-guide-section-renderer').forEach(section => {
            const titleText = section.querySelector('h3 yt-formatted-string')?.textContent.trim();
            if (titleText === '普通' || titleText === 'More from YouTube') section.remove();
        });
        document.querySelectorAll('#footer').forEach(footer => {
            if (footer.closest('ytd-guide-renderer')) footer.remove();
        });
        if (location.pathname === '/feed/playlists') {
            document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
                // Hide Watch Later playlist
                if (item.querySelector('a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=WL"]')) {
                    item.style.display = 'none';
                }
                // Hide Liked videos playlist
                if (item.querySelector('a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=LL"]')) {
                    item.style.display = 'none';
                }
            });
        }
    }

    // --- 新窗口打开链接 ---

    function isUserProfileLink(path) {
        return /^\/@[^\/]+\/?$/.test(path) || /^\/channel\/[^\/]+\/?$/.test(path);
    }

    function isVideoLink(url) {
        const urlObj = new URL(url, location.origin);
        return (url.includes('/watch?v=') || url.includes('/shorts/')) && !urlObj.searchParams.has('t') && !urlObj.searchParams.has('index');
    }

    function shouldRedirect(path) {
        return (
            (/^\/@[^\/]+\/?($|\?)/.test(path) || /^\/channel\/[^\/]+\/?($|\?)/.test(path)) &&
            !/\/(videos|playlists|community|featured|about|streams)/.test(path)
        );
    }

    function redirectToVideos() {
        const path = location.pathname;
        if (!shouldRedirect(path)) return;
        const observer = new MutationObserver(mutations => {
            const videoTabs = document.querySelectorAll('yt-tab-shape > div.yt-tab-shape-wiz__tab');
            for (const tab of videoTabs) {
                const text = tab.textContent.trim();
                if (text === 'Videos' || text === '视频') {
                    tab.closest('yt-tab-shape')?.click();
                    observer.disconnect();
                    break;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('click', e => {
        if (e.target.closest('#custom-block-menu')) return;
        const target = e.target.closest('a');
        if (!target || !target.href) return;
        const href = target.href;
        if (isUserProfileLink(new URL(href, location.origin).pathname) || isVideoLink(href)) {
            e.preventDefault();
            e.stopPropagation();
            const linkUrl = new URL(href);
            if (isUserProfileLink(linkUrl.pathname) && !/\/(videos|playlists|community|featured|about|streams)/.test(linkUrl.pathname)) {
                linkUrl.pathname += '/videos';
            }
            window.open(linkUrl.toString(), '_blank');
        }
    }, true);

    // --- 隐藏推荐内容和弹窗 ---

    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            ${endscreenSelector},${popupSelector},${channelRendererSelector},[${BLOCK_FLAG}="true"] {
                display: none !important;
            }
            ytd-horizontal-card-list-renderer:has(yt-formatted-string:where(:text("People also search for"))) {
                display: none !important;
            }
            ytd-rich-item-renderer:has(a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=WL"]) {
                display: none !important;
            }
            ytd-rich-item-renderer:has(a.yt-lockup-view-model-wiz__content-image[href*="/playlist?list=LL"]) {
                display: none !important;
            }
            ytd-masthead button.yt-spec-button-shape-next[aria-label="Create"] {
                display: none !important;
            }
            body.hide-mix:not(.history-page) ytd-rich-item-renderer:has(.badge-shape-wiz__text:where(:text("Mix"))),
            body.hide-mix:not(.history-page) ytd-rich-item-renderer:has(a.yt-lockup-view-model-wiz__content-image[href*="start_radio=1"]),
            body.hide-mix:not(.history-page) yt-lockup-view-model:has(.badge-shape-wiz__text:where(:text("Mix"))),
            body.hide-mix:not(.history-page) yt-lockup-view-model:has(a.yt-lockup-view-model-wiz__content-image[href*="start_radio=1"]) {
                display: none !important;
            }
            ytd-video-renderer.dedupe-hidden {
                display: none !important;
            }
            YTD-TRI-STATE-BUTTON-VIEW-MODEL.translate-button.style-scope.ytd-comment-view-model {
                display: none !important;
            }
        `;
        document.head.appendChild(style);

        function updateHideMixClass() {
            const isHidden = localStorage.getItem('hideWatchedState') === 'true';
            const isHistoryPage = location.pathname === '/feed/history';
            document.body.classList.toggle('hide-mix', isHidden);
            document.body.classList.toggle('history-page', isHistoryPage);
        }
        updateHideMixClass();
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            originalSetItem.call(localStorage, key, value);
            if (key === 'hideWatchedState') updateHideMixClass();
        };
    }

    // --- 初始化和事件监听 ---

    function initialize() {
        seenVideoIds.clear();
        injectCSS();
        replaceCreateButton();
        cleanYouTubeUI();
        redirectToVideos();
        scheduleProcessDOM();
    }

    const debouncedUpdate = debounce(() => {
        cleanYouTubeUI();
        scheduleProcessDOM();
    }, 200);

    const debouncedHideWatchLater = debounce(() => {
        if (location.pathname === '/feed/playlists') cleanYouTubeUI();
    }, 500);

    const observer = new MutationObserver(mutations => {
        const nodesToProcess = new Set();
        let createButtonFound = false;

        for (const mut of mutations) {
            if (!mut.addedNodes.length) continue;
            for (const node of mut.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (node.matches(BUTTON_SELECTOR) || node.querySelector(BUTTON_SELECTOR)) {
                    createButtonFound = true;
                }
                if (node.matches(videoSelectors) || node.querySelector(videoSelectors) ||
                    node.matches(commentSelectors) || node.querySelector(commentSelectors)) {
                    nodesToProcess.add(node);
                    node.querySelectorAll(videoSelectors + ',' + commentSelectors).forEach(n => nodesToProcess.add(n));
                }
            }
        }

        if (createButtonFound && (!replacedButton || !replacedButton.isConnected)) {
            replaceCreateButton();
        }
        if (nodesToProcess.size && !pendingProcess) {
            scheduleProcessDOM(nodesToProcess);
        }
        debouncedUpdate();
        debouncedHideWatchLater();
    });

    window.addEventListener('load', initialize);

    window.addEventListener('yt-navigate-finish', () => {
        seenVideoIds.clear();
        setTimeout(() => {
            replaceCreateButton();
            redirectToVideos();
            scheduleProcessDOM();
            debouncedHideWatchLater();
            const isHidden = localStorage.getItem('hideWatchedState') === 'true';
            const isHistoryPage = location.pathname === '/feed/history';
            document.body.classList.toggle('hide-mix', isHidden);
            document.body.classList.toggle('history-page', isHistoryPage);
        }, 100);
    });

    let isScrolling;
    window.addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            isScrollTriggered = true;
            scheduleProcessDOM();
            isScrollTriggered = false;
        }, 500);
    });

    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
        originalPushState.apply(history, [state, title, url]);
        seenVideoIds.clear();
        setTimeout(() => {
            replaceCreateButton();
            redirectToVideos();
            scheduleProcessDOM();
            debouncedHideWatchLater();
            const isHidden = localStorage.getItem('hideWatchedState') === 'true';
            const isHistoryPage = location.pathname === '/feed/history';
            document.body.classList.toggle('hide-mix', isHidden);
            document.body.classList.toggle('history-page', isHistoryPage);
        }, 100);
    };

    window.addEventListener('unload', () => observer.disconnect());

    observer.observe(document.body, { childList: true, subtree: true });
})();