// ==UserScript==
// @name         LSS - Einsätze einklappen (OHNE LSSM)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Platziert Einklappen-Knöpfe links in der Einsatzzeile und einen "Alle umschalten"-Knopf in der Hauptleiste.
// @author       Masklin
// @match        https://www.leitstellenspiel.de/
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546124/LSS%20-%20Eins%C3%A4tze%20einklappen%20%28OHNE%20LSSM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546124/LSS%20-%20Eins%C3%A4tze%20einklappen%20%28OHNE%20LSSM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[LSS Collapse] Skript V5 wird geladen.');

    // 1. CSS-Stile anpassen
    GM_addStyle(`
        /* Versteckt den Einsatz-Inhalt */
        .mission-collapsed .panel-body {
            display: none !important;
        }
        /* Abstand für den Knopf links vom Alarm-Button */
        .collapse-button-tm {
            margin-right: 4px !important;
        }
        /* Abstand für den "Alle umschalten"-Knopf */
        #toggleAllMissionsBtn-tm {
            margin-right: 5px !important;
        }
    `);

    // 2. Funktion für den Knopf am einzelnen Einsatz (jetzt LINKS)
    const addCollapseButton = (missionNode) => {
        const alarmButton = missionNode.querySelector('.mission-alarm-button');
        const heading = missionNode.querySelector('.panel-heading');

        if (!alarmButton || !heading || heading.querySelector('.collapse-button-tm')) {
            return;
        }

        const missionPanel = missionNode.querySelector('.panel');
        if (!missionPanel) return;

        const collapseBtn = document.createElement('a');
        collapseBtn.innerHTML = '🤏';
        collapseBtn.title = 'Einklappen/Ausklappen';
        collapseBtn.className = 'btn btn-default btn-xs collapse-button-tm';

        collapseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            missionPanel.classList.toggle('mission-collapsed');
            collapseBtn.innerHTML = missionPanel.classList.contains('mission-collapsed') ? '📖' : '🤏';
        });

        // *** DIE ÄNDERUNG: Fügt den Knopf VOR dem Alarm-Button ein ***
        heading.insertBefore(collapseBtn, alarmButton);
    };

    // 3. Funktion für den "Alle umschalten"-Knopf (neue Position)
    const addToggleAllButton = (mainPanel) => {
        if (document.getElementById('toggleAllMissionsBtn-tm')) return;

        // Dein neuer Ankerpunkt: der ausklappbare Filter
        const filterControl = mainPanel.querySelector('.filters-display-control');
        if (!filterControl) return; // Warten, falls der auch später geladen wird

        console.log('[LSS Collapse] "Alle umschalten"-Knopf wird hinzugefügt.');

        const toggleAllBtn = document.createElement('a');
        toggleAllBtn.id = 'toggleAllMissionsBtn-tm';
        toggleAllBtn.innerHTML = 'Alle 🤏/📖';
        toggleAllBtn.title = 'Alle Einsätze umschalten';
        toggleAllBtn.className = 'btn btn-default btn-xs'; // Passender Stil

        toggleAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const missions = document.querySelectorAll('#mission_list > .missionSideBarEntry');
            // Prüft, ob mindestens ein Einsatz noch offen ist. Wenn ja, werden alle geschlossen.
            const shouldCollapse = Array.from(missions).some(m => !m.querySelector('.panel').classList.contains('mission-collapsed'));

            missions.forEach(missionNode => {
                const panel = missionNode.querySelector('.panel');
                const btn = missionNode.querySelector('.collapse-button-tm');
                if (panel) panel.classList.toggle('mission-collapsed', shouldCollapse);
                if (btn) btn.innerHTML = shouldCollapse ? '📖' : '🤏';
            });
        });

        // *** DIE ÄNDERUNG: Fügt den Knopf VOR dem Filter-Control-Button ein ***
        filterControl.insertAdjacentElement('beforebegin', toggleAllBtn);
    };

    // 4. Der Observer, der alles steuert
    const observer = new MutationObserver(() => {
        // Sucht nach der neuen Kopfleiste für den "Alle"-Knopf
        const mainPanel = document.getElementById('missions-panel-main');
        if (mainPanel) {
            addToggleAllButton(mainPanel);
        }

        // Sucht nach neuen Einsätzen für die Einzel-Knöpfe (dieser Teil hat schon funktioniert)
        document.querySelectorAll('div[id^="mission_"]:not([data-collapse-processed])').forEach(node => {
            if (node.matches('div[id^="mission_"]:not([id*="panel"]):not([id*="caption"]):not([id*="address"])')) {
                addCollapseButton(node);
                node.setAttribute('data-collapse-processed', 'true'); // Markieren, um Doppelungen zu vermeiden
            }
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();