// ==UserScript==
// @name                Better YouTube Theater Mode
// @name:zh-TW          更佳 YouTube 劇場模式
// @name:zh-CN          更佳 YouTube 剧场模式
// @name:ja             より良いYouTubeシアターモード
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_better_theater_mode_namespace
// @version             3.0.3
// @match               *://www.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @require             https://update.greasyfork.org/scripts/549881/1731753/YouTube%20Helper%20API.js
// @noframes
// @grant               GM.getValue
// @grant               GM.setValue
// @grant               GM.deleteValue
// @grant               GM.listValues
// @grant               GM.registerMenuCommand
// @grant               GM.unregisterMenuCommand
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_listValues
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @run-at              document-idle
// @inject-into         page
// @license             MIT
// @description         Improves YouTube's theater mode with a Twitch.tv-like design, enhancing video and chat layouts while maintaining performance and compatibility.
// @description:zh-TW   改善 YouTube 劇場模式，參考 Twitch.tv 的設計，增強影片與聊天室佈局，同時維持效能與相容性。
// @description:zh-CN   改进 YouTube 剧场模式，参考 Twitch.tv 的设计，增强视频与聊天室布局，同时保持性能与兼容性，也达到了类似B站的网页全屏功能。
// @description:ja      YouTubeのシアターモードを改善し、Twitch.tvのデザインを参考にして、動画とチャットのレイアウトを強化しつつ、パフォーマンスと互換性を維持します。
// @downloadURL https://update.greasyfork.org/scripts/522466/Better%20YouTube%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/522466/Better%20YouTube%20Theater%20Mode.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
/* global youtubeHelperApi */

console.log('Better YouTube Theater Mode script init', 'is body ready?', document.readyState, document.body);

(function () {
    'use strict';

    const api = youtubeHelperApi;
    if (!api) return console.error('Helper API not found.');

    const CONFIG = {
        STORAGE_PREFIX: 'betterTheater_',
        MIN_CHAT_SIZE: {
            width: 300, //px
        },
        DEFAULT_SETTINGS: {
            setLowHeadmast: false,
            get theaterChatWidth() {
                return `${CONFIG.MIN_CHAT_SIZE.width}px`;
            },
        },
    };

    const BROWSER_LANGUAGE = navigator.language ?? navigator.userLanguage;
    const TRANSLATIONS = {
        'en-US': {
            moveHeadmastBelowVideoPlayer: 'Move Headmast Below Video Player',
        },
        'zh-TW': {
            moveHeadmastBelowVideoPlayer: '將頁首橫幅移到影片播放器下方',
        },
        'zh-CN': {
            moveHeadmastBelowVideoPlayer: '将页首横幅移动到视频播放器下方',
        },
        ja: {
            moveHeadmastBelowVideoPlayer: 'ヘッドマストをビデオプレイヤーの下に移動',
        },
    };

    function getPreferredLanguage() {
        if (TRANSLATIONS[BROWSER_LANGUAGE]) return BROWSER_LANGUAGE;
        if (BROWSER_LANGUAGE.startsWith('zh')) return 'zh-CN';
        return 'en-US';
    }

    function getLocalizedText() {
        return TRANSLATIONS[getPreferredLanguage()] ?? TRANSLATIONS['en-US'];
    }

    const state = {
        userSettings: { ...CONFIG.DEFAULT_SETTINGS },
        menuItems: [],
        activeStyles: new Map(),
        resizeObserver: null,
        chatWidth: 0,
        moviePlayerHeight: 0,
    };

    const DOM = {
        moviePlayer: null,
    };

    const createGmApi = () => {
        const isGmFallback = typeof GM === 'undefined' && typeof GM_info !== 'undefined';
        if (isGmFallback) {
            return {
                registerMenuCommand: GM_registerMenuCommand,
                unregisterMenuCommand: GM_unregisterMenuCommand,
            };
        }
        return {
            registerMenuCommand: (...args) => window.GM?.registerMenuCommand?.(...args),
            unregisterMenuCommand: (...args) => window.GM?.unregisterMenuCommand?.(...args),
        };
    };

    const GM_API = createGmApi();

    const StyleManager = {
        styleDefinitions: {
            staticDesktopStyle: {
                id: 'betterTheater-staticDesktopStyle',
                getRule: () => `
                    .ytp-fullscreen-quick-actions {
                        display: unset !important;
                    }
                    #show-hide-button.ytd-live-chat-frame {
                        display: none !important;
                    }
                `,
            },
            staticDesktopOptimalStyle: {
                id: 'betterTheater-staticDesktopOptimalStyle',
                getRule: () => `
                    ytd-comments:not([engagement-panel]) {
                        display: none !important;
                    }
                    ytd-watch-flexy[is-two-columns_][is-four-three-to-sixteen-nine-video_]:not([full-bleed-player][full-bleed-no-max-width-columns]):not([fixed-panels]) #primary.ytd-watch-flexy {
                        max-width: 100vw !important;
                    }
                    #clarify-box.ytd-watch-flexy, ytd-watch-flexy[show-expandable-metadata] ytd-watch-metadata.ytd-watch-flexy {
                        margin-top: 0 !important;
                    }
                    #columns.ytd-watch-flexy {
                        flex-direction: column !important;
                    }
                    #primary-inner.ytd-watch-flexy {
                        display: flex !important;
                    }
                    #player.ytd-watch-flexy {
                        max-width: var(--ytd-watch-flexy-max-player-width);
                        min-width: var(--ytd-watch-flexy-max-player-width);
                    }
                    #below.ytd-watch-flexy {
                        padding-left: 12px !important;
                        height: 100% !important;
                    }
                    #secondary.ytd-watch-flexy {
                        padding: var(--ytd-margin-6x) !important;
                        height: 100% !important;
                        min-width: 100vw !important;
                        max-width: 100vw !important;
                    }
                `,
            },
            chatStyle: {
                id: 'betterTheater-chatStyle',
                getRule: () => `
                    ytd-live-chat-frame[theater-watch-while][rounded-container] {
                        border-radius: 0 !important;
                        border-top: 0 !important;
                    }
                    ytd-watch-flexy[fixed-panels] #chat.ytd-watch-flexy {
                        top: 0 !important;
                        border-top: 0 !important;
                        border-bottom: 0 !important;
                    }
                    #chat-container { z-index: 2021 !important; }
                `,
            },
            videoPlayerStyle: {
                id: 'betterTheater-videoPlayerStyle',
                getRule: () =>
                    `ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
                        min-height: calc(100vh - var(--ytd-watch-flexy-masthead-height)) !important;
                        max-height: calc(100vh - var(--ytd-watch-flexy-masthead-height)) !important;
                    }`,
            },
            headmastStyle: {
                id: 'betterTheater-headmastStyle',
                getRule: () => `#masthead-container.ytd-app { max-width: calc(100% - ${state.chatWidth}px) !important; }`,
            },
            lowHeadmastStyle: {
                id: 'betterTheater-lowHeadmastStyle',
                getRule: () => `
                    #page-manager.ytd-app {
                        margin-top: 0 !important;
                        top: calc(-1 * var(--ytd-toolbar-offset)) !important;
                        position: relative !important;
                    }
                    ytd-watch-flexy:not([full-bleed-player][full-bleed-no-max-width-columns]) #columns.ytd-watch-flexy {
                        margin-top: var(--ytd-toolbar-offset) !important;
                    }
                    ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
                        max-height: 100vh !important;
                    }
                    #masthead-container.ytd-app {
                        z-index: 599 !important;
                        top: ${state.moviePlayerHeight}px !important;
                        position: relative !important;
                    }
                `,
            },
            videoPlayerFixStyle: {
                id: 'betterTheater-videoPlayerFixStyle',
                getRule: () => `
                    .html5-video-container { top: -1px !important; }
                    #skip-navigation.ytd-masthead { left: -500px; }
                `,
            },
            chatRendererFixStyle: {
                id: 'betterTheater-chatRendererFixStyle',
                getRule: () => `ytd-live-chat-frame[theater-watch-while][rounded-container] { border-bottom: 0 !important; }`,
            },
            chatClampLimits: {
                id: 'betterTheater-chatClampLimits',
                getRule: () => {
                    const flexy = api.page.watchFlexy;
                    const originalWidth = '402px';
                    const originalMinWidth = '402px';

                    if (flexy) {
                        const style = window.getComputedStyle(flexy);
                        const fetchedWidth = style.getPropertyValue('--ytd-watch-flexy-sidebar-width')?.trim();
                        const fetchedMinWidth = style.getPropertyValue('--ytd-watch-flexy-sidebar-min-width')?.trim();
                        return `
                            ytd-live-chat-frame[theater-watch-while] {
                                min-width: ${CONFIG.MIN_CHAT_SIZE.width}px !important;
                                max-width: 33.33vw !important;
                            }
                            .ytd-watch-flexy {
                                --ytd-watch-flexy-sidebar-width: clamp(${
                                    CONFIG.MIN_CHAT_SIZE.width
                                }px, var(--bt-chat-width), 33.33vw) !important;
                                --ytd-watch-flexy-sidebar-min-width: clamp(${
                                    CONFIG.MIN_CHAT_SIZE.width
                                }px, var(--bt-chat-width), 33.33vw) !important;
                            }
                            ytd-watch-flexy[flexy] #secondary.ytd-watch-flexy {
                                --ytd-watch-flexy-sidebar-width: ${fetchedWidth ?? originalWidth} !important;
                                --ytd-watch-flexy-sidebar-min-width: ${fetchedMinWidth ?? originalMinWidth} !important;
                            }
                            ytd-watch-next-secondary-results-renderer {
                                --ytd-reel-item-compact-layout-width: calc((${fetchedWidth ?? originalWidth} - 8px) / 3) !important;
                                --ytd-reel-item-thumbnail-height: calc((${fetchedWidth ?? originalWidth} / 3 / 9 * 16)) !important;
                            }
                            ytd-live-chat-frame[theater-watch-while] yt-live-chat-renderer {
                                width: 100% !important; max-width: 100% !important;
                            }
                        `;
                    }
                    return '';
                },
            },
        },
        apply(styleDef, isPersistent = false) {
            if (typeof styleDef.getRule !== 'function') return;
            this.remove(styleDef); // Ensure no duplicates

            const styleElement = document.createElement('style');
            styleElement.id = styleDef.id;
            styleElement.textContent = styleDef.getRule();
            document.head.appendChild(styleElement);
            state.activeStyles.set(styleDef.id, {
                element: styleElement,
                persistent: isPersistent,
            });
        },
        remove(styleDef) {
            const styleData = state.activeStyles.get(styleDef.id);
            if (styleData) {
                styleData.element?.remove();
                state.activeStyles.delete(styleDef.id);
            }
        },
        removeAll() {
            const styleIdsToRemove = [...state.activeStyles.keys()];
            styleIdsToRemove.forEach((styleId) => {
                const styleData = state.activeStyles.get(styleId);
                if (styleData && !styleData.persistent) {
                    this.remove({ id: styleId });
                }
            });
        },
        toggle(styleDef, condition) {
            condition ? this.apply(styleDef) : this.remove(styleDef);
        },
    };
    const StorageManager = {
        getValue: async (key) => {
            try {
                return await api.loadFromStorage(CONFIG.STORAGE_PREFIX + key);
            } catch (error) {
                console.error(`Failed to parse storage key "${key}"`, error);
                return null;
            }
        },
        setValue: async (key, value) => {
            try {
                await api.saveToStorage(CONFIG.STORAGE_PREFIX + key, value);
            } catch (error) {
                console.error(`Failed to set storage key "${key}"`, error);
            }
        },
        deleteValue: async (key) => {
            await api.deleteFromStorage(CONFIG.STORAGE_PREFIX + key);
        },
        listValues: async () => {
            const fullList = await api.listFromStorage();
            const filteredList = fullList
                .filter((key) => key.startsWith(CONFIG.STORAGE_PREFIX))
                .map((key) => key.substring(CONFIG.STORAGE_PREFIX.length));
            return filteredList;
        },
    };
    const SettingsManager = {
        async update(key, value) {
            try {
                const settings = await StorageManager.getValue('settings', CONFIG.DEFAULT_SETTINGS);
                settings[key] = value;
                await StorageManager.setValue('settings', settings);
                state.userSettings[key] = value;
            } catch (error) {
                console.error(`Error updating setting: ${key}.`, error);
            }
        },
        async load() {
            try {
                const storedSettings = await StorageManager.getValue('settings', CONFIG.DEFAULT_SETTINGS);
                const newSettings = {
                    ...CONFIG.DEFAULT_SETTINGS,
                    ...storedSettings,
                };
                state.userSettings = newSettings;
                if (Object.keys(storedSettings).length !== Object.keys(newSettings).length) {
                    await StorageManager.setValue('settings', state.userSettings);
                }
            } catch (error) {
                console.error('Error loading settings.', error);
                throw error;
            }
        },
        async cleanupStorage() {
            try {
                const allowedKeys = ['settings'];
                const keys = await StorageManager.listValues();
                for (const key of keys) {
                    if (!allowedKeys.includes(key)) {
                        await StorageManager.deleteValue(key);
                    }
                }
            } catch (error) {
                console.error('Error cleaning up old storage.', error);
            }
        },
    };
    const MenuManager = {
        clear() {
            while (state.menuItems.length) {
                GM_API.unregisterMenuCommand(state.menuItems.pop());
            }
        },
        refresh() {
            this.clear();
            const LABEL = getLocalizedText();
            const shouldAutoClose = GM?.info?.scriptHandler === 'ScriptCat';
            const menuConfig = [
                {
                    label: () => `${state.userSettings.setLowHeadmast ? '✅' : '❌'} ${LABEL.moveHeadmastBelowVideoPlayer}`,
                    id: 'toggleLowHeadmast',
                    action: () =>
                        SettingsManager.update('setLowHeadmast', !state.userSettings.setLowHeadmast).then(() => App.updateAllStyles()),
                },
            ];
            menuConfig.forEach((item) => {
                const commandId = GM_API.registerMenuCommand(
                    item.label(),
                    async () => {
                        await item.action();
                        this.refresh();
                    },
                    { id: item.id, autoClose: shouldAutoClose },
                );
                state.menuItems.push(commandId ?? item.id);
            });
        },
    };
    const ChatInteractionManager = {
        addChatWidthResizeHandle() {
            if (window.innerWidth / 3 <= CONFIG.MIN_CHAT_SIZE.width) return;
            const chat = api.chat.iFrame;
            if (!chat || chat.querySelector('#chat-width-resize-handle')) return;

            const storedWidth = state.userSettings.theaterChatWidth ?? `${CONFIG.MIN_CHAT_SIZE.width}px`;
            this._applyTheaterWidth(api.page.watchFlexy, chat, storedWidth);

            const handle = document.createElement('div');
            handle.id = 'chat-width-resize-handle';
            handle.className = 'style-scope ytd-live-chat-frame';
            Object.assign(handle.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '6px',
                height: '100%',
                cursor: 'ew-resize',
                zIndex: '10001',
            });
            chat.appendChild(handle);

            let startX = 0;
            let startWidth = 0;
            let animationFrame;

            const _onPointerMove = (e) => {
                if (!handle.hasPointerCapture(e.pointerId)) return;
                cancelAnimationFrame(animationFrame);
                animationFrame = requestAnimationFrame(() => {
                    const dx = startX - e.clientX;
                    const newWidth = Math.max(CONFIG.MIN_CHAT_SIZE.width, startWidth + dx);
                    this._applyTheaterWidth(api.page.watchFlexy, chat, `${newWidth}px`);
                });
            };

            const _onPointerUp = (e) => {
                handle.releasePointerCapture(e.pointerId);
                document.removeEventListener('pointermove', _onPointerMove);
                document.removeEventListener('pointerup', _onPointerUp);
                SettingsManager.update(
                    'theaterChatWidth',
                    api.page.watchFlexy.style.getPropertyValue('--bt-chat-width'),
                );
            };

            handle.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                e.preventDefault();
                document.body.click(); // Deselect any text
                startX = e.clientX;
                startWidth = chat.getBoundingClientRect().width;
                handle.setPointerCapture(e.pointerId);
                document.addEventListener('pointermove', _onPointerMove);
                document.addEventListener('pointerup', _onPointerUp);
            });
        },
        _applyTheaterWidth(flexy, chat, widthCss) {
            if (flexy) flexy.style.setProperty('--bt-chat-width', widthCss);
            if (chat) {
                chat.style.width = widthCss;
                chat.style.zIndex = '1999';
            }
        },
        removeChatWidthResizeHandle() {
            api.chat.iFrame?.querySelector('#chat-width-resize-handle')?.remove();
            const flexy = api.page.watchFlexy;
            const chat = api.chat.iFrame;
            if (flexy) flexy.style.removeProperty('--bt-chat-width');
            if (chat) {
                chat.style.width = '';
                chat.style.zIndex = '';
            }
        },
    };
    const App = {
        init() {
            try {
                if (!this.detectGreasemonkey()) throw new Error('Greasemonkey API not detected');
                Promise.all([SettingsManager.cleanupStorage(), SettingsManager.load()]).then(() => {
                    StyleManager.apply(StyleManager.styleDefinitions.chatRendererFixStyle, true);
                    StyleManager.apply(StyleManager.styleDefinitions.videoPlayerFixStyle, true);
                    StyleManager.apply(StyleManager.styleDefinitions.staticDesktopStyle, true);
                    StyleManager.apply(StyleManager.styleDefinitions.videoPlayerStyle, true);
                    //StyleManager.apply(StyleManager.styleDefinitions.staticDesktopOptimalStyle, true);
                    this._handlePageUpdate();
                    this.attachEventListeners();
                    MenuManager.refresh();
                });
            } catch (error) {
                console.error('Initialization failed.', error);
            }
        },
        detectGreasemonkey() {
            return typeof window.GM?.info !== 'undefined' || typeof GM_info !== 'undefined';
        },
        updateAllStyles() {
            try {
                this.updateChatStyles();
                DOM.moviePlayer?.setCenterCrop?.();
            } catch (error) {
                console.error('Error updating styles.', error);
            }
        },
        updateChatStyles() {
            const chatBox = api.chat.iFrame?.getBoundingClientRect();
            const flexy = api.page.watchFlexy;
            const isSecondaryVisible = flexy?.querySelector('#secondary')?.style.display !== 'none';
            const shouldApplyChatStyle =
                api.player.isTheater &&
                !api.player.isFullscreen &&
                !api.chat.isCollapsed &&
                chatBox?.width > 0 &&
                isSecondaryVisible;

            StyleManager.toggle(StyleManager.styleDefinitions.chatStyle, shouldApplyChatStyle);
            StyleManager.toggle(StyleManager.styleDefinitions.chatClampLimits, shouldApplyChatStyle);

            shouldApplyChatStyle ? ChatInteractionManager.addChatWidthResizeHandle() : ChatInteractionManager.removeChatWidthResizeHandle();
            this.updateHeadmastStyle(shouldApplyChatStyle);
        },
        updateHeadmastStyle(isChatStyled) {
            this.updateLowHeadmastStyle();

            const shouldShrinkHeadmast = isChatStyled && api.chat.iFrame?.getAttribute('theater-watch-while') === '';

            state.chatWidth = api.chat.iFrame?.offsetWidth ?? 0;
            StyleManager.toggle(StyleManager.styleDefinitions.headmastStyle, shouldShrinkHeadmast);
        },
        updateLowHeadmastStyle() {
            if (!DOM.moviePlayer) return;
            const shouldApply =
                state.userSettings.setLowHeadmast &&
                api.player.isTheater &&
                !api.player.isFullscreen &&
                api.page.type === 'watch';
            StyleManager.toggle(StyleManager.styleDefinitions.lowHeadmastStyle, shouldApply);
        },
        updateMoviePlayerObserver() {
            const newMoviePlayer = api.player.playerObject;
            if (DOM.moviePlayer === newMoviePlayer) return;
            if (state.resizeObserver) {
                if (DOM.moviePlayer) state.resizeObserver.unobserve(DOM.moviePlayer);
            } else {
                state.resizeObserver = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        state.moviePlayerHeight = entry.contentRect.height;
                        this.updateAllStyles();
                    }
                });
            }

            DOM.moviePlayer = newMoviePlayer;
            if (DOM.moviePlayer) state.resizeObserver.observe(DOM.moviePlayer);
        },
        _handlePageUpdate() {
            this.updateMoviePlayerObserver();
            this.updateAllStyles();
        },
        _handleFullscreenChange() {
            this.updateAllStyles();
        },
        _handleTheaterChange() {
            this.updateAllStyles();
        },
        _handleChatStateUpdate() {
            this.updateAllStyles();
        },
        _handlePageDataFetch() {
            this._handlePageUpdate();
        },
        attachEventListeners() {
            const events = {
                'yt-set-theater-mode-enabled': () => this._handleTheaterChange(),
                'yt-page-data-fetched': () => this._handlePageDataFetch(),
                'yt-page-data-updated': () => this._handlePageUpdate(),
                fullscreenchange: () => this._handleFullscreenChange(),
                'yt-navigate-finish': () => this._handlePageUpdate(),
            };

            for (const [event, handler] of Object.entries(events)) {
                window.addEventListener(event, handler.bind(this), {
                    capture: true,
                    passive: true,
                });
            }

            api.eventTarget.addEventListener(
                'yt-helper-api-chat-state-updated',
                this._handleChatStateUpdate.bind(this),
            );

            let isResizeScheduled = false;
            window.addEventListener('resize', () => {
                if (isResizeScheduled) return;
                isResizeScheduled = true;
                requestAnimationFrame(() => {
                    this.updateAllStyles();
                    isResizeScheduled = false;
                });
            });
        },
    };
    App.init();
})();
