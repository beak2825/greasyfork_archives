// ==UserScript==
// @name         YouTube Redirect to Channels
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects the YouTube subscription page to the channels page.
// @author       Your Name
// @license      MIT
// @match        https://m.youtube.com/feed/subscriptions*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546883/YouTube%20Redirect%20to%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/546883/YouTube%20Redirect%20to%20Channels.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // This script will now specifically run on the subscriptions page
    // and redirect you to the channels page.
    window.location.replace("https://m.youtube.com/feed/channels");
})();
