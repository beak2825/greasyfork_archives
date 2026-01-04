// ==UserScript==
// @name         Bypass Redirection on gojo2.xyz
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Bypasses gojo2.xyz validation, auto-reloads the page once, and prevents console clearing
// @author       Sussy Links
// @match        https://gojo2.xyz/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530578/Bypass%20Redirection%20on%20gojo2xyz.user.js
// @updateURL https://update.greasyfork.org/scripts/530578/Bypass%20Redirection%20on%20gojo2xyz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Step 1: Prevent console clearing
    function protectConsole() {
        console.clear = function() {
            console.log('[Gojo2 Bypass]: Blocked console.clear() attempt by the site');
        };
        console.log('[Gojo2 Bypass]: Console protection enabled');
    }

    function log(message) {
        console.log('[Gojo2 Bypass]: ' + message);
    }

    // Step 2: Block content overwrite
    function blockOverwrite() {
        window.writePage = function(code) { log('Blocked writePage with code: ' + code); };
        window.susn = function(code) { log('Blocked susn with code: ' + code); };
        ['updateContent', 'renderPage', 'loadContent'].forEach(fn => {
            if (window[fn]) window[fn] = function() { log(`Blocked ${fn}`); };
        });
    }

    // Step 3: Protect localStorage from being overridden
    function protectLocalStorage() {
        const originalLocalStorage = window.localStorage;
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (obj === window && prop === 'localStorage') {
                log('Blocked attempt to override localStorage via Object.defineProperty');
                return;
            }
            return originalDefineProperty.apply(this, arguments);
        };
        Object.defineProperty(window, 'localStorage', {
            configurable: false,
            writable: false,
            value: originalLocalStorage
        });
        let tamperAttempts = 0;
        const tamperCheckInterval = setInterval(() => {
            try {
                if (window.localStorage !== originalLocalStorage) {
                    tamperAttempts++;
                    log(`Detected localStorage tampering attempt #${tamperAttempts}. Restoring...`);
                    Object.defineProperty(window, 'localStorage', {
                        configurable: false,
                        writable: false,
                        value: originalLocalStorage
                    });
                }
            } catch (e) {
                log('Error while monitoring localStorage: ' + e.message);
            }
        }, 50);
        setTimeout(() => {
            clearInterval(tamperCheckInterval);
            log('Stopped localStorage tamper monitoring');
            Object.defineProperty = originalDefineProperty;
            log('Restored Object.defineProperty');
        }, 5000);
    }

    // Step 4: Fake session with localStorage
    function fakeSession() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = window.location.pathname.match(/\/(\d+)/)?.[1] || '171826';
        const validParams = ['%', '$', 'token', 'key'];
        let v = urlParams.get('v') || urlParams.get('token');

        if (!v || !validParams.includes(v)) {
            v = validParams[0];
            urlParams.set('v', v);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, document.title, newUrl);
            log('Set v parameter to: ' + v);
        }

        try {
            localStorage.setItem('savedSl', v);
            localStorage.setItem('savedSlTime-' + postId, Date.now().toString());
            log('Faked session using localStorage for post ID: ' + postId);
        } catch (e) {
            log('Failed to set localStorage: ' + e.message);
            try {
                sessionStorage.setItem('savedSl', v);
                sessionStorage.setItem('savedSlTime-' + postId, Date.now().toString());
                log('Faked session using sessionStorage for post ID: ' + postId);
            } catch (e) {
                log('Failed to set sessionStorage: ' + e.message);
                log('Both localStorage and sessionStorage are unavailable. Trying cookies...');
                document.cookie = `savedSl=${v}; path=/`;
                document.cookie = `savedSlTime-${postId}=${Date.now()}; path=/`;
                log('Faked session using cookies for post ID: ' + postId);
            }
        }

        try {
            sessionStorage.setItem('videoAuth', Date.now().toString());
            log('Set videoAuth in sessionStorage');
        } catch (e) {
            log('Failed to set videoAuth in sessionStorage: ' + e.message);
            document.cookie = `videoAuth=${Date.now()}; path=/`;
            log('Set videoAuth in cookies');
        }

        try {
            const request = indexedDB.open('Gojo2BypassDB', 1);
            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('session')) {
                    db.createObjectStore('session', { keyPath: 'key' });
                }
            };
            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(['session'], 'readwrite');
                const store = transaction.objectStore('session');
                store.put({ key: 'savedSl', value: v });
                store.put({ key: `savedSlTime-${postId}`, value: Date.now().toString() });
                store.put({ key: 'videoAuth', value: Date.now().toString() });
                log('Faked session using IndexedDB for post ID: ' + postId);
                db.close();
            };
            request.onerror = function(event) {
                log('Failed to use IndexedDB: ' + event.target.error.message);
            };
        } catch (e) {
            log('IndexedDB is not available: ' + e.message);
        }
    }

    // Step 5: Fix layout (remove bottom menu overlap)
    function fixLayout() {
        const bottomMenu = document.querySelector('.wp-bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.position = 'relative';
            bottomMenu.style.zIndex = '1';
            bottomMenu.style.bottom = '0px';
            log('Adjusted bottom menu');
        }
    }

    // Step 6: Handle errors
    function handleErrors() {
        const originalError = window.console.error;
        window.console.error = function(...args) {
            if (args.some(arg => arg.includes('NS_ERROR_UNEXPECTED'))) {
                log('Caught NS_ERROR_UNEXPECTED');
            }
            originalError.apply(console, args);
        };
    }

    // Step 7: Auto-reload once with safety checks
    function autoReload() {
        const urlParams = new URLSearchParams(window.location.search);
        const bypassReload = urlParams.get('bypassReload');
        const currentTime = Date.now();

        // Check if the bypassReload parameter exists and is recent (within 5 seconds)
        if (bypassReload) {
            const reloadTime = parseInt(bypassReload, 10);
            const timeSinceReload = currentTime - reloadTime;
            log(`bypassReload timestamp: ${reloadTime}, time since reload: ${timeSinceReload}ms`);
            if (timeSinceReload < 5000) {
                log('Page has been reloaded recently. Skipping further reloads.');
                return;
            }
        }

        // Check sessionStorage for hasReloaded
        let hasReloaded = false;
        try {
            hasReloaded = sessionStorage.getItem('hasReloaded') === 'true';
            log('hasReloaded value from sessionStorage: ' + hasReloaded);
        } catch (e) {
            log('Failed to read hasReloaded from sessionStorage: ' + e.message);
        }

        if (!hasReloaded) {
            log('Setting hasReloaded to true and scheduling reload...');
            try {
                sessionStorage.setItem('hasReloaded', 'true');
            } catch (e) {
                log('Failed to set hasReloaded in sessionStorage: ' + e.message);
                // Fallback to cookie
                document.cookie = `hasReloaded=true; path=/`;
            }
            setTimeout(() => {
                log('Reloading page now...');
                try {
                    const url = new URL(window.location.href);
                    url.searchParams.set('bypassReload', Date.now());
                    window.location.href = url.toString();
                    log('Reloaded using URL: ' + url.toString());
                } catch (e) {
                    log('window.location.href failed: ' + e.message);
                    window.location.reload(true);
                    log('Fallback to window.location.reload');
                }
            }, 2000);
        } else {
            log('Page already reloaded, proceeding...');
        }
    }

    // Step 8: Force load the video player if missing
    function forceLoadPlayer() {
        let attempts = 0;
        const maxAttempts = 10;
        const checkInterval = setInterval(() => {
            attempts++;
            const playerElements = document.querySelectorAll('.a9XzP4wB');
            if (playerElements.length > 0) {
                log('Found a9XzP4wB elements: ' + playerElements.length);
                playerElements.forEach(element => {
                    const iframe = element.querySelector('iframe');
                    if (iframe && iframe.src) {
                        log('Player iframe found with src: ' + iframe.src);
                    } else {
                        log('Player iframe missing or has no src.');
                    }
                });
                clearInterval(checkInterval);
                // Clear hasReloaded now that the player has loaded
                try {
                    sessionStorage.removeItem('hasReloaded');
                    log('Cleared hasReloaded flag after player loaded');
                } catch (e) {
                    log('Failed to clear hasReloaded from sessionStorage: ' + e.message);
                }
            } else if (attempts >= maxAttempts) {
                log('No a9XzP4wB elements found after ' + maxAttempts + ' attempts. Forcing DOMContentLoaded event...');
                const event = new Event('DOMContentLoaded');
                document.dispatchEvent(event);
                clearInterval(checkInterval);
            } else {
                log('Attempt ' + attempts + ': No a9XzP4wB elements found yet. Retrying...');
            }
        }, 500);
    }

    // Step 9: Monitor and run
    function monitorPage() {
        log('Script version: 1.14 by Sussy Links');
        protectConsole();
        protectLocalStorage();
        blockOverwrite();
        fakeSession();
        handleErrors();
        fixLayout();
        autoReload();
        window.addEventListener('DOMContentLoaded', () => {
            fixLayout();
            forceLoadPlayer();
        });
        log('Current URL: ' + window.location.href);
    }

    monitorPage();
})();
