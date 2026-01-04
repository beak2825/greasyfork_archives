// ==UserScript==
// @name         WME Quick Map Comments/Notes
// @namespace    https://github.com/WazeDev/wme-quick-map-comments-notes
// @version      0.0.14
// @description  Allow map editors to add map notes/comments for permanent hazards, no U-turn signs or aerials out-of-date.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @exclude      https://www.waze.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/WazeSpace/wme-sdk-plus@06108853094d40f67e923ba0fe0de31b1cec4412/wme-sdk-plus.js
// @downloadURL https://update.greasyfork.org/scripts/538361/WME%20Suggest%20Permanent%20Hazards.user.js
// @updateURL https://update.greasyfork.org/scripts/538361/WME%20Suggest%20Permanent%20Hazards.meta.js
// ==/UserScript==

(async function() {
    'use strict'
    window.SDK_INITIALIZED.then(initialize)

    const STORAGE_KEY = 'WME_QuickMapCommentsNotes_Shortcuts'
    let sdk

    // — Default definitions with real callback refs ——————————
    const defaultDefs = [{
            shortcutId: 'create-railroad-crossing-note',
            description: 'Create Railroad Crossing Note',
            callback: createRailroadCrossingNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-school-zone-note',
            description: 'Create School Zone Note',
            callback: createSchoolZoneMapNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-sharp-curve-note',
            description: 'Create Sharp Curve Note',
            callback: createSharpCurveNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-complex-intersection-note',
            description: 'Create Complex Intersection Note',
            callback: createComplexIntersectionNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-multiple-lanes-merging-note',
            description: 'Create Multiple Lanes Merging Note',
            callback: createMultipleLanesMergingNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-speed-bump-note',
            description: 'Create Speed Bump Note',
            callback: createSpeedBumpMapNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-tollbooth-note',
            description: 'Create Tollbooth Note',
            callback: createTollboothNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-no-uturn-sign-present-note',
            description: 'Create No U-turn Sign Note',
            callback: createNoUTurnSignPresentMapNote,
            shortcutKeys: null
        },
        {
            shortcutId: 'create-aerials-ood-note',
            description: 'Create Aerials Out-of-Date Note',
            callback: createAerialsOODMapNote,
            shortcutKeys: null
        }
    ]
    const KeyModifiers = {
        1: "C",
        2: "S",
        3: "CS",
        4: "A",
        5: "AC",
        6: "AS",
        7: "ACS"
    };

    /**
     * Convert a WME-style "modMask,keyCode" string into human-readable form.
     * - If shortcutKeys is null → returns null.
     * - If it's not of the form "digits,digits" → returns it unchanged.
     * - Otherwise looks up the modifier and returns e.g. "S+85".
     *
     * @param {string|null} shortcutKeys
     * @returns {string|null}
     */
    function convertShortcutKeys(shortcutKeys) {
        // 1) null in → null out
        if (shortcutKeys == null) {
            return null;
        }

        // 2) if not "number,number", assume already human-readable
        if (!/^\d+,\d+$/.test(shortcutKeys)) {
            return shortcutKeys;
        }

        // 3) split mask + code, map the mask, join with '+'
        const [maskStr, keyCode] = shortcutKeys.split(",");
        const mask = parseInt(maskStr, 10);
        const modString = KeyModifiers[mask] || "";

        return modString ? `${modString}+${keyCode}` : keyCode;
    }

    async function initialize() {
        const wmeSdk = await getWmeSdk({
            scriptId: 'wme-quick-map-comments-notes',
            scriptName: 'WME Quick Map Comments/Notes'
        })
        const sdkPlus = await initWmeSdkPlus(wmeSdk, {
            hooks: ['DataModel.MapComments']
        })
        sdk = sdkPlus || wmeSdk

        console.log('wme-qmcn: initializing…')

        // load {id,description,shortcutKeys} list from localStorage
        let storedList = []
        try {
            storedList = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        } catch (e) {
            console.warn(
                'wme-qmcn: could not parse stored shortcuts, resetting to defaults'
            )
            storedList = []
        }

        const existingIds = sdk.Shortcuts
            .getAllShortcuts()
            .map(s => s.shortcutId)

        if (storedList.length) {
            console.log('wme-qmcn: importing stored shortcuts')
            for (const st of storedList) {
                const def = defaultDefs.find(d => d.shortcutId === st.shortcutId)
                if (!def) {
                    console.warn(`wme-qmcn: unknown shortcutId ${st.shortcutId}`)
                    continue
                }
                const toCreate = {
                    shortcutId: def.shortcutId,
                    description: def.description,
                    callback: def.callback,
                    shortcutKeys: convertShortcutKeys(st.shortcutKeys)
                }
                if (!existingIds.includes(def.shortcutId)) {
                    sdk.Shortcuts.createShortcut(toCreate)
                }
            }
        } else {
            console.log('wme-qmcn: no stored shortcuts, registering defaults')
            for (const def of defaultDefs) {
                if (!existingIds.includes(def.shortcutId)) {
                    sdk.Shortcuts.createShortcut(def)
                }
            }
        }

        // any time shortcuts change, persist the real current keys out of WME
        sdk.Events.on({
            eventName: 'wme-after-edit',
            eventHandler: storeShortcuts
        })
    }

    function storeShortcuts() {
        // grab all, filter to ours, then store real current shortcutKeys
        console.log("wme-qmcn: Storing shortcuts...");
        const ours = new Set(defaultDefs.map(d => d.shortcutId))
        const toStore = sdk.Shortcuts
            .getAllShortcuts()
            .filter(s => ours.has(s.shortcutId))
            .map(s => ({
                shortcutId: s.shortcutId,
                description: s.description,
                shortcutKeys: s.shortcutKeys
            }))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
    }

    // — Map-note helpers ——————————————————————————————————

    async function createRailroadCrossingNote() {
        const point = await sdk.Map.drawPoint()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: point,
            subject: 'Railroad Crossing',
            body: 'Add a railroad crossing permanent hazard here, once added, delete ' +
                'this map comment.'
        })
    }

    async function createSchoolZoneMapNote() {
        const polygon = await sdk.Map.drawPolygon()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: polygon,
            subject: 'School Zone',
            body: 'Name:\nSpeed Limit (optional):\nExclude Road Types (optional):\n' +
                'Schedule (optional):'
        })
    }

    async function createSharpCurveNote() {
        const point = await sdk.Map.drawPoint()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: point,
            subject: 'Sharp Curve',
            body: 'Add a sharp curve permanent hazard here, once added, delete this ' +
                'map comment.'
        })
    }

    async function createComplexIntersectionNote() {
        const point = await sdk.Map.drawPoint()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: point,
            subject: 'Complex Intersection',
            body: 'Add a complex intersection permanent hazard here, once added, delete ' +
                'this map comment.'
        })
    }

    async function createMultipleLanesMergingNote() {
        const point = await sdk.Map.drawPoint()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: point,
            subject: 'Multiple Lanes Merging',
            body: 'Add a multiple lanes merging permanent hazard here, once added, ' +
                'delete this map comment.'
        })
    }

    async function createSpeedBumpMapNote() {
        const point = await sdk.Map.drawPoint()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: point,
            subject: 'Speed Bump',
            body: 'Add a speed bump permanent hazard here, once added, delete this ' +
                'map comment.'
        })
    }

    async function createTollboothNote() {
        const point = await sdk.Map.drawPoint()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: point,
            subject: 'Tollbooth',
            body: 'Add a tollbooth permanent hazard here, once added, delete this ' +
                'map comment.'
        })
    }

    async function createNoUTurnSignPresentMapNote() {
        const point = await sdk.Map.drawPoint()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: point,
            subject: 'No U-turn Sign Present',
            body: 'There is a No U-turn sign here.'
        })
    }

    async function createAerialsOODMapNote() {
        const polygon = await sdk.Map.drawPolygon()
        await sdk.DataModel.MapComments.addMapComment({
            geometry: polygon,
            subject: 'Aerials Out of Date',
            body: 'Delete this map comment when aerials are updated.'
        })
    }
})()
