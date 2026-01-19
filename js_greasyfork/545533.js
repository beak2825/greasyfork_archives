// ==UserScript==
// @name         Jira Ticket Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add FDX ticket links to Azure DevOps PR pages
// @author       You
// @match        https://dev.azure.com/peopledx/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545533/Jira%20Ticket%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/545533/Jira%20Ticket%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fdxRegex = /FDX-\d+/g;
    const containerId = 'fdx-jira-links';
    let lastMatches = '';

    function addJiraLinks() {
        console.log('[Jira Ticket Link] Polling...', location.href);

        // Only run on PR pages
        if (!location.href.match(/^https:\/\/dev\.azure\.com\/peopledx\/Flourishdx\/_git\/Flourishdx\.API\/pullrequest\//)) {
            console.log('[Jira Ticket Link] URL does not match PR pattern, skipping');
            const existing = document.getElementById(containerId);
            if (existing) existing.remove();
            return;
        }

        const pageContent = document.body.innerText;
        const fdxMatches = [...new Set(pageContent.match(fdxRegex))];
        const matchKey = fdxMatches.join(',');
        console.log('[Jira Ticket Link] Found matches:', fdxMatches);

        // Skip if no matches or matches haven't changed
        if (fdxMatches.length === 0) {
            console.log('[Jira Ticket Link] No FDX matches found');
            const existing = document.getElementById(containerId);
            if (existing) existing.remove();
            lastMatches = '';
            return;
        }

        if (matchKey === lastMatches) {
            const existing = document.getElementById(containerId);
            if (existing) {
                console.log('[Jira Ticket Link] Matches unchanged, buttons present');
                return;
            }
            console.log('[Jira Ticket Link] Matches unchanged but buttons missing, re-adding');
        }
        lastMatches = matchKey;
        console.log('[Jira Ticket Link] Matches changed, updating DOM');

        // Remove existing container
        const existing = document.getElementById(containerId);
        if (existing) existing.remove();

        const targetDiv = document.querySelector('.page-content.page-content-top');
        if (!targetDiv) {
            console.log('[Jira Ticket Link] Target div .page-content.page-content-top not found');
            return;
        }
        console.log('[Jira Ticket Link] Target div found, inserting links');

        const container = document.createElement('div');
        container.id = containerId;

        fdxMatches.forEach(fdx => {
            const button = document.createElement('a');
            button.href = `https://flourishdx.atlassian.net/browse/${fdx}`;
            button.target = '_blank';
            button.textContent = fdx;
            button.style.cssText = 'display: inline-block; margin: 2px 5px; padding: 5px 10px; background: #FF5722; color: white; text-decoration: none; border-radius: 3px;';
            container.appendChild(button);
        });

        targetDiv.insertBefore(container, targetDiv.firstChild);
    }

    setInterval(addJiraLinks, 500);
})();
