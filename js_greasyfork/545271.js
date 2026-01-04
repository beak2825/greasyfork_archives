// ==UserScript==
// @name         LSS-Sortierung (v1.0)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt eine funktionierende Sortierung nach Endzeit (auf/ab) für Verbandseinsätze direkt ins Dropdown-Menü ein.
// @author       Masklin & Gemini
// @match        https://www.leitstellenspiel.de/
// @downloadURL https://update.greasyfork.org/scripts/545271/LSS-Sortierung%20%28v10%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545271/LSS-Sortierung%20%28v10%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ein globaler Schalter, um den Zustand der Schattenliste zu speichern
    let shadowListIsActive = false;

    // 1. Warte, bis das Dropdown-Menü bereit ist
    const initInterval = setInterval(() => {
        const sortSelect = document.getElementById('missions-sortable-select');
        if (sortSelect) {
            clearInterval(initInterval);
            console.log('[Integrierte Sortierung] Dropdown gefunden. Initialisiere...');
            initialize(sortSelect);
        }
    }, 500);


    function initialize(sortSelect) {
        // 2. Füge unsere neuen, "intelligenten" Optionen hinzu
        if (!sortSelect.querySelector('[data-sort-key="endTime"]')) {
            const endzeitAsc = document.createElement('option');
            endzeitAsc.innerText = 'Endzeit (frühste zuerst)';
            endzeitAsc.setAttribute('data-sort-key', 'endTime');
            endzeitAsc.setAttribute('data-sort-direction', 'asc');
            sortSelect.appendChild(endzeitAsc);

            const endzeitDesc = document.createElement('option');
            endzeitDesc.innerText = 'Endzeit (späteste zuerst)';
            endzeitDesc.setAttribute('data-sort-key', 'endTime');
            endzeitDesc.setAttribute('data-sort-direction', 'desc');
            sortSelect.appendChild(endzeitDesc);
        }

        // 3. Lausche auf Änderungen im Dropdown
        sortSelect.addEventListener('change', handleSort);
    }


    function handleSort(event) {
        const selectedOption = event.target.options[event.target.selectedIndex];
        const sortKey = selectedOption.getAttribute('data-sort-key');
        const direction = selectedOption.getAttribute('data-sort-direction');

        if (sortKey === 'endTime') {
            // Wenn unsere Sortierung gewählt wird, aktiviere die Schattenliste
            showShadowList(direction);
        } else {
            // Wenn eine andere Sortierung gewählt wird, deaktiviere die Schattenliste
            hideShadowList();
        }
    }


    function showShadowList(direction) {
        console.log(`[Schattenliste] Operation gestartet. Richtung: ${direction}`);
        const originalContainer = document.getElementById('mission_list_alliance');
        if (!originalContainer) return;

        // Falls die Schattenliste schon aktiv ist, wird sie erst entfernt, um sie neu zu erstellen
        hideShadowList();

        // a. Daten extrahieren
        const missionsData = [];
        const originalMissions = originalContainer.querySelectorAll('.missionSideBarEntry');
        if (originalMissions.length === 0) return;

        originalMissions.forEach(mission => {
            const timeElement = mission.querySelector('.endzeit-anzeige');
            let minutes = (direction === 'asc' ? Infinity : -Infinity); // Standardwert für Sortierung
            if (timeElement) {
                try {
                    const timeStr = timeElement.innerText;
                    const parts = timeStr.replace(' Uhr', '').split(':').map(part => parseInt(part, 10));
                    minutes = (parts[0] * 60) + (parts[1] || 0);
                } catch {}
            }
            missionsData.push({ html: mission.outerHTML, time: minutes });
        });

        // b. Sortieren basierend auf der Richtung
        missionsData.sort((a, b) => {
            return direction === 'asc' ? a.time - b.time : b.time - a.time;
        });

        // c. Original verstecken
        originalContainer.style.display = 'none';

        // d. Schattenliste erstellen und injizieren
        const shadowContainer = document.createElement('div');
        shadowContainer.id = 'shadow_list_container';
        shadowContainer.className = originalContainer.className;
        shadowContainer.innerHTML = missionsData.map(item => item.html).join('');
        originalContainer.parentNode.insertBefore(shadowContainer, originalContainer);

        shadowListIsActive = true;
        console.log('[Schattenliste] Sortierte Kopie ist aktiv.');
    }


    function hideShadowList() {
        if (!shadowListIsActive) return;

        const originalContainer = document.getElementById('mission_list_alliance');
        const shadowContainer = document.getElementById('shadow_list_container');

        if (shadowContainer) shadowContainer.remove();
        if (originalContainer) originalContainer.style.display = ''; // Original wieder anzeigen

        shadowListIsActive = false;
        console.log('[Schattenliste] Originale Ansicht wiederhergestellt.');
    }

})();