// ==UserScript==
// @name         Slightly Better YouTube Music
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Minor improvements to YouTube Music
// @author       You
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532439/Slightly%20Better%20YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/532439/Slightly%20Better%20YouTube%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Better Youtube Music] improving stuff...");

    const styles = [
        // Show likes while multi-select is enabled
        "ytmusic-responsive-list-item-renderer[is-multi-select-mode] .menu.ytmusic-responsive-list-item-renderer { visibility: initial; }",

        // Add extra spacing around songs in the queue
        "ytmusic-player-queue-item { padding: 8px 8px; }",
    ];

    GM_addStyle(styles.join(" "));

    console.log("[Better Youtube Music] done");
})();