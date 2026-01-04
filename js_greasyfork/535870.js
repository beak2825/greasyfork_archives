// ==UserScript==
// @name                 Facebook Anti-Refresh
// @namespace            CustomScripts
// @description          Prevents Facebook from auto-refreshing the news feed
// @author               areen-c
// @match                *://*.facebook.com/*
// @version              1.2
// @license              MIT
// @homepage             https://github.com/areen-c
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @run-at               document-start
// @grant                none
// @downloadURL https://update.greasyfork.org/scripts/535870/Facebook%20Anti-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/535870/Facebook%20Anti-Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[FB Anti-Refresh] Starting...');

    try {
        Object.defineProperty(document, 'hidden', {
            configurable: true,
            get: () => false
        });

        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            get: () => 'visible'
        });

        const originalHasFocus = document.hasFocus;
        document.hasFocus = () => true;

        console.log('[FB Anti-Refresh] Visibility API overridden');
    } catch (e) {
        console.warn('[FB Anti-Refresh] Could not override visibility API:', e);
    }

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange' ||
            type === 'webkitvisibilitychange' ||
            type === 'mozvisibilitychange') {
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    try {
        Object.defineProperty(window, 'onblur', {
            configurable: true,
            get: () => null,
            set: () => {}
        });

        Object.defineProperty(window, 'onfocus', {
            configurable: true,
            get: () => null,
            set: () => {}
        });
    } catch (e) {
        console.warn('[FB Anti-Refresh] Could not override window focus events:', e);
    }

    const lastActivity = { time: Date.now() };

    ['click', 'scroll', 'keypress'].forEach(event => {
        document.addEventListener(event, () => {
            lastActivity.time = Date.now();
        }, { passive: true, capture: true });
    });

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url] = args;

        if (typeof url === 'string' && url.includes('facebook.com')) {
            const refreshEndpoints = [
                '/ajax/home/generic.php',
                '/ajax/pagelet/generic.php/HomeStream',
                '/ajax/ticker_stream.php'
            ];

            const isRefreshRequest = refreshEndpoints.some(endpoint =>
                url.includes(endpoint)
            );

            if (isRefreshRequest) {
                const timeSinceActivity = Date.now() - lastActivity.time;

                if (timeSinceActivity > 60000) {
                    console.log('[FB Anti-Refresh] Blocked refresh request');
                    return Promise.resolve(new Response('{}', {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
            }
        }

        return originalFetch.apply(this, args);
    };

    const removeMetaRefresh = () => {
        const metaTags = document.querySelectorAll('meta[http-equiv="refresh"]');
        metaTags.forEach(tag => {
            tag.remove();
            console.log('[FB Anti-Refresh] Removed meta refresh tag');
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeMetaRefresh);
    } else {
        removeMetaRefresh();
    }

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        const timeSinceActivity = Date.now() - lastActivity.time;
        if (timeSinceActivity > 120000) {
            console.log('[FB Anti-Refresh] Blocked history.pushState due to inactivity');
            return;
        }
        return originalPushState.apply(this, args);
    };

    console.log('[FB Anti-Refresh] Protection active');

})();