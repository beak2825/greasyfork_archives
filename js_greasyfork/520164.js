// ==UserScript==
// @name         Torn - Territory Slot Notice
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Use API requests to check if any territory war the user is in has available slots and displays a notice for those that do. Script disable button on faction page. With default settings, every 5 minutes it makes one request to check your active wars and then another for each different defending faction of your territory wars to check the slot numbers
// @author       Baccy
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520164/Torn%20-%20Territory%20Slot%20Notice.user.js
// @updateURL https://update.greasyfork.org/scripts/520164/Torn%20-%20Territory%20Slot%20Notice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxAPIRequestInterval = 1000 * 60 * 5 // Default 5 minutes (in milliseconds)

    let territoryWars = [];
    let territorySlots = [];
    
    let isEnabled = JSON.parse(localStorage.getItem('a_wallSlotsEnabled')) ?? true;

    let publicAPIKey = localStorage.getItem('a_publicAPIKey');
    if (!publicAPIKey) {
        addAPIKeyInput();
        return;
    }

    const now = Date.now();
    let lastCheck = localStorage.getItem('a_lastWallSlotCheck') || 0;

    if (isEnabled) {
        if (now - lastCheck >= maxAPIRequestInterval) {
            init();
            localStorage.setItem('a_lastWallSlotCheck', now);
        } else {
            const storedSlotsData = localStorage.getItem('a_previousSlotsData');
            if (storedSlotsData) {
                territorySlots = JSON.parse(storedSlotsData);
                displayNotices();
            }
        }
    }
    
    if (window.location.href.includes('https://www.torn.com/factions.php?step=your')) {
        const toggleButton = document.createElement('button');
        toggleButton.innerText = 'Wall Slots';
        toggleButton.style = isEnabled 
            ? 'padding: 5px 5px; border-radius: 5px; background-color: #555555; color: lightgreen; border: none; cursor: pointer;'
            : 'padding: 5px 5px; border-radius: 5px; background-color: #555555; color: white; border: none; cursor: pointer;';

		toggleButton.onmouseover = () => {
			toggleButton.style.backgroundColor = '#444444';
		};
		toggleButton.onmouseout = () => {
			toggleButton.style.backgroundColor = '#555555';
		};

        toggleButton.onclick = () => {
            isEnabled = !isEnabled;
            localStorage.setItem('a_wallSlotsEnabled', isEnabled);
            toggleButton.style.color = isEnabled ? 'lightgreen' : 'white';
        };

        const buttonElement = document.querySelector('div.content-title > h4');
        if (buttonElement) {
            buttonElement.appendChild(toggleButton);
        }
    }

    async function init() {
        try {
            await fetchTerritoryWars();
            await fetchTerritorySlots();
            displayNotices();
        } catch (error) {
            console.error("An error occurred during initialization:", error);
        }
    }

    async function fetchTerritoryWars() {
        const apiUrl = `https://api.torn.com/v2/faction/wars?key=${publicAPIKey}&comment=wallslots`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.error && data.error.code === 2 && data.error.error === "Incorrect key") {
                alert('API returned "Incorrect Key". Key removed from storage. Refresh and enter a valid one');
                localStorage.removeItem('a_publicAPIKey');
                return;
            }

            if (data.wars && data.wars.territory) {
                data.wars.territory.forEach(war => {
                    const defendingFaction = war.factions.find(faction => !faction.is_aggressor);
                    if (defendingFaction) {
                        territoryWars.push({
                            name: war.territory,
                            defendingFaction: defendingFaction.id
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching territory wars:", error);
        }
    }

    async function fetchTerritorySlots() {
        if (territoryWars.length === 0) {
            console.warn("No territory wars to process.");
            return;
        }
    
        const factionWars = {};
        for (const war of territoryWars) {
            const { name, defendingFaction } = war;
            if (!factionWars[defendingFaction]) {
                factionWars[defendingFaction] = [];
            }
            factionWars[defendingFaction].push(name);
        }
    
        for (const [defendingFaction, territories] of Object.entries(factionWars)) {
            const apiUrl = `https://api.torn.com/v2/faction?key=${publicAPIKey}&selections=territory&id=${defendingFaction}&comment=wallslots`;
    
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                }
    
                const data = await response.json();
    
                for (const territoryName of territories) {
                    const territoryData = data.territory[territoryName];
    
                    if (territoryData) {
                        const totalSlots = territoryData.slots;
                        const unavailableSlots = (territoryData.war?.assaulters?.length || 0) + (territoryData.war?.defenders?.length || 0);
    
                        territorySlots.push({
                            name: territoryName,
                            totalSlots,
                            unavailableSlots,
                        });
    
                    } else {
                        console.warn(`Territory "${territoryName}" not found in faction ${defendingFaction}'s data.`);
                    }
                }
            } catch (error) {
                console.error(`Error processing territories for faction ${defendingFaction}:`, error);
            }
        }
    
        localStorage.setItem('a_previousSlotsData', JSON.stringify(territorySlots));
    }

    function displayNotices() {
        const banner = document.querySelector("#topHeaderBanner");
        if (!banner) {
            console.warn("Top header banner not found.");
            return;
        }
        
        const existingElements = banner.querySelectorAll('.wall-slots-element');
        existingElements.forEach(element => element.remove());

        for (const { name, totalSlots, unavailableSlots } of territorySlots) {
            const availableSlots = totalSlots - unavailableSlots;

            if (availableSlots > 0) {
                const span = document.createElement("span");
                span.textContent = `There are ${availableSlots} wall slots available for ${name}`;
                span.classList.add('wall-slots-element');
                span.style.margin = "5px";
                span.style.color = "#fff";
                span.style.backgroundColor = "#232323";
                span.style.padding = "8px 12px";
                span.style.borderRadius = "5px";
                span.style.fontWeight = "bold";
                span.style.border = "1px solid #444";
                span.style.display = "inline-block";

                banner.appendChild(span);
            }
        }
    }

    function addAPIKeyInput() {
        const banner = document.querySelector("#topHeaderBanner");
        if (!banner) {
            console.warn("Top header banner not found.");
            return;
        }
        
        const existingElements = banner.querySelectorAll('.wall-slots-element');
        existingElements.forEach(element => element.remove());

        const input = document.createElement("input");
        input.classList.add('wall-slots-element');
        input.type = "text";
        input.placeholder = "Enter Public API Key";
        input.style.margin = "5px";
        input.style.backgroundColor = "#333";
        input.style.color = "#fff";
        input.style.border = "1px solid #555";
        input.style.padding = "5px";
        input.style.borderRadius = "5px";

        const saveButton = document.createElement("button");
        saveButton.classList.add('wall-slots-element');
        saveButton.textContent = "Save";
        saveButton.style.margin = "5px";
        saveButton.style.backgroundColor = "#444";
        saveButton.style.color = "#fff";
        saveButton.style.border = "1px solid #555";
        saveButton.style.padding = "5px 5px";
        saveButton.style.borderRadius = "5px";
        saveButton.style.cursor = "pointer";
        saveButton.style.transition = "background-color 0.3s";

        saveButton.addEventListener("click", () => {
            const key = input.value.trim();
            if (key) {
                publicAPIKey = key;
                localStorage.setItem('a_publicAPIKey', key);
                banner.removeChild(input);
                banner.removeChild(saveButton);
                init();
            } else alert("Please enter a valid API key.");
        });

        banner.appendChild(input);
        banner.appendChild(saveButton);
    }

})();