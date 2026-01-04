// ==UserScript==
// @name         Bing User Agent Switcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the user agent on bing to Edge for Mac
// @author       You
// @match        *://*bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464770/Bing%20User%20Agent%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/464770/Bing%20User%20Agent%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(navigator, 'userAgent', {
        get: function () { return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59'; }
    });
})();