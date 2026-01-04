// ==UserScript==
// @name         YouTube Drop Quality Settings For Shorts
// @namespace    https://greasyfork.org/en/users/1413127-tumoxep
// @version      1.0
// @description  I usually listen music on YT in 144p to preserve traffic. But when I'm switching to Shorts I'm unable to change quality settings (in desktop Chrome). This script clears quality setting
// @license      WTFPL
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525055/YouTube%20Drop%20Quality%20Settings%20For%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/525055/YouTube%20Drop%20Quality%20Settings%20For%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(function(mutations) {
        if (!localStorage.getItem("yt-player-quality")) {
            return;
        }
        if (location.href.includes("/shorts/")) {
            localStorage.removeItem("yt-player-quality");
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
})();
