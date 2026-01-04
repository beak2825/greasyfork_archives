// ==UserScript==
// @name         Einsatz Endzeit Anzeige - (CHAOSTAGE)
// @version      1.0.2
// @description  Zeigt bei geteilten Verbands-Einsätzen das früheste Zufahrts-Ende an und ermöglicht das Springen zum frühesten Einsatz in der Verbandsliste
// @author       Hendrik & ChatGPT
// @license      MIT
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @namespace https://greasyfork.org/users/1462327
// @downloadURL https://update.greasyfork.org/scripts/534490/Einsatz%20Endzeit%20Anzeige%20-%20%28CHAOSTAGE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534490/Einsatz%20Endzeit%20Anzeige%20-%20%28CHAOSTAGE%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Schutz vor Mehrfachausführung
    if (window.hasRunEinsatzEndzeitScript) return;
    window.hasRunEinsatzEndzeitScript = true;

    let nextEndButton = null;
    let einsatzMitFruehestemEnde = null;
    const ignoredEinsaetze = new Set();

    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function createOrUpdateButton(zeit) {
        let existingButton = document.getElementById('next-end-button');

        if (!existingButton) {
            nextEndButton = document.createElement('button');
            nextEndButton.id = 'next-end-button';
            nextEndButton.textContent = `Nächste Endzeit: ${zeit}`;
            nextEndButton.style.position = 'sticky';
            nextEndButton.style.top = '0';
            nextEndButton.style.zIndex = '1000';
            nextEndButton.style.margin = '8px';
            nextEndButton.style.padding = '6px 12px';
            nextEndButton.style.backgroundColor = '#444';
            nextEndButton.style.color = 'white';
            nextEndButton.style.border = 'none';
            nextEndButton.style.borderRadius = '6px';
            nextEndButton.style.cursor = 'pointer';
            nextEndButton.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';
            nextEndButton.addEventListener('click', () => {
                if (einsatzMitFruehestemEnde) {
                    einsatzMitFruehestemEnde.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });

            const einsatzContainer = document.querySelector('#mission_list_alliance');
            if (einsatzContainer?.parentElement) {
                einsatzContainer.parentElement.insertBefore(nextEndButton, einsatzContainer);
            }
        } else {
            existingButton.textContent = `Nächste Endzeit: ${zeit}`;
            nextEndButton = existingButton;
        }
    }

    function addEndTimes() {
        const einsatzContainer = document.querySelector('#mission_list_alliance');
        if (!einsatzContainer) return;

        let fruehesterZeitpunkt = Infinity;
        einsatzMitFruehestemEnde = null;

        einsatzContainer.querySelectorAll('.missionSideBarEntry').forEach(entry => {
            const sortableRaw = entry.getAttribute('data-sortable-by');
            if (!sortableRaw) return;

            try {
                const sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
                const age = sortableData.age;
                const avgCredits = sortableData.average_credits;

                if (!age || avgCredits === undefined || avgCredits === null) return;

                // Neue Offset-Regelung
                const offset = avgCredits <= 4999 ? 1800 : 5400;
                const endTimestamp = age + offset;

                if (ignoredEinsaetze.has(entry)) return;

                if (endTimestamp < fruehesterZeitpunkt) {
                    fruehesterZeitpunkt = endTimestamp;
                    einsatzMitFruehestemEnde = entry;
                }

                if (!entry.querySelector('.endzeit-anzeige')) {
                    const zeitAnzeige = document.createElement('div');
                    zeitAnzeige.className = 'endzeit-anzeige';
                    zeitAnzeige.style.marginLeft = '8px';
                    zeitAnzeige.style.fontSize = 'smaller';
                    zeitAnzeige.style.color = 'white';
                    zeitAnzeige.style.backgroundColor = '#ff0000';
                    zeitAnzeige.style.padding = '2px 6px';
                    zeitAnzeige.style.borderRadius = '4px';
                    zeitAnzeige.style.display = 'inline-block';
                    zeitAnzeige.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.3)';
                    zeitAnzeige.textContent = `Ende: ${formatTime(endTimestamp)}`;

                    zeitAnzeige.addEventListener('click', () => {
                        zeitAnzeige.style.display = 'none';
                        ignoredEinsaetze.add(entry);
                    });

                    entry.querySelector('.panel-heading')?.appendChild(zeitAnzeige);
                }
            } catch (err) {
                console.error('Fehler beim Parsen:', err);
            }
        });

        if (fruehesterZeitpunkt < Infinity) {
            createOrUpdateButton(formatTime(fruehesterZeitpunkt));
        }
    }

    setInterval(addEndTimes, 2000);
})();
