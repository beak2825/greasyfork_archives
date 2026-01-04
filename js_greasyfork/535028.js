// ==UserScript==
// @name         Details!
// @namespace    http://tampermonkey.net/
// @version      1.5.5
// @description  Log de combat détaillé (Details!)
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/535028/Details%21.user.js
// @updateURL https://update.greasyfork.org/scripts/535028/Details%21.meta.js
// ==/UserScript==

(function() {
'use strict';

const DEBUG_MODE = false;
const UI_STACKING_ORDER = 100001;
const INITIAL_UI_POSITION = { top: '100px', left: '20px' };
const MENU_HIDE_DELAY_MS = 300;
const COMBAT_END_FINALIZE_DELAY_MS = 6000;

const STORAGE_KEY_COMBAT_LOGS = 'dreadcastSavedLogs_v3_CombatID';
const STORAGE_KEY_ACTIVE_COMBAT_ID = 'dreadcastActiveCombatId_v1';
const STORAGE_KEY_ACTIVE_COMBAT_DATA = 'dreadcastActiveCombatData_v2';
const STORAGE_KEY_UI_VISIBLE = 'dreadcastLoggerVisible_v1';
const STORAGE_KEY_UI_POSITION = 'dreadcastLoggerPosition_v1';
const TOOLTIP_OFFSET_HORIZONTAL = 15;
const TOOLTIP_OFFSET_VERTICAL = 10;
const MENU_Z_INDEX = UI_STACKING_ORDER + 1;

const GAIN_RESISTANCE_PER_DAMAGE = 0.00493;
const GAIN_PRIMARY_STAT_PER_HIT = 0.01835;
const GAIN_MEDECINE_PER_HP_HEALED = 0.00288;
const SPECIFIC_RANGED_WEAPON = "Pistolet à billes";

const MODE_BAR_COLORS = {
    damage: "#ff8c00",
    healing: "#00cc44",
    taken: "#cc0000",
    mitigated: "#44aadd",
    protection: "#FFD700",
    crits: "#c10004",
    missed: "#aaaaaa",
    intercepted: "#8A2BE2",
    projectedGains: "#cccccc",
    initiativeStats: "#9400D3",
    default: "#ccc"
};

const ID_UI_CONTAINER = 'dreadcast-logger-ui';
const ID_UI_HEADER = 'dreadcast-logger-header';
const ID_MODE_SELECTOR_BUTTON = 'logger-mode-tab-button';
const ID_HEADER_TITLE_TEXT = 'logger-header-title';
const ID_LOG_SELECTOR_BUTTON = 'logger-log-selector';
const ID_CLOSE_UI_BUTTON = 'logger-close-button';
const ID_MODE_SELECTOR_MENU = 'logger-mode-menu';
const ID_LOG_SELECTOR_MENU = 'logger-log-menu';
const ID_CONTENT_AREA = 'logger-content';
const ID_TOOLTIP_ELEMENT = 'dreadcast-logger-tooltip';
const ID_MAIN_FIGHT_DIV = 'main_fight';
const CLASS_DELETE_LOG_BUTTON = 'log-delete-button';
const CLASS_RENAME_LOG_BUTTON = 'log-rename-button';

const ID_IMPORT_EXPORT_MODAL = 'dreadcast-logger-import-export-modal';
const ID_MODAL_OVERLAY = 'dreadcast-logger-modal-overlay';
const ID_EXPORT_TEXTAREA = 'logger-export-textarea';
const ID_IMPORT_TEXTAREA = 'logger-import-textarea';
const ID_GENERATE_EXPORT_BUTTON = 'logger-generate-export-button';
const ID_COPY_EXPORT_BUTTON = 'logger-copy-export-button';
const ID_IMPORT_BUTTON = 'logger-import-button';
const CLASS_MODAL_CLOSE_BUTTON = 'logger-modal-close-button';
const NAME_IMPORT_OPTION_RADIO = 'logger-import-option';
const MODAL_Z_INDEX = UI_STACKING_ORDER + 10;
const EXPORT_VERSION = 'details-export-v1.1';
const ID_EXPORT_OPTIONS_DIV = 'logger-export-options-div';
const NAME_EXPORT_SCOPE_RADIO = 'logger-export-scope';
const ID_EXPORT_LOG_LIST_DIV = 'logger-export-log-list-div';
const ID_INCLUDE_ACTIVE_COMBAT_CHECKBOX = 'logger-include-active-combat-checkbox';

const ID_MERGE_LOGS_MODAL = 'dreadcast-logger-merge-logs-modal';
const ID_MERGE_LOGS_LIST_DIV = 'logger-merge-logs-list-div';
const ID_MERGE_LOGS_SELECTED_COUNT = 'logger-merge-logs-selected-count';
const ID_MERGE_LOGS_SUBMIT_BUTTON = 'logger-merge-logs-submit-button';
const CLASS_MERGE_MODAL_CLOSE_BUTTON = 'logger-merge-modal-close-button';

let currentCombatId = null;
let activeCombatData = {};
let currentDisplayMode = 'damage';
let currentlyViewingLogId = 'current';
let savedCombatLogs = [];
let isUserInterfaceVisible = false;
let savedUserInterfacePosition = {};
let isUserInterfaceMinimized = false;
let menuHideTimeoutId = null;
let isDraggingInterface = false;
let dragStartX, dragStartY, initialDragX, initialDragY;
let wasVisiblePreference = true;

let uiContainerElement = null;
let uiHeaderElement = null;
let uiHeaderTitleElement = null;
let uiContentElement = null;
let modeSelectorButtonElement = null;
let modeSelectorMenuElement = null;
let logSelectorButtonElement = null;
let logSelectorMenuElement = null;
let closeUIButtonElement = null;
let tooltipElement = null;

let combatStateChangeObserver = null;
let combatEndPendingTimer = null;
let lastKnownCombatIdForPendingEnd = null;

window.dreadcastLoggerSaveTimeout = null;

let importExportModalElement = null;
let modalOverlayElement = null;
let exportTextareaElement = null;
let importTextareaElement = null;
let generateExportButtonElement = null;
let copyExportButtonElement = null;
let importButtonElement = null;
let modalStatusElement = null;
let exportLogListDivElement = null;

let mergeLogsModalElement = null;
let mergeLogsListDivElement = null;
let mergeLogsSelectedCountElement = null;
let mergeLogsSubmitButtonElement = null;

function initializeEmptyCombatData() {
    return {
        damage: {}, healing: {}, taken: {}, mitigated: {}, protection: {}, crits: {}, missed: {}, intercepted: {},
        detailedDamage: {}, detailedHealing: {}, detailedTaken: {}, detailedMitigated: {}, detailedProtection: {},
        detailedCrits: {},
        detailedMissed: {}, detailedIntercepted: {},
        projectedGains: {},
        initiativeStats: {}
    };
}

function ensureCompleteDataStructure(dataObject) {
    if (!dataObject) return;

    if (dataObject._structureValidated) return;

    const rootKeys = ['damage', 'healing', 'taken', 'mitigated', 'protection', 'crits', 'missed', 'intercepted', 'projectedGains', 'initiativeStats'];
    const detailedKeys = ['detailedDamage', 'detailedHealing', 'detailedTaken', 'detailedMitigated', 'detailedProtection', 'detailedCrits', 'detailedMissed', 'detailedIntercepted'];

    rootKeys.forEach(key => {
        if (!dataObject[key]) dataObject[key] = {};
    });
    detailedKeys.forEach(key => {
        if (!dataObject[key]) dataObject[key] = {};
    });

    if (dataObject.detailedCrits && typeof dataObject.detailedCrits === 'object') {
        Object.entries(dataObject.detailedCrits).forEach(([attackerName, attackerData]) => {
            if (typeof attackerData !== 'object') {
                dataObject.detailedCrits[attackerName] = { maxCritValue: 0, targets: {} };
                attackerData = dataObject.detailedCrits[attackerName];
            }
            if (attackerData.maxCritValue === undefined) attackerData.maxCritValue = 0;
            if (attackerData.targets === undefined) attackerData.targets = {};
            Object.entries(attackerData.targets).forEach(([targetName, targetData]) => {
                if (typeof targetData !== 'object') {
                    attackerData.targets[targetName] = { crits: 0, actions: 0, weapons: {} };
                    targetData = attackerData.targets[targetName];
                }
                if (targetData.hits !== undefined && targetData.crits === undefined) {
                    targetData.crits = targetData.hits;
                    targetData.actions = targetData.hits;
                    delete targetData.hits;
                }
                if (targetData.crits === undefined) targetData.crits = 0;
                if (targetData.actions === undefined) targetData.actions = 0;
                if (targetData.weapons === undefined) {
                    targetData.weapons = {};
                }
            });
        });
    }

    if (dataObject.detailedDamage && typeof dataObject.detailedDamage === 'object') {
        Object.values(dataObject.detailedDamage).forEach(primaryData => {
            if (typeof primaryData !== 'object') return;
            Object.values(primaryData).forEach(secondaryData => {
                if (typeof secondaryData !== 'object') return;
                if (secondaryData.weapons === undefined) secondaryData.weapons = {};
                Object.values(secondaryData.weapons).forEach(weaponData => {
                    if (typeof weaponData === 'object' && weaponData.crits === undefined) weaponData.crits = 0;
                });
            });
        });
    }
    if (dataObject.detailedTaken && typeof dataObject.detailedTaken === 'object') {
        Object.values(dataObject.detailedTaken).forEach(primaryData => {
            if (typeof primaryData !== 'object') return;
            Object.values(primaryData).forEach(secondaryData => {
                if (typeof secondaryData !== 'object') return;
                if (secondaryData.weapons === undefined) secondaryData.weapons = {};
                Object.values(secondaryData.weapons).forEach(weaponData => {
                    if (typeof weaponData === 'object' && weaponData.crits === undefined) weaponData.crits = 0;
                });
            });
        });
    }
    if (dataObject.initiativeStats && typeof dataObject.initiativeStats === 'object') {
        Object.values(dataObject.initiativeStats).forEach(playerStats => {
            if (typeof playerStats !== 'object') return;
            if (playerStats.totalTurnsPlayed === undefined) playerStats.totalTurnsPlayed = 0;
            if (playerStats.turnOrderCounts === undefined) playerStats.turnOrderCounts = {};
        });
    }

    ensureProjectedGainsStructure(dataObject);

    dataObject._structureValidated = true;
}

function invalidateDataStructure(dataObject) {
    if (dataObject && dataObject._structureValidated) {
        delete dataObject._structureValidated;
    }
}


function ensureProjectedGainsStructure(dataObject) {
    if (!dataObject) return;
    if (!dataObject.projectedGains) {
        dataObject.projectedGains = {};
    }
    const allKnownEntities = new Set();
    const dataSectionsForEntityDiscovery = ['damage', 'healing', 'taken', 'mitigated', 'protection', 'crits', 'missed', 'intercepted'];
    dataSectionsForEntityDiscovery.forEach(sectionKey => {
        if (dataObject[sectionKey] && typeof dataObject[sectionKey] === 'object') {
            Object.keys(dataObject[sectionKey]).forEach(entityName => allKnownEntities.add(entityName));
        }
    });
     Object.keys(dataObject.projectedGains || {}).forEach(entityName => allKnownEntities.add(entityName));


    allKnownEntities.forEach(entityName => {
        if (!dataObject.projectedGains[entityName]) {
            dataObject.projectedGains[entityName] = { resistance: 0, force: 0, agilite: 0, perception: 0, medecine: 0 };
        } else {
            if (typeof dataObject.projectedGains[entityName].resistance !== 'number') dataObject.projectedGains[entityName].resistance = 0;
            if (typeof dataObject.projectedGains[entityName].force !== 'number') dataObject.projectedGains[entityName].force = 0;
            if (typeof dataObject.projectedGains[entityName].agilite !== 'number') dataObject.projectedGains[entityName].agilite = 0;
            if (typeof dataObject.projectedGains[entityName].perception !== 'number') dataObject.projectedGains[entityName].perception = 0;
            if (typeof dataObject.projectedGains[entityName].medecine !== 'number') dataObject.projectedGains[entityName].medecine = 0;
        }
    });
}


function saveApplicationState() {
    clearTimeout(window.dreadcastLoggerSaveTimeout);
    window.dreadcastLoggerSaveTimeout = setTimeout(() => {
        try {
            ensureCompleteDataStructure(activeCombatData);
            savedCombatLogs.forEach(log => { if (log.data) ensureCompleteDataStructure(log.data); });

            GM_setValue(STORAGE_KEY_COMBAT_LOGS, savedCombatLogs);
            GM_setValue(STORAGE_KEY_ACTIVE_COMBAT_ID, currentCombatId);
            GM_setValue(STORAGE_KEY_ACTIVE_COMBAT_DATA, activeCombatData || initializeEmptyCombatData());
            GM_setValue(STORAGE_KEY_UI_VISIBLE, isUserInterfaceVisible);
            if (uiContainerElement && !isUserInterfaceMinimized) {
                savedUserInterfacePosition = {
                    top: uiContainerElement.style.top, left: uiContainerElement.style.left,
                    width: uiContainerElement.style.width, height: uiContainerElement.style.height
                };
                GM_setValue(STORAGE_KEY_UI_POSITION, savedUserInterfacePosition);
            } else if (!uiContainerElement) {
                 const existingPos = GM_getValue(STORAGE_KEY_UI_POSITION);
                 if (existingPos) savedUserInterfacePosition = existingPos;
            } else if (isUserInterfaceMinimized) {
                GM_setValue(STORAGE_KEY_UI_POSITION, savedUserInterfacePosition);
            }
        } catch (e) {

        }
    }, 150);
}

function loadApplicationState() {
    savedCombatLogs = GM_getValue(STORAGE_KEY_COMBAT_LOGS, []);
    activeCombatData = GM_getValue(STORAGE_KEY_ACTIVE_COMBAT_DATA, null);

    if (typeof activeCombatData !== 'object' || activeCombatData === null) {
         activeCombatData = initializeEmptyCombatData();
     }
    ensureCompleteDataStructure(activeCombatData);

    savedCombatLogs.forEach(log => {
        if (log.data) {
            ensureCompleteDataStructure(log.data);
        }
    });

    savedUserInterfacePosition = GM_getValue(STORAGE_KEY_UI_POSITION, {});
    savedUserInterfacePosition.top = savedUserInterfacePosition.top || INITIAL_UI_POSITION.top;
    savedUserInterfacePosition.left = savedUserInterfacePosition.left || INITIAL_UI_POSITION.left;
    wasVisiblePreference = GM_getValue(STORAGE_KEY_UI_VISIBLE, true);
    currentCombatId = GM_getValue(STORAGE_KEY_ACTIVE_COMBAT_ID, null);
}

function extractCombatIdFromDOM() {
    const fightDiv = document.getElementById(ID_MAIN_FIGHT_DIV);
    if (!fightDiv || !fightDiv.className) return null;
    const match = fightDiv.className.match(/combat_(\d+)/);
    return match ? match[1] : null;
}

function combatDataHasMeaningfulEvents(data) {
    if (!data) return false;
    const meaningfulEventKeys = ['damage', 'healing', 'taken', 'mitigated', 'protection', 'crits', 'missed', 'intercepted'];
    for (const key of meaningfulEventKeys) {
        if (data[key] && Object.keys(data[key]).length > 0) {
            return true;
        }
    }
    return false;
}

function archiveCurrentCombatData(combatIdToArchive, dataToArchive) {
    if (!combatIdToArchive || !dataToArchive) return;

    ensureCompleteDataStructure(dataToArchive);

    if (!combatDataHasMeaningfulEvents(dataToArchive)) {
        return;
    }

    const clonedData = structuredClone(dataToArchive);


    const existingLogIndex = savedCombatLogs.findIndex(log => log.id === combatIdToArchive);
    let combatName = `Combat ${combatIdToArchive}`;
    if (existingLogIndex !== -1 && savedCombatLogs[existingLogIndex].name) {
        combatName = savedCombatLogs[existingLogIndex].name;
    }
    const archiveEntry = { id: combatIdToArchive, name: combatName, timestamp: Date.now(), data: clonedData };
    if (existingLogIndex !== -1) {
        savedCombatLogs[existingLogIndex] = archiveEntry;
    } else {
        savedCombatLogs.push(archiveEntry);
    }
}


function checkAndUpdateCombatState() {
    const detectedCombatId = extractCombatIdFromDOM();

    if (detectedCombatId && detectedCombatId !== currentCombatId) {

        clearTimeout(combatEndPendingTimer);
        combatEndPendingTimer = null;

        if (currentCombatId && currentCombatId !== lastKnownCombatIdForPendingEnd) {

            archiveCurrentCombatData(currentCombatId, activeCombatData);
        } else if (lastKnownCombatIdForPendingEnd && lastKnownCombatIdForPendingEnd !== detectedCombatId) {

            archiveCurrentCombatData(lastKnownCombatIdForPendingEnd, activeCombatData);
        }
        lastKnownCombatIdForPendingEnd = null;

        currentCombatId = detectedCombatId;
        activeCombatData = initializeEmptyCombatData();
        ensureCompleteDataStructure(activeCombatData);
        if (currentlyViewingLogId !== 'global' && currentlyViewingLogId !== 'current') {
             currentlyViewingLogId = 'current';
        }

        if (!isUserInterfaceVisible) {
            isUserInterfaceVisible = true;
            showUserInterface();
        } else {
            if (uiContainerElement) updateUserInterface();
        }
        saveApplicationState();
        hideTooltip();

    } else if (detectedCombatId && detectedCombatId === currentCombatId) {

        clearTimeout(combatEndPendingTimer);
        combatEndPendingTimer = null;
        lastKnownCombatIdForPendingEnd = null;
        if (uiContainerElement && isUserInterfaceVisible && uiContentElement && uiContentElement.innerHTML.includes('Chargement...')) {
             updateUserInterface();
        }

    } else if (!detectedCombatId && currentCombatId) {

        if (!combatEndPendingTimer || lastKnownCombatIdForPendingEnd !== currentCombatId) {
            lastKnownCombatIdForPendingEnd = currentCombatId;
            clearTimeout(combatEndPendingTimer);
            combatEndPendingTimer = setTimeout(() => {
                const finalCheckId = extractCombatIdFromDOM();
                if (finalCheckId === lastKnownCombatIdForPendingEnd) {

                    combatEndPendingTimer = null;
                    lastKnownCombatIdForPendingEnd = null;

                    return;
                }


                if (lastKnownCombatIdForPendingEnd) {
                     archiveCurrentCombatData(lastKnownCombatIdForPendingEnd, activeCombatData);
                }

                if (finalCheckId) {
                    currentCombatId = finalCheckId;
                    activeCombatData = initializeEmptyCombatData();
                    ensureCompleteDataStructure(activeCombatData);
                } else {
                    currentCombatId = null;
                    activeCombatData = initializeEmptyCombatData();
                    ensureCompleteDataStructure(activeCombatData);
                }

                lastKnownCombatIdForPendingEnd = null;
                combatEndPendingTimer = null;
                if (currentlyViewingLogId !== 'global' && currentlyViewingLogId !== 'current' && !finalCheckId) {
                    currentlyViewingLogId = 'current';
                }
                saveApplicationState();
                if (uiContainerElement && isUserInterfaceVisible) updateUserInterface();
                hideTooltip();

            }, COMBAT_END_FINALIZE_DELAY_MS);
        }


    } else if (!detectedCombatId && !currentCombatId) {

        lastKnownCombatIdForPendingEnd = null;
        clearTimeout(combatEndPendingTimer);
        combatEndPendingTimer = null;
    }
}


function startCombatStateObserver() {
    if (combatStateChangeObserver) return;
    const targetNode = document.body;
    const observerConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'id'] };
    combatStateChangeObserver = new MutationObserver((mutationsList, observer) => {
        let relevantChangeDetected = false;
        const mainFightElement = document.getElementById(ID_MAIN_FIGHT_DIV);
        for (const mutation of mutationsList) {
             if (mutation.type === 'childList') {
                 if (Array.from(mutation.addedNodes).some(node => node === mainFightElement || (node.contains && node.contains(mainFightElement))) ||
                     Array.from(mutation.removedNodes).some(node => node === mainFightElement)) {
                      relevantChangeDetected = true; break;
                  }
             } else if (mutation.type === 'attributes' && mutation.target === mainFightElement) {
                  relevantChangeDetected = true; break;
             }
        }
        if (!relevantChangeDetected && extractCombatIdFromDOM() !== currentCombatId && !combatEndPendingTimer) {


             relevantChangeDetected = true;
        }
        if (relevantChangeDetected) {
             setTimeout(checkAndUpdateCombatState, 50);
        }
    });
    combatStateChangeObserver.observe(targetNode, observerConfig);
    setTimeout(checkAndUpdateCombatState, 50);
}

function stopCombatStateObserver() {
     if (combatStateChangeObserver) {
         combatStateChangeObserver.disconnect();
         combatStateChangeObserver = null;
     }
}

const UI_STYLESHEET = `
    #${ID_UI_CONTAINER} {
        position: fixed; min-width: 180px; min-height: 100px; background-color: rgba(0, 0, 0, 0.8);
        border: 1px solid #555; color: white; z-index: ${UI_STACKING_ORDER}; font-family: sans-serif;
        font-size: 12px; border-radius: 5px; display: flex; flex-direction: column; resize: both;
        overflow: auto; box-sizing: border-box;
    }
    #${ID_UI_CONTAINER} #${ID_UI_HEADER} {
        margin: 0; padding: 0 5px; background-color: #333; color: #eee; border-bottom: 1px solid #555;
        font-size: 14px; cursor: move; user-select: none; flex-shrink: 0; display: flex;
        align-items: center; justify-content: space-between; min-height: 35px;
        box-sizing: border-box;
    }
    .header-icon {
        font-size: 18px; cursor: pointer; padding: 5px 7px; border-radius: 3px;
        transition: background-color 0.2s; line-height: 1;
    }
    .header-icon:hover { background-color: #555; }
    #${ID_MODE_SELECTOR_BUTTON} { order: 0; }
    #${ID_HEADER_TITLE_TEXT} {
        order: 1; flex-grow: 1; text-align: center; padding: 8px 0px; white-space: nowrap;
        overflow: hidden; text-overflow: ellipsis; margin: 0 5px; font-size: 13px;
    }
    #${ID_LOG_SELECTOR_BUTTON} { order: 2; }
    #${ID_CLOSE_UI_BUTTON} { order: 3; font-size: 22px; }

    .${ID_MODE_SELECTOR_MENU}, .${ID_LOG_SELECTOR_MENU} {
        display: none; position: absolute;
        background-color: #2a2a2a; border: 1px solid #666;
        border-radius: 4px; padding: 5px; z-index: ${MENU_Z_INDEX};
         min-width: 150px; max-height: 250px;
        overflow-x: hidden;
        overflow-y: auto; box-shadow: 0 2px 5px rgba(0,0,0,0.5);
    }

    .menu-item {
        padding: 6px 10px; cursor: pointer; border-radius: 3px; white-space: nowrap; color: #ddd;
        display: flex; justify-content: space-between; align-items: center;
    }
    .menu-item-text {
         flex-grow: 1;
         overflow: hidden;
         text-overflow: ellipsis;
         margin-right: 5px;
    }
    .menu-item:hover { background-color: #555; color: #fff; }
    .menu-item.active { font-weight: bold; background-color: #444; color: #fff; }
    .menu-item.disabled { color: #777; cursor: not-allowed; }
    .menu-item.disabled:hover { background-color: #2a2a2a; }

    .menu-item .${CLASS_RENAME_LOG_BUTTON},
    .menu-item .${CLASS_DELETE_LOG_BUTTON} {
        display: inline-block;
        font-weight: bold;
        margin-left: 4px;
        padding: 0 4px;
        border-radius: 3px;
        line-height: 1;
        font-size: 14px;
        cursor: pointer;
        visibility: hidden;
        flex-shrink: 0;
    }
    .menu-item:hover .${CLASS_RENAME_LOG_BUTTON},
    .menu-item:hover .${CLASS_DELETE_LOG_BUTTON} {
        visibility: visible;
    }
    .menu-item .${CLASS_RENAME_LOG_BUTTON} { color: #66aaff; }
    .menu-item .${CLASS_RENAME_LOG_BUTTON}:hover { background-color: #66aaff; color: #fff; }
     .menu-item .${CLASS_DELETE_LOG_BUTTON} { color: #ff4d4d; }
    .menu-item .${CLASS_DELETE_LOG_BUTTON}:hover { background-color: #ff4d4d; color: #fff; }

    #${ID_CONTENT_AREA} {
        padding: 10px; overflow-y: auto; flex-grow: 1; background-color: rgba(10, 10, 10, 0.7);
        box-sizing: border-box; position: relative;
    }
    #${ID_UI_CONTAINER}.minimized {
        width: auto !important;
        resize: none;
        overflow: hidden;
    }
    #${ID_UI_CONTAINER}.minimized #${ID_CONTENT_AREA} { display: none; }
    #${ID_UI_CONTAINER}.minimized .logger-menu { display: none !important; }
    .logger-entry { margin-bottom: 5px; cursor: default; }
    .logger-row {
        display: flex; justify-content: space-between; align-items: center; padding: 2px 0;
        border-bottom: 1px dashed #444;
    }
    .logger-rank { margin-right: 5px; color: #aaa; min-width: 15px; text-align: right; }
    .logger-name { flex-grow: 1; margin-right: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .logger-value { font-weight: bold; min-width: 40px; text-align: right; }
    .logger-bar-container { background-color: #333; height: 8px; margin-top: 2px; border-radius: 3px; overflow: hidden; }
    .logger-bar { height: 100%; width: 0%; transition: width 0.2s ease-in-out; border-radius: 3px; }

    .projected-gains-entry {
        margin-bottom: 10px;
        padding: 5px;
        border: 1px solid #444;
        border-radius: 3px;
    }
    .projected-gains-player-name {
        font-weight: bold;
        color: #e0e0e0;
        margin-bottom: 5px;
        font-size: 13px;
    }
    .projected-gains-stat {
        margin-left: 10px;
        margin-bottom: 3px;
        font-size: 11px;
    }
    .projected-gains-stat .stat-label {
        display: inline-block;
        width: 70px;
        color: #aaa;
    }
    .projected-gains-stat .stat-value {
        font-weight: bold;
    }
    .projected-gains-stat .stat-value.force-gain { color: #ff6b6b; }
    .projected-gains-stat .stat-value.agilite-gain { color: #69f0ae; }
    .projected-gains-stat .stat-value.perception-gain { color: #64b5f6; }
    .projected-gains-stat .stat-value.medecine-gain { color: #ff79c6; }
    .projected-gains-stat .stat-value.resistance-gain { color: #ffee58; }


    #${ID_TOOLTIP_ELEMENT} {
        position: fixed; display: none; background-color: rgba(0, 0, 0, 0.9); color: #eee; border: 1px solid #777;
        border-radius: 4px; padding: 8px 10px; font-size: 11px; max-width: 350px; z-index: ${UI_STACKING_ORDER + 2};
        pointer-events: none; white-space: normal; box-shadow: 0 2px 5px rgba(0,0,0,0.5);
    }
    #${ID_TOOLTIP_ELEMENT} .tooltip-header { margin-bottom: 5px; font-weight: bold; }
    #${ID_TOOLTIP_ELEMENT} .tooltip-subheader { font-size: 10px; color: #ccc; margin-bottom: 5px; }
    #${ID_TOOLTIP_ELEMENT} .tooltip-entry { margin-bottom: 4px; line-height: 1.3; }
    #${ID_TOOLTIP_ELEMENT} strong { color: #ffcc66; }
    #${ID_TOOLTIP_ELEMENT} .tooltip-details { color: #bbb; }
    #${ID_TOOLTIP_ELEMENT} .tooltip-percent { color: #aaa; font-style: italic; margin-left: 5px; }
    #${ID_TOOLTIP_ELEMENT} .tooltip-weapon-breakdown { margin-left: 15px; font-size: 10px; color: #ddd; }
    #${ID_TOOLTIP_ELEMENT} .tooltip-weapon-entry { margin-top: 2px; }
    #${ID_TOOLTIP_ELEMENT} .tooltip-interception-instance { margin-left: 10px; font-size: 10px; color: #ddd; margin-top:3px; }
    .tooltip-bar-container { background-color: #444; height: 6px; margin-top: 3px; border-radius: 2px; overflow: hidden; width: 100%; }
    .tooltip-bar { height: 100%; width: 0%; transition: width 0.1s ease-out; border-radius: 2px; }

    #${ID_MODAL_OVERLAY} {
        display: none;
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: ${MODAL_Z_INDEX -1};
        justify-content: center;
        align-items: center;
    }
    #${ID_IMPORT_EXPORT_MODAL}, #${ID_MERGE_LOGS_MODAL} {
        background-color: #282c34;
        color: #abb2bf;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 20px;
        width: 90%;
        max-width: 600px;
        min-height: 300px;
        max-height: 90vh;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        z-index: ${MODAL_Z_INDEX};
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-y: auto;
    }
    #${ID_IMPORT_EXPORT_MODAL} h4, #${ID_MERGE_LOGS_MODAL} h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #61afef;
        border-bottom: 1px solid #444;
        padding-bottom: 10px;
    }
    #${ID_IMPORT_EXPORT_MODAL} h5 {
        margin-top: 20px;
        margin-bottom: 10px;
        color: #c678dd;
    }
    #${ID_IMPORT_EXPORT_MODAL} textarea {
        width: calc(100% - 12px);
        min-height: 100px;
        max-height: 150px;
        background-color: #1e2228;
        color: #abb2bf;
        border: 1px solid #3b4048;
        border-radius: 4px;
        padding: 5px;
        font-family: monospace;
        font-size: 11px;
        resize: vertical;
        margin-bottom: 10px;
    }
    #${ID_IMPORT_EXPORT_MODAL} button, #${ID_MERGE_LOGS_MODAL} button {
        background-color: #61afef;
        color: #1e2228;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        margin-right: 10px;
        transition: background-color 0.2s;
    }
    #${ID_IMPORT_EXPORT_MODAL} button:hover, #${ID_MERGE_LOGS_MODAL} button:hover {
        background-color: #528bce;
    }
    #${ID_IMPORT_EXPORT_MODAL} button:disabled, #${ID_MERGE_LOGS_MODAL} button:disabled {
        background-color: #4a4a4a;
        color: #888;
        cursor: not-allowed;
    }
    .${CLASS_MODAL_CLOSE_BUTTON}, .${CLASS_MERGE_MODAL_CLOSE_BUTTON} {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        font-weight: bold;
        color: #abb2bf;
        background: none;
        border: none;
        padding: 0 5px;
        cursor: pointer;
        z-index: ${MODAL_Z_INDEX + 1};
    }
    .${CLASS_MODAL_CLOSE_BUTTON}:hover, .${CLASS_MERGE_MODAL_CLOSE_BUTTON}:hover { color: #ff6347; }
    #${ID_IMPORT_EXPORT_MODAL} .modal-actions, #${ID_MERGE_LOGS_MODAL} .modal-actions {
        margin-top: 5px;
        margin-bottom: 15px;
    }
    #${ID_MERGE_LOGS_MODAL} #${ID_MERGE_LOGS_LIST_DIV} {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #3b4048;
        padding: 10px;
        margin-bottom: 15px;
        font-size: 12px;
    }
    #${ID_MERGE_LOGS_MODAL} #${ID_MERGE_LOGS_LIST_DIV} label {
        display: block;
        margin-bottom: 5px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    #${ID_MERGE_LOGS_MODAL} #${ID_MERGE_LOGS_LIST_DIV} input[type="checkbox"] {
        margin-right: 8px;
        vertical-align: middle;
    }
    #${ID_MERGE_LOGS_MODAL} #${ID_MERGE_LOGS_SELECTED_COUNT} {
        margin-bottom: 15px;
        font-size: 12px;
        color: #98c379;
    }
    #${ID_IMPORT_EXPORT_MODAL} .import-options label {
        margin-right: 15px;
        cursor: pointer;
        font-size: 12px;
    }
    #${ID_IMPORT_EXPORT_MODAL} .import-options input[type="radio"] {
        margin-right: 5px;
        vertical-align: middle;
    }
    #${ID_IMPORT_EXPORT_MODAL} .modal-status {
        margin-top: 10px;
        font-size: 12px;
        min-height: 1.5em;
    }
    #${ID_IMPORT_EXPORT_MODAL} .modal-status.success { color: #98c379; }
    #${ID_IMPORT_EXPORT_MODAL} .modal-status.error { color: #e06c75; }
`;

const UI_MARKUP_CONTAINER = `
    <h3 id="${ID_UI_HEADER}">
        <span id="${ID_MODE_SELECTOR_BUTTON}" class="header-icon" title="Changer le type de données">📑</span>
        <span id="${ID_HEADER_TITLE_TEXT}">Chargement...</span>
        <span id="${ID_LOG_SELECTOR_BUTTON}" class="header-icon" title="Sélectionner le log">📋</span>
        <span id="${ID_CLOSE_UI_BUTTON}" class="header-icon" title="Fermer la fenêtre">×</span>
    </h3>
    <div id="${ID_CONTENT_AREA}">Chargement...</div>
    <div id="${ID_TOOLTIP_ELEMENT}"></div>
`;
const UI_MARKUP_MODE_MENU = `
    <div class="menu-item" data-mode="damage">⚔ Dégâts effectués</div>
    <div class="menu-item" data-mode="healing">♥ Soins effectués</div>
    <div class="menu-item" data-mode="protection">🖐️ Protection</div>
    <div class="menu-item" data-mode="taken">🩸 Dégâts subis</div>
    <div class="menu-item" data-mode="mitigated">🛡 Dégâts mitigés</div>
    <div class="menu-item" data-mode="crits">💥 Coups critiques</div>
    <div class="menu-item" data-mode="missed">🍃 Coups manqués</div>
    <div class="menu-item" data-mode="intercepted">👓 Tirs interceptés</div>
    <div class="menu-item" data-mode="projectedGains">📈 Gains de stats (Proj.)</div>
    <div class="menu-item" data-mode="initiativeStats">🏁 Initiative</div>
`;
const UI_MARKUP_LOG_MENU = ``;

function createUserInterface() {
    document.getElementById(ID_UI_CONTAINER)?.remove();
    document.getElementById(ID_MODE_SELECTOR_MENU)?.remove();
    document.getElementById(ID_LOG_SELECTOR_MENU)?.remove();
    document.getElementById(ID_TOOLTIP_ELEMENT)?.remove();
    document.getElementById(ID_MODAL_OVERLAY)?.remove();
    GM_addStyle(UI_STYLESHEET);

    uiContainerElement = document.createElement('div');
    uiContainerElement.id = ID_UI_CONTAINER;
    uiContainerElement.style.top = savedUserInterfacePosition.top;
    uiContainerElement.style.left = savedUserInterfacePosition.left;
    uiContainerElement.style.width = savedUserInterfacePosition.width || '250px';
    uiContainerElement.style.height = savedUserInterfacePosition.height || '350px';
    uiContainerElement.style.display = isUserInterfaceVisible ? 'flex' : 'none';
    uiContainerElement.innerHTML = UI_MARKUP_CONTAINER;
    document.body.appendChild(uiContainerElement);

    modeSelectorMenuElement = document.createElement('div');
    modeSelectorMenuElement.id = ID_MODE_SELECTOR_MENU;
    modeSelectorMenuElement.className = ID_MODE_SELECTOR_MENU;
    modeSelectorMenuElement.innerHTML = UI_MARKUP_MODE_MENU;
    document.body.appendChild(modeSelectorMenuElement);

    logSelectorMenuElement = document.createElement('div');
    logSelectorMenuElement.id = ID_LOG_SELECTOR_MENU;
    logSelectorMenuElement.className = ID_LOG_SELECTOR_MENU;
    logSelectorMenuElement.innerHTML = UI_MARKUP_LOG_MENU;
    document.body.appendChild(logSelectorMenuElement);

    createImportExportModal();
    createMergeLogsModal();


    uiHeaderElement = uiContainerElement.querySelector(`#${ID_UI_HEADER}`);
    uiHeaderTitleElement = uiContainerElement.querySelector(`#${ID_HEADER_TITLE_TEXT}`);
    uiContentElement = uiContainerElement.querySelector(`#${ID_CONTENT_AREA}`);
    modeSelectorButtonElement = uiContainerElement.querySelector(`#${ID_MODE_SELECTOR_BUTTON}`);
    logSelectorButtonElement = uiContainerElement.querySelector(`#${ID_LOG_SELECTOR_BUTTON}`);
    closeUIButtonElement = uiContainerElement.querySelector(`#${ID_CLOSE_UI_BUTTON}`);
    tooltipElement = uiContainerElement.querySelector(`#${ID_TOOLTIP_ELEMENT}`);

    attachUserInterfaceEventListeners();
    if (isUserInterfaceMinimized) {
        uiContainerElement.classList.add('minimized');
        if (uiHeaderElement) {
            const headerHeight = `${uiHeaderElement.offsetHeight}px`;
            uiContainerElement.style.height = headerHeight;
            uiContainerElement.style.minHeight = headerHeight;
        }
    }
    if (isUserInterfaceVisible) updateUserInterface();
}

function attachUserInterfaceEventListeners() {
     if (!uiHeaderElement) return;
     uiHeaderElement.addEventListener('mousedown', handleInterfaceMouseDown);
     uiHeaderElement.addEventListener('dblclick', handleHeaderDoubleClick);
     modeSelectorButtonElement.addEventListener('mouseenter', () => showMenuPopup(modeSelectorMenuElement, modeSelectorButtonElement));
     modeSelectorButtonElement.addEventListener('mouseleave', () => hideMenuPopup(modeSelectorMenuElement));
     modeSelectorMenuElement.addEventListener('mouseenter', () => showMenuPopup(modeSelectorMenuElement, modeSelectorButtonElement));
     modeSelectorMenuElement.addEventListener('mouseleave', () => hideMenuPopup(modeSelectorMenuElement));
     modeSelectorMenuElement.addEventListener('click', handleModeMenuItemClick);
     logSelectorButtonElement.addEventListener('mouseenter', () => showMenuPopup(logSelectorMenuElement, logSelectorButtonElement));
     logSelectorButtonElement.addEventListener('mouseleave', () => hideMenuPopup(logSelectorMenuElement));
     logSelectorMenuElement.addEventListener('mouseenter', () => showMenuPopup(logSelectorMenuElement, logSelectorButtonElement));
     logSelectorMenuElement.addEventListener('mouseleave', () => hideMenuPopup(logSelectorMenuElement));
     logSelectorMenuElement.addEventListener('click', handleLogMenuItemClick);
     closeUIButtonElement.addEventListener('click', hideUserInterface);
     uiContentElement.addEventListener('mouseover', handleLogEntryMouseOver);
     uiContentElement.addEventListener('mouseout', handleLogEntryMouseOut);
     uiContentElement.addEventListener('mousemove', handleLogEntryMouseMove);
     let resizeTimeout;
     const observer = new ResizeObserver(entries => {
         clearTimeout(resizeTimeout);
         resizeTimeout = setTimeout(() => {
             if (!isDraggingInterface && isUserInterfaceVisible && !isUserInterfaceMinimized) {
                saveApplicationState();
             }
         }, 500);
     });
     if (uiContainerElement) observer.observe(uiContainerElement);

     window.dreadcastLoggerResizeObserver = observer;
     document.addEventListener('keydown', handleGlobalKeyDown);
}

function detachUserInterfaceEventListeners() {
     document.removeEventListener('keydown', handleGlobalKeyDown);

     if (window.dreadcastLoggerResizeObserver) {
         window.dreadcastLoggerResizeObserver.disconnect();
         window.dreadcastLoggerResizeObserver = null;
     }
}

function handleGlobalKeyDown(event) { // Ici pour changer les raccourcis
    const isToggleShortcut = (
        (event.altKey && event.key.toLowerCase() === 'n') ||
        (event.metaKey && event.shiftKey && event.key.toLowerCase() === 'n') ||
        (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'n')
    );

    if (isToggleShortcut) {
        event.preventDefault();
        event.stopPropagation();
        if (!isUserInterfaceVisible) {
            showUserInterface(true);
        } else {
            hideUserInterface();
        }
    }
    if (event.key === "Escape") {
        if (modalOverlayElement && modalOverlayElement.style.display === 'flex') {
            if (importExportModalElement && importExportModalElement.style.display !== 'none') {
                 hideImportExportModal();
                 event.preventDefault();
            }
            if (mergeLogsModalElement && mergeLogsModalElement.style.display !== 'none') {
                 hideMergeLogsModal();
                 event.preventDefault();
            }
        }
    }
}

function updateUserInterface() {
    if (!uiContainerElement) return;
    uiContainerElement.style.display = isUserInterfaceVisible ? 'flex' : 'none';
    if (!isUserInterfaceVisible) {
         if (modeSelectorMenuElement) modeSelectorMenuElement.style.display = 'none';
         if (logSelectorMenuElement) logSelectorMenuElement.style.display = 'none';
         hideTooltip();
         return;
    }
    const { dataToDisplay, logDisplayName, barDisplayColor } = getDisplayDataAndInfo();
    if (uiHeaderTitleElement) {
         uiHeaderTitleElement.textContent = logDisplayName;
         uiHeaderTitleElement.title = isUserInterfaceMinimized ? 'Double-clic pour restaurer' : logDisplayName;
    }
    updateModeMenuHighlight();
    updateLogSelectorMenuContents();
    if (isUserInterfaceMinimized) {
         uiContentElement.innerHTML = '';
         if (modeSelectorMenuElement) modeSelectorMenuElement.style.display = 'none';
         if (logSelectorMenuElement) logSelectorMenuElement.style.display = 'none';
         if (uiHeaderElement) {
            const headerHeight = `${uiHeaderElement.offsetHeight}px`;
            if (uiContainerElement.style.height !== headerHeight) uiContainerElement.style.height = headerHeight;
            if (uiContainerElement.style.minHeight !== headerHeight) uiContainerElement.style.minHeight = headerHeight;
         }
    }
    else {
        renderLogContent(dataToDisplay, barDisplayColor);
    }
}

function getDisplayDataAndInfo() {
    let sourceDataBundle = null;
    let logDisplayName = "Inconnu";
    let isGlobalViewActive = currentlyViewingLogId === 'global';
    const simpleModes = ['damage', 'healing', 'taken', 'mitigated', 'protection', 'crits', 'missed', 'intercepted'];
    const detailedModesMap = {
        damage: 'detailedDamage', healing: 'detailedHealing', taken: 'detailedTaken',
        mitigated: 'detailedMitigated', protection: 'detailedProtection', crits: 'detailedCrits', missed: 'detailedMissed', intercepted: 'detailedIntercepted'
    };
    const detailedValueKeys = {
        damage: 'damage', healing: 'healing', taken: 'damage', mitigated: 'mitigation',
        protection: 'protection', crits: 'crits',
        missed: 'hits', intercepted: 'hits'
    };

    if (currentlyViewingLogId === 'current') {
        sourceDataBundle = activeCombatData || initializeEmptyCombatData();
        ensureCompleteDataStructure(sourceDataBundle);
        logDisplayName = currentCombatId ? `Combat Actuel (ID: ${currentCombatId})` : "Aucun combat actif";
    } else if (isGlobalViewActive) {
        logDisplayName = "Données globales";
        sourceDataBundle = initializeEmptyCombatData();
        const logsToAggregate = [...savedCombatLogs];
        const activeDataHasCoreCombatEvents = activeCombatData && combatDataHasMeaningfulEvents(activeCombatData);

        if (currentCombatId && activeDataHasCoreCombatEvents) {
            const currentActiveClone = structuredClone(activeCombatData);
            ensureCompleteDataStructure(currentActiveClone);
            logsToAggregate.push({ data: currentActiveClone, id: currentCombatId });
        }

        for (const log of logsToAggregate) {
            if (!log.data) continue;
            ensureCompleteDataStructure(log.data);

            for (const mode of simpleModes) {
                if (log.data[mode]) {
                    for (const [name, value] of Object.entries(log.data[mode])) {
                        sourceDataBundle[mode][name] = (sourceDataBundle[mode][name] || 0) + value;
                    }
                }
             }
             for (const mode of simpleModes) {
                 const detailedMode = detailedModesMap[mode];
                 if (log.data[detailedMode]) {
                     for (const [primaryName, primaryDetails] of Object.entries(log.data[detailedMode])) {
                         if (!sourceDataBundle[detailedMode][primaryName]) {
                             if (mode === 'crits') { sourceDataBundle[detailedMode][primaryName] = { maxCritValue: 0, targets: {} }; }
                             else if (mode === 'intercepted') { sourceDataBundle[detailedMode][primaryName] = {}; }
                             else { sourceDataBundle[detailedMode][primaryName] = {}; }
                         }

                         if (mode === 'intercepted') {
                             for (const [interceptorName, instancesArray] of Object.entries(primaryDetails)) {
                                 if (!sourceDataBundle[detailedMode][primaryName][interceptorName]) {
                                     sourceDataBundle[detailedMode][primaryName][interceptorName] = [];
                                 }
                                 sourceDataBundle[detailedMode][primaryName][interceptorName].push(...instancesArray);
                             }
                         } else if (mode === 'crits') {
                             sourceDataBundle[detailedMode][primaryName].maxCritValue = Math.max(sourceDataBundle[detailedMode][primaryName].maxCritValue || 0, primaryDetails.maxCritValue || 0);
                             if (primaryDetails.targets) {
                                  if (!sourceDataBundle[detailedMode][primaryName].targets) sourceDataBundle[detailedMode][primaryName].targets = {};
                                 for (const [secondaryName, targetData] of Object.entries(primaryDetails.targets)) {
                                     if (!sourceDataBundle[detailedMode][primaryName].targets[secondaryName]) {
                                         sourceDataBundle[detailedMode][primaryName].targets[secondaryName] = { crits: 0, actions: 0 };
                                     }
                                     sourceDataBundle[detailedMode][primaryName].targets[secondaryName].crits = (sourceDataBundle[detailedMode][primaryName].targets[secondaryName].crits || 0) + (targetData.crits || 0);
                                     sourceDataBundle[detailedMode][primaryName].targets[secondaryName].actions = (sourceDataBundle[detailedMode][primaryName].targets[secondaryName].actions || 0) + (targetData.actions || 0);
                                 }
                             }
                         } else if (typeof primaryDetails === 'object') {
                              const valueKey = detailedValueKeys[mode];
                              for (const [secondaryName, targetData] of Object.entries(primaryDetails)) {
                                  if (!sourceDataBundle[detailedMode][primaryName][secondaryName]) {
                                      sourceDataBundle[detailedMode][primaryName][secondaryName] = { [valueKey]: 0, hits: 0 };
                                      if (mode === 'damage' || mode === 'taken') {
                                          sourceDataBundle[detailedMode][primaryName][secondaryName].weapons = {};
                                      }
                                  }
                                  sourceDataBundle[detailedMode][primaryName][secondaryName][valueKey] = (sourceDataBundle[detailedMode][primaryName][secondaryName][valueKey] || 0) + (targetData[valueKey] || 0);

                                  if (targetData.hits !== undefined && (mode !== 'missed')) {
                                    sourceDataBundle[detailedMode][primaryName][secondaryName].hits = (sourceDataBundle[detailedMode][primaryName][secondaryName].hits || 0) + (targetData.hits || 0);
                                  }

                                  if ((mode === 'damage' || mode === 'taken') && targetData.weapons) {
                                      if (!sourceDataBundle[detailedMode][primaryName][secondaryName].weapons) {
                                          sourceDataBundle[detailedMode][primaryName][secondaryName].weapons = {};
                                      }
                                      for (const [weaponName, weaponStats] of Object.entries(targetData.weapons)) {
                                          if (!sourceDataBundle[detailedMode][primaryName][secondaryName].weapons[weaponName]) {
                                              sourceDataBundle[detailedMode][primaryName][secondaryName].weapons[weaponName] = { damage: 0, hits: 0, crits: 0 };
                                          }
                                          sourceDataBundle[detailedMode][primaryName][secondaryName].weapons[weaponName].damage += (weaponStats.damage || 0);
                                          sourceDataBundle[detailedMode][primaryName][secondaryName].weapons[weaponName].hits += (weaponStats.hits || 0);
                                          sourceDataBundle[detailedMode][primaryName][secondaryName].weapons[weaponName].crits += (weaponStats.crits || 0);
                                      }
                                  }
                              }
                         }
                     }
                 }
             }

            if (log.data.projectedGains) {
                for (const [playerName, gains] of Object.entries(log.data.projectedGains)) {
                    if (!sourceDataBundle.projectedGains[playerName]) {
                        sourceDataBundle.projectedGains[playerName] = { resistance: 0, force: 0, agilite: 0, perception: 0, medecine: 0 };
                    }
                    sourceDataBundle.projectedGains[playerName].resistance += (gains.resistance || 0);
                    sourceDataBundle.projectedGains[playerName].force += (gains.force || 0);
                    sourceDataBundle.projectedGains[playerName].agilite += (gains.agilite || 0);
                    sourceDataBundle.projectedGains[playerName].perception += (gains.perception || 0);
                    sourceDataBundle.projectedGains[playerName].medecine += (gains.medecine || 0);
                }
            }
            if (log.data.initiativeStats) {
                if (!sourceDataBundle.initiativeStats) sourceDataBundle.initiativeStats = {};
                for (const [playerName, stats] of Object.entries(log.data.initiativeStats)) {
                    if (!sourceDataBundle.initiativeStats[playerName]) {
                        sourceDataBundle.initiativeStats[playerName] = { totalTurnsPlayed: 0, turnOrderCounts: {} };
                    }
                    sourceDataBundle.initiativeStats[playerName].totalTurnsPlayed += (stats.totalTurnsPlayed || 0);
                    for (const [order, count] of Object.entries(stats.turnOrderCounts || {})) {
                        sourceDataBundle.initiativeStats[playerName].turnOrderCounts[order] = (sourceDataBundle.initiativeStats[playerName].turnOrderCounts[order] || 0) + count;
                    }
                }
            }
        }
    } else {
        const logIndex = parseInt(currentlyViewingLogId, 10);
        const savedLog = savedCombatLogs[logIndex];
        if (savedLog && savedLog.data) {
            sourceDataBundle = savedLog.data;
            ensureCompleteDataStructure(sourceDataBundle);
            logDisplayName = `${savedLog.name || `Combat Archivé ${savedLog.id || logIndex}`} (Archivé)`;
        } else {
            currentlyViewingLogId = 'current';
            sourceDataBundle = activeCombatData || initializeEmptyCombatData();
            ensureCompleteDataStructure(sourceDataBundle);
            logDisplayName = currentCombatId ? `Combat Actuel (ID: ${currentCombatId})` : "Aucun combat actif";
        }
    }
    if (!sourceDataBundle) {
        sourceDataBundle = initializeEmptyCombatData();
        ensureCompleteDataStructure(sourceDataBundle);
    }

    let dataToDisplay = {};
    let barDisplayColor = MODE_BAR_COLORS.default;

    switch (currentDisplayMode) {
         case 'damage': dataToDisplay = sourceDataBundle.damage || {}; barDisplayColor = MODE_BAR_COLORS.damage; break;
         case 'healing': dataToDisplay = sourceDataBundle.healing || {}; barDisplayColor = MODE_BAR_COLORS.healing; break;
         case 'taken': dataToDisplay = sourceDataBundle.taken || {}; barDisplayColor = MODE_BAR_COLORS.taken; break;
         case 'mitigated': dataToDisplay = sourceDataBundle.mitigated || {}; barDisplayColor = MODE_BAR_COLORS.mitigated; break;
         case 'protection': dataToDisplay = sourceDataBundle.protection || {}; barDisplayColor = MODE_BAR_COLORS.protection; break;
         case 'crits': dataToDisplay = sourceDataBundle.crits || {}; barDisplayColor = MODE_BAR_COLORS.crits; break;
         case 'missed': dataToDisplay = sourceDataBundle.missed || {}; barDisplayColor = MODE_BAR_COLORS.missed; break;
         case 'intercepted': dataToDisplay = sourceDataBundle.intercepted || {}; barDisplayColor = MODE_BAR_COLORS.intercepted; break;
         case 'projectedGains': dataToDisplay = sourceDataBundle.projectedGains || {}; barDisplayColor = MODE_BAR_COLORS.projectedGains; break;
         case 'initiativeStats':
            dataToDisplay = Object.entries(sourceDataBundle.initiativeStats || {}).reduce((acc, [name, stats]) => {
                acc[name] = stats.totalTurnsPlayed || 0;
                return acc;
            }, {});
            barDisplayColor = MODE_BAR_COLORS.initiativeStats;
            break;
         default: dataToDisplay = {}; break;
    }
    return { dataToDisplay, logDisplayName, barDisplayColor, sourceDataBundle, detailedValueKey: detailedValueKeys[currentDisplayMode] };
}

function renderLogContent(dataToDisplay, barDisplayColor) {
    if (!uiContentElement) return;

    if (currentDisplayMode === 'projectedGains') {
        const playerGainsEntries = Object.entries(dataToDisplay)
            .map(([name, gains]) => ({ name, gains }))
            .filter(entry => entry.gains.resistance > 0 || entry.gains.force > 0 || entry.gains.agilite > 0 || entry.gains.perception > 0 || entry.gains.medecine > 0)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (playerGainsEntries.length === 0) {
            let message = 'Aucun gain de stat projeté pour le moment.';
             if (currentlyViewingLogId === 'current' && !currentCombatId) message = 'Aucun combat actif.';
             else if (currentlyViewingLogId === 'global' && savedCombatLogs.length === 0 && !currentCombatId && Object.keys(activeCombatData.projectedGains || {}).length === 0) message = 'Aucune donnée globale disponible.';
             else if (currentlyViewingLogId !== 'current' && currentlyViewingLogId !== 'global') message = 'Ce log archivé ne contient pas de gains de stats projetés.';
            uiContentElement.innerHTML = `<div style="padding: 10px; text-align: center; color: #aaa;">${message}</div>`;
            return;
        }

        let htmlContent = '';
        playerGainsEntries.forEach(entry => {
            const name = entry.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const gains = entry.gains;
            htmlContent += `<div class="projected-gains-entry" data-primary-name="${name}" data-mode="projectedGains">`;
            htmlContent += `<div class="projected-gains-player-name">${name}:</div>`;
            if (gains.force > 0) {
                htmlContent += `<div class="projected-gains-stat"><span class="stat-label">Force:</span><span class="stat-value force-gain">+${gains.force.toFixed(2)}</span></div>`;
            }
            if (gains.agilite > 0) {
                htmlContent += `<div class="projected-gains-stat"><span class="stat-label">Agilité:</span><span class="stat-value agilite-gain">+${gains.agilite.toFixed(2)}</span></div>`;
            }
            if (gains.perception > 0) {
                htmlContent += `<div class="projected-gains-stat"><span class="stat-label">Perception:</span><span class="stat-value perception-gain">+${gains.perception.toFixed(2)}</span></div>`;
            }
            if (gains.medecine > 0) {
                htmlContent += `<div class="projected-gains-stat"><span class="stat-label">Médecine:</span><span class="stat-value medecine-gain">+${gains.medecine.toFixed(2)}</span></div>`;
            }
            if (gains.resistance > 0) {
                htmlContent += `<div class="projected-gains-stat"><span class="stat-label">Résistance:</span><span class="stat-value resistance-gain">+${gains.resistance.toFixed(4)}</span></div>`;
            }
            htmlContent += `</div>`;
        });
        uiContentElement.innerHTML = htmlContent;

    } else {
        const sortedEntries = Object.entries(dataToDisplay)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        if (sortedEntries.length === 0) {
            let message = 'En attente de données...';
            if (currentlyViewingLogId === 'current' && !currentCombatId) message = 'Aucun combat actif.';
            else if (currentlyViewingLogId === 'global' && savedCombatLogs.length === 0 && !currentCombatId && !(currentDisplayMode === 'initiativeStats' && activeCombatData && Object.keys(activeCombatData.initiativeStats||{}).length > 0) ) message = 'Aucune donnée globale disponible.';
            else if (currentlyViewingLogId !== 'current' && currentlyViewingLogId !== 'global') message = 'Ce log archivé est vide.';
            else if (currentDisplayMode === 'crits') message = `Aucun coup critique enregistré.`;
            else if (currentDisplayMode === 'missed') message = `Aucun coup manqué enregistré.`;
            else if (currentDisplayMode === 'intercepted') message = `Aucun tir intercepté enregistré.`;
            else if (currentDisplayMode === 'initiativeStats') message = `Aucune donnée d'initiative.`;
            uiContentElement.innerHTML = `<div style="padding: 10px; text-align: center; color: #aaa;">${message}</div>`;
            return;
        }

        const maxValue = sortedEntries.length > 0 ? Math.max(1, sortedEntries[0].value) : 1;
        let htmlContent = '';
        let valueSuffix = currentDisplayMode === 'initiativeStats' ? ' tours' : '';

        sortedEntries.forEach((entry, index) => {
            const name = entry.name;
            const value = Math.max(0, entry.value);
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            let dataAttribute = `data-primary-name="${safeName}" data-mode="${currentDisplayMode}"`;
            htmlContent += `
                <div class="logger-entry" ${dataAttribute}>
                    <div class="logger-row">
                        <span class="logger-rank">${index + 1}.</span>
                        <span class="logger-name" title="${safeName}">${safeName}</span>
                        <span class="logger-value" style="color: ${barDisplayColor};">${value}${valueSuffix}</span>
                    </div>
                    <div class="logger-bar-container">
                        <div class="logger-bar" style="width: ${percentage.toFixed(1)}%; background-color: ${barDisplayColor};"></div>
                    </div>
                </div>`;
        });
        uiContentElement.innerHTML = htmlContent;
    }
}


function updateModeMenuHighlight() {
    if (!modeSelectorMenuElement) return;
    modeSelectorMenuElement.querySelectorAll('.menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.mode === currentDisplayMode);
    });
}

function updateLogSelectorMenuContents() {
    if (!logSelectorMenuElement) return;
    logSelectorMenuElement.innerHTML = '';

    const manageDataItem = document.createElement('div');
    manageDataItem.className = 'menu-item';
    manageDataItem.dataset.action = 'manage-data';
    const manageDataText = document.createElement('span');
    manageDataText.className = 'menu-item-text';
    manageDataText.textContent = '⚙️ Import/Export';
    manageDataText.title = 'Exporter ou Importer vos données de logs';
    manageDataItem.appendChild(manageDataText);
    logSelectorMenuElement.appendChild(manageDataItem);

    const mergeLogsItem = document.createElement('div');
    mergeLogsItem.className = 'menu-item';
    mergeLogsItem.dataset.action = 'merge-logs';
    const mergeLogsText = document.createElement('span');
    mergeLogsText.className = 'menu-item-text';
    mergeLogsText.textContent = '🔗 Fusionner';
    mergeLogsText.title = 'Fusionner les données de deux logs archivés en un seul';
    mergeLogsItem.appendChild(mergeLogsText);
    if (savedCombatLogs.length < 2) {
        mergeLogsItem.classList.add('disabled');
        mergeLogsText.title = 'Nécessite au moins deux logs archivés pour fusionner';
    }
    logSelectorMenuElement.appendChild(mergeLogsItem);


    const firstSeparator = document.createElement('hr');
    firstSeparator.style.cssText = 'border-color: #555; margin: 3px 0;';
    logSelectorMenuElement.appendChild(firstSeparator);

    const globalItem = document.createElement('div');
    globalItem.className = 'menu-item';
    globalItem.dataset.logId = 'global';
    globalItem.classList.toggle('active', currentlyViewingLogId === 'global');
    const globalText = document.createElement('span');
    globalText.className = 'menu-item-text';
    globalText.textContent = 'Données globales';
    globalItem.appendChild(globalText);
    logSelectorMenuElement.appendChild(globalItem);

    const currentItem = document.createElement('div');
    currentItem.className = 'menu-item';
    currentItem.dataset.logId = 'current';
    currentItem.classList.toggle('active', currentlyViewingLogId === 'current');
    const currentText = document.createElement('span');
    currentText.className = 'menu-item-text';
    currentText.textContent = currentCombatId ? `Combat Actuel (ID: ${currentCombatId})` : 'Combat Actuel';
    currentText.title = currentCombatId ? `Combat Actuel (ID: ${currentCombatId})` : "Aucun combat actif";
    currentItem.appendChild(currentText);
    logSelectorMenuElement.appendChild(currentItem);

    if (savedCombatLogs.length > 0) {
        const savedLogsSeparator = document.createElement('hr');
        savedLogsSeparator.style.cssText = 'border-color: #555; margin: 3px 0;';
        logSelectorMenuElement.appendChild(savedLogsSeparator);
        [...savedCombatLogs].sort((a,b) => b.timestamp - a.timestamp)
                            .forEach((log) => {
            const originalIndex = savedCombatLogs.findIndex(l => l.id === log.id);
            const item = document.createElement('div');
            item.className = 'menu-item';
            item.dataset.logId = originalIndex.toString();
            item.classList.toggle('active', currentlyViewingLogId === originalIndex.toString());

            const textSpan = document.createElement('span');
            textSpan.className = 'menu-item-text';
            textSpan.textContent = log.name || `Combat Archivé ${log.id || originalIndex}`;
            textSpan.title = `Archivé le: ${new Date(log.timestamp).toLocaleString()}`;

            const renameButton = document.createElement('span');
            renameButton.className = CLASS_RENAME_LOG_BUTTON;
            renameButton.textContent = '🖊️';
            renameButton.title = 'Renommer ce log';
            renameButton.dataset.logIndex = originalIndex.toString();

            const deleteButton = document.createElement('span');
            deleteButton.className = CLASS_DELETE_LOG_BUTTON;
            deleteButton.textContent = 'X';
            deleteButton.title = 'Supprimer ce log';
            deleteButton.dataset.logIndex = originalIndex.toString();

            item.appendChild(textSpan);
            item.appendChild(renameButton);
            item.appendChild(deleteButton);
            logSelectorMenuElement.appendChild(item);
        });
    }
     if (logSelectorButtonElement) {
         let buttonTitle = 'Sélectionner le log';
         if (currentlyViewingLogId === 'global') {
             buttonTitle = 'Affichage : Données globales';
         } else if (currentlyViewingLogId === 'current') {
             buttonTitle = `Affichage : ${currentCombatId ? `Combat Actuel (ID: ${currentCombatId})` : "Combat Actuel"}`;
         } else {
             const logIndex = parseInt(currentlyViewingLogId, 10);
             if (!isNaN(logIndex) && savedCombatLogs[logIndex]) {
                 buttonTitle = `Affichage : ${savedCombatLogs[logIndex].name || `Combat Archivé ${savedCombatLogs[logIndex].id || logIndex}`}`;
             } else {
                 buttonTitle = 'Affichage : Log invalide';
                 currentlyViewingLogId = 'current';
             }
         }
         logSelectorButtonElement.title = buttonTitle;
     }
}

function showMenuPopup(menuElement, buttonElement) {
    if (!menuElement || !buttonElement || !isUserInterfaceVisible || isUserInterfaceMinimized) return;
    if (menuHideTimeoutId) { clearTimeout(menuHideTimeoutId); menuHideTimeoutId = null; }
    const otherMenu = menuElement === modeSelectorMenuElement ? logSelectorMenuElement : modeSelectorMenuElement;
    if (otherMenu && otherMenu.style.display === 'block') {
         otherMenu.style.display = 'none';
    }
    const buttonRect = buttonElement.getBoundingClientRect();
    const menuStyle = menuElement.style;
    menuStyle.display = 'block';
    menuStyle.top = `${buttonRect.bottom + window.scrollY}px`;
    if (menuElement === modeSelectorMenuElement) {
        menuStyle.left = `${buttonRect.left + window.scrollX}px`;
        menuStyle.right = '';
    } else {
        menuStyle.left = `${buttonRect.right + window.scrollX - menuElement.offsetWidth}px`;
        menuStyle.right = '';
    }
    const menuRect = menuElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    if (menuRect.right > viewportWidth - 10) {
         menuStyle.left = `${viewportWidth - menuRect.width - 10 + window.scrollX}px`;
     }
    if (menuRect.left < 10) {
         menuStyle.left = `${10 + window.scrollX}px`;
     }
}

function hideMenuPopup(menuElement, hideImmediately = false) {
    if (!menuElement) return;
    if (menuHideTimeoutId) { clearTimeout(menuHideTimeoutId); menuHideTimeoutId = null; }
    const delay = hideImmediately ? 0 : MENU_HIDE_DELAY_MS;
    menuHideTimeoutId = setTimeout(() => {
        if (menuElement) menuElement.style.display = 'none';
        menuHideTimeoutId = null;
    }, delay);
}

function handleModeMenuItemClick(event) {
    const target = event.target;
    const menuItem = target.closest('.menu-item');
    if (menuItem && menuItem.dataset.mode) {
        const mode = menuItem.dataset.mode;
        if (mode !== currentDisplayMode) {
            currentDisplayMode = mode;
            updateUserInterface();
            hideTooltip();
        }
        hideMenuPopup(modeSelectorMenuElement, true);
    }
}

function handleLogMenuItemClick(event) {
    const target = event.target;
    if (target.classList.contains(CLASS_RENAME_LOG_BUTTON) && target.dataset.logIndex !== undefined) {
        event.stopPropagation();
        const logIndex = parseInt(target.dataset.logIndex, 10);
        renameSpecificLog(logIndex);
        hideMenuPopup(logSelectorMenuElement, true);
        return;
    }
    if (target.classList.contains(CLASS_DELETE_LOG_BUTTON) && target.dataset.logIndex !== undefined) {
        event.stopPropagation();
        const logIndex = parseInt(target.dataset.logIndex, 10);
        deleteSpecificLog(logIndex);
        hideMenuPopup(logSelectorMenuElement, true);
        return;
    }
    const menuItem = target.closest('.menu-item');
    if (menuItem) {
        if (menuItem.classList.contains('disabled')) {
            event.stopPropagation();
            hideMenuPopup(logSelectorMenuElement, true);
            return;
        }
        if (menuItem.dataset.logId !== undefined) {
            const logId = menuItem.dataset.logId;
            if (logId !== currentlyViewingLogId) {
                currentlyViewingLogId = logId;
                updateUserInterface();
                hideTooltip();
            }
            hideMenuPopup(logSelectorMenuElement, true);
        } else if (menuItem.dataset.action === 'manage-data') {
            showImportExportModal();
            hideMenuPopup(logSelectorMenuElement, true);
        } else if (menuItem.dataset.action === 'merge-logs') {
            showMergeLogsModal();
            hideMenuPopup(logSelectorMenuElement, true);
        }
    }
}

function hideUserInterface() {
    if (!isUserInterfaceVisible) return;
    isUserInterfaceVisible = false;
    if (uiContainerElement) uiContainerElement.style.display = 'none';
    if (modeSelectorMenuElement) modeSelectorMenuElement.style.display = 'none';
    if (logSelectorMenuElement) logSelectorMenuElement.style.display = 'none';
    hideTooltip();
    saveApplicationState();
}

function showUserInterface(resetPosition = false) {
    if (resetPosition) {
        savedUserInterfacePosition.top = INITIAL_UI_POSITION.top;
        savedUserInterfacePosition.left = INITIAL_UI_POSITION.left;
        savedUserInterfacePosition.width = '250px';
        savedUserInterfacePosition.height = '350px';

        if (uiContainerElement) {
            uiContainerElement.style.top = INITIAL_UI_POSITION.top;
            uiContainerElement.style.left = INITIAL_UI_POSITION.left;
            uiContainerElement.style.width = savedUserInterfacePosition.width;
            uiContainerElement.style.height = savedUserInterfacePosition.height;
            if (isUserInterfaceMinimized) {
                isUserInterfaceMinimized = false;
                uiContainerElement.classList.remove('minimized');
                uiContainerElement.style.minHeight = '';
            }
        }
    }

    if (isUserInterfaceVisible && uiContainerElement && !resetPosition) {
         uiContainerElement.style.display = 'flex';
         return;
    }

    isUserInterfaceVisible = true;
    if (!uiContainerElement) {
        createUserInterface();
    } else {
        uiContainerElement.style.display = 'flex';
        updateUserInterface();
    }
    saveApplicationState();
}

function handleInterfaceMouseDown(event) {
    if (event.button !== 0 || event.target.closest('.header-icon')) return;
     if (modeSelectorMenuElement?.style.display === 'block' && modeSelectorMenuElement.contains(event.target)) return;
     if (logSelectorMenuElement?.style.display === 'block' && logSelectorMenuElement.contains(event.target)) return;
    isDraggingInterface = true;
    dragStartX = event.clientX; dragStartY = event.clientY;
    initialDragX = uiContainerElement.offsetLeft; initialDragY = uiContainerElement.offsetTop;
    document.addEventListener('mousemove', handleInterfaceMouseMove);
    document.addEventListener('mouseup', handleInterfaceMouseUp);
    event.preventDefault();
    if (uiContainerElement) uiContainerElement.style.cursor = 'grabbing';
}

function handleInterfaceMouseMove(event) {
    if (!isDraggingInterface || !uiContainerElement) return;
    const deltaX = event.clientX - dragStartX; const deltaY = event.clientY - dragStartY;
    uiContainerElement.style.left = `${initialDragX + deltaX}px`;
    uiContainerElement.style.top = `${initialDragY + deltaY}px`;
    event.preventDefault();
    if (modeSelectorMenuElement) modeSelectorMenuElement.style.display = 'none';
    if (logSelectorMenuElement) logSelectorMenuElement.style.display = 'none';
}

function handleInterfaceMouseUp(event) {
    if (event.button !== 0) return;
    if (isDraggingInterface) {
        isDraggingInterface = false;
        document.removeEventListener('mousemove', handleInterfaceMouseMove);
        document.removeEventListener('mouseup', handleInterfaceMouseUp);
        if (uiContainerElement) uiContainerElement.style.cursor = 'default';
        if (uiHeaderElement) uiHeaderElement.style.cursor = 'move';
        saveApplicationState();
    }
}

function handleHeaderDoubleClick(event) {
     if (event.target.closest('.header-icon')) return;
     toggleMinimizeUserInterface();
}

function toggleMinimizeUserInterface() {
    if (!uiContainerElement || !uiHeaderElement) return;
    isUserInterfaceMinimized = !isUserInterfaceMinimized;
    if (isUserInterfaceMinimized) {
        if (!uiContainerElement.classList.contains('minimized')) {
            if (uiContainerElement.style.width) savedUserInterfacePosition.width = uiContainerElement.style.width;
            if (uiContainerElement.style.height) savedUserInterfacePosition.height = uiContainerElement.style.height;

        }
        uiContainerElement.classList.add('minimized');
        const headerHeight = `${uiHeaderElement.offsetHeight}px`;
        uiContainerElement.style.height = headerHeight;
        uiContainerElement.style.minHeight = headerHeight;
        hideMenuPopup(modeSelectorMenuElement, true);
        hideMenuPopup(logSelectorMenuElement, true);
        hideTooltip();
        if (uiHeaderTitleElement) uiHeaderTitleElement.title = 'Double-clic pour restaurer';
    } else {
        uiContainerElement.classList.remove('minimized');
        uiContainerElement.style.width = savedUserInterfacePosition.width || '250px';
        uiContainerElement.style.height = savedUserInterfacePosition.height || '350px';
        uiContainerElement.style.minHeight = '';
        if (uiHeaderTitleElement) uiHeaderTitleElement.title = '';
        updateUserInterface();
    }
    saveApplicationState();
}


function clearAllSavedLogs() {
    if (confirm("Êtes-vous sûr de vouloir supprimer TOUS les logs de combat archivés ? Le combat actuel (si actif) et les données globales ne seront pas affectées immédiatement, mais les archives seront perdues.")) {
        savedCombatLogs = [];
        saveApplicationState();
        if (currentlyViewingLogId !== 'current' && currentlyViewingLogId !== 'global') {
             currentlyViewingLogId = 'current';
        }
        if (uiContainerElement && isUserInterfaceVisible) updateUserInterface();
        hideTooltip();
    }
}

function deleteSpecificLog(logIndex) {
    if (logIndex < 0 || logIndex >= savedCombatLogs.length) return;
    const logToDelete = savedCombatLogs[logIndex];
    const logName = logToDelete.name || `Combat Archivé ${logToDelete.id || logIndex}`;
    if (confirm(`Êtes vous sûr de voulour supprimer ce log : "${logName}" ?`)) {
         const deletedLogId = savedCombatLogs[logIndex].id;
         savedCombatLogs.splice(logIndex, 1);

         if (currentlyViewingLogId === logIndex.toString()) {
             currentlyViewingLogId = 'current';
         } else if (currentlyViewingLogId !== 'current' && currentlyViewingLogId !== 'global') {
             const viewedIndex = parseInt(currentlyViewingLogId, 10);
             if (!isNaN(viewedIndex) && viewedIndex > logIndex) {
                 currentlyViewingLogId = (viewedIndex - 1).toString();
             } else if (isNaN(viewedIndex) || viewedIndex >= savedCombatLogs.length) {
                 currentlyViewingLogId = 'current';
             }
         }
         saveApplicationState();
         updateUserInterface();
         hideTooltip();
     }
}

function renameSpecificLog(logIndex) {
     if (logIndex < 0 || logIndex >= savedCombatLogs.length) return;
     const logToRename = savedCombatLogs[logIndex];
     const currentName = logToRename.name || `Combat Archivé ${logToRename.id || logIndex}`;
     const newName = prompt("Entrez le nouveau nom pour ce log :", currentName);
     if (newName !== null) {
         const trimmedName = newName.trim();
         if (trimmedName && trimmedName !== currentName) {
             savedCombatLogs[logIndex].name = trimmedName;
             saveApplicationState();
             updateUserInterface();
             hideTooltip();
         } else if (!trimmedName) {
             alert("Le nom du log ne peut pas être vide.");
         }
     }
}

function createImportExportModal() {
    if (document.getElementById(ID_MODAL_OVERLAY) && document.getElementById(ID_IMPORT_EXPORT_MODAL)) return;

    if (!modalOverlayElement) {
        modalOverlayElement = document.createElement('div');
        modalOverlayElement.id = ID_MODAL_OVERLAY;
        modalOverlayElement.addEventListener('click', function(event) {
            if (event.target === modalOverlayElement) {
                 if (importExportModalElement && importExportModalElement.style.display !== 'none') hideImportExportModal();
                 if (mergeLogsModalElement && mergeLogsModalElement.style.display !== 'none') hideMergeLogsModal();
            }
        });
        document.body.appendChild(modalOverlayElement);
    }

    if (document.getElementById(ID_IMPORT_EXPORT_MODAL)) return;

    importExportModalElement = document.createElement('div');
    importExportModalElement.id = ID_IMPORT_EXPORT_MODAL;
    importExportModalElement.style.display = 'none';
    importExportModalElement.innerHTML = `
        <button class="${CLASS_MODAL_CLOSE_BUTTON}" title="Fermer">×</button>
        <h4>Gestion des données Details!</h4>
        <h5>Exporter les données</h5>
        <div id="${ID_EXPORT_OPTIONS_DIV}" style="margin-bottom:10px;">
            <label style="margin-right:15px; font-size:12px;"><input type="radio" name="${NAME_EXPORT_SCOPE_RADIO}" value="all" checked> Tout exporter</label>
            <label style="font-size:12px;"><input type="radio" name="${NAME_EXPORT_SCOPE_RADIO}" value="selection"> Exporter une sélection</label>
        </div>
        <div id="${ID_EXPORT_LOG_LIST_DIV}" style="display:none; max-height: 120px; overflow-y: auto; border: 1px solid #3b4048; padding: 5px; margin-bottom:10px; font-size:11px;">
        </div>
        <div style="margin-bottom:10px; font-size:12px;">
            <label><input type="checkbox" id="${ID_INCLUDE_ACTIVE_COMBAT_CHECKBOX}" checked> Inclure un instantané du combat actuel (si actif)</label>
        </div>
        <p style="font-size:11px; color: #aaa; margin-top:-5px; margin-bottom:10px;">Générez un code contenant les logs sélectionnés.</p>
        <div class="modal-actions">
            <button id="${ID_GENERATE_EXPORT_BUTTON}">Générer le code d'exportation</button>
        </div>
        <textarea id="${ID_EXPORT_TEXTAREA}" readonly placeholder="Le code d'exportation apparaîtra ici..."></textarea>
        <div class="modal-actions">
            <button id="${ID_COPY_EXPORT_BUTTON}" disabled>Copier dans le presse-papiers</button>
        </div>
        <h5>Importer les données</h5>
        <p style="font-size:11px; color: #aaa; margin-top:-5px; margin-bottom:10px;">Collez un code d'exportation préalablement sauvegardé.</p>
        <textarea id="${ID_IMPORT_TEXTAREA}" placeholder="Collez le code d'importation ici..."></textarea>
        <div class="import-options">
            <label><input type="radio" name="${NAME_IMPORT_OPTION_RADIO}" value="merge" checked> Fusionner avec les logs existants</label>
            <label><input type="radio" name="${NAME_IMPORT_OPTION_RADIO}" value="replace"> Remplacer tous les logs existants</label>
        </div>
        <div class="modal-actions" style="margin-top:10px;">
            <button id="${ID_IMPORT_BUTTON}">Importer les données</button>
        </div>
        <div class="modal-status" id="modal-status-message"></div>
    `;
    modalOverlayElement.appendChild(importExportModalElement);
    exportTextareaElement = importExportModalElement.querySelector(`#${ID_EXPORT_TEXTAREA}`);
    importTextareaElement = importExportModalElement.querySelector(`#${ID_IMPORT_TEXTAREA}`);
    generateExportButtonElement = importExportModalElement.querySelector(`#${ID_GENERATE_EXPORT_BUTTON}`);
    copyExportButtonElement = importExportModalElement.querySelector(`#${ID_COPY_EXPORT_BUTTON}`);
    importButtonElement = importExportModalElement.querySelector(`#${ID_IMPORT_BUTTON}`);
    modalStatusElement = importExportModalElement.querySelector('#modal-status-message');
    exportLogListDivElement = importExportModalElement.querySelector(`#${ID_EXPORT_LOG_LIST_DIV}`);

    importExportModalElement.querySelector(`.${CLASS_MODAL_CLOSE_BUTTON}`).addEventListener('click', hideImportExportModal);
    generateExportButtonElement.addEventListener('click', handleGenerateExport);
    copyExportButtonElement.addEventListener('click', handleCopyToClipboard);
    importButtonElement.addEventListener('click', handleImportData);
    importTextareaElement.addEventListener('input', () => {
        if (modalStatusElement) modalStatusElement.textContent = '';
    });
    const exportScopeRadios = importExportModalElement.querySelectorAll(`input[name="${NAME_EXPORT_SCOPE_RADIO}"]`);
    exportScopeRadios.forEach(radio => {
        radio.addEventListener('change', handleExportScopeChange);
    });
    populateExportLogList();
}

function populateExportLogList() {
    if (!importExportModalElement || !exportLogListDivElement) return;
    exportLogListDivElement.innerHTML = '';
    if (savedCombatLogs.length === 0) {
        exportLogListDivElement.innerHTML = '<p style="color:#aaa; text-align:center;">Aucun log archivé à sélectionner.</p>';
        return;
    }
    savedCombatLogs.forEach((log, index) => {
        const logName = log.name || `Combat Archivé ${log.id || index}`;
        const checkboxId = `export-log-${index}`;
        const itemHtml = `
            <div style="margin-bottom:3px;">
                <label for="${checkboxId}" style="cursor:pointer; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${logName} (Archivé le: ${new Date(log.timestamp).toLocaleString()})">
                    <input type="checkbox" id="${checkboxId}" name="export-log-selection" value="${index}">
                    ${logName}
                </label>
            </div>`;
        exportLogListDivElement.insertAdjacentHTML('beforeend', itemHtml);
    });
}

function handleExportScopeChange() {
    if (!importExportModalElement || !exportLogListDivElement) return;
    const selectedScope = importExportModalElement.querySelector(`input[name="${NAME_EXPORT_SCOPE_RADIO}"]:checked`).value;
    if (selectedScope === 'selection') {
        populateExportLogList();
        exportLogListDivElement.style.display = 'block';
    } else {
        exportLogListDivElement.style.display = 'none';
    }
}

function showImportExportModal() {
    if (!importExportModalElement) createImportExportModal();
    if (modalOverlayElement && importExportModalElement) {
        if(mergeLogsModalElement) mergeLogsModalElement.style.display = 'none';
        importExportModalElement.style.display = 'flex';
        modalOverlayElement.style.display = 'flex';

        if (exportTextareaElement) exportTextareaElement.value = '';
        if (importTextareaElement) importTextareaElement.value = '';
        if (copyExportButtonElement) copyExportButtonElement.disabled = true;
        if (modalStatusElement) modalStatusElement.textContent = '';
        const mergeOption = importExportModalElement.querySelector(`input[name="${NAME_IMPORT_OPTION_RADIO}"][value="merge"]`);
        if (mergeOption) mergeOption.checked = true;
        const exportAllRadio = importExportModalElement.querySelector(`input[name="${NAME_EXPORT_SCOPE_RADIO}"][value="all"]`);
        if (exportAllRadio) exportAllRadio.checked = true;
        if (exportLogListDivElement) exportLogListDivElement.style.display = 'none';
        const includeActiveCheckbox = importExportModalElement.querySelector(`#${ID_INCLUDE_ACTIVE_COMBAT_CHECKBOX}`);
        if (includeActiveCheckbox) includeActiveCheckbox.checked = true;
        populateExportLogList();
    }
}

function hideImportExportModal() {
    if (importExportModalElement) importExportModalElement.style.display = 'none';
    if (modalOverlayElement && (!mergeLogsModalElement || mergeLogsModalElement.style.display === 'none')) {
        modalOverlayElement.style.display = 'none';
    }
}

function handleGenerateExport() {
    const selectedScope = importExportModalElement.querySelector(`input[name="${NAME_EXPORT_SCOPE_RADIO}"]:checked`).value;
    const includeActiveCombat = importExportModalElement.querySelector(`#${ID_INCLUDE_ACTIVE_COMBAT_CHECKBOX}`).checked;
    let logsToExport = [];

    if (selectedScope === 'all') {
        logsToExport = structuredClone(savedCombatLogs.map(log => {
            if(log.data) ensureCompleteDataStructure(log.data);
            return log;
        }));
    } else {
        const selectedCheckboxes = importExportModalElement.querySelectorAll(`input[name="export-log-selection"]:checked`);
        selectedCheckboxes.forEach(checkbox => {
            const logIndex = parseInt(checkbox.value, 10);
            if (savedCombatLogs[logIndex]) {
                const logClone = structuredClone(savedCombatLogs[logIndex]);
                if(logClone.data) ensureCompleteDataStructure(logClone.data);
                logsToExport.push(logClone);
            }
        });
        if (logsToExport.length === 0 && !includeActiveCombat) {
            if (modalStatusElement) {
                modalStatusElement.textContent = 'Aucun log sélectionné pour l\'exportation.';
                modalStatusElement.className = 'modal-status error';
            }
            exportTextareaElement.value = '';
            copyExportButtonElement.disabled = true;
            return;
        }
    }

    const exportData = {
        exportVersion: EXPORT_VERSION,
        timestamp: new Date().toISOString(),
        data: { savedLogs: logsToExport }
    };

    if(activeCombatData) ensureCompleteDataStructure(activeCombatData);
    const activeDataHasMeaningfulEventsForExport = combatDataHasMeaningfulEvents(activeCombatData);


    if (includeActiveCombat && currentCombatId && activeDataHasMeaningfulEventsForExport) {
        const activeClone = structuredClone(activeCombatData);
        ensureCompleteDataStructure(activeClone);
        exportData.data.activeCombatSnapshot = {
            id: `snapshot_${currentCombatId}_${Date.now()}`,
            name: `Instantané Combat ${currentCombatId} (Exporté ${new Date().toLocaleDateString()})`,
            timestamp: Date.now(),
            data: activeClone
        };
    } else if (includeActiveCombat && logsToExport.length === 0) {
        if (!currentCombatId || !activeDataHasMeaningfulEventsForExport) {
            if (modalStatusElement) {
                modalStatusElement.textContent = 'Aucun log sélectionné et pas de combat actif à inclure.';
                modalStatusElement.className = 'modal-status error';
            }
            exportTextareaElement.value = '';
            copyExportButtonElement.disabled = true;
            return;
        }
    }

    try {
        const jsonString = JSON.stringify(exportData, null, 2);
        exportTextareaElement.value = jsonString;
        copyExportButtonElement.disabled = false;
        if (modalStatusElement) {
            let message = 'Code d\'exportation généré avec succès.';
            if (logsToExport.length > 0) message += ` (${logsToExport.length} logs archivés)`;
            if (exportData.data.activeCombatSnapshot) message += (logsToExport.length > 0 ? " et " : " (") + "l'instantané du combat actuel).";
            else if (logsToExport.length === 0 && !exportData.data.activeCombatSnapshot && !includeActiveCombat) message = "Aucune donnée sélectionnée pour l'export.";
            modalStatusElement.textContent = message;
            modalStatusElement.className = 'modal-status success';
        }
    } catch (e) {
        exportTextareaElement.value = "Erreur lors de la génération du code.";
        copyExportButtonElement.disabled = true;
        if (modalStatusElement) {
            modalStatusElement.textContent = 'Erreur lors de la génération du code.';
            modalStatusElement.className = 'modal-status error';
        }
    }
}

function handleCopyToClipboard() {
    if (!exportTextareaElement || exportTextareaElement.value === '') return;
    navigator.clipboard.writeText(exportTextareaElement.value)
        .then(() => {
            if (modalStatusElement) {
                modalStatusElement.textContent = 'Code copié dans le presse-papiers !';
                modalStatusElement.className = 'modal-status success';
            }
        })
        .catch(err => {
            if (modalStatusElement) {
                modalStatusElement.textContent = 'Erreur lors de la copie.';
                modalStatusElement.className = 'modal-status error';
            }
            try {
                exportTextareaElement.select();
                document.execCommand('copy');
                 if (modalStatusElement && modalStatusElement.textContent !== 'Code copié dans le presse-papiers !') {
                    modalStatusElement.textContent = 'Code copié (méthode alternative).';
                    modalStatusElement.className = 'modal-status success';
                }
            } catch (e) {
                 if (modalStatusElement) {
                    modalStatusElement.textContent = 'Erreur lors de la copie (alternative).';
                    modalStatusElement.className = 'modal-status error';
                 }
            }
        });
}

function handleImportData() {
    if (!importTextareaElement || importTextareaElement.value.trim() === '') {
        if (modalStatusElement) {
            modalStatusElement.textContent = 'Veuillez coller un code d\'importation.';
            modalStatusElement.className = 'modal-status error';
        }
        return;
    }
    let importObject;
    try {
        importObject = JSON.parse(importTextareaElement.value);
    } catch (e) {
        if (modalStatusElement) {
            modalStatusElement.textContent = 'Format JSON invalide.';
            modalStatusElement.className = 'modal-status error';
        }
        return;
    }
    if (!importObject || typeof importObject.data !== 'object' || !Array.isArray(importObject.data.savedLogs)) {
        if (modalStatusElement) {
            modalStatusElement.textContent = 'Structure de données d\'importation invalide.';
            modalStatusElement.className = 'modal-status error';
        }
        return;
    }

    const importOptionElement = importExportModalElement.querySelector(`input[name="${NAME_IMPORT_OPTION_RADIO}"]:checked`);
    const importOption = importOptionElement ? importOptionElement.value : 'merge';
    const newLogsToImport = importObject.data.savedLogs || [];
    if (importObject.data.activeCombatSnapshot && Object.keys(importObject.data.activeCombatSnapshot).length > 0) {
        newLogsToImport.push(importObject.data.activeCombatSnapshot);
    }
    if (newLogsToImport.length === 0) {
        if (modalStatusElement) {
            modalStatusElement.textContent = 'Aucun log trouvé dans les données d\'importation.';
            modalStatusElement.className = 'modal-status success';
        }
        return;
    }
    const validatedLogs = newLogsToImport.filter(log =>
        log && typeof log.id === 'string' && typeof log.name === 'string' &&
        typeof log.timestamp === 'number' && typeof log.data === 'object'
    ).map(log => {
        if(log.data) ensureCompleteDataStructure(log.data);
        return log;
    });

    if (validatedLogs.length === 0) {
        if (modalStatusElement) {
            modalStatusElement.textContent = 'Aucun log valide trouvé dans les données d\'importation.';
            modalStatusElement.className = 'modal-status error';
        }
        return;
    }
    if (importOption === 'replace') {
        if (!confirm("Êtes-vous sûr de vouloir remplacer TOUS vos logs archivés existants par ceux importés ? Cette action est irréversible.")) {
            if (modalStatusElement) {
                modalStatusElement.textContent = 'Importation annulée.';
                modalStatusElement.className = 'modal-status';
            }
            return;
        }
        savedCombatLogs = validatedLogs;
    } else {
        const existingLogIds = new Set(savedCombatLogs.map(log => log.id));
        const logsToAdd = validatedLogs.filter(log => !existingLogIds.has(log.id));
        savedCombatLogs.push(...logsToAdd);
    }
    savedCombatLogs.sort((a, b) => b.timestamp - a.timestamp);
    saveApplicationState();
    if (currentlyViewingLogId !== 'current' && currentlyViewingLogId !== 'global') {
        const oldViewedIndex = parseInt(currentlyViewingLogId, 10);
        if (isNaN(oldViewedIndex) || oldViewedIndex >= savedCombatLogs.length || !savedCombatLogs[oldViewedIndex]) {
            currentlyViewingLogId = 'current';
        }
    }
    updateUserInterface();
    if (modalStatusElement) {
        modalStatusElement.textContent = `Importation réussie ! ${validatedLogs.length} logs ${importOption === 'replace' ? 'importés' : 'traités'}.`;
        modalStatusElement.className = 'modal-status success';
    }
}


function createMergeLogsModal() {
    if (document.getElementById(ID_MODAL_OVERLAY) && document.getElementById(ID_MERGE_LOGS_MODAL)) return;

    if (!modalOverlayElement) {
        modalOverlayElement = document.createElement('div');
        modalOverlayElement.id = ID_MODAL_OVERLAY;
        modalOverlayElement.addEventListener('click', function(event) {
            if (event.target === modalOverlayElement) {
                 if (importExportModalElement && importExportModalElement.style.display !== 'none') hideImportExportModal();
                 if (mergeLogsModalElement && mergeLogsModalElement.style.display !== 'none') hideMergeLogsModal();
            }
        });
        document.body.appendChild(modalOverlayElement);
    }
    if (document.getElementById(ID_MERGE_LOGS_MODAL)) return;

    mergeLogsModalElement = document.createElement('div');
    mergeLogsModalElement.id = ID_MERGE_LOGS_MODAL;
    mergeLogsModalElement.style.display = 'none';
    mergeLogsModalElement.innerHTML = `
        <button class="${CLASS_MERGE_MODAL_CLOSE_BUTTON}" title="Fermer">×</button>
        <h4>Fusionner deux logs</h4>
        <p style="font-size:11px; color: #aaa; margin-top:-5px; margin-bottom:10px;">Sélectionnez deux logs à fusionner.</p>
        <div id="${ID_MERGE_LOGS_LIST_DIV}"></div>
        <div id="${ID_MERGE_LOGS_SELECTED_COUNT}">Logs sélectionnés : 0 / 2</div>
        <div class="modal-actions" style="margin-top:15px;">
            <button id="${ID_MERGE_LOGS_SUBMIT_BUTTON}" disabled>Fusionner les logs</button>
        </div>
    `;
    modalOverlayElement.appendChild(mergeLogsModalElement);

    mergeLogsListDivElement = mergeLogsModalElement.querySelector(`#${ID_MERGE_LOGS_LIST_DIV}`);
    mergeLogsSelectedCountElement = mergeLogsModalElement.querySelector(`#${ID_MERGE_LOGS_SELECTED_COUNT}`);
    mergeLogsSubmitButtonElement = mergeLogsModalElement.querySelector(`#${ID_MERGE_LOGS_SUBMIT_BUTTON}`);

    mergeLogsModalElement.querySelector(`.${CLASS_MERGE_MODAL_CLOSE_BUTTON}`).addEventListener('click', hideMergeLogsModal);
    mergeLogsSubmitButtonElement.addEventListener('click', handleMergeLogsSubmit);
    mergeLogsListDivElement.addEventListener('change', handleMergeLogSelectionChange);
}

function showMergeLogsModal() {
    if (!mergeLogsModalElement) createMergeLogsModal();
    if (modalOverlayElement && mergeLogsModalElement) {
        if (importExportModalElement) importExportModalElement.style.display = 'none';
        mergeLogsModalElement.style.display = 'flex';
        modalOverlayElement.style.display = 'flex';
        populateMergeLogsList();
        updateMergeLogsSelectionCount();
    }
}

function hideMergeLogsModal() {
    if (mergeLogsModalElement) mergeLogsModalElement.style.display = 'none';
     if (modalOverlayElement && (!importExportModalElement || importExportModalElement.style.display === 'none')) {
        modalOverlayElement.style.display = 'none';
    }
}

function populateMergeLogsList() {
    if (!mergeLogsListDivElement) return;
    mergeLogsListDivElement.innerHTML = '';
    if (savedCombatLogs.length < 2) {
        mergeLogsListDivElement.innerHTML = '<p style="color:#aaa; text-align:center;">Pas assez de logs pour une fusion.</p>';
        return;
    }
    savedCombatLogs.forEach((log, index) => {
        const logName = log.name || `Combat Archivé ${log.id || index}`;
        const checkboxId = `merge-log-checkbox-${index}`;
        const itemHtml = `
            <label for="${checkboxId}" title="${logName} (Archivé le: ${new Date(log.timestamp).toLocaleString()})">
                <input type="checkbox" id="${checkboxId}" name="merge-log-selection" value="${index}">
                ${logName}
            </label>`;
        mergeLogsListDivElement.insertAdjacentHTML('beforeend', itemHtml);
    });
}

function handleMergeLogSelectionChange() {
    updateMergeLogsSelectionCount();
}

function updateMergeLogsSelectionCount() {
    if (!mergeLogsModalElement || !mergeLogsSelectedCountElement || !mergeLogsSubmitButtonElement) return;
    const selectedCheckboxes = mergeLogsModalElement.querySelectorAll('input[name="merge-log-selection"]:checked');
    const count = selectedCheckboxes.length;
    mergeLogsSelectedCountElement.textContent = `Logs sélectionnés : ${count} / 2`;
    mergeLogsSubmitButtonElement.disabled = (count !== 2);
}

function aggregateCombatData(data1, data2) {
    const merged = initializeEmptyCombatData();
    ensureCompleteDataStructure(merged);
    const sources = [data1, data2].filter(Boolean);

    sources.forEach(source => ensureCompleteDataStructure(source));

    invalidateDataStructure(merged);

    const simpleModes = ['damage', 'healing', 'taken', 'mitigated', 'protection', 'crits', 'missed', 'intercepted'];
    const detailedModesMap = {
        damage: 'detailedDamage', healing: 'detailedHealing', taken: 'detailedTaken',
        mitigated: 'detailedMitigated', protection: 'detailedProtection', crits: 'detailedCrits', missed: 'detailedMissed', intercepted: 'detailedIntercepted'
    };
    const valueKeys = {
        damage: 'damage', healing: 'healing', taken: 'damage', mitigated: 'mitigation',
        protection: 'protection', crits: 'crits',
        missed: 'hits'
    };

    for (const source of sources) {
        for (const mode of simpleModes) {
            if (source[mode]) {
                for (const [name, value] of Object.entries(source[mode])) {
                    merged[mode][name] = (merged[mode][name] || 0) + value;
                }
            }
        }

        for (const mode of simpleModes) {
            const detailedMode = detailedModesMap[mode];
            if (!source[detailedMode]) continue;

            for (const [primaryName, primaryDetails] of Object.entries(source[detailedMode])) {
                if (!merged[detailedMode][primaryName]) {
                    if (mode === 'crits') merged[detailedMode][primaryName] = { maxCritValue: 0, targets: {} };
                    else if (mode === 'intercepted') merged[detailedMode][primaryName] = {};
                    else merged[detailedMode][primaryName] = {};
                }

                if (mode === 'intercepted') {
                    for (const [interceptorName, instancesArray] of Object.entries(primaryDetails)) {
                        if (!merged[detailedMode][primaryName][interceptorName]) {
                            merged[detailedMode][primaryName][interceptorName] = [];
                        }
                        merged[detailedMode][primaryName][interceptorName].push(...structuredClone(instancesArray));
                    }
                } else if (mode === 'crits') {
                    merged[detailedMode][primaryName].maxCritValue = Math.max(
                        merged[detailedMode][primaryName].maxCritValue || 0,
                        primaryDetails.maxCritValue || 0
                    );
                    if (primaryDetails.targets) {
                        if (!merged[detailedMode][primaryName].targets) merged[detailedMode][primaryName].targets = {};
                        for (const [secondaryName, targetData] of Object.entries(primaryDetails.targets)) {
                            if (!merged[detailedMode][primaryName].targets[secondaryName]) {
                                merged[detailedMode][primaryName].targets[secondaryName] = { crits: 0, actions: 0, weapons: {} };
                            }
                            const mergedTargetData = merged[detailedMode][primaryName].targets[secondaryName];

                            mergedTargetData.crits = (mergedTargetData.crits || 0) + (targetData.crits || 0);
                            mergedTargetData.actions = (mergedTargetData.actions || 0) + (targetData.actions || 0);
                            if (targetData.weapons) {
                                for (const [weaponName, weaponData] of Object.entries(targetData.weapons)) {
                                    if (!mergedTargetData.weapons[weaponName]) {
                                        mergedTargetData.weapons[weaponName] = { values: [] };
                                    }
                                    if (weaponData.values && weaponData.values.length > 0) {
                                        mergedTargetData.weapons[weaponName].values.push(...weaponData.values);
                                    }
                                }
                            }
                        }
                    }
                } else if (typeof primaryDetails === 'object') {
                    const valueKey = valueKeys[mode];
                    for (const [secondaryName, secondaryDetails] of Object.entries(primaryDetails)) {
                        if (!merged[detailedMode][primaryName][secondaryName]) {
                            merged[detailedMode][primaryName][secondaryName] = { [valueKey]: 0, hits: 0 };
                            if (mode === 'damage' || mode === 'taken') {
                                merged[detailedMode][primaryName][secondaryName].weapons = {};
                            }
                            if (mode === 'mitigated') {
                                merged[detailedMode][primaryName][secondaryName].weapons = {};
                            }
                            if (mode === 'protection') {
                                merged[detailedMode][primaryName][secondaryName].from = {};
                            }
                        }
                        merged[detailedMode][primaryName][secondaryName][valueKey] =
                            (merged[detailedMode][primaryName][secondaryName][valueKey] || 0) + (secondaryDetails[valueKey] || 0);

                        if (secondaryDetails.hits !== undefined && mode !== 'missed') {
                             merged[detailedMode][primaryName][secondaryName].hits =
                                (merged[detailedMode][primaryName][secondaryName].hits || 0) + (secondaryDetails.hits || 0);
                        }


                        if ((mode === 'damage' || mode === 'taken') && secondaryDetails.weapons) {
                            if (!merged[detailedMode][primaryName][secondaryName].weapons) {
                                merged[detailedMode][primaryName][secondaryName].weapons = {};
                            }
                            for (const [weaponName, weaponStats] of Object.entries(secondaryDetails.weapons)) {
                                if (!merged[detailedMode][primaryName][secondaryName].weapons[weaponName]) {
                                    merged[detailedMode][primaryName][secondaryName].weapons[weaponName] = { damage: 0, hits: 0, crits: 0 };
                                }
                                merged[detailedMode][primaryName][secondaryName].weapons[weaponName].damage += (weaponStats.damage || 0);
                                merged[detailedMode][primaryName][secondaryName].weapons[weaponName].hits += (weaponStats.hits || 0);
                                merged[detailedMode][primaryName][secondaryName].weapons[weaponName].crits += (weaponStats.crits || 0);
                            }
                        }
                        
                        if (mode === 'mitigated' && secondaryDetails.weapons) {
                            if (!merged[detailedMode][primaryName][secondaryName].weapons) {
                                merged[detailedMode][primaryName][secondaryName].weapons = {};
                            }
                            for (const [weaponName, weaponStats] of Object.entries(secondaryDetails.weapons)) {
                                if (!merged[detailedMode][primaryName][secondaryName].weapons[weaponName]) {
                                    merged[detailedMode][primaryName][secondaryName].weapons[weaponName] = { mitigation: 0, hits: 0 };
                                }
                                merged[detailedMode][primaryName][secondaryName].weapons[weaponName].mitigation += (weaponStats.mitigation || 0);
                                merged[detailedMode][primaryName][secondaryName].weapons[weaponName].hits += (weaponStats.hits || 0);
                            }
                        }
                        
                        if (mode === 'protection' && secondaryDetails.from) {
                            if (!merged[detailedMode][primaryName][secondaryName].from) {
                                merged[detailedMode][primaryName][secondaryName].from = {};
                            }
                            for (const [attackerName, attackerData] of Object.entries(secondaryDetails.from)) {
                                if (!merged[detailedMode][primaryName][secondaryName].from[attackerName]) {
                                    merged[detailedMode][primaryName][secondaryName].from[attackerName] = { protection: 0, hits: 0, weapons: {} };
                                }
                                merged[detailedMode][primaryName][secondaryName].from[attackerName].protection += (attackerData.protection || 0);
                                merged[detailedMode][primaryName][secondaryName].from[attackerName].hits += (attackerData.hits || 0);
                                
                                if (attackerData.weapons) {
                                    for (const [weaponName, weaponStats] of Object.entries(attackerData.weapons)) {
                                        if (!merged[detailedMode][primaryName][secondaryName].from[attackerName].weapons[weaponName]) {
                                            merged[detailedMode][primaryName][secondaryName].from[attackerName].weapons[weaponName] = { protection: 0, hits: 0 };
                                        }
                                        merged[detailedMode][primaryName][secondaryName].from[attackerName].weapons[weaponName].protection += (weaponStats.protection || 0);
                                        merged[detailedMode][primaryName][secondaryName].from[attackerName].weapons[weaponName].hits += (weaponStats.hits || 0);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (source.projectedGains) {
            for (const [playerName, gains] of Object.entries(source.projectedGains)) {
                if (!merged.projectedGains[playerName]) {
                    merged.projectedGains[playerName] = { resistance: 0, force: 0, agilite: 0, perception: 0, medecine: 0 };
                }
                merged.projectedGains[playerName].resistance += (gains.resistance || 0);
                merged.projectedGains[playerName].force += (gains.force || 0);
                merged.projectedGains[playerName].agilite += (gains.agilite || 0);
                merged.projectedGains[playerName].perception += (gains.perception || 0);
                merged.projectedGains[playerName].medecine += (gains.medecine || 0);
            }
        }
        if (source.initiativeStats) {
            for (const [playerName, stats] of Object.entries(source.initiativeStats)) {
                if (!merged.initiativeStats[playerName]) {
                    merged.initiativeStats[playerName] = { totalTurnsPlayed: 0, turnOrderCounts: {} };
                }
                merged.initiativeStats[playerName].totalTurnsPlayed += (stats.totalTurnsPlayed || 0);
                for (const [order, count] of Object.entries(stats.turnOrderCounts || {})) {
                    merged.initiativeStats[playerName].turnOrderCounts[order] = (merged.initiativeStats[playerName].turnOrderCounts[order] || 0) + count;
                }
            }
        }
    }
    return merged;
}


function handleMergeLogsSubmit() {
    if (!mergeLogsModalElement) return;
    const selectedCheckboxes = mergeLogsModalElement.querySelectorAll('input[name="merge-log-selection"]:checked');
    if (selectedCheckboxes.length !== 2) {
        alert("Veuillez sélectionner deux logs à fusionner.");
        return;
    }

    const index1 = parseInt(selectedCheckboxes[0].value, 10);
    const index2 = parseInt(selectedCheckboxes[1].value, 10);

    const log1 = savedCombatLogs[index1];
    const log2 = savedCombatLogs[index2];

    if (!log1 || !log2) {
        alert("Erreur : Un ou plusieurs logs sélectionnés sont invalides.");
        return;
    }

    const mergedData = aggregateCombatData(log1.data, log2.data);

    const log1Name = log1.name || `Combat Archivé ${log1.id || index1}`;
    const log2Name = log2.name || `Combat Archivé ${log2.id || index2}`;
    const newLogName = `Fusion: ${log1Name} + ${log2Name}`.substring(0, 100);
    const newLogId = `merged_${log1.id}_${log2.id}_${Date.now()}`;

    const newLogEntry = {
        id: newLogId,
        name: newLogName,
        timestamp: Date.now(),
        data: mergedData
    };

    savedCombatLogs.push(newLogEntry);
    savedCombatLogs.sort((a, b) => b.timestamp - a.timestamp);
    const newLogArrayIndex = savedCombatLogs.findIndex(log => log.id === newLogId);


    hideMergeLogsModal();
    alert(`Fusion réussie !\nNouveau log créé : "${newLogName}"`);

    if (confirm(`Voulez-vous supprimer les deux logs originaux ?\n • "${log1Name}"\n • "${log2Name}"\n\nCette action est irréversible.`)) {
        const idsToDelete = [log1.id, log2.id];
        let newCurrentlyViewingLogId = currentlyViewingLogId;

        savedCombatLogs = savedCombatLogs.filter(log => !idsToDelete.includes(log.id));

        if (idsToDelete.includes(log1.id) || idsToDelete.includes(log2.id)) {
            if (currentlyViewingLogId === index1.toString() || currentlyViewingLogId === index2.toString()){
                 newCurrentlyViewingLogId = newLogArrayIndex !== -1 ? newLogArrayIndex.toString() : 'current';
            }
        }
        const currentViewedLogIsDeleted = (currentlyViewingLogId === index1.toString() || currentlyViewingLogId === index2.toString());
        if (currentViewedLogIsDeleted) {
             currentlyViewingLogId = newLogArrayIndex !== -1 ? newLogArrayIndex.toString() : 'current';
        } else {
            if(!isNaN(parseInt(currentlyViewingLogId,10))) {
                const oldLogId = savedCombatLogs[parseInt(currentlyViewingLogId,10)]?.id;
                if(oldLogId){
                    const newIdx = savedCombatLogs.findIndex(l => l.id === oldLogId);
                    if(newIdx !== -1) currentlyViewingLogId = newIdx.toString();
                    else currentlyViewingLogId = 'current';
                } else {
                    currentlyViewingLogId = 'current';
                }
            }
        }
    }

    saveApplicationState();
    updateUserInterface();
    hideTooltip();
}

const REGEX_HEALING = /\[([^\]]+)\]\s+a soigné\s+\[([^\]]+)\]\s+de\s+\[(\d+)\s*pts\]/i;
const REGEX_SELF_HEALING = /\[([^\]]+)\]\s+s'est soigné de\s+\[(\d+)\s*pts\]/i;
const REGEX_DAMAGE_WEAPON = /\[([^\]]+)\]\s+a attaqué\s+\[([^\]]+)\](?:\s+avec\s+\[([^\]]+)\](?:\s+et\s+\[([^\]]+)\])?)?(?:.*?)\s*\[((?:\d+\s*\+\s*)*\d+\s*=\s*\d+|\d+)\s*pts\]/i;
const REGEX_INTERCEPTION = /\[([^\]]+)\]\s+a attaqué\s+\[([^\]]+)\]\s+avec\s+\[([^\]]+)\](?:\s+et\s+\[([^\]]+)\])?\s+mais le tir a été intercepté par\s+\[([^\]]+)\]\s+lui infligeant\s+\[((?:\d+\s*\+\s*)*\d+\s*=\s*\d+|\d+)\s*pts\](?: de dégâts)?(?:.*?)(?:mais son adversaire a pu en encaisser\s+\[(\d+)\s*pts\])?/i;
const REGEX_PROTECTION = /mais son allié\s+\[([^\]]+)\]\s+a intercepté l'attaque à sa place,\s*encaissant\s+\[(\d+)\s*pts\]\s+lui infligeant\s+\[(\d+)\s*pts\]/i;
const REGEX_MITIGATION = /mais son adversaire a pu en encaisser\s+\[(\d+)\s*pts\]/i;
const REGEX_MISSED_HIT = /\[([^\]]+)\]\s+a tenté d'attaquer\s+\[([^\]]+)\]\s+sans succès/i;
const CRIT_FLAG = '[COUP CRITIQUE]';
const REGEX_CRIT_COUNT = /\[(\d+)\s+COUPS? CRITIQUES?\]/i;
const REGEX_HISTORIQUE_ACTOR_NAME = /nom_personnage="([^"]+)"/;

function initializeEntityGains(entityName) {
    if (!activeCombatData.projectedGains[entityName]) {
        activeCombatData.projectedGains[entityName] = { resistance: 0, force: 0, agilite: 0, perception: 0, medecine: 0 };
    } else {
        if (typeof activeCombatData.projectedGains[entityName].medecine !== 'number') {
            activeCombatData.projectedGains[entityName].medecine = 0;
        }
    }
}

function addResistanceGain(entityName, damageAmount) {
    if (!entityName || damageAmount <= 0) return;
    initializeEntityGains(entityName);
    activeCombatData.projectedGains[entityName].resistance += damageAmount * GAIN_RESISTANCE_PER_DAMAGE;
}

function addPrimaryStatGains(entityName, weaponNameUsed) {
    if (!entityName) return;
    initializeEntityGains(entityName);

    if (weaponNameUsed === SPECIFIC_RANGED_WEAPON) {
        activeCombatData.projectedGains[entityName].agilite += GAIN_PRIMARY_STAT_PER_HIT;
        activeCombatData.projectedGains[entityName].perception += GAIN_PRIMARY_STAT_PER_HIT;
    } else {
        activeCombatData.projectedGains[entityName].force += GAIN_PRIMARY_STAT_PER_HIT;
        activeCombatData.projectedGains[entityName].agilite += GAIN_PRIMARY_STAT_PER_HIT;
    }
}

function addMedecineGain(healerName, healAmount) {
    if (!healerName || healAmount <= 0) return;
    initializeEntityGains(healerName);
    activeCombatData.projectedGains[healerName].medecine += healAmount * GAIN_MEDECINE_PER_HP_HEALED;
}


function parseCombatLogLine(logHtml) {
    if (!currentCombatId && !lastKnownCombatIdForPendingEnd) return;
    if (lastKnownCombatIdForPendingEnd && currentCombatId !== lastKnownCombatIdForPendingEnd) {
        if (!currentCombatId) return;
    }

    let needsUiRefresh = false;
    const tempDiv = document.createElement('div'); tempDiv.innerHTML = logHtml;
    const logText = (tempDiv.textContent || tempDiv.innerText || "").trim();
    if (!activeCombatData) activeCombatData = initializeEmptyCombatData();
    ensureCompleteDataStructure(activeCombatData);

    invalidateDataStructure(activeCombatData);

    let healingMatch = logText.match(REGEX_HEALING);
    let selfHealingMatch = null;
    let healerName = null; let healedTargetName = null; let healAmountValue = NaN;
    if (healingMatch) { healerName = healingMatch[1].trim(); healedTargetName = healingMatch[2].trim(); healAmountValue = parseInt(healingMatch[3], 10); }
    else { selfHealingMatch = logText.match(REGEX_SELF_HEALING); if (selfHealingMatch) { healerName = selfHealingMatch[1].trim(); healedTargetName = healerName; healAmountValue = parseInt(selfHealingMatch[2], 10); } }

    if (healerName && healedTargetName && !isNaN(healAmountValue) && healAmountValue > 0) {
        activeCombatData.healing[healerName] = (activeCombatData.healing[healerName] || 0) + healAmountValue;
        addMedecineGain(healerName, healAmountValue);
        if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && (currentDisplayMode === 'healing' || currentDisplayMode === 'projectedGains')) {
             needsUiRefresh = true;
        }
        if (!activeCombatData.detailedHealing[healerName]) activeCombatData.detailedHealing[healerName] = {};
        if (!activeCombatData.detailedHealing[healerName][healedTargetName]) activeCombatData.detailedHealing[healerName][healedTargetName] = { healing: 0, hits: 0 };
        activeCombatData.detailedHealing[healerName][healedTargetName].healing += healAmountValue;
        activeCombatData.detailedHealing[healerName][healedTargetName].hits += 1;
    }

    const protectionMatch = logText.match(REGEX_PROTECTION);
    if (protectionMatch) {
        const protectorName = protectionMatch[1].trim();
        const mitigatedPoints = parseInt(protectionMatch[2], 10);
        const totalDamage = parseInt(protectionMatch[3], 10);
        
        if (protectorName && !isNaN(mitigatedPoints) && !isNaN(totalDamage) && mitigatedPoints > 0) {
            const fullAttackMatch = logText.match(/\[([^\]]+)\]\s+a attaqué\s+\[([^\]]+)\](?:\s+avec\s+\[([^\]]+)\](?:\s+et\s+\[([^\]]+)\])?)?/i);
            
            if (fullAttackMatch) {
                const attackerName = fullAttackMatch[1].trim();
                const protectedTarget = fullAttackMatch[2].trim();
                const firstWeapon = fullAttackMatch[3] ? fullAttackMatch[3].trim() : null;
                const secondWeapon = fullAttackMatch[4] ? fullAttackMatch[4].trim() : null;
                
                let weaponNameUsed = "Inconnue";
                if (firstWeapon && secondWeapon) {
                    weaponNameUsed = `${firstWeapon} et ${secondWeapon}`;
                } else if (firstWeapon) {
                    weaponNameUsed = firstWeapon;
                } else if (logText.includes("à mains nues")) {
                    weaponNameUsed = "Mains nues";
                }
                
                activeCombatData.protection[protectorName] = (activeCombatData.protection[protectorName] || 0) + mitigatedPoints;
                if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'protection') {
                    needsUiRefresh = true;
                }
                
                if (!activeCombatData.detailedProtection[protectorName]) activeCombatData.detailedProtection[protectorName] = {};
                if (!activeCombatData.detailedProtection[protectorName][protectedTarget]) {
                    activeCombatData.detailedProtection[protectorName][protectedTarget] = { protection: 0, hits: 0, from: {} };
                }
                activeCombatData.detailedProtection[protectorName][protectedTarget].protection += mitigatedPoints;
                activeCombatData.detailedProtection[protectorName][protectedTarget].hits += 1;
                
                if (!activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName]) {
                    activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName] = { protection: 0, hits: 0, weapons: {} };
                }
                activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName].protection += mitigatedPoints;
                activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName].hits += 1;
                
                if (!activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName].weapons[weaponNameUsed]) {
                    activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName].weapons[weaponNameUsed] = { protection: 0, hits: 0 };
                }
                activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName].weapons[weaponNameUsed].protection += mitigatedPoints;
                activeCombatData.detailedProtection[protectorName][protectedTarget].from[attackerName].weapons[weaponNameUsed].hits += 1;
                
                activeCombatData.mitigated[protectorName] = (activeCombatData.mitigated[protectorName] || 0) + mitigatedPoints;
                if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'mitigated') {
                    needsUiRefresh = true;
                }
                
                if (!activeCombatData.detailedMitigated[protectorName]) activeCombatData.detailedMitigated[protectorName] = {};
                if (!activeCombatData.detailedMitigated[protectorName][attackerName]) {
                    activeCombatData.detailedMitigated[protectorName][attackerName] = { mitigation: 0, hits: 0, weapons: {} };
                }
                activeCombatData.detailedMitigated[protectorName][attackerName].mitigation += mitigatedPoints;
                activeCombatData.detailedMitigated[protectorName][attackerName].hits += 1;
                
                if (!activeCombatData.detailedMitigated[protectorName][attackerName].weapons) {
                    activeCombatData.detailedMitigated[protectorName][attackerName].weapons = {};
                }
                if (!activeCombatData.detailedMitigated[protectorName][attackerName].weapons[weaponNameUsed]) {
                    activeCombatData.detailedMitigated[protectorName][attackerName].weapons[weaponNameUsed] = { mitigation: 0, hits: 0 };
                }
                activeCombatData.detailedMitigated[protectorName][attackerName].weapons[weaponNameUsed].mitigation += mitigatedPoints;
                activeCombatData.detailedMitigated[protectorName][attackerName].weapons[weaponNameUsed].hits += 1;
                
                const damageTaken = totalDamage - mitigatedPoints;
                if (damageTaken > 0) {
                    activeCombatData.taken[protectorName] = (activeCombatData.taken[protectorName] || 0) + damageTaken;
                    if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'taken') {
                        needsUiRefresh = true;
                    }
                    
                    if (!activeCombatData.detailedTaken[protectorName]) activeCombatData.detailedTaken[protectorName] = {};
                    if (!activeCombatData.detailedTaken[protectorName][attackerName]) {
                        activeCombatData.detailedTaken[protectorName][attackerName] = { damage: 0, hits: 0, weapons: {} };
                    }
                    activeCombatData.detailedTaken[protectorName][attackerName].damage += damageTaken;
                    activeCombatData.detailedTaken[protectorName][attackerName].hits += 1;
                    
                    if (!activeCombatData.detailedTaken[protectorName][attackerName].weapons[weaponNameUsed]) {
                        activeCombatData.detailedTaken[protectorName][attackerName].weapons[weaponNameUsed] = { damage: 0, hits: 0, crits: 0 };
                    }
                    activeCombatData.detailedTaken[protectorName][attackerName].weapons[weaponNameUsed].damage += damageTaken;
                    activeCombatData.detailedTaken[protectorName][attackerName].weapons[weaponNameUsed].hits += 1;
                }
                
                addResistanceGain(protectorName, totalDamage);
                if (currentDisplayMode === 'projectedGains' && !needsUiRefresh) needsUiRefresh = true;
            }
        }
    }

    let currentAttackerName = null;
    let entityTakingDamage = null;
    let weaponNameUsed = "Inconnue";
    let initialDamageAmountForEvent = 0;
    let individualHitValues = [];
    let successfulHitByAttacker = false;

    let entityForResistanceGain = null;
    let initialDamageValForResistance = 0;

    const interceptionMatch = logText.match(REGEX_INTERCEPTION);
    const damageMatch = logText.match(REGEX_DAMAGE_WEAPON);

    if (interceptionMatch) {
        currentAttackerName = interceptionMatch[1].trim();
        const originalTargetName = interceptionMatch[2].trim();
        const firstWeapon = interceptionMatch[3].trim();
        const secondWeapon = interceptionMatch[4] ? interceptionMatch[4].trim() : null;
        weaponNameUsed = secondWeapon ? `${firstWeapon} et ${secondWeapon}` : firstWeapon;
        const interceptorName = interceptionMatch[5].trim();
        const damageString = interceptionMatch[6];
        const mitigationStringOnInterceptor = interceptionMatch[7];

        if (damageString.includes('=')) {
            const parts = damageString.split('=');
            initialDamageAmountForEvent = parseInt(parts[1].trim(), 10);
            parts[0].split('+').forEach(val => individualHitValues.push(parseInt(val.trim(), 10)));
        } else {
            initialDamageAmountForEvent = parseInt(damageString, 10);
        }

        entityTakingDamage = interceptorName;
        entityForResistanceGain = interceptorName;
        initialDamageValForResistance = initialDamageAmountForEvent;
        successfulHitByAttacker = true;

        activeCombatData.intercepted[currentAttackerName] = (activeCombatData.intercepted[currentAttackerName] || 0) + 1;
        if (!activeCombatData.detailedIntercepted[currentAttackerName]) activeCombatData.detailedIntercepted[currentAttackerName] = {};
        if (!activeCombatData.detailedIntercepted[currentAttackerName][interceptorName]) activeCombatData.detailedIntercepted[currentAttackerName][interceptorName] = [];

        let mitigatedByInterceptor = 0;
        if (mitigationStringOnInterceptor) {
            const parsedMit = parseInt(mitigationStringOnInterceptor.trim(), 10);
            if (!isNaN(parsedMit) && parsedMit > 0) mitigatedByInterceptor = parsedMit;
        }
        const effectiveDamageOnInterceptor = Math.max(0, initialDamageAmountForEvent - mitigatedByInterceptor);
        const isCritInterception = logText.includes(CRIT_FLAG);

        activeCombatData.detailedIntercepted[currentAttackerName][interceptorName].push({
            damageDealt: effectiveDamageOnInterceptor, originalTarget: originalTargetName, weapon: weaponNameUsed,
            crit: isCritInterception, mitigatedAmount: mitigatedByInterceptor
        });
        if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'intercepted') needsUiRefresh = true;

    } else if (damageMatch) {
        currentAttackerName = damageMatch[1].trim();
        entityTakingDamage = damageMatch[2].trim();
        const firstWeapon = damageMatch[3] ? damageMatch[3].trim() : null;
        const secondWeapon = damageMatch[4] ? damageMatch[4].trim() : null;
        const damageString = damageMatch[5];

        if (firstWeapon && secondWeapon) {
            weaponNameUsed = `${firstWeapon} et ${secondWeapon}`;
        } else if (firstWeapon) {
            weaponNameUsed = firstWeapon;
        } else {
            weaponNameUsed = "Inconnue";
        }

        if (weaponNameUsed === "Inconnue" && logText.includes("à mains nues")) {
            weaponNameUsed = "Mains nues";
        }

        if (damageString.includes('=')) {
            const parts = damageString.split('=');
            initialDamageAmountForEvent = parseInt(parts[1].trim(), 10);
            parts[0].split('+').forEach(val => individualHitValues.push(parseInt(val.trim(), 10)));
        } else {
            initialDamageAmountForEvent = parseInt(damageString, 10);
        }

        entityForResistanceGain = entityTakingDamage;
        initialDamageValForResistance = initialDamageAmountForEvent;
        successfulHitByAttacker = true;
    }

    if (entityTakingDamage && !isNaN(initialDamageAmountForEvent) && initialDamageAmountForEvent >= 0 && currentAttackerName) {
        let mitigatedAmount = 0;
        const generalMitigationTextMatch = logText.match(REGEX_MITIGATION);
        if (generalMitigationTextMatch) {
            const parsedMitigation = parseInt(generalMitigationTextMatch[1], 10);
            if (!isNaN(parsedMitigation) && parsedMitigation > 0) mitigatedAmount = parsedMitigation;
        }

        const effectiveDamageAmount = Math.max(0, initialDamageAmountForEvent - mitigatedAmount);
        const isCritLine = logText.includes(CRIT_FLAG);
        let numberOfCriticalHitsInLine = 0;
        if (isCritLine) {
            const critCountMatch = logText.match(REGEX_CRIT_COUNT);
            numberOfCriticalHitsInLine = (critCountMatch && critCountMatch[1]) ? (parseInt(critCountMatch[1], 10) || 1) : 1;
        }
        let critValueForMax = initialDamageAmountForEvent;
        if (individualHitValues.length > 0) {
            critValueForMax = Math.max(...individualHitValues, 0);
        } else if (initialDamageAmountForEvent > 0) {
            individualHitValues.push(initialDamageAmountForEvent);
        }


        if (mitigatedAmount > 0) {
            activeCombatData.mitigated[entityTakingDamage] = (activeCombatData.mitigated[entityTakingDamage] || 0) + mitigatedAmount;
            if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'mitigated') needsUiRefresh = true;
            if (!activeCombatData.detailedMitigated[entityTakingDamage]) activeCombatData.detailedMitigated[entityTakingDamage] = {};
            if (!activeCombatData.detailedMitigated[entityTakingDamage][currentAttackerName]) activeCombatData.detailedMitigated[entityTakingDamage][currentAttackerName] = { mitigation: 0, hits: 0 };
            activeCombatData.detailedMitigated[entityTakingDamage][currentAttackerName].mitigation += mitigatedAmount;
            activeCombatData.detailedMitigated[entityTakingDamage][currentAttackerName].hits += 1;
        }

        if (isCritLine) {
            activeCombatData.crits[currentAttackerName] = (activeCombatData.crits[currentAttackerName] || 0) + numberOfCriticalHitsInLine;
            if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'crits') needsUiRefresh = true;

            if (!activeCombatData.detailedCrits[currentAttackerName]) {
                activeCombatData.detailedCrits[currentAttackerName] = { maxCritValue: 0, targets: {} };
            }
            if (!activeCombatData.detailedCrits[currentAttackerName].targets[entityTakingDamage]) {
                activeCombatData.detailedCrits[currentAttackerName].targets[entityTakingDamage] = { crits: 0, actions: 0, weapons: {} };
            }
            const targetCritData = activeCombatData.detailedCrits[currentAttackerName].targets[entityTakingDamage];

            targetCritData.crits += numberOfCriticalHitsInLine;
            targetCritData.actions += 1;
            activeCombatData.detailedCrits[currentAttackerName].maxCritValue = Math.max(activeCombatData.detailedCrits[currentAttackerName].maxCritValue || 0, critValueForMax);
            if (weaponNameUsed && individualHitValues.length > 0) {
                if (!targetCritData.weapons[weaponNameUsed]) {
                    targetCritData.weapons[weaponNameUsed] = { values: [] };
                }
                targetCritData.weapons[weaponNameUsed].values.push(...individualHitValues);
            }
        }

        if (effectiveDamageAmount > 0 || initialDamageAmountForEvent === 0) {
            activeCombatData.damage[currentAttackerName] = (activeCombatData.damage[currentAttackerName] || 0) + effectiveDamageAmount;
            if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'damage') needsUiRefresh = true;
            if (!activeCombatData.detailedDamage[currentAttackerName]) activeCombatData.detailedDamage[currentAttackerName] = {};
            if (!activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage]) activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage] = { damage: 0, hits: 0, weapons: {} };
            activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage].damage += effectiveDamageAmount;
            activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage].hits += 1;
            if (!activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage].weapons[weaponNameUsed]) {
                activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage].weapons[weaponNameUsed] = { damage: 0, hits: 0, crits: 0 };
            }
            activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage].weapons[weaponNameUsed].damage += effectiveDamageAmount;
            activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage].weapons[weaponNameUsed].hits += 1;
            if (isCritLine) {
                 activeCombatData.detailedDamage[currentAttackerName][entityTakingDamage].weapons[weaponNameUsed].crits += numberOfCriticalHitsInLine;
            }

            activeCombatData.taken[entityTakingDamage] = (activeCombatData.taken[entityTakingDamage] || 0) + effectiveDamageAmount;
            if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'taken') needsUiRefresh = true;
            if (!activeCombatData.detailedTaken[entityTakingDamage]) activeCombatData.detailedTaken[entityTakingDamage] = {};
            if (!activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName]) activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName] = { damage: 0, hits: 0, weapons: {} };
            activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName].damage += effectiveDamageAmount;
            activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName].hits += 1;
            if (!activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName].weapons[weaponNameUsed]) {
                 activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName].weapons[weaponNameUsed] = { damage: 0, hits: 0, crits: 0 };
            }
            activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName].weapons[weaponNameUsed].damage += effectiveDamageAmount;
            activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName].weapons[weaponNameUsed].hits += 1;
            if (isCritLine) {
                 activeCombatData.detailedTaken[entityTakingDamage][currentAttackerName].weapons[weaponNameUsed].crits += numberOfCriticalHitsInLine;
            }
        }
    }

    if (currentAttackerName && successfulHitByAttacker) {
        addPrimaryStatGains(currentAttackerName, weaponNameUsed);
        if (currentDisplayMode === 'projectedGains' && !needsUiRefresh) needsUiRefresh = true;
    }
    if (entityForResistanceGain && initialDamageValForResistance > 0) {
        addResistanceGain(entityForResistanceGain, initialDamageValForResistance);
        if (currentDisplayMode === 'projectedGains' && !needsUiRefresh) needsUiRefresh = true;
    }

    const missedHitMatch = logText.match(REGEX_MISSED_HIT);
    if (missedHitMatch && !interceptionMatch && !damageMatch) {
        const attackerNameFromMiss = missedHitMatch[1].trim();
        const targetNameFromMiss = missedHitMatch[2].trim();
        if (attackerNameFromMiss && targetNameFromMiss) {
            activeCombatData.missed[attackerNameFromMiss] = (activeCombatData.missed[attackerNameFromMiss] || 0) + 1;
            if (!activeCombatData.detailedMissed[attackerNameFromMiss]) activeCombatData.detailedMissed[attackerNameFromMiss] = {};
            if (!activeCombatData.detailedMissed[attackerNameFromMiss][targetNameFromMiss]) activeCombatData.detailedMissed[attackerNameFromMiss][targetNameFromMiss] = { hits: 0 };
            activeCombatData.detailedMissed[attackerNameFromMiss][targetNameFromMiss].hits += 1;
            if ((currentlyViewingLogId === 'current' || currentlyViewingLogId === 'global') && currentDisplayMode === 'missed') {
                needsUiRefresh = true;
            }
        }
    }

    if (needsUiRefresh && isUserInterfaceVisible && !isUserInterfaceMinimized) {
        updateUserInterface();
    }
}

function parseCheckApiResponse(responseText) {
    const combatIdForProcessing = currentCombatId || lastKnownCombatIdForPendingEnd;
    if (!combatIdForProcessing) return;

    let hadUpdates = false;
    const currentTurnActorsOrder = [];
    const actorsInThisCheck = new Set();

    const combatLogRegex = /<combat_historique[^>]*>([\s\S]*?)<\/combat_historique>/g;
    let match;
    while ((match = combatLogRegex.exec(responseText)) !== null) {
        const fullHistoriqueTag = match[0];
        const innerContent = match[1];

        const actorNameMatch = fullHistoriqueTag.match(REGEX_HISTORIQUE_ACTOR_NAME);
        if (actorNameMatch && actorNameMatch[1]) {
            const actorNameFromAttribute = actorNameMatch[1].trim();
            if (!actorsInThisCheck.has(actorNameFromAttribute)) {
                actorsInThisCheck.add(actorNameFromAttribute);
                currentTurnActorsOrder.push(actorNameFromAttribute);
            }
        }
        if (innerContent) {
            parseCombatLogLine(innerContent);
            hadUpdates = true;
        }
    }

    if (currentTurnActorsOrder.length > 0) {
        if (!activeCombatData.initiativeStats) activeCombatData.initiativeStats = {};
        currentTurnActorsOrder.forEach((actorName, index) => {
            const slot = index + 1;
            if (!activeCombatData.initiativeStats[actorName]) {
                activeCombatData.initiativeStats[actorName] = { totalTurnsPlayed: 0, turnOrderCounts: {} };
            }
            activeCombatData.initiativeStats[actorName].totalTurnsPlayed = (activeCombatData.initiativeStats[actorName].totalTurnsPlayed || 0) + 1;
            activeCombatData.initiativeStats[actorName].turnOrderCounts[slot] = (activeCombatData.initiativeStats[actorName].turnOrderCounts[slot] || 0) + 1;
        });
        hadUpdates = true;
        if (currentDisplayMode === 'initiativeStats' && isUserInterfaceVisible && !isUserInterfaceMinimized) {
            if(uiContainerElement) updateUserInterface();
        }
    }

    if (hadUpdates) saveApplicationState();
}

function setupXhrRequestInterceptor() {
    const XHR = typeof unsafeWindow !== 'undefined' ? unsafeWindow.XMLHttpRequest : XMLHttpRequest;
    const originalXhrOpen = XHR.prototype.open;
    const originalXhrSend = XHR.prototype.send;
    XHR.prototype.open = function(method, url) {
        this._requestUrl = url;
        return originalXhrOpen.apply(this, arguments);
    };
    XHR.prototype.send = function(postData) {
        this.addEventListener('load', function() {
            if (this.readyState === 4 && this.status === 200 && this._requestUrl && this._requestUrl.includes('/Check')) {
                try {
                    parseCheckApiResponse(this.responseText);
                } catch (e) {

                 }
            }
        }, false);
        return originalXhrSend.apply(this, arguments);
    };
}

function handleLogEntryMouseOver(event) {
    if (!tooltipElement || isUserInterfaceMinimized) { hideTooltip(); return; }
    const entryElement = event.target.closest('.logger-entry, .projected-gains-entry');
    if (!entryElement || !entryElement.dataset.primaryName || !entryElement.dataset.mode) { hideTooltip(); return; }

    const primaryName = entryElement.dataset.primaryName;
    const mode = entryElement.dataset.mode;

    if (mode === 'projectedGains') {
        const { sourceDataBundle } = getDisplayDataAndInfo();
        if (sourceDataBundle && sourceDataBundle.projectedGains && sourceDataBundle.projectedGains[primaryName]) {
            const gains = sourceDataBundle.projectedGains[primaryName];
            const safePrimaryName = primaryName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            let tooltipHtml = `<div class="tooltip-header">Gains projetés pour <strong>${safePrimaryName}</strong>:</div>`;
            let hasGains = false;
            if(gains.force > 0) { tooltipHtml += `<div class="tooltip-entry">Force: +${gains.force.toFixed(2)}</div>`; hasGains = true; }
            if(gains.agilite > 0) { tooltipHtml += `<div class="tooltip-entry">Agilité: +${gains.agilite.toFixed(2)}</div>`; hasGains = true; }
            if(gains.perception > 0) { tooltipHtml += `<div class="tooltip-entry">Perception: +${gains.perception.toFixed(2)}</div>`; hasGains = true; }
            if(gains.medecine > 0) { tooltipHtml += `<div class="tooltip-entry">Médecine: +${gains.medecine.toFixed(2)}</div>`; hasGains = true; }
            if(gains.resistance > 0) { tooltipHtml += `<div class="tooltip-entry">Résistance: +${gains.resistance.toFixed(4)}</div>`; hasGains = true; }

            if (hasGains) {
                tooltipElement.innerHTML = tooltipHtml;
                tooltipElement.style.display = 'block';
                updateTooltipPosition(event.clientX, event.clientY);
            } else {
                hideTooltip();
            }
        } else {
            hideTooltip();
        }
        return;
    } else if (mode === 'initiativeStats') {
        const { sourceDataBundle } = getDisplayDataAndInfo();
        if (sourceDataBundle && sourceDataBundle.initiativeStats && sourceDataBundle.initiativeStats[primaryName]) {
            const stats = sourceDataBundle.initiativeStats[primaryName];
            const safePrimaryName = primaryName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            let tooltipHtml = `<div class="tooltip-header">Initiative pour <strong>${safePrimaryName}</strong> (${stats.totalTurnsPlayed || 0} tours):</div>`;
            const orderSuffixes = {1: "er", default: "e"};
            const sortedOrders = Object.entries(stats.turnOrderCounts || {})
                                    .map(([order, count]) => ({order: parseInt(order), count}))
                                    .sort((a,b) => a.order - b.order);

            if (sortedOrders.length > 0) {
                 sortedOrders.forEach(item => {
                    const suffix = orderSuffixes[item.order] || orderSuffixes.default;
                    tooltipHtml += `<div class="tooltip-entry">${item.order}${suffix}: ${item.count} fois</div>`;
                });
            } else {
                tooltipHtml += `<div class="tooltip-entry">Aucune donnée d'ordre spécifique.</div>`;
            }
            tooltipElement.innerHTML = tooltipHtml;
            tooltipElement.style.display = 'block';
            updateTooltipPosition(event.clientX, event.clientY);
        } else {
            hideTooltip();
        }
        return;
    }


    const { sourceDataBundle } = getDisplayDataAndInfo();
    if (!sourceDataBundle) { hideTooltip(); return; }
    const detailedModeKey = `detailed${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    if (!sourceDataBundle[mode] || !sourceDataBundle[detailedModeKey]) { hideTooltip(); return; }
    const simpleTotalValue = sourceDataBundle[mode][primaryName];
    const detailedData = sourceDataBundle[detailedModeKey][primaryName];
    let breakdownDataForTooltip;
    if (mode === 'crits') breakdownDataForTooltip = detailedData?.targets;
    else if (mode === 'intercepted') breakdownDataForTooltip = detailedData;
    else breakdownDataForTooltip = detailedData;
    const maxCritValue = (mode === 'crits') ? detailedData?.maxCritValue : undefined;

    if (simpleTotalValue === undefined || !breakdownDataForTooltip || Object.keys(breakdownDataForTooltip).length === 0) {
        if (mode === 'intercepted' && simpleTotalValue > 0 && (!detailedData || Object.keys(detailedData).length === 0) ) {

        } else if (simpleTotalValue === undefined || !breakdownDataForTooltip || Object.keys(breakdownDataForTooltip).length === 0) {
             hideTooltip(); return;
        }
    }

    const tooltipHtmlContent = formatTooltipContent(primaryName, breakdownDataForTooltip, simpleTotalValue, mode, maxCritValue);
    if (tooltipHtmlContent) {
        tooltipElement.innerHTML = tooltipHtmlContent;
        tooltipElement.style.display = 'block';
        updateTooltipPosition(event.clientX, event.clientY);
    }
    else hideTooltip();
}

function handleLogEntryMouseOut(event) {
    const entryElement = event.target.closest('.logger-entry, .projected-gains-entry');
    if (!entryElement || (event.relatedTarget && !entryElement.contains(event.relatedTarget))) {
        hideTooltip();
    }
    else if (!event.relatedTarget) {
        hideTooltip();
    }
}

function handleLogEntryMouseMove(event) {
    if (tooltipElement && tooltipElement.style.display === 'block') {
        updateTooltipPosition(event.clientX, event.clientY);
    }
}

function hideTooltip() {
    if (tooltipElement) {
        tooltipElement.style.display = 'none';
        tooltipElement.innerHTML = '';
    }
}

function updateTooltipPosition(mouseX, mouseY) {
    if (!tooltipElement) return;
    let newX = mouseX + TOOLTIP_OFFSET_HORIZONTAL;
    let newY = mouseY + TOOLTIP_OFFSET_VERTICAL;
    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth; const viewportHeight = window.innerHeight;
    if (newX + tooltipRect.width > viewportWidth - 5) newX = mouseX - tooltipRect.width - TOOLTIP_OFFSET_HORIZONTAL;
    if (newY + tooltipRect.height > viewportHeight - 5) newY = mouseY - tooltipRect.height - TOOLTIP_OFFSET_VERTICAL;
    if (newX < 5) newX = 5;
    if (newY < 5) newY = 5;
    tooltipElement.style.left = `${newX}px`;
    tooltipElement.style.top = `${newY}px`;
}

function formatTooltipContent(primaryName, breakdownData, totalValue, mode, maxCritValue = undefined) {
    if (mode === 'projectedGains' || mode === 'initiativeStats') {
        return '';
    }
    let valueDataKey = '', headerLabelText = '', entryItemPrefix = '';
    let pointsUnitLabel = 'pts', showHitCount = true, valueIsCount = false;
    const safePrimaryName = primaryName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    switch (mode) {
        case 'damage': valueDataKey = 'damage'; headerLabelText = `Dégâts de <strong>${safePrimaryName}</strong> (${totalValue} total):`; entryItemPrefix = ' • Sur '; break;
        case 'healing': valueDataKey = 'healing'; headerLabelText = `Soins de <strong>${safePrimaryName}</strong> (${totalValue} total):`; entryItemPrefix = ' • Sur '; break;
        case 'taken': valueDataKey = 'damage'; headerLabelText = `Dégâts subis par <strong>${safePrimaryName}</strong> (${totalValue} total):`; entryItemPrefix = ' • De '; break;
        case 'mitigated': valueDataKey = 'mitigation'; headerLabelText = `Dégâts mitigés par <strong>${safePrimaryName}</strong> (${totalValue} total):`; entryItemPrefix = ' • De '; pointsUnitLabel = 'pts mitigés'; break;
        case 'protection': valueDataKey = 'protection'; headerLabelText = `Protection effectuée par <strong>${safePrimaryName}</strong> (${totalValue} total):`; entryItemPrefix = ' • Pour '; pointsUnitLabel = 'pts protégés'; break;
        case 'crits':
            valueDataKey = 'crits';
            headerLabelText = `Coups critiques par <strong>${safePrimaryName}</strong> (${totalValue} total):`;
            entryItemPrefix = ' • Sur ';
            valueIsCount = true;
            pointsUnitLabel = 'cc';
            showHitCount = false;
            break;
        case 'missed': valueDataKey = 'hits'; headerLabelText = `Coups manqués par <strong>${safePrimaryName}</strong> (${totalValue} total):`; entryItemPrefix = ' • Contre '; valueIsCount = true; pointsUnitLabel = 'manqués'; showHitCount = false; break;
        case 'intercepted': valueDataKey = 'hits'; headerLabelText = `Tirs de <strong>${safePrimaryName}</strong> interceptés (${totalValue} total):`; entryItemPrefix = ' • Par '; valueIsCount = true; pointsUnitLabel = 'fois'; showHitCount = false; break;
        default: return '';
    }
    const breakdownEntries = Object.entries(breakdownData || {})
        .map(([secondaryName, data]) => {
            if (mode === 'intercepted') return { secondaryName, value: data.length, instances: data, isInterceptArray: true };

            return { secondaryName, ...data, value: data[valueDataKey] || 0 };
        })
        .sort((a, b) => (b.value || 0) - (a.value || 0));

    if (breakdownEntries.length === 0 && !(mode === 'intercepted' && totalValue > 0 && breakdownData && Object.keys(breakdownData).length > 0)) {
        if(mode === 'intercepted' && totalValue > 0 && (!breakdownData || Object.keys(breakdownData).length === 0)) {
             return `<div class="tooltip-header">${headerLabelText}</div><div class="tooltip-entry">Aucun détail d'intercepteur disponible.</div>`;
        }
        return '';
    }
    const totalValueForPercentage = Math.max(1, totalValue);
    const barColor = MODE_BAR_COLORS[mode] || MODE_BAR_COLORS.default;
    let html = `<div class="tooltip-header">${headerLabelText}</div>`;
    if (mode === 'crits' && maxCritValue !== undefined && maxCritValue > 0) {
        html += `<div class="tooltip-subheader">Plus gros cc : <strong>${maxCritValue}</strong> pts</div>`;
    }
    breakdownEntries.forEach(entry => {
        const secondaryNameSafe = entry.secondaryName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const value = entry.value || 0;
        const hits = entry.hits;
        const percentage = (totalValueForPercentage > 0 && value > 0 && !entry.isInterceptArray) ? (value / totalValueForPercentage) * 100 : 0;
        html += `<div class="tooltip-entry">`;

        if (mode === 'crits') {
            const numCrits = entry.crits || 0;
            const numActions = entry.actions || 0;
            const actionText = numActions === 1 ? 'action' : 'actions';
            const percentageOfTotalCrits = (totalValueForPercentage > 0 && numCrits > 0) ? (numCrits / totalValueForPercentage) * 100 : 0;

            html += `${entryItemPrefix}<strong>${secondaryNameSafe}</strong>: <span class="tooltip-details">${numCrits} ${pointsUnitLabel} - ${numActions} ${actionText}</span>`;
            if (percentageOfTotalCrits > 0.1) {
                html += ` <span class="tooltip-percent">(${percentageOfTotalCrits.toFixed(1)}%)</span>`;
                html += ` <div class="tooltip-bar-container">`;
                html += `  <div class="tooltip-bar" style="width: ${percentageOfTotalCrits.toFixed(1)}%; background-color: ${barColor};"></div>`;
                html += ` </div>`;
            }

            if (entry.weapons && Object.keys(entry.weapons).length > 0) {
                const allWeaponCrits = [];
                Object.entries(entry.weapons).forEach(([weaponName, weaponData]) => {
                    if (weaponData.values && weaponData.values.length > 0) {
                        weaponData.values.forEach(critValue => {
                            allWeaponCrits.push({ value: critValue, name: weaponName });
                        });
                    }
                });

                if (allWeaponCrits.length > 0) {
                    html += `<div class="tooltip-weapon-breakdown">`;
                    allWeaponCrits.sort((a, b) => b.value - a.value).forEach(crit => {
                        const weaponNameSafe = crit.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        html += `<div class="tooltip-weapon-entry">↳ <strong>${crit.value}</strong> pts avec <em>${weaponNameSafe}</em></div>`;
                    });
                    html += `</div>`;
                }
            }

        } else {
            html += `${entryItemPrefix}<strong>${secondaryNameSafe}</strong>: <span class="tooltip-details">${value} ${pointsUnitLabel}`;
            if (showHitCount && hits !== undefined && !valueIsCount && mode !== 'intercepted') {
                const hitText = (hits === 1) ? 'action' : 'actions';
                html += ` (${hits} ${hitText})`;
            }
            html += `</span>`;
        }


        if (percentage > 0.1 && mode !== 'intercepted' && !entry.isInterceptArray && mode !== 'crits') {
            html += ` <span class="tooltip-percent">(${percentage.toFixed(1)}%)</span>`;
        }
        if (mode !== 'intercepted' && value > 0 && !entry.isInterceptArray && mode !== 'crits') {
            html += ` <div class="tooltip-bar-container">`;
            html += `  <div class="tooltip-bar" style="width: ${percentage.toFixed(1)}%; background-color: ${barColor};"></div>`;
            html += ` </div>`;
        }
        // Special handling for protection mode with 'from' structure
        if (mode === 'protection' && entry.from && Object.keys(entry.from).length > 0) {
            html += `<div class="tooltip-weapon-breakdown">`;
            Object.entries(entry.from).forEach(([attackerName, attackerData]) => {
                const attackerNameSafe = attackerName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                html += `<div class="tooltip-attacker-group">↳ De <strong>${attackerNameSafe}</strong>: ${attackerData.protection} pts protégés</div>`;
                
                if (attackerData.weapons && Object.keys(attackerData.weapons).length > 0) {
                    Object.entries(attackerData.weapons).sort(([,a],[,b]) => b.protection - a.protection).forEach(([weaponName, weaponStats]) => {
                        const weaponNameSafe = weaponName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        const weaponHitText = weaponStats.hits === 1 ? "fois" : "fois";
                        html += `<div class="tooltip-weapon-entry" style="margin-left: 20px;">↳ Avec <strong>${weaponNameSafe}</strong>: ${weaponStats.protection} pts (${weaponStats.hits} ${weaponHitText})`;
                        html += `</div>`;
                    });
                }
            });
            html += `</div>`;
        } else if ((mode === 'damage' || mode === 'taken' || mode === 'mitigated') && entry.weapons && Object.keys(entry.weapons).length > 0) {
            html += `<div class="tooltip-weapon-breakdown">`;
            
            if (mode === 'damage' || mode === 'taken') {
                Object.entries(entry.weapons).sort(([,a],[,b]) => b.damage - a.damage).forEach(([weaponName, weaponStats]) => {
                    const weaponNameSafe = weaponName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    const weaponHitText = weaponStats.hits === 1 ? "fois" : "fois";
                    html += `<div class="tooltip-weapon-entry">↳ Avec <strong>${weaponNameSafe}</strong>: ${weaponStats.damage} pts (${weaponStats.hits} ${weaponHitText})`;
                    if (weaponStats.crits > 0) {
                        html += ` (${weaponStats.crits} cc)`;
                    }
                    html += `</div>`;
                });
            } else if (mode === 'mitigated') {
                Object.entries(entry.weapons).sort(([,a],[,b]) => b.mitigation - a.mitigation).forEach(([weaponName, weaponStats]) => {
                    const weaponNameSafe = weaponName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    const weaponHitText = weaponStats.hits === 1 ? "fois" : "fois";
                    html += `<div class="tooltip-weapon-entry">↳ Avec <strong>${weaponNameSafe}</strong>: ${weaponStats.mitigation} pts mitigés (${weaponStats.hits} ${weaponHitText})`;
                    html += `</div>`;
                });
            }
            
            html += `</div>`;
        }
        if (mode === 'intercepted' && entry.isInterceptArray && entry.instances) {
            entry.instances.sort((a,b) => b.damageDealt - a.damageDealt).forEach(instance => {
                const weaponSafe = (instance.weapon || "Inconnue").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const originalTargetSafe = (instance.originalTarget || "Inconnue").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const critText = instance.crit ? " <strong style='color:#ff4d4d;'>CRITIQUE</strong>" : "";
                const mitigatedText = instance.mitigatedAmount > 0 ? ` (${instance.mitigatedAmount} mitigé)` : "";
                html += `<div class="tooltip-interception-instance">↳ ${instance.damageDealt} pts sur <strong>${secondaryNameSafe}</strong> (cible: ${originalTargetSafe}, arme: ${weaponSafe}${critText})${mitigatedText}</div>`;
            });
        }
        html += `</div>`;
    });
    return html;
}

function initializeScript() {
    loadApplicationState();
    setupXhrRequestInterceptor();
    isUserInterfaceVisible = wasVisiblePreference;
    createUserInterface();
    startCombatStateObserver();
}

if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', initializeScript);
} else {
     initializeScript();
}

window.addEventListener('unload', () => {
     stopCombatStateObserver();
     detachUserInterfaceEventListeners();
     if (window.dreadcastLoggerSaveTimeout) {
        clearTimeout(window.dreadcastLoggerSaveTimeout);
        saveApplicationState();
     }
});

})();