// ==UserScript==
// @name         Add Hide and Unhide Button with Trade Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds "Hide" and "Unhide" buttons, filters trades, and tells you have hidden the user in the trade.
// @author       Grance [3487987]
// @match        *://*.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524992/Add%20Hide%20and%20Unhide%20Button%20with%20Trade%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/524992/Add%20Hide%20and%20Unhide%20Button%20with%20Trade%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Utility to wait for an element to load
    function waitForElement(selector, callback, interval = 100, timeout = 10000) {
        const start = Date.now();
        const check = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(check);
                callback(element);
            } else if (Date.now() - start > timeout) {
                clearInterval(check);
                console.error(`Timeout waiting for element: ${selector}`);
            }
        }, interval);
    }

    // Function to create the "Hide" button
    function createHideButton(userId) {
        const buttonsList = document.querySelector('.buttons-list');
        if (!buttonsList || document.getElementById('button-hide')) return; // Prevent duplicates
        const hideButton = document.createElement('a');
        hideButton.id = 'button-hide';
        hideButton.href = '#';
        hideButton.className = 'profile-button profile-button-hide clickable';
        hideButton.setAttribute('aria-label', 'Hide');
        hideButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt profileButtonIcon svgShadowWhiteFilter___Nse17"
                 fill="rgba(153, 153, 153, 0.4)" stroke="#d4d4d4" stroke-width="2" width="36" height="40" viewBox="0 0 46 46" style="display: block; margin: auto;">
                <g transform="translate(1, 1)">
                    <circle cx="22" cy="25" r="20" fill="none" stroke="black" stroke-width="2"/>
                    <line x1="12" y1="15" x2="32" y2="35" stroke="black" stroke-width="2"/>
                </g>
            </svg>
        `;

        // Add click event for hiding the user
        hideButton.addEventListener('click', (event) => {
            event.preventDefault();
            const hiddenList = JSON.parse(localStorage.getItem('hiddenUsers')) || [];
            if (!hiddenList.includes(userId)) {
                hiddenList.push(userId);
                localStorage.setItem('hiddenUsers', JSON.stringify(hiddenList));
                alert(`User ${userId} has been hidden.`);
                replaceWithUnhideButton(userId); // Replace the button with "Unhide"
            }
        });

        return hideButton;
    }

    // Function to create the "Unhide" button
    function createUnhideButton(userId) {
        const buttonsList = document.querySelector('.buttons-list');
        if (!buttonsList || document.getElementById('button-unhide')) return; // Prevent duplicates
        const unhideButton = document.createElement('a');
        unhideButton.id = 'button-unhide';
        unhideButton.href = '#';
        unhideButton.className = 'profile-button profile-button-unhide clickable';
        unhideButton.setAttribute('aria-label', 'Unhide');
        unhideButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt profileButtonIcon svgShadowWhiteFilter___Nse17"
                 fill="rgba(153, 153, 153, 0.4)" stroke="#d4d4d4" stroke-width="2" width="40" height="45" viewBox="0 0 46 46" style="display: block; margin: auto;">
                <g transform="translate(1, 1)">
                    <circle cx="22" cy="20" r="20" fill="none" stroke="black" stroke-width="2"/>
                    <line x1="1" y1="20" x2="41" y2="20" stroke="black" stroke-width="2"/> <!-- Horizontal line -->
                </g>
            </svg>
        `;

        // Add click event for unhiding the user
        unhideButton.addEventListener('click', (event) => {
            event.preventDefault();
            const hiddenList = JSON.parse(localStorage.getItem('hiddenUsers')) || [];
            const index = hiddenList.indexOf(userId);
            if (index !== -1) {
                hiddenList.splice(index, 1);
                localStorage.setItem('hiddenUsers', JSON.stringify(hiddenList));
                alert(`User ${userId} has been unhidden.`);
                replaceWithHideButton(userId); // Replace the button with "Hide"
            }
        });

        return unhideButton;
    }

    // Function to replace the button with "Unhide"
    function replaceWithUnhideButton(userId) {
        const buttonsList = document.querySelector('.buttons-list');
        if (!buttonsList) return;

        const existingButton = document.getElementById('button-hide');
        if (existingButton) {
            const unhideButton = createUnhideButton(userId);
            buttonsList.replaceChild(unhideButton, existingButton);
        }
    }

    // Function to replace the button with "Hide"
    function replaceWithHideButton(userId) {
        const buttonsList = document.querySelector('.buttons-list');
        if (!buttonsList) return;

        const existingButton = document.getElementById('button-unhide');
        if (existingButton) {
            const hideButton = createHideButton(userId);
            buttonsList.replaceChild(hideButton, existingButton);
        }
    }

    // Function to add the button to the profile page
    function addProfileButton() {
        waitForElement('.buttons-list', (buttonsList) => {
            // Extract user ID from the profile buttons
            const userId = buttonsList.querySelector('a')?.id.split('-')[2];
            if (!userId) return;

            // Check if the user is in the hidden list
            const hiddenList = JSON.parse(localStorage.getItem('hiddenUsers')) || [];
            if (hiddenList.includes(userId)) {
                // Add "Unhide" button
                const unhideButton = createUnhideButton(userId);
                buttonsList.appendChild(unhideButton);
            } else {
                // Add "Hide" button
                const hideButton = createHideButton(userId);
                buttonsList.appendChild(hideButton);
            }
        });
    }
    function checkHiddenInTrade() {
        const tradeHeader = document.querySelector('h4.left');
        if (!tradeHeader || !tradeHeader.textContent.includes('Trade')) return;

        // Get user ID from the trade page
        const userLink = document.querySelector('a.t-blue.h');
        const userId = userLink?.href.match(/XID=(\d+)/)?.[1];
        if (!userId) return;

        // Check against the hidden list
        const hiddenList = JSON.parse(localStorage.getItem('hiddenUsers')) || [];
        if (hiddenList.includes(userId)) {
            // Show the warning message
            let warningMessage = document.getElementById('hidden-warning');
            if (!warningMessage) {
                warningMessage = document.createElement('div');
                warningMessage.id = 'hidden-warning';
                warningMessage.style.color = 'red';
                warningMessage.style.fontWeight = 'bold';
                warningMessage.style.fontSize = '24px';
                warningMessage.textContent = 'YOU HAVE HIDDEN THIS PERSON';
                tradeHeader.parentNode.insertBefore(warningMessage, tradeHeader);
            }
        }
    }

    // Function to filter trades on the trade page
    function filterTrades() {
        waitForElement('.trades-cont.current', (tradeList) => {
            const hiddenList = JSON.parse(localStorage.getItem('hiddenUsers')) || [];
            const tradeItems = tradeList.querySelectorAll('li');

            tradeItems.forEach((tradeItem) => {
                const userLink = tradeItem.querySelector('.namet a');
                if (userLink) {
                    const userId = userLink.href.split('XID=')[1];
                    if (hiddenList.includes(userId)) {
                        tradeItem.style.display = 'none';
                    }
                }
            });
        });
    }
// Run checks on initial load and dynamically when the DOM updates
    function init() {
        if (window.location.href.includes('trade.php#step')) {
            checkHiddenInTrade(); // Check for hidden users on the trade page
        } else if (window.location.href.includes('trade.php')) {
            filterTrades(); // Check for hidden users on the trade page
        } else if (window.location.href.includes('profiles.php')) {
            addProfileButton(); // Check for hidden users on the trade page
        }
    }

    // Observe page changes to re-run the script when navigating dynamically
    const observer = new MutationObserver(() => {
        init();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Run once on script load
    init();
})();

