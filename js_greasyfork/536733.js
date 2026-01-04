// ==UserScript==
// @name          Personalzuweiser auto-mod
// @namespace     personalzuweiser.leitstellenspiel.de
// @version       4.3
// @license       BSD-3-Clause
// @author        BOS-Ernie, Masklin, BAHendrik (modifiziert und fusioniert durch KI)
// @description   Speichert Ausbau-Level, weist Personal zu, startet kombinierte Sequenzen (auch nur für neue Fzg.) & Zuweisungen im Loop, Debugging, Hotkeys.
// @match         https://*.leitstellenspiel.de/vehicles/*/zuweisung
// @match         https://*.leitstellenspiel.de/buildings/*
// @run-at        document-idle
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/536733/Personalzuweiser%20auto-mod.user.js
// @updateURL https://update.greasyfork.org/scripts/536733/Personalzuweiser%20auto-mod.meta.js
// ==/UserScript==

/* global $, I18n */

(async function () {
    // ### GRUNDEINSTELLUNGEN ###
    const assignHotkey = "s";
    const resetHotkey = "x";
    const autoAssignHotkey = "z";
    const nextVehicleHotkey = "d";
    const previousVehicleHotkey = "a";

    const buildingNextHotkey = "d";
    const buildingPreviousHotkey = "a";
    const buildingStartAutoHotkey = "s";
    const applyFleetConfigHotkey = "w";
    const triggerPlanAndAutoAssignHotkey = "x";
    const combinedSequenceHotkey = "y";

    const skipVehiclesWithNoSpecialTraining = true;
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
    const pendingNewOnlyAssignKey = localStoragePrefix + "pendingNewOnlyAssignKey";
    const sequenceStateKey = localStoragePrefix + "sequence.state";
    const superLoopStateKey = localStoragePrefix + "superLoop.state";
    const assignmentLoopStateKey = localStoragePrefix + "assignmentLoop.state";
    const loopAssignNewOnlyKey = localStoragePrefix + "loopAssignNewOnly";

    let currentSelectedFleetConfigId = localStorage.getItem(fleetConfigIdStorageKey) || null;

    let autoRunState = JSON.parse(localStorage.getItem(autoRunStateKey)) || {
        active: false, vehicleQueue: [], originBuildingId: null,
        lastProcessedVehicleId: null, pendingStartFromVehiclePage: false, initialVehicleId: null, finished: false
    };

    const isVehicleAssignmentPage = window.location.pathname.includes("/vehicles/") && window.location.pathname.includes("/zuweisung");
    const isBuildingOverviewPage = window.location.pathname.includes("/buildings/") && !window.location.pathname.includes("/expand");
    const isBuildingExpansionPage = window.location.pathname.includes("/expand");
    const currentVehicleId = isVehicleAssignmentPage ? window.location.pathname.split("/")[2] : null;
    const currentBuildingId = (isBuildingOverviewPage || isBuildingExpansionPage) ? window.location.pathname.split("/")[2] : null;

    let vehiclesConfiguration = [];

    const vehiclesConfigurationOverride = [
        { id: 171, caption: "GW TeSi", maxStaff: 5, training: [ { key: "disaster_response_technology", number: 5, } ], },
        { id: 172, caption: "LKW Technik (Notstrom)", maxStaff: 6, training: [ { key: "disaster_response_technology", number: 6, } ], },
        { id: 173, caption: "MTW TeSi", maxStaff: 7, training: [ { key: "disaster_response_technology", number: 7, } ], },
        { id: 134, caption: "Pferdetransporter klein", maxStaff: 4, training: [ { key: "police_horse", number: 4, } ], },
        { id: 135, caption: "Pferdetransporter groß", maxStaff: 2, training: [ { key: "police_horse", number: 2, } ], },
        { id: 137, caption: "Zugfahrzeug Pferdetransport", maxStaff: 6, training: [ { key: "police_horse", number: 6, } ], },
        { id: 29, caption: "NEF", maxStaff: 1, training: [ { key: "notarzt", number: 1, } ], },
        { id: 122, caption: "LKW 7 Lbw (FGr E)", maxStaff: 2, training: [ {key: "thw_energy_supply", number: 2,} ], },
        { id: 123, caption: "LKW 7 Lbw (FGr WP)", maxStaff: 3, training: [ {key: "water_damage_pump", number: 3, } ], },
        { id: 93, caption: "MTW-O", maxStaff: 5, training: [ {key: "thw_rescue_dogs", number: 5, } ], },
        { id: 81, caption: "MEK - ZF", maxStaff: 3, training: [ {key: "police_mek", number: 3, } ], },
        { id: 79, caption: "SEK - ZF", maxStaff: 3, training: [ {key: "police_sek", number: 3, } ], },
        { id: 51, caption: "FüKW (Polizei)", maxStaff: 2, training: [ {key: "police_fukw", number: 2, } ], },
        { id: 53, caption: "Dekon-P", maxStaff: 6, training: [ {key: "dekon_p", number: 6, } ], },
        { id: 32, caption: "FuStW", maxStaff: 1, training: [] },
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
            lastProcessedVehicleId: null, pendingStartFromVehiclePage: false, initialVehicleId: null, finished: false
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
        return Array.from(document.querySelectorAll("#zuweisung_table tbody tr.success")).filter(row => {
            const filters = row.getAttribute("data-filterable-by").replace(/[\[\]"]/g, "").split(",").map(x => x.trim());
            if (key === null) {
                return filters.length === 1 && filters[0] === "";
            }
            return filters.includes(key);
        }).length;
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
            getAssignedPersonsElement().innerText = (parseInt(getAssignedPersonsElement().innerText) + 1).toString();
            assigned++;
            await new Promise(r => setTimeout(r, 50));
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
        debugLog("navigateToNextVehicleInQueue: Start.");
        if (autoRunState.vehicleQueue.length > 0) {
            const nextVehicleId = autoRunState.vehicleQueue[0];
            debugLog(`➡️ Navigiere zum nächsten Fahrzeug in der Warteschlange: ${nextVehicleId}`);
            window.location.href = `/vehicles/${nextVehicleId}/zuweisung`;
        } else {
            debugLog("🏁 Alle Fahrzeuge in der Warteschlange abgearbeitet.");
            const originBuildingId = autoRunState.originBuildingId;
            autoRunState.active = false;
            autoRunState.finished = true;
            saveAutoRunState();

            if (originBuildingId) {
                debugLog(`↩️ Springe zurück zur Wache ${originBuildingId}.`);
                window.location.href = `/buildings/${originBuildingId}`;
            } else {
                debugLog("Keine Ursprungs-Wache gefunden. Breche ab.");
                resetAutoRunState();
            }
        }
    }

    async function assignVehicleLogic() {
        debugLog(`Debug: Starte assignVehicleLogic für Fahrzeug ${currentVehicleId}.`);

        if (autoRunState.active && autoRunState.vehicleQueue.length > 0) {
            const expectedVehicleId = String(autoRunState.vehicleQueue[0]);
            if (String(currentVehicleId) === expectedVehicleId) {
                autoRunState.vehicleQueue.shift();
                autoRunState.lastProcessedVehicleId = currentVehicleId;
                saveAutoRunState();
            } else {
                debugLog(`assignVehicleLogic: Auto-Modus aktiv, aber Fahrzeug ${currentVehicleId} ist nicht das erwartete (${expectedVehicleId}). Auto-Modus wird beendet.`);
                resetAutoRunState();
                updateVehicleAssignmentPageButtons(false);
                return;
            }
        } else if (autoRunState.active) {
            await navigateToNextVehicleInQueue();
            return;
        }

        const vehicleData = await getVehicleData(currentVehicleId);
        if (!vehicleData) {
            debugLog(`Fahrzeug ${currentVehicleId}: Konnte Fahrzeugdaten nicht abrufen. Abbruch und Navigation zum nächsten.`);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
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

        const assignedPersonsElement = getAssignedPersonsElement();
        if (!assignedPersonsElement && config.maxStaff > 0) {
            debugLog(`WARNUNG: Element 'count_personal' nicht gefunden für Fahrzeug ${currentVehicleId}, obwohl es Personal benötigt. Überspringe.`);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        let currentAssignedCount = assignedPersonsElement ? parseInt(assignedPersonsElement.innerText) || 0 : 0;
        const capacity = config.maxStaff;
        const initialFmsStatus = vehicleData.fms_real;

        if (currentAssignedCount > capacity) {
            debugLog(`⚠️ Fahrzeug ${currentVehicleId} ist überbesetzt (${currentAssignedCount}/${capacity}). Alle werden entzuordnet.`);
            await reset();
            currentAssignedCount = 0;
        }

        if (capacity === 0) {
            debugLog(`ℹ️ Fahrzeugtyp '${config.caption}' benötigt kein Personal. Überspringe Zuweisung.`);
            if (initialFmsStatus === 6 || forceStatus2OnFull) await setVehicleStatus(currentVehicleId, 2);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        if (currentAssignedCount >= capacity) {
            debugLog(`ℹ️ Fahrzeug '${config.caption}' ist bereits voll besetzt (${currentAssignedCount}/${capacity}). Überspringe.`);
            if (initialFmsStatus === 6 || forceStatus2OnFull) await setVehicleStatus(currentVehicleId, 2);
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        if (skipVehiclesWithNoSpecialTraining && (!config.training || config.training.length === 0)) {
            debugLog(`ℹ️ Fahrzeugtyp '${config.caption}' benötigt kein Spezialpersonal und wird übersprungen.`);
             if (currentAssignedCount === capacity && (initialFmsStatus === 6 || forceStatus2OnFull)) {
                 await setVehicleStatus(currentVehicleId, 2);
             }
            if (autoRunState.active) await navigateToNextVehicleInQueue();
            return;
        }

        if (config.training?.length > 0) {
            for (const t of config.training) {
                const stillNeededOfType = t.number - getAssignedWithTraining(t.key);
                if (stillNeededOfType > 0) {
                    debugLog(`   Versuche ${stillNeededOfType}x ${t.key} zuzuweisen.`);
                    const assignedCount = await assignPersonnel(t.key, stillNeededOfType);
                    debugLog(assignedCount > 0 ? `   ✅ ${assignedCount}x ${t.key} zugewiesen.` : `   ❌ Keine ${t.key} verfügbar.`);
                }
            }
        }

        const updatedAssignedTotalCount = parseInt(getAssignedPersonsElement()?.innerText || '0');
        const remainingOverallCapacity = capacity - updatedAssignedTotalCount;
        if (remainingOverallCapacity > 0) {
            debugLog(`   Fülle ${remainingOverallCapacity} weitere Plätze mit allgemeinem Personal.`);
            await assignPersonnel(null, remainingOverallCapacity);
        }

        const finalAssignedCount = parseInt(getAssignedPersonsElement()?.innerText || '0');
        if (finalAssignedCount < capacity) {
            debugLog(`⚠️ Fahrzeug ${currentVehicleId} nach Zuweisung nicht voll (${finalAssignedCount}/${capacity}). Setze auf Status 6.`);
            await setVehicleStatus(currentVehicleId, 6);
        } else {
            debugLog(`✅ Fahrzeug ${currentVehicleId} ist nun VOLL besetzt.`);
            if (initialFmsStatus === 6 || forceStatus2OnFull) {
                await setVehicleStatus(currentVehicleId, 2);
            }
        }

        if (autoRunState.active) {
            await navigateToNextVehicleInQueue();
        } else {
            debugLog("assignVehicleLogic abgeschlossen. Auto-Modus nicht aktiv.");
        }
    }

    async function startAutoAssignForBuilding(newOnly = false) {
        const mode = newOnly ? 'Nur neue Fahrzeuge' : 'Alle Fahrzeuge';
        debugLog(`🚀 Starte Auto-Zuweisung für Wache ${currentBuildingId} (Modus: ${mode})`);

        let allVehicleLinks = Array.from(document.querySelectorAll("#building_vehicles a[href*='/vehicles/'], .tab-content a[href*='/vehicles/']"))
                                 .map(a => a.href.match(/\/vehicles\/(\d+)/)?.[1])
                                 .filter((id, index, self) => id && self.indexOf(id) === index);

        let vehicleQueue = allVehicleLinks;

        if (newOnly) {
            const oldVehicleIdsKey = localStoragePrefix + "oldVehicleIds";
            const oldVehicleIds = JSON.parse(localStorage.getItem(oldVehicleIdsKey)) || [];
            localStorage.removeItem(oldVehicleIdsKey);

            vehicleQueue = allVehicleLinks.filter(id => !oldVehicleIds.includes(id));
            debugLog(`Filter aktiv. Alte Fzg.: ${oldVehicleIds.length}, Aktuelle Fzg.: ${allVehicleLinks.length}, Neue Fzg. zum Zuweisen: ${vehicleQueue.length}`);

            if (vehicleQueue.length === 0) {
                alert("Keine *neuen* Fahrzeuge nach Anwendung des Bauplans gefunden. Zuweisung wird nicht gestartet.");
                debugLog("Keine neuen Fahrzeuge gefunden. Breche ab.");
                resetAutoRunState();
                return;
            }
        }

        if (vehicleQueue.length === 0) {
            alert("Keine zuweisbaren Fahrzeuge auf dieser Wache gefunden.");
            debugLog("Keine Fahrzeuge für Zuweisung gefunden.");
            resetAutoRunState();
            return;
        }

        autoRunState.active = true;
        autoRunState.vehicleQueue = vehicleQueue;
        autoRunState.originBuildingId = currentBuildingId;
        autoRunState.finished = false;
        saveAutoRunState();

        debugLog(`Zuweisungs-Warteschlange: ${autoRunState.vehicleQueue.length} Fahrzeuge. Starte Navigation.`);
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
            } else {
                 debugLog("Konnte Gebäude-ID nicht ermitteln. Auto-Modus kann nicht gestartet werden.");
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
            if (key === assignHotkey) { e.preventDefault(); await assignVehicleLogic(); }
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
        if (!targetElement) {
             debugLog("Kein passendes Ziel-Element für Wachen-Button gefunden.");
             return;
        }

        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group";
        btnGroup.style.marginBottom = "10px";
        btnGroup.style.marginRight = "5px";
        btnGroup.style.display = "inline-block";

        const startBuildingAutoBtn = document.createElement("button");
        startBuildingAutoBtn.className = "btn btn-success";
        startBuildingAutoBtn.id = localStoragePrefix + "start-building-auto-btn";
        startBuildingAutoBtn.addEventListener("click", () => startAutoAssignForBuilding(false));

        btnGroup.appendChild(startBuildingAutoBtn);
        targetElement.prepend(btnGroup);

        updateBuildingStartButtonState();
    }

    function updateBuildingStartButtonState() {
        const btn = document.getElementById(localStoragePrefix + "start-building-auto-btn");
        if (!btn) return;

        const isPending = localStorage.getItem(pendingAutoModeStartKey) === String(currentBuildingId) || localStorage.getItem(pendingNewOnlyAssignKey) === String(currentBuildingId);
        const isActive = autoRunState.active && autoRunState.originBuildingId === String(currentBuildingId);

        if (isPending || isActive) {
            btn.innerText = "Auto-Modus läuft...";
            btn.disabled = true;
            btn.classList.replace('btn-success', 'btn-warning');
        } else {
            btn.innerText = `Auto-Modus Wache (${buildingStartAutoHotkey.toUpperCase()})`;
            btn.disabled = false;
            btn.classList.replace('btn-warning', 'btn-success');
        }
    }

    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fleet-config-id-display { margin-left: 5px; padding: 3px 6px; border: 1px solid #ccc; cursor: pointer; display: inline-block; vertical-align: middle; font-size: 12px; border-radius: 3px; background-color: #f7f7f7; color: black; }
            .selected-fleet-config-id { border: 2px solid green !important; font-weight: bold; background-color: #e6ffe6 !important; }
            /* ÜBERARBEITET: CSS für den Toggle-Schalter */
            .lss-toggle-switch-container { display: inline-flex; align-items: center; margin-left: 8px; vertical-align: middle; }
            .lss-toggle-switch { position: relative; display: inline-block; width: 50px; height: 24px; }
            .lss-toggle-switch input { opacity: 0; width: 0; height: 0; }
            .lss-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ca2121; -webkit-transition: .4s; transition: .4s; border-radius: 24px; }
            .lss-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; -webkit-transition: .4s; transition: .4s; border-radius: 50%; }
            .lss-toggle-switch input:checked + .lss-slider { background-color: #28a745; }
            .lss-toggle-switch input:checked + .lss-slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); }
            /* NEU: CSS für die Beschriftung neben dem Schalter */
            .lss-toggle-label-text { font-size: 12px; font-weight: bold; margin: 0 8px; transition: color 0.4s; user-select: none; }
            .lss-toggle-label-text.inactive { color: #aaa; font-weight: normal; }
        `;
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
                debugLog(`Ausgewählte Flottenkonfiguration: "${this.textContent}" (ID: ${configId})`);
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
                    debugLog(`Hotkey '${key}': Löse Wachenbauplan aus und plane Auto-Modus.`);
                    const assignNewOnly = JSON.parse(localStorage.getItem(loopAssignNewOnlyKey)) || false;
                    if (assignNewOnly) {
                        const oldVehicleIds = Array.from(document.querySelectorAll("#building_vehicles a[href*='/vehicles/'], .tab-content a[href*='/vehicles/']"))
                                                 .map(a => a.href.match(/\/vehicles\/(\d+)/)?.[1])
                                                 .filter((id, index, self) => id && self.indexOf(id) === index);
                        localStorage.setItem(localStoragePrefix + "oldVehicleIds", JSON.stringify(oldVehicleIds));
                        localStorage.setItem(pendingNewOnlyAssignKey, currentBuildingId);
                    } else {
                        localStorage.setItem(pendingAutoModeStartKey, currentBuildingId);
                    }
                    updateBuildingStartButtonState();
                    buttonToClick.click();
                } else {
                     debugLog(`Hotkey '${key}': Keine Flottenkonfiguration ausgewählt.`);
                }
            } else if (key === buildingStartAutoHotkey) {
                e.preventDefault();
                document.getElementById(localStoragePrefix + "start-building-auto-btn")?.click();
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

    function saveSuperLoopState(state) {
        if (state) localStorage.setItem(superLoopStateKey, JSON.stringify(state));
        else localStorage.removeItem(superLoopStateKey);
    }

    function getSuperLoopState() {
        const state = localStorage.getItem(superLoopStateKey);
        return state ? JSON.parse(state) : null;
    }

    function saveAssignmentLoopState(state) {
        if (state) localStorage.setItem(assignmentLoopStateKey, JSON.stringify(state));
        else localStorage.removeItem(assignmentLoopStateKey);
    }

    function getAssignmentLoopState() {
        const state = localStorage.getItem(assignmentLoopStateKey);
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
        debugLog("🎬 [SEQUENZ] Starte kombinierte Sequenz (Ausbau -> Bauplan -> Personal).");

        const expandButton = document.querySelector('a.btn[href*="/expand"]');
        const levelInput = document.getElementById('lss-expand-level-input');
        const targetLevel = levelInput ? parseInt(levelInput.value, 10) : 0;
        const assignNewOnly = JSON.parse(localStorage.getItem(loopAssignNewOnlyKey)) || false;
        debugLog(`[SEQUENZ] Modus 'Nur neue Zuweisen' ist ${assignNewOnly ? 'AKTIV' : 'INAKTIV'}.`);

        if (!currentSelectedFleetConfigId) {
            alert('Bitte zuerst einen Wachenbauplan auswählen (auf die ID neben dem Plan klicken).');
            debugLog("❌ [SEQUENZ] Abbruch: Kein Wachenbauplan ausgewählt.");
            saveSuperLoopState(null);
            return;
        }

        const currentLevel = getCurrentBuildingLevel();
        const shouldExpand = expandButton && levelInput && !isNaN(targetLevel) && targetLevel > currentLevel;

        if (assignNewOnly) {
             const oldVehicleIds = Array.from(document.querySelectorAll("#building_vehicles a[href*='/vehicles/'], .tab-content a[href*='/vehicles/']"))
                                     .map(a => a.href.match(/\/vehicles\/(\d+)/)?.[1])
                                     .filter((id, index, self) => id && self.indexOf(id) === index);
            localStorage.setItem(localStoragePrefix + "oldVehicleIds", JSON.stringify(oldVehicleIds));
        }

        if (!shouldExpand) {
            debugLog(`ℹ️ [SEQUENZ] Ausbau-Schritt wird übersprungen. Fahre direkt mit Wachenbauplan fort.`);
            saveSequenceState({
                active: true, step: "apply_fleet_config", buildingId: currentBuildingId,
                targetLevel: targetLevel, fleetConfigId: currentSelectedFleetConfigId, newOnly: assignNewOnly
            });
            window.location.reload();
            return;
        }

        debugLog(`💾 [SEQUENZ] Speichere Zustand für Ausbau: Level=${targetLevel}, Plan-ID=${currentSelectedFleetConfigId}, newOnly=${assignNewOnly}, Schritt=start_expansion`);
        saveSequenceState({
            active: true, step: "start_expansion", buildingId: currentBuildingId,
            targetLevel: targetLevel, fleetConfigId: currentSelectedFleetConfigId, newOnly: assignNewOnly
        });
        expandButton.click();
    }

    function executeExpansionRedirect() {
        const state = getSequenceState();
        if (!state?.active) return;
        debugLog(`➡️ [SEQUENZ] Schritt 2: Auf /expand Seite. Leite zu Level ${state.targetLevel} weiter.`);
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

        debugLog(`🔄 [SEQUENZ] Controller aktiv auf Seite: ${window.location.pathname}. Aktueller Schritt: ${state.step}`);

        if (isBuildingExpansionPage && state.step === "start_expansion") {
            executeExpansionRedirect();
        } else if (isBuildingOverviewPage && state.step === "apply_fleet_config") {
            debugLog(`➡️ [SEQUENZ] Schritt 3: Warte auf Wachenbauplan-Button (ID: ${state.fleetConfigId}).`);
            const fleetButton = await waitForElement(`a.btn[vehicle-fleet-configuration-id="${state.fleetConfigId}"]`);
            if (fleetButton) {
                debugLog(`✅ [SEQUENZ] Wachenbauplan-Button gefunden. Wende an.`);
                state.step = "start_personnel_assignment";
                saveSequenceState(state);
                fleetButton.click();
            } else {
                debugLog(`❌ [SEQUENZ] FEHLER: Button für Wachenbauplan auch nach Warten nicht gefunden. Breche Sequenz ab.`);
                alert("Sequenz abgebrochen: Der Button für den ausgewählten Wachenbauplan konnte nicht gefunden werden.");
                saveSequenceState(null);
                saveSuperLoopState(null);
            }
        } else if (isBuildingOverviewPage && state.step === "start_personnel_assignment") {
            debugLog("➡️ [SEQUENZ] Schritt 4: Starte Personalzuweisung.");
            saveSequenceState(null);
            await startAutoAssignForBuilding(state.newOnly || false);
        }
    }

    function getCurrentBuildingLevel() {
        const dt = Array.from(document.querySelectorAll('dt')).find(d => d.textContent.includes('Stufe:'));
        const level = dt ? parseInt(dt.nextElementSibling.textContent, 10) : -1;
        return isNaN(level) ? -1 : level;
    }

    function addCombinedSequenceUI() {
        const expandButton = document.querySelector('a.btn[href*="/expand"]');
        const hotkey = combinedSequenceHotkey.toUpperCase();

        if (expandButton) {
            if (document.getElementById('lss-expand-level-input')) return;

            const container = document.createElement('span');
            container.style.marginLeft = '10px';
            container.style.display = 'inline-flex';
            container.style.alignItems = 'center';
            container.style.verticalAlign = 'middle';

            const storageKeyLevel = localStoragePrefix + "expandTargetLevel";
            const levelInput = document.createElement('input');
            levelInput.type = 'number';
            levelInput.min = '1';
            levelInput.id = 'lss-expand-level-input';
            levelInput.placeholder = 'Lvl';
            levelInput.value = localStorage.getItem(storageKeyLevel) || '10';
            levelInput.style.cssText = "width:55px; height:22px; margin-right:5px; text-align:center; border:1px solid #ccc; border-radius:3px;";
            levelInput.title = "Ziel-Level für den Ausbau (Mausrad zum Ändern)";
            levelInput.addEventListener('input', () => localStorage.setItem(storageKeyLevel, levelInput.value));

            const sequenceInfo = document.createElement('span');
            sequenceInfo.textContent = `[+] -> Plan -> Personal (${hotkey})`;
            sequenceInfo.title = `Kombinierte Sequenz: Ausbauen, dann Wachenbauplan, dann Personal zuweisen. Hotkey: ${hotkey}`;
            sequenceInfo.style.cursor = 'pointer';
            sequenceInfo.style.marginLeft = '5px';
            sequenceInfo.addEventListener('click', e => { e.preventDefault(); startCombinedSequence(); });

            container.append(levelInput, sequenceInfo);
            expandButton.parentNode.insertBefore(container, expandButton.nextSibling);
        }

        document.addEventListener('keydown', e => {
            if (e.target.tagName.match(/INPUT|TEXTAREA/)) return;
            if (e.key.toLowerCase() === combinedSequenceHotkey) {
                e.preventDefault();
                startCombinedSequence();
            }
        });
    }

    function addSuperLoopButton() {
        const btnGroup = document.querySelector("#building_vehicles .panel-heading .btn-group, .tab-content .btn-group");
        if (!btnGroup || document.getElementById('lss-super-loop-button')) return;

        const superLoopBtn = document.createElement("button");
        superLoopBtn.id = 'lss-super-loop-button';
        superLoopBtn.style.marginLeft = '5px';

        // ÜBERARBEITET: Toggle-Switch mit externer Beschriftung
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'lss-toggle-switch-container';
        toggleContainer.title = 'Legt fest, ob der Loop Personal für ALLE Fahrzeuge oder NUR für NEUE Fahrzeuge nach dem Bauplan zuweist.';

        const labelLeft = document.createElement('span');
        labelLeft.textContent = 'Alle zuweisen';
        labelLeft.className = 'lss-toggle-label-text';

        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'lss-toggle-switch';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = JSON.parse(localStorage.getItem(loopAssignNewOnlyKey)) || false;

        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'lss-slider';

        const labelRight = document.createElement('span');
        labelRight.textContent = 'Nur neue zuweisen';
        labelRight.className = 'lss-toggle-label-text';

        toggleLabel.append(toggleInput, toggleSlider);
        toggleContainer.append(labelLeft, toggleLabel, labelRight);

        const updateLabelStyles = () => {
            if (toggleInput.checked) { // "Nur neue" ist aktiv
                labelLeft.classList.add('inactive');
                labelRight.classList.remove('inactive');
            } else { // "Alle" ist aktiv
                labelLeft.classList.remove('inactive');
                labelRight.classList.add('inactive');
            }
        };

        toggleInput.addEventListener('change', () => {
            localStorage.setItem(loopAssignNewOnlyKey, toggleInput.checked);
            debugLog(`Zuweisungsmodus für Loop geändert auf: ${toggleInput.checked ? 'Nur neue zuweisen' : 'Alle zuweisen'}`);
            updateLabelStyles();
        });

        updateLabelStyles(); // Initialen Status beim Laden setzen

        const updateButtonAppearance = () => {
            const state = getSuperLoopState();
            if (state?.active) {
                superLoopBtn.className = "btn btn-danger";
                superLoopBtn.innerHTML = `STOPP Loop Y`;
                superLoopBtn.title = "Stoppt die Ausbau/Bauplan/Personal-Sequenz für die nächsten Wachen.";
                toggleInput.disabled = true;
            } else {
                superLoopBtn.className = "btn btn-primary";
                superLoopBtn.innerHTML = `START Loop (Plan, Zuweisung, Nächste)`;
                superLoopBtn.title = `Startet die Ausbau/Bauplan/Personal-Sequenz und wiederholt sie für die nachfolgenden Wachen. Hotkey: Y`;
                toggleInput.disabled = false;
            }
        };

        superLoopBtn.addEventListener('click', () => {
            let state = getSuperLoopState() || { active: false };
            state.active = !state.active;
            saveSuperLoopState(state);
            saveAssignmentLoopState(null);
            updateButtonAppearance();
            if(document.getElementById('lss-assignment-loop-button')) document.getElementById('lss-assignment-loop-button').className = "btn btn-warning";

            if (state.active) {
                debugLog("🔁 Super-Loop vom Benutzer gestartet.");
                startCombinedSequence();
            } else {
                debugLog("🛑 Super-Loop vom Benutzer gestoppt.");
            }
        });

        btnGroup.appendChild(superLoopBtn);
        btnGroup.appendChild(toggleContainer);
        updateButtonAppearance();
    }


    function addAssignmentLoopButton() {
        const btnGroup = document.querySelector("#building_vehicles .panel-heading .btn-group, .tab-content .btn-group");
        if (!btnGroup || document.getElementById('lss-assignment-loop-button')) return;

        const loopBtn = document.createElement("button");
        loopBtn.id = 'lss-assignment-loop-button';
        loopBtn.style.marginLeft = '5px';

        const updateButtonAppearance = () => {
            const state = getAssignmentLoopState();
            if (state?.active) {
                loopBtn.className = "btn btn-danger";
                loopBtn.innerHTML = "STOPP Loop Zuweisung";
                loopBtn.title = "Stoppt die reine Personalzuweisungs-Schleife.";
            } else {
                loopBtn.className = "btn btn-warning";
                loopBtn.innerHTML = "START Loop Zuweisung";
                loopBtn.title = "Startet die reine Personalzuweisung und wiederholt sie für die nachfolgenden Wachen.";
            }
        };

        loopBtn.addEventListener('click', () => {
            let state = getAssignmentLoopState() || { active: false };
            state.active = !state.active;
            saveAssignmentLoopState(state);
            saveSuperLoopState(null);
            updateButtonAppearance();
            if(document.getElementById('lss-super-loop-button')) {
                 const superLoopBtn = document.getElementById('lss-super-loop-button');
                 superLoopBtn.className = "btn btn-primary";
                 // Nächstes Element ist der Container, darin der Schalter
                 superLoopBtn.nextElementSibling.querySelector('input').disabled = false;
            }


            if (state.active) {
                debugLog("🔁 Zuweisungs-Loop vom Benutzer gestartet.");
                startAutoAssignForBuilding(false);
            } else {
                debugLog("🛑 Zuweisungs-Loop vom Benutzer gestoppt.");
            }
        });

        btnGroup.appendChild(loopBtn);
        updateButtonAppearance();
    }

    async function main() {
        addCustomStyles();
        displayPersistentDebugLog();
        await initVehiclesConfiguration();

        if (isVehicleAssignmentPage) {
            addVehicleAssignmentPageButtons();
            if (autoRunState.active) {
                debugLog("🚀 Fortsetze Auto-Zuweisung (Zuweisungsseite)...");
                await assignVehicleLogic();
            }
        } else if (isBuildingOverviewPage) {
            addBuildingOverviewPageButton();
            addSuperLoopButton();
            addAssignmentLoopButton();
            addCombinedSequenceUI();
            addBuildingPageHotkeys();
            new MutationObserver((_, observer) => {
                if (document.querySelector("a.btn.btn-default.btn-xs[vehicle-fleet-configuration-id]")) {
                    enhanceFleetConfigurationButtons();
                    observer.disconnect();
                }
            }).observe(document.body, { childList: true, subtree: true });

            if (autoRunState.finished && String(autoRunState.originBuildingId) === String(currentBuildingId)) {
                debugLog("Rückkehr zur Wache nach Abschluss der Personalzuweisung.");
                const superLoopState = getSuperLoopState();
                const assignmentLoopState = getAssignmentLoopState();
                resetAutoRunState();

                const navigate = (direction) => {
                    const buttonText = direction === 'next' ? 'Nächstes Gebäude' : 'Vorheriges Gebäude';
                    debugLog(`🔁 Loop aktiv: Wechsle zu '${buttonText}'.`);
                    const navButton = document.evaluate(`//a[contains(text(),'${buttonText}')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (navButton) {
                        navButton.click();
                        return true;
                    }
                    debugLog(`🛑 Loop: Konnte '${buttonText}' Button nicht finden. Loop wird gestoppt.`);
                    return false;
                };

                if (superLoopState?.active) {
                    if (!navigate('next')) saveSuperLoopState(null);
                    return;
                } else if (assignmentLoopState?.active) {
                    if (!navigate('next')) saveAssignmentLoopState(null);
                    return;
                }
                updateBuildingStartButtonState();
            } else {
                await handleSequenceController();

                const superLoopState = getSuperLoopState();
                const assignmentLoopState = getAssignmentLoopState();
                if (superLoopState?.active && !getSequenceState() && !autoRunState.active && !localStorage.getItem(pendingAutoModeStartKey)) {
                    debugLog("🔁 Super-Loop: Starte kombinierte Sequenz für neue Wache.");
                    setTimeout(startCombinedSequence, 500);
                } else if (assignmentLoopState?.active && !getSequenceState() && !autoRunState.active && !localStorage.getItem(pendingAutoModeStartKey)) {
                    debugLog("🔁 Zuweisungs-Loop: Starte Personalzuweisung für neue Wache.");
                    setTimeout(() => startAutoAssignForBuilding(false), 500);
                }

                const pendingBuildingId = localStorage.getItem(pendingAutoModeStartKey);
                const pendingNewOnlyBuildingId = localStorage.getItem(pendingNewOnlyAssignKey);

                if (pendingNewOnlyBuildingId === String(currentBuildingId)) {
                    debugLog(`[Nach Neuladen] Modus 'Nur neue Fahrzeuge' für Wache ${currentBuildingId} erkannt.`);
                    localStorage.removeItem(pendingNewOnlyAssignKey);
                    await startAutoAssignForBuilding(true);
                } else if (pendingBuildingId === String(currentBuildingId)) {
                    debugLog(`[Nach Neuladen] Auto-Modus Start für Wache ${currentBuildingId} erkannt.`);
                    localStorage.removeItem(pendingAutoModeStartKey);
                    await startAutoAssignForBuilding(false);
                } else if (autoRunState.pendingStartFromVehiclePage && String(autoRunState.originBuildingId) === String(currentBuildingId)) {
                    debugLog(`Anfrage zum Starten von Fahrzeugseite erkannt. Starte Auto-Zuweisung.`);
                    await startAutoAssignForBuilding(false);
                } else if (autoRunState.active && autoRunState.originBuildingId !== String(currentBuildingId)) {
                    debugLog(`Auto-Modus für andere Wache (${autoRunState.originBuildingId}) aktiv. Beende, da zu Wache ${currentBuildingId} gewechselt wurde.`);
                    resetAutoRunState();
                }
                updateBuildingStartButtonState();
            }
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
        debugLog("ℹ️ Alle Personalzuweisungen für dieses Fahrzeug zurückgesetzt.");
    }

    main();
})();