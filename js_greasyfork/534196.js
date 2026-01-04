// ==UserScript==
// @name         BlogsMarks - Inputs Plus - Multiline and increase maxlength
// @namespace    https://blogmarks.net
// @version      0.2
// @description  When adding a new Marks, for all inputs, it make them Multiline and increase maxlength
// @author       Decembre
// @icon         https://icons.iconarchive.com/icons/sicons/basic-round-social/48/blogmarks-icon.png
// @match        https://blogmarks.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534196/BlogsMarks%20-%20Inputs%20Plus%20-%20Multiline%20and%20increase%20maxlength.user.js
// @updateURL https://update.greasyfork.org/scripts/534196/BlogsMarks%20-%20Inputs%20Plus%20-%20Multiline%20and%20increase%20maxlength.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Userscript is running...");

    // Function to replace the input field with a textarea
    function replaceInputWithTextarea(inputId, rows, cols, maxLength) {
        const inputField = document.getElementById(inputId);

        // Check if the input field exists and if the textarea does not already exist
        if (inputField && !document.getElementById(`${inputId}-textarea`)) {
            console.log(`Input field ${inputId} found, replacing with textarea...`);

            // Create a new textarea element
            const textArea = document.createElement('textarea');
            textArea.id = `${inputId}-textarea`; // Set a new ID for the textarea
            textArea.name = inputField.name; // Set the name attribute
            textArea.rows = rows; // Set the number of visible rows
            textArea.cols = cols; // Set the number of visible columns (same as size)
            textArea.maxLength = maxLength; // Set the maxlength
            textArea.value = inputField.value; // Copy the current value

            // Replace the input field with the textarea
            inputField.parentNode.replaceChild(textArea, inputField);
            console.log(`Textarea replaced successfully for ${inputId}.`);
        } else if (!inputField) {
            console.log(`Input field ${inputId} not found.`);
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                replaceInputWithTextarea('new-url', 2, 52, 500);
                replaceInputWithTextarea('new-title', 2, 52, 500);
                replaceInputWithTextarea('new-publictags', 4, 52, 500);
                replaceInputWithTextarea('new-privatetags', 4, 52, 500);
                replaceInputWithTextarea('new-via', 1, 52, 200);
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the input fields are already present
    replaceInputWithTextarea('new-url', 2, 52, 500);
    replaceInputWithTextarea('new-title', 2, 52, 500);
    replaceInputWithTextarea('new-publictags', 4, 52, 500);
    replaceInputWithTextarea('new-privatetags', 4, 52, 500);
    replaceInputWithTextarea('new-via', 1, 52, 200);

    // Add custom styles
    GM_addStyle(`
        html:has(.my.bm-frame) body.my.bm-frame #container #content-wrapper #content .b form#mark-form textarea {
            width: 100% !important;
            width: auto;
            min-width: 100% !important;
            max-width: 100% !important;
            border: 1px solid red !important;
        }
    `);
})();
