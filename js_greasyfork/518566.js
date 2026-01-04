// ==UserScript==
// @name         Auto Rodney
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adds a button to trigger filling in the majority of the eChat submission form when adding multiple echat requests from the inbox.
// @author       Rob Clayton
// @match        *://forms.office.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518566/Auto%20Rodney.user.js
// @updateURL https://update.greasyfork.org/scripts/518566/Auto%20Rodney.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check for the specific heading
    function checkHeadingAndAddButton() {
        const heading = document.querySelector('span.text-format-content'); // Target the heading element

        if (heading && heading.textContent.trim() === "New Echat Submissions") {
            console.log("Heading matched: eChat Submission");
            addButton(); // Add the button
        } else if (!heading) {
            console.log("Heading not found yet, retrying...");
            setTimeout(checkHeadingAndAddButton, 500); // Retry if the heading is not yet loaded
        } else {
            console.log("Heading does not match. No button added.");
        }
    }

    // Function to add the trigger button
    function addButton() {
        const textBox = document.querySelector('input[aria-label="Single line text"]'); // Target the initial text box

        if (textBox) {
            const button = document.createElement('button'); // Create the button element
            button.textContent = "Auto Rodney"; // Set button text
            button.style.marginLeft = "10px"; // Add some spacing
            button.style.padding = "5px 10px"; // Style the button
            button.style.cursor = "pointer";
            button.onclick = fillForm; // Attach click event to start the process

            // Insert the button after the text box
            textBox.parentNode.insertBefore(button, textBox.nextSibling);
            console.log("Trigger button added.");
        } else {
            console.log("Text box not found yet, retrying...");
            setTimeout(addButton, 500); // Retry if the text box is not found
        }
    }

    // Function to fill the form
    function fillForm() {
        console.log("Automation triggered.");
        fillTextBox(); // Start the automation process
    }

    // Function to fill the text box with "Rodney"
    function fillTextBox() {
        const textBox = document.querySelector('input[aria-label="Single line text"]'); // Target the input field

        if (textBox) {
            textBox.value = "Rodney"; // Fill in the value
            textBox.dispatchEvent(new Event('input')); // Simulate user typing
            console.log("Text box filled with: Rodney");
            selectFirstRadioButton(); // Proceed to the next step
        } else {
            console.log("Text box not found yet, retrying...");
            setTimeout(fillTextBox, 500); // Retry if the element is not available yet
        }
    }

    // Function to select the first radio button
    function selectFirstRadioButton() {
        const radioButton1 = document.querySelector('input[role="radio"][value="No"]'); // Target the first radio button

        if (radioButton1) {
            radioButton1.checked = true; // Mark it as selected
            radioButton1.dispatchEvent(new Event('change')); // Simulate a user change event
            console.log("First radio button selected: No");
            selectSecondRadioButton(); // Proceed to the next step
        } else {
            console.log("First radio button not found yet, retrying...");
            setTimeout(selectFirstRadioButton, 500); // Retry if the element is not available yet
        }
    }

    // Function to select the second radio button
    function selectSecondRadioButton() {
        const radioButton2 = document.querySelector('input[role="radio"][value="Phone"]'); // Target the second radio button

        if (radioButton2) {
            radioButton2.checked = true; // Mark it as selected
            radioButton2.dispatchEvent(new Event('change')); // Simulate a user change event
            console.log("Second radio button selected: Phone");
            selectThirdRadioButton(); // Proceed to the next step
        } else {
            console.log("Second radio button not found yet, retrying...");
            setTimeout(selectSecondRadioButton, 500); // Retry if the element is not available yet
        }
    }

    // Function to select the third radio button
    function selectThirdRadioButton() {
        const radioButton3 = document.querySelector('input[role="radio"][value="Fault is past ERT with no new update"]'); // Target the third radio button

        if (radioButton3) {
            radioButton3.checked = true; // Mark it as selected
            radioButton3.dispatchEvent(new Event('change')); // Simulate a user change event
            console.log("Third radio button selected: Fault is past ERT with no new update");
            selectFourthRadioButton(); // Proceed to the final step
        } else {
            console.log("Third radio button not found yet, retrying...");
            setTimeout(selectThirdRadioButton, 500); // Retry if the element is not available yet
        }
    }

    // Function to select the fourth radio button
    function selectFourthRadioButton() {
        const radioButton4 = document.querySelector('input[role="radio"][value="Yes"]'); // Target the fourth radio button

        if (radioButton4) {
            radioButton4.checked = true; // Mark it as selected
            radioButton4.dispatchEvent(new Event('change')); // Simulate a user change event
            console.log("Fourth radio button selected: Yes");
        } else {
            console.log("Fourth radio button not found yet, retrying...");
            setTimeout(selectFourthRadioButton, 500); // Retry if the element is not available yet
        }
    }

    // Start by checking the heading
    checkHeadingAndAddButton();
})();
