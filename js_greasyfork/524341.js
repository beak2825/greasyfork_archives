// ==UserScript==
// @name         OC 2.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simplifies Organized Crimes including total time-spent in OC's for members each year.
// @author       Robert Pinney
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524341/OC%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/524341/OC%2020.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'YOUR_API_KEY_HERE'; // limited access API key is sufficient

    let crimesData = {};
    let membersData = {};
    let timeSpentData = {}; // Store time spent data

    // Fetch organized crimes
    function fetchFactionCrimes() {
        fetch(`https://api.torn.com/v2/faction/crimes?key=${API_KEY}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error('API Error (Crimes):', data.error.error);
                } else {
                    crimesData = data.crimes;
                    calculateTimeSpentInOCs(crimesData); // Calculate time spent in OCs
                    displayTabContent('members'); // Default to Members tab
                }
            })
            .catch((err) => console.error('API Fetch Error (Crimes):', err));
    }

    // Fetch faction members
    function fetchFactionMembers() {
        fetch(`https://api.torn.com/v2/faction/members?key=${API_KEY}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error('API Error (Members):', data.error.error);
                } else {
                    membersData = data.members;
                }
            })
            .catch((err) => console.error('API Fetch Error (Members):', err));
    }

    // Calculate time spent in OCs
    function calculateTimeSpentInOCs(crimes) {
        timeSpentData = {}; // Reset timeSpentData
        Object.values(crimes).forEach((crime) => {
            if (crime.status === 'Successful' && crime.executed_at) {
                crime.slots.forEach((slot) => {
                    const memberId = slot.user?.id;
                    const joinedAt = slot.user?.joined_at;

                    if (memberId && joinedAt) {
                        const timeInCrime = crime.executed_at - joinedAt;
                        if (!isNaN(timeInCrime)) {
                            if (!timeSpentData[memberId]) {
                                timeSpentData[memberId] = 0;
                            }
                            timeSpentData[memberId] += timeInCrime;
                        }
                    }
                });
            }
        });
    }

    // Format time spent (in seconds) as d/h/m
    function formatTimeSpent(seconds) {
        if (!seconds || seconds <= 0) return '0m';

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        let parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (mins > 0) parts.push(`${mins}m`);

        return parts.length ? parts.join(' ') : '0m';
    }

    // [ADDED] Small helper to build a styled container
    function wrapContentInContainer(innerHTML) {
        return `
            <div style="
                padding: 10px;
                color: #fff;             /* Bright text */
                font-size: 14px;
            ">
                ${innerHTML}
            </div>
        `;
    }

    // Generate content for each tab
    function generateMembersContent() {
        if (!membersData || Object.keys(membersData).length === 0) {
            return wrapContentInContainer('<p>No members data available.</p>');
        }

        const unassigned = [];
        const assigned = [];
        Object.values(membersData).forEach((member) => {
            if (member.is_in_oc) {
                assigned.push(member);
            } else {
                unassigned.push(member);
            }
        });

        // Helper to generate a table
        const createTable = (membersArray) => {
            return `
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                ">
                  <thead>
                    <tr>
                      <th style="
                          background-color: #555;
                          color: #fff;
                          text-align: left;
                          padding: 8px;
                          border-bottom: 1px solid #777;
                      ">Name</th>
                      <th style="
                          background-color: #555;
                          color: #fff;
                          text-align: left;
                          padding: 8px;
                          border-bottom: 1px solid #777;
                      ">Level</th>
                      <th style="
                          background-color: #555;
                          color: #fff;
                          text-align: left;
                          padding: 8px;
                          border-bottom: 1px solid #777;
                      ">Time in OCs</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${membersArray.map((member) => {
                        const memberId = parseInt(member.id, 10);
                        const timeSpent = timeSpentData[memberId]
                            ? formatTimeSpent(timeSpentData[memberId])
                            : '0m';
                        return `
                            <tr>
                              <td style="
                                  background-color: #444;
                                  color: #fff;
                                  padding: 8px;
                                  border-bottom: 1px solid #555;
                              ">${member.name}</td>
                              <td style="
                                  background-color: #444;
                                  color: #fff;
                                  padding: 8px;
                                  border-bottom: 1px solid #555;
                              ">${member.level}</td>
                              <td style="
                                  background-color: #444;
                                  color: #fff;
                                  padding: 8px;
                                  border-bottom: 1px solid #555;
                              ">${timeSpent}</td>
                            </tr>
                        `;
                    }).join('')}
                  </tbody>
                </table>
            `;
        };

        let html = `
            <h3 style="border-bottom: 1px solid #fff; padding-bottom: 5px;">Unassigned</h3>
            ${unassigned.length === 0
                ? '<p>No unassigned members.</p>'
                : createTable(unassigned)
            }

            <h3 style="border-bottom: 1px solid #fff; padding-bottom: 5px; margin-top: 15px;">Assigned</h3>
            ${assigned.length === 0
                ? '<p>No assigned members.</p>'
                : createTable(assigned)
            }
        `;
        return wrapContentInContainer(html);
    }

    function generateRecruitingContent() {
        const recruitingCrimes = Object.values(crimesData).filter(
            (crime) => crime.status === 'Recruiting'
        );
        if (recruitingCrimes.length === 0) {
            return wrapContentInContainer('<p>No crimes currently recruiting.</p>');
        }

        const summary = {};
        recruitingCrimes.forEach((crime) => {
            const level = crime.difficulty;
            const totalSlots = crime.slots.length;
            const remainingSlots = crime.slots.filter((slot) => !slot.user).length;
            if (!summary[level]) {
                summary[level] = { count: 0, remainingSlots: 0, totalSlots: 0 };
            }
            summary[level].count++;
            summary[level].remainingSlots += remainingSlots;
            summary[level].totalSlots += totalSlots;
        });

        const sorted = Object.entries(summary).sort((a, b) => b[0] - a[0]);
        let listItems = sorted.map(([level, data]) =>
            `${data.count} level ${level}'s: ${data.remainingSlots} / ${data.totalSlots} slots remaining`
        );

        // [UPDATED STYLE] Show these items in a styled list
        let html = `
            <ul style="list-style-type: none; padding: 0; margin: 0;">
                ${listItems.map(item => `
                    <li style="
                        background-color: #444;
                        margin-bottom: 5px;
                        padding: 8px;
                        color: #fff;
                        border: 1px solid #555;
                        border-radius: 3px;
                    ">${item}</li>
                `).join('')}
            </ul>
        `;
        return wrapContentInContainer(html);
    }

    function generatePlanningContent() {
        const planningCrimes = Object.values(crimesData).filter(
            (crime) => crime.status === 'Planning'
        );
        if (planningCrimes.length === 0) {
            return wrapContentInContainer('<p>No crimes currently being planned.</p>');
        }

        planningCrimes.sort((a, b) => a.ready_at - b.ready_at);
        let listItems = planningCrimes.map((crime) => {
            const timeRemaining = crime.ready_at - Math.floor(Date.now() / 1000);
            return `${formatTimeRemaining(timeRemaining)} - level ${crime.difficulty}`;
        });

        // [UPDATED STYLE] Show these items in a styled list
        let html = `
            <ul style="list-style-type: none; padding: 0; margin: 0;">
                ${listItems.map(item => `
                    <li style="
                        background-color: #444;
                        margin-bottom: 5px;
                        padding: 8px;
                        color: #fff;
                        border: 1px solid #555;
                        border-radius: 3px;
                    ">${item}</li>
                `).join('')}
            </ul>
        `;
        return wrapContentInContainer(html);
    }

    function generateCompletedContent() {
        const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
        const completedCrimes = Object.values(crimesData).filter(
            (crime) => crime.status === 'Successful' && crime.executed_at >= oneYearAgo
        );
        if (completedCrimes.length === 0) {
            return wrapContentInContainer('<p>No crimes completed in the last year.</p>');
        }

        completedCrimes.sort((a, b) => b.executed_at - a.executed_at);
        let listItems = completedCrimes.map((crime) => {
            return `${formatDate(crime.executed_at)} - level ${crime.difficulty}`;
        });

        // [UPDATED STYLE] Show these items in a styled list
        let html = `
            <ul style="list-style-type: none; padding: 0; margin: 0;">
                ${listItems.map(item => `
                    <li style="
                        background-color: #444;
                        margin-bottom: 5px;
                        padding: 8px;
                        color: #fff;
                        border: 1px solid #555;
                        border-radius: 3px;
                    ">${item}</li>
                `).join('')}
            </ul>
        `;
        return wrapContentInContainer(html);
    }

    // Helper to format time remaining
    function formatTimeRemaining(seconds) {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        return `${minutes}m`;
    }

    // Helper to format date
    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    // Create the OC Window
    function createOCWindow() {
        const windowEl = document.createElement('div');
        windowEl.id = 'oc-window';
        // [UPDATED STYLE]
        windowEl.style.position = 'fixed';
        windowEl.style.top = '100px';
        windowEl.style.right = '20px';
        windowEl.style.width = '350px';
        windowEl.style.backgroundColor = '#333';
        windowEl.style.color = '#fff';
        windowEl.style.padding = '10px';
        windowEl.style.borderRadius = '5px';
        windowEl.style.zIndex = '1000';
        windowEl.style.display = 'none';

        const tabs = document.createElement('div');
        tabs.style.display = 'flex';
        tabs.style.marginBottom = '10px';
        ['members', 'recruiting', 'planning', 'completed'].forEach((tab) => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
            // [UPDATED STYLE]
            tabButton.style.flex = '1';
            tabButton.style.backgroundColor = '#444';
            tabButton.style.color = '#fff';
            tabButton.style.padding = '8px';
            tabButton.style.cursor = 'pointer';
            tabButton.style.marginRight = '5px';
            tabButton.style.border = '1px solid #555';
            tabButton.style.borderRadius = '3px';

            tabButton.addEventListener('click', () => displayTabContent(tab));
            tabs.appendChild(tabButton);
        });

        const content = document.createElement('div');
        content.id = 'oc-content';
        // [UPDATED STYLE]
        content.style.maxHeight = '400px';
        content.style.overflowY = 'auto';
        content.style.borderTop = '1px solid #555';
        content.style.paddingTop = '10px';

        windowEl.appendChild(tabs);
        windowEl.appendChild(content);
        document.body.appendChild(windowEl);
    }

    // Toggle OC Window
    function toggleOCWindow() {
        const windowEl = document.getElementById('oc-window');
        if (windowEl) {
            windowEl.style.display = windowEl.style.display === 'none' ? 'block' : 'none';
        }
    }

    function createToggleButton() {
        // Attempt to find an existing Faction Warfare link
        const factionWarfareLink = document.querySelector('a[href="/page.php?sid=factionWarfare"]');
        if (factionWarfareLink) {
            const toggleLink = document.createElement('a');
            toggleLink.textContent = 'OC Simple';
            toggleLink.href = '#';
            // [UPDATED STYLE]
            toggleLink.style.color = '#fff';
            toggleLink.style.backgroundColor = '#444';
            toggleLink.style.padding = '5px 10px';
            toggleLink.style.textDecoration = 'none';
            toggleLink.style.borderRadius = '5px';
            toggleLink.style.marginLeft = '10px';
            toggleLink.style.display = 'inline-block';
            toggleLink.style.verticalAlign = 'middle';
            toggleLink.style.cursor = 'pointer';
            toggleLink.style.border = '1px solid #555';

            toggleLink.addEventListener('click', (e) => {
                e.preventDefault();
                toggleOCWindow();
            });

            // Insert the button next to "Faction Warfare"
            factionWarfareLink.parentNode.insertBefore(toggleLink, factionWarfareLink.nextSibling);
        }
    }

    function displayTabContent(tab) {
        const contentContainer = document.getElementById('oc-content');
        if (!contentContainer) return;

        let content = '';
        if (tab === 'members') content = generateMembersContent();
        else if (tab === 'recruiting') content = generateRecruitingContent();
        else if (tab === 'planning') content = generatePlanningContent();
        else if (tab === 'completed') content = generateCompletedContent();
        else content = `<p>Content for the "${tab}" tab is not yet implemented.</p>`;

        contentContainer.innerHTML = content;
    }

    function init() {
        createToggleButton();
        createOCWindow();
        fetchFactionMembers();
        fetchFactionCrimes();
    }

    init();
})();
