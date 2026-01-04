// ==UserScript==
// @name         Leitstellenspiel - Auto-Auswahl (Nur Status-Prüfung)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Wählt HLF 20/FuStW nur aus, wenn Einheiten noch nicht vor Ort sind (Symbol-Prüfung). Mit Ein/Aus-Schalter. Prüft nur den Status, nicht die Historie.
// @author       Hendrik / Gemini
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541508/Leitstellenspiel%20-%20Auto-Auswahl%20%28Nur%20Status-Pr%C3%BCfung%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541508/Leitstellenspiel%20-%20Auto-Auswahl%20%28Nur%20Status-Pr%C3%BCfung%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('LSS Script v2.0.0: IIFE gestartet.');

    // ENTFERNT: Die Speicherung der bearbeiteten Einsätze ist nicht mehr nötig.
    // const PROCESSED_MISSIONS_KEY = 'lss_auto_select_processed_missions_v2';
    const SCRIPT_ENABLED_KEY = 'lss_auto_select_script_enabled_v3';
    let attemptCounter = 0;
    const MAX_ATTEMPTS = 7;
    const ATTEMPT_DELAY = 500;

    let scriptEnabled = true;

    // --- Hilfsfunktionen (showSideNotification, etc.) ---
    function showSideNotification(message, type = 'info', displayDuration = 3500) {
        const notificationId = 'lss-side-flash-notification';
        const animationSpeed = 300;
        const existingNotification = document.getElementById(notificationId);
        if (existingNotification) existingNotification.remove();
        const notificationBox = document.createElement('div');
        notificationBox.id = notificationId;
        notificationBox.innerHTML = message;
        Object.assign(notificationBox.style, {
            position: 'fixed', top: '40px', right: '40px',
            minWidth: '320px', maxWidth: '480px', padding: '20px 25px',
            borderRadius: '8px', color: 'white', textAlign: 'left',
            fontSize: '1.1em', zIndex: '10000',
            boxShadow: '0 6px 18px rgba(0,0,0,0.22)', opacity: '0',
            transform: 'translateX(100%)',
            transition: `opacity ${animationSpeed}ms ease-out, transform ${animationSpeed}ms ease-out`
        });
        switch (type) {
            case 'success': notificationBox.style.backgroundColor = '#28a745'; notificationBox.style.borderLeft = '5px solid #1e7e34'; break;
            case 'error': notificationBox.style.backgroundColor = '#dc3545'; notificationBox.style.borderLeft = '5px solid #b21f2d'; break;
            case 'warning': notificationBox.style.backgroundColor = '#ffc107'; notificationBox.style.color = '#212529'; notificationBox.style.borderLeft = '5px solid #d39e00'; break;
            case 'disabled': notificationBox.style.backgroundColor = '#6c757d'; notificationBox.style.borderLeft = '5px solid #545b62'; break;
            default: notificationBox.style.backgroundColor = '#17a2b8'; notificationBox.style.borderLeft = '5px solid #10707f'; break;
        }
        if (document.body) {
            document.body.appendChild(notificationBox);
            requestAnimationFrame(()=>{requestAnimationFrame(()=>{ notificationBox.style.opacity = '1'; notificationBox.style.transform = 'translateX(0)'; });});
            setTimeout(() => {
                notificationBox.style.opacity = '0';
                notificationBox.style.transform = 'translateX(100%)';
                setTimeout(() => { if (notificationBox.parentNode) notificationBox.remove(); }, animationSpeed);
            }, displayDuration);
        } else {
            console.error("LSS Script: document.body nicht gefunden, Benachrichtigung kann nicht angezeigt werden.");
        }
    }

    // ENTFERNT: Funktionen zum Laden und Speichern der Einsatz-Historie.
    // function loadProcessedMissions() { ... }
    // function saveProcessedMissions() { ... }

    function selectVehicle() {
        console.log('LSS Script: selectVehicle() aufgerufen.');
        const vehicleTable = document.getElementById('vehicle_show_table_all');
        if (!vehicleTable) {
            const msg = '<strong>Fehler:</strong><br>Fahrzeugtabelle (ID: vehicle_show_table_all) nicht gefunden!';
            console.error('LSS Script: ' + msg.replace(/<br>/g, ' ').replace(/<strong>|<\/strong>/g, ''));
            showSideNotification(msg, 'error', 4500);
            return;
        }
        const rows = vehicleTable.getElementsByTagName('tr');
        let vehicleSelected = false; let selectedVehicleType = '';
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.classList.contains('vehicle_select_table_tr')) {
                const vehicleType = row.getAttribute('vehicle_type');
                if (vehicleType === 'HLF 20' || vehicleType === 'FuStW') {
                    const checkbox = row.querySelector('input.vehicle_checkbox[type="checkbox"]');
                    if (checkbox && !checkbox.checked) {
                        checkbox.click(); selectedVehicleType = vehicleType;
                        console.log(`LSS Script: Fahrzeug automatisch ausgewählt: ${selectedVehicleType} (ID: ${checkbox.value})`);
                        vehicleSelected = true; break;
                    }
                }
            }
        }
        if (vehicleSelected) { showSideNotification(`<strong>${selectedVehicleType}</strong><br>automatisch ausgewählt!`, 'success'); }
        else { const msg = 'Kein passendes HLF 20 oder FuStW zum Auswählen gefunden.'; console.log('LSS Script: ' + msg); showSideNotification(msg, 'warning', 4000); }
    }

    function getMissionIdFromDOM() {
        const prefixes = ["mission_bar_holder_", "mission_bar_"];
        for (const prefix of prefixes) {
            const element = document.querySelector(`div[id^="${prefix}"]`);
            if (element && element.id) {
                const idParts = element.id.split('_');
                const potentialId = idParts[idParts.length - 1];
                if (!isNaN(potentialId) && potentialId.length > 5) {
                    return potentialId;
                }
            }
        }
        return null;
    }

    /**
     * Prüft, ob eine Fahrzeugauswahl möglich ist.
     * Das ist der Fall, wenn die Einheiten noch NICHT vor Ort sind (Symbol: asterisk '*').
     * @returns {boolean} - True, wenn das Symbol für "unterwegs" gefunden wird.
     */
    function isSelectionPossible() {
        const onTheWaySymbol = document.querySelector('.mission_header_info .glyphicon-asterisk');
        return onTheWaySymbol !== null;
    }

    // --- Toggle Switch Logik (unverändert) ---
    function loadScriptState() {
        const storedState = localStorage.getItem(SCRIPT_ENABLED_KEY);
        scriptEnabled = storedState === null ? true : JSON.parse(storedState);
        console.log(`LSS Script: Auto-Auswahl ist ${scriptEnabled ? 'AKTIVIERT' : 'DEAKTIVIERT'}.`);
    }

    function saveScriptState() {
        localStorage.setItem(SCRIPT_ENABLED_KEY, JSON.stringify(scriptEnabled));
    }

    function createToggleSwitch() {
        const switchContainer = document.createElement('label');
        switchContainer.className = 'lss-toggle-switch';
        switchContainer.title = scriptEnabled ? 'Auto-Auswahl ist AN. Klicken zum Ausschalten.' : 'Auto-Auswahl ist AUS. Klicken zum Einschalten.';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'lss-auto-select-toggle-checkbox';
        checkbox.checked = scriptEnabled;
        const slider = document.createElement('span');
        slider.className = 'lss-slider';
        const labelText = document.createElement('span');
        labelText.className = 'lss-toggle-label';
        labelText.textContent = 'Auto-Select HLF/FuStW';
        switchContainer.appendChild(checkbox);
        switchContainer.appendChild(slider);
        switchContainer.appendChild(labelText);
        if (document.body) {
            document.body.appendChild(switchContainer);
        } else {
            console.error("LSS Script: document.body nicht für Toggle Switch gefunden.");
            return;
        }
        const style = document.createElement('style');
        style.textContent = `
            .lss-toggle-switch { position: fixed; top: 100px; right: 40px; display: inline-flex; align-items: center; height: auto; cursor: pointer; font-family: Arial, sans-serif; color: #333; background-color: #f0f0f0; padding: 8px 12px; border-radius: 20px; box-shadow: 0 3px 7px rgba(0,0,0,0.2); z-index: 9998; transition: background-color 0.3s ease; }
            .lss-toggle-switch:hover { background-color: #e0e0e0; }
            .lss-toggle-switch input { opacity: 0; width: 0; height: 0; }
            .lss-slider { position: relative; display: inline-block; width: 40px; height: 20px; background-color: #ccc; border-radius: 10px; transition: .3s; margin-right: 10px; }
            .lss-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; border-radius: 50%; transition: .3s; }
            .lss-toggle-switch input:checked + .lss-slider { background-color: #28a745; }
            .lss-toggle-switch input:not(:checked) + .lss-slider { background-color: #dc3545; }
            .lss-toggle-switch input:checked + .lss-slider:before { transform: translateX(20px); }
            .lss-toggle-label { font-size: 13px; font-weight: bold; user-select: none; color: #333; }
        `;
        document.head.appendChild(style);
        checkbox.addEventListener('change', function() {
            scriptEnabled = this.checked;
            saveScriptState();
            switchContainer.title = scriptEnabled ? 'Auto-Auswahl ist AN. Klicken zum Ausschalten.' : 'Auto-Auswahl ist AUS. Klicken zum Einschalten.';
            console.log(`LSS Script: Auto-Auswahl ${scriptEnabled ? 'AKTIVIERT' : 'DEAKTIVIERT'} durch Benutzer.`);
            if (scriptEnabled) {
                showSideNotification('Auto-Auswahl <strong>AKTIVIERT</strong>', 'success', 2500);
            } else {
                showSideNotification('Auto-Auswahl <strong>DEAKTIVIERT</strong>', 'disabled', 2500);
            }
        });
    }

    // --- Main Logic (GEÄNDERT: Vereinfachte Logik ohne Einsatz-Historie) ---
    function mainScriptLogic(forceRun = false) {
        if (!forceRun) attemptCounter++;

        if (!scriptEnabled && !forceRun) {
            console.log('LSS Script: Auto-Auswahl ist deaktiviert.');
            return;
        }
        console.log(`LSS Script: mainScriptLogic() Versuch #${attemptCounter}.`);
        const currentMissionId = getMissionIdFromDOM();

        if (currentMissionId) {
            console.log(`LSS Script: Mission-ID ${currentMissionId} gefunden.`);

            // Prüfe, ob Einheiten schon da sind. Wenn ja, breche ab.
            if (!isSelectionPossible()) {
                console.log(`LSS Script: Einheiten bereits vor Ort für Einsatz ${currentMissionId}. Auswahl wird übersprungen.`);
                showSideNotification('Einheiten bereits vor Ort.<br>Auto-Auswahl nicht nötig.', 'info', 3500);
                return; // Skript für diesen Einsatz beenden.
            }

            // Wenn die Prüfung bestanden ist, wähle das Fahrzeug aus.
            // Die Prüfung auf "bereits ausgeführt" entfällt.
            console.log(`LSS Script: Starte Fahrzeugauswahl für neuen oder aktualisierten Einsatz ${currentMissionId}.`);
            selectVehicle();

        } else {
            if (attemptCounter < MAX_ATTEMPTS && !forceRun) {
                console.warn(`LSS Script: Mission-ID nicht gefunden (Versuch #${attemptCounter}). Nächster Versuch in ${ATTEMPT_DELAY}ms.`);
                setTimeout(mainScriptLogic, ATTEMPT_DELAY);
            } else if (!forceRun) {
                console.error(`LSS Script: Mission-ID konnte nach ${MAX_ATTEMPTS} Versuchen nicht gefunden werden.`);
            }
        }
    }

    // --- Initialisierung (unverändert) ---
    function initializeScript() {
        loadScriptState();
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            createToggleSwitch();
        } else {
            window.addEventListener('DOMContentLoaded', createToggleSwitch);
        }

        if (scriptEnabled) {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                mainScriptLogic();
            } else {
                window.addEventListener('DOMContentLoaded', mainScriptLogic);
            }
        } else {
            console.log('LSS Script: Initialisierung übersprungen, da Skript deaktiviert ist.');
        }
    }

    initializeScript();
    console.log('Leitstellenspiel Auto-Fahrzeugauswahl-Skript (v2.0.0 - Nur Status-Prüfung) aktiv.');

})();