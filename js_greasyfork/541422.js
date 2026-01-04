// ==UserScript==
// @name         GitHub to Jira Ticket Link
// @version      1.O
// @description  Add a Jira link based on the GitHub pull request title in a GitHub pag
// @author       Liam Verschueren
// @match        https://github.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1490907
// @downloadURL https://update.greasyfork.org/scripts/541422/GitHub%20to%20Jira%20Ticket%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/541422/GitHub%20to%20Jira%20Ticket%20Link.meta.js
// ==/UserScript==

// Wait for an array of elements to appear on the DOM
const waitForElements = (selectors, callback, continuePolling = false, interval = 100) => {
    // Ensure selectors is always an array (if it's a single string, convert it to an array)
    if (!Array.isArray(selectors)) {
        selectors = [selectors];
    }

    // Get all elements
    const elements = selectors.map(selector => document.querySelector(selector));

    // Check if all selectors are found
    if (elements.every(element => element !== null)) {
        // If all elements are found, invoke the callback and pass the elements as arguments
        callback(...elements);

        // If continuePolling is false, stop further polling
        if (!continuePolling) {
            return;
        }
    }
    setTimeout(() => waitForElements(selectors, callback, continuePolling, interval), interval);
};

(function() {
    'use strict';

    function extractTicketId(titleText) {
        const regex = /([A-Z0-9]+)-(\d+)/;
        const match = titleText.match(regex);
        return match ? match[0] : null;
    }

    function addJiraLink(titleElement,tabNav) {
        const existingLink = document.querySelector('.tabnav-tab.jira-link');
        if (existingLink) {
            return;
        }

        const ticketId = extractTicketId(titleElement.textContent);
        const jiraLink = document.createElement('a');
        jiraLink.href = `https://callista-tools.atlassian.net/browse/${ticketId}`;
        jiraLink.textContent = `Jira: ${ticketId}`;
        jiraLink.target = "_blank";
        jiraLink.rel = "noopener noreferrer";
        jiraLink.classList.add('tabnav-tab', 'flex-shrink-0', 'jira-link');
        tabNav.appendChild(jiraLink);
    }

    // Most git repo pages
    waitForElements(['.js-issue-title', '.tabnav-tabs'], (titleElement, tabNav) => {
        addJiraLink(titleElement, tabNav);
    }, true);

    // Commits page
    waitForElements(['.markdown-title', 'div[role="tablist"]'], (titleElement, tabNav) => {
        addJiraLink(titleElement, tabNav);
    }, true);
})();
