// ==UserScript==
// @name         EasyScore → Boxscore Redirect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Přesměruje nebo přepíše odkazy z gamecast.aspx na boxscore.aspx
// @match        https://www.easyscore.com/live/*
// @match        https://live.easyscore.com/live/gamecast.aspx*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547091/EasyScore%20%E2%86%92%20Boxscore%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/547091/EasyScore%20%E2%86%92%20Boxscore%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Přímé přesměrování z gamecast.aspx ---
    if (location.pathname.endsWith("/gamecast.aspx")) {
        const params = new URLSearchParams(location.search);
        const gameID = params.get("GameID");
        if (gameID) {
            location.replace(`https://live.easyscore.com/live/boxscore.aspx?GameID=${gameID}`);
        }
        return; // Nepokračuj dál
    }

    // --- 2. Přepsání odkazů na hlavní stránce /live/ ---
    function updateLinks() {
        document.querySelectorAll('a[href*="gamecast.aspx?GameID="]').forEach(a => {
            a.href = a.href.replace('gamecast.aspx', 'boxscore.aspx');
        });
    }

    updateLinks();

    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
