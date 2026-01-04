// ==UserScript==
// @name         Poll Form
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Poll form auto-filler for Find the Fake!
// @author       (You)
// @match        *://*/*
// @grant        none
// @license      MIT+NIGGER
// @downloadURL https://update.greasyfork.org/scripts/528218/Poll%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/528218/Poll%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let x2PollArray = [
        "Find the FAKE! - Round # ",
        "",
        "|▌| A is fake",
        "|▐| B is fake"
    ]

    let x4PollArray = [
        "Find the FAKE! - Round # ",
        "",
        "|▘| A is fake",
        "|▝| B is fake",
        "|▖| C is fake",
        "|▗| D is fake"
    ]

    let UncappedPollArray = " is fake" // In case you need to modify the uncapped for any purpose

    // Function to add our custom button after the emotelistbtn
    function addPollInput() {
        // Find the emotelistbtn
        const emoteListBtn = document.getElementById('emotelistbtn');

        if (emoteListBtn) {
            // Create an input box for the user to specify the number of buttons
            const inputBox = document.createElement('input');
            inputBox.type = 'number';
            inputBox.id = 'poll-button-count';
            inputBox.placeholder = 'Number of options';
            inputBox.style.marginLeft = '5px';
            inputBox.style.width = '50px';

            // Create a button to add the specified number of buttons
            const addButton = document.createElement('button');
            addButton.className = 'btn btn-sm btn-default';
            addButton.id = 'add-poll-options-btn';
            addButton.textContent = 'Add Options';
            addButton.style.marginLeft = '5px';
            addButton.style.backgroundColor = '#ff9800';
            addButton.style.color = 'white';

            // Add click event to the add button
            addButton.addEventListener('click', function () {
                const numOptions = parseInt(inputBox.value);
                if (isNaN(numOptions) || numOptions < 2) {
                    alert('Please enter a valid number (2 or more).');
                    return;
                }
                // Call AddForm with the specified number of options
                AddForm(numOptions, numOptions === 2 ? x2PollArray : x4PollArray);
            });

            // Insert input box and button after the Emote List button
            emoteListBtn.parentNode.insertBefore(inputBox, emoteListBtn.nextSibling);
            emoteListBtn.parentNode.insertBefore(addButton, emoteListBtn.nextSibling);

            console.log('Input box and Add Options button added after Emote List button');
        } else {
            console.log('Emote List button not found, cannot add input box and button');
            // Try again after a short delay in case the button hasn't loaded yet
            setTimeout(addPollInput, 1000);
        }
    }

    /* CREATE FORMS */
    function AddForm(numAnswer, array) {
        // Clicking on poll button
        document.querySelectorAll('button.btn.btn-sm.btn-default').forEach(btn => {
            if (btn.textContent.trim() === "New 📊") {
                console.log("NEW BUTTON CLICKED");
                btn.click();
            }
        });

        const targetContainer = document.querySelector('#kurwawrap .well.poll-menu');

        if (!targetContainer) {
            console.log('Target poll structure not found.');
            return;
        }

        // Handles multiple choice for 2x2
        const radioButtons = targetContainer.querySelectorAll('input[type="radio"]');
        if (numAnswer !== 4)
            {
            radioButtons.forEach(radio => {
                if (radio.id === "kwssin") { // This is the "single choice" option
                    radio.checked = true;
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('- Radio button for "single choice" is now checked');
                }
            });
        }

        radioButtons.forEach(radio => {
            if (radio.id === "kwhsm") { // This is the "show votes for mods" option
                radio.checked = true;
                radio.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('- Radio button for "show votes for mods" is now checked');
            }
        });

        // Fill the title (first input)
        const titleInput = targetContainer.querySelector('input[name="title"]');
        if (titleInput) {
            titleInput.value = array[0];
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('Title filled:', array[0]);
        }

        // Now add options one by one
        const addOptions = () => {
            // Find all option inputs currently in the form
            const optionInputs = targetContainer.querySelectorAll('input[type="text"]:not([name="title"])');
            const lastOptionInput = optionInputs[optionInputs.length - 1];

            // If we have more options to add than inputs available
            if (optionInputs.length <= numAnswer) {
                // Fill the last available input
                if (lastOptionInput) {
                    // Index is +2 because array[0] is title and array[1] is empty
                    const optionIndex = optionInputs.length + 1;
                    const optionText = optionIndex < array.length ?
                        array[optionIndex] :
                        String.fromCharCode(65 + (optionIndex - 2)) + UncappedPollArray;

                    lastOptionInput.value = optionText;
                    lastOptionInput.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log(`Option ${optionIndex} filled:`, optionText);

                    // Wait for the form to add a new input, then continue adding options
                    setTimeout(addOptions, 100);
                }
            } else {
                console.log('All options added successfully');
            }
        };

        // Start adding options
        addOptions();
    }

    // Run the function after the page has fully loaded
    window.addEventListener('load', function() {
        // Wait a bit to make sure everything is loaded
        setTimeout(addPollInput, 1000);
    });

    // Also try to add the button immediately in case the page is already loaded
    addPollInput();
})();