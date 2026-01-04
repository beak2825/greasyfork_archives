// ==UserScript==
// @name         Stay on Incident Creation Page, Clear Requested For, and Add Text to Description
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Keeps the kiosk webpage on the incident creation page after ticket submission, clears the Requested for field, and adds text to the description
// @match        *://nexteer.service-now.com/*
// @grant        none
// @license MIT
// @author       Gannon Ponichtera
// @downloadURL https://update.greasyfork.org/scripts/510931/Stay%20on%20Incident%20Creation%20Page%2C%20Clear%20Requested%20For%2C%20and%20Add%20Text%20to%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/510931/Stay%20on%20Incident%20Creation%20Page%2C%20Clear%20Requested%20For%2C%20and%20Add%20Text%20to%20Description.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    console.log("Tampermonkey script loaded");
 
    // URL of the incident creation page
    // IMPORTANT: Update this URL if the incident creation page changes
    const incidentCreationPageURL = "https://nexteer.service-now.com/sp?id=sc_cat_item&sys_id=3f1dd0320a0a0b99000a53f7604a2ef9";
 
    // Function to clear the Requested for field and add text to description
    function clearFieldAndAddText() {
        const clearButton = document.querySelector('.select2-search-choice-close');
        if (clearButton) {
            clearButton.click();
            console.log("Clicked clear button");
        }
        const requestedForField = document.querySelector('#s2id_sp_formfield_caller_id .select2-chosen');
        if (requestedForField) {
            requestedForField.textContent = '';
            console.log("Cleared Requested for field text");
        }
        const hiddenInput = document.querySelector('#sp_formfield_caller_id');
        if (hiddenInput) {
            hiddenInput.value = '';
            console.log("Cleared hidden input value");
        }
 
        // Add text to description textarea
        const descriptionTextarea = document.querySelector('#sp_formfield_description');
        if (descriptionTextarea) {
            descriptionTextarea.value = "\n\n\nMade in China TechBar";
            console.log("Added text to description textarea");
            // Trigger change event to ensure Angular model updates
            let event = new Event('change', { bubbles: true });
            descriptionTextarea.dispatchEvent(event);
        }
    }
 
    // Function to repeatedly try clearing the field and adding text
    function persistentClearAndAddText() {
        clearFieldAndAddText();
        setTimeout(clearFieldAndAddText, 500);
        setTimeout(clearFieldAndAddText, 1000);
        setTimeout(clearFieldAndAddText, 1500);
        setTimeout(clearFieldAndAddText, 2000);
    }
 
    // Run the persistent clear and add text function when the page loads
    window.addEventListener('load', persistentClearAndAddText);
 
    // Function to handle the submit button click
    function handleButtonClick(event) {
        event.preventDefault();
        console.log("Submit button clicked");
        setTimeout(function() {
            window.location.href = incidentCreationPageURL;
            console.log("Redirecting to incident creation page");
        }, 2000);
    }
 
    // MutationObserver to detect when the submit button is added to the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const submitButton = document.getElementById('submit-btn');
                if (submitButton) {
                    console.log("Submit button found by MutationObserver");
                    submitButton.addEventListener('click', handleButtonClick);
                    // Stop observing once the button is found and event is attached
                    observer.disconnect();
                }
            }
        });
    });
 
    // Start observing the document for added nodes
    observer.observe(document, {
        childList: true,
        subtree: true
    });
 
    // Redirect to the incident creation page after a period of inactivity
    let inactivityTimeout;
    function resetInactivityTimeout() {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(function() {
            window.location.href = incidentCreationPageURL;
            console.log("Redirecting due to inactivity");
        }, 300000); // 5 minutes of inactivity before refresh
    }
 
    // Reset the inactivity timeout on user interaction
    document.addEventListener('mousemove', resetInactivityTimeout);
    document.addEventListener('keypress', resetInactivityTimeout);
    document.addEventListener('click', resetInactivityTimeout);
    document.addEventListener('scroll', resetInactivityTimeout);
 
    // Initialize the inactivity timeout when the script loads
    resetInactivityTimeout();
})();