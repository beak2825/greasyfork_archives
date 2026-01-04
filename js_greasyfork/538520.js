// ==UserScript==
// @name         Youtrack MD Link copy
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a button to copy ticket summary and URL in markdown format, with SPA support
// @author       Nikolay Guryanov
// @license MIT
// @include      https://*youtrack*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/538520/Youtrack%20MD%20Link%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/538520/Youtrack%20MD%20Link%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    // Inject button CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .md-copy-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            margin-left: 2px;
            cursor: pointer;
            position: relative;
            vertical-align: middle;
            padding: 0;
            margin-left: calc(var(--ring-unit) * .75);
            margin-right: calc(var(--ring-unit) * .25);
            margin-top: calc(var(--ring-unit) * -.25);
            color: var(--ring-icon-color);
        }
        .md-copy-btn:hover {
            color: var(--ring-link-hover-color) !important;
        }
        .md-copy-btn:active {
            color: var(--ring-main-color) !important;
        }
    `;
    document.head.appendChild(style);

    // Helper: Check if element and its parents are visible
    function isElementVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }
        if (el.parentElement) {
            return isElementVisible(el.parentElement);
        }
        return true;
    }

    function setupButton() {
        // Select the visible container div whose class starts with 'copyContainer'
        const container = Array.from(document.querySelectorAll("div[class^='copyContainer']"))
        .find(isElementVisible);

        if (!container) {
            return;
        }

        // Find the closest ancestor with class 'idLink__c006'
        const idLinkContainer = container.closest('.idLink__c006');
        if (!idLinkContainer) {
            return;
        }

        // Avoid duplicate button insertion inside idLink__c006
        if (idLinkContainer.querySelector('.md-copy-btn')) {
            // Button already inserted
            return;
        }

        // Insert the button as the last child of idLink__c006 container
        insertCopyButton(idLinkContainer);
    }


    function insertCopyButton(insertIntoElement) {
        // Create button element
        const button = document.createElement('button');
        button.className = 'md-copy-btn';
        button.setAttribute('aria-label', 'Copy MD link, ID and summary');
        button.setAttribute('title', 'Copy MD link, ID and summary');
        button.type = 'button';
        button.innerHTML = `
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_40003410_16925)">
                <path d="M3 11V3H5.50005L8.0001 6.12493L10.5002 3.0011H13.0002V11.0011H10.5002V6.62615L8.0001 9.75108L5.50005 6.62615V11H3ZM17.6252 11.5009L13.8748 7.37633H16.3749V3.0011H18.8749V7.37633H21.375L17.6252 11.5009Z" fill="currentColor"/>
                <path d="M2 0.5H22C22.8284 0.5 23.5 1.17157 23.5 2V12C23.5 12.8284 22.8284 13.5 22 13.5H2C1.17157 13.5 0.5 12.8284 0.5 12V2C0.5 1.17157 1.17157 0.5 2 0.5Z" stroke="currentColor"/>
            </g>
            <defs>
                <clipPath id="clip0_40003410_16925">
                    <rect width="24" height="14" fill="currentColor"/>
                </clipPath>
            </defs>
        </svg>
    `;

    button.addEventListener('click', () => {
        const h1 = document.querySelector('h1');
        if (!h1) {
            return;
        }
        const summary = h1.textContent.trim();

        const issueLink = document.querySelector('.idLink__c006 a');
        if (!issueLink) {
            return;
        }
        const issueId = issueLink.textContent.trim();
        const href = issueLink.href;

        const mdFormat = `[${issueId}](${href}) ${summary}`;
        GM_setClipboard(mdFormat, 'text');
    });

    // Insert button as the last child of the container (idLink__c006)
    insertIntoElement.appendChild(button);
}


    // SPA navigation detection and MutationObserver for dynamic content
    function onUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setupButton();
        }
    }

    const observer = new MutationObserver(() => {
        setupButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Hook history API methods
    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(this, arguments);
        onUrlChange();
    };
    const replaceState = history.replaceState;
    history.replaceState = function() {
        replaceState.apply(this, arguments);
        onUrlChange();
    };
    window.addEventListener('popstate', onUrlChange);

    // Initial execution
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupButton);
    } else {
        setupButton();
    }
    setTimeout(setupButton, 2000);

})();
