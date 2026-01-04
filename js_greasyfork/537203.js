// ==UserScript==
// @name         Open Settings with CTRL + Q
// @namespace    random
// @license      You may share the code, edit it and publish.
// @version      0.1
// @description  Opens settings when CTRL + Q is pressed
// @match        *://starblast.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537203/Open%20Settings%20with%20CTRL%20%2B%20Q.user.js
// @updateURL https://update.greasyfork.org/scripts/537203/Open%20Settings%20with%20CTRL%20%2B%20Q.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to open settings
    function openSettings() {
        const settingsButton = document.querySelector('.sbg.sbg-gears');
        if (settingsButton) {
            settingsButton.click();
        } else {
            console.log('Settings button not found!');
        }
    }

    // Listen for keydown events
    window.addEventListener('keydown', (event) => {
        // Check if CTRL + Q is pressed
        if (event.key === 'q' && event.ctrlKey) {
            openSettings();
        }
    });
})();