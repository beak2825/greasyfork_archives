// ==UserScript==
// @name         Torn Bazaar Auto Fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to click all FILL buttons on Torn.com bazaar add page
// @author       Codiaz
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538459/Torn%20Bazaar%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/538459/Torn%20Bazaar%20Auto%20Fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the button
    function createButton() {
        const button = document.createElement('button');
        button.innerText = 'Auto Fill All';
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

    // Function to find and click all FILL buttons
    function clickAllFillButtons() {
        // Narrow down to buttons or links with "FILL" text
        const fillButtons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'))
            .filter(el => el.innerText.trim().toUpperCase() === 'FILL' || el.value?.trim().toUpperCase() === 'FILL');
        console.log(`Found ${fillButtons.length} FILL buttons`);

        let index = 0;

        function clickNext() {
            if (index < fillButtons.length) {
                const element = fillButtons[index];
                console.log(`Clicking FILL button ${index + 1}/${fillButtons.length}`);
                element.click();
                index++;
                setTimeout(clickNext, 1000); // 1-second delay to avoid overwhelming the server
            } else {
                console.log('Finished clicking all FILL buttons');
            }
        }

        if (fillButtons.length === 0) {
            console.log('No FILL buttons found on the page');
            alert('No FILL buttons found. Ensure you are on the correct bazaar add page.');
        } else {
            clickNext();
        }
    }

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        console.log('Page loaded, checking URL and initializing script');

        // Check if we're on the correct bazaar add page
        if (window.location.hash.includes('#/add')) {
            console.log('On bazaar add page, setting up button');
            const button = createButton();

            // Add click event listener to button
            button.addEventListener('click', () => {
                console.log('Auto Fill All button clicked');
                button.disabled = true;
                button.innerText = 'Filling...';
                clickAllFillButtons();
                // Re-enable button after completion
                setTimeout(() => {
                    button.disabled = false;
                    button.innerText = 'Auto Fill All';
                    console.log('Button re-enabled');
                }, 1000 * (document.querySelectorAll('button, a, input[type="button"], input[type="submit"]').length + 1));
            });
        } else {
            console.log('Not on bazaar add page, script not running');
        }
    });

    // Fallback in case page uses dynamic content loading
    setTimeout(() => {
        if (window.location.hash.includes('#/add') && !document.querySelector('button[style*="zIndex: 9999"]')) {
            console.log('Fallback: Button not found, retrying creation');
            createButton();
        }
    }, 3000); // Retry after 3 seconds
})();