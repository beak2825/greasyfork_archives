// ==UserScript==
// @name         Jira Ticket Link
// @namespace    http://tampermonkey.net/
// @version      0.3
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
        // Only run on PR pages
        if (!location.href.match(/^https:\/\/dev\.azure\.com\/peopledx\/Flourishdx\/_git\/Flourishdx\.API\/pullrequest\//)) {
            const existing = document.getElementById(containerId);
            if (existing)
                existing.remove();
            return;
        }
        const headerElement = document.querySelector('.repos-pr-header');
        if (!headerElement)
            return;
        const headerContent = headerElement.textContent || '';
        const fdxMatches = [...new Set(headerContent.match(fdxRegex) || [])];
        const matchKey = fdxMatches.join(',');
        // Skip if no matches or matches haven't changed
        if (fdxMatches.length === 0) {
            const existing = document.getElementById(containerId);
            if (existing)
                existing.remove();
            lastMatches = '';
            return;
        }
        if (matchKey === lastMatches) {
            const existing = document.getElementById(containerId);
            if (existing)
                return;
        }
        lastMatches = matchKey;
        // Remove existing container
        const existing = document.getElementById(containerId);
        if (existing)
            existing.remove();
        const targetDiv = document.querySelector('.page-content.page-content-top');
        if (!targetDiv)
            return;
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
