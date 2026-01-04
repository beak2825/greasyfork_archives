// ==UserScript==
// @name         Force nsfw on reddit
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Disables the NSFW gate on reddit.
// @author       rob1
// @match        *://*.reddit.com/*
// @match        *://reddit.com/*
// @run-at       document-start
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/533246/Force%20nsfw%20on%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/533246/Force%20nsfw%20on%20reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.cookie = "over18=1; path=/; domain=.reddit.com";

    const originalFetch = window.fetch;
    window.fetch = function(input, init = {}) {
        init.credentials = 'include';
        return originalFetch(input, init);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
        this.withCredentials = true;
        return originalXHROpen.apply(this, args);
    };
})();
