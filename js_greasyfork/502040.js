// ==UserScript==
// @name         Neopets Potato Counter
// @version      2024.09.03
// @description  Counts potatoes and displays them after a delay proportional to count. Refreshes page if count is unreasonably large.
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @namespace    https://greasyfork.org/users/1277376
// @match        https://www.neopets.com/medieval/potatocounter.phtml
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502040/Neopets%20Potato%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/502040/Neopets%20Potato%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageUrls = [
        'https://images.neopets.com/medieval/potato1.gif',
        'https://images.neopets.com/medieval/potato2.gif',
        'https://images.neopets.com/medieval/potato3.gif',
        'https://images.neopets.com/medieval/potato4.gif'
    ];

    function countImages() {
        let totalCount = 0;
        let images = document.querySelectorAll('img');

        images.forEach((img) => {
            if (imageUrls.includes(img.src)) {
                totalCount++;
            }
        });

        // Calculate the delay based on the total count
        const finalDelay = totalCount * 100; // 100 milliseconds per potato count

        // Check if the delay exceeds 20 seconds and refresh the page if necessary
        if (finalDelay > 20000) {
            console.log(`Delay of ${finalDelay} milliseconds exceeds 20 seconds. Refreshing the page.`);
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Refresh after 1 second to give time for the log message
            return; // Exit the function to prevent further actions
        }

        // Ensure the overlay is updated after the calculated delay
        setTimeout(() => {
            updateOverlay(totalCount);
        }, finalDelay);
    }

    function updateOverlay(count) {
        let message = count > 0
            ? `The solution to the puzzle is: ${count}`
            : `No potatoes found.`;

        let overlay = document.querySelector('#potato-counter-overlay');
        if (!overlay) {
            // Create the overlay if it doesn't exist
            overlay = document.createElement('div');
            overlay.id = 'potato-counter-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '50px'; // Adjust top to be closer to the button
            overlay.style.right = '10px'; // Adjust right to be closer to the button
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            overlay.style.color = 'white';
            overlay.style.padding = '10px';
            overlay.style.borderRadius = '5px';
            overlay.style.zIndex = '1000';
            overlay.style.fontSize = '16px';
            overlay.style.maxWidth = '300px'; // Optional: set a max width for the overlay
            document.body.appendChild(overlay);
        }
        overlay.textContent = message;
    }

    // Run the countImages function after the page is fully loaded
    window.addEventListener('load', countImages);
})();
