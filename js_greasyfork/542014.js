// ==UserScript==
// @name         Calculate War TRAVEL & HOSP Time
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Calculate War TRAVEL & HOSP Time via API CALL
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/factions.php?*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542014/Calculate%20War%20TRAVEL%20%20HOSP%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/542014/Calculate%20War%20TRAVEL%20%20HOSP%20Time.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = "###PDA-APIKEY###";
    
    let members = {};
    
    async function loadFactionMembers() {
        const url = `https://api.torn.com/v2/faction/members?striptags=true&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
    
        if (data.members && Array.isArray(data.members)) {
            members = {};
            data.members.forEach(member => {
                members[member.id] = member.name;
            });
            console.log("Members loaded:", members);
        } else {
            console.error("Could not retrieve members.");
        }
    }

    const webhookURL = "https://script.google.com/macros/s/AKfycbzi-ac_FXx5Ktnifm_rtb6yGElhKivG3UkgXhARVXOQyMXPDcIx_WlN_kc-IveXhlgCCQ/exec"; // Google Webhook Apps Script


    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    async function getTravelTime(userId, timestamp) {
        const url = `https://api.torn.com/v2/user/${userId}/personalstats?stat=timespenttraveling&timestamp=${timestamp}&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.personalstats?.[0]?.value || 0;
    }

    async function getResults() {
        const warId = document.getElementById('warIdInput').value.trim();
        const status = document.getElementById('statusMessage');
        status.textContent = "Getting data from API...";

        if (!/^\d+$/.test(warId)) {
            alert("Please enter a valid WarID.");
            return;
        }
        
        await loadFactionMembers(); //get faction members

        // 1. Get start and end from rankedwarreport
        const warUrl = `https://api.torn.com/torn/${warId}?selections=rankedwarreport&key=${API_KEY}`;
        const warRes = await fetch(warUrl);
        const warData = await warRes.json();

        const start_timestamp = warData?.rankedwarreport?.war?.start;
        const end_timestamp = warData?.rankedwarreport?.war?.end;

        if (!start_timestamp || !end_timestamp) {
            alert("Couldnt retrieve timestamp data.");
            return;
        }

        status.textContent = `War ${warId} | Start: ${start_timestamp}, End: ${end_timestamp}`;

        const results = [];

        for (const [userId, name] of Object.entries(members)) {
            const start = await getTravelTime(userId, start_timestamp);
            await new Promise(r => setTimeout(r, 1000)); // pause 1 sec
            const end = await getTravelTime(userId, end_timestamp);
            const diff = end - start;
            results.push({ name, time: formatTime(diff) });
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: webhookURL,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(results),
            onload: function(response) {
                if (response.status === 200) {
                    status.textContent = "Data added to Google Sheets!";
                } else {
                    status.textContent = "Warning! Error sendind data";
                }
            },
            onerror: function() {
                status.textContent = "Warning! Error connecting";
            }
        });
    }

    // UI injection
    const waitForElement = (selector, callback) => {
        const el = document.querySelector(selector);
        if (el) callback(el);
        else setTimeout(() => waitForElement(selector, callback), 500);
    };

    waitForElement('#faction_war_list_id', (target) => {
        const newDiv = document.createElement('div');
        newDiv.className = 'title-black m-top10 titleToggle___qUmTi faction-title';
        newDiv.setAttribute('data-title', 'description');
        newDiv.setAttribute('role', 'heading');
        newDiv.setAttribute('aria-level', '5');

        const arrowDiv = document.createElement('div');
        arrowDiv.className = 'titleArrow___HJmfb';
        newDiv.appendChild(arrowDiv);
        //newDiv.appendChild(document.createTextNode('Faction Description'));

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px'; // space between elements
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'warIdInput';
        input.placeholder = 'Enter War ID';

        const button = document.createElement('button');
        button.textContent = 'Confirm';
        button.onclick = getResults;
        
        const status = document.createElement('div');
        status.id = 'statusMessage';
        status.style.fontStyle = 'italic';
        status.style.color = '#00c';
        status.style.whiteSpace = 'nowrap'; // prevents new row
        
        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(status);
        newDiv.appendChild(container);

        target.parentNode.insertBefore(newDiv, target.nextSibling);
    });
})();