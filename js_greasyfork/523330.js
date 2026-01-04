// ==UserScript==
// @name         KnowBe4 Training Accessibility Plugin
// @description  Automates repetitive stress risks incurred by the usual completion of KnowBe4 online training tasks.  By installing and activating this script, you affirm you have read and do agree to the full texts of your trainings.  If you disagree, do not install or enable this script.  Activates automatically upon opening a specific supported training window.
// @include      https://training.knowbe4.com/app/training/*
// @icon         https://training.knowbe4.com/learner/favicon.ico
// @run-at       document-idle
// @author       Whomping Walrus
// @namespace    https://whompingwalr.us/
// @license      MIT
// @version      2025.01.14
// @downloadURL https://update.greasyfork.org/scripts/523330/KnowBe4%20Training%20Accessibility%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/523330/KnowBe4%20Training%20Accessibility%20Plugin.meta.js
// ==/UserScript==

function startClickingNext() {
    let nextButton = document.getElementById('TRAINING-PDF_POLICY_PREVIEW-NEXT_BTN');

    if (!nextButton) {
        console.error('Next button not found, checking again in 50ms');
        setTimeout(startClickingNext, 50);
        return;
    }

    // Rapidly click "Next"
    const intervalId = setInterval(() => {
        nextButton.click();
        
        // Reveal/enable the checkbox
        const showMoreBtn = document.getElementById('TRAINING-PDF_POLICY_PREVIEW-SHOW_MORE_BTN');
        if (showMoreBtn && showMoreBtn.classList.contains('bounce')) {
            showMoreBtn.click();
        }

        // Tick the checkbox
        const customCheckbox = document.querySelector('.custom-checkbox');
        if (customCheckbox) {
          
            clearInterval(intervalId);
            tickCheckbox(customCheckbox);
            
            // Click "SUBMIT" after 75ms if able
            setTimeout(() => {
                const submitButton = document.getElementById('TRAINING-PDF_POLICY_PREVIEW-SUBMIT_BTN');
                if (submitButton && !submitButton.classList.contains('disabled')) {
                    submitButton.click();
                    // Close window upon submit success received
                    checkForSubmissionMessage();
                }
            }, 75);
        }
    }, 15);
}

// Tick the checkbox
function tickCheckbox(checkbox) {
    if (!checkbox.classList.contains('checked')) {
        checkbox.setAttribute('aria-checked', 'true');
        checkbox.dispatchEvent(new Event('click'));
    }
}

// Check for submit success
function checkForSubmissionMessage() {
    const checkInterval = setInterval(() => {
        const submittedMsg = document.querySelector('.submitted-msg');
        if (submittedMsg) {
            clearInterval(checkInterval);
            window.close(); // Close the current window/tab
        }
    }, 50);
}

// Kick it off
startClickingNext();
