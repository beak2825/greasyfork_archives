// ==UserScript==
// @name         Leitstellenspiel: Summen-Leiste (Final)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Zählt Einsätze, Credits, Patienten und Gefangene aller sichtbaren Einsätze und zeigt sie in einer harmonisch ins Spiel (inkl. Dark-Mode) integrierten Leiste an.
// @author       Dein KI-Helfer
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545255/Leitstellenspiel%3A%20Summen-Leiste%20%28Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545255/Leitstellenspiel%3A%20Summen-Leiste%20%28Final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // IDs der zu überwachenden Einsatzlisten
    const missionListIds = [
        'mission_list',
        'mission_list_alliance',
        'mission_list_event',
        'mission_list_sicherheitswache',
        'mission_list_sicherheitswache_alliance',
        'mission_list_krankentransporte',
        'mission_list_alliance_event' // NEU
    ];

    const mainMissionList = document.getElementById('mission_list');
    if (!mainMissionList) return;

    let sumDisplayContainer = document.getElementById('tm-sum-display-container');
    if (!sumDisplayContainer) {
        sumDisplayContainer = document.createElement('div');
        sumDisplayContainer.id = 'tm-sum-display-container';

        sumDisplayContainer.innerHTML = `
            <span id="mission-count-display" style="display: flex; align-items: center;"></span>
            <span id="credit-sum-display" style="display: flex; align-items: center;"></span>
            <span id="patient-sum-display" style="display: flex; align-items: center;"></span>
            <span id="prisoner-sum-display" style="display: flex; align-items: center;"></span>
        `;
        mainMissionList.parentNode.insertBefore(sumDisplayContainer, mainMissionList);
    }

    // Funktion zum Anwenden der Stile basierend auf dem Theme
    function applyThemeStyles() {
        if (!sumDisplayContainer) return;

        const isDarkMode = document.body.classList.contains('dark');
        const style = sumDisplayContainer.style;

        style.display = 'flex';
        style.justifyContent = 'space-around';
        style.alignItems = 'center';
        style.padding = '4px 8px';
        style.marginBottom = '5px';
        style.borderRadius = '4px';
        style.fontSize = '13px';
        style.fontWeight = 'normal';
        style.transition = 'background-color 0.3s, color 0.3s, border-color 0.3s';

        if (isDarkMode) {
            style.backgroundColor = '#2d2d2d';
            style.border = '1px solid #555';
            style.color = '#e0e0e0';
        } else {
            style.backgroundColor = '#f5f5f5';
            style.border = '1px solid #ddd';
            style.color = 'black';
        }
    }

    // Die Berechnungsfunktion bleibt unverändert
    function calculateAndDisplaySums() {
        let totalCredits = 0, totalPatients = 0, totalPrisoners = 0, visibleMissions = 0;

        const missionSelector = missionListIds.map(id => `#${id} .missionSideBarEntry`).join(', ');
        const missions = document.querySelectorAll(missionSelector);

        missions.forEach(mission => {
            if (!mission.classList.contains('hidden') && !mission.classList.contains('searchHelperInvisble')) {
                visibleMissions++;
                const sortableData = mission.getAttribute('data-sortable-by');
                if (sortableData) {
                    try {
                        const data = JSON.parse(sortableData);
                        if (data?.average_credits) totalCredits += data.average_credits;
                        if (data?.patients_count?.[0]) totalPatients += data.patients_count[0];
                        if (data?.prisoners_count?.[0]) totalPrisoners += data.prisoners_count[0];
                    } catch (e) {
                        console.error('Fehler beim Parsen der JSON-Daten für einen Einsatz:', e);
                    }
                }
            }
        });

        const missionCountElement = document.getElementById('mission-count-display');
        const creditValueElement = document.getElementById('credit-sum-display');
        const patientValueElement = document.getElementById('patient-sum-display');
        const prisonerValueElement = document.getElementById('prisoner-sum-display');

        const createHtml = (icon, value) => `${icon} ${value.toLocaleString('de-DE')}`;
        const createPatientHtml = (value) => `<img src="/images/icons8-dizzy_person_2.svg" style="height: 18px; margin-right: 5px; vertical-align: middle;"> ${value.toLocaleString('de-DE')}`;

        if (missionCountElement && creditValueElement && patientValueElement && prisonerValueElement) {
             missionCountElement.innerHTML = createHtml('🚩', visibleMissions);
             creditValueElement.innerHTML = createHtml('💰', totalCredits);
             patientValueElement.innerHTML = createPatientHtml(totalPatients);
             prisonerValueElement.innerHTML = createHtml('⛓️', totalPrisoners);
        }
    }

    const missionObserver = new MutationObserver(calculateAndDisplaySums);
    const missionObserverConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] };
    missionListIds.forEach(id => {
        const listElement = document.getElementById(id);
        if (listElement) missionObserver.observe(listElement, missionObserverConfig);
    });

    const themeObserver = new MutationObserver(applyThemeStyles);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    applyThemeStyles();
    calculateAndDisplaySums();

})();