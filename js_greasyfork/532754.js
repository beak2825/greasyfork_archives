// ==UserScript==
// @name         No Game Trailers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove all YouTube embeds on Roblox games.
// @author       You
// @match        *://*.roblox.com/games*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532754/No%20Game%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/532754/No%20Game%20Trailers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Look for yt embed and remove it
    function removeYouTubeEmbeds() {
        const embeds = document.querySelectorAll('iframe[src*="youtube-nocookie.com/embed"]');
        embeds.forEach(embed => {
            embed.remove();
        });
    }

    removeYouTubeEmbeds();

    // wait incase more appear
    const observer = new MutationObserver(removeYouTubeEmbeds);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
