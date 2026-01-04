// ==UserScript==
// @name         Jari's Quick Assign Narcos Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Settings tab & quickly assigns Narcos to a selected production. Reloads when you press ''OK''
// @author       Jari [409], Baccy [12578]
// @match        https://cartelempire.online/settings
// @match        https://cartelempire.online/Production*
// @icon         https://i.ibb.co/67cBgvHQ/QNA.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531931/Jari%27s%20Quick%20Assign%20Narcos%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/531931/Jari%27s%20Quick%20Assign%20Narcos%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SETTINGS_KEY_ENABLED = 'jari_script_enabled';
    const SETTINGS_KEY_TARGET = 'jari_auto_allocate_target';
    const PRODUCTION_TARGETS = { /* IDs from v1.7 */
        "Street Crimes": "6", "Doctors Office": "5", "Weed Field": "2",
        "Alcohol Still": "1", "Cocaine Factory": "3"
    };
    const PRODUCTION_TARGET_NAMES = Object.keys(PRODUCTION_TARGETS);

    // !! CRITICAL !! DOUBLE-CHECK THIS SELECTOR !!
    // This MUST point *ONLY* to the element displaying the number of *IDLE* narcos.
    // Use Developer Tools (F12 -> Inspector) on the Production page.
    // If this points to the wrong number (e.g., Total Narcos, or Street Crimes count),
    // the script WILL assign the wrong amount!
    const IDLE_NARCO_SELECTOR = '.idleNarcos'; // <--- *** VERIFY THIS SELECTOR IS CORRECT!!! ***

    // --- CSS ---
    GM_addStyle(`
        /* Styles copied from v1.8 */
        .jari-switch-label { position: relative; display: inline-block; width: 40px; height: 22px; vertical-align: middle; margin-left: 5px; }
        .jari-switch-input { opacity: 0; width: 0; height: 0; }
        .jari-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #212529; border: 1px solid #495057; transition: .4s; border-radius: 22px; }
        .jari-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: #595C5F; transition: .4s; border-radius: 50%; }
        .jari-switch-input:checked + .jari-slider { background-color: #0D6EFD; border-color: #0D6EFD; }
        .jari-switch-input:checked + .jari-slider:before { background-color: #FFFFFF; transform: translateX(18px); }
        .jari-setting-row { display: flex; align-items: center; margin-bottom: 15px; }
        .jari-confirm-overlay-v17 { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 10000; }
        .jari-confirm-box-v17 { background-color: #212529; color: #dee2e6; padding: 20px 25px; border-radius: 6px; border: 1px solid #444; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5); min-width: 300px; max-width: 450px; z-index: 10001; overflow: hidden; }
        .jari-confirm-box-v17 p { margin-top: 0; margin-bottom: 25px; font-size: 1rem; line-height: 1.6; text-align: left; color: #fff; }
        .jari-confirm-buttons-v17 { text-align: right; margin-top: 15px; }
        .jari-confirm-buttons-v17 button { color: white; border: none; padding: 8px 18px; border-radius: 5px; cursor: pointer; font-size: 0.95em; font-weight: 500; margin-left: 10px; transition: background-color 0.2s ease, box-shadow 0.2s ease; }
        .jari-confirm-ok-v17 { background-color: #0d6efd; box-shadow: 0 2px 5px rgba(13, 110, 253, 0.3); }
        .jari-confirm-cancel-v17 { background-color: #dc3545; box-shadow: 0 2px 5px rgba(220, 53, 69, 0.3); }
        .jari-confirm-buttons-v17 button:hover { filter: brightness(110%); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); }
    `);

    // --- Helper Functions ---
    function getSetting(key, defaultValue) { return GM_getValue(key, defaultValue); }
    function setSetting(key, value) { GM_setValue(key, value); }

    // --- Settings Page Logic (Identical to v1.8) ---
    function setupSettingsPage() {
        console.log("Jari's Settings Script v1.9 (Fixes & Debug): Initializing on /settings page...");
        // ... (Settings UI setup code is exactly the same as v1.8) ...
        const settingsContentSelector = '.tab-content'; const settingsNavSelector = '.nav-tabs'; const settingsContent = document.querySelector(settingsContentSelector); const settingsNav = document.querySelector(settingsNavSelector); if (!settingsContent || !settingsNav) { console.error("Jari's Script: Could not find settings containers."); return; } if (document.querySelector('a[href="#jaris-userscripts-content"]')) { console.log("Jari's Script: Settings tab already exists."); return; } const newTab = document.createElement('li'); newTab.className = 'nav-item'; newTab.innerHTML = `<a class="nav-link" data-bs-toggle="tab" href="#jaris-userscripts-content">Jari's Userscripts</a>`; settingsNav.appendChild(newTab); const newPane = document.createElement('div'); newPane.className = 'tab-pane fade'; newPane.id = 'jaris-userscripts-content'; newPane.style.padding = '15px'; const toggleDiv = document.createElement('div'); toggleDiv.className = 'jari-setting-row'; const toggleLabel = document.createElement('label'); toggleLabel.htmlFor = 'jari-script-enable-checkbox'; toggleLabel.textContent = 'Enable Quick Narco Assignment:'; toggleLabel.style.marginRight = '10px'; toggleLabel.style.fontWeight = 'bold'; const switchLabel = document.createElement('label'); switchLabel.className = 'jari-switch-label'; switchLabel.innerHTML = `<input type="checkbox" id="jari-script-enable-checkbox" class="jari-switch-input"><span class="jari-slider"></span>`; toggleDiv.appendChild(toggleLabel); toggleDiv.appendChild(switchLabel); newPane.appendChild(toggleDiv); const dropdownDiv = document.createElement('div'); dropdownDiv.className = 'jari-setting-row'; const label = document.createElement('label'); label.htmlFor = 'jari-auto-allocate-select'; label.textContent = 'Select Quick Allocation Target:'; label.className = 'form-label'; label.style.fontWeight = 'bold'; label.style.marginRight = '10px'; const select = document.createElement('select'); select.id = 'jari-auto-allocate-select'; select.className = 'form-select'; select.style.maxWidth = '250px'; PRODUCTION_TARGET_NAMES.forEach(target => { const option = document.createElement('option'); option.value = target; option.textContent = target; select.appendChild(option); }); dropdownDiv.appendChild(label); dropdownDiv.appendChild(select); newPane.appendChild(dropdownDiv); const saveButtonDiv = document.createElement('div'); saveButtonDiv.style.marginTop = '20px'; const saveButton = document.createElement('button'); saveButton.id = 'jari-save-settings'; saveButton.textContent = 'Save Settings'; saveButton.className = 'btn btn-primary'; saveButtonDiv.appendChild(saveButton); newPane.appendChild(saveButtonDiv); settingsContent.appendChild(newPane); console.log("Jari's Script: Settings tab and content added."); const savedEnabled = getSetting(SETTINGS_KEY_ENABLED, false); const savedTarget = getSetting(SETTINGS_KEY_TARGET, PRODUCTION_TARGET_NAMES[0]); const enableCheckbox = document.getElementById('jari-script-enable-checkbox'); const targetSelect = document.getElementById('jari-auto-allocate-select'); if (enableCheckbox) enableCheckbox.checked = savedEnabled; if (targetSelect) targetSelect.value = savedTarget; console.log("Jari's Script: Loaded settings.", { enabled: savedEnabled, target: savedTarget }); saveButton.addEventListener('click', () => { const currentEnabled = enableCheckbox ? enableCheckbox.checked : false; const currentTarget = targetSelect ? targetSelect.value : PRODUCTION_TARGET_NAMES[0]; setSetting(SETTINGS_KEY_ENABLED, currentEnabled); setSetting(SETTINGS_KEY_TARGET, currentTarget); saveButton.textContent = 'Saved!'; saveButton.classList.remove('btn-primary'); saveButton.classList.add('btn-success'); setTimeout(() => { saveButton.textContent = 'Save Settings'; saveButton.classList.remove('btn-success'); saveButton.classList.add('btn-primary'); }, 1500); console.log("Jari's Script: Settings saved.", { enabled: currentEnabled, target: currentTarget }); });
    } // End of setupSettingsPage

    // --- Custom Confirmation Box Function (v1.7 logic) ---
    function showStyledConfirm(message, yesCallback, noCallback) { /* Identical to v1.8 */
        const existingDialog = document.getElementById('jari-confirm-dialog-v17'); if (existingDialog) { existingDialog.remove(); } const overlay = document.createElement('div'); overlay.id = 'jari-confirm-dialog-v17'; overlay.className = 'jari-confirm-overlay-v17'; const box = document.createElement('div'); box.className = 'jari-confirm-box-v17'; const p = document.createElement('p'); p.textContent = message; const buttonDiv = document.createElement('div'); buttonDiv.className = 'jari-confirm-buttons-v17'; const cancelButton = document.createElement('button'); cancelButton.textContent = 'Cancel'; cancelButton.className = 'jari-confirm-cancel-v17'; cancelButton.onclick = () => { overlay.remove(); if (noCallback) noCallback(); }; const okButton = document.createElement('button'); okButton.textContent = 'OK'; okButton.className = 'jari-confirm-ok-v17'; okButton.onclick = () => { overlay.remove(); if (yesCallback) yesCallback(); }; buttonDiv.appendChild(cancelButton); buttonDiv.appendChild(okButton); box.appendChild(p); box.appendChild(buttonDiv); overlay.appendChild(box); document.body.appendChild(overlay);
    }

    // --- Production Page Logic ---
    function getIdleNarcoCount() {
        const element = document.querySelector(IDLE_NARCO_SELECTOR);
        if (!element) {
            console.error("AutoAssign DEBUG: Idle narco element NOT FOUND using selector:", IDLE_NARCO_SELECTOR);
            alert("AutoAssign Error: Idle narco element not found. Please check the script's IDLE_NARCO_SELECTOR configuration.");
            return null;
        }
        const countText = element.textContent.trim();
        // DEBUG: Log the raw text found
        console.log("AutoAssign DEBUG: Raw text found for idle count:", countText);
        const count = parseInt(countText.replace(/,/g, ''), 10); // Remove commas before parsing

        if (isNaN(count)) {
            console.error("AutoAssign DEBUG: FAILED to parse idle narco count from text:", countText);
            alert("AutoAssign Error: Cannot parse idle narco count from page element.");
            return null;
        }
        // DEBUG: Log the parsed count
        console.log("AutoAssign DEBUG: Parsed idle narco count as:", count);
        return count;
    }

    // MODIFIED: Added window.location.reload() on success
    function assignNarcos(targetId, targetName, amount) {
        const url = `/Production/Assign/${targetId}`;
        const postData = `toAssign=${encodeURIComponent(amount)}`;
        // DEBUG: Log exactly what is being sent
        console.log(`AutoAssign DEBUG: Sending POST to ${url} with body: ${postData}`);
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: postData })
        .then(response => { if (!response.ok) { throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`); } return response.json(); })
        .then(data => {
            console.log(`AutoAssign (Fetch): Assignment successful for ${targetName}. Resp:`, data);
            // RELOAD PAGE on success
            window.location.reload();
        })
        .catch(error => {
            console.error(`AutoAssign (Fetch): Assignment failed for ${targetName}. Error:`, error);
            alert(`AutoAssign Error: Failed to assign narcos to ${targetName}. ${error.message}. Check console.`);
        });
    }

    // MODIFIED: Added extra debug logs
    function runAutoAssignLogic() {
        console.log("AutoAssign (Styled Confirm / Debug): Running on /Production page.");
        const isEnabled = getSetting(SETTINGS_KEY_ENABLED, false);
        if (!isEnabled) { console.log("AutoAssign: Script disabled."); return; }
        const targetName = getSetting(SETTINGS_KEY_TARGET, null);
        const targetId = targetName ? PRODUCTION_TARGETS[targetName] : null;
        if (!targetId) { console.log("AutoAssign: No valid target."); return; }

        // --- Idle Count Retrieval ---
        const idleNarcos = getIdleNarcoCount();
        // ---

        if (idleNarcos === null) { console.log("AutoAssign: Cannot get idle count. Exiting."); return; }
        // DEBUG: Log the retrieved idle count before confirmation
        console.log(`AutoAssign DEBUG: Using idle narco count: ${idleNarcos} for target: ${targetName} (ID: ${targetId})`);

        const targetElement = [...document.querySelectorAll('.card-title.text-center.mb-1')].find(el => el.textContent === targetName);

        const currentNarcos = parseInt(targetElement.parentElement.querySelector('.assignNarcoInput').value);

        let maxCapacity;
        if (targetName !== 'Street Crimes') maxCapacity = parseInt(targetElement.parentElement.querySelector('.maxCapacity').textContent);
        else maxCapacity = 3000;

        if (currentNarcos === maxCapacity) return;

        let newNarcos;
        newNarcos = idleNarcos + currentNarcos;
        if (newNarcos > maxCapacity) newNarcos = maxCapacity;

		let displayedNarcos = newNarcos - currentNarcos;

        if (idleNarcos > 0) {
            showStyledConfirm( `Are you sure you want to quickly assign your Narcos? (${displayedNarcos} to ${targetName})`,
                () => { // OK Callback
                    // DEBUG: Log count just before assignment call
                    console.log(`AutoAssign DEBUG: OK confirmed. Calling assignNarcos with ID: ${targetId}, Name: ${targetName}, Amount: ${idleNarcos}`);
                    assignNarcos(targetId, targetName, newNarcos);
                },
                () => { // Cancel Callback
                    console.log("AutoAssign DEBUG: User cancelled assignment (Cancel).");
                }
            );
        } else {
            console.log("AutoAssign DEBUG: No idle narcos found (count is 0 or less).");
        }
    }

    // --- Main Execution ---
    const currentPath = window.location.pathname;
    if (currentPath.includes('/settings')) {
        setTimeout(setupSettingsPage, 1000);
    } else if (currentPath.startsWith('/Production')) {
        runAutoAssignLogic();
    }

})();