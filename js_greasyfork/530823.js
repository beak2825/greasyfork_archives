// ==UserScript==
// @name         LSS Einsätze Einklappen
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0.4
// @license      MIT
// @description  Erweiterte Version zum Ein-/Ausklappen von Einsätzen
// @author       blckcld
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/530823/LSS%20Eins%C3%A4tze%20Einklappen.user.js
// @updateURL https://update.greasyfork.org/scripts/530823/LSS%20Eins%C3%A4tze%20Einklappen.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Styles
    GM_addStyle(`
        .mission-collapsed {
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            overflow: hidden !important;
        }
    `);
 
    // Globale Variable für den Zustand
    window.allCollapsed = true; // Standardmäßig alle zugeklappt
 
    // Toggle Funktion
    const toggleMission = (mission, force = null) => {
        const content = mission.querySelector('.panel-body');
        const isCollapsed = force !== null ? force : !content.classList.contains('mission-collapsed');
 
        content.classList.toggle('mission-collapsed', isCollapsed);
    };
 
    // Erstelle "Alle Ein-/Ausklappen" Button
    const createCollapseAllBtn = () => {
        const btn = document.createElement('a');
        btn.className = 'btn btn-xs btn-default';
        btn.textContent = window.allCollapsed ? 'Aufklappen' : 'Zuklappen';
        btn.title = 'Alle Einsätze ein-/ausklappen';
 
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.allCollapsed = !window.allCollapsed;
            btn.textContent = window.allCollapsed ? 'Aufklappen' : 'Zuklappen';
            
            document.querySelectorAll('.missionSideBarEntry').forEach(mission => {
                toggleMission(mission, window.allCollapsed);
            });
            
            // Speichere Zustand
            localStorage.setItem('lss_all_missions_collapsed', window.allCollapsed.toString());
        });
 
        return btn;
    };
 
    // Patch für loadAllianceMissions Funktion
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.loadAllianceMissions = function(page) {
            if (!page) page = 1;
            $.ajax({
                url: '/missions/alliance/' + page,
                method: 'GET',
                success: function(data) {
                    $('#alliance_missions').html(data);
                    initCollapseMissions(); // Initialisiere Collapse-Funktionen nach dem Laden
                }
            });
        };
    }
 
    // Hauptfunktion
    const initCollapseMissions = () => {
        const missionList = document.getElementById('missions-panel-body');
        if (!missionList) return;
 
        // Füge "Alle Ein-/Ausklappen" Button in die mission-filters-row ein
        const filtersRow = document.querySelector('.mission-filters-row');
        if (filtersRow && !document.querySelector('.btn-xs[title="Alle Einsätze ein-/ausklappen"]')) {
            // Erstelle ein div für den Button mit dem gleichen Styling wie die anderen Filter-Elemente
            const btnContainer = document.createElement('div');
            btnContainer.className = 'col-xs-auto';
            btnContainer.style.marginLeft = '5px';
            btnContainer.appendChild(createCollapseAllBtn());
            
            // Füge den Container am Ende der Zeile ein (rechts)
            filtersRow.appendChild(btnContainer);
        }
 
        // Klappe alle Einsätze zu oder auf, je nach aktuellem Zustand
        document.querySelectorAll('.missionSideBarEntry').forEach(mission => {
            toggleMission(mission, window.allCollapsed);
        });
    };
 
    // Beobachter für dynamisch geladene Einsätze
    const observer = new MutationObserver(() => {
        // Nur neue Einsätze behandeln
        const newMissions = document.querySelectorAll('.missionSideBarEntry:not(.mission-processed)');
        newMissions.forEach(mission => {
            mission.classList.add('mission-processed');
            toggleMission(mission, window.allCollapsed);
        });
    });
 
    // Initialisierung
    const init = () => {
        // Lade gespeicherten Zustand
        const savedState = localStorage.getItem('lss_all_missions_collapsed');
        if (savedState !== null) {
            window.allCollapsed = savedState === 'true';
        }
        
        const missionsPanel = document.getElementById('missions-panel-body');
        if (missionsPanel) {
            observer.observe(missionsPanel, { childList: true, subtree: true });
            initCollapseMissions();
        }
    };
 
    // Warte auf DOM und jQuery
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 
})();