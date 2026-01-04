// ==UserScript==
// @name         GitHub Copy Ticket Ref
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button next to issue actions to copy issue ref (e.g. org/repo#123)
// @author       Ryan Allison
// @match        https://github.com/*/*/issues/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532349/GitHub%20Copy%20Ticket%20Ref.user.js
// @updateURL https://update.greasyfork.org/scripts/532349/GitHub%20Copy%20Ticket%20Ref.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const insertButton = () => {
        if (document.getElementById('copy-ticket-ref-btn')) return;

        const pathMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/);
        if (!pathMatch) return;

        const [_, owner, repo, issueNum] = pathMatch;
        const issueRef = `${owner}/${repo}#${issueNum}`;

        // Find the GitHub issue action button container
        const actionContainer = document.querySelector('[data-component="PH_Actions"] .Box-sc-g0xbh4-0');
        if (!actionContainer) return;

        const button = document.createElement('button');
        button.id = 'copy-ticket-ref-btn';
        button.textContent = '📋 Copy Ticket Ref';
        button.className = 'prc-Button-ButtonBase-c50BI'; // Match GitHub style
        button.setAttribute('data-size', 'medium');
        button.setAttribute('data-variant', 'invisible');
        button.style.marginLeft = '8px';

        button.onclick = () => {
            navigator.clipboard.writeText(issueRef);
            button.textContent = '✅ Copied!';
            setTimeout(() => {
                button.textContent = '📋 Copy Ticket Ref';
            }, 2000);
        };

        actionContainer.appendChild(button);
    };

    // Observe DOM for GitHub SPA navigation
    const observer = new MutationObserver(() => {
        insertButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    insertButton();
})();
