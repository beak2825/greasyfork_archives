// ==UserScript==
// @name         Torn Faction Crime Participation Checker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Check for faction members not participating in crimes with expanded member info -- Shitty Claude code
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523151/Torn%20Faction%20Crime%20Participation%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/523151/Torn%20Faction%20Crime%20Participation%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'ENTER-KEY';
    let checkInterval = null;

    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject('Failed to fetch data');
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function createMissingMembersDiv(nonParticipatingMembers) {
        const isDarkMode = document.cookie.split(';').some(cookie =>
        cookie.trim().startsWith('darkModeEnabled=true'));

        const div = document.createElement('div');
        div.className = 'faction-crimes-wrap';
        div.style.marginBottom = '10px';

        const title = document.createElement('div');
        title.className = 'title-black top-round';
        title.style.cursor = 'pointer';
        title.innerHTML = 'Members not in an OC ►';
        div.appendChild(title);

        const content = document.createElement('div');
        content.className = 'cont-gray bottom-round';
        content.style.padding = '10px';
        content.style.display = 'none'; // Start collapsed

        // Create member list
        nonParticipatingMembers.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.style.marginBottom = '5px';
            const link = `<a href="https://www.torn.com/profiles.php?XID=${member.id}"
            target="_blank" style="${isDarkMode ? 'color: #d96e38;' : ''}">${member.name}</a>`;
            memberDiv.innerHTML = `${link} - ${member.last_action}`;
            content.appendChild(memberDiv);
        });

        div.appendChild(content);

        // Add click handler for collapse/expand
        title.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                title.innerHTML = 'Members not in an OC ▼';
            } else {
                content.style.display = 'none';
                title.innerHTML = 'Members not in an OC ►';
            }
        });

        return div;
    }

    async function checkCrimeParticipation() {
        console.log("Querying API");
        try {
            const factionData = await fetchData(`https://api.torn.com/v2/faction/members?striptags=true&key=${API_KEY}`);
            const nonParticipatingMembers = [];

            factionData.members.forEach(member => {
                if (member.is_in_oc == false) {
                    const memberInfo = {
                        id: member.id,
                        name: member.name,
                        last_action: member.last_action.relative,
                        timestamp: member.last_action.timestamp};

                    nonParticipatingMembers.push(memberInfo);
                };
            });

            nonParticipatingMembers.sort((a, b) => b.timestamp - a.timestamp);

            // Remove existing results if present
            const existingDiv = document.querySelector('#non-participating-members');
            if (existingDiv) {
                existingDiv.remove();
            }

            const targetElement = document.querySelector('.faction-crimes-wrap');
            if (targetElement && targetElement.parentNode) {
                const newDiv = createMissingMembersDiv(nonParticipatingMembers);
                newDiv.id = 'non-participating-members';
                targetElement.parentNode.insertBefore(newDiv, targetElement);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function startChecking() {
        // Clear any existing interval
        if (checkInterval) {
            clearInterval(checkInterval);
        }
        // Check every 2 seconds if the crimes wrap is present
        checkInterval = setInterval(() => {
            if (document.querySelector('.faction-crimes-wrap')) {
                checkCrimeParticipation();
                clearInterval(checkInterval);
            }
        }, 500);
    }

    function initializeEventListeners() {
        // Listen for clicks on the crimes tab
        document.addEventListener('click', (e) => {
            const crimesTab = e.target.closest('[aria-controls="faction-crimes"]');
            if (crimesTab) {
                startChecking();
            }
        });

        // Also check on initial page load if we're already on the crimes tab
        if (window.location.href.includes('https://www.torn.com/factions.php?step=your')) {
            startChecking();
        }
    }

    // Initialize when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEventListeners);
    } else {
        initializeEventListeners();
    }
})();