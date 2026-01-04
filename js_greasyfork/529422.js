// ==UserScript==
// @name         Asana Rename Inbox to Changelog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Rename Asana "Inbox" text to "Changelog"
// @match        https://app.asana.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529422/Asana%20Rename%20Inbox%20to%20Changelog.user.js
// @updateURL https://update.greasyfork.org/scripts/529422/Asana%20Rename%20Inbox%20to%20Changelog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function renameInbox() {
        // Rename the sidebar link
        const inboxLink = document.querySelector('a[aria-label="Inbox"]');
        if (inboxLink) {
            const textSpan = inboxLink.querySelector('.SidebarNavigationLinkCard-label');
            if (textSpan && textSpan.textContent.trim() === 'Inbox') {
                textSpan.textContent = 'Changelog';
            }
        }

        // Rename the actual page header
        const inboxHeader = document.querySelector('.InboxPageHeader-title');
        if (inboxHeader && inboxHeader.textContent.trim() === 'Inbox') {
            inboxHeader.textContent = 'Changelog';
        }
    }

    // Declare the observer BEFORE calling it
    const observer = new MutationObserver(() => {
        renameInbox();
    });

    function install() {
        // Run once
        renameInbox();
        // Then observe for any UI changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    install();
})();
