// ==UserScript==
// @name         Jira Ticket Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add FDX ticket links to Azure DevOps PR pages
// @author       You
// @match        https://dev.azure.com/peopledx/Flourishdx/_git/Flourishdx.API/pullrequest/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545533/Jira%20Ticket%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/545533/Jira%20Ticket%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fdxRegex = /FDX-\d+/g;
    const pageContent = document.body.innerText;
    const fdxMatches = [...new Set(pageContent.match(fdxRegex))];

    if (fdxMatches.length === 0) return;

    const targetDiv = document.querySelector('.page-content.page-content-top');
    if (!targetDiv) return;

    const container = document.createElement('div');

    fdxMatches.forEach(fdx => {
        const button = document.createElement('a');
        button.href = `https://flourishdx.atlassian.net/browse/${fdx}`;
        button.target = '_blank';
        button.textContent = fdx;
        button.style.cssText = 'display: inline-block; margin: 2px 5px; padding: 5px 10px; background: #FF5722; color: white; text-decoration: none; border-radius: 3px;';
        container.appendChild(button);
    });

    targetDiv.insertBefore(container, targetDiv.firstChild);
})();