// ==UserScript==
// @name         SoundCloud Disable Like and Repost Keybinds
// @version      1.0
// @description  Completely disables the L and R hotkeys, with the intention of preventing accidental reposts/likes
// @author       bhackel
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-end
// @noframes
// @namespace https://greasyfork.org/en/users/324178-bhackel
// @downloadURL https://update.greasyfork.org/scripts/411728/SoundCloud%20Disable%20Like%20and%20Repost%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/411728/SoundCloud%20Disable%20Like%20and%20Repost%20Keybinds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var onKeyPress = function (e) {
        // Check if the user is typing in a text box, then check for l/r keys
        if (document.activeElement.tagName !== "INPUT" && (e.key === "l" || e.key === "r")) {
            // Block other listeners from doing anything
            e.stopPropagation();
        }
    };

    // Insert the listener above the default onkeydown listener
    window.addEventListener("keydown", onKeyPress, true);

})();