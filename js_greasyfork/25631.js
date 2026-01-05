// ==UserScript==
// @name            WME US Government Boundaries
// @namespace       https://greasyfork.org/users/45389
// @version         2025.10.13.000
// @description     Adds a layer to display US (federal, state, and/or local) boundaries.
// @author          MapOMatic
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require         https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require         https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @grant           GM_xmlhttpRequest
// @license         GNU GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @connect         census.gov
// @connect         wazex.us
// @connect         usps.com
// @connect         arcgis.com
// @connect         greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/25631/WME%20US%20Government%20Boundaries.user.js
// @updateURL https://update.greasyfork.org/scripts/25631/WME%20US%20Government%20Boundaries.meta.js
// ==/UserScript==

/* global turf */
/* global WazeWrap */
/* global bootstrap */

(async function main() {
    'use strict';

    const UPDATE_MESSAGE = 'When you click on the Zip code, you no longer have to type it in the USPS window.';
    const downloadUrl = 'https://greasyfork.org/scripts/25631-wme-us-government-boundaries/code/WME%20US%20Government%20Boundaries.user.js';

    const SETTINGS_STORE_NAME = 'wme_us_government_boundaries';
    // As of 8/8/2021, ZIP code tabulation areas are showing as 1/1/2020.
    const ZIPS_LAYER_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/2/';
    const COUNTIES_LAYER_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/State_County/MapServer/1/';
    const STATES_LAYER_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/Census2020/State_County/MapServer/0/';
    const TIME_ZONES_LAYER_URL = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Time_Zones/FeatureServer/0/';
    const USPS_ROUTE_COLORS = ['#f00', '#0a0', '#00f', '#a0a', '#6c82cb', '#0aa'];
    const USPS_ROUTES_URL_TEMPLATE = 'https://gis.usps.com/arcgis/rest/services/EDDM/selectNear/GPServer/routes/execute?f=json&env%3AoutSR=102100&'
        + 'Selecting_Features=%7B%22geometryType%22%3A%22esriGeometryPoint%22%2C%22features%22%3A%5B%7B%22'
        + 'geometry%22%3A%7B%22x%22%3A{lon}%2C%22y%22%3A{lat}%2C%22spatialReference%22%3A%7B%22wkid%22%3A'
        + '102100%2C%22latestWkid%22%3A3857%7D%7D%7D%5D%2C%22sr%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid'
        + '%22%3A3857%7D%7D&Distance={radius}&Rte_Box=R&userName=EDDM';
    const USPS_ROUTES_RADIUS = 0.5; // miles

    // Min zoom caps to prevent displaying too many zip and county boundaries (overload user's browser)
    const MIN_COUNTIES_ZOOM = 9;
    const MIN_ZIPS_ZOOM = 12;
    const ZOOM_GRANULARITY = {
        22: 5,
        21: 5,
        20: 5,
        19: 5,
        18: 5,
        17: 5,
        16: 5,
        15: 10,
        14: 15,
        13: 30,
        12: 80,
        11: 120,
        10: 300,
        9: 1000,
        8: 2000,
        7: 3000,
        6: 5000,
        5: 12000,
        4: 20000
    };

    const PROCESS_CONTEXTS = [];
    const ZIP_CITIES = {};
    const sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl } });
    const ZIPS_LAYER_NAME = 'US Gov\'t Boundaries - Zip Codes';
    const COUNTIES_LAYER_NAME = 'US Gov\'t Boundaries - Counties';
    const STATES_LAYER_NAME = 'US Gov\'t Boundaries - States';
    const TIME_ZONES_LAYER_NAME = 'US Gov\'t Boundaries - Time Zones';
    const USPS_ROUTES_LAYER_NAME = 'USPS Routes';

    const zipsLayerCheckboxName = 'USGB - Zip codes';
    const countiesLayerCheckboxName = 'USGB - Counties';
    const statesLayerCheckboxName = 'USGB - States';
    const timeZonesLayerCheckboxName = 'USGB - Time zones';
    let _$uspsResultsDiv;
    let _$getRoutesButton;
    let _settings = {};

    function log(message) {
        console.log('USGB:', message);
    }
    function logDebug(message) {
        console.log('USGB:', message);
    }
    function logError(message) {
        console.error('USGB:', message);
    }

    // Recursively checks the settings object and fills in missing properties from the
    // default settings object.
    function checkSettings(obj, defaultObj) {
        Object.keys(defaultObj).forEach(key => {
            if (!obj.hasOwnProperty(key)) {
                obj[key] = defaultObj[key];
            } else if (defaultObj[key] && (defaultObj[key].constructor === {}.constructor)) {
                checkSettings(obj[key], defaultObj[key]);
            }
        });
    }

    function loadSettings() {
        const loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
        const defaultSettings = {
            lastVersion: null,
            layers: {
                zips: { visible: true, dynamicLabels: false },
                states: { visible: true, dynamicLabels: false },
                counties: { visible: true, dynamicLabels: true },
                timeZones: { visible: true, dynamicLabels: true }
            }
        };
        if (loadedSettings) {
            _settings = loadedSettings;
            checkSettings(_settings, defaultSettings);
        } else {
            _settings = defaultSettings;
        }
    }

    function saveSettings() {
        if (localStorage) {
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(_settings));
            log('Settings saved');
        }
    }

    function getUrl(baseUrl, extent, zoom, outFields) {
        const extentLeftBottom = turf.toMercator([extent[0], extent[1]]);
        const extentRightTop = turf.toMercator([extent[2], extent[3]]);
        const geometry = {
            xmin: extentLeftBottom[0],
            ymin: extentLeftBottom[1],
            xmax: extentRightTop[0],
            ymax: extentRightTop[1],
            spatialReference: { wkid: 102100, latestWkid: 3857 }
        };
        const geometryStr = JSON.stringify(geometry);
        let url = `${baseUrl}query?geometry=${encodeURIComponent(geometryStr)}`;
        url += '&returnGeometry=true';
        url += `&outFields=${encodeURIComponent(outFields.join(','))}`;
        url += `&maxAllowableOffset=${ZOOM_GRANULARITY[sdk.Map.getZoomLevel()]}`;
        // url += '&quantizationParameters={tolerance:100}'; // Don't do this.  It returns relative coordinates.
        url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outSR=3857&f=json';
        return url;
    }

    function appendCityToZip(zip, cityState, context) {
        if (!context.cancel) {
            if (!cityState.error) {
                ZIP_CITIES[zip] = cityState;
                $('#zip-text').append(` (${cityState.city}, ${cityState.state})`);
            }
        }
    }

    // The SDK doesn't have a way to retrieve features from a layer (yet), so store them here
    // so they can be referenced later.
    let lastZipFeatures;
    let lastCountyFeatures;
    function updateNameDisplay(context) {
        const center = sdk.Map.getMapCenter();
        const mapCenter = turf.point([center.lon, center.lat]);
        let text = '';
        let label;

        if (context.cancel) return;
        if (_settings.layers.zips.visible) {
            const onload = res => appendCityToZip(text, $.parseJSON(res.responseText), res.context);
            for (let i = 0; i < lastZipFeatures.length; i++) {
                const feature = lastZipFeatures[i];

                if (turf.booleanPointInPolygon(mapCenter, feature)) {
                    // Substr removes leading ZWJ from the ZIP code label. ZWJ needed to fix map display of ZIP codes with leading zeros.
                    text = feature.properties.name.substr(1);
                    $('<span>', { id: 'zip-text' }).empty().css({ display: 'inline-block' }).append(
                        $('<a>', { href: `https://tools.usps.com/zip-code-lookup.htm?citybyzipcode&mode=byZip&zip=${text}`, target: '__blank', title: 'Look up USPS zip code' })
                            .text(text)
                            .css({
                                color: 'white',
                                display: 'inline-block',
                                cursor: 'pointer',
                                'text-decoration': 'underline'
                            })
                    ).appendTo($('#zip-boundary'));
                    if (!context.cancel) {
                        if (ZIP_CITIES[text]) {
                            appendCityToZip(text, ZIP_CITIES[text], context);
                        } else {
                            GM_xmlhttpRequest({
                                url: `https://wazex.us/zips/ziptocity2.php?zip=${text}`, context, method: 'GET', onload
                            });
                        }
                    }
                }
            }
        }
        if (_settings.layers.counties.visible) {
            for (let i = 0; i < lastCountyFeatures.length; i++) {
                const feature = lastCountyFeatures[i];
                if (turf.booleanPointInPolygon(mapCenter, feature)) {
                    label = feature.properties.name;
                    $('<span>', { id: 'county-text' }).css({ display: 'inline-block' })
                        .text(label)
                        .appendTo($('#county-boundary'));
                }
            }
        }
    }

    /**
 * Separates a polygon into the main outer ring (with holes) and additional external rings using spatial checks.
 * @param {Object} boundary - An ArcGIS polygon feature (GeoJSON format expected).
 * @param {Object} attributes - An object containing attributes.
 * @returns {Array} - Array of GeoJSON Polygon features (outer polygon with holes, and external polygons).
 */
    function extractPolygonsWithExternalRings(boundary, attributes) {
        const coordinates = boundary.geometry.rings;
        const externalPolygons = [];

        const e = sdk.Map.getMapExtent();
        const width = e[2] - e[0];
        const height = e[3] - e[1];
        const expandBy = 2;
        const clipBox = [
            e[0] - width * expandBy,
            e[1] - height * expandBy,
            e[2] + width * expandBy,
            e[3] + height * expandBy
        ];
        const clipPolygon = turf.bboxPolygon(clipBox);

        let mainOuterPolygon = null;
        // First ring is assumed to be the main outer ring
        mainOuterPolygon = turf.toWgs84(turf.polygon([coordinates[0]], attributes));
        mainOuterPolygon.id = 0;

        // Process additional rings
        for (let i = 1; i < coordinates.length; i++) {
            const testPolygon = turf.toWgs84(turf.polygon([coordinates[i]]));

            if (turf.booleanContains(mainOuterPolygon, testPolygon)) {
                // If the main polygon contains the ring, it's a hole
                mainOuterPolygon = turf.difference(turf.featureCollection([mainOuterPolygon, testPolygon]));
                mainOuterPolygon.id = 0;
            } else {
                testPolygon.properties = attributes;
                externalPolygons.push(testPolygon);
            }
        }

        const clippedPolygons = [];
        [mainOuterPolygon, ...externalPolygons].forEach(polygon => {
            const clippedFeature = turf.intersect(turf.featureCollection([polygon, clipPolygon]));
            if (clippedFeature) {
                switch (clippedFeature.geometry.type) {
                    case 'Polygon':
                        clippedPolygons.push(clippedFeature);
                        break;
                    case 'MultiPolygon':
                        clippedFeature.geometry.coordinates.forEach(ring => clippedPolygons.push(turf.polygon(ring)));
                        break;
                    default:
                        throw new Error('Unexpected feature type');
                }
            }
        });
        clippedPolygons
            .filter(polygon => polygon.geometry.coordinates.length)
            .forEach(polygon => {
                polygon.id = 0;
                polygon.properties = attributes;
            });

        // Return an array with the main outer polygon and additional external polygons
        return clippedPolygons;
    }

    function getLabelPoints(feature) {
        const e = sdk.Map.getMapExtent();
        const screenPolygon = turf.polygon([[
            [e[0], e[3]], [e[2], e[3]], [e[2], e[1]], [e[0], e[1]], [e[0], e[3]]
        ]]);
        const intersection = turf.intersect(turf.featureCollection([screenPolygon, feature]));
        const polygons = [];
        if (intersection) {
            switch (intersection.geometry.type) {
                case 'Polygon':
                    polygons.push(intersection);
                    break;
                case 'MultiPolygon':
                    intersection.geometry.coordinates.forEach(ring => polygons.push(turf.polygon(ring)));
                    break;
                default:
                    throw new Error('Unexpected geometry type');
            }
        }

        const screenArea = turf.area(screenPolygon);
        const points = polygons
            .filter(polygon => {
                // Only include labels on polygons that are large enough
                const polygonArea = turf.area(polygon);
                return polygonArea / screenArea > 0.005;
            })
            .map(polygon => {
                let point = turf.centerOfMass(polygon);
                if (!turf.booleanPointInPolygon(point, polygon)) {
                    point = turf.pointOnFeature(polygon);
                }
                point.properties = { type: 'label', label: feature.properties.name };
                point.id = 0;
                return point;
            });
        return points;
    }

    let pointCount;
    let reducedPointCount;
    function processBoundaries(boundaries, context, type, nameField) {
        let layerName;
        let layerSettings;
        let zoomLevel;

        pointCount = 0;
        reducedPointCount = 0;
        switch (type) {
            case 'zip':
                layerSettings = _settings.layers.zips;
                layerName = ZIPS_LAYER_NAME;
                // Append ZWJ character to label to prevent OpenLayers from dropping leading zeros in ZIP codes.
                boundaries.forEach(boundary => {
                    const zipzone = `‍${boundary.attributes[nameField]}`;
                    boundary.attributes[nameField] = `${zipzone}`;
                });
                break;
            case 'county':
                layerSettings = _settings.layers.counties;
                layerName = COUNTIES_LAYER_NAME;
                break;
            case 'state':
                zoomLevel = sdk.Map.getZoomLevel();
                layerSettings = _settings.layers.states;
                layerName = STATES_LAYER_NAME;
                if (zoomLevel < 5) {
                    layerSettings.dynamicLabels = false;
                    boundaries.forEach(boundary => {
                        boundary.attributes[nameField] = '';
                    });
                } else if (zoomLevel <= 6) {
                    layerSettings.dynamicLabels = false;
                } else if (zoomLevel <= 11) {
                    layerSettings.dynamicLabels = true;
                } else if (zoomLevel <= 15) {
                    layerSettings.dynamicLabels = true;
                } else {
                    layerSettings.dynamicLabels = true;
                    boundaries.forEach(boundary => {
                        boundary.attributes[nameField] = '';
                    });
                }
                break;
            case 'timeZone':
                layerSettings = _settings.layers.timeZones;
                layerName = TIME_ZONES_LAYER_NAME;
                boundaries.forEach(boundary => {
                    let zone = boundary.attributes[nameField];
                    if (zone >= 0) zone = `+${zone}`;
                    boundary.attributes[nameField] = `UTC${zone}`;
                });
                break;
            default:
                throw new Error('USGB: Unexpected type argument in processBoundaries');
        }

        const allFeatures = [];
        if (context.cancel || !layerSettings.visible) {
            // do nothing
        } else {
            const ext = sdk.Map.getMapExtent();
            const screenPolygon = turf.polygon([[
                [ext[0], ext[3]], [ext[2], ext[3]], [ext[2], ext[1]], [ext[0], ext[1]], [ext[0], ext[3]]
            ]]);
            const screenArea = turf.area(screenPolygon);
            sdk.Map.removeAllFeaturesFromLayer({ layerName });
            if (!context.cancel) {
                boundaries.forEach(boundary => {
                    const attributes = {
                        name: boundary.attributes[nameField],
                        label: boundary.attributes[nameField],
                        type
                    };

                    if (!context.cancel) {
                        const features = extractPolygonsWithExternalRings(boundary, attributes);
                        if (features.length) {
                            if (type === 'zip' || type === 'county') {
                                allFeatures.push(...features);
                            }
                            features.forEach(polygon => {
                                if (layerSettings.dynamicLabels) {
                                    polygon.properties.label = '';
                                } else {
                                    // Only include labels on polygons that are large enough
                                    const polygonArea = turf.area(polygon);
                                    if (polygonArea / screenArea <= 0.005) {
                                        polygon.properties.label = '';
                                    }
                                }
                            });
                            try {
                                sdk.Map.addFeaturesToLayer({ layerName, features });
                                // console.log('OK: ', features);
                            } catch (ex) {
                                console.log('FAIL: ', features);
                                // console.log(JSON.stringify(features[0]));
                            }
                            if (layerSettings.dynamicLabels) {
                                const allLabels = [];
                                features.forEach(feature => {
                                    const labels = getLabelPoints(feature);
                                    if (labels?.length) {
                                        allLabels.push(...labels);
                                    }
                                });
                                if (allLabels.length) {
                                    sdk.Map.addFeaturesToLayer({ layerName, features: allLabels });
                                }
                            }
                        }
                    }
                });
            }
        }

        if (type === 'zip') {
            lastZipFeatures = allFeatures;
        } else if (type === 'county') {
            lastCountyFeatures = allFeatures;
        }

        context.callCount--;
        if (context.callCount === 0) {
            updateNameDisplay(context);
            const idx = PROCESS_CONTEXTS.indexOf(context);
            if (idx > -1) {
                PROCESS_CONTEXTS.splice(idx, 1);
            }
        }

        if (sdk.State.getUserInfo().userName === 'MapOMatic') {
            logDebug(`${type} points: ${pointCount} -> ${reducedPointCount} (${((1.0 - reducedPointCount / pointCount) * 100).toFixed(1)}%)`);
        }
    }

    function getUspsRoutesUrl(lon, lat, radius) {
        return USPS_ROUTES_URL_TEMPLATE.replace('{lon}', lon).replace('{lat}', lat).replace('{radius}', radius);
    }

    function getUspsCircleFeature() {
        let center = sdk.Map.getMapCenter();
        center = [center.lon, center.lat];
        const radius = USPS_ROUTES_RADIUS;
        const options = {
            steps: 72,
            units: 'miles',
            properties: { type: 'circle' }
        };
        return turf.circle(center, radius, options);
    }

    function processUspsRoutesResponse(res) {
        const data = $.parseJSON(res.responseText);
        const routes = data.results[0].value.features;

        const zipRoutes = {};
        routes.forEach(route => {
            const id = `${route.attributes.CITY_STATE} ${route.attributes.ZIP_CODE}`;
            let zipRoute = zipRoutes[id];
            if (!zipRoute) {
                zipRoute = { paths: [] };
                zipRoutes[id] = zipRoute;
            }
            zipRoute.paths = zipRoute.paths.concat(route.geometry.paths);
        });

        const features = [];
        _$uspsResultsDiv.empty();

        const routeCount = Object.keys(zipRoutes).length;
        Object.keys(zipRoutes).forEach((zipName, routeIdx) => {
            const route = zipRoutes[zipName];
            const color = USPS_ROUTE_COLORS[routeIdx];
            const feature = turf.toWgs84(turf.multiLineString(route.paths), { type: 'route', color, zIndex: routeCount - routeIdx - 1 });

            const lineStrings = feature.geometry.coordinates.map(coords => {
                const ls = turf.lineString(coords, { type: 'route', color, zIndex: routeCount - routeIdx - 1 });
                ls.id = 'route';
                return ls;
            });
            features.push(...lineStrings);

            _$uspsResultsDiv.append($('<div>').text(zipName).css({ color, fontWeight: 'bold' }));
            routeIdx++;
        });
        _$getRoutesButton.removeAttr('disabled').css({ color: '#000' });
        sdk.Map.addFeaturesToLayer({ layerName: USPS_ROUTES_LAYER_NAME, features });
    }

    function fetchUspsRoutesFeatures() {
        const centerLonLat = sdk.Map.getMapCenter();
        const centerPoint = turf.toMercator(turf.point([centerLonLat.lon, centerLonLat.lat]));
        const url = getUspsRoutesUrl(
            centerPoint.geometry.coordinates[0],
            centerPoint.geometry.coordinates[1],
            USPS_ROUTES_RADIUS
        );

        _$getRoutesButton.attr('disabled', 'true').css({ color: '#888' });
        _$uspsResultsDiv.empty().append('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>');
        sdk.Map.removeAllFeaturesFromLayer({ layerName: USPS_ROUTES_LAYER_NAME });
        GM_xmlhttpRequest({ url, onload: processUspsRoutesResponse, anonymous: true });
    }

    function fetchBoundaries() {
        if (PROCESS_CONTEXTS.length > 0) {
            PROCESS_CONTEXTS.forEach(context => { context.cancel = true; });
        }

        const extent = sdk.Map.getMapExtent();
        const zoom = sdk.Map.getZoomLevel();
        let url;
        const context = { callCount: 0, cancel: false };
        PROCESS_CONTEXTS.push(context);
        $('.us-boundary-region').remove();
        $('.location-info-region').after(
            $('<div>', { id: 'county-boundary', class: 'us-boundary-region' })
                .css({ color: 'white', float: 'left', marginLeft: '10px' }),
            $('<div>', { id: 'zip-boundary', class: 'us-boundary-region' })
                .css({ color: 'white', float: 'left', marginLeft: '10px' })
        );
        if (_settings.layers.zips.visible) {
            if (zoom > MIN_ZIPS_ZOOM) {
                url = getUrl(ZIPS_LAYER_URL, extent, zoom, ['ZCTA5']);
                context.callCount++;
                $.ajax({
                    url,
                    context,
                    method: 'GET',
                    datatype: 'json',
                    success(data) {
                        if (data.error) {
                            logError(`ZIP codes layer: ${data.error.message}`);
                        } else {
                            processBoundaries(data.features, this, 'zip', 'ZCTA5', 'ZCTA5');
                        }
                    }
                });
            } else {
                // clear zips if zoomed out too far
                processBoundaries([], context, 'zip', 'ZCTA5', 'ZCTA5');
            }
        }
        if (_settings.layers.counties.visible) {
            if (zoom > MIN_COUNTIES_ZOOM) {
                url = getUrl(COUNTIES_LAYER_URL, extent, zoom, ['NAME']);
                context.callCount++;
                $.ajax({
                    url,
                    context,
                    method: 'GET',
                    datatype: 'json',
                    success(data) {
                        if (data.error) {
                            logError(`counties layer: ${data.error.message}`);
                        } else {
                            processBoundaries(data.features, this, 'county', 'NAME', 'NAME');
                        }
                    }
                });
            } else {
                // clear counties if zoomed out too far
                processBoundaries([], context, 'county', 'NAME', 'NAME');
            }
        }
        if (_settings.layers.timeZones.visible) {
            url = getUrl(TIME_ZONES_LAYER_URL, extent, zoom, ['ZONE']);
            context.callCount++;
            $.ajax({
                url,
                context,
                method: 'GET',
                datatype: 'json',
                success(data) {
                    if (data.error) {
                        logError(`timezones layer: ${data.error.message}`);
                    } else {
                        processBoundaries(data.features, this, 'timeZone', 'ZONE', 'ZONE');
                    }
                }
            });
        }
        if (_settings.layers.states.visible) {
            url = getUrl(STATES_LAYER_URL, extent, zoom, ['NAME']);
            context.callCount++;
            $.ajax({
                url,
                context,
                method: 'GET',
                datatype: 'json',
                success(data) {
                    if (data.error) {
                        logError(`states layer: ${data.error.message}`);
                    } else {
                        processBoundaries(data.features, this, 'state', 'NAME', 'NAME');
                    }
                }
            });
        }
    }

    function onLayerCheckboxToggled(args) {
        let layerName;
        let settingsObj;
        switch (args.name) {
            case zipsLayerCheckboxName:
                layerName = ZIPS_LAYER_NAME;
                settingsObj = _settings.layers.zips;
                break;
            case countiesLayerCheckboxName:
                layerName = COUNTIES_LAYER_NAME;
                settingsObj = _settings.layers.counties;
                break;
            case statesLayerCheckboxName:
                layerName = STATES_LAYER_NAME;
                settingsObj = _settings.layers.states;
                break;
            case timeZonesLayerCheckboxName:
                layerName = TIME_ZONES_LAYER_NAME;
                settingsObj = _settings.layers.timeZones;
                break;
            default:
                throw new Error('Unexpected layer switcher checkbox name.');
        }
        const visibility = args.checked;
        settingsObj.visible = visibility;
        saveSettings();
        sdk.Map.setLayerVisibility({ layerName, visibility });
        fetchBoundaries();
    }

    function onDynamicLabelsCheckboxChanged(settingName, checkboxId) {
        _settings.layers[settingName].dynamicLabels = $(`#${checkboxId}`).is(':checked');
        saveSettings();
        fetchBoundaries();
    }

    function onGetRoutesButtonClick() {
        fetchUspsRoutesFeatures();
    }

    function onGetRoutesButtonMouseEnter() {
        _$getRoutesButton.css({ color: '#00a' });
        const feature = getUspsCircleFeature();
        feature.id = 'uspsCircle';
        sdk.Map.addFeatureToLayer({ layerName: USPS_ROUTES_LAYER_NAME, feature });
    }

    function onGetRoutesButtonMouseLeave() {
        _$getRoutesButton.css({ color: '#000' });
        sdk.Map.removeFeatureFromLayer({ layerName: USPS_ROUTES_LAYER_NAME, featureId: 'uspsCircle' });
    }

    function onClearRoutesButtonClick() {
        sdk.Map.removeAllFeaturesFromLayer({ layerName: USPS_ROUTES_LAYER_NAME });
        _$uspsResultsDiv.empty();
    }

    function onMapMoveEnd() {
        try {
            fetchBoundaries();
        } catch (e) {
            logError(e);
        }
    }

    function showScriptInfoAlert() {
        WazeWrap.Interface.ShowScriptUpdate(
            GM_info.script.name,
            GM_info.script.version,
            UPDATE_MESSAGE,
            '',
            'https://www.waze.com/discuss/t/115019'
        );
    }

    function initCountiesLayer() {
        sdk.Map.addLayer({
            layerName: COUNTIES_LAYER_NAME,
            styleContext: {
                getLabel: context => {
                    const zoom = sdk.Map.getZoomLevel();
                    const { label } = context.feature.properties;
                    if (zoom <= 9) {
                        return label.replace(/\s(County|Parish)/, '');
                    }
                    return label;
                },
                getFontSize: () => {
                    const zoom = sdk.Map.getZoomLevel();
                    if (zoom <= 9) {
                        return '16px';
                    }
                    return '18px';
                },
                getStrokeWidth: () => {
                    const zoom = sdk.Map.getZoomLevel();
                    if (zoom <= 9) {
                        return 3;
                    }
                    return 6;
                }
            },
            styleRules: [
                {
                    style: {
                        strokeColor: 'pink',
                        strokeOpacity: 1,
                        strokeWidth: '${getStrokeWidth}',
                        strokeDashstyle: 'solid',
                        fillOpacity: 0,
                        pointRadius: 0,
                        label: '${getLabel}',
                        fontSize: '${getFontSize}',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        fontColor: 'pink',
                        labelOutlineColor: 'black',
                        labelOutlineWidth: 2
                    }
                }
            ]
        });
    }

    function initStatesLayer() {
        sdk.Map.addLayer({
            layerName: STATES_LAYER_NAME,
            styleContext: {
                getStrokeWidth: () => {
                    const zoomLevel = sdk.Map.getZoomLevel();
                    if (zoomLevel < 5) {
                        return 1;
                    }
                    if (zoomLevel <= 6) {
                        return 3;
                    }
                    if (zoomLevel <= 11) {
                        return 2;
                    }
                    if (zoomLevel <= 15) {
                        return 3;
                    }
                    return 4;
                },
                getFontSize: () => {
                    const zoomLevel = sdk.Map.getZoomLevel();
                    if (zoomLevel < 5) {
                        return '14px';
                    }
                    if (zoomLevel <= 11) {
                        return '16px';
                    }
                    return '18px';
                },
                getLabelYOffset: () => {
                    const zoomLevel = sdk.Map.getZoomLevel();
                    if (zoomLevel <= 9) {
                        return 0;
                    }
                    return 20;
                },
                getLabel: context => {
                    const zoomLevel = sdk.Map.getZoomLevel();
                    if (zoomLevel < 5 || zoomLevel > 15) {
                        return '';
                    }
                    return context.feature.properties.label;
                }
            },
            styleRules: [
                {
                    predicate: properties => properties.type === 'label',
                    style: {
                        pointRadius: 0,
                        fontSize: '${getFontSize}',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        fontColor: 'blue',
                        label: '${getLabel}',
                        labelYOffset: '${getLabelYOffset}',
                        labelOutlineColor: 'lightblue',
                        labelOutlineWidth: 2
                    }
                },
                {
                    predicate: properties => properties.type === 'state',
                    style: {
                        strokeColor: 'blue',
                        strokeOpacity: 1,
                        strokeWidth: '${getStrokeWidth}',
                        strokeDashstyle: 'solid',
                        fillOpacity: 0
                    }
                }
            ]
        });
    }

    function initZipsLayer() {
        sdk.Map.addLayer({
            layerName: ZIPS_LAYER_NAME,
            styleContext: {
                getLabel: context => context.feature.properties.label
            },
            styleRules: [
                {
                    style: {
                        pointRadius: 0,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1,
                        strokeWidth: 3,
                        strokeDashstyle: 'solid',
                        fillOpacity: 0,
                        fontSize: '16px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        fontColor: 'red',
                        label: '${getLabel}',
                        labelYOffset: -20,
                        labelOutlineColor: 'white',
                        labelOutlineWidth: 2
                    }
                }
            ]
        });
    }

    function initTimeZonesLayer() {
        sdk.Map.addLayer({
            layerName: TIME_ZONES_LAYER_NAME,
            styleContext: {
                getLabel: context => context.feature.properties.label
            },
            styleRules: [
                {
                    style: {
                        pointRadius: 0,
                        strokeColor: '#f85',
                        strokeOpacity: 1,
                        strokeWidth: 6,
                        strokeDashstyle: 'solid',
                        fillOpacity: 0,
                        fontSize: '18px',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        fontColor: '#f85',
                        label: '${getLabel}',
                        labelYOffset: -40,
                        labelOutlineColor: '#831',
                        labelOutlineWidth: 2
                    }
                }
            ]
        });
    }

    function initLayers() {
        initZipsLayer();
        initCountiesLayer();
        initStatesLayer();
        initTimeZonesLayer();

        sdk.Map.addLayer({
            layerName: USPS_ROUTES_LAYER_NAME,
            styleContext: {
                getStrokeWidth: context => {
                    const zoom = sdk.Map.getZoomLevel();
                    let width = zoom < 3 ? 10 + 2 * zoom : 16;
                    width += context.feature.properties.zIndex * 6;
                    return width;
                },
                getStrokeColor: context => context.feature.properties.color
            },
            styleRules: [
                {
                    predicate: properties => properties.type === 'route',
                    style: {
                        strokeWidth: '${getStrokeWidth}',
                        strokeColor: '${getStrokeColor}'
                    }
                },
                {
                    predicate: properties => properties.type === 'circle',
                    style: {
                        strokeWidth: 6,
                        strokeColor: '#ff0',
                        fillColor: '#ff0',
                        fillOpacity: 0.2
                    }
                }
            ]
        });

        sdk.Map.setLayerOpacity({ layerName: ZIPS_LAYER_NAME, opacity: 0.6 });
        sdk.Map.setLayerOpacity({ layerName: COUNTIES_LAYER_NAME, opacity: 0.6 });
        sdk.Map.setLayerOpacity({ layerName: STATES_LAYER_NAME, opacity: 0.6 });
        sdk.Map.setLayerOpacity({ layerName: TIME_ZONES_LAYER_NAME, opacity: 0.6 });
        sdk.Map.setLayerOpacity({ layerName: USPS_ROUTES_LAYER_NAME, opacity: 0.8 });

        sdk.Map.setLayerVisibility({ layerName: ZIPS_LAYER_NAME, visibility: _settings.layers.zips.visible });
        sdk.Map.setLayerVisibility({ layerName: COUNTIES_LAYER_NAME, visibility: _settings.layers.counties.visible });
        sdk.Map.setLayerVisibility({ layerName: STATES_LAYER_NAME, visibility: _settings.layers.states.visible });
        sdk.Map.setLayerVisibility({ layerName: TIME_ZONES_LAYER_NAME, visibility: _settings.layers.timeZones.visible });

        const zIndex = sdk.Map.getLayerZIndex({ layerName: 'roads' }) - 2;
        sdk.Map.setLayerZIndex({ layerName: USPS_ROUTES_LAYER_NAME, zIndex });

        // HACK to get around conflict with URO+.  If URO+ is fixed, this can be replaced with the setLayerIndex line above.
        const checkLayerZIndex = () => {
            if (sdk.Map.getLayerZIndex({ layerName: USPS_ROUTES_LAYER_NAME }) !== zIndex) {
                sdk.Map.setLayerZIndex({ layerName: USPS_ROUTES_LAYER_NAME, zIndex });
            }
        };
        setInterval(() => { checkLayerZIndex(); }, 100);
        // END HACK

        // SDK: (not a blocking issue) FR to set checkbox state when adding instead of having to setLayerChekboxChecked immediately: https://issuetracker.google.com/issues/412712079
        // Add the layer checkbox to the Layers menu.
        sdk.LayerSwitcher.addLayerCheckbox({ name: statesLayerCheckboxName });
        sdk.LayerSwitcher.setLayerCheckboxChecked({ name: statesLayerCheckboxName, isChecked: _settings.layers.states.visible });
        sdk.LayerSwitcher.addLayerCheckbox({ name: countiesLayerCheckboxName });
        sdk.LayerSwitcher.setLayerCheckboxChecked({ name: countiesLayerCheckboxName, isChecked: _settings.layers.counties.visible });
        sdk.LayerSwitcher.addLayerCheckbox({ name: zipsLayerCheckboxName });
        sdk.LayerSwitcher.setLayerCheckboxChecked({ name: zipsLayerCheckboxName, isChecked: _settings.layers.zips.visible });
        sdk.LayerSwitcher.addLayerCheckbox({ name: timeZonesLayerCheckboxName });
        sdk.LayerSwitcher.setLayerCheckboxChecked({ name: timeZonesLayerCheckboxName, isChecked: _settings.layers.timeZones.visible });

        sdk.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: onLayerCheckboxToggled });

        // _zipsLayer.events.register('visibilitychanged', null, onZipsLayerVisibilityChanged);
        // _countiesLayer.events.register('visibilitychanged', null, onCountiesLayerVisibilityChanged);
        // _statesLayer.events.register('visibilitychanged', null, onStatesLayerVisibilityChanged);
        // _timeZonesLayer.events.register('visibilitychanged', null, onTimeZonesLayerVisibilityChanged);

        sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: onMapMoveEnd });
    }

    function initTab() {
        const $content = $('<div>').append(
            $('<fieldset>', { style: 'border:1px solid silver;padding:8px;border-radius:4px;' }).append(
                $('<legend>', { style: 'margin-bottom:0px;borer-bottom-style:none;width:auto;' }).append(
                    $('<h4>').text('ZIP Codes')
                ),
                $('<div>', { class: 'controls-container', style: 'padding-top:0px' }).append(
                    $('<input>', { type: 'checkbox', id: 'usgb-zips-dynamicLabels' }),
                    $('<label>', { for: 'usgb-zips-dynamicLabels' }).text('Dynamic label positions')
                )
            ),
            $('<fieldset>', { style: 'border:1px solid silver;padding:8px;border-radius:4px;' }).append(
                $('<legend>', { style: 'margin-bottom:0px;borer-bottom-style:none;width:auto;' }).append(
                    $('<h4>').text('Counties')
                ),
                $('<div>', { class: 'controls-container', style: 'padding-top:0px' }).append(
                    $('<input>', { type: 'checkbox', id: 'usgb-counties-dynamicLabels' }),
                    $('<label>', { for: 'usgb-counties-dynamicLabels' }).text('Dynamic label positions')
                )
            ),
            $('<fieldset>', { style: 'border:1px solid silver;padding:8px;border-radius:4px;' }).append(
                $('<legend>', { style: 'margin-bottom:0px;borer-bottom-style:none;width:auto;' }).append(
                    $('<h4>').text('Time zones')
                ),
                $('<div>', { class: 'controls-container', style: 'padding-top:0px' }).append(
                    $('<input>', { type: 'checkbox', id: 'usgb-timezones-dynamicLabels' }),
                    $('<label>', { for: 'usgb-timezones-dynamicLabels' }).text('Dynamic label positions')
                )
            ),
            $('<div>').append(
                $('<span>', { style: 'font-style: italic; white-space: pre-line' })
                    .text('Notes:'
                        + '\n- ZIP code boundaries are rough approximations because '
                        + 'ZIP codes are not actually areas. Prefer the "Get USPS routes" '
                        + 'feature whenever possible.'
                        + '\n- Time zone boundaries are rough approximations, '
                        + 'and may not display properly above zoom level 5.')
            )
        );

        WazeWrap.Interface.Tab('USGB', $content.html(), () => {
            $('#usgb-zips-dynamicLabels').prop('checked', _settings.layers.zips.dynamicLabels).change(() => {
                onDynamicLabelsCheckboxChanged('zips', 'usgb-zips-dynamicLabels');
            });
            $('#usgb-counties-dynamicLabels').prop('checked', _settings.layers.counties.dynamicLabels).change(() => {
                onDynamicLabelsCheckboxChanged('counties', 'usgb-counties-dynamicLabels');
            });
            $('#usgb-timezones-dynamicLabels').prop('checked', _settings.layers.counties.dynamicLabels).change(() => {
                onDynamicLabelsCheckboxChanged('timeZones', 'usgb-timezones-dynamicLabels');
            });
        }, null);
    }

    function onSelectionChanged() {
        const container = $('#usps-routes-container');
        const selection = sdk.Editing.getSelection();
        if (selection?.objectType === 'segment') {
            container.show();
        } else {
            container.hide();
        }
    }

    function initUspsRoutes() {
        _$uspsResultsDiv = $('<div>', { id: 'usps-route-results', style: 'margin-top:3px;' });
        _$getRoutesButton = $('<button>', { id: 'get-usps-routes', style: 'height:23px;' }).text('Get USPS routes');
        // TODO: 2022-11-22 - This is temporary to determine which parent element to add the div to, depending on beta or production WME.
        // Remove once new side panel is pushed to production.
        const $parent = $('wz-navigation-item').length > 0 ? $('#edit-panel > div.contents') : $('#user-info > div.flex-parent');
        $parent.prepend( // '#user-info > div.flex-parent'
            $('<div>', { id: 'usps-routes-container', style: 'margin-left:10px;margin-top:5px;' }).append(
                _$getRoutesButton
                    .click(onGetRoutesButtonClick)
                    .mouseenter(onGetRoutesButtonMouseEnter)
                    .mouseout(onGetRoutesButtonMouseLeave),
                $('<button>', { id: 'clear-usps-routes', style: 'height:23px; margin-left:4px;' })
                    .text('Clear')
                    .click(onClearRoutesButtonClick),
                _$uspsResultsDiv
            )
        );
        document.addEventListener('wme-selection-changed', onSelectionChanged);
    }

    function init() {
        loadSettings();
        initLayers();
        initTab();
        showScriptInfoAlert();
        fetchBoundaries();
        initUspsRoutes();
        log('Initialized.');
    }

    init();
}());
