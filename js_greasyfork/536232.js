// ==UserScript==
// @name         Grok Dev Tools
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enables the Dev Tools menu in settings on grok.com
// @author       Blankspeaker
// @match        https://grok.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536232/Grok%20Dev%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/536232/Grok%20Dev%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        // Check localStorage availability
        let localStorageAvailable = true;
        try {
            localStorage.setItem("test", "test");
            localStorage.removeItem("test");
        } catch (error) {
            localStorageAvailable = false;
            console.warn("localStorage is restricted:", error);
        }

        // Get current flags or initialize
        let rawFlags = localStorageAvailable ? localStorage.getItem("local_feature_flags") : null;
        let currentFlags = rawFlags ? JSON.parse(rawFlags) : {};

        // Set SHOW_MODEL_CONFIG_OVERRIDE flag
        currentFlags['SHOW_MODEL_CONFIG_OVERRIDE'] = true;

        // Save updated flags
        if (localStorageAvailable) {
            localStorage.setItem("local_feature_flags", JSON.stringify(currentFlags));
            console.log("SHOW_MODEL_CONFIG_OVERRIDE enabled and saved.");
        } else {
            console.warn("SHOW_MODEL_CONFIG_OVERRIDE set in memory due to localStorage restrictions.");
        }
    } catch (error) {
        console.error("Error setting SHOW_MODEL_CONFIG_OVERRIDE:", error);
    }
})();