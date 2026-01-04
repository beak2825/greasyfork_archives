// ==UserScript==
// @name         Torn Chat Blocker
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @version      1.2
// @description  Aggressively blocks Torn Chat with a visual toggle switch and per-page always-block via long press.
// @author       TR0LL
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536545/Torn%20Chat%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/536545/Torn%20Chat%20Blocker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- Configuration ---
    const DEBUG_MODE = false; // Set to true for detailed console logging, false for production
    const CHAT_URL_PATTERNS_TO_BLOCK = [
        // General chat patterns
        /https:\/\/www\.torn\.com\/chat/,
        /https:\/\/www\.torn\.com\/builds\/chat\//,
        /chat-worker\.js/,
        /fetch-worker\.js/,
        /https:\/\/www\.torn\.com\/js\/chat/,
 
        // Specific script files
        /https:\/\/www\.torn\.com\/builds\/chat\/app\.[a-f0-9]+\.js/,
        /https:\/\/www\.torn\.com\/builds\/chat\/vendors\.[a-f0-9]+\.js/,
        /https:\/\/www\.torn\.com\/builds\/chat\/runtime\.[a-f0-9]+\.js/,
 
        // Specific CSS files
        /https:\/\/www\.torn\.com\/builds\/chat\/app\.[a-f0-9]+\.css/,
        /https:\/\/www\.torn\.com\/builds\/chat\/vendors\.[a-f0-9]+\.css/,
 
        // Ultra-aggressive chat asset blocking
        /torn\.com\/builds\/chat\/.*\.js/,
        /torn\.com\/builds\/chat\/.*\.css/,
        /torn\.com\/builds\/chat\/.*\.json/,
        /torn\.com\/builds\/chat\/.*\.png/,
        /torn\.com\/builds\/chat\/.*\.jpg/,
        /torn\.com\/builds\/chat\/.*\.svg/,
        /torn\.com\/builds\/chat\/.*\.woff/,
        /torn\.com\/builds\/chat\/.*\.mp3/,
 
        // Sendbird related patterns
        /sendbird\.(com|io)/,
        /api\.sendbird\.com/,
        /ws\.sendbird\.com/,
        /sb\.scorpion\.io/,
        /^\wss?:\/\/.*sendbird/,
        /.*\.sendbird\..*/i,
 
        // Broader chat patterns
        /torn\.com\/.*chat/i,
        /torn\.com\/.*sendbird/i,
 
        // Added rule for profile-mini (Example, adjust as needed)
        /https:\/\/www\.torn\.com\/builds\/profile-mini\//
    ];
 
    const TOGGLE_BUTTON_ID = 'torn-chat-blocker-toggle';
    const LOCAL_STORAGE_KEY_GLOBAL_BLOCK = 'tornChatBlockingEnabled';
    const LOCAL_STORAGE_KEY_ALWAYS_BLOCK_PAGES = 'tornChatAlwaysBlockedPages';
    const DEBOUNCE_DELAY = 250;
    const LONG_PRESS_DURATION = 750; // ms
 
    // --- Global State ---
    let isBlockingEnabled = localStorage.getItem(LOCAL_STORAGE_KEY_GLOBAL_BLOCK) !== 'false'; // Defaults to true
    let alwaysBlockedPages = new Set(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALWAYS_BLOCK_PAGES) || '[]'));
    let domObserver = null;
    let longPressTimer = null;
    let isLongPressFlag = false; // Distinguish long press from click
 
    // --- Logging Utility ---
    function log(...args) {
        if (DEBUG_MODE) {
            console.log('Torn Chat Blocker:', ...args);
        }
    }
    function warn(...args) {
        if (DEBUG_MODE) {
            console.warn('Torn Chat Blocker:', ...args);
        }
    }
 
    // --- CSS for the toggle button (Switch Style) ---
    GM_addStyle(`
        #${TOGGLE_BUTTON_ID} {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            width: 50px;
            height: 26px;
            border-radius: 13px;
            cursor: pointer;
            transition: background-color 0.3s ease, border-color 0.3s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1), inset 0 1px 1px rgba(0,0,0,0.1);
            box-sizing: border-box;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            padding: 0;
            font-size: 0;
            line-height: 0;
            color: transparent;
            /* Default background/border will be set by specific classes */
        }
 
        #${TOGGLE_BUTTON_ID}::after { /* The slider knob */
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
            transition: transform 0.3s ease;
            box-sizing: border-box;
        }
 
        /* State when global blocking is ON (GREEN) */
        #${TOGGLE_BUTTON_ID}.blocking-on {
            background-color: #388e3c; /* Green */
            border: 1px solid #2e7d32; /* Darker green */
        }
        #${TOGGLE_BUTTON_ID}.blocking-on::after {
            transform: translateX(24px); /* Knob right */
        }
 
        /* State when global blocking is OFF (RED) */
        #${TOGGLE_BUTTON_ID}.blocking-off {
            background-color: #d32f2f; /* Red */
            border: 1px solid #c62828; /* Darker red */
        }
        #${TOGGLE_BUTTON_ID}.blocking-off::after {
            transform: translateX(0); /* Knob left */
        }
 
        /* State when current page is ALWAYS BLOCKED (ORANGE) */
        #${TOGGLE_BUTTON_ID}.blocking-always {
            background-color: #FFA500; /* Orange */
            border: 1px solid #E69500; /* Darker orange */
        }
        #${TOGGLE_BUTTON_ID}.blocking-always::after {
            transform: translateX(24px); /* Knob right (appears "ON") */
        }
 
        #${TOGGLE_BUTTON_ID}:hover {
             filter: brightness(1.1);
        }
    `);
 
    // --- Core Blocking Logic ---
    function isCurrentPageAlwaysBlocked() {
        return alwaysBlockedPages.has(window.location.href);
    }
 
    // Determines if chat/sendbird assets should be blocked for the given requestUrl
    function shouldBlockUrl(requestUrl) {
        const pageIsAlwaysBlocked = isCurrentPageAlwaysBlocked();
        const effectiveBlockingActive = isBlockingEnabled || pageIsAlwaysBlocked;
 
        if (!effectiveBlockingActive) {
            return false; // Neither global nor page-specific override says block
        }
 
        // If blocking is active (globally or for this page), check patterns
        if (requestUrl && typeof requestUrl === 'string') {
            for (const pattern of CHAT_URL_PATTERNS_TO_BLOCK) {
                if (pattern.test(requestUrl)) {
                    log(`Blocking request to ${requestUrl} by pattern ${pattern} (Global: ${isBlockingEnabled}, PageAlwaysBlocked: ${pageIsAlwaysBlocked})`);
                    return true;
                }
            }
            // Fallback keyword check
            if (requestUrl.includes('chat') || requestUrl.includes('sendbird')) {
                if (!CHAT_URL_PATTERNS_TO_BLOCK.some(p => p.test(requestUrl))) { // Log only if not caught by a specific pattern
                    log(`Blocking request to ${requestUrl} by keyword fallback (Global: ${isBlockingEnabled}, PageAlwaysBlocked: ${pageIsAlwaysBlocked})`);
                }
                return true;
            }
        }
        return false;
    }
 
    // Determines if DOM elements related to chat should be hidden on the current page
    function pageShouldHaveElementsHidden() {
        return isBlockingEnabled || isCurrentPageAlwaysBlocked();
    }
 
    // --- Request Interception ---
    const originalFetch = unsafeWindow.fetch;
    const originalXHRopen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalWebSocket = unsafeWindow.WebSocket;
 
    unsafeWindow.fetch = function(...args) {
        const requestInfo = args[0];
        const url = (typeof requestInfo === 'string') ? requestInfo : requestInfo.url;
        if (shouldBlockUrl(url)) {
            log(`Blocking fetch request to ${url}`);
            return Promise.reject(new Error(`Torn Chat Blocker: Request to ${url} blocked`));
        }
        return originalFetch.apply(unsafeWindow, args);
    };
 
    unsafeWindow.XMLHttpRequest.prototype.open = function(...args) {
        const method = args[0];
        const url = args[1];
        if (shouldBlockUrl(url)) {
            log(`Preparing to block XHR ${method} request to ${url}`);
            this._blockedUrl = url;
            this._isBlockedByScript = true;
        } else {
            this._isBlockedByScript = false;
        }
        return originalXHRopen.apply(this, args);
    };
 
    const originalXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;
    unsafeWindow.XMLHttpRequest.prototype.send = function(...args) {
        if (this._isBlockedByScript && this._blockedUrl) {
            log(`Preventing XHR send for ${this._blockedUrl}`);
            const xhrInstance = this;
            setTimeout(() => {
                const errorEvent = new ProgressEvent('error');
                if (typeof xhrInstance.onerror === 'function') xhrInstance.onerror(errorEvent);
                if (typeof xhrInstance.onloadend === 'function') xhrInstance.onloadend(errorEvent);
                try {
                    xhrInstance.dispatchEvent(new Event('error'));
                    xhrInstance.dispatchEvent(new Event('loadend'));
                } catch (e) {
                    warn('Error dispatching events on blocked XHR:', e);
                }
            }, 10);
            return;
        }
        return originalXHRSend.apply(this, args);
    };
 
    unsafeWindow.WebSocket = function(url, protocols) {
        if (shouldBlockUrl(url)) {
            log('Blocking WebSocket connection to', url);
            const fakeWS = {
                url: url, protocol: protocols && protocols.length > 0 ? protocols[0] : '',
                readyState: 3, bufferedAmount: 0, extensions: '', binaryType: 'blob',
                CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3,
                send: function() { log('Fake WebSocket: send called on blocked WS'); return false; },
                close: function(code, reason) {
                    log('Fake WebSocket: close called on blocked WS', code, reason);
                    this.readyState = this.CLOSING;
                    setTimeout(() => {
                        this.readyState = this.CLOSED;
                        const closeEvent = new CloseEvent('close', { code: code || 1006, reason: reason || "Connection blocked", wasClean: false });
                        if (typeof this.onclose === 'function') this.onclose(closeEvent);
                        try { this.dispatchEvent(closeEvent); } catch(e) {warn('Error dispatching close on fake WS', e);}
                    }, 0);
                },
                onopen: null, onclose: null, onerror: null, onmessage: null,
                _listeners: {},
                addEventListener: function(type, listener) {
                    if (!this._listeners[type]) this._listeners[type] = [];
                    this._listeners[type].push(listener);
                },
                removeEventListener: function(type, listener) {
                    if (!this._listeners[type]) return;
                    this._listeners[type] = this._listeners[type].filter(l => l !== listener);
                },
                dispatchEvent: function(event) {
                    if (!this._listeners[event.type]) return true;
                    this._listeners[event.type].forEach(cb => (typeof cb === 'function' ? cb.call(this, event) : cb.handleEvent(event)));
                    return !event.defaultPrevented;
                }
            };
            setTimeout(() => {
                const errorEvent = new Event('error');
                if (typeof fakeWS.onerror === 'function') fakeWS.onerror(errorEvent);
                try { fakeWS.dispatchEvent(errorEvent); } catch(e) {warn('Error dispatching error on fake WS', e);}
                const closeEvent = new CloseEvent('close', { code: 1006, reason: "WebSocket blocked by script", wasClean: false });
                if (typeof fakeWS.onclose === 'function') fakeWS.onclose(closeEvent);
                try { fakeWS.dispatchEvent(closeEvent); } catch(e) {warn('Error dispatching close on fake WS', e);}
                fakeWS.readyState = fakeWS.CLOSED;
            }, 5);
            return fakeWS;
        }
        const wsInstance = new originalWebSocket(url, protocols);
        return wsInstance;
    };
    // Ensure prototype and static constants are correctly set up if needed by Torn's code
    if (originalWebSocket) {
        unsafeWindow.WebSocket.prototype = originalWebSocket.prototype;
        unsafeWindow.WebSocket.CONNECTING = originalWebSocket.CONNECTING;
        unsafeWindow.WebSocket.OPEN = originalWebSocket.OPEN;
        unsafeWindow.WebSocket.CLOSING = originalWebSocket.CLOSING;
        unsafeWindow.WebSocket.CLOSED = originalWebSocket.CLOSED;
    }
 
 
    // --- UI Toggle Button ---
    function updateToggleButton() {
        const button = document.getElementById(TOGGLE_BUTTON_ID);
        if (!button) return;
 
        button.classList.remove('blocking-on', 'blocking-off', 'blocking-always');
        let ariaLabel = '';
 
        if (isCurrentPageAlwaysBlocked()) {
            button.classList.add('blocking-always'); // Orange
            ariaLabel = 'Page Always Blocked. Click to remove from always-block list.';
            button.setAttribute('aria-checked', 'true'); // Visually "on"
        } else if (isBlockingEnabled) {
            button.classList.add('blocking-on'); // Green
            ariaLabel = 'Global Chat Blocking: ON. Click to turn OFF. Long press to always-block this page.';
            button.setAttribute('aria-checked', 'true');
        } else {
            button.classList.add('blocking-off'); // Red
            ariaLabel = 'Global Chat Blocking: OFF. Click to turn ON. Long press to always-block this page.';
            button.setAttribute('aria-checked', 'false');
        }
        button.setAttribute('aria-label', ariaLabel);
        button.setAttribute('role', 'switch');
    }
 
    function showNotification(message, backgroundColor) {
        const notification = document.createElement('div');
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: backgroundColor, color: 'white',
            padding: '10px 20px', borderRadius: '5px', zIndex: '10000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3500);
    }
 
    function addToggleButton() {
        if (document.getElementById(TOGGLE_BUTTON_ID)) return;
        const button = document.createElement('button');
        button.id = TOGGLE_BUTTON_ID;
 
        const handleLongPress = () => {
            isLongPressFlag = true; // Set flag
            const currentPageUrl = window.location.href;
            if (!alwaysBlockedPages.has(currentPageUrl)) {
                alwaysBlockedPages.add(currentPageUrl);
                localStorage.setItem(LOCAL_STORAGE_KEY_ALWAYS_BLOCK_PAGES, JSON.stringify(Array.from(alwaysBlockedPages)));
                log(`Long press: Added ${currentPageUrl} to always-block list.`);
                showNotification(`Page added to always-block list. Refresh for full effect.`, '#FFA500'); // Orange notification
                updateToggleButton();
                if (pageShouldHaveElementsHidden()) { // Check if blocking should now be active
                    blockChatElementsInDOM(); // Ensure DOM observer is active
                }
            } else {
                log(`Long press: ${currentPageUrl} is already always-blocked.`);
                // Optional: showNotification(`${currentPageUrl} is already always-blocked.`, '#FFA500');
            }
        };
 
        const clearLongPressTimer = () => {
            if (longPressTimer) clearTimeout(longPressTimer);
            longPressTimer = null;
        };
 
        // Mouse events
        button.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only left click
            isLongPressFlag = false; // Reset flag
            clearLongPressTimer();
            longPressTimer = setTimeout(handleLongPress, LONG_PRESS_DURATION);
        });
        button.addEventListener('mouseup', (e) => {
            if (e.button !== 0) return;
            clearLongPressTimer();
            // Click event will handle logic if not a long press
        });
        button.addEventListener('mouseleave', clearLongPressTimer);
 
        // Touch events
        button.addEventListener('touchstart', (e) => {
            isLongPressFlag = false; // Reset flag
            clearLongPressTimer();
            longPressTimer = setTimeout(handleLongPress, LONG_PRESS_DURATION);
            // e.preventDefault(); // Could prevent scroll, be cautious
        }, { passive: true }); // Passive if not preventing default
 
        button.addEventListener('touchend', (e) => {
            clearLongPressTimer();
            if (isLongPressFlag) {
                e.preventDefault(); // Prevent click event firing after a long touch
            }
            // Click event will handle logic if not a long press
        });
        button.addEventListener('touchcancel', clearLongPressTimer);
 
 
        button.addEventListener('click', (e) => {
            if (isLongPressFlag) { // If flag is set, it was a long press; reset and ignore click
                isLongPressFlag = false;
                e.stopImmediatePropagation(); // Prevent other click listeners if any
                return;
            }
 
            const currentPageUrl = window.location.href;
            if (isCurrentPageAlwaysBlocked()) {
                // Click on ORANGE switch: Remove from always-block
                alwaysBlockedPages.delete(currentPageUrl);
                localStorage.setItem(LOCAL_STORAGE_KEY_ALWAYS_BLOCK_PAGES, JSON.stringify(Array.from(alwaysBlockedPages)));
                log(`Clicked to unblock always-blocked page: ${currentPageUrl}`);
                showNotification(`Page removed from always-block list. Refresh for full effect.`, isBlockingEnabled ? '#388e3c' : '#d32f2f');
                updateToggleButton();
                if (!pageShouldHaveElementsHidden() && domObserver) {
                    domObserver.disconnect();
                    log('DOM Observer disconnected as page is no longer effectively blocked.');
                }
            } else {
                // Click on GREEN/RED switch: Toggle global blocking
                isBlockingEnabled = !isBlockingEnabled;
                localStorage.setItem(LOCAL_STORAGE_KEY_GLOBAL_BLOCK, isBlockingEnabled.toString());
                log(`Toggled Global Resource Blocking: ${isBlockingEnabled ? 'ON' : 'OFF'}`);
                showNotification(`Global Resource Blocking ${isBlockingEnabled ? 'enabled' : 'disabled'}. Refresh for full effect.`, isBlockingEnabled ? '#388e3c' : '#d32f2f');
                updateToggleButton();
 
                if (pageShouldHaveElementsHidden()) {
                    blockChatElementsInDOM();
                } else {
                    if (domObserver) domObserver.disconnect();
                    log("Global Resource Blocking OFF and page not always-blocked. DOM Observer potentially stopped. Refresh to restore elements.");
                }
            }
        });
 
        if (document.body) {
             document.body.appendChild(button);
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                if (document.body) document.body.appendChild(button);
            });
        }
        updateToggleButton(); // Initialize button state
    }
 
    // --- Debounce Utility ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
 
    // --- Block elements in DOM (Primarily for chat UI) ---
    const chatSelectors = [
        'div[id*="chat"]', 'div[class*="chat"]', 'div[id*="sendbird"]', 'div[class*="sendbird"]',
        'iframe[src*="chat"]', 'iframe[src*="sendbird"]', '#chatRoot', '.chat-box',
        '.chat-container', '.chat-wrapper', '*[id*="chat-"]', '*[class*="chat-"]',
        '*[id*="-chat"]', '*[class*="-chat"]', '*[id*="sendbird-"]', '*[class*="sendbird-"]',
        'div[aria-label*="chat" i]', 'section[aria-label*="chat" i]'
    ];
 
    function hideMatchedElements() {
        if (!pageShouldHaveElementsHidden()) {
             log('DOM element hiding is OFF for this page. Previously hidden elements will remain hidden until refresh.');
             // We don't attempt to unhide, refresh is cleaner.
            return;
        }
        log('Scanning and hiding chat-related DOM elements...');
        chatSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    if (el.id === TOGGLE_BUTTON_ID || el.closest(`#${TOGGLE_BUTTON_ID}`)) return;
                    if (el.style.display !== 'none') {
                        log('Hiding DOM element matching selector:', selector, el);
                        el.style.setProperty('display', 'none', 'important');
                        el.style.setProperty('visibility', 'hidden', 'important');
                        el.style.setProperty('opacity', '0', 'important');
                        el.style.setProperty('pointer-events', 'none', 'important');
                        el.dataset.tornChatBlocked = 'true';
                    }
                });
            } catch (e) {
                warn('Error applying selector:', selector, e.message);
            }
        });
    }
 
    const debouncedHideMatchedElements = debounce(hideMatchedElements, DEBOUNCE_DELAY);
 
    function blockChatElementsInDOM() {
        if (!pageShouldHaveElementsHidden()) {
            if (domObserver) {
                domObserver.disconnect();
                log('DOM Observer disconnected as blocking is not active for this page.');
            }
            return;
        }
        log('Actively scanning/hiding chat DOM elements. Ensuring DOM observer is running.');
        hideMatchedElements(); // Initial scan
 
        if (!domObserver || !domObserver.takeRecords().length) { // Check if observer exists and is active
            domObserver = new MutationObserver((mutations) => {
                if (!pageShouldHaveElementsHidden()) { // Re-check condition within observer callback
                    if (domObserver) domObserver.disconnect();
                    log('DOM Observer disconnected from within callback.');
                    return;
                }
                let needsRescan = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.id === TOGGLE_BUTTON_ID) continue;
                                if (chatSelectors.some(sel => node.matches && node.matches(sel)) ||
                                    (node.querySelector && node.querySelector(chatSelectors.join(',')))) {
                                    needsRescan = true; break;
                                }
                            }
                        }
                    } else if (mutation.type === 'attributes') {
                        if (mutation.target.nodeType === Node.ELEMENT_NODE &&
                            chatSelectors.some(sel => mutation.target.matches && mutation.target.matches(sel))) {
                            needsRescan = true;
                        }
                    }
                    if (needsRescan) break;
                }
                if (needsRescan) {
                    log('DOM mutation detected, queueing re-hide for chat elements.');
                    debouncedHideMatchedElements();
                }
            });
 
            const observeTarget = document.body || document.documentElement;
            if (observeTarget) {
                 domObserver.observe(observeTarget, { childList: true, subtree: true, attributes: true });
                 log('DOM Observer started for chat elements.');
            } else { // Fallback if body not ready, though @run-at document-start + DOMContentLoaded should handle most
                 window.addEventListener('DOMContentLoaded', () => {
                    const target = document.body || document.documentElement;
                    if (target && pageShouldHaveElementsHidden()) { // Check again before observing
                        domObserver.observe(target, { childList: true, subtree: true, attributes: true });
                        log('DOM Observer started after DOMContentLoaded for chat elements.');
                    } else if (!target) {
                        warn("Failed to start DOM Observer: No body or documentElement found post-DOMContentLoaded.");
                    }
                 });
            }
        } else {
            log('DOM Observer already running.');
        }
    }
 
    // --- Initialization ---
    function initialize() {
        log('Initializing Torn Chat Blocker...');
        addToggleButton(); // This will also call updateToggleButton
 
        if (pageShouldHaveElementsHidden()) {
            log('Initial state requires blocking. Activating DOM blocking.');
            blockChatElementsInDOM();
        } else {
            log('Initial state does not require blocking.');
        }
 
        // Attempt to nullify global chat-related variables
        // This runs slightly after script start to catch variables defined by Torn's early scripts
        setTimeout(() => {
            if (pageShouldHaveElementsHidden()) { // Only nuke if blocking is active
                try {
                    const targetVars = ['chat', 'Chat', 'SendBird', 'sendbird', 'sb', '_sendbird', 'SENDBIRD'];
                    targetVars.forEach(v => {
                        if (typeof unsafeWindow[v] !== 'undefined' && unsafeWindow[v] !== null) { // Check if not already null
                            log(`Attempting to nullify unsafeWindow.${v}`);
                            try {
                                Object.defineProperty(unsafeWindow, v, { value: null, writable: false, configurable: false });
                            } catch (e) {
                                warn(`Failed to Object.defineProperty ${v}, falling back to simple null. Error: ${e.message}`);
                                try {
                                    unsafeWindow[v] = null;
                                } catch (e2) {
                                    warn(`Failed to even assign null to unsafeWindow.${v}. Error: ${e2.message}`);
                                }
                            }
                        }
                    });
                } catch (e) {
                    warn('Error while trying to nuke JS variables.', e.message);
                }
            }
        }, 200); // Increased delay slightly
    }
 
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
 
})();