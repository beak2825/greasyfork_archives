// ==UserScript==
// @name         Personal YouTube Music Script
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Mods to YouTube Music
// @author       You
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541930/Personal%20YouTube%20Music%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/541930/Personal%20YouTube%20Music%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[YTM for Andrew] improving stuff...");

    const styles = [
        // Only allow 7 sections in any feed
        "ytmusic-carousel-shelf-renderer:nth-child(n+8) { visibility: hidden; }" ,
    ];

    GM_addStyle(styles.join(" "));

    console.log("[YTM for Andrew] done");
})();
