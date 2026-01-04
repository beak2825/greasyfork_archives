// ==UserScript==
// @name               WME Layer Saver
// @author             HBiede
// @namespace          hbiede.com
// @description        Save the state of different combinations of layer display settings.settings
// @match              https://www.waze.com/editor*
// @match              https://beta.waze.com/editor*
// @match              https://www.waze.com/*/editor*
// @match              https://beta.waze.com/*/editor*
// @require            https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @version            2026.01.01.004
// @grant              none
// @copyright          2026 HBiede
// @downloadURL https://update.greasyfork.org/scripts/383384/WME%20Layer%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/383384/WME%20Layer%20Saver.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

const DEBUG = true;
const UPDATE_DESCRIPTION =
  "<h4 style='margin-bottom: 5px;'>Bug Fixes:</h4><ul><li>Rework loading</li></ul>";
const DEFAULT_SETTINGS = { settings: [] };
const SCRIPT_STRING = "LSaver";
const SCRIPT_NAME = "Layer Saver";
const LAYER_SELECTION_TYPES = "wz-toggle-switch,wz-checkbox";
const LAYER_CONTAINER = "layer-switcher-region";
const DELIMITER = "::";
const settings = DEFAULT_SETTINGS;

let sdk = null;

const logPrint = (...message) => {
  if (DEBUG) console.log(...message);
};

// clear the alert text
function setAlertParagraph(message) {
  if (typeof message === "string")
    document.getElementById("LSaverAlertText").innerText = message;
}

// load the settings.settings from the local and server sources
async function loadSettings() {
  let local;
  try {
    local = JSON.parse(localStorage.getItem(SCRIPT_STRING));
  } catch (e) {
    local = DEFAULT_SETTINGS;
  }
  try {
    let returnValue = { ...DEFAULT_SETTINGS, ...(local ?? {}) };

    const serverSettings = await WazeWrap.Remote.RetrieveSettings(
      SCRIPT_STRING
    );
    if (serverSettings && serverSettings.time > returnValue.time) {
      returnValue = { ...returnValue, ...(serverSettings ?? {}) }
    }

    return returnValue;
  } catch (e) {
    logPrint(`${e.message}`);
    return DEFAULT_SETTINGS;
  }
}

// save settings.settings locally/to the server
function saveSettings() {
  settings.time = Date.now();
  WazeWrap.Remote.SaveSettings(SCRIPT_STRING, settings);
  localStorage.setItem(SCRIPT_STRING, JSON.stringify(settings));
}

// load all the settings.settings groups
async function loadLayerSaverSettings() {
  const returnValue = await loadSettings(SCRIPT_STRING);
  logPrint(returnValue);
  if (returnValue.settings.every((s) => s.includes(`${DELIMITER}[`))) {
    settings.settings = returnValue.settings;
  } else {
    settings.settings = returnValue.settings.map((s) => {
      const [title, string] = s.split(DELIMITER);
      const list = string
        .split("layer-switcher-group_")
        .map((t) => `layer-switcher-group_${t}`);
      return `${title}${DELIMITER}${JSON.stringify(list)}`;
    });
  }
  saveSettings(SCRIPT_STRING);
  logPrint(await WazeWrap.Remote.RetrieveSettings(SCRIPT_STRING));
}

// save all the settings groups
function saveLayerSaverSettings() {
  setAlertParagraph("");
  let arrayBuilder = [];
  const currentSettings = document.getElementById("LSaverSelector").children;
  for (let i = 0; i < currentSettings.length; i++) {
    arrayBuilder = arrayBuilder.concat([
      `${currentSettings[i].textContent}${DELIMITER}${JSON.stringify(
        currentSettings[i].settingsList
      )}`,
    ]);
    logPrint(`${currentSettings[i].textContent}`);
  }
  settings.settings = arrayBuilder;
  logPrint(settings.settings);
  saveSettings(SCRIPT_STRING);
}

// load the selected settings.settings group
async function loadLayerSettings() {
  setAlertParagraph("");
  const settingsList = JSON.parse(
    document.getElementById("LSaverSelector").selectedOptions[0].settingsList
  );
  const selected = new Set(settingsList);
  logPrint(`Loading according to: ${JSON.stringify([...selected])}`);

  const toggleSelectorList = (toggles) => {
    let hasChanged = false;
    for (let i = 0; i < toggles.length; i++) {
      const id = identifierForToggle(toggles[i]);
      // if the input is in the group and not checked, or not in the group and checked, click the input
      if ((id && selected.has(id)) !== toggles[i].checked) {
        logPrint(`Toggling ${id}`);
        toggles[i].click();
        hasChanged = true;
      }
    }
    return hasChanged;
  };

  LAYER_SELECTION_TYPES.split(",").forEach((type) => {
    return toggleSelectorList(
      document.getElementById(LAYER_CONTAINER).querySelectorAll(type)
    );
  });

  logPrint(
      `Loaded Group: ${
        document.getElementById("LSaverSelector").selectedOptions[0].textContent
      }`
    );
}

// delete the selected settings.settings group
function deleteLayerSettings() {
  setAlertParagraph("");
  const name =
    document.getElementById("LSaverSelector").children[
      document.getElementById("LSaverSelector").selectedIndex
    ].textContent;
  document
    .getElementById("LSaverSelector")
    .children[document.getElementById("LSaverSelector").selectedIndex].remove();
  saveLayerSaverSettings();
  logPrint(`Deleted Group: ${name}`);
  updateDisabledStates();
}

function identifierForToggle(toggle) {
  return toggle.id || toggle.name || toggle.innerText;
}

// turn the currently selected inputs into a usable string
function getCurrentLayerSettings() {
  const toggles = document
    .getElementById(LAYER_CONTAINER)
    .querySelectorAll(LAYER_SELECTION_TYPES);
  const res = [...toggles].filter((t) => t.checked).map(identifierForToggle);
  logPrint(res);
  return res;
}

// save the selected settings.settings group
function saveLayerSettings() {
  setAlertParagraph("");
  const layerSettingSelector = document.createElement("option");
  layerSettingSelector.textContent = prompt(
    "Name Your New Layer Settings Group",
    ""
  );
  if (layerSettingSelector.textContent != null) {
    layerSettingSelector.settingsList = JSON.stringify(
      getCurrentLayerSettings()
    );
    document.getElementById("LSaverSelector").appendChild(layerSettingSelector);
    saveLayerSaverSettings();
    logPrint(`Created Group: ${layerSettingSelector.textContent}`);
    updateDisabledStates();
    return;
  }
  logPrint("Save Aborted");
}

function populateSelector() {
  // build the selector options
  if (settings.settings.length > 0) {
    for (let i = 0; i < settings.settings.length; i++) {
      const setting = settings.settings[i].split(DELIMITER);
      const layerSettingSelector = document.createElement("option");
      layerSettingSelector.textContent = setting[0];
      layerSettingSelector.value = setting[0];
      layerSettingSelector.settingsList = setting[1] || "";
      document
        .getElementById("LSaverSelector")
        .appendChild(layerSettingSelector);
    }
  }
  updateDisabledStates();
}

// build the selector on the script tab
function selectorInit() {
  console.log("Loading Layer Settings");
  populateSelector();

  // add button listeners
  document
    .getElementById("LSaverLoadBtn")
    .addEventListener("click", async () => {
      await loadLayerSettings();
    });
  document.getElementById("LSaverDeleteBtn").addEventListener("click", () => {
    deleteLayerSettings();
  });
  document.getElementById("LSaverSaveBtn").addEventListener("click", () => {
    saveLayerSettings();
  });
  document
    .getElementById("LSaverSetDefaultBtn")
    .addEventListener("click", () => {
      document
        .getElementById("LSaverSelector")
        .add(
          document.getElementById("LSaverSelector").children[
            document.getElementById("LSaverSelector").selectedIndex
          ],
          0
        );
      saveLayerSaverSettings();
    });
  document.getElementById("LSaverImportBtn").addEventListener("click", () => {
    importSettingsList();
  });
  document.getElementById("LSaverExportBtn").addEventListener("click", () => {
    exportSettingsList();
  });
  document
    .getElementById("LSaverExportAllBtn")
    .addEventListener("click", () => {
      exportAllSettingsString();
    });
  console.log("Layer Settings Loaded");
}

// import a settings array in the from of a base64 encoded stringified version of the settings array
function importSettingsList() {
  try {
    const [title, settingsList] = window
      .atob(prompt("Import settings text:", ""))
      .split(DELIMITER);
    if (settingsList) {
      const importedArray = JSON.parse(settingsList);
      if (!Array.isArray(importedArray)) {
        setAlertParagraph("Invalid Input String");
        return;
      }
      settings.settings = settings.settings.concat(`${title}${DELIMITER}${JSON.stringify(settingsList)}`);
      saveSettings("LSaver");

      const selector = document.getElementById("LSaverSelector");
      while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
      }
      populateSelector();

      setAlertParagraph("Loaded");
    }
  } catch (e) {
    setAlertParagraph(e.message);
  }
}

function copyToClipboard(text) {
  if (text === "") {
    setAlertParagraph("Cannot export no settings.");
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  setAlertParagraph("Copied all groups' settings text to clipboard");
}

// export the selected settings string
function exportSettingsList() {
  const selectedSetting =
    document.getElementById("LSaverSelector").selectedOptions[0];
  if (selectedSetting) {
    copyToClipboard(
      window.btoa(
        JSON.stringify([
          `${selectedSetting.textContent}${DELIMITER}${JSON.stringify(
            selectedSetting.settingsList
          )}`,
        ])
      )
    );
  } else {
    setAlertParagraph("Select a group");
  }
}

// export a settings array in the form of a base64 encoded stringified version of the settings array
function exportAllSettingsString() {
  copyToClipboard(window.btoa(JSON.stringify(settings.settings)));
}

function updateDisabledStates() {
  const hasSettings = settings.settings.length > 0;
  const hasSelection =
    hasSettings && !!document.getElementById("LSaverSelector").value;

  document.getElementById("LSaverLoadBtn").disabled = !hasSelection;
  document.getElementById("LSaverDeleteBtn").disabled = !hasSelection;
  document.getElementById("LSaverSetDefaultBtn").disabled = !hasSelection;
  document.getElementById("LSaverExportBtn").disabled = !hasSelection;
  document.getElementById("LSaverExportAllBtn").disabled = !hasSettings;
}

// Create the tab in the sidebar via WazeWrap
function createTab() {
  sdk.Sidebar.registerScriptTab().then(({ tabLabel, tabPane }) => {
    tabLabel.innerText = "Layer Saver";

    tabPane.innerHTML = `<h3><b>WME Layer Saver</b></h3><p><i>${GM_info.script.version} by ${GM_info.script.author}</i></p><div id="LSaverSelectorDiv"><label>Groups</label><br><select id="LSaverSelector" style="width:90%; margin-bottom: 8px;"></select></div><div id="LSaverInteractionDiv"></div><button class="btn btn-primary" id="LSaverLoadBtn" title="Load" style="margin: 8px 8px auto auto;">Load</button><button class="btn btn-primary" id="LSaverDeleteBtn" title="Delete Selected" style="margin: 8px 8px auto auto;">Delete Selected</button><br><button class="btn btn-primary" id="LSaverSaveBtn" title="Save New Group" style="margin: 8px 8px auto auto;">Save New Group</button><br><button class="btn btn-primary" id="LSaverSetDefaultBtn" title="Set As Default" style="margin: 8px 8px auto auto;">Set As Default</button><br><button class="btn btn-primary" id="LSaverImportBtn" title="Import" style="margin: 8px 8px auto auto;">Import</button><button class="btn btn-primary" id="LSaverExportBtn" title="Export" style="margin: 8px 8px auto auto;">Export</button><button class="btn btn-primary" id="LSaverExportAllBtn" title="Export All" style="margin: 8px 8px auto auto;">Export All</button><p style="padding-top: 10px; font-weight: bold;" id="LSaverAlertText"></p></div>`;
    tabPane.id = "WMELayerSaver";

    selectorInit();
  });
}

// main function
async function initLayerSaver(attempts = 1) {
  sdk = window.getWmeSdk({ scriptId: SCRIPT_STRING, scriptName: SCRIPT_NAME });

  if (attempts <= 1000) {
    if (
      !WazeWrap.Ready ||
      typeof W === "undefined" ||
      typeof W.map === "undefined" ||
      typeof W.loginManager === "undefined" ||
      !document.getElementById(LAYER_CONTAINER)
    ) {
      logPrint("Layer Saver: retry");
      setTimeout(() => {
        initLayerSaver(attempts++);
      }, 800);
    } else {
      logPrint("Starting Layer Saver");
      await loadLayerSaverSettings();
      createTab();
      WazeWrap.Interface.ShowScriptUpdate(
        GM_info.script.name,
        GM_info.script.version,
        UPDATE_DESCRIPTION,
        "https://greasyfork.org/en/scripts/383384-wme-layer-saver",
        "https://www.waze.com/forum/viewtopic.php?f=819&t=283513"
      );
    }
  }
}

// start
window.SDK_INITIALIZED.then(() => {
  setTimeout(initLayerSaver, 1000);
});
