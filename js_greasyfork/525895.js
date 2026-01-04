// ==UserScript==
// @name         Torn - Faction Member Table
// @namespace    duck.wowow
// @version      0.1
// @description  duckwowow
// @author       Odung
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525895/Torn%20-%20Faction%20Member%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/525895/Torn%20-%20Faction%20Member%20Table.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let maxTimeouts = 0;
    let memberData;
    let apiKey;
    let factionId;
    let ascending = true;

    const countryMapping = {
        Canada: ['In Canada', 'Traveling to Canada', 'In a Canadian hospital'],
        'South Africa': ['In South Africa', 'Traveling to South Africa', 'In a South African hospital'],
        UAE: ['In UAE', 'Traveling to UAE', 'In an Emirati hospital'],
        'Cayman Islands': ['In Cayman Islands', 'Traveling to Cayman Islands', 'In a Caymanian hospital'],
        Mexico: ['In Mexico', 'Traveling to Mexico', 'In a Mexican hospital'],
        Hawaii: ['In Hawaii', 'Traveling to Hawaii', 'In a Hawaiian hospital'],
        'United Kingdom': ['In United Kingdom', 'Traveling to United Kingdom', 'In a British hospital'],
        Argentina: ['In Argentina', 'Traveling to Argentina', 'In an Argentinian hospital'],
        Switzerland: ['In Switzerland', 'Traveling to Switzerland', 'In a Swiss hospital'],
        Japan: ['In Japan', 'Traveling to Japan', 'In a Japanese hospital'],
        China: ['In China', 'Traveling to China', 'In a Chinese hospital']
    };

    async function waitForElement() {
        maxTimeouts++;
        if (maxTimeouts > 20)
            return;

        const factionWarList = document.querySelector('#faction_war_list_id');
        if (factionWarList) {
            const controlDiv = document.createElement('div');
            controlDiv.classList.add('odung');
            controlDiv.style.marginLeft = '10px';

            const apiKeyInput = document.createElement('input');
            apiKeyInput.type = 'text';
            apiKeyInput.placeholder = 'API Key';
            apiKeyInput.id = 'apiKeyInput';
            if (apiKey)
                apiKeyInput.value = apiKey;

            const factionIdInput = document.createElement('input');
            factionIdInput.type = 'text';
            factionIdInput.placeholder = 'Faction ID';
            factionIdInput.id = 'rwFactionIdInput';
            if (factionId)
                factionIdInput.value = factionId;

            const fetchButton = document.createElement('button');
            fetchButton.textContent = 'Fetch Data';
            fetchButton.id = 'rwFetch';
            fetchButton.addEventListener('click', () => {
                if (apiKeyInput.value && factionIdInput.value) {
                    apiKey = apiKeyInput.value;
                    factionId = factionIdInput.vakue;
                    localStorage.setItem('a_odung_faction_list_settings', JSON.stringify({
                        apiKey: apiKeyInput.value,
                        factionId: factionIdInput.value
                    }));
                    getMemberData(apiKeyInput.value, factionIdInput.value);
                }
            });

            const showRwTable = document.createElement('button');
            showRwTable.textContent = 'Show Table';
            showRwTable.id = 'rwTableButton';
            showRwTable.addEventListener('click', () => {
                if (memberData) {
                    const tablePage = window.open('', '_blank');
                    tablePage.document.write(`
                    <html>
                    <head>
                        <title>Member List</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                                background-color: #1e1e1e;
                                color: #ffffff;
                            }
                            table {
                                border-collapse: collapse;
                                width: 100%;
                                background-color: #2b2b2b;
                                color: #ffffff;
                            }
                            th, td {
                                border: 1px solid #444;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #333;
                                cursor: pointer;
                            }
                            tr:nth-child(even) {
                                background-color: #252525;
                            }
                            tr:hover {
                                background-color: #3a3a3a;
                            }
                            a {
                                color: #4da6ff;
                            }
                            a:hover {
                                color: #80c1ff;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Faction Member List</h1>
                        <button id="rwUpdateData" style="display: flex; background-color: #666666; margin-left: 10px; color: white; border: none; padding: 8px 16px; font-size: 14px; border-radius: 5px; cursor: pointer; margin-top: 10px;">Update Data</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Last Action</th>
                                    <th>Country</th>
                                    <th>State</th>
                                    <th>Life</th>
                                    <th>Revivable/Setting</th>
									<th>Target</th>
                                </tr>
                            </thead>
                            <tbody id="tableBody">
                            </tbody>
                        </table>
                    </body>
                    </html>
                `);
                    tablePage.document.close();

                    const tableBody = tablePage.document.getElementById('tableBody');

                    const updateButton = tablePage.document.getElementById('rwUpdateData');
                    updateButton.addEventListener('click', async () => {
                        await getMemberData(apiKey, factionId);
                        await showRwTable.click();
                        tablePage.close();

                    });

                    memberData.forEach(member => {
                        const lastActionCircle = member.last_action.status === 'Offline' ? 'gray' :
                        member.last_action.status === 'Idle' ? 'orange' : 'green';
                        const now = Date.now();
                        const lastActionTimestamp = now - (member.last_action.timestamp * 1000);
                        const lastActionText = formatTime(lastActionTimestamp);

                        const remainingStatusTime = (member.status.until * 1000) - now;
                        const statusDescription = member.status.description;
                        const location = getCountryFromStatus(statusDescription);
                        const state = member.status.state === 'Hospital' ? `Hospital: ${formatTime(remainingStatusTime)}` : member.status.state;

                        const life = `${member.life.current}/${member.life.maximum}`;
                        const revive = `${member.is_revivable}/${member.revive_setting}`;

                        const row = tablePage.document.createElement('tr');
                        row.innerHTML = `
                <td>
                    <a style="color:white" href="https://www.torn.com/profiles.php?XID=${member.id}" target="_blank">${member.name}</a>
                    <a style="color:white" href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${member.id}" target="_blank">(Attack)</a>
                </td>
                <td data-rw-last-action="${member.last_action.timestamp}">
                    <span style="color:${lastActionCircle};">●</span> ${lastActionText}
                </td>
                <td>${location}</td>
                <td data-rw-status="${member.status.until}">${state}</td>
                <td>${life}</td>
                <td>${revive}</td>
                <td>
                    <input type="checkbox" class="target-checkboxes" id="target-${member.id}" />
                </td>
            `;
                        tableBody.appendChild(row);


                        const checkbox = tablePage.document.getElementById(`target-${member.id}`);

                        function saveTargetState(memberId, isChecked) {
                            let targetStates = JSON.parse(localStorage.getItem('a_odung_faction_list_targets')) || {};
                            targetStates[memberId] = isChecked;
                            localStorage.setItem('a_odung_faction_list_targets', JSON.stringify(targetStates));
                        }

                        const targetStates = JSON.parse(localStorage.getItem('a_odung_faction_list_targets')) || {};
                        if (targetStates[member.id]) {
                            checkbox.checked = true;
                            row.style.backgroundColor = '#777';

                        }

                        checkbox.addEventListener('change', () => {
                            saveTargetState(member.id, checkbox.checked);
                            checkbox.checked ? row.style.backgroundColor = '#777' : row.style.backgroundColor = '#444';
                        });
                    });

                    const headers = tablePage.document.querySelectorAll('th');
                    headers.forEach((header, index) => {
                        header.addEventListener('click', () => {
                            sortTable(tablePage.document, index);
                        });
                    });
                }
            });

            controlDiv.appendChild(apiKeyInput);
            controlDiv.appendChild(factionIdInput);
            controlDiv.appendChild(fetchButton);
            controlDiv.appendChild(showRwTable);

            factionWarList.parentNode.insertBefore(controlDiv, factionWarList.nextSibling);

            const styles = `
                       #apiKeyInput, #rwFactionIdInput { background-color: #333; color: #fff; border: 1px solid #555 ;padding: 8px; margin-left: 10px; width: 200px; border-radius: 5px; font-size: 14px; }
                       #apiKeyInput:focus, #rwFactionIdInput:focus { border-color: #4CAF50; margin-left: 10px; outline: none; }
                       #rwFetch, #rwTableButton, #rwUpdateData { background-color: #666666; margin-left: 10px; color: white; border: none; padding: 8px 16px; font-size: 14px; border-radius: 5px; cursor: pointer; margin-top: 10px; }
                       #rwFetch:hover, #rwTableButton:hover, rwUpdateData:hover {background-color: #45a049;}
                       #rwFetch:active, #rwTableButton:active, rwUpdateData:active {background-color: #3e8e41;}
        `;

            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        } else {
            setTimeout(waitForElement, 500);
        }
    }

    function formatTime(remainingTime) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        let timeString = '';
        if (days > 0)
            timeString += `${days}d `;
        if (days > 0 || hours > 0)
            timeString += `${hours}h `;
        if (days > 0 || hours > 0 || minutes > 0)
            timeString += `${minutes}m `;
        timeString += `${seconds}s`;

        return timeString.trim();
    }

    function getCountryFromStatus(description) {
        for (const [country, statuses] of Object.entries(countryMapping)) {
            if (statuses.includes(description)) {
                return country;
            }
        }
        return ".Torn"; // . is just for sorting purposes
    }

    function sortTable(document, columnIndex) {
        const table = document.querySelector('table');
        if (!table)
            return;
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            let aValue,
                bValue;

            if (columnIndex === 0) {
                aValue = a.querySelectorAll('td')[columnIndex]?.textContent.trim() || "";
                bValue = b.querySelectorAll('td')[columnIndex]?.textContent.trim() || "";
                return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (columnIndex === 1) {
                aValue = a.querySelectorAll('td')[columnIndex]?.getAttribute('data-rw-last-action') || 0;
                bValue = b.querySelectorAll('td')[columnIndex]?.getAttribute('data-rw-last-action') || 0;
            } else if (columnIndex === 3) {
                const aState = a.querySelectorAll('td')[columnIndex]?.textContent.trim().substring(0, 8);
                const bState = b.querySelectorAll('td')[columnIndex]?.textContent.trim().substring(0, 8);

                if (aState === "Hospital" && bState === "Hospital") {
                    const aValue = Number(a.querySelectorAll('td')[columnIndex]?.getAttribute('data-rw-status')) || 0;
                    const bValue = Number(b.querySelectorAll('td')[columnIndex]?.getAttribute('data-rw-status')) || 0;

                    if (ascending) {
                        if (aValue > bValue) {
                            return 1;
                        } else if (aValue < bValue) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        if (aValue < bValue) {
                            return 1;
                        } else if (aValue > bValue) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                } else if (aState === "Hospital") {
                    return -1;
                } else if (bState === "Hospital") {
                    return 1;
                } else {
                    return ascending ? aState.localeCompare(bState) : bState.localeCompare(aState);
                }
            } else if (columnIndex === 4) {
                const aText = a.querySelectorAll('td')[columnIndex]?.textContent.trim() || "0/0";
                const bText = b.querySelectorAll('td')[columnIndex]?.textContent.trim() || "0/0";
                aValue = aText.includes('/') ? Number(aText.split('/')[0]) : 0;
                bValue = bText.includes('/') ? Number(bText.split('/')[0]) : 0;
            } else if (columnIndex === 6) {
                const aCheckbox = a.querySelectorAll('td')[columnIndex]?.querySelector('.target-checkboxes');
                const bCheckbox = b.querySelectorAll('td')[columnIndex]?.querySelector('.target-checkboxes');

                aValue = aCheckbox?.checked ? 1 : 0;
                bValue = bCheckbox?.checked ? 1 : 0;

                return ascending ? bValue - aValue : aValue - bValue;
            } else {
                aValue = a.querySelectorAll('td')[columnIndex]?.textContent.trim() || "";
                bValue = b.querySelectorAll('td')[columnIndex]?.textContent.trim() || "";
                return ascending ? aValue.localeCompare(bValue, undefined, {
                    numeric: true
                })
                : bValue.localeCompare(aValue, undefined, {
                    numeric: true
                });
            }

            return ascending ? aValue - bValue : bValue - aValue;
        });

        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));

        ascending = !ascending;
    }

    async function getMemberData(apiKey, factionId) {
        if (apiKey && factionId) {
            const response = await fetch(`https://api.torn.com/v2/faction/${factionId}/members?striptags=true&key=${apiKey}&comment=memberList`);
            const data = await response.json();
            memberData = data.members ? data.members : null;
            console.log(memberData);
            localStorage.setItem('a_odung_faction_list_data', JSON.stringify({
                memberData: memberData
            }));
        }
    }

    function init() {
        const storedSettings = JSON.parse(localStorage.getItem('a_odung_faction_list_settings')) || {};
        const storedMemberData = JSON.parse(localStorage.getItem('a_odung_faction_list_data')) || {
            memberData: null
        };
        apiKey = storedSettings.apiKey;
        factionId = storedSettings.factionId;
        console.log(apiKey, factionId);
        if (storedMemberData.memberData)
            memberData = storedMemberData.memberData;
        waitForElement();
        console.log(memberData);
    }

    init();

})();