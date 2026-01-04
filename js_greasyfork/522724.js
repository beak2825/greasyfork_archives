// ==UserScript==
// @name         Kapela GMH Hlasovátor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reload the page every 5 minutes and click a button with specific text
// @author       Jáchym Řezáč & ChatGPT 4o
// @match        https://boleslavsky.denik.cz/volny-cas/kapela-hudba-zabava-skupina-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522724/Kapela%20GMH%20Hlasov%C3%A1tor.user.js
// @updateURL https://update.greasyfork.org/scripts/522724/Kapela%20GMH%20Hlasov%C3%A1tor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the button with specific text
    function clickButton() {
        console.log('Attempting to find buttons...');
        const buttons = document.querySelectorAll('.survey__answer-btn.button'); // Select buttons by class
        console.log('Buttons found:', buttons);

        let buttonClicked = false;
        buttons.forEach(button => {
            console.log('Inspecting button:', button.textContent.trim());
            if (button.textContent.trim() === 'Kapela GMH') { // Match exact text
                button.click();
                console.log('Clicked button with text: Kapela GMH');
                buttonClicked = true;
            }
        });

        if (!buttonClicked) {
            console.log('Button with text "Kapela GMH" not found.');
        }
    }

    // Retry logic in case the button is loaded dynamically
    function retryClickButton() {
        console.log('Retrying click...');
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            console.log(`Attempt ${attempts}`);
            clickButton();
            if (attempts >= 3) { // Stop after 3 attempts
                clearInterval(interval);
                console.log('Max attempts reached. Stopping retries.');
            }
        }, 1000); // Retry every second for up to 5 seconds
    }

    // Run the click function on page load
    retryClickButton();

    // Reload the page every 5 minutes (300,000 ms)
    setInterval(() => {
        location.reload();
    }, 280000);
})();
