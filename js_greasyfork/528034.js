// ==UserScript==
// @name         10xvb - pre-match -> in-play
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace "pre-match" with "in-play" in the URL without refreshing the page
// @author       Lukáš Malec
// @match        https://www.10xvb.com/en/pre-match/match/*/*/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528034/10xvb%20-%20pre-match%20-%3E%20in-play.user.js
// @updateURL https://update.greasyfork.org/scripts/528034/10xvb%20-%20pre-match%20-%3E%20in-play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aktuální URL
    let currentUrl = window.location.href;

    // Zkontrolujeme, zda obsahuje "pre-match" a nahradíme ho za "in-play"
    let newUrl = currentUrl.replace('/pre-match/', '/in-play/');

    // Pokud je URL odlišná od původní, změníme ji v historii
    if (newUrl !== currentUrl) {
        window.history.replaceState(null, "", newUrl);
    }
})();