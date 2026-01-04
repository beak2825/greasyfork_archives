// ==UserScript==
// @name         Cartel Empire - Battlestats TornPDA Format Copy Paste
// @namespace    baccy.ce
// @version      0.1.1
// @description  Turns the Gym 'Workout' title to a button that fetches stats from the API, formats your stats like TornPDA does and adds a 'Copy' button to easily share them
// @author       Baccy
// @match        https://cartelempire.online/Gym
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532000/Cartel%20Empire%20-%20Battlestats%20TornPDA%20Format%20Copy%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/532000/Cartel%20Empire%20-%20Battlestats%20TornPDA%20Format%20Copy%20Paste.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let name = await GM.getValue("name", null);

    function createButton() {
        const header = document.querySelector('.header-section');
        if (!header) return;

        const title = header.querySelector('h2');
        title.style.cssText = 'cursor: pointer;';
        title.addEventListener('click', (e) => {
            showPopup(title);
        });
    }

    async function showPopup(btn) {
        if (document.getElementById("stats-popup")) return;

        const rect = btn.getBoundingClientRect();

        let popup = document.createElement('div');
        popup.id = "stats-popup";
        popup.style.cssText = `background-color: #1e1e1e;color: white;padding: 15px;border: 2px solid #444;box-shadow: 0 4px 10px rgba(0,0,0,0.5);border-radius: 8px;position: absolute;top: ${rect.top + window.scrollY}px;left: ${rect.left + window.scrollX}px;z-index: 9999;`;

        if (name) {
            let nameInput = document.createElement('input');
            nameInput.value = await GM.getValue("name", "");
            nameInput.style.cssText = "display: block; margin: 5px 0; padding: 5px; width: 100%; background-color: #555; color: white; border: 1px solid #444; border-radius: 4px;";
            nameInput.addEventListener('input', () => GM.setValue('name', nameInput.value));
            popup.appendChild(nameInput);
        }

        let apiKeyInput = document.createElement('input');
        apiKeyInput.placeholder = 'Private - Limited API Key';
        apiKeyInput.value = await GM.getValue("apiKey", "");
        apiKeyInput.style.cssText = "display: block; margin: 5px 0; padding: 5px; width: 100%; background-color: #555; color: white; border: 1px solid #444; border-radius: 4px;";
        apiKeyInput.addEventListener('input', () => GM.setValue('apiKey', apiKeyInput.value));

        let fetchButton = document.createElement('button');
        fetchButton.textContent = "Fetch Stats";
        fetchButton.style.cssText = "padding: 5px 10px; margin: 5px 0; cursor: pointer; color: white; background-color: #444; border: none; border-radius: 4px;";
        fetchButton.addEventListener('click', () => fetchStats(apiKeyInput.value, popup));

        popup.append(apiKeyInput, fetchButton);
        document.body.appendChild(popup);
    }

    async function fetchStats(apiKey, popup) {
        if (!name) {
            const response = await fetch(`https://cartelempire.online/api/user?type=basic&key=${apiKey}`);
            const data = await response.json();
            if (data.error) {
                alert(data.error.error);
                return;
            }

            name = data.name;
            const id = data.userId;

            await GM.setValue("name", name);
            await GM.setValue("id", id);
        }

        const statsResponse = await fetch(`https://cartelempire.online/api/user?type=battlestats&key=${apiKey}`);
        if (!statsResponse.ok) {
            alert('Error fetching battlestats.');
            return;
        }
        const statsData = await statsResponse.json();

        displayStats(statsData, popup);
    }
    async function displayStats(stats, popup) {
        const id = await GM.getValue('id', null);

        let strength = stats.strength;
        let accuracy = stats.accuracy;
        let agility = stats.agility;
        let defence = stats.defence;

        let total = strength + accuracy + agility + defence;
        let format = (num) => Math.round(num).toLocaleString();

        let statArray = [
            { name: 'Strength', value: strength },
            { name: 'Defence', value: defence },
            { name: 'Agility', value: agility },
            { name: 'Accuracy', value: accuracy }
        ];

        let rawPercents = statArray.map(s => (s.value / total) * 100);
        let roundedPercents = rawPercents.map(p => Math.floor(p));
        let remainder = 100 - roundedPercents.reduce((a, b) => a + b, 0);

        let decimalParts = rawPercents.map((p, i) => ({ index: i, decimal: p - roundedPercents[i] }));
        decimalParts.sort((a, b) => b.decimal - a.decimal);

        for (let i = 0; i < remainder; i++) {
            roundedPercents[decimalParts[i].index]++;
        }

        let statText = `${name} [${id}]

BATTLE STATS
${statArray.map((s, i) => `${s.name}: ${format(s.value)} (${roundedPercents[i]}%)`).join('\n')}
-------
Total: ${format(total)}`;

        let textArea = document.createElement('textarea');
        textArea.value = statText;
        textArea.style.cssText = 'width: 100%; height: 200px; margin-top: 10px; background-color: #444; color: white; border: 1px solid #444; border-radius: 4px;';
        popup.appendChild(textArea);

        let btnDiv = document.createElement('div');
        btnDiv.style.cssText = 'justify-content: space-between; display: flex;';

        let copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.style.cssText = 'padding: 5px 10px; margin: 5px 0; cursor: pointer; color: white; background-color: #444; border: none; border-radius: 4px;';
        copyBtn.addEventListener('click', () => {
            textArea.select();
            document.execCommand('copy');
        });

        let closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = 'padding: 5px 10px; margin: 5px 0; cursor: pointer; color: white; background-color: #444; border: none; border-radius: 4px;';
        closeBtn.addEventListener('click', () => {
            popup.remove();
        });

        btnDiv.appendChild(copyBtn);
        btnDiv.appendChild(closeBtn);
        popup.appendChild(btnDiv);
    }

    createButton();
})();