// ==UserScript==
// @name         Torn Faction War Attack Log
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Displays the last 10 faction attacks with profile links
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538946/Torn%20Faction%20War%20Attack%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/538946/Torn%20Faction%20War%20Attack%20Log.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = '[api-key]'; // Define API key
    const REFRESH_INTERVAL = 60; // Refresh every 60 seconds
    let remainingTime = REFRESH_INTERVAL;
    let isHidden = false;

    function addAttackContainer() {
        let warMessage = document.querySelector('.f-msg.m-top10.red'); // Locate the war notification
        if (!warMessage) {
            console.error("Could not find element .f-msg.m-top10.red");
            return;
        }

        let attackContainer = document.createElement('div');
        attackContainer.className = 'attack-container';
        attackContainer.innerHTML = `<p id="attack-title" style="font-family: Tahoma; font-weight: bold; display: flex; align-items: center;">
            <strong>Last 10 faction attacks (<span id="countdown">${remainingTime}</span> seconds to update)</strong>
            <button id="toggle-visibility" style="margin-left: 10px; padding: 3px 8px; font-size: 12px; cursor: pointer;">Hide</button>
        </p>`;
        attackContainer.style.padding = '10px';
        attackContainer.style.backgroundColor = '#222';
        attackContainer.style.color = '#fff';
        attackContainer.style.borderRadius = '5px';
        attackContainer.style.marginTop = '10px';

        let attackList = document.createElement('ul');
        attackList.id = "attack-list";
        attackList.style.listStyleType = 'none';
        attackList.style.padding = '0';

        attackContainer.appendChild(attackList);
        warMessage.parentNode.insertBefore(attackContainer, warMessage.nextSibling);

        document.getElementById('toggle-visibility').addEventListener('click', toggleVisibility);

        fetchLatestAttacks(attackList); // First API call
        setInterval(() => fetchLatestAttacks(attackList), REFRESH_INTERVAL * 1000); // Auto refresh every 60 seconds
        setInterval(updateTitle, 1000); // Update title every second
    }

    function toggleVisibility() {
        let attackList = document.getElementById('attack-list');
        let toggleButton = document.getElementById('toggle-visibility');

        isHidden = !isHidden;
        attackList.style.display = isHidden ? 'none' : 'block';
        toggleButton.textContent = isHidden ? 'Show' : 'Hide';
    }

    function updateTitle() {
        let countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = remainingTime;
        }
        remainingTime = remainingTime <= 0 ? REFRESH_INTERVAL : remainingTime - 1;
    }

    function fetchLatestAttacks(attackList) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/v2/faction/attacks?limit=10&sort=DESC&key=${API_KEY}`,
            onload: function(response) {
                if (response.status === 200) {
                    let data = JSON.parse(response.responseText);
                    displayAttacks(data.attacks, attackList);
                } else {
                    console.error("Error fetching Torn API:", response.status);
                }
                remainingTime = REFRESH_INTERVAL; // Reset countdown after refresh
                updateTitle(); // Immediately update the countdown
            }
        });
    }

    function displayAttacks(attacks, attackList) {
        attackList.innerHTML = '';

        attacks.forEach(attack => {
            let attackerName = attack.attacker 
                ? `<a href="https://www.torn.com/profiles.php?XID=${attack.attacker.id}" target="_blank" style="font-family: Tahoma; font-weight: bold; color: green;">${attack.attacker.name} (Level: ${attack.attacker.level})</a>` 
                : '<span style="font-family: Tahoma; font-weight: bold; color: green;">someone</span>';
            
            let defenderName = `<a href="https://www.torn.com/profiles.php?XID=${attack.defender.id}" target="_blank" style="font-family: Tahoma; font-weight: bold; color: green;">${attack.defender.name} (Level: ${attack.defender.level})</a>`;
            
            let listItem = document.createElement('li');
            listItem.innerHTML = `${attackerName} ➝ ${defenderName} for ${attack.respect_gain} respect, FF: ${attack.modifiers.fair_fight}, chain: ${attack.chain}, type: ${attack.result}`;
            listItem.style.padding = '10px';
            listItem.style.margin = '5px 0';
            listItem.style.backgroundColor = '#f2f2f2'; // Light gray background for better visibility
            listItem.style.borderRadius = '5px';
            listItem.style.fontFamily = 'Tahoma';
            listItem.style.fontWeight = 'bold';
            listItem.style.color = 'green';

            attackList.appendChild(listItem);
        });
    }

    window.onload = function() {
        setTimeout(addAttackContainer, 3000); // 🔥 Ensure page load stabilization before execution
    };
})();