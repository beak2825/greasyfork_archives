// ==UserScript==
// @name         Performanceoptimierer
// @namespace    leeSalami.lss
// @version      0.1
// @license      MIT
// @description  Optimiert die Performance in verschiedenen Bereichen der Hauptansicht. Die einzelnen Optimierungen können über die Konstanten am Anfang des Skripts (de-)aktiviert werden.
// @author       leeSalami
// @match        https://*.leitstellenspiel.de
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/517200/Performanceoptimierer.user.js
// @updateURL https://update.greasyfork.org/scripts/517200/Performanceoptimierer.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Deaktiviert den Funk komplett
    const RADIO_DISABLED = false;

    // Zeigt nur FMS 5, 8 und 9
    const RADIO_ONLY_IMPORTANT_FMS = true;

    // Deaktiviert den Allianzfunk vollständig
    const RADIO_DISABLE_ALLIANCE = true;

    // Blendet Allianzgebäude aus
    const BUILDINGS_HIDE_ALLIANCE = true;

    // Blendet Gebäude von Allianzmitgliedern aus
    const BUILDINGS_HIDE_ALLIANCE_MEMBERS = true;

    // Löscht abgeschlossene Missionen vollständig aus der Missionsliste
    const MISSIONS_DELETE_FULLY = true;

    // Verbessert das initiale Laden der Missionen und reduziert das Einfrieren des Spiels
    const MISSIONS_IMPROVE_INITIAL_LOADING = true;

    // Deaktiviert eigene Fahrzeuge auf der Karte
    const VEHICLES_HIDE_OWN = true;

    // Deaktiviert Fahrzeuge von Allianzmitgliedern auf der Karte
    const VEHICLES_HIDE_ALLIANCE_MEMBERS = true;

    const vehicleDriveOrig = vehicleDrive;
    vehicleDrive = (vehicle) => {
        if ((VEHICLES_HIDE_OWN && user_id === vehicle.user_id) || (VEHICLES_HIDE_ALLIANCE_MEMBERS && user_id !== vehicle.user_id)) {
            return;
        }
        vehicleDriveOrig(vehicle);
    }

    if (MISSIONS_IMPROVE_INITIAL_LOADING) {
        async function handleMission(e, n, i, t){
            const s = identifyTargetForNative(e);
            !1 === n.has(s) && n.set(s, document.createDocumentFragment());
            processMissionElement(e, n.get(s), i), t.set(e.id, e);
        }

        async function handleAppendMission(e, t) {
            document.getElementById(t).appendChild(e);
        }

        async function handleMissionMarkerAdd(e) {
            let t = mission_markers_per_id.get(e.id);
            void 0 === t || (isMapKitMap() ? map.addAnnotation(t) : t.addTo(map_filters_service.getFilterLayerByMissionParams(e)), missionMarkerAdd(e));
        }

        massMissionMarkerAdd = async (missions) => {
            let t = new Map;
            const template = document.createElement('template');
            const missionMap = new Map;

            for (let i = 0, n = missions.length; i < n; i++) {
                await handleMission(missions[i], missionMap, template, t);
                if (i % 200 === 0) {
                    await new Promise(r => setTimeout(r, 0));
                }
            }

            let count = 0;
            missionMap.forEach((async (e, t) => {
                count++;
                await handleAppendMission(e, t);
                if (count > 200) {
                    count = 0;
                    await new Promise(r => setTimeout(r, 0));
                }
            }))

            count = 0;
            for (let e of t.values()) {
                count++;
                await handleMissionMarkerAdd(e);
                if (count > 15) {
                    count = 0;
                    await new Promise(r => setTimeout(r, 0));
                }
            }

            tutorial.callNewMissionListener(!0), '' !== $(document.getElementById('search_input_field_missions')).val() && searchMission(), t = null;
        }
    }

    const missionDeleteOrig = missionDelete;
    missionDelete = (missionId) => {
        missionDeleteOrig(missionId);
        if (MISSIONS_DELETE_FULLY) {
            document.getElementById('mission_' + missionId)?.remove();
        }
    }

    const building_maps_draw_orig = building_maps_draw;
    building_maps_draw = (building) => {
        if ((BUILDINGS_HIDE_ALLIANCE && building.user_id === null) || (BUILDINGS_HIDE_ALLIANCE_MEMBERS && user_id !== building.user_id)) {
            return;
        }
        building_maps_draw_orig(building);
    }

    const buildingMarkerAddOrig = buildingMarkerAdd;
    buildingMarkerAdd = (building) => {
        if ((BUILDINGS_HIDE_ALLIANCE && building.user_id === null) || (BUILDINGS_HIDE_ALLIANCE_MEMBERS && user_id !== building.user_id)) {
            return;
        }
        buildingMarkerAddOrig(building);
    }

    const radioMessageOrig = radioMessage;
    radioMessage = (message) => {
        if (RADIO_DISABLED) {
            return;
        }

        if ((RADIO_ONLY_IMPORTANT_FMS && message.fms !== 5 && message.fms !== 8 && message.fms !== 9) || (RADIO_DISABLE_ALLIANCE && user_id !== message.user_id)) {
            document.querySelector('.radio_message_vehicle_' + message.id)?.remove();
            return;
        }
        radioMessageOrig(message);
    }
})();
