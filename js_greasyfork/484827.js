// ==UserScript==
// @name         Legacy to Latest Curseforge Redirect
// @namespace    Violentmonkey Scripts
// @version      0.2
// @description  Replaces legacy CurseForge links with the current ones, excluding specified patterns
// @author       AmeLooksSus
// @match        *://legacy.curseforge.com/minecraft/mc-mods/*
// @exclude      *://legacy.curseforge.com/minecraft/mc-mods/*/relations/dependents*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484827/Legacy%20to%20Latest%20Curseforge%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/484827/Legacy%20to%20Latest%20Curseforge%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentURL = window.location.href;

    // Check if the URL matches the excluded pattern
    if (!currentURL.includes("/relations/dependents")) {
        // Replace legacy URL with the current one
        var newURL = currentURL.replace("legacy.curseforge.com/minecraft/mc-mods/", "curseforge.com/minecraft/mc-mods/");

        // Redirect to the updated URL
        window.location.href = newURL;
    }
})();