// ==UserScript==
// @name         LSS Profi-Alarmierung (V43 - Finale Namenserkennung)
// @namespace    http://tampermonkey.net/
// @version      43.0
// @description  Finale Version mit der robustesten Methode zur Fahrzeugnamen-Erkennung via vehicle_caption.
// @author       You
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542831/LSS%20Profi-Alarmierung%20%28V43%20-%20Finale%20Namenserkennung%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542831/LSS%20Profi-Alarmierung%20%28V43%20-%20Finale%20Namenserkennung%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- KONFIGURATION ---
    const CHUNK_SIZE = 10;
    const ALARM_HOTKEY_NORMAL = 'x';
    const ALARM_HOTKEY_NEXT = 's';
    const PROGRESS_BAR_POSITION = 'bottom';
    const VALIDATION_DELAY_MS = 2500;
    const SERIAL_DELAY_MS = 100;

    let isAlarming = false;

    // --- HELPER FUNKTIONEN ---
    function createProgressBar(position) {
        document.getElementById('profi-alarm-progress-bar')?.remove();
        const barContainer = document.createElement('div');
        barContainer.id = 'profi-alarm-progress-bar';
        Object.assign(barContainer.style, { position: 'fixed', backgroundColor: '#333', zIndex: '99999', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Arial, sans-serif', fontSize: '14px', gap: '15px' });
        const barFill = document.createElement('div');
        barFill.id = 'profi-alarm-progress-fill';
        Object.assign(barFill.style, { position: 'absolute', backgroundColor: '#4CAF50', transition: 'width 0.2s ease-in-out, height 0.2s ease-in-out' });
        const barText = document.createElement('span');
        barText.id = 'profi-alarm-progress-text';
        barText.style.position = 'relative';
        barText.textContent = 'Initialisiere...';
        switch (position) {
            case 'left': Object.assign(barContainer.style, { top: '0', left: '0', width: '15px', height: '100vh', flexDirection: 'column-reverse' }); Object.assign(barFill.style, { bottom: '0', left: '0', width: '100%', height: '0%' }); barText.style.display = 'none'; break;
            case 'right': Object.assign(barContainer.style, { top: '0', right: '0', width: '15px', height: '100vh', flexDirection: 'column-reverse' }); Object.assign(barFill.style, { bottom: '0', right: '0', width: '100%', height: '0%' }); barText.style.display = 'none'; break;
            case 'bottom': Object.assign(barContainer.style, { bottom: '0', left: '0', width: '100%', height: '25px' }); Object.assign(barFill.style, { top: '0', left: '0', width: '0%', height: '100%' }); break;
            default: Object.assign(barContainer.style, { top: '0', left: '0', width: '100%', height: '25px' }); Object.assign(barFill.style, { top: '0', left: '0', width: '0%', height: '100%' }); break;
        }
        barContainer.append(barFill, barText);
        document.body.appendChild(barContainer);
    }

    function updateProgressBar(text, percentage) {
        const bar = document.getElementById('profi-alarm-progress-bar');
        if (!bar) return;
        const fill = bar.querySelector('#profi-alarm-progress-fill');
        const textEl = bar.querySelector('#profi-alarm-progress-text');
        const position = ['left', 'right'].includes(bar.style.flexDirection) ? 'vertical' : 'horizontal';
        if(percentage !== undefined && percentage !== null){
            if (position === 'vertical') fill.style.height = `${percentage}%`;
            else fill.style.width = `${percentage}%`;
        }
        if(text !== null) textEl.textContent = text;
    }

    function gatekeeper(event, goToNext) {
        if (isAlarming) {
            console.warn("Ein Alarmierungsvorgang läuft bereits.");
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        const checkedCheckboxes = document.querySelectorAll('input.vehicle_checkbox:checked');
        const vehicleCount = new Set(Array.from(checkedCheckboxes).map(cb => cb.value)).size;
        if (vehicleCount > CHUNK_SIZE) {
            console.log(`Profi-Alarmierung aktiv: ${vehicleCount} Fahrzeuge (mehr als ${CHUNK_SIZE}). Übernehme Steuerung.`);
            runProfiAlarm(event, goToNext, checkedCheckboxes);
        } else {
            console.log(`Profi-Alarmierung inaktiv: ${vehicleCount} Fahrzeuge (Limit nicht überschritten). Übergebe an Standard-Funktion.`);
        }
    }

    function runProfiAlarm(event, goToNext, checkedCheckboxes) {
        isAlarming = true;
        event.preventDefault();
        event.stopImmediatePropagation();
        console.log("🚀 Profi-Alarmierung gestartet...");
        const vehicleIDs = Array.from(checkedCheckboxes).map(cb => cb.value);
        const uniqueVehicleIDs = [...new Set(vehicleIDs)];
        createProgressBar(PROGRESS_BAR_POSITION);
        const authToken = document.querySelector('input[name="authenticity_token"]').value;
        const missionId = window.location.pathname.split('/')[2];
        const checkboxState = document.getElementById('mission_next_mission_chk')?.checked;
        const nextMissionValue = goToNext || checkboxState ? '1' : '0';
        const nextMissionButton = document.getElementById('mission_next_mission_btn');
        const nextMissionUrl = nextMissionButton ? nextMissionButton.href : null;
        if (!missionId) {
            alert("Fehler: Konnte die Einsatz-ID nicht aus der URL auslesen!");
            isAlarming = false;
            return;
        }
        manageAlarmProcess(uniqueVehicleIDs, authToken, missionId, nextMissionValue, nextMissionUrl, checkedCheckboxes);
    }

    async function sendBatches(ids, token, missionId, nextMission) {
        const chunks = [];
        for (let i = 0; i < ids.length; i += CHUNK_SIZE) { chunks.push(ids.slice(i, i + CHUNK_SIZE)); }
        const allFetchPromises = [];
        updateProgressBar(`Phase 1/3: Sende ${chunks.length} Blöcke...`, 0);
        let chunksDispatched = 0;
        for (const [index, chunk] of chunks.entries()) {
            const postData = new URLSearchParams();
            postData.append('utf8', '✓');
            postData.append('authenticity_token', token);
            chunk.forEach(id => postData.append('vehicle_ids[]', id));
            postData.append('next_mission', nextMission);
            const fetchPromise = fetch(`/missions/${missionId}/alarm`, { method: 'POST', body: postData });
            allFetchPromises.push(fetchPromise);
            chunksDispatched++;
            const dispatchProgress = (chunksDispatched / chunks.length) * 45;
            updateProgressBar(`Phase 1/3: Sende Block ${chunksDispatched}/${chunks.length}...`, dispatchProgress);
            console.log(`🚀 Block ${index + 1} abgeschickt.`);
            if (chunksDispatched < chunks.length) {
                await new Promise(resolve => setTimeout(resolve, SERIAL_DELAY_MS));
            }
        }
        console.log(`Alle ${chunks.length} Blöcke wurden auf den Weg geschickt.`);
        updateProgressBar(`Phase 2/3: Warte auf ${chunks.length} Server-Antworten...`, 45);
        let responsesReceived = 0;
        const waitingPromises = allFetchPromises.map((p, index) =>
            p.then(response => {
                responsesReceived++;
                console.log(`📤 Antwort für Block ${index + 1} erhalten. Server-Status: ${response.status}`);
                const receiveProgress = 45 + (responsesReceived / chunks.length) * 45;
                updateProgressBar(`Phase 2/3: Empfange Antwort ${responsesReceived}/${chunks.length}...`, receiveProgress);
            }).catch(error => {
                responsesReceived++;
                console.error(`🔥 Netzwerkfehler bei Block ${index + 1}: ${error.message}`);
                const receiveProgress = 45 + (responsesReceived / chunks.length) * 45;
                updateProgressBar(`Phase 2/3: Empfange Antwort ${responsesReceived}/${chunks.length}...`, receiveProgress);
            })
        );
        await Promise.all(waitingPromises);
        console.log("Alle Anfragen abgeschlossen. Starte Phase 3: Validierung.");
    }

    async function validateDispatchedVehicles(originalSentIDs) {
        console.log("🕵️ Lade Seite im Hintergrund zur Validierung...");
        updateProgressBar("Phase 3/3: Validiere Erfolg...", 90);
        await new Promise(resolve => setTimeout(resolve, VALIDATION_DELAY_MS));
        const validationResponse = await fetch(window.location.href);
        const freshHtml = await validationResponse.text();
        const tempDoc = new DOMParser().parseFromString(freshHtml, 'text/html');
        const drivingTable = tempDoc.getElementById("mission_vehicle_driving");
        let successfullyDispatchedIDs = new Set();
        if (drivingTable) {
            drivingTable.querySelectorAll("a[vehicle_id]").forEach(link => {
                successfullyDispatchedIDs.add(link.getAttribute('vehicle_id'));
            });
        }
        console.log(`Gefunden: ${successfullyDispatchedIDs.size} eindeutige Fahrzeuge in der Anfahrts-Tabelle.`);
        const failedIDs = originalSentIDs.filter(id => !successfullyDispatchedIDs.has(id));
        return { failedIDs, success: failedIDs.length === 0 };
    }

    function showCustomConfirm(title, failedVehicles) {
        return new Promise(resolve => {
            document.getElementById('profi-alarm-modal')?.remove();
            const backdrop = document.createElement('div');
            backdrop.id = 'profi-alarm-modal';
            Object.assign(backdrop.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: '100000', display: 'flex', alignItems: 'center', justifyContent: 'center' });
            const modal = document.createElement('div');
            Object.assign(modal.style, { background: 'white', color: 'black', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' });
            const titleEl = document.createElement('h3');
            titleEl.textContent = title;
            titleEl.style.marginTop = '0';
            const vehicleList = document.createElement('div');
            Object.assign(vehicleList.style, { overflowY: 'auto', border: '1px solid #ccc', padding: '10px', margin: '15px 0', flexGrow: '1' });
            failedVehicles.forEach(v => {
                const p = document.createElement('p');
                Object.assign(p.style, { margin: '5px 0' });
                const link = document.createElement('a');
                link.href = `https://www.leitstellenspiel.de/vehicles/${v.id}`;
                link.textContent = `${v.name} (ID: ${v.id})`;
                link.target = '_blank';
                p.appendChild(link);
                vehicleList.appendChild(p);
            });
            const buttonArea = document.createElement('div');
            Object.assign(buttonArea.style, { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' });
            const createButton = (text, value, color = '#6c757d') => {
                const btn = document.createElement('button');
                btn.textContent = text;
                Object.assign(btn.style, { padding: '8px 15px', border: 'none', borderRadius: '5px', color: 'white', backgroundColor: color, cursor: 'pointer' });
                btn.onclick = () => {
                    backdrop.remove();
                    resolve(value);
                };
                return btn;
            };
            const btnRetry = createButton('Erneut versuchen', 'retry', '#007bff');
            const btnIgnore = createButton('Ignorieren & Weiter', 'ignore', '#28a745');
            const btnCancel = createButton('Abbrechen', 'cancel');
            buttonArea.append(btnRetry, btnIgnore, btnCancel);
            modal.append(titleEl, vehicleList, buttonArea);
            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);
        });
    }

    async function manageAlarmProcess(idsToAlarm, token, missionId, nextMission, nextMissionUrl, originalCheckboxes) {
        await sendBatches(idsToAlarm, token, missionId, nextMission);
        let validationResult = await validateDispatchedVehicles(idsToAlarm);
        if (!validationResult.success) {
            console.error(`🔥 Validierung fehlgeschlagen. ${validationResult.failedIDs.length} Fahrzeuge nicht auf Anfahrt.`);
            updateProgressBar(`Alarmiere ${validationResult.failedIDs.length} fehlende Fahrzeuge nach...`, 90);
            await sendBatches(validationResult.failedIDs, token, missionId, nextMission);
            validationResult = await validateDispatchedVehicles(idsToAlarm);
        }
        let finalFailedIDs = validationResult.failedIDs;
        while (finalFailedIDs.length > 0) {
            console.error(`🔥 Auch nach Nachalarmierung fehlgeschlagen: ${finalFailedIDs.length} Fahrzeuge.`);
            const failedVehicleDetails = finalFailedIDs.map(id => {
                const checkbox = Array.from(originalCheckboxes).find(cb => cb.value === id);
                // --- KORREKTUR V43: DIREKTES AUSLESEN DES 'vehicle_caption' ATTRIBUTS ---
                const row = checkbox ? checkbox.closest('tr') : null;
                const vehicleName = row ? row.getAttribute('vehicle_caption') : 'Unbekanntes Fahrzeug';
                return { id, name: vehicleName };
            });
            const userChoice = await showCustomConfirm(`Es konnten ${finalFailedIDs.length} Fahrzeuge nicht validiert werden:`, failedVehicleDetails);
            switch (userChoice) {
                case 'retry':
                    await sendBatches(finalFailedIDs.map(v => v.id), token, missionId, nextMission);
                    validationResult = await validateDispatchedVehicles(idsToAlarm);
                    finalFailedIDs = validationResult.failedIDs;
                    break;
                case 'ignore':
                    finalFailedIDs = [];
                    break;
                case 'cancel':
                    alert("Vorgang abgebrochen. Die Seite wird nicht neu geladen.");
                    document.getElementById('profi-alarm-progress-bar')?.remove();
                    isAlarming = false;
                    return;
            }
        }
        console.log("✅ Alle Fahrzeuge erfolgreich validiert oder Fehler ignoriert.");
        updateProgressBar("Fertig! Lade Seite neu...", 100);
        originalCheckboxes.forEach(checkbox => checkbox.checked = false);
        await new Promise(resolve => setTimeout(resolve, 1000));
        isAlarming = false;
        if (nextMission === '1' && nextMissionUrl) {
            window.location.href = nextMissionUrl;
        } else {
            window.location.reload();
        }
    }

    document.addEventListener('click', (e) => {
        const alarmBtn = e.target.closest('#mission_alarm_btn');
        const nextBtn = e.target.closest('.alert_next');
        if (alarmBtn) gatekeeper(e, false);
        else if (nextBtn) gatekeeper(e, true);
    }, true);

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        if (key === ALARM_HOTKEY_NORMAL) gatekeeper(e, false);
        else if (key === ALARM_HOTKEY_NEXT) gatekeeper(e, true);
    }, true);
})();