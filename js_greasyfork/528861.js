// ==UserScript==
// @name         GitLab auto reviewers
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically add reviewers to GitLab merge requests
// @author       Mohammad Sh
// @match        https://gitlab.com/*/*/-/merge_requests/*/*
// @match        https://gitlab.com/*/*/-/merge_requests/new*
// @match        https://gitlab.com/*/merge_requests/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528861/GitLab%20auto%20reviewers.user.js
// @updateURL https://update.greasyfork.org/scripts/528861/GitLab%20auto%20reviewers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== Configuration =====
    
    // List of reviewers to add (usernames)
    const backendReviewers = [
        'mshabibR365',       
    ];
    
    // Timing configuration (in milliseconds)
    const TIMING = {
        SHORT_DELAY: 200,      // Short delay for UI updates
        MAX_WAIT_TIME: 5000,   // Maximum wait time for search results
    };

    // CSS selectors for GitLab UI elements
    const SELECTORS = {
        REVIEWER_BLOCK: '.block.reviewer',
        DROPDOWN: '.reviewers-dropdown.gl-ml-auto.gl-new-dropdown',
        DROPDOWN_BUTTON: 'button',
        SEARCH_INPUT: '.gl-listbox-search-input',
        DROPDOWN_ITEM: '.gl-new-dropdown-item',
        USERNAME_ELEMENT: '.gl-text-subtle',
        ASSIGNEE_BLOCK: '.block.assignee'
    };

    // ===== Helper Functions =====
    
    /**
     * Sleep for a specified amount of time
     * @param {number} ms - Time to sleep in milliseconds
     * @returns {Promise} - Promise that resolves after the specified time
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    /**
     * Log a message with a timestamp
     * @param {string} message - Message to log
     * @param {string} type - Log type (log, error, warn)
     */
    const log = (message, type = 'log') => {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        console[type](`[${timestamp}] GitLab Auto Reviewers: ${message}`);
    };
    
    /**
     * Find an element in the DOM
     * @param {string} selector - CSS selector
     * @returns {Element|null} - Found element or null
     */
    const findElement = (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
            log(`Element not found: ${selector}`, 'error');
        }
        return element;
    };
    
    /**
     * Click on the reviewers dropdown button
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    const clickReviewersDropdown = async () => {
        const dropdown = document.querySelector(SELECTORS.DROPDOWN);
        if (!dropdown) {
            log('Reviewers dropdown not found', 'error');
            return false;
        }
        
        const button = dropdown.querySelector(SELECTORS.DROPDOWN_BUTTON);
        if (!button) {
            log('Dropdown button not found', 'error');
            return false;
        }
        
        button.click();
        await sleep(TIMING.SHORT_DELAY);
        return true;
    };
    
    /**
     * Search for a reviewer in the dropdown
     * @param {string} reviewer - Reviewer username to search for
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    const searchForReviewer = async (reviewer) => {
        // Find the search input
        const searchInput = findElement(SELECTORS.SEARCH_INPUT);
        if (!searchInput) return false;
        
        // Clear any previous search
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(TIMING.SHORT_DELAY);
        
        // Enter the reviewer name
        searchInput.value = reviewer;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        return true;
    };
    
    /**
     * Find and click on a reviewer in the dropdown
     * @param {string} reviewer - Reviewer username to find
     * @returns {Promise<boolean>} - True if found and clicked, false otherwise
     */
    const findAndClickReviewer = async (reviewer) => {
        const startTime = Date.now();
        
        while (Date.now() - startTime < TIMING.MAX_WAIT_TIME) {
            const listItems = document.querySelectorAll(SELECTORS.DROPDOWN_ITEM);
            
            for (const item of listItems) {
                const nameElement = item.querySelector(SELECTORS.USERNAME_ELEMENT);
                
                if (nameElement && nameElement.textContent.trim().toLowerCase().includes(reviewer.toLowerCase())) {
                    log(`Found reviewer: ${reviewer}`);
                    item.click();
                    return true;
                }
            }
            
            // Wait 100ms before trying again
            await sleep(100);
        }
        
        log(`Reviewer not found: ${reviewer}`, 'error');
        return false;
    };
    
    /**
     * Add a single reviewer
     * @param {string} reviewer - Reviewer username to add
     * @returns {Promise<boolean>} - True if successful, false otherwise
     */
    const addReviewer = async (reviewer) => {
        try {
            
            // Search for the reviewer
            if (!await searchForReviewer(reviewer)) return false;
            
            // Find and click on the reviewer
            return await findAndClickReviewer(reviewer);
        } catch (error) {
            log(`Error adding reviewer ${reviewer}: ${error.message}`, 'error');
            return false;
        }
    };
    
    /**
     * Add multiple reviewers
     * @param {string[]} reviewers - List of reviewer usernames to add
     * @returns {Promise<void>}
     */
    const addReviewers = async (reviewers) => {
        log(`Starting to add ${reviewers.length} reviewers`);
        
        for (const reviewer of reviewers) {
            await addReviewer(reviewer);
        }
        
        // Close the dropdown
        await clickReviewersDropdown();       
        const assigneeBlock = findElement(SELECTORS.ASSIGNEE_BLOCK);
        if (assigneeBlock) {
            assigneeBlock.click();
        }
        
        log('Finished adding reviewers');
    };
    
    /**
     * Create a button to add reviewers
     * @param {string} repoName - Name to display on the button
     * @param {string[]} reviewers - List of reviewer usernames to add
     * @param {string} backgroundColor - Button background color
     * @param {string} textColor - Button text color
     * @returns {HTMLButtonElement} - Created button
     */
    const createButton = (repoName, reviewers, backgroundColor, textColor) => {
        const button = document.createElement("button");
        button.innerHTML = `Add ${repoName} reviewers`;
        button.style = `
            background: ${backgroundColor}; 
            color: ${textColor}; 
            margin: 1em;
            padding: 0.5em 1em;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        `;
        
        button.onclick = (event) => {
            event.stopPropagation();
            event.preventDefault();
            
            addReviewers(reviewers).catch(err => {
                log(`Error in add reviewers process: ${err.message}`, 'error');
            });
        };
        
        return button;
    };
    
    // ===== Main Initialization =====
    
    // Find the reviewer block
    const reviewerBlock = findElement(SELECTORS.REVIEWER_BLOCK);
    if (!reviewerBlock) {
        log('Reviewer block not found, script will not run', 'error');
        return;
    }
    
    // Create and add the button
    const backendReviewersButton = createButton('', backendReviewers, 'lime', 'black');
    reviewerBlock.appendChild(backendReviewersButton);
    
    log('GitLab Auto Reviewers script initialized');
})();
