// ==UserScript==
// @name         Replace Messages with Random Quotes
// @version      2.2
// @author       SleepingGiant
// @description  Replaces messages from specific users (or their aliased names via CSS variables) with random quotes.
// @namespace    https://greasyfork.org/users/1395131
// @include      *:9000/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534345/Replace%20Messages%20with%20Random%20Quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/534345/Replace%20Messages%20with%20Random%20Quotes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === EDIT ONLY BELOW THIS LINE ===

    const userQuoteGroups = [
        {
            users: ['ExampleUser1', 'AnotherUser1'],
            quotes: ['Quote A1', 'Quote A2', 'Quote A3']
        },
        {
            users: ['ExampleUser2', 'AnotherUser2'],
            quotes: ['Quote B1', 'Quote B2', 'Quote B3']
        }
        // Add more groups as needed
    ];

    // === DO NOT EDIT BELOW THIS LINE ===

    const PROCESSED_FLAG = "data-quote-replaced";

    function getRandomQuoteFromGroup(group) {
        return group.quotes[Math.floor(Math.random() * group.quotes.length)];
    }

    function findGroupForUser(username) {
        return userQuoteGroups.find(group => group.users.includes(username));
    }

    function getEffectiveUsername(userElement) {
        // Check for aliased name first
        const styles = window.getComputedStyle(userElement);
        const aliasValue = styles.getPropertyValue('--AliasedName').trim().replace(/^"|"$/g, '');

        if (aliasValue) {
            return aliasValue;
        }

        // Fallback to data-name if they don't have an alias (most won't).
        return userElement.getAttribute('data-name');
    }

    function replaceMessageContent(messageElement) {
        if (!messageElement || messageElement.getAttribute(PROCESSED_FLAG) === "true") return;

        const userElement = messageElement.querySelector('.user');
        const contentElement = messageElement.querySelector('.content');

        if (!userElement || !contentElement) return;

        const username = getEffectiveUsername(userElement);
        const group = findGroupForUser(username);

        if (group) {
            contentElement.textContent = getRandomQuoteFromGroup(group);
            messageElement.setAttribute(PROCESSED_FLAG, "true");
        }
    }

    function isProcessableMessageElement(node) {
        // Support normal messages and /me actions
        if (!(node instanceof Element)) return false;
        if (!node.classList.contains('msg')) return false;
        const t = node.dataset.type;
        return t === 'message' || t === 'action';
    }

    function processLastMessages(count) {
        const messageElements = Array.from(
            document.querySelectorAll('.msg[data-type="message"], .msg[data-type="action"]')
        );
        const recentMessages = messageElements.slice(-count);
        recentMessages.forEach(replaceMessageContent);
    }

    function init() {
        const messagesContainer = document.querySelector('.messages');
        if (!messagesContainer) return;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.addedNodes) {
                    if (isProcessableMessageElement(node)) {
                        replaceMessageContent(node);
                    }
                }
            }
        });

        observer.observe(messagesContainer, { childList: true });

        processLastMessages(100); // initial sweep - the rest happen on load
    }

    // Re-initialize when switching channels (debounced to avoid loops)
    let debounceTimeout = null;
    const appObserver = new MutationObserver(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            init();
        }, 300);
    });

    const appRootInterval = setInterval(() => {
        const appRoot = document.getElementById('app');
        if (appRoot) {
            clearInterval(appRootInterval);
            appObserver.observe(appRoot, { childList: true, subtree: false });
            init();
        }
    }, 100);

})();
