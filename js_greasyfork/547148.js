// ==UserScript==
// @name         NitroType Zen Mode Toggle (Hide After Start)
// @namespace    https://singdev.wixsite.com/sing-developments
// @version      1.4
// @license MIT 
// @description  Adds a Zen Mode toggle to hide the race track on nitrotype.com/race after the race starts.
// @author       SiDaStuff
// @match        https://www.nitrotype.com/race
// @icon         https://www.nitrotype.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547148/NitroType%20Zen%20Mode%20Toggle%20%28Hide%20After%20Start%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547148/NitroType%20Zen%20Mode%20Toggle%20%28Hide%20After%20Start%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOGGLE_ID = 'zen-mode-toggle';
    const STORAGE_KEY = 'zenModeEnabled';

    // Get Zen Mode saved state
    function isZenModeEnabled() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    // Show or hide track based on race state + Zen Mode
    function applyZenMode() {
        const trackDiv = document.querySelector('.racev3-track');
        const raceContainer = document.querySelector('#raceContainer');

        if (!trackDiv || !raceContainer) return;

        const raceStarted = raceContainer.classList.contains('is-racing');

        // If race hasn't started → always show track
        if (!raceStarted) {
            trackDiv.style.visibility = 'visible';
            return;
        }

        // Hide or show based on Zen Mode when race starts
        trackDiv.style.visibility = isZenModeEnabled() ? 'hidden' : 'visible';
    }

    // Create Zen Mode toggle button
    function createToggle() {
        if (document.getElementById(TOGGLE_ID)) return;

        const button = document.createElement('button');
        button.id = TOGGLE_ID;
        button.textContent = isZenModeEnabled() ? 'Zen Mode: ON' : 'Zen Mode: OFF';
        button.style.position = 'fixed';
        button.style.top = '80px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 14px';
        button.style.borderRadius = '8px';
        button.style.backgroundColor = '#222';
        button.style.color = '#fff';
        button.style.border = '1px solid #555';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        button.style.fontFamily = 'Arial, sans-serif';

        button.addEventListener('click', () => {
            const newState = !isZenModeEnabled();
            localStorage.setItem(STORAGE_KEY, newState);
            button.textContent = newState ? 'Zen Mode: ON' : 'Zen Mode: OFF';
            applyZenMode();
        });

        document.body.appendChild(button);
    }

    // Observe DOM for dynamic race updates
    const observer = new MutationObserver(() => {
        createToggle();
        applyZenMode();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial setup
    window.addEventListener('load', () => {
        createToggle();
        applyZenMode();
    });
})();
