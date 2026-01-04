// ==UserScript==
// @name         Auto Thumbs Up Clicker
// @namespace    https://civitai.com/generate
// @version      0.1
// @description  Clicks all thumbs up buttons on page when pressing "1"
// @author       Anon
// @match        https://civitai.com/generate
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518500/Auto%20Thumbs%20Up%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/518500/Auto%20Thumbs%20Up%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and click all thumbs up buttons
    function clickThumbsUpButtons() {
        // Find all SVG elements on the page
        const svgs = document.querySelectorAll('svg');

        // Filter SVGs to find thumbs up icons based on class and path
        const thumbsUpButtons = Array.from(svgs).filter(svg => {
            // Check if it has the thumbs up classes
            const hasThumbsUpClass = svg.classList.contains('tabler-icon-thumb-up');

            // Check if it has the correct path structure
            const path = svg.querySelector('path');
            const hasThumbsUpPath = path && path.getAttribute('d').includes('v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7');

            return hasThumbsUpClass || hasThumbsUpPath;
        });

        // Click each thumbs up button
        thumbsUpButtons.forEach(svg => {
            // Find the closest clickable parent (usually a button)
            let clickableElement = svg;
            while (clickableElement && clickableElement.tagName !== 'BUTTON' && clickableElement.tagName !== 'A') {
                clickableElement = clickableElement.parentElement;
            }

            if (clickableElement) {
                clickableElement.click();
                console.log('Clicked thumbs up button');
            }
        });
    }

    // Add keyboard event listener
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is "1"
        if (event.key === '1') {
            clickThumbsUpButtons();
        }
    });
})();