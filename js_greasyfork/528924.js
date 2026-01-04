// ==UserScript==
// @name         Disable Reddit Auto-Translation
// @namespace    http://github.com/Starmania
// @version      1.1
// @description  Prevents Reddit from auto-translating subreddit content by removing the 'tl' parameter from the URL.
// @author       Starmania
// @match        https://www.reddit.com/r/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528924/Disable%20Reddit%20Auto-Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/528924/Disable%20Reddit%20Auto-Translation.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const url = new URL(window.location);
    if (url.searchParams.has("tl")) {
        url.searchParams.delete("tl");
        window.location.replace(url.toString());
    }
})();
