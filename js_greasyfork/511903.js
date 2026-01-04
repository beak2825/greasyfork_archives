// ==UserScript==
// @name         Prolific add "Take part in this study" Button to top of page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Continuously scans for the "Take part in this study" button and clones it to the top-right corner
// @author       You
// @match        https://app.prolific.com/studies*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511903/Prolific%20add%20%22Take%20part%20in%20this%20study%22%20Button%20to%20top%20of%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/511903/Prolific%20add%20%22Take%20part%20in%20this%20study%22%20Button%20to%20top%20of%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and position the cloned button
    function addClonedButton(originalButton) {
        // If the cloned button already exists, do nothing
        if (document.querySelector('#cloned-study-button')) return;

        // Clone the original button
        const clonedButton = originalButton.cloneNode(true);
        clonedButton.id = 'cloned-study-button'; // Add an ID to the cloned button to prevent duplicates

        // Style the cloned button to overlay at the top-right
        clonedButton.style.position = 'fixed';
        clonedButton.style.top = '70px';
        clonedButton.style.right = '10px';
        clonedButton.style.zIndex = '1000'; // Ensure it's above other elements
        clonedButton.style.backgroundColor = '#007bff'; // Optionally style the button
        clonedButton.style.padding = '10px';
        clonedButton.style.borderRadius = '5px';
        clonedButton.style.cursor = 'pointer';
        clonedButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'; // Add a subtle shadow

        // Append the cloned button to the body
        document.body.appendChild(clonedButton);

        // Ensure clicking the cloned button triggers the original button's click event
        clonedButton.addEventListener('click', function() {
            originalButton.click(); // Trigger the original button's click
        });

        console.log("Cloned 'Take part in this study' button added.");
    }

    // Function to check for the button and clone it if found
    function checkForButton() {
        const originalButton = document.querySelector('.reserve-study-button[data-testid="reserve"]');

        // If the button is found, clone it and add it to the top-right
        if (originalButton) {
            addClonedButton(originalButton);
        }
    }

    // Initial check on page load
    checkForButton();

    // Continuously check for the button at intervals (fallback for observer)
    setInterval(checkForButton, 3000); // Check every 3 seconds

    // MutationObserver to detect changes to the DOM
    const observer = new MutationObserver(() => {
        checkForButton();
    });

    // Start observing changes to the body
    observer.observe(document.body, { childList: true, subtree: true });
})();
