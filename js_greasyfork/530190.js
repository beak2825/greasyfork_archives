// ==UserScript==
// @name        Old nexusmods Games UI
// @namespace   Violentmonkey Scripts
// @match       https://www.nexusmods.com/*
// @grant       none
// @version     1.4
// @author      Artyom104
// @description 18.03.2025, 16:15:36
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/530190/Old%20nexusmods%20Games%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/530190/Old%20nexusmods%20Games%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    return; // disable script because it doesn't work any more since nexus devs removed old UI

    const currentUrl = window.location.href;
    const nexusmodsUrl = "https://www.nexusmods.com/";
    const nexusmodsNewGamesUrl = nexusmodsUrl + "games/"

    if (currentUrl.startsWith(nexusmodsNewGamesUrl) && !currentUrl.includes("collections") && !currentUrl.includes("?")) {
        const gameName = currentUrl.substring(nexusmodsNewGamesUrl.length);
        // window.location.href = nexusmodsUrl + gameName;
        window.location.replace(nexusmodsUrl + gameName);
    }
})();