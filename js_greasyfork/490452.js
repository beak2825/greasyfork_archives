// ==UserScript==
// @name         Slack Copy Reaction Names and Handles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds buttons to the Slack reaction bar to copy the list of people who reacted and their handles
// @match        https://app.slack.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490452/Slack%20Copy%20Reaction%20Names%20and%20Handles.user.js
// @updateURL https://update.greasyfork.org/scripts/490452/Slack%20Copy%20Reaction%20Names%20and%20Handles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the "Copy Reacted Names" button
    function createNamesButton() {
        const button = document.createElement('button');
        button.textContent = 'Copy Reacted Names';
        button.classList.add('c-button-unstyled', 'c-reaction', 'c-reaction--light');
        button.setAttribute('aria-label', 'Copy Reacted Names');
        button.setAttribute('type', 'button');
        button.addEventListener('click', copyReactedNames);
        return button;
    }

    // Function to create the "Copy Reacted Handles" button
    function createHandlesButton() {
        const button = document.createElement('button');
        button.textContent = 'Copy Reacted Handles';
        button.classList.add('c-button-unstyled', 'c-reaction', 'c-reaction--light');
        button.setAttribute('aria-label', 'Copy Reacted Handles');
        button.setAttribute('type', 'button');
        button.addEventListener('click', copyReactedHandles);
        return button;
    }

    // Function to simulate hover event on the reaction button
    function simulateHover(element) {
        const mouseOverEvent = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(mouseOverEvent);
    }

    // Function to copy the reacted names to the clipboard
    function copyReactedNames(event) {
        const reactionButton = event.target.closest('.c-reaction_bar').querySelector('.c-reaction');
        const tooltipElement = document.querySelector('.c-reaction__tip_group');

        if (!tooltipElement) {
            simulateHover(reactionButton);
            setTimeout(copyReactedNames, 100, event);
            return;
        }

        const reactedUsers = tooltipElement.textContent.split(', ');
        const userList = reactedUsers.slice(0, -1).join(', ');
        navigator.clipboard.writeText(userList);
        alert('Reacted names copied to clipboard!');
    }

    // Function to copy the reacted handles to the clipboard
    function copyReactedHandles(event) {
        const reactionButton = event.target.closest('.c-reaction_bar').querySelector('.c-reaction');
        const tooltipElement = document.querySelector('.c-reaction__tip_group');

        if (!tooltipElement) {
            simulateHover(reactionButton);
            setTimeout(copyReactedHandles, 100, event);
            return;
        }

        const reactedUsers = tooltipElement.textContent.split(', ');
        const userList = reactedUsers.slice(0, -1).map(user => `@${user}`).join(', ');
        navigator.clipboard.writeText(userList);
        alert('Reacted handles copied to clipboard!');
    }

    // Function to insert the buttons into the reaction bar
    function insertButtons(reactionBar) {
        const namesButton = createNamesButton();
        const handlesButton = createHandlesButton();
        reactionBar.appendChild(namesButton);
        reactionBar.appendChild(handlesButton);
    }

    // Function to observe changes in the DOM
    function observeDOM(callback) {
        const observer = new MutationObserver(callback);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to handle DOM changes
    function handleDOMChange(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const reactionBars = document.querySelectorAll('.c-reaction_bar');
                reactionBars.forEach(reactionBar => {
                    if (!reactionBar.querySelector('button[aria-label="Copy Reacted Names"]')) {
                        insertButtons(reactionBar);
                    }
                });
            }
        }
    }

    // Start observing the DOM for changes
    observeDOM(handleDOMChange);
})();