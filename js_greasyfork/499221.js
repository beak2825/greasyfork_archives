// ==UserScript==
// @name         K런 광고차단 스크립트
// @namespace    http://tampermonkey.net/
// @version      5.31
// @description  K런 광고차단
// @author       ROACH
// @match        *://klauncher.kr/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499221/K%EB%9F%B0%20%EA%B4%91%EA%B3%A0%EC%B0%A8%EB%8B%A8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/499221/K%EB%9F%B0%20%EA%B4%91%EA%B3%A0%EC%B0%A8%EB%8B%A8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to block URL containing ad-related keywords
    const blockAdUrls = function(url) {
        return /adsbygoogle|doubleclick|googletagservices|adblock/.test(url);
    };

    // 광고 차단 감지 무력화
    const disableAdBlockDetection = function() {
        // MutationObserver for removing ad-related scripts and divs
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'SCRIPT' && blockAdUrls(node.src)) {
                        node.remove();
                    }
                    if (node.tagName === 'DIV' && node.className.includes('adblock')) {
                        node.style.display = 'none';
                    }
                });
            });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });

        // adBlockEnabled property neutralization
        Object.defineProperty(window, 'adBlockEnabled', { value: false, writable: false });
        window.detectAdBlock = function(callback) {
            callback(false);
        };

        // Override fetch method
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            if (args[0] && typeof args[0] === 'string' && blockAdUrls(args[0])) {
                return new Promise((resolve) => {
                    resolve(new Response('', { status: 200 }));
                });
            }
            return originalFetch.apply(this, args);
        };

        // Override XMLHttpRequest open method
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url && typeof url === 'string' && blockAdUrls(url)) {
                return;
            }
            return originalXhrOpen.apply(this, arguments);
        };
    };

    // 광고 차단 감지 페이지 리디렉션 무력화
    const disableAdBlockRedirection = function() {
        const checkUrl = function(url) {
            return !url.includes('adblock_detected=1');
        };

        // Override history methods
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            if (checkUrl(args[2])) {
                return originalPushState.apply(this, args);
            }
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            if (checkUrl(args[2])) {
                return originalReplaceState.apply(this, args);
            }
        };

        // Override location methods
        const originalAssign = window.location.assign;
        window.location.assign = function(url) {
            if (checkUrl(url)) {
                return originalAssign.call(window.location, url);
            }
        };

        const originalReplace = window.location.replace;
        window.location.replace = function(url) {
            if (checkUrl(url)) {
                return originalReplace.call(window.location, url);
            }
        };

        // Override location.href descriptor
        const originalHrefDescriptor = Object.getOwnPropertyDescriptor(window.location, 'href');
        Object.defineProperty(window.location, 'href', {
            set: function(url) {
                if (checkUrl(url)) {
                    originalHrefDescriptor.set.call(this, url);
                }
            },
            get: function() {
                return originalHrefDescriptor.get.call(this);
            }
        });

        // Override window.location descriptor
        const originalLocationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
        Object.defineProperty(window, 'location', {
            set: function(url) {
                if (checkUrl(url)) {
                    originalLocationDescriptor.set.call(this, url);
                }
            },
            get: function() {
                return originalLocationDescriptor.get.call(this);
            }
        });

        // Initial check to remove adblock detection query parameter
        if (window.location.href.includes('adblock_detected=1')) {
            history.replaceState(null, '', window.location.pathname + window.location.search.replace(/(\?|&)adblock_detected=1/, ''));
        }

        // Additional checks to block immediate redirection attempts
        const blockImmediateRedirection = function(func) {
            return function(...args) {
                if (typeof args[0] === 'string' && args[0].includes('adblock_detected=1')) {
                    return;
                }
                return func.apply(this, args);
            };
        };

        // Override setTimeout, setInterval, requestAnimationFrame
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = blockImmediateRedirection(originalSetTimeout);

        const originalSetInterval = window.setInterval;
        window.setInterval = blockImmediateRedirection(originalSetInterval);

        const originalRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = blockImmediateRedirection(originalRequestAnimationFrame);
    };

    // DevTools 감지 무력화
    const disableDevToolDetection = function() {
        const noop = function() {};
        Object.defineProperty(document, 'hidden', { get: () => false });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
        window.addEventListener('devtoolschange', noop, true);

        const originalConsoleLog = console.log;
        console.log = function(...args) {
            if (args.length === 1 && typeof args[0] === 'string' && args[0].includes('disable-devtool')) {
                return;
            }
            return originalConsoleLog.apply(this, args);
        };

        window.addEventListener('devtools-detect', noop, true);
        setInterval(noop, 1000);
    };

    // 단축키 차단 무력화
    const disableShortcutKeyDetection = function() {
        window.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c')) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }, true);
    };

    // 마우스 우클릭 차단 무력화
    const disableContextMenu = function() {
        window.addEventListener('contextmenu', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }, true);
    };

    // 모든 무력화 함수 적용
    disableAdBlockDetection();
    disableAdBlockRedirection();
    disableDevToolDetection();
    disableShortcutKeyDetection();
    disableContextMenu();
})();
