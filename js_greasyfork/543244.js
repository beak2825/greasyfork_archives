// ==UserScript==
// @name         Grepolis Alliance Member Exporter with Timestamp
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Export the in-game alliance member list with activity status, alliance name, and generation timestamp.
// @icon         https://i.postimg.cc/SNSq11ts/button-forum-member.png
// @author       joppie
// @match        https://*.grepolis.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543244/Grepolis%20Alliance%20Member%20Exporter%20with%20Timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/543244/Grepolis%20Alliance%20Member%20Exporter%20with%20Timestamp.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Grepolis Alliance Member Exporter script with Timestamp is running.");

    const waitForElement = (selector, callback, interval = 500, timeout = 10000) => {
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(intervalId);
                console.error(`Timeout: Element with selector "${selector}" not found.`);
            }
        }, interval);
    };

 const addExportButton = () => {
    if (document.querySelector('#exportMembersButton')) {
        console.warn("Export button already exists. Skipping.");
        return;
    }

    console.log("Adding export button to a fixed position.");

    // Maak een <a> element om de link te omhullen
    const exportLink = document.createElement('a');
    exportLink.href = 'https://i.postimg.cc/SNSq11ts/button-forum-member.png';
    exportLink.target = '_blank'; // Zorg ervoor dat de link in een nieuw tabblad opent

    // Maak een <img> element voor de knop
    const exportButtonImage = document.createElement('img');
    exportButtonImage.src = 'https://i.postimg.cc/SNSq11ts/button-forum-member.png';
    exportButtonImage.alt = 'Export Members Button';
    exportButtonImage.style.position = 'fixed';
    exportButtonImage.style.bottom = '5px';
    exportButtonImage.style.left = '150px';
    exportButtonImage.style.zIndex = '10000';
    exportButtonImage.style.cursor = 'pointer';

    // Voeg de afbeelding in de link toe
    exportLink.appendChild(exportButtonImage);

    // Event listener om de bestaande functionaliteit te behouden
    exportButtonImage.addEventListener('click', (event) => {
        event.preventDefault();
        openAllianceWindow();
    });

    document.body.appendChild(exportLink);
};

    const activityMap = {
        "green.png": "🟩- Actief in de afgelopen 12 uur",
        "online.png": "💚- Actief in de afgelopen 10 minuten",
        "vacation.png": "🟦- Vakantiemodus",
        "yellow.png": "🟨- Meer dan 12 uur inactief",
        "red.png": "🟥- Meer dan 24 uur inactief",
        "banned.png": "⬛ - Schorsing",
    };

    const openAllianceWindow = () => {
        console.log("Opening Alliance window...");
        const allianceButton = document.querySelector('div[data-type="main_menu"][data-subtype="alliance"]');
        if (allianceButton) {
            allianceButton.click();
            waitForElement('span.middle', locateEigenschappenTab);
        } else {
            alert("Alliance button not found. Please ensure you're on the correct page.");
            console.warn("Alliance button not found.");
        }
    };

 const locateEigenschappenTab = () => {
    console.log("Locating 'Eigenschappen' tab...");

    const eigenschappenTab = Array.from(document.querySelectorAll('span.middle')).find(
        el => el.textContent.trim() === "Eigenschappen"
    );

    if (eigenschappenTab) {
        eigenschappenTab.click();
        waitForElement('#alliance_properties_wrapper', () => loadAllianceData());
    } else {
        console.warn("'Eigenschappen' tab not found.");
        alert("Eigenschappen-tab niet gevonden. Zorg dat je op het juiste scherm zit.");
    }
};

const loadAllianceData = () => {
    console.log("Loading Alliance data...");

    let allianceName = "Onbekend";

    // Eerst proberen we de input (bij hogere rechten)
    const allianceNameInput = document.querySelector('#alliance_name');
    if (allianceNameInput && allianceNameInput.value.trim() !== "") {
        allianceName = allianceNameInput.value.trim();
        console.log("Alliance name gevonden via input:", allianceName);
    } else {
        // Alternatief: zoek naar fieldset met <legend><b>Naam</b></legend> en pak de <p>
        const fieldsets = document.querySelectorAll('#alliance_properties_wrapper fieldset');
        for (const fs of fieldsets) {
            const legend = fs.querySelector('legend b');
            if (legend && legend.textContent.trim() === "Naam") {
                const p = fs.querySelector('p');
                if (p) {
                    allianceName = p.textContent.trim();
                    console.log("Alliance name gevonden via alternatieve methode:", allianceName);
                    break;
                }
            }
        }
    }

    if (allianceName === "Onbekend") {
        alert("Alliance naam kon niet gevonden worden.");
        console.warn("Alliance naam niet gevonden.");
        return;
    }

    // Vervolgens naar leden-tab
    const membersTab = Array.from(document.querySelectorAll('span.middle')).find(
        el => el.textContent.trim() === "Leden"
    );
    if (membersTab) {
        membersTab.click();
        waitForElement('tr[id^="alliance_player_"]', () => generateMembersFile(allianceName));
    } else {
        alert("'Leden' tab niet gevonden. Zorg dat het alliantiescherm open is.");
        console.warn("'Leden' tab niet gevonden.");
    }
};

    const generateMembersFile = (allianceName) => {
        console.log("Generating members file...");

        const rows = document.querySelectorAll('tr[id^="alliance_player_"]');
        if (!rows.length) {
            alert("No alliance members found in the current view.");
            console.warn("No alliance members found.");
            return;
        }

        const currentDateTime = new Date().toLocaleString(); // e.g., "1/2/2025, 3:04:05 PM"
        const membersData = [
            `Alliance: [ally]${allianceName}[/ally]`,
            `Generated on: ${currentDateTime}`,
            "----------------------------------------"
        ];

        Array.from(rows).forEach(row => {
            const nameElement = row.querySelector('.ally_name .gp_player_link');
            const imgElement = nameElement ? nameElement.querySelector('img') : null;

            const name = nameElement ? nameElement.textContent.trim() : "Unknown";
            const imgSrc = imgElement ? imgElement.src.split('/').pop() : null;
            const activity = imgSrc && activityMap[imgSrc] ? activityMap[imgSrc] : "Onbekend";

            membersData.push(`[player]${name}[/player]: ${activity}`);
        });

        console.log("Collected member data:", membersData);

        const blob = new Blob([membersData.join("\n")], { type: "text/plain" });
        const link = document.createElement('a');
        const currentTime = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
        link.download = `members-${currentTime}.txt`;
        link.href = URL.createObjectURL(blob);
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("File download triggered.");
    };

    waitForElement('body', addExportButton);
})();
