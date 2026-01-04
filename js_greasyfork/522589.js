// ==UserScript==
// @name         Torn: Find Missing Members
// @namespace    torn_missing_oc_members
// @version      1.1
// @license      MIT
// @description  List members not in an OC.
// @author       yoyoYossarian
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522589/Torn%3A%20Find%20Missing%20Members.user.js
// @updateURL https://update.greasyfork.org/scripts/522589/Torn%3A%20Find%20Missing%20Members.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = "your-key-here";

    // Fetch data from the Torn API
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch data from API: ${error.message}`);
            return null;
        }
    }

    // Get members not in any crime
    async function findMissingMembers() {
        const planningCrimesUrl = `https://api.torn.com/v2/faction/crimes?key=${API_KEY}&cat=planning&offset=0`;
        const recruitingCrimesUrl = `https://api.torn.com/v2/faction/crimes?key=${API_KEY}&cat=recruiting&offset=0`;
        const membersUrl = `https://api.torn.com/v2/faction/members?key=${API_KEY}&striptags=true`;

        const planningCrimesData = await fetchData(planningCrimesUrl);
        const recruitingCrimesData = await fetchData(recruitingCrimesUrl);
        const membersData = await fetchData(membersUrl);

        if (!planningCrimesData || !recruitingCrimesData || !membersData || !membersData.members) {
            console.error("Failed to retrieve necessary data or data format is incorrect.");
            return;
        }

        const crimeUserIds = new Set();
        const membersNotInCrimes = [];

        // Collect user IDs from planning crimes
        if (planningCrimesData.crimes) {
            planningCrimesData.crimes.forEach(crime => {
                if (crime.slots) {
                    crime.slots.forEach(slot => {
                        if (slot.user && slot.user.id) {
                            crimeUserIds.add(slot.user.id);
                        }
                    });
                }
            });
        }

        // Collect user IDs from recruiting crimes
        if (recruitingCrimesData.crimes) {
            recruitingCrimesData.crimes.forEach(crime => {
                if (crime.slots) {
                    crime.slots.forEach(slot => {
                        if (slot.user && slot.user.id) {
                            crimeUserIds.add(slot.user.id);
                        }
                    });
                }
            });
        }

        // Find members not in any crime
        Object.keys(membersData.members).forEach(memberId => {
            const member = membersData.members[memberId];
            if (!crimeUserIds.has(parseInt(member.id, 10))) {
                membersNotInCrimes.push({ name: member.name, id: member.id });
            }
        });

        // Output the results
        const resultContainer = document.createElement('div');
        resultContainer.style.position = 'fixed';
        resultContainer.style.top = '10px';
        resultContainer.style.right = '10px';
        resultContainer.style.backgroundColor = 'green';
        resultContainer.style.border = '1px solid black';
        resultContainer.style.padding = '10px';
        resultContainer.style.zIndex = '1000';

        if (membersNotInCrimes.length > 0) {
            console.log("Members not in crimes:", membersNotInCrimes);

            const listTitle = document.createElement('h4');
            listTitle.textContent = "Members not in crimes:";
            resultContainer.appendChild(listTitle);

            const list = document.createElement('ul');
            membersNotInCrimes.forEach(member => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `https://www.torn.com/profiles.php?XID=${member.id}`;
                link.textContent = member.name;
                link.target = '_blank';
                listItem.appendChild(link);
                list.appendChild(listItem);
            });
            resultContainer.appendChild(list);
        } else {
            console.log("All members are in crimes.");

            const message = document.createElement('p');
            message.textContent = "All members are in crimes.";
            resultContainer.appendChild(message);
        }

        document.body.appendChild(resultContainer);
    }

    // Wait for the page to load before running the script
    window.addEventListener('load', () => {
        findMissingMembers();
    });
})();
