// ==UserScript==
// @name Rematcher
// @namespace http://tampermonkey.net/
// @version 1.1
// @description Pets
// @author You
// @include /^https?://rdrama\.net/battle*
// @icon https://www.google.com/s2/favicons?sz=64&domain=rdrama.net
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542302/Rematcher.user.js
// @updateURL https://update.greasyfork.org/scripts/542302/Rematcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants for local storage
    const REMATCH_TOGGLE_STATE_KEY = 'rematch_toggle_state';

    // 1. Inject Rematch Toggle UI and Manage State Persistence
    const toggleSfxBtn = document.getElementById('toggle-sfx');

    if (toggleSfxBtn) {
        // HTML for the Bootstrap-style toggle switch
        const rematchToggleHtml = `
            <div class="form-check form-switch d-inline-block ml-3">
                <input class="form-check-input" type="checkbox" role="switch" id="rematchToggle">
                <label class="form-check-label" for="rematchToggle">
                    <i class="fas fa-redo-alt"></i> Rematch
                </label>
            </div>
        `;

        // Insert the toggle switch immediately after the toggle-sfx button.
        toggleSfxBtn.insertAdjacentHTML('afterend', rematchToggleHtml);
        console.log('Rematch toggle added to the UI.');

        // Get the newly injected toggle element
        const rematchToggle = document.getElementById('rematchToggle');

        if (rematchToggle) {
            // Load state from local storage and set the toggle status.
            const savedState = localStorage.getItem(REMATCH_TOGGLE_STATE_KEY);
            // Default to unchecked unless local storage explicitly says 'true'.
            if (savedState !== null) {
                rematchToggle.checked = savedState === 'true';
            }

            // Save state to local storage when the toggle is changed.
            rematchToggle.addEventListener('change', (event) => {
                localStorage.setItem(REMATCH_TOGGLE_STATE_KEY, event.target.checked ? 'true' : 'false');
                console.log(`Rematch toggle state saved: ${event.target.checked}`);
            });
        }
    }

    // 2. Ready Button Logic
    const readyBtn = document.getElementById('ready_btn');

    if (readyBtn) {
        // Function to handle the ready button click
        const scheduleReadyClick = () => {
            // Check if the button is NOT disabled.
            if (!readyBtn.hasAttribute('disabled')) {
                // Random delay between 500ms (0.5s) and 3000ms (3s).
                const randomDelay = Math.floor(Math.random() * (3000 - 500 + 1)) + 500;
                console.log(`Ready button detected, scheduling click in ${randomDelay / 1000} seconds...`);

                setTimeout(() => {
                    readyBtn.click();
                    console.log('Ready button clicked.');
                }, randomDelay);
            } else {
                console.log('Ready button is disabled.');
            }
        };

        // Observe 'ready_btn' for attribute changes (specifically 'disabled').
        const readyObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    scheduleReadyClick();
                }
            }
        });

        readyObserver.observe(readyBtn, { attributes: true });
        scheduleReadyClick(); // Initial check in case the button is ready on load.
        console.log('Monitoring #ready_btn for disabled attribute removal.');
    }

    // 3. Rematch Button Logic
    const rematchBtn = document.getElementById('rematch_btn');
    let clickTimeoutId = null; // Variable to store the timeout ID

    // Check if the button exists before proceeding.
    if (rematchBtn) {
        // Access the rematch toggle element.
        const rematchToggle = document.getElementById('rematchToggle');

        // Function to generate a weighted random delay.
        const getWeightedRandomDelay = () => {
            const rand = Math.random();
            let delay;

            if (rand < 0.80) { // 80% chance for 1-5 seconds
                delay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
                console.log(`Weighted random delay: 1-5s range (${delay / 1000}s)`);
            } else if (rand < 0.80 + 0.15) { // 15% chance for 6-10 seconds
                delay = Math.floor(Math.random() * (10000 - 6000 + 1)) + 6000;
                console.log(`Weighted random delay: 6-10s range (${delay / 1000}s)`);
            } else { // 5% chance for 11-20 seconds
                delay = Math.floor(Math.random() * (20000 - 11000 + 1)) + 11000;
                console.log(`Weighted random delay: 11-20s range (${delay / 1000}s)`);
            }
            return delay;
        };

        // Function to handle the button click with checks.
        const scheduleRematchClick = () => {
            // Clear any existing timeout.
            if (clickTimeoutId) {
                clearTimeout(clickTimeoutId);
                clickTimeoutId = null;
            }

            // Determine if rematch is active based on the toggle state (default to false if toggle element is missing).
            const isRematchActive = rematchToggle ? rematchToggle.checked : false;

            // Check 1: Is the rematch toggle active?
            if (!isRematchActive) {
                console.log('Rematch toggle is off. Not scheduling click.');
                return;
            }

            // Check 2: Is the 'd-none' class NOT present on the button?
            if (!rematchBtn.classList.contains('d-none')) {
                const chatCountElement = document.querySelector('.chat-count');
                let chatCount = 0;

                if (chatCountElement) {
                    chatCount = parseInt(chatCountElement.innerText, 10);
                    if (isNaN(chatCount)) {
                        chatCount = 0;
                    }
                }

                // Check 3: Is the chat count 2 or higher?
                if (chatCount >= 2) {
                    const randomDelay = getWeightedRandomDelay();

                    console.log(`d-none class not found on #rematch_btn and chat count is ${chatCount}. Scheduling click in ${randomDelay / 1000} seconds...`);

                    // Schedule the click after the random delay
                    clickTimeoutId = setTimeout(() => {
                        rematchBtn.click();
                        console.log('Rematch button clicked after weighted delay.');
                        clickTimeoutId = null;
                    }, randomDelay);
                } else {
                    console.log(`Chat count is ${chatCount}, which is less than 2. Not scheduling click.`);
                }
            } else {
                console.log('d-none class is present on #rematch_btn. Not scheduling click.');
            }
        };

        // Initial check and observer for the rematch button
        scheduleRematchClick();

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                // Check if the attribute that changed is 'class'
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // When the class attribute changes, re-evaluate whether to schedule a click
                    scheduleRematchClick();
                }
            }
        });

        // Start observing the button for attribute changes, specifically 'class'
        observer.observe(rematchBtn, { attributes: true });

        console.log('Monitoring #rematch_btn for d-none class removal and scheduling weighted delayed click.');

    } else {
        console.error('Element with ID "rematch_btn" not found.');
    }
})();