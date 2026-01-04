// ==UserScript==
// @name         Einsatz Endzeit-Anzeige
// @version      1.1.0
// @description  Zeigt bei Verbands-Einsätzen das früheste Zufahrts-Ende an, ermöglicht Springen, Blinken, Zurücksetzen ignorierter Einsätze (jetzt mit Icon) und einen Chaostage-Umschalter
// @author       Hendrik
// @license      MIT
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @namespace https://greasyfork.org/users/1462327
// @downloadURL https://update.greasyfork.org/scripts/534412/Einsatz%20Endzeit-Anzeige.user.js
// @updateURL https://update.greasyfork.org/scripts/534412/Einsatz%20Endzeit-Anzeige.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.hasRunEinsatzEndzeitScriptVerband) return;
    window.hasRunEinsatzEndzeitScriptVerband = true;

    let nextEndButton = null;
    let einsatzMitFruehestemEnde = null;
    const STORAGE_KEY = 'chaos_ignored_einsaetze_verband';
    const CHAOS_MODE_KEY = 'chaos_mode_activated';
    const ignoredEinsaetze = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    let chaosMode = JSON.parse(localStorage.getItem(CHAOS_MODE_KEY) || 'false');

    function saveIgnored() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...ignoredEinsaetze]));
    }

    function saveChaosMode() {
        localStorage.setItem(CHAOS_MODE_KEY, JSON.stringify(chaosMode));
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function createOrUpdateButton(zeit) {
        let existingWrapper = document.getElementById('next-end-wrapper');

        if (!existingWrapper) {
            const wrapper = document.createElement('div');
            wrapper.id = 'next-end-wrapper';
            wrapper.style.position = 'sticky';
            wrapper.style.top = '0';
            wrapper.style.zIndex = '500';  // Angepasster z-index-Wert
            wrapper.style.margin = '8px';
            wrapper.style.display = 'flex';
            wrapper.style.gap = '8px';
            wrapper.style.alignItems = 'center';

            nextEndButton = document.createElement('button');
            nextEndButton.id = 'next-end-button';
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

                    const endzeitAnzeige = einsatzMitFruehestemEnde.querySelector('.endzeit-anzeige');
                    if (endzeitAnzeige) {
                        endzeitAnzeige.classList.add('blink-animation');
                        setTimeout(() => {
                            endzeitAnzeige.classList.remove('blink-animation');
                        }, 5000);
                    }
                }
            });

            const resetButton = document.createElement('button');
            resetButton.id = 'reset-ignored-button';
            resetButton.textContent = '↺';  // Symbol anstelle von Text
            resetButton.title = 'Ignorierte Einsätze zurücksetzen';
            resetButton.style.padding = '2px 6px';
            resetButton.style.backgroundColor = '#888';
            resetButton.style.color = 'white';
            resetButton.style.border = 'none';
            resetButton.style.borderRadius = '50%';
            resetButton.style.cursor = 'pointer';
            resetButton.style.fontSize = '14px';
            resetButton.style.lineHeight = '1';
            resetButton.style.width = '24px';
            resetButton.style.height = '24px';
            resetButton.style.display = 'flex';
            resetButton.style.alignItems = 'center';
            resetButton.style.justifyContent = 'center';
            resetButton.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)';
            resetButton.addEventListener('click', () => {
                ignoredEinsaetze.clear();
                saveIgnored();
                addEndTimes();
            });

            const chaosToggleButton = document.createElement('button');
            chaosToggleButton.id = 'chaos-toggle-button';
            chaosToggleButton.textContent = chaosMode ? 'Chaostage: AN' : 'Chaostage: AUS';
            chaosToggleButton.style.padding = '4px 8px';
            chaosToggleButton.style.backgroundColor = chaosMode ? '#e74c3c' : '#27ae60';
            chaosToggleButton.style.color = 'white';
            chaosToggleButton.style.border = 'none';
            chaosToggleButton.style.borderRadius = '4px';
            chaosToggleButton.style.cursor = 'pointer';
            chaosToggleButton.style.fontSize = '12px';
            chaosToggleButton.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)';
            chaosToggleButton.addEventListener('click', () => {
                chaosMode = !chaosMode;
                chaosToggleButton.textContent = chaosMode ? 'Chaostage: AN' : 'Chaostage: AUS';
                chaosToggleButton.style.backgroundColor = chaosMode ? '#e74c3c' : '#27ae60';
                saveChaosMode();
                addEndTimes();
            });

            wrapper.appendChild(nextEndButton);
            wrapper.appendChild(resetButton);
            wrapper.appendChild(chaosToggleButton);

            const einsatzContainer = document.querySelector('#mission_list_alliance');
            if (einsatzContainer?.parentElement) {
                einsatzContainer.parentElement.insertBefore(wrapper, einsatzContainer);
            }
        } else {
            const button = document.getElementById('next-end-button');
            if (button) button.textContent = `Nächste Endzeit: ${zeit}`;
        }
    }

    function calculateOffset(avgCredits) {
        if (chaosMode) {
            return avgCredits <= 4999 ? 1800 : 5400; // Chaostage
        } else {
            return avgCredits <= 4999 ? 3600 : 10800; // Normal
        }
    }

    function verarbeiteEinsatzliste(container) {
        if (!container) return { fruehesteZeit: Infinity, eintrag: null };

        let fruehesteZeit = Infinity;
        let fruehesterEintrag = null;

        container.querySelectorAll('.missionSideBarEntry').forEach(entry => {
            const missionId = entry.getAttribute('mission_id');
            if (!missionId || ignoredEinsaetze.has(missionId)) return;

            const sortableRaw = entry.getAttribute('data-sortable-by');
            if (!sortableRaw) return;

            try {
                const sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
                const age = sortableData.age;
                const avgCredits = sortableData.average_credits;
                const offset = calculateOffset(avgCredits);
                const endTimestamp = age + offset;

                if (endTimestamp < fruehesteZeit) {
                    fruehesteZeit = endTimestamp;
                    fruehesterEintrag = entry;
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
                        ignoredEinsaetze.add(missionId);
                        saveIgnored();
                        addEndTimes();
                    });

                    entry.querySelector('.panel-heading')?.appendChild(zeitAnzeige);
                }
            } catch (err) {
                console.error('Fehler beim Parsen:', err);
            }
        });

        return { fruehesteZeit, eintrag: fruehesterEintrag };
    }

    function addEndTimes() {
        const verbandsEinsaetze = document.querySelector('#mission_list_alliance');
        const result = verarbeiteEinsatzliste(verbandsEinsaetze);

        if (result.fruehesteZeit < Infinity) {
            einsatzMitFruehestemEnde = result.eintrag;
            createOrUpdateButton(formatTime(result.fruehesteZeit));
        }
    }

    const style = document.createElement('style');
    style.textContent = `
@keyframes blink {
    0% { background-color: yellow; }
    50% { background-color: red; }
    100% { background-color: yellow; }
}
.blink-animation {
    animation: blink 1s linear infinite;
}
`;
    document.head.appendChild(style);

    setInterval(addEndTimes, 2000);
})();
