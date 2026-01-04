// ==UserScript==
// @name        BePo Personalbeschaffer V.2
// @namespace   bos-ernie.leitstellenspiel.de
// @version     2.0
// @license     BSD-3-Clause
// @author      BOS-Ernie (Original), Verändert durch KI
// @description Rekrutiert sequenziell Personal per Hotkey [S]. Hotkey [X] für "Personal übernehmen". Gesamtziel, Filter, Mindestbestände, Stationslimit konfigurierbar.
// @match       https://www.leitstellenspiel.de/buildings/*/hire
// @match       https://polizei.leitstellenspiel.de/buildings/*/hire
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// @resource    https://forum.leitstellenspiel.de/index.php?thread/24767-script-vorschau-bepo-personalbeschaffer-by-bos-ernie/
// @downloadURL https://update.greasyfork.org/scripts/537475/BePo%20Personalbeschaffer%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/537475/BePo%20Personalbeschaffer%20V2.meta.js
// ==/UserScript==

/* global $, loadedBuildings */

(function () {
  "use strict";

  // --- KONFIGURIERBARE KONSTANTEN ---
  const TOTAL_UNSKILLED_PERSONNEL_TARGET = 2;    // Ziel-Gesamtzahl für unausgebildetes Personal.
  const MIN_PERSONNEL_REMAINING_ON_STATION = 300;  // Mindestpersonal, das pro Wache verbleiben muss.
  const MAX_PERSONNEL_TO_TAKE_PER_STATION = 50;   // Maximale Entnahme pro Wache und Rekrutierungslauf.
  const STATION_NAME_EXCLUSION_KEYWORDS = ["Bereitschaft"]; // Wachen mit diesen Namensteilen werden ignoriert.
  const TARGET_PERSONNEL_TYPE_KEY = null;         // Interner Key für Ziel-Personalart (null = "Ohne Ausbildung").
  const TARGET_PERSONNEL_CAPTION = "Ohne Ausbildung"; // Anzeigename für Ziel-Personalart.
  const HOTKEY_TO_START_RECRUITMENT = "s";        // Hotkey (ein Buchstabe) zum Starten der Rekrutierung.
  const HOTKEY_FOR_GAME_SUBMIT_BUTTON = "x";      // Hotkey (ein Buchstabe) für "Personal übernehmen"-Button.
  const NOTIFICATION_DURATION = 5000;             // Anzeigedauer der Abschlussmeldung in Millisekunden.
  // --- ENDE KONFIGURIERBARE KONSTANTEN ---

  const GLOBAL_RECRUIT_BUTTON_ID = "global-recruit-button";
  const LOG_PREFIX = "[BePo PrioSeriellV571] ";

  const DELAY_AFTER_AJAX_LOAD = 20;
  const DELAY_PER_SKILLED_CLICK = 10;
  const DELAY_AFTER_STATION_PROCESSED = 10;

  const personnelSettingsInternal = [
    { caption: TARGET_PERSONNEL_CAPTION, key: TARGET_PERSONNEL_TYPE_KEY, numberOfRequiredPersonnel: TOTAL_UNSKILLED_PERSONNEL_TARGET, numberOfSelectedPersonnel: 0, },
    { caption: "Hundeführer (Schutzhund)", key: "k9", numberOfRequiredPersonnel: 0, numberOfSelectedPersonnel: 0 },
    { caption: "Hundertschaftsführer (FüKw)", key: "police_fukw", numberOfRequiredPersonnel: 0, numberOfSelectedPersonnel: 0 },
    { caption: "MEK", key: "police_mek", numberOfRequiredPersonnel: 0, numberOfSelectedPersonnel: 0 },
    { caption: "SEK", key: "police_sek", numberOfRequiredPersonnel: 0, numberOfSelectedPersonnel: 0 },
    { caption: "Wasserwerfer", key: "police_wasserwerfer", numberOfRequiredPersonnel: 0, numberOfSelectedPersonnel: 0 },
    { caption: "Zugführer (leBefKw)", key: "police_einsatzleiter", numberOfRequiredPersonnel: 0, numberOfSelectedPersonnel: 0 },
  ];

  const personnelSettingsProxy = personnelSettingsInternal.map(setting => {
    return new Proxy(setting, {
      set: function (target, key, value) {
        target[key] = value;
        if (key === "numberOfSelectedPersonnel") updateFooter(target.key, target.numberOfSelectedPersonnel);
        return true;
      },
    });
  });

  function initPanelBodies() { const elements = document.getElementsByClassName("panel-body"); for (let i = 0; i < elements.length; i++) elements[i].classList.add("hidden"); };
  function removePanelHeadingClickEvent() { const elements = document.getElementsByClassName("personal-select-heading"); for (let i = 0; i < elements.length; i++) { const clone = elements[i].cloneNode(true); elements[i].parentNode.replaceChild(clone, elements[i]); clone.addEventListener("click", panelHeadingClickEvent); } };
  function addFooter() {
    const wrapper = document.createElement("div"); wrapper.style = "display: flex; flex-wrap: wrap; flex-direction: row; column-gap: 15px; align-items: center;";
    const list = document.createElement("ul"); list.classList.add("list-inline"); list.style = "color: #fff;padding-top: 8px; margin-bottom: 0;";
    for (let i = 0; i < personnelSettingsProxy.length; i++) list.appendChild(createTotalSummaryElement(personnelSettingsProxy[i]));
    wrapper.appendChild(list);
    const globalRecruitButton = document.createElement("button"); globalRecruitButton.setAttribute("id", GLOBAL_RECRUIT_BUTTON_ID); globalRecruitButton.classList.add("btn", "btn-xs", "btn-info"); globalRecruitButton.style.marginLeft = "20px";
    const hotkeyRecruitDisplay = HOTKEY_TO_START_RECRUITMENT.toUpperCase();
    globalRecruitButton.innerHTML = `<span class="glyphicon glyphicon-user"></span> Rekrutierung (Limit) [${hotkeyRecruitDisplay}]`;
    globalRecruitButton.addEventListener("click", startGlobalRecruitment);
    wrapper.appendChild(globalRecruitButton);
    const nav = document.querySelector(".navbar.navbar-default.navbar-fixed-bottom");
    if (nav && nav.children[0] && nav.children[0].children[0]) nav.children[0].children[0].insertAdjacentElement("afterend", wrapper);
    else console.error(LOG_PREFIX + "Konnte Footer-Navigation nicht finden.");
  };
  function updateFooter(key, selectedPersonnel) { const selectedElement = document.getElementById("number-of-selected-personnel-" + key); if (selectedElement) selectedElement.innerHTML = selectedPersonnel; const S = personnelSettingsProxy.find(s => s.key === key); if (!S) return; const R = S.numberOfRequiredPersonnel; const C = selectedPersonnel >= R ? "label-success" : (selectedPersonnel > 0 ? "label-warning" : "label-danger"); const D = selectedPersonnel >= R ? "label-success" : "label-warning"; const P = document.getElementById("personnel-" + key); if (P) { P.classList.remove("label-success", "label-warning", "label-danger", "label-default"); P.classList.add(R > 0 ? C : (R === 0 && selectedPersonnel === 0 ? "label-default" : D)); } };
  function addClickEventHandlerToCheckboxes() { const E = document.getElementsByClassName("schooling_checkbox"); for (let i = 0; i < E.length; i++) { E[i].removeEventListener("change", updateNumberOfSelectedPersonnelOnCheckboxClick); E[i].addEventListener("change", updateNumberOfSelectedPersonnelOnCheckboxClick); } };
  function updateNumberOfSelectedPersonnelOnCheckboxClick(event) { const C_ = event.target; let K = null; for (const S_ of personnelSettingsInternal) if (S_.key && C_.hasAttribute(S_.key) && C_.getAttribute(S_.key) === "true") { K = S_.key; break; } if(K === null){ const isUnskilled = !Object.values(C_.attributes).some(attr => personnelSettingsInternal.find(s_ => s_.key === attr.name && s_.key !== null) && attr.value === "true"); if(isUnskilled) K = null;} const U = personnelSettingsProxy.find(s => s.key === K); if (U) U.numberOfSelectedPersonnel += C_.checked ? 1 : -1; };
  function addPersonnelSelector() { let E = document.getElementsByClassName("panel-heading personal-select-heading"); for (let i = 0; i < E.length; i++) { const L = E[i], B = L.getAttribute("building_id"), O = L.querySelector(".btn-group.bepo-controls"); if (O) O.remove(); const G = createPersonnelSelectorButtons(B), R_ = L.querySelector('span[style="float:right"]'); if (R_) R_.prepend(G); else { const N = document.createElement('span'); N.style.float = "right"; N.appendChild(G); const F = L.querySelector('span:not([style="float:right"])'); if (F && F.nextSibling) L.insertBefore(N, F.nextSibling); else L.appendChild(N); } } };
  function createPersonnelSelectorButtons(B) { const G = document.createElement("div"); G.classList.add("btn-group", "btn-group-xs", "bepo-controls"); G.setAttribute("role", "group"); const T = document.createElement("span"); T.classList.add("glyphicon", "glyphicon-trash"); const R_ = document.createElement("button"); R_.classList.add("btn", "btn-xs", "btn-default", "personnel-reset-button"); R_.setAttribute("type", "button"); R_.setAttribute("data-building-id", B); R_.addEventListener("click", resetPersonnelClick); R_.appendChild(T); G.appendChild(R_); const S_ = document.createElement("span"); S_.setAttribute("id", `personnel-status-${B}`); S_.classList.add("label", "label-info"); S_.style.marginLeft = "5px"; S_.style.padding = "4px 6px"; S_.textContent = "0"; G.appendChild(S_); return G; };
  function createTotalSummaryElement(s) { const l = document.createElement("li"), c = document.createElement("span"); c.innerHTML = s.caption + ": "; const S_ = document.createElement("span"); S_.setAttribute("id", "number-of-selected-personnel-" + s.key); S_.innerHTML = s.numberOfSelectedPersonnel; const R__ = document.createElement("span"); R__.setAttribute("id", "number-of-required-personnel-" + s.key); R__.innerHTML = s.numberOfRequiredPersonnel; const P_ = document.createElement("span"); P_.setAttribute("id", "personnel-" + s.key); P_.classList.add("label"); if (s.numberOfRequiredPersonnel > 0) P_.classList.add(s.numberOfSelectedPersonnel >= s.numberOfRequiredPersonnel ? "label-success" : (s.numberOfSelectedPersonnel > 0 ? "label-warning" : "label-danger")); else P_.classList.add("label-default"); P_.appendChild(S_); P_.appendChild(document.createTextNode("/")); P_.appendChild(R__); l.appendChild(c); l.appendChild(P_); return l; };
  async function resetPersonnelClick(event) { event.preventDefault(); const b = event.target.closest("button"), B_ = b.dataset.buildingId; console.log(LOG_PREFIX + `Starte Reset für Wache ${B_}`); const P_ = getPanelBody(B_); if (!P_) return; const H = getPanelHeading(B_), M = H?.outerHTML.match(/href="([^"]+)"/); if (M && !loadedBuildings.includes(M[1])) await panelHeadingClick(B_, false); const I = P_.querySelectorAll("input.schooling_checkbox:checked"); for (const c_ of I) c_.click(); updateWacheStatus(B_, 0); };
  function updateWacheStatus(B_, c_) { const s_ = document.getElementById(`personnel-status-${B_}`); if (s_) { s_.textContent = `${c_}`; s_.classList.toggle("label-success", c_ > 0); s_.classList.toggle("label-info", c_ === 0); } };
  async function panelHeadingClickEvent(event) { if (event.target.closest(".personnel-reset-button")) return; let b_ = event.target.outerHTML.match(/building_id="(\d+)"/); if (b_ === null && event.target.parentElement) { let c_ = event.target.parentElement; while (c_ && !b_) { if (c_.getAttribute("building_id")) { b_ = ["", c_.getAttribute("building_id")]; break; } c_ = c_.parentElement; } } if (b_ && b_[1]) await panelHeadingClick(b_[1], true); };
  function togglePanelBody(p_) { p_.classList.toggle("hidden"); };
  function showPanelBody(p_) { p_.classList.remove("hidden"); };
  function getPanelHeading(B_) { return document.querySelector(`.personal-select-heading[building_id='${B_}']`); };
  function getPanelBody(B_) { return document.querySelector(`.panel-body[building_id='${B_}']`); };
  function hidePanelBody(p_) { p_.classList.add("hidden"); };

  async function panelHeadingClick(buildingId, toggle = false) {
    const panelHeading = getPanelHeading(buildingId); const panelBody = getPanelBody(buildingId);
    if (!panelHeading || !panelBody) return;
    const hrefMatch = panelHeading.outerHTML.match(/href="([^"]+)"/); if (!hrefMatch) return;
    const href = hrefMatch[1];
    if (loadedBuildings.includes(href)) {
      if (toggle) togglePanelBody(panelBody);
      else if (panelBody.classList.contains("hidden")) showPanelBody(panelBody);
      return;
    }
    // console.log(LOG_PREFIX + `Lade Daten für Wache ${buildingId} von ${href}`);
    panelBody.innerHTML = '<img src="/images/ajax-loader.gif" class="ajaxLoader" style="display:block; margin:10px auto;">';
    showPanelBody(panelBody);
    loadedBuildings.push(href);
    try {
        const data = await $.get(href); panelBody.innerHTML = data;
        const schoolingSelectAvailableButtons = panelBody.getElementsByClassName("schooling_select_available");
        while (schoolingSelectAvailableButtons.length > 0) schoolingSelectAvailableButtons[0].parentElement.remove();
        addClickEventHandlerToCheckboxes(); // console.log(LOG_PREFIX + `Daten für Wache ${buildingId} geladen.`);
    } catch (error) { console.error(LOG_PREFIX + `Fehler Laden Personaldaten Wache ${buildingId}:`, error); panelBody.innerHTML = `<p style="color:red;">Fehler Laden Personaldaten.</p>`;}
  };

  async function recruitUnskilledFromStation(panelBodyElement, amountToTarget) {
    if (!panelBodyElement || amountToTarget <= 0) return 0; let recruitedCount = 0;
    const personnelRows = panelBodyElement.querySelectorAll("tbody > tr");
    for (const row of personnelRows) {
      if (recruitedCount >= amountToTarget) break;
      const checkbox = row.querySelector("input.schooling_checkbox");
      if (!checkbox || checkbox.checked) continue;
      let isTrulyUnskilled = true; const inputAttributes = checkbox.attributes;
      for(let i = 0; i < inputAttributes.length; i++){ const attr = inputAttributes[i]; if (!attr.name.startsWith("data-") && attr.name !== "building_id" && attr.name !== "class" && attr.name !== "type" && attr.name !== "value" && attr.name !== "id" && attr.value === "true"){ isTrulyUnskilled = false; break; } }
      const schoolingCell = row.cells[2];
      if (schoolingCell) { const schoolingCellContent = schoolingCell.innerHTML.replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim(); if (schoolingCellContent.length > 0 && schoolingCellContent !== "-" && schoolingCellContent.toLowerCase() !== "keine") isTrulyUnskilled = false; }
      else isTrulyUnskilled = false;
      if (isTrulyUnskilled) { checkbox.click(); recruitedCount++; if (DELAY_PER_SKILLED_CLICK > 0) await new Promise(resolve => setTimeout(resolve, DELAY_PER_SKILLED_CLICK)); }
    }
    return recruitedCount;
  };

  function showTemporaryNotification(message, type = 'success', duration = NOTIFICATION_DURATION) {
    const notificationId = 'temporary-script-notification';
    document.getElementById(notificationId)?.remove();
    const notificationDiv = document.createElement('div');
    notificationDiv.setAttribute('id', notificationId);
    notificationDiv.style.position = 'fixed'; notificationDiv.style.top = '20px'; notificationDiv.style.left = '50%';
    notificationDiv.style.transform = 'translateX(-50%)'; notificationDiv.style.padding = '12px 20px';
    notificationDiv.style.borderRadius = '5px'; notificationDiv.style.color = 'white';
    notificationDiv.style.zIndex = '10001'; notificationDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notificationDiv.style.opacity = '0'; notificationDiv.style.transition = 'opacity 0.5s ease-in-out';
    notificationDiv.style.textAlign = 'center'; notificationDiv.style.fontSize = '14px';
    if (type === 'success') notificationDiv.style.backgroundColor = '#4CAF50';
    else if (type === 'error') notificationDiv.style.backgroundColor = '#f44336';
    else notificationDiv.style.backgroundColor = '#2196F3';
    notificationDiv.innerHTML = message.replace(/\n/g, '<br>');
    document.body.appendChild(notificationDiv);
    setTimeout(() => { notificationDiv.style.opacity = '1'; }, 10);
    setTimeout(() => { notificationDiv.style.opacity = '0'; setTimeout(() => { notificationDiv.remove(); }, 500); }, duration - 500);
  }

  async function startGlobalRecruitment() {
    const globalButton = document.getElementById(GLOBAL_RECRUIT_BUTTON_ID);
    globalButton.disabled = true;
    globalButton.innerHTML = '<span class="glyphicon glyphicon-hourglass"></span> Rekrutiere...'; // Angepasster Text
    console.log(LOG_PREFIX + "Start: Priorisierte serielle Rekrutierung.");
    // console.log(LOG_PREFIX + `Maximal ${MAX_PERSONNEL_TO_TAKE_PER_STATION} pro Wache.`); // Weniger redundante Logs

    const targetSetting = personnelSettingsProxy.find(s => s.key === TARGET_PERSONNEL_TYPE_KEY);
    if (!targetSetting || targetSetting.numberOfRequiredPersonnel <= 0) {
      showTemporaryNotification(`Kein Bedarf für "${TARGET_PERSONNEL_CAPTION}" (Soll: ${targetSetting ? targetSetting.numberOfRequiredPersonnel : 'N/A'}) definiert.`, 'error');
      globalButton.disabled = false;
      globalButton.innerHTML = `<span class="glyphicon glyphicon-user"></span> Rekrutierung (Limit) [${HOTKEY_TO_START_RECRUITMENT.toUpperCase()}]`;
      return;
    }
    // console.log(LOG_PREFIX + `Globaler Bedarf "${TARGET_PERSONNEL_CAPTION}": ${targetSetting.numberOfRequiredPersonnel}`);

    targetSetting.numberOfSelectedPersonnel = 0;
    document.querySelectorAll(`[id^="personnel-status-"]`).forEach(span => {
        const bid = span.id.replace("personnel-status-", "");
        updateWacheStatus(bid, 0);
    });

    const allPanelHeadings = document.querySelectorAll(".panel-heading.personal-select-heading");
    if (allPanelHeadings.length === 0) {
        showTemporaryNotification("Keine Wachen-Panels gefunden.", 'error');
        globalButton.disabled = false;
        globalButton.innerHTML = `<span class="glyphicon glyphicon-user"></span> Rekrutierung (Limit) [${HOTKEY_TO_START_RECRUITMENT.toUpperCase()}]`;
        return;
    }

    let stationInfoList = [];
    for (const panelHeading of allPanelHeadings) {
        const buildingId = panelHeading.getAttribute("building_id");
        if (!buildingId) continue;
        const stationNameElement = panelHeading.querySelector('span:not([style="float:right"])');
        const stationName = stationNameElement ? stationNameElement.textContent.trim() : "Unbekannter Name";
        let stationTotalPersonnel = 0;
        const headingText = panelHeading.innerText || panelHeading.textContent || "";
        const matchTotalPersonnel = headingText.match(/Derzeit:\s*(\d+)/);
        if (matchTotalPersonnel && matchTotalPersonnel[1]) {
            stationTotalPersonnel = parseInt(matchTotalPersonnel[1], 10);
        }
        stationInfoList.push({ buildingId, stationName, stationTotalPersonnel, panelHeadingElement: panelHeading });
    }

    stationInfoList.sort((a, b) => b.stationTotalPersonnel - a.stationTotalPersonnel);
    // console.log(LOG_PREFIX + `Wachen sortiert. (${stationInfoList.length} insgesamt)`);

    let totalRecruitedGlobally = 0;
    const requiredTotal = targetSetting.numberOfRequiredPersonnel;

    for (const stationInfo of stationInfoList) {
      if (totalRecruitedGlobally >= requiredTotal) break;
      const { buildingId, stationName, stationTotalPersonnel, panelHeadingElement } = stationInfo;
      const stationNameLower = stationName.toLowerCase();
      // console.log(LOG_PREFIX + `Prüfe Wache ${buildingId} (${stationName}), Gesamt: ${stationTotalPersonnel}`);
      if (STATION_NAME_EXCLUSION_KEYWORDS.some(keyword => stationNameLower.includes(keyword.toLowerCase()))) {
          if (DELAY_AFTER_STATION_PROCESSED > 0) await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_STATION_PROCESSED));
          continue;
      }
      if (stationTotalPersonnel <= MIN_PERSONNEL_REMAINING_ON_STATION) {
          if (DELAY_AFTER_STATION_PROCESSED > 0) await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_STATION_PROCESSED));
          continue;
      }
      const panelBody = getPanelBody(buildingId);
      if (!panelBody) {
          if (DELAY_AFTER_STATION_PROCESSED > 0) await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_STATION_PROCESSED));
          continue;
      }
      const hrefMatch = panelHeadingElement.outerHTML.match(/href="([^"]+)"/);
      if (hrefMatch && !loadedBuildings.includes(hrefMatch[1])) {
        await panelHeadingClick(buildingId, false);
        if (DELAY_AFTER_AJAX_LOAD > 0) await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_AJAX_LOAD));
      } else {
          if (panelBody.classList.contains("hidden")) showPanelBody(panelBody);
      }
      const maxPersonalToTakeBasedOnStationMinimum = stationTotalPersonnel - MIN_PERSONNEL_REMAINING_ON_STATION;
      const amountToRequestForThisStation = Math.min( MAX_PERSONNEL_TO_TAKE_PER_STATION, maxPersonalToTakeBasedOnStationMinimum, requiredTotal - totalRecruitedGlobally );
      if (amountToRequestForThisStation <= 0) {
          if (DELAY_AFTER_STATION_PROCESSED > 0) await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_STATION_PROCESSED));
          continue;
      }
      // console.log(LOG_PREFIX + `Wache ${buildingId}: Versuche ${amountToRequestForThisStation} Unausgebildete.`);
      const actuallyRecruited = await recruitUnskilledFromStation(panelBody, amountToRequestForThisStation);
      if (actuallyRecruited > 0) {
        const stationStatusSpan = document.getElementById(`personnel-status-${buildingId}`);
        const currentStationCount = stationStatusSpan ? parseInt(stationStatusSpan.textContent, 10) || 0 : 0;
        updateWacheStatus(buildingId, currentStationCount + actuallyRecruited);
        totalRecruitedGlobally += actuallyRecruited;
        targetSetting.numberOfSelectedPersonnel = totalRecruitedGlobally;
      }
      if (DELAY_AFTER_STATION_PROCESSED > 0) await new Promise(resolve => setTimeout(resolve, DELAY_AFTER_STATION_PROCESSED));
    }

    // console.log(LOG_PREFIX + `Rekrutierung abgeschlossen. Rekrutiert: ${totalRecruitedGlobally} / ${requiredTotal}`);
    globalButton.disabled = false;
    const hotkeyRecruitDisplay = HOTKEY_TO_START_RECRUITMENT.toUpperCase();
    globalButton.innerHTML = `<span class="glyphicon glyphicon-ok"></span> Rekr. beendet [${hotkeyRecruitDisplay}]`;
    setTimeout(() => {
         globalButton.innerHTML = `<span class="glyphicon glyphicon-user"></span> Rekrutierung (Limit) [${hotkeyRecruitDisplay}]`;
    }, NOTIFICATION_DURATION); // Button Text zurücksetzen, wenn Notification verschwindet

    const finalMessage = `Rekrutierung beendet.<br>Personal: ${totalRecruitedGlobally} / ${requiredTotal}<br>(Limit/Wache: ${MAX_PERSONNEL_TO_TAKE_PER_STATION})`;
    showTemporaryNotification(finalMessage, 'success', NOTIFICATION_DURATION);
  }

  function main() {
    if (!window.location.href.match(/\/buildings\/\d+\/hire/)) return;
    if (typeof window.loadedBuildings === 'undefined') window.loadedBuildings = [];
    initPanelBodies();
    removePanelHeadingClickEvent();
    addPersonnelSelector();
    addFooter();
    personnelSettingsProxy.forEach(setting => setting.numberOfSelectedPersonnel = 0);

    document.addEventListener('keydown', function(event) {
        const activeElement = document.activeElement;
        const isTyping = activeElement && (activeElement.tagName.toLowerCase() === 'input' ||
                                       activeElement.tagName.toLowerCase() === 'textarea' ||
                                       activeElement.isContentEditable);
        if (isTyping) return;
        const pressedKey = event.key.toLowerCase();
        if (pressedKey === HOTKEY_TO_START_RECRUITMENT.toLowerCase()) {
            event.preventDefault();
            const globalButton = document.getElementById(GLOBAL_RECRUIT_BUTTON_ID);
            if (globalButton && !globalButton.disabled) startGlobalRecruitment();
            else if (globalButton && globalButton.disabled) console.log(LOG_PREFIX + "Rekrutierung läuft bereits. Hotkey ignoriert.");
        } else if (pressedKey === HOTKEY_FOR_GAME_SUBMIT_BUTTON.toLowerCase()) {
            const gameSubmitButton = document.querySelector('input.navbar-btn[name="commit"][type="submit"][value="Personal übernehmen"]');
            if (gameSubmitButton) {
                event.preventDefault(); gameSubmitButton.click();
                console.log(LOG_PREFIX + `Hotkey "${HOTKEY_FOR_GAME_SUBMIT_BUTTON}" für "Personal übernehmen" geklickt.`);
            } else console.log(LOG_PREFIX + "'Personal übernehmen'-Button nicht gefunden.");
        }
    });
    console.log(LOG_PREFIX + `Skript v${GM_info.script.version} init. Ziel: ${TOTAL_UNSKILLED_PERSONNEL_TARGET}. Hotkeys: Rekr. [${HOTKEY_TO_START_RECRUITMENT.toUpperCase()}], Übern. [${HOTKEY_FOR_GAME_SUBMIT_BUTTON.toUpperCase()}]`);
  }
  main();
})();