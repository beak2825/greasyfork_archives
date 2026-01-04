// ==UserScript==
// @name         Torn Message Forward
// @version      1.3
// @description  Adds a Forward button to Torn's message page for forwarding messages, including original sender's name
// @author       dingus
// @match        https://www.torn.com/messages.php*
// @grant        none
// @namespace https://greasyfork.org/users/1338514
// @downloadURL https://update.greasyfork.org/scripts/545124/Torn%20Message%20Forward.user.js
// @updateURL https://update.greasyfork.org/scripts/545124/Torn%20Message%20Forward.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Torn Message Forward script loaded');

    function addForwardButton() {
        console.log('Attempting to add Forward button');
        const actionLists = document.querySelectorAll('ul.reply-mail-action.bottom-round');
        if (!actionLists.length) {
            console.log('No action lists found');
            return false;
        }

        let added = false;
        actionLists.forEach(actionList => {
            if (actionList.querySelector('.forward-message')) {
                console.log('Forward button already exists in this action list');
                return;
            }

            const messageContainer = actionList.closest('.mailbox-container');
            if (!messageContainer) {
                console.log('Message container not found');
                return;
            }

            const messageIdElement = messageContainer.querySelector('a[data-id][data-case="inbox"]');
            const messageId = messageIdElement ? messageIdElement.getAttribute('data-id') : null;
            if (!messageId) {
                console.log('Message ID not found');
                return;
            }

            const messageContent = messageContainer.querySelector('div.reply-mail-container .editor-content');
            const messageTitleElement = messageContainer.querySelector('.container-header .left.t-overflow');
            const senderElement = messageContainer.querySelector('div.reply-mail-container p.bold.m-bottom10 a');
            const messageTitle = messageTitleElement ? messageTitleElement.textContent.trim() : 'Forwarded Message';
            const senderName = senderElement ? senderElement.textContent.trim() : 'Unknown Sender';
            const content = messageContent ? messageContent.innerHTML : '<p>No content available</p>';

            const forwardItem = document.createElement('li');
            forwardItem.className = 'forward-message torn-divider divider-vertical';
            forwardItem.innerHTML = `
                <a href="#" class="c-pointer" data-id="${messageId}">
                    <i class="${messageContent ? 'mail-reply-forward-icon' : 'mail-reply-report-icon'}"></i>
                    Forward
                </a>
            `;
            const forwardLink = forwardItem.querySelector('a');
            forwardLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Forwarding message ID: ${messageId} from ${senderName}`);
                forwardMessage(messageId, messageTitle, senderName, content);
            });

            const historyItem = actionList.querySelector('li a.show-history');
            if (historyItem) {
                actionList.insertBefore(forwardItem, historyItem.parentElement);
            } else {
                actionList.appendChild(forwardItem);
            }
            added = true;
        });

        if (added) {
            console.log('Forward button(s) added successfully');
        }
        return added;
    }

    function forwardMessage(messageId, title, senderName, content) {
        const quotedContent = `
            <p>---------- Forwarded message ----------</p>
            <p>From: ${senderName}</p>
            <p>Subject: ${title}</p>
            <p>${content}</p>
        `.trim();

        const forwardUrl = `/messages.php#/p=compose&fwd=${encodeURIComponent(messageId)}`;
        console.log(`Redirecting to: ${forwardUrl}`);
        window.location.href = forwardUrl;

        const checkComposeInterval = setInterval(() => {
            if (window.location.hash.includes('#/p=compose')) {
                const editor = document.querySelector('div.editor-content.mce-content-body[contenteditable="true"]');
                const titleInput = document.querySelector('input[name="subject"]');
                if (editor && titleInput) {
                    console.log('Populating compose editor');
                    editor.innerHTML = quotedContent;
                    titleInput.value = `Fwd: ${title}`;
                    clearInterval(checkComposeInterval);
                } else {
                    console.log('Editor or title input not found yet');
                }
            }
        }, 500);

        setTimeout(() => {
            console.log('Timeout reached for compose editor check');
            clearInterval(checkComposeInterval);
        }, 10000);
    }

    function initializeForwardButton() {
        console.log(`Checking page: ${window.location.href}`);
        if (!window.location.hash.includes('#/p=read')) {
            console.log('Not on read page, skipping');
            return;
        }

        if (!addForwardButton()) {
            console.log('Initial attempt to add Forward button failed, starting polling');
            let attempts = 0;
            const maxAttempts = 20;
            const interval = setInterval(() => {
                attempts++;
                if (addForwardButton() || attempts >= maxAttempts) {
                    console.log(`Polling stopped. Success: ${addForwardButton()}, Attempts: ${attempts}`);
                    clearInterval(interval);
                }
            }, 500);
        }
    }

    window.addEventListener('load', () => {
        console.log('Page load event triggered');
        initializeForwardButton();
    }, false);

    window.addEventListener('hashchange', () => {
        console.log('Hash change event triggered');
        initializeForwardButton();
    }, false);
})();