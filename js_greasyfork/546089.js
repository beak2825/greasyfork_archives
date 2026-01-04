// ==UserScript==
// @name        * Wachen-Personal- & Erweiterungs-Prüfer
// @namespace   leitstellenspiel-scripts
// @version     6.0.0
// @description Prüft Personal & Erweiterungen gegen Baupläne, bietet Zuweisungs-Assistenten und Chat-Anfragen. Finale Version mit robustem Dark-Mode-Styling und optimierter Anzeige.
// @author      Masklin / Gemini
// @license     MIT
// @match       https://*.leitstellenspiel.de/
// @match       https://*.leitstellenspiel.de/buildings/*
// @match       https://*.leitstellenspiel.de/schoolings/*
// @exclude     https://*.leitstellenspiel.de/buildings/*/personals
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/546089/%2A%20Wachen-Personal-%20%20Erweiterungs-Pr%C3%BCfer.user.js
// @updateURL https://update.greasyfork.org/scripts/546089/%2A%20Wachen-Personal-%20%20Erweiterungs-Pr%C3%BCfer.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // ==============
    // 1. ALLGEMEINE KONSTANTEN & HELFER
    // ==============
    const MODAL_ID = 'blueprint-checker-modal';
    const CHAT_REQUEST_KEY = 'lss_chat_request_message';
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // ==============
    // 2. ROUTER: Entscheidet, welcher Skript-Teil ausgeführt wird
    // ==============
    const path = window.location.pathname;

    if (path.includes('/schoolings/')) {
        runSchoolingAssistant();
    } else if (path.includes('/buildings/')) {
        runBuildingChecker();
    } else if (path === '/') {
        runMainPageHelper();
    }

    // =================================================================================
    // TEIL A: LOGIK FÜR DIE HAUPTSEITE (`/`) - DER CHAT-HELFER
    // =================================================================================
    function runMainPageHelper() {
        const message = localStorage.getItem(CHAT_REQUEST_KEY);
        if (message) {
            const chatInput = document.getElementById('alliance_chat_message');
            if (chatInput) {
                chatInput.value = message;
                chatInput.focus();
                localStorage.removeItem(CHAT_REQUEST_KEY);
            }
        }
    }

    // =================================================================================
    // TEIL B: LOGIK FÜR DIE LEHRGANGSSEITE (`/schoolings/*`) - DER ZUWEISUNGS-ASSISTENT
    // =================================================================================
    async function runSchoolingAssistant() {
        const params = new URLSearchParams(window.location.search);
        const buildingId = params.get('assign_building_id');
        const needed = parseInt(params.get('needed'), 10);

        if (!buildingId || !needed) return;

        const assistantStatus = document.createElement('div');
        assistantStatus.innerHTML = `<div id="assistant-status-box" style="padding: 10px; background-color: #337ab7; color: white; text-align: center; position: fixed; top: 50px; left: 50%; transform: translateX(-50%); z-index: 10000; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.5);">Personal-Prüfer Assistent: Bereite alles vor...</div>`;
        document.body.appendChild(assistantStatus);

        function updateStatus(message) {
            const box = document.getElementById('assistant-status-box');
            if (box) box.innerHTML = message;
        }

        try {
            updateStatus(`Suche Wache (ID: ${buildingId}) und lade Personal...`);
            await ensurePanelLoadedAndReady(buildingId);
            updateStatus(`Wähle ${needed} Mitarbeiter ohne Ausbildung aus...`);
            await selectPersonnel(buildingId, needed);
            const buildingPanel = document.querySelector(`.panel[building_id='${buildingId}']`);
            if (buildingPanel) buildingPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
            updateStatus(`<strong>Auswahl abgeschlossen!</strong><br>Bitte überprüfe die Liste und klicke auf "Ausbilden".`);
            setTimeout(() => assistantStatus.remove(), 8000);
        } catch (error) {
            console.error("Fehler im Zuweisungs-Assistent:", error);
            updateStatus(`Ein Fehler ist aufgetreten: ${error.message}`);
            setTimeout(() => assistantStatus.remove(), 8000);
        }
    }

    async function ensurePanelLoadedAndReady(buildingId) {
        const panelHeading = document.querySelector(`.personal-select-heading[building_id='${buildingId}']`);
        const panelBody = document.querySelector(`.panel-body[building_id='${buildingId}']`);
        if (!panelHeading || !panelBody) throw new Error(`Panel für Wache ${buildingId} nicht gefunden.`);

        if (panelBody.classList.contains("hidden") || panelBody.innerHTML.includes("ajax-loader")) {
            panelHeading.click();
        }

        let attempts = 0;
        while (attempts < 100) {
            if (panelBody.querySelector(".schooling_checkbox")) {
                await sleep(50);
                return;
            }
            await sleep(50);
            attempts++;
        }
        throw new Error(`Personal für Wache ${buildingId} konnte nicht geladen werden (Timeout).`);
    }

    async function selectPersonnel(buildingId, capacity) {
        let freeSlotsInCourse = parseInt(document.getElementById('schooling_free')?.textContent || '0', 10);
        let selectedCount = 0;
        const checkboxes = document.querySelectorAll(`.schooling_checkbox[building_id='${buildingId}']`);

        for (const checkbox of checkboxes) {
            if (selectedCount >= capacity || freeSlotsInCourse <= 0) break;
            if (!checkbox.checked && !checkbox.disabled) {
                const educationCell = document.getElementById(`school_personal_education_${checkbox.value}`);
                const hasAnyEducation = educationCell && educationCell.textContent.trim() !== "";
                if (!hasAnyEducation) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change'));
                    selectedCount++;
                    freeSlotsInCourse--;
                }
            }
        }
        if (typeof window.update_costs === 'function') window.update_costs();
        if (typeof window.update_schooling_free === 'function') window.update_schooling_free();
    }

    // =================================================================================
    // TEIL C: LOGIK FÜR DIE WACHEN-SEITE (`/buildings/*`) - DER PERSONAL- & ERWEITERUNGS-PRÜFER
    // =================================================================================
    function runBuildingChecker() {
        const databaseName = "BosErnie_StationBlueprints";
        const objectStoreName = "main";
        const cacheKeyBlueprints = "blueprints";
        const vehiclesConfigKey = "personalpruefer.vehicle-cache";
        const schoolingsMapKey = "personalpruefer.schooling-cache";
        const schoolingDetailsCacheKey = "personalpruefer.schooling-details-cache";
        const storageTtl = 24 * 60 * 60 * 1000;
        const slotsCacheTtl = 5 * 60 * 1000;

        const vehiclesConfigurationOverride = [ { id: 134, maxStaff: 4, training: [{ key: "police_horse", number: 4 }] }, { id: 135, maxStaff: 2, training: [{ key: "police_horse", number: 2 }] }, { id: 137, maxStaff: 6, training: [{ key: "police_horse", number: 6 }] }, { id: 29, maxStaff: 1, training: [{ key: "notarzt", number: 1 }] }, { id: 122, maxStaff: 2, training: [{ key: "thw_energy_supply", number: 2 }] }, { id: 123, maxStaff: 3, training: [{ key: "water_damage_pump", number: 3 }] }, { id: 93, maxStaff: 5, training: [{ key: "thw_rescue_dogs", number: 5 }] }, { id: 53, maxStaff: 6, training: [{ key: "dekon_p", number: 6 }] }, { id: 81, maxStaff: 3, training: [{ key: "police_mek", number: 3 }] }, { id: 79, maxStaff: 3, training: [{ key: "police_sek", number: 3 }] }, { id: 74, maxStaff: 3, training: [{ key: "notarzt", number: 3 }] }, { id: 172, maxStaff: 6, training: [{ key: "disaster_response_technology", number: 6 }] }, { id: 173, maxStaff: 7, training: [{ key: "disaster_response_technology", number: 7 }] }, { id: 126, maxStaff: 5, training: [{ key: "fire_drone", number: 5 }] }, { id: 51, maxStaff: 2, training: [{ key: "police_fukw", number: 2 }] }, ];

        function injectGlobalStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #${MODAL_ID} .modal-pruefer-content { background-color: #fefefe; color: #333; margin: 8% auto; padding: 20px; border: 1px solid #ddd; width: 90%; max-width: 1100px; border-radius: 5px; }
                html.dark #${MODAL_ID} .modal-pruefer-content { background-color: #2d3748; color: #e2e8f0; border-color: #4a5568; }
                #${MODAL_ID} .modal-pruefer-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e5e5; padding-bottom: 10px; margin-bottom: 10px; }
                html.dark #${MODAL_ID} .modal-pruefer-header { border-bottom-color: #4a5568; }
                #${MODAL_ID} .modal-pruefer-header h2 { margin: 0; font-size: 1.5em; }
                #${MODAL_ID} .modal-pruefer-close { color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; }
                .pruefer-log-box { background-color: #f5f5f5; border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; border-radius: 4px; font-size: 0.9em; }
                .pruefer-log-box .log-columns { display: flex; justify-content: space-between; }
                .pruefer-log-box .log-column { flex: 1; padding: 0 10px; }
                .pruefer-log-box .log-column ul { list-style-position: inside; padding: 0; margin:0; }
                html.dark .pruefer-log-box { background-color: #1a202c !important; border-color: #4a5568 !important; color: #e2e8f0 !important; }
                .pruefer-log-box p { margin-top:0; margin-bottom: 5px; }
                html.dark #${MODAL_ID} .alert { color: #e2e8f0; background-color: transparent; border: 1px solid #4a5568; }
                #${MODAL_ID} .alert-personnel-deficit { color: #a94442; background-color: #f2dede; border: 1px solid #ebccd1; font-weight: bold; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
                html.dark #${MODAL_ID} .alert-personnel-deficit { color: #e53e3e; background-color: rgba(255, 0, 0, 0.1); border-color: #e53e3e; font-weight: bold; }
                #${MODAL_ID} table thead tr { border-bottom: 2px solid #ddd; }
                html.dark #${MODAL_ID} table thead tr { color: #ffffff !important; border-bottom-color: #4a5568; background-color: #1a202c; }
                #${MODAL_ID} .extension-label { display: inline-block; margin: 2px; padding: .2em .6em .3em; font-weight: 700; line-height: 1; color: #fff; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: .25em; }
                #${MODAL_ID} .extension-label.label-success { background-color: #5cb85c; }
                #${MODAL_ID} .extension-label.label-danger { background-color: #d9534f; cursor: pointer; }
                #${MODAL_ID} .extension-label.label-danger:hover { background-color: #c9302c; }
                #${MODAL_ID} .extension-label.label-warning { background-color: #f0ad4e; }
            `;
            document.head.appendChild(style);
        }

        async function retrieveBlueprints() { try { const db = await new Promise((resolve, reject) => { const request = window.indexedDB.open(databaseName, 2); request.onerror = () => reject("IndexedDB konnte nicht geöffnet werden."); request.onsuccess = () => resolve(request.result); }); return new Promise((resolve, reject) => { const transaction = db.transaction([objectStoreName], 'readonly'); const store = transaction.objectStore(objectStoreName); const request = store.get(cacheKeyBlueprints); request.onerror = () => reject("Baupläne konnten nicht gelesen werden."); request.onsuccess = () => resolve(request.result); }); } catch (error) { console.error("Fehler beim Abrufen der Baupläne:", error); return null; } }
        function transformVehiclesData(data) { return Object.entries(data).filter(([,v])=>!v.isTrailer).map(([e,t])=>{const a=[];t.staff?.training&&Object.values(t.staff.training).forEach(e=>{Object.entries(e).forEach(([e,{min:n,all:r}])=>{n&&n>0?a.push({key:e,number:n}):!0===r&&a.push({key:e,number:t.maxPersonnel})})});return{id:Number(e),caption:t.caption,maxStaff:t.maxPersonnel,training:a}}) }
        function applyVehicleConfigurationOverride(data) { return data.map(vehicle => { const override = vehiclesConfigurationOverride.find(v => v.id === vehicle.id); if (override) { return { ...vehicle, ...override }; } return vehicle; }); }
        async function initVehiclesConfiguration() { const cached = localStorage.getItem(vehiclesConfigKey); if (cached) { const parsed = JSON.parse(cached); if (parsed.lastUpdate > Date.now() - storageTtl) return parsed.data; } try { const response = await fetch("https://api.lss-manager.de/de_DE/vehicles"); if (!response.ok) throw new Error("API-Fehler"); const data = await response.json(); const transformedData = transformVehiclesData(data); const finalData = applyVehicleConfigurationOverride(transformedData); localStorage.setItem(vehiclesConfigKey, JSON.stringify({ lastUpdate: Date.now(), data: finalData })); return finalData; } catch (err) { console.error("Fehler beim Laden der Fahrzeugdaten:", err); return null; } }
        async function initSchoolingsMap() { const cached = localStorage.getItem(schoolingsMapKey); if (cached) { const parsed = JSON.parse(cached); if (parsed.lastUpdate > Date.now() - storageTtl) return parsed.data; } try { const response = await fetch("https://api.lss-manager.de/de_DE/schoolings"); if (!response.ok) throw new Error("API-Fehler"); const apiData = await response.json(); const schoolingsMap = { 'null': 'Keine Ausbildung nötig' }; for (const org of Object.values(apiData)) { for (const schooling of org) { if (schooling.key && schooling.staffList) { schoolingsMap[schooling.key] = schooling.staffList; } } } localStorage.setItem(schoolingsMapKey, JSON.stringify({ lastUpdate: Date.now(), data: schoolingsMap })); return schoolingsMap; } catch (err) { console.error("Fehler beim Laden der Ausbildungsnamen:", err); return { 'null': 'Keine Ausbildung nötig' }; } }
        async function getAvailableSchoolingsDetails() { const cached = localStorage.getItem(schoolingDetailsCacheKey); if (cached) { const parsed = JSON.parse(cached); if (parsed.lastUpdate > Date.now() - slotsCacheTtl) return parsed.data; } try { const response = await fetch("/schoolings"); if (!response.ok) throw new Error("Netzwerkfehler"); const htmlString = await response.text(); const doc = new DOMParser().parseFromString(htmlString, "text/html"); const table = doc.querySelector("#schooling_opened_table"); if (!table) return {}; const schoolings = {}; const rows = table.querySelectorAll("tbody tr[data-education-key]"); rows.forEach(row => { const key = row.getAttribute("data-education-key"); const linkElement = row.querySelector("td:first-child a"); const slotsElement = row.querySelector("td:nth-child(2)"); const costElement = row.querySelector("td:nth-child(3)"); if (key && linkElement && costElement && slotsElement) { const id = linkElement.href.split("/").pop(); const slots = parseInt(slotsElement.innerText.trim(), 10) || 0; const costText = costElement.innerText.trim(); const cost = parseInt(costText, 10) || 0; const currency = costText.includes("Coins") ? "Co" : "Cr"; if (!schoolings[key]) schoolings[key] = []; schoolings[key].push({ id, cost, currency, slots }); } }); for (const key in schoolings) { schoolings[key].sort((a, b) => a.cost - b.cost); } localStorage.setItem(schoolingDetailsCacheKey, JSON.stringify({ lastUpdate: Date.now(), data: schoolings })); return schoolings; } catch (err) { console.error("Fehler beim Laden der Lehrgangsdetails:", err); return {}; } }
        async function getPersonnelData(buildingId) { try { const response = await fetch(`/buildings/${buildingId}/personals`); if (!response.ok) throw new Error("Netzwerkfehler beim Abruf der Personalseite"); const htmlString = await response.text(); const doc = new DOMParser().parseFromString(htmlString, "text/html"); const personnelRows = doc.querySelectorAll("#personal_table tbody tr"); const totalPersonnelCount = personnelRows.length; const personnel = {}; const inTraining = {}; personnelRows.forEach(row => { const name = row.querySelector("td:first-child")?.innerText.trim(); if (!name) return; const uniqueNameKey = `${name}_${Math.random()}`; personnel[uniqueNameKey] = new Set(); const filterable = row.getAttribute("data-filterable-by"); if (filterable) { try { const keys = JSON.parse(filterable.replace(/&quot;/g, '"')); keys.forEach(key => key && personnel[uniqueNameKey].add(key)); } catch (e) {} } const inTrainingSpan = row.querySelector('span[data-education-key]'); if (inTrainingSpan?.textContent.includes('Im Unterricht')) { const key = inTrainingSpan.getAttribute('data-education-key'); if (key) { inTraining[key] = (inTraining[key] || 0) + 1; } } }); const available = { 'null': 0 }; Object.values(personnel).forEach(trainings => { if (trainings.size === 0) available['null']++; else trainings.forEach(key => { available[key] = (available[key] || 0) + 1; }); }); return { count: totalPersonnelCount, available, inTraining }; } catch (e) { console.error("Fehler bei der Analyse der Personaldaten:", e); return null; } }
        function createFallbackName(key) { if (!key) return ''; return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()); }

        function calculateRequirements(blueprint, vehicleDatabase, trainingMap) {
            const required = { 'null': 0 };
            let totalRequiredPersonnel = 0;
            const log = [];
            const vehicleMap = Object.fromEntries(vehicleDatabase.map(v => [v.id, v]));
            blueprint.vehicles.forEach(vehicle => {
                const dbEntry = vehicleMap[vehicle.id];
                if (!dbEntry) return;
                totalRequiredPersonnel += dbEntry.maxStaff * vehicle.quantity;
                const vehicleRequirements = {};
                if (dbEntry.training && dbEntry.training.length > 0) {
                    dbEntry.training.forEach(t => {
                        const translatedName = trainingMap[t.key] || createFallbackName(t.key);
                        if (vehicleRequirements[translatedName]) {
                            if (t.number > vehicleRequirements[translatedName].number) {
                                vehicleRequirements[translatedName] = { key: t.key, number: t.number };
                            }
                        } else {
                            vehicleRequirements[translatedName] = { key: t.key, number: t.number };
                        }
                    });
                }
                let specialStaff = 0;
                let requirementsStrings = [];
                for (const translatedName in vehicleRequirements) {
                    const req = vehicleRequirements[translatedName];
                    const amount = req.number * vehicle.quantity;
                    required[req.key] = (required[req.key] || 0) + amount;
                    specialStaff += amount;
                    requirementsStrings.push(`${amount}x ${translatedName}`);
                }
                const generalStaff = (dbEntry.maxStaff * vehicle.quantity) - specialStaff;
                if (generalStaff > 0) {
                    required['null'] += generalStaff;
                    requirementsStrings.push(`${generalStaff}x ${trainingMap['null']}`);
                }
                if (requirementsStrings.length > 0) {
                    log.push(`<strong>${vehicle.quantity}x ${dbEntry.caption || 'Unbekanntes Fahrzeug'}:</strong> ${requirementsStrings.join(', ')}`);
                }
            });
            log.sort();
            return { required, log, totalRequiredPersonnel };
        }

        function getExtensionsStatus() {
            const extensionsTab = document.querySelector('#ausbauten');
            if (!extensionsTab) return [];
            const statuses = [];
            const rows = extensionsTab.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const nameElement = row.querySelector('b');
                if (!nameElement) return;
                const name = nameElement.innerText.trim();
                const buyButton = row.querySelector('a.btn-success[href*="/extension/credits/"]');
                const timer = row.querySelector('.extension-timer');
                if (timer) {
                    const endTime = timer.dataset.endTime;
                    statuses.push({ name, status: 'constructing', endTime });
                } else if (buyButton) {
                    const cost = parseInt(buyButton.textContent.replace(/\D/g, ''), 10) || 0;
                    statuses.push({ name, status: 'unbuilt', cost });
                } else {
                    statuses.push({ name, status: 'built' });
                }
            });
            return statuses;
        }

        function showResults(buildingId, required, totalRequiredPersonnel, available, inTraining, personnelCount, trainingMap, log, availableSchoolingsDetails, blueprintExtensions, extensionsStatus) {
            const modalContent = document.getElementById(`${MODAL_ID}-content`);

            let isDarkMode = false;
            try {
                const bgColor = window.getComputedStyle(document.body).backgroundColor;
                const colorValues = bgColor.match(/\d+/g).map(Number);
                const brightness = (colorValues[0] + colorValues[1] + colorValues[2]) / 3;
                if (brightness < 128) isDarkMode = true;
            } catch(e) { isDarkMode = document.documentElement.classList.contains('dark'); }

            const theme = isDarkMode ? { headerText: '#ffffff', bodyText: '#333333', border: '#4a5568', bgOdd: 'rgba(0,0,0,0.2)', bgEven: 'transparent', success: 'rgba(46, 125, 50, 0.4)', warning: 'rgba(245, 127, 23, 0.4)', danger: 'rgba(198, 40, 40, 0.4)' } : { headerText: '#333333', bodyText: '#333333', border: '#ddd', bgOdd: '#f9f9f9', bgEven: '#fff', success: '#dff0d8', warning: '#fcf8e3', danger: '#f2dede' };
            let finalHTML = '';

            const personnelDeficit = totalRequiredPersonnel - personnelCount;
            if (personnelDeficit > 0) {
                finalHTML += `<div class="alert alert-personnel-deficit"><strong>Achtung:</strong> Es sind nicht genügend Mitarbeiter auf der Wache, um den Bauplan zu erfüllen. Es fehlen <strong>${personnelDeficit}</strong> Mitarbeiter. Voraussichtliche Erfüllung in <strong>${personnelDeficit} Tagen</strong>.</div>`;
            }

            if (blueprintExtensions && blueprintExtensions.length > 0) {
                let missingExtensions = [];
                let totalCost = 0;
                let extensionsContent = `<h4>Erweiterungs-Prüfung</h4><div>`;
                blueprintExtensions.forEach(reqExt => {
                    const extName = reqExt.name;
                    const statusInfo = extensionsStatus.find(s => s.name === extName);
                    if (statusInfo?.status === 'built') {
                        extensionsContent += `<span class="extension-label label-success" title="Bereits gebaut"><span class="glyphicon glyphicon-ok"></span> ${extName}</span>`;
                    } else if (statusInfo?.status === 'constructing') {
                        const endDate = new Date(parseInt(statusInfo.endTime, 10));
                        const title = `Im Bau, Fertigstellung am ${endDate.toLocaleString()}`;
                        extensionsContent += `<span class="extension-label label-warning" title="${title}">🚧 ${extName}</span>`;
                    } else {
                        missingExtensions.push(extName);
                        if (statusInfo?.cost) totalCost += statusInfo.cost;
                        extensionsContent += `<span class="extension-label label-danger build-extension-button" data-extension-name="${extName}" title="Erweiterung '${extName}' für ${statusInfo?.cost?.toLocaleString() || 'unbekannte'} Credits bauen"><span class="glyphicon glyphicon-remove"></span> ${extName}</span>`;
                    }
                });
                extensionsContent += `</div>`;
                if (missingExtensions.length > 0) {
                    extensionsContent += `<div style="margin-top: 10px;"><button id="build-all-extensions-btn" class="btn btn-danger btn-sm" data-count="${missingExtensions.length}" data-cost="${totalCost}">Alle ${missingExtensions.length} fehlenden bauen (${totalCost.toLocaleString()} Credits)</button></div>`;
                }
                finalHTML += extensionsContent + '<hr>';
            }

            if (log.length > 0) {
                let logHTML = `<div class="pruefer-log-box"><p><strong>Anforderungs-Details (Personal):</strong></p>`;
                const itemsPerColumn = Math.ceil(log.length / 3);
                const col1 = log.slice(0, itemsPerColumn);
                const col2 = log.slice(itemsPerColumn, itemsPerColumn * 2);
                const col3 = log.slice(itemsPerColumn * 2);
                logHTML += `<div class="log-columns">
                                <div class="log-column"><ul><li>${col1.join('</li><li>')}</li></ul></div>
                                <div class="log-column"><ul><li>${col2.join('</li><li>')}</li></ul></div>
                                <div class="log-column"><ul><li>${col3.join('</li><li>')}</li></ul></div>
                            </div></div>`;
                finalHTML += logHTML;
            }

            const allKeys = new Set([...Object.keys(required), ...Object.keys(available), ...Object.keys(inTraining)]);
            let hasMissing = false;
            allKeys.forEach(key => { if ((required[key] || 0) > (available[key] || 0)) hasMissing = true; });
            const showInTrainingColumn = Array.from(allKeys).some(key => (inTraining[key] || 0) > 0 && (required[key] || 0) > 0);
            const showMissingColumn = hasMissing;
            const showSchoolingColumn = hasMissing;
            let headerHTML = `<th>Ausbildung</th><th>Benötigt</th><th>Vorhanden</th>`;
            if (showInTrainingColumn) headerHTML += `<th>In Ausbildung</th>`;
            if (showMissingColumn) headerHTML += `<th>Fehlend</th>`;
            if (showSchoolingColumn) headerHTML += `<th>Verbandslehrgänge</th>`;
            let tableHTML = `<h4>Personal-Prüfung</h4><p>${personnelCount} Mitarbeiter gefunden:</p><table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9em;"><thead><tr style="color: ${theme.headerText}; text-align: left;">${headerHTML.replace(/<th>/g, '<th style="padding: 8px;">')}</tr></thead><tbody>`;
            const sortedKeys = Array.from(allKeys).sort((a, b) => (a === 'null') ? 1 : (b === 'null') ? -1 : (trainingMap[a] || a).localeCompare(trainingMap[b] || b));
            sortedKeys.forEach((key, index) => {
                const requiredAmount = required[key] || 0;
                if (requiredAmount === 0) return;
                const availableAmount = available[key] || 0;
                const inTrainingAmount = inTraining[key] || 0;
                const missing = Math.max(0, requiredAmount - availableAmount);
                const trainingName = trainingMap[key] || createFallbackName(key);
                let rowBgColor = (index % 2 === 0) ? theme.bgEven : theme.bgOdd;
                if (missing > 0) { rowBgColor = requiredAmount <= availableAmount + inTrainingAmount ? theme.warning : theme.danger; } else if (requiredAmount > 0) { rowBgColor = theme.success; }
                const cellStyle = `padding: 8px; border-bottom: 1px solid ${theme.border}; vertical-align: middle;`;
                let rowContent = `<td style="${cellStyle}">${trainingName}</td><td style="${cellStyle}">${requiredAmount}</td><td style="${cellStyle}">${availableAmount}</td>`;
                if (showInTrainingColumn) rowContent += `<td style="${cellStyle}">${inTrainingAmount > 0 ? `<strong>+${inTrainingAmount}</strong>` : '0'}</td>`;
                if (showMissingColumn) rowContent += `<td style="${cellStyle}"><strong>${missing}</strong></td>`;
                if (showSchoolingColumn) {
                    let cellContent = '-';
                    const uncoveredNeed = Math.max(0, requiredAmount - availableAmount - inTrainingAmount);
                    if (uncoveredNeed > 0) {
                        const courses = (availableSchoolingsDetails[key] || []).filter(c => c.slots > 0);
                        const totalSlots = courses.reduce((sum, course) => sum + course.slots, 0);
                        if (totalSlots >= uncoveredNeed) {
                            let neededSlots = uncoveredNeed;
                            const links = [];
                            for (const course of courses) { if (neededSlots <= 0) break; const assignCount = Math.min(neededSlots, course.slots); const url = `/schoolings/${course.id}?assign_building_id=${buildingId}&needed=${assignCount}`; const buttonText = `Zuweisen (${assignCount})`; const titleText = `Weise ${assignCount} von ${course.slots} Plätzen in diesem Kurs zu. Kosten: ${course.cost} ${course.currency}.`; links.push(`<a href="${url}" target="_blank" class="btn btn-primary btn-xs" style="margin: 2px;" title="${titleText}">${buttonText}</a>`); neededSlots -= assignCount; }
                            cellContent = `<div style="display: flex; flex-wrap: wrap;">${links.join('')}</div>`;
                        } else {
                            const neededToRequest = uncoveredNeed - totalSlots;
                            let postButton = '';
                            if (key !== 'null') {
                                postButton = `<button class="btn btn-warning btn-xs post-request-button" style="margin-left: 5px;" data-training-name="${trainingName}" data-missing-count="${neededToRequest}">Anfrage posten</button>`;
                            }
                            cellContent = `<strong style="color: #D32F2F;">Nein</strong> (${totalSlots} Plätze) ${postButton}`;
                        }
                    }
                    rowContent += `<td style="${cellStyle}">${cellContent}</td>`;
                }
                tableHTML += `<tr style="background-color: ${rowBgColor}; color: ${theme.bodyText};">${rowContent}</tr>`;
            });
            tableHTML += `</tbody></table>`;
            if (hasMissing) { if (showInTrainingColumn) tableHTML += `<p class="alert alert-info" style="margin-top:10px;"><strong>Hinweis:</strong> Gelbe Zeilen markieren Anforderungen, die durch Personal in Ausbildung gedeckt werden.</p>`; if (sortedKeys.some(k => (required[k] || 0) > (available[k] || 0) + (inTraining[k] || 0))) tableHTML += `<p class="alert alert-danger"><strong>Es fehlen Ausbildungen, die auch mit Personal in Ausbildung nicht erfüllt werden können.</strong></p>`; } else if (sortedKeys.some(k => (required[k] || 0) > 0)) { tableHTML += `<p class="alert alert-success" style="margin-top:10px;"><strong>Perfekt! Alle für den Bauplan benötigten Ausbildungen sind vorhanden.</strong></p>`; } else { tableHTML += `<p class="alert alert-info" style="margin-top:10px;"><strong>Für diesen Bauplan werden keine speziellen Ausbildungen benötigt.</strong></p>`; }

            modalContent.innerHTML = finalHTML + tableHTML;
        }

        async function startCheckProcess(h1, selectedBlueprint, vehicleDb, schoolingsMap, availableSchoolingsDetails) {
            const modal = document.getElementById(MODAL_ID);
            const modalContent = document.getElementById(`${MODAL_ID}-content`);
            document.getElementById(`${MODAL_ID}-title`).innerText = `Prüfung für: ${h1.innerText.trim()} (Bauplan: ${selectedBlueprint.name})`;
            modal.style.display = 'block';
            modalContent.innerHTML = `Daten werden analysiert...`;
            const buildingId = window.location.pathname.split('/')[2];
            const [personnelData, extensionsStatus] = await Promise.all([ getPersonnelData(buildingId), getExtensionsStatus() ]);
            if (personnelData === null) { modalContent.innerHTML = `<div class="alert alert-danger">FEHLER: Personaldaten konnten nicht geladen werden.</div>`; return; }
            const { required, log, totalRequiredPersonnel } = calculateRequirements(selectedBlueprint, vehicleDb, schoolingsMap);
            showResults(buildingId, required, totalRequiredPersonnel, personnelData.available, personnelData.inTraining, personnelData.count, schoolingsMap, log, availableSchoolingsDetails, selectedBlueprint.extensions, extensionsStatus);
        }

        async function buildExtension(extensionName, buttonElement) {
            const extensionsTab = document.querySelector('#ausbauten');
            if (!extensionsTab) return false;
            const rows = extensionsTab.querySelectorAll('tbody tr');
            for (const row of rows) {
                const nameElement = row.querySelector('b');
                if (nameElement && nameElement.innerText.trim() === extensionName) {
                    const creditsButton = row.querySelector('a.btn-success[href*="/extension/credits/"]');
                    if (creditsButton) {
                        const url = creditsButton.href;
                        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
                        if(buttonElement) {
                            buttonElement.innerHTML = `Baue...`;
                            buttonElement.disabled = true;
                        }
                        try {
                            const response = await fetch(url, { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } });
                            if (!response.ok) throw new Error(`Server-Fehler: ${response.statusText}`);
                            if(buttonElement) {
                                buttonElement.classList.remove('label-danger', 'build-extension-button');
                                buttonElement.classList.add('label-warning');
                                buttonElement.innerHTML = `🚧 ${extensionName}`;
                                buttonElement.title = 'Wird gebaut (Seite neu laden für Details)';
                                buttonElement.style.cursor = 'default';
                            }
                        } catch (error) {
                            console.error('Fehler beim Bauen der Erweiterung:', error);
                            alert(`Fehler beim Bauen von "${extensionName}".`);
                            if(buttonElement) {
                                buttonElement.innerHTML = `❌ ${extensionName}`;
                                buttonElement.disabled = false;
                            }
                        }
                        return true;
                    }
                }
            }
            return false;
        }

        new MutationObserver(async (_, observer) => {
            const h1 = document.querySelector("h1[building_type]");
            if (h1) {
                const personalDt = Array.from(document.querySelectorAll('dl.dl-horizontal dt')).find(dt => dt.textContent.includes('Personal:'));
                const personalGroup = personalDt?.nextElementSibling?.querySelector('.btn-group');
                if (personalGroup) {
                    observer.disconnect();
                    injectGlobalStyles();
                    let buttonContainer = document.getElementById('lss-personal-pruefer-container');
                    if (!buttonContainer) {
                        buttonContainer = document.createElement('div');
                        buttonContainer.className = 'btn-group';
                        buttonContainer.id = 'lss-personal-pruefer-container';
                        buttonContainer.style.marginLeft = '5px';
                        personalGroup.parentNode.insertBefore(buttonContainer, personalGroup.nextSibling);
                    }
                    buttonContainer.innerHTML = '<em>Lade Daten...</em>';
                    const [stationBlueprints, vehicleDb, schoolingsMap, availableSchoolingsDetails] = await Promise.all([retrieveBlueprints(), initVehiclesConfiguration(), initSchoolingsMap(), getAvailableSchoolingsDetails()]);
                    if (!stationBlueprints || !vehicleDb || !schoolingsMap) {
                        buttonContainer.innerHTML = '<em>Fehler bei Daten</em>';
                        return;
                    }
                    const buildingTypeId = parseInt(h1.getAttribute("building_type"));
                    const matchingBlueprints = Object.values(stationBlueprints).filter(bp => bp.enabled && bp.buildingTypeId === buildingTypeId);
                    buttonContainer.innerHTML = '';
                    if (matchingBlueprints.length > 0) {
                        matchingBlueprints.forEach(blueprint => {
                            const checkButton = document.createElement('a');
                            checkButton.className = 'btn btn-primary btn-xs';
                            checkButton.innerHTML = `<span class="glyphicon glyphicon-list-alt"></span> Prüfen: ${blueprint.name}`;
                            checkButton.addEventListener('click', (e) => {
                                e.preventDefault();
                                startCheckProcess(h1, blueprint, vehicleDb, schoolingsMap, availableSchoolingsDetails);
                            });
                            buttonContainer.appendChild(checkButton);
                        });
                    } else {
                        buttonContainer.innerHTML = '<em>Keine Baupläne</em>';
                    }
                    if (!document.getElementById(MODAL_ID)) {
                        const modalHTML = `<div id="${MODAL_ID}" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.5);"><div class="modal-pruefer-content"><div class="modal-pruefer-header"><h2 id="${MODAL_ID}-title">Prüfung</h2><span id="${MODAL_ID}-close" class="modal-pruefer-close">&times;</span></div><div id="${MODAL_ID}-content"></div></div></div>`;
                        document.body.insertAdjacentHTML('beforeend', modalHTML);
                        const modal = document.getElementById(MODAL_ID);
                        document.getElementById(`${MODAL_ID}-close`).addEventListener('click', () => modal.style.display = 'none');
                        window.addEventListener('click', e => { if (e.target == modal) modal.style.display = 'none'; });

                        modal.addEventListener('click', async function(event) {
                            const target = event.target.closest('.post-request-button, .build-extension-button, #build-all-extensions-btn');
                            if (!target) return;
                            event.preventDefault();
                            event.stopPropagation();

                            if (target.classList.contains('post-request-button')) {
                                const trainingName = target.dataset.trainingName;
                                const missingCount = target.dataset.missingCount;
                                const message = `Hallo zusammen, könnte jemand bitte einen Lehrgang für "${trainingName}" starten? Es werden ${missingCount} Plätze benötigt. Vielen Dank!`;
                                localStorage.setItem(CHAT_REQUEST_KEY, message);
                                window.open('/','_blank');
                                target.textContent = 'Weitergeleitet...';
                                target.disabled = true;
                            } else if (target.classList.contains('build-extension-button')) {
                                await buildExtension(target.dataset.extensionName, target);
                            } else if (target.id === 'build-all-extensions-btn') {
                                const count = target.dataset.count;
                                const cost = parseInt(target.dataset.cost, 10);
                                if (confirm(`Möchtest du wirklich ${count} fehlende Erweiterungen für insgesamt ${cost.toLocaleString()} Credits bauen?`)) {
                                    target.textContent = 'Arbeite...';
                                    target.disabled = true;
                                    const missingLabels = modal.querySelectorAll('.build-extension-button');
                                    for (const label of missingLabels) {
                                        await buildExtension(label.dataset.extensionName, label);
                                        await sleep(500);
                                    }
                                    target.textContent = 'Alle Aufträge gesendet';
                                }
                            }
                        });
                    }
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    }
})();