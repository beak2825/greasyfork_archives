// ==UserScript==
// @name         Emby Premiere Key Hider
// @namespace    https://github.com/madmaximux/userscript-emby_premiere_key_hider
// @author       Madmaximux (https://github.com/madmaximux)
// @description  Adds a persistent Show/Hide button for Emby Premiere key
// @license      MIT
// @version      1.0
// @match        *://*/web/index.html*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531636/Emby%20Premiere%20Key%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/531636/Emby%20Premiere%20Key%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function that will keep trying until it succeeds
    function waitForKeyField() {
        console.log("Emby Key Hide: Looking for key field...");

        // Look for the input field using various selectors
        const keyInput = document.querySelector('.txtSupporterKey') ||
                        document.getElementById('embyinput0') ||
                        document.querySelector('input[label*="Emby Premiere key"]');

        if (!keyInput) {
            // If not found, try again in 1 second
            console.log("Emby Key Hide: Field not found, retrying...");
            setTimeout(waitForKeyField, 1000);
            return;
        }

        console.log("Emby Key Hide: Found key field, adding button...");

        // Check if we've already processed this input
        if (keyInput.getAttribute('data-key-hide-processed')) {
            return;
        }

        // Mark as processed
        keyInput.setAttribute('data-key-hide-processed', 'true');

        // Set to password type
        keyInput.type = 'password';

        // Create a wrapper div with flex layout
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.width = '100%';
        wrapper.style.marginBottom = '10px';
        wrapper.className = 'emby-key-wrapper';

        // Replace input with our wrapper
        keyInput.parentNode.insertBefore(wrapper, keyInput);
        wrapper.appendChild(keyInput);

        // Style the input
        keyInput.style.flex = '1';

        // Create our toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Show/Hide';
        toggleBtn.className = 'emby-button';
        toggleBtn.style.marginLeft = '10px';
        toggleBtn.style.minWidth = '90px';
        toggleBtn.style.height = '35px';

        // Add the button to our wrapper
        wrapper.appendChild(toggleBtn);

        // Add toggle functionality
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
        });

        console.log("Emby Key Hide: Button added successfully!");
    }

    // Start looking for the field
    waitForKeyField();

    // Also watch for DOM changes in case the form loads later
    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                waitForKeyField();
                break;
            }
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
