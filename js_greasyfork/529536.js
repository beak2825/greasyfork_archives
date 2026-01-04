// ==UserScript==
// @name         Block Spells & Movements
// @namespace    http://example.com
// @version      1.0
// @description  Disables the use of spells on towns and movement commands by unbinding the buttons from the backend.
// @author       Egelman
// @match        https://*.grepolis.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529536/Block%20Spells%20%20Movements.user.js
// @updateURL https://update.greasyfork.org/scripts/529536/Block%20Spells%20%20Movements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    const selectors = [
        'div.animated_power_icon'
    ];

    // Function that unbinds events from all matched elements.
    function unbindButtons() {
        const elements = document.querySelectorAll(selectors);
        elements.forEach(el => {
            // Remove inline click handler, if any.
            el.onclick = null;
            // If jQuery is loaded, remove jQuery-bound events.
            if (window.jQuery) {
                jQuery(el).off();
            }
        });
    }

    // Prevent any further clicks on these elements from triggering their normal action.
    document.addEventListener('click', function(event) {
        if (event.target.closest(selectors)) {
            console.log('Blocked a spell or movement action.');
            event.stopPropagation();
            event.preventDefault();
        }
    }, true);

    // Initially unbind the buttons.
    unbindButtons();

    // Use a MutationObserver to check for newly added elements (dynamic content)
    // and unbind them as well.
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                unbindButtons();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();