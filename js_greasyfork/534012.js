// ==UserScript==
// @name         Old Discord Role Pills
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Get Discord 2020's role pills with this simple userscript
// @author       CheetoPuffsz23
// @license      MIT
// @match        *://discord.com/channels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534012/Old%20Discord%20Role%20Pills.user.js
// @updateURL https://update.greasyfork.org/scripts/534012/Old%20Discord%20Role%20Pills.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update the role pill outline color
    function updateRolePills() {
        // Select all role pill elements (ensure we're not targeting remove buttons)
        const rolePills = document.querySelectorAll('[class^="role_"]:not([class*="roleRemoveButton"])');

        // Loop through each role pill and update its outline and color
        rolePills.forEach(pill => {
            // Try to get the role dot (assumed to be part of the pill)
            const roleDot = pill.querySelector('.roleCircle__4f569, .roleFlowerStar_dfa8b6');

            if (roleDot) {
                // Get the computed styles of the role dot to capture its exact color
                const computedStyle = window.getComputedStyle(roleDot);
                const dotColor = computedStyle.backgroundColor || computedStyle.color;

                // Apply the color to the role pill's border and text color
                pill.style.border = `1px solid ${dotColor}`;  // Set border to role dot color
                pill.style.color = dotColor;  // Set text color to role dot color

                // Make the pill rounded (if it's not already) and ensure clean appearance
                pill.style.borderRadius = '9999px';  // Max border-radius for pill shape
                pill.style.padding = '0px 3px';  // Adjust horizontal padding for space and vertical padding for balance
                pill.style.background = 'transparent';  // Keep background transparent

                // Ensure there's a smaller space between the role dot and the text
                const roleDotElement = pill.querySelector('svg');
                if (roleDotElement) {
                    roleDotElement.style.marginRight = '0px';  // Smaller space between dot and text

                    // Make the dot smaller by reducing the width and height of the svg
                    roleDotElement.style.width = '4px';  // Reduce dot size (adjust as necessary)
                    roleDotElement.style.height = '4px'; // Same for height
                }

                // If you're using flexbox (as the CSS suggests), apply a small gap between items
                pill.style.display = 'inline-flex';  // Set display to inline-flex
                pill.style.alignItems = 'center';  // Align items to the center
                pill.style.gap = '0px';  // Smaller gap between the dot and text
            }
        });
    }

    // Create an observer to handle dynamically added role pills
    const observer = new MutationObserver(updateRolePills);

    // Start observing for changes to the body (for dynamically added roles)
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the updateRolePills function initially to apply styles
    updateRolePills();
})();
