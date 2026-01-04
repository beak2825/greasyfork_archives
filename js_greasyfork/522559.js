// ==UserScript==
// @name         Torn: Sort Scenarios by Time and Level
// @namespace    torn_sort_scenarios
// @license      MIT
// @version      1.8
// @description  Sort scenarios by time remaining or level in descending order; highlight partially filled crimes after switching tabs
// @author       yoyoYossarian
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522559/Torn%3A%20Sort%20Scenarios%20by%20Time%20and%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/522559/Torn%3A%20Sort%20Scenarios%20by%20Time%20and%20Level.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the page to fully load
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                callback();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Force scenarios to load by scrolling
    function forceLoadScenarios(callback) {
        const scrollInterval = setInterval(() => {
            window.scrollBy(0, 1000);
            if (document.querySelectorAll('.wrapper___U2Ap7').length > 0) {
                clearInterval(scrollInterval);
                setTimeout(callback, 1000); // Allow time for additional scenarios to load
            }
        }, 500);
    }

    // Parse time strings (DD:HH:MM:SS) into total seconds
    function parseTimeToSeconds(timeString) {
        const [days, hours, minutes, seconds] = timeString.split(':').map(Number);
        return days * 86400 + hours * 3600 + minutes * 60 + seconds;
    }

    // Highlight crimes with partial membership
    function highlightPartialMembership() {
        const scenarios = document.querySelectorAll('.wrapper___U2Ap7');

        scenarios.forEach(scenario => {
            const members = scenario.querySelectorAll('.wrapper___Lpz_D');
            const requiredMembers = members.length;
            const joinedMembers = Array.from(members).filter(member => !member.classList.contains('waitingJoin___jq10k')).length;

            if (joinedMembers > 0 && joinedMembers < requiredMembers) {
                console.log("found incomplete crime");
                scenario.style.backgroundColor = 'green';
            }
        });

        console.log('Highlighted crimes with partial membership.');
    }

    // Sort scenarios by time remaining
    function sortScenariosByTime() {
        const wrappers = document.querySelectorAll('.wrapper___U2Ap7');
        if (!wrappers || wrappers.length === 0) {
            console.error('No wrappers found on the page.');
            return;
        }

        // Convert NodeList to an array and extract times
        const wrapperArray = Array.from(wrappers);
        wrapperArray.sort((a, b) => {
            const timeA = parseTimeToSeconds(a.querySelector('.title___pB5FU').textContent);
            const timeB = parseTimeToSeconds(b.querySelector('.title___pB5FU').textContent);
            return timeA - timeB;
        });

        // Reorder wrappers in the DOM
        const container = wrappers[0].parentNode;
        wrapperArray.forEach(wrapper => container.appendChild(wrapper));

        console.log('Scenarios sorted by time remaining.');
    }

    // Sort scenarios by level
    function sortScenariosByLevel() {
        const wrappers = document.querySelectorAll('.wrapper___U2Ap7');
        if (!wrappers || wrappers.length === 0) {
            console.error('No wrappers found on the page.');
            return;
        }

        // Convert NodeList to an array and extract levels
        const wrapperArray = Array.from(wrappers);
        wrapperArray.sort((a, b) => {
            const levelA = parseInt(a.querySelector('.levelValue___TE4qC').textContent, 10);
            const levelB = parseInt(b.querySelector('.levelValue___TE4qC').textContent, 10);
            return levelB - levelA; // Descending order
        });

        // Reorder wrappers in the DOM
        const container = wrappers[0].parentNode;
        wrapperArray.forEach(wrapper => container.appendChild(wrapper));

        console.log('Scenarios sorted by level.');
    }

    // Monitor for tab switches and apply highlights
    function monitorTabSwitch() {
        const observer = new MutationObserver(() => {
            const recruitingButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Recruiting');
            if (recruitingButton) {
                observer.disconnect();
                recruitingButton.addEventListener('click', () => {
                    setTimeout(() => {
                        forceLoadScenarios(() => {
                            highlightPartialMembership();
                        });
                    }, 500);
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Add sorting buttons
    function addSortButtons() {
        const buttonsContainer = document.querySelector('.buttonsContainer___aClaa');
        if (!buttonsContainer) {
            console.error('Buttons container not found. Unable to add sort buttons.');
            return;
        }

        // Sort by Time button
        const sortTimeButton = document.createElement('button');
        sortTimeButton.textContent = 'Sort by Time';
        sortTimeButton.type = 'button';
        sortTimeButton.className = 'button___cwmLf';
        sortTimeButton.style.marginLeft = '10px';
        sortTimeButton.addEventListener('click', () => {
            forceLoadScenarios(sortScenariosByTime);
        });

        // Sort by Level button
        const sortLevelButton = document.createElement('button');
        sortLevelButton.textContent = 'Sort by Level';
        sortLevelButton.type = 'button';
        sortLevelButton.className = 'button___cwmLf';
        sortLevelButton.style.marginLeft = '10px';
        sortLevelButton.addEventListener('click', () => {
            forceLoadScenarios(sortScenariosByLevel);
        });

        // Append buttons
        buttonsContainer.appendChild(sortTimeButton);
        buttonsContainer.appendChild(sortLevelButton);

        console.log('Sort by Time and Level buttons added.');
    }

    // Initialize the script
    waitForElement('.wrapper___U2Ap7', () => {
        forceLoadScenarios(() => {
            highlightPartialMembership();
            console.log('Initialized and highlighted partial memberships.');
        });
    });
    waitForElement('.buttonsContainer___aClaa', addSortButtons);
    monitorTabSwitch();
})();
