// ==UserScript==
// @name         Autowatch on start programming
// @version      1.1
// @description  Clicks the watcher button when start programming
// @author       Liam Verschueren
// @match        https://callista-tools.atlassian.net/*
// @grant        none
// @namespace https://greasyfork.org/users/1490907
// @downloadURL https://update.greasyfork.org/scripts/545668/Autowatch%20on%20start%20programming.user.js
// @updateURL https://update.greasyfork.org/scripts/545668/Autowatch%20on%20start%20programming.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait-for-elements function
    const waitForElements = (selectors, callback, continuePolling = false, interval = 100) => {
        if (!Array.isArray(selectors)) {
            selectors = [selectors];
        }
        const elements = selectors.map(selector => document.querySelector(selector));
        if (elements.every(element => element !== null)) {
            callback(...elements);
            if (!continuePolling) {
                return;
            }
        }
        setTimeout(() => waitForElements(selectors, callback, continuePolling, interval), interval);
    };

    // Main logic
    waitForElements([
        'button[id="issue.fields.status-view.status-button"]',
        'button[data-testid="issue.watchers.action-button.root"]'
    ], (statusButton, watchButton) => {

        const hasProgrammingText = statusButton.ariaLabel.includes('Programming');
        const alreadyWatching = watchButton.ariaLabel.includes('You are watching this issue')
        const assignMeLink = document.querySelector('div[data-testid="issue-field-assignee-assign-to-me.ui.assign-to-me.link"]')
        if (hasProgrammingText && !alreadyWatching && !assignMeLink) {
            watchButton.click();
        }

    }, true, 1000);

})();
