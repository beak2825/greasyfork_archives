// ==UserScript==
// @name          FuckYouTube
// @namespace     https://t.me/Impart_Chat
// @version       0.1.3
// @description   每行合并 5 个缩略图、删除 Shorts、禁用 AV1/WebRTC、添加视频适配切换、清理 URL、调整字体大小;
// @author        ChuwuYo
// @match         https://*.youtube.com/*
// @match         https://www.youtubekids.com/*
// @exclude       https://accounts.youtube.com/*
// @exclude       https://studio.youtube.com/*
// @exclude       https://music.youtube.com/*
// @grant         GM_addStyle
// @grant         unsafeWindow
// @run-at        document-start
// @icon          https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license       MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/541988/FuckYouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/541988/FuckYouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper Functions from Bilibili Script ---
    const o$1 = () => {}; // No-op function
    const noopNeverResolvedPromise = () => new Promise(o$1);

    /* eslint-disable no-restricted-globals -- logger */
    const consoleLog = unsafeWindow.console.log;
    const consoleError = unsafeWindow.console.error;
    const consoleWarn = unsafeWindow.console.warn;
    const consoleInfo = unsafeWindow.console.info;
    const consoleDebug = unsafeWindow.console.debug;
    const consoleTrace = unsafeWindow.console.trace;
    const consoleGroup = unsafeWindow.console.group;
    const consoleGroupCollapsed = unsafeWindow.console.groupCollapsed;
    const consoleGroupEnd = unsafeWindow.console.groupEnd;
    const logger = {
        log: consoleLog.bind(console, '[YT Enhanced]'),
        error: consoleError.bind(console, '[YT Enhanced]'),
        warn: consoleWarn.bind(console, '[YT Enhanced]'),
        info: consoleInfo.bind(console, '[YT Enhanced]'),
        debug: consoleDebug.bind(console, '[YT Enhanced]'),
        trace(...args) {
            consoleGroupCollapsed.bind(console, '[YT Enhanced]')(...args);
            consoleTrace(...args);
            consoleGroupEnd();
        },
        group: consoleGroup.bind(console, '[YT Enhanced]'),
        groupCollapsed: consoleGroupCollapsed.bind(console, '[YT Enhanced]'),
        groupEnd: consoleGroupEnd.bind(console)
    };

    function defineReadonlyProperty(target, key, value, enumerable = true) {
        Object.defineProperty(target, key, {
            get() {
                return value;
            },
            set: o$1,
            configurable: false, // Make it harder to change
            enumerable
        });
    }

    // Simple template literal tag for CSS readability
    function e(r, ...t) {
        return r.reduce((e, r, n) => e + r + (t[n] ?? ""), "")
    }

    // --- Feature Modules ---

    // 1. Disable AV1 Codec
    const disableAV1 = {
        name: 'disable-av1',
        description: 'Prevent YouTube from using AV1 codec',
        apply() {
            try {
                const originalCanPlayType = HTMLMediaElement.prototype.canPlayType;
                // Check if prototype and function exist before overriding
                if (HTMLMediaElement && typeof originalCanPlayType === 'function') {
                    HTMLMediaElement.prototype.canPlayType = function(type) {
                        if (type && type.includes('av01')) {
                            logger.info('AV1 canPlayType blocked:', type);
                            return '';
                        }
                        // Ensure 'this' context is correct and call original
                        return originalCanPlayType.call(this, type);
                    };
                } else {
                    logger.warn('HTMLMediaElement.prototype.canPlayType not found or not a function.');
                }


                const originalIsTypeSupported = unsafeWindow.MediaSource?.isTypeSupported;
                if (typeof originalIsTypeSupported === 'function') {
                    unsafeWindow.MediaSource.isTypeSupported = function(type) {
                        if (type && type.includes('av01')) {
                            logger.info('AV1 isTypeSupported blocked:', type);
                            return false;
                        }
                        return originalIsTypeSupported.call(this, type);
                    };
                } else {
                    logger.warn('MediaSource.isTypeSupported not found or not a function, cannot block AV1 via MediaSource.');
                }

                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 2. Disable WebRTC
    const noWebRTC = {
        name: 'no-webrtc',
        description: 'Disable WebRTC Peer Connections',
        apply() {
            try {
                const rtcPcNames = [];
                if ('RTCPeerConnection' in unsafeWindow) rtcPcNames.push('RTCPeerConnection');
                if ('webkitRTCPeerConnection' in unsafeWindow) rtcPcNames.push('webkitRTCPeerConnection');
                if ('mozRTCPeerConnection' in unsafeWindow) rtcPcNames.push('mozRTCPeerConnection');

                const rtcDcNames = [];
                if ('RTCDataChannel' in unsafeWindow) rtcDcNames.push('RTCDataChannel');
                if ('webkitRTCDataChannel' in unsafeWindow) rtcDcNames.push('webkitRTCDataChannel');
                if ('mozRTCDataChannel' in unsafeWindow) rtcDcNames.push('mozRTCDataChannel');

                class MockDataChannel {
                    close = o$1; send = o$1; addEventListener = o$1; removeEventListener = o$1;
                    onbufferedamountlow = null; onclose = null; onerror = null; onmessage = null; onopen = null;
                    get bufferedAmount() { return 0; } get id() { return null; } get label() { return ''; }
                    get maxPacketLifeTime() { return null; } get maxRetransmits() { return null; } get negotiated() { return false; }
                    get ordered() { return true; } get protocol() { return ''; } get readyState() { return 'closed'; }
                    get reliable() { return false; } get binaryType() { return 'blob'; } set binaryType(val) {}
                    get bufferedAmountLowThreshold() { return 0; } set bufferedAmountLowThreshold(val) {}
                    toString() { return '[object RTCDataChannel]'; }
                }
                class MockRTCSessionDescription {
                    type; sdp;
                    constructor(init){ this.type = init?.type ?? 'offer'; this.sdp = init?.sdp ?? ''; }
                    toJSON() { return { type: this.type, sdp: this.sdp }; }
                    toString() { return '[object RTCSessionDescription]'; }
                }
                const mockedRtcSessionDescription = new MockRTCSessionDescription();
                class MockRTCPeerConnection {
                    createDataChannel() { return new MockDataChannel(); }
                    close = o$1; createOffer = noopNeverResolvedPromise; setLocalDescription = async () => {};
                    setRemoteDescription = async () => {}; addEventListener = o$1; removeEventListener = o$1;
                    addIceCandidate = async () => {}; getConfiguration = () => ({}); getReceivers = () => [];
                    getSenders = () => []; getStats = () => Promise.resolve(new Map()); getTransceivers = () => [];
                    addTrack = () => null; removeTrack = o$1; addTransceiver = () => null; setConfiguration = o$1;
                    get localDescription() { return mockedRtcSessionDescription; } get remoteDescription() { return mockedRtcSessionDescription; }
                    get currentLocalDescription() { return mockedRtcSessionDescription; } get pendingLocalDescription() { return mockedRtcSessionDescription; }
                    get currentRemoteDescription() { return mockedRtcSessionDescription; } get pendingRemoteDescription() { return mockedRtcSessionDescription; }
                    get canTrickleIceCandidates() { return null; } get connectionState() { return 'disconnected'; }
                    get iceConnectionState() { return 'disconnected'; } get iceGatheringState() { return 'complete'; }
                    get signalingState() { return 'closed'; }
                    onconnectionstatechange = null; ondatachannel = null; onicecandidate = null; onicecandidateerror = null;
                    oniceconnectionstatechange = null; onicegatheringstatechange = null; onnegotiationneeded = null;
                    onsignalingstatechange = null; ontrack = null; createAnswer = noopNeverResolvedPromise;
                    toString() { return '[object RTCPeerConnection]'; }
                }

                for (const rtc of rtcPcNames) defineReadonlyProperty(unsafeWindow, rtc, MockRTCPeerConnection);
                for (const dc of rtcDcNames) defineReadonlyProperty(unsafeWindow, dc, MockDataChannel);
                defineReadonlyProperty(unsafeWindow, 'RTCSessionDescription', MockRTCSessionDescription);

                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 3. Player Video Fit (Adapted from Bilibili Script)
    const playerVideoFit = {
        name: 'player-video-fit',
        description: 'Adds a toggle for video fit mode (cover/contain)',
        apply() {
            try {
                // Inject CSS first
                GM_addStyle(e`
                    /* Style for the body when fit mode is active */
                    body[video-fit-mode-enabled] .html5-video-player video.video-stream,
                    body[video-fit-mode-enabled] .html5-video-player .html5-main-video {
                        object-fit: cover !important;
                    }
                    /* Style for the button in the settings menu */
                    .ytp-settings-menu .ytp-menuitem[aria-haspopup="false"][role="menuitemcheckbox"] {
                        justify-content: space-between; /* Align label and checkbox */
                    }
                     .ytp-settings-menu .ytp-menuitem-label {
                         flex-grow: 1;
                         margin-right: 10px; /* Space before checkbox */
                     }
                     .ytp-menuitem-toggle-checkbox {
                         /* Style the checkbox appearance if needed */
                         margin: 0 !important; /* Reset margin */
                         height: 100%;
                         display: flex;
                         align-items: center;
                     }
                 `);

                let fitModeEnabled = localStorage.getItem('yt-enhanced-video-fit') === 'true';

                function toggleMode(enabled) {
                    fitModeEnabled = enabled;
                    if (enabled) {
                        document.body.setAttribute('video-fit-mode-enabled', '');
                        localStorage.setItem('yt-enhanced-video-fit', 'true');
                    } else {
                        document.body.removeAttribute('video-fit-mode-enabled');
                        localStorage.setItem('yt-enhanced-video-fit', 'false');
                    }
                }

                function injectButtonLogic() { // Renamed function for clarity
                    // Use MutationObserver to detect when the settings menu is added
                    const observer = new MutationObserver((mutationsList, obs) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                const settingsMenu = document.querySelector('.ytp-settings-menu');
                                const panelMenu = settingsMenu?.querySelector('.ytp-panel-menu'); // Target the inner menu list

                                // Check if the menu is visible and our button isn't already there
                                if (settingsMenu && panelMenu && !panelMenu.querySelector('#ytp-fit-mode-toggle')) {
                                    // Check if settings menu is actually visible (has style other than display: none)
                                    const style = window.getComputedStyle(settingsMenu);
                                    if (style.display !== 'none') {
                                        logger.debug('Settings menu opened, attempting to inject button.');
                                        addButtonToMenu(panelMenu);
                                        // Maybe disconnect observer once button is added, or keep it for dynamic changes?
                                        // obs.disconnect(); // Disconnect if only needed once per menu open
                                    }
                                }
                            }
                        }
                    });

                    // Observe the player container or body for changes
                    const player = document.getElementById('movie_player');
                    if (player) {
                        observer.observe(player, { childList: true, subtree: true });
                        logger.log('MutationObserver attached to player for settings menu.');
                    } else {
                        // Wait a bit and try again if player isn't immediately available
                        setTimeout(() => {
                            const playerRetry = document.getElementById('movie_player');
                            if (playerRetry) {
                                observer.observe(playerRetry, { childList: true, subtree: true });
                                logger.log('MutationObserver attached to player after retry.');
                            } else {
                                logger.warn('Player element not found for MutationObserver, Fit Mode button might not appear.');
                            }
                        }, 2000); // Wait 2 seconds
                    }

                    // Initial check in case the menu is already open when script runs
                    const initialPanelMenu = document.querySelector('.ytp-settings-menu .ytp-panel-menu');
                    if (initialPanelMenu && !initialPanelMenu.querySelector('#ytp-fit-mode-toggle')) {
                        const style = window.getComputedStyle(initialPanelMenu.closest('.ytp-settings-menu'));
                        if (style.display !== 'none') {
                            addButtonToMenu(initialPanelMenu);
                        }
                    }

                    // Initial body attribute application
                    if (fitModeEnabled) {
                        document.body.setAttribute('video-fit-mode-enabled', '');
                    }
                }

                function addButtonToMenu(panelMenu) {
                    if (!panelMenu || panelMenu.querySelector('#ytp-fit-mode-toggle')) return; // Already added or menu gone

                    try {
                        const newItem = document.createElement('div');
                        newItem.className = 'ytp-menuitem';
                        newItem.setAttribute('role', 'menuitemcheckbox');
                        newItem.setAttribute('aria-checked', fitModeEnabled.toString());
                        newItem.id = 'ytp-fit-mode-toggle';
                        newItem.tabIndex = 0;

                        const label = document.createElement('div');
                        label.className = 'ytp-menuitem-label';
                        label.textContent = '裁切模式 (Fit Mode)'; // Or 'Video Fit Mode'

                        const content = document.createElement('div');
                        content.className = 'ytp-menuitem-content';
                        // Simple checkbox look-alike
                        content.innerHTML = `<div class="ytp-menuitem-toggle-checkbox"> ${fitModeEnabled ? '☑' : '☐'} </div>`;


                        newItem.appendChild(label);
                        newItem.appendChild(content);

                        newItem.addEventListener('click', (e) => { // Use event object
                            e.stopPropagation(); // Prevent menu closing
                            const newState = !fitModeEnabled;
                            toggleMode(newState);
                            newItem.setAttribute('aria-checked', newState.toString());
                            content.innerHTML = `<div class="ytp-menuitem-toggle-checkbox"> ${newState ? '☑' : '☐'} </div>`;
                        });

                        // Insert before the "Stats for nerds" or Quality item, or just append
                        const qualityItem = Array.from(panelMenu.children).find(el => el.textContent.includes('Quality') || el.textContent.includes('画质')); // Added Chinese Quality
                        if (qualityItem) {
                            panelMenu.insertBefore(newItem, qualityItem.nextSibling); // Insert after Quality
                        } else {
                            // Try inserting before Loop or Stats if Quality not found
                            const loopItem = Array.from(panelMenu.children).find(el => el.textContent.includes('Loop') || el.textContent.includes('循环播放'));
                            if (loopItem) {
                                panelMenu.insertBefore(newItem, loopItem);
                            } else {
                                const statsItem = Array.from(panelMenu.children).find(el => el.textContent.includes('Stats for nerds') || el.textContent.includes('详细统计信息'));
                                if (statsItem) {
                                    panelMenu.insertBefore(newItem, statsItem);
                                } else {
                                    panelMenu.appendChild(newItem); // Append as last resort
                                }
                            }
                        }
                        logger.log('Fit Mode button injected.');
                    } catch (e) {
                        logger.error("Error injecting Fit Mode button:", e);
                    }
                }

                // Wait for the page elements to likely exist
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', injectButtonLogic);
                } else {
                    injectButtonLogic(); // Already loaded
                }

                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 4. Remove Black Backdrop Filter
    const removeBlackBackdropFilter = {
        name: 'remove-black-backdrop-filter',
        description: 'Removes potential site-wide grayscale filters',
        apply() {
            try {
                GM_addStyle(e`html, body { filter: none !important; -webkit-filter: none !important; }`);
                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    const removeUselessUrlParams = {
        name: 'remove-useless-url-params',
        description: 'Clean URLs from tracking parameters',
        apply() {
            try {
                // Common YouTube tracking parameters (add more as needed)
                const youtubeUselessUrlParams = [
                    'si',         // Share ID? Added recently
                    'pp',         // ??? Related to recommendations/playback source?
                    'feature',    // e.g., feature=share, feature=emb_logo
                    'gclid',      // Google Click ID
                    'dclid',      // Google Display Click ID
                    'fbclid',     // Facebook Click ID
                    'utm_source', // Urchin Tracking Module params
                    'utm_medium',
                    'utm_campaign',
                    'utm_term',
                    'utm_content',
                    'oac',        // ?? Found sometimes
                    '_hsenc',     // HubSpot
                    '_hsmi',      // HubSpot
                    'mc_eid',     // Mailchimp
                    'mc_cid',     // Mailchimp
                    'igshid',     // Instagram 跟踪ID
                    'ttclid',     // TikTok Click ID
                    'yclid',      // Yandex Click ID
                    'msclkid',    // Microsoft Click ID
                    'oly_anon_id',// Outbrain 跟踪
                    'oly_enc_id', // Outbrain 跟踪
                    /^vtm_[a-z]+$/, // 匹配类似vtm_campaign、vtm_source等
                ];

                function removeTracking(url) {
                    if (!url) return url;

                    // 跳过非HTTP(S)和非相对路径的URL
                    if (typeof url === 'string' && /^(?:javascript|data|about|blob):/i.test(url)) {
                        return url;
                    }

                    let urlObj;
                    try {
                        // Handle relative URLs and ensure it's a valid URL format
                        if (typeof url === 'string' && (url.startsWith('/') || url.startsWith('./') || url.startsWith('../'))) {
                            urlObj = new URL(url, unsafeWindow.location.href);
                        } else if (typeof url === 'string') {
                            urlObj = new URL(url); // Assume absolute if not clearly relative
                        } else if (url instanceof URL){
                            urlObj = url;
                        } else {
                            logger.warn('Invalid URL type for removeTracking:', url);
                            return url; // Return original if type is wrong
                        }

                        if (!urlObj.search) return urlObj.href; // No params to clean

                        const params = urlObj.searchParams;
                        let changed = false;

                        // Iterate over a copy of keys because deleting modifies the collection
                        const keysToDelete = [];
                        for (const key of params.keys()) {
                            for (const item of youtubeUselessUrlParams) {
                                let match = false;
                                if (typeof item === 'string') {
                                    if (item === key) match = true;
                                } else if (item instanceof RegExp && item.test(key)) {
                                    match = true;
                                }
                                if (match) {
                                    keysToDelete.push(key);
                                    break; // Move to next key once a match is found
                                }
                            }
                        }

                        if (keysToDelete.length > 0) {
                            keysToDelete.forEach(key => params.delete(key));
                            changed = true;
                        }

                        // Return original string if no changes, href otherwise
                        return changed ? urlObj.href : (typeof url === 'string' ? url : url.href);
                    } catch (e) {
                        // Catch potential URL parsing errors
                        if (e instanceof TypeError && e.message.includes("Invalid URL")) {
                            // Ignore invalid URL errors often caused by non-standard URIs like about:blank
                            return url;
                        }
                        logger.error('Failed to remove useless urlParams for:', url, e);
                        return (typeof url === 'string' ? url : url?.href ?? ''); // Return original on other errors
                    }
                }

                // Initial clean
                const initialHref = unsafeWindow.location.href;
                const cleanedHref = removeTracking(initialHref);
                if (initialHref !== cleanedHref) {
                    logger.log('Initial URL cleaned:', initialHref, '->', cleanedHref);
                    // Use try-catch for replaceState as well, as it can fail on certain pages/frames
                    try {
                        unsafeWindow.history.replaceState(unsafeWindow.history.state, '', cleanedHref);
                    } catch (histErr) {
                        logger.error("Failed to replaceState for initial URL:", histErr);
                    }
                }

                // Hook history API (optimized with shared wrapper)
                const wrapHistoryMethod = (originalMethod) => {
                    return function(state, title, url) {
                        const cleaned = url ? removeTracking(url) : url; // Handle null/undefined
                        if (url && url !== cleaned) {
                            logger.log('History API URL cleaned:', url, '->', cleaned);
                        }
                        try {
                            return originalMethod.call(unsafeWindow.history, state, title, cleaned ?? url);
                        } catch (e) {
                            logger.error("History method error:", e);
                            return originalMethod.call(unsafeWindow.history, state, title, url); // Fallback
                        }
                    };
                };

                unsafeWindow.history.pushState = wrapHistoryMethod(unsafeWindow.history.pushState);
                unsafeWindow.history.replaceState = wrapHistoryMethod(unsafeWindow.history.replaceState);

                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 6. Use System Fonts & Adjust Font Size (Enhanced)
    const useSystemFonts = {
        name: 'use-system-fonts',
        description: 'Force system fonts and adjust font size for better readability',
        apply() {
            try {
                GM_addStyle(e`
                    /* ===== 强制使用系统默认字体 ===== */
                    html, body, #masthead, #content, ytd-app, tp-yt-app-drawer, #guide,
                    input, button, textarea, select, .ytd-video-primary-info-renderer,
                    .ytd-video-secondary-info-renderer, #comments, #comment,
                    .ytd-rich-grid-media .ytd-rich-item-renderer #video-title,
                    .ytp-tooltip-text, .ytp-menuitem-label, .ytp-title-text {
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                    }

                    /* ===== 全局字体大小调整 ===== */
                    body, yt-formatted-string, span, a, div {
                        font-size: 14px !important;  /* 默认字体大小 */
                    }

                    /* 视频标题（首页/频道页） */
                    #video-title,
                    .ytd-rich-grid-media #video-title {
                        font-size: 14px !important;
                        font-weight: 500 !important;  /* 适当加粗 */
                    }

                    /* 播放器内的标题 */
                    .ytp-title-text {
                        font-size: 18px !important;
                    }

                    /* 侧边栏导航文字 */
                    ytd-guide-entry-renderer #label,
                    #guide-content yt-formatted-string {
                        font-size: 14px !important;
                    }

                    /* 评论区字体 */
                    #comment #content-text,
                    ytd-comment-renderer #content-text {
                        font-size: 14px !important;
                        line-height: 1.4 !important;  /* 改善行距 */
                    }

                    /* 设置菜单字体（如播放速度、画质选项） */
                    .ytp-settings-menu .ytp-menuitem-label {
                        font-size: 14px !important;
                    }
                `);
                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 7. 5 Thumbnails Per Row
    const sixThumbs = {
        name: 'six-thumbnails-per-row',
        description: 'Sets YouTube grid items to 5 per row (excluding @xxx/videos pages)',
        apply() {
            try {
                GM_addStyle(e`
                    /* ===== 默认规则：大部分页面 5 个/行 ===== */
                    ytd-rich-grid-renderer {
                        --ytd-rich-grid-items-per-row: 5 !important;
                    }

                    /* ===== 排除 @xxx/videos 页面===== */
                    ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer,
                    ytd-browse[page-subtype="channels-videos"] ytd-rich-grid-renderer {
                        --ytd-rich-grid-items-per-row: 4 !important; /* 强制 4 个/行 */
                    }

                    /* ===== 修复容器宽度（防止第 5 个视频溢出）===== */
                    ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer {
                        width: calc(100vw - var(--ytd-guide-width, 240px) - 48px);
                        max-width: calc(var(--ytd-rich-grid-item-max-width, 360px) * 5 + var(--ytd-rich-grid-item-margin, 16px) * 12 + 24px);
                        margin: auto;
                    }

                    /* ===== 确保其他页面（如订阅、搜索）仍然是 5 个/行 ===== */
                    ytd-two-column-browse-results-renderer[is-grid] #primary #contents.ytd-section-list-renderer > *.ytd-section-list-renderer,
                    ytd-browse #primary #contents.ytd-section-list-renderer > *.ytd-section-list-renderer:has(ytd-rich-grid-renderer),
                    ytd-browse[page-subtype="subscriptions"] #contents.ytd-section-list-renderer {
                        --ytd-rich-grid-items-per-row: 5 !important;
                    }

                    /* ===== 确保 shelf 缩略图也是 5 个/行 ===== */
                    ytd-shelf-renderer[use-show-fewer] #items.ytd-shelf-renderer {
                        --ytd-shelf-items-per-row: 5 !important;
                    }
                `);
                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 8. Remove Shorts
    const removeShorts = {
        name: 'remove-shorts',
        description: 'Hides YouTube Shorts elements from the UI',
        apply() {
            try {
                GM_addStyle(e`
                    /* Hide Shorts tab in sidebar guide */
                    ytd-guide-entry-renderer:has(a#endpoint[title='Shorts']),
                    ytd-guide-entry-renderer:has(yt-icon path[d^='M10 14.14V9.86']), /* Alternative selector based on SVG icon path (might change) */
                    ytd-mini-guide-entry-renderer[aria-label='Shorts'] {
                        display: none !important;
                    }

                    /* Hide Shorts shelves/sections */
                    ytd-reel-shelf-renderer,
                    ytd-rich-shelf-renderer[is-shorts] {
                        display: none !important;
                    }

                    /* Hide individual Shorts videos in feeds/grids */
                    ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style='SHORTS']),
                    ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style='SHORTS']),
                    ytd-rich-item-renderer:has(ytd-reel-item-renderer) {
                       display: none !important;
                    }

                    /* Hide Shorts tab on Channel pages */
                     tp-yt-paper-tab:has(.tab-title) {
                       /* Using attribute selector for potential future proofing if YT adds one */
                       &[aria-label*="Shorts"],
                       /* Check title attribute as well */
                       &.ytd-browse[title="Shorts"],
                       /* Fallback using text content - least reliable */
                       &:has(span.tab-title:only-child:contains("Shorts")) {
                          display: none !important;
                        }
                     }

                    /* Hide the "Shorts" header above grid sections on channel pages */
                     ytd-rich-grid-renderer #title-container.ytd-rich-grid-renderer:has(h2 yt-formatted-string:contains("Shorts")) {
                         display: none !important;
                     }
                `);
                logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };


    // --- Apply Features ---
    logger.log('Initializing YouTube Enhanced script...');

    // Apply features immediately at document-start where possible
    disableAV1.apply();
    noWebRTC.apply();
    removeUselessUrlParams.apply();

    // Apply CSS-based features
    sixThumbs.apply();
    useSystemFonts.apply();
    removeBlackBackdropFilter.apply();
    removeShorts.apply(); // Apply the new feature
    playerVideoFit.apply(); // Sets up button injection logic

    logger.log('YouTube Enhanced script initialization complete.');

})();
