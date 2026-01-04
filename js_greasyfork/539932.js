// ==UserScript==
// @name         Gmail Single Email View
// @namespace    http://tampermonkey.net/
// @version      2.0 // Incremented version to signify major bug fix for counter
// @description  Shows one email at a time in Gmail inbox, with enhanced email detection and accurate counter for empty inbox.
// @author       Your Name
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539932/Gmail%20Single%20Email%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/539932/Gmail%20Single%20Email%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let emailRows = [];
    let currentIndex = 0;
    let navControls;
    let prevBtn, nextBtn, countDisplay;
    let observer = null;
    let updateTimeoutId = null;
    let isPluginInitialized = false; // Flag to ensure initialization runs only once

    /**
     * Injects necessary CSS into the Gmail page to ensure elements can be hidden and essential UI remains visible.
     */
    function injectCss() {
        const styleId = 'single-email-view-style';
        if (document.getElementById(styleId)) {
            return; // Style already injected
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Styling for the plugin's navigation buttons */
            #single-email-nav-controls {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000; /* Ensure it's above Gmail's UI */
                display: flex;
                gap: 10px;
                background-color: #fff;
                padding: 10px 20px;
                border-radius: 12px; /* Rounded corners */
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Soft shadow */
                border: 1px solid #ddd;
            }

            #single-email-nav-controls button {
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                border: none;
                border-radius: 8px; /* Rounded corners for buttons */
                background-color: #4285f4; /* Gmail blue */
                color: white;
                transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            #single-email-nav-controls button:hover {
                background-color: #357ae8; /* Darker blue on hover */
                transform: translateY(-1px);
            }

            #single-email-nav-controls button:active {
                background-color: #2a6ac3;
                transform: translateY(0);
                box-shadow: none;
            }

            #single-email-nav-controls button:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
                box-shadow: none;
            }

            /* Styling for the current email count display */
            #email-count-display {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 80px;
                padding: 0 10px;
                font-weight: bold;
                color: #333;
            }

            /* IMPORTANT: Only hide email rows with this class to avoid hiding everything */
            .single-email-hidden {
                display: none !important;
            }

            /* Ensure essential Gmail UI components (like sidebars, toolbars) remain visible */
            .nH.nn.aKz { /* Pagination/toolbar at the bottom */
                display: flex !important; /* This should generally be flex */
            }
            .G-atb, .Cp { /* Top toolbar and category tabs */
                display: block !important; /* These are usually block or flex */
            }

            /* Explicitly ensure left navigation sidebar is visible (but let internal layout be managed by Gmail) */
            div[role="navigation"] { /* The main navigation sidebar container */
                display: block !important;
            }
        `;
        document.head.appendChild(style);
        console.log('Gmail Single Email View: Injected CSS styles.');
    }

    /**
     * Initializes the Gmail Single Email View plugin.
     * Creates navigation controls using createElement to avoid TrustedHTML issues.
     */
    function initGmailSingleEmailView() {
        if (isPluginInitialized) {
            console.log('Gmail Single Email View: Plugin already initialized, skipping.');
            return;
        }

        console.log('Gmail Single Email View: Initializing plugin interface...');
        injectCss(); // Ensure CSS is injected first

        navControls = document.getElementById('single-email-nav-controls');
        if (!navControls) {
            navControls = document.createElement('div');
            navControls.id = 'single-email-nav-controls';
            document.body.appendChild(navControls);
            console.log('Gmail Single Email View: Navigation controls container created and appended.');

            // Create buttons and display element separately and append them
            prevBtn = document.createElement('button');
            prevBtn.id = 'prevEmailBtn';
            prevBtn.textContent = 'Previous';
            prevBtn.disabled = true; // Start disabled
            navControls.appendChild(prevBtn);

            countDisplay = document.createElement('div');
            countDisplay.id = 'email-count-display';
            navControls.appendChild(countDisplay);

            nextBtn = document.createElement('button');
            nextBtn.id = 'nextEmailBtn';
            nextBtn.textContent = 'Next';
            nextBtn.disabled = true; // Start disabled
            navControls.appendChild(nextBtn);

            console.log('Gmail Single Email View: Navigation buttons and display element created and appended.');

        } else {
            console.log('Gmail Single Email View: Navigation controls already exist.');
            // If controls exist, just get references
            prevBtn = document.getElementById('prevEmailBtn');
            nextBtn = document.getElementById('nextEmailBtn');
            countDisplay = document.getElementById('email-count-display');
        }

        addEventListeners();
        updateEmailList();
        isPluginInitialized = true; // Set flag after successful initialization
    }

    /**
     * Adds event listeners to the navigation buttons.
     */
    function addEventListeners() {
        if (prevBtn && !prevBtn.hasAttribute('data-listener-added')) {
            prevBtn.onclick = showPreviousEmail;
            prevBtn.setAttribute('data-listener-added', 'true');
            console.log('Gmail Single Email View: Previous button event listener added.');
        }
        if (nextBtn && !nextBtn.hasAttribute('data-listener-added')) {
            nextBtn.onclick = showNextEmail;
            nextBtn.setAttribute('data-listener-added', 'true');
            console.log('Gmail Single Email View: Next button event listener added.');
        }
    }

    /**
     * Resets the plugin state when no emails are found.
     * This ensures the counter correctly displays "No Emails Found".
     */
    function resetPluginState() {
        emailRows = []; // Clear the list of emails
        currentIndex = 0; // Reset index
        console.log('Gmail Single Email View: Resetting plugin state: no emails found.');
        showEmail(0); // This will ensure all hidden emails are revealed, and internal display logic runs
        updateButtonStates();
        updateCountDisplay();
    }

    /**
     * Updates the list of email rows and displays the current email.
     */
    function updateEmailList() {
        console.log('Gmail Single Email View: Scanning for email rows...');
        let potentialEmailRows = [];

        // Check if the "No new emails!" message is present
        const noEmailsMessage = document.querySelector('div[role="main"] .nH.nZ.nn');
        if (noEmailsMessage && noEmailsMessage.textContent.includes('No new emails!')) {
            console.log('Gmail Single Email View: "No new emails!" message detected.');
            resetPluginState(); // Call the dedicated reset function
            return; // Exit early as there are no emails to process
        }

        // Primary selector based on your provided HTML structure
        potentialEmailRows = Array.from(document.querySelectorAll('tr.zA.yO[role="row"]:has([role="checkbox"])'));
        console.log(`Gmail Single Email View: Found ${potentialEmailRows.length} potential email rows with primary selector (tr.zA.yO[role="row"]:has([role="checkbox"])).`);

        // If primary selector finds few or none, try other common patterns in Gmail
        if (potentialEmailRows.length === 0 || potentialEmailRows.length < 5) {
            console.log('Gmail Single Email View: Primary selector found few/no rows, trying alternative selectors...');
            // Fallback to more general selectors if the primary one isn't fruitful
            let altRows = Array.from(document.querySelectorAll('div[role="main"] tr[role="row"], .AO > .xY, [aria-labelledby^="thread_"], [aria-labelledby^="msg_"]'));
            // Only use altRows if they find more results
            if (altRows.length > potentialEmailRows.length) {
                potentialEmailRows = altRows;
                console.log(`Gmail Single Email View: Found ${potentialEmailRows.length} rows with alternative combined selectors.`);
            }
        }

        // Filter out non-email rows (e.g., header, pagination, ads, empty message rows, non-email UI elements)
        emailRows = potentialEmailRows.filter(row => {
            // Check for elements characteristic of an actual email row:
            const hasCheckbox = row.querySelector('[role="checkbox"]');
            const hasGridcell = row.querySelector('[role="gridcell"]');
            const isColumnHeader = row.querySelector('[role="columnheader"]');

            // More robust subject/sender checks based on your HTML
            const hasSubject = row.querySelector('.bog, .ts, .y6');
            const hasSender = row.querySelector('.yP, .zF, .go');

            // The row should look like email content AND not be a header.
            // Require at least a checkbox, a gridcell, and EITHER a subject/sender.
            const isEmailContentRow = hasCheckbox && hasGridcell && (hasSubject || hasSender) && !isColumnHeader;

            // Explicitly exclude known non-email rows or UI elements that might get caught by broad selectors
            const isKnownNonEmailUI = row.classList.contains('Cp') ||
                                     row.classList.contains('nH') ||
                                     row.classList.contains('G-atb') ||
                                     row.classList.contains('Bu') ||
                                     row.querySelector('.aeJ') ||
                                     row.matches('.ads, .AP');

            if (!isEmailContentRow || isKnownNonEmailUI) {
                // console.log('Gmail Single Email View: Filtering out non-email row (lacks essential email characteristics or is known UI element):', row.outerHTML);
            }
            return isEmailContentRow && !isKnownNonEmailUI;
        });

        console.log(`Gmail Single Email View: Filtered down to ${emailRows.length} actual email rows.`);

        // After filtering, if no emails are found, reset the plugin state
        if (emailRows.length === 0) {
            console.log('Gmail Single Email View: Filtered result is 0 emails. Calling resetPluginState.');
            resetPluginState();
        } else {
            // If emails are found, proceed with normal display logic
            // Adjust currentIndex if it's out of bounds after filtering
            if (currentIndex >= emailRows.length) {
                currentIndex = emailRows.length - 1;
            } else if (currentIndex < 0) {
                currentIndex = 0;
            }
            showEmail(currentIndex);
            updateButtonStates();
            updateCountDisplay();
        }
    }

    /**
     * Shows only the email at the given index and hides all others.
     * @param {number} index - The index of the email to show.
     */
    function showEmail(index) {
        // Always ensure ALL previously hidden emails are made visible before re-hiding
        document.querySelectorAll('.single-email-hidden').forEach(el => el.classList.remove('single-email-hidden'));

        if (emailRows.length === 0) {
            console.log('No email rows found to display, ensuring all elements are visible and buttons disabled.');
            updateButtonStates(); // Ensure buttons are disabled
            updateCountDisplay(); // Ensure counter says "No Emails Found"
            return; // No emails to show, so nothing to hide
        }

        if (index < 0 || index >= emailRows.length) {
            console.warn(`Attempted to show email at invalid index: ${index}. Clamping to valid range.`);
            index = Math.max(0, Math.min(index, emailRows.length - 1));
        }

        emailRows.forEach((row, i) => {
            if (i === index) {
                row.classList.remove('single-email-hidden');
                row.style.display = ''; // Ensure display is not explicitly set to none by previous operation
            } else {
                row.classList.add('single-email-hidden');
            }
        });
        currentIndex = index;
        updateButtonStates();
        updateCountDisplay();
        console.log(`Showing email ${currentIndex + 1} of ${emailRows.length}.`);
    }

    /**
     * Shows the next email in the list.
     */
    function showNextEmail() {
        if (currentIndex < emailRows.length - 1) {
            console.log('Moving to next email...');
            showEmail(currentIndex + 1);
        } else {
            console.log('Already at the last email.');
        }
    }

    /**
     * Shows the previous email in the list.
     */
    function showPreviousEmail() {
        if (currentIndex > 0) {
            console.log('Moving to previous email...');
            showEmail(currentIndex - 1);
        } else {
            console.log('Already at the first email.');
        }
    }

    /**
     * Updates the disabled state of the navigation buttons.
     */
    function updateButtonStates() {
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0 || emailRows.length === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= emailRows.length - 1 || emailRows.length === 0;
        }
    }

    /**
     * Updates the display showing current email index and total count.
     */
    function updateCountDisplay() {
        if (countDisplay) {
            countDisplay.textContent = emailRows.length > 0 ? `${currentIndex + 1} / ${emailRows.length}` : 'No Emails Found';
        }
    }

    /**
     * Observes the DOM for changes in Gmail.
     * This function now observes the entire document body for stability.
     */
    function setupMutationObserver() {
        // Disconnect existing observer if it exists to prevent duplicates
        if (observer) {
            observer.disconnect();
            console.log('Gmail Single Email View: Disconnected existing observer.');
        }
        isPluginInitialized = false; // Reset initialization flag on new observer setup

        // Observe the entire document body for maximum robustness
        observer = new MutationObserver((mutations) => {
            // Check for relevant changes that would impact email list
            const relevantChange = mutations.some(mutation =>
                mutation.addedNodes.length > 0 && Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.matches('tr.zA.yO[role="row"]') || node.matches('.nH.nZ.nn')) // Check for new email rows or "No new emails!" message
                ) ||
                mutation.removedNodes.length > 0 && Array.from(mutation.removedNodes).some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.matches('tr.zA.yO[role="row"]') || node.matches('.nH.nZ.nn'))
                ) ||
                // Also trigger if the immediate parent of email rows (the tbody or table) changes its children
                (mutation.type === 'childList' && (mutation.target.matches('tbody') || mutation.target.matches('table.F.cf.zt')))
            );


            // Only re-scan if a relevant change occurred
            if (relevantChange) {
                clearTimeout(updateTimeoutId);
                updateTimeoutId = setTimeout(() => {
                    console.log('Gmail Single Email View: DOM changes detected, re-scanning emails...');
                    initGmailSingleEmailView(); // Re-initialize to ensure state and elements are correct
                }, 500);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });
        console.log('Gmail Single Email View: Started observing document.body for changes.');
        // Initial call to initGmailSingleEmailView
        initGmailSingleEmailView();
    }

    // Initial setup attempts
    window.addEventListener('load', setupMutationObserver);
    document.addEventListener('DOMContentLoaded', setupMutationObserver);

    // Fallback for immediate execution if DOM is already ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setupMutationObserver();
    }

})();
