// ==UserScript==
// @name         Okjike Mobile to Web Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect from mobile okjike page to web version
// @author       You
// @match        https://m.okjike.com/originalPosts/*
// @grant        none
// @run-at       document-start
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/486634/Okjike%20Mobile%20to%20Web%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/486634/Okjike%20Mobile%20to%20Web%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the URL is available
    var checkUrl = setInterval(function() {
        if (window.location.href) {
            clearInterval(checkUrl);
            var oldUrl = window.location.href;
            var postId = oldUrl.split('/')[4]; // Extracts the post ID
            var newUrl = "https://web.okjike.com/originalPost/" + postId;
            window.location.replace(newUrl); // Redirects to the web version
        }
    }, 10); // Check every 10ms
})();