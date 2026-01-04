// ==UserScript==
// @name         LSS Auto-Einklappen
// @namespace    Hendrik
// @version      1.1
// @description  Klappt Einsätze mit dem "User"-Icon ein, basierend auf konfigurierbaren Einsatzlisten.
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544958/LSS%20Auto-Einklappen.user.js
// @updateURL https://update.greasyfork.org/scripts/544958/LSS%20Auto-Einklappen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ########## KONFIGURATION ##########
    // Hier kannst du festlegen, welche Einsatzlisten automatisch eingeklappt werden sollen.
    const ENABLE_MISSION_LIST = true;
    const ENABLE_KRANKENTRANSPORTE = true;
    const ENABLE_KRANKENTRANSPORTE_ALLIANCE = true;
    const ENABLE_SICHERHEITSWACCHE = true;
    const ENABLE_SICHERHEITSWACCHE_ALLIANCE = true;
    const ENABLE_ALLIANCE_LIST = true;
    const ENABLE_ALLIANCE_EVENT_LIST = true; // NEU HINZUGEFÜGT
    // ###################################

    // Liste der zu überwachenden Einsatzcontainer.
    // Wird jetzt nur noch einmal erstellt und nicht bei jedem Durchlauf neu.
    const missionLists = [
        { id: 'mission_list', enabled: ENABLE_MISSION_LIST },
        { id: 'mission_list_krankentransporte', enabled: ENABLE_KRANKENTRANSPORTE },
        { id: 'mission_list_krankentransporte_alliance', enabled: ENABLE_KRANKENTRANSPORTE_ALLIANCE },
        { id: 'mission_list_sicherheitswache', enabled: ENABLE_SICHERHEITSWACCHE },
        { id: 'mission_list_sicherheitswache_alliance', enabled: ENABLE_SICHERHEITSWACCHE_ALLIANCE },
        { id: 'mission_list_alliance', enabled: ENABLE_ALLIANCE_LIST },
        { id: 'mission_list_alliance_event', enabled: ENABLE_ALLIANCE_EVENT_LIST } // NEU HINZUGEFÜGT
    ];

    const eingeklappteMissionen = new Set();
    const manuallyExpandedTimers = new Map();

    const collapseIconName = 'down-left-and-up-right-to-center';
    const expandIconName = 'up-right-and-down-left-from-center';

    function isTextFieldActive() {
        return document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable);
    }

    function attemptReCollapse(missionId, missionEntry) {
        manuallyExpandedTimers.delete(missionId);
        if (!document.body.contains(missionEntry)) return;
        const collapseBtn = missionEntry.querySelector('button.lssmv4-extendedCallList_collapsable-missions_btn');
        if (collapseBtn) {
            const svgIcon = collapseBtn.querySelector('svg[data-icon]');
            if (svgIcon && svgIcon.getAttribute('data-icon') === collapseIconName) {
                collapseBtn.click();
                eingeklappteMissionen.add(missionId);
            }
        }
    }

    function scheduleReCollapse(missionId, missionEntry) {
        if (manuallyExpandedTimers.has(missionId)) clearTimeout(manuallyExpandedTimers.get(missionId).timerId);
        const timerId = setTimeout(() => attemptReCollapse(missionId, missionEntry), 15000);
        manuallyExpandedTimers.set(missionId, { timerId, entry: missionEntry });
    }

    function handleMissionCollapse() {
        const textFieldCurrentlyActive = isTextFieldActive();

        for (const list of missionLists) {
            if (!list.enabled) continue;

            const missionContainer = document.querySelector(`#${list.id}`);
            if (!missionContainer) continue;

            for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
                const missionId = missionEntry.getAttribute('mission_id');
                if (!missionId) continue;

                const isUserMission = missionEntry.querySelector('.glyphicon.glyphicon-user');
                const isAsteriskMission = missionEntry.querySelector('.glyphicon.glyphicon-asterisk:not(.hidden)');

                const shouldAttemptToManageCollapse = isUserMission && !isAsteriskMission;

                if (shouldAttemptToManageCollapse) {
                    const collapseBtn = missionEntry.querySelector('button.lssmv4-extendedCallList_collapsable-missions_btn');
                    if (collapseBtn) {
                        const svgIcon = collapseBtn.querySelector('svg[data-icon]');
                        if (svgIcon) {
                            const currentIcon = svgIcon.getAttribute('data-icon');
                            if (eingeklappteMissionen.has(missionId) && currentIcon === collapseIconName && !manuallyExpandedTimers.has(missionId)) {
                                eingeklappteMissionen.delete(missionId);
                                scheduleReCollapse(missionId, missionEntry);
                            } else if (!eingeklappteMissionen.has(missionId) && !manuallyExpandedTimers.has(missionId)) {
                                if (currentIcon === collapseIconName && !textFieldCurrentlyActive) {
                                    collapseBtn.click();
                                    eingeklappteMissionen.add(missionId);
                                } else if (currentIcon === expandIconName) {
                                    eingeklappteMissionen.add(missionId);
                                }
                            }
                        }
                    }
                } else {
                    if (manuallyExpandedTimers.has(missionId)) {
                        clearTimeout(manuallyExpandedTimers.get(missionId).timerId);
                        manuallyExpandedTimers.delete(missionId);
                    }
                }
            }
        }
    }

    function timedLoop() {
        try {
            handleMissionCollapse();
        } catch (e) {
            console.error("[LSS Auto-Einklappen] Fehler:", e);
        }
        setTimeout(timedLoop, 2000);
    }

    setTimeout(() => {
        timedLoop();
        console.log("LSS Auto-Einklappen Skript gestartet.");
    }, 2000);

})();