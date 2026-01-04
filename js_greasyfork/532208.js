// ==UserScript==
// @name         Auto Check Share and Focus Tags plus CTRL + Enter Save and Close
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically checks Share checkbox, focuses Tags input and enable CTRL + Enter submit on linkding bookmarks page
// @author       Webmaster
// @match        https://*/bookmarks/new*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532208/Auto%20Check%20Share%20and%20Focus%20Tags%20plus%20CTRL%20%2B%20Enter%20Save%20and%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/532208/Auto%20Check%20Share%20and%20Focus%20Tags%20plus%20CTRL%20%2B%20Enter%20Save%20and%20Close.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check the Share checkbox
    function checkShareBox() {
        const checkbox = document.getElementById('id_shared');
        if (checkbox) {
            checkbox.checked = true;
        }
    }

    // Function to focus the Tags input
    function focusTagsInput() {
        const tagsInput = document.getElementById('id_tag_string');
        if (tagsInput) {
            tagsInput.focus();
        }
    }

    // Function to handle form submission
    function setupFormSubmission() {
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 'Enter') {
                const submitButton = document.querySelector('input[type="submit"][value="Save and close"]');
                if (submitButton) {
                    event.preventDefault(); // Prevent default Ctrl+Enter behavior
                    submitButton.click();   // Trigger the form submission
                }
            }
        });
    }

    // Run when page loads
    window.addEventListener('load', function() {
        checkShareBox();
        focusTagsInput();
        setupFormSubmission();
    });

    // For cases where content might load dynamically
    const observer = new MutationObserver(function(mutations) {
        checkShareBox();
        focusTagsInput();
        setupFormSubmission();
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });
})();