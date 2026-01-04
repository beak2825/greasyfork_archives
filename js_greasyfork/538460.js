// ==UserScript==
// @name         Torn Bazaar Auto Update
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to click all UPDATE buttons on Torn.com bazaar management page
// @author       Codiaz
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538460/Torn%20Bazaar%20Auto%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/538460/Torn%20Bazaar%20Auto%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the button
    function createButton() {
        const button = document.createElement('button');
        button.innerText = 'Auto Update All';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);
        console.log('Button created and appended to body');
        return button;
    }

    // Function to find and click all UPDATE buttons
    function clickAllUpdateButtons() {
        // Narrow down to buttons or links with "UPDATE" text
        const updateButtons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'))
            .filter(el => el.innerText.trim().toUpperCase() === 'UPDATE' || el.value?.trim().toUpperCase() === 'UPDATE');
        console.log(`Found ${updateButtons.length} UPDATE buttons`);

        let index = 0;

        function clickNext() {
            if (index < updateButtons.length) {
                const element = updateButtons[index];
                console.log(`Clicking UPDATE button ${index + 1}/${updateButtons.length}`);
                element.click();
                index++;
                setTimeout(clickNext, 1000); // 1-second delay to avoid overwhelming the server
            } else {
                console.log('Finished clicking all UPDATE buttons');
            }
        }

        if (updateButtons.length === 0) {
            console.log('No UPDATE buttons found on the page');
            alert('No UPDATE buttons found. Ensure you are on the correct bazaar management page.');
        } else {
            clickNext();
        }
    }

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        console.log('Page loaded, checking URL and initializing script');

        // Check if we're on the correct bazaar management page
        if (window.location.hash.includes('#/manage')) {
            console.log('On bazaar management page, setting up button');
            const button = createButton();

            // Add click event listener to button
            button.addEventListener('click', () => {
                console.log('Auto Update All button clicked');
                button.disabled = true;
                button.innerText = 'Updating...';
                clickAllUpdateButtons();
                // Re-enable button after completion
                setTimeout(() => {
                    button.disabled = false;
                    button.innerText = 'Auto Update All';
                    console.log('Button re-enabled');
                }, 1000 * (document.querySelectorAll('button, a, input[type="button"], input[type="submit"]').length + 1));
            });
        } else {
            console.log('Not on bazaar management page, script not running');
        }
    });

    // Fallback in case page uses dynamic content loading
    setTimeout(() => {
        if (window.location.hash.includes('#/manage') && !document.querySelector('button[style*="zIndex: 9999"]')) {
            console.log('Fallback: Button not found, retrying creation');
            createButton();
        }
    }, 3000); // Retry after 3 seconds
})();