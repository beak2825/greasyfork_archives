// ==UserScript==
// @name         Universal HTML5 Speed Hack
// @namespace    https://greasyfork.org/users/1498931-kubabreak
// @version      3.0
// @description  Lets you change the speed of any website. Press L to hide UI.
// @author       kubabreak
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543798/Universal%20HTML5%20Speed%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/543798/Universal%20HTML5%20Speed%20Hack.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* -------- UI toggle (L key) -------- */
    let __uiHidden = false;
    function __toggleSpeedhackUI() {
        const ui = document.getElementById('speedhack-ui');
        if (!ui) return;

        __uiHidden = !__uiHidden;

        ui.style.opacity = __uiHidden ? '0' : '1';
        ui.style.pointerEvents = __uiHidden ? 'none' : 'auto';
        ui.style.transform = __uiHidden ? 'scale(0.95)' : 'scale(1)';
    }

    document.addEventListener('keydown', (e) => {
        if (
            e.code === globalState.hideKey &&
            !e.ctrlKey &&
            !e.shiftKey &&
            !e.altKey &&
            !e.metaKey &&
            e.target.tagName !== 'INPUT' &&
            e.target.tagName !== 'TEXTAREA'
        ) {
            __toggleSpeedhackUI();
        }
    });

    // Configuration
    const CONFIG = {
        defaultSpeed: 1.0,
        minSpeed: 0.001,
        maxSpeed: 100.0,
        maxCustomSpeed: Infinity,
        step: 0.001,
        uiUpdateInterval: 100,
        favoritePresets: [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100]
    };

    // Global state
    let globalSpeed = CONFIG.defaultSpeed;
    let uiElement = null;
    let isInitialized = false;
    let startTime = Date.now();
    let refreshRequired = false;
    const __trackedSources = new Map(); // AudioBufferSourceNode -> isMusic
    const globalState = {
        perfNow: false,
        dateNow: false,
        setTimeout: false,
        setInterval: false,
        raf: false,

        music: false,
        sfx: false,

        clearTimeouts: true,
        customPresets: [],
        debugLogging: false,
        autoInjectFrames: true,
        persistentUI: true,

        perfNowSpeed: 1.0,
        dateNowSpeed: 1.0,
        setTimeoutSpeed: 1.0,
        setIntervalSpeed: 1.0,
        rafSpeed: 1.0,
        musicSpeed: 1.0,
        sfxSpeed: 1.0,

        hideKey: 'KeyL'
    };


    // Storage for persistence
    const STORAGE_KEY = 'speedhack_settings';

    function saveSettings() {
        try {
            const settings = {
                speed: globalSpeed,
                state: globalState,
                uiPosition: uiElement ? {
                    left: uiElement.style.left,
                    top: uiElement.style.top
                } : null
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('[SpeedHack] Could not save settings:', e);
        }
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                globalSpeed = settings.speed || CONFIG.defaultSpeed;
                Object.assign(globalState, settings.state || {});
                return settings;
            }
        } catch (e) {
            console.warn('[SpeedHack] Could not load settings:', e);
        }
        return null;
    }

    function showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? 'rgba(244,67,54,0.95)' :
        type === 'warning' ? 'rgba(255,193,7,0.95)' :
        type === 'success' ? 'rgba(76,175,80,0.95)' :
        'rgba(33,150,243,0.95)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            z-index: 2147483649;
            backdrop-filter: blur(15px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
            animation: slideDown 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
            text-align: center;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-30px) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0) scale(1);
                }
            }
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-30px) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);

        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span style="font-size: 16px;">${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 300);
        }, duration);

        return notification;
    }

    (function hookWebAudio() {
        const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
        if (!OriginalAudioContext) return;

        window.AudioContext = window.webkitAudioContext = function (...args) {
            const ctx = new OriginalAudioContext(...args);
            const originalCreateBufferSource = ctx.createBufferSource.bind(ctx);

            ctx.createBufferSource = function () {
                const source = originalCreateBufferSource();

                // default: SFX
                __trackedSources.set(source, false);

                Object.defineProperty(source, 'loop', {
                    get() { return this._loop || false; },
                    set(value) {
                        this._loop = value;
                        __trackedSources.set(source, value === true);
                    }
                });

                return source;
            };

            return ctx;
        };
    })();


    function createInjectionScript(speed, state) {
        return `
    (function() {
        if (window.__speedHackInjected) return;
        window.__speedHackInjected = true;

        const realPerfNow = performance.now.bind(performance);
        const realDateNow = Date.now;
        const realSetTimeout = window.setTimeout;
        const realSetInterval = window.setInterval;
        const realClearTimeout = window.clearTimeout;
        const realClearInterval = window.clearInterval;
        const realRAF = window.requestAnimationFrame;
        const realCAF = window.cancelAnimationFrame;

        let currentSpeed = ${speed};
        let functionSpeeds = {
            perfNow: ${state.perfNowSpeed || 1.0},
            dateNow: ${state.dateNowSpeed || 1.0},
            setTimeout: ${state.setTimeoutSpeed || 1.0},
            setInterval: ${state.setIntervalSpeed || 1.0},
            raf: ${state.rafSpeed || 1.0}
        };

        let perfStartTime = realPerfNow();
        let virtualStartTime = perfStartTime;
        let dateStartTime = realDateNow();
        let virtualDateStart = dateStartTime;

        const timeoutMap = new Map();
        const intervalMap = new Map();
        let timeoutId = 1;
        let intervalId = 1;

        // Performance.now override - uses individual speed only if enabled
        ${state.perfNow ? `
        performance.now = function() {
            const realNow = realPerfNow();
            const realElapsed = realNow - perfStartTime;
            return virtualStartTime + (realElapsed * functionSpeeds.perfNow);
        };
        ` : ''}

        // Date.now override - uses individual speed only if enabled
        ${state.dateNow ? `
        Date.now = function() {
            const realNow = realPerfNow();
            const realElapsed = realNow - perfStartTime;
            return Math.floor(virtualDateStart + (realElapsed * functionSpeeds.dateNow));
        };
        ` : ''}

        // setTimeout override - uses individual speed only if enabled
        ${state.setTimeout ? `
        window.setTimeout = function(callback, delay, ...args) {
            if (typeof callback !== 'function') return realSetTimeout(callback, delay, ...args);

            const adjustedDelay = Math.max(0, delay / functionSpeeds.setTimeout);
            const id = timeoutId++;
            const realId = realSetTimeout(() => {
                timeoutMap.delete(id);
                callback.apply(this, args);
            }, adjustedDelay);

            timeoutMap.set(id, realId);
            return id;
        };

        ${state.clearTimeouts ? `
        window.clearTimeout = function(id) {
            const realId = timeoutMap.get(id);
            if (realId !== undefined) {
                timeoutMap.delete(id);
                return realClearTimeout(realId);
            }
            return realClearTimeout(id);
        };
        ` : ''}
        ` : ''}

        // setInterval override - uses individual speed only if enabled
        ${state.setInterval ? `
        window.setInterval = function(callback, delay, ...args) {
            if (typeof callback !== 'function') return realSetInterval(callback, delay, ...args);

            const adjustedDelay = Math.max(1, delay / functionSpeeds.setInterval);
            const id = intervalId++;
            const realId = realSetInterval(() => {
                callback.apply(this, args);
            }, adjustedDelay);

            intervalMap.set(id, realId);
            return id;
        };

        ${state.clearTimeouts ? `
        window.clearInterval = function(id) {
            const realId = intervalMap.get(id);
            if (realId !== undefined) {
                intervalMap.delete(id);
                return realClearInterval(realId);
            }
            return realClearInterval(id);
        };
        ` : ''}
        ` : ''}

        // requestAnimationFrame override - uses individual speed only if enabled
        ${state.raf ? `
        window.requestAnimationFrame = function(callback) {
            return realRAF((timestamp) => {
                const virtualTime = performance.now();
                callback(virtualTime);
            });
        };
        ` : ''}

        // Update speed function
        window.__updateSpeedHack = function(newSpeed, newState) {
            currentSpeed = newSpeed;
            if (newState.perfNowSpeed !== undefined) functionSpeeds.perfNow = newState.perfNowSpeed;
            if (newState.dateNowSpeed !== undefined) functionSpeeds.dateNow = newState.dateNowSpeed;
            if (newState.setTimeoutSpeed !== undefined) functionSpeeds.setTimeout = newState.setTimeoutSpeed;
            if (newState.setIntervalSpeed !== undefined) functionSpeeds.setInterval = newState.setIntervalSpeed;
            if (newState.rafSpeed !== undefined) functionSpeeds.raf = newState.rafSpeed;

            const realNow = realPerfNow();
            const currentVirtualTime = virtualStartTime + ((realNow - perfStartTime) * functionSpeeds.perfNow);
            perfStartTime = realNow;
            virtualStartTime = currentVirtualTime;

            const currentVirtualDate = virtualDateStart + ((realNow - perfStartTime) * functionSpeeds.dateNow);
            virtualDateStart = currentVirtualDate;
        };

        ${state.debugLogging ? `console.log('[SpeedHack] Injected at ' + currentSpeed + 'x speed with individual function speeds');` : ''}
    })();
    `;
    }

    function injectIntoWindow(targetWindow, speed, state) {
        try {
            if (!targetWindow || !targetWindow.document) return false;

            const script = targetWindow.document.createElement('script');
            script.textContent = createInjectionScript(speed, state);
            script.setAttribute('data-speedhack', 'true');

            const target = targetWindow.document.documentElement || targetWindow.document.head || targetWindow.document.body;
            if (target) {
                target.appendChild(script);
                return true;
            }
        } catch (e) {
            if (globalState.debugLogging) {
                console.warn('[SpeedHack] Injection failed:', e);
            }
        }
        return false;
    }

    function updateAllWindows() {
        // Update main window
        injectIntoWindow(window, globalSpeed, globalState);
        if (window.__updateSpeedHack) {
            window.__updateSpeedHack(globalSpeed, globalState);
        }

        // Update all iframes if enabled
        if (globalState.autoInjectFrames) {
            const frames = document.querySelectorAll('iframe');
            frames.forEach(frame => {
                try {
                    const frameWindow = frame.contentWindow;
                    if (frameWindow && frameWindow.document) {
                        injectIntoWindow(frameWindow, globalSpeed, globalState);
                        if (frameWindow.__updateSpeedHack) {
                            frameWindow.__updateSpeedHack(globalSpeed, globalState);
                        }
                    }
                } catch (e) {
                    // Cross-origin iframe, ignore
                }
            });
        }
    }

    setInterval(() => {
        __trackedSources.forEach((isMusic, source) => {
            try {
                if (!source.playbackRate) return;

                if (isMusic && globalState.music) {
                    source.playbackRate.value = globalState.musicSpeed;
                } else if (!isMusic && globalState.sfx) {
                    source.playbackRate.value = globalState.sfxSpeed;
                } else {
                    source.playbackRate.value = 1;
                }
            } catch {
                __trackedSources.delete(source);
            }
        });
    }, 100);

    function formatSpeed(speed) {
        if (speed >= 1000000) {
            return (speed / 1000000).toFixed(1) + 'M';
        } else if (speed >= 1000) {
            return (speed / 1000).toFixed(1) + 'K';
        } else if (speed >= 1) {
            return speed.toFixed(3).replace(/\.?0+$/, '');
        } else {
            return speed.toFixed(6).replace(/\.?0+$/, '');
        }
    }

    function createRefreshIndicator() {
        if (document.querySelector('#speedhack-refresh-indicator')) return;

        const indicator = document.createElement('div');
        indicator.id = 'speedhack-refresh-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(255,193,7,0.95), rgba(255,152,0,0.95));
            color: #000;
            z-index: 2147483648;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(255,193,7,0.4);
            border: 1px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(15px);
            animation: pulse 2s infinite;
            cursor: pointer;
            user-select: none;
            max-width: 250px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.9; }
            }
        `;
        document.head.appendChild(style);

        indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">🔄</span>
                <div>
                    <div style="font-weight: bold;">Refresh Required</div>
                    <div style="font-size: 10px; opacity: 0.8;">Click to refresh page</div>
                </div>
            </div>
        `;

        indicator.addEventListener('click', () => {
            location.reload();
        });

        document.body.appendChild(indicator);

        // Auto-remove after 10 seconds if not clicked
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                indicator.style.animation = 'slideUp 0.3s ease-in forwards';
                setTimeout(() => {
                    if (document.body.contains(indicator)) {
                        document.body.removeChild(indicator);
                    }
                }, 300);
            }
        }, 10000);
    }

    function createUI() {
        if (uiElement) return;

        const ui = document.createElement('div');
        ui.id = 'speedhack-ui';
        ui.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 18px;
            background: linear-gradient(135deg, rgba(0,0,0,0.96), rgba(30,30,30,0.96));
            color: #fff;
            z-index: 2147483647;
            border-radius: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            min-width: 300px;
            max-width: 350px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(25px);
            user-select: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

            max-height: 90vh;
            overflow-y: auto;
            box-sizing: border-box;

            scrollbar-width: thin;
            scrollbar-color: #666 transparent;
        `;

        ui.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <div>
                    <strong style="color: #4CAF50; font-size: 15px; font-weight: 700;">⚡ HTML5 Speed Hack</strong>
                    <div style="font-size: 9px; color: #888; margin-top: 2px;">Press <span id="hide-key-display" style="color: #4CAF50; font-weight: 600;">L</span> to hide UI</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="speedhack-settings" style="background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer; font-size: 14px; padding: 6px 10px; border-radius: 6px; transition: all 0.2s; font-weight: 500;">⚙️</button>
                    <button id="speedhack-minimize" style="background: rgba(255,255,255,0.1); border: none; color: #fff; cursor: pointer; font-size: 14px; padding: 6px 10px; border-radius: 6px; transition: all 0.2s; font-weight: 500;">−</button>
                </div>
            </div>
            <div id="speedhack-content">
                <div style="margin-bottom: 14px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(76,175,80,0.3)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
                            <input type="checkbox" id="toggle-perfnow" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> performance.now()
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(76,175,80,0.3)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
                            <input type="checkbox" id="toggle-datenow" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> Date.now()
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(76,175,80,0.3)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
                            <input type="checkbox" id="toggle-settimeout" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> setTimeout
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(76,175,80,0.3)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
                            <input type="checkbox" id="toggle-setinterval" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> setInterval
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent; grid-column: span 2;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(76,175,80,0.3)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
                            <input type="checkbox" id="toggle-raf" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> requestAnimationFrame
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(76,175,80,0.3)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
                            <input type="checkbox" id="toggle-music" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> 🎵 Music
                        </label>
                        <label style="display: flex; align-items: center; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: all 0.2s; border: 1px solid transparent;" onmouseover="this.style.background='rgba(255,255,255,0.08)'; this.style.borderColor='rgba(76,175,80,0.3)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
                            <input type="checkbox" id="toggle-sfx" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> 🔊 Sound FX
                        </label>
                    </div>
                </div>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.25); margin: 14px 0;">

                <!-- Speed Control Section -->
                <div style="margin-bottom: 14px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 600; font-size: 14px;">Speed Control:</span>
                        <span id="speed-display" style="color: #4CAF50; font-weight: bold; font-size: 16px; text-shadow: 0 0 10px rgba(76,175,80,0.5);">${formatSpeed(globalSpeed)}x</span>
                    </div>

                    <!-- Custom Speed Input -->
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="number" id="speed-input"
                               value="${globalSpeed}"
                               min="0"
                               step="any"
                               placeholder="Enter any speed..."
                               style="flex: 1; padding: 8px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); color: #fff; border-radius: 8px; font-size: 13px; outline: none; transition: all 0.3s; font-weight: 500;"
                               onfocus="this.style.borderColor='#4CAF50'; this.style.background='rgba(76,175,80,0.15)'; this.style.boxShadow='0 0 0 2px rgba(76,175,80,0.2)'"
                               onblur="this.style.borderColor='rgba(255,255,255,0.25)'; this.style.background='rgba(255,255,255,0.1)'; this.style.boxShadow='none'">
                        <button id="speed-apply" style="padding: 8px 16px; background: linear-gradient(135deg, #4CAF50, #45a049); border: none; color: white; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s; box-shadow: 0 2px 8px rgba(76,175,80,0.3);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(76,175,80,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(76,175,80,0.3)'">Apply</button>
                    </div>

                    <div style="font-size: 10px; color: #aaa; margin-bottom: 10px; text-align: center;">
                        💡 Slider: 0.001-100x | Input: No limit (up to ∞)
                    </div>

                    <!-- Speed Slider (Limited to 100x) -->
                    <input type="range" id="speed-slider"
                           min="${Math.log(CONFIG.minSpeed)}"
                           max="${Math.log(CONFIG.maxSpeed)}"
                           value="${Math.min(Math.log(globalSpeed), Math.log(CONFIG.maxSpeed))}"
                           step="0.01"
                           style="width: 100%; margin-bottom: 10px; accent-color: #4CAF50; height: 6px;">

                    <!-- Quick Presets -->
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-bottom: 10px;">
                        <button class="speed-preset" data-speed="0.1" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">0.1x</button>
                        <button class="speed-preset" data-speed="0.25" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">0.25x</button>
                        <button class="speed-preset" data-speed="0.5" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">0.5x</button>
                        <button class="speed-preset" data-speed="1" style="padding: 6px 4px; font-size: 10px; background: #4CAF50; border: 1px solid #4CAF50; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.background='#45a049'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#4CAF50'; this.style.transform='scale(1)'">1x</button>
                        <button class="speed-preset" data-speed="2" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">2x</button>
                        <button class="speed-preset" data-speed="5" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">5x</button>
                        <button class="speed-preset" data-speed="10" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">10x</button>
                        <button class="speed-preset" data-speed="25" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">25x</button>
                        <button class="speed-preset" data-speed="50" style="padding: 6px 4px; font-size: 10px; background: #333; border: 1px solid #555; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.background='#444'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#333'; this.style.transform='scale(1)'">50x</button>
                        <button class="speed-preset" data-speed="100" style="padding: 6px 4px; font-size: 10px; background: #FF9800; border: 1px solid #FF9800; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.background='#F57C00'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='#FF9800'; this.style.transform='scale(1)'">100x</button>
                    </div>

                    <!-- Extreme Speed Presets -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-bottom: 10px;">
                        <button class="speed-preset" data-speed="1000" style="padding: 6px 4px; font-size: 9px; background: linear-gradient(135deg, #E91E63, #AD1457); border: 1px solid #E91E63; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">1000x</button>
                        <button class="speed-preset" data-speed="10000" style="padding: 6px 4px; font-size: 9px; background: linear-gradient(135deg, #9C27B0, #7B1FA2); border: 1px solid #9C27B0; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">10K x</button>
                        <button class="speed-preset" data-speed="100000" style="padding: 6px 4px; font-size: 9px; background: linear-gradient(135deg, #F44336, #D32F2F); border: 1px solid #F44336; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">100K x</button>
                        <button class="speed-preset" data-speed="1000000" style="padding: 6px 4px; font-size: 9px; background: linear-gradient(135deg, #FF5722, #E64A19); border: 1px solid #FF5722; color: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-weight: 600;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">1M x</button>
                    </div>

                    <!-- Advanced Controls -->
                    <div style="display: flex; gap: 6px;">
                        <button id="speed-save-preset" style="flex: 1; padding: 8px; font-size: 11px; background: linear-gradient(135deg, rgba(255,193,7,0.9), rgba(255,152,0,0.9)); border: 1px solid #FFC107; color: #000; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(255,193,7,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">💾 Save</button>
                        <button id="speed-reset" style="flex: 1; padding: 8px; font-size: 11px; background: linear-gradient(135deg, rgba(244,67,54,0.9), rgba(211,47,47,0.9)); border: 1px solid #F44336; color: #fff; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(244,67,54,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">🔄 Reset</button>
                        <button id="speed-infinity" style="flex: 1; padding: 8px; font-size: 11px; background: linear-gradient(135deg, rgba(156,39,176,0.9), rgba(123,31,162,0.9)); border: 1px solid #9C27B0; color: #fff; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(156,39,176,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">∞ Max</button>
                    </div>
                </div>

                <!-- Statistics -->
                <div id="speed-stats" style="font-size: 11px; color: #ccc; text-align: center; padding: 10px; background: rgba(255,255,255,0.06); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span>Active Functions:</span>
                        <span id="active-functions" style="color: #4CAF50; font-weight: 600;">0</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span>Uptime:</span>
                        <span id="uptime" style="color: #2196F3; font-weight: 600;">0s</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Status:</span>
                        <span id="injection-status" style="color: #4CAF50; font-weight: 600;">Ready</span>
                    </div>
                </div>
            </div>

            <!-- Advanced Settings Panel -->
            <div id="speedhack-settings-panel" style="display: none; margin-top: 14px; padding: 14px; background: rgba(255,255,255,0.06); border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
                <div style="font-weight: 600; margin-bottom: 10px; color: #4CAF50; font-size: 14px;">⚙️ Advanced Settings</div>
                <div style="font-size: 12px;">

                    <!-- Individual Function Speed Sliders -->
<div id="function-speed-sliders" style="margin-bottom: 12px; padding: 10px; background: rgba(76,175,80,0.1); border-radius: 8px; border: 1px solid rgba(76,175,80,0.2);">
    <div style="font-weight: 600; margin-bottom: 8px; color: #4CAF50; font-size: 13px;">🎛️ Individual Function Speeds</div>

    <!-- performance.now() Speed -->
    <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 11px; color: #ccc;">performance.now()</label>
            <span id="perfnow-speed-display" style="color: #4CAF50; font-weight: 600; font-size: 11px;">${formatSpeed(globalState.perfNowSpeed)}x</span>
        </div>
        <input type="range" id="perfnow-speed-slider"
               min="${Math.log(CONFIG.minSpeed)}"
               max="${Math.log(CONFIG.maxSpeed)}"
               value="${Math.log(globalState.perfNowSpeed)}"
               step="0.01"
               ${!globalState.perfNow ? 'disabled' : ''}
               style="width: 100%; accent-color: #4CAF50; height: 4px; ${!globalState.perfNow ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
    </div>

    <!-- Date.now() Speed -->
    <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 11px; color: #ccc;">Date.now()</label>
            <span id="datenow-speed-display" style="color: #4CAF50; font-weight: 600; font-size: 11px;">${formatSpeed(globalState.dateNowSpeed)}x</span>
        </div>
        <input type="range" id="datenow-speed-slider"
               min="${Math.log(CONFIG.minSpeed)}"
               max="${Math.log(CONFIG.maxSpeed)}"
               value="${Math.log(globalState.dateNowSpeed)}"
               step="0.01"
               ${!globalState.dateNow ? 'disabled' : ''}
               style="width: 100%; accent-color: #4CAF50; height: 4px; ${!globalState.dateNow ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
    </div>

    <!-- setTimeout Speed -->
    <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 11px; color: #ccc;">setTimeout</label>
            <span id="settimeout-speed-display" style="color: #4CAF50; font-weight: 600; font-size: 11px;">${formatSpeed(globalState.setTimeoutSpeed)}x</span>
        </div>
        <input type="range" id="settimeout-speed-slider"
               min="${Math.log(CONFIG.minSpeed)}"
               max="${Math.log(CONFIG.maxSpeed)}"
               value="${Math.log(globalState.setTimeoutSpeed)}"
               step="0.01"
               ${!globalState.setTimeout ? 'disabled' : ''}
               style="width: 100%; accent-color: #4CAF50; height: 4px; ${!globalState.setTimeout ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
    </div>

    <!-- setInterval Speed -->
    <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 11px; color: #ccc;">setInterval</label>
            <span id="setinterval-speed-display" style="color: #4CAF50; font-weight: 600; font-size: 11px;">${formatSpeed(globalState.setIntervalSpeed)}x</span>
        </div>
        <input type="range" id="setinterval-speed-slider"
               min="${Math.log(CONFIG.minSpeed)}"
               max="${Math.log(CONFIG.maxSpeed)}"
               value="${Math.log(globalState.setIntervalSpeed)}"
               step="0.01"
               ${!globalState.setInterval ? 'disabled' : ''}
               style="width: 100%; accent-color: #4CAF50; height: 4px; ${!globalState.setInterval ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
    </div>

    <!-- requestAnimationFrame Speed -->
    <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 11px; color: #ccc;">requestAnimationFrame</label>
            <span id="raf-speed-display" style="color: #4CAF50; font-weight: 600; font-size: 11px;">${formatSpeed(globalState.rafSpeed)}x</span>
        </div>
        <input type="range" id="raf-speed-slider"
               min="${Math.log(CONFIG.minSpeed)}"
               max="${Math.log(CONFIG.maxSpeed)}"
               value="${Math.log(globalState.rafSpeed)}"
               step="0.01"
               ${!globalState.raf ? 'disabled' : ''}
               style="width: 100%; accent-color: #4CAF50; height: 4px; ${!globalState.raf ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
    </div>

    <!-- Music Speed -->
    <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 11px; color: #ccc;">🎵 Music</label>
            <span id="music-speed-display" style="color: #4CAF50; font-weight: 600; font-size: 11px;">${formatSpeed(globalState.musicSpeed)}x</span>
        </div>
        <input type="range" id="music-speed-slider"
               min="${Math.log(CONFIG.minSpeed)}"
               max="${Math.log(CONFIG.maxSpeed)}"
               value="${Math.log(globalState.musicSpeed)}"
               step="0.01"
               ${!globalState.music ? 'disabled' : ''}
               style="width: 100%; accent-color: #4CAF50; height: 4px; ${!globalState.music ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
    </div>

    <!-- Sound FX Speed -->
    <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <label style="font-size: 11px; color: #ccc;">🔊 Sound FX</label>
            <span id="sfx-speed-display" style="color: #4CAF50; font-weight: 600; font-size: 11px;">${formatSpeed(globalState.sfxSpeed)}x</span>
        </div>
        <input type="range" id="sfx-speed-slider"
               min="${Math.log(CONFIG.minSpeed)}"
               max="${Math.log(CONFIG.maxSpeed)}"
               value="${Math.log(globalState.sfxSpeed)}"
               step="0.01"
               ${!globalState.sfx ? 'disabled' : ''}
               style="width: 100%; accent-color: #4CAF50; height: 4px; ${!globalState.sfx ? 'opacity: 0.3; cursor: not-allowed;' : ''}">
    </div>

    <div style="display: flex; gap: 6px; margin-top: 10px;">
        <button id="sync-all-speeds" style="flex: 1; padding: 6px; background: rgba(76,175,80,0.2); border: 1px solid #4CAF50; color: #4CAF50; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='rgba(76,175,80,0.3)'" onmouseout="this.style.background='rgba(76,175,80,0.2)'">🔗 Sync to Global</button>
        <button id="reset-function-speeds" style="flex: 1; padding: 6px; background: rgba(244,67,54,0.2); border: 1px solid #F44336; color: #F44336; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='rgba(244,67,54,0.3)'" onmouseout="this.style.background='rgba(244,67,54,0.2)'">🔄 Reset All</button>
    </div>
</div>

                    <!-- General Settings -->
                    <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                        <input type="checkbox" id="auto-inject-frames" checked style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> Auto-inject into iframes
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                        <input type="checkbox" id="debug-logging" style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> Debug logging
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer; padding: 4px; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                        <input type="checkbox" id="persistent-ui" checked style="margin-right: 8px; accent-color: #4CAF50; transform: scale(1.1);"> Remember UI position
                    </label>

                    <div style="margin-bottom: 10px; padding: 8px; background: rgba(33,150,243,0.1); border: 1px solid rgba(33,150,243,0.3); border-radius: 6px;">
                        <div style="font-size: 11px; color: #64B5F6; font-weight: 600; margin-bottom: 6px;">⌨️ Hide UI Keybind</div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="hide-key-input" readonly value="L"
                                   style="flex: 1; padding: 6px 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25); color: #fff; border-radius: 6px; font-size: 12px; text-align: center; cursor: pointer; font-weight: 600;"
                                   placeholder="Press a key...">
                            <button id="reset-hide-key" style="padding: 6px 12px; background: rgba(244,67,54,0.2); border: 1px solid #F44336; color: #F44336; border-radius: 6px; cursor: pointer; font-size: 10px; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='rgba(244,67,54,0.3)'" onmouseout="this.style.background='rgba(244,67,54,0.2)'">Reset</button>
                        </div>
                        <div style="font-size: 9px; color: #90CAF9; margin-top: 4px;">Click the input and press any key to rebind</div>
                    </div>

                    <div style="background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.3); border-radius: 6px; padding: 8px; margin-bottom: 10px;">
                        <div style="font-size: 11px; color: #FFC107; font-weight: 600; margin-bottom: 4px;">⚠️ Function Change Notice</div>
                        <div style="font-size: 10px; color: #FFE082;">Changing function toggles or individual speeds requires a page refresh to take effect.</div>
                    </div>

                    <div style="display: flex; gap: 6px;">
                        <button id="clear-settings" style="flex: 1; padding: 8px; background: rgba(244,67,54,0.2); border: 1px solid #F44336; color: #F44336; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='rgba(244,67,54,0.3)'" onmouseout="this.style.background='rgba(244,67,54,0.2)'">Clear All Settings</button>
                        <button id="refresh-page" style="flex: 1; padding: 8px; background: rgba(76,175,80,0.2); border: 1px solid #4CAF50; color: #4CAF50; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='rgba(76,175,80,0.3)'" onmouseout="this.style.background='rgba(76,175,80,0.2)'">🔄 Refresh Now</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(ui);
        uiElement = ui;

        // Set initial checkbox states
        ui.querySelector('#toggle-perfnow').checked = globalState.perfNow;
        ui.querySelector('#toggle-datenow').checked = globalState.dateNow;
        ui.querySelector('#toggle-settimeout').checked = globalState.setTimeout;
        ui.querySelector('#toggle-setinterval').checked = globalState.setInterval;
        ui.querySelector('#toggle-raf').checked = globalState.raf;
        ui.querySelector('#toggle-music').checked = globalState.music;
        ui.querySelector('#toggle-sfx').checked = globalState.sfx;
        ui.querySelector('#auto-inject-frames').checked = globalState.autoInjectFrames;
        ui.querySelector('#debug-logging').checked = globalState.debugLogging;
        ui.querySelector('#persistent-ui').checked = globalState.persistentUI;

        // Event listeners
        const speedSlider = ui.querySelector('#speed-slider');
        const speedDisplay = ui.querySelector('#speed-display');
        const speedInput = ui.querySelector('#speed-input');
        const speedApply = ui.querySelector('#speed-apply');

        // Add the updateSliderStates function HERE
        function updateSliderStates() {
            const sliderMap = {
                'perfnow': 'perfNow',
                'datenow': 'dateNow',
                'settimeout': 'setTimeout',
                'setinterval': 'setInterval',
                'raf': 'raf',
                'music': 'music',
                'sfx': 'sfx'
            };

            // Hide key rebind functionality
            const hideKeyInput = ui.querySelector('#hide-key-input');
            const hideKeyDisplay = ui.querySelector('#hide-key-display');
            const resetHideKey = ui.querySelector('#reset-hide-key');

            if (hideKeyInput) {
                hideKeyInput.value = globalState.hideKey.replace('Key', '').replace('Digit', '');

                hideKeyInput.addEventListener('click', () => {
                    hideKeyInput.value = 'Press a key...';
                    hideKeyInput.style.background = 'rgba(76,175,80,0.2)';
                    hideKeyInput.style.borderColor = '#4CAF50';

                    const keyListener = (e) => {
                        e.preventDefault();

                        // Ignore modifier keys alone
                        if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

                        globalState.hideKey = e.code;
                        const displayKey = e.code.replace('Key', '').replace('Digit', '');
                        hideKeyInput.value = displayKey;
                        hideKeyDisplay.textContent = displayKey;
                        hideKeyInput.style.background = 'rgba(255,255,255,0.1)';
                        hideKeyInput.style.borderColor = 'rgba(255,255,255,0.25)';

                        saveSettings();
                        showNotification(`Hide UI key set to: ${displayKey}`, 'success', 2000);

                        hideKeyInput.removeEventListener('keydown', keyListener);
                        hideKeyInput.blur();
                    };

                    hideKeyInput.addEventListener('keydown', keyListener, { once: false });
                });

                hideKeyInput.addEventListener('blur', () => {
                    const displayKey = globalState.hideKey.replace('Key', '').replace('Digit', '');
                    hideKeyInput.value = displayKey;
                    hideKeyInput.style.background = 'rgba(255,255,255,0.1)';
                    hideKeyInput.style.borderColor = 'rgba(255,255,255,0.25)';
                });
            }

            if (resetHideKey) {
                resetHideKey.addEventListener('click', () => {
                    globalState.hideKey = 'KeyL';
                    hideKeyInput.value = 'L';
                    hideKeyDisplay.textContent = 'L';
                    saveSettings();
                    showNotification('Hide UI key reset to: L', 'info', 2000);
                });
            }

            // Update display on load
            if (hideKeyDisplay) {
                hideKeyDisplay.textContent = globalState.hideKey.replace('Key', '').replace('Digit', '');
            }

            if (!localStorage.getItem(STORAGE_KEY)) {
                ['perfNowSpeed', 'dateNowSpeed', 'setTimeoutSpeed', 'setIntervalSpeed', 'rafSpeed', 'musicSpeed', 'sfxSpeed'].forEach(key => {
                    globalState[key] = globalSpeed;
                });
                saveSettings();
            }

            Object.entries(sliderMap).forEach(([sliderName, stateKey]) => {
                const slider = ui.querySelector(`#${sliderName}-speed-slider`);
                if (slider) {
                    const isEnabled = globalState[stateKey];
                    slider.disabled = !isEnabled;
                    slider.style.opacity = isEnabled ? '1' : '0.3';
                    slider.style.cursor = isEnabled ? 'pointer' : 'not-allowed';
                }
            });
        }

        // Now call it after the function is defined
        updateSliderStates();

        // Individual function speed slider handlers
        function setupFunctionSpeedSlider(functionName, stateKey) {
            const slider = ui.querySelector(`#${functionName}-speed-slider`);
            const display = ui.querySelector(`#${functionName}-speed-display`);

            if (!slider || !display) return;

            slider.addEventListener('input', () => {
                const logValue = parseFloat(slider.value);
                const actualSpeed = Math.exp(logValue);
                globalState[stateKey] = Math.round(actualSpeed * 1000) / 1000;
                display.textContent = `${formatSpeed(globalState[stateKey])}x`;
                updateAllWindows();
                saveSettings();

                // NO refresh indicator needed - just sliding doesn't require refresh
                // Only toggling the checkbox on/off requires refresh
            });
        }

        setupFunctionSpeedSlider('perfnow', 'perfNowSpeed');
        setupFunctionSpeedSlider('datenow', 'dateNowSpeed');
        setupFunctionSpeedSlider('settimeout', 'setTimeoutSpeed');
        setupFunctionSpeedSlider('setinterval', 'setIntervalSpeed');
        setupFunctionSpeedSlider('raf', 'rafSpeed');
        setupFunctionSpeedSlider('music', 'musicSpeed');
        setupFunctionSpeedSlider('sfx', 'sfxSpeed');

        // Sync all function speeds to global speed
        ui.querySelector('#sync-all-speeds')?.addEventListener('click', () => {
            ['perfNowSpeed', 'dateNowSpeed', 'setTimeoutSpeed', 'setIntervalSpeed', 'rafSpeed', 'musicSpeed', 'sfxSpeed'].forEach(key => {
                globalState[key] = globalSpeed;
                const functionName = key.replace('Speed', '').toLowerCase();
                const slider = ui.querySelector(`#${functionName}-speed-slider`);
                const display = ui.querySelector(`#${functionName}-speed-display`);
                if (slider) slider.value = Math.log(globalSpeed);
                if (display) display.textContent = `${formatSpeed(globalSpeed)}x`;
            });

            updateAllWindows();
            saveSettings();
            showNotification('All function speeds synced to global speed!', 'success', 2000);
        });

        // Reset all function speeds to 1.0x
        ui.querySelector('#reset-function-speeds')?.addEventListener('click', () => {
            ['perfNowSpeed', 'dateNowSpeed', 'setTimeoutSpeed', 'setIntervalSpeed', 'rafSpeed', 'musicSpeed', 'sfxSpeed'].forEach(key => {
                globalState[key] = 1.0;
                const functionName = key.replace('Speed', '').toLowerCase();
                const slider = ui.querySelector(`#${functionName}-speed-slider`);
                const display = ui.querySelector(`#${functionName}-speed-display`);
                if (slider) slider.value = Math.log(1.0);
                if (display) display.textContent = '1.0x';
            });

            updateAllWindows();
            saveSettings();
            showNotification('All function speeds reset to 1.0x!', 'info', 2000);
        });



        // Logarithmic slider handling (limited to 100x)
        function updateSpeedFromSlider() {
            const logValue = parseFloat(speedSlider.value);
            const actualSpeed = Math.exp(logValue);
            globalSpeed = Math.round(actualSpeed * 1000) / 1000;
            speedDisplay.textContent = `${formatSpeed(globalSpeed)}x`;
            speedInput.value = globalSpeed;

            // Update ALL individual function speeds to match global speed
            ['perfNowSpeed', 'dateNowSpeed', 'setTimeoutSpeed', 'setIntervalSpeed', 'rafSpeed', 'musicSpeed', 'sfxSpeed'].forEach(key => {
                globalState[key] = globalSpeed;
                const functionName = key.replace('Speed', '').toLowerCase();
                const slider = ui.querySelector(`#${functionName}-speed-slider`);
                const display = ui.querySelector(`#${functionName}-speed-display`);
                if (slider) slider.value = Math.log(globalSpeed);
                if (display) display.textContent = `${formatSpeed(globalSpeed)}x`;
            });

            updateSliderFromSpeed(globalSpeed);
            updateAllWindows();
            saveSettings();

            speedApply.innerHTML = '✅';
            speedApply.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

            if (inputValue > CONFIG.maxSpeed) {
                showNotification(`Speed set to ${formatSpeed(inputValue)}x (beyond slider limit)`, 'success', 2000);
            } else {
                showNotification(`Speed applied: ${formatSpeed(inputValue)}x`, 'success', 1500);
            }

            setTimeout(() => {
                speedApply.innerHTML = 'Apply';
                speedApply.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            }, 1000);
        }

        function updateSliderFromSpeed(speed) {
            // Only update slider if speed is within slider range
            if (speed <= CONFIG.maxSpeed) {
                speedSlider.value = Math.log(speed);
            } else {
                speedSlider.value = Math.log(CONFIG.maxSpeed);
            }
            speedDisplay.textContent = `${formatSpeed(speed)}x`;
            speedInput.value = speed;
            updatePresetHighlight();
        }

        function updatePresetHighlight() {
            ui.querySelectorAll('.speed-preset').forEach(btn => {
                const presetSpeed = parseFloat(btn.dataset.speed);
                if (Math.abs(presetSpeed - globalSpeed) < 0.001) {
                    btn.style.background = btn.style.background.includes('linear-gradient') ?
                        btn.style.background : 'linear-gradient(135deg, #4CAF50, #45a049)';
                    btn.style.borderColor = '#4CAF50';
                    btn.style.boxShadow = '0 0 10px rgba(76,175,80,0.5)';
                } else {
                    // Reset to original colors based on speed value
                    if (presetSpeed === 1) {
                        btn.style.background = '#4CAF50';
                        btn.style.borderColor = '#4CAF50';
                    } else if (presetSpeed === 100) {
                        btn.style.background = '#FF9800';
                        btn.style.borderColor = '#FF9800';
                    } else if (presetSpeed >= 1000) {
                        // Keep gradient styles for extreme presets
                        btn.style.background = btn.getAttribute('style').match(/background: ([^;]+)/)?.[1] || '#333';
                    } else {
                        btn.style.background = '#333';
                        btn.style.borderColor = '#555';
                    }
                    btn.style.boxShadow = 'none';
                }
            });
        }

        // Enhanced speed input validation and application
        function applyCustomSpeed() {
            let inputValue = parseFloat(speedInput.value);

            if (speedInput.value.toLowerCase().includes('infinity') || speedInput.value === '∞') {
                inputValue = Infinity;
            }

            if (isNaN(inputValue) || inputValue <= 0) {
                speedInput.value = globalSpeed;
                speedInput.style.borderColor = '#F44336';
                speedInput.style.background = 'rgba(244,67,54,0.2)';
                showNotification('Invalid speed value! Please enter a positive number.', 'error', 2000);
                setTimeout(() => {
                    speedInput.style.borderColor = 'rgba(255,255,255,0.25)';
                    speedInput.style.background = 'rgba(255,255,255,0.1)';
                }, 1000);
                return;
            }

            if (inputValue > 1000000) {
                if (!confirm(`Warning: Speed of ${formatSpeed(inputValue)}x is extremely high and may cause browser instability or crashes. Continue?`)) {
                    return;
                }
            }

            globalSpeed = inputValue;

            // Sync individual function speeds to global speed when their toggles are OFF
            if (!globalState.perfNow) globalState.perfNowSpeed = globalSpeed;
            if (!globalState.dateNow) globalState.dateNowSpeed = globalSpeed;
            if (!globalState.setTimeout) globalState.setTimeoutSpeed = globalSpeed;
            if (!globalState.setInterval) globalState.setIntervalSpeed = globalSpeed;
            if (!globalState.raf) globalState.rafSpeed = globalSpeed;

            updateSliderFromSpeed(globalSpeed);
            updateAllWindows();
            saveSettings();

            speedApply.innerHTML = '✅';
            speedApply.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

            if (inputValue > CONFIG.maxSpeed) {
                showNotification(`Speed set to ${formatSpeed(inputValue)}x (beyond slider limit)`, 'success', 2000);
            } else {
                showNotification(`Speed applied: ${formatSpeed(inputValue)}x`, 'success', 1500);
            }

            setTimeout(() => {
                speedApply.innerHTML = 'Apply';
                speedApply.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            }, 1000);
        }

        speedSlider.addEventListener('input', updateSpeedFromSlider);
        speedApply.addEventListener('click', applyCustomSpeed);
        speedInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyCustomSpeed();
                speedInput.blur();
            }
        });

        // Enhanced statistics with refresh indicator
        function updateStats() {
            const activeFunctions = Object.values(globalState).slice(0, 5).filter(val => val === true).length;
            const uptime = Math.floor((Date.now() - startTime) / 1000);

            const statsElement = ui.querySelector('#active-functions');
            const uptimeElement = ui.querySelector('#uptime');
            const statusElement = ui.querySelector('#injection-status');

            if (statsElement) statsElement.textContent = activeFunctions;
            if (uptimeElement) {
                if (uptime < 60) {
                    uptimeElement.textContent = `${uptime}s`;
                } else if (uptime < 3600) {
                    uptimeElement.textContent = `${Math.floor(uptime / 60)}m ${uptime % 60}s`;
                } else {
                    uptimeElement.textContent = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;
                }
            }

            if (statusElement) {
                if (refreshRequired) {
                    statusElement.textContent = 'Refresh Required';
                    statusElement.style.color = '#FF9800';
                } else if (activeFunctions > 0) {
                    statusElement.textContent = 'Active';
                    statusElement.style.color = '#4CAF50';
                } else {
                    statusElement.textContent = 'Ready';
                    statusElement.style.color = '#2196F3';
                }
            }
        }

        setInterval(updateStats, 1000);
        updateStats();

        // Enhanced checkbox listeners with refresh requirement
        function createCheckboxListener(checkboxId, stateKey) {
            ui.querySelector(checkboxId).addEventListener('change', (e) => {
                const oldValue = globalState[stateKey];
                globalState[stateKey] = e.target.checked;

                if (oldValue !== e.target.checked) {
                    refreshRequired = true;
                    createRefreshIndicator();
                    showNotification('Function toggle changed. Refresh the page to apply changes.', 'warning', 4000);
                }

                updateSliderStates(); // Update slider states when checkbox changes
                updateAllWindows();
                saveSettings();
            });
        }

        createCheckboxListener('#toggle-perfnow', 'perfNow');
        createCheckboxListener('#toggle-datenow', 'dateNow');
        createCheckboxListener('#toggle-settimeout', 'setTimeout');
        createCheckboxListener('#toggle-setinterval', 'setInterval');
        createCheckboxListener('#toggle-raf', 'raf');

        ui.querySelector('#toggle-music').addEventListener('change', (e) => {
            globalState.music = e.target.checked;
            updateSliderStates(); // Update slider states when checkbox changes
            saveSettings();
        });

        ui.querySelector('#toggle-sfx').addEventListener('change', (e) => {
            globalState.sfx = e.target.checked;
            updateSliderStates(); // Update slider states when checkbox changes
            saveSettings();
        });


        // Advanced settings listeners
        ui.querySelector('#auto-inject-frames').addEventListener('change', (e) => {
            globalState.autoInjectFrames = e.target.checked;
            saveSettings();
        });

        ui.querySelector('#debug-logging').addEventListener('change', (e) => {
            globalState.debugLogging = e.target.checked;
            saveSettings();
        });

        ui.querySelector('#persistent-ui').addEventListener('change', (e) => {
            globalState.persistentUI = e.target.checked;
            saveSettings();
        });

        // Enhanced preset buttons
        ui.querySelectorAll('.speed-preset').forEach(button => {
            button.addEventListener('click', () => {
                const speed = parseFloat(button.dataset.speed);
                globalSpeed = speed;

                // Update ALL individual function speeds to match
                ['perfNowSpeed', 'dateNowSpeed', 'setTimeoutSpeed', 'setIntervalSpeed', 'rafSpeed', 'musicSpeed', 'sfxSpeed'].forEach(key => {
                    globalState[key] = speed;
                    const functionName = key.replace('Speed', '').toLowerCase();
                    const slider = ui.querySelector(`#${functionName}-speed-slider`);
                    const display = ui.querySelector(`#${functionName}-speed-display`);
                    if (slider) slider.value = Math.log(speed);
                    if (display) display.textContent = `${formatSpeed(speed)}x`;
                });

                updateSliderFromSpeed(globalSpeed);
                updateAllWindows();
                saveSettings();

                showNotification(`Speed set to ${formatSpeed(speed)}x`, 'success', 1500);
            });
        });

        // Enhanced advanced controls
        ui.querySelector('#speed-save-preset').addEventListener('click', () => {
            const presetName = prompt(`Save current speed (${formatSpeed(globalSpeed)}x) as preset:`, `${formatSpeed(globalSpeed)}x`);
            if (presetName) {
                if (!globalState.customPresets) globalState.customPresets = [];
                globalState.customPresets.push({ name: presetName, speed: globalSpeed });
                saveSettings();

                const btn = ui.querySelector('#speed-save-preset');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Saved';
                showNotification(`Preset "${presetName}" saved successfully!`, 'success', 2000);
                setTimeout(() => btn.innerHTML = originalText, 1500);
            }
        });

        ui.querySelector('#speed-reset').addEventListener('click', () => {
            if (confirm('Reset speed to 1.0x?')) {
                globalSpeed = 1.0;
                updateSliderFromSpeed(globalSpeed);
                updateAllWindows();
                saveSettings();
                showNotification('Speed reset to 1.0x', 'info', 1500);
            }
        });

        // New infinity button
        ui.querySelector('#speed-infinity').addEventListener('click', () => {
            if (confirm('Set speed to maximum (Infinity)? This may cause extreme performance issues!')) {
                globalSpeed = 999999999; // Very high number instead of actual Infinity for practical reasons
                updateSliderFromSpeed(globalSpeed);
                updateAllWindows();
                saveSettings();
                showNotification('Speed set to maximum!', 'warning', 2000);
            }
        });

        // Settings panel toggle
        ui.querySelector('#speedhack-settings').addEventListener('click', () => {
            const panel = ui.querySelector('#speedhack-settings-panel');
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';

            if (!isVisible) {
                panel.style.animation = 'slideDown 0.3s ease';
            }
        });

        // Enhanced settings panel controls
        ui.querySelector('#clear-settings').addEventListener('click', () => {
            if (confirm('Clear all saved settings? This will reset everything to defaults and reload the page.')) {
                localStorage.removeItem(STORAGE_KEY);
                showNotification('Settings cleared! Reloading page...', 'info', 2000);
                setTimeout(() => location.reload(), 1000);
            }
        });

        ui.querySelector('#refresh-page').addEventListener('click', () => {
            showNotification('Refreshing page...', 'info', 1000);
            setTimeout(() => location.reload(), 500);
        });

        // Enhanced minimize button
        ui.querySelector('#speedhack-minimize').addEventListener('click', () => {
            const content = ui.querySelector('#speedhack-content');
            const settingsPanel = ui.querySelector('#speedhack-settings-panel');
            const button = ui.querySelector('#speedhack-minimize');

            if (content.style.display === 'none') {
                // Expand
                content.style.display = 'block';
                button.textContent = '−';
                ui.style.minWidth = '300px';
                ui.style.animation = 'slideDown 0.3s ease';
            } else {
                // Minimize
                content.style.display = 'none';
                settingsPanel.style.display = 'none';
                button.textContent = '+';
                ui.style.minWidth = 'auto';
                ui.style.width = 'auto';
            }
        });

        // Enhanced draggable functionality
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        ui.addEventListener('mousedown', (e) => {
            if (!e.target.matches('input, button, label')) {
                isDragging = true;
                dragOffset.x = e.clientX - ui.offsetLeft;
                dragOffset.y = e.clientY - ui.offsetTop;
                ui.style.cursor = 'grabbing';
                ui.style.transition = 'none';
                ui.style.transform = 'scale(1.02)';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newX = Math.max(0, Math.min(window.innerWidth - ui.offsetWidth, e.clientX - dragOffset.x));
                const newY = Math.max(0, Math.min(window.innerHeight - ui.offsetHeight, e.clientY - dragOffset.y));

                ui.style.left = newX + 'px';
                ui.style.top = newY + 'px';
                ui.style.right = 'auto';
                ui.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                ui.style.cursor = 'default';
                ui.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                ui.style.transform = 'scale(1)';
                if (globalState.persistentUI) {
                    saveSettings();
                }
            }
        });

        // Enhanced keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey) {
                const shortcuts = {
                    'KeyS': () => {
                        e.preventDefault();
                        const panel = ui.querySelector('#speedhack-settings-panel');
                        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                    },
                    'KeyR': () => {
                        e.preventDefault();
                        globalSpeed = 1.0;
                        updateSliderFromSpeed(globalSpeed);
                        updateAllWindows();
                        saveSettings();
                        showNotification('Speed reset to 1.0x', 'info', 1500);
                    },
                    'KeyH': () => {
                        e.preventDefault();
                        ui.querySelector('#speedhack-minimize').click();
                    },
                    'KeyF': () => {
                        e.preventDefault();
                        location.reload();
                    }
                };

                // Speed presets (Ctrl+Shift+1-9)
                const speedPresets = {
                    'Digit1': 0.1, 'Digit2': 0.25, 'Digit3': 0.5, 'Digit4': 1.0,
                    'Digit5': 2.0, 'Digit6': 5.0, 'Digit7': 10.0, 'Digit8': 25.0, 'Digit9': 100.0
                };

                if (shortcuts[e.code]) {
                    shortcuts[e.code]();
                } else if (speedPresets[e.code]) {
                    e.preventDefault();
                    globalSpeed = speedPresets[e.code];
                    updateSliderFromSpeed(globalSpeed);
                    updateAllWindows();
                    saveSettings();
                    showNotification(`Speed set to ${formatSpeed(globalSpeed)}x`, 'success', 1500);
                }
            }
        });

        // Load saved UI position
        const savedSettings = loadSettings();
        if (globalState.persistentUI && savedSettings && savedSettings.uiPosition) {
            if (savedSettings.uiPosition.left && savedSettings.uiPosition.top) {
                ui.style.left = savedSettings.uiPosition.left;
                ui.style.top = savedSettings.uiPosition.top;
                ui.style.right = 'auto';
            }
        }

        // Initial setup
        updateSliderFromSpeed(globalSpeed);

        // Enhanced mouse wheel support
        ui.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                let newSpeed = globalSpeed * delta;

                // Apply reasonable bounds for wheel adjustment
                newSpeed = Math.max(0.001, Math.min(10000, newSpeed));
                newSpeed = Math.round(newSpeed * 1000) / 1000;

                globalSpeed = newSpeed;
                updateSliderFromSpeed(globalSpeed);
                updateAllWindows();
                saveSettings();
            }
        });

        // Enhanced double-click functionality
        ui.addEventListener('dblclick', (e) => {
            if (e.target === speedDisplay) {
                const customSpeed = prompt('Enter custom speed:', globalSpeed.toString());
                if (customSpeed !== null) {
                    speedInput.value = customSpeed;
                    applyCustomSpeed();
                }
            }
        });

        // Enhanced context menu
        ui.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const contextMenu = document.createElement('div');
            contextMenu.style.cssText = `
                position: fixed;
                left: ${Math.min(e.clientX, window.innerWidth - 200)}px;
                top: ${Math.min(e.clientY, window.innerHeight - 300)}px;
                background: rgba(0,0,0,0.95);
                border: 1px solid rgba(255,255,255,0.25);
                border-radius: 8px;
                padding: 8px 0;
                z-index: 2147483648;
                font-size: 12px;
                min-width: 180px;
                backdrop-filter: blur(15px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            `;

            const menuItems = [
                {
                    text: '🔄 Reset to 1.0x', action: () => {
                        globalSpeed = 1.0;
                        updateSliderFromSpeed(globalSpeed);
                        updateAllWindows();
                        saveSettings();
                        showNotification('Speed reset to 1.0x', 'info', 1500);
                    }
                },
                {
                    text: '⚡ Toggle All Functions', action: () => {
                        const allEnabled = Object.values(globalState).slice(0, 5).every(v => v);
                        ['perfNow', 'dateNow', 'setTimeout', 'setInterval', 'raf'].forEach(key => {
                            globalState[key] = !allEnabled;
                            const checkbox = ui.querySelector(`#toggle-${key.toLowerCase()}`);
                            if (checkbox) checkbox.checked = !allEnabled;
                        });
                        refreshRequired = true;
                        createRefreshIndicator();
                        updateAllWindows();
                        saveSettings();
                        showNotification('All functions toggled. Refresh required.', 'warning', 3000);
                    }
                },
                {
                    text: '📋 Copy Current Speed', action: () => {
                        navigator.clipboard.writeText(globalSpeed.toString()).then(() => {
                            showNotification(`Speed ${formatSpeed(globalSpeed)}x copied to clipboard!`, 'success', 2000);
                        });
                    }
                },
                {
                    text: '📁 Export Settings', action: () => {
                        const settings = JSON.stringify({ speed: globalSpeed, state: globalState }, null, 2);
                        navigator.clipboard.writeText(settings).then(() => {
                            showNotification('Settings exported to clipboard!', 'success', 2000);
                        });
                    }
                },
                {
                    text: '🚀 Set Extreme Speed', action: () => {
                        const extremeSpeed = prompt('Enter extreme speed value (use with caution):', '1000');
                        if (extremeSpeed && !isNaN(parseFloat(extremeSpeed))) {
                            globalSpeed = parseFloat(extremeSpeed);
                            updateSliderFromSpeed(globalSpeed);
                            updateAllWindows();
                            saveSettings();
                            showNotification(`Extreme speed set: ${formatSpeed(globalSpeed)}x`, 'warning', 2000);
                        }
                    }
                },
                { text: '🔃 Refresh Page', action: () => location.reload() }
            ];

            menuItems.forEach((item, index) => {
                const menuItem = document.createElement('div');
                menuItem.innerHTML = item.text;
                menuItem.style.cssText = `
                    padding: 8px 14px;
                    cursor: pointer;
                    color: #fff;
                    transition: all 0.2s;
                    border-left: 3px solid transparent;
                `;

                menuItem.addEventListener('mouseover', () => {
                    menuItem.style.background = 'rgba(255,255,255,0.1)';
                    menuItem.style.borderLeftColor = '#4CAF50';
                });
                menuItem.addEventListener('mouseout', () => {
                    menuItem.style.background = 'transparent';
                    menuItem.style.borderLeftColor = 'transparent';
                });
                menuItem.addEventListener('click', () => {
                    item.action();
                    document.body.removeChild(contextMenu);
                });

                contextMenu.appendChild(menuItem);

                if (index < menuItems.length - 1) {
                    const separator = document.createElement('div');
                    separator.style.cssText = `
                        height: 1px;
                        background: rgba(255,255,255,0.1);
                        margin: 4px 0;
                    `;
                    contextMenu.appendChild(separator);
                }
            });

            document.body.appendChild(contextMenu);

            // Enhanced context menu removal
            const removeMenu = (e) => {
                if (!contextMenu.contains(e.target)) {
                    contextMenu.style.animation = 'slideUp 0.2s ease-in forwards';
                    setTimeout(() => {
                        if (document.body.contains(contextMenu)) {
                            document.body.removeChild(contextMenu);
                        }
                    }, 200);
                    document.removeEventListener('click', removeMenu);
                }
            };
            setTimeout(() => document.addEventListener('click', removeMenu), 100);
        });

        // Show welcome notification on first load
        if (!localStorage.getItem(STORAGE_KEY + '_welcomed')) {
            setTimeout(() => {
                showNotification('HTML5 Speed Hack loaded! Right-click for more options.', 'info', 4000);
                localStorage.setItem(STORAGE_KEY + '_welcomed', 'true');
            }, 1000);
        }
    }

    function initialize() {
        if (isInitialized) return;
        isInitialized = true;

        loadSettings();

        // Initial injection
        updateAllWindows();

        // Create UI when DOM is ready
        if (document.body) {
            createUI();
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                if (document.body) {
                    createUI();
                    obs.disconnect();
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }

        // Enhanced iframe monitoring
        if (globalState.autoInjectFrames) {
            const frameObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const iframes = node.tagName === 'IFRAME' ? [node] : node.querySelectorAll('iframe');
                            iframes.forEach((iframe) => {
                                iframe.addEventListener('load', () => {
                                    setTimeout(() => {
                                        updateAllWindows();
                                        if (globalState.debugLogging) {
                                            console.log('[SpeedHack] Injected into new iframe');
                                        }
                                    }, 100);
                                });
                            });
                        }
                    });
                });
            });

            frameObserver.observe(document, { childList: true, subtree: true });
        }

        // Enhanced window resize handler
        window.addEventListener('resize', () => {
            if (uiElement && globalState.persistentUI) {
                const rect = uiElement.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    uiElement.style.left = (window.innerWidth - uiElement.offsetWidth - 10) + 'px';
                }
                if (rect.bottom > window.innerHeight) {
                    uiElement.style.top = (window.innerHeight - uiElement.offsetHeight - 10) + 'px';
                }
                saveSettings();
            }
        });

        // Enhanced visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && refreshRequired) {
                // Page became visible and refresh is required
                const indicator = document.querySelector('#speedhack-refresh-indicator');
                if (!indicator) {
                    createRefreshIndicator();
                }
            }
        });

        // Performance monitoring
        if (globalState.debugLogging) {
            console.log('[SpeedHack] Pro Enhanced version 2.5 initialized successfully');
            console.log('[SpeedHack] Current speed:', globalSpeed + 'x');
            console.log('[SpeedHack] Active functions:', Object.entries(globalState).filter(([key, value]) =>
                                                                                            ['perfNow', 'dateNow', 'setTimeout', 'setInterval', 'raf'].includes(key) && value
                                                                                           ).map(([key]) => key));
        }

        // Global error handler for speed hack related errors
        window.addEventListener('error', (e) => {
            if (globalState.debugLogging && e.error && e.error.message &&
                e.error.message.includes('SpeedHack')) {
                console.warn('[SpeedHack] Error caught:', e.error);
            }
        });
    }

    // Enhanced initialization with retry mechanism
    function initializeWithRetry() {
        let attempts = 0;
        const maxAttempts = 5;

        function tryInitialize() {
            try {
                initialize();
            } catch (error) {
                attempts++;
                if (attempts < maxAttempts) {
                    console.warn(`[SpeedHack] Initialization attempt ${attempts} failed, retrying...`);
                    setTimeout(tryInitialize, 1000 * attempts);
                } else {
                    console.error('[SpeedHack] Failed to initialize after', maxAttempts, 'attempts');
                }
            }
        }

        tryInitialize();
    }

    // Initialize based on document state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWithRetry);
    } else {
        setTimeout(initializeWithRetry, 100);
    }

    // Export for external access (debugging purposes)
    window.SpeedHackPro = {
        getSpeed: () => globalSpeed,
        setSpeed: (speed) => {
            if (typeof speed === 'number' && speed > 0) {
                globalSpeed = speed;
                if (uiElement) {
                    const speedDisplay = uiElement.querySelector('#speed-display');
                    const speedInput = uiElement.querySelector('#speed-input');
                    if (speedDisplay) speedDisplay.textContent = `${formatSpeed(globalSpeed)}x`;
                    if (speedInput) speedInput.value = globalSpeed;
                }
                updateAllWindows();
                saveSettings();
                return true;
            }
            return false;
        },
        getState: () => ({ ...globalState }),
        reload: () => location.reload(),
        version: '3.0'
    };

})();