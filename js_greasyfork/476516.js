// ==UserScript==
// @name         Heav.io Cracked Screen
// @namespace    https://greasyfork.org/en/users/1185581-studz
// @version      1.0
// @description  Make your screen look cracked in Heav.io
// @author       Studz
// @match        https://heav.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476516/Heavio%20Cracked%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/476516/Heavio%20Cracked%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a cracked screen overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'url("https://example.com/cracked-screen-image.png")'; // Replace with your cracked screen image URL
    overlay.style.zIndex = '9999'; // Ensure it's on top of everything
    overlay.style.pointerEvents = 'none'; // Allow interactions with the underlying page

    // Add the overlay to the document body
    document.body.appendChild(overlay);

    // You can adjust the properties above and the cracked screen image URL to your liking
})();
