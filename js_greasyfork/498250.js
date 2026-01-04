// ==UserScript==
// @name         ip查询封禁
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  欲要访问，必先封禁。
// @author       lbihhe
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/498250/ip%E6%9F%A5%E8%AF%A2%E5%B0%81%E7%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/498250/ip%E6%9F%A5%E8%AF%A2%E5%B0%81%E7%A6%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedKeywords = ["ip", "geoip", "ipify"];

    function shouldBlock(url) {
        return blockedKeywords.some(keyword => url.includes(keyword));
    }

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (shouldBlock(url)) {
            console.log(`Blocked XMLHttpRequest to: ${url}`);
            this.abort();
            return;
        }
        return originalXHROpen.apply(this, arguments);
    };

    // Intercept Fetch API
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = (typeof input === 'string') ? input : input.url;
        if (shouldBlock(url)) {
            console.log(`Blocked fetch request to: ${url}`);
            return Promise.resolve(new Response(null, {status: 403, statusText: 'Forbidden'}));
        }
        return originalFetch.apply(this, arguments);
    };

    // Intercept script elements to block external scripts
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName) {
                    const tagName = node.tagName.toLowerCase();
                    if ((tagName === 'script' || tagName === 'iframe') && node.src && shouldBlock(node.src)) {
                        console.log(`Blocked ${tagName} loading from: ${node.src}`);
                        node.parentElement.removeChild(node);
                    }
                }
            });
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Intercept dynamically created elements
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName, options) {
        const element = originalCreateElement.call(document, tagName, options);
        if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'iframe') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'src' && shouldBlock(value)) {
                    console.log(`Blocked ${tagName} setting src to: ${value}`);
                    return;
                }
                originalSetAttribute.apply(this, arguments);
            };
        }
        return element;
    };

    // Intercept fetch using Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(URL.createObjectURL(new Blob([`
            self.addEventListener('fetch', event => {
                const url = new URL(event.request.url);
                if (${JSON.stringify(blockedKeywords)}.some(keyword => url.href.includes(keyword))) {
                    console.log('Blocked fetch request to:', url.href);
                    event.respondWith(new Response(null, {status: 403, statusText: 'Forbidden'}));
                }
            });
        `], {type: 'application/javascript'}))).then(function(registration) {
            console.log('Service Worker registered for blocking requests');
        }).catch(function(error) {
            console.error('Service Worker registration failed:', error);
        });
    }
})();
