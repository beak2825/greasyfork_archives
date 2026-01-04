// ==UserScript==
// @name         YouTubeTempo - Ultimate Playback Speed Controller
// @namespace    https://github.com/hasanbeder/YouTubeTempo
// @version      1.0.1
// @description  Master your YouTube experience with fully customizable, precision speed controls, and a clean, accessible, collapsible settings menu.
// @license      GPL-3.0
// @author       hasanbeder
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @run-at       document-end
// @homepageURL  https://github.com/hasanbeder/YouTubeTempo
// @supportURL   https://github.com/hasanbeder/YouTubeTempo/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/542866/YouTubeTempo%20-%20Ultimate%20Playback%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/542866/YouTubeTempo%20-%20Ultimate%20Playback%20Speed%20Controller.meta.js
// ==/UserScript==

'use strict';

(function() {
    // Main configuration object for the script.
    const CONFIG = {
        speedStep: 0.05, // The increment/decrement value for speed changes.
        minSpeed: 0.25, // Minimum playback speed allowed.
        maxSpeed: 4.0, // Maximum playback speed allowed.
        defaults: { // Default values for user-configurable settings.
            speedStep: 0.05,
            minSpeed: 0.25,
            maxSpeed: 4.0,
            shortcutSlower: '[',
            shortcutReset: '\\',
            shortcutFaster: ']'
        },
        shortcuts: { // Default shortcut keys.
            slower: '[',
            reset: '\\',
            faster: ']'
        },
        selectors: { // CSS selectors for various YouTube player elements.
            playerControls: '.ytp-chrome-controls .ytp-right-controls',
            videoElement: '#movie_player video',
            timeDisplay: '.ytp-time-display',
            liveIndicator: '.ytp-live',
            playerContainer: '#movie_player',
            chromeControls: '.ytp-chrome-controls',
            watchContainer: '#page-manager ytd-watch-flexy',
            fallbackPlayerControls: ['.ytp-right-controls', '#movie_player .ytp-chrome-controls .ytp-right-controls'], // Fallbacks for player controls.
            fallbackVideoElement: ['video.html5-main-video', 'video[src]'] // Fallbacks for the video element.
        },
        storageKeys: { // Keys for storing settings in GM_storage or localStorage.
            speed: 'youtubetempo-playback-rate',
            settingsSpeedStep: 'youtubetempo-speed-step',
            settingsMinSpeed: 'youtubetempo-min-speed',
            settingsMaxSpeed: 'youtubetempo-max-speed',
            isRemainingTimeEnabled: 'youtubetempo-remaining-time-enabled',
            shortcutSlower: 'youtubetempo-shortcut-slower',
            shortcutReset: 'youtubetempo-shortcut-reset',
            shortcutFaster: 'youtubetempo-shortcut-faster',
            overrideYouTubeShortcuts: 'youtubetempo-override-youtube-shortcuts',
            isSoundEffectsEnabled: 'youtubetempo-sound-effects-enabled'
        },
        ui: { // UI-related constants.
            settingsMenuWidth: 300, // Width of the settings menu in pixels.
            settingsMenuBottomMargin: 5, // Margin below the settings menu.
            indicatorFontSize: 15, // Font size for the speed indicator.
            elementWaitTimeout: 10000, // Timeout for waiting for elements to appear.
            debounceRate: 250 // Debounce rate for frequent events.
        },
        enableErrorReporting: false // Flag to enable/disable error reporting.
    };

    // SVG icons used in the UI.
    const ICONS = {
        slower: '<svg viewBox="0 0 24 24"><path fill="#ff1744" opacity="0.6" d="M11.996 15.992V8.008L6.004 12l5.992 3.992z"/><path fill="#ff1744" d="M17.996 15.992V8.008L12.004 12l5.992 3.992z"/></svg>',
        reset: '<svg viewBox="0 0 24 24"><path fill="#2979ff" opacity="0.6" d="M15 15H9V9h6v6z"/><path fill="#2979ff" d="M17.004 17.004H6.996V6.996h10.008v10.008zM9 15h6V9H9v6z"/></svg>',
        faster: '<svg viewBox="0 0 24 24"><path fill="#00e676" opacity="0.6" d="M12.004 15.992V8.008L17.996 12l-5.992 3.992z"/><path fill="#00e676" d="M6.004 15.992V8.008L11.996 12l-5.992 3.992z"/></svg>',
        settingsResetIcon: '<svg style="width:16px;height:16px;" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5V2.21c0-.45-.54-.67-.85-.35l-3.8 3.79c-.2.2-.2.51 0 .71l3.8 3.79c.31.32.85.09.85-.35V7c3.73 0 6.68 3.42 5.86 7.29-.47 2.27-2.31 4.1-4.57 4.57-3.57.75-6.75-1.7-7.23-5.01-.07-.48-.49-.85-.98-.85-.6 0-1.08.53-1 1.13.62 4.39 4.8 7.64 9.53 6.72 3.12-.61 5.63-3.12 6.24-6.24C20.84 9.48 16.94 5 12 5z"/></svg>',
        github: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.32 1.08 2.89.83.09-.65.35-1.08.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.72c0 .27.18.58.69.48A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z"/></svg>',
        socialX: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        chevron: '<svg style="width:20px;height:20px" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>'
    };

    // CSS styles for the script's UI elements.
    const STYLES = `
        @keyframes heartbeat { 0%{transform:scale(1)} 15%{transform:scale(1.15)} 30%{transform:scale(1)} 45%{transform:scale(1.15)} 60%{transform:scale(1)} 100%{transform:scale(1)} }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        .youtubetempo-button, .youtubetempo-speed-indicator, .youtubetempo-settings-group-header, .youtubetempo-settings-reset-btn {
             background: none; border: none; padding: 0; font-family: inherit; color: inherit; margin: 0;
        }
        .youtubetempo-button {
            float:left; cursor:pointer; opacity:.9; transition: opacity .2s ease, background-size 0.4s ease-out;
            width:36px; height:100%; display:flex; align-items:center; justify-content:center;
            border-radius:50%; background-position:center; background-repeat:no-repeat; background-size:0% 0%;
            /* Using CSS variables for a cleaner and more maintainable way to style button glows. */
            background-image: radial-gradient(circle, var(--youtubetempo-glow-color, transparent) 0%, transparent 50%);
        }
        .youtubetempo-slower { --youtubetempo-glow-color: rgba(255, 23, 68, 0.4); }
        .youtubetempo-reset { --youtubetempo-glow-color: rgba(41, 121, 255, 0.4); }
        .youtubetempo-faster { --youtubetempo-glow-color: rgba(0, 230, 118, 0.4); }
        .youtubetempo-button:not(:active):hover { opacity:1; animation:heartbeat 1.5s ease-in-out infinite; }
        .youtubetempo-button:active { transition:background-size 0s; background-size:100% 100%; transform:scale(0.95); }
        .youtubetempo-speed-indicator { float:left; line-height:48px; margin:0 8px; font-size:${CONFIG.ui.indicatorFontSize}px; font-weight:500; font-family:Roboto,Arial,sans-serif; display:flex; align-items:center; justify-content:center; height:100%; min-width:50px; cursor:pointer; user-select:none; transition:all .2s ease; position:relative; padding: 0 4px; border-radius: 4px; }
        .youtubetempo-speed-indicator:hover { background: rgba(255,255,255,0.1); }
        .youtubetempo-speed-text { display: inline-block; transition: opacity 0.2s ease-out; }
        .youtubetempo-speed-indicator::after {
            content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23ffffff" opacity="0.9" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>');
            background-repeat: no-repeat; background-position: center; background-size: 20px 20px;
            opacity: 0; transform: scale(0.8); transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        }
        .youtubetempo-speed-indicator:hover .youtubetempo-speed-text { opacity: 0; }
        .youtubetempo-speed-indicator:hover::after { opacity: 1; transform: scale(1); }
        .youtubetempo-remaining-time { margin-left:8px; font-size:${CONFIG.ui.indicatorFontSize}px; font-weight:400; font-family:Roboto,Arial,sans-serif; display:flex; align-items:center; color:#ddd; user-select:none; }
        .youtubetempo-settings-wrapper { float:left; position:relative; height:100%; }
        .youtubetempo-settings-menu { display:none; position:absolute; bottom:100%; left:50%; transform:translateX(-50%); margin-bottom:${CONFIG.ui.settingsMenuBottomMargin}px; background:rgba(33,33,33,0.98); border-radius:8px; padding:4px 0; color:white; font-family:"YouTube Noto",Roboto,Arial,Helvetica,sans-serif; z-index:2002; width:${CONFIG.ui.settingsMenuWidth}px; box-shadow:0 4px 16px rgba(0,0,0,0.4); }
        .youtubetempo-settings-title { font-size:14px; font-weight:600; padding:0 12px; color:#fff; border-bottom:1px solid rgba(255,255,255,0.1); height:32px; line-height:32px; display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
        .youtubetempo-settings-links { display:flex; align-items:center; gap:10px; }
        .youtubetempo-settings-link-icon { color:rgba(255,255,255,0.7); display:inline-flex; align-items:center; transition:all 0.2s ease; }
        .youtubetempo-settings-link-icon:hover { color:#fff; transform:scale(1.1); }
        .youtubetempo-settings-link-icon svg { width:18px; height:18px; }
        .youtubetempo-settings-row { display:flex; justify-content:space-between; align-items:center; padding:0 12px; position:relative; cursor:default; height:32px; transition: background-color 0.2s; }
        .youtubetempo-settings-label { font-size:13px; color:#fff; flex-grow:1; display:flex; align-items:center; gap:6px; font-weight:400; }
        .youtubetempo-settings-input { width:50px; background:rgba(255,255,255,0.1); border:1px solid transparent; border-radius:2px; color:#fff; padding:3px 5px; font-size:12px; text-align:center; outline:none; transition:all .1s ease; font-family:"YouTube Noto",Roboto,Arial,Helvetica,sans-serif; }
        .youtubetempo-settings-input-invalid { border-color: rgba(255, 82, 82, 0.7) !important; background: rgba(255, 82, 82, 0.1) !important; }
        .youtubetempo-settings-input[type="text"] { width: 70px; text-align: left; }
        .youtubetempo-settings-controls-wrapper { display: flex; align-items: center; gap: 8px; }
        .youtubetempo-settings-input-display { width: 40px; text-align: center; }
        .youtubetempo-settings-input:focus { border-color:#3ea6ff; background:rgba(62,166,255,0.1); }
        .youtubetempo-settings-reset-btn { opacity:0; padding:4px; margin-right:6px; cursor:pointer; color:rgba(255,255,255,0.5); transition:all .2s ease; }
        .youtubetempo-settings-row:hover .youtubetempo-settings-reset-btn { opacity:0.7; }
        .youtubetempo-settings-row:hover { background:rgba(255,255,255,0.1); }
        .youtubetempo-toggle-switch { position:relative; display:inline-block; width:34px; height:20px; flex-shrink: 0; cursor: pointer; }
        .youtubetempo-toggle-switch input { opacity:0; width:0; height:0; }
        .youtubetempo-toggle-slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#ccc; transition:.4s; border-radius:20px; }
        .youtubetempo-toggle-slider:before { position:absolute; content:""; height:12px; width:12px; left:4px; bottom:4px; background-color:white; transition:.4s; border-radius:50%; }
        input:checked + .youtubetempo-toggle-slider { background-color:#3ea6ff; }
        input:checked + .youtubetempo-toggle-slider:before { transform:translateX(14px); }
        .youtubetempo-settings-group-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 2px 12px; font-weight: 500; font-size: 13px; border-radius: 4px; margin: 2px 6px 0; transition: background-color 0.2s; height: 28px; width: calc(100% - 12px); text-align: left; }
        .youtubetempo-settings-group-header:hover { background-color: rgba(255, 255, 255, 0.1); }
        .youtubetempo-group-header-arrow { transition: transform 0.3s ease-out; }
        .youtubetempo-settings-group-content { max-height: 500px; overflow: hidden; transition: max-height 0.3s ease-out; }
        .youtubetempo-group-collapsed .youtubetempo-settings-group-content { max-height: 0; overflow: hidden; }
        .youtubetempo-group-collapsed .youtubetempo-group-header-arrow { transform: rotate(-90deg); }
        .youtubetempo-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
    `;

    // Holds the dynamic state of the script.
    const state = {
        currentVideoElement: null, settingsWrapperElement: null, speedIndicatorElement: null,
        remainingTimeElement: null, settingsMenuElement: null, isSettingsUIVisible: false,
        videoMutationObserver: null, activePlayerControls: null, liveIndicatorCache: null,
        cleanupFunctions: [],
        liveWarningShown: false // Flag to ensure the live stream warning is shown only once per page.
    };

    // Holds the user's configuration, loaded from storage.
    const userConfig = {
        speedStep: CONFIG.speedStep, minSpeed: CONFIG.minSpeed, maxSpeed: CONFIG.maxSpeed,
        isRemainingTimeEnabled: true, shortcutSlower: CONFIG.shortcuts.slower,
        shortcutReset: CONFIG.shortcuts.reset, shortcutFaster: CONFIG.shortcuts.faster,
        overrideYouTubeShortcuts: false, isSoundEffectsEnabled: true
    };

    // Handles errors and displays notifications to the user.
    class ErrorHandler {
        static handle(error, context) {
            console.error(`YouTubeTempo Error in ${context}:`, error);
            if (CONFIG.enableErrorReporting) this.reportError(error, context);
        }
        static showNotification(message) {
            const ytNotification = document.querySelector('ytd-notification-manager');
            if (ytNotification && typeof ytNotification.show === 'function') {
                try { ytNotification.show({ text: message }); return; } catch (e) { /* Fallback */ }
            }
            const notification = document.createElement('div');
            notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: #212121; color: white; padding: 12px 20px; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.3); z-index: 9999; font-family: Roboto, Arial, sans-serif; font-size: 14px; animation: slideIn 0.3s ease-out;`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
        static reportError(error, context) { /* Future implementation for error reporting */ }
    }

    // Manages saving and loading data from storage.
    const Storage = {
        save(key, value) {
            try {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(key, value);
                } else {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            } catch (e) { ErrorHandler.handle(e, 'Storage.save'); }
        },
        load(key, defaultValue) {
            try {
                if (typeof GM_getValue === 'function') {
                    return GM_getValue(key, defaultValue);
                }
                const value = localStorage.getItem(key);
                return value === null ? defaultValue : JSON.parse(value);
            } catch (e) {
                ErrorHandler.handle(e, 'Storage.load');
                return defaultValue;
            }
        },
        loadUserConfig() {
            userConfig.speedStep = this.load(CONFIG.storageKeys.settingsSpeedStep, CONFIG.defaults.speedStep);
            userConfig.minSpeed = this.load(CONFIG.storageKeys.settingsMinSpeed, CONFIG.defaults.minSpeed);
            userConfig.maxSpeed = this.load(CONFIG.storageKeys.settingsMaxSpeed, CONFIG.defaults.maxSpeed);
            userConfig.isRemainingTimeEnabled = this.load(CONFIG.storageKeys.isRemainingTimeEnabled, true);
            userConfig.shortcutSlower = this.load(CONFIG.storageKeys.shortcutSlower, CONFIG.defaults.shortcutSlower);
            userConfig.shortcutReset = this.load(CONFIG.storageKeys.shortcutReset, CONFIG.defaults.shortcutReset);
            userConfig.shortcutFaster = this.load(CONFIG.storageKeys.shortcutFaster, CONFIG.defaults.shortcutFaster);
            userConfig.overrideYouTubeShortcuts = this.load(CONFIG.storageKeys.overrideYouTubeShortcuts, false);
            userConfig.isSoundEffectsEnabled = this.load(CONFIG.storageKeys.isSoundEffectsEnabled, true);
        }
    };

    // General utility functions.
    function waitForElement(selector, timeout = CONFIG.ui.elementWaitTimeout) {
        return new Promise((resolve, reject) => {
            let element = document.querySelector(selector);
            if (element) return resolve(element);
            const observer = new MutationObserver(() => {
                element = document.querySelector(selector);
                if (element) { observer.disconnect(); resolve(element); }
            });
            const container = document.querySelector(CONFIG.selectors.watchContainer) || document.querySelector(CONFIG.selectors.playerContainer) || document.body;
            observer.observe(container, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    async function findElementWithFallbacks(selectors, timeout = 5000) {
        for (const selector of selectors) {
            try {
                const element = await waitForElement(selector, timeout / selectors.length);
                if (element) return element;
            } catch (error) {
                // Ignore error and try the next selector in the list.
            }
        }
        throw new Error(`None of the selectors found: ${selectors.join(', ')}`);
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Manages all audio-related functionality.
    const Audio = {
        playSound(type) {
            try {
                const ctx = new(window.AudioContext || window.webkitAudioContext)();
                const now = ctx.currentTime,
                    oscillator = ctx.createOscillator(),
                    gain = ctx.createGain();
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.1);
                oscillator.connect(gain);
                gain.connect(ctx.destination);
                switch (type) {
                    case 'slower':
                        oscillator.type = 'sine';
                        oscillator.frequency.setValueAtTime(800, now);
                        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
                        break;
                    case 'reset':
                        oscillator.type = 'sine';
                        oscillator.frequency.setValueAtTime(330, now);
                        gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.08);
                        break;
                    case 'faster':
                        oscillator.type = 'sine';
                        oscillator.frequency.setValueAtTime(600, now);
                        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                        break;
                }
                oscillator.start(now);
                oscillator.stop(now + 0.12);
                setTimeout(() => ctx.close(), 500); // Clean up context after sound plays
            } catch (e) {
                ErrorHandler.handle(e, 'Audio.playSound');
            }
        }
    };

    // Manages all UI elements and interactions.
    const UI = {
        // Interpolates colors in HSL space for more natural transitions (e.g., avoids muddy gray when transitioning between red and green).
        lerpColor(colorA, colorB, amount) {
            const hexToRgb = (hex) => {
                const b = parseInt(hex.replace(/#/, ''), 16);
                return [(b >> 16) & 255, (b >> 8) & 255, b & 255];
            };
            const rgbToHsl = (r, g, b) => {
                r /= 255; g /= 255; b /= 255;
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                let h, s, l = (max + min) / 2;
                if (max === min) { h = s = 0; }
                else {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                return [h * 360, s * 100, l * 100];
            };
            const hslToRgb = (h, s, l) => {
                let r, g, b; h /= 360; s /= 100; l /= 100;
                if (s === 0) { r = g = b = l; }
                else {
                    const hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1; if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    };
                    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    const p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
                }
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            };
            const [ar, ag, ab] = hexToRgb(colorA), [br, bg, bb] = hexToRgb(colorB);
            const [h1, s1, l1] = rgbToHsl(ar, ag, ab), [h2, s2, l2] = rgbToHsl(br, bg, bb);
            const h = h1 + (h2 - h1) * amount, s = s1 + (s2 - s1) * amount, l = l1 + (l2 - l1) * amount;
            const [r, g, b] = hslToRgb(h, s, l);
            return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        },
        getSpeedColor(speed) {
            if (speed === 1) return '#2979ff';
            if (speed < 1) {
                const amount = (speed - userConfig.minSpeed) / (1 - userConfig.minSpeed);
                return this.lerpColor('#ff1744', '#2979ff', amount);
            }
            const amount = Math.min((speed - 1) / (userConfig.maxSpeed - 1), 1);
            return this.lerpColor('#2979ff', '#00e676', amount);
        },
        updateSpeedIndicator(speed) {
            if (!state.speedIndicatorElement) return;
            const displaySpeed = Number(speed).toFixed(2);
            state.speedIndicatorElement.innerHTML = `<span class="youtubetempo-speed-text" aria-live="polite" aria-atomic="true">${displaySpeed}x</span>`;
            state.speedIndicatorElement.style.color = this.getSpeedColor(parseFloat(displaySpeed));
        },
        formatTime(totalSeconds) {
            const h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = Math.floor(totalSeconds % 60);
            return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        },
        updateRemainingTime: debounce(() => {
            if (!userConfig.isRemainingTimeEnabled || !state.currentVideoElement || !state.remainingTimeElement) return;
            if (state.currentVideoElement.paused) { state.remainingTimeElement.textContent = ''; return; }
            const isLive = state.currentVideoElement.duration === Infinity || (state.liveIndicatorCache = state.liveIndicatorCache || document.querySelector(CONFIG.selectors.liveIndicator));
            if (isLive || !isFinite(state.currentVideoElement.duration)) { state.remainingTimeElement.textContent = ''; return; }
            const remaining = (state.currentVideoElement.duration - state.currentVideoElement.currentTime) / state.currentVideoElement.playbackRate;
            if (remaining > 0 && isFinite(remaining)) { state.remainingTimeElement.textContent = `(${UI.formatTime(remaining)})`; } else { state.remainingTimeElement.textContent = ''; }
        }, CONFIG.ui.debounceRate),
        toggleSettings() {
            if (!state.settingsMenuElement || !state.speedIndicatorElement) return;
            state.isSettingsUIVisible = !state.isSettingsUIVisible;
            const isVisible = state.isSettingsUIVisible;
            state.speedIndicatorElement.setAttribute('aria-expanded', isVisible);
            state.settingsMenuElement.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                const firstFocusable = state.settingsMenuElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) firstFocusable.focus();
            } else { state.speedIndicatorElement.focus(); }
        },
        createSpeedControlButton(label, iconHtml, className, onClickAction) {
            const button = document.createElement('button');
            button.className = `ytp-button youtubetempo-button ${className}`;
            button.title = label; button.setAttribute('aria-label', label);
            button.innerHTML = iconHtml; button.onclick = onClickAction;
            return button;
        },
        updateRemainingTimeVisibility(shouldBeVisible) {
            if (shouldBeVisible) {
                if (!state.remainingTimeElement || !state.remainingTimeElement.parentElement) {
                    const youtubeTimeDisplay = document.querySelector(CONFIG.selectors.timeDisplay);
                    if (youtubeTimeDisplay) {
                        state.remainingTimeElement = document.createElement('div');
                        state.remainingTimeElement.className = 'youtubetempo-remaining-time';
                        youtubeTimeDisplay.insertAdjacentElement('afterend', state.remainingTimeElement);
                        this.updateRemainingTime();
                    }
                }
            } else {
                if (state.remainingTimeElement && state.remainingTimeElement.parentElement) {
                    state.remainingTimeElement.remove();
                    state.remainingTimeElement = null;
                }
            }
        },
        _createSettingsHeader() {
            const title = document.createElement('div');
            title.className = 'youtubetempo-settings-title';

            const titleGroup = document.createElement('div');
            titleGroup.style.display = 'flex';
            titleGroup.style.alignItems = 'baseline';
            titleGroup.style.gap = '6px';

            const titleText = document.createElement('span');
            titleText.textContent = 'YouTubeTempo Settings';
            titleText.id = 'youtubetempo-settings-title-id';
            titleGroup.appendChild(titleText);

            const versionSpan = document.createElement('span');
            const scriptVersion = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '1.0.1';
            versionSpan.textContent = `v${scriptVersion}`;
            versionSpan.style.fontSize = '10px';
            versionSpan.style.color = 'rgba(255,255,255,0.6)';
            versionSpan.style.fontWeight = 'normal';
            titleGroup.appendChild(versionSpan);

            title.appendChild(titleGroup);

            const linksContainer = document.createElement('div');
            linksContainer.className = 'youtubetempo-settings-links';
            const createLink = (href, title, icon) => {
                const a = document.createElement('a');
                a.href = href; a.title = title; a.innerHTML = icon; a.className = 'youtubetempo-settings-link-icon';
                a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
            };
            linksContainer.appendChild(createLink('https://github.com/hasanbeder/YouTubeTempo', 'GitHub', ICONS.github));
            linksContainer.appendChild(createLink('https://x.com/hasanbeder', 'Author on X', ICONS.socialX));
            title.appendChild(linksContainer);
            return title;
        },
        _createCollapsibleGroup(title, id, contentElements, isInitiallyCollapsed = false) {
            const storageKey = `youtubetempo-group-state-${id}`;
            let isCollapsed = Storage.load(storageKey, isInitiallyCollapsed);
            const group = document.createElement('div');
            group.className = 'youtubetempo-settings-group';
            if (isCollapsed) group.classList.add('youtubetempo-group-collapsed');
            const header = document.createElement('button');
            header.className = 'youtubetempo-settings-group-header';
            const contentId = `youtubetempo-group-content-${id}`;
            header.setAttribute('aria-expanded', !isCollapsed);
            header.setAttribute('aria-controls', contentId);
            header.innerHTML = `<span>${title}</span><span class="youtubetempo-group-header-arrow">${ICONS.chevron}</span>`;
            const content = document.createElement('div');
            content.className = 'youtubetempo-settings-group-content';
            content.id = contentId;
            contentElements.forEach(el => content.appendChild(el));
            header.onclick = () => {
                isCollapsed = !isCollapsed;
                group.classList.toggle('youtubetempo-group-collapsed', isCollapsed);
                header.setAttribute('aria-expanded', !isCollapsed);
                Storage.save(storageKey, isCollapsed);
            };
            group.append(header, content);
            return group;
        },
        _createRow(labelText, storageKey, configKey, min, max, step, defaultValue, description = null) {
            const row = document.createElement('div'); row.className = 'youtubetempo-settings-row';
            if (description) row.title = description;

            const label = document.createElement('div'); label.className = 'youtubetempo-settings-label';
            const resetButton = document.createElement('button');
            resetButton.className = 'youtubetempo-settings-reset-btn';
            resetButton.innerHTML = ICONS.settingsResetIcon;
            resetButton.title = 'Reset to default';
            resetButton.setAttribute('aria-label', `Reset ${labelText.replace(':', '')} to default`);
            resetButton.onclick = () => {
                input.value = defaultValue;
                userConfig[configKey] = defaultValue;
                Storage.save(storageKey, defaultValue);
                ErrorHandler.showNotification(`${labelText.replace(':', '')} reset to default.`);
            };
            label.append(resetButton, document.createTextNode(labelText));

            const input = document.createElement('input');
            input.className = 'youtubetempo-settings-input'; input.type = 'number';
            input.value = userConfig[configKey]; input.min = min; input.max = max; input.step = step;
            input.onchange = () => {
                let newValue = parseFloat(input.value);
                if (isNaN(newValue)) newValue = defaultValue;
                newValue = Math.max(min, Math.min(max, newValue));
                input.value = newValue; userConfig[configKey] = newValue; Storage.save(storageKey, newValue);
            };

            if (description) {
                const descId = `desc-${configKey}`;
                input.setAttribute('aria-describedby', descId);
                const descSpan = document.createElement('span');
                descSpan.id = descId;
                descSpan.className = 'youtubetempo-sr-only';
                descSpan.textContent = description;
                row.appendChild(descSpan);
            }

            row.append(label, input);
            return row;
        },
        _createToggleRow(labelText, storageKey, configKey, description = null) {
            const row = document.createElement('div'); row.className = 'youtubetempo-settings-row';
            if (description) row.title = description;

            const inputId = `youtubetempo-toggle-${configKey}`;
            const label = document.createElement('label');
            label.className = 'youtubetempo-settings-label'; label.textContent = labelText;
            label.setAttribute('for', inputId); label.style.cursor = 'pointer';

            const switchDiv = document.createElement('div'); switchDiv.className = 'youtubetempo-toggle-switch';
            const input = document.createElement('input');
            input.type = 'checkbox'; input.id = inputId; input.checked = userConfig[configKey];
            input.onchange = () => {
                const isChecked = input.checked; userConfig[configKey] = isChecked;
                Storage.save(storageKey, isChecked);
                if (configKey === 'isRemainingTimeEnabled') UI.updateRemainingTimeVisibility(isChecked);
            };

            if (description) {
                const descId = `desc-${configKey}`;
                input.setAttribute('aria-describedby', descId);
                const descSpan = document.createElement('span');
                descSpan.id = descId;
                descSpan.className = 'youtubetempo-sr-only';
                descSpan.textContent = description;
                row.appendChild(descSpan);
            }

            switchDiv.onclick = () => input.click();
            const slider = document.createElement('span'); slider.className = 'youtubetempo-toggle-slider';
            switchDiv.append(input, slider); row.append(label, switchDiv);
            return row;
        },
        _createShortcutRow(labelText, storageKey, configKey, defaultValue, description = null) {
            const row = document.createElement('div'); row.className = 'youtubetempo-settings-row';
            if (description) row.title = description;

            const label = document.createElement('div'); label.className = 'youtubetempo-settings-label';
            const resetButton = document.createElement('button');
            resetButton.className = 'youtubetempo-settings-reset-btn'; resetButton.innerHTML = ICONS.settingsResetIcon;
            resetButton.title = 'Reset to default';
            resetButton.setAttribute('aria-label', `Reset ${labelText.replace(':', '')} to default`);
            resetButton.onclick = () => {
                input.value = defaultValue;
                userConfig[configKey] = defaultValue;
                Storage.save(storageKey, defaultValue);
                ErrorHandler.showNotification(`${labelText.replace(':', '')} reset to default.`);
            };
            label.append(resetButton, document.createTextNode(labelText));

            const input = document.createElement('input');
            input.className = 'youtubetempo-settings-input'; input.type = 'text'; input.value = userConfig[configKey];

            input.onkeydown = (e) => {
                e.preventDefault();
                const key = e.key === ' ' ? 'Space' : e.key;

                // Validate against modifier keys being used alone
                if (['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
                    input.classList.add('youtubetempo-settings-input-invalid');
                    const feedback = document.createElement('div');
                    feedback.setAttribute('aria-live', 'assertive');
                    feedback.className = 'youtubetempo-sr-only';
                    feedback.textContent = 'Invalid key. Modifier keys alone cannot be shortcuts.';
                    row.appendChild(feedback);

                    setTimeout(() => {
                        input.classList.remove('youtubetempo-settings-input-invalid');
                        if (feedback.parentElement) feedback.remove();
                    }, 1500);
                    return;
                }

                // --- START: Shortcut Conflict Validation ---
                const allShortcutConfigKeys = ['shortcutSlower', 'shortcutReset', 'shortcutFaster'];
                const conflictingShortcut = allShortcutConfigKeys.find(otherKey =>
                    otherKey !== configKey && userConfig[otherKey] === key
                );

                if (conflictingShortcut) {
                    input.classList.add('youtubetempo-settings-input-invalid');
                    const feedback = document.createElement('div');
                    feedback.setAttribute('aria-live', 'assertive');
                    feedback.className = 'youtubetempo-sr-only';
                    feedback.textContent = `Key "${key}" is already used for another shortcut.`;
                    row.appendChild(feedback);

                    setTimeout(() => {
                        input.classList.remove('youtubetempo-settings-input-invalid');
                        if (feedback.parentElement) feedback.remove();
                    }, 2000);
                    return; // Do not save the conflicting key
                }
                // --- END: Shortcut Conflict Validation ---

                input.value = key; userConfig[configKey] = key; Storage.save(storageKey, key); input.blur();
            };
            input.onfocus = () => input.value = 'Press a key...';
            input.onblur = () => input.value = userConfig[configKey];

            if (description) {
                const descId = `desc-${configKey}`;
                input.setAttribute('aria-describedby', descId);
                const descSpan = document.createElement('span');
                descSpan.id = descId;
                descSpan.className = 'youtubetempo-sr-only';
                descSpan.textContent = description;
                row.appendChild(descSpan);
            }

            row.append(label, input); return row;
        },
        createSettingsUI() {
            state.settingsMenuElement = document.createElement('div');
            state.settingsMenuElement.className = 'youtubetempo-settings-menu';
            state.settingsMenuElement.setAttribute('role', 'dialog');
            state.settingsMenuElement.setAttribute('aria-labelledby', 'youtubetempo-settings-title-id');
            state.settingsMenuElement.setAttribute('aria-modal', 'true');
            const header = this._createSettingsHeader();
            const speedContent = [
                this._createRow('Speed Step:', CONFIG.storageKeys.settingsSpeedStep, 'speedStep', 0.01, 0.5, 0.01, CONFIG.defaults.speedStep, 'Amount to change speed per click or shortcut press.'),
                this._createRow('Min Speed:', CONFIG.storageKeys.settingsMinSpeed, 'minSpeed', 0.1, 1.0, 0.05, CONFIG.defaults.minSpeed, 'The minimum allowed playback speed.'),
                this._createRow('Max Speed:', CONFIG.storageKeys.settingsMaxSpeed, 'maxSpeed', 1.0, 16.0, 0.1, CONFIG.defaults.maxSpeed, 'The maximum allowed playback speed.')
            ];
            const audioContent = [
                this._createToggleRow('Enable Sound Effects', CONFIG.storageKeys.isSoundEffectsEnabled, 'isSoundEffectsEnabled', 'Plays a sound effect when changing speed.')
            ];
            const shortcutsContent = [
                this._createShortcutRow('Slower Key:', CONFIG.storageKeys.shortcutSlower, 'shortcutSlower', CONFIG.defaults.shortcutSlower, 'Shortcut to decrease speed.'),
                this._createShortcutRow('Reset Key:', CONFIG.storageKeys.shortcutReset, 'shortcutReset', CONFIG.defaults.shortcutReset, 'Shortcut to reset speed to 1.0x.'),
                this._createShortcutRow('Faster Key:', CONFIG.storageKeys.shortcutFaster, 'shortcutFaster', CONFIG.defaults.shortcutFaster, 'Shortcut to increase speed.'),
                this._createToggleRow('Override YouTube Shortcuts', CONFIG.storageKeys.overrideYouTubeShortcuts, 'overrideYouTubeShortcuts', 'If enabled, YouTubeTempo shortcuts will prevent default YouTube actions for the same keys.')
            ];
            const generalContent = [
                this._createToggleRow('Show Remaining Time', CONFIG.storageKeys.isRemainingTimeEnabled, 'isRemainingTimeEnabled', 'Displays the calculated remaining time of the video next to the time display.')
            ];
            const speedGroup = this._createCollapsibleGroup('Speed Control', 'speed', speedContent, false);
            const audioGroup = this._createCollapsibleGroup('Audio', 'audio', audioContent, true);
            const shortcutsGroup = this._createCollapsibleGroup('Shortcuts', 'shortcuts', shortcutsContent, false);
            const generalGroup = this._createCollapsibleGroup('General Settings', 'general', generalContent, true);
            state.settingsMenuElement.append(header, speedGroup, audioGroup, shortcutsGroup, generalGroup);
            return state.settingsMenuElement;
        },
        injectUI(playerControlsElement) {
            if (document.querySelector('.youtubetempo-button')) return;
            state.activePlayerControls = playerControlsElement;
            state.settingsWrapperElement = document.createElement('div');
            state.settingsWrapperElement.className = 'youtubetempo-settings-wrapper';
            state.speedIndicatorElement = document.createElement('button');
            state.speedIndicatorElement.className = 'youtubetempo-speed-indicator';
            state.speedIndicatorElement.title = 'Open YouTubeTempo Settings';
            state.speedIndicatorElement.setAttribute('aria-haspopup', 'dialog');
            state.speedIndicatorElement.setAttribute('aria-expanded', 'false');
            state.speedIndicatorElement.onclick = () => UI.toggleSettings();
            state.settingsWrapperElement.appendChild(state.speedIndicatorElement);
            if (!state.settingsMenuElement) this.createSettingsUI();
            state.settingsWrapperElement.appendChild(state.settingsMenuElement);
            const slowerButton = this.createSpeedControlButton('Slow Down', ICONS.slower, 'youtubetempo-slower', () => Core.changeSpeed(-userConfig.speedStep, 'slower'));
            const resetButton = this.createSpeedControlButton('Reset Speed', ICONS.reset, 'youtubetempo-reset', () => Core.resetSpeed());
            const fasterButton = this.createSpeedControlButton('Speed Up', ICONS.faster, 'youtubetempo-faster', () => Core.changeSpeed(userConfig.speedStep, 'faster'));
            playerControlsElement.prepend(slowerButton, resetButton, fasterButton, state.settingsWrapperElement);
            if (userConfig.isRemainingTimeEnabled) this.updateRemainingTimeVisibility(true);
            Core.loadAndApplyPersistedSpeed();
            this.updateRemainingTime();

            // Show a one-time notification for live streams to inform the user.
            const videoEl = state.currentVideoElement;
            if (videoEl && videoEl.duration === Infinity && !state.liveWarningShown) {
                ErrorHandler.showNotification("Live stream detected. Speed controls can be used to catch up.");
                state.liveWarningShown = true;
            }
        },
        cleanup() {
            document.querySelectorAll('.youtubetempo-button, .youtubetempo-remaining-time, .youtubetempo-settings-wrapper')
                .forEach(e => e.remove());
            state.settingsWrapperElement = null;
            state.speedIndicatorElement = null;
            state.remainingTimeElement = null;
            state.isSettingsUIVisible = false;
            state.activePlayerControls = null;
            state.liveIndicatorCache = null;
        }
    };

    // Core logic for playback speed manipulation.
    const Core = {
        setPlaybackSpeed(speed) {
            if (!state.currentVideoElement) return;
            const newSpeed = parseFloat(speed.toFixed(2));
            state.currentVideoElement.playbackRate = newSpeed;
            UI.updateSpeedIndicator(newSpeed);
            Storage.save(CONFIG.storageKeys.speed, newSpeed);
            UI.updateRemainingTime();
        },
        changeSpeed(delta, soundType) {
            if (!state.currentVideoElement) return;
            if (userConfig.isSoundEffectsEnabled) Audio.playSound(soundType);
            const currentSpeed = state.currentVideoElement.playbackRate;
            let newSpeed = Math.round((currentSpeed + delta) * 100) / 100;
            newSpeed = Math.max(userConfig.minSpeed, Math.min(userConfig.maxSpeed, newSpeed));
            this.setPlaybackSpeed(newSpeed);
        },
        resetSpeed() {
            if (userConfig.isSoundEffectsEnabled) Audio.playSound('reset');
            this.setPlaybackSpeed(1);
        },
        loadAndApplyPersistedSpeed() {
            const persistedSpeed = Storage.load(CONFIG.storageKeys.speed, 1);
            this.setPlaybackSpeed(persistedSpeed);
        },
        cleanup() {
            if (state.cleanupFunctions.length) { state.cleanupFunctions.forEach(fn => fn()); state.cleanupFunctions = []; }
            if (state.videoMutationObserver) { state.videoMutationObserver.disconnect(); state.videoMutationObserver = null; }
            UI.cleanup();
            state.currentVideoElement = null;
            state.liveWarningShown = false; // Reset the warning flag on cleanup.
        }
    };

    // Manages all event listeners.
    const EventHandlers = {
        onVideoEvent() {
            if (state.currentVideoElement) {
                UI.updateSpeedIndicator(state.currentVideoElement.playbackRate);
                UI.updateRemainingTime();
            }
        },
        setupVideoEventListeners(videoEl) {
            const handlers = {
                play: () => Core.loadAndApplyPersistedSpeed(),
                pause: () => UI.updateRemainingTime(),
                seeked: () => UI.updateRemainingTime(),
                loadedmetadata: () => Core.loadAndApplyPersistedSpeed(),
                ratechange: () => this.onVideoEvent(),
                timeupdate: throttle(() => UI.updateRemainingTime(), 1000)
            };
            Object.entries(handlers).forEach(([event, handler]) => {
                videoEl.addEventListener(event, handler, { passive: true });
                state.cleanupFunctions.push(() => videoEl.removeEventListener(event, handler));
            });
        },
        handlePlayerOrVideoChange: debounce(async () => {
            if (window.location.pathname.startsWith('/shorts/')) {
                if (state.activePlayerControls) Core.cleanup();
                return;
            }
            try {
                const playerControlSelectors = [CONFIG.selectors.playerControls, ...CONFIG.selectors.fallbackPlayerControls];
                const videoElementSelectors = [CONFIG.selectors.videoElement, ...CONFIG.selectors.fallbackVideoElement];

                const playerControls = await findElementWithFallbacks(playerControlSelectors);
                const video = await findElementWithFallbacks(videoElementSelectors);

                if (playerControls !== state.activePlayerControls || !document.querySelector('.youtubetempo-button')) {
                    Core.cleanup();
                    UI.injectUI(playerControls);
                }
                if (video !== state.currentVideoElement) {
                    if (state.currentVideoElement) { state.cleanupFunctions.forEach(fn => fn()); state.cleanupFunctions = []; }
                    if (state.videoMutationObserver) state.videoMutationObserver.disconnect();
                    state.currentVideoElement = video;
                    EventHandlers.setupVideoEventListeners(state.currentVideoElement);
                    state.videoMutationObserver = new MutationObserver(() => { Core.loadAndApplyPersistedSpeed(); UI.updateRemainingTime(); });
                    state.videoMutationObserver.observe(video, { attributes: true, attributeFilter: ['src'] });
                    Core.loadAndApplyPersistedSpeed();
                } else if (userConfig.isRemainingTimeEnabled && !document.querySelector('.youtubetempo-remaining-time')) {
                    UI.updateRemainingTimeVisibility(true);
                }
            } catch (error) {
                if (state.activePlayerControls) Core.cleanup();
            }
        }, CONFIG.ui.debounceRate),
        handleKeyDown(e) {
            if (state.isSettingsUIVisible && e.key === 'Tab') {
                const focusableElements = Array.from(state.settingsMenuElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null);
                if (focusableElements.length === 0) return;
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
                } else {
                    if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
                }
            }
            if (e.key === 'Escape' && state.isSettingsUIVisible) { e.preventDefault(); UI.toggleSettings(); return; }
            if (e.target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            const key = e.key === ' ' ? 'Space' : e.key;
            const isOurShortcut = [userConfig.shortcutSlower, userConfig.shortcutReset, userConfig.shortcutFaster].includes(key);
            if (isOurShortcut) {
                if (userConfig.overrideYouTubeShortcuts) { e.preventDefault(); e.stopPropagation(); }
                switch (key) {
                    case userConfig.shortcutSlower: Core.changeSpeed(-userConfig.speedStep, 'slower'); break;
                    case userConfig.shortcutReset: Core.resetSpeed(); break;
                    case userConfig.shortcutFaster: Core.changeSpeed(userConfig.speedStep, 'faster'); break;
                }
            }
        },
        handleClickOutside(event) {
            if (state.isSettingsUIVisible && state.settingsWrapperElement && !state.settingsWrapperElement.contains(event.target)) {
                UI.toggleSettings();
            }
        }
    };

    // Initializes the script.
    async function initialize() {
        if (window.location.pathname.startsWith('/shorts/')) {
            console.log('YouTubeTempo: Detected Shorts page, not initializing.');
            return;
        }

        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            try {
                window.trustedTypes.createPolicy('default', { createHTML: string => string });
            } catch (e) { /* Policy may already exist, ignore */ }
        }
        console.log('YouTubeTempo: Initializing...');
        GM_addStyle(STYLES);
        Storage.loadUserConfig();
        await EventHandlers.handlePlayerOrVideoChange();
        document.addEventListener('yt-navigate-finish', EventHandlers.handlePlayerOrVideoChange);
        document.addEventListener('yt-page-data-updated', EventHandlers.handlePlayerOrVideoChange);
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            EventHandlers.handlePlayerOrVideoChange();
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            EventHandlers.handlePlayerOrVideoChange();
        };
        window.addEventListener('popstate', EventHandlers.handlePlayerOrVideoChange);
        document.addEventListener('click', EventHandlers.handleClickOutside, true);
        document.addEventListener('keydown', EventHandlers.handleKeyDown, true);
        const cleanupHandler = () => {
            document.removeEventListener('click', EventHandlers.handleClickOutside, true);
            document.removeEventListener('keydown', EventHandlers.handleKeyDown, true);
            Core.cleanup();
        };
        window.addEventListener('beforeunload', cleanupHandler);
        state.cleanupFunctions.push(() => window.removeEventListener('beforeunload', cleanupHandler));
    }

    initialize();

})();
