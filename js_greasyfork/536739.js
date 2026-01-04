// ==UserScript==
// @name          Personalzuweiser auto-mod v3.5
// @namespace     personalzuweiser.leitstellenspiel.de
// @version       3.5.1
// @license       BSD-3-Clause
// @author        BOS-Ernie, Masklin, BAHendrik (modifiziert und fusioniert durch KI)
// @description   Zeigt Fahrzeug-Typ-ID im Log. Bugfix Einzelzuweisung. Zeigt Anforderungsquelle im Log. Hebt Zuweisungen auf, zeigt Fortschritt im Log an, weist Personal zu, startet kombinierte Ausbau/Bauplan/Personal-Sequenzen, Debugging, Entzuordnung, Hotkeys, Flottenkonfiguration.
// @match         https://*.leitstellenspiel.de/vehicles/*/zuweisung
// @match         https://*.leitstellenspiel.de/buildings/*
// @run-at        document-idle
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/536739/Personalzuweiser%20auto-mod%20v35.user.js
// @updateURL https://update.greasyfork.org/scripts/536739/Personalzuweiser%20auto-mod%20v35.meta.js
// ==/UserScript==

/* global $, I18n */

(async function () {
    // ### GRUNDEINSTELLUNGEN ###
    const assignHotkey = "s"; // Personal auf Fahrzeugseite zuweisen
    const resetHotkey = "x"; // Personal auf Fahrzeugseite entfernen
    const autoAssignHotkey = "z"; // Auto-Modus von Fahrzeugseite starten
    const nextVehicleHotkey = "d"; // Nächstes Fahrzeug (manuell)
    const previousVehicleHotkey = "a"; // Vorheriges Fahrzeug (manuell)

    const buildingNextHotkey = "d"; // Nächste Wache
    const buildingPreviousHotkey = "a"; // Vorherige Wache
    const buildingStartAutoHotkey = "s"; // Zuweisen für ALLE Fzg. der Wache starten
    const buildingStartVisibleAutoHotkey = "c"; // Zuweisen für SICHTBARE Fzg. der Wache starten
    const buildingStartUnassignVisibleHotkey = "v"; // AUFHEBEN für SICHTBARE Fzg. der Wache starten
    const applyFleetConfigHotkey = "w"; // Nur ausgewählten Wachenbauplan anwenden
    const triggerPlanAndAutoAssignHotkey = "x"; // Nur Wachenbauplan anwenden UND Personal zuweisen

    // ### NEU: Kombinierte Sequenz (Ausbau -> Bauplan -> Personal) ###
    const combinedSequenceHotkey = "y"; // STARTET DIE GESAMTE SEQUENZ

    const skipVehiclesWithNoSpecialTraining = false;
    const assignMostSeniorFirst = false;
    const skippableCaptionPrefixes = ["anh ", "mzb ", "boot "];
    const enablePersistentDebugLog = true;
    const forceStatus2OnFull = false;

    // ### INTERNE KONFIGURATION ###
    const localStoragePrefix = "personalzuweiser.";
    const autoRunStateKey = localStoragePrefix + "autoRunState";
    const vehiclesConfigKey = localStoragePrefix + "vehicle-type-configurations";
    const persistentDebugLogKey = localStoragePrefix + "debugLog";
    const storageTtl = 24 * 60 * 60 * 1000;
    const fleetConfigIdStorageKey = localStoragePrefix + "selectedFleetConfigId";
    const pendingAutoModeStartKey = localStoragePrefix + "pendingAutoModeStartForBuilding";
    const sequenceStateKey = localStoragePrefix + "sequence.state";

    let currentSelectedFleetConfigId = localStorage.getItem(fleetConfigIdStorageKey) || null;

    let autoRunState = JSON.parse(localStorage.getItem(autoRunStateKey)) || {
        active: false, vehicleQueue: [], originBuildingId: null,
        lastProcessedVehicleId: null, pendingStartFromVehiclePage: false, initialVehicleId: null,
        totalVehicles: 0, processedVehicles: 0, mode: 'assign'
    };

    const isVehicleAssignmentPage = window.location.pathname.includes("/vehicles/") && window.location.pathname.includes("/zuweisung");
    const isBuildingOverviewPage = window.location.pathname.includes("/buildings/") && !window.location.pathname.includes("/expand");
    const isBuildingExpansionPage = window.location.pathname.includes("/expand");
    const currentVehicleId = isVehicleAssignmentPage ? window.location.pathname.split("/")[2] : null;
    const currentBuildingId = (isBuildingOverviewPage || isBuildingExpansionPage) ? window.location.pathname.split("/")[2] : null;

    let vehiclesConfiguration = [];

    const vehiclesConfigurationOverride = [
        { id: 134, caption: "Pferdetransporter klein", maxStaff: 4, training: [ { key: "police_horse", number: 4, } ], },
        { id: 135, caption: "Pferdetransporter groß", maxStaff: 2, training: [ { key: "police_horse", number: 2, } ], },
        { id: 137, caption: "Zugfahrzeug Pferdetransport", maxStaff: 6, training: [ { key: "police_horse", number: 6, } ], },
        { id: 29, caption: "NEF", maxStaff: 1, training: [ { key: "notarzt", number: 1, } ], },
        { id: 122, caption: "LKW 7 Lbw (FGr E)", maxStaff: 2, training: [ {key: "thw_energy_supply", number: 2,} ], },
        { id: 123, caption: "LKW 7 Lbw (FGr WP)", maxStaff: 3, training: [ {key: "water_damage_pump", number: 3, } ], },
        { id: 93, caption: "MTW-O", maxStaff: 5, training: [ {key: "thw_rescue_dogs", number: 5, } ], },
        { id: 53, caption: "Dekon-P", maxStaff: 6, training: [ {key: "dekon_p", number: 6, } ], },
        { id: 81, caption: "MEK - ZF", maxStaff: 3, training: [ {key: "police_mek", number: 3, } ], },
        { id: 79, caption: "SEK - ZF", maxStaff: 3, training: [ {key: "police_sek", number: 3, } ], },
        { id: 51, caption: "FüKW (Polizei)", maxStaff: 2, training: [ {key: "police_fukw", number: 2, } ], }
    ];

    function debugLog(message) {
        if (!enablePersistentDebugLog) return;
        let logs = JSON.parse(localStorage.getItem(persistentDebugLogKey)) || [];
        logs.push(`${new Date().toLocaleTimeString()} - ${message}`);
        if (logs.length > 50) logs = logs.slice(logs.length - 50);
        localStorage.setItem(persistentDebugLogKey, JSON.stringify(logs));
        console.log(message);
    }

    function displayPersistentDebugLog() {
        if (!enablePersistentDebugLog) return;
        const logs = JSON.parse(localStorage.getItem(persistentDebugLogKey));
        if (logs && logs.length > 0) {
            console.groupCollapsed("📊 Personalzuweiser Debug-Log (Historisch)");
            logs.forEach(log => console.log(log));
            console.groupEnd();
            localStorage.removeItem(persistentDebugLogKey);
        }
    }

    function saveAutoRunState() {
        localStorage.setItem(autoRunStateKey, JSON.stringify(autoRunState));
    }

    function resetAutoRunState() {
        autoRunState = {
            active: false, vehicleQueue: [], originBuildingId: null,
            lastProcessedVehicleId: null, pendingStartFromVehiclePage: false, initialVehicleId: null,
            totalVehicles: 0, processedVehicles: 0, mode: 'assign'
        };
        saveAutoRunState();
        debugLog("✅ Auto-Modus beendet und Zustand zurückgesetzt.");
    }

    async function initVehiclesConfiguration() {
        const cached = localStorage.getItem(vehiclesConfigKey);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.lastUpdate > Date.now() - storageTtl) {
                vehiclesConfiguration = applyVehicleConfigurationOverride(parsed.data);
                return;
            }
        }
        try {
            const response = await fetch("https://api.lss-manager.de/de_DE/vehicles");
            if (!response.ok) throw new Error("API Fehler");
            const data = await response.json();
            vehiclesConfiguration = applyVehicleConfigurationOverride(transformVehiclesData(data));
            localStorage.setItem(vehiclesConfigKey, JSON.stringify({
                lastUpdate: Date.now(), data: vehiclesConfiguration,
            }));
        } catch (err) {
            console.error("Fehler beim Laden der Fahrzeugdaten:", err);
            debugLog("Fehler beim Laden der Fahrzeugdaten: " + err.message);
        }
    }

    function applyVehicleConfigurationOverride(data) {
        return data.map(vehicle => {
            const override = vehiclesConfigurationOverride.find(v => v.id === vehicle.id);
            return override || vehicle;
        });
    }

    function transformVehiclesData(data) {
        return Object.entries(data)
            .filter(([, v]) => !v.isTrailer)
            .map(([id, v]) => {
                const training = [];
                if (v.staff?.training) {
                    for (const courseGroup of Object.values(v.staff.training)) {
                        for (const [key, info] of Object.entries(courseGroup)) {
                            if (info.min && info.min > 0) {
                                training.push({ key, number: info.min });
                            } else if (info.all === true) {
                                training.push({ key, number: v.maxPersonnel });
                            }
                        }
                    }
                }
                return { id: Number(id), caption: v.caption, maxStaff: v.maxPersonnel, training, };
            });
    }

    async function getVehicleData(vehicleId) {
        try {
            const response = await fetch(`/api/v2/vehicles/${vehicleId}`);
            if (!response.ok) throw new Error("Fahrzeugdaten nicht geladen");
            const data = await response.json();
            return data.result;
        } catch (e) {
            console.error(`Fehler beim Abrufen der Fahrzeugdaten für Fahrzeug ${vehicleId}:`, e);
            debugLog(`Fehler beim Abrufen der Fahrzeugdaten für Fahrzeug ${vehicleId}: ${e.message}`);
            return null;
        }
    }

    function getAssignedPersonsElement() {
        return document.getElementById("count_personal");
    }

    function getAssignedWithTraining(key) {
        const removeButtons = document.querySelectorAll("a.btn-assigned");
        const assignedRows = Array.from(removeButtons).map(button => button.closest('tr'));

        if (assignedRows.length === 0) return 0;

        const filteredRows = assignedRows.filter(row => {
            if (!row || !row.hasAttribute('data-filterable-by')) return false;
            const filters = row.getAttribute("data-filterable-by").replace(/[\[\]"]/g, "").split(",").map(x => x.trim());

            if (key === null) return filters.length === 1 && filters[0] === "";
            return filters.includes(key);
        });

        return filteredRows.length;
    }

    function getAvailableWithTraining(key) {
        return Array.from(document.querySelectorAll("tr[data-filterable-by]")).filter(row => {
            const filters = row.getAttribute("data-filterable-by").replace(/[\[\]"]/g, "").split(",").map(x => x.trim());
            const inTraining = row.children[2].innerText.startsWith("Im Unterricht");
            const assignButton = row.querySelector("a.btn-success");
            if (!assignButton) return false;

            if (key === null) return filters.length === 1 && filters[0] === "" && !inTraining;
            return filters.includes(key) && !inTraining;
        });
    }

    async function assignPersonnel(key, number) {
        let assigned = 0;
        const rows = getAvailableWithTraining(key);
        if (assignMostSeniorFirst) rows.reverse();

        for (const row of rows) {
            if (assigned >= number) break;
            const button = row.querySelector("a.btn-success");
            if (!button) continue;
            const id = button.getAttribute("personal_id");
            const element = document.getElementById(`personal_${id}`);
            if (!element) {
                debugLog(`WARNUNG: Personal-Element mit ID personal_${id} nicht gefunden. Überspringe.`);
                continue;
            }
            element.innerHTML = `<td colspan="4">${I18n.t("common.loading")}</td>`;

            const response = await fetch(button.href, {
                method: "POST", headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-csrf-token": document.querySelector("meta[name=csrf-token]").content,
                    "x-requested-with": "XMLHttpRequest",
                },
            });
            if (!response.ok) {
                console.error(`Fehler beim Zuweisen von Personal ${id} (Typ: ${key}):`, response.statusText);
                debugLog(`Fehler beim Zuweisen von Personal ${id} (Typ: ${key}): ${response.statusText}`);
                continue;
            }
            element.innerHTML = await response.text();

            await new Promise(r => setTimeout(r, 50));

            const currentCountElement = getAssignedPersonsElement();
            if (currentCountElement) {
                currentCountElement.innerText = (parseInt(currentCountElement.innerText) + 1).toString();
            }
            assigned++;
        }
        return assigned;
    }

    async function setVehicleStatus(vehicleId, status) {
        try {
            debugLog(`Versuche, Fahrzeug ${vehicleId} auf Status ${status} zu setzen.`);
            const response = await fetch(`/vehicles/${vehicleId}/set_fms/${status}`);
            if (!response.ok) {
                throw new Error(`Fehler beim Setzen von Status ${status} für Fahrzeug ${vehicleId}: ${response.statusText} (Status: ${response.status})`);
            }
            debugLog(`✅ Fahrzeug ${vehicleId} erfolgreich auf Status ${status} gesetzt.`);
        } catch (error) {
            console.error(`❌ Fehler beim Setzen von Status ${status} für Fahrzeug ${vehicleId}:`, error);
            debugLog(`❌ Fehler beim Setzen von Status ${status} für Fahrzeug ${vehicleId}: ${error.message}`);
        }
    }

    async function navigateToNextVehicleInQueue() {
        if (autoRunState.vehicleQueue.length > 0) {
            const nextVehicleId = autoRunState.vehicleQueue[0];
            debugLog(`➡️ Navigiere zum nächsten Fahrzeug in der Warteschlange: ${nextVehicleId}`);
            window.location.href = `/vehicles/${nextVehicleId}/zuweisung`;
        } else {
            debugLog("🏁 Alle Fahrzeuge in der Warteschlange abgearbeitet.");
            const originBuildingId = autoRunState.originBuildingId;
            resetAutoRunState();
            if (originBuildingId) {
                debugLog(`↩️ Springe zurück zur Wache ${originBuildingId}.`);
                window.location.href = `/buildings/${originBuildingId}`;
            } else {
                debugLog("Keine Ursprungs-Wache gefunden. Bleibe auf aktueller Seite.");
            }
        }
    }

    function manageQueue() {
        if (autoRunState.vehicleQueue.length > 0) {
            const expectedVehicleId = String(autoRunState.vehicleQueue[0]);
            if (String(currentVehicleId) === expectedVehicleId) {
                autoRunState.vehicleQueue.shift();
                autoRunState.lastProcessedVehicleId = currentVehicleId;
                saveAutoRunState();
                return true;
            } else {
                debugLog(`Auto-Modus aktiv, aber Fahrzeug ${currentVehicleId} ist nicht das erwartete (${expectedVehicleId}). Auto-Modus wird beendet.`);
                resetAutoRunState();
                return false;
            }
        }
        return false;
    }

    async function unassignVehicleLogic() {
        const vehicleData = await getVehicleData(currentVehicleId);
        if (autoRunState.active) {
            autoRunState.processedVehicles++;
            saveAutoRunState();
            console.log(`%c🚀 [${autoRunState.processedVehicles}/${autoRunState.totalVehicles}] Entferne Zuweisungen für '${vehicleData?.caption || currentVehicleId}'`, "color: #dc3545; font-weight: bold;");

            if(!manageQueue()) {
                updateVehicleAssignmentPageButtons(false);
                return;
            }
        }

        await reset();

        if(autoRunState.active) {
            await navigateToNextVehicleInQueue();
        }
    }

    async function assignVehicleLogic() {
        debugLog("Starte Einzelzuweisung...");

        const vehicleData = await getVehicleData(currentVehicleId);
        if (!vehicleData) {
            debugLog(`Fahrzeug ${currentVehicleId}: Konnte Fahrzeugdaten nicht abrufen. Abbruch.`);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        if (autoRunState.active) {
            autoRunState.processedVehicles++;
            saveAutoRunState();
            console.log(`%c🚀 [${autoRunState.processedVehicles}/${autoRunState.totalVehicles}] Bearbeite Fahrzeug '${vehicleData.caption}' (${currentVehicleId})`, "color: #007bff; font-weight: bold;");

            if(!manageQueue()) {
                updateVehicleAssignmentPageButtons(false);
                return;
            }
        }

        if (vehicleData.caption && typeof vehicleData.caption === 'string') {
            const lowerCaseCaption = vehicleData.caption.toLowerCase();
            if (skippableCaptionPrefixes.some(prefix => lowerCaseCaption.startsWith(prefix.toLowerCase()))) {
                debugLog(`ℹ️ Fahrzeug ${currentVehicleId} ('${vehicleData.caption}') wird aufgrund des Namenspräfixes übersprungen.`);
                if (autoRunState.active) await navigateToNextVehicleInQueue();
                return;
            }
        }

        const vehicleTypeId = vehicleData.vehicle_type;
        const config = vehiclesConfiguration.find(v => v.id === vehicleTypeId);
        if (!config) {
            debugLog(`Fahrzeug ${currentVehicleId} ('${vehicleData.caption}'): Keine Konfiguration für Fahrzeugtyp-ID ${vehicleTypeId} gefunden. Wird übersprungen.`);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        const isOverride = vehiclesConfigurationOverride.some(v => v.id === vehicleTypeId);
        const sourceText = isOverride ? "Skript-Vorgabe" : "API-Standard";
        let requirementsText = "(keine Spezialisierung)";
        if (config.training && config.training.length > 0) {
            requirementsText = config.training.map(t => `${t.number}x ${t.key}`).join(', ');
        }
        // KORREKTUR: Log um Fahrzeug-Typ-ID erweitert
        debugLog(`ℹ️ Anforderung (Typ-ID: ${vehicleTypeId}) aus ${sourceText}: ${requirementsText}`);

        const assignedPersonsElement = getAssignedPersonsElement();
        if (!assignedPersonsElement && config.maxStaff > 0) {
            debugLog(`WARNUNG: Element 'count_personal' nicht gefunden für Fahrzeug ${currentVehicleId}, obwohl es Personal benötigt. Überspringe.`);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        const capacity = config.maxStaff;
        const initialFmsStatus = vehicleData.fms_real;
        const needsSpecialTraining = config.training && config.training.length > 0;

        if (capacity === 0) {
            debugLog(`ℹ️ Fahrzeugtyp '${config.caption}' benötigt kein Personal. Überspringe Zuweisung.`);
            if (initialFmsStatus === 6 || forceStatus2OnFull) await setVehicleStatus(currentVehicleId, 2);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        let currentAssignedCount = parseInt(assignedPersonsElement?.innerText || '0');
        let initialSpecialRequirementsMet = true;
        if (needsSpecialTraining) {
            for (const t of config.training) {
                if (getAssignedWithTraining(t.key) < t.number) {
                    initialSpecialRequirementsMet = false;
                    break;
                }
            }
        }

        let performResetAndReassignment = false;
        if (currentAssignedCount > capacity || (needsSpecialTraining && !initialSpecialRequirementsMet)) {
            performResetAndReassignment = true;
        } else if (currentAssignedCount === capacity && (!needsSpecialTraining || initialSpecialRequirementsMet)) {
            debugLog("✅ Fahrzeug bereits korrekt besetzt.");
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        if (performResetAndReassignment) {
            debugLog(`Zuweisung nicht korrekt. Starte Reset und Neuzuweisung.`);
            await reset();
            await new Promise(r => setTimeout(r, 500));
        }

        if (needsSpecialTraining) {
            for (const t of config.training) {
                const assignedOfTypeBefore = getAssignedWithTraining(t.key);
                const stillNeededOfType = t.number - assignedOfTypeBefore;
                if (stillNeededOfType > 0) await assignPersonnel(t.key, stillNeededOfType);
            }
        } else {
            const currentTotalAssigned = parseInt(getAssignedPersonsElement()?.innerText || '0');
            const remainingOverallCapacity = capacity - currentTotalAssigned;
            if (remainingOverallCapacity > 0) await assignPersonnel(null, remainingOverallCapacity);
        }

        const finalAssignedTotalCount = parseInt(getAssignedPersonsElement()?.innerText || '0');

        let finalSpecialRequirementsMet = true;
        if (needsSpecialTraining) {
            for (const t of config.training) {
                if (getAssignedWithTraining(t.key) < t.number) {
                    finalSpecialRequirementsMet = false;
                    break;
                }
            }
        }

        if (finalAssignedTotalCount === capacity && finalSpecialRequirementsMet) {
            debugLog("✅ Fahrzeug nach Zuweisung korrekt besetzt.");
            if (initialFmsStatus === 6 || forceStatus2OnFull) await setVehicleStatus(currentVehicleId, 2);
        } else {
            debugLog("⚠️ Fahrzeug konnte nicht vollständig/korrekt besetzt werden.");
            await setVehicleStatus(currentVehicleId, 6);
        }

        if (autoRunState.active) {
            await navigateToNextVehicleInQueue();
        }
    }

    async function startAutoAssignForBuilding(unassignMode = false) {
        const modeText = unassignMode ? "Zuweisungen aufheben" : "Auto-Zuweisung";
        debugLog(`🚀 Starte ${modeText} für ALLE Fahrzeuge der Wache ${currentBuildingId}...`);

        let vehicleIds = new Set();
        const vehicleLinkElements = document.querySelectorAll("#building_vehicles a[href*='/vehicles/'], .tab-content a[href*='/vehicles/']");
        for (const a of vehicleLinkElements) {
            const match = a.href.match(/\/vehicles\/(\d+)/);
            if (match && match[1]) vehicleIds.add(match[1]);
        }
        let vehicleQueueArray = Array.from(vehicleIds);

        if (vehicleQueueArray.length === 0) {
            alert("Keine zuweisbaren Fahrzeuge auf dieser Wache gefunden.");
            return;
        }

        autoRunState.active = true;
        autoRunState.vehicleQueue = vehicleQueueArray;
        autoRunState.originBuildingId = currentBuildingId;
        autoRunState.totalVehicles = vehicleQueueArray.length;
        autoRunState.processedVehicles = 0;
        autoRunState.mode = unassignMode ? 'unassign' : 'assign';
        saveAutoRunState();

        debugLog(`Gefundene Fahrzeuge: ${autoRunState.vehicleQueue.length}. Starte Navigation.`);
        window.location.href = `/vehicles/${autoRunState.vehicleQueue[0]}/zuweisung`;
    }

    async function startAutoAssignForVisible(unassignMode = false) {
        const modeText = unassignMode ? "Zuweisungen aufheben" : "Auto-Zuweisung";
        debugLog(`🚀 Starte ${modeText} für SICHTBARE Fahrzeuge der Wache ${currentBuildingId}...`);

        const vehicleTable = document.getElementById('vehicle_table');
        if (!vehicleTable) {
            alert("Fahrzeugtabelle 'vehicle_table' nicht gefunden.");
            return;
        }

        const visibleRows = Array.from(vehicleTable.querySelectorAll('tbody tr')).filter(row => row.style.display !== 'none');
        const vehicleIds = visibleRows.map(row => {
            const link = row.querySelector('a[href*="/vehicles/"]');
            if (link) {
                const match = link.href.match(/\/vehicles\/(\d+)/);
                return match ? match[1] : null;
            }
            return null;
        }).filter(id => id !== null);

        if (vehicleIds.length === 0) {
            alert("Keine sichtbaren Fahrzeuge für die Zuweisung gefunden. Bitte Filter prüfen.");
            return;
        }

        autoRunState.active = true;
        autoRunState.vehicleQueue = vehicleIds;
        autoRunState.originBuildingId = currentBuildingId;
        autoRunState.totalVehicles = vehicleIds.length;
        autoRunState.processedVehicles = 0;
        autoRunState.mode = unassignMode ? 'unassign' : 'assign';
        saveAutoRunState();

        debugLog(`Gefundene sichtbare Fahrzeuge: ${autoRunState.vehicleQueue.length}. Starte Navigation.`);
        window.location.href = `/vehicles/${autoRunState.vehicleQueue[0]}/zuweisung`;
    }

    function addVehicleAssignmentPageButtons() {
        const container = document.querySelector(".vehicles-education-filter-box");
        if (!container) return;
        const group = document.createElement("div");
        group.className = "btn-group";
        group.style.marginLeft = "5px";

        const assignBtn = document.createElement("button");
        assignBtn.className = "btn btn-success";
        assignBtn.innerHTML = '<span class="glyphicon glyphicon-ok"></span>';
        assignBtn.title = `Personal optimal zuweisen (${assignHotkey.toUpperCase()})`;
        assignBtn.addEventListener("click", () => assignVehicleLogic());

        const resetBtn = document.createElement("button");
        resetBtn.className = "btn btn-danger";
        resetBtn.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';
        resetBtn.title = `Personal entfernen (${resetHotkey.toUpperCase()})`;
        resetBtn.addEventListener("click", () => reset());

        const startAutoBtn = document.createElement("button");
        startAutoBtn.id = localStoragePrefix + "start-auto-btn";
        startAutoBtn.className = "btn btn-info";
        startAutoBtn.innerText = `Auto-Modus Start (${autoAssignHotkey.toUpperCase()})`;
        startAutoBtn.title = `Auto-Modus für diese Wache von hier starten (${autoAssignHotkey.toUpperCase()})`;
        startAutoBtn.addEventListener("click", async () => {
            const vehicleData = await getVehicleData(currentVehicleId);
            if (vehicleData?.building_id) {
                autoRunState.pendingStartFromVehiclePage = true;
                autoRunState.initialVehicleId = currentVehicleId;
                autoRunState.originBuildingId = vehicleData.building_id;
                saveAutoRunState();
                debugLog("🟢 Auto-Zuweisung von Fahrzeugseite angefordert. Leite zur Wache um.");
                window.location.href = `/buildings/${vehicleData.building_id}`;
            }
        });

        const stopAutoBtn = document.createElement("button");
        stopAutoBtn.id = localStoragePrefix + "stop-auto-btn";
        stopAutoBtn.className = "btn btn-warning";
        stopAutoBtn.innerText = "Auto-Modus Beenden";
        stopAutoBtn.addEventListener("click", () => {
            resetAutoRunState();
            updateVehicleAssignmentPageButtons(false);
        });

        group.append(assignBtn, resetBtn, startAutoBtn, stopAutoBtn);
        container.appendChild(group);
        updateVehicleAssignmentPageButtons(autoRunState.active || autoRunState.pendingStartFromVehiclePage);

        document.addEventListener("keydown", async e => {
            if (document.activeElement?.tagName.match(/INPUT|TEXTAREA/)) return;
            const key = e.key.toLowerCase();
            if (key === assignHotkey) { e.preventDefault(); assignVehicleLogic(); }
            else if (key === resetHotkey) { e.preventDefault(); await reset(); }
            else if (key === autoAssignHotkey && !startAutoBtn.disabled) { e.preventDefault(); startAutoBtn.click(); }
            else if (key === nextVehicleHotkey && !autoRunState.active) { e.preventDefault(); document.querySelectorAll(".btn-group.pull-right a")[1]?.click(); }
            else if (key === previousVehicleHotkey && !autoRunState.active) { e.preventDefault(); document.querySelectorAll(".btn-group.pull-right a")[0]?.click(); }
        });
    }

    function updateVehicleAssignmentPageButtons(isAutoActiveOrPending) {
        const startAutoBtn = document.getElementById(localStoragePrefix + "start-auto-btn");
        const stopAutoBtn = document.getElementById(localStoragePrefix + "stop-auto-btn");
        if (startAutoBtn && stopAutoBtn) {
            startAutoBtn.style.display = isAutoActiveOrPending ? "none" : "";
            stopAutoBtn.style.display = isAutoActiveOrPending ? "" : "none";
        }
    }

    function addBuildingOverviewPageButton() {
        let targetElement = document.querySelector("#building_vehicles .panel-heading") || document.querySelector(".tab-content #tabs-vehicle") || document.querySelector(".tab-content");
        if (!targetElement) return;

        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group";
        btnGroup.style.marginBottom = "10px";
        btnGroup.style.marginRight = "5px";

        const startBuildingAutoBtn = document.createElement("button");
        startBuildingAutoBtn.className = "btn btn-success";
        startBuildingAutoBtn.id = localStoragePrefix + "start-building-auto-btn";
        startBuildingAutoBtn.addEventListener("click", () => startAutoAssignForBuilding(false));

        const startVisibleAutoBtn = document.createElement("button");
        startVisibleAutoBtn.className = "btn btn-info";
        startVisibleAutoBtn.id = localStoragePrefix + "start-visible-auto-btn";
        startVisibleAutoBtn.addEventListener("click", () => startAutoAssignForVisible(false));
        startVisibleAutoBtn.style.marginLeft = "5px";

        const startUnassignBtn = document.createElement("button");
        startUnassignBtn.className = "btn btn-danger";
        startUnassignBtn.id = localStoragePrefix + "start-unassign-btn";
        startUnassignBtn.addEventListener("click", () => startAutoAssignForVisible(true));
        startUnassignBtn.style.marginLeft = "5px";

        btnGroup.append(startBuildingAutoBtn, startVisibleAutoBtn, startUnassignBtn);
        targetElement.prepend(btnGroup);

        updateBuildingStartButtonState();
    }

    function updateBuildingStartButtonState() {
        const allBtn = document.getElementById(localStoragePrefix + "start-building-auto-btn");
        const visibleBtn = document.getElementById(localStoragePrefix + "start-visible-auto-btn");
        const unassignBtn = document.getElementById(localStoragePrefix + "start-unassign-btn");
        if (!allBtn || !visibleBtn || !unassignBtn) return;

        const isPending = localStorage.getItem(pendingAutoModeStartKey) === String(currentBuildingId);
        const isActive = autoRunState.active && autoRunState.originBuildingId === String(currentBuildingId);

        if (isPending || isActive) {
            const modeText = autoRunState.mode === 'unassign' ? "Aufheben" : "Zuweisen";
            allBtn.innerText = `${modeText} läuft... [${autoRunState.processedVehicles}/${autoRunState.totalVehicles}]`;
            allBtn.disabled = true;
            allBtn.classList.replace('btn-success', 'btn-warning');
            visibleBtn.style.display = 'none';
            unassignBtn.style.display = 'none';
        } else {
            allBtn.innerText = `Zuweisen (alle) (${buildingStartAutoHotkey.toUpperCase()})`;
            allBtn.disabled = false;
            allBtn.classList.replace('btn-warning', 'btn-success');

            visibleBtn.innerText = `Zuweisen (sichtb.) (${buildingStartVisibleAutoHotkey.toUpperCase()})`;
            visibleBtn.disabled = false;
            visibleBtn.style.display = '';

            unassignBtn.innerText = `Aufheben (sichtb.) (${buildingStartUnassignVisibleHotkey.toUpperCase()})`;
            unassignBtn.disabled = false;
            unassignBtn.style.display = '';
        }
    }

    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fleet-config-id-display { margin-left: 5px; padding: 3px 6px; border: 1px solid #ccc; cursor: pointer; display: inline-block; vertical-align: middle; font-size: 12px; border-radius: 3px; background-color: #f7f7f7; color: black; }
            .selected-fleet-config-id { border: 2px solid green !important; font-weight: bold; background-color: #e6ffe6 !important; }`;
        document.head.appendChild(style);
    }

    function enhanceFleetConfigurationButtons() {
        const buttons = document.querySelectorAll("a.btn.btn-default.btn-xs[vehicle-fleet-configuration-id]");
        buttons.forEach(button => {
            const configId = button.getAttribute("vehicle-fleet-configuration-id");
            if (button.nextElementSibling?.classList.contains("fleet-config-id-display")) return;

            const idDisplay = document.createElement("span");
            idDisplay.textContent = button.textContent.trim();
            idDisplay.title = `Konfiguration '${button.textContent.trim()}' (ID: ${configId}) auswählen`;
            idDisplay.className = "fleet-config-id-display";
            if (configId === currentSelectedFleetConfigId) {
                idDisplay.classList.add("selected-fleet-config-id");
            }
            idDisplay.addEventListener("click", function() {
                document.querySelectorAll(".selected-fleet-config-id").forEach(el => el.classList.remove("selected-fleet-config-id"));
                this.classList.add("selected-fleet-config-id");
                currentSelectedFleetConfigId = configId;
                localStorage.setItem(fleetConfigIdStorageKey, configId);
            });
            button.insertAdjacentElement('afterend', idDisplay);
        });
    }

    function addBuildingPageHotkeys() {
        document.addEventListener("keydown", async e => {
            if (document.activeElement?.tagName.match(/INPUT|TEXTAREA/)) return;
            const key = e.key.toLowerCase();

            if (key === triggerPlanAndAutoAssignHotkey) {
                e.preventDefault();
                const buttonToClick = document.querySelector(`a.btn[vehicle-fleet-configuration-id="${currentSelectedFleetConfigId}"]`);
                if (buttonToClick) {
                    localStorage.setItem(pendingAutoModeStartKey, currentBuildingId);
                    updateBuildingStartButtonState();
                    buttonToClick.click();
                }
            } else if (key === buildingStartAutoHotkey) {
                e.preventDefault();
                document.getElementById(localStoragePrefix + "start-building-auto-btn")?.click();
            } else if (key === buildingStartVisibleAutoHotkey) {
                e.preventDefault();
                document.getElementById(localStoragePrefix + "start-visible-auto-btn")?.click();
            } else if (key === buildingStartUnassignVisibleHotkey) {
                e.preventDefault();
                document.getElementById(localStoragePrefix + "start-unassign-btn")?.click();
            } else if (key === applyFleetConfigHotkey) {
                e.preventDefault();
                document.querySelector(`a.btn[vehicle-fleet-configuration-id="${currentSelectedFleetConfigId}"]`)?.click();
            } else if (key === buildingNextHotkey || key === buildingPreviousHotkey) {
                if (autoRunState.active || localStorage.getItem(pendingAutoModeStartKey)) return;
                e.preventDefault();
                const selector = key === buildingNextHotkey ? "Nächstes Gebäude" : "Vorheriges Gebäude";
                document.evaluate(`//a[contains(text(),'${selector}')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.click();
            }
        });
    }

    function saveSequenceState(state) {
        if (state) localStorage.setItem(sequenceStateKey, JSON.stringify(state));
        else localStorage.removeItem(sequenceStateKey);
    }

    function getSequenceState() {
        const state = localStorage.getItem(sequenceStateKey);
        return state ? JSON.parse(state) : null;
    }

    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                resolve(null);
            }, timeout);
        });
    }

    async function startCombinedSequence() {
        const levelInput = document.getElementById('lss-expand-level-input');
        const targetLevel = parseInt(levelInput?.value, 10);
        if (!levelInput || isNaN(targetLevel) || targetLevel < 1) {
            alert('Bitte ein gültiges Ziel-Level für den Ausbau angeben.');
            return;
        }

        if (!currentSelectedFleetConfigId) {
            alert('Bitte zuerst einen Wachenbauplan auswählen (auf die ID neben dem Plan klicken).');
            return;
        }

        const currentLevel = getCurrentBuildingLevel();
        if (currentLevel !== -1 && targetLevel <= currentLevel) {
            saveSequenceState({
                active: true,
                step: "apply_fleet_config",
                buildingId: currentBuildingId,
                targetLevel: targetLevel,
                fleetConfigId: currentSelectedFleetConfigId
            });

            window.location.reload();
            return;
        }

        const expandButton = document.querySelector('a.btn[href*="/expand"]');
        if (!expandButton) {
            alert("Konnte den 'Ausbauen'-Button nicht finden.");
            return;
        }

        saveSequenceState({
            active: true,
            step: "start_expansion",
            buildingId: currentBuildingId,
            targetLevel: targetLevel,
            fleetConfigId: currentSelectedFleetConfigId
        });

        expandButton.click();
    }

    function executeExpansionRedirect() {
        const state = getSequenceState();
        if (!state?.active) return;

        const levelToSend = state.targetLevel - 1;
        const finalUrl = `/buildings/${state.buildingId}/expand_do/credits?level=${levelToSend}`;

        state.step = "apply_fleet_config";
        saveSequenceState(state);
        window.location.href = finalUrl;
    }

    async function handleSequenceController() {
        const state = getSequenceState();
        if (!state?.active || state.buildingId !== currentBuildingId) {
            if (state) saveSequenceState(null);
            return;
        }

        if (isBuildingExpansionPage && state.step === "start_expansion") {
            executeExpansionRedirect();

        } else if (isBuildingOverviewPage && state.step === "apply_fleet_config") {
            const fleetButtonSelector = `a.btn[vehicle-fleet-configuration-id="${state.fleetConfigId}"]`;
            const fleetButton = await waitForElement(fleetButtonSelector);

            if (fleetButton) {
                state.step = "start_personnel_assignment";
                saveSequenceState(state);
                fleetButton.click();
            } else {
                alert("Sequenz abgebrochen: Der Button für den ausgewählten Wachenbauplan konnte nicht gefunden werden.");
                saveSequenceState(null);
            }

        } else if (isBuildingOverviewPage && state.step === "start_personnel_assignment") {
            saveSequenceState(null);
            await startAutoAssignForBuilding(false);
        }
    }

    function getCurrentBuildingLevel() {
        const dt = Array.from(document.querySelectorAll('dt')).find(d => d.textContent.includes('Stufe:'));
        const level = dt ? parseInt(dt.nextElementSibling.textContent, 10) : -1;
        return isNaN(level) ? -1 : level;
    }

    function addCombinedSequenceUI() {
        const expandButton = document.querySelector('a.btn[href*="/expand"]');
        if (!expandButton || document.getElementById('lss-sequence-start-button')) return;

        const storageKeyLevel = localStoragePrefix + "expandTargetLevel";

        const container = document.createElement('span');
        container.style.marginLeft = '10px';
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.verticalAlign = 'middle';

        const levelInput = document.createElement('input');
        levelInput.type = 'number';
        levelInput.min = '1';
        levelInput.id = 'lss-expand-level-input';
        levelInput.placeholder = 'Lvl';
        levelInput.value = localStorage.getItem(storageKeyLevel) || '10';
        levelInput.style.cssText = "width:55px; height:22px; margin-right:5px; text-align:center; border:1px solid #ccc; border-radius:3px;";
        levelInput.title = "Ziel-Level für den Ausbau (Mausrad zum Ändern)";

        const saveLevel = () => {
            const level = levelInput.value;
            if (parseInt(level, 10) > 0 || level === "") {
                localStorage.setItem(storageKeyLevel, level);
            }
        };

        levelInput.addEventListener('wheel', e => {
            e.preventDefault();
            let val = parseInt(levelInput.value, 10) || 0;
            val += (e.deltaY < 0) ? 1 : -1;
            levelInput.value = Math.max(1, val);
            saveLevel();
        });

        levelInput.addEventListener('input', saveLevel);

        const startButton = document.createElement('a');
        startButton.id = 'lss-sequence-start-button';
        startButton.className = 'btn btn-primary btn-xs';
        startButton.innerHTML = `[+] -> Plan -> Personal (${combinedSequenceHotkey.toUpperCase()})`;
        startButton.title = `Kombinierte Sequenz: Ausbauen, dann Wachenbauplan, dann Personal zuweisen. Hotkey: ${combinedSequenceHotkey}`;
        startButton.addEventListener('click', e => { e.preventDefault(); startCombinedSequence(); });

        container.appendChild(levelInput);
        container.appendChild(startButton);
        expandButton.parentNode.insertBefore(container, expandButton.nextSibling);

        document.addEventListener('keydown', e => {
            if (e.target.tagName.match(/INPUT|TEXTAREA/)) return;
            if (e.key.toLowerCase() === combinedSequenceHotkey) {
                e.preventDefault();
                startCombinedSequence();
            }
        });
    }

    async function main() {
        addCustomStyles();
        displayPersistentDebugLog();
        await initVehiclesConfiguration();

        if (isVehicleAssignmentPage) {
            addVehicleAssignmentPageButtons();
            if (autoRunState.active) {
                if (autoRunState.mode === 'unassign') {
                    await unassignVehicleLogic();
                } else {
                    await assignVehicleLogic();
                }
            }
        } else if (isBuildingOverviewPage) {
            await handleSequenceController();

            addBuildingOverviewPageButton();
            addCombinedSequenceUI();
            addBuildingPageHotkeys();

            new MutationObserver((_, observer) => {
                if (document.querySelector("a.btn.btn-default.btn-xs[vehicle-fleet-configuration-id]")) {
                    enhanceFleetConfigurationButtons();
                    observer.disconnect();
                }
            }).observe(document.body, { childList: true, subtree: true });

            const pendingBuildingId = localStorage.getItem(pendingAutoModeStartKey);
            if (pendingBuildingId === String(currentBuildingId)) {
                localStorage.removeItem(pendingAutoModeStartKey);
                await startAutoAssignForBuilding(false);
            } else if (autoRunState.pendingStartFromVehiclePage && String(autoRunState.originBuildingId) === String(currentBuildingId)) {
                await startAutoAssignForBuilding(false);
            } else if (autoRunState.active && autoRunState.originBuildingId === String(currentBuildingId) && autoRunState.vehicleQueue.length === 0) {
                 resetAutoRunState();
                 updateBuildingStartButtonState();
            } else if (autoRunState.active && autoRunState.originBuildingId !== String(currentBuildingId)) {
                 resetAutoRunState();
            }
            updateBuildingStartButtonState();

        } else if (isBuildingExpansionPage) {
            await handleSequenceController();
        }
    }

    async function reset() {
        const buttons = document.querySelectorAll(".btn-assigned.btn.btn-default");
        for (let i = buttons.length - 1; i >= 0; i--) {
            buttons[i].click();
            await new Promise(r => setTimeout(r, 250));
        }
    }

    main();
})();