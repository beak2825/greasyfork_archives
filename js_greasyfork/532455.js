// ==UserScript==
// @name         Torn Attack Page Assistant
// @namespace    http://tampermonkey.net/
// @version      9.45
// @description  UI Overhaul: Settings Modal, Relocated Status Indicators. Adjusted Blocker Delay. (Formatted)
// @author       Elaine [2047176] with Gemini 2.5
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532455/Torn%20Attack%20Page%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/532455/Torn%20Attack%20Page%20Assistant.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Konstanten für Selektoren ---
  const APP_HEADER_WRAPPER_SELECTOR = 'div[class*="appHeaderWrapper___"]';
  const TITLE_CONTAINER_SELECTOR = 'div[class*="titleContainer___"]';
  const CORE_WRAP_SELECTOR = '[class*="coreWrap___"]';
  const PLAYER_WRAP_SELECTOR = '[class*="player___"]';
  const PLAYER_AREA_SELECTOR = '[class*="playerArea___"]';
  const ATTACKER_PLAYER_AREA_SELECTOR = `${PLAYER_WRAP_SELECTOR}:first-child ${PLAYER_AREA_SELECTOR}`;
  const OPPONENT_PLAYER_AREA_SELECTOR = `${PLAYER_WRAP_SELECTOR}:nth-child(2) ${PLAYER_AREA_SELECTOR}`;
  const OPPONENT_MODEL_WRAP_SELECTOR = `${PLAYER_WRAP_SELECTOR}:nth-child(2) [class*="modelWrap___"]`;
  const OPPONENT_HEALTH_VALUE_SELECTOR = `${PLAYER_WRAP_SELECTOR}:nth-child(2) [id*="player-health-value_"]`;
  const OPPONENT_HEALTH_BAR_SELECTOR = `${PLAYER_WRAP_SELECTOR}:nth-child(2) [class*="pbWrap___"]`;
  const OPPONENT_STATUS_ICON_WRAPPER_SELECTOR = `${OPPONENT_PLAYER_AREA_SELECTOR} [class*="iconsWrap___"]`;
  const EVISCERATE_STATUS_ICON_SELECTOR = 'img[src*="eviscerated.svg"]';
  const ATTACK_STARTED_WEAPON_SELECTOR = `${PLAYER_WRAP_SELECTOR}:first-child #weapon_main[class*="attackStarted___"]`;
  const DIALOG_BUTTONS_SELECTOR = '[class*="dialogButtons___"]';
  const DIALOG_CONTAINER_SELECTOR = '[class*="dialog___"]';
  const DIALOG_COLORED_BOX_SELECTOR = '[class*="colored___"]';
  const DIALOG_TITLE_SELECTOR = '[class*="title___"]';
  const START_FIGHT_BUTTON_SELECTOR = 'button[type="submit"]';
  const HOSPITAL_TIMER_BOX_ID = "attack-assistant-hospital-timer-box";
  const HOSPITAL_TIMER_DISPLAY_ID = "attack-assistant-hospital-timer";
  const ONLINE_STATUS_BOX_ID = "attack-assistant-online-status-box";
  const ONLINE_STATUS_DISPLAY_ID = "attack-assistant-online-status";
  const ATTACK_BUTTON_ID = "attack-assistant-attack-button";
  const REFRESH_BUTTON_ID = "attack-assistant-refresh-button";
  const AREA_BLOCKER_ID = "attack-assistant-area-blocker";
  const LIST_ELEMENT_ID = "attack-assistant-list";
  const HIGHLIGHT_CLASS = "attack-order-highlight";
  const FINISH_BUTTON_CLASS = "attack-assistant-finish-button";
  const FINISH_BUTTON_ACTIVE_CLASS = "finish-button-active";
  const FINISH_BUTTON_BLOCKER_ID = "attack-assistant-finish-blocker";
  const FINISH_CHOICE_ENABLED_CHECKBOX_ID =
    "attack-assistant-finish-choice-enabled";
  const SHOW_NEXT_ATTACK_CHECKBOX_ID = "attack-assistant-show-next-attack";
  const NEXT_ATTACK_DISPLAY_ID = "attack-assistant-next-attack-display";
  const EXECUTE_BOX_ID = "attack-assistant-execute-box";
  const EXECUTE_CHECKBOX_ID = "attack-assistant-execute-enabled";
  const EXECUTE_SLIDER_ID = "attack-assistant-execute-threshold";
  const EXECUTE_VALUE_ID = "attack-assistant-execute-value";
  const EVISCERATE_BOX_ID = "attack-assistant-eviscerate-box";
  const EVISCERATE_CHECKBOX_ID = "attack-assistant-eviscerate-enabled";
  const TEMP_FIRST_BOX_ID = "attack-assistant-temp-first-box";
  const TEMP_FIRST_CHECKBOX_ID = "attack-assistant-temp-first-enabled";
  const EXECUTE_WEAPON_BONUS_SELECTOR = 'i[class*="execute"]';
  const EVISCERATE_WEAPON_BONUS_SELECTOR = 'i[class*="evicerate"]';
  const SETTINGS_MODAL_ID = "attack-assistant-settings-modal";
  const SETTINGS_BUTTON_ID = "attack-assistant-settings-button";
  const STATUS_DISPLAY_AREA_ID = "attack-assistant-status-area";
  const LOG_WRAP_SELECTOR = '[class*="logStatsWrap___"]';

  // --- Konfiguration ---
  const MAX_LIST_ITEMS = 25;
  const ATTACK_TYPES = [
    "Primary",
    "Secondary",
    "Melee",
    "Temporary",
    "Fist",
    "Kick",
  ];
  const FINISH_TYPES = ["Leave", "Mug", "Hospitalize"];
  const STATUS_TYPES = ["Online", "Idle", "Offline", "Unclear"];
  const LIST_STORAGE_KEY = "attackOrderList";
  const API_KEY_STORAGE_KEY = "tornApiKey";
  const STATUS_FINISH_CHOICES_KEY = "statusFinishChoices";
  const STATUS_FINISH_ENABLED_KEY = "statusFinishEnabled";
  const SHOW_NEXT_ATTACK_ENABLED_KEY = "showNextAttackEnabled";
  const EXECUTE_ENABLED_KEY = "executeEnabled";
  const EXECUTE_THRESHOLD_KEY = "executeThreshold";
  const EVISCERATE_ENABLED_KEY = "eviscerateEnabled";
  const TEMP_FIRST_ENABLED_KEY = "tempFirstEnabled";
  const BUTTON_WIDTH = "180px";
  const BUTTON_HEIGHT = "60px";
  const MODAL_BUTTON_WIDTH = "150px";
  const SMALL_BUTTON_GAP = "5px";
  const LARGE_BUTTON_GAP = "10px";
  const MODAL_COLUMN_GAP = "15px";
  const OBSERVER_DEBOUNCE_MS = 200;
  const ATTACK_BUTTON_DELAY_MS = 1010;
  const AREA_BLOCK_DELAY_MS = 350; // Angepasster Delay für den Area Blocker
  const FINISH_BUTTON_PROCESS_DELAY_MS = 50;
  const DEFAULT_EXECUTE_THRESHOLD = 25;
  const DEFAULT_STATUS_FINISH_CHOICES = {
    Online: null,
    Idle: null,
    Offline: null,
    Unclear: null,
  };

  console.log("Torn Attack Page Assistant script loaded (v9.45).");

  // --- Globale Variablen ---
  let userApiKey = null;
  let hospitalTimerInterval = null;
  let currentAttackIndex = 0;
  let statusFinishChoices = { ...DEFAULT_STATUS_FINISH_CHOICES };
  let statusFinishEnabled = true;
  let showNextAttackEnabled = true;
  let opponentCurrentStatus = null;
  let executeEnabled = false;
  let executeThreshold = DEFAULT_EXECUTE_THRESHOLD;
  let eviscerateEnabled = false;
  let tempFirstEnabled = false;
  let executeWeaponSelector = null;
  let eviscerateWeaponSelector = null;
  let opponentBelowExecuteThreshold = false;
  let opponentLifeObserver = null;
  let mainUiElementsAdded = false;
  let lastAttackUsed = null;

  // --- CSS einfügen ---
  GM_addStyle(`
        .${HIGHLIGHT_CLASS} { background-color: #555 !important; border-left: 3px solid #FFD700 !important; padding-left: 7px !important; margin-left: -10px !important; border-radius: 3px; }
        .${HIGHLIGHT_CLASS} span:first-child { margin-right: 5px !important; }
        #${ATTACK_BUTTON_ID} {
            position: absolute; z-index: 1000; width: ${BUTTON_WIDTH}; height: ${BUTTON_HEIGHT};
            top: 50%; left: 50%; transform: translate(-50%, -50%); box-sizing: border-box;
            display: flex; align-items: center; justify-content: center;
            opacity: 0.85;
        }
        #${ATTACK_BUTTON_ID}:disabled { opacity: 0.5; cursor: not-allowed; }
        #${REFRESH_BUTTON_ID} { z-index: 1001; min-width: 120px; margin: auto; }
        .${FINISH_BUTTON_ACTIVE_CLASS} { background-color: #ccc !important; color: #333 !important; border-color: #fff !important; font-weight: bold; }
        #${EXECUTE_BOX_ID} label, #${EVISCERATE_BOX_ID} label, #${TEMP_FIRST_BOX_ID} label, #${FINISH_CHOICE_ENABLED_CHECKBOX_ID}-label, #${SHOW_NEXT_ATTACK_CHECKBOX_ID}-label { display: block; margin-bottom: 5px; cursor: pointer; font-weight: bold; }
        #${EXECUTE_BOX_ID} input[type="checkbox"], #${EVISCERATE_BOX_ID} input[type="checkbox"], #${TEMP_FIRST_BOX_ID} input[type="checkbox"], #${FINISH_CHOICE_ENABLED_CHECKBOX_ID}, #${SHOW_NEXT_ATTACK_CHECKBOX_ID} { margin-right: 5px; vertical-align: middle; }
        #${EXECUTE_BOX_ID} input[type="range"] { width: calc(100% - 45px); vertical-align: middle; }
        #${EXECUTE_VALUE_ID} { display: inline-block; width: 40px; text-align: right; font-weight: bold; vertical-align: middle; }
        #${SETTINGS_BUTTON_ID} { margin-left: 15px; padding: 0 12px; height: 28px; line-height: 28px; font-size: 0.9em; background-color: #4a4a4a; color: #fff; border: 1px solid #555; border-radius: 4px; cursor: pointer; transition: background-color 0.2s ease, border-color 0.2s ease; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1px 1px rgba(0,0,0,0.2); }
        #${SETTINGS_BUTTON_ID}:hover { background-color: #575757; border-color: #666; }
        #${SETTINGS_MODAL_ID} { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); }
        #${SETTINGS_MODAL_ID}-content { background-color: #333; color: #ddd; margin: 8% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 650px; border-radius: 8px; position: relative; display: flex; flex-direction: column; gap: ${LARGE_BUTTON_GAP}; }
        #${SETTINGS_MODAL_ID}-close { color: #aaa; float: right; font-size: 28px; font-weight: bold; position: absolute; top: 10px; right: 15px; z-index: 10; }
        #${SETTINGS_MODAL_ID}-close:hover, #${SETTINGS_MODAL_ID}-close:focus { color: #fff; text-decoration: none; cursor: pointer; }
        #${SETTINGS_MODAL_ID} .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #555; padding-bottom: 10px; margin-bottom: ${LARGE_BUTTON_GAP};}
        #${SETTINGS_MODAL_ID} .modal-header h3 { margin: 0; color: #fff; border-bottom: none; padding-bottom: 0; flex-grow: 1; }
        #${SETTINGS_MODAL_ID} .modal-header button#modal-attack-assistant-update-api-key-button { margin-left: 15px; flex-shrink: 0; margin-right: 35px; }
        #${SETTINGS_MODAL_ID} .modal-body { display: grid; grid-template-columns: 1fr 140px 140px; gap: ${MODAL_COLUMN_GAP}; }
        #${SETTINGS_MODAL_ID} .modal-column { display: flex; flex-direction: column; gap: ${LARGE_BUTTON_GAP}; }
        #${SETTINGS_MODAL_ID} #${LIST_ELEMENT_ID}-container { width: 100%; height: 300px; background-color: #444; border: 1px solid #666; border-radius: 5px; display: flex; flex-direction: column; }
        #${SETTINGS_MODAL_ID} #${LIST_ELEMENT_ID} { list-style: none; margin: 0; overflow-y: auto; flex-grow: 1; padding: 5px 10px 10px 10px; }
        #${SETTINGS_MODAL_ID} .modal-attack-controls-box { background-color: #444; border: 1px solid #666; border-radius: 5px; padding: 10px; display: flex; flex-direction: column; gap: ${SMALL_BUTTON_GAP}; }
        #${SETTINGS_MODAL_ID} .modal-attack-buttons-container { display: flex; flex-direction: column; gap: ${SMALL_BUTTON_GAP}; }
        #${SETTINGS_MODAL_ID} .modal-attack-controls-box button { width: 100%; }
        #${SETTINGS_MODAL_ID} .modal-attack-controls-box button#modal-attack-assistant-reset-button { margin-top: ${LARGE_BUTTON_GAP}; }
        #${SETTINGS_MODAL_ID} .modal-special-attacks-box, #${SETTINGS_MODAL_ID} .modal-finish-choice-box, #${SETTINGS_MODAL_ID} .modal-show-next-attack-box { background-color: #444; border: 1px solid #666; border-radius: 5px; padding: 10px; display: flex; flex-direction: column; gap: ${SMALL_BUTTON_GAP}; }
        #${STATUS_DISPLAY_AREA_ID} { display: flex; flex-direction: row; justify-content: flex-start; align-items: stretch; padding: 5px 10px; margin-bottom: 10px; border-bottom: 1px solid #444; gap: ${LARGE_BUTTON_GAP}; }
        #${HOSPITAL_TIMER_BOX_ID}, #${ONLINE_STATUS_BOX_ID}, #${NEXT_ATTACK_DISPLAY_ID} {
            position: static !important; width: auto !important;
            min-width: 0; text-align: center;
            padding: 8px; background-color: #3a3a3a !important;
            border: 1px solid #555 !important; border-radius: 4px;
            margin: 0; min-height: 30px; display: flex;
            align-items: center; justify-content: center;
            flex-grow: 0; flex-shrink: 0; color: #ccc;
        }
        #${NEXT_ATTACK_DISPLAY_ID} {
             gap: 10px; font-size: 1.0em; flex-grow: 1; justify-content: flex-start;
        }
        #${NEXT_ATTACK_DISPLAY_ID} span { font-weight: bold; }
        #${NEXT_ATTACK_DISPLAY_ID} .next-attack-label { color: #aaa; margin-right: 5px;}
        #${NEXT_ATTACK_DISPLAY_ID} .next-attack-value { color: #fff; }
        #${ONLINE_STATUS_DISPLAY_ID} .status-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; vertical-align: middle; border: 1px solid #888; }
        #${ONLINE_STATUS_DISPLAY_ID} .status-dot.online { background-color: #57a838; }
        #${ONLINE_STATUS_DISPLAY_ID} .status-dot.idle { background-color: #ff9900; }
        #${ONLINE_STATUS_DISPLAY_ID} .status-dot.offline { background-color: #999999; }
        #${ONLINE_STATUS_DISPLAY_ID} .status-text { vertical-align: middle; }
        #${ONLINE_STATUS_DISPLAY_ID} .relative-time { font-style: italic; color: #aaa; margin-left: 5px; }
        .finish-choice-matrix { width: 100%; border-collapse: collapse; margin-top: 5px; border: 1px solid #555; }
        .finish-choice-matrix th, .finish-choice-matrix td { text-align: center; padding: 6px 4px; font-size: 0.9em; border: 1px solid #555; color: #ddd; }
        .finish-choice-matrix th { font-weight: bold; color: #fff; background-color: #4a4a4a; }
        .finish-choice-matrix td:first-child { text-align: left; font-weight: bold; padding-left: 8px; padding-right: 10px; background-color: #3e3e3e;}
        .finish-choice-matrix input[type="radio"] { vertical-align: middle; cursor: pointer; margin: 0 3px; }
        #${FINISH_CHOICE_ENABLED_CHECKBOX_ID}-label { margin-bottom: 10px !important; }
        #${AREA_BLOCKER_ID} {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.0); z-index: 1005; pointer-events: auto;
        }
    `);

  // --- Hilfsfunktion zum Erstellen eines Listenelements ---
  function createAttackListItem(itemNumber, itemText) {
    const listItem = document.createElement("li");
    listItem.style.padding = "3px 0";
    listItem.style.fontSize = "1.5em";
    listItem.style.fontWeight = "bold";
    const numSpan = document.createElement("span");
    numSpan.textContent = `${itemNumber}.`;
    Object.assign(numSpan.style, {
      fontWeight: "normal",
      fontSize: "0.8em",
      marginRight: "8px",
      display: "inline-block",
      width: "2em",
      textAlign: "right",
      color: "#AAAAAA",
    });
    const textSpan = document.createElement("span");
    textSpan.textContent = itemText;
    listItem.dataset.value = itemText;
    listItem.appendChild(numSpan);
    listItem.appendChild(textSpan);
    return listItem;
  }

  // --- Hilfsfunktion zum Aktualisieren der Hervorhebung ---
  function updateHighlight(ulElement, indexToHighlight) {
    if (!ulElement) {
      return;
    }
    ulElement.querySelectorAll(`li.${HIGHLIGHT_CLASS}`).forEach((li) => {
      li.classList.remove(HIGHLIGHT_CLASS);
      li.style.paddingLeft = "";
    });
    const actualIndex = Math.min(
      indexToHighlight,
      ulElement.children.length - 1,
    );
    if (actualIndex >= 0 && actualIndex < ulElement.children.length) {
      const targetLi = ulElement.children[actualIndex];
      if (targetLi) {
        targetLi.classList.add(HIGHLIGHT_CLASS);
      }
    }
  }

  // --- Hilfsfunktion zum Speichern des Listenstatus ---
  function saveListState(ulElement) {
    try {
      const items = [];
      ulElement.querySelectorAll("li > span:nth-child(2)").forEach((span) => {
        if (span && span.textContent) items.push(span.textContent.trim());
      });
      GM_setValue(LIST_STORAGE_KEY, items);
    } catch (error) {
      console.error("Error saving list state:", error);
    }
  }

  // --- Hilfsfunktion zum Laden und Füllen der Liste ---
  function loadAndPopulateList(ulElement) {
    try {
      const savedList = GM_getValue(LIST_STORAGE_KEY, []);
      ulElement.innerHTML = "";
      savedList.forEach((itemText, index) => {
        if (ulElement.children.length < MAX_LIST_ITEMS) {
          ulElement.appendChild(createAttackListItem(index + 1, itemText));
        }
      });
      updateHighlight(ulElement, currentAttackIndex);
    } catch (error) {
      console.error("Error loading list state:", error);
    }
  }

  // --- Funktionen zum Laden der Einstellungen ---
  function loadSettings() {
    try {
      userApiKey = GM_getValue(API_KEY_STORAGE_KEY, null);
      if (!userApiKey) {
        console.log("No API Key found...");
        promptForApiKey();
      } else {
        console.log("API Key loaded.");
      }
    } catch (error) {
      console.error("Error loading API key:", error);
    }
    try {
      const loadedChoices = GM_getValue(STATUS_FINISH_CHOICES_KEY, null);
      statusFinishChoices =
        loadedChoices && typeof loadedChoices === "object"
          ? { ...DEFAULT_STATUS_FINISH_CHOICES, ...loadedChoices }
          : { ...DEFAULT_STATUS_FINISH_CHOICES };
      console.log("Loaded status finish choices:", statusFinishChoices);
    } catch (error) {
      console.error("Error loading status finish choices:", error);
      statusFinishChoices = { ...DEFAULT_STATUS_FINISH_CHOICES };
    }
    try {
      statusFinishEnabled = GM_getValue(STATUS_FINISH_ENABLED_KEY, true);
      console.log(`Loaded status finish enabled: ${statusFinishEnabled}`);
    } catch (error) {
      console.error("Error loading status finish enabled state:", error);
      statusFinishEnabled = true;
    }
    try {
      showNextAttackEnabled = GM_getValue(SHOW_NEXT_ATTACK_ENABLED_KEY, true);
      console.log(`Loaded show next attack enabled: ${showNextAttackEnabled}`);
    } catch (error) {
      console.error("Error loading show next attack enabled state:", error);
      showNextAttackEnabled = true;
    }
    try {
      executeEnabled = GM_getValue(EXECUTE_ENABLED_KEY, false);
      console.log(`Loaded execute enabled: ${executeEnabled}`);
    } catch (error) {
      console.error("Error loading execute enabled:", error);
      executeEnabled = false;
    }
    try {
      executeThreshold = GM_getValue(
        EXECUTE_THRESHOLD_KEY,
        DEFAULT_EXECUTE_THRESHOLD,
      );
      console.log(`Loaded execute threshold: ${executeThreshold}%`);
    } catch (error) {
      console.error("Error loading execute threshold:", error);
      executeThreshold = DEFAULT_EXECUTE_THRESHOLD;
    }
    try {
      eviscerateEnabled = GM_getValue(EVISCERATE_ENABLED_KEY, false);
      console.log(`Loaded eviscerate enabled: ${eviscerateEnabled}`);
    } catch (error) {
      console.error("Error loading eviscerate enabled:", error);
      eviscerateEnabled = false;
    }
    try {
      tempFirstEnabled = GM_getValue(TEMP_FIRST_ENABLED_KEY, false);
      console.log(`Loaded temporary first enabled: ${tempFirstEnabled}`);
    } catch (error) {
      console.error("Error loading temporary first enabled:", error);
      tempFirstEnabled = false;
    }
    currentAttackIndex = 0;
    executeWeaponSelector = null;
    eviscerateWeaponSelector = null;
    opponentBelowExecuteThreshold = false;
    opponentCurrentStatus = null;
    stopOpponentLifeObserver();
  }

  // --- Funktionen zur API-Schlüsselbehandlung ---
  function promptForApiKey() {
    try {
      const enteredKey = prompt(
        "Please enter your Torn API key (limited key recommended).\nThis key will be stored locally by the Tampermonkey script for this page only.",
        userApiKey || "",
      );
      if (enteredKey === null) {
        console.log("API Key entry cancelled by user.");
        if (!userApiKey) {
          alert("Warning: API key needed for some features.");
        }
      } else {
        const trimmedKey = enteredKey.trim();
        if (trimmedKey) {
          GM_setValue(API_KEY_STORAGE_KEY, trimmedKey);
          userApiKey = trimmedKey;
          console.log("API Key saved.");
          alert("API Key saved successfully!");
          updateStatusFromApi();
        } else {
          console.log("Empty API Key entered.");
          alert("Error: Empty API key entered.");
        }
      }
    } catch (error) {
      console.error("Error prompting for API key:", error);
    }
  }

  // --- Timer-Funktionen ---
  function clearHospitalTimer() {
    if (hospitalTimerInterval) {
      clearInterval(hospitalTimerInterval);
      hospitalTimerInterval = null;
    }
    const timerDisplay = document.getElementById(HOSPITAL_TIMER_DISPLAY_ID);
    if (timerDisplay) {
      timerDisplay.remove();
    }
  }
  function formatTime(seconds) {
    if (seconds < 0) {
      seconds = 0;
    }
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  function createOrUpdateHospitalTimer(parentElement, releaseTimestamp) {
    try {
      clearHospitalTimer();
      let timerDisplay = document.getElementById(HOSPITAL_TIMER_DISPLAY_ID);
      if (!timerDisplay) {
        timerDisplay = document.createElement("div");
        timerDisplay.id = HOSPITAL_TIMER_DISPLAY_ID;
        Object.assign(timerDisplay.style, {
          color: "#FFD700",
          textAlign: "center",
          fontSize: "1.1em",
          padding: "5px 0",
        });
        parentElement.innerHTML = "";
        parentElement.appendChild(timerDisplay);
      }
      const updateTimer = () => {
        try {
          const now = Math.floor(Date.now() / 1000);
          const secondsRemaining = releaseTimestamp - now;
          const currentTimerDisplay = document.getElementById(
            HOSPITAL_TIMER_DISPLAY_ID,
          );
          if (!currentTimerDisplay) {
            clearHospitalTimer();
            return;
          }
          if (secondsRemaining <= 0) {
            currentTimerDisplay.textContent = "Released";
            clearHospitalTimer();
          } else {
            currentTimerDisplay.textContent = `Out in: ${formatTime(secondsRemaining)}`;
          }
        } catch (e) {
          console.error("Error updating timer display:", e);
          clearHospitalTimer();
        }
      };
      updateTimer();
      hospitalTimerInterval = setInterval(updateTimer, 1000);
    } catch (error) {
      console.error("Error creating/updating hospital timer:", error);
    }
  }
  function displayNotInHospital(parentElement) {
    try {
      clearHospitalTimer();
      let timerDisplay = document.getElementById(HOSPITAL_TIMER_DISPLAY_ID);
      if (!timerDisplay) {
        timerDisplay = document.createElement("div");
        timerDisplay.id = HOSPITAL_TIMER_DISPLAY_ID;
        Object.assign(timerDisplay.style, {
          color: "#CCCCCC",
          textAlign: "center",
          fontSize: "1.0em",
          padding: "5px 0",
        });
        parentElement.innerHTML = "";
        parentElement.appendChild(timerDisplay);
      }
      timerDisplay.textContent = "Not in hospital";
    } catch (error) {
      console.error("Error displaying 'Not in hospital':", error);
    }
  }

  // --- API-Aufruffunktionen ---
  function getTargetUserID() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("user2ID");
    } catch (e) {
      console.error("Error getting target UserID from URL:", e);
      return null;
    }
  }
  function fetchTargetStatus(targetUserID, callback) {
    if (!userApiKey || !targetUserID) {
      console.warn("Cannot fetch status: Missing API Key or Target User ID.");
      callback(null);
      return;
    }
    const apiUrl = `https://api.torn.com/user/${targetUserID}?selections=profile&key=${userApiKey}`;
    try {
      GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        timeout: 15000,
        onload: function (response) {
          let statusInfo = {
            releaseTimestamp: null,
            lastActionStatus: null,
            lastActionRelative: null,
          };
          try {
            if (response.status >= 200 && response.status < 300) {
              const data = JSON.parse(response.responseText);
              if (data.error) {
                console.error("Torn API Error:", data.error.error);
                if (data.error.code === 2) {
                  alert("Invalid API Key detected.");
                  userApiKey = null;
                  GM_setValue(API_KEY_STORAGE_KEY, null);
                }
              } else {
                if (
                  data.status?.description
                    ?.toLowerCase()
                    .includes("hospital") &&
                  data.status.until > 0 &&
                  data.status.until * 1000 > Date.now()
                ) {
                  statusInfo.releaseTimestamp = data.status.until;
                }
                if (data.last_action) {
                  statusInfo.lastActionStatus = data.last_action.status;
                  statusInfo.lastActionRelative = data.last_action.relative;
                }
              }
            } else {
              console.error(`API request failed: ${response.status}`);
            }
          } catch (e) {
            console.error("Error processing API response:", e);
          } finally {
            callback(statusInfo);
          }
        },
        onerror: function (response) {
          console.error("GM_xmlhttpRequest error:", response);
          callback(null);
        },
        ontimeout: function () {
          console.error("API request timed out.");
          callback(null);
        },
      });
    } catch (e) {
      console.error("Error initiating GM_xmlhttpRequest:", e);
      callback(null);
    }
  }

  // --- UI-Update-Funktionen ---
  function displayHospitalTimer(releaseTimestamp) {
    try {
      const timerBox = document.getElementById(HOSPITAL_TIMER_BOX_ID);
      if (timerBox) {
        timerBox.style.display = "flex";
        createOrUpdateHospitalTimer(timerBox, releaseTimestamp);
      } else {
        console.error("Timer box element not found!");
      }
    } catch (error) {
      console.error("Error displaying hospital timer:", error);
    }
  }
  function hideHospitalTimerBox() {
    clearHospitalTimer();
    const timerBox = document.getElementById(HOSPITAL_TIMER_BOX_ID);
    if (timerBox) {
      displayNotInHospital(timerBox);
    }
  }
  function updateOnlineStatusBox(statusBox, statusText, relativeTime) {
    if (!statusBox) {
      return;
    }
    try {
      let statusDisplay = statusBox.querySelector(
        `#${ONLINE_STATUS_DISPLAY_ID}`,
      );
      if (!statusDisplay) {
        // statusBox.style.textAlign = 'center'; // Zentriert durch Flexbox
        statusDisplay = document.createElement("div");
        statusDisplay.id = ONLINE_STATUS_DISPLAY_ID;
        /*statusDisplay.style.marginBottom = '8px';*/ statusDisplay.style.minHeight =
          "1.2em";
        const statusDot = document.createElement("span");
        statusDot.classList.add("status-dot");
        const statusTextSpan = document.createElement("span");
        statusTextSpan.classList.add("status-text");
        statusDisplay.appendChild(statusDot);
        statusDisplay.appendChild(statusTextSpan);
        statusBox.insertBefore(statusDisplay, statusBox.firstChild);
      }
      const statusDot = statusDisplay.querySelector(".status-dot");
      const statusTextSpan = statusDisplay.querySelector(".status-text");
      statusDot.className = "status-dot";
      if (statusText) {
        const statusLower = statusText.toLowerCase();
        statusTextSpan.textContent = `Status: ${statusText}`;
        if (statusLower === "online") {
          statusDot.classList.add("online");
        } else if (statusLower === "idle") {
          statusDot.classList.add("idle");
        } else {
          statusDot.classList.add("offline");
          if (relativeTime) {
            let relativeSpan = statusTextSpan.querySelector(".relative-time");
            if (!relativeSpan) {
              relativeSpan = document.createElement("span");
              relativeSpan.classList.add("relative-time");
              statusTextSpan.appendChild(relativeSpan);
            }
            relativeSpan.textContent = ` (${relativeTime})`;
          } else {
            const existingSpan = statusTextSpan.querySelector(".relative-time");
            if (existingSpan) {
              existingSpan.remove();
            }
          }
        }
      } else {
        statusDot.classList.add("offline");
        statusTextSpan.textContent = "Status: Unknown";
        const existingSpan = statusTextSpan.querySelector(".relative-time");
        if (existingSpan) {
          existingSpan.remove();
        }
      }
    } catch (error) {
      console.error("Error updating online status box:", error);
      if (statusBox) {
        statusBox.textContent = "Error loading status";
      }
    }
  }

  // --- Hilfsfunktion zum Prüfen, ob der Kampf begonnen hat ---
  function isFightStarted() {
    return !!document.querySelector(ATTACK_STARTED_WEAPON_SELECTOR);
  }

  // --- Funktion zum bedingten Hinzufügen des Refresh-Buttons ---
  function addRefreshButton() {
    try {
      const defenderBlock = document.querySelector(
        `${PLAYER_WRAP_SELECTOR}:nth-child(2)`,
      );
      if (!defenderBlock) {
        return false;
      }

      const dialogContainer = defenderBlock.querySelector(
        DIALOG_CONTAINER_SELECTOR,
      );
      const coloredBox = dialogContainer
        ? dialogContainer.querySelector(DIALOG_COLORED_BOX_SELECTOR)
        : null;
      const startFightButton = dialogContainer
        ? dialogContainer.querySelector(START_FIGHT_BUTTON_SELECTOR)
        : null;

      const buttonId = REFRESH_BUTTON_ID;
      const existingRefresh = document.getElementById(buttonId);

      let messageText = "";
      const titleElement = coloredBox
        ? coloredBox.querySelector(DIALOG_TITLE_SELECTOR)
        : null;
      let originalTextElementToHide = titleElement;

      if (titleElement) {
        messageText = titleElement.textContent.toLowerCase();
      } else if (coloredBox) {
        messageText = coloredBox.textContent.toLowerCase();
        const childNodes = Array.from(coloredBox.childNodes);
        originalTextElementToHide = childNodes.find(
          (node) =>
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim().length > 0,
        );
        if (!originalTextElementToHide) {
          originalTextElementToHide =
            coloredBox.querySelector("span:not([class])");
          if (
            originalTextElementToHide &&
            originalTextElementToHide.parentElement !== coloredBox
          ) {
            originalTextElementToHide = null;
          }
        }
      } else if (dialogContainer) {
        messageText = dialogContainer.textContent.toLowerCase();
      }

      const fightStarted = isFightStarted();
      const isHospital = messageText.includes("hospital");
      const isNoEnergy = messageText.includes("energy");

      if (!fightStarted && !startFightButton && (isHospital || isNoEnergy)) {
        let buttonText = "Refresh";
        if (isHospital) {
          buttonText = "In Hospital";
        } else if (isNoEnergy) {
          buttonText = "No Energy";
        }
        const buttonHTML = `&#x21bb; ${buttonText}`;

        if (coloredBox) {
          if (originalTextElementToHide) {
            originalTextElementToHide.style.display = "none";
          }
          coloredBox.style.display = "flex";
          coloredBox.style.alignItems = "center";
          coloredBox.style.justifyContent = "center";
          coloredBox.style.height = "100%";
          coloredBox.style.position = "relative";
        }

        let refreshButton = existingRefresh;
        if (!refreshButton) {
          refreshButton = document.createElement("button");
          refreshButton.id = buttonId;
          refreshButton.classList.add("torn-btn", "silver");
          Object.assign(refreshButton.style, {
            zIndex: "1001",
            minWidth: "120px",
            margin: "auto",
          });
          refreshButton.addEventListener("click", () => {
            window.location.reload();
          });

          if (coloredBox) {
            if (!coloredBox.contains(refreshButton)) {
              coloredBox.appendChild(refreshButton);
            }
          } else {
            console.error(
              "Refresh button: coloredBox not found, but expected.",
            );
            return false;
          }
        }
        refreshButton.innerHTML = buttonHTML;
        return true;
      } else {
        if (existingRefresh) {
          existingRefresh.remove();
        }
        if (coloredBox) {
          if (originalTextElementToHide) {
            originalTextElementToHide.style.display = "";
          }
          coloredBox.style.display = "";
          coloredBox.style.alignItems = "";
          coloredBox.style.justifyContent = "";
          coloredBox.style.height = "";
          coloredBox.style.position = "";
        }
        return false;
      }
    } catch (error) {
      console.error("Error in addRefreshButton:", error);
      const btn = document.getElementById(REFRESH_BUTTON_ID);
      if (btn) {
        btn.remove();
      }
      return false;
    }
  }

  // --- Funktion zum Hinzufügen des ATTACK-Platzhalterbuttons (nach Kampfbeginn) ---
  function addAttackButton() {
    try {
      const buttonId = ATTACK_BUTTON_ID;
      if (document.getElementById(buttonId)) {
        return true;
      }
      const opponentModelWrap = document.querySelector(
        OPPONENT_MODEL_WRAP_SELECTOR,
      );
      if (!opponentModelWrap) {
        console.error("Could not find opponent model wrap for ATTACK button.");
        return false;
      }

      console.log("Torn Attack Page Assistant: Adding ATTACK button.");
      const attackButton = document.createElement("button");
      attackButton.id = buttonId;
      attackButton.textContent = "ATTACK";
      attackButton.classList.add("torn-btn", "green");
      // Styling für Zentrierung ist jetzt im CSS über die ID

      if (getComputedStyle(opponentModelWrap).position === "static") {
        opponentModelWrap.style.position = "relative";
      }
      opponentModelWrap.appendChild(attackButton);

      attackButton.addEventListener("click", handleAttackButtonClick);
      return true;
    } catch (error) {
      console.error("Error adding ATTACK button:", error);
      return false;
    }
  }

  // --- Funktion zum Finden der ausgerüsteten Execute-Waffe ---
  function findExecuteWeapon() {
    const attackerArea = document.querySelector(ATTACKER_PLAYER_AREA_SELECTOR);
    if (!attackerArea) {
      return null;
    }
    const weaponSlots = ["#weapon_main", "#weapon_second", "#weapon_melee"];
    for (const slotSelector of weaponSlots) {
      const weaponElement = attackerArea.querySelector(slotSelector);
      if (
        weaponElement &&
        weaponElement.querySelector(EXECUTE_WEAPON_BONUS_SELECTOR)
      ) {
        console.log(`Execute bonus found on weapon: ${slotSelector}`);
        return slotSelector;
      }
    }
    return null;
  }
  // --- Funktion zum Finden der ausgerüsteten Eviscerate-Waffe ---
  function findEviscerateWeapon() {
    const attackerArea = document.querySelector(ATTACKER_PLAYER_AREA_SELECTOR);
    if (!attackerArea) {
      return null;
    }
    const weaponSlots = ["#weapon_main", "#weapon_second", "#weapon_melee"];
    for (const slotSelector of weaponSlots) {
      const weaponElement = attackerArea.querySelector(slotSelector);
      if (
        weaponElement &&
        weaponElement.querySelector(EVISCERATE_WEAPON_BONUS_SELECTOR)
      ) {
        console.log(`Eviscerate bonus found on weapon: ${slotSelector}`);
        return slotSelector;
      }
    }
    console.log("No eviscerate weapon found.");
    return null;
  }
  // --- Funktion zur Überprüfung der gegnerischen Gesundheit und Aktualisierung des Flags ---
  function checkOpponentHealth() {
    if (!opponentLifeObserver) {
      return;
    }
    if (!executeEnabled || !executeWeaponSelector) {
      opponentBelowExecuteThreshold = false;
      return;
    }
    const healthElement = document.querySelector(
      OPPONENT_HEALTH_VALUE_SELECTOR,
    );
    if (!healthElement || !healthElement.textContent) {
      opponentBelowExecuteThreshold = false;
      return;
    }
    try {
      const healthMatch = healthElement.textContent.match(
        /([\d,]+)\s*\/\s*([\d,]+)/,
      );
      if (healthMatch && healthMatch.length === 3) {
        const currentHealth = parseInt(healthMatch[1].replace(/,/g, ""), 10);
        const maxHealth = parseInt(healthMatch[2].replace(/,/g, ""), 10);
        if (!isNaN(currentHealth) && !isNaN(maxHealth) && maxHealth > 0) {
          const currentPercent = (currentHealth / maxHealth) * 100;
          const threshold = executeThreshold;
          const isBelow = currentPercent <= threshold;
          if (isBelow !== opponentBelowExecuteThreshold) {
            console.log(
              `Opponent health ${isBelow ? "<=" : ">"} ${threshold}%. Execute possible: ${isBelow}`,
            );
          }
          opponentBelowExecuteThreshold = isBelow;
        } else {
          opponentBelowExecuteThreshold = false;
        }
      } else {
        opponentBelowExecuteThreshold = false;
      }
    } catch (e) {
      console.error("Error parsing opponent health:", e);
      opponentBelowExecuteThreshold = false;
    }
  }
  // --- Beobachterfunktionen für die gegnerische Lebensleiste ---
  function startOpponentLifeObserver() {
    if (opponentLifeObserver) {
      return;
    }
    if (!executeEnabled || !executeWeaponSelector) {
      return;
    }
    const healthValueElement = document.querySelector(
      OPPONENT_HEALTH_VALUE_SELECTOR,
    );
    if (!healthValueElement) {
      console.warn("Cannot find opponent health value element to observe.");
      return;
    }
    console.log("Starting opponent life observer.");
    opponentLifeObserver = new MutationObserver(() => {
      checkOpponentHealth();
    });
    opponentLifeObserver.observe(healthValueElement, {
      characterData: true,
      subtree: true,
      childList: true,
    });
    checkOpponentHealth();
  }
  function stopOpponentLifeObserver() {
    if (opponentLifeObserver) {
      opponentLifeObserver.disconnect();
      opponentLifeObserver = null;
      opponentBelowExecuteThreshold = false;
      console.log("Opponent life observer stopped.");
    }
  }
  // --- Hilfsfunktion zur Überprüfung von gegnerischen Statussymbolen ---
  function hasOpponentEviscerateIcon() {
    const iconContainer = document.querySelector(
      OPPONENT_STATUS_ICON_WRAPPER_SELECTOR,
    );
    if (iconContainer) {
      return !!iconContainer.querySelector(EVISCERATE_STATUS_ICON_SELECTOR);
    }
    return false;
  }

  // --- ATTACK-Button Klick-Handler ---
  function handleAttackButtonClick() {
    const attackButton = document.getElementById(ATTACK_BUTTON_ID);
    if (!attackButton || attackButton.disabled) {
      return;
    }
    const ul = document.getElementById(LIST_ELEMENT_ID);
    const attackerArea = document.querySelector(ATTACKER_PLAYER_AREA_SELECTOR);
    if (!ul || !attackerArea) {
      console.error("Could not find list or attacker area.");
      return;
    }
    let weaponToClickSelector = null;
    let actionDescription = "";
    let usedExecute = false;
    let usedEviscerate = false;
    let usedTempFirst = false;
    checkOpponentHealth();
    const opponentHasEviscerateIcon = hasOpponentEviscerateIcon();
    const tempWeaponElement = attackerArea.querySelector("#weapon_temp");
    const tempWeaponAvailable =
      tempWeaponElement && tempWeaponElement.querySelector("img");
    // Priorität: Temp First > Execute > Eviscerate > Liste
    if (tempFirstEnabled && currentAttackIndex === 0 && tempWeaponAvailable) {
      weaponToClickSelector = "#weapon_temp";
      actionDescription = "Using Temporary weapon first";
      usedTempFirst = true;
    } else if (
      executeEnabled &&
      executeWeaponSelector &&
      opponentBelowExecuteThreshold
    ) {
      weaponToClickSelector = executeWeaponSelector;
      actionDescription = `Executing with ${executeWeaponSelector}`;
      usedExecute = true;
    } else if (
      eviscerateEnabled &&
      eviscerateWeaponSelector &&
      !opponentHasEviscerateIcon
    ) {
      weaponToClickSelector = eviscerateWeaponSelector;
      actionDescription = `Attempting Eviscerate with ${eviscerateWeaponSelector}`;
      usedEviscerate = true;
    } else {
      if (ul.children.length === 0) {
        console.warn("Attack order list is empty.");
        return;
      }
      const indexToUse = Math.min(currentAttackIndex, ul.children.length - 1);
      const attackItem = ul.children[indexToUse];
      if (!attackItem) {
        console.error(`Could not find list item at index ${indexToUse}`);
        return;
      }
      const attackTypeSpan = attackItem.querySelector("span:nth-child(2)");
      const attackType = attackTypeSpan
        ? attackTypeSpan.textContent.trim()
        : null;
      if (attackType) {
        let weaponSelector = null;
        switch (attackType.toLowerCase()) {
          case "primary":
            weaponSelector = "#weapon_main";
            break;
          case "secondary":
            weaponSelector = "#weapon_second";
            break;
          case "melee":
            weaponSelector = "#weapon_melee";
            break;
          case "temporary":
            weaponSelector = "#weapon_temp";
            break;
          case "fist":
          case "fists":
            weaponSelector = "#weapon_fists";
            break;
          case "kick":
            weaponSelector = "#weapon_boots";
            break;
          default:
            console.error(`Unknown attack type: ${attackType}`);
        }
        actionDescription = `Attack ${currentAttackIndex + 1}: ${attackType} (using index ${indexToUse})`;
        weaponToClickSelector = weaponSelector;
      } else {
        console.error(
          `Could not read attack type from list item index ${indexToUse}.`,
        );
        return;
      }
    }
    if (weaponToClickSelector) {
      const weaponElement = attackerArea.querySelector(weaponToClickSelector);
      if (weaponElement) {
        console.log(`${actionDescription} (Element: ${weaponToClickSelector})`);
        // Map selector to display name for lastAttackUsed
        switch (weaponToClickSelector) {
          case "#weapon_main":
            lastAttackUsed = "Primary";
            break;
          case "#weapon_second":
            lastAttackUsed = "Secondary";
            break;
          case "#weapon_melee":
            lastAttackUsed = "Melee";
            break;
          case "#weapon_temp":
            lastAttackUsed = "Temporary";
            break;
          case "#weapon_fists":
            lastAttackUsed = "Fist";
            break;
          case "#weapon_boots":
            lastAttackUsed = "Kick";
            break;
          default:
            lastAttackUsed = weaponToClickSelector.replace("#weapon_", ""); // Fallback
        }
        weaponElement.click();
        attackButton.disabled = true;

        // --- Area Blocker hinzufügen ---
        const opponentPlayerArea = document.querySelector(
          OPPONENT_PLAYER_AREA_SELECTOR,
        );
        if (opponentPlayerArea) {
          let areaBlocker = document.getElementById(AREA_BLOCKER_ID);
          if (!areaBlocker) {
            areaBlocker = document.createElement("div");
            areaBlocker.id = AREA_BLOCKER_ID;
            // Styling wird über CSS angewendet
            if (getComputedStyle(opponentPlayerArea).position === "static") {
              opponentPlayerArea.style.position = "relative"; // Ensure parent is positioned
            }
            opponentPlayerArea.appendChild(areaBlocker);
          }
          areaBlocker.style.display = "block";
          areaBlocker.style.pointerEvents = "auto";

          // Blocker nach Delay entfernen
          setTimeout(() => {
            if (areaBlocker) {
              areaBlocker.remove();
            }
          }, AREA_BLOCK_DELAY_MS);
        }
        // --- Ende Area Blocker ---

        if (usedExecute) {
          const executeLiIndex = Array.from(ul.children).findIndex((li) => {
            const span = li.querySelector("span:nth-child(2)");
            return (
              span &&
              span.textContent?.trim().toLowerCase() ===
                executeWeaponSelector.replace("#weapon_", "")
            );
          });
          if (executeLiIndex !== -1) {
            updateHighlight(ul, executeLiIndex);
          }
          console.log("Execute used, not advancing list index.");
        } else if (usedEviscerate) {
          const evisLiIndex = Array.from(ul.children).findIndex((li) => {
            const span = li.querySelector("span:nth-child(2)");
            return (
              span &&
              span.textContent?.trim().toLowerCase() ===
                eviscerateWeaponSelector.replace("#weapon_", "")
            );
          });
          if (evisLiIndex !== -1) {
            updateHighlight(ul, evisLiIndex);
          }
          console.log("Eviscerate used, not advancing list index yet.");
        } else if (usedTempFirst) {
          currentAttackIndex++;
          updateHighlight(ul, 0);
          console.log("Temporary First used, advancing index to 1.");
        } else {
          const indexToUse = Math.min(
            currentAttackIndex,
            ul.children.length - 1,
          );
          updateHighlight(ul, indexToUse);
          currentAttackIndex++;
        }
        updateNextAttackDisplay();
        setTimeout(() => {
          const currentAttackButton = document.getElementById(ATTACK_BUTTON_ID);
          if (currentAttackButton) {
            currentAttackButton.disabled = false;
          }
        }, ATTACK_BUTTON_DELAY_MS);
      } else {
        console.error(
          `Could not find weapon element: ${weaponToClickSelector}`,
        );
        attackButton.disabled = false;
      }
    } else {
      attackButton.disabled = false;
    }
  }

  // --- Funktion zur Verwaltung der Sichtbarkeit der Torn-Buttons am Kampfende ---
  function handleEndOfFightButtons() {
    try {
      const dialogButtonsContainer = document.querySelector(
        DIALOG_BUTTONS_SELECTOR,
      );
      if (!dialogButtonsContainer) {
        return; // Kein Button-Container, nichts zu tun
      }

      const tornButtons =
        dialogButtonsContainer.querySelectorAll("button.torn-btn");
      if (tornButtons.length === 0) {
        return; // Keine Buttons im Container
      }

      let isEndState = false;
      const lowerCaseFinishTypes = FINISH_TYPES.map((t) => t.toLowerCase());
      tornButtons.forEach((button) => {
        if (
          button.textContent &&
          lowerCaseFinishTypes.includes(button.textContent.trim().toLowerCase())
        ) {
          isEndState = true;
        }
      });

      if (!isEndState) {
        // Stelle sicher, dass alle Buttons sichtbar und klickbar sind, wenn nicht im Endzustand
        tornButtons.forEach((button) => {
          button.style.visibility = "";
          button.style.height = "";
          button.style.overflow = "";
          button.style.margin = "";
          button.style.padding = "";
          button.style.border = "";
          button.style.lineHeight = "";
          button.style.display = "";
          button.style.pointerEvents = "";
        });
        return;
      }

      // --- End State Logic ---

      if (statusFinishEnabled) {
        // Buttons sofort unsichtbar und unklickbar machen
        tornButtons.forEach((button) => {
          if (
            lowerCaseFinishTypes.includes(
              button.textContent.trim().toLowerCase(),
            )
          ) {
            button.style.visibility = "hidden";
            button.style.pointerEvents = "none";
            button.style.display = "none"; // Verhindert Layout-Sprünge
          }
        });
      } else {
        // Stelle sicher, dass alle Buttons sichtbar und klickbar sind, wenn Filterung deaktiviert
        tornButtons.forEach((button) => {
          button.style.visibility = "visible";
          button.style.pointerEvents = "auto";
          button.style.display = "";
          button.style.height = "";
          button.style.overflow = "";
          button.style.margin = "";
          button.style.padding = "";
          button.style.border = "";
          button.style.lineHeight = "";
        });
        return; // Keine weitere Verarbeitung nötig
      }

      // Sichtbarkeit basierend auf Einstellungen bestimmen (nach kurzer Verzögerung)
      const processVisibility = () => {
        let statusKey = opponentCurrentStatus;
        if (
          !opponentCurrentStatus ||
          !STATUS_TYPES.includes(opponentCurrentStatus)
        ) {
          statusKey = "Unclear";
        }
        const preferredAction = statusFinishChoices[statusKey];
        const preferredActionLower = preferredAction
          ? preferredAction.toLowerCase()
          : null;

        tornButtons.forEach((button) => {
          const buttonText = button.textContent
            ? button.textContent.trim().toLowerCase()
            : "";
          if (lowerCaseFinishTypes.includes(buttonText)) {
            let shouldBeVisible = true;
            if (
              statusFinishEnabled &&
              preferredActionLower !== null &&
              buttonText !== preferredActionLower
            ) {
              shouldBeVisible = false;
            }

            if (shouldBeVisible) {
              // Mache den/die gewünschten Button(s) sichtbar und klickbar
              button.style.visibility = "visible";
              button.style.height = "";
              button.style.overflow = "";
              button.style.margin = "";
              button.style.padding = "";
              button.style.border = "";
              button.style.lineHeight = "";
              button.style.display = "";
              button.style.pointerEvents = "auto";
            } else {
              // Behalte die anderen versteckt
              button.style.visibility = "hidden";
              button.style.height = "0px";
              button.style.overflow = "hidden";
              button.style.margin = "0px";
              button.style.padding = "0px";
              button.style.border = "none";
              button.style.lineHeight = "0px";
              button.style.display = "none";
              button.style.pointerEvents = "none";
            }
          } else {
            // Behalte Nicht-Endaktions-Buttons sichtbar
            button.style.visibility = "";
            button.style.height = "";
            button.style.overflow = "";
            button.style.margin = "";
            button.style.padding = "";
            button.style.border = "";
            button.style.lineHeight = "";
            button.style.display = "";
            button.style.pointerEvents = "auto";
          }
        });
      };

      // Wende Sichtbarkeitslogik nach kurzer Verzögerung an
      setTimeout(processVisibility, FINISH_BUTTON_PROCESS_DELAY_MS);
    } catch (error) {
      console.error("Error handling end-of-fight buttons:", error);
    }
  }

  // --- Funktion zum Hinzufügen der UI-Elemente ---
  function addAssistantUI() {
    try {
      const mainContainer = document.getElementById("mainContainer");
      const coreWrap = document.querySelector(CORE_WRAP_SELECTOR);
      const appHeader = document.querySelector(APP_HEADER_WRAPPER_SELECTOR);
      if (!mainContainer || !coreWrap || !appHeader) {
        console.error(
          "DEBUG: addAssistantUI - Missing mainContainer, coreWrap, or appHeader",
        );
        return false;
      }
      if (
        document.getElementById(SETTINGS_MODAL_ID) &&
        document.getElementById(STATUS_DISPLAY_AREA_ID)
      ) {
        return true;
      }
      console.log("Torn Attack Page Assistant: Adding UI elements.");

      // --- Settings Button hinzufügen ---
      if (!document.getElementById(SETTINGS_BUTTON_ID)) {
        const settingsButton = document.createElement("button");
        settingsButton.id = SETTINGS_BUTTON_ID;
        settingsButton.textContent = "Attack Settings";
        settingsButton.classList.add("torn-btn", "silver");
        const titleContainer = appHeader.querySelector(
          TITLE_CONTAINER_SELECTOR,
        );
        if (titleContainer) {
          titleContainer.appendChild(settingsButton);
          settingsButton.addEventListener("click", () => {
            const modal = document.getElementById(SETTINGS_MODAL_ID);
            if (modal) {
              modal.style.display = "block";
            }
          });
        } else {
          console.warn(
            "Could not find title container to append settings button.",
          );
        }
      }

      // --- Modal erstellen (falls nicht vorhanden) ---
      if (!document.getElementById(SETTINGS_MODAL_ID)) {
        createSettingsModal(mainContainer);
      }

      // --- Statusanzeigebereich erstellen (Krankenhaus + Online + Nächster Angriff) ---
      if (!document.getElementById(STATUS_DISPLAY_AREA_ID)) {
        const statusDisplayArea = document.createElement("div");
        statusDisplayArea.id = STATUS_DISPLAY_AREA_ID;
        const hospitalBox = document.createElement("div");
        hospitalBox.id = HOSPITAL_TIMER_BOX_ID;
        statusDisplayArea.appendChild(hospitalBox);
        const onlineBox = document.createElement("div");
        onlineBox.id = ONLINE_STATUS_BOX_ID;
        statusDisplayArea.appendChild(onlineBox);
        const nextAttackDisplay = document.createElement("div");
        nextAttackDisplay.id = NEXT_ATTACK_DISPLAY_ID;
        statusDisplayArea.appendChild(nextAttackDisplay);

        const logWrapper = document.querySelector(LOG_WRAP_SELECTOR);
        if (logWrapper && logWrapper.parentNode) {
          logWrapper.parentNode.insertBefore(statusDisplayArea, logWrapper);
          logWrapper.style.marginTop = "15px";
        } else {
          console.warn(
            "Could not find log wrapper to insert status display area. Appending to mainContainer.",
          );
          mainContainer.appendChild(statusDisplayArea);
        }
      }
      updateStatusFromApi();
      updateNextAttackDisplay();
      mainUiElementsAdded = true;
      return true;
    } catch (error) {
      console.error("Error adding Assistant UI:", error);
      const modalCheck = document.getElementById(SETTINGS_MODAL_ID);
      if (modalCheck) {
        modalCheck.remove();
      }
      const statusAreaCheck = document.getElementById(STATUS_DISPLAY_AREA_ID);
      if (statusAreaCheck) {
        statusAreaCheck.remove();
      }
      const nextAttackCheck = document.getElementById(NEXT_ATTACK_DISPLAY_ID);
      if (nextAttackCheck) {
        nextAttackCheck.remove();
      }
      return false;
    }
  }

  // --- Funktion zum Erstellen und Füllen des Einstellungs-Modals ---
  function createSettingsModal(appendTo) {
    const modal = document.createElement("div");
    modal.id = SETTINGS_MODAL_ID;
    const modalContent = document.createElement("div");
    modalContent.id = `${SETTINGS_MODAL_ID}-content`;
    const closeButton = document.createElement("span");
    closeButton.id = `${SETTINGS_MODAL_ID}-close`;
    closeButton.innerHTML = "&times;";
    closeButton.onclick = () => {
      modal.style.display = "none";
    };

    // Header mit Titel und API-Button
    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Attack Assistant Settings";
    const updateApiKeyButtonId = "modal-attack-assistant-update-api-key-button";
    const updateApiKeyButton = document.createElement("button");
    updateApiKeyButton.id = updateApiKeyButtonId;
    updateApiKeyButton.textContent = "Update API Key";
    updateApiKeyButton.classList.add("torn-btn", "silver");
    updateApiKeyButton.style.width = "auto";
    updateApiKeyButton.addEventListener("click", promptForApiKey);
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(updateApiKeyButton);
    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalHeader);

    // Modal Body mit Grid für 3 Spalten
    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    const column1 = document.createElement("div");
    column1.classList.add("modal-column");
    const column2 = document.createElement("div");
    column2.classList.add("modal-column");
    const column3 = document.createElement("div");
    column3.classList.add("modal-column");

    // Spalte 1: Attack Order, Show Next Attack Checkbox & Finish Choice
    const attackOrderSection = document.createElement("div");
    const listContainerInModal = document.createElement("div");
    listContainerInModal.id = `${LIST_ELEMENT_ID}-container`;
    const listTitleInModal = document.createElement("h4");
    listTitleInModal.textContent = "Attack Order";
    Object.assign(listTitleInModal.style, {
      marginTop: "0",
      marginBottom: "5px",
      borderBottom: "1px solid #555",
      paddingBottom: "5px",
    });
    listContainerInModal.appendChild(listTitleInModal);
    const listElementInModal = document.createElement("ul");
    listElementInModal.id = LIST_ELEMENT_ID;
    loadAndPopulateList(listElementInModal);
    listContainerInModal.appendChild(listElementInModal);
    attackOrderSection.appendChild(listContainerInModal);
    column1.appendChild(attackOrderSection);

    const showNextAttackBox = document.createElement("div");
    showNextAttackBox.classList.add("modal-show-next-attack-box");
    const showNextAttackLabel = document.createElement("label");
    showNextAttackLabel.id = `${SHOW_NEXT_ATTACK_CHECKBOX_ID}-label`;
    const showNextAttackCheckbox = document.createElement("input");
    showNextAttackCheckbox.type = "checkbox";
    showNextAttackCheckbox.id = SHOW_NEXT_ATTACK_CHECKBOX_ID;
    showNextAttackCheckbox.checked = showNextAttackEnabled;
    showNextAttackCheckbox.addEventListener("change", () => {
      showNextAttackEnabled = showNextAttackCheckbox.checked;
      GM_setValue(SHOW_NEXT_ATTACK_ENABLED_KEY, showNextAttackEnabled);
      console.log(
        `Show next attack display ${showNextAttackEnabled ? "enabled" : "disabled"}.`,
      );
      updateNextAttackDisplay();
    });
    showNextAttackLabel.appendChild(showNextAttackCheckbox);
    showNextAttackLabel.appendChild(
      document.createTextNode(" Show current and upcoming attack"),
    );
    showNextAttackBox.appendChild(showNextAttackLabel);
    column1.appendChild(showNextAttackBox);

    const finishChoiceBox = document.createElement("div");
    finishChoiceBox.classList.add("modal-finish-choice-box");
    const finishEnabledLabel = document.createElement("label");
    finishEnabledLabel.id = `${FINISH_CHOICE_ENABLED_CHECKBOX_ID}-label`;
    const finishEnabledCheckbox = document.createElement("input");
    finishEnabledCheckbox.type = "checkbox";
    finishEnabledCheckbox.id = FINISH_CHOICE_ENABLED_CHECKBOX_ID;
    finishEnabledCheckbox.checked = statusFinishEnabled;
    finishEnabledCheckbox.addEventListener("change", () => {
      statusFinishEnabled = finishEnabledCheckbox.checked;
      GM_setValue(STATUS_FINISH_ENABLED_KEY, statusFinishEnabled);
      console.log(
        `Status-based finish action ${statusFinishEnabled ? "enabled" : "disabled"}.`,
      );
      handleEndOfFightButtons();
    });
    finishEnabledLabel.appendChild(finishEnabledCheckbox);
    finishEnabledLabel.appendChild(
      document.createTextNode(" Use Status-Based Finish Action"),
    );
    finishChoiceBox.appendChild(finishEnabledLabel);
    const matrixTableInModal = document.createElement("table");
    matrixTableInModal.classList.add("finish-choice-matrix");
    const theadInModal = matrixTableInModal.createTHead();
    const headerRowInModal = theadInModal.insertRow();
    headerRowInModal.insertCell().textContent = "Status";
    FINISH_TYPES.forEach((finishType) => {
      const th = document.createElement("th");
      th.textContent = finishType;
      th.title = finishType;
      headerRowInModal.appendChild(th);
    });
    const tbodyInModal = matrixTableInModal.createTBody();
    STATUS_TYPES.forEach((statusType) => {
      const row = tbodyInModal.insertRow();
      row.insertCell().textContent = statusType;
      FINISH_TYPES.forEach((finishType) => {
        const cell = row.insertCell();
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `modal-finish-${statusType.toLowerCase()}`;
        radio.value = finishType;
        radio.title = `${statusType} -> ${finishType}`;
        if (
          statusFinishChoices[statusType] &&
          statusFinishChoices[statusType].toLowerCase() ===
            finishType.toLowerCase()
        ) {
          radio.checked = true;
        }
        radio.addEventListener("change", (event) => {
          if (event.target.checked) {
            statusFinishChoices[statusType] = event.target.value;
            GM_setValue(STATUS_FINISH_CHOICES_KEY, statusFinishChoices);
            console.log(
              `Finish choice for ${statusType} set to: ${event.target.value}`,
            );
            handleEndOfFightButtons();
          }
        });
        cell.appendChild(radio);
      });
    });
    finishChoiceBox.appendChild(matrixTableInModal);
    column1.appendChild(finishChoiceBox);

    // Spalte 2: Attack Controls
    const attackControlsBox = document.createElement("div");
    attackControlsBox.classList.add("modal-attack-controls-box");
    const attackButtonsContainerInModal = document.createElement("div");
    attackButtonsContainerInModal.classList.add(
      "modal-attack-buttons-container",
    );
    ATTACK_TYPES.forEach((attackType) => {
      const button = document.createElement("button");
      button.textContent = attackType;
      button.classList.add("torn-btn", "silver", "attack-order-add-button");
      button.addEventListener("click", () => {
        const ul = document.getElementById(LIST_ELEMENT_ID);
        if (ul) {
          if (ul.children.length < MAX_LIST_ITEMS) {
            const currentItemCount = ul.children.length;
            const newItem = createAttackListItem(
              currentItemCount + 1,
              attackType,
            );
            ul.appendChild(newItem);
            ul.scrollTop = ul.scrollHeight;
            saveListState(ul);
            updateHighlight(ul, currentAttackIndex);
            updateNextAttackDisplay();
          } else {
            console.log(`Attack Order list limit (${MAX_LIST_ITEMS}) reached.`);
          }
        }
      });
      attackButtonsContainerInModal.appendChild(button);
    });
    attackControlsBox.appendChild(attackButtonsContainerInModal);
    const resetButtonId = "modal-attack-assistant-reset-button";
    const resetButton = document.createElement("button");
    resetButton.id = resetButtonId;
    resetButton.textContent = "Reset List";
    resetButton.classList.add("torn-btn", "silver");
    resetButton.style.marginTop = LARGE_BUTTON_GAP;
    resetButton.addEventListener("click", () => {
      const ul = document.getElementById(LIST_ELEMENT_ID);
      if (ul) {
        ul.innerHTML = "";
        saveListState(ul);
        currentAttackIndex = 0;
        updateHighlight(ul, currentAttackIndex);
        console.log("Attack Order list cleared and index reset.");
        updateNextAttackDisplay();
      }
    });
    attackControlsBox.appendChild(resetButton);
    column2.appendChild(attackControlsBox);

    // Spalte 3: Special Attacks
    const specialAttacksBox = document.createElement("div");
    specialAttacksBox.classList.add("modal-special-attacks-box");
    const tempFirstBox = document.createElement("div");
    tempFirstBox.id = TEMP_FIRST_BOX_ID;
    const tempFirstLabel = document.createElement("label");
    const tempFirstCheckbox = document.createElement("input");
    tempFirstCheckbox.type = "checkbox";
    tempFirstCheckbox.id = TEMP_FIRST_CHECKBOX_ID;
    tempFirstCheckbox.checked = tempFirstEnabled;
    Object.assign(tempFirstCheckbox.style, {
      marginRight: "5px",
      verticalAlign: "middle",
    });
    tempFirstLabel.appendChild(tempFirstCheckbox);
    tempFirstLabel.appendChild(document.createTextNode(" Temporary First"));
    Object.assign(tempFirstLabel.style, {
      display: "block",
      marginBottom: "0px",
      cursor: "pointer",
      fontWeight: "bold",
    });
    tempFirstCheckbox.addEventListener("change", () => {
      tempFirstEnabled = tempFirstCheckbox.checked;
      GM_setValue(TEMP_FIRST_ENABLED_KEY, tempFirstEnabled);
      console.log(
        `Temporary First feature ${tempFirstEnabled ? "enabled" : "disabled"}.`,
      );
      updateNextAttackDisplay();
    });
    tempFirstBox.appendChild(tempFirstLabel);
    specialAttacksBox.appendChild(tempFirstBox);
    const executeBox = document.createElement("div");
    executeBox.id = EXECUTE_BOX_ID;
    const executeLabel = document.createElement("label");
    const executeCheckbox = document.createElement("input");
    executeCheckbox.type = "checkbox";
    executeCheckbox.id = EXECUTE_CHECKBOX_ID;
    executeCheckbox.checked = executeEnabled;
    Object.assign(executeCheckbox.style, {
      marginRight: "5px",
      verticalAlign: "middle",
    });
    executeLabel.appendChild(executeCheckbox);
    executeLabel.appendChild(document.createTextNode(" Execute"));
    Object.assign(executeLabel.style, {
      display: "block",
      marginBottom: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    });
    executeCheckbox.addEventListener("change", () => {
      executeEnabled = executeCheckbox.checked;
      GM_setValue(EXECUTE_ENABLED_KEY, executeEnabled);
      console.log(
        `Execute feature ${executeEnabled ? "enabled" : "disabled"}.`,
      );
      if (isFightStarted()) {
        if (executeEnabled && executeWeaponSelector) {
          startOpponentLifeObserver();
        } else {
          stopOpponentLifeObserver();
        }
      } else {
        stopOpponentLifeObserver();
      }
      updateNextAttackDisplay();
    });
    executeBox.appendChild(executeLabel);
    const sliderContainer = document.createElement("div");
    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = EXECUTE_SLIDER_ID;
    slider.min = "15";
    slider.max = "30";
    slider.step = "1";
    slider.value = executeThreshold;
    Object.assign(slider.style, {
      width: "calc(100% - 45px)",
      verticalAlign: "middle",
    });
    const valueDisplay = document.createElement("span");
    valueDisplay.id = EXECUTE_VALUE_ID;
    valueDisplay.textContent = `${executeThreshold}%`;
    Object.assign(valueDisplay.style, {
      display: "inline-block",
      width: "40px",
      textAlign: "right",
      fontWeight: "bold",
      verticalAlign: "middle",
    });
    slider.addEventListener("input", () => {
      executeThreshold = parseInt(slider.value, 10);
      valueDisplay.textContent = `${executeThreshold}%`;
      checkOpponentHealth();
      updateNextAttackDisplay();
    });
    slider.addEventListener("change", () => {
      GM_setValue(EXECUTE_THRESHOLD_KEY, executeThreshold);
      console.log(`Execute threshold saved: ${executeThreshold}%`);
      checkOpponentHealth();
      updateNextAttackDisplay();
    });
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    executeBox.appendChild(sliderContainer);
    specialAttacksBox.appendChild(executeBox);
    const eviscerateBox = document.createElement("div");
    eviscerateBox.id = EVISCERATE_BOX_ID;
    const eviscerateLabel = document.createElement("label");
    const eviscerateCheckbox = document.createElement("input");
    eviscerateCheckbox.type = "checkbox";
    eviscerateCheckbox.id = EVISCERATE_CHECKBOX_ID;
    eviscerateCheckbox.checked = eviscerateEnabled;
    Object.assign(eviscerateCheckbox.style, {
      marginRight: "5px",
      verticalAlign: "middle",
    });
    eviscerateLabel.appendChild(eviscerateCheckbox);
    eviscerateLabel.appendChild(document.createTextNode(" Eviscerate"));
    Object.assign(eviscerateLabel.style, {
      display: "block",
      marginBottom: "0px",
      cursor: "pointer",
      fontWeight: "bold",
    });
    eviscerateCheckbox.addEventListener("change", () => {
      eviscerateEnabled = eviscerateCheckbox.checked;
      GM_setValue(EVISCERATE_ENABLED_KEY, eviscerateEnabled);
      console.log(
        `Eviscerate feature ${eviscerateEnabled ? "enabled" : "disabled"}.`,
      );
      updateNextAttackDisplay();
    });
    eviscerateBox.appendChild(eviscerateLabel);
    specialAttacksBox.appendChild(eviscerateBox);
    column3.appendChild(specialAttacksBox);

    modalBody.appendChild(column1);
    modalBody.appendChild(column2);
    modalBody.appendChild(column3);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    appendTo.appendChild(modal);
  }

  // --- Function to fetch API data and update UI elements ---
  function updateStatusFromApi() {
    const targetUserID = getTargetUserID();
    if (targetUserID && userApiKey) {
      fetchTargetStatus(targetUserID, (statusInfo) => {
        const currentTimerBox = document.getElementById(HOSPITAL_TIMER_BOX_ID);
        const currentStatusBox = document.getElementById(ONLINE_STATUS_BOX_ID);
        if (statusInfo) {
          opponentCurrentStatus = statusInfo.lastActionStatus;
          if (currentTimerBox) {
            if (statusInfo.releaseTimestamp) {
              createOrUpdateHospitalTimer(
                currentTimerBox,
                statusInfo.releaseTimestamp,
              );
            } else {
              displayNotInHospital(currentTimerBox);
            }
          }
          if (currentStatusBox) {
            updateOnlineStatusBox(
              currentStatusBox,
              statusInfo.lastActionStatus,
              statusInfo.lastActionRelative,
            );
          }
        } else {
          opponentCurrentStatus = null;
          if (currentTimerBox) {
            displayNotInHospital(currentTimerBox);
          }
          if (currentStatusBox) {
            updateOnlineStatusBox(currentStatusBox, null, null);
          }
        }
      });
    } else {
      opponentCurrentStatus = null;
      const currentTimerBox = document.getElementById(HOSPITAL_TIMER_BOX_ID);
      if (currentTimerBox) {
        displayNotInHospital(currentTimerBox);
      }
      const currentStatusBox = document.getElementById(ONLINE_STATUS_BOX_ID);
      if (currentStatusBox) {
        updateOnlineStatusBox(currentStatusBox, null, null);
      }
    }
  }

  // --- Funktion zur Aktualisierung der "Nächster Angriff"-Anzeige ---
  function updateNextAttackDisplay() {
    const displayArea = document.getElementById(NEXT_ATTACK_DISPLAY_ID);
    if (!displayArea) return;

    if (!showNextAttackEnabled || !isFightStarted()) {
      displayArea.style.display = "none";
      return;
    }

    displayArea.style.display = "flex"; // Sicherstellen, dass es sichtbar ist

    const ul = document.getElementById(LIST_ELEMENT_ID);
    const attackerArea = document.querySelector(ATTACKER_PLAYER_AREA_SELECTOR);
    let nextAttackText = "N/A";

    if (attackerArea) {
      const opponentHasEviscerateIcon = hasOpponentEviscerateIcon();
      const tempWeaponElement = attackerArea.querySelector("#weapon_temp");
      const tempWeaponAvailable =
        tempWeaponElement && tempWeaponElement.querySelector("img");

      // Logik zur Bestimmung des nächsten Angriffs
      if (tempFirstEnabled && currentAttackIndex === 0 && tempWeaponAvailable) {
        nextAttackText = "Temporary";
      } else if (
        executeEnabled &&
        executeWeaponSelector &&
        opponentBelowExecuteThreshold
      ) {
        nextAttackText = `Execute (${executeWeaponSelector.replace("#weapon_", "")})`;
      } else if (
        eviscerateEnabled &&
        eviscerateWeaponSelector &&
        !opponentHasEviscerateIcon
      ) {
        nextAttackText = `Eviscerate (${eviscerateWeaponSelector.replace("#weapon_", "")})`;
      } else if (ul && ul.children.length > 0) {
        const listIndex = currentAttackIndex % ul.children.length; // Modulo für Wiederholung
        const nextAttackItem = ul.children[listIndex];
        if (nextAttackItem) {
          const nextAttackTypeSpan =
            nextAttackItem.querySelector("span:nth-child(2)");
          nextAttackText = nextAttackTypeSpan
            ? nextAttackTypeSpan.textContent.trim()
            : "Error";
        } else {
          nextAttackText = "Error"; // Sollte nicht passieren
        }
      } else {
        nextAttackText = "No Attacks"; // Wenn Liste leer ist
      }
    }

    // Formatierung der Waffennamen für die Anzeige
    const formatWeaponName = (name) => {
      if (!name) return "N/A";
      switch (name.toLowerCase()) {
        case "main":
          return "Primary";
        case "second":
          return "Secondary";
        case "melee":
          return "Melee";
        case "temp":
          return "Temporary";
        case "fists":
          return "Fist";
        case "boots":
          return "Kick";
        default:
          return name.charAt(0).toUpperCase() + name.slice(1); // Standard-Formatierung
      }
    };

    displayArea.innerHTML = `
            <span class="next-attack-label">Last:</span>
            <span class="next-attack-value">${formatWeaponName(lastAttackUsed)}</span>
            <span class="next-attack-label" style="margin-left: 15px;">Next:</span>
            <span class="next-attack-value">${nextAttackText}</span>
        `;
  }

  // --- Initial Setup ---
  loadSettings();

  // --- Observer and Initial Call Logic ---
  let uiAdded = false;
  let attackButtonAdded = false;
  let observerDebounceTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(observerDebounceTimer);
    observerDebounceTimer = setTimeout(() => {
      try {
        if (!uiAdded) {
          const coreWrap = document.querySelector(CORE_WRAP_SELECTOR);
          const playerAreaElement = coreWrap
            ? coreWrap.querySelector(ATTACKER_PLAYER_AREA_SELECTOR)
            : null;
          if (
            coreWrap &&
            playerAreaElement &&
            coreWrap.offsetWidth > 0 &&
            playerAreaElement.offsetHeight > 0
          ) {
            if (addAssistantUI()) {
              uiAdded = true;
            }
          }
        }
        addRefreshButton();
        const fightHasStarted = isFightStarted();
        if (uiAdded) {
          const existingAttackButton =
            document.getElementById(ATTACK_BUTTON_ID);
          const opponentModelWrap = document.querySelector(
            OPPONENT_MODEL_WRAP_SELECTOR,
          );

          if (fightHasStarted && !existingAttackButton && !attackButtonAdded) {
            if (addAttackButton()) {
              attackButtonAdded = true;
              executeWeaponSelector = findExecuteWeapon();
              eviscerateWeaponSelector = findEviscerateWeapon();
              if (executeEnabled && executeWeaponSelector) {
                startOpponentLifeObserver();
              }
              lastAttackUsed = null;
              updateNextAttackDisplay();
            }
          } else if (!fightHasStarted && existingAttackButton) {
            existingAttackButton.remove();
            attackButtonAdded = false;
            currentAttackIndex = 0;
            executeWeaponSelector = null;
            eviscerateWeaponSelector = null;
            stopOpponentLifeObserver();
            opponentBelowExecuteThreshold = false;
            const ul = document.getElementById(LIST_ELEMENT_ID);
            if (ul) {
              updateHighlight(ul, currentAttackIndex);
            }
            if (opponentModelWrap) {
              opponentModelWrap.style.position = "";
            }
            lastAttackUsed = null;
            updateNextAttackDisplay();
            // Remove area blocker if fight ends
            const areaBlocker = document.getElementById(AREA_BLOCKER_ID);
            if (areaBlocker) areaBlocker.remove();
          } else if (fightHasStarted && existingAttackButton) {
            attackButtonAdded = true;
            if (
              executeEnabled &&
              executeWeaponSelector &&
              !opponentLifeObserver
            ) {
              startOpponentLifeObserver();
            }
            updateNextAttackDisplay();
          } else if (!fightHasStarted) {
            updateNextAttackDisplay();
            // Remove area blocker if fight ends (double check)
            const areaBlocker = document.getElementById(AREA_BLOCKER_ID);
            if (areaBlocker) areaBlocker.remove();
          }
        }
        handleEndOfFightButtons();
      } catch (error) {
        console.error("Error inside observer callback:", error);
      }
    }, OBSERVER_DEBOUNCE_MS);
  });
  const targetNode = document.getElementById("react-root") || document.body;
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log("Observer started.");
  } else {
    console.error(
      "Torn Attack Page Assistant: Target node for MutationObserver not found.",
    );
  }
  setTimeout(() => {
    try {
      if (!uiAdded) {
        const coreWrap = document.querySelector(CORE_WRAP_SELECTOR);
        const playerAreaElement = coreWrap
          ? coreWrap.querySelector(ATTACKER_PLAYER_AREA_SELECTOR)
          : null;
        if (
          coreWrap &&
          playerAreaElement &&
          coreWrap.offsetWidth > 0 &&
          playerAreaElement.offsetHeight > 0
        ) {
          if (addAssistantUI()) {
            uiAdded = true;
          }
        }
      }
      addRefreshButton();
      if (uiAdded && !attackButtonAdded) {
        const fightHasStarted = isFightStarted();
        if (fightStarted) {
          if (addAttackButton()) {
            attackButtonAdded = true;
            executeWeaponSelector = findExecuteWeapon();
            eviscerateWeaponSelector = findEviscerateWeapon();
            if (executeEnabled && executeWeaponSelector) {
              startOpponentLifeObserver();
            }
          }
        }
      }
      handleEndOfFightButtons();
      updateNextAttackDisplay(); /* Initial check */
    } catch (error) {
      console.error("Error during initial UI checks:", error);
    }
  }, 1000);
})(); // End of IIFE
