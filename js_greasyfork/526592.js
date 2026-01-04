// ==UserScript==
// @name         Blueprints
// @namespace    leeSalami.lss
// @version      1.0.1
// @description  Ermöglicht es Wachen-Blueprints zu setzen
// @author       leeSalami
// @match        https://*.leitstellenspiel.de
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js
// @downloadURL https://update.greasyfork.org/scripts/526592/Blueprints.user.js
// @updateURL https://update.greasyfork.org/scripts/526592/Blueprints.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const TIME_LIMIT = 30;
    const circleDistances = {
        0: '',
        50: '50 m',
        100: '100 m',
        150: '150 m',
        200: '200 m',
        250: '250 m',
        300: '300 m',
        500: '500 m',
        750: '750 m',
        1000: '1,0 km',
        1500: '1,5 km',
        2000: '2,0 km',
        2500: '2,5 km',
        3000: '3,0 km',
        4000: '4,0 km',
        5000: '5,0 km',
        7000: '7,0 km (BePo)',
        7500: '7,5 km',
        10000: '10,0 km',
        25000: '25,0 km',
        50000: '50,0 km',
        75000: '75,0 km',
        100000: '100,0 km'
    };
    const timeCalculationSteps = 16;
    let draggableCircle;
    let isochronePolygon;
    let isochroneGeoJson;
    let points = [];
    let setBuildingsCount = 0;
    const csrfToken = document.querySelector('meta[name="csrf-token"]');
    let buildingLatInput;
    let buildingLngInput;
    let buildingAddressInput;
    let buildingNameInput;
    let buildingTypeInput;
    let startVehicleFw;
    let dispatchCenterInput;
    let missionLatInput;
    let missionLngInput;
    let missionAddressInput;
    let missionTypeInput;

    const DISPATCH_CENTER = 23313652;
    const CENTER_POINT = L.latLng(41.90213056023241, -87.72559337317945);
    const ADDITIONAL_BUILDINGS = false;
    const BUILD = true;
    const BUILDING_CONFIG = {
        1010: {
            //11: 3, // Bepo
            //12: 1, // SEG
            6: 2, // Pol
            //2: 2, // RD
        },
        //2020: {
        //    4: 1, // KH
        //},
        //4040: {
        //    0: 1, // FW
            //9: 1, // THW
            //13: 1 // Pol-Heli
        //}
    };
    // TODO: Set additional = true for the second run!
    // const BUILDING_CONFIG = {
    //     1010: {
    //         // 11: 4, // Bepo
    //         // 12: 1, // SEG
    //         2: 1, // RD
    //     }
    // };
    // const BUILDING_CONFIG = {
    //     0: {
    //         8: 200 // POL-SCHULE
    //     }
    // };
    const POI_CONFIG = {
        333: [
            20, // Stadion
        ]
    };
    const buildingNameMapping = {
        0: 'FW',
        1: 'FW-SCHULE',
        2: 'RD',
        3: 'RD-SCHULE',
        4: 'KH',
        5: 'RTH',
        //6: 'POL',
        6: 'PI',
        7: 'LS',
        8: 'POL-SCHULE',
        9: 'THW',
        10: 'THW-SCHULE',
        11: 'BEPO',
        12: 'SEG',
        13: 'PH',
        14: 'BR',
        15: 'WR',
        17: 'POL SE',
        18: 'FW',
        19: 'POL',
        20: 'RW',
        21: 'Hund',
        24: 'RS',
        25: 'BW'
    };

    //massMissionMarkerAdd = () => {};
    //missionMarkerAdd = () => {};
    //missionMarkerAddSingle = () => {};

    // const db = await openDb();
    // await updateBuildings(db, 60);
    // const buildingCounts = {
    //     0: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(0)),
    //     2: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(2)),
    //     4: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(4)),
    //     6: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(6)),
    //     8: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(8)),
    //     9: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(9)),
    //     11: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(11)),
    //     12: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(12)),
    //     13: await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(13)),
    // };
    // console.log(buildingCounts)
    setCss();
    waitForElm('.leaflet-container').then(() => {
        loadBlueprintMarkers();
    });

    const observerBuildingStart = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(mutation => {
            if (!mutation.target.querySelector('#new_building') || !mutation.addedNodes.length) {
                return;
            }

            observerBuildingStart.disconnect();
            observerPoiStart.disconnect();
            observeBuilding(observerEnd);
            setBlueprintButton();
        });
    });

    const observerPoiStart = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(mutation => {
            if (!mutation.target.querySelector('#new_mission_position') || !mutation.addedNodes.length) {
                return;
            }

            observerBuildingStart.disconnect();
            observerPoiStart.disconnect();
            observeBuilding(observerEnd);
            setPoiButton();
        });
    });

    const observerEnd = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(mutation => {
            if ((!mutation.target.querySelector('#build_new_building') && !mutation.target.querySelector('#build_new_poi')) || !mutation.addedNodes.length) {
                return;
            }

            observerEnd.disconnect();
            observeBuilding(observerBuildingStart);
            observeBuilding(observerPoiStart);
        });
    });

    function observeBuilding(observer) {
        observer.observe(document.getElementById('buildings'), {
            childList: true,
        });
    }

    observeBuilding(observerBuildingStart);
    observeBuilding(observerPoiStart);

    function setCss() {
        const style = document.createElement('style');
        style.innerHTML = `
        .blueprint {
            opacity: 1;
        }
        
        .timing-cross-icon {
            font-size: 30px;
            background: none;
            border: none;
        }
    `;
        document.head.appendChild(style);
    }

    function setBlueprintButton() {
        document.getElementById('building_building_type')?.addEventListener('change', addBlueprintButtons)
    }

    async function setDraggableMarkerCircle(buildingType) {
        const marker = getDraggableMarker();

        if (marker === null) {
            return;
        }

        removePoints();
        draggableCircle?.remove();
        // isochronePolygon?.remove();
        // removeIsochroneAreaValue();

        if (buildingType === '') {
            return;
        }

        const latLng = marker.getLatLng();
        draggableCircle = L.circle(latLng, getSelectedRadius()).setStyle({
            color: '#3498db',
            opacity: 0.25
        }).addTo(map);

        const distance = 333;
        //removePoints();
        //let markersSet = await setPoints(latLng, distance);
        //markersSet += await setPoints(latLng, -distance);
        //console.log(markersSet);

        document.getElementById('building_back_button').addEventListener('click', () => {
            removePoints();
            draggableCircle?.remove();
            // isochronePolygon?.remove();
            // removeIsochroneAreaValue();
        });

        const buyElements = document.querySelectorAll('.building_build_costs_active > div > input');

        for (let i = 0, n = buyElements.length; i < n; i++) {
            buyElements[i].addEventListener('click', () => {
                removePoints();
                draggableCircle?.remove();
                // isochronePolygon?.remove();
                // removeIsochroneAreaValue();
            });
        }

        marker.on({
            'mousedown': () => {
                map.on('mousemove', async () => {
                    const distance = 333;
                    const latLng = marker.getLatLng();
                    draggableCircle.setLatLng(latLng);
                    //removePoints();
                    //await setPoints(latLng, distance);
                    //await setPoints(latLng, -distance);
                });
            }
        });

        // marker.on({
        //     'dragstart': () => {
        //         isochronePolygon?.remove();
        //         removeIsochroneAreaValue();
        //     }
        // });

        // marker.on({
        //     'dragend': () => {
        //         drawIsochrones(marker.getLatLng());
        //     }
        // });

        map.on('mouseup', () => {
            map.removeEventListener('mousemove');
        });
    }

    function removePoints() {
        for (let i = 0, n = points.length; i < n; i++) {
            points[i].remove();
        }

        points = [];
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    async function createPois() {
        const marker = getDraggableMarker();
        const originalLatLng = CENTER_POINT;
        marker.setLatLng(originalLatLng);

        for (const poiDistance in POI_CONFIG) {
            if (POI_CONFIG.hasOwnProperty(poiDistance)) {
                missionLatInput.value = originalLatLng.lat;
                missionLngInput.value = originalLatLng.lng;
                await setAddress(originalLatLng.lat, originalLatLng.lng, true);

                console.log([originalLatLng.lat, originalLatLng.lng])
                for (let i = 0, n = POI_CONFIG[poiDistance].length; i < n; i++) {
                    missionTypeInput.value = POI_CONFIG[poiDistance][i];
                    missionTypeInput.dispatchEvent(new Event('change', { bubbles: true }));
                    await createPoi(POI_CONFIG[poiDistance][i]);
                    setBuildingsCount++;
                }

                await setPoints(originalLatLng, poiDistance, 7000, POI_CONFIG[poiDistance], true);
                await setPoints(originalLatLng, -poiDistance, 7000, POI_CONFIG[poiDistance], true);
            }
        }
    }

    async function buildBuildings() {
        const marker = getDraggableMarker();
        const originalLatLng = CENTER_POINT
        marker.setLatLng(originalLatLng);

        for (const buildingDistance in BUILDING_CONFIG) {
            if (BUILDING_CONFIG.hasOwnProperty(buildingDistance)) {
                buildingLatInput.value = originalLatLng.lat;
                buildingLngInput.value = originalLatLng.lng;
                await setAddress(originalLatLng.lat, originalLatLng.lng);

                console.log([originalLatLng.lat, originalLatLng.lng])
                for (const buildingId in BUILDING_CONFIG[buildingDistance]) {
                    if (BUILDING_CONFIG[buildingDistance].hasOwnProperty(buildingId)) {
                        buildingTypeInput.value = buildingId;
                        buildingTypeInput.dispatchEvent(new Event('change', { bubbles: true }));
                        if (BUILD) {
                            await setBuilding(buildingId, BUILDING_CONFIG[buildingDistance][buildingId], ADDITIONAL_BUILDINGS);
                        }
                    }
                }

                await setPoints(originalLatLng, buildingDistance, 7000, BUILDING_CONFIG[buildingDistance]);
                await setPoints(originalLatLng, -buildingDistance, 7000, BUILDING_CONFIG[buildingDistance]);
            }
        }
    }

    async function setPoints(latLng, distance = 1010, circleRadius = 7000, buildingIds = [], poi = false) {
        let run = true;
        let diagonal = false;
        let horizontalInverted = false;
        let center = latLng;
        let previousLat = latLng.lat;
        let previousLng = latLng.lng;
        let newLat = latLng.lat;
        let newLng = latLng.lng;
        let isFirstRow = true;
        let diagonalsCount = Math.ceil(circleRadius / Math.abs(distance));
        let rowCount = diagonalsCount;
        let currentRowCount = 0;
        let currentDiagonalsCount = 0;
        let lastRow = false;
        let markersSet = 0;

        do {
            let verticalDistance = 0;
            let horizontalDistance = distance;

            if (diagonal) {
                diagonal = false;
                verticalDistance = (distance / 2) * Math.sqrt(3);
                horizontalDistance /= 2;

                if (currentDiagonalsCount >= diagonalsCount) {
                    lastRow = true;
                }
            }

            if (horizontalInverted) {
                horizontalDistance *= -1;
            }

            newLat = getNewLatitude(newLat, verticalDistance);
            newLng = getNewLongitude(newLng, newLat, horizontalDistance);
            const newLatLng = L.latLng(newLat, newLng);

            if (currentRowCount >= rowCount) {
                if (isFirstRow) {
                    rowCount *= 2;
                    isFirstRow = false;
                } else {
                    rowCount--;
                }

                newLat = previousLat;
                newLng = previousLng;
                currentRowCount = 0;
                currentDiagonalsCount++;
                diagonal = true;
                horizontalInverted = !horizontalInverted;
            } else {
                previousLat = newLat;
                previousLng = newLng;

                if (center.distanceTo(newLatLng) <= circleRadius - 500) {
                    const marker = L.marker(newLatLng, {'blueprint': true});
                    marker.addTo(map);
                    points.push(marker);
                    // L.circle(newLatLng, 4040).setStyle({color: '#3498db', opacity: 0.25}).addTo(map);
                    markersSet++;

                    if (BUILD) {
                        if (poi) {
                            missionLatInput.value = newLat;
                            missionLngInput.value = newLng;
                            await setAddress(newLat, newLng, true);
                            console.log([newLat, newLng])
                            for (let i = 0, n = buildingIds.length; i < n; i++) {
                                missionTypeInput.value = buildingIds[i];
                                missionTypeInput.dispatchEvent(new Event('change', { bubbles: true }));
                                await createPoi(buildingIds[i]);
                                setBuildingsCount++;

                                if (setBuildingsCount > 0 && setBuildingsCount % 200 === 0) {
                                    await new Promise(r => setTimeout(r, getRandomInt(6687, 15334)));
                                } else {
                                    await new Promise(r => setTimeout(r, getRandomInt(456, 786)));
                                }
                            }
                        } else {
                            buildingLatInput.value = newLat;
                            buildingLngInput.value = newLng;
                            await setAddress(newLat, newLng);
                            console.log([newLat, newLng])
                            for (const buildingId in buildingIds) {
                                if (buildingIds.hasOwnProperty(buildingId)) {
                                    buildingTypeInput.value = buildingId;
                                    buildingTypeInput.dispatchEvent(new Event('change', { bubbles: true }));
                                    await setBuilding(buildingId, buildingIds[buildingId], ADDITIONAL_BUILDINGS);
                                }
                            }
                        }
                    }
                }

                currentRowCount++;
            }

            if (lastRow && diagonal) {
                run = false;
            }

        } while (run);

        return markersSet;
    }

    async function setBuilding(typeId, amount, additional = false) {
        // let locationKey = 'JPN01';
        //
        // if (additional) {
        //     locationKey = 'JPN01X';
        // }

        if (typeId === '0') {
            startVehicleFw.value = '30';
            startVehicleFw.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            startVehicleFw.value = '';
            startVehicleFw.dispatchEvent(new Event('change', { bubbles: true }));
        }

        for (let i = 0; i < amount; i++) {
            // buildingCounts[typeId]++;
            buildingNameInput.value = buildingNameMapping[typeId] + ' Chicago';
            // buildingNameInput.value = buildingNameMapping[typeId] + '-' + leadingZeros(buildingCounts[typeId]) + '-' + locationKey;
            // buildingNameInput.value = buildingNameMapping[typeId] + '-' + leadingZeros(buildingCounts[typeId]);

            if (setBuildingsCount > 0 && setBuildingsCount % 200 === 0) {
                await new Promise(r => setTimeout(r, getRandomInt(45000, 55000)));
            } else {
                await new Promise(r => setTimeout(r, getRandomInt(633, 855)));
            }

            await createBuilding();
            setBuildingsCount++;
            console.log(setBuildingsCount)
        }
    }

    async function setAddress(latitude, longitude, poi = false) {
        const response = await fetch(`/reverse_address?latitude=${latitude}&longitude=${longitude}`, {
            headers: {
                'X-CSRF-Token': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            }
        });

        if (response.ok) {
            const address = (await response.text()).trim();
            if (poi) {
                missionAddressInput.value = address;
            } else {
                buildingAddressInput.value = address;
            }
        }
    }

    async function createBuilding() {
        const form = new FormData(document.getElementById('new_building'));

        const response = await fetch('/buildings', {
            headers: {
                'X-CSRF-Token': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (response.status >= 400) {
            const alertElement = document.createElement('div');
            alertElement.id = 'alert_building_creation';
            alertElement.className = 'alert alert-danger';
            alertElement.innerText = 'Fehler beim Erstellen des Gebäudes!';
            document.getElementById('select_building_type_step').parentElement.insertAdjacentElement('afterbegin', alertElement);
        }
    }

    async function createPoi() {
        const form = new FormData(document.getElementById('new_mission_position'));
        form.set('commit', 'Speichern');

        const response = await fetch('/mission_positions', {
            headers: {
                'X-CSRF-Token': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'POST',
            body: new URLSearchParams(form),
            redirect: 'manual'
        });

        if (response.status >= 400) {
            const alertElement = document.createElement('div');
            alertElement.id = 'alert_building_creation';
            alertElement.className = 'alert alert-danger';
            alertElement.innerText = 'Fehler beim Erstellen des POIs!';
            document.getElementById('new_mission_position').insertAdjacentElement('afterbegin', alertElement);
        }
    }

    function getNewLatitude(latitude, distance) {
        const earth = 6378.137,  //radius of the earth in kilometer
          pi = Math.PI,
          m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

        return latitude + (distance * m);
    }

    function getNewLongitude(longitude, latitude, distance) {
        const earth = 6378.137,  //radius of the earth in kilometer
          pi = Math.PI,
          cos = Math.cos,
          m = (1 / ((2 * pi / 360) * earth)) / 1000;  //1 meter in degree

        return longitude + (distance * m) / cos(latitude * (pi / 180));
    }

    function leadingZeros(number, maxLength = 5) {
        return String(number).padStart(maxLength, '0')
    }

    function drawIsochrones(latLng) {
        fetchIsochrones(latLng).then((result) => {
            isochroneGeoJson = result;
            setIsochroneAreaValue();
            isochronePolygon = L.geoJSON(result).addTo(map);
        });
    }

    async function fetchIsochrones(latLng) {
        const time = document.getElementById('blueprint_timing')?.value ?? '30';
        const location = {
            'lat': latLng.lat,
            'lon': latLng.lng
        }

        return await (await fetch(`http://localhost:8002/isochrone?json={"locations":${JSON.stringify([location])},"costing":"auto","costing_options":{"auto":{"shortest":true}},"contours":[{"time":${time / TIME_MODIFIER_SONDERRECHTE},"color":"3498db"}],"polygons":true}`)).json();
    }

    function setIsochroneAreaValue() {
        document.getElementById('blueprint_area_timing').value = new Intl.NumberFormat("de-DE", {
            maximumFractionDigits: 2,
        }).format(turf.area(isochroneGeoJson) / 1000000) + ' km²';
    }

    function removeIsochroneAreaValue() {
        document.getElementById('blueprint_area_timing').value = '';
    }

    function setPoiButton() {
        const poiButton = document.createElement('input');
        poiButton.className = 'btn btn-primary';
        poiButton.value = 'POIs setzen';
        poiButton.type = 'button';
        poiButton.style.color = '#fff';
        poiButton.addEventListener('click', createPoiMarker);

        document.getElementById('new_mission_position').querySelector(':scope > .form-actions > a[href="/buildings"]').insertAdjacentElement('afterend', poiButton);
    }

    async function addBlueprintButtons() {
        const blueprintButtonId = 'create_blueprint';
        const blueprintCircleDistanceId = 'blueprint_circle_distance_container';
        const timingAreaId = 'blueprint_timing_area_container';
        const timingId = 'blueprint_timing_container';
        const existingBlueprintButton = document.getElementById(blueprintButtonId);
        const existingBlueprintCircleDistanceContainer = document.getElementById(blueprintCircleDistanceId);
        const existingTimingAreaContainer = document.getElementById(timingAreaId);
        const existingTimingContainer = document.getElementById(timingId);

        if (existingBlueprintButton || existingBlueprintCircleDistanceContainer || existingTimingAreaContainer || existingTimingContainer) {
            return;
        }

        const currentBlueprintRadius = String(getSelectedRadius());
        const buildingTypeElement = document.getElementById('building_building_type');

        if (buildingTypeElement.value !== '') {
            const buyButtons = document.querySelectorAll('.building_build_costs');

            const blueprintButtonContainer = document.createElement('div');
            blueprintButtonContainer.className = 'building_build_costs building_build_costs_active';
            blueprintButtonContainer.id = blueprintButtonId;

            const blueprintButton = document.createElement('input');
            blueprintButton.className = 'btn btn-primary';
            blueprintButton.id = blueprintButtonId + '_button';
            blueprintButton.value = 'Blueprint setzen';
            blueprintButton.type = 'button';
            blueprintButton.style.color = '#fff';
            blueprintButton.addEventListener('click', createBlueprintMarker);

            const lastElement = Array.from(buyButtons).pop();
            blueprintButtonContainer.append(blueprintButton);
            lastElement.after(blueprintButtonContainer);

            const blueprintCircleDistanceContainer = document.createElement('div');
            blueprintCircleDistanceContainer.id = blueprintCircleDistanceId;

            const blueprintCircleDistanceSelectContainer = document.createElement('div');
            blueprintCircleDistanceSelectContainer.className = 'input-group select';
            blueprintCircleDistanceContainer.append(blueprintCircleDistanceSelectContainer);

            const blueprintCircleDistanceAddon = document.createElement('div');
            blueprintCircleDistanceAddon.className = 'input-group-addon';
            blueprintCircleDistanceSelectContainer.append(blueprintCircleDistanceAddon);

            const blueprintCircleDistanceLabel = document.createElement('label');
            blueprintCircleDistanceLabel.className = 'integer optional select';
            blueprintCircleDistanceLabel.setAttribute('for', 'blueprint_circle_distance');
            blueprintCircleDistanceLabel.textContent = 'Blueprint-Radius';
            blueprintCircleDistanceAddon.append(blueprintCircleDistanceLabel);

            const blueprintCircleSelect = document.createElement('select');
            blueprintCircleSelect.id = 'blueprint_circle_distance';
            blueprintCircleSelect.className = 'select optional form-control';
            blueprintCircleDistanceSelectContainer.append(blueprintCircleSelect);
            blueprintCircleSelect.addEventListener('change', async () => {
                await setDraggableMarkerCircle(buildingTypeElement.value);
            })

            let blueprintCircleOption;

            for (let distance in circleDistances) {
                blueprintCircleOption = document.createElement('option');
                blueprintCircleOption.value = distance;
                blueprintCircleOption.textContent = circleDistances[distance];

                if (currentBlueprintRadius === distance) {
                    blueprintCircleOption.selected = true;
                }

                blueprintCircleSelect.append(blueprintCircleOption);
            }

            const dispatchCenterElement = document.getElementById('select_building_dispatch_center_step');
            dispatchCenterElement.after(blueprintCircleDistanceContainer);

            const timingAreaContainer = document.createElement('div');
            timingAreaContainer.id = timingAreaId;

            const timingAreaInputContainer = document.createElement('div');
            timingAreaInputContainer.className = 'input-group string readonly';
            timingAreaContainer.append(timingAreaInputContainer);

            const timingAreaAddon = document.createElement('div');
            timingAreaAddon.className = 'input-group-addon';
            timingAreaInputContainer.append(timingAreaAddon);

            const timingAreaLabel = document.createElement('label');
            timingAreaLabel.className = 'string optional';
            timingAreaLabel.setAttribute('for', 'blueprint_area_timing');
            timingAreaLabel.textContent = `In ${TIME_LIMIT} Min. erreichbar`;
            timingAreaAddon.append(timingAreaLabel);

            const timingAreaInput = document.createElement('input');
            timingAreaInput.id = 'blueprint_area_timing';
            timingAreaInput.readOnly = true;
            timingAreaInput.className = 'string optional readonly form-control';
            timingAreaInputContainer.append(timingAreaInput);

            const timingContainer = document.createElement('div');
            timingContainer.id = timingId;

            const timingInputContainer = document.createElement('div');
            timingInputContainer.className = 'input-group string';
            timingContainer.append(timingInputContainer);

            const timingAddon = document.createElement('div');
            timingAddon.className = 'input-group-addon';
            timingInputContainer.append(timingAddon);

            const timingLabel = document.createElement('label');
            timingLabel.className = 'string optional';
            timingLabel.setAttribute('for', 'blueprint_timing');
            timingLabel.textContent = 'Zu erreichen in';
            timingAddon.append(timingLabel);

            const timingInput = document.createElement('input');
            timingInput.id = 'blueprint_timing';
            timingInput.className = 'string optional form-control';
            timingInput.value = TIME_LIMIT.toString();
            timingInputContainer.append(timingInput);

            const addressElement = document.getElementById('address_forms');
            addressElement.after(timingAreaContainer);
            addressElement.after(timingContainer);
        }

        await setDraggableMarkerCircle(buildingTypeElement.value);
    }

    function getSelectedRadius() {
        const selectElement = document.getElementById('blueprint_circle_distance');

        if (selectElement) {
            return parseInt(document.getElementById('blueprint_circle_distance').value);
        } else {
            return 0
        }
    }

    function loadBlueprintMarkers() {
        let markerDataParsed;

        GM.listValues().then((storedValues) => {
            storedValues.forEach((value) => {
                if (value.startsWith('blueprint-marker-')) {
                    GM.getValue(value, '{}').then((markerData) => {
                        markerDataParsed = JSON.parse(markerData);
                        if ('lat' in markerDataParsed) {
                            addBlueprintMarker(markerDataParsed.lat, markerDataParsed.lng, markerDataParsed.title, markerDataParsed.dispatchCenter, markerDataParsed.buildingType, markerDataParsed.startVehicle, markerDataParsed.radius, markerDataParsed.geoJson ?? null);
                        }
                    })
                }
            })
        });
    }

    async function createPoiMarker() {
        missionLatInput = document.getElementById('mission_position_latitude');
        missionLngInput = document.getElementById('mission_position_longitude');
        missionAddressInput = document.getElementById('mission_position_address');
        missionTypeInput = document.getElementById('mission_position_poi_type');
        await createPois();
    }

    async function createBlueprintMarker() {
        buildingLatInput = document.getElementById('building_latitude');
        buildingLngInput = document.getElementById('building_longitude');
        buildingAddressInput = document.getElementById('building_address');
        buildingNameInput = document.getElementById('building_name');
        buildingTypeInput = document.getElementById('building_building_type');
        startVehicleFw = document.getElementById('building_start_vehicle_feuerwache');
        dispatchCenterInput = document.getElementById('building_leitstelle_building_id');
        dispatchCenterInput.value = DISPATCH_CENTER.toString();
        dispatchCenterInput.dispatchEvent(new Event('change', { bubbles: true }));
        await buildBuildings();

        // const marker = getDraggableMarker();
        //
        // if (marker === null) {
        //     return;
        // }
        //
        // const buildingType = document.getElementById('building_building_type').value;
        // const titleElement = document.getElementById('building_name');
        // const dispatchCenter = document.getElementById('building_leitstelle_building_id').value;
        // const startVehicle = document.getElementById('building_start_vehicle_feuerwache').value;
        // const latLng = marker.getLatLng();
        // const radius = getSelectedRadius();
        // const newMarker = await addBlueprintMarker(latLng.lat, latLng.lng, titleElement.value, dispatchCenter, buildingType, startVehicle, radius, isochroneGeoJson);
        // storeMarker(newMarker);
        // buildingNameCounter(titleElement);
    }

    async function addBlueprintMarker(lat, lng, title, dispatchCenter, buildingType, startVehicle, radius, geoJson) {
        const icon = L.icon({
            iconUrl: OTHER_BUILDING_ICONS[buildingType],
            iconSize: [32, 37],
            iconAnchor: [16, 37]
        });
        const markerData = {icon: icon, title: title, dispatchCenter: dispatchCenter, buildingType: buildingType, startVehicle: startVehicle, radius: radius, geoJson: geoJson}
        const blueprintMarker = L.marker([lat, lng], markerData);
        const blueprintCircle = L.circle([lat, lng], radius).setStyle({color: '#c9302c', opacity: 0.25});
        // const blueprintIsochrone = L.geoJSON(geoJson, {
        //     style: {
        //         "color": "#c9302c",
        //         "opacity": 0.25
        //     },
        // }).addTo(map);

        blueprintMarker.bindTooltip(title);
        const grp = L.layerGroup([blueprintMarker, blueprintCircle]).addTo(map);
        blueprintMarker.on('contextmenu', () => {
            if (confirm('Blueprint "' + title + '" wirklich löschen?')) {
                grp.remove()
                removeMarker(blueprintMarker)
            }
        });

        blueprintMarker.on('click', async () => {
            await fillBuildWindow(lat, lng, markerData)
        });
        blueprintMarker._icon.classList.add('blueprint');

        return blueprintMarker;
    }

    async function fillBuildWindow(lat, lng, markerData) {
        const buildingTypeField = document.getElementById('building_building_type');
        const buildingNameField = document.getElementById('building_name');
        const buildingDispatchCenterField = document.getElementById('building_leitstelle_building_id');
        const marker = getDraggableMarker();

        if (buildingTypeField === null || buildingNameField === null || buildingDispatchCenterField === null || marker === null) {
            return;
        }

        if (markerData.startVehicle !== '') {
            const buildingStartVehicleField = document.getElementById('building_start_vehicle_feuerwache');

            if (buildingStartVehicleField !== null) {
                buildingStartVehicleField.value = markerData.startVehicle;
                buildingStartVehicleField.dispatchEvent(new Event('change', { bubbles: true }));

            }
        }

        buildingTypeField.value = markerData.buildingType;
        buildingTypeField.dispatchEvent(new Event('change', { bubbles: true }));

        buildingNameField.value = markerData.title;
        buildingNameField.dispatchEvent(new Event('change', { bubbles: true }));

        buildingDispatchCenterField.value = markerData.dispatchCenter;
        buildingDispatchCenterField.dispatchEvent(new Event('change', { bubbles: true }));

        marker.setLatLng([lat, lng]);
        await setDraggableMarkerCircle(markerData.buildingType);
        building_new_dragend(markerData.buildingType);
    }

    function getDraggableMarker() {
        let marker = null;

        map.eachLayer((layer) => {
            if (layer instanceof L.Marker && layer.options.draggable) {
                marker = layer;
            }
        });

        return marker;
    }

    function removeMarker(marker) {
        const json = getMarkerJson(marker)
        const markerId = getMarkerIdByJson(json)
        deleteStoredMarker(markerId)
    }

    function storeMarker(marker) {
        const json = getMarkerJson(marker)
        const markerId = getMarkerIdByJson(json)

        let existingValue;
        existingValue = getStoredMarker(markerId);

        if (!('lat' in existingValue)) {
            setStoredMarker(markerId, json);
        }
    }

    function getMarkerJson(marker) {
        const latLng = marker.getLatLng();
        const values = {
            lat: latLng.lat,
            lng: latLng.lng,
            title: marker.options.title,
            dispatchCenter: marker.options.dispatchCenter,
            buildingType: marker.options.buildingType,
            startVehicle: marker.options.startVehicle,
            radius: marker.options.radius,
            geoJson: marker.options.geoJson
        };

        return JSON.stringify(values);
    }

    function getMarkerIdByJson(json) {
        return 'blueprint-marker-' + cyrb53(json);
    }

    async function getStoredMarker(markerId) {
        return JSON.parse(await GM.getValue(markerId, '{}'));
    }

    function setStoredMarker(markerId, json) {
        GM.setValue(markerId, json);
    }

    function deleteStoredMarker(markerId) {
        GM.deleteValue(markerId);
    }

    function buildingNameCounter(element) {
        const regex = /(\d+)$/;
        const titleNumber = element.value.match(regex)

        if (titleNumber !== null) {
            const newNumber = String(parseInt(titleNumber[0]) + 1);
            const newNumberDigitCount = newNumber.length;
            let leadingZeroes = (titleNumber[0].match(/^0+/) || [''])[0];
            const oldNumberDigitCount = titleNumber[0].toString().length;
            leadingZeroes = leadingZeroes.substring(newNumberDigitCount - oldNumberDigitCount + leadingZeroes.length);
            const newTitleNumber = leadingZeroes + newNumber
            element.value = element.value.replace(regex, newTitleNumber);
        }
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    const cyrb53 = (str, seed = 0) => {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for(let i = 0, ch, n = str.length; i < n; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };
})();
