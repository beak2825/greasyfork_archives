// ==UserScript==
// @name         Einsatz Endzeit-Anzeige
// @namespace    HendrikStaufenbiel
// @version      3.5.1
// @description  Zeigt bei Verbands- und geteilten Einsätzen das früheste Zufahrts-Ende und bietet erweiterte Konfigurationsmöglichkeiten. Inklusive GSL- und RD-Gesperrt-Anzeige. (Modifizierte Version mit API-Abfrage für eigene Einsätze)
// @inspiration  Die Funktion zur Fahrzeughervorhebung basiert auf einem Script von Jan (jxn_30).
// @author       Hendrik, Masklin (Modifiziert durch KI & Community-Feedback)
// @match        https://www.leitstellenspiel.de/
// @match        https://www.leitstellenspiel.de/missions/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536734/Einsatz%20Endzeit-Anzeige.user.js
// @updateURL https://update.greasyfork.org/scripts/536734/Einsatz%20Endzeit-Anzeige.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.hasRunEinsatzEndzeitScriptVerband) return;
    window.hasRunEinsatzEndzeitScriptVerband = true;

    // ========================= FAHRZEUGLISTE =========================
    const VEHICLE_LIST = [
        {id: "0", name: "LF 20"}, {id: "1", name: "LF 10"}, {id: "2", name: "DLK 23"}, {id: "3", name: "ELW 1"},
        {id: "4", name: "RW"}, {id: "5", name: "GW-A"}, {id: "6", name: "LF 8/6"}, {id: "7", name: "LF 20/16"},
        {id: "8", name: "LF 10/6"}, {id: "9", name: "LF 16-TS"}, {id: "10", name: "GW-Öl"}, {id: "11", name: "GW-L2-Wasser"},
        {id: "12", name: "GW-Messtechnik"}, {id: "13", name: "SW 1000"}, {id: "14", name: "SW 2000"}, {id: "15", name: "SW 2000-Tr"},
        {id: "16", name: "SW Kats"}, {id: "17", name: "TLF 2000"}, {id: "18", name: "TLF 3000"}, {id: "19", name: "TLF 8/8"},
        {id: "20", name: "TLF 8/18"}, {id: "21", name: "TLF 16/24-Tr"}, {id: "22", name: "TLF 16/25"}, {id: "23", name: "TLF 16/45"},
        {id: "24", name: "TLF 20/40"}, {id: "25", name: "TLF 20/40-SL"}, {id: "26", name: "TLF 16"}, {id: "27", name: "GW-Gefahrgut"},
        {id: "28", name: "RTW"}, {id: "29", name: "NEF"}, {id: "30", name: "HLF 20"}, {id: "31", name: "RTH"},
        {id: "32", name: "FuStW"}, {id: "33", name: "GW-Höhenrettung"}, {id: "34", name: "ELW 2"}, {id: "35", name: "leBefKw"},
        {id: "36", name: "MTW"}, {id: "37", name: "TSF-W"}, {id: "38", name: "KTW"}, {id: "39", name: "GKW"},
        {id: "40", name: "MTW-TZ"}, {id: "41", name: "MzGW (FGr N)"}, {id: "42", name: "LKW K 9"}, {id: "43", name: "BRmG R"},
        {id: "44", name: "Anh DLE"}, {id: "45", name: "MLW 5"}, {id: "46", name: "WLF"}, {id: "47", name: "AB-Rüst"},
        {id: "48", name: "AB-Atemschutz"}, {id: "49", name: "AB-Öl"}, {id: "50", name: "GruKw"}, {id: "51", name: "FüKW (Polizei)"},
        {id: "52", name: "GefKw"}, {id: "53", name: "Dekon-P"}, {id: "54", name: "AB-Dekon-P"}, {id: "55", name: "KdoW-LNA"},
        {id: "56", name: "KdoW-OrgL"}, {id: "57", name: "FwK"}, {id: "58", name: "KTW Typ B"}, {id: "59", name: "ELW 1 (SEG)"},
        {id: "60", name: "GW-San"}, {id: "61", name: "Polizeihubschrauber"}, {id: "62", name: "AB-Schlauch"}, {id: "63", name: "GW-Taucher"},
        {id: "64", name: "GW-Wasserrettung"}, {id: "65", name: "LKW 7 Lkr 19 tm"}, {id: "66", name: "Anh MzB"}, {id: "67", name: "Anh SchlB"},
        {id: "68", name: "Anh MzAB"}, {id: "69", name: "Tauchkraftwagen"}, {id: "70", name: "MZB"}, {id: "71", name: "AB-MZB"},
        {id: "72", name: "WaWe 10"}, {id: "73", name: "GRTW"}, {id: "74", name: "NAW"}, {id: "75", name: "FLF"},
        {id: "76", name: "Rettungstreppe"}, {id: "77", name: "AB-Gefahrgut"}, {id: "78", name: "AB-Einsatzleitung"}, {id: "79", name: "SEK - ZF"},
        {id: "80", name: "SEK - MTF"}, {id: "81", name: "MEK - ZF"}, {id: "82", name: "MEK - MTF"}, {id: "83", name: "GW-Werkfeuerwehr"},
        {id: "84", name: "ULF mit Löscharm"}, {id: "85", name: "TM 50"}, {id: "86", name: "Turbolöscher"}, {id: "87", name: "TLF 4000"},
        {id: "88", name: "KLF"}, {id: "89", name: "MLF"}, {id: "90", name: "HLF 10"}, {id: "91", name: "Rettungshundefahrzeug"},
        {id: "92", name: "Anh Hund"}, {id: "93", name: "MTW-O"}, {id: "94", name: "DHuFüKW"}, {id: "95", name: "Polizeimotorrad"},
        {id: "96", name: "Außenlastbehälter (allgemein)"}, {id: "97", name: "ITW"}, {id: "98", name: "Zivilstreifenwagen"}, {id: "100", name: "MLW 4"},
        {id: "101", name: "Anh SwPu"}, {id: "102", name: "Anh 7"}, {id: "103", name: "FuStW (DGL)"}, {id: "104", name: "GW-L1"},
        {id: "105", name: "GW-L2"}, {id: "106", name: "MTF-L"}, {id: "107", name: "LF-L"}, {id: "108", name: "AB-L"},
        {id: "109", name: "MzGW SB"}, {id: "110", name: "NEA50"}, {id: "111", name: "NEA50"}, {id: "112", name: "NEA200"},
        {id: "113", name: "NEA200"}, {id: "114", name: "GW-Lüfter"}, {id: "115", name: "Anh Lüfter"}, {id: "116", name: "AB-Lüfter"},
        {id: "117", name: "AB-Tank"}, {id: "118", name: "Kleintankwagen"}, {id: "119", name: "AB-Lösch"}, {id: "120", name: "Tankwagen"},
        {id: "121", name: "GTLF"}, {id: "122", name: "LKW 7 Lbw (FGr E)"}, {id: "123", name: "LKW 7 Lbw (FGr WP)"}, {id: "124", name: "MTW-OV"},
        {id: "125", name: "MTW-Tr UL"}, {id: "126", name: "MTF Drohne"}, {id: "127", name: "GW UAS"}, {id: "128", name: "ELW Drohne"},
        {id: "129", name: "ELW2 Drohne"}, {id: "130", name: "GW-Bt"}, {id: "131", name: "Bt-Kombi"}, {id: "132", name: "FKH"},
        {id: "133", name: "Bt LKW"}, {id: "134", name: "Pferdetransporter klein"}, {id: "135", name: "Pferdetransporter groß"}, {id: "136", name: "Anh Pferdetransport"},
        {id: "137", name: "Zugfahrzeug Pferdetransport"}, {id: "138", name: "GW-Verpflegung"}, {id: "139", name: "GW-Küche"}, {id: "140", name: "MTW-Verpflegung"},
        {id: "141", "name": "FKH"}, {id: "142", name: "AB-Küche"}, {id: "143", name: "Anh Schlauch"}, {id: "144", name: "FüKW (THW)"},
        {id: "145", name: "FüKomKW"}, {id: "146", name: "Anh FüLa"}, {id: "147", name: "FmKW"}, {id: "148", name: "MTW-FGr K"},
        {id: "149", name: "GW-Bergrettung (NEF)"}, {id: "150", name: "GW-Bergrettung"}, {id: "151", name: "ELW Bergrettung"}, {id: "152", name: "ATV"},
        {id: "153", name: "Hundestaffel (Bergrettung)"}, {id: "154", name: "Schneefahrzeug"}, {id: "155", name: "Anh Höhenrettung (Bergrettung)"}, {id: "156", name: "Polizeihubschrauber mit verbauter Winde"},
        {id: "157", name: "RTH Winde"}, {id: "158", name: "GW-Höhenrettung (Bergrettung)"}, {id: "159", name: "Seenotrettungskreuzer"}, {id: "160", name: "Seenotrettungsboot"},
        {id: "161", name: "Hubschrauber (Seenotrettung)"}, {id: "162", name: "RW-Schiene"}, {id: "163", name: "HLF Schiene"}, {id: "164", name: "AB-Schiene"},
        {id: "165", name: "LauKw"}, {id: "166", name: "PTLF 4000"}, {id: "167", name: "SLF"}, {id: "168", name: "Anh Sonderlöschmittel"},
        {id: "169", name: "AB-Sonderlöschmittel"}, {id: "170", name: "AB-Wasser/Schaum"}
    ];
    const VEHICLE_MAP = new Map(VEHICLE_LIST.map(v => [v.id, v.name]));

    // ========================= EINSTELLUNGEN & KONFIGURATION =========================
    const EZA_CONFIG_KEY = 'eza_config_v5';
    let config;

    function loadConfig() {
        const defaults = {
            PANEL_FEST_IN_NAVBAR: false,
            Z_INDEX_DRAGGABLE_PANEL: '5000',
            TEXT_FOR_MISSION_REPLY_TEMPLATE: "ELW/FüKW ab %%ZEIT%%",
            VEHICLE_RECALL_TEXT_WITH_OWNER_TEMPLATE: "@%%OWNER%% %%UNIT_TYPE%% abziehen",
            VEHICLE_RECALL_TEXT_NO_OWNER_TEMPLATE: "%%UNIT_TYPE%% abziehen",
            SHOW_ALARM_WINDOW_COUNTDOWN_TEXT: true,
            HOTKEY_HIDE_ENDZEIT: 'f',
            vehicleHighlights: [
                { enabled: true, name: 'ELWs', color: '#ff0000', types: ['3','34', '78', '128', '129'], alert: true },
                { enabled: true, name: 'FüKw (Polizei)', color: '#008000', types: ['51'], alert: true },
            ]
        };
        const saved = JSON.parse(localStorage.getItem(EZA_CONFIG_KEY) || '{}');
        config = Object.assign({}, defaults, saved);
        if (!config.vehicleHighlights) {
            config.vehicleHighlights = defaults.vehicleHighlights;
        }
        config.vehicleHighlights.forEach(rule => {
            if (typeof rule.types === 'string') {
                rule.types = rule.types.split(',').map(s => s.trim()).filter(Boolean);
            }
        });
    }

    function saveConfig() {
        localStorage.setItem(EZA_CONFIG_KEY, JSON.stringify(config));
    }

    loadConfig();
    // =================================================================================

    const DEBUG_MODE = true;
    const SPECIFIC_IDS_FOR_6H_RULE = ["41", "43", "49", "59", "75", "99", "207", "221", "222", "256", "350"];
    const EXCLUDED_MISSION_TYPE_IDS = ["814", "815", "816", "817", "817a", "818", "819", "820", "838", "839"];
    const MISSION_TYPE_CACHE_KEY = 'eza_mission_type_cache_v1';
    const ELW_VEHICLE_IDS = ["3", "34", "78", "128", "129"];
    const FUKW_VEHICLE_IDS = ["51"];

    const STORAGE_KEY_IGNORED = 'chaos_ignored_einsaetze_verband';
    const CHAOS_MODE_KEY = 'chaos_mode_activated';
    const POSITION_KEY = 'einsatz_endzeit_panel_position';
    const OWN_MISSION_FIXED_END_TIMES_KEY = 'own_mission_fixed_end_times_v5';
    const ALLIANCE_MISSION_DATA_KEY = 'alliance_mission_data';

    let ignoredEinsaetze = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY_IGNORED) || '[]'));
    let chaosMode = JSON.parse(localStorage.getItem(CHAOS_MODE_KEY) || 'false');
    let ownMissionFixedEndTimes;
    try {
        ownMissionFixedEndTimes = JSON.parse(localStorage.getItem(OWN_MISSION_FIXED_END_TIMES_KEY) || '{}');
    } catch (e) {
        ownMissionFixedEndTimes = {}; localStorage.setItem(OWN_MISSION_FIXED_END_TIMES_KEY, JSON.stringify({}));
    }
    let allianceMissionData = JSON.parse(localStorage.getItem(ALLIANCE_MISSION_DATA_KEY) || '{}');
    let missionTypeCache;
    try {
        missionTypeCache = JSON.parse(localStorage.getItem(MISSION_TYPE_CACHE_KEY) || '{}');
    } catch (e) {
        missionTypeCache = {};
        localStorage.setItem(MISSION_TYPE_CACHE_KEY, JSON.stringify({}));
    }

    let einsatzMitFruehestemEnde = null;
    let creditDisplayGlobal = null;
    let activeContextMenu = null;

    function isDarkMode() {
        return document.body.classList.contains('dark');
    }
    // *** NEU AUS 3.4.4 ***
    let missionsToFetchQueue = new Set(); // Sammelt die IDs der Einsätze
    let fetchBatchTimer = null;           // Hält unseren Timer
    // *** ENDE NEU ***

    if (!window.ezaMissionIntervals) { window.ezaMissionIntervals = {}; }
    if (!window.ezaLastTooltipTitles) { window.ezaLastTooltipTitles = {}; }

    function logDebug(message, ...optionalParams) {
        if (DEBUG_MODE) { console.log(`[EZA-Debug] ${message}`, ...optionalParams); }
    }

    function saveIgnored() { localStorage.setItem(STORAGE_KEY_IGNORED, JSON.stringify([...ignoredEinsaetze])); }
    function saveChaosMode() { localStorage.setItem(CHAOS_MODE_KEY, JSON.stringify(chaosMode)); }
    function savePanelPosition(left, top) { localStorage.setItem(POSITION_KEY, JSON.stringify({ left, top })); }
    function saveOwnMissionFixedEndTimes() { localStorage.setItem(OWN_MISSION_FIXED_END_TIMES_KEY, JSON.stringify(ownMissionFixedEndTimes)); }
    function saveAllianceMissionData() { localStorage.setItem(ALLIANCE_MISSION_DATA_KEY, JSON.stringify(allianceMissionData)); }
    function saveMissionTypeCache() { localStorage.setItem(MISSION_TYPE_CACHE_KEY, JSON.stringify(missionTypeCache)); }
    function loadPanelPosition() {
        const pos = localStorage.getItem(POSITION_KEY);
        if (pos) { try { return JSON.parse(pos); } catch (e) { localStorage.removeItem(POSITION_KEY); return null; } }
        return null;
    }

    function formatTime(timestamp) {
        if (timestamp === null || timestamp === undefined) return "";
        const date = new Date(timestamp * 1000);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function formatTimeLeft(seconds) {
        const prefix = seconds <= 0 ? "Endzeit erreicht seit " : "Verbleibend ";
        const absSeconds = Math.abs(seconds);
        const h = Math.floor(absSeconds / 3600);
        const m = Math.floor((absSeconds % 3600) / 60);
        const s = absSeconds % 60;
        const mFormatted = m.toString().padStart(2, '0');
        const sFormatted = s.toString().padStart(2, '0');
        return h > 0 ? `${prefix}${h.toString().padStart(2, '0')}:${mFormatted}:${sFormatted}` : `${prefix}${mFormatted}:${sFormatted}`;
    }

    function formatTimeLeftForTooltip(seconds) {
        const prefix = seconds <= 0 ? "Endzeit erreicht seit " : "Verbleibend ";
        const absSeconds = Math.abs(seconds);
        const h = Math.floor(absSeconds / 3600);
        const m = Math.floor((absSeconds % 3600) / 60);
        const hFormatted = h.toString().padStart(2, '0');
        const mFormatted = m.toString().padStart(2, '0');
        return h > 0 ? `${prefix}${hFormatted}:${mFormatted}` : `${prefix}${mFormatted} Min.`;
    }

    function calculateOffset(avgCredits, isOwnMissionCalculation = false) {
        const lowCreditsOffset = chaosMode ? 1800 : 3600;
        const highCreditsOffset = chaosMode ? 5400 : 10800;
        const threshold = isOwnMissionCalculation ? 4999 : 4999;
        return avgCredits > threshold ? highCreditsOffset : lowCreditsOffset;
    }

    function clearMissionInterval(missionId) {
        if (window.ezaMissionIntervals && window.ezaMissionIntervals[missionId]) {
            clearInterval(window.ezaMissionIntervals[missionId]);
            delete window.ezaMissionIntervals[missionId];
        }
        if (window.ezaLastTooltipTitles && window.ezaLastTooltipTitles[missionId]) {
            delete window.ezaLastTooltipTitles[missionId];
        }
    }

    function closeActiveContextMenu() {
        if (activeContextMenu) {
            if (activeContextMenu.parentElement) activeContextMenu.parentElement.removeChild(activeContextMenu);
            activeContextMenu = null;
        }
    }
    document.addEventListener('click', (e) => {
        if (activeContextMenu &&
            !activeContextMenu.contains(e.target) &&
            !e.target.closest('.eza-time-input-container')) {
            const timeInputContainer = document.querySelector('.eza-time-input-container');
            if (!timeInputContainer || !timeInputContainer.contains(e.target)) {
                closeActiveContextMenu();
            }
        }
    }, true);

    function getPrioritizedCredits(missionEntryNode, missionIdForLog, fallbackSortableData) {
        let creditsToUse = 0;
        if (fallbackSortableData && typeof fallbackSortableData.average_credits === 'number') {
            creditsToUse = fallbackSortableData.average_credits;
        }
        const originalCreditsFromSortable = creditsToUse;

        const lssmCreditsWrapper = missionEntryNode.querySelector('.panel-body .row .lssmv4-extendedCallList_average-credits_wrapper');
        if (lssmCreditsWrapper) {
            const lssmCreditsLabel = lssmCreditsWrapper.querySelector('span.label');
            if (lssmCreditsLabel) {
                const lssmCreditsText = lssmCreditsLabel.textContent;
                try {
                    const cleanedCreditsText = lssmCreditsText.replace(/[≈\s\.]/g, '');
                    const parsedLssmCredits = parseInt(cleanedCreditsText, 10);
                    if (!isNaN(parsedLssmCredits)) {
                        creditsToUse = parsedLssmCredits;
                    }
                } catch (parseError) { /* ignore */ }
            }
        }
        return creditsToUse;
    }

    // *** NEUE API-FUNKTIONEN AUS 3.4.4 ***
    // Diese Funktion sammelt Einsätze, bevor sie an die API gesendet werden
    function queueMissionForProcessing(missionId, entry) {
        missionsToFetchQueue.add(missionId);
        entry.setAttribute('data-eza-queued', 'true'); // Markiert den Einsatz als "in der Warteschlange"

        clearTimeout(fetchBatchTimer); // Stoppt einen laufenden Timer

        // Startet einen neuen Timer. Nach 1.5 Sekunden ohne neue Einsätze wird die Verarbeitung ausgelöst.
        const delay = 1500;
        fetchBatchTimer = setTimeout(processMissionBatch, delay);
    }

    // Diese Funktion fragt die API ab und verarbeitet die gesammelten Einsätze
     async function processMissionBatch() {
        if (missionsToFetchQueue.size === 0) return;

        const missionsToProcess = new Set(missionsToFetchQueue);
        missionsToFetchQueue.clear();
        logDebug(`[EZA-Batch] Starte API-Verarbeitung für ${missionsToProcess.size} Einsätze.`);

        try {
            // Die eigentliche API-Anfrage an den Server
            const response = await fetch('/map/mission_markers_own.js.erb');
            if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`);
            const text = await response.text();

            // Extrahieren der reinen Missionsdaten aus der Server-Antwort
            const startToken = 'const mList = ';
            const startIndex = text.indexOf(startToken);
            if (startIndex === -1) throw new Error("Konnte 'const mList' nicht finden.");
            const jsonStartIndex = startIndex + startToken.length;
            const jsonEndIndex = text.indexOf('];', jsonStartIndex);
            if (jsonEndIndex === -1) throw new Error("Konnte das Ende des Arrays nicht finden.");
            let jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1).trim().replace(/,\s*]$/, ']');
            const allMissionsData = JSON.parse(jsonString);

            // Verarbeite jeden Einsatz aus der Warteschlange
            for (const missionId of missionsToProcess) {
                const missionData = allMissionsData.find(m => m.id == missionId);

                // Nur wenn der Einsatz in den API-Daten gefunden wurde
                if (missionData && missionData.alliance_shared_at !== null) {
                    const baseTimestamp = missionData.alliance_shared_at; // Der präzise Start-Zeitstempel von der API
                    const creditsForCalculation = missionData.average_credits || 0;
                    const missionTypeId = (missionData.mission_type_id || '').toString();
                    const missionTypeString = missionData.mission_type || ''; // Hole den Missionstyp als Text

                    let endTimestamp;
                    const isGslMission = SPECIFIC_IDS_FOR_6H_RULE.includes(missionTypeId) || missionTypeString === 'alliance_custom';

                    if (isGslMission) {
                        endTimestamp = baseTimestamp + 21600; // 6 Stunden für GSL
                    } else {
                        endTimestamp = baseTimestamp + calculateOffset(creditsForCalculation, true); // Normale Berechnung
                    }

                    // Speichere die neue, präzise Endzeit
                    ownMissionFixedEndTimes[missionId] = {
                        endTime: endTimestamp,
                        startTime: baseTimestamp
                    };

                    // Entferne die Markierung "in der Warteschlange"
                    const entry = document.querySelector(`.missionSideBarEntry[mission_id="${missionId}"][data-eza-queued="true"]`);
                    if (entry) {
                        entry.removeAttribute('data-eza-queued');
                    }
                } else {
                    logDebug(`Konnte Mission ${missionId} in den API-Daten nicht finden. Wahrscheinlich schon beendet.`);
                }
            }
            saveOwnMissionFixedEndTimes(); // Speichere alle neuen Zeiten
            if (typeof addEndTimes === 'function') addEndTimes(); // Aktualisiere die Ansicht

        } catch (error) {
            console.error(`[EZA-Batch] Fehler:`, error);
            // Räume im Fehlerfall die Markierungen auf
            missionsToProcess.forEach(id => {
                const entry = document.querySelector(`.missionSideBarEntry[mission_id="${id}"][data-eza-queued="true"]`);
                if (entry) entry.removeAttribute('data-eza-queued');
            });
        }
    }
    // *** ENDE NEUE API-FUNKTIONEN ***

    function updateStoredEndTime(missionId, newEndTimestamp, isOwn, avgCreditsForAlliance, originalGenTimeForAlliance) {
        logDebug(`updateStoredEndTime: mission=${missionId}, newEnd=${newEndTimestamp}, isOwn=${isOwn}`);
        if (isOwn) {
            let dataToStore = ownMissionFixedEndTimes[missionId];
            let existingStartTime = null;

            if (typeof dataToStore === 'object' && dataToStore !== null && dataToStore.startTime !== undefined) {
                existingStartTime = dataToStore.startTime;
            } else if (typeof dataToStore === 'number') {
                logDebug(`Updating own mission ${missionId} from old format. Start time cannot be preserved for this edit.`);
            }
            existingStartTime = originalGenTimeForAlliance;

            ownMissionFixedEndTimes[missionId] = {
                endTime: newEndTimestamp,
                startTime: existingStartTime
            };
            saveOwnMissionFixedEndTimes();
        } else {
            const missionData = allianceMissionData[missionId] || {};
            let updatedEntry = {
                avgCredits: avgCreditsForAlliance !== undefined ? avgCreditsForAlliance : missionData.avgCredits,
                genTime: originalGenTimeForAlliance !== undefined ? originalGenTimeForAlliance : missionData.genTime,
                manualEndTime: newEndTimestamp,
                missionTypeId: missionData.missionTypeId
            };
            if (updatedEntry.avgCredits === undefined && missionData.avgCredits !== undefined) updatedEntry.avgCredits = missionData.avgCredits;
            if (updatedEntry.genTime === undefined && missionData.genTime !== undefined) updatedEntry.genTime = missionData.genTime;
            if (updatedEntry.missionTypeId === undefined && missionData.missionTypeId !== undefined) updatedEntry.missionTypeId = missionData.missionTypeId;

            allianceMissionData[missionId] = updatedEntry;
            saveAllianceMissionData();
        }
    }

    function createAndShowEndTimeContextMenu(event, missionId, currentEndTimestamp, isOwn, avgCredits, originalGenTimeForAlliance, zeitAnzeigeElement, isExcludedType = false) {
        closeActiveContextMenu();
        const menu = document.createElement('div');
        activeContextMenu = menu;

        Object.assign(menu.style, {
            position: 'absolute', left: `${event.pageX - 220}px`, top: `${event.pageY}px`,
            backgroundColor: '#2c3e50', border: '1px solid #34495e', borderRadius: '6px',
            padding: '5px', zIndex: (parseInt(config.Z_INDEX_DRAGGABLE_PANEL) + 100).toString(),
            boxShadow: '0 5px 15px rgba(0,0,0,0.25)', color: '#ecf0f1',
            fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '4px'
        });
        const createOption = (text, onClickAction, autoCloseMenuAfterAction = true) => {
            const option = document.createElement('div');
            option.textContent = text;
            Object.assign(option.style, {
                padding: '10px 15px', cursor: 'pointer', fontSize: '14px',
                borderRadius: '4px', color: '#ecf0f1', backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out'
            });
            option.onmouseover = () => { option.style.backgroundColor = '#3498db'; option.style.color = '#ffffff'; };
            option.onmouseout = () => { option.style.backgroundColor = 'transparent'; option.style.color = '#ecf0f1'; };
            option.onclick = (e) => {
                e.stopPropagation();
                onClickAction();
                if (autoCloseMenuAfterAction) closeActiveContextMenu();
            };
            menu.appendChild(option);
        };

        if (!isExcludedType) {
            if (currentEndTimestamp) {
                createOption('+3h', () => {
                    let newEndTimestamp = currentEndTimestamp + 10800;
                    updateStoredEndTime(missionId, newEndTimestamp, isOwn, avgCredits, originalGenTimeForAlliance);
                    if (window.location.pathname === '/') { if (typeof addEndTimes === 'function') addEndTimes(); }
                    else if (window.location.pathname.startsWith('/missions/')) { if (typeof addEndTimeToMissionContent === 'function') addEndTimeToMissionContent(); }
                }, true);
                createOption('Endzeit bearbeiten', () => {
                    const inputContainer = document.createElement('div');
                    inputContainer.classList.add('eza-time-input-container');
                    Object.assign(inputContainer.style, {
                        display: 'inline-flex', alignItems: 'center', border: "1px solid #777",
                        padding: "1px 3px", backgroundColor: "#fff",
                        position: 'fixed',
                        zIndex: (parseInt(config.Z_INDEX_DRAGGABLE_PANEL) + 101).toString(),
                        color: "#333"
                    });

                    Object.assign(inputContainer.style, {
                        left: `${event.clientX}px`,
                        top: `${event.clientY + 15}px`
                    });
                    if (event.clientX === undefined || event.clientY === undefined) {
                        logDebug("EZA: clientX/Y not available on event, falling back to zeitAnzeigeElement for edit box position.");
                        const rect = zeitAnzeigeElement.getBoundingClientRect();
                         Object.assign(inputContainer.style, {
                            left: `${rect.left}px`, top: `${rect.bottom + 2}px`
                        });
                    }

                    const inputHH = document.createElement('input');
                    inputHH.type = 'text'; inputHH.maxLength = 2; inputHH.placeholder = "HH";
                    inputHH.classList.add('eza-time-input-hh');
                    Object.assign(inputHH.style, { width: "25px", textAlign: "center", border: "none", outline: "none", padding: "2px"});

                    const colonSpan = document.createElement('span');
                    colonSpan.textContent = ":";
                    Object.assign(colonSpan.style, { margin: "0 1px", color: "#333" });
                    const inputMM = document.createElement('input');
                    inputMM.type = 'text'; inputMM.maxLength = 2; inputMM.placeholder = "MM";
                    inputMM.classList.add('eza-time-input-mm');
                    Object.assign(inputMM.style, { width: "25px", textAlign: "center", border: "none", outline: "none", padding: "2px" });

                    inputContainer.appendChild(inputHH);
                    inputContainer.appendChild(colonSpan);
                    inputContainer.appendChild(inputMM);

                    const initialTime = formatTime(currentEndTimestamp);
                    const timePartsInitial = initialTime.split(':');
                    if (timePartsInitial.length === 2) {
                        inputHH.value = timePartsInitial[0];
                        inputMM.value = timePartsInitial[1];
                    }

                    const filterDigitsAndLimit = (inputField) => {
                        let value = inputField.value.replace(/\D/g, '');
                        if (value.length > 2) value = value.substring(0, 2);
                        inputField.value = value;
                        return value;
                    };
                    inputHH.addEventListener('input', () => {
                        const value = filterDigitsAndLimit(inputHH);
                        if (value.length === 2) { inputMM.focus(); inputMM.select(); }
                    });
                    inputMM.addEventListener('input', () => { filterDigitsAndLimit(inputMM); });

                    const cleanupInputs = () => {
                        if (document.body.contains(inputContainer)) document.body.removeChild(inputContainer);
                    };

                    const handleEditAndClose = () => {
                        if (!document.body.contains(inputContainer)) {
                            logDebug("handleEditAndClose: inputContainer not in DOM. Closing menu.");
                            closeActiveContextMenu(); return;
                        }
                        logDebug("handleEditAndClose: Processing input.");
                        const hhVal = inputHH.value.padStart(2, '0');
                        const mmVal = inputMM.value.padStart(2, '0');
                        let saved = false;
                        if (hhVal.match(/^\d{2}$/) && mmVal.match(/^\d{2}$/)) {
                            const newHours = parseInt(hhVal, 10);
                            const newMinutes = parseInt(mmVal, 10);
                            if (newHours >= 0 && newHours <= 23 && newMinutes >= 0 && newMinutes <= 59) {
                                const originalDate = new Date(currentEndTimestamp * 1000);
                                originalDate.setHours(newHours, newMinutes, 0, 0);
                                const newTimestamp = Math.floor(originalDate.getTime() / 1000);
                                updateStoredEndTime(missionId, newTimestamp, isOwn, avgCredits, originalGenTimeForAlliance);
                                saved = true;
                            } else { alert('Ungültige Zeiteingabe. Stunden (0-23), Minuten (0-59).'); }
                        } else { alert('Ungültiges Zeitformat. Bitte HH und MM als Zahlen eingeben.'); }

                        if (saved) {
                            logDebug("handleEditAndClose: Data saved, attempting view refresh.");
                            try {
                                if (window.location.pathname === '/') {
                                    if (typeof addEndTimes === 'function') addEndTimes();
                                } else if (window.location.pathname.startsWith('/missions/')) {
                                    if (typeof addEndTimeToMissionContent === 'function') {
                                        logDebug("handleEditAndClose: Refreshing /missions/* view.");
                                        addEndTimeToMissionContent();
                                    }
                                 }
                            } catch (e) {
                                console.error("EZA: Fehler bei Ansichtsaktualisierung nach Bearbeitung.", e);
                                logDebug("EZA: Error during view refresh:", e);
                            }
                        }
                        cleanupInputs();
                        closeActiveContextMenu();
                    };

                    const sharedKeyDownHandler = (ev, currentInput, prevInput, nextInput) => {
                        if (['Enter', 'Escape', 'Tab'].includes(ev.key) || ev.ctrlKey || ev.metaKey) {
                            if (ev.key === 'Enter') { ev.preventDefault(); handleEditAndClose(); }
                            if (ev.key === 'Escape') { ev.preventDefault(); cleanupInputs(); closeActiveContextMenu(); }
                            if (ev.key === 'Tab' && nextInput && !ev.shiftKey) { ev.preventDefault(); nextInput.focus(); nextInput.select(); }
                            if (ev.key === 'Tab' && prevInput && ev.shiftKey) { ev.preventDefault(); prevInput.focus(); prevInput.select(); }
                            return;
                        }
                        if (ev.key === 'Backspace' && currentInput.value === '' && prevInput) {
                            ev.preventDefault();
                            prevInput.focus(); prevInput.select();
                        }
                        if (!/^\d$/.test(ev.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(ev.key)) {
                            ev.preventDefault();
                        }
                    };
                    inputHH.onkeydown = (ev) => sharedKeyDownHandler(ev, inputHH, null, inputMM);
                    inputMM.onkeydown = (ev) => sharedKeyDownHandler(ev, inputMM, inputHH, null);
                    const handleBlur = () => {
                        setTimeout(() => {
                            if (!document.body.contains(inputContainer)) return;
                            const activeEl = document.activeElement;
                            if (activeEl !== inputHH && activeEl !== inputMM &&
                                (!activeContextMenu || !activeContextMenu.contains(activeEl))) {
                                logDebug("Blur: focus left inputs & menu. Processing.");
                                handleEditAndClose();
                            }
                        }, 0);
                    };
                    inputHH.addEventListener('blur', handleBlur);
                    inputMM.addEventListener('blur', handleBlur);
                    document.body.appendChild(inputContainer);
                    inputHH.focus();
                    inputHH.select();
                }, false);
            }
        }

        if (window.location.pathname.startsWith('/missions/') && ignoredEinsaetze.has(missionId)) {
            createOption('Wieder in Einsatzliste anzeigen', () => {
                ignoredEinsaetze.delete(missionId);
                saveIgnored();
                logDebug(`Mission ${missionId} wurde aus der Ignoriert-Liste entfernt und sollte wieder in der Einsatzliste erscheinen.`);
            }, true);
        }

        if (menu.children.length > 0) {
            document.body.appendChild(menu);
            menu.addEventListener('click', e => e.stopPropagation());
        } else {
            activeContextMenu = null;
            logDebug("Context menu for " + missionId + " had no items.");
        }
    }

    // *** WICHTIG: ANGEPASSTE HAUPTFUNKTION ***
    function verarbeiteEinsatzliste(container, isOwn = false) {
        if (!container) return { fruehesteZeit: Infinity, eintrag: null, gesamtCredits: 0 };
        let fruehesteZeit = Infinity, fruehesterEintrag = null, gesamtCreditsInListe = 0;
        let needsSaveAllianceData = false;
        let needsSaveMissionTypeCache = false;

        container.querySelectorAll('.missionSideBarEntry').forEach(entry => {
            const missionId = entry.getAttribute('mission_id');
            if (!missionId) return;

            const missionTypeIdValue = entry.getAttribute('mission_type_id');

            if (missionTypeIdValue && missionTypeCache[missionId] !== missionTypeIdValue.trim()) {
                missionTypeCache[missionId] = missionTypeIdValue.trim();
                needsSaveMissionTypeCache = true;
            }

            if (entry.classList.contains('mission_deleted')) {
                if (isOwn && ownMissionFixedEndTimes[missionId]) { delete ownMissionFixedEndTimes[missionId]; saveOwnMissionFixedEndTimes(); }
                if (!isOwn && allianceMissionData[missionId]) { delete allianceMissionData[missionId]; needsSaveAllianceData = true; }
                if (missionTypeCache[missionId]) { delete missionTypeCache[missionId]; needsSaveMissionTypeCache = true; }
                const heading = entry.querySelector(`div[id="mission_panel_heading_${missionId}"]`);
                if(heading) { const anzeige = heading.querySelector('.endzeit-anzeige'); if(anzeige) anzeige.remove(); }
                return;
            }

            if (ignoredEinsaetze.has(missionId)) {
                 const sortableRawForCredit = entry.getAttribute('data-sortable-by');
                 if (sortableRawForCredit) {
                    try {
                        const sortableDataForCredit = JSON.parse(sortableRawForCredit.replace(/&quot;/g, '"'));
                        gesamtCreditsInListe += getPrioritizedCredits(entry, missionId, sortableDataForCredit);
                    } catch (err) { /*ignore*/ }
                 }
                const headingIgnored = entry.querySelector(`div[id="mission_panel_heading_${missionId}"]`);
                if (headingIgnored) {
                    const anzeigeIgnored = headingIgnored.querySelector('.endzeit-anzeige');
                    if (anzeigeIgnored) anzeigeIgnored.style.display = 'none';
                }
                return;
            }

            const isExcludedType = missionTypeIdValue && EXCLUDED_MISSION_TYPE_IDS.includes(missionTypeIdValue.trim());
            const panelHeading = entry.querySelector(`div[id="mission_panel_heading_${missionId}"]`);

            if (panelHeading) {
                Object.assign(panelHeading.style, {
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '4px'
                });
            }

            if (isExcludedType) {
                if (panelHeading) {
                    let zeitAnzeige = panelHeading.querySelector('.endzeit-anzeige');
                    if (zeitAnzeige) zeitAnzeige.style.display = 'none';
                }
                const sortableRawForCredit = entry.getAttribute('data-sortable-by');
                if (sortableRawForCredit) {
                    try {
                        const sortableDataForCredit = JSON.parse(sortableRawForCredit.replace(/&quot;/g, '"'));
                        gesamtCreditsInListe += getPrioritizedCredits(entry, missionId, sortableDataForCredit);
                    } catch (err) { console.error(`EZA: Fehler beim Parsen von sortableData für Credits (ausgeschlossen) ${missionId}:`, err); }
                }
                return;
            }

            const sortableRaw = entry.getAttribute('data-sortable-by');
            if (!sortableRaw) return;
            let sortableData = null;
            try {
                sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
            } catch (err) {
                console.error(`EZA: Fehler verarbeiteEinsatzliste (parse data-sortable-by) ${missionId}:`, err);
                return;
            }

            let avgCreditsFromListItem = getPrioritizedCredits(entry, missionId, sortableData);
            let currentEndTimestamp, ownStartTime = null;
            let shouldDisplayTime = false;

            // *** START DER ANGEPASSTEN LOGIK ***
            if (isOwn) {
                const ownData = ownMissionFixedEndTimes[missionId];
                if (ownData) {
                    // Fall 1: Eigener Einsatz, dessen Endzeit bereits bekannt und gespeichert ist.
                    if (typeof ownData === 'object' && ownData.endTime !== undefined) {
                        currentEndTimestamp = ownData.endTime;
                        ownStartTime = ownData.startTime;
                    } else if (typeof ownData === 'number') { // Altes Format
                        currentEndTimestamp = ownData;
                    }
                    if (currentEndTimestamp !== undefined) shouldDisplayTime = true;
                    gesamtCreditsInListe += avgCreditsFromListItem;
                 } else if (entry.querySelector(`div[id="mission_panel_${missionId}"]`)?.classList.contains('panel-success')) {
                    // Fall 2: Eigener Einsatz, der gerade grün geworden ist.
                    // Rufe die neue Sammel-Funktion auf, anstatt direkt zu verarbeiten.
                    if (!entry.hasAttribute('data-eza-queued')) {
                        queueMissionForProcessing(missionId, entry);
                    }
                 }
            // *** ENDE DER ANGEPASSTEN LOGIK ***
            } else { // Dieser else-Block ist die originale, stabile Logik für Verbandseinsätze
                const existingAllianceEntry = allianceMissionData[missionId];
                const initialGenTimeFromListItem = Number(sortableData.age);
                let entryNeedsUpdateInStorage = false;
                let newAllianceEntryData = existingAllianceEntry ? { ...existingAllianceEntry } : {};

                newAllianceEntryData.missionTypeId = missionTypeIdValue ? missionTypeIdValue.trim() : (existingAllianceEntry?.missionTypeId || missionTypeCache[missionId]);

                if (existingAllianceEntry?.manualEndTime !== undefined) {
                    currentEndTimestamp = existingAllianceEntry.manualEndTime;
                    if (existingAllianceEntry.genTime !== initialGenTimeFromListItem ||
                        existingAllianceEntry.avgCredits !== avgCreditsFromListItem ||
                        existingAllianceEntry.missionTypeId !== newAllianceEntryData.missionTypeId) {
                        newAllianceEntryData.genTime = initialGenTimeFromListItem;
                        newAllianceEntryData.avgCredits = avgCreditsFromListItem;
                        entryNeedsUpdateInStorage = true;
                    }
                } else {
                    const missionTypeIdForCalc = newAllianceEntryData.missionTypeId;
                    const isMissionTypeIdEffectivelyMissingCalc = !missionTypeIdForCalc || missionTypeIdForCalc.trim() === "" || missionTypeIdForCalc.trim().toLowerCase() === "null";
                    const isSpecificIdForRuleCalc = missionTypeIdForCalc && SPECIFIC_IDS_FOR_6H_RULE.includes(missionTypeIdForCalc.trim());
                    const ruleAppliesCalc = isMissionTypeIdEffectivelyMissingCalc || isSpecificIdForRuleCalc;

                    if (ruleAppliesCalc) {
                        currentEndTimestamp = initialGenTimeFromListItem + 21600;
                    } else {
                        currentEndTimestamp = initialGenTimeFromListItem + calculateOffset(avgCreditsFromListItem, false);
                    }

                    if (!existingAllianceEntry ||
                        existingAllianceEntry.genTime !== initialGenTimeFromListItem ||
                        existingAllianceEntry.avgCredits !== avgCreditsFromListItem ||
                        existingAllianceEntry.missionTypeId !== newAllianceEntryData.missionTypeId ||
                        (existingAllianceEntry.manualEndTime !== undefined)
                       ) {
                        newAllianceEntryData.genTime = initialGenTimeFromListItem;
                        newAllianceEntryData.avgCredits = avgCreditsFromListItem;
                        delete newAllianceEntryData.manualEndTime;
                        entryNeedsUpdateInStorage = true;
                    }
                }

                if (entryNeedsUpdateInStorage && window.location.pathname === '/') {
                    allianceMissionData[missionId] = newAllianceEntryData;
                    needsSaveAllianceData = true;
                } else if (!existingAllianceEntry && window.location.pathname === '/') {
                     if (Object.keys(newAllianceEntryData).filter(k => k !== 'missionTypeId' || newAllianceEntryData[k] !== null).length <= 1 && newAllianceEntryData.missionTypeId) {
                         newAllianceEntryData = { genTime: initialGenTimeFromListItem, avgCredits: avgCreditsFromListItem, missionTypeId: newAllianceEntryData.missionTypeId };
                    } else if (Object.keys(newAllianceEntryData).length === 0) {
                         newAllianceEntryData = { genTime: initialGenTimeFromListItem, avgCredits: avgCreditsFromListItem, missionTypeId: missionTypeIdValue ? missionTypeIdValue.trim() : null };
                    }
                    delete newAllianceEntryData.manualEndTime;
                    allianceMissionData[missionId] = newAllianceEntryData;
                    needsSaveAllianceData = true;
                }
                shouldDisplayTime = true;
                gesamtCreditsInListe += avgCreditsFromListItem;
            }


            if (panelHeading) {
                let zeitAnzeige = panelHeading.querySelector('.endzeit-anzeige');
                if (shouldDisplayTime && currentEndTimestamp !== undefined) {
                    if (currentEndTimestamp < fruehesteZeit) { fruehesteZeit = currentEndTimestamp; fruehesterEintrag = entry; }
                    if (!zeitAnzeige) {
                        zeitAnzeige = document.createElement('div');
                        zeitAnzeige.className = 'endzeit-anzeige';
                        Object.assign(zeitAnzeige.style, {
                            marginLeft: 'auto',
                            flexShrink: '0',
                            padding: '2px 8px',
                            fontSize: 'smaller',
                            color: 'white',
                            borderRadius: '4px',
                            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                        });
                        zeitAnzeige.addEventListener('click', (e) => { e.stopPropagation(); zeitAnzeige.style.display = 'none'; ignoredEinsaetze.add(missionId); saveIgnored(); if (typeof addEndTimes === 'function') addEndTimes(); });
                        const genTimeForContext = isOwn ? ownStartTime : Number(sortableData.age);
                        zeitAnzeige.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); createAndShowEndTimeContextMenu(e, missionId, currentEndTimestamp, isOwn, avgCreditsFromListItem, genTimeForContext, zeitAnzeige ); });
                        panelHeading.appendChild(zeitAnzeige);
                    }

                    const now = Math.floor(Date.now() / 1000);
                    if (currentEndTimestamp <= now) {
                        zeitAnzeige.style.backgroundColor = '#2ecc71';
                    } else {
                        zeitAnzeige.style.backgroundColor = '#ff0000';
                    }
                    zeitAnzeige.textContent = `${formatTime(currentEndTimestamp)} Uhr`;
                    zeitAnzeige.style.display = 'inline-block';

                } else if (zeitAnzeige) {
                    zeitAnzeige.style.display = 'none';
                }
            }
        });
        if (needsSaveAllianceData && !isOwn && window.location.pathname === '/') {
            saveAllianceMissionData();
        }
        if (needsSaveMissionTypeCache) {
            saveMissionTypeCache();
        }
        return { fruehesteZeit, eintrag: fruehesterEintrag, gesamtCredits: gesamtCreditsInListe };
    }

    // Ab hier ist der Rest des Skripts wieder die originale 3.3.4 Version ohne Änderungen
    function addEndTimes() {
        if (window.location.pathname !== '/') return;
        const allianceResult = verarbeiteEinsatzliste(document.querySelector('#mission_list_alliance'), false);
        const ownResult = verarbeiteEinsatzliste(document.querySelector('#mission_list'), true);
        let nextEndTimeToShow = Infinity, creditsForPanelDisplay = allianceResult.gesamtCredits;
        einsatzMitFruehestemEnde = null;
        if (allianceResult.fruehesteZeit < nextEndTimeToShow) { nextEndTimeToShow = allianceResult.fruehesteZeit; einsatzMitFruehestemEnde = allianceResult.eintrag; }

        if (ownResult.fruehesteZeit < Infinity) {
             creditsForPanelDisplay += ownResult.gesamtCredits;
             if (ownResult.fruehesteZeit < nextEndTimeToShow) {
                 nextEndTimeToShow = ownResult.fruehesteZeit;
                 einsatzMitFruehestemEnde = ownResult.eintrag;
             }
        }
        updatePanel(nextEndTimeToShow < Infinity ? formatTime(nextEndTimeToShow) : "N/A", creditsForPanelDisplay);
    }

    function updatePanel(zeit, credits) {
        const panel = document.getElementById('endzeit-panel');
        if (!panel) return;
        const btnNextEnd = panel.querySelector('#btnNextEnd');
        if (btnNextEnd) btnNextEnd.textContent = `Nächste Endzeit: ${zeit}`;
        if (creditDisplayGlobal) creditDisplayGlobal.title = `Summe Credits (Verband + Eigene): ${credits.toLocaleString()} Cr`;
    }

    function renderVehicleHighlightSettings() {
        const container = document.getElementById('eza-vehicle-highlights-container');
        if (!container) return;
        container.innerHTML = '';

        config.vehicleHighlights.forEach((rule, index) => {
            const ruleDiv = document.createElement('div');
            ruleDiv.className = 'eza-sub-setting';

            let vehiclePillsHTML = '';
            if (rule.types && Array.isArray(rule.types)) {
                vehiclePillsHTML = rule.types.map(id => `
                    <span class="eza-vehicle-pill" title="${VEHICLE_MAP.get(id) || 'Unbekanntes Fzg'}">
                        ${VEHICLE_MAP.get(id) || `ID: ${id}`}
                        <span class="eza-pill-remove" data-id="${id}" data-rule-index="${index}">&times;</span>
                    </span>
                `).join('');
            }

            ruleDiv.innerHTML = `
                <input type="checkbox" class="eza-rule-enabled" title="Regel aktivieren/deaktivieren" ${rule.enabled ? 'checked' : ''}>
                <input type="color" class="eza-rule-color" title="Farbe auswählen" value="${rule.color}">
                <input type="text" class="eza-rule-name" placeholder="Regelname" value="${rule.name || ''}">
                <div class="eza-pill-container">${vehiclePillsHTML}</div>
                <button class="eza-add-vehicle-btn" data-rule-index="${index}">+ Fahrzeug</button>
                <label class="eza-rule-label" title="Alarm im Titel anzeigen?">⚠️ <input type="checkbox" class="eza-rule-alert" ${rule.alert ? 'checked' : ''}></label>
                <button class="eza-rule-remove-main" title="Ganze Regel entfernen">&times;</button>
            `;
            container.appendChild(ruleDiv);

            ruleDiv.querySelector('.eza-rule-remove-main').addEventListener('click', () => {
                config.vehicleHighlights.splice(index, 1);
                renderVehicleHighlightSettings();
            });
            ruleDiv.querySelector('.eza-add-vehicle-btn').addEventListener('click', (e) => {
                const ruleIndex = e.target.getAttribute('data-rule-index');
                openVehicleSelectionModal(ruleIndex);
            });
            ruleDiv.querySelectorAll('.eza-pill-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idToRemove = e.target.getAttribute('data-id');
                    const ruleIndex = e.target.getAttribute('data-rule-index');
                    const types = config.vehicleHighlights[ruleIndex].types;
                    config.vehicleHighlights[ruleIndex].types = types.filter(id => id !== idToRemove);
                    renderVehicleHighlightSettings();
                });
            });
        });
    }

    function openVehicleSelectionModal(ruleIndex) {
        let modal = document.getElementById('eza-vehicle-select-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'eza-vehicle-select-modal';
            modal.className = 'eza-sub-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="eza-modal-content" style="max-width: 500px; margin-top: 15%;">
                <div class="eza-modal-header">
                    <h3>Fahrzeug auswählen</h3>
                    <span class="eza-close-btn">&times;</span>
                </div>
                <div class="eza-modal-body">
                    <input type="text" id="eza-vehicle-search" placeholder="Fahrzeug suchen..." style="width: 95%; margin-bottom: 10px;">
                    <div id="eza-vehicle-list" style="max-height: 40vh; overflow-y: auto;"></div>
                </div>
            </div>`;

        const listContainer = modal.querySelector('#eza-vehicle-list');
        const searchInput = modal.querySelector('#eza-vehicle-search');

        const renderList = (filter = '') => {
            listContainer.innerHTML = '';
            const lowerFilter = filter.toLowerCase();
            const currentTypes = config.vehicleHighlights[ruleIndex].types;

            VEHICLE_LIST
                .filter(v => !currentTypes.includes(v.id) && v.name.toLowerCase().includes(lowerFilter))
                .forEach(vehicle => {
                    const item = document.createElement('div');
                    item.className = 'eza-vehicle-list-item';
                    item.textContent = vehicle.name;
                    item.dataset.id = vehicle.id;
                    item.addEventListener('click', () => {
                        config.vehicleHighlights[ruleIndex].types.push(vehicle.id);
                        modal.style.display = 'none';
                        renderVehicleHighlightSettings();
                    });
                    listContainer.appendChild(item);
                });
        };

        searchInput.addEventListener('input', () => renderList(searchInput.value));
        modal.querySelector('.eza-close-btn').addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

        renderList();
        modal.style.display = 'block';
    }


    function createSettingsModal() {
        if (document.getElementById('eza-settings-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'eza-settings-modal';
        modal.innerHTML = `
            <div class="eza-modal-content">
                <div class="eza-modal-header">
                    <h2>EZA-Einstellungen</h2>
                    <span class="eza-close-btn">&times;</span>
                </div>
                <div class="eza-modal-body">
                    <h4>Panel-Verhalten</h4>
                    <div class="eza-setting">
                        <label for="eza-cfg-navbar">Panel in Navbar fixieren</label>
                        <input type="checkbox" id="eza-cfg-navbar" ${config.PANEL_FEST_IN_NAVBAR ? 'checked' : ''}>
                    </div>
                    <div class="eza-setting">
                        <label for="eza-cfg-zindex">Panel Z-Index (bei Überlappung)</label>
                        <input type="number" id="eza-cfg-zindex" value="${config.Z_INDEX_DRAGGABLE_PANEL}">
                    </div>
                    <hr>
                    <h4>Fahrzeug-Hervorhebungen</h4>
                    <div id="eza-vehicle-highlights-container"></div>
                    <button id="eza-add-rule-btn" class="eza-add-btn">+ Neue Regel</button>
                    <hr>
                    <h4>Textvorlagen</h4>
                    <div class="eza-setting-col">
                        <label for="eza-cfg-reply-tpl">Rückmeldung (<code>%%ZEIT%%</code> wird ersetzt)</label>
                        <input type="text" id="eza-cfg-reply-tpl" value="${config.TEXT_FOR_MISSION_REPLY_TEMPLATE}">
                    </div>
                    <div class="eza-setting-col">
                        <label for="eza-cfg-recall-owner">Abzug mit Besitzer (<code>%%OWNER%%</code>, <code>%%UNIT_TYPE%%</code>)</label>
                        <input type="text" id="eza-cfg-recall-owner" value="${config.VEHICLE_RECALL_TEXT_WITH_OWNER_TEMPLATE}">
                    </div>
                    <div class="eza-setting-col">
                        <label for="eza-cfg-recall-noowner">Abzug ohne Besitzer (<code>%%UNIT_TYPE%%</code>)</label>
                        <input type="text" id="eza-cfg-recall-noowner" value="${config.VEHICLE_RECALL_TEXT_NO_OWNER_TEMPLATE}">
                    </div>
                    <hr>
                    <h4>Allgemein</h4>
                     <div class="eza-setting">
                        <label for="eza-cfg-countdown">Countdown im Einsatzfenster anzeigen</label>
                        <input type="checkbox" id="eza-cfg-countdown" ${config.SHOW_ALARM_WINDOW_COUNTDOWN_TEXT ? 'checked' : ''}>
                    </div>
                    <div class="eza-setting">
                        <label for="eza-cfg-hotkey">Hotkey zum Ausblenden in der Einsatzliste</label>
                        <input type="text" id="eza-cfg-hotkey" value="${config.HOTKEY_HIDE_ENDZEIT}" maxlength="1" style="text-transform: lowercase;">
                    </div>
                </div>
                <div class="eza-modal-footer">
                    <button id="eza-save-btn">Speichern & Schließen</button>
                    <button id="eza-cancel-btn">Abbrechen</button>
                    <small style="margin-left: auto; opacity: 0.7;">Seite neuladen, falls Panel-Position sich nicht ändert.</small>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        renderVehicleHighlightSettings();

        const closeModal = () => modal.style.display = 'none';

        modal.querySelector('.eza-close-btn').addEventListener('click', closeModal);
        modal.querySelector('#eza-cancel-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.getElementById('eza-add-rule-btn').addEventListener('click', () => {
            config.vehicleHighlights.push({ enabled: true, name: '', color: '#ffff00', types: [], alert: false });
            renderVehicleHighlightSettings();
        });

        modal.querySelector('#eza-save-btn').addEventListener('click', () => {
            config.PANEL_FEST_IN_NAVBAR = document.getElementById('eza-cfg-navbar').checked;
            config.Z_INDEX_DRAGGABLE_PANEL = document.getElementById('eza-cfg-zindex').value;
            config.TEXT_FOR_MISSION_REPLY_TEMPLATE = document.getElementById('eza-cfg-reply-tpl').value;
            config.VEHICLE_RECALL_TEXT_WITH_OWNER_TEMPLATE = document.getElementById('eza-cfg-recall-owner').value;
            config.VEHICLE_RECALL_TEXT_NO_OWNER_TEMPLATE = document.getElementById('eza-cfg-recall-noowner').value;
            config.SHOW_ALARM_WINDOW_COUNTDOWN_TEXT = document.getElementById('eza-cfg-countdown').checked;
            config.HOTKEY_HIDE_ENDZEIT = document.getElementById('eza-cfg-hotkey').value.toLowerCase();

            const newHighlights = [];
            document.querySelectorAll('#eza-vehicle-highlights-container .eza-sub-setting').forEach((ruleDiv, index) => {
                 const currentRule = config.vehicleHighlights[index];
                 newHighlights.push({
                    enabled: ruleDiv.querySelector('.eza-rule-enabled').checked,
                    name: ruleDiv.querySelector('.eza-rule-name').value,
                    color: ruleDiv.querySelector('.eza-rule-color').value,
                    types: currentRule.types,
                    alert: ruleDiv.querySelector('.eza-rule-alert').checked
                });
            });
            config.vehicleHighlights = newHighlights;

            saveConfig();
            closeModal();
            if (window.location.pathname.startsWith('/missions/')) {
                highlightVehicles(document.querySelector('#mission_end_time')?.valueAsNumber / 1000 || Infinity);
            }
        });
    }

    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #eza-settings-modal {
                display: none;
                justify-content: center;
                align-items: center;
                position: fixed; z-index: 10000;
                left: 0; top: 0; width: 100%; height: 100%;
                overflow: auto; background-color: rgba(0,0,0,0.6);
                font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            .eza-modal-content {
                background-color: #2c3e50; color: #ecf0f1;
                margin: 0;
                padding: 0;
                border: 1px solid #34495e; border-radius: 8px;
                width: 90%;
                max-width: 1400px !important;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                animation: eza-modal-appear 0.3s ease-out;
            }
            @keyframes eza-modal-appear { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .eza-modal-header {
                padding: 12px 20px; background-color: #34495e;
                border-bottom: 1px solid #273749; border-radius: 8px 8px 0 0;
                display: flex; justify-content: space-between; align-items: center;
            }
            .eza-modal-header h2, .eza-modal-header h3 { margin: 0; font-size: 1.4em; }
            .eza-close-btn { color: #ecf0f1; font-size: 28px; font-weight: bold; cursor: pointer; }
            .eza-close-btn:hover { color: #bdc3c7; }
            .eza-modal-body {
                display: flex !important;
                flex-direction: column !important;
                padding: 10px 20px 20px 20px;
                max-height: 70vh;
                overflow-y: auto;
            }
            .eza-modal-body h4 { margin-top: 20px; border-bottom: 1px solid #3498db; padding-bottom: 5px; color: #3498db;}
            .eza-modal-body hr { border: 0; height: 1px; background-color: #34495e; margin: 20px 0; width: 100%; }
            .eza-setting { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px; }
            .eza-setting-col { display: flex; flex-direction: column; margin-bottom: 12px; }
            .eza-setting-col label { margin-bottom: 5px; }
            .eza-modal-body label { font-size: 1em; }
            .eza-modal-body input[type="text"], .eza-modal-body input[type="number"] {
                background-color: #273749; border: 1px solid #34495e; color: #ecf0f1;
                padding: 8px; border-radius: 4px; box-sizing: border-box;
            }
            .eza-setting > input[type="text"], .eza-setting > input[type="number"] { width: 250px; }
            .eza-setting-col input { width: 100%; }
            .eza-modal-body input[type="checkbox"] { width: 20px; height: 20px; accent-color: #3498db; }
            .eza-modal-body code { background-color: #27ae60; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
            .eza-modal-footer {
                padding: 12px 20px; background-color: #34495e;
                border-top: 1px solid #273749; border-radius: 0 0 8px 8px;
                display: flex; justify-content: flex-start; align-items: center; gap: 10px;
            }
            .eza-modal-footer button {
                border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer;
                color: white; font-weight: bold; transition: background-color 0.2s;
            }
            #eza-save-btn { background-color: #27ae60; }
            #eza-save-btn:hover { background-color: #2ecc71; }
            #eza-cancel-btn { background-color: #c0392b; }
            #eza-cancel-btn:hover { background-color: #e74c3c; }

            #eza-settings-button { cursor: pointer; margin-left: 8px; font-size: 14px; user-select: none; transition: transform 0.2s; }
            #eza-settings-button:hover { transform: rotate(45deg); }

            .eza-sub-setting { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 5px; background-color: rgba(0,0,0,0.2); margin-bottom: 8px; flex-wrap: wrap; }
            .eza-sub-setting .eza-rule-label { display: flex; align-items: center; gap: 5px; }
            .eza-rule-name, .eza-pill-container { flex: 1; min-width: 150px; box-sizing: border-box; }
            .eza-pill-container { display: flex; flex-wrap: wrap; gap: 5px; border: 1px solid #34495e; background-color: #273749; padding: 4px 8px; border-radius: 4px; min-height: 39px; align-items: center; }
            .eza-vehicle-pill { background-color: #3498db; padding: 3px 8px; border-radius: 10px; font-size: 0.9em; white-space: nowrap; }
            .eza-pill-remove { margin-left: 5px; cursor: pointer; font-weight: bold; }
            .eza-pill-remove:hover { color: #e74c3c; }
            .eza-add-vehicle-btn { background: none; border: 1px dashed #3498db; color: #3498db; padding: 5px 10px; border-radius: 4px; cursor: pointer; flex-shrink: 0; }
            .eza-add-vehicle-btn:hover { background: #34495e; color: white; }
            input[type="color"] { min-width: 35px; height: 25px; padding: 0; border: 1px solid #34495e; background: none; cursor: pointer; }
            button.eza-rule-remove-main { background: #c0392b; border: none; color: white; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-weight: bold; margin-left: auto; line-height: 20px; padding: 0; flex-shrink: 0; }
            button.eza-rule-remove-main:hover { background: #e74c3c; }
            button.eza-add-btn { background: #27ae60; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
            button.eza-add-btn:hover { background: #2ecc71; }

            .eza-sub-modal { display: none; position: fixed; z-index: 10001; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.8); }
            .eza-vehicle-list-item { padding: 8px; cursor: pointer; border-bottom: 1px solid #34495e; }
            .eza-vehicle-list-item:hover { background-color: #3498db; }

            @keyframes blink { 0% { background-color: red; color: white; } 50% { background-color: yellow; color: black; } 100% { background-color: red; color: white; } }
            .blink-animation { animation: blink 1s linear 5; }
            @keyframes blink-green { 0% { background-color: #2ecc71; color: white; } 50% { background-color: #82E0AA; color: black; } 100% { background-color: #2ecc71; color: white; } }
            .blink-green-animation { animation: blink-green 1s linear 5; }
        `;
        document.head.appendChild(style);
    }

    function applyDraggablePanelLogic(panelDiv) {
        const pos = loadPanelPosition();
        const panelColors = isDarkMode()
            ? { background: '#1e1e1e', color: '#fff', border: '2px solid #c0392b' } // Dunkler Modus: Dickerer roter Rand
            : { background: '#ffffff', color: '#000', border: '2px solid #c0392b' }; // Heller Modus: Weißer Hintergrund, dickerer roter Rand

        Object.assign(panelDiv.style, {
            position: 'absolute', top: `${pos?.top ?? 100}px`, left: `${pos?.left ?? 100}px`,
            zIndex: config.Z_INDEX_DRAGGABLE_PANEL,
            background: panelColors.background,
            color: panelColors.color,
            border: panelColors.border,
            boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            cursor: 'move',
            userSelect: 'none',
        });
        document.body.appendChild(panelDiv);

        let isDragging = false, offsetX, offsetY;

        const handleDragStart = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.id === 'creditDisplayPanel' || e.target.id === 'eza-settings-button' ||
                e.target.closest('.eza-time-input-container')) {
                return;
            }
            if (e.cancelable) e.preventDefault();

            isDragging = true;
            const coords = e.touches ? e.touches[0] : e;
            offsetX = coords.clientX - panelDiv.getBoundingClientRect().left;
            offsetY = coords.clientY - panelDiv.getBoundingClientRect().top;
        };

        const handleDragMove = (e) => {
            if (!isDragging) return;
            if (e.touches && e.cancelable) e.preventDefault();

            const coords = e.touches ? e.touches[0] : e;
            panelDiv.style.left = `${coords.clientX - offsetX}px`;
            panelDiv.style.top = `${coords.clientY - offsetY}px`;
        };

        const handleDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            savePanelPosition(panelDiv.getBoundingClientRect().left, panelDiv.getBoundingClientRect().top);
        };

        panelDiv.addEventListener('mousedown', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);

        panelDiv.addEventListener('touchstart', handleDragStart, { passive: false });
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
    }

    function setupPanelButtons(panelElement) {
        creditDisplayGlobal = panelElement.querySelector('#creditDisplayPanel');
        const btnNextEnd = panelElement.querySelector('#btnNextEnd');
        if (btnNextEnd) {
            Object.assign(btnNextEnd.style, { backgroundColor: '#D3D3D3', color: '#ff0000', border: 'none', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 4px rgba(255,0,0,0.6)', fontSize: '11px' });
            btnNextEnd.addEventListener('click', () => {
                if (einsatzMitFruehestemEnde) {
                    einsatzMitFruehestemEnde.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const panelHeading = einsatzMitFruehestemEnde.querySelector(`div[id^="mission_panel_heading_"]`);
                    if (panelHeading) {
                        const endzeitAnzeigeElement = panelHeading.querySelector('.endzeit-anzeige');
                        if (endzeitAnzeigeElement) {
                            const computedStyle = window.getComputedStyle(endzeitAnzeigeElement);
                            const currentBgColor = computedStyle.backgroundColor;
                            let animationClassToAdd = 'blink-animation';

                            if (currentBgColor === 'rgb(46, 204, 113)') {
                                animationClassToAdd = 'blink-green-animation';
                            }

                            endzeitAnzeigeElement.classList.remove('blink-animation', 'blink-green-animation');
                            setTimeout(() => {
                                endzeitAnzeigeElement.classList.add(animationClassToAdd);
                                setTimeout(() => {
                                    endzeitAnzeigeElement.classList.remove(animationClassToAdd);
                                }, 5000);
                            }, 10);
                        }
                    }
                }
            });
        }
        const btnResetIgnored = panelElement.querySelector('#btnResetIgnored');
        if(btnResetIgnored) {
            Object.assign(btnResetIgnored.style, { backgroundColor: '#666', color: '#fff', border: 'none', padding: '3px 7px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', lineHeight: '1', boxShadow: '0 0 4px rgba(255,255,255,0.4)', userSelect: 'none' });
            btnResetIgnored.addEventListener('click', () => { ignoredEinsaetze.clear(); saveIgnored(); if (typeof addEndTimes === 'function') addEndTimes(); });
        }
        const btnToggleChaos = panelElement.querySelector('#btnToggleChaos');
        if (btnToggleChaos) {
            const updateChaosButtonStyles = () => { Object.assign(btnToggleChaos.style, { backgroundColor: chaosMode ? '#e74c3c' : '#27ae60', color: '#fff', boxShadow: chaosMode ? '0 0 6px rgba(231,76,60,0.8)' : '0 0 6px rgba(39,174,96,0.8)' }); };
            updateChaosButtonStyles();
            Object.assign(btnToggleChaos.style, { border: 'none', padding: '3px 8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' });
            btnToggleChaos.addEventListener('click', () => { chaosMode = !chaosMode; btnToggleChaos.textContent = `Chaostage: ${chaosMode ? 'AN' : 'AUS'}`; updateChaosButtonStyles(); saveChaosMode(); if (typeof addEndTimes === 'function' && window.location.pathname === '/') addEndTimes(); if (typeof addEndTimeToMissionContent === 'function' && window.location.pathname.startsWith('/missions/')) addEndTimeToMissionContent(); });
        }
        const btnSettings = panelElement.querySelector('#eza-settings-button');
        if (btnSettings) {
            btnSettings.addEventListener('click', () => {
                const modal = document.getElementById('eza-settings-modal');
                if (modal) {
                    renderVehicleHighlightSettings();
                    modal.style.display = 'flex';
                }
            });
        }
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'endzeit-panel';
        Object.assign(panel.style, { display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', fontSize: '11px', fontWeight: '600', padding: '4px 6px', borderRadius: '6px' });
        panel.innerHTML = `
            <button id="btnNextEnd" title="Zur nächsten Endzeit springen">Nächste Endzeit: N/A</button>
            <button id="btnResetIgnored" title="Ignorierte Einsätze zurücksetzen">↺</button>
            <button id="btnToggleChaos" title="Chaostage an/aus">Chaostage: ${chaosMode ? 'AN' : 'AUS'}</button>
            <div id="creditDisplayPanel" title="Summe Credits (Verband + Eigene)" style="background:#2980b9; width:16px; height:16px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:11px; cursor: default; user-select:none;">ⓘ</div>
            <span id="eza-settings-button" title="Einstellungen">⚙️</span>
        `;

        if (config.PANEL_FEST_IN_NAVBAR) {
            const mainNavbar = document.getElementById('main_navbar') || document.querySelector('nav.navbar');
            const searchForm = mainNavbar ? (mainNavbar.querySelector('form.navbar-form') || mainNavbar.querySelector('input[placeholder="Ort suchen..."], input[placeholder="Search missions..."]')) : null;
            const targetContainer = searchForm ? searchForm.parentNode : (mainNavbar ? mainNavbar.querySelector('#navbar-main-collapse') : null);
            if (targetContainer) {
                Object.assign(panel.style, { display: 'inline-flex', verticalAlign: 'middle', margin: '0 10px 0 5px', background: 'transparent', border: 'none', flexGrow: '0', flexShrink: '0', flexBasis: 'auto' });
                if (searchForm && targetContainer === searchForm.parentNode) targetContainer.insertBefore(panel, searchForm);
                else if (targetContainer.id === 'navbar-main-collapse') targetContainer.insertBefore(panel, targetContainer.firstChild);
                else if (mainNavbar) { const brand = targetContainer.querySelector('.navbar-brand'); if (brand?.nextSibling) targetContainer.insertBefore(panel, brand.nextSibling); else if (brand) targetContainer.appendChild(panel); else targetContainer.insertBefore(panel, targetContainer.firstChild); }
                else { applyDraggablePanelLogic(panel); }
            } else applyDraggablePanelLogic(panel);
        } else {
            applyDraggablePanelLogic(panel);
        }
        setupPanelButtons(panel);
    }

    // ================================================================
    // FINALE, VERBESSERTE SORTIERFUNKTION (V2)
    // ================================================================
    function performIntelligentSort(containerId, direction) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const missions = Array.from(container.querySelectorAll('.missionSideBarEntry'));

        const getSortableTime = (missionElement) => {
            const missionId = missionElement.getAttribute('mission_id');
            if (!missionId) return Infinity;

            let data = ownMissionFixedEndTimes[missionId];
            if (data && data.endTime) {
                return data.endTime;
            }

            data = allianceMissionData[missionId];
            if (data) {
                if (data.manualEndTime) {
                    return data.manualEndTime;
                }
                if (data.genTime && typeof data.avgCredits !== 'undefined') {
                    const missionTypeId = data.missionTypeId || missionTypeCache[missionId];
                    const isGsl = SPECIFIC_IDS_FOR_6H_RULE.includes(missionTypeId);

                    if (isGsl) {
                        return data.genTime + 21600;
                    } else {
                        return data.genTime + calculateOffset(data.avgCredits, false);
                    }
                }
            }
            return Infinity;
        };

        missions.sort((a, b) => {
            const missionIdA = a.getAttribute('mission_id');
            const missionIdB = b.getAttribute('mission_id');

            // NEU: Prüfen, ob einer der Einsätze ignoriert ist.
            const isIgnoredA = ignoredEinsaetze.has(missionIdA);
            const isIgnoredB = ignoredEinsaetze.has(missionIdB);

            // NEU: Regel 1 - Ignorierte Einsätze immer nach unten schieben.
            if (isIgnoredA && !isIgnoredB) {
                return 1; // A ist ignoriert, B nicht -> A kommt nach B.
            }
            if (!isIgnoredA && isIgnoredB) {
                return -1; // B ist ignoriert, A nicht -> A kommt vor B.
            }

            // Regel 2 - Wenn beide ignoriert oder beide nicht ignoriert sind, nach Zeit sortieren.
            const endTimeA = getSortableTime(a);
            const endTimeB = getSortableTime(b);

            if (direction === 'asc') {
                return endTimeA - endTimeB;
            } else {
                return endTimeB - endTimeA;
            }
        });

        missions.forEach(mission => container.appendChild(mission));
    }

    function highlightVehicles(currentEndTimestamp) {
        const configMap = new Map();
        config.vehicleHighlights.forEach(rule => {
            if (rule.enabled && rule.types && Array.isArray(rule.types)) {
                rule.types.forEach(typeId => {
                    if (!configMap.has(typeId)) {
                        configMap.set(typeId, { color: rule.color, alert: rule.alert });
                    }
                });
            }
        });

        let alertedCount = 0;
        const vehicleRows = document.querySelectorAll('#mission_vehicle_at_mission tbody tr, #mission_vehicle_driving tbody tr');

        vehicleRows.forEach(row => {
            row.style.backgroundColor = '';

            const vehicleLink = row.querySelector('[vehicle_type_id]');
            const vehicleType = vehicleLink?.getAttribute('vehicle_type_id');

            if (!vehicleType) return;

            const rule = configMap.get(vehicleType);
            if (rule) {
                row.style.backgroundColor = rule.color;
                if (rule.alert) {
                    alertedCount++;
                }
            }
        });

        const missionH1 = document.getElementById('missionH1');
        if (!missionH1) return;

        const oldAlertSpan = missionH1.querySelector('.eza-vehicle-alert');
        if (oldAlertSpan) oldAlertSpan.remove();

        if (alertedCount > 0 && currentEndTimestamp * 1000 > Date.now()) {
            const alertSpan = document.createElement('span');
            alertSpan.className = 'eza-vehicle-alert';
            alertSpan.textContent = ` ⚠️${alertedCount.toLocaleString()}⚠️`;
            alertSpan.style.cursor = "pointer";
            alertSpan.title = `Es wurden ${alertedCount} wichtige Fahrzeuge an diesem Einsatz gefunden.`;
            missionH1.appendChild(alertSpan);
        }
    }

   function addEndTimeToMissionContent() {
        if (!window.location.pathname.startsWith('/missions/')) { return; }

        const missionH1Element = document.getElementById('missionH1');
        if (!missionH1Element) { return; }

        let missionId = window.location.pathname.split('/')[2];
        if (!missionId) {
            const missionIdInput = document.getElementById('mission_reply_mission_id');
            if (missionIdInput) missionId = missionIdInput.value;
            else { const missionIdLink = missionH1Element.querySelector('a[href*="mission_id="]'); if (missionIdLink) { const hrefMatch = missionIdLink.href.match(/mission_id=(\d+)/); if (hrefMatch && hrefMatch[1]) missionId = hrefMatch[1]; } }
        }
        if (!missionId) { return; }

        clearMissionInterval(missionId);
        const feedbackHeadingElement = document.getElementById('h2_write_feedback');
        let missionContentContainerForInsertion = feedbackHeadingElement ? feedbackHeadingElement.parentNode : missionH1Element.parentNode;
        let insertionReferenceNode = feedbackHeadingElement || missionH1Element;
        if (!missionContentContainerForInsertion || !insertionReferenceNode) { return; }

        let endzeitAnzeige = missionContentContainerForInsertion.querySelector(`.endzeit-alarmfenster-anzeige[data-mission-id="${missionId}"]`);

        const missionTypeIdFromCache = missionTypeCache[missionId];
        const isExcludedType = missionTypeIdFromCache && EXCLUDED_MISSION_TYPE_IDS.includes(missionTypeIdFromCache.trim());

        let currentEndTimestamp = null, initialGenerationTimestampForDisplay = null;
        let shouldDisplayRegularTime = false;
        let isCurrentlyOwnDisplayed = false;
        let avgCreditsForContext = null;
        let genTimeForContext = null;
        let actualDisplayGSLSuffix = false;

        if (isExcludedType) {
            clearMissionInterval(missionId);
            if (!endzeitAnzeige) {
                endzeitAnzeige = document.createElement('div');
                endzeitAnzeige.className = 'endzeit-alarmfenster-anzeige';
                endzeitAnzeige.setAttribute('data-mission-id', missionId);
                Object.assign(endzeitAnzeige.style, { marginTop: '10px', marginBottom: '10px', padding: '8px 12px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1em', textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'default' });
                insertionReferenceNode.parentNode.insertBefore(endzeitAnzeige, insertionReferenceNode.nextSibling);
            }
            endzeitAnzeige.innerHTML = '';
            endzeitAnzeige.title = '';
            const excludedMessageSpan = document.createElement('span');
            excludedMessageSpan.textContent = "⚡ Stromausfall - Keine Endzeit ⚡";
            excludedMessageSpan.style.color = 'orange';
            endzeitAnzeige.appendChild(excludedMessageSpan);
            endzeitAnzeige.style.display = 'flex';
        } else {
            const ownDataEntry = ownMissionFixedEndTimes[missionId];
            if (ownDataEntry) {
                if (typeof ownDataEntry === 'object' && ownDataEntry.endTime !== undefined) {
                    currentEndTimestamp = ownDataEntry.endTime;
                    initialGenerationTimestampForDisplay = ownDataEntry.startTime;
                } else if (typeof ownDataEntry === 'number') {
                    currentEndTimestamp = ownDataEntry;
                    initialGenerationTimestampForDisplay = null;
                }
                if (currentEndTimestamp !== undefined && currentEndTimestamp !== null) {
                    shouldDisplayRegularTime = true;
                    isCurrentlyOwnDisplayed = true;
                    avgCreditsForContext = null;
                    genTimeForContext = initialGenerationTimestampForDisplay;
                }
            }

            if (!isCurrentlyOwnDisplayed) {
                const storedAllianceMission = allianceMissionData[missionId];
                if (storedAllianceMission) {
                    if (storedAllianceMission.genTime !== undefined) {
                        initialGenerationTimestampForDisplay = Number(storedAllianceMission.genTime);
                    }
                    avgCreditsForContext = storedAllianceMission.avgCredits;
                    genTimeForContext = initialGenerationTimestampForDisplay;

                    if (storedAllianceMission.manualEndTime !== undefined) {
                        currentEndTimestamp = storedAllianceMission.manualEndTime;
                    } else {
                         if (initialGenerationTimestampForDisplay !== null && avgCreditsForContext !== undefined) {
                            const typeIdForCalc = storedAllianceMission.missionTypeId || missionTypeCache[missionId];
                            const isMissingForCalc = !typeIdForCalc || typeIdForCalc.trim() === "" || typeIdForCalc.trim().toLowerCase() === "null";
                            const isSpecificForCalc = typeIdForCalc && SPECIFIC_IDS_FOR_6H_RULE.includes(typeIdForCalc.trim());

                            if (isMissingForCalc || isSpecificForCalc) {
                                currentEndTimestamp = initialGenerationTimestampForDisplay + 21600;
                            } else {
                                currentEndTimestamp = initialGenerationTimestampForDisplay + calculateOffset(avgCreditsForContext, false);
                            }
                        }
                    }
                    if (currentEndTimestamp !== null) {
                        shouldDisplayRegularTime = true;
                    }
                }
            }

            highlightVehicles(currentEndTimestamp);

            if (shouldDisplayRegularTime && currentEndTimestamp !== null) {
                if (!endzeitAnzeige) {
                    endzeitAnzeige = document.createElement('div');
                    endzeitAnzeige.className = 'endzeit-alarmfenster-anzeige';
                    endzeitAnzeige.setAttribute('data-mission-id', missionId);
                    Object.assign(endzeitAnzeige.style, { marginTop: '10px', marginBottom: '10px', padding: '8px 12px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1em', textAlign: 'left', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' });
                    insertionReferenceNode.parentNode.insertBefore(endzeitAnzeige, insertionReferenceNode.nextSibling);
                } else {
                    endzeitAnzeige.innerHTML = '';
                }
                endzeitAnzeige.style.display = 'flex';
                endzeitAnzeige.style.cursor = 'default';
                window.ezaLastTooltipTitles[missionId] = null;

                let rdStatusSpan = document.createElement('span');
                Object.assign(rdStatusSpan.style, { marginRight: '8px', fontWeight: 'bold', display: 'none', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '1em' });
                endzeitAnzeige.appendChild(rdStatusSpan);

                let rdSeparatorSpan = document.createElement('span');
                rdSeparatorSpan.textContent = '|';
                Object.assign(rdSeparatorSpan.style, { marginRight: '8px', fontWeight: 'bold', display: 'none' });
                endzeitAnzeige.appendChild(rdSeparatorSpan);

                const textContainer = document.createElement('span');
                Object.assign(textContainer.style, { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.3' });
                textContainer.style.cursor = 'pointer';
                textContainer.addEventListener('click', (e) => {
                     if (e.target.closest('.elw-fukw-status-span')) return;
                     const missionReplyContentInput = document.getElementById('mission_reply_content');
                     if (missionReplyContentInput && currentEndTimestamp) {
                         const displayedTime = formatTime(currentEndTimestamp);
                         missionReplyContentInput.value = config.TEXT_FOR_MISSION_REPLY_TEMPLATE.replace('%%ZEIT%%', displayedTime);
                         missionReplyContentInput.focus();
                     }
                });
                endzeitAnzeige.appendChild(textContainer);

                const mainEndTimeTextSpan = document.createElement('span');
                mainEndTimeTextSpan.style.fontWeight = 'bold';

                const timeTextOnlySpan = document.createElement('span');
                timeTextOnlySpan.textContent = `Voraussichtliches Einsatz-Ende: ${formatTime(currentEndTimestamp)}`;
                mainEndTimeTextSpan.appendChild(timeTextOnlySpan);

                const missionTypeForThisMission = missionTypeIdFromCache ||
                    (isCurrentlyOwnDisplayed ? null : (allianceMissionData[missionId] && allianceMissionData[missionId].missionTypeId)) ||
                    document.querySelector(`#mission_list .missionSideBarEntry[mission_id="${missionId}"]`)?.getAttribute('mission_type_id') ||
                    document.querySelector(`#mission_list_alliance .missionSideBarEntry[mission_id="${missionId}"]`)?.getAttribute('mission_type_id');

                if (missionTypeForThisMission) {
                    const isMissing = !missionTypeForThisMission || missionTypeForThisMission.trim() === "" || missionTypeForThisMission.trim().toLowerCase() === "null";
                    const isSpecific = SPECIFIC_IDS_FOR_6H_RULE.includes(missionTypeForThisMission.trim());
                    if (isMissing || isSpecific) {
                        actualDisplayGSLSuffix = true;
                    }
                }

                if (actualDisplayGSLSuffix) {
                    const gslSuffixSpan = document.createElement('span');
                    gslSuffixSpan.textContent = "(GSL)";
                    Object.assign(gslSuffixSpan.style, {
                        backgroundColor: 'red', color: 'white', padding: '2px 5px',
                        borderRadius: '4px', marginLeft: '6px', fontSize: '0.9em',
                        display: 'inline-block'
                    });
                    mainEndTimeTextSpan.appendChild(gslSuffixSpan);
                }

                if (config.SHOW_ALARM_WINDOW_COUNTDOWN_TEXT) {
                    mainEndTimeTextSpan.appendChild(document.createTextNode(" | "));
                    const countdownSpan = document.createElement('span');
                    countdownSpan.style.fontWeight = 'bold';
                    mainEndTimeTextSpan.appendChild(countdownSpan);
                }
                textContainer.appendChild(mainEndTimeTextSpan);

                const entryTimeTextSpan = document.createElement('span');
                Object.assign(entryTimeTextSpan.style, { fontSize: '0.85em', color: '#bdc3c7' });
                entryTimeTextSpan.textContent = initialGenerationTimestampForDisplay ? `(Eingang: ${formatTime(initialGenerationTimestampForDisplay)})` : '';
                textContainer.appendChild(entryTimeTextSpan);

                let elwFukwStatusSpan = document.createElement('span');
                elwFukwStatusSpan.className = 'elw-fukw-status-span';
                Object.assign(elwFukwStatusSpan.style, {
                    padding: '2px 6px', borderRadius: '4px', fontSize: '0.9em',
                    fontWeight: 'bold', textAlign: 'center', display: 'none'
                });
                endzeitAnzeige.appendChild(elwFukwStatusSpan);


                if (!ignoredEinsaetze.has(missionId)) {
                    const hideButton = document.createElement('span');
                    Object.assign(hideButton.style, { marginLeft: 'auto', cursor: 'pointer', fontSize: '1.4em', alignSelf: 'center', padding: '0 5px' });
                    hideButton.textContent = '🗑️';
                    hideButton.title = `Diese Mission auf der Hauptseite ausblenden (Hotkey: ${config.HOTKEY_HIDE_ENDZEIT.toUpperCase()})`;
                    hideButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        ignoredEinsaetze.add(missionId);
                        saveIgnored();
                        hideButton.textContent = '✔️';
                        hideButton.style.cursor = 'default';
                        hideButton.style.color = '#2ecc71';
                        hideButton.title = 'Mission ist auf der Hauptseite ausgeblendet.';
                    }, { once: true });
                    endzeitAnzeige.appendChild(hideButton);
                }

                const updateCountdownDisplay = () => {
                    if (!document.body.contains(endzeitAnzeige)) {
                        clearMissionInterval(missionId);
                        return;
                    }
                    const now = Math.floor(Date.now() / 1000);
                    const timeLeftInSeconds = currentEndTimestamp - now;

                    const newTitleText = (initialGenerationTimestampForDisplay ? `Eingang: ${formatTime(initialGenerationTimestampForDisplay)} | ` : '') + formatTimeLeftForTooltip(timeLeftInSeconds);
                    if (window.ezaLastTooltipTitles[missionId] !== newTitleText) {
                        endzeitAnzeige.title = newTitleText;
                        window.ezaLastTooltipTitles[missionId] = newTitleText;
                    }

                    const statusColor = timeLeftInSeconds <= 0 ? '#2ecc71' : (timeLeftInSeconds <= 1800 ? 'orange' : '#e74c3c');
                    timeTextOnlySpan.style.color = statusColor;

                    if (config.SHOW_ALARM_WINDOW_COUNTDOWN_TEXT) {
                        const countdownSpan = mainEndTimeTextSpan.querySelector('span:last-child');
                        if(countdownSpan) {
                            countdownSpan.textContent = formatTimeLeft(timeLeftInSeconds);
                            countdownSpan.style.color = statusColor;
                        }
                    }

                    if (!isCurrentlyOwnDisplayed && initialGenerationTimestampForDisplay) {
                        const elapsedTimeSeconds = now - initialGenerationTimestampForDisplay;
                        rdStatusSpan.style.display = 'inline-block';
                        rdSeparatorSpan.style.display = 'inline-block';

                        if (elapsedTimeSeconds <= 900) {
                            if (actualDisplayGSLSuffix) {
                                rdStatusSpan.textContent = "RD gesperrt";
                                rdStatusSpan.style.backgroundColor = "red";
                            } else {
                                rdStatusSpan.textContent = "RD begrenzt";
                                rdStatusSpan.style.backgroundColor = "orange";
                            }
                        } else {
                            rdStatusSpan.textContent = "RD Frei";
                            rdStatusSpan.style.backgroundColor = "#2ecc71";
                        }
                    } else {
                        rdStatusSpan.style.display = 'none';
                        rdSeparatorSpan.style.display = 'none';
                    }

                    if (timeLeftInSeconds > 0) {
                        function _getCommandUnitDetailsForTypeList(vehicleTypeIds, unitTypeStringParam) {
                            const foundVehicles = [];
                            function searchTableForDetails(table, currentStatus) {
                                if (!table) return;
                                table.querySelectorAll('tbody tr[id^="vehicle_row_"]').forEach(row => {
                                    const vehicleLink = row.querySelector(`a[vehicle_type_id]`);
                                    if (vehicleLink && vehicleTypeIds.includes(vehicleLink.getAttribute('vehicle_type_id'))) {
                                        const ownerLinkNode = row.querySelector('a[href*="/profile/"]');
                                        foundVehicles.push({
                                            status: currentStatus,
                                            ownerName: ownerLinkNode ? ownerLinkNode.textContent.trim() : "Unbekannt",
                                            unitTypeString: unitTypeStringParam
                                        });
                                    }
                                });
                            }
                            searchTableForDetails(document.getElementById('mission_vehicle_at_mission'), "vor Ort");
                            searchTableForDetails(document.getElementById('mission_vehicle_driving'), "auf dem Weg");
                            return foundVehicles;
                        }

                        const elwList = _getCommandUnitDetailsForTypeList(ELW_VEHICLE_IDS, "ELW");
                        const fukwList = _getCommandUnitDetailsForTypeList(FUKW_VEHICLE_IDS, "FüKW");
                        const allFoundCommandUnits = [...elwList, ...fukwList];

                        if (allFoundCommandUnits.length > 0) {
                            let statusTextParts = [];
                            if (elwList.length > 0) statusTextParts.push(elwList.length > 1 ? `${elwList.length}x ELW` : "ELW");
                            if (fukwList.length > 0) statusTextParts.push(fukwList.length > 1 ? `${fukwList.length}x FüKW` : "FüKW");
                            const overallStatus = allFoundCommandUnits.some(v => v.status === "vor Ort") ? "vor Ort" : "auf dem Weg";

                            elwFukwStatusSpan.textContent = `${statusTextParts.join(" & ")} ${overallStatus}`;
                            elwFukwStatusSpan.style.color = 'white';
                            elwFukwStatusSpan.style.backgroundColor = 'red';
                            elwFukwStatusSpan.style.display = 'inline-block';
                            elwFukwStatusSpan.style.cursor = 'pointer';

                            elwFukwStatusSpan.onclick = (e) => {
                                e.stopPropagation();
                                const missionReplyInput = document.getElementById('mission_reply_content');
                                if (!missionReplyInput) return;

                                const ownerGrouped = allFoundCommandUnits.reduce((acc, unit) => {
                                    if (!acc[unit.ownerName]) acc[unit.ownerName] = new Set();
                                    acc[unit.ownerName].add(unit.unitTypeString);
                                    return acc;
                                }, {});

                                const messageParts = Object.entries(ownerGrouped).map(([owner, typesSet]) => {
                                    const types = Array.from(typesSet).join(" und ");
                                    return (owner !== "Unbekannt") ? `@${owner} ${types}` : types;
                                });

                                missionReplyInput.value = messageParts.join(" und ") + " abziehen";
                                const allianceChatCheckbox = document.getElementById('mission_reply_alliance_chat');
                                if (allianceChatCheckbox) allianceChatCheckbox.checked = true;
                                missionReplyInput.focus();
                            };

                        } else {
                            elwFukwStatusSpan.style.display = 'none';
                        }
                    } else {
                        elwFukwStatusSpan.style.display = 'none';
                        elwFukwStatusSpan.onclick = null;
                        const vehicleAlertSpan = document.querySelector('#missionH1 .eza-vehicle-alert');
                        if (vehicleAlertSpan) {
                            vehicleAlertSpan.style.display = 'none';
                        }
                    }
                };
                updateCountdownDisplay();
                window.ezaMissionIntervals[missionId] = setInterval(updateCountdownDisplay, 1000);

            } else {
                if (endzeitAnzeige) {
                    endzeitAnzeige.style.display = 'none';
                }
                clearMissionInterval(missionId);
            }
        }

        if (endzeitAnzeige && !isExcludedType) {
            endzeitAnzeige.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                createAndShowEndTimeContextMenu(e, missionId, currentEndTimestamp, isCurrentlyOwnDisplayed, avgCreditsForContext, genTimeForContext, endzeitAnzeige, isExcludedType);
            });
        }
    }

    let missionContentObserverInstance = null;
    function initMissionContentObserver() {
        if (!window.location.pathname.startsWith('/missions/')) return;

        if (!window.ezaHideMissionKeyListener) {
            window.ezaHideMissionKeyListener = function(e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                    return;
                }
                if (e.key.toLowerCase() === config.HOTKEY_HIDE_ENDZEIT.toLowerCase()) {
                    e.preventDefault();
                    const hideButton = document.querySelector('.endzeit-alarmfenster-anzeige span[title^="Diese Mission"]');
                    if (hideButton && typeof hideButton.click === 'function') {
                        hideButton.click();
                    }
                }
            };
            document.addEventListener('keydown', window.ezaHideMissionKeyListener);
        }

        const attemptInitialDisplay = (attempts = 0) => {
            const missionH1 = document.getElementById('missionH1');
            const vehicleTablesPresent = document.getElementById('mission_vehicle_driving') || document.getElementById('mission_vehicle_at_mission');

            if (missionH1 && vehicleTablesPresent) {
                if (typeof addEndTimeToMissionContent === 'function') addEndTimeToMissionContent();
                if (!missionContentObserverInstance) {
                    const target = document.querySelector('#mission_panel_actions')?.closest('.panel-body') || document.body;
                    missionContentObserverInstance = new MutationObserver(() => {
                        clearTimeout(window._missionContentUpdateTimeout);
                        window._missionContentUpdateTimeout = setTimeout(() => {
                            if (typeof addEndTimeToMissionContent === 'function') addEndTimeToMissionContent();
                        }, 250);
                    });
                    missionContentObserverInstance.observe(target, { childList: true, subtree: true });
                }
            } else if (attempts < 30) {
                setTimeout(() => attemptInitialDisplay(attempts + 1), 250);
            }
        };
        attemptInitialDisplay();
    }

    // ====================== INITIALISIERUNG & BUGFIX ======================

    addGlobalStyles();
    createSettingsModal();

    if (window.location.pathname === '/') {
        try {
            createPanel();
            // ================================================================
            // INITIALISIERUNG DER SORTIER-OPTIONEN
            // ================================================================
            const initSorting = () => {
                const sortSelect = document.getElementById('missions-sortable-select');
                if (sortSelect) {
                    // Neue Optionen hinzufügen, falls sie noch nicht da sind
                    if (!sortSelect.querySelector('[data-sort-key="ezaEndTime"]')) {
                        const endzeitAsc = document.createElement('option');
                        endzeitAsc.innerText = 'EZA: Endzeit (aufsteigend)';
                        endzeitAsc.setAttribute('data-sort-key', 'ezaEndTime');
                        endzeitAsc.setAttribute('data-sort-direction', 'asc');
                        sortSelect.appendChild(endzeitAsc);

                        const endzeitDesc = document.createElement('option');
                        endzeitDesc.innerText = 'EZA: Endzeit (absteigend)';
                        endzeitDesc.setAttribute('data-sort-key', 'ezaEndTime');
                        endzeitDesc.setAttribute('data-sort-direction', 'desc');
                        sortSelect.appendChild(endzeitDesc);
                    }

                    // Auf Änderungen am Dropdown lauschen
                    sortSelect.addEventListener('change', (event) => {
                        const selectedOption = event.target.options[event.target.selectedIndex];
                        const sortKey = selectedOption.getAttribute('data-sort-key');

                        // Nur wenn unsere Sortierung ausgewählt wird, die Funktion aufrufen
                        if (sortKey === 'ezaEndTime') {
                            const direction = selectedOption.getAttribute('data-sort-direction');

                            // Finde heraus, welche Liste (Eigene oder Verband) gerade aktiv ist
                            const activeTabLink = document.querySelector('#missions-tabs .active a');
                            const activeListId = activeTabLink ? activeTabLink.getAttribute('href').substring(1) : 'mission_list_alliance';

                            // Rufe unsere neue, performante Sortierfunktion auf
                            performIntelligentSort(activeListId, direction);
                        }
                    });
                } else {
                    // Falls das Dropdown noch nicht geladen ist, versuche es in 500ms erneut
                    setTimeout(initSorting, 500);
                }
            };
            initSorting(); // Die Initialisierung starten
            if (typeof addEndTimes === 'function') {
                setInterval(addEndTimes, 2000);
                addEndTimes();
            }

            const missionListAllianceElement = document.querySelector('#mission_list_alliance');
            if (missionListAllianceElement) {
                const allianceSortableObserver = new MutationObserver((mutationsList) => {
                    let triggerRefresh = false;
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'data-sortable-by') {
                            triggerRefresh = true;
                            break;
                        }
                    }
                    if (triggerRefresh && typeof addEndTimes === 'function') {
                        addEndTimes();
                    }
                });
                allianceSortableObserver.observe(missionListAllianceElement, { attributes: true, subtree: true, attributeFilter: ['data-sortable-by'] });
            }

            const missionListOwnElementSortable = document.querySelector('#mission_list');
            if (missionListOwnElementSortable) {
                const ownSortableObserver = new MutationObserver((mutationsList) => {
                    let triggerRefresh = false;
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'data-sortable-by') {
                           triggerRefresh = true;
                           break;
                        }
                    }
                    if (triggerRefresh && typeof addEndTimes === 'function') {
                        addEndTimes();
                    }
                });
                ownSortableObserver.observe(missionListOwnElementSortable, { attributes: true, subtree: true, attributeFilter: ['data-sortable-by'] });
            }

            window.addEventListener('storage', function(event) {
                let needsRefresh = false;
                if(event.key === EZA_CONFIG_KEY){
                     try { loadConfig(); needsRefresh = true; }
                    catch(e){ console.error("EZA: Fehler beim Neuladen der Config nach storage event.", e); }
                }
                else if (event.key === ALLIANCE_MISSION_DATA_KEY) {
                    try { allianceMissionData = JSON.parse(localStorage.getItem(ALLIANCE_MISSION_DATA_KEY) || '{}'); needsRefresh = true; }
                    catch (e) { console.error("EZA: Fehler beim Neuladen von allianceMissionData nach storage event.", e); }
                }
                else if (event.key === OWN_MISSION_FIXED_END_TIMES_KEY) {
                    try { ownMissionFixedEndTimes = JSON.parse(localStorage.getItem(OWN_MISSION_FIXED_END_TIMES_KEY) || '{}'); needsRefresh = true; }
                    catch (e) { console.error("EZA: Fehler beim Neuladen von ownMissionFixedEndTimes nach storage event.", e); }
                }
                else if (event.key === MISSION_TYPE_CACHE_KEY) {
                    try { missionTypeCache = JSON.parse(localStorage.getItem(MISSION_TYPE_CACHE_KEY) || '{}'); needsRefresh = true; }
                    catch (e) { console.error("EZA: Fehler beim Neuladen von missionTypeCache nach storage event.", e); }
                }
                else if (event.key === STORAGE_KEY_IGNORED) {
                    try {
                        const newIgnoredArray = JSON.parse(localStorage.getItem(STORAGE_KEY_IGNORED) || '[]' );
                        ignoredEinsaetze.clear();
                        newIgnoredArray.forEach(id => ignoredEinsaetze.add(id));
                        needsRefresh = true;
                    } catch (e) {
                        console.error("EZA: Fehler beim Neuladen von ignoredEinsaetze nach storage event.", e);
                    }
                }

                if (needsRefresh && typeof addEndTimes === 'function' && window.location.pathname === '/') {
                    addEndTimes();
                }
            });
        } catch (e) {
            console.error("EZA: Fehler Init Panel:", e);
        }
    } else if (window.location.pathname.startsWith('/missions/')) {
        initMissionContentObserver();
    }

})();