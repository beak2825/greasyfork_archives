// ==UserScript==
// @name         WME Quick RPP
// @namespace    https://github.com/WazeDev/wme-quick-rpp
// @version      0.0.3
// @description  Add RPPs with incrementing HNs.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/546456/WME%20Quick%20RPP.user.js
// @updateURL https://update.greasyfork.org/scripts/546456/WME%20Quick%20RPP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Shortcut storage configuration
    const STORAGE_KEY = 'WME_QuickRPP_Shortcuts';

    // Modifier key mappings for WME shortcuts
    const KeyModifiers = {
        1: "C",    // Ctrl
        2: "S",    // Shift
        3: "CS",   // Ctrl+Shift
        4: "A",    // Alt
        5: "AC",   // Alt+Ctrl
        6: "AS",   // Alt+Shift
        7: "ACS"   // Alt+Ctrl+Shift
    };

    // Default shortcut definitions
    const defaultDefs = [
        {
            shortcutId: 'wme-quick-rpp-create',
            description: 'Create RPP with Incremented HN',
            callback: duplicateRPP,
            shortcutKeys: null
        },
        {
            shortcutId: 'wme-quick-rpp-toggle-bulk-add',
            description: 'Toggle Bulk Creation',
            callback: toggleBulkAdd,
            shortcutKeys: null
        }
    ];

    let sdk;
    let increment = localStorage.getItem("WQR_HN_INCREMENT") || 0;
    let lockLevel = localStorage.getItem("WQR_LOCK_LEVEL") || 1;
    let NewRPPHNElement;
    let toggleBulkAddElement;
    let isBulkAdd;

    if (localStorage.getItem("WQR_BULK_ADD_ENABLED") === 'true') {
        isBulkAdd = true;
    } else {
        isBulkAdd = false;
    }

    window.SDK_INITIALIZED.then(init);

    /**
     * Convert WME-style "modMask,keyCode" string to human-readable form
     * @param {string|null} shortcutKeys - WME format like "2,85" or null
     * @returns {string|null} - Human readable like "S+85" or null
     */
    function convertShortcutKeys(shortcutKeys) {
        // Handle null input
        if (shortcutKeys == null) {
            return null;
        }

        // If not "number,number" format, assume already human-readable
        if (!/^\d+,\d+$/.test(shortcutKeys)) {
            return shortcutKeys;
        }

        // Parse and convert WME format to human-readable
        const [maskStr, keyCode] = shortcutKeys.split(",");
        const mask = parseInt(maskStr, 10);
        const modString = KeyModifiers[mask] || "";

        return modString ? `${modString}+${keyCode}` : keyCode;
    }

    function loadStoredShortcuts() {
        let storedList = []
        try {
            storedList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        } catch (e) {
            console.warn('WME Quick RPP: Could not parse stored shortcuts, resetting to defaults')
            storedList = []
        }
        return storedList;
    }

    function storeShortcuts() {
        console.log("WME Quick RPP: Storing shortcuts...");

        // Get IDs of shortcuts managed by this script
        const ours = new Set(defaultDefs.map(d => d.shortcutId))

        // Filter and format shortcuts for storage
        const toStore = sdk.Shortcuts
            .getAllShortcuts()
            .filter(s => ours.has(s.shortcutId))
            .map(s => ({
                shortcutId: s.shortcutId,
                description: s.description,
                shortcutKeys: s.shortcutKeys
            }))

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
    }

    function init() {
        sdk = window.getWmeSdk({
            scriptId: 'wme-quick-rpp',
            scriptName: 'WME Quick RPP'
        });

        // Load stored shortcuts and register them
        const existingIds = sdk.Shortcuts
            .getAllShortcuts()
            .map(s => s.shortcutId);

        let storedList = loadStoredShortcuts();

        if (storedList.length) {
            console.log('WME Quick RPP: Importing stored shortcuts');
            for (const st of storedList) {
                const def = defaultDefs.find(d => d.shortcutId === st.shortcutId);
                if (!def) {
                    console.warn(`WME Quick RPP: Unknown shortcutId ${st.shortcutId}`);
                    continue;
                }
                const toCreate = {
                    shortcutId: def.shortcutId,
                    description: def.description,
                    callback: def.callback,
                    shortcutKeys: convertShortcutKeys(st.shortcutKeys)
                };
                if (!existingIds.includes(def.shortcutId)) {
                    sdk.Shortcuts.createShortcut(toCreate);
                }
            }
        } else {
            console.log('WME Quick RPP: No stored shortcuts, registering defaults');
            for (const def of defaultDefs) {
                if (!existingIds.includes(def.shortcutId)) {
                    sdk.Shortcuts.createShortcut(def);
                }
            }
        }

        // Set up automatic storage when shortcuts are edited
        sdk.Events.on({
            eventName: 'wme-after-edit',
            eventHandler: storeShortcuts
        });

        sdk.Sidebar.registerScriptTab().then(async (res) => {
            res.tabLabel.innerText = "Quick RPP";
            res.tabPane.innerHTML = `
                <div>
                    <label for="WQRLockLevel">Lock Level</label>
                    <input type="number" id="WQRLockLevel" value="${lockLevel}" style="width: 100%;" min="1" max="6" />
                </div>
                <div>
                    <label for="WQRHNIncrement">HN Increment</label>
                    <input type="number" id="WQRHNIncrement" value="${increment}" style="width: 100%;" />
                </div>
                <div>
                    <label for="WQRToggleBulkAdd">Toggle Bulk Creation</label>
                    <input type="checkbox" id="WQRToggleBulkAdd" value="${isBulkAdd}" />
                </div>
                <div id="NewRPPHouseNumber" style="margin-top:8px;font-weight:bold;">New RPP HN: </div>
            `;
            res.tabPane.querySelector("#WQRLockLevel").addEventListener("input", (e) => {
                lockLevel = parseInt(e.target.value);
                localStorage.setItem("WQR_LOCK_LEVEL", lockLevel);
            });
            res.tabPane.querySelector("#WQRHNIncrement").addEventListener("input", (e) => {
                increment = parseInt(e.target.value);
                localStorage.setItem("WQR_HN_INCREMENT", increment);
            });
            res.tabPane.querySelector("#WQRToggleBulkAdd").addEventListener("input", (e) => {
                isBulkAdd = e.target.checked;
                localStorage.setItem("WQR_BULK_ADD_ENABLED", isBulkAdd);
            });
            NewRPPHNElement = res.tabPane.querySelector("#NewRPPHouseNumber");
            toggleBulkAddElement = res.tabPane.querySelector("#WQRToggleBulkAdd");
            if (isBulkAdd === true) {
                toggleBulkAddElement.checked = true;
            } else {
                toggleBulkAddElement.checked = false;
            }
        });
    }

    function toggleBulkAdd() {
        if (isBulkAdd === 'true' || isBulkAdd === true) {
            console.log(`WME Quick RPP: Bulk creation mode disabled!`);
            toggleBulkAddElement.checked = false;
            isBulkAdd = false;
        } else {
            console.log(`WME Quick RPP: Bulk creation mode enabled!`);
            toggleBulkAddElement.checked = true;
            isBulkAdd = true;
        }
        localStorage.setItem("WQR_BULK_ADD_ENABLED", isBulkAdd);
    }

    async function duplicateRPP() {
        let actualLockLevel = lockLevel - 1;
        let selection = sdk.Editing.getSelection();
        if (selection === null) {
            return;
        }
        let originalRPPId = selection.ids[0];
        let originalRPP = sdk.DataModel.Venues.getById({
            "venueId": originalRPPId
        });
        if (selection.objectType !== "venue") {
            return
        }
        let originalRPPAddress = sdk.DataModel.Venues.getAddress({
            "venueId": originalRPPId
        });
        let originalRPPHouseNumber = parseInt(originalRPPAddress.houseNumber);
        let originalRPPStreetId = originalRPPAddress.street.id;
        if (isBulkAdd === 'true' || isBulkAdd === true) {
            while (isBulkAdd === 'true' || isBulkAdd === true) {
                let newRPPHouseNumber = parseInt(originalRPPHouseNumber) + parseInt(increment);
                NewRPPHNElement.innerText = (`New RPP HN: ${newRPPHouseNumber}`);
                let newRPPGeometry = await sdk.Map.drawPoint();
                let newRPPId = sdk.DataModel.Venues.addVenue({
                    category: "RESIDENTIAL",
                    geometry: newRPPGeometry
                });
                sdk.DataModel.Venues.updateAddress({
                    houseNumber: `${newRPPHouseNumber}`,
                    streetId: originalRPPStreetId,
                    venueId: `${newRPPId}`
                });
                sdk.DataModel.Venues.replaceNavigationPoints({
                    navigationPoints: [{
                        isEntry: true,
                        isPrimary: true,
                        point: newRPPGeometry
                    }],
                    venueId: `${newRPPId}`
                });
                sdk.DataModel.Venues.updateVenue({
                    venueId: `${newRPPId}`,
                    lockRank: actualLockLevel
                });
                originalRPPHouseNumber = parseInt(newRPPHouseNumber);
                sdk.Editing.setSelection({selection: {ids: [`${newRPPId}`], objectType: "venue"}});
            }
        } else {
            let newRPPHouseNumber = parseInt(originalRPPHouseNumber) + parseInt(increment);
            NewRPPHNElement.innerText = (`New RPP HN: ${newRPPHouseNumber}`);
            let newRPPGeometry = await sdk.Map.drawPoint();
            let newRPPId = sdk.DataModel.Venues.addVenue({
                category: "RESIDENTIAL",
                geometry: newRPPGeometry
            });
            sdk.DataModel.Venues.updateAddress({
                houseNumber: `${newRPPHouseNumber}`,
                streetId: originalRPPStreetId,
                venueId: `${newRPPId}`
            });
            sdk.DataModel.Venues.replaceNavigationPoints({
                navigationPoints: [{
                    isEntry: true,
                    isPrimary: true,
                    point: newRPPGeometry
                }],
                venueId: `${newRPPId}`
            });
            sdk.DataModel.Venues.updateVenue({
                venueId: `${newRPPId}`,
                lockRank: actualLockLevel
            });
            sdk.Editing.setSelection({selection: {ids: [`${newRPPId}`], objectType: "venue"}});
        }
    }
})();
