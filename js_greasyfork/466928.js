// ==UserScript==
// @name         Fotbal - Finsko ofiko
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automaticky přesměruje do správné live url pro přidávání
// @author       Jarda Kořínek
// @match        https://tulospalvelu.palloliitto.fi/category/*/fixture
// @match        https://tulospalvelu.palloliitto.fi/livescore/today/all?category=football%7Cspl%7CM2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=palloliitto.fi
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466928/Fotbal%20-%20Finsko%20ofiko.user.js
// @updateURL https://update.greasyfork.org/scripts/466928/Fotbal%20-%20Finsko%20ofiko.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval( () => {
    if (location.href.includes("lineups")) {
        const newUrl = location.href.replace("lineups", "stats");

    history.pushState(null, "", newUrl);
    } }, 2000)
})();