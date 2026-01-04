// ==UserScript==
// @name         Dark/Light Mode Toggle
// @namespace    https://azastudio.net
// @version      1.2
// @description  Toggle between dark and light mode on any website with a button on the center right of the screen that auto hides.
// @author       Nate Thompson
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508378/DarkLight%20Mode%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/508378/DarkLight%20Mode%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '☼'; // Start with an arrow
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '50%'; // Vertically center the button
        toggleButton.style.transform = 'translateY(-50%)'; // Adjust for perfect centering
        toggleButton.style.right = '-12px'; // Initially hidden to the right
        toggleButton.style.width = '50px'; // Small width to show just the arrow
        toggleButton.style.height = '50px';
        toggleButton.style.zIndex = '1000';
        toggleButton.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
        toggleButton.style.color = '#ffffff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px 0 0 5px'; // Rounded edge on the left side
        toggleButton.style.transition = 'right 0.3s ease, width 0.3s ease'; // Smooth transitions for both right and width
        toggleButton.style.overflow = 'hidden'; // Hide text overflow
        toggleButton.style.whiteSpace = 'nowrap'; // Prevent text wrapping
        toggleButton.style.textAlign = 'center';

        document.body.appendChild(toggleButton);

        let inverted = localStorage.getItem('invertedColors') === 'true';
        setInvertedMode(inverted);

        // Hover effect to slide out the button and reveal text
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.right = '0'; // Slide out
            toggleButton.style.width = '150px'; // Expand to show text
            toggleButton.innerHTML = '☼ Invert Colors'; // Add text next to the arrow
        });

        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.right = '-12px'; // Slide back in
            toggleButton.style.width = '50px'; // Shrink back to arrow only
            toggleButton.innerHTML = '☼'; // Show only the arrow
        });

        toggleButton.addEventListener('click', () => {
            inverted = !inverted;
            setInvertedMode(inverted);
            localStorage.setItem('invertedColors', inverted);
        });

        function setInvertedMode(isInverted) {
            if (isInverted) {
                document.documentElement.style.filter = 'invert(1)';
                toggleButton.style.backgroundColor = 'rgba(200, 200, 200, 0.8)'; // Muted light color
                toggleButton.style.color = '#000000'; // Dark text
            } else {
                document.documentElement.style.filter = 'invert(0)';
                toggleButton.style.backgroundColor = 'rgba(50, 50, 50, 0.8)'; // Muted dark color
                toggleButton.style.color = '#ffffff'; // Light text
            }
        }
    });
})();

