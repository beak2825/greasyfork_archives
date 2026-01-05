/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
// ==UserScript==
// @name            WME Split POI
// @namespace       https://greasyfork.org/fr/scripts/13008-wme-split-poi
// @description     Split POI with a new seg
// @description:fr  Découpage d'un POI en deux en utisant un nouveau segment
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/editor*
// @include         https://beta.waze.com/*/editor*
// @exclude         https://www.waze.com/user*
// @exclude         https://www.waze.com/*/user*
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require         https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// eslint-disable-next-line max-len
// @icon            data:image/png;base64,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
// @author          seb-d59, WazeDev (2023-?)
// @version         2025.05.08.000
// @license         GPLv3
// @grant           GM_xmlhttpRequest
// @connect         greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/13008/WME%20Split%20POI.user.js
// @updateURL https://update.greasyfork.org/scripts/13008/WME%20Split%20POI.meta.js
// ==/UserScript==

/* global WazeWrap */
/* global getWmeSdk */
/* global turf */

(function main() {
    'use strict';

    const DEBUG = false;
    const SCRIPT_VERSION = GM_info.script.version;
    const SCRIPT_NAME = GM_info.script.name;
    const DOWNLOAD_URL = 'https://greasyfork.org/scripts/13008-wme-split-poi/code/WME%20Split%20POI.user.js';
    const MINIMUM_AREA = 500.0;

    let sdk;

    function bootstrap() {
        if (unsafeWindow.getWmeSdk && WazeWrap.Ready) {
            initialize();
        } else {
            setTimeout(bootstrap, 100);
        }
    }

    function getId(node) {
        return document.getElementById(node);
    }

    function log(msg, obj) {
        if (obj == null) {
            console.log(`WME Split POI v${SCRIPT_VERSION} - ${msg}`);
        } else if (DEBUG) {
            console.debug(`WME Split POI v${SCRIPT_VERSION} - ${msg} `, obj);
        }
    }

    function initialize() {
        log('init');
        sdk = getWmeSdk({ scriptId: 'wmeSplitPOI', scriptName: 'WME Split POI' });
        startScriptUpdateMonitor();
        initializeWazeObjects();
    }

    function startScriptUpdateMonitor() {
        let updateMonitor;
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            // Report, but don't stop if ScriptUpdateMonitor fails.
            console.error(`${SCRIPT_NAME}:`, ex);
        }
    }

    function onSelectionChanged(tries = 0) {
        if (tries === 30) return;
        try {
            const venue = getSelectedAreaVenue();
            if (!venue) return;

            // const landmarkPoi = '(NATURAL_FEATURES|ISLAND|SEA_LAKE_POOL|RIVER_STREAM|FOREST_GROVE|FARM|CANAL|SWAMP_MARSH|DAM|PARK)';
            // if (new RegExp(landmarkPoi).test(attributes.categories) === false) return;

            const editPanel = getId('edit-panel');
            if (editPanel.firstElementChild.style.display === 'none') {
                window.setTimeout(onSelectionChanged, 100, ++tries);
                return;
            }

            // ok: 1 selected item and panel is shown

            // On verifie que le segment est éditable
            if (!sdk.DataModel.Venues.hasPermissions({ venueId: venue.id })) return;

            // Exclude gas station and EVCS categories (don't ever want to delete those by splitting):
            if (venue.categories.some(cat => ['GAS_STATION', 'CHARGING_STATION'].includes(cat))) return;

            if (!$('#split-poi-button').length) {
                let addAfter = true;
                let insertAtElement = document.querySelector('.geometry-type-control-area');
                if (!insertAtElement) {
                    insertAtElement = document.querySelector('.external-providers-control');
                    if (!insertAtElement) {
                        setTimeout(onSelectionChanged, 100, ++tries);
                        return;
                    }
                    addAfter = false;
                }
                const WMESP_Controle = document.createElement('wz-button');
                WMESP_Controle.color = 'secondary';
                WMESP_Controle.size = 'sm';
                WMESP_Controle.id = 'split-poi-button';
                WMESP_Controle.className = 'geometry-type-control-button geometry-type-control-point';
                WMESP_Controle.innerHTML = '<i class="fa fa-cut" style="font-size:24px;" title="Split POI"></i>';
                if (addAfter) {
                    insertAtElement.after(WMESP_Controle);
                } else {
                    insertAtElement.before(WMESP_Controle);
                }
                WMESP_Controle.onclick = onSplitPoiButtonClick;
            }
        } catch (ex) {
            console.error('Split POI:', ex);
        }
    }

    function initializeWazeObjects() {
        sdk.Events.on({
            eventName: 'wme-selection-changed',
            eventHandler: () => setTimeout(onSelectionChanged, 0)
        });
        // call OnSelectionChanged once to catch selected venue in PL
        onSelectionChanged();
    }

    // This will return null if more than one object is selected
    function getSelectedAreaVenue() {
        const selection = sdk.Editing.getSelection();
        if (selection?.ids.length !== 1 || selection.objectType !== 'venue') return null;
        const venue = sdk.DataModel.Venues.getById({ venueId: selection.ids[0] });
        if (venue.geometry.type !== 'Polygon') return null;
        return venue;
    }

    // function cloneAttribute(venue, attrName, newAttributesObject) {
    //     if (venue.attributes.hasOwnProperty(attrName)) {
    //         let value = venue.attributes[attrName];

    //         if (Array.isArray(value)) {
    //             value = value.slice(0); // copy array
    //         }
    //         newAttributesObject[attrName] = venue.attributes[attrName];
    //     }
    // }

    function cloneVenue(venue, newGeometry) {
        const cloneId = sdk.DataModel.Venues.addVenue({
            // SDK: Update this if/when more attributes are available.
            category: venue.categories[0],
            geometry: newGeometry
        }).toString(); // toString is needed because a string is expected later
        const address = sdk.DataModel.Venues.getAddress({ venueId: venue.id });
        sdk.DataModel.Venues.updateAddress({ venueId: cloneId, houseNumber: address.houseNumber, streetId: address.street?.id });
        sdk.DataModel.Venues.updateVenue({
            venueId: cloneId,
            aliases: venue.aliases,
            openingHours: venue.openingHours,
            phone: venue.phone,
            services: venue.services,
            url: venue.url
        });
        // const clonePoi = new LandmarkVectorFeature({ geoJSONGeometry: W.userscripts.toGeoJSONGeometry(newGeometry) });
        // [
        //     'aliases',
        //     'categories',
        //     'description',
        //     'entryExitPoints',
        //     'externalProviderIDs',
        //     'houseNumber',
        //     'lockRank',
        //     'name',
        //     'openingHours',
        //     'phone',
        //     'services',
        //     'streetID',
        //     'url'
        // ].forEach(attrName => cloneAttribute(poi, attrName, clonePoi.attributes));
        // if (clonePoi.attributes.name) clonePoi.attributes.name += ` (copy ${nameSuffixIndex})`; // IMPORTANT! Won't save for some reason without changing the names (at least for PLAs).
        // if (poi.attributes.categoryAttributes.PARKING_LOT) {
        //     clonePoi.attributes.categoryAttributes.PARKING_LOT = JSON.parse(JSON.stringify(poi.attributes.categoryAttributes.PARKING_LOT));
        // }

        // const WazeActionAddLandmark = require('Waze/Action/AddLandmark');
        // actions.push(new WazeActionAddLandmark(clonePoi));

        // const street = W.model.streets.getObjectById(poi.attributes.streetID);
        // const streetName = street.attributes.name;
        // const cityID = street.attributes.cityID;
        // const city = W.model.cities.getObjectById(cityID);
        // const stateID = city.attributes.stateID;
        // const countryID = city.attributes.countryID;
        // const houseNumber = poi.attributes.houseNumber;
        // if (!street.attributes.isEmpty || !city.attributes.isEmpty) { // nok
        //     const newAtts = {
        //         emptyStreet: street.attributes.isEmpty, // TODO: fix this
        //         stateID,
        //         countryID,
        //         cityName: city.attributes.name,
        //         houseNumber,
        //         streetName,
        //         emptyCity: city.attributes.isEmpty // TODO: fix this
        //     };
        //     const updateAddressAction = new UpdateFeatureAddressAction(clonePoi, newAtts);
        //     updateAddressAction.options.updateHouseNumber = true;
        //     actions.push(updateAddressAction);
        // }
    }

    // function confirmBeforeSplitting(venue) {
    //     // SDK: FR submitted to add venue attribues
    //     const entryExitPointsLen = venue.attributes.entryExitPoints?.length;
    //     const imagesLen = venue.attributes.images?.length;
    //     const extProvidersLen = venue.attributes.externalProviderIDs?.length;
    //     let warningText = 'WARNING: The original place will be deleted!';

    //     if (imagesLen) {
    //         warningText += '\n\nThe following property(s) will be lost:';
    //         if (imagesLen) warningText += `\n • ${imagesLen} photo${imagesLen === 1 ? '' : 's'} (permanently deleted after saving)`;
    //     }
    //     warningText += '\n\nThe following properties likely need to be changed after splitting:';
    //     warningText += '\n • name ("copy #" will be appended)';
    //     if (entryExitPointsLen) warningText += `\n • ${entryExitPointsLen} entry/exit point${entryExitPointsLen === 1 ? '' : 's'}`;
    //     if (extProvidersLen) warningText += `\n • ${extProvidersLen} linked Google place${extProvidersLen === 1 ? '' : 's'}`;
    //     warningText += '\n\nReview <i>all</i> properties of both new places before saving.';
    //     warningText += '\n';
    //     return new Promise(resolve => {
    //         WazeWrap.Alerts.confirm(
    //             SCRIPT_NAME,
    //             warningText,
    //             () => resolve(true),
    //             () => resolve(false)
    //         );
    //     });
    // }

    async function onDrawLineFinished(line, venue) {
        // if (!await confirmBeforeSplitting(venue)) return;

        const intersections = turf.lineIntersect(venue.geometry, line);
        if (intersections.features.length === 0) {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'The cut line must intersect the place\'s geometry.');
            return;
        }

        if (intersections.features.length % 2) {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'The cut line cannot begin or end inside the place\'s geometry and it cannot cross itself.');
            return;
        }

        // const newPolygons = createTwoPolygonsFromIntersectPoints(venue, intersectPoints);
        // if (newPolygons[0].getArea() < MINIMUM_AREA || newPolygons[1].getArea() < MINIMUM_AREA) {
        //     WazeWrap.Alerts.error(SCRIPT_NAME, 'New area place would be too small. Move the temporary road segment.');
        //     return;
        // }
        unsafeWindow.intersections = intersections;
        unsafeWindow.line = line;
        unsafeWindow.poly = venue.geometry;
        console.log(intersections.features.length === 2);
        const venuePolygon = venue.geometry;
        const newPolygons = [];
        const cutResults1 = cutPolygon(venuePolygon, line, 1);
        if (cutResults1) {
            newPolygons.push(...cutResults1);
        }
        const cutResults2 = cutPolygon(venuePolygon, line, -1);
        if (cutResults2) {
            newPolygons.push(...cutResults2);
        }

        if (newPolygons.some(poly => { console.log(turf.area(poly)); return turf.area(poly) < MINIMUM_AREA; })) {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'At least one of the new polygons would be too small to appear in the app.');
            return;
        }

        let largest;
        newPolygons.forEach(polygon => {
            const area = turf.area(polygon);
            if (!largest || area > largest.area) {
                largest = { polygon, area };
            }
        });

        newPolygons.forEach(polygon => {
            if (polygon === largest.polygon) {
                sdk.DataModel.Venues.updateVenue({ venueId: venue.id, geometry: polygon.geometry });
            } else {
                cloneVenue(venue, polygon.geometry);
            }
        });
    }

    function onSplitPoiButtonClick() {
        const venue = getSelectedAreaVenue();
        if (!venue) return;

        // This is needed in case the category is changed to GS or EVCS and the split button is still there.
        if (venue.categories.some(cat => ['GAS_STATION', 'CHARGING_STATION'].includes(cat))) {
            WazeWrap.Alerts.error(SCRIPT_NAME, 'Cannot split gas stations or EV charging stations');
            return;
        }

        sdk.Map.drawLine().then(line => {
            onDrawLineFinished(line, venue);

            // const confirm = await confirmBeforeSplitting(venue);
            // if (confirm) {
            //     const actions = [];
            //     addClonePoiAction(venue, newPolygons[0], 1, actions);
            //     addClonePoiAction(venue, newPolygons[1], 2, actions);

            //     actions.push(new DeleteSegmentAction(seg));
            //     const multiaction = new MultiAction(actions, { description: 'Split POI' });
            //     W.model.actionManager.add(multiaction);
            // }
        }).catch(ex => {
            if (ex instanceof sdk.Errors.InvalidStateError) {
                // log, but ignore it
                console.log(ex);
            } else {
                console.error(ex);
            }
        });
    }

    function cutPolygon(polygon, cutLine, direction) {
        let j;
        const polyCoords = [];
        const cutPolyGeoms = [];

        if ((polygon.type !== 'Polygon') || (cutLine.type !== 'LineString')) return null;

        const intersectPoints = turf.lineIntersect(polygon, cutLine);
        const nPoints = intersectPoints.features.length;
        if ((nPoints === 0) || ((nPoints % 2) !== 0)) return null;

        const offsetLine = turf.lineOffset(cutLine, (0.01 * direction), { units: 'kilometers' });

        for (j = 0; j < cutLine.coordinates.length; j++) {
            polyCoords.push(cutLine.coordinates[j]);
        }
        for (j = (offsetLine.geometry.coordinates.length - 1); j >= 0; j--) {
            polyCoords.push(offsetLine.geometry.coordinates[j]);
        }
        polyCoords.push(cutLine.coordinates[0]);
        const thickLineString = turf.lineString(polyCoords);
        const thickLinePolygon = turf.lineToPolygon(thickLineString);

        polygon = turf.feature(polygon);
        const clipped = turf.difference(turf.featureCollection([polygon, thickLinePolygon]));
        for (j = 0; j < clipped.geometry.coordinates.length; j++) {
            const polyg = turf.polygon(clipped.geometry.coordinates[j]);
            const overlap = turf.lineOverlap(polyg, cutLine, { tolerance: 0.005 });
            if (overlap.features.length > 0) {
                cutPolyGeoms.push(polyg.geometry.coordinates);
            }
        }

        let result = null;
        if (cutPolyGeoms.length === 1) {
            result = [turf.polygon(cutPolyGeoms[0])];
        } else if (cutPolyGeoms.length > 1) {
            result = cutPolyGeoms.map(geometry => turf.polygon(geometry));
        }
        return result;
    }

    bootstrap();
})();
