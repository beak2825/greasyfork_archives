// ==UserScript==
// @name         Douyin Danmu Block
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  danmaku remover
// @run-at document-start
// @license MIT
// @author       You
// @match        *://*.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528500/Douyin%20Danmu%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/528500/Douyin%20Danmu%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const blockedUrls = [
        'https://example.com/api/track',
        /.*ads\.google\.com.*/,
        'https://analytics.site.com/data',
        /https:\/\/www-hj\.douyin\.com\/aweme\/v1\/web\/danmaku\/get_v2.*?/,
        /https:\/\/www-hj\.douyin\.com\/aweme\/v1\/web\/comment\/list.*?/
    ];

    // Store the original XMLHttpRequest
    const originalXHR = unsafeWindow.XMLHttpRequest;

    // Override XMLHttpRequest
    unsafeWindow.XMLHttpRequest = class extends originalXHR {
        open(method, url, async, user, password) {
            console.log('XHR intercepted:', method, url);

            // Check if the URL matches any blocked patterns
            const isBlocked = blockedUrls.some(pattern => {
                if (typeof pattern === 'string') {
                    return url === pattern;
                } else if (pattern instanceof RegExp) {
                    return pattern.test(url);
                }
                return false;
            });

            if (isBlocked) {
                alert("Success")
                console.log('Blocked XHR request to:', url);
                // Do nothing - effectively blocks the request by not calling super.open()
                throw new Error('XHR request blocked by userscript');
            } else {
                // Proceed with the original request
                super.open(method, url, async, user, password);
            }
        }

        // Optional: Block send entirely for blocked requests
        send(body) {
            if (this._blocked) {
                console.log('Send blocked for:', this._url);
                return;
            }
            super.send(body);
        }

        // Store URL for send check
        constructor() {
            super();
            this._blocked = false;
            this._url = null;
        }

        // Override open to set _url
        open(method, url, async, user, password) {
            this._url = url;
            const isBlocked = blockedUrls.some(pattern => {
                if (typeof pattern === 'string') {
                    return url === pattern;
                } else if (pattern instanceof RegExp) {
                    return pattern.test(url);
                }
                return false;
            });

            if (isBlocked) {
                console.log('Blocked XHR request to:', url);
                this._blocked = true;
                throw new Error('XHR request blocked by userscript');
            } else {
                super.open(method, url, async, user, password);
            }
        }
    };

})();