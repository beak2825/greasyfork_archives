// ==UserScript==
// @name         QBO Automatic Classic Reports
// @namespace    http://tampermonkey.net/
// @version      2025-07-03
// @description  Clicks "Switch to classic view" button when it appears
// @author       You
// @match        https://qbo.intuit.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540213/QBO%20Automatic%20Classic%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/540213/QBO%20Automatic%20Classic%20Reports.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickButton = () => {
        const buttons = document.querySelectorAll('button.idsF.qbdsLinkActionButton.LinkActionButton-button-66c8d46.LinkActionButton-right-325b00e.medium');

        for (const button of buttons) {
            const span = button.querySelector('span');
            if (
                span &&
                span.textContent.trim() === 'Switch to classic view' &&
                !button.hasAttribute('data-clicked')
            ) {
                button.setAttribute('data-clicked', 'true');
                button.click();
                break; // Stop after the first matching button
            }
        }
    };

    // Initial check in case the button is already there
    clickButton();

    // Observe any changes in the body to catch dynamic content
    const observer = new MutationObserver(() => {
        clickButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();