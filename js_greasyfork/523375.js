// ==UserScript==
// @name         Auto Scavenging - Tutte le Unità
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automates scavenging in Tribal Wars.
// @author       MrNobody97
// @match        https://*.tribals.it/game.php?*screen=place&mode=scavenge*
// @credit       ricardofauch
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523375/Auto%20Scavenging%20-%20Tutte%20le%20Unit%C3%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/523375/Auto%20Scavenging%20-%20Tutte%20le%20Unit%C3%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Definizione delle unità
    const UNITS = [
        { name: 'spear', label: 'Lanciere', include: true },
        { name: 'sword', label: 'Spadaccino', include: false },
        { name: 'axe', label: 'Guerrieri con Ascia', include: false },
        { name: 'light', label: 'Cavalleria Leggera', include: false },
        { name: 'heavy', label: 'Cavalleria Pesante', include: false },
        { name: 'knight', label: 'Paladino', include: false },
    ];

    // Configurazione
    const CONFIG = {
        TOTAL_SPEARS: 100,           // Lancieri totali
        MAX_SPEAR_PERCENTAGE: 1.00,  // Percentuale massima di lancieri per run
        MIN_SPEARS_THRESHOLD: 20,    // Minimo lancieri necessari
        UI_LOAD_DELAY: 6000,         // Ritardo per il caricamento dell'UI
        INPUT_PROCESS_DELAY: 1000,   // Ritardo dopo l'impostazione degli input
        INPUT_RETRY_DELAY: 200,      // Ritardo tra i tentativi di input
        MAX_INPUT_RETRIES: 5,        // Massimo numero di tentativi di input
        MIN_RELOAD_TIME: 8,          // Tempo minimo di ricarica (minuti)
        MAX_RELOAD_TIME: 12,         // Tempo massimo di ricarica (minuti)
        DEBUG: true                  // Abilita/disabilita il debug
    };

    // Inietta gli stili CSS
    function injectStyles() {
        const styles = `
            #scavengeUI {
                position: fixed;
                left: 8%;
                top: 50%;
                transform: translateY(-50%);
                background-color: rgba(245, 245, 245, 0.95);
                border: 1px solid #967444;
                border-radius: 4px;
                padding: 8px;
                z-index: 9999;
                width: 160px;
                height: auto;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            #scavengeUI .title {
                font-weight: bold;
                color: #784B25;
                font-size: 12px;
                margin-bottom: 10px;
                text-align: center;
                font-family: Arial, sans-serif;
            }
            #scavengeUI label {
                display: block;
                color: #5C3C1D;
                font-size: 11px;
                font-weight: bold;
                margin-bottom: 4px;
                font-family: Arial, sans-serif;
                text-align: center;
            }
            #scavengeUI input[type="number"] {
                width: 100%;
                padding: 4px;
                border: 1px solid #967444;
                background-color: white;
                color: #4A3011;
                border-radius: 2px;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                outline: none;
                box-sizing: border-box;
                margin-bottom: 10px;
            }
            #scavengeUI .checkbox-container {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 4px 0;
                padding: 4px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 2px;
            }
            #scavengeUI .checkbox-container input[type="checkbox"] {
                margin-right: 5px;
            }
            #scavengeUI input:focus {
                border-color: #784B25;
                box-shadow: 0 0 2px #967444;
            }
            #scavengeUI:hover {
                background-color: rgba(255, 255, 255, 0.98);
            }
            #debugOutput {
                margin-top: 10px;
                padding-top: 10px;
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #5C3C1D;
            }
            #nextReloadTime {
                margin-top: 8px;
                padding: 4px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 2px;
                text-align: center;
                font-size: 11px;
                font-weight: bold;
                color: #5C3C1D;
            }
            #startTimer {
                margin-top: 8px;
                padding: 4px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 2px;
                text-align: center;
                font-size: 11px;
                font-weight: bold;
                color: #5C3C1D;
            }
            .debug-entry {
                margin-bottom: 4px;
                padding: 2px;
                border-radius: 2px;
            }
            .debug-entry.info { color: #0066cc; }
            .debug-entry.warning { color: #cc6600; }
            .debug-entry.error { color: #cc0000; }
            .debug-entry.success { color: #006600; }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // Crea l'interfaccia utente
    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'scavengeUI';
        ui.innerHTML = `
            <div class="title">Auto Scav</div>
            <label for="totalSpears">Lancieri Tot</label>
            <input type="number" id="totalSpears" min="0" step="1">
            <div id="unitCheckboxes"></div>
            <div id="nextReloadTime">Refresh Pagina in: --:--</div>
            <div id="startTimer">Avvio tra: --:--</div>
            <div id="debugOutput"></div>
        `;
        document.body.appendChild(ui);

        // Aggiungi i checkbox per ogni unità
        const unitCheckboxes = document.getElementById('unitCheckboxes');
        UNITS.forEach(unit => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'checkbox-container';
            checkboxContainer.innerHTML = `
                <input type="checkbox" id="include${unit.name}" ${unit.include ? 'checked' : ''}>
                <label for="include${unit.name}">Includi ${unit.label}?</label>
            `;
            unitCheckboxes.appendChild(checkboxContainer);

            // Aggiungi event listener per salvare le preferenze
            const checkbox = checkboxContainer.querySelector(`#include${unit.name}`);
            checkbox.addEventListener('change', (e) => {
                unit.include = e.target.checked;
                localStorage.setItem(`scavengeInclude${unit.name}`, unit.include);
                debugLog(`Includi ${unit.label} aggiornato a: ${unit.include}`, 'info');
            });
        });

        // Carica i valori salvati
        const totalSpearsInput = document.getElementById('totalSpears');
        const savedSpears = localStorage.getItem('scavengeTotalSpears');
        if (savedSpears) {
            CONFIG.TOTAL_SPEARS = parseInt(savedSpears);
            totalSpearsInput.value = CONFIG.TOTAL_SPEARS;
        } else {
            totalSpearsInput.value = CONFIG.TOTAL_SPEARS;
        }

        // Carica le preferenze delle unità
        UNITS.forEach(unit => {
            const savedSetting = localStorage.getItem(`scavengeInclude${unit.name}`);
            if (savedSetting !== null) {
                unit.include = savedSetting === 'true';
                const checkbox = document.getElementById(`include${unit.name}`);
                if (checkbox) checkbox.checked = unit.include;
            }
        });
    }

    // Log di debug
    function debugLog(message, type = 'info') {
        if (!CONFIG.DEBUG) return;

        const styles = {
            info: 'color: #0099ff; font-weight: bold;',
            warning: 'color: #ffa500; font-weight: bold;',
            error: 'color: #ff0000; font-weight: bold;',
            success: 'color: #00ff00; font-weight: bold;'
        };

        const timestamp = new Date().toLocaleTimeString();
        console.log(`%c[${timestamp}] ${message}`, styles[type]);

        // Aggiorna l'output di debug nell'UI
        const debugOutput = document.getElementById('debugOutput');
        if (debugOutput) {
            const entry = document.createElement('div');
            entry.className = `debug-entry ${type}`;
            entry.textContent = `[${timestamp}] ${message}`;
            debugOutput.insertBefore(entry, debugOutput.firstChild);

            // Mantieni solo gli ultimi 4 messaggi
            while (debugOutput.children.length > 4) {
                debugOutput.removeChild(debugOutput.lastChild);
            }
        }
    }

    // Funzione per aggiornare il timer di avvio
    function updateStartTimer(seconds) {
        const startTimerElement = document.getElementById('startTimer');
        if (!startTimerElement) return;

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        startTimerElement.textContent = `Avvio tra: ${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (seconds > 0) {
            setTimeout(() => updateStartTimer(seconds - 1), 1000);
        } else {
            startTimerElement.textContent = 'Avvio in corso...';
        }
    }

    // Funzione principale per lo scavenging
    async function handleScavenging() {
        debugLog('=== Starting scavenging operation ===', 'info');

        // Imposta il timer di avvio (es. 10 secondi)
        const startDelay = 10; // Tempo in secondi
        updateStartTimer(startDelay);

        // Attendi il tempo di avvio
        await new Promise(resolve => setTimeout(resolve, startDelay * 1000));

        // Attendi il caricamento dell'UI
        await new Promise(resolve => setTimeout(resolve, CONFIG.UI_LOAD_DELAY));

        // Trova i pulsanti di avvio
        const startButtons = Array.from(document.querySelectorAll('a.btn.free_send_button'));
        if (startButtons.length === 0) {
            debugLog('Nessun pulsante di avvio trovato!', 'error');
            scheduleReload();
            return;
        }

        // Trova il numero di unità disponibili
        const availableUnits = {};
        UNITS.forEach(unit => {
            const unitLink = document.querySelector(`a.units-entry-all[data-unit="${unit.name}"]`);
            if (unitLink) {
                availableUnits[unit.name] = extractNumber(unitLink.textContent);
                debugLog(`${unit.label} disponibili: ${availableUnits[unit.name]}`, 'info');
            } else {
                availableUnits[unit.name] = 0;
                debugLog(`${unit.label} non trovati!`, 'warning');
            }
        });

        // Verifica se ci sono abbastanza unità
        let hasEnoughUnits = false;
        UNITS.forEach(unit => {
            if (unit.include && availableUnits[unit.name] > 0) {
                hasEnoughUnits = true;
            }
        });

        if (!hasEnoughUnits) {
            debugLog('Unità insufficienti, in attesa del prossimo ricaricamento', 'warning');
            scheduleReload();
            return;
        }

        // Calcola le unità da inviare
        const unitsToSend = {};
        UNITS.forEach(unit => {
            if (unit.include) {
                unitsToSend[unit.name] = Math.min(
                    availableUnits[unit.name],
                    Math.floor(CONFIG.TOTAL_SPEARS / startButtons.length)
                );
                debugLog(`${unit.label} da inviare: ${unitsToSend[unit.name]}`, 'info');
            }
        });

        // Trova e imposta gli input
        let allInputsSuccess = true;
        UNITS.forEach(unit => {
            if (unit.include) {
                const input = document.querySelector(`input[name="${unit.name}"].unitsInput.input-nicer`);
                if (input) {
                    const success = setInputValueWithVerification(input, unitsToSend[unit.name]);
                    if (!success) allInputsSuccess = false;
                } else {
                    debugLog(`Input per ${unit.label} non trovato!`, 'error');
                    allInputsSuccess = false;
                }
            }
        });

        if (!allInputsSuccess) {
            debugLog('Impossibile impostare i valori degli input, ricaricamento in corso...', 'error');
            scheduleReload();
            return;
        }

        // Clicca il pulsante di avvio
        const lastButton = startButtons[startButtons.length - 1];
        debugLog('Cliccando il pulsante di avvio...', 'info');
        lastButton.click();

        // Ricarica la pagina
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Funzione per estrarre numeri dal testo
    function extractNumber(text) {
        const match = text.match(/\((\d+)\)/);
        return match ? parseInt(match[1]) : 0;
    }

    // Funzione per impostare i valori degli input con verifica
    async function setInputValueWithVerification(input, value, retryCount = 0) {
        debugLog(`Tentativo ${retryCount + 1} per impostare ${input.name} a ${value}`, 'info');

        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        await new Promise(resolve => setTimeout(resolve, CONFIG.INPUT_RETRY_DELAY));

        if (input.value !== value.toString()) {
            debugLog(`Verifica fallita per ${input.name}! Valore attuale: ${input.value}`, 'warning');

            if (retryCount < CONFIG.MAX_INPUT_RETRIES) {
                debugLog(`Riprova... (${retryCount + 1}/${CONFIG.MAX_INPUT_RETRIES})`, 'info');
                return setInputValueWithVerification(input, value, retryCount + 1);
            } else {
                debugLog('Massimo numero di tentativi raggiunto!', 'error');
                return false;
            }
        }

        debugLog(`${input.name} impostato correttamente`, 'success');
        return true;
    }

    // Funzione per programmare il ricaricamento della pagina
    function scheduleReload() {
        const reloadTime = (Math.random() * (CONFIG.MAX_RELOAD_TIME - CONFIG.MIN_RELOAD_TIME) + CONFIG.MIN_RELOAD_TIME) * 60 * 1000;
        const nextReloadTime = new Date(Date.now() + reloadTime);
        const timeString = nextReloadTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

        const nextReloadElement = document.getElementById('nextReloadTime');
        if (nextReloadElement) {
            nextReloadElement.textContent = `Ricarico alle: ${timeString}`;
        }

        debugLog(`Prossimo ricaricamento alle: ${timeString}`, 'info');
        setTimeout(() => {
            debugLog('Esecuzione del ricaricamento...', 'info');
            window.location.reload();
        }, reloadTime);
    }

    // Avvia lo script
    debugLog('=== Script inizializzato ===', 'info');
    injectStyles();
    createUI();
    handleScavenging();
})();