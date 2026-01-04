// ==UserScript==
// @name         GeoGuesser: GeoSaver
// @namespace    http://tampermonkey.net/
// @version      1.3 / 31.03.2025
// @description  GeoSaver allows you to save and organize positions from single-player GeoGuessr rounds with descriptions, tags, and Street View links, use quicksaves in all modes, manage your saved data via a menu and settings, and ensures fair play by disabling advanced features in multiplayer.
// @author       SnApeS / Lukas
// @match        *://*.geoguessr.com/*
// @grant        none
// @tag          GeoSaver
// @tag          games
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/531433/GeoGuesser%3A%20GeoSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/531433/GeoGuesser%3A%20GeoSaver.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // =====================================================
  // 0. Global Variables and Persistence for Folders & Menu Position
  // =====================================================
  window.roundLock = false;

  // Persist folder list
  function getSavedFolders() {
    let foldersStr = localStorage.getItem("geoguessr_saved_folders");
    try { return foldersStr ? JSON.parse(foldersStr) : []; }
    catch(e) { return []; }
  }
  function addFolder(folderName) {
    if (!folderName) return;
    let folders = getSavedFolders();
    if (!folders.includes(folderName)) {
      folders.push(folderName);
      localStorage.setItem("geoguessr_saved_folders", JSON.stringify(folders));
    }
  }
  function removeFolder(folderName) {
    let folders = getSavedFolders();
    folders = folders.filter(f => f !== folderName);
    localStorage.setItem("geoguessr_saved_folders", JSON.stringify(folders));
  }

  // Persist menu position
  function loadMenuPosition() {
    let posStr = localStorage.getItem("geosaver_menu_position");
    if (posStr) {
      try { return JSON.parse(posStr); }
      catch(e) { return null; }
    }
    return null;
  }
  function saveMenuPosition(pos) {
    localStorage.setItem("geosaver_menu_position", JSON.stringify(pos));
  }

  // =====================================================
  // 1. Utility Functions
  // =====================================================
  function showPopup(message) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.backgroundColor = '#333';
    popup.style.color = '#fff';
    popup.style.padding = '10px 15px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    popup.style.zIndex = '12000';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => { popup.remove(); }, 2000);
  }

  // =====================================================
  // 2. Google Maps StreetView Overrides (with Round Handling)
  // =====================================================
  window.cachedStartPosition = null;
  function overrideStreetViewPanorama() {
    if (window.google && google.maps && google.maps.StreetViewPanorama) {
      const origSetPosition = google.maps.StreetViewPanorama.prototype.setPosition;
      google.maps.StreetViewPanorama.prototype.setPosition = function(position) {
        window.myGeoGuessrPosition = position;
        window.myGeoGuessrPanorama = this;
        const panoId = (this.getPano && typeof this.getPano === 'function') ? this.getPano() : null;
        const imageDate = (this.get && typeof this.get === 'function') ? this.get('imageDate') : null;
        const captureYear = imageDate ? new Date(imageDate).getFullYear() : null;
        // If no start position is saved or the panorama ID changes (new round)
        if (!window.cachedStartPosition || window.cachedStartPosition.pano !== panoId) {
          window.cachedStartPosition = {
            lat: (typeof position.lat === "function") ? position.lat() : position.lat,
            lng: (typeof position.lng === "function") ? position.lng() : position.lng,
            pano: panoId,
            year: captureYear
          };
          window.roundLock = true;
          console.log("New start position:", window.cachedStartPosition);
        }
        return origSetPosition.apply(this, arguments);
      };
      console.log("overrideStreetViewPanorama executed.");
    } else {
      setTimeout(overrideStreetViewPanorama, 500);
    }
  }
  overrideStreetViewPanorama();

  function overrideStreetViewPov() {
    if (window.google && google.maps && google.maps.StreetViewPanorama) {
      const origSetPov = google.maps.StreetViewPanorama.prototype.setPov;
      google.maps.StreetViewPanorama.prototype.setPov = function(pov) {
        window.myGeoGuessrPov = pov;
        console.log("POV updated:", pov);
        return origSetPov.apply(this, arguments);
      };
      console.log("overrideStreetViewPov executed.");
    } else {
      setTimeout(overrideStreetViewPov, 500);
    }
  }
  overrideStreetViewPov();

  // =====================================================
  // 3. Language Strings and Localization Setup
  // =====================================================
  // Retrieve saved language from localStorage or default to ENG
  let savedLanguage = localStorage.getItem("geosaver_language");
  let currentLanguage = savedLanguage ? savedLanguage : "ENG";
  const langStrings = {
    ENG: {
      displayName: "English",
      title: "GeoSaver",
      save: "Save",
      saveBtn: "Save Location",
      training: "Practice",
      archive: "Archive",
      archiveBtn: "Archive",
      chooseFolder: "Choose Folder",
      newFolder: "Create New Folder...",
      note: "Note",
      tags: "Tags",
      close: "Close",
      streetViewLink: "Show Street View",
      chooseFolderMessage: "Please select a folder.",
      moveToTrainingBtn: "Move to Training",
      moveToFolder: "Move to Folder",
      deletePositionBtn: "Delete",
      deleteAllArchivedBtn: "Delete All",
      settingsTitle: "Settings",
      quickSaveActive: "QuickSave active",
      dragHint: "Drag me!",
      languageLabel: "Language",
      backupSave: "Save Backup",
      backupRestore: "Restore Backup",
      noCurrentPosition: "No current position found.",
      invalidPosition: "Invalid position.",
      positionSaved: "Position saved",
      quickSaveSaved: "QuickSave position saved\nTime: {time}",
      confirmDeletePosition: "Are you sure you want to delete this position?",
      confirmDeleteFolder: "Are you sure you want to delete the folder \"{folder}\"?",
      confirmDeleteAllArchived: "Are you sure you want to delete all archived positions in folder \"{folder}\"?",
      enterNewFolderName: "Please enter a new folder name.",
      selectFolder: "Please select a folder.",
      positionMoved: "Position moved to {folder}"
    },
    DE: {
      displayName: "Deutsch",
      title: "GeoSaver",
      save: "Speichern",
      saveBtn: "Position speichern",
      training: "Training",
      archive: "Archiv",
      archiveBtn: "Archivieren",
      chooseFolder: "Ordner auswählen",
      newFolder: "Neuen Ordner erstellen...",
      note: "Notiz",
      tags: "Stichworte",
      close: "Schließen",
      streetViewLink: "Street View anzeigen",
      chooseFolderMessage: "Bitte wähle einen Ordner aus.",
      moveToTrainingBtn: "Ins Training verschieben",
      moveToFolder: "In Ordner verschieben",
      deletePositionBtn: "Löschen",
      deleteAllArchivedBtn: "Alle löschen",
      settingsTitle: "Einstellungen",
      quickSaveActive: "QuickSave aktiv",
      dragHint: "Zieh mich!",
      languageLabel: "Sprache",
      backupSave: "Backup speichern",
      backupRestore: "Backup wiederherstellen",
      noCurrentPosition: "Keine aktuelle Position gefunden.",
      invalidPosition: "Ungültige Position.",
      positionSaved: "Position gespeichert",
      quickSaveSaved: "QuickSave Position gespeichert: \nZeit: {time}",
      confirmDeletePosition: "Möchtest du diese Position wirklich löschen?",
      confirmDeleteFolder: "Möchtest du den Ordner \"{folder}\" wirklich löschen?",
      confirmDeleteAllArchived: "Möchtest du alle archivierten Positionen im Ordner \"{folder}\" wirklich löschen?",
      enterNewFolderName: "Bitte neuen Ordnernamen eingeben.",
      selectFolder: "Bitte wähle einen Ordner aus.",
      positionMoved: "Position verschoben in {folder}"
    },
    ES: {
      displayName: "Español",
      title: "GeoSaver",
      save: "Guardar",
      saveBtn: "Guardar Ubicación",
      training: "Practicar",
      archive: "Archivo",
      archiveBtn: "Archivo",
      chooseFolder: "Elegir Carpeta",
      newFolder: "Crear Nueva Carpeta...",
      note: "Nota",
      tags: "Etiquetas",
      close: "Cerrar",
      streetViewLink: "Mostrar Street View",
      chooseFolderMessage: "Por favor, selecciona una carpeta.",
      moveToTrainingBtn: "Mover a Práctica",
      moveToFolder: "Mover a Carpeta",
      deletePositionBtn: "Eliminar",
      deleteAllArchivedBtn: "Eliminar Todo",
      settingsTitle: "Configuración",
      quickSaveActive: "QuickSave activo",
      dragHint: "¡Arrástrame!",
      languageLabel: "Idioma",
      backupSave: "Guardar Respaldo",
      backupRestore: "Restaurar Respaldo",
      noCurrentPosition: "No se encontró posición actual.",
      invalidPosition: "Posición inválida.",
      positionSaved: "Posición guardada",
      quickSaveSaved: "Posición guardada en QuickSave: \nZeit: {time}",
      confirmDeletePosition: "¿Estás seguro de que deseas eliminar esta posición?",
      confirmDeleteFolder: "¿Estás seguro de que deseas eliminar la carpeta \"{folder}\"?",
      confirmDeleteAllArchived: "¿Estás seguro de que deseas eliminar todas las posiciones archivadas en la carpeta \"{folder}\"?",
      enterNewFolderName: "Por favor, ingresa un nuevo nombre para la carpeta.",
      selectFolder: "Por favor, selecciona una carpeta.",
      positionMoved: "Posición movida a {folder}"
    }
  };

  // =====================================================
  // 4. SPA Navigation Override
  // =====================================================
  (function() {
    const _oldPushState = history.pushState;
    history.pushState = function() {
      const ret = _oldPushState.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
    const _oldReplaceState = history.replaceState;
    history.replaceState = function() {
      const ret = _oldReplaceState.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
  })();
  window.addEventListener('locationchange', () => {
    const menu = document.getElementById('geoSaverMenu');
    if (menu) menu.remove();
    const indicator = document.getElementById('quickSaveIndicator');
    if (indicator) indicator.remove();
    initScript();
  });

  // =====================================================
  // 5. QuickSave Indicator (Multiplayer)
  // =====================================================
  function isMultiplayer() {
    return window.location.href.toLowerCase().includes("/multiplayer");
  }
  function showQuickSaveIndicator() {
    const existing = document.getElementById('geoSaverMenu');
    if (existing) existing.remove();
    let indicator = document.createElement('div');
    indicator.id = 'quickSaveIndicator';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '0';
    indicator.style.left = '0';
    indicator.style.width = '100%';
    indicator.style.backgroundColor = '#FF8C00';
    indicator.style.color = '#000';
    indicator.style.textAlign = 'center';
    indicator.style.padding = '2px';
    indicator.style.fontSize = '0.6em';
    indicator.style.zIndex = '10000';
    indicator.textContent = langStrings[currentLanguage].quickSaveActive;
    document.body.appendChild(indicator);
  }

  window.quickSaveToggledOff = false;
  function initScript() {
    console.log("initScript fired, URL:", window.location.href);
    if (isMultiplayer()) {
      if (!window.quickSaveToggledOff) { showQuickSaveIndicator(); }
    } else {
      const indicator = document.getElementById('quickSaveIndicator');
      if (indicator) indicator.remove();
      if (!document.getElementById('geoSaverMenu')) { createMainMenu(); }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
  } else { initScript(); }

  // =====================================================
  // 6. Main Menu Creation with Drag & Drop
  // =====================================================
  function createMainMenu() {
    if (document.getElementById('geoSaverMenu')) return;
    console.log("Creating main menu");
    const menu = document.createElement('div');
    menu.id = 'geoSaverMenu';
    menu.style.position = 'fixed';

    // Load saved menu position, if available
    const savedPos = loadMenuPosition();
    if (savedPos && savedPos.top && savedPos.left) {
      menu.style.top = savedPos.top;
      menu.style.left = savedPos.left;
      menu.style.right = "auto";
    } else {
      // Default position
      menu.style.top = '10%';
      menu.style.right = '0';
    }

    menu.style.minWidth = '300px';
    menu.style.height = 'auto';
    menu.style.boxSizing = 'border-box';
    menu.style.backgroundColor = 'rgba(0,0,0,0.85)';
    menu.style.color = '#fff';
    menu.style.padding = '20px';
    menu.style.border = '2px solid #fff';
    menu.style.borderRadius = '10px';
    menu.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
    menu.style.zIndex = '10000';

    // Header with Drag & Drop functionality
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.cursor = 'move';
    header.style.userSelect = 'none';
    header.innerHTML = `<h2 style="margin:0;">${langStrings[currentLanguage].title}</h2>
                        <button id="settingsBtn" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:#FF8C00;">&#9881;</button>`;
    menu.appendChild(header);

    // Main content sections (Save, QuickSave, Training, Archive)
    const contentContainer = document.createElement('div');
    const contentHTML = `
      <div style="margin:20px 0;"></div>
      <div id="mainSections" style="display:flex; flex-direction:column; gap:20px;">
        <!-- Save Section -->
        <div id="speichernSection" style="border:1px solid #ccc; padding:10px;">
          <h3 style="cursor:pointer;">${langStrings[currentLanguage].save}</h3>
          <div id="speichernContent" style="display:none;">
            <div style="display:flex; align-items:center; margin-bottom:5px;">
              <div style="width:120px;">${langStrings[currentLanguage].chooseFolder}:</div>
              <div style="flex:1;">
                <select id="gg-folder-save" onchange="handleFolderChange(this)">
                  <option value="">${langStrings[currentLanguage].chooseFolder}</option>
                  <option value="new">${langStrings[currentLanguage].newFolder}</option>
                </select>
                <div id="gg-new-folder-container"></div>
              </div>
            </div>
            <div style="margin-bottom:5px;">
              <strong>${langStrings[currentLanguage].note}:</strong><br>
              <span class="editable" data-id="0" data-field="note" style="color:brown; cursor:pointer;" id="displayNote">[empty]</span>
              <input type="text" id="gg-note-input" placeholder="${langStrings[currentLanguage].note} input" style="width:100%; display:none;">
            </div>
            <div style="margin-bottom:5px;">
              <strong>${langStrings[currentLanguage].tags}:</strong><br>
              <span class="editable" data-id="0" data-field="tags" style="color:purple; cursor:pointer;" id="displayTags">[empty]</span>
              <input type="text" id="gg-tags-input" placeholder="${langStrings[currentLanguage].tags} input" style="width:100%; display:none;">
            </div>
            <div style="text-align:center; margin-top:10px;">
              <button id="savePositionBtn" style="background-color: green; color: white; border: none; padding: 5px 10px; border-radius: 5px;">${langStrings[currentLanguage].saveBtn}</button>
            </div>
          </div>
        </div>
        <!-- QuickSave Section -->
        <div id="quickSaveSection" style="border:1px solid #ccc; padding:10px;">
          <h3 style="cursor:pointer;">QuickSave</h3>
          <div id="quickSaveContent" style="display:none;">
            <div id="quickSaveList" style="max-height:200px; overflow-y:auto;"></div>
          </div>
        </div>
        <!-- Training Section -->
        <div id="trainingSection" style="border:1px solid #ccc; padding:10px;">
          <h3 style="cursor:pointer;">${langStrings[currentLanguage].training}</h3>
          <div id="trainingContent" style="display:none;">
            <div>
              <label>${langStrings[currentLanguage].chooseFolder}:
                <select id="gg-folder-training" onchange="if(typeof renderTrainingPositions==='function') renderTrainingPositions();">
                  <option value="">${langStrings[currentLanguage].chooseFolder}</option>
                </select>
              </label>
            </div>
            <div id="trainingList" style="max-height:200px; overflow-y:auto;"></div>
          </div>
        </div>
        <!-- Archive Section -->
        <div id="archivSection" style="border:1px solid #ccc; padding:10px;">
          <h3 style="cursor:pointer;">${langStrings[currentLanguage].archive}</h3>
          <div id="archivContent" style="display:none;">
            <div>
              <label>${langStrings[currentLanguage].chooseFolder}:
                <select id="gg-folder-completed" onchange="if(typeof renderCompletedPositions==='function') renderCompletedPositions();">
                  <option value="">${langStrings[currentLanguage].chooseFolder}</option>
                </select>
              </label>
            </div>
            <div id="archivList" style="max-height:200px; overflow-y:auto;"></div>
            <div style="text-align:center; margin-top:10px;">
              <button id="deleteAllArchivedBtn" style="background-color: red; color:white; border: none; padding: 5px 10px; border-radius: 5px;">${langStrings[currentLanguage].deleteAllArchivedBtn}</button>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align:right; margin-top:20px;">
        <button id="closeMenuBtn" style="background-color: #696969; color: white; border: none; padding: 5px 10px; border-radius: 5px;">
          ${langStrings[currentLanguage].close}
        </button>
      </div>
    `;
    contentContainer.insertAdjacentHTML('beforeend', contentHTML);
    menu.appendChild(contentContainer);

    document.body.appendChild(menu);

    // Prevent keyboard events in the menu
    menu.addEventListener('keydown', (e) => { e.stopPropagation(); });

    // Event listeners for main menu buttons
    document.getElementById('closeMenuBtn').addEventListener('click', () => menu.remove());
    document.getElementById('settingsBtn').addEventListener('click', openSettingsMenu);
    document.getElementById('savePositionBtn').addEventListener('click', saveCurrentPosition);
    document.getElementById('deleteAllArchivedBtn').addEventListener('click', deleteAllArchivedPositions);
    attachInlineEditing();
    updateAllFolderDropdowns();
    renderTrainingPositions();
    renderCompletedPositions();
    renderQuickSavePositions();

    // Toggle sections on header click
    const sectionHeaders = document.querySelectorAll("#mainSections > div > h3");
    sectionHeaders.forEach(secHeader => {
        secHeader.addEventListener("click", () => {
            document.querySelectorAll("#mainSections > div > div").forEach(div => {
                if(div !== secHeader.nextElementSibling) { div.style.display = "none"; }
            });
            secHeader.nextElementSibling.style.display =
              (secHeader.nextElementSibling.style.display === "none" || secHeader.nextElementSibling.style.display === "") ? "block" : "none";
        });
    });

    // --------------------------------------------------
    // Drag & Drop for the entire menu
    // --------------------------------------------------
    (function() {
      let offsetX = 0, offsetY = 0, startX = 0, startY = 0;
      header.ondragstart = function() { return false; };
      header.addEventListener('mousedown', dragMouseDown);
      function dragMouseDown(e) {
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
      }
      function elementDrag(e) {
        e.preventDefault();
        offsetX = startX - e.clientX;
        offsetY = startY - e.clientY;
        startX = e.clientX;
        startY = e.clientY;
        const rect = menu.getBoundingClientRect();
        menu.style.top = (rect.top - offsetY) + "px";
        menu.style.left = (rect.left - offsetX) + "px";
        menu.style.right = "auto";
      }
      function closeDragElement() {
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);
        saveMenuPosition({ top: menu.style.top, left: menu.style.left });
      }
    })();
  }

  // =====================================================
  // 7. Settings Menu (Language and Backup Options)
  // =====================================================
  function openSettingsMenu() {
    const overlay = document.createElement('div');
    overlay.id = 'settingsOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = '11000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    const container = document.createElement('div');
    container.style.backgroundColor = '#fff';
    container.style.padding = '20px';
    container.style.borderRadius = '8px';
    container.style.minWidth = '300px';
    container.innerHTML = `
      <!-- Language Section -->
      <div id="languageSettings" style="text-align:center; margin-bottom:20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
        <label for="languageSelect">${langStrings[currentLanguage].languageLabel}:</label>
        <select id="languageSelect"></select>
      </div>
      <!-- Backup Section -->
      <div id="backupButtons" style="text-align:center; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        <button id="backupSaveBtn" style="background-color: green; color: white; border: none; padding: 5px 10px; border-radius: 5px;">${langStrings[currentLanguage].backupSave}</button>
        <button id="backupRestoreBtn" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 5px;">${langStrings[currentLanguage].backupRestore}</button>
      </div>
      <div style="text-align:center;">
        <button id="closeSettingsBtn" style="background-color: #696969; color: white; border: none; padding: 5px 10px; border-radius: 5px;">
          ${langStrings[currentLanguage].close}
        </button>
      </div>
    `;
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Dynamically populate language select options based on keys in langStrings
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.innerHTML = "";
    Object.keys(langStrings).forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = langStrings[key].displayName;
      if(key === currentLanguage) {
        option.selected = true;
      }
      languageSelect.appendChild(option);
    });

    // Language change event: update currentLanguage and store selection
    languageSelect.addEventListener('change', function() {
      currentLanguage = this.value;
      localStorage.setItem("geosaver_language", currentLanguage);
      location.reload();
    });

    // Backup button events
    document.getElementById('backupSaveBtn').addEventListener('click', backupSave);
    document.getElementById('backupRestoreBtn').addEventListener('click', backupRestore);

    document.getElementById('closeSettingsBtn').addEventListener('click', () => overlay.remove());
  }

  // ----- 7.1 Backup Functions -----
  function backupSave() {
    const backupData = {
      folders: localStorage.getItem("geoguessr_saved_folders"),
      positions: localStorage.getItem("geoguessr_saved_positions"),
      menuPosition: localStorage.getItem("geosaver_menu_position"),
      language: localStorage.getItem("geosaver_language")
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "geosaver_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function backupRestore() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const backupData = JSON.parse(e.target.result);
          if (backupData.folders !== undefined) localStorage.setItem("geoguessr_saved_folders", backupData.folders);
          if (backupData.positions !== undefined) localStorage.setItem("geoguessr_saved_positions", backupData.positions);
          if (backupData.menuPosition !== undefined) localStorage.setItem("geosaver_menu_position", backupData.menuPosition);
          if (backupData.language !== undefined) localStorage.setItem("geosaver_language", backupData.language);
          showPopup("Backup restored. Reloading...");
          setTimeout(() => location.reload(), 1500);
        } catch (err) {
          showPopup("Invalid backup file.");
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  // =====================================================
  // 8. Inline Editing for Note & Tags
  // =====================================================
  function attachInlineEditing() {
    const editables = document.querySelectorAll('.editable');
    editables.forEach(span => {
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => {
        const field = span.getAttribute('data-field');
        const posId = span.getAttribute('data-id');
        const currentText = span.textContent === "[empty]" ? "" : span.textContent;
        let input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.style.width = "100%";
        input.addEventListener('blur', () => {
          const newVal = input.value.trim();
          span.textContent = newVal || "[empty]";
          input.remove();
          span.style.display = "inline";
          let positions = getSavedPositions();
          let updated = false;
          positions.forEach(pos => {
            if (pos.id == posId) {
              pos[field] = newVal;
              updated = true;
            }
          });
          if (updated) { localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions)); }
        });
        input.addEventListener('keydown', (e) => { if (e.key === "Enter") { input.blur(); } });
        span.style.display = "none";
        span.parentNode.insertBefore(input, span);
        input.focus();
      });
    });
  }

  // =====================================================
  // 9. Folder Handling and Dropdown Updates
  // =====================================================
  window.handleFolderChange = function(selectElem) {
    const container = document.getElementById('gg-new-folder-container');
    if (selectElem.value === 'new') {
      container.innerHTML = `<input type="text" id="gg-new-folder-input" placeholder="${langStrings[currentLanguage].newFolder}" style="margin-top:5px; width:100%;">`;
    } else { container.innerHTML = ''; }
  };

  function getSavedPositions() {
    let positionsStr = localStorage.getItem("geoguessr_saved_positions");
    try { return positionsStr ? JSON.parse(positionsStr) : []; }
    catch(e) { return []; }
  }

  function updateAllFolderDropdowns() {
    let savedFolders = getSavedFolders();
    function getFolderList(filterFn) {
      let posFolders = Array.from(new Set(getSavedPositions().filter(filterFn).map(p => p.folder).filter(f => f)));
      let allFolders = Array.from(new Set([...savedFolders, ...posFolders]));
      allFolders.sort();
      return allFolders;
    }
    const saveDropdown = document.getElementById("gg-folder-save");
    if (saveDropdown) {
      const curVal = saveDropdown.value;
      saveDropdown.innerHTML = `<option value="">${langStrings[currentLanguage].chooseFolder}</option>
                                <option value="new">${langStrings[currentLanguage].newFolder}</option>`;
      let folders = getFolderList(() => true);
      folders.forEach(folder => {
        let opt = document.createElement("option");
        opt.value = folder;
        opt.textContent = folder;
        saveDropdown.appendChild(opt);
      });
      if (folders.includes(curVal)) { saveDropdown.value = curVal; }
    }
    const trainingDropdown = document.getElementById("gg-folder-training");
    if (trainingDropdown) {
      const currentTrainingValue = trainingDropdown.value;
      trainingDropdown.innerHTML = `<option value="">${langStrings[currentLanguage].chooseFolder}</option>`;
      let folders = getFolderList(() => true);
      folders.forEach(folder => {
        let opt = document.createElement("option");
        opt.value = folder;
        opt.textContent = folder;
        trainingDropdown.appendChild(opt);
      });
      if (folders.includes(currentTrainingValue)) { trainingDropdown.value = currentTrainingValue; }
      if (!document.getElementById("deleteTrainingFolderBtn")) {
        const btn = document.createElement("button");
        btn.id = "deleteTrainingFolderBtn";
        btn.textContent = "❌";
        btn.style.marginLeft = "10px";
        btn.onclick = () => {
          const sel = trainingDropdown.value.trim();
          if (sel && confirm(langStrings[currentLanguage].confirmDeleteFolder.replace("{folder}", sel))) {
            deleteFolder(sel);
          }
        };
        trainingDropdown.parentNode.appendChild(btn);
      }
    }
    const completedDropdown = document.getElementById("gg-folder-completed");
    if (completedDropdown) {
      const currentCompletedValue = completedDropdown.value;
      completedDropdown.innerHTML = `<option value="">${langStrings[currentLanguage].chooseFolder}</option>`;
      let folders = getFolderList(() => true);
      folders.forEach(folder => {
        let opt = document.createElement("option");
        opt.value = folder;
        opt.textContent = folder;
        completedDropdown.appendChild(opt);
      });
      if (folders.includes(currentCompletedValue)) { completedDropdown.value = currentCompletedValue; }
      if (!document.getElementById("deleteCompletedFolderBtn")) {
        const btn = document.createElement("button");
        btn.id = "deleteCompletedFolderBtn";
        btn.textContent = "❌";
        btn.style.marginLeft = "10px";
        btn.onclick = () => {
          const sel = completedDropdown.value.trim();
          if (sel && confirm(langStrings[currentLanguage].confirmDeleteFolder.replace("{folder}", sel))) {
            deleteFolder(sel);
          }
        };
        completedDropdown.parentNode.appendChild(btn);
      }
    }
  }

  function deleteFolder(folderName) {
    if (confirm(langStrings[currentLanguage].confirmDeleteFolder.replace("{folder}", folderName))) {
      let positions = getSavedPositions();
      positions = positions.filter(p => p.folder !== folderName);
      localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
      removeFolder(folderName);
      updateAllFolderDropdowns();
      renderTrainingPositions();
      renderCompletedPositions();
    }
  }

  // =====================================================
  // 10. Position Saving Functions (using the fixed start position)
  // =====================================================
  function saveCurrentPosition() {
    let pos;
    if (window.cachedStartPosition) {
      pos = window.cachedStartPosition;
    } else if (window.myGeoGuessrPosition) {
      pos = window.myGeoGuessrPosition;
    } else if (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getPosition === 'function') {
      pos = window.myGeoGuessrPanorama.getPosition();
    } else {
      showPopup(langStrings[currentLanguage].noCurrentPosition);
      return;
    }
    let lat, lng, heading, pitch, panoId, captureYear;
    const pov = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getPov === 'function')
                ? window.myGeoGuessrPanorama.getPov() : { heading: 0, pitch: 0 };
    if (window.cachedStartPosition) {
      lat = pos.lat;
      lng = pos.lng;
      panoId = pos.pano;
      captureYear = pos.year;
    } else {
      if (typeof pos.lat === "function") { lat = pos.lat(); lng = pos.lng(); }
      else if (typeof pos.lat === "number") { lat = pos.lat; lng = pos.lng; }
      else { showPopup(langStrings[currentLanguage].invalidPosition); return; }
      panoId = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getPano === 'function')
                ? window.myGeoGuessrPanorama.getPano() : null;
      const imageDate = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.get === 'function')
                ? window.myGeoGuessrPanorama.get('imageDate') : null;
      captureYear = imageDate ? new Date(imageDate).getFullYear() : null;
    }
    heading = pov.heading;
    pitch = pov.pitch;
    let zoom = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getZoom === 'function')
                 ? window.myGeoGuessrPanorama.getZoom() : 0;
    let note = document.getElementById("displayNote").textContent;
    let tags = document.getElementById("displayTags").textContent;
    note = (note === "[empty]") ? "" : note;
    tags = (tags === "[empty]") ? "" : tags;
    const folderSelect = document.getElementById("gg-folder-save");
    const newFolderInput = document.getElementById("gg-new-folder-input");
    let folder = "";
    if (folderSelect.value === "new") {
      folder = newFolderInput ? newFolderInput.value.trim() : "";
      if (!folder) { showPopup(langStrings[currentLanguage].enterNewFolderName); return; }
    } else {
      folder = folderSelect.value.trim();
      if (!folder) { showPopup(langStrings[currentLanguage].selectFolder); return; }
    }
    addFolder(folder);
    let positions = getSavedPositions();
    const newEntry = {
      id: Date.now(),
      lat: lat,
      lng: lng,
      folder: folder,
      tags: tags,
      note: note,
      completed: false,
      timestamp: new Date().toISOString(),
      heading: heading,
      pitch: pitch,
      zoom: zoom,
      pano: panoId,
      year: captureYear
    };
    positions.push(newEntry);
    localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
    showPopup(langStrings[currentLanguage].positionSaved.replace("{lat}", lat.toFixed(6)).replace("{lng}", lng.toFixed(6)));
    updateAllFolderDropdowns();
    renderTrainingPositions();
    renderCompletedPositions();
  }

  let lastQuickSaveTime = 0;
  function quickSave() {
    const now = Date.now();
    if(now - lastQuickSaveTime < 500) return;
    lastQuickSaveTime = now;
    let pos;
    if (window.cachedStartPosition) { pos = window.cachedStartPosition; }
    else if (window.myGeoGuessrPosition) { pos = window.myGeoGuessrPosition; }
    else if (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getPosition === 'function') {
      pos = window.myGeoGuessrPanorama.getPosition();
    } else {
      showPopup(langStrings[currentLanguage].noCurrentPosition);
      return;
    }
    let lat, lng, heading, pitch, panoId, captureYear;
    const pov = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getPov === 'function')
                ? window.myGeoGuessrPanorama.getPov() : { heading: 0, pitch: 0 };
    if (window.cachedStartPosition) {
      lat = pos.lat;
      lng = pos.lng;
      panoId = pos.pano;
      captureYear = pos.year;
    } else {
      if (typeof pos.lat === "function") { lat = pos.lat(); lng = pos.lng(); }
      else if (typeof pos.lat === "number") { lat = pos.lat; lng = pos.lng; }
      else { showPopup(langStrings[currentLanguage].invalidPosition); return; }
      panoId = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getPano === 'function')
                ? window.myGeoGuessrPanorama.getPano() : null;
      const imageDate = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.get === 'function')
                ? window.myGeoGuessrPanorama.get('imageDate') : null;
      captureYear = imageDate ? new Date(imageDate).getFullYear() : null;
    }
    heading = pov.heading;
    pitch = pov.pitch;
    let zoom = (window.myGeoGuessrPanorama && typeof window.myGeoGuessrPanorama.getZoom === 'function')
                   ? window.myGeoGuessrPanorama.getZoom() : 0;
    const folder = "";
    const timestamp = new Date().toLocaleString();
    const tags = "QuickSave " + timestamp;
    const note = "";
    let positions = getSavedPositions();
    const newEntry = {
      id: Date.now(),
      lat: lat,
      lng: lng,
      folder: folder,
      tags: tags,
      note: note,
      completed: false,
      timestamp: new Date().toISOString(),
      heading: heading,
      pitch: pitch,
      zoom: zoom,
      pano: panoId,
      year: captureYear,
      quickSave: true
    };
    positions.push(newEntry);
    localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
    showPopup(langStrings[currentLanguage].quickSaveSaved.replace("{lat}", lat.toFixed(6)).replace("{lng}", lng.toFixed(6)).replace("{time}", timestamp));
    updateAllFolderDropdowns();
    renderTrainingPositions();
    renderCompletedPositions();
    renderQuickSavePositions();
  }

  // =====================================================
  // 11. Rendering Functions for Saved Positions
  // =====================================================
  function renderTrainingPositions() {
    const dropdown = document.getElementById("gg-folder-training");
    const listContainer = document.getElementById("trainingList");
    if (!dropdown || !listContainer) return;
    let selectedFolder = dropdown.value.trim();
    if (!selectedFolder) { listContainer.innerHTML = langStrings[currentLanguage].chooseFolderMessage; return; }
    let positions = getSavedPositions().filter(p => p.folder.trim() === selectedFolder && !p.completed);
    listContainer.innerHTML = "";
    positions.forEach(p => {
      let streetViewURL = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${p.lat},${p.lng}`;
      if (p.heading !== undefined && p.pitch !== undefined) { streetViewURL += `&heading=${p.heading}&pitch=${p.pitch}`; }
      if (p.zoom !== undefined && p.zoom !== null) { streetViewURL += `&zoom=${p.zoom}`; }
      if (p.pano) { streetViewURL += `&pano=${p.pano}`; }
      if (p.year) { streetViewURL += `&year=${p.year}`; }
      let div = document.createElement("div");
      div.style.borderBottom = "1px solid #ccc";
      div.style.marginBottom = "5px";
      div.style.paddingBottom = "5px";
      div.innerHTML = `
        <a href="${streetViewURL}" target="_blank" style="color:#ADD8E6;">${langStrings[currentLanguage].streetViewLink}</a><br>
        <strong>${langStrings[currentLanguage].note}:</strong><br>
        <span class="editable" data-id="${p.id}" data-field="note" style="color:brown; cursor:pointer;">${p.note || "[empty]"}</span><br>
        <strong>${langStrings[currentLanguage].tags}:</strong><br>
        <span class="editable" data-id="${p.id}" data-field="tags" style="color:purple; cursor:pointer;">${p.tags || "[empty]"}</span><br>
        <button onclick="moveToArchive(${p.id})" style="background-color:green; color:white; border:none; padding:5px 10px; border-radius:5px;">${langStrings[currentLanguage].archiveBtn}</button>
      `;
      listContainer.appendChild(div);
    });
    attachInlineEditing();
  }

  function renderCompletedPositions() {
    const dropdown = document.getElementById("gg-folder-completed");
    const listContainer = document.getElementById("archivList");
    if (!dropdown || !listContainer) return;
    let selectedFolder = dropdown.value.trim();
    if (!selectedFolder) { listContainer.innerHTML = langStrings[currentLanguage].chooseFolderMessage; return; }
    let positions = getSavedPositions().filter(p => p.folder.trim() === selectedFolder && p.completed);
    listContainer.innerHTML = "";
    positions.forEach(p => {
      let streetViewURL = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${p.lat},${p.lng}`;
      if (p.heading !== undefined && p.pitch !== undefined) { streetViewURL += `&heading=${p.heading}&pitch=${p.pitch}`; }
      if (p.zoom !== undefined && p.zoom !== null) { streetViewURL += `&zoom=${p.zoom}`; }
      if (p.pano) { streetViewURL += `&pano=${p.pano}`; }
      if (p.year) { streetViewURL += `&year=${p.year}`; }
      let div = document.createElement("div");
      div.style.borderBottom = "1px solid #ccc";
      div.style.marginBottom = "5px";
      div.style.paddingBottom = "5px";
      div.innerHTML = `
        <a href="${streetViewURL}" target="_blank" style="color:#ADD8E6;">${langStrings[currentLanguage].streetViewLink}</a><br>
        <strong>${langStrings[currentLanguage].note}:</strong><br>
        <span class="editable" data-id="${p.id}" data-field="note" style="color:brown; cursor:pointer;">${p.note || "[empty]"}</span><br>
        <strong>${langStrings[currentLanguage].tags}:</strong><br>
        <span class="editable" data-id="${p.id}" data-field="tags" style="color:purple; cursor:pointer;">${p.tags || "[empty]"}</span><br>
        <button onclick="moveToTraining(${p.id})" style="background-color:yellow; color:black; border:none; padding:5px 10px; border-radius:5px; margin-right:5px;">${langStrings[currentLanguage].moveToTrainingBtn}</button>
        <button onclick="deletePosition(${p.id})" style="background-color:red; color:white; border:none; padding:5px 10px; border-radius:5px;">${langStrings[currentLanguage].deletePositionBtn}</button>
      `;
      let folderDropdown = document.createElement("select");
      folderDropdown.innerHTML = `<option value="">${langStrings[currentLanguage].chooseFolder}</option><option value="new">${langStrings[currentLanguage].newFolder}</option>`;
      let folders = getSavedFolders();
      folders.sort();
      folders.forEach(folder => {
        let opt = document.createElement("option");
        opt.value = folder;
        opt.textContent = folder;
        folderDropdown.appendChild(opt);
      });
      folderDropdown.addEventListener("change", function() {
        handleArchiveFolderChange(folderDropdown, p.id);
      });
      div.appendChild(folderDropdown);
      listContainer.appendChild(div);
    });
    attachInlineEditing();
  }

  function renderQuickSavePositions() {
    const listContainer = document.getElementById("quickSaveList");
    if (!listContainer) return;
    let positions = getSavedPositions().filter(p => p.quickSave === true);
    if (positions.length === 0) { listContainer.innerHTML = "No QuickSave entries."; return; }
    listContainer.innerHTML = "";
    positions.forEach(p => {
      let streetViewURL = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${p.lat},${p.lng}`;
      if (p.heading !== undefined && p.pitch !== undefined) { streetViewURL += `&heading=${p.heading}&pitch=${p.pitch}`; }
      if (p.zoom !== undefined && p.zoom !== null) { streetViewURL += `&zoom=${p.zoom}`; }
      if (p.pano) { streetViewURL += `&pano=${p.pano}`; }
      if (p.year) { streetViewURL += `&year=${p.year}`; }
      let folders = getSavedFolders();
      folders.sort();
      let dropdown = document.createElement("select");
      let option = document.createElement("option");
      option.value = "";
      option.textContent = langStrings[currentLanguage].chooseFolder;
      dropdown.appendChild(option);
      option = document.createElement("option");
      option.value = "new";
      option.textContent = langStrings[currentLanguage].newFolder;
      dropdown.appendChild(option);
      folders.forEach(folder => {
        let opt = document.createElement("option");
        opt.value = folder;
        opt.textContent = folder;
        dropdown.appendChild(opt);
      });
      dropdown.addEventListener("change", function() {
        handleQuickSaveMoveDropdownChange(dropdown, p.id);
      });
      let containerDiv = document.createElement("div");
      containerDiv.style.borderBottom = "1px solid #ccc";
      containerDiv.style.marginBottom = "5px";
      containerDiv.style.paddingBottom = "5px";
      containerDiv.innerHTML = `
        <a href="${streetViewURL}" target="_blank" style="color:#ADD8E6;">${langStrings[currentLanguage].streetViewLink}</a><br>
        <strong>${langStrings[currentLanguage].note}:</strong><br>
        <span class="editable" data-id="${p.id}" data-field="note" style="color: brown; cursor:pointer;">${p.note || "[empty]"}</span><br>
        <strong>${langStrings[currentLanguage].tags}:</strong><br>
        <span class="editable" data-id="${p.id}" data-field="tags" style="color: purple; cursor:pointer;">${p.tags || "[empty]"}</span><br>
        <strong>${langStrings[currentLanguage].moveToFolder}:</strong><br>
      `;
      containerDiv.appendChild(dropdown);
      listContainer.appendChild(containerDiv);
    });
    attachInlineEditing();
  }

  // =====================================================
  // 12. Position Management Functions
  // =====================================================
  function moveToArchive(positionId) {
    let positions = getSavedPositions();
    let position = positions.find(p => p.id === positionId);
    if (position) {
      position.completed = true;
      localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
      updateAllFolderDropdowns();
      renderTrainingPositions();
      renderCompletedPositions();
    }
  }

  function moveToTraining(positionId) {
    let positions = getSavedPositions();
    let position = positions.find(p => p.id === positionId);
    if (position) {
      position.completed = false;
      localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
      console.log(`Position ${positionId} moved back to training.`);
      updateAllFolderDropdowns();
      renderTrainingPositions();
      renderCompletedPositions();
    } else { console.error(`Position ${positionId} not found.`); }
  }

  function deletePosition(positionId) {
    if (confirm(langStrings[currentLanguage].confirmDeletePosition)) {
      let positions = getSavedPositions();
      positions = positions.filter(p => p.id !== positionId);
      localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
      console.log(`Position ${positionId} deleted.`);
      renderTrainingPositions();
      renderCompletedPositions();
    }
  }

  function handleQuickSaveMoveDropdownChange(selectElem, quickSaveId) {
    if (selectElem.value === "new") {
      let input = document.createElement("input");
      input.type = "text";
      input.placeholder = langStrings[currentLanguage].newFolder;
      input.style.marginTop = "5px";
      input.style.width = "100%";
      input.addEventListener('blur', function(){
        let folderName = input.value.trim();
        if(folderName) { moveQuickSaveToTraining(quickSaveId, folderName); }
        else { renderQuickSavePositions(); }
      });
      selectElem.parentNode.replaceChild(input, selectElem);
      input.focus();
    } else if (selectElem.value !== "") {
      moveQuickSaveToTraining(quickSaveId, selectElem.value);
    }
  }
  window.moveQuickSaveToTraining = function(quickSaveId, folderName) {
    let positions = getSavedPositions();
    let pos = positions.find(p => p.id === quickSaveId);
    if (pos) {
      pos.folder = folderName;
      pos.quickSave = false;
      pos.completed = false;
      localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
      addFolder(folderName);
      showPopup(langStrings[currentLanguage].positionMoved.replace("{folder}", folderName));
      updateAllFolderDropdowns();
      renderTrainingPositions();
      renderCompletedPositions();
      renderQuickSavePositions();
    }
  };

  function handleArchiveFolderChange(selectElem, positionId) {
    if (selectElem.value === "new") {
      let input = document.createElement("input");
      input.type = "text";
      input.placeholder = langStrings[currentLanguage].newFolder;
      input.style.marginTop = "5px";
      input.style.width = "100%";
      input.addEventListener('blur', function() {
        let folderName = input.value.trim();
        if (folderName) { moveArchiveToFolder(positionId, folderName); }
        else { renderCompletedPositions(); }
      });
      selectElem.parentNode.replaceChild(input, selectElem);
      input.focus();
    } else if (selectElem.value !== "") {
      moveArchiveToFolder(positionId, selectElem.value);
    }
  }
  window.moveArchiveToFolder = function(positionId, folderName) {
    let positions = getSavedPositions();
    let pos = positions.find(p => p.id === positionId);
    if (pos) {
      pos.folder = folderName;
      localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
      addFolder(folderName);
      showPopup(langStrings[currentLanguage].positionMoved.replace("{folder}", folderName));
      updateAllFolderDropdowns();
      renderCompletedPositions();
    }
  };

  function deleteAllArchivedPositions() {
    const dropdown = document.getElementById("gg-folder-completed");
    let selectedFolder = dropdown ? dropdown.value.trim() : "";
    if (!selectedFolder) { showPopup(langStrings[currentLanguage].selectFolder); return; }
    if (confirm(langStrings[currentLanguage].confirmDeleteAllArchived.replace("{folder}", selectedFolder))) {
      let positions = getSavedPositions();
      positions = positions.filter(p => !(p.completed && p.folder.trim() === selectedFolder));
      localStorage.setItem("geoguessr_saved_positions", JSON.stringify(positions));
      renderCompletedPositions();
      updateAllFolderDropdowns();
    }
  }

  // =====================================================
  // 13. Hotkeys and Menu Toggle
  // =====================================================
  function toggleMenu() {
    if (isMultiplayer()) {
      const indicator = document.getElementById('quickSaveIndicator');
      if (indicator) { indicator.remove(); window.quickSaveToggledOff = true; }
      else { showQuickSaveIndicator(); window.quickSaveToggledOff = false; }
    } else {
      const menu = document.getElementById('geoSaverMenu');
      if (menu) { menu.remove(); } else { createMainMenu(); }
    }
  }
  document.addEventListener('keydown', (e) => { if (e.altKey && e.code === "KeyS") { e.preventDefault(); quickSave(); } }, true);
  document.addEventListener('keydown', (e) => { if (e.altKey && e.code === "KeyG") { e.preventDefault(); toggleMenu(); } });

  // =====================================================
  // 14. Auto Initialization on Page Load and SPA Changes
  // =====================================================
  function initMenu() {
    console.log("initMenu fired, URL:", window.location.href);
    if (isMultiplayer()) {
      const existing = document.getElementById('geoSaverMenu');
      if (existing) existing.remove();
      showQuickSaveIndicator();
    } else {
      if (!document.getElementById('geoSaverMenu')) { createMainMenu(); }
    }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initMenu); }
  else { initMenu(); }
  window.addEventListener('locationchange', () => {
    const existing = document.getElementById('geoSaverMenu');
    if (existing) existing.remove();
    initMenu();
  });

  // =====================================================
  // 15. Expose Global Functions for Inline Handlers
  // =====================================================
  window.renderTrainingPositions = renderTrainingPositions;
  window.renderCompletedPositions = renderCompletedPositions;
  window.moveToArchive = moveToArchive;
  window.moveToTraining = moveToTraining;
  window.deletePosition = deletePosition;
  window.moveQuickSaveToTraining = window.moveQuickSaveToTraining;
  window.moveArchiveToFolder = moveArchiveToFolder;

  console.log("GeoSaver Complete Script Loaded");
})();
