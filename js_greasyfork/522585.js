// ==UserScript==
// @name         Torn: Highlight and Sort OC Scenarios
// @namespace    torn_highlight_sort_oc
// @version      2.3
// @license      MIT
// @description  Highlight partially filled scenarios and sort by level descending with partials on top.
// @author       yoyoYossarian
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522585/Torn%3A%20Highlight%20and%20Sort%20OC%20Scenarios.user.js
// @updateURL https://update.greasyfork.org/scripts/522585/Torn%3A%20Highlight%20and%20Sort%20OC%20Scenarios.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Utility to wait for elements
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
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

    // Highlight partially filled scenarios
    function highlightPartialMembership() {
        const scenarios = document.querySelectorAll('.wrapper___U2Ap7');

        scenarios.forEach(scenario => {
            const members = scenario.querySelectorAll('.wrapper___Lpz_D');
            const requiredMembers = members.length;
            const joinedMembers = Array.from(members).filter(member => !member.classList.contains('waitingJoin___jq10k')).length;

            if (joinedMembers > 0 && joinedMembers < requiredMembers) {
                scenario.style.backgroundColor = 'green';
                scenario.dataset.partial = 'true'; // Mark as partially filled
            } else {
                scenario.dataset.partial = 'false';
            }
        });

        console.log('Highlighted partially filled scenarios.');
    }

    // Sort scenarios by level, with partially filled ones on top
    function sortScenariosByLevel() {
        const scenarios = document.querySelectorAll('.wrapper___U2Ap7');
        const container = scenarios[0]?.parentNode;

        if (!container) {
            console.error('No container found for scenarios.');
            return;
        }

        const sorted = Array.from(scenarios).sort((a, b) => {
            const isPartialA = a.dataset.partial === 'true' ? 1 : 0;
            const isPartialB = b.dataset.partial === 'true' ? 1 : 0;

            if (isPartialA !== isPartialB) return isPartialB - isPartialA; // Partials on top

            const levelA = parseInt(a.querySelector('.levelValue___TE4qC')?.textContent || '0', 10);
            const levelB = parseInt(b.querySelector('.levelValue___TE4qC')?.textContent || '0', 10);

            return levelB - levelA; // Descending by level
        });

        sorted.forEach(scenario => container.appendChild(scenario));

        console.log('Scenarios sorted by level (descending) with partials on top.');
    }

    // Re-run highlighting and sorting when switching to Recruiting tab
    function monitorTabSwitch() {
        const observer = new MutationObserver(() => {
            const recruitingButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Recruiting');
            if (recruitingButton) {
                observer.disconnect();
                recruitingButton.addEventListener('click', () => {
                    setTimeout(() => {
                        forceLoadScenarios(() => {
                            highlightPartialMembership();
                            sortScenariosByLevel();
                        });
                    }, 500); // Delay to allow tab content to load
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize script
    function initialize() {
        forceLoadScenarios(() => {
            highlightPartialMembership();
            sortScenariosByLevel();
        });
        monitorTabSwitch();
    }

    // Wait for scenarios and initialize
    waitForElement('.wrapper___U2Ap7', initialize);
})();
