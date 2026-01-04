// ==UserScript==
// @name         Chomikuj Move Button Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press M to click the move button on disk-alist's Chomikuj page
// @author       You
// @match        https://chomikuj.pl/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526145/Chomikuj%20Move%20Button%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/526145/Chomikuj%20Move%20Button%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Check if M key is pressed
        if (e.key.toLowerCase() === 'm') {
            // Find and click the move button
            const moveButton = document.querySelector('.moveFilesBtn');
            if (moveButton) {
                moveButton.click();
            }
        }
    });
})();