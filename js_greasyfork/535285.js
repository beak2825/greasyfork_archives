// ==UserScript==
// @name          YouTube Layout Master
// @namespace     eeeeee
// @version       0.4
// @description   每行合并 6/5 个缩略图 (自适应)、删除 Shorts、禁用 AV1/WebRTC、添加视频适配切换、清理 URL，并为小屏幕优化字体大小。
// @author        justin
// @match         https://*.youtube.com/*
// @exclude       https://accounts.youtube.com/*
// @exclude       https://studio.youtube.com/*
// @exclude       https://music.youtube.com/*
// @grant         GM_addStyle
// @grant         unsafeWindow
// @run-at        document-start
// @license       MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/535285/YouTube%20Layout%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/535285/YouTube%20Layout%20Master.meta.js
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
                if (HTMLMediaElement && typeof originalCanPlayType === 'function') {
                    HTMLMediaElement.prototype.canPlayType = function(type) {
                        if (type && type.includes('av01')) {
                            logger.info('AV1 canPlayType blocked:', type);
                            return '';
                        }
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
                class MockDataChannel {close = o$1; send = o$1; addEventListener = o$1; removeEventListener = o$1; onbufferedamountlow = null; onclose = null; onerror = null; onmessage = null; onopen = null; get bufferedAmount() { return 0; } get id() { return null; } get label() { return ''; } get maxPacketLifeTime() { return null; } get maxRetransmits() { return null; } get negotiated() { return false; } get ordered() { return true; } get protocol() { return ''; } get readyState() { return 'closed'; } get reliable() { return false; } get binaryType() { return 'blob'; } set binaryType(val) {} get bufferedAmountLowThreshold() { return 0; } set bufferedAmountLowThreshold(val) {} toString() { return '[object RTCDataChannel]'; }}
                class MockRTCSessionDescription {type; sdp; constructor(init){ this.type = init?.type ?? 'offer'; this.sdp = init?.sdp ?? ''; } toJSON() { return { type: this.type, sdp: this.sdp }; } toString() { return '[object RTCSessionDescription]'; }}
                const mockedRtcSessionDescription = new MockRTCSessionDescription();
                class MockRTCPeerConnection {createDataChannel() { return new MockDataChannel(); } close = o$1; createOffer = noopNeverResolvedPromise; setLocalDescription = async () => {}; setRemoteDescription = async () => {}; addEventListener = o$1; removeEventListener = o$1; addIceCandidate = async () => {}; getConfiguration = () => ({}); getReceivers = () => []; getSenders = () => []; getStats = () => Promise.resolve(new Map()); getTransceivers = () => []; addTrack = () => null; removeTrack = o$1; addTransceiver = () => null; setConfiguration = o$1; get localDescription() { return mockedRtcSessionDescription; } get remoteDescription() { return mockedRtcSessionDescription; } get currentLocalDescription() { return mockedRtcSessionDescription; } get pendingLocalDescription() { return mockedRtcSessionDescription; } get currentRemoteDescription() { return mockedRtcSessionDescription; } get pendingRemoteDescription() { return mockedRtcSessionDescription; } get canTrickleIceCandidates() { return null; } get connectionState() { return 'disconnected'; } get iceConnectionState() { return 'disconnected'; } get iceGatheringState() { return 'complete'; } get signalingState() { return 'closed'; } onconnectionstatechange = null; ondatachannel = null; onicecandidate = null; onicecandidateerror = null; oniceconnectionstatechange = null; onicegatheringstatechange = null; onnegotiationneeded = null; onsignalingstatechange = null; ontrack = null; createAnswer = noopNeverResolvedPromise; toString() { return '[object RTCPeerConnection]'; }}
                for (const rtc of rtcPcNames) defineReadonlyProperty(unsafeWindow, rtc, MockRTCPeerConnection);
                for (const dc of rtcDcNames) defineReadonlyProperty(unsafeWindow, dc, MockDataChannel);
                defineReadonlyProperty(unsafeWindow, 'RTCSessionDescription', MockRTCSessionDescription);
                 logger.log(this.name, 'applied');
            } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 3. Player Video Fit
    const playerVideoFit = {
        name: 'player-video-fit',
        description: 'Adds a toggle for video fit mode (cover/contain)',
        apply() {
            try {
                GM_addStyle(e`body[video-fit-mode-enabled] .html5-video-player video.video-stream, body[video-fit-mode-enabled] .html5-video-player .html5-main-video { object-fit: cover !important; } .ytp-settings-menu .ytp-menuitem[aria-haspopup="false"][role="menuitemcheckbox"] { justify-content: space-between; } .ytp-settings-menu .ytp-menuitem-label { flex-grow: 1; margin-right: 10px; } .ytp-menuitem-toggle-checkbox { margin: 0 !important; height: 100%; display: flex; align-items: center; }`);
                let fitModeEnabled = localStorage.getItem('yt-enhanced-video-fit') === 'true';
                function toggleMode(enabled) { fitModeEnabled = enabled; if (enabled) { document.body.setAttribute('video-fit-mode-enabled', ''); localStorage.setItem('yt-enhanced-video-fit', 'true'); } else { document.body.removeAttribute('video-fit-mode-enabled'); localStorage.setItem('yt-enhanced-video-fit', 'false'); } }
                function injectButtonLogic() { const observer = new MutationObserver((mutationsList, obs) => { for (const mutation of mutationsList) { if (mutation.type === 'childList') { const settingsMenu = document.querySelector('.ytp-settings-menu'); const panelMenu = settingsMenu?.querySelector('.ytp-panel-menu'); if (settingsMenu && panelMenu && !panelMenu.querySelector('#ytp-fit-mode-toggle')) { const style = window.getComputedStyle(settingsMenu); if (style.display !== 'none') { logger.debug('Settings menu opened, attempting to inject button.'); addButtonToMenu(panelMenu);}}}}}); const player = document.getElementById('movie_player'); if (player) { observer.observe(player, { childList: true, subtree: true }); logger.log('MutationObserver attached to player for settings menu.'); } else { setTimeout(() => { const playerRetry = document.getElementById('movie_player'); if (playerRetry) { observer.observe(playerRetry, { childList: true, subtree: true }); logger.log('MutationObserver attached to player after retry.'); } else { logger.warn('Player element not found for MutationObserver, Fit Mode button might not appear.'); }}, 2000); } const initialPanelMenu = document.querySelector('.ytp-settings-menu .ytp-panel-menu'); if (initialPanelMenu && !initialPanelMenu.querySelector('#ytp-fit-mode-toggle')) { const style = window.getComputedStyle(initialPanelMenu.closest('.ytp-settings-menu')); if (style.display !== 'none') { addButtonToMenu(initialPanelMenu); }} if (fitModeEnabled) { document.body.setAttribute('video-fit-mode-enabled', ''); }}
                function addButtonToMenu(panelMenu) { if (!panelMenu || panelMenu.querySelector('#ytp-fit-mode-toggle')) return; try { const newItem = document.createElement('div'); newItem.className = 'ytp-menuitem'; newItem.setAttribute('role', 'menuitemcheckbox'); newItem.setAttribute('aria-checked', fitModeEnabled.toString()); newItem.id = 'ytp-fit-mode-toggle'; newItem.tabIndex = 0; const label = document.createElement('div'); label.className = 'ytp-menuitem-label'; label.textContent = '裁切模式 (Fit Mode)'; const content = document.createElement('div'); content.className = 'ytp-menuitem-content'; content.innerHTML = `<div class="ytp-menuitem-toggle-checkbox"> ${fitModeEnabled ? '☑' : '☐'} </div>`; newItem.appendChild(label); newItem.appendChild(content); newItem.addEventListener('click', (evt) => { evt.stopPropagation(); const newState = !fitModeEnabled; toggleMode(newState); newItem.setAttribute('aria-checked', newState.toString()); content.innerHTML = `<div class="ytp-menuitem-toggle-checkbox"> ${newState ? '☑' : '☐'} </div>`; }); const qualityItem = Array.from(panelMenu.children).find(el => el.textContent.includes('Quality') || el.textContent.includes('画质')); if (qualityItem) { panelMenu.insertBefore(newItem, qualityItem.nextSibling); } else { const loopItem = Array.from(panelMenu.children).find(el => el.textContent.includes('Loop') || el.textContent.includes('循环播放')); if (loopItem) { panelMenu.insertBefore(newItem, loopItem); } else { const statsItem = Array.from(panelMenu.children).find(el => el.textContent.includes('Stats for nerds') || el.textContent.includes('详细统计信息')); if (statsItem) { panelMenu.insertBefore(newItem, statsItem); } else { panelMenu.appendChild(newItem); }}} logger.log('Fit Mode button injected.'); } catch (err) { logger.error("Error injecting Fit Mode button:", err); }}
                if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectButtonLogic); } else { injectButtonLogic(); }
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
             try { GM_addStyle(e`html, body { filter: none !important; -webkit-filter: none !important; }`); logger.log(this.name, 'applied'); } catch (err) { logger.error('Error applying', this.name, err); }
        }
    };

    // 5. Remove Useless URL Parameters
    const removeUselessUrlParams = {
        name: 'remove-useless-url-params',
        description: 'Clean URLs from tracking parameters',
        apply() {
             try {
                 const youtubeUselessUrlParams = [ 'si', 'pp', 'feature', 'gclid', 'dclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'oac', '_hsenc', '_hsmi', 'mc_eid', 'mc_cid', ];
                function removeTracking(url) { if (!url) return url; let urlObj; try { if (typeof url === 'string' && (url.startsWith('/') || url.startsWith('./') || url.startsWith('../'))) { urlObj = new URL(url, unsafeWindow.location.href); } else if (typeof url === 'string') { urlObj = new URL(url); } else if (url instanceof URL){ urlObj = url; } else { logger.warn('Invalid URL type for removeTracking:', url); return url; } if (!urlObj.search) return urlObj.href; const params = urlObj.searchParams; let changed = false; const keysToDelete = []; for (const key of params.keys()) { for (const item of youtubeUselessUrlParams) { let match = false; if (typeof item === 'string') { if (item === key) match = true; } else if (item instanceof RegExp && item.test(key)) { match = true; } if (match) { keysToDelete.push(key); break; }}} if (keysToDelete.length > 0) { keysToDelete.forEach(key => params.delete(key)); changed = true; } return changed ? urlObj.href : (typeof url === 'string' ? url : url.href); } catch (err) { if (err instanceof TypeError && err.message.includes("Invalid URL")) { return url; } logger.error('Failed to remove useless urlParams for:', url, err); return (typeof url === 'string' ? url : url?.href ?? ''); }}
                const initialHref = unsafeWindow.location.href; const cleanedHref = removeTracking(initialHref); if (initialHref !== cleanedHref) { logger.log('Initial URL cleaned:', initialHref, '->', cleanedHref); try { unsafeWindow.history.replaceState(unsafeWindow.history.state, '', cleanedHref); } catch (histErr) { logger.error("Failed to replaceState for initial URL:", histErr); }}
                const originalPushState = unsafeWindow.history.pushState; unsafeWindow.history.pushState = function(state, title, url) { const cleaned = removeTracking(url); if (url && url !== cleaned) { logger.log('pushState URL cleaned:', url, '->', cleaned); } try { return originalPushState.call(unsafeWindow.history, state, title, cleaned ?? url); } catch (pushErr) { logger.error("Error in hooked pushState:", pushErr); return originalPushState.call(unsafeWindow.history, state, title, url); }};
                const originalReplaceState = unsafeWindow.history.replaceState; unsafeWindow.history.replaceState = function(state, title, url) { const cleaned = removeTracking(url); if (url && url !== cleaned) { logger.log('replaceState URL cleaned:', url, '->', cleaned); } try { return originalReplaceState.call(unsafeWindow.history, state, title, cleaned ?? url); } catch (replaceErr) { logger.error("Error in hooked replaceState:", replaceErr); return originalReplaceState.call(unsafeWindow.history, state, title, url); }};
                 logger.log(this.name, 'applied');
             } catch (err) {
                logger.error('Error applying', this.name, err);
            }
        }
    };

    // 6. Use System Fonts
    const useSystemFonts = {
        name: 'use-system-fonts',
        description: 'Force system default fonts instead of YouTube specific fonts',
        apply() {
            try { GM_addStyle(e`html, body, #masthead, #content, ytd-app, tp-yt-app-drawer, #guide, input, button, textarea, select, .ytd-video-primary-info-renderer, .ytd-video-secondary-info-renderer, #comments, #comment, .ytd-rich-grid-media .ytd-rich-item-renderer #video-title, .ytp-tooltip-text, .ytp-menuitem-label, .ytp-title-text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important; }`); logger.log(this.name, 'applied'); } catch (err) { logger.error('Error applying', this.name, err); }
        }
    };

    // 7. 6 Thumbnails Per Row (ADAPTIVE COLUMNS & FONT SIZES)
    const sixThumbs = {
         name: 'six-thumbnails-per-row',
         description: 'Sets YouTube grid items to 6 per row (adapts to 5 on smaller screens), with adaptive font sizes and fixes channel page layout',
         apply() {
             try {
                 GM_addStyle(e`
                    /* --- BASE STYLES FOR RICH GRID --- */
                    ytd-rich-grid-renderer {
                        /* Default to 6 items, will be overridden by media query if needed */
                        --ytd-rich-grid-items-per-row: 6 !important;
                        /* Default max-width for 6 items */
                        max-width: calc(
                            (var(--ytd-rich-grid-item-max-width, 360px) * 6) + /* 6 items */
                            (var(--ytd-rich-grid-item-margin, 16px) * 5) /* 5 gaps */
                        ) !important;
                        margin-left: auto !important;
                        margin-right: auto !important;
                        width: 100%;
                    }

                    /* Ensure parent containers for grids also propagate the items per row variable */
                    ytd-two-column-browse-results-renderer[is-grid] #primary #contents.ytd-section-list-renderer > *.ytd-section-list-renderer,
                    ytd-browse #primary #contents.ytd-section-list-renderer > *.ytd-section-list-renderer:has(ytd-rich-grid-renderer),
                    ytd-browse[page-subtype="subscriptions"] #contents.ytd-section-list-renderer {
                         --ytd-rich-grid-items-per-row: 6 !important; /* Default to 6, overridden below */
                    }


                    /* Wider grid for specific top-level pages (Home, Subscriptions, Search) */
                    ytd-browse[page-subtype="home"] ytd-rich-grid-renderer,
                    ytd-browse[page-subtype="subscriptions"] ytd-rich-grid-renderer,
                    ytd-search ytd-two-column-search-results-renderer ytd-section-list-renderer > #contents > ytd-item-section-renderer > #contents > ytd-rich-grid-renderer {
                        width: calc(100vw - var(--ytd-guide-width, 240px) - (var(--ytd-masthead-shell-header-horizontal-padding, 24px) * 2) - 2px) !important;
                    }

                    /* Inner contents of the grid */
                    ytd-rich-grid-renderer > #contents.ytd-rich-grid-renderer {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                    }

                    /* Shelf renderers */
                    ytd-shelf-renderer {
                        --ytd-shelf-items-per-row: 6 !important;
                    }

                    /* --- DEFAULT FONT & ELEMENT STYLING FOR GRID ITEMS --- */
                    ytd-rich-item-renderer #video-title,
                    ytd-grid-video-renderer #video-title {
                        font-size: var(--ytd-font-title-sm_-_font-size, 1.6rem);
                        line-height: var(--ytd-font-title-sm_-_line-height, 2.2rem);
                        max-height: calc(var(--ytd-font-title-sm_-_line-height, 2.2rem) * 2) !important;
                        -webkit-line-clamp: 2 !important;
                        display: -webkit-box !important;
                        -webkit-box-orient: vertical !important;
                        overflow: hidden !important;
                        text-overflow: ellipsis !important;
                        white-space: normal !important;
                    }

                    ytd-rich-grid-media #metadata-line,
                    ytd-grid-video-renderer #metadata-line {
                        font-size: var(--ytd-font-body-1_-_font-size, 1.3rem);
                        line-height: var(--ytd-font-body-1_-_line-height, 1.8rem);
                    }
                    ytd-rich-grid-media #channel-name .ytd-channel-name,
                    ytd-grid-video-renderer #channel-name .ytd-channel-name,
                    ytd-channel-name a, ytd-channel-name .ytd-channel-name {
                         font-size: var(--ytd-font-body-1_-_font-size, 1.3rem) !important;
                    }
                    ytd-rich-grid-media #avatar-link.ytd-rich-grid-media,
                    ytd-grid-video-renderer #avatar-link {
                        width: var(--ytd-rich-grid-channel-avatar-size, 36px);
                        height: var(--ytd-rich-grid-channel-avatar-size, 36px);
                        margin-right: var(--ytd-rich-grid-avatar-margin, 12px);
                        flex-shrink: 0; /* Prevent avatar from shrinking if text is long */
                    }

                    /* --- MEDIA QUERY FOR MEDIUM SCREENS (e.g., slightly narrower desktops, larger tablets) --- */
                    @media (max-width: 1600px) {
                        ytd-rich-item-renderer #video-title,
                        ytd-grid-video-renderer #video-title {
                            font-size: 1.3rem !important;
                            line-height: 1.7rem !important;
                            max-height: calc(1.7rem * 2) !important;
                        }

                        ytd-rich-grid-media #metadata-line,
                        ytd-grid-video-renderer #metadata-line,
                        ytd-rich-grid-media #channel-name .ytd-channel-name,
                        ytd-grid-video-renderer #channel-name .ytd-channel-name,
                        ytd-channel-name a, ytd-channel-name .ytd-channel-name {
                            font-size: 1.15rem !important;
                            line-height: 1.5rem !important;
                        }

                        ytd-rich-grid-media #avatar-link.ytd-rich-grid-media,
                        ytd-grid-video-renderer #avatar-link {
                            width: 28px !important;
                            height: 28px !important;
                            margin-right: 8px !important;
                        }
                    }

                    /* --- MEDIA QUERY FOR SMALLER SCREENS (e.g., 14" MacBook Pro default, etc.) --- */
                    @media (max-width: 1550px) {
                        ytd-rich-grid-renderer,
                        ytd-two-column-browse-results-renderer[is-grid] #primary #contents.ytd-section-list-renderer > *.ytd-section-list-renderer,
                        ytd-browse #primary #contents.ytd-section-list-renderer > *.ytd-section-list-renderer:has(ytd-rich-grid-renderer),
                        ytd-browse[page-subtype="subscriptions"] #contents.ytd-section-list-renderer {
                            --ytd-rich-grid-items-per-row: 5 !important; /* Change to 5 items */
                        }

                        ytd-rich-grid-renderer {
                            max-width: calc(
                                (var(--ytd-rich-grid-item-max-width, 360px) * 5) + /* 5 items */
                                (var(--ytd-rich-grid-item-margin, 16px) * 4) /* 4 gaps */
                            ) !important;
                        }
                    }
                 `);
                logger.log(this.name, 'applied with adaptive columns and font sizes');
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
                    ytd-guide-entry-renderer:has(a#endpoint[title='Shorts']),
                    ytd-guide-entry-renderer:has(yt-icon path[d^='M10 14.14V9.86']),
                    ytd-mini-guide-entry-renderer[aria-label='Shorts'] { display: none !important; }
                    ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts] { display: none !important; }
                    ytd-grid-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style='SHORTS']),
                    ytd-video-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style='SHORTS']),
                    ytd-rich-item-renderer:has(ytd-reel-item-renderer) { display: none !important; }
                    tp-yt-paper-tab:has( > .tab-content > .tab-title:contains("Shorts")) { display: none !important; }
                    ytd-rich-grid-renderer #title-container.ytd-rich-grid-renderer:has(h2 yt-formatted-string:contains("Shorts")) { display: none !important; }
                `);
                logger.log(this.name, 'applied');
            } catch (err) {
                 logger.error('Error applying', this.name, err);
            }
        }
    };


    // --- Apply Features ---
    logger.log('Initializing YouTube Enhanced script...');

    disableAV1.apply();
    noWebRTC.apply();
    removeUselessUrlParams.apply();
    sixThumbs.apply(); // This now includes the adaptive logic
    useSystemFonts.apply();
    removeBlackBackdropFilter.apply();
    removeShorts.apply();
    playerVideoFit.apply();

    logger.log('YouTube Enhanced script initialization complete.');

})();