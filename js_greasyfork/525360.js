// ==UserScript==
// @name         Twitter (X) Sort By Likes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces Twitter (X) to sort by likes instead of relevancy
// @author       colleidoscope
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525360/Twitter%20%28X%29%20Sort%20By%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/525360/Twitter%20%28X%29%20Sort%20By%20Likes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a proxy for XMLHttpRequest
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    // Override the open method
    XHR.open = function(method, url) {
        // Check if this is a TweetDetail request
        if (url.includes('/TweetDetail?')) {
            // Convert URL to URLSearchParams for easier manipulation
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);

            // Parse the variables parameter
            const variables = JSON.parse(decodeURIComponent(params.get('variables')));

            // Modify the ranking mode to "Likes"
            variables.rankingMode = "Likes";

            // Update the URL with modified parameters
            params.set('variables', JSON.stringify(variables));
            url = `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
        }

        // Call the original open method
        return open.apply(this, [method, url]);
    };

    // Override the send method
    XHR.send = function() {
        return send.apply(this, arguments);
    };
})();