// ==UserScript==
// @name         Fix glitched Roblox versions
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  Fix glitched Roblox versions and disable Roblox desktop app. [Original by BabyHamsta]
// @author       BabyHamsta, [EDITED]
// @match        *://*.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/452689/Fix%20glitched%20Roblox%20versions.user.js
// @updateURL https://update.greasyfork.org/scripts/452689/Fix%20glitched%20Roblox%20versions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for load
    window.addEventListener('load', function() {
        // Attempt to set channel
        try {
            Roblox.ProtocolHandlerClientInterface.playerChannel = '';
            Roblox.ProtocolHandlerClientInterface.isDuarAutoOptInEnabled = false
            Roblox.ProtocolHandlerClientInterface.isDuarOptOutDisabled = false
            console.warn("Adjusted channel to default.");
        } catch (exception) {
            console.warn("There was an error trying to set the channel.");
            console.error(exception);
        }
    }, false);
})();