// ==UserScript==
// @name         Jira Copy Ticket
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Adds a "Copy Ticket" button to copy the title and ticket link as rich text
// @author       Othman Shareef (othmanosx@gmail.com)
// @match        https://eventmobi.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?domain=atlassian.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481128/Jira%20Copy%20Ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/481128/Jira%20Copy%20Ticket.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let copyTitleButton
    let copyIdButton
    let debounceTimer;

    function getClassNames() {
    const element = document.querySelector('[data-testid="issue-view-foundation.quick-add.quick-add-items-compact.add-button-dropdown--trigger"]');
    return element ? element.className : null;
    }

    // Wait for the Jira ticket title element to be available
    const waitForElement = (selector, callback) => {
        const element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(() => {
                waitForElement(selector, callback);
            }, 500);
        }
    };

    // copy ticket title to clipboard
    const copyTicketTitle = () => {
        copyTitleButton.innerText = 'Loading...';
        const ticketTitleElement = document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]');
        const ticketLinkElement = document.querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]');
        if (ticketTitleElement && ticketLinkElement) {
            const ticketTitle = ticketTitleElement.innerText;
            const ticketLink = ticketLinkElement.href
            const ticketID = ticketLinkElement.firstChild.innerText
            const html = `<a href="${ticketLink}">${ticketID}: ${ticketTitle}</a>`
            const clipboardItem = new ClipboardItem({
                'text/html': new Blob([html], {
                    type: 'text/html'
                }),
                'text/plain': new Blob([html], {
                    type: 'text/plain'
                })
            });
            navigator.clipboard.write([clipboardItem]).then(_ => {
                // Change button text to "Copied!" for a moment
                copyTitleButton.innerText = 'Copied!';
                setTimeout(() => {
                    // Change button text back to the original text after a delay
                    copyTitleButton.innerText = 'Copy Ticket Title';
                }, 1000); // You can adjust the delay (in milliseconds) as needed
            }, error => alert(error));
        } else {
            alert('Ticket title element not found!');
        }
    };

    // copy ticket ID to clipboard
    const copyTicketId = () => {
        copyIdButton.innerText = 'Loading...';
        const idElement = document.querySelector('[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]');

        if (idElement) {
            const ticketID = idElement.firstChild.innerText
            const html = `${ticketID}`
            const clipboardItem = new ClipboardItem({
                'text/html': new Blob([html], {
                    type: 'text/html'
                }),
                'text/plain': new Blob([html], {
                    type: 'text/plain'
                })
            });
            navigator.clipboard.write([clipboardItem]).then(_ => {
                // Change button text to "Copied!" for a moment
                copyIdButton.innerText = 'Copied!';
                setTimeout(() => {
                    // Change button text back to the original text after a delay
                    copyIdButton.innerText = 'Copy ID';
                }, 1000); // You can adjust the delay (in milliseconds) as needed
            }, error => alert(error));
        } else {
            alert('Ticket title element not found!');
        }
    };

    // Add button next to the ticket title
    const addCopyTitleButton = () => {
        const existingCopyBtn = document.getElementById("copy-title-button")
        if (existingCopyBtn) return
        const copyButton = document.createElement('button');
        const JiraButtonClassName = getClassNames()
        copyButton.innerText = 'Copy Ticket Title';
        copyButton.className = JiraButtonClassName;
        copyButton.style.width = "auto"
        copyButton.style.paddingInline = "8px"
        copyButton.id = "copy-title-button"
        copyButton.addEventListener('click', copyTicketTitle);

        copyTitleButton = copyButton

        const element = document.querySelector('[data-testid="issue-view-foundation.quick-add.quick-add-items-compact.add-button-dropdown--trigger"]');
        element.parentElement.parentElement.parentElement.parentElement.appendChild(copyTitleButton);
    };

    // Add another button to copy the ticket ID
    const addCopyIdButton = () => {
        const existingCopyBtn = document.getElementById("copy-id-button")
        if (existingCopyBtn) return
        const copyButton = document.createElement('button');
        const JiraButtonClassName = getClassNames()
        copyButton.innerText = 'Copy ID';
        copyButton.className = JiraButtonClassName;
        copyButton.style.width = "auto"
        copyButton.style.paddingInline = "8px"
        copyButton.id = "copy-id-button"
        copyButton.addEventListener('click', copyTicketId);

        copyIdButton = copyButton

        const element = document.querySelector('[data-testid="issue-view-foundation.quick-add.quick-add-items-compact.add-button-dropdown--trigger"]');
        element.parentElement.parentElement.parentElement.parentElement.appendChild(copyIdButton);
    };

    const debounce = (func, delay) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    };

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(() => {
        debounce(() => {
            waitForElement('[data-testid="issue.views.issue-base.foundation.summary.heading"]', () => { addCopyTitleButton(); addCopyIdButton(); })
        }, 100);
    });

    // Observe changes in the body and its descendants
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

})();