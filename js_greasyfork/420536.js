// ==UserScript==
// @name         Open Spotify links in Desktop app
// @namespace    https://greasyfork.org/ru/scripts/420536-open-spotify-links-in-desktop-app
// @version      1.2
// @description  Include closing new spotify tab in browser
// @author       Sundear
// @match        https://open.spotify.com/*
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/420536/Open%20Spotify%20links%20in%20Desktop%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/420536/Open%20Spotify%20links%20in%20Desktop%20app.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/track|playlist|album|artist|show|episode/gm.exec(window.location) !== null) {
        const meta = document.querySelector("meta[property='al:android:url']")
        if (meta) {
            const link = meta.getAttribute('content');
            if (link) {
                window.location.replace(link);
                window.close();
            }
        }
    }
})();