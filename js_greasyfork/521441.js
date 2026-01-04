// ==UserScript==
// @name         Fahrzeugprüfer
// @namespace    leeSalami.lss
// @version      1.3.7
// @license      MIT
// @description  Prüft die fehlenden Fahrzeuge
// @author       leeSalami
// @match        https://*.leitstellenspiel.de/missions/*
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @downloadURL https://update.greasyfork.org/scripts/521441/Fahrzeugpr%C3%BCfer.user.js
// @updateURL https://update.greasyfork.org/scripts/521441/Fahrzeugpr%C3%BCfer.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const aaoElement = document.getElementById('mission-aao-group')?.querySelector('a[title="#1 Voll M"]');
    const aaoElement2 = document.getElementById('mission-aao-group')?.querySelector('a[title="#2 Voll O"]');
    const missingText = document.getElementById('missing_text');

    if (!aaoElement || !missingText || !missingText.textContent) {
        return;
    }

    const aaoMapping = {
        'Löschfahrzeug': ['fire'],
        'Löschfahrzeuge': ['fire'],
        'MEK-Fahrzeug': ['mek_zf'],
        'MEK-Fahrzeuge': ['mek_zf'],
        'SEK-Fahrzeug': ['sek_zf'],
        'SEK-Fahrzeuge': ['sek_zf'],
        'Dekon-P': ['dekon_p'],
        'Gerätekraftwagen': ['gkw'],
        'FuStW': ['fustw'],
        'NEF': ['nef'],
        'RTW': ['rtw'],
        'Radlader': ['thw_brmg_r'],
        'Drohneneinheit': ['drone'],
        'Drohneneinheiten': ['drone'],
        'Lüfter': ['ventilation'],
        'NEA200': ['energy_supply_2'],
        'NEA50': ['energy_supply'],
        'Rettungshundestaffel': ['rescue_dogs'],
        'Rettungshundestaffeln': ['rescue_dogs'],
        'leBefKw': ['lebefkw'],
        'GW-Höhenrettung': ['gwhoehenrettung'],
        'GruKw': ['grukw'],
        'GefKw': ['gefkw'],
        'FwK': ['fwk'],
        'Polizeihubschrauber': ['polizeihubschrauber'],
        'GW-San': ['gw_san'],
        'DHuFüKW': ['k9'],
        'Wasserwerfer': ['wasserwerfer'],
        'Schlauchwagen': ['gwl2wasser'],
        'GW-Öl': ['gwoel'],
        'GW-Messtechnik': ['gwmesstechnik'],
        'GW-Gefahrgut': ['gwgefahrgut'],
        'GW-Atemschutz': ['gwa'],
        'ELW 1': ['elw1_or_elw2'],
        'ELW 2': ['elw2_or_ab_elw'],
        'FüKW (Polizei)': ['fukw'],
        'LauKw': [165],
        'Funkstreifenwagen': [103],
        'Polizeimotorrad': ['police_motorcycle'],
        'Polizeimotorräder': ['police_motorcycle'],
        'Zivilstreifenwagen': [98],
        'Streifenwagen': ['fustw'],
        'Streifenwagen oder Polizeimotorräder': ['fustw'],
        'Streifenwagen oder Polizeimotorrad': ['fustw'],
        'Streifenwagen oder Zivilstreifenwagen': ['fustw'],
        'Streifenwagen, Polizeimotorrad oder Zivilstreifenwagen': ['fustw'],
        'Streifenwagen, Polizeimotorräder oder Zivilstreifenwagen': ['fustw'],
        'Polizeipferd': [135, 137],
        'Polizeipferde': [135, 137],
        'Bt-Kombi': [131],
        // 'Betreuungs- und Verpflegungsausstattung': [130],
        // 'Betreuungs- und Verpflegungsausstattungen': [130],
        'Anhänger Drucklufterzeugung': ['thw_dle'],
        'Schmutzwasserpumpe': ['pump'],
        'Schmutzwasserpumpen': ['pump'],
        'THW-Einsatzleitung': ['thw_mtw'],
        'THW-Einsatzleitungen': ['thw_mtw'],
        'MzGW': ['energy_supply'],
        'Drehleiter': ['dlk'],
        'Drehleitern': ['dlk'],
        'MzGW SB': [109],
        'GW-Taucher': ['thw_tauchkraftwagen_or_gw_taucher'],
        'Boot': ['boot'],
        'Boote': ['boot'],
        'Außenlastbehälter': ['helicopter_bucket'],
        'GW-Werkfeuerwehr': ['gw_werkfeuerwehr'],
        'GW-Werkfeuerwehren': ['gw_werkfeuerwehr'],
        'Rettungstreppe': ['rettungstreppe'],
        'Rettungstreppen': ['rettungstreppe'],
        'Rüstwagen': ['rw'],
        'ELW2 Drohne': [129],
        'ELW2 Drohnen': [129],
        'FüKW (THW)': [144],
        'FüKomKW': [145],
        'Anh FüLa': [146],
        'FmKW': [147],
        'MTW FGr K': [148],
        'Bahnrettungsfahrzeug': ['railway_fire'],
        'Bahnrettungsfahrzeuge': ['railway_fire'],
        'ELW Bergrettung': [151],
        'GW-Bergrettung': [150],
        'ATV': [152],
        'Seenotrettungskreuzer': [159],
        'Seenotrettungsboot': [160],
        'Seenotrettungsboote': [160],
        'l/min Pumpenleistung': ['water_damage_pump_value'],
        'l. Wasser': ['wasser_amount']
    }

    const vehicleIdMapping = {
        'Löschfahrzeug': ['0', '1', '6', '7', '8', '9', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '30', '37'],
        'Schlauchwagen': ['11', '13', '14', '15', '16', '62'],
        'FuStW': ['32', '103'],
        'Streifenwagen': ['32', '103'],
        'Funkstreifenwagen': ['103'],
        'Streifenwagen oder Polizeimotorr': ['32', '95', '103'],
        'Streifenwagen oder Zivilstreifenwagen': ['32', '98', '103'],
        'Streifenwagen oder Polizeimotorrad oder Zivilstreifenwagen': ['32', '95', '98', '103'],
        'Streifenwagen oder Polizeimotorräder oder Zivilstreifenwagen': ['32', '95', '98', '103'],
        'Funkstreifenwagen oder Polizeimotorr': ['32', '95', '103'],
        'Funkstreifenwagen oder Zivilstreifenwagen': ['32', '98', '103'],
        'Funkstreifenwagen oder Polizeimotorrad oder Zivilstreifenwagen': ['32', '95', '98', '103'],
        'Funkstreifenwagen oder Polizeimotorräder oder Zivilstreifenwagen': ['32', '95', '98', '103'],
        'Drehleiter': ['2'],
        'ELW 1': ['3', '34', '129'],
        'ELW 2': ['34', '129'],
        'ELW2 Drohne': ['129'],
        'Lüfter': ['114'],
        'leBefKw': ['35'],
        'GruKw': ['50'],
        'Polizeimotorr': ['95'],
        'Polizeipferd': ['134', '135', '136'],
        'Polizeihubschrauber': ['61'],
        'GefKw': ['52'],
        'FüKW (Polizei)': ['51'],
        'LauKw': ['165'],
        'RTW': ['28'],
        'GW-Gefahrgut': ['27', '77'],
        'Dekon-P': ['53'],
        'GW-Höhenrettung': ['33'],
        'GW-Öl': ['10', '49'],
        'GW-Messtechnik': ['12'],
        'GW-Atemschutz': ['5', '48'],
        'FwK': ['57'],
        'THW-Einsatzleitung': ['40'],
        'Gerätekraftwagen': ['39'],
        'Drohneneinheit': ['125', '126', '127', '128', '129'],
        'GW-San': ['60'],
        'DHuFüKW': ['94'],
        'Wasserwerfer': ['72'],
        'Zivilstreifenwagen': ['98'],
        'MzGW SB': ['109'],
        'GW-Taucher': ['63', '69'],
        'Rettungshundestaffel': ['91', '92'],
        'Schmutzwasserpumpe': ['101', '102'],
        'Boot': ['66', '67', '68', '70', '71'],
        'FüKW (THW)': ['144'],
        'FüKomKW': ['145'],
        'Anh FüLa': ['146'],
        'FmKW': ['147'],
        'MTW FGr K': ['148'],
        // 'Betreuungs- und Verpflegungsausstattung': ['130', '132'],
        'Bahnrettungsfahrzeug': ['162', '163', '164'],
        'ELW Bergrettung': ['151'],
        'GW-Bergrettung': ['150', '149'],
        'ATV': ['152'],
        'Seenotrettungskreuzer': ['159'],
        'Seenotrettungsboot': ['160'],
        'NEA50': ['110'],
        'NEA200': ['112'],
        'MzGW': ['41'],
        'Drucklufterzeugung': ['44'],
        'LKW Kipper': ['42'],
        'Radlader': ['43'],
        'GW-Werkfeuerwehr': ['83'],
    }

    const careUnitMissingText = [
      'Betreuungs- und Verpflegungsausstattung',
      'Betreuungshelfer',
      'Verpflegungshelfer'
    ];

    const hoseVehicles = {
        '0.25': [
            'hose_water',
            '11',
            '13',
            '14',
            '15',
            '16',
            '62',
            '101',
            '102'
        ],
        '0.12': [
            'hose_water_2'
        ],
        '0.1': [
            '143'
        ]
    }

    const arrivingVehicleIds = [];
    const arrivingEquipmentTypes = [];
    const missionVehicleIds = [];
    const missionEquipmentTypes = [];
    const missionTypeId = getMissionTypeId();
    let missionData = null;

    if (missionTypeId) {
        const db = await openDb();
        await updateMissions(db, 43_200); // update every 12h
        missionData = await getData(db, 'missions', missionTypeId);
    }

    await setAaoValues();
    setTimeout(() => {
        aaoCheckAvailable(true)
    }, 250);

    async function setAaoValues() {
        const missingVehicles = await getMissingVehicles();
        let vehicleTypeIds = {};
        let vehicleCaptions = {};

        for (let i = 0, n = missingVehicles.length; i < n; i++) {
            if (!aaoMapping.hasOwnProperty(missingVehicles[i].type)) {
                continue;
            }

            for (let j = 0, m = aaoMapping[missingVehicles[i].type].length; j < m; j++) {
                if (missionData && missingVehicles[i].type === 'RTW' && (missionData.base_mission_id === 227 || missionData.base_mission_id === 275 || missionData.base_mission_id === 304 || missionData.base_mission_id === 306)) {
                    vehicleTypeIds['[28, 38, 58]'] = missingVehicles[i].amount;
                    vehicleCaptions['[28, 38, 58]'] = 'RTW, KTW, KTW Typ B';
                } else if (isNumeric(aaoMapping[missingVehicles[i].type][j])) {
                    const aaoKey = String(aaoMapping[missingVehicles[i].type][j]);
                    vehicleTypeIds[aaoKey] = missingVehicles[i].amount;
                    vehicleCaptions[aaoKey] = missingVehicles[i].type;
                } else {
                    aaoElement.setAttribute(aaoMapping[missingVehicles[i].type][j], missingVehicles[i].amount);
                    aaoElement2.setAttribute(aaoMapping[missingVehicles[i].type][j], missingVehicles[i].amount);
                }
            }
        }

        if (Object.keys(vehicleTypeIds).length !== 0) {
            aaoElement.setAttribute('vehicle_type_ids', JSON.stringify(vehicleTypeIds));
            aaoElement.setAttribute('vehicle_type_captions', JSON.stringify(vehicleCaptions));
            aaoElement2.setAttribute('vehicle_type_ids', JSON.stringify(vehicleTypeIds));
            aaoElement2.setAttribute('vehicle_type_captions', JSON.stringify(vehicleCaptions));
        }
    }

    async function getMissingVehicles() {
        let missing = [];
        // let missingCareUnits = []
        const re = /[0-9]+x?\s.+?(?=<|,\s[0-9]|$)/g;
        const reReplace = /(?![0-9])x|\s(\((?!(THW|Polizei)).+?\)|oder.+)/g;
        const missingTextParts = missingText.textContent.trim().split('\n');

        for (let i = 0, n = missingTextParts.length; i < n; i++) {
            if (!missingTextParts[i].includes('Fehlende Fahrzeuge:') && !missingTextParts[i].includes('Uns fehlt:')) {
                continue;
            }

            const matches = [...missingTextParts[i].trim().matchAll(re)];

            for (let j = 0, m = matches.length; j < m; j++) {
                const matchFormatted = matches[j][0].replaceAll(reReplace, '');
                let [amount, ...type] = matchFormatted.split(/\s/);
                type = type.join(' ');

                if (careUnitMissingText.includes(type)) {
                    // missingCareUnits.push({ 'type': type, 'amount': parseInt(amount) });
                } else {
                    missing.push({ 'type': type, 'amount': parseInt(amount) });
                }
            }
        }

        missing = removeDrivingVehicles(missing);
        missing = await replaceVehicles(missing);
        missing = calculateWater(missing);
        console.log(missing)

        return missing;
    }

    function removeDrivingVehicles(missing) {
        const drivingVehicles = document.getElementById('mission_vehicle_driving')?.querySelectorAll('tr[id^="vehicle_row_"]');

        if (!drivingVehicles || drivingVehicles.length === 0) {
            return missing;
        }

        const guardMissionCountdown = document.querySelector('span[id^="mission_countdown_"]');
        let missionTimeToStart;

        if (guardMissionCountdown) {
            const countDownScript = guardMissionCountdown.parentElement.querySelector('script');

            if (!countDownScript) {
                return missing;
            }

            missionTimeToStart = getCountdownTime(countDownScript.innerHTML) - 20
        } else {
            missionTimeToStart = 30 * 60;
        }

        for (let i = 0, n = drivingVehicles.length; i < n; i++) {
            const vehicleCountdown = drivingVehicles[i].querySelector('td[id^="vehicle_drive_"] + script').innerHTML;

            if (!vehicleCountdown) {
                continue;
            }

            if (getCountdownTime(vehicleCountdown) <= missionTimeToStart || (!guardMissionCountdown && drivingVehicles[i].querySelector(`td > a[href="/profile/${user_id}"]`))) {
                const vehicleId = drivingVehicles[i].querySelector('td > a[vehicle_type_id]')?.getAttribute('vehicle_type_id');
                const equipmentType = drivingVehicles[i].querySelector('td > small > span[data-equipment-type]')?.getAttribute('data-equipment-type');

                if (vehicleId === null || vehicleId === '') {
                    continue;
                }

                if (equipmentType !== null) {
                    arrivingEquipmentTypes.push(equipmentType);
                }

                arrivingVehicleIds.push(vehicleId);
            }
        }

        if (arrivingVehicleIds.length === 0) {
            return missing;
        }

        for (let i = missing.length - 1; i >= 0; i--) {
            if (!missing[i]) {
                delete missing[i];
                continue;
            }

            for (const vehicleName in vehicleIdMapping) {
                if (!missing[i].type.includes(vehicleName)) {
                    continue;
                }

                for (let j = 0, m = arrivingVehicleIds.length; j < m; j++) {
                    if (vehicleIdMapping[vehicleName].includes(arrivingVehicleIds[j])) {
                        if (arrivingVehicleIds[j] === '134' || arrivingVehicleIds[j] === '136') {
                            missing[i].amount -= 2;
                        } else if (arrivingVehicleIds[j] === '135') {
                            missing[i].amount -= 4;
                        } else {
                            missing[i].amount -= 1;
                        }
                    }
                }
            }

            if (missing[i].amount <= 0) {
                delete missing[i];
            }
        }

        return missing.filter(m => m);
    }

    function getCountdownTime(scriptText) {
        const regex = /[^0-9,]+/;
        return scriptText.replace(regex, '').split(',')[0];
    }

    function calculateWater(missing) {
        const missingWaterIndex = missing.findIndex(m => m.type === 'l. Wasser');

        if (missingWaterIndex === -1) {
            return missing;
        }

        let lfVehicles = 0;
        try {
            lfVehicles = missing.find(m => m.type === 'Löschfahrzeug' || m.type === 'Löschfahrzeuge')['amount'];
        } catch {}

        let hoseVehicles = 0;
        try {
            hoseVehicles = missing.find(m => m.type === 'Schlauchwagen')['amount'];
        } catch {}

        const waterAtMissionElement = document.querySelector('div[class^="mission_water_bar_at_mission_"].progress-bar-mission-window-water');
        const waterDrivingElement = document.querySelector('div[class^="mission_water_bar_driving_"].progress-bar-mission-window-water');

        const waterNeeded = parseInt(waterAtMissionElement?.getAttribute('data-need_water') ?? 0);
        const hoseCoefficient = hoseVehicles * 25;
        const hoesCoefficientAtMission = parseInt(waterAtMissionElement?.getAttribute('data-water-modifier') ?? 0);
        const hoesCoefficientDriving = parseInt(waterDrivingElement?.getAttribute('data-water-modifier') ?? 0);
        const totalHoseCoefficient = (hoseCoefficient + hoesCoefficientAtMission + hoesCoefficientDriving) / 100;
        let waterAtMissionOrDriving = 0;
        waterAtMissionOrDriving += parseInt(waterAtMissionElement?.getAttribute('data-water-has') ?? 0);
        waterAtMissionOrDriving += parseInt(waterDrivingElement?.getAttribute('data-water-has') ?? 0);

        if (totalHoseCoefficient > 0) {
            waterAtMissionOrDriving = waterAtMissionOrDriving * (1 + totalHoseCoefficient);
        }

        const lfWater = 1600 * (1 + totalHoseCoefficient);
        let remainingWater = waterNeeded - waterAtMissionOrDriving - lfVehicles * lfWater;
        remainingWater = Math.ceil(remainingWater / lfWater * 1600);

        if (remainingWater <= 0) {
            delete missing[missingWaterIndex];
        } else {
            missing[missingWaterIndex].amount = remainingWater;
        }

        return missing.filter(m => m);
    }

    async function replaceVehicles(missing) {
        let replaceFustwByMotorcycle = 0;
        const missingVehicle = missing.find(missingVehicle => missingVehicle.type.includes('Polizeimotorr'));

        if (missionData && missingVehicle) {
            if (missionData.hasOwnProperty('additional') && missionData.hasOwnProperty('requirements') && missionData.requirements.hasOwnProperty('police_motorcycle') && missionData.requirements.hasOwnProperty('police_cars')) {
                if (missionData.additional.hasOwnProperty('allow_police_motorcycle_instead_of_fustw') && missionData.additional.allow_police_motorcycle_instead_of_fustw) {
                    replaceFustwByMotorcycle = Math.min(missionData.requirements.police_cars, missionData.requirements.police_motorcycle);
                } else if (missionData.additional.hasOwnProperty('max_police_motorcycle_replacing_police_cars') && missionData.additional.max_police_motorcycle_replacing_police_cars) {
                    replaceFustwByMotorcycle = Math.min(missionData.additional.max_police_motorcycle_replacing_police_cars, missionData.requirements.police_cars, missionData.requirements.police_motorcycle);
                }
            }
        }

        let elw1 = 0;
        let elw1Id;
        let elw2 = 0;
        let elw2Id;
        let drone = 0;
        let droneId;
        let lf = 0;
        let lfId;
        let rw = 0;
        let rwId;
        let fustw = 0;
        let fustwId;
        let dgl = 0;
        let dglId;
        let pumpCapacity = 0;
        let pumpCapacityId;
        let pump = 0;
        let pumpId;

        for (let i = 0, n = missing.length; i < n; i++) {
            if (typeof missing[i] === 'undefined') {
                continue;
            }

            if (missing[i].type === 'ELW 1') {
                elw1 = missing[i].amount;
                elw1Id = i;
            } else if (missing[i].type === 'ELW 2') {
                elw2 = missing[i].amount;
                elw2Id = i;
            } else if (missing[i].type.includes('Drohneneinheit')) {
                drone = missing[i].amount;
                droneId = i;
            } else if (missing[i].type.includes('Löschfahrzeug')) {
                lf = missing[i].amount;
                lfId = i;
            } else if (missing[i].type === 'Rüstwagen') {
                rw = missing[i].amount;
                rwId = i;
            } else if (missing[i].type === 'FuStW' || missing[i].type === 'Streifenwagen' || missing[i].type.includes('Funkstreifenwagen ') || missing[i].type.includes('Funkstreifenwagen,')) {
                if (replaceFustwByMotorcycle) {
                    missing[i].amount -= replaceFustwByMotorcycle;
                }
                fustw = missing[i].amount;
                fustwId = i;
            } else if (missing[i].type === 'Funkstreifenwagen') {
                dgl = missing[i].amount;
                dglId = i;
            } else if (missing[i].type.includes('Polizeipferd')) {
                missing[i].amount = Math.ceil(missing[i].amount / 4);
            } else if (missing[i].type === 'l/min Pumpenleistung') {
                pumpCapacity = missing[i].amount;
                pumpCapacityId = i;
            } else if (missing[i].type.includes('Schmutzwasserpumpe')) {
                pump = missing[i].amount;
                pumpId = i;
            }
        }

        if (elw1 > 0 && elw2 > 0) {
            delete missing[elw1Id];
            missing[elw2Id].amount = Math.max(elw1, elw2);
        }

        // if (drone > 0 && elw2 > 0) {
        //     const elw2DroneDifference = missing[elw2Id].amount - drone;
        //     const remainingElw2 = elw2DroneDifference > 0 ? elw2DroneDifference : drone;
        //
        //     delete missing[droneId];
        //     missing[elw2Id].amount = remainingElw2;
        //     missing.push({ 'type': 'ELW2 Drohne', 'amount': drone })
        // }

        if (rw > 0 && lf > 0) {
            delete missing[rwId];
            missing[lfId].amount = Math.max(lf, rw);
        }

        if (fustw > 0 && dgl > 0) {
            const dglFustwDifference = fustw - dgl;

            if (dglFustwDifference > 0) {
                missing[fustwId].amount = dglFustwDifference;
            } else {
                delete missing[fustwId];
            }
        }

        if (pumpCapacity > 0) {
            let remainingPump = pumpCapacity - lf * 2000;

            if (pump > 0) {
                remainingPump = remainingPump - pump * 12400;
            }

            if (remainingPump <= 0) {
                delete missing[pumpCapacityId];
            } else {
                missing[pumpCapacityId].amount = remainingPump;
            }
        }

        return missing.filter(m => m);
    }



    function getAffectedPeopleCount() {
        const affectedPeopleText = document.querySelector('#missing_text + .flex-row > div > div > div')?.innerText?.trim();

        if (affectedPeopleText === null) {
            return 0;
        }

        if (!affectedPeopleText.includes('Betroffene')) {
            return 0;
        }

        const re = /^([0-9]+) Betroffene/;
        const matches = affectedPeopleText.match(re);

        if (matches && matches.length === 2) {
            return parseInt(matches[1]);
        }

        return 0;
    }





    // def get_missing_care_units(missing_text) -> dict:
    //   care_units = {
    //       'care_service_equipment': 0,
    //       'care_service': 0
    //   }
    //
    // equipment = 0
    // equipment_personnel = 0
    //
    // if 'Verpflegungsausstattung' in missing_text:
    // matches = re.findall(r'([0-9]+)\sBetreuungs-\sund\sVerpflegungsausstattung', missing_text)
    //
    // for match in matches:
    // equipment = int(match)
    //
    // if 'Verpflegungshelfer' in missing_text:
    // matches = re.findall(r'([0-9]+)x Verpflegungshelfer', missing_text)
    //
    // for match in matches:
    // equipment_personnel = math.ceil(int(match) / 2)
    //
    // care_units['care_service_equipment'] = max(equipment, equipment_personnel)
    //
    // if 'Betreuungshelfer' in missing_text:
    // matches = re.findall(r'([0-9]+)x Betreuungshelfer', missing_text)
    //
    // for match in matches:
    // care_units['care_service'] = int(match)
    //
    // return care_units
    //
    //
    //
    // def get_care_unit_aao(missing_text: str) -> dict:
    //   logging.info('Selecting care units')
    // affected_people_count = 0
    // selected_personnel_count = 0
    // missing_care_units = {}
    // vehicle_aao = {'ids': {}, 'captions': {}}
    //
    // if not missing_text and mission_required_vehicles['care_affected_people_min'] or mission_required_vehicles['care_affected_people_max']:
    // affected_people_count = get_affected_people_count()
    // elif missing_text:
    //   missing_care_units = get_missing_care_units(missing_text)
    //
    // if mission_required_vehicles['care_includes_staff_members']:
    // selected_personnel_count = get_selected_personnel_count()
    // selected_personnel_count += get_alliance_personnel_driving()
    //
    // if affected_people_count == 0 and selected_personnel_count == 0 and not missing_care_units:
    //   return vehicle_aao
    //
    // care_units = calculate_care_units(affected_people_count, selected_personnel_count, care_includes_staff_members=mission_required_vehicles['care_includes_staff_members'], missing_care_units=missing_care_units)
    // logging.info(care_units)
    //
    // if care_units['kitchen_vehicles']:
    // vehicle_aao['ids']['[130]'] = care_units['kitchen_vehicles']
    // vehicle_aao['captions']['[130]'] = 'GW-Bt'
    //
    // if care_units['care_unit_vehicles']:
    // vehicle_aao['ids']['[131]'] = care_units['care_unit_vehicles']
    // vehicle_aao['captions']['[131]'] = 'Bt-Kombi'
    //
    // return vehicle_aao





    function isNumeric(str) {
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    function getMissionTypeId() {
        const missionHelpElement = document.getElementById('mission_help');

        if (!missionHelpElement) {
            return null;
        }

        const missionHelpLink = missionHelpElement.href
        const params = new URLSearchParams(new URL(decodeURIComponent(missionHelpLink)).search);
        const missionAdditiveOverlays = params.get('additive_overlays');
        const missionOverlayIndex = params.get('overlay_index');
        let missionTypeId = missionHelpLink.split('/').pop().split('?')[0];

        if (missionOverlayIndex !== null) {
            missionTypeId += '-' + missionOverlayIndex;
        }

        if (missionAdditiveOverlays !== null) {
            missionTypeId += '/' + missionAdditiveOverlays;
        }

        return missionTypeId;
    }
})();
