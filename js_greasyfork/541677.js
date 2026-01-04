// ==UserScript==
// @name         Clean Affiliate and Tracking from Steam Store Links on SteamDB
// @namespace    https://steamdb.info/
// @version      1.0.1
// @description  Remove affiliate and tracking parameters from Steam store links on SteamDB
// @author       anonynonymous
// @match        https://steamdb.info/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541677/Clean%20Affiliate%20and%20Tracking%20from%20Steam%20Store%20Links%20on%20SteamDB.user.js
// @updateURL https://update.greasyfork.org/scripts/541677/Clean%20Affiliate%20and%20Tracking%20from%20Steam%20Store%20Links%20on%20SteamDB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanSteamLinks() {
        const links = document.querySelectorAll('a[href*="store.steampowered.com/app/"]');

        links.forEach(link => {
            const match = link.href.match(/https:\/\/store\.steampowered\.com\/app\/(\d+)(\/?)/);
            if (match) {
                link.href = `https://store.steampowered.com/app/${match[1]}/`;
            }
        });
    }

    cleanSteamLinks();
    const observer = new MutationObserver(cleanSteamLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();