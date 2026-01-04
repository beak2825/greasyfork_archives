// ==UserScript==
// @name         OLX UA Specific AdCard Hider with Toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide specific divs on OLX UA with a toggle slider
// @author       max5555
// @grant        none
// @license      MIT
// @match        https://www.olx.ua/uk/*
// @downloadURL https://update.greasyfork.org/scripts/478864/OLX%20UA%20Specific%20AdCard%20Hider%20with%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/478864/OLX%20UA%20Specific%20AdCard%20Hider%20with%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide divs with the specific ID pattern that contains the adCard-featured
    function hideSpecificAdCards() {
        if (!document.getElementById('adCardToggleSlider').checked) return;

        const allDivs = document.querySelectorAll('div[id]');
        allDivs.forEach(div => {
            const idPattern = /^[0-9]+$/; // Matches IDs that are purely numeric
            if (idPattern.test(div.id) && div.querySelector('div[data-testid="adCard-featured"]')) {
                div.style.display = 'none';
            }
        });
    }

    // Function to show divs again
    function showSpecificAdCards() {
        const allDivs = document.querySelectorAll('div[id]');
        allDivs.forEach(div => {
            const idPattern = /^[0-9]+$/; // Matches IDs that are purely numeric
            if (idPattern.test(div.id) && div.querySelector('div[data-testid="adCard-featured"]')) {
                div.style.display = 'block';
            }
        });
    }

    // Create a slider at the top right for toggling
    const sliderHTML = `
        <div style="position: fixed; top: 10px; right: 10px; z-index: 9999; background-color: white; padding: 5px; border: 1px solid #ccc;">
            <label>
                Hide Ad Card:
                <input id="adCardToggleSlider" type="checkbox" checked>
            </label>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', sliderHTML);

    // Attach event listener to the slider
    document.getElementById('adCardToggleSlider').addEventListener('change', function() {
        if (this.checked) {
            hideSpecificAdCards();
        } else {
            showSpecificAdCards();
        }
    });

    // Initial hiding of the divs
    hideSpecificAdCards();

    // Using a MutationObserver to handle dynamic loading of content
    const observer = new MutationObserver(() => {
        if (document.getElementById('adCardToggleSlider').checked) {
            hideSpecificAdCards();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
