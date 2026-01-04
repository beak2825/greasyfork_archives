// ==UserScript==
// @name         LSS Auto-Teilen
// @namespace    HendrikStaufenbiel
// @version      1.1
// @description  Finale Version mit allen Funktionen: Teilen+Notiz (>10k) und Auto-Einklappen (<10k).
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541949/LSS%20Auto-Teilen.user.js
// @updateURL https://update.greasyfork.org/scripts/541949/LSS%20Auto-Teilen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PROCESSED_KEY = 'auto_note_done_v12';
    const TOGGLE_KEY = 'auto_funktionen_active';
    const AUTO_COLLAPSE_SMALL_KEY = 'auto_collapse_small_active';
    const NOTIFIED_KEY = 'auto_notified_main';
    const NOTIFIED_SW_KEY = 'auto_notified_sw';

    const processed = new Set(JSON.parse(localStorage.getItem(PROCESSED_KEY) || '[]'));
    const notified = new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]'));
    const notifiedSW = new Set(JSON.parse(localStorage.getItem(NOTIFIED_SW_KEY) || '[]'));

    let isActive = JSON.parse(localStorage.getItem(TOGGLE_KEY) || 'true');
    let isAutoCollapseSmallActive = JSON.parse(localStorage.getItem(AUTO_COLLAPSE_SMALL_KEY) || 'false');

    const eingeklappteMissionen = new Set();
    const manuallyExpandedTimers = new Map();

    let audioNormal = null;
    let audioSW = null;

    const collapseIconName = 'down-left-and-up-right-to-center';
    const expandIconName = 'up-right-and-down-left-from-center';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function isTextFieldActive() {
        return document.activeElement && (
            document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA' ||
            document.activeElement.isContentEditable
        );
    }

    function saveProcessed() { localStorage.setItem(PROCESSED_KEY, JSON.stringify([...processed])); }
    function saveNotified() { localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...notified])); }
    function saveNotifiedSW() { localStorage.setItem(NOTIFIED_SW_KEY, JSON.stringify([...notifiedSW])); }
    function saveMainToggle() { localStorage.setItem(TOGGLE_KEY, JSON.stringify(isActive)); }
    function saveAutoCollapseSmallToggle() { localStorage.setItem(AUTO_COLLAPSE_SMALL_KEY, JSON.stringify(isAutoCollapseSmallActive)); }

    function createButtons() {
        const header = document.querySelector('#mission_list + .panel-body') || document.querySelector('#mission_list')?.parentElement;
        if (!header || document.getElementById('autoFunktionenToggleBtn')) return;
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '5px' });
        const mainToggleBtn = document.createElement('button');
        mainToggleBtn.id = 'autoFunktionenToggleBtn';
        mainToggleBtn.textContent = isActive ? 'Auto-Funktionen: AN' : 'Auto-Funktionen: AUS';
        Object.assign(mainToggleBtn.style, { backgroundColor: isActive ? '#2ecc71' : '#e74c3c', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 6px rgba(0,0,0,0.3)', fontSize: '12px' });
        mainToggleBtn.addEventListener('click', () => {
            if (!isActive) {
                const confirmed = confirm('Willst du die umfassenden Auto-Funktionen (Einklappen, Notizen, Benachrichtigungen) wirklich aktivieren?');
                if (!confirmed) return;
                if (!audioNormal) { audioNormal = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1217-relax.mp3'); audioNormal.volume = 0.6; }
                if (!audioSW) { audioSW = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1325-smile.mp3'); audioSW.volume = 0.6; }
                if (audioNormal) audioNormal.play().catch(e => console.warn('Audio (Normal) konnte nicht abgespielt werden:', e));
            }
            isActive = !isActive;
            mainToggleBtn.textContent = isActive ? 'Auto-Funktionen: AN' : 'Auto-Funktionen: AUS';
            mainToggleBtn.style.backgroundColor = isActive ? '#2ecc71' : '#e74c3c';
            saveMainToggle();
        });
        buttonContainer.appendChild(mainToggleBtn);
        const autoCollapseSmallBtn = document.createElement('button');
        autoCollapseSmallBtn.id = 'autoCollapseSmallBtn';
        autoCollapseSmallBtn.textContent = isAutoCollapseSmallActive ? 'Auto-Einklappen (<10k): AN' : 'Auto-Einklappen (<10k): AUS';
        Object.assign(autoCollapseSmallBtn.style, { backgroundColor: isAutoCollapseSmallActive ? '#3498db' : '#95a5a6', color: '#fff', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 6px rgba(0,0,0,0.3)', fontSize: '12px' });
        autoCollapseSmallBtn.addEventListener('click', () => {
            isAutoCollapseSmallActive = !isAutoCollapseSmallActive;
            autoCollapseSmallBtn.textContent = isAutoCollapseSmallActive ? 'Auto-Einklappen (<10k): AN' : 'Auto-Einklappen (<10k): AUS';
            autoCollapseSmallBtn.style.backgroundColor = isAutoCollapseSmallActive ? '#3498db' : '#95a5a6';
            saveAutoCollapseSmallToggle();
            showTemporaryMessage(isAutoCollapseSmallActive ? 'Auto-Einklappen (<10k) AKTIVIERT' : 'Auto-Einklappen (<10k) DEAKTIVIERT', isAutoCollapseSmallActive ? '#3498db' : '#95a5a6');
        });
        buttonContainer.appendChild(autoCollapseSmallBtn);
        header.prepend(buttonContainer);
    }

    function showTemporaryMessage(message, bgColor = '#3498db') {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = message;
        Object.assign(msgDiv.style, { position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', backgroundColor: bgColor, color: '#fff', padding: '8px 12px', borderRadius: '4px', fontWeight: 'normal', fontSize: '13px', boxShadow: '0 0 8px rgba(0,0,0,0.3)', zIndex: 10000 });
        document.body.appendChild(msgDiv);
        setTimeout(() => { msgDiv.remove(); }, 2500);
    }

    function showNotification(missionId, message, audioToPlay, notifiedSet, saveNotifiedFunc) {
        if (notifiedSet.has(missionId) || !isActive) return;
        notifiedSet.add(missionId);
        saveNotifiedFunc();
        const notification = document.createElement('div');
        notification.textContent = message;
        Object.assign(notification.style, { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#e67e22', color: '#fff', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 0 10px rgba(0,0,0,0.4)', zIndex: 9999, cursor: 'pointer' });
        let soundInterval = null;
        const playSound = () => {
            if (audioToPlay && isActive) { audioToPlay.currentTime = 0; audioToPlay.play().catch(e => console.warn('Sound Error:', e)); }
            else { clearInterval(soundInterval); }
        };
        playSound();
        soundInterval = setInterval(playSound, 15000);
        notification.addEventListener('mouseover', () => { clearInterval(soundInterval); notification.remove(); });
        document.body.appendChild(notification);
    }

    function attemptReCollapse(missionId, missionEntry) {
        manuallyExpandedTimers.delete(missionId);
        if (!document.body.contains(missionEntry)) return;
        const raw = missionEntry.getAttribute('data-sortable-by');
        if (!raw) return;
        let avgCredits = 0;
        try { avgCredits = JSON.parse(raw.replace(/&quot;/g, '"')).average_credits; } catch (e) { return; }
        const shouldStillBeCollapsed = avgCredits <= 10000 && (isAutoCollapseSmallActive || isActive);
        if (!shouldStillBeCollapsed) { eingeklappteMissionen.delete(missionId); return; }
        if (isTextFieldActive()) return;
        const collapseBtn = missionEntry.querySelector('button.lssmv4-extendedCallList_collapsable-missions_btn');
        if (collapseBtn) {
            const svgIcon = collapseBtn.querySelector('svg[data-icon]');
            if (svgIcon && svgIcon.getAttribute('data-icon') === collapseIconName) { collapseBtn.click(); eingeklappteMissionen.add(missionId); }
            else if (svgIcon && svgIcon.getAttribute('data-icon') === expandIconName) { eingeklappteMissionen.add(missionId); }
        }
    }

    function scheduleReCollapse(missionId, missionEntry) {
        if (manuallyExpandedTimers.has(missionId)) { clearTimeout(manuallyExpandedTimers.get(missionId).timerId); }
        const timerId = setTimeout(() => { attemptReCollapse(missionId, missionEntry); }, 15000);
        manuallyExpandedTimers.set(missionId, { timerId: timerId, entry: missionEntry });
    }

    async function processEinsaetze() {
        const textFieldCurrentlyActive = isTextFieldActive();
        const missionContainer = document.querySelector('#mission_list');
        const authToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!authToken || !missionContainer) return;

        for (const missionEntry of missionContainer.querySelectorAll('.missionSideBarEntry')) {
            const missionId = missionEntry.getAttribute('mission_id');
            if (!missionId) continue;

            const raw = missionEntry.getAttribute('data-sortable-by');
            if (!raw) continue;

            let avgCredits = 0;
            try { avgCredits = JSON.parse(raw.replace(/&quot;/g, '"')).average_credits; } catch (e) { continue; }

            // ### START: LOGIK FÜR AUTO-EINKLAPPEN ###
            const shouldAttemptToManageCollapse = avgCredits <= 10000 && (isAutoCollapseSmallActive || isActive);
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
                            if (currentIcon === collapseIconName) {
                                if (!textFieldCurrentlyActive) { collapseBtn.click(); eingeklappteMissionen.add(missionId); }
                            } else if (currentIcon === expandIconName) { eingeklappteMissionen.add(missionId); }
                        }
                    }
                }
            } else {
                if (manuallyExpandedTimers.has(missionId)) { clearTimeout(manuallyExpandedTimers.get(missionId).timerId); manuallyExpandedTimers.delete(missionId); }
            }
            // ### ENDE: LOGIK FÜR AUTO-EINKLAPPEN ###

            if (processed.has(missionId)) continue; // Überspringe den Rest, wenn schon bearbeitet

            if (isActive && avgCredits > 10000 && !textFieldCurrentlyActive) {
                processed.add(missionId);

                // Schritt 1: Stilles Teilen
                $.get(`/missions/${missionId}/alliance`)
                 .done(function() {
                    console.log(`Schritt 1/2 für ID ${missionId} erfolgreich: Still geteilt.`);
                    if (!notified.has(missionId)) {
                        showNotification(missionId, `Notiz für Einsatz >10k gesetzt`, audioNormal, notified, saveNotified);
                    }
                    // Schritt 2: Lokale Notiz
                    const now = new Date();
                    now.setHours(now.getHours() + 3);
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const messageText = `ELW/FüKw ab ${hours}:${minutes}`;

                    const payload = {
                        "utf8": "✓",
                        "authenticity_token": authToken,
                        "mission_reply[mission_id]": missionId,
                        "mission_reply[content]": messageText,
                        "mission_reply[alliance_chat]": "0"
                    };
                    $.post('/mission_replies', payload)
                     .done(() => { console.log(`✅ Schritt 2/2 für ID ${missionId}: Lokale Notiz erstellt.`); saveProcessed(); })
                     .fail(() => console.warn(`Hinweis: Schritt 2/2 für ID ${missionId} (Notiz) fehlgeschlagen.`));

                }).fail(xhr => console.warn(`Hinweis: Schritt 1/2 für ID ${missionId} (Still teilen) fehlgeschlagen. Status: ${xhr.status}`));

                await delay(0); // Timer zum spielen
            }
        }
    }

    createButtons();

    async function timedLoop() {
        try { await processEinsaetze(); } catch (e) { console.error("[Auto-Funktionen] Fehler:", e); }
        setTimeout(timedLoop, 1000);
    }

    setTimeout(() => { timedLoop(); console.log("Auto-Funktionen Skript (Version 12.1 - Komplett) gestartet."); }, 2000);
})();