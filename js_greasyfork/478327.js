// ==UserScript==
// @name         Francie - Házená
// @namespace    https://www.example.com/
// @version      1.1
// @description  Přepíše URL aby chodila minutáž
// @author       Michal
// @match        https://www.vision-sport.fr/lives/live.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478327/Francie%20-%20H%C3%A1zen%C3%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/478327/Francie%20-%20H%C3%A1zen%C3%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;

    if (currentURL.indexOf('allstats=') === -1) {
        var newURL = currentURL;
        if (currentURL.indexOf('?') === -1) {
            newURL += '?allstats=1';
        } else {
            newURL += '&allstats=1';
        }
        window.history.replaceState({}, document.title, newURL);
    }
})();