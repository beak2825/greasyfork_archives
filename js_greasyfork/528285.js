// ==UserScript==
// @name         Gebäudebauer
// @namespace    leeSalami.lss
// @version      1.0.3
// @description  Ermöglicht das spezifische Bauen von Gebäuden
// @author       leeSalami
// @license      All Rights Reserved
// @match        https://*.leitstellenspiel.de
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js?v=1
// @downloadURL https://update.greasyfork.org/scripts/528285/Geb%C3%A4udebauer.user.js
// @updateURL https://update.greasyfork.org/scripts/528285/Geb%C3%A4udebauer.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const DISPATCH_CENTER = '';
    const CENTER_POINT = L.latLng(51.502055331694564, -0.1058911556204038);
    const RADIUS = 7000;
    const BUILDING_CONFIG = {
        1010: {
            2: 2, // RD
            6: 2, // POL
            11: 3, // Bepo
            12: 1, // SEG
        },
        2020: {
            4: 1, // KH
        },
        4040: {
            0: 1, // FW
            13: 1, // Pol-Heli
        }
    };
    const BUILDING_NAME_MAPPING = {
        0: 'FW',
        1: 'FW-SCHULE',
        2: 'RW',
        3: 'RD-SCHULE',
        4: 'KKH',
        5: 'RTH',
        6: 'PI',
        7: 'LS',
        8: 'POL-SCHULE',
        9: 'THW',
        10: 'THW-SCHULE',
        11: 'BePo',
        12: 'SEG',
        13: 'Polizei Hubschrauber',
        14: 'BR',
        15: 'WR',
        16: 'JVA',
        17: 'POL SE',
        18: 'FW',
        19: 'POL',
        20: 'RW',
        21: 'Hund',
        24: 'RS',
        25: 'BW',
        26: 'SN',
        27: 'SN-SCHULE',
        28: 'SNH'
    };
    const BUILD_AS_ALLIANCE = false;

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    if (!csrfToken) {
        return;
    }

    let setBuildingsCount = 0;
    let buildingLatInput;
    let buildingLngInput;
    let buildingAddressInput;
    let buildingNameInput;
    let buildingTypeInput;
    let startVehicleFw;
    let dispatchCenterInput;
    let retries;
    const db = await openDb();
    await updateBuildings(db, 60);
    const buildingCounts = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0,
        21: 0,
        22: 0,
        23: 0,
        24: 0,
        25: 0,
        26: 0,
        27: 0,
        28: 0,
    };

    const observerBuildingStart = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(mutation => {
            if (!mutation.target.querySelector('#new_building') || !mutation.addedNodes.length) {
                return;
            }

            observerBuildingStart.disconnect();
            observeBuilding(observerEnd);
            setBuildButton();
        });
    });

    const observerEnd = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(mutation => {
            if (!mutation.target.querySelector('#build_new_building') || !mutation.addedNodes.length) {
                return;
            }

            observerEnd.disconnect();
            observeBuilding(observerBuildingStart);
        });
    });

    function observeBuilding(observer) {
        observer.observe(document.getElementById('buildings'), {
            childList: true,
        });
    }

    observeBuilding(observerBuildingStart);

    function setBuildButton() {
        document.getElementById('building_building_type')?.addEventListener('change', addBuildButtons)
    }

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
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

                for (const buildingId in BUILDING_CONFIG[buildingDistance]) {
                    if (BUILDING_CONFIG[buildingDistance].hasOwnProperty(buildingId)) {
                        buildingTypeInput.value = buildingId;
                        buildingTypeInput.dispatchEvent(new Event('change', { bubbles: true }));
                        await setBuilding(buildingId, BUILDING_CONFIG[buildingDistance][buildingId]);
                    }
                }

                if (buildingDistance > 0) {
                    await setPoints(originalLatLng, buildingDistance, BUILDING_CONFIG[buildingDistance]);
                    await setPoints(originalLatLng, -buildingDistance, BUILDING_CONFIG[buildingDistance]);
                }
            }
        }
    }

    async function setPoints(latLng, distance, buildingIds = []) {
        let run = true;
        let diagonal = false;
        let horizontalInverted = false;
        let center = latLng;
        let previousLat = latLng.lat;
        let previousLng = latLng.lng;
        let newLat = latLng.lat;
        let newLng = latLng.lng;
        let isFirstRow = true;
        let diagonalsCount = Math.ceil(RADIUS / Math.abs(distance));
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

                if (center.distanceTo(newLatLng) <= RADIUS - 500) {
                    const marker = L.marker(newLatLng);
                    marker.addTo(map);
                    markersSet++;
                    buildingLatInput.value = newLat;
                    buildingLngInput.value = newLng;
                    await setAddress(newLat, newLng);

                    for (const buildingId in buildingIds) {
                        if (buildingIds.hasOwnProperty(buildingId)) {
                            buildingTypeInput.value = buildingId;
                            buildingTypeInput.dispatchEvent(new Event('change', { bubbles: true }));
                            await setBuilding(buildingId, buildingIds[buildingId]);
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

    async function setBuilding(typeId, amount) {
        if (typeId === '0') {
            startVehicleFw.value = '30';
            startVehicleFw.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            startVehicleFw.value = '';
            startVehicleFw.dispatchEvent(new Event('change', { bubbles: true }));
        }

        for (let i = 0; i < amount; i++) {
            buildingCounts[typeId]++;
            buildingNameInput.value = BUILDING_NAME_MAPPING[typeId] + ' UK London ' + leadingZeros(buildingCounts[typeId], 3);
            console.log(buildingNameInput.value)

            if (setBuildingsCount > 0 && setBuildingsCount % 200 === 0) {
                await new Promise(r => setTimeout(r, getRandomInt(45000, 55000)));
            } else {
                await new Promise(r => setTimeout(r, getRandomInt(633, 855)));
            }

            retries = 0;
            await createBuilding();
            setBuildingsCount++;
            console.log(setBuildingsCount)
        }
    }

    async function setAddress(latitude, longitude) {
        const response = await fetch(`/reverse_address?latitude=${latitude}&longitude=${longitude}`, {
            headers: {
                'X-CSRF-Token': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            }
        });

        if (response.ok) {
            buildingAddressInput.value = (await response.text()).trim();
        }
    }

    async function createBuilding() {
        if (retries > 3) {
            return;
        }

        const form = new FormData(document.getElementById('new_building'));

        if (BUILD_AS_ALLIANCE) {
            form.set('build_as_alliance', '1');
        }

        const response = await fetch('/buildings', {
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
            alertElement.innerText = 'Fehler beim Erstellen des Gebäudes!';
            document.getElementById('select_building_type_step').parentElement.insertAdjacentElement('afterbegin', alertElement);
            retries++;
            await new Promise(r => setTimeout(r, getRandomInt(6033, 8505)));
            await createBuilding();
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

    async function addBuildButtons() {
        const buildButtonId = 'create_location';
        const existingBuildButton = document.getElementById(buildButtonId);

        if (existingBuildButton) {
            return;
        }

        const buildingTypeElement = document.getElementById('building_building_type');

        if (buildingTypeElement.value !== '') {
            const buyButtons = document.querySelectorAll('.building_build_costs');

            const buildButtonContainer = document.createElement('div');
            buildButtonContainer.className = 'building_build_costs building_build_costs_active';
            buildButtonContainer.id = buildButtonId;

            const buildButton = document.createElement('input');
            buildButton.className = 'btn btn-primary';
            buildButton.id = buildButtonId + '_button';
            buildButton.value = 'Standort bauen';
            buildButton.type = 'button';
            buildButton.style.color = '#fff';
            buildButton.addEventListener('click', createLocation);

            const lastElement = Array.from(buyButtons).pop();
            buildButtonContainer.append(buildButton);
            lastElement.after(buildButtonContainer);
        }
    }

    async function createLocation() {
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
})();
