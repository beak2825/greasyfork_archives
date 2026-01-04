// ==UserScript==
// @name         WME "Discuss" Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a "Discuss" button styled to resemble Waze's default navigation button to the bottom-left of the WME editor
// @author       VAGCoded
// @match https://*.waze.com/*editor*
// @match https://waze.com/*editor*
// @match https://*beta.waze.com/*editor*
// @match https://beta.waze.com/*editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532816/WME%20%22Discuss%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/532816/WME%20%22Discuss%22%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the WME page to load and then create the button
    function addDiscussButton() {
        // Create the button element
        const button = document.createElement('button');
        button.innerHTML = 'Discuss'; // Text inside the button

        // Apply the WME-like styles to the button
        button.style.position = 'fixed';
        button.style.bottom = '20px'; // Position from the bottom
        button.style.left = '-10px'; // Position from the left
        button.style.zIndex = 1000; // Ensure the button is on top
        button.style.padding = '0px 16px'; // Horizontal padding like original button
        button.style.backgroundColor = 'transparent'; // No background
        button.style.border = '0px'; // No border
        button.style.color = 'var(--content_p2, #55595e)'; // Text color like original button
        button.style.cursor = 'pointer';
        button.style.fontSize = '13px'; // Font size to match
        button.style.fontWeight = '500'; // Regular font weight
        button.style.display = 'inline-flex'; // Align the content flexibly
        button.style.alignItems = 'center'; // Center text vertically
        button.style.justifyContent = 'flex-start'; // Align the text to the left
        button.style.letterSpacing = '0.3px'; // Letter spacing like the original
        button.style.minWidth = '48px'; // Ensure the minimum width is 48px
        button.style.height = '48px'; // Set the button's height to 48px
        button.style.textAlign = 'center'; // Text alignment
        button.style.whiteSpace = 'nowrap'; // Prevent text wrapping
        button.style.userSelect = 'none'; // Prevent text selection
        button.style.width = 'calc(100% - 8px)'; // Width calculation for proper size
        button.style.paddingBottom = '0px'; // Remove padding at the bottom
        button.style.paddingTop = '0px'; // Remove padding at the top
        button.style.paddingInlineEnd = '16px'; // Right padding
        button.style.paddingInlineStart = 'calc(12px + 12px)'; // Left padding

        // Remove hover effect (no color change on hover)
        // No event listeners for mouseover or mouseout

        // Focus effect (for accessibility)
        button.addEventListener('focus', () => {
            button.style.outline = 'none'; // Remove default outline
            button.style.boxShadow = '0 0 4px rgba(0, 131, 232, 0.8)'; // Blue glow on focus
        });

        // Remove the box-shadow when the button loses focus
        button.addEventListener('blur', () => {
            button.style.boxShadow = 'none';
        });

        // Link the button to the Waze Discuss page
        button.addEventListener('click', () => {
            window.open('https://www.waze.com/discuss', '_blank');
        });

        // Append the button to the body of the page
        document.body.appendChild(button);
    }

    // Run the function to add the button to the UI
    addDiscussButton();
})();
