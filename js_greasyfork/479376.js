// ==UserScript==
// @name         Block YouTube Premium Advertisement
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block Premium Popup
// @author       Prynamiq Beat
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479376/Block%20YouTube%20Premium%20Advertisement.user.js
// @updateURL https://update.greasyfork.org/scripts/479376/Block%20YouTube%20Premium%20Advertisement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for load in
    window.addEventListener('load', function() {
        // Blocking the Element
        var elementToBlock = document.querySelector('tp-yt-paper-dialog[style-target="host"]');

        // Check if deleted
        if (elementToBlock) {
            // Block
            elementToBlock.style.display = 'none';
        }
    });
})();
