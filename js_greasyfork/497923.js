// ==UserScript==
// @name         LinkedIn Easy Apply Unfollow & Automate Submit/Close Windows
// @namespace    https://github.com/1LineAtaTime/TamperMonkey-Scripts
// @version      0.4
// @description  Automatically unclicks the Follow button in the Easy Apply application, and automates the process of submitting and closing the application once all the information has been entered.
// @author       1LineAtaTime
// @license      MIT
// @match        https://*.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?domain=linkedin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497923/LinkedIn%20Easy%20Apply%20Unfollow%20%20Automate%20SubmitClose%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/497923/LinkedIn%20Easy%20Apply%20Unfollow%20%20Automate%20SubmitClose%20Windows.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let submitted = true;

    function checkFollowCheckbox() {
        // Find the label with for="follow-company-checkbox" and text "Follow "
        const followLabel = Array.from(document.querySelectorAll('label[for="follow-company-checkbox"][class="t-14 t-black--light"]')).find(label =>
                                                                                                                                            label.textContent.trim().includes("Follow ")
                                                                                                                                           );

        if (followLabel) {
            const followCheckbox = document.querySelector('#follow-company-checkbox');
            if (followCheckbox && followCheckbox.checked) {
                console.log('Follow checkbox found checked and unselected.');
                followCheckbox.click();
            }

            // go ahead and also hit submit application
            const submitButton = document.querySelector('button[class="artdeco-button artdeco-button--2 artdeco-button--primary ember-view"][aria-label="Submit application"]'); // Update this selector if needed

            if (submitButton) {
                console.log('Submit application button found, clicking...');
                submitButton.click();
                submitted = true;
            }

        }

        // Check if the "Application sent" header is present
        const applicationSentHeaderA = document.querySelector('h2#post-apply-modal');
        const applicationSentHeaderB = document.querySelector('h3.jpac-modal-header');

        if (applicationSentHeaderA && applicationSentHeaderA.textContent.includes('Application sent')) {
            // Find the "Done" button
            const doneButton = Array.from(document.querySelectorAll('button.artdeco-button')).find(button =>
                                                                                                   button.textContent.trim() === 'Done'
                                                                                                  );

            if (doneButton && submitted) {
                console.log('Done button found and clicked.');
                doneButton.click();
                submitted = false;
            }
        } else if (applicationSentHeaderA && applicationSentHeaderA.textContent.includes('Added to your applied jobs')) {
            // Find the "Dismiss" button
            const dismissButton = document.querySelector('button[aria-label="Dismiss"]');
            if (dismissButton) {
                console.log('Dismiss button found and clicked.');
                dismissButton.click();
            }
        } else if (applicationSentHeaderB && applicationSentHeaderB.textContent.includes('Your application was sent to ')) {
            // Find the "Dismiss" button
            const dismissButton = document.querySelector('button[aria-label="Dismiss"]');
            if (dismissButton) {
                console.log('Dismiss button found and clicked.');
                dismissButton.click();
            }
        }


    }

    // Observe changes in the DOM to detect when the checkbox appears
    const observer = new MutationObserver(() => {
        checkFollowCheckbox();
    });

    // Start observing the body for changes in the subtree and child nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the checkbox is already present when the script loads
    checkFollowCheckbox();
})();
