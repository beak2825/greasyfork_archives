// ==UserScript==
// @name         LinkedIn Job Info Copier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to copy LinkedIn job post information to the clipboard.
// @author       Lich_Amnesia
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534582/LinkedIn%20Job%20Info%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/534582/LinkedIn%20Job%20Info%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'copy-job-info-button';
    const BUTTON_TEXT = '📋 Copy Job Info';
    const BUTTON_COPIED_TEXT = '✅ Copied!';

    // --- Helper function to safely get text content ---
    function safeGetText(selector, element = document) {
        try {
            const el = element.querySelector(selector);
            // Prioritize innerText for better representation of rendered text, fallback to textContent
            return el ? (el.innerText || el.textContent || '').trim() : 'N/A';
        } catch (e) {
            console.error(`Error getting text for selector "${selector}":`, e);
            return 'Error';
        }
    }

    // --- Helper function to safely get text from multiple elements ---
     function safeGetAllText(selector, separator = '\n- ', element = document) {
        try {
            const els = element.querySelectorAll(selector);
            if (els.length === 0) return 'N/A';
            return Array.from(els).map(el => (el.innerText || el.textContent || '').trim()).filter(Boolean).join(separator);
        } catch (e) {
            console.error(`Error getting all text for selector "${selector}":`, e);
            return 'Error';
        }
    }

    // --- Function to extract job details ---
    function getJobInfo() {
        const topCardSelector = '.job-details-jobs-unified-top-card__container--two-pane'; // More specific container
        const topCardElement = document.querySelector(topCardSelector);

        if (!topCardElement) {
             console.warn("LinkedIn Job Info Copier: Top card element not found yet.");
             return null; // Element not ready
        }


        const jobTitle = safeGetText('.job-details-jobs-unified-top-card__job-title h1 a', topCardElement) || safeGetText('.job-details-jobs-unified-top-card__job-title h1', topCardElement); // Handle both cases h1>a or just h1
        const companyName = safeGetText('.job-details-jobs-unified-top-card__company-name a', topCardElement);
        const tertiaryInfo = safeGetText('.job-details-jobs-unified-top-card__primary-description-container .job-details-jobs-unified-top-card__tertiary-description-container', topCardElement).replace(/\s*·\s*/g, ' | '); // Location, Posted, Applicants

        // Extract pills (Salary, Hybrid, Full-time etc.)
        const pillsRaw = safeGetAllText('.job-details-preferences-and-skills__pill span.ui-label', topCardElement, ' | ');
        // Attempt to split Salary/Benefits from other pills if structure is consistent
        let salary = 'N/A';
        let detailsPills = [];
        const pillElements = topCardElement.querySelectorAll('.job-details-preferences-and-skills__pill span.ui-label');
        pillElements.forEach(pill => {
            const text = (pill.innerText || pill.textContent || '').trim();
            if (text.includes('$') || text.toLowerCase().includes('salary') || text.toLowerCase().includes('/yr')) {
                salary = text;
            } else if (!text.toLowerCase().includes('skills match')) { // Exclude the 'skills match' pill
                detailsPills.push(text);
            }
        });
        const otherDetails = detailsPills.join(' | ') || 'N/A';


        // Job Description
        const jobDescriptionElement = document.querySelector('#job-details .jobs-box__html-content') || document.querySelector('#job-details'); // Try specific content div first
        let jobDescription = 'N/A';
        if (jobDescriptionElement) {
            // Clone to avoid modifying the original, remove the "About the job" heading if present
            const clone = jobDescriptionElement.cloneNode(true);
            const heading = clone.querySelector('h2');
            if (heading && (heading.innerText || heading.textContent || '').trim().toLowerCase() === 'about the job') {
                heading.remove();
            }
             // Try to get innerText for better formatting, fallback to textContent
            jobDescription = (clone.innerText || clone.textContent || '').trim().replace(/\n{3,}/g, '\n\n'); // Reduce excessive newlines
        }


        const jobUrl = window.location.href;

        // Format the output
        const formattedInfo = `Job Title: ${jobTitle}\n` +
                              `Company: ${companyName}\n` +
                              `Location/Info: ${tertiaryInfo}\n` +
                              `Salary/Compensation: ${salary}\n` +
                              `Type/Mode: ${otherDetails}\n` +
                              `URL: ${jobUrl}\n\n` +
                              `---------------- Job Description ----------------\n` +
                              `${jobDescription}`;

        return formattedInfo;
    }

    // --- Function to copy text to clipboard and provide feedback ---
    function copyInfoToClipboard(button) {
        const jobInfoText = getJobInfo();
        if (!jobInfoText) {
             alert("Could not extract job information. The page structure might have changed or not fully loaded.");
             return;
        }

        GM_setClipboard(jobInfoText, 'text');

        // Provide feedback
        const originalText = button.textContent;
        button.textContent = BUTTON_COPIED_TEXT;
        button.disabled = true;
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('copied');
        }, 2000); // Revert after 2 seconds
    }

    // --- Function to create and add the button ---
    function addCopyButton() {
         // Check if button already exists
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        // Find the container for the "Easy Apply" / "Save" buttons within the top card
        // Look for the div containing buttons like '.jobs-apply-button' or '.jobs-save-button'
        const buttonContainer = document.querySelector('.job-details-jobs-unified-top-card__container--two-pane .mt4 .display-flex');

        if (buttonContainer) {
            const copyButton = document.createElement('button');
            copyButton.id = BUTTON_ID;
            copyButton.textContent = BUTTON_TEXT;
            // Try to mimic LinkedIn button styles
            copyButton.className = 'artdeco-button artdeco-button--secondary artdeco-button--3'; // Using secondary style like 'Save'
            copyButton.style.marginLeft = '8px'; // Add some space

            copyButton.addEventListener('click', () => {
                copyInfoToClipboard(copyButton);
            });

            // Insert after the Easy Apply button if it exists, otherwise append
            const applyButton = buttonContainer.querySelector('.jobs-s-apply');
             if (applyButton && applyButton.nextSibling) {
                 buttonContainer.insertBefore(copyButton, applyButton.nextSibling);
             } else if (applyButton) {
                 buttonContainer.appendChild(copyButton); // Append if apply is last
             }
             else {
                // Fallback: just append if structure is unexpected
                 buttonContainer.appendChild(copyButton);
            }
            console.log("LinkedIn Job Info Copier: Button added successfully.");

        } else {
            console.warn("LinkedIn Job Info Copier: Button container not found. Cannot add button.");
        }
    }

    // --- Add custom styles for the button ---
    GM_addStyle(`
        #${BUTTON_ID} {
            /* Add any specific overrides if needed */
            cursor: pointer;
        }
        #${BUTTON_ID}.copied {
            background-color: #dff0d8 !important; /* Light green background */
            color: #3c763d !important; /* Darker green text */
            border-color: #d6e9c6 !important;
        }
    `);

    // --- Use MutationObserver to wait for the job details section to load ---
    // LinkedIn loads content dynamically, so we need to wait.
    const observerTargetSelector = '.job-view-layout.jobs-details'; // Main container for job view
    let observer = null;

    function startObserver() {
        const targetNode = document.querySelector(observerTargetSelector);
        if (!targetNode) {
            // If the main container isn't even there yet, wait a bit longer
             console.log("LinkedIn Job Info Copier: Waiting for main job view container...");
             setTimeout(startObserver, 500);
             return;
        }

        console.log("LinkedIn Job Info Copier: Observer started.");
        observer = new MutationObserver((mutationsList, obs) => {
            // Check if the button container is now available and the button isn't already added
            const buttonContainer = document.querySelector('.job-details-jobs-unified-top-card__container--two-pane .mt4 .display-flex');
             if (buttonContainer && !document.getElementById(BUTTON_ID)) {
                 console.log("LinkedIn Job Info Copier: Target container appeared, adding button.");
                 addCopyButton();
                 // Optional: Could disconnect observer here if the button container won't be removed/re-added
                 // obs.disconnect();
             }
             // Also check if the job description is loaded, sometimes it loads later
             const description = document.querySelector('#job-details .jobs-box__html-content');
              if (description && buttonContainer && !document.getElementById(BUTTON_ID)) {
                   console.log("LinkedIn Job Info Copier: Description appeared, ensuring button exists.");
                   addCopyButton(); // Try adding again just in case
             }
        });

        observer.observe(targetNode, {
            childList: true, // Watch for additions/removals of children
            subtree: true    // Watch descendants as well
        });

         // Initial attempt in case content is already present when script runs
         addCopyButton();
    }

    // --- Start the process ---
    // Use window.onload or setTimeout as a fallback if observer setup fails immediately
     if (document.readyState === 'complete') {
         startObserver();
     } else {
         window.addEventListener('load', startObserver);
     }
     // Extra fallback timeout
      setTimeout(addCopyButton, 3000); // Attempt to add after 3 seconds regardless


})();