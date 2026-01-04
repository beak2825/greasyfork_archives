// ==UserScript==
// @name         Torn Start Fight with Spacebar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Press the spacebar to start a fight in Torn (English UI only)
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539087/Torn%20Start%20Fight%20with%20Spacebar.user.js
// @updateURL https://update.greasyfork.org/scripts/539087/Torn%20Start%20Fight%20with%20Spacebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        // Ignore key presses in input fields or dropdowns
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        // Only act on spacebar key
        if (event.code !== 'Space') return;

        // Find the "Start fight" button with exact English text
        const startBtn = [...document.querySelectorAll('button.torn-btn')].find(btn =>
            btn.textContent.trim().includes('Start fight') && !btn.disabled
        );

        // Click the button if found
        if (startBtn) {
            event.preventDefault();
            startBtn.click();
            startBtn.disabled = true; // prevent repeated clicks
            console.log('✅ Fight started using spacebar');
        }
    });
})();