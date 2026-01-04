// ==UserScript==
// @name         Block API and Add to LocalStorage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block requests to api.lemonsquezy.com and add "ok"{"yes"} to localStorage
// @author       You
// @match        https://chrome-extension://iaakpnchhognanibcahlpcplchdfmgma/app.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489262/Block%20API%20and%20Add%20to%20LocalStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/489262/Block%20API%20and%20Add%20to%20LocalStorage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block requests to api.lemonsquezy.com
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.includes('api.lemonsquezy.com')) {
            console.log('Blocked request to api.lemonsquezy.com:', url);
            return Promise.reject('Blocked');
        }
        return originalFetch.apply(this, arguments);
    };

    // Add "ok"{"yes"} to localStorage
    localStorage.setItem('premium', '{"licence":"nobody","instance":"t"}');
})();
