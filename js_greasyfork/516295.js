// ==UserScript==
// @name         Twitter to bsky
// @namespace    http://tampermonkey.net/
// @version      2024-11-07
// @description  Redirect the twitter home feed to bluesky
// @author       You
// @match        https://x.com/home
// @match        https://x.com
// @match        https://twitter.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516295/Twitter%20to%20bsky.user.js
// @updateURL https://update.greasyfork.org/scripts/516295/Twitter%20to%20bsky.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = "https://bsky.app/";
})();