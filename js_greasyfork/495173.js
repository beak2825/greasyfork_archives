// ==UserScript==
// @name           YouTube Enchantments
// @namespace      http://tampermonkey.net/
// @version        0.8.5
// @description    Automatically likes videos of channels you're subscribed to, scrolls down on Youtube with a toggle button, and bypasses the AdBlock ban.
// @author         JJJ
// @match          https://www.youtube.com/*
// @exclude        https://www.youtube.com/*/community
// @icon           https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @run-at         document-idle
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/495173/YouTube%20Enchantments.user.js
// @updateURL https://update.greasyfork.org/scripts/495173/YouTube%20Enchantments.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Add logger configuration
    const Logger = {
        enabled: true,
        styles: {
            info: 'color: #2196F3; font-weight: bold',
            warning: 'color: #FFC107; font-weight: bold',
            success: 'color: #4CAF50; font-weight: bold',
            error: 'color: #F44336; font-weight: bold'
        },
        prefix: '[YouTubeEnchantments]',
        getTimestamp() {
            return new Date().toISOString().split('T')[1].slice(0, -1);
        },
        info(msg) {
            if (!this.enabled) return;
            console.log(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.info);
        },
        warning(msg) {
            if (!this.enabled) return;
            console.warn(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.warning);
        },
        success(msg) {
            if (!this.enabled) return;
            console.log(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.success);
        },
        error(msg) {
            if (!this.enabled) return;
            console.error(`%c${this.prefix} ${this.getTimestamp()} - ${msg}`, this.styles.error);
        }
    };

    // Basic browser feature warning (no early return to keep functionality)
    if (!window.URL) {
        Logger.warning('URL API not available; some features may not work as expected.');
    }

    // Inject the YouTube IFrame API script with error handling
    function injectYouTubeAPI() {
        return new Promise((resolve, reject) => {
            try {
                // If API already present, resolve immediately
                if (window.YT && window.YT.Player) return resolve();

                const existing = Array.from(document.scripts).find(s => s.src && s.src.includes('https://www.youtube.com/iframe_api'));
                if (existing) {
                    existing.addEventListener('load', () => resolve());
                    existing.addEventListener('error', reject);
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                script.onload = () => resolve();
                script.onerror = (e) => reject(e);
                document.head.appendChild(script);
            } catch (e) {
                reject(e);
            }
        });
    }

    // Constants - Optimized selectors
    const SELECTORS = {
        PLAYER: '#movie_player',
        SUBSCRIBE_BUTTON: '#subscribe-button > ytd-subscribe-button-renderer, ytd-reel-player-overlay-renderer #subscribe-button, tp-yt-paper-button[subscribed]',
        LIKE_BUTTON: [
            'like-button-view-model button',
            'ytd-menu-renderer button[aria-label*="like" i]',
            'button[aria-label*="like" i]',
            'ytd-toggle-button-renderer[aria-pressed] button',
            'ytd-reel-player-overlay-renderer ytd-like-button-view-model button',
            'ytd-reel-video-renderer ytd-like-button-view-model button'
        ].join(','),
        DISLIKE_BUTTON: [
            'dislike-button-view-model button',
            'ytd-menu-renderer button[aria-label*="dislike" i]',
            'button[aria-label*="dislike" i]',
            'ytd-toggle-button-renderer[aria-pressed] button[aria-label*="dislike" i]'
        ].join(','),
        PLAYER_CONTAINER: '#player-container-outer',
        ERROR_SCREEN: '#error-screen',
        PLAYABILITY_ERROR: '.yt-playability-error-supported-renderers',
        LIVE_BADGE: '.ytp-live-badge',
        GAME_SECTION: 'ytd-rich-section-renderer, div#dismissible.style-scope.ytd-rich-shelf-renderer'
    };

    const CONSTANTS = {
        IFRAME_ID: 'adblock-bypass-player',
        STORAGE_KEY: 'youtubeEnchantmentsSettings',
        DELAY: 300,
        MAX_TRIES: 150,
        DUPLICATE_CHECK_INTERVAL: 7000,
        GAME_CHECK_INTERVAL: 2000,
        MIN_CHECK_FREQUENCY: 1000,
        MAX_CHECK_FREQUENCY: 30000
    };

    // Optimized settings with better defaults
    const defaultSettings = {
        autoLikeEnabled: true,
        autoLikeLiveStreams: false,
        likeIfNotSubscribed: false,
        watchThreshold: 0,
        checkFrequency: 3000,
        adBlockBypassEnabled: false,
        scrollSpeed: 50,
        removeGamesEnabled: true,
        loggingEnabled: true
    };

    let settings = loadSettings();
    const autoLikedVideoIds = new Set();
    let isScrolling = false;
    let scrollInterval;
    let currentPageUrl = window.location.href;
    let tries = 0;

    // Scheduler/observer references
    let checkTimer = null;
    let duplicateCleanupInterval = null;
    let gameHideInterval = null;
    let adBlockObserver = null;
    let likeReadyObserver = null;

    // Keep Logger toggle in sync with settings
    Logger.enabled = !!settings.loggingEnabled;

    const urlUtils = {
        extractParams(url) {
            try {
                const params = new URL(url).searchParams;
                return {
                    videoId: params.get('v'),
                    playlistId: params.get('list'),
                    index: params.get('index')
                };
            } catch (e) {
                console.error('Failed to extract URL params:', e);
                return {};
            }
        },

        getTimestampFromUrl(url) {
            try {
                const timestamp = new URL(url).searchParams.get('t');
                if (timestamp) {
                    const timeArray = timestamp.split(/h|m|s/).map(Number);
                    const timeInSeconds = timeArray.reduce((acc, time, index) =>
                        acc + time * Math.pow(60, 2 - index), 0);
                    return `&start=${timeInSeconds}`;
                }
            } catch (e) {
                console.error('Failed to extract timestamp:', e);
            }
            return '';
        }
    };

    let player;

    // Updated PlayerManager
    const playerManager = {
        async initPlayer() {
            try {
                await injectYouTubeAPI();
                const iframe = document.getElementById(CONSTANTS.IFRAME_ID);
                if (iframe) {
                    player = new YT.Player(CONSTANTS.IFRAME_ID, {
                        events: {
                            'onReady': this.onPlayerReady.bind(this),
                            'onStateChange': this.onPlayerStateChange.bind(this),
                            'onError': (event) => {
                                Logger.error(`Player error: ${event.data}`);
                            }
                        }
                    });
                }
            } catch (error) {
                Logger.error(`Failed to initialize player: ${error}`);
            }
        },

        onPlayerReady(event) {
            Logger.info('Player is ready');
        },

        onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.AD_STARTED) {
                Logger.info('Ad is playing, allowing ad to complete.');
            } else if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PLAYING) {
                Logger.info('Video is playing, ensuring it is tracked in history.');
            }
        },

        createIframe(url) {
            try {
                const { videoId, playlistId, index } = urlUtils.extractParams(url);
                if (!videoId) return null;

                const iframe = document.createElement('iframe');
                const commonArgs = 'autoplay=1&modestbranding=1&enablejsapi=1&origin=' + encodeURIComponent(window.location.origin);
                const embedUrl = playlistId
                    ? `https://www.youtube.com/embed/${videoId}?${commonArgs}&list=${playlistId}&index=${index}`
                    : `https://www.youtube.com/embed/${videoId}?${commonArgs}${urlUtils.getTimestampFromUrl(url)}`;

                this.setIframeAttributes(iframe, embedUrl);
                return iframe;
            } catch (error) {
                Logger.error(`Failed to create iframe: ${error}`);
                return null;
            }
        },

        setIframeAttributes(iframe, url) {
            iframe.id = CONSTANTS.IFRAME_ID;
            iframe.src = url;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'height:100%; width:calc(100% - 240px); border:none; border-radius:12px; position:relative; left:240px;';
        },

        replacePlayer(url) {
            const playerContainer = document.querySelector(SELECTORS.ERROR_SCREEN);
            if (!playerContainer) return;

            let iframe = document.getElementById(CONSTANTS.IFRAME_ID);
            if (iframe) {
                this.setIframeAttributes(iframe, url);
            } else {
                iframe = this.createIframe(url);
                if (iframe) {
                    playerContainer.appendChild(iframe);
                    this.initPlayer();
                }
            }
            // Ensure the iframe is on top of the player container
            this.bringToFront(CONSTANTS.IFRAME_ID);
            this.addScrollListener();
        },

        bringToFront(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                const maxZIndex = Math.max(
                    ...Array.from(document.querySelectorAll('*'))
                        .map(e => parseInt(window.getComputedStyle(e).zIndex) || 0)
                );
                element.style.zIndex = maxZIndex + 1;
            }
        },

        removeDuplicates() {
            const iframes = document.querySelectorAll(`#${CONSTANTS.IFRAME_ID}`);
            if (iframes.length > 1) {
                Array.from(iframes).slice(1).forEach(iframe => iframe.remove());
            }
        },

        addScrollListener() {
            window.addEventListener('scroll', this.handleScroll);
        },

        handleScroll() {
            const iframe = document.getElementById(CONSTANTS.IFRAME_ID);
            if (!iframe) return;

            const playerContainer = document.querySelector(SELECTORS.ERROR_SCREEN);
            if (!playerContainer) return;

            const rect = playerContainer.getBoundingClientRect();
            if (rect.top < 0) {
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '240px';
                iframe.style.width = 'calc(100% - 240px)';
                iframe.style.height = 'calc(100vh - 56px)'; // Adjust height as needed
            } else {
                iframe.style.position = 'relative';
                iframe.style.top = '0';
                iframe.style.left = '240px';
                iframe.style.width = 'calc(100% - 240px)';
                iframe.style.height = '100%';
            }
        }
    };

    // Throttle helper to avoid rapid actions
    function throttle(fn, wait) {
        let last = 0;
        let timeout = null;
        return function (...args) {
            const now = Date.now();
            const remaining = wait - (now - last);
            const context = this;
            if (remaining <= 0) {
                if (timeout) { clearTimeout(timeout); timeout = null; }
                last = now;
                fn.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    last = Date.now();
                    timeout = null;
                    fn.apply(context, args);
                }, remaining);
            }
        };
    }

    // Optimized settings management
    function loadSettings() {
        const saved = GM_getValue(CONSTANTS.STORAGE_KEY, {});
        return { ...defaultSettings, ...saved };
    }

    const saveSettings = () => GM_setValue(CONSTANTS.STORAGE_KEY, settings);

    function createSettingsMenu() {
        GM_registerMenuCommand('YouTube Enchantments Settings', showSettingsDialog);
    }

    function showSettingsDialog() {
        let dialog = document.getElementById('youtube-enchantments-settings');
        if (!dialog) {
            dialog = createSettingsDialog();
            document.body.appendChild(dialog);
        }
        dialog.style.display = 'block';
    }

    function createSettingsDialog() {
        const wrapper = document.createElement('div');
        wrapper.id = 'youtube-enchantments-settings';

        // Styles (Trusted Types safe)
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .dpe-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #030d22;
                border: 1px solid #2a2945;
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                z-index: 9999;
                color: #ffffff;
                width: 320px;
                font-family: 'Roboto', Arial, sans-serif;
            }
            .dpe-dialog h3 {
                margin-top: 0;
                font-size: 1.8em;
                text-align: center;
                margin-bottom: 24px;
                color: #ffffff;
                font-weight: 700;
            }
            .dpe-toggle-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding: 8px;
                border-radius: 8px;
                background: #15132a;
                transition: background-color 0.2s;
            }
            .dpe-toggle-container:hover { background: #1a1832; }
            .dpe-toggle-label {
                flex-grow: 1;
                color: #ffffff;
                font-size: 1.1em;
                font-weight: 600;
                margin-left: 12px;
            }
            .dpe-toggle { position: relative; display: inline-block; width: 46px; height: 24px; }
            .dpe-toggle input {
                position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer; margin: 0;
            }
            .dpe-toggle-slider {
                position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
                background-color: #2a2945; transition: .3s; border-radius: 24px;
            }
            .dpe-toggle-slider:before {
                position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
                background-color: #ffffff; transition: .3s; border-radius: 50%;
            }
            .dpe-toggle input:checked + .dpe-toggle-slider { background-color: #cc0000; }
            .dpe-toggle input:checked + .dpe-toggle-slider:before { transform: translateX(22px); }
            .dpe-slider-container { margin: 24px 0; padding: 12px; background: #15132a; border-radius: 8px; }
            .dpe-slider-container label { display: block; margin-bottom: 8px; color: #ffffff; font-size: 1.1em; font-weight: 600; }
            .dpe-slider-container input[type="range"] {
                width: 100%; margin: 8px 0; height: 4px; background: #2a2945; border-radius: 2px; -webkit-appearance: none;
            }
            .dpe-slider-container input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none; width: 16px; height: 16px; background: #cc0000; border-radius: 50%; cursor: pointer; transition: background-color 0.2s;
            }
            .dpe-slider-container input[type="range"]::-webkit-slider-thumb:hover { background: #990000; }
            .dpe-button-container { display: flex; justify-content: space-between; margin-top: 24px; gap: 12px; }
            .dpe-button { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 1.1em; font-weight: 600; transition: all 0.2s; flex: 1; }
            .dpe-button-save { background-color: #cc0000; color: white; }
            .dpe-button-save:hover { background-color: #990000; transform: translateY(-1px); }
            .dpe-button-cancel { background-color: #15132a; color: white; border: 1px solid #2a2945; }
            .dpe-button-cancel:hover { background-color: #1a1832; transform: translateY(-1px); }
        `;

        const container = document.createElement('div');
        container.className = 'dpe-dialog';

        const title = document.createElement('h3');
        title.textContent = 'YouTube Enchantments';
        container.appendChild(title);

        // Toggles
        container.appendChild(createToggle('autoLikeEnabled', 'Auto Like', 'Automatically like videos of subscribed channels'));
        container.appendChild(createToggle('autoLikeLiveStreams', 'Like Live Streams', 'Include live streams in auto-like feature'));
        container.appendChild(createToggle('likeIfNotSubscribed', 'Like All Videos', 'Like videos even if not subscribed'));
        container.appendChild(createToggle('adBlockBypassEnabled', 'AdBlock Bypass', 'Bypass AdBlock detection'));
        container.appendChild(createToggle('removeGamesEnabled', 'Remove Games', 'Hide game sections from YouTube homepage'));
        container.appendChild(createToggle('loggingEnabled', 'Logging', 'Enable or disable console logging'));

        // Watch Threshold slider
        const wt = document.createElement('div');
        wt.className = 'dpe-slider-container';
        wt.title = 'Percentage of video to watch before liking';
        const wtLabel = document.createElement('label');
        wtLabel.setAttribute('for', 'watchThreshold');
        wtLabel.textContent = 'Watch Threshold';
        const wtInput = document.createElement('input');
        wtInput.type = 'range'; wtInput.id = 'watchThreshold'; wtInput.min = '0'; wtInput.max = '100'; wtInput.step = '10';
        wtInput.setAttribute('data-setting', 'watchThreshold');
        wtInput.value = String(settings.watchThreshold);
        const wtValue = document.createElement('span');
        wtValue.id = 'watchThresholdValue';
        wtValue.textContent = `${settings.watchThreshold}%`;
        wt.appendChild(wtLabel); wt.appendChild(wtInput); wt.appendChild(wtValue);
        container.appendChild(wt);

        // Scroll Speed slider
        const ss = document.createElement('div');
        ss.className = 'dpe-slider-container';
        ss.title = 'Speed of auto-scroll (pixels per interval)';
        const ssLabel = document.createElement('label');
        ssLabel.setAttribute('for', 'scrollSpeed');
        ssLabel.textContent = 'Scroll Speed';
        const ssInput = document.createElement('input');
        ssInput.type = 'range'; ssInput.id = 'scrollSpeed'; ssInput.min = '10'; ssInput.max = '100'; ssInput.step = '5';
        ssInput.setAttribute('data-setting', 'scrollSpeed');
        ssInput.value = String(settings.scrollSpeed);
        const ssValue = document.createElement('span');
        ssValue.id = 'scrollSpeedValue';
        ssValue.textContent = `${settings.scrollSpeed}px`;
        ss.appendChild(ssLabel); ss.appendChild(ssInput); ss.appendChild(ssValue);
        container.appendChild(ss);

        // Check Frequency slider
        const cf = document.createElement('div');
        cf.className = 'dpe-slider-container';
        cf.title = 'Interval for auto-like checks (milliseconds)';
        const cfLabel = document.createElement('label');
        cfLabel.setAttribute('for', 'checkFrequency');
        cfLabel.textContent = 'Check Frequency (ms)';
        const cfInput = document.createElement('input');
        cfInput.type = 'range'; cfInput.id = 'checkFrequency'; cfInput.min = String(CONSTANTS.MIN_CHECK_FREQUENCY); cfInput.max = String(CONSTANTS.MAX_CHECK_FREQUENCY); cfInput.step = '500';
        cfInput.setAttribute('data-setting', 'checkFrequency');
        cfInput.value = String(settings.checkFrequency);
        const cfValue = document.createElement('span');
        cfValue.id = 'checkFrequencyValue';
        cfValue.textContent = `${settings.checkFrequency}ms`;
        cf.appendChild(cfLabel); cf.appendChild(cfInput); cf.appendChild(cfValue);
        container.appendChild(cf);

        // Buttons
        const btns = document.createElement('div');
        btns.className = 'dpe-button-container';
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveSettingsButton'; saveBtn.className = 'dpe-button dpe-button-save';
        saveBtn.textContent = 'Save';
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'closeSettingsButton'; cancelBtn.className = 'dpe-button dpe-button-cancel';
        cancelBtn.textContent = 'Cancel';
        btns.appendChild(saveBtn); btns.appendChild(cancelBtn);
        container.appendChild(btns);

        // Compose
        wrapper.appendChild(styleEl);
        wrapper.appendChild(container);

        // Listeners
        saveBtn.addEventListener('click', () => { saveSettings(); hideSettingsDialog(); });
        cancelBtn.addEventListener('click', hideSettingsDialog);
        wrapper.querySelectorAll('.dpe-toggle input').forEach(toggle => {
            toggle.addEventListener('change', handleSettingChange);
        });
        wtInput.addEventListener('input', handleSliderInput);
        ssInput.addEventListener('input', handleSliderInput);
        cfInput.addEventListener('input', handleSliderInput);

        return wrapper;
    }

    function createToggle(id, label, title) {
        const container = document.createElement('div');
        container.className = 'dpe-toggle-container';
        container.title = title;

        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'dpe-toggle';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.setAttribute('data-setting', id);
        if (settings[id]) input.checked = true;
        const slider = document.createElement('span');
        slider.className = 'dpe-toggle-slider';
        toggleLabel.appendChild(input);
        toggleLabel.appendChild(slider);

        const textLabel = document.createElement('label');
        textLabel.className = 'dpe-toggle-label';
        textLabel.textContent = label;

        container.appendChild(toggleLabel);
        container.appendChild(textLabel);
        return container;
    }

    function hideSettingsDialog() {
        const dialog = document.getElementById('youtube-enchantments-settings');
        if (dialog) {
            dialog.style.display = 'none';
        }
    }

    function formatSettingName(setting) {
        return setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    function handleSettingChange(e) {
        if (e.target.dataset.setting) {
            if (e.target.type === 'checkbox') {
                toggleSetting(e.target.dataset.setting);
            } else if (e.target.type === 'range') {
                updateNumericSetting(e.target.dataset.setting, e.target.value);
            }

            // Log the status of adBlockBypassEnabled if it is changed
            if (e.target.dataset.setting === 'adBlockBypassEnabled') {
                Logger.info(`AdBlock Ban Bypass is ${e.target.checked ? 'enabled' : 'disabled'}`);
            }
            if (e.target.dataset.setting === 'loggingEnabled') {
                Logger.enabled = !!settings.loggingEnabled;
                Logger.info(`Logging ${Logger.enabled ? 'enabled' : 'disabled'}`);
            }
            if (e.target.dataset.setting === 'checkFrequency') {
                // Apply new frequency immediately
                restartBackgroundCheck();
            }
        }
    }


    function handleSliderInput(e) {
        if (e.target.type === 'range') {
            const value = e.target.value;
            if (e.target.id === 'watchThreshold') {
                document.getElementById('watchThresholdValue').textContent = `${value}%`;
                updateNumericSetting('watchThreshold', value);
            } else if (e.target.id === 'scrollSpeed') {
                document.getElementById('scrollSpeedValue').textContent = `${value}px`;
                updateNumericSetting('scrollSpeed', value);
            } else if (e.target.id === 'checkFrequency') {
                document.getElementById('checkFrequencyValue').textContent = `${value}ms`;
                updateNumericSetting('checkFrequency', value);
                restartBackgroundCheck();
            }
        }
    }

    function toggleSetting(settingName) {
        settings[settingName] = !settings[settingName];
        saveSettings();
        if (settingName === 'loggingEnabled') {
            Logger.enabled = !!settings.loggingEnabled;
        }
    }

    function updateNumericSetting(settingName, value) {
        let v = parseInt(value, 10);
        if (settingName === 'checkFrequency') {
            if (!Number.isFinite(v)) v = defaultSettings.checkFrequency;
            v = Math.min(CONSTANTS.MAX_CHECK_FREQUENCY, Math.max(CONSTANTS.MIN_CHECK_FREQUENCY, v));
        }
        settings[settingName] = v;
        saveSettings();
    }

    function startBackgroundCheck() {
        restartBackgroundCheck();
    }

    function restartBackgroundCheck() {
        if (checkTimer) clearInterval(checkTimer);
        const freq = Math.min(CONSTANTS.MAX_CHECK_FREQUENCY, Math.max(CONSTANTS.MIN_CHECK_FREQUENCY, settings.checkFrequency || defaultSettings.checkFrequency));
        const throttled = throttle(checkAndLikeVideo, Math.max(750, Math.floor(freq / 2)));
        checkTimer = setInterval(throttled, freq);
        Logger.info(`Background check started (every ${freq}ms)`);
    }

    let isChecking = false;
    function checkAndLikeVideo() {
        if (isChecking) return; // prevent reentrancy
        isChecking = true;
        Logger.info('Checking if video should be liked...');
        if (watchThresholdReached()) {
            Logger.info('Watch threshold reached.');
            if (settings.autoLikeEnabled) {
                Logger.info('Auto-like is enabled.');
                if (settings.likeIfNotSubscribed || isSubscribed()) {
                    Logger.info('User is subscribed or likeIfNotSubscribed is enabled.');
                    if (settings.autoLikeLiveStreams || !isLiveStream()) {
                        Logger.info('Video is not a live stream or auto-like for live streams is enabled.');
                        likeVideo();
                    } else {
                        Logger.info('Video is a live stream and auto-like for live streams is disabled.');
                    }
                } else {
                    Logger.info('User is not subscribed and likeIfNotSubscribed is disabled.');
                }
            } else {
                Logger.info('Auto-like is disabled.');
            }
        } else {
            Logger.info('Watch threshold not reached.');
        }
        isChecking = false;
    }

    function watchThresholdReached() {
        const player = document.querySelector(SELECTORS.PLAYER);
        if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();

            if (duration > 0) {
                const watched = currentTime / duration;
                const watchedTarget = settings.watchThreshold / 100;
                if (watched < watchedTarget) {
                    Logger.info(`Waiting until watch threshold reached (${(watched * 100).toFixed(1)}%/${settings.watchThreshold}%)...`);
                    return false;
                }
            }
        }
        return true;
    }

    // Optimized subscription detection
    function isSubscribed() {
        const subscribeButton = document.querySelector(SELECTORS.SUBSCRIBE_BUTTON);
        if (!subscribeButton) {
            Logger.info('Subscribe button not found');
            return false;
        }

        const isSubbed = subscribeButton.hasAttribute('subscribe-button-invisible') ||
            subscribeButton.hasAttribute('subscribed') ||
            /subscrib/i.test(subscribeButton.textContent);

        Logger.info(`Subscribe button found: true, Is subscribed: ${isSubbed}`);
        return isSubbed;
    }

    function isLiveStream() {
        try {
            const liveBadge = document.querySelector(SELECTORS.LIVE_BADGE);
            if (liveBadge && window.getComputedStyle(liveBadge).display !== 'none') return true;
            // Shorts live is rare; fallback false
            return false;
        } catch (_) { return false; }
    }

    function likeVideo() {
        Logger.info('Attempting to like the video...');
        const likeButton = document.querySelector(SELECTORS.LIKE_BUTTON);
        const dislikeButton = document.querySelector(SELECTORS.DISLIKE_BUTTON);
        const videoId = getVideoId();

        Logger.info(`Like button found: ${!!likeButton}`);
        Logger.info(`Dislike button found: ${!!dislikeButton}`);
        Logger.info(`Video ID: ${videoId}`);

        if (!likeButton || !dislikeButton || !videoId) {
            Logger.info('Like button, dislike button, or video ID not found.');
            return;
        }

        const likePressed = isButtonPressed(likeButton);
        const dislikePressed = isButtonPressed(dislikeButton);
        const alreadyAutoLiked = autoLikedVideoIds.has(videoId);

        Logger.info(`Like button pressed: ${likePressed}`);
        Logger.info(`Dislike button pressed: ${dislikePressed}`);
        Logger.info(`Already auto-liked: ${alreadyAutoLiked}`);

        if (!likePressed && !dislikePressed && !alreadyAutoLiked) {
            Logger.info('Liking the video...');
            likeButton.click();

            // Check again after a short delay
            setTimeout(() => {
                if (isButtonPressed(likeButton)) {
                    Logger.success('Video liked successfully.');
                    autoLikedVideoIds.add(videoId);
                } else {
                    Logger.warning('Failed to like the video.');
                }
            }, 500);
        } else {
            Logger.info('Video already liked or disliked, or already auto-liked.');
        }
    }

    function isButtonPressed(button) {
        if (!button) return false;
        const pressed = button.classList.contains('style-default-active') || button.getAttribute('aria-pressed') === 'true';
        const toggled = button.closest('ytd-toggle-button-renderer')?.getAttribute('aria-pressed') === 'true';
        return pressed || toggled;
    }

    function getVideoId() {
        // Watch page
        const watchFlexyElem = document.querySelector('#page-manager > ytd-watch-flexy');
        if (watchFlexyElem && watchFlexyElem.hasAttribute('video-id')) {
            return watchFlexyElem.getAttribute('video-id');
        }
        // Shorts URL pattern
        const path = window.location.pathname;
        const shortsMatch = path.match(/^\/shorts\/([\w-]{5,})/);
        if (shortsMatch) return shortsMatch[1];
        // Fallback to query param
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    function handleAdBlockError() {
        if (!settings.adBlockBypassEnabled) {
            Logger.info('AdBlock bypass disabled');
            return;
        }

        const playabilityError = document.querySelector(SELECTORS.PLAYABILITY_ERROR);
        if (playabilityError) {
            playabilityError.remove();
            playerManager.replacePlayer(window.location.href);
        } else if (tries < CONSTANTS.MAX_TRIES) {
            tries++;
            setTimeout(handleAdBlockError, CONSTANTS.DELAY);
        }
    }

    function redirectToVideosPage() {
        const currentUrl = window.location.href;

        // Handle new format @username channels
        if (currentUrl.includes('/@')) {
            if (currentUrl.endsWith('/featured') || currentUrl.includes('/featured?')) {
                const videosUrl = currentUrl.replace(/\/featured(\?.*)?$/, '/videos');
                Logger.info(`Redirecting to videos page: ${videosUrl}`);
                window.location.replace(videosUrl);
                return true;
            } else if (currentUrl.match(/\/@[^\/]+\/?(\?.*)?$/)) {
                const videosUrl = currentUrl.replace(/\/?(\?.*)?$/, '/videos');
                Logger.info(`Redirecting to videos page: ${videosUrl}`);
                window.location.replace(videosUrl);
                return true;
            }
        }

        // Handle legacy channel URLs
        if (currentUrl.includes('/channel/')) {
            if (currentUrl.endsWith('/featured') || currentUrl.includes('/featured?')) {
                const videosUrl = currentUrl.replace(/\/featured(\?.*)?$/, '/videos');
                Logger.info(`Redirecting to videos page: ${videosUrl}`);
                window.location.replace(videosUrl);
                return true;
            } else if (currentUrl.match(/\/channel\/[^\/]+\/?(\?.*)?$/)) {
                const videosUrl = currentUrl.replace(/\/?(\?.*)?$/, '/videos');
                Logger.info(`Redirecting to videos page: ${videosUrl}`);
                window.location.replace(videosUrl);
                return true;
            }
        }

        return false;
    }

    // Remove redundant functions
    const toggleSettingsDialog = () => {
        const dialog = document.getElementById('youtube-enchantments-settings');
        if (dialog && dialog.style.display === 'block') {
            hideSettingsDialog();
        } else {
            showSettingsDialog();
        }
    };

    const toggleScrolling = () => {
        if (isScrolling) {
            clearInterval(scrollInterval);
            isScrolling = false;
        } else {
            isScrolling = true;
            scrollInterval = setInterval(() => window.scrollBy(0, settings.scrollSpeed), 20);
        }
    };

    const handlePageUp = () => {
        if (isScrolling) {
            clearInterval(scrollInterval);
            isScrolling = false;
        } else {
            window.scrollTo(0, 0);
        }
    };

    // Observe like button readiness to reduce polling pressure
    function observeLikeButtonReady() {
        if (likeReadyObserver) likeReadyObserver.disconnect();
        likeReadyObserver = new MutationObserver(() => {
            const btn = document.querySelector(SELECTORS.LIKE_BUTTON);
            if (btn) {
                Logger.info('Like button detected by observer');
                // Trigger a check once when like button shows up
                checkAndLikeVideo();
                if (likeReadyObserver) likeReadyObserver.disconnect();
            }
        });
        likeReadyObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Optimized event handling
    function setupEventListeners() {
        // Page navigation
        window.addEventListener('beforeunload', () => {
            currentPageUrl = window.location.href;
            cleanup();
        });

        document.addEventListener('yt-navigate-finish', () => {
            Logger.info('Page navigation detected');
            const newUrl = window.location.href;
            if (newUrl !== currentPageUrl) {
                Logger.info(`URL changed: ${newUrl}`);

                if (redirectToVideosPage()) return;

                if (newUrl.endsWith('.com/')) {
                    const iframe = document.getElementById(CONSTANTS.IFRAME_ID);
                    if (iframe) {
                        Logger.info('Removing iframe');
                        iframe.remove();
                    }
                } else {
                    Logger.info('Handling potential ad block error');
                    handleAdBlockError();
                }
                currentPageUrl = newUrl;
                // Stop auto-scroll on navigation
                if (isScrolling && scrollInterval) { clearInterval(scrollInterval); isScrolling = false; }
                // Restart background checks and observers on navigation
                restartBackgroundCheck();
                observeLikeButtonReady();
            }
        });

        window.addEventListener('popstate', () => {
            Logger.info('popstate detected');
            const newUrl = window.location.href;
            if (newUrl !== currentPageUrl) {
                currentPageUrl = newUrl;
                restartBackgroundCheck();
                observeLikeButtonReady();
            }
        });

        // Keyboard shortcuts (capture early to avoid site handlers swallowing keys)
        document.addEventListener('keydown', (event) => {
            const tag = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : '';
            const isEditable = tag === 'input' || tag === 'textarea' || (event.target && event.target.isContentEditable);

            switch (event.key) {
                case 'F2':
                    // Avoid triggering while typing inside inputs/textareas
                    if (!isEditable) {
                        event.preventDefault();
                        event.stopPropagation();
                        Logger.info('F2 pressed - toggling settings dialog');
                        toggleSettingsDialog();
                    }
                    break;
                case 'PageDown':
                    if (!isEditable) {
                        event.preventDefault();
                        toggleScrolling();
                    }
                    break;
                case 'PageUp':
                    if (!isEditable) {
                        event.preventDefault();
                        handlePageUp();
                    }
                    break;
            }
        }, true);

        // DOM observer for ad block errors
        adBlockObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE &&
                            node.matches(SELECTORS.PLAYABILITY_ERROR)) {
                            Logger.info('Playability error detected');
                            handleAdBlockError();
                            return;
                        }
                    }
                }
            }
        });
        adBlockObserver.observe(document.body, { childList: true, subtree: true });

        // Periodic tasks
        duplicateCleanupInterval = setInterval(() => playerManager.removeDuplicates(), CONSTANTS.DUPLICATE_CHECK_INTERVAL);
        gameHideInterval = setInterval(hideGameSections, CONSTANTS.GAME_CHECK_INTERVAL);

        // Initial like button observation
        observeLikeButtonReady();
    }

    function hideGameSections() {
        if (!settings.removeGamesEnabled) return;

        const allSections = document.querySelectorAll(SELECTORS.GAME_SECTION);
        if (allSections.length > 0) {
            allSections.forEach(section => {
                // Check if this is a game section using DOM traversal
                if (isGameSection(section)) {
                    section.style.display = 'none';
                    Logger.success('Game section hidden');
                }
            });
        }
    }

    // Optimized game section detection
    function isGameSection(section) {
        // Quick checks first
        if (section.querySelectorAll('div#dismissible.style-scope.ytd-rich-shelf-renderer').length > 0) return true;
        if (section.querySelectorAll('ytd-mini-game-card-view-model').length > 0) return true;
        if (section.querySelectorAll('a[href*="/playables"], a[href*="gaming"]').length > 0) return true;

        // Text-based checks
        const titleElement = section.querySelector('#title-text span');
        if (titleElement && /game|jugable/i.test(titleElement.textContent)) return true;

        // Aria-label checks
        const richShelfElements = section.querySelectorAll('ytd-rich-shelf-renderer');
        for (const element of richShelfElements) {
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel && /game|juego/i.test(ariaLabel)) return true;
        }

        // Genre checks
        const gameGenres = ['Arcade', 'Racing', 'Sports', 'Action', 'Puzzles', 'Music', 'Carreras', 'Deportes', 'Acción', 'Puzles', 'Música'];
        const genreSpans = section.querySelectorAll('.yt-mini-game-card-view-model__genre');
        return Array.from(genreSpans).some(span =>
            gameGenres.some(genre => span.textContent.includes(genre))
        );
    }

    // Optimized initialization
    async function initScript() {
        try {
            Logger.info('Initializing YouTube Enchantments');

            // Setup core functionality
            createSettingsMenu();
            setupEventListeners();
            redirectToVideosPage();

            // Initialize auto-like system (interval-based)
            startBackgroundCheck();

            // Initialize game section removal
            hideGameSections();

            Logger.info('Script initialization complete');
        } catch (error) {
            Logger.error(`Initialization failed: ${error}`);
        }
    }

    function cleanup() {
        try {
            if (checkTimer) { clearInterval(checkTimer); checkTimer = null; }
            if (duplicateCleanupInterval) { clearInterval(duplicateCleanupInterval); duplicateCleanupInterval = null; }
            if (gameHideInterval) { clearInterval(gameHideInterval); gameHideInterval = null; }
            if (adBlockObserver) { adBlockObserver.disconnect(); adBlockObserver = null; }
            if (likeReadyObserver) { likeReadyObserver.disconnect(); likeReadyObserver = null; }
            if (isScrolling && scrollInterval) { clearInterval(scrollInterval); isScrolling = false; }
        } catch (e) { /* no-op */ }
    }

    initScript();
})();