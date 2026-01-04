// ==UserScript==
// @name         LSS Auto-Teilen (Konfigurierbare Credits)
// @namespace    Hendrik
// @version      2.0
// @description  Credit-Grenze für Einklappen/Teilen ist nun oben im Skript einstellbar.
// @match        https://www.leitstellenspiel.de/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543046/LSS%20Auto-Teilen%20%28Konfigurierbare%20Credits%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543046/LSS%20Auto-Teilen%20%28Konfigurierbare%20Credits%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ########## KONFIGURATION ##########
    const CREDIT_THRESHOLD = 5000; // Grenze, unter der Einsätze eingeklappt und über der sie geteilt werden.
    const BATCH_SIZE = 15;
    const DELAY_BETWEEN_BATCHES = 500;
    const NOTIZ_ZEIT_IN_MINUTEN = 180;
    // ###################################

    const PROCESSED_KEY = 'auto_note_done_v12';
    const TOGGLE_KEY = 'auto_funktionen_active';
    const AUTO_COLLAPSE_SMALL_KEY = 'auto_collapse_small_active';

    const processed = new Set(JSON.parse(localStorage.getItem(PROCESSED_KEY) || '[]'));

    let isActive = JSON.parse(localStorage.getItem(TOGGLE_KEY) || 'true');
    let isAutoCollapseSmallActive = JSON.parse(localStorage.getItem(AUTO_COLLAPSE_SMALL_KEY) || 'false');

    const eingeklappteMissionen = new Set();
    const manuallyExpandedTimers = new Map();

    let totalToProcess = 0, sharedCount = 0, notedCount = 0;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function isTextFieldActive() {
        return document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable);
    }

    function saveProcessed() { localStorage.setItem(PROCESSED_KEY, JSON.stringify([...processed])); }
    function saveMainToggle() { localStorage.setItem(TOGGLE_KEY, JSON.stringify(isActive)); }
    function saveAutoCollapseSmallToggle() { localStorage.setItem(AUTO_COLLAPSE_SMALL_KEY, JSON.stringify(isAutoCollapseSmallActive)); }

    function updateProgress() {
        const indicator = document.getElementById('progress-indicator');
        if (!indicator) return;

        if (totalToProcess === 0) {
            indicator.innerHTML = '✨ Alles erledigt';
            indicator.style.backgroundColor = '#2c3e50';
        } else if (!isActive) {
            indicator.innerHTML = `⌛ ${totalToProcess} Einsätze bereit`;
            indicator.style.backgroundColor = '#3498db';
        } else {
            indicator.innerHTML = `⚙️ Bereit: ${totalToProcess} | Geteilt: ${sharedCount} | Notiz: ${notedCount}`;
            indicator.style.backgroundColor = '#27ae60';
        }
    }

    function createButtons() {
        const header = document.querySelector('#mission_list + .panel-body') || document.querySelector('#mission_list')?.parentElement;
        if (!header || document.getElementById('autoFunktionenToggleBtn')) return;
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '5px' });

        const mainToggleBtn = document.createElement('button');
        mainToggleBtn.id = 'autoFunktionenToggleBtn';
        mainToggleBtn.textContent = isActive ? 'Auto: AN' : 'Auto: AUS';
        Object.assign(mainToggleBtn.style, { backgroundColor: isActive ? '#2ecc71' : '#e74c3c', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' });
        mainToggleBtn.addEventListener('click', () => {
            isActive = !isActive;
            mainToggleBtn.textContent = isActive ? 'Auto: AN' : 'Auto: AUS';
            mainToggleBtn.style.backgroundColor = isActive ? '#2ecc71' : '#e74c3c';
            saveMainToggle();
            updateProgress();
        });
        buttonContainer.appendChild(mainToggleBtn);

        const autoCollapseSmallBtn = document.createElement('button');
        autoCollapseSmallBtn.id = 'autoCollapseSmallBtn';
        const threshold_k = CREDIT_THRESHOLD / 1000;
        const getCollapseButtonText = () => `Einklappen (<${threshold_k}k): ${isAutoCollapseSmallActive ? 'AN' : 'AUS'}`;
        autoCollapseSmallBtn.textContent = getCollapseButtonText();
        Object.assign(autoCollapseSmallBtn.style, { backgroundColor: isAutoCollapseSmallActive ? '#3498db' : '#95a5a6', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' });
        autoCollapseSmallBtn.addEventListener('click', () => {
            isAutoCollapseSmallActive = !isAutoCollapseSmallActive;
            autoCollapseSmallBtn.textContent = getCollapseButtonText();
            autoCollapseSmallBtn.style.backgroundColor = isAutoCollapseSmallActive ? '#3498db' : '#95a5a6';
            saveAutoCollapseSmallToggle();
        });
        buttonContainer.appendChild(autoCollapseSmallBtn);

        const forceAllButton = document.createElement('button');
        forceAllButton.id = 'forceAllNotesBtn';
        forceAllButton.textContent = 'Alle Notizen 🔄';
        Object.assign(forceAllButton.style, { backgroundColor: '#f39c12', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' });
        forceAllButton.addEventListener('click', async () => {
            if (confirm('Sollen wirklich für ALLE großen Einsätze die Notizen neu erstellt werden?')) {
                forceAllButton.disabled = true;
                forceAllButton.textContent = 'Wird ausgeführt...';
                await forceProcessAllMissions();
                forceAllButton.disabled = false;
                forceAllButton.textContent = 'Alle Notizen 🔄';
            }
        });
        buttonContainer.appendChild(forceAllButton);

        const progressIndicator = document.createElement('div');
        progressIndicator.id = 'progress-indicator';
        Object.assign(progressIndicator.style, { padding: '4px 10px', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', transition: 'background-color 0.5s' });
        buttonContainer.appendChild(progressIndicator);
        updateProgress();

        header.prepend(buttonContainer);
    }

    const collapseIconName = 'down-left-and-up-right-to-center';
    const expandIconName = 'up-right-and-down-left-from-center';

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
        const missionContainer = document.querySelector('#mission_list');
        if (!missionContainer) return;

        for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
            const missionId = missionEntry.getAttribute('mission_id');
            if (!missionId) continue;
            const raw = missionEntry.getAttribute('data-sortable-by');
            if (!raw) continue;
            let avgCredits = 0;
            try { avgCredits = JSON.parse(raw.replace(/&quot;/g, '"')).average_credits; } catch (e) { continue; }

            const shouldAttemptToManageCollapse = avgCredits <= CREDIT_THRESHOLD && (isAutoCollapseSmallActive || isActive);
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


    async function processSingleMission(missionEntry, authToken) {
        return new Promise(resolve => {
            const missionId = missionEntry.getAttribute('mission_id');
            missionEntry.style.backgroundColor = '';
            $.get(`/missions/${missionId}/alliance`).done(() => {
                sharedCount++;
                updateProgress();
                const now = new Date();
                now.setMinutes(now.getMinutes() + NOTIZ_ZEIT_IN_MINUTEN);
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const messageText = `ELW/FüKw ab ${hours}:${minutes}`;
                const payload = { "utf8": "✓", "authenticity_token": authToken, "mission_reply[mission_id]": missionId, "mission_reply[content]": messageText, "mission_reply[alliance_chat]": "0" };
                $.post('/mission_replies', payload).done(() => {
                    notedCount++;
                    updateProgress();
                    processed.add(missionId);
                    saveProcessed();
                    resolve();
                }).fail(() => {
                    missionEntry.style.backgroundColor = '#f2dede';
                    missionEntry.title = 'Automatisches Setzen der Notiz ist fehlgeschlagen.';
                    resolve();
                });
            }).fail(() => {
                missionEntry.style.backgroundColor = '#f2dede';
                missionEntry.title = 'Automatisches Teilen ist fehlgeschlagen.';
                resolve();
            });
        });
    }

    async function forceProcessAllMissions() {
        const authToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const missionContainer = document.querySelector('#mission_list');
        if (!authToken || !missionContainer) return;
        const missionsToForceProcess = [];
        for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
            const raw = missionEntry.getAttribute('data-sortable-by');
            if (!raw) continue;
            let avgCredits = 0;
            try { avgCredits = JSON.parse(raw.replace(/&quot;/g, '"')).average_credits; } catch (e) { continue; }
            if (avgCredits > CREDIT_THRESHOLD) missionsToForceProcess.push(missionEntry);
        }
        if (missionsToForceProcess.length === 0) return;
        totalToProcess = missionsToForceProcess.length;
        sharedCount = 0;
        notedCount = 0;
        updateProgress();
        for (let i = 0; i < missionsToForceProcess.length; i += BATCH_SIZE) {
            const batch = missionsToForceProcess.slice(i, i + BATCH_SIZE);
            const batchPromises = batch.map(entry => processSingleMission(entry, authToken));
            await Promise.all(batchPromises);
            if (i + BATCH_SIZE < missionsToForceProcess.length) await delay(DELAY_BETWEEN_BATCHES);
        }
    }

    async function handleMissionProcessing() {
        const textFieldCurrentlyActive = isTextFieldActive();
        const missionContainer = document.querySelector('#mission_list');
        const authToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!authToken || !missionContainer) return;

        const missionsToProcess = [];
        for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
            const missionId = missionEntry.getAttribute('mission_id');
            if (!missionId || processed.has(missionId)) continue;
            const raw = missionEntry.getAttribute('data-sortable-by');
            if (!raw) continue;
            let avgCredits = 0;
            try { avgCredits = JSON.parse(raw.replace(/&quot;/g, '"')).average_credits; } catch (e) { continue; }
            if (avgCredits > CREDIT_THRESHOLD && !textFieldCurrentlyActive) {
                missionsToProcess.push(missionEntry);
            }
        }

        totalToProcess = missionsToProcess.length;
        if (totalToProcess === 0 && sharedCount > 0) {
            sharedCount = 0;
            notedCount = 0;
        }
        updateProgress();

        if (isActive && missionsToProcess.length > 0) {
            sharedCount = 0;
            notedCount = 0;
            for (let i = 0; i < missionsToProcess.length; i += BATCH_SIZE) {
                const batch = missionsToProcess.slice(i, i + BATCH_SIZE);
                const batchPromises = batch.map(entry => processSingleMission(entry, authToken));
                await Promise.all(batchPromises);
                if (i + BATCH_SIZE < missionsToProcess.length) await delay(DELAY_BETWEEN_BATCHES);
            }
        }
    }

    async function timedLoop() {
        try {
            handleMissionCollapse();
            await handleMissionProcessing();
        } catch (e) {
            console.error("[Auto-Funktionen] Fehler:", e);
        }
        setTimeout(timedLoop, 2000);
    }

    setTimeout(() => {
        createButtons();
        timedLoop();
        console.log("Auto-Funktionen Skript (Version 2.2) gestartet.");
    }, 2000);

})();