// ==UserScript==
// @name         S.H.I.T
// @namespace    http://tampermonkey.net/
// @version      0.8.34.1
// @description  Shows faction members currently in the hospital with the remaining time
// @author       Shaitan [2802630]
// @match        https://www.torn.com/factions.php?step=profile&ID*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/490738/SHIT.user.js
// @updateURL https://update.greasyfork.org/scripts/490738/SHIT.meta.js
// ==/UserScript==

/*
     _________.__           .__  __
    /   _____/|  |__ _____  |__|/  |______    ____
    \_____  \ |  |  \\__  \ |  \   __\__  \  /    \
    /        \|   Y  \/ __ \|  ||  |  / __ \|   |  \
   /_______  /|___|  (____  /__||__| (____  /___|  /
           \/      \/     \/              \/     \/
   Closed Beta version.
   Licence: DO NOT REDISTRIBUTE, Modifications are 100% encouraged However I wont fix it if you break it!

   Version number is in the format of [beta or published (0/1) .functional edits .css edits .error handler]

   Display Torn faction members currently in the hospital immediately before the factions div,
   sorted by time left in hospital in ascending order.
   Works ONLY on the faction page of the target.

   Only requires Public API key

   Hard coded to refresh every 30 seconds, single API call (2 per minute)
   You can alter this by editing setInterval(main, 30000); at the end of the script, time in milliseconds
   I take no responsibility if you hammer the API but 10k - 15k is probably ok but frankly unnecessary
*/

(function() {
    'use strict';

    // Function to create and return a DOM element with specified attributes
    function createDOMElement(tagName, attributes, eventListener) {
        console.log(`Creating ${tagName}.`);
        const element = document.createElement(tagName);
        for (const [key, value] of Object.entries(attributes)) {
            element.setAttribute(key, value);
        }
        if (eventListener) {
            element.addEventListener(eventListener.eventType, eventListener.handler);
        }
        console.log(`${tagName} created.`);
        return element;
    }

    // INJECTIONS
    function injectElements() {
        console.log('Injecting elements.');

        // Inject the status container
        const targetDiv = document.getElementById('factions');

        // Create status container and buttons
        const statusContainer = createDOMElement('div', {
            'id': 'torn-faction-status-container',
            'style': 'display: block; background-color: #222; color: white; padding: 10px; margin-bottom: 20px; display: flex; flex-direction: column;'
        });

        const shitButton = createDOMElement('button', {
            'id': 'custom-button',
            'style': 'color: white; background-color: #00b300; border: none; padding: 6px 8px; border-radius: 5px; font-family: Helvetica; font-size: 13px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); margin-right: 10px;'
        });
        shitButton.textContent = 'S.H.I.T';

        const copyButton = createDOMElement('button', {
            'id': 'copy-button',
            'style': 'color: white; background-color: #0073e6; border: none; padding: 6px 8px; border-radius: 5px; font-family: Helvetica; font-size: 13px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);'
        });
        copyButton.textContent = 'Copy Top 4';

        // Inject both status container and buttons
        if (targetDiv) {
            targetDiv.parentNode.insertBefore(shitButton, targetDiv);
            targetDiv.parentNode.insertBefore(copyButton, targetDiv);
            targetDiv.parentNode.insertBefore(statusContainer, targetDiv);
        } else {
            document.body.appendChild(shitButton);
            document.body.appendChild(copyButton);
            document.body.appendChild(statusContainer);
        }

        console.log('Status container and buttons injected.');

        const statusVisibility = localStorage.getItem('statusVisibility') || 'open';
        if (statusVisibility === 'closed') {
            statusContainer.style.display = 'none';
        }

        shitButton.addEventListener('click', function() {
            if (statusContainer.style.display === 'none') {
                statusContainer.style.display = 'block';
                localStorage.setItem('statusVisibility', 'open');
            } else {
                statusContainer.style.display = 'none';
                localStorage.setItem('statusVisibility', 'closed');
            }
        });

        copyButton.addEventListener('click', function() {
            copyTopFourToClipboard();
        });

        main();
    }

    injectElements();

    function fetchData(factionId, apiKey, callback) {
        console.log('Fetching data from API.');
        const url = `https://api.torn.com/faction/${factionId}?selections=&key=${apiKey}`;

        fetch(url)
            .then(response => {
                const clonedResponse = response.clone();
                console.log('Status Response from API - Status:', clonedResponse.status);
                return response;
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data) {
                    throw new Error('Empty response received from the server');
                }
                console.log('Data fetched successfully:', data);
                callback(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                callback(null);
            });
    }

    function extractHospitalizationTime(description) {
        console.log('Extracting hospitalization time.');
        var match = description.match(/In hospital for (\d+) (?:hrs|min|secs)/);
        if (match) {
            var time = parseInt(match[1]);
            var unit = description.match(/hrs|min|secs/)[0];
            if (unit === 'hrs') {
                return time * 60;
            } else if (unit === 'min') {
                return time;
            } else if (unit === 'secs') {
                return time / 60;
            }
        }
        console.log('Hospitalization time not found.');
        return Infinity;
    }

    function displayHospitalizedMembers(data) {
        console.log('Displaying hospitalized members.');
        if (!data || !data.members) {
            console.error('Faction data not found.');
            return;
        }

        const members = data.members;
        let hospitalizedMembers = [];

        for (const memberId in members) {
            const member = members[memberId];
            const description = member.status.description;
            if (description.includes('In hospital')) {
                const timeLeft = extractHospitalizationTime(description);
                hospitalizedMembers.push({
                    memberId: memberId,
                    name: member.name,
                    relative: member.last_action.relative,
                    description: description,
                    timeLeft: timeLeft
                });
            } else if (description.includes('Okay')) {
                console.log(`Member whose status includes "Okay": ${member.name}`);
            }
        }

        hospitalizedMembers.sort((a, b) => a.timeLeft - b.timeLeft);

        let statusHtml = '<h2 style="margin-top: 0; font-size: 16px;">Currently in Hospital</h2><ul style="list-style-type: none; padding: 0;">';
        for (const member of hospitalizedMembers) {
            const profileLink = `https://www.torn.com/profiles.php?XID=${member.memberId}`;
            statusHtml += `<li style="margin-bottom: 10px; font-size: 12px;"><strong><a href="${profileLink}" style="color: #4caf50; text-decoration: underline;" target="_blank">${member.name}</a></strong>: (Last action: ${member.relative}) - ${member.description}</li>`;
        }
        statusHtml += '</ul>';

        const statusContainer = document.getElementById('torn-faction-status-container');
        if (statusContainer) {
            statusContainer.innerHTML = statusHtml;
        } else {
            console.error('Status container not found.');
        }
        console.log('Hospitalized members displayed.');
    }

    function copyTopFourToClipboard() {
        console.log('Copying top 4 hospitalized members to clipboard.');
        const statusContainer = document.getElementById('torn-faction-status-container');
        if (!statusContainer) {
            console.error('Status container not found.');
            return;
        }

        const listItems = statusContainer.querySelectorAll('li');
        if (listItems.length === 0) {
            console.log('No hospitalized members to copy.');
            return;
        }

                let copyText = '';
        for (let i = 0; i < Math.min(4, listItems.length); i++) {
            copyText += listItems[i].innerText + '\n';
        }

        navigator.clipboard.writeText(copyText).then(() => {
            console.log('Top 4 hospitalized members copied to clipboard.');
          //  alert('Top 4 hospitalized members copied to clipboard.');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }

    function promptForAPIKey() {
        console.log('Prompting for API key.');
        let apiKey = GM_getValue('apiKey');
        if (!apiKey) {
            apiKey = prompt('Enter a Public Torn API key:');
            GM_setValue('apiKey', apiKey);
        }
        console.log('API key obtained.');
        return apiKey;
    }

    function getFactionIdFromUrl() {
        console.log('Extracting faction ID from URL.');
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('ID');
    }

    function main() {
        console.log('Main function executing.');
        const factionId = getFactionIdFromUrl();
        if (!factionId) {
            console.error('Faction ID not found in the URL.');
            return;
        }

        let apiKey = GM_getValue('apiKey');
        if (!apiKey) {
            apiKey = promptForAPIKey();
        }

        if (!apiKey) {
            alert('API key is required.');
            return;
        }

        fetchData(factionId, apiKey, function(data) {
            if (data) {
                displayHospitalizedMembers(data);
            }
        });
        console.log('Main function executed.');
    }

    main();
    setInterval(main, 30000);

    console.log('Script completed.');
})();

