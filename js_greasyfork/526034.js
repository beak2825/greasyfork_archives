// ==UserScript==
// @name         Fehlende Fahrzeuge kaufen
// @namespace    leeSalami.lss
// @version      1.0.7
// @license      All Rights Reserved
// @description  Ermöglicht das Kaufen von fehlenden Fahrzeugen aller Wachen.
// @author       leeSalami
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js?v=1
// @match        https://*.leitstellenspiel.de/
// @match        https://*.leitstellenspiel.de/buildings/*
// @downloadURL https://update.greasyfork.org/scripts/526034/Fehlende%20Fahrzeuge%20kaufen.user.js
// @updateURL https://update.greasyfork.org/scripts/526034/Fehlende%20Fahrzeuge%20kaufen.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  /**
   * Der Fahrzeugkauf beschränkt sich auf Wachen die zu diesen Leitstellen gehören, z.B.: [1234567890, 9876543210]
   * @type {number[]}
   */
  const LIMIT_TO_DISPATCH_CENTERS = [];

  /**
   * Der Fahrzeugkauf beschränkt sich auf diese Wachentypen, z.B.: [0, 2, 6, 9, 11, 12, 13]
   * @type {number[]}
   */
  const LIMIT_TO_BUILDING_TYPES = [];

  /**
   * Der Fahrzeugkauf beschränkt sich auf diese Fahrzeugtypen, für LauKw z.B.: [165]
   * @type {number[]}
   */
  const LIMIT_TO_VEHICLE_TYPES = [];

  /**
   * Diese Fahrzeugtypen werden nicht gekauft, z.B.: [40, 42, 43, 44, 45]
   * @type {number[]}
   */
  const EXCLUDED_VEHICLE_TYPES = [];

  /**
   * Der Fahrzeugkauf wird für Wachen übersprungen, deren Namen den angegebenen String enthalten, z.B.: 'BEPO-'
   * @type {string}
   */
  const BUILDING_CAPTION_EXCLUDE_FILTER = '';

  /**
   * Überschreibt oder setzt die automatische Fahrzeugkonfiguration.
   * Die Konfiguration für Stellplätze, die verschiedene Fahrzeugtypen erlauben (z.B.: Reiterstaffel, Betreuung), ist erforderlich, ansonsten werden hierfür keinerlei Fahrzeuge gekauft.
   * @type {Object}
   */
  const EXTENSION_VEHICLE_OVERRIDE = {
    // Wachentyp
    11: {
      // ID der Erweiterung. Üblicherweise in Wachen von oben nach unten gezählt (Beachte: Pol-Zellen entsprechen 0-9)
      9: [135, 135, 135, 137, 137, 137]
    },
    12: {
      5: [130, 130, 130, 131, 131, 131, 131]
    },
    0: {
      25: [163]
    }
  }

  /**
   * Konfiguration für "freie" Stellplätze für Wachen wie z.B. Feuerwehr und Polizei.
   * Die erforderlichen Stufen werden automatisch gekauft.
   * @type {Object}
   */
  const UNRESERVED_LOTS_CONFIG = {
    0: [30, 30, 30, 30, 30, 30, 30, 30], // FW
    2: [28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 55, 56], // RD
    6: [32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 98, 98], // POL
  }

  const db = await openDb();
  await updateVehicles(db, 60);
  await updateBuildings(db, 60);
  await updateBuildingTypes(db);
  const buildings = await getAllData(db, 'buildings');

  let count = 0;
  let totalVehicleCosts = 0;
  let totalLevelCosts = 0;
  let errors = 0;
  const buildingExtensionsAndVehiclesToBuy = [];

  for (let i = 0, n = buildings.length; i < n; i++) {
    if (LIMIT_TO_DISPATCH_CENTERS.length > 0 && !LIMIT_TO_DISPATCH_CENTERS.includes(buildings[i].leitstelle_building_id)) {
      continue;
    }

    if (LIMIT_TO_BUILDING_TYPES.length > 0 && !LIMIT_TO_BUILDING_TYPES.includes(buildings[i].building_type)) {
      continue;
    }

    if (BUILDING_CAPTION_EXCLUDE_FILTER !== '' && buildings[i].caption.includes(BUILDING_CAPTION_EXCLUDE_FILTER)) {
      continue;
    }

    const buildingType = await getData(db, 'buildingTypes', buildings[i].building_type);
    let levelsToBuy = 0;
    let neededLevels = 0;
    let levelCosts = 0;
    let requiredVehicles = [];

    // Start vehicle
    if (buildingType.hasOwnProperty('startParkingLotReservations')) {
      const startParkingLotReservations = [];
      let hasMultiple = false;
      for (let j = 0, m = buildingType.startParkingLotReservations.length; j < m; j++) {
        if (buildingType.startParkingLotReservations[j].length > 1) {
          hasMultiple = true;
          break;
        }

        if (LIMIT_TO_VEHICLE_TYPES.length > 0 && !LIMIT_TO_VEHICLE_TYPES.includes(buildingType.startParkingLotReservations[j][0])) {
          continue;
        }

        if (EXCLUDED_VEHICLE_TYPES.includes(buildingType.startParkingLotReservations[j][0])) {
          continue;
        }

        startParkingLotReservations.push(buildingType.startParkingLotReservations[j][0])
      }

      if (!hasMultiple) {
        requiredVehicles = requiredVehicles.concat(startParkingLotReservations);
      }
    }

    // Extensions
    for (let j = 0, m = buildings[i].extensions.length; j < m; j++) {
      if (buildings[i].extensions[j].available === true && buildingType.extensions[buildings[i].extensions[j].type_id].hasOwnProperty('parkingLotReservations')) {
        if (EXTENSION_VEHICLE_OVERRIDE.hasOwnProperty(buildings[i].building_type) && EXTENSION_VEHICLE_OVERRIDE[buildings[i].building_type].hasOwnProperty(buildings[i].extensions[j].type_id)) {
          let requiredExtensionVehicles = EXTENSION_VEHICLE_OVERRIDE[buildings[i].building_type][buildings[i].extensions[j].type_id];
          if (LIMIT_TO_VEHICLE_TYPES.length > 0) {
            requiredExtensionVehicles = requiredExtensionVehicles.filter(e => LIMIT_TO_VEHICLE_TYPES.includes(e))
          }
          requiredVehicles = requiredVehicles.concat(requiredExtensionVehicles);
          continue;
        }

        const parkingLotReservations = buildingType.extensions[buildings[i].extensions[j].type_id].parkingLotReservations;

        const extensionVehicles = [];
        let hasMultiple = false;
        for (let k = 0, o = parkingLotReservations.length; k < o; k++) {
          if (parkingLotReservations[k].length > 1) {
            hasMultiple = true;
            break;
          }

          if (LIMIT_TO_VEHICLE_TYPES.length > 0 && !LIMIT_TO_VEHICLE_TYPES.includes(parkingLotReservations[k][0])) {
            continue;
          }

          if (EXCLUDED_VEHICLE_TYPES.includes(parkingLotReservations[k][0])) {
            continue;
          }

          extensionVehicles.push(parkingLotReservations[k][0])
        }

        if (!hasMultiple) {
          requiredVehicles = requiredVehicles.concat(extensionVehicles);
        }
      }
    }

    // Parking lots
    if (buildingType.hasOwnProperty('maxLevel') && buildingType.maxLevel > 0 && UNRESERVED_LOTS_CONFIG.hasOwnProperty(buildings[i].building_type)) {
      let requiredParkingLotVehicles = UNRESERVED_LOTS_CONFIG[buildings[i].building_type];
      if (LIMIT_TO_VEHICLE_TYPES.length > 0) {
        requiredParkingLotVehicles = requiredParkingLotVehicles.filter(e => LIMIT_TO_VEHICLE_TYPES.includes(e))
      }

      const hasStartVehicle = buildingType.startVehicles.length > 0;
      neededLevels = requiredParkingLotVehicles.length - (hasStartVehicle ? 1 : 0);

      if (neededLevels > buildingType.maxLevel && buildings[i].building_type !== 13) {
        alert(`Fehlerhafte Konfiguration: Es wurden mehr Fahrzeuge für "${buildingType.caption}" konfiguriert als maximal möglich.`);
      }

      levelsToBuy = neededLevels - buildings[i].level;
      requiredVehicles = requiredVehicles.concat(requiredParkingLotVehicles);

      if (levelsToBuy > 0) {
        if (buildings[i].building_type === 13) {
          levelCosts += levelsToBuy * buildingType.levelPrices.credits[0];
        } else {
          levelCosts += buildingType.levelPrices.credits.slice(buildings[i].level, neededLevels).reduce((a, b) => a + b);
        }
        totalLevelCosts += levelCosts;
      } else {
        levelsToBuy = 0;
      }
    }

    const buildingVehicles = await getDataByIndex(db, 'vehicles', 'building_id', IDBKeyRange.only(buildings[i].id));
    const buildingVehicleTypes = buildingVehicles.map(a => a.vehicle_type);

    for (let i = 0, n = buildingVehicleTypes.length; i < n; i++) {
      const vehicleIndex = requiredVehicles.indexOf(buildingVehicleTypes[i]);
      if (vehicleIndex > -1) {
        requiredVehicles.splice(vehicleIndex, 1);
      }
    }

    count += requiredVehicles.length;
    for (let i = 0, n = requiredVehicles.length; i < n; i++) {
      const vehicleType = await getData(db, 'vehicleTypes', requiredVehicles[i]);
      totalVehicleCosts += vehicleType.credits;
    }

    if (levelsToBuy > 0 || requiredVehicles.length > 0) {
      buildingExtensionsAndVehiclesToBuy.push({'id': buildings[i].id, 'caption': buildings[i].caption,'level': neededLevels, 'levelsToBuy': levelsToBuy, 'vehicles': requiredVehicles, 'buildingType': buildings[i].building_type})
    }
  }

  console.log(buildingExtensionsAndVehiclesToBuy);
  if (!window.confirm(`${I18n.toNumber(count, {precision: 0})} Fahrzeuge für ${I18n.toNumber((totalLevelCosts + totalVehicleCosts), {precision: 0})} (Fahrzeuge: ${I18n.toNumber(totalVehicleCosts, {precision: 0})}, Stufen: ${I18n.toNumber(totalLevelCosts, {precision: 0})}) Credits kaufen?`)) {
    return;
  }

  for (let i = 0, n = buildingExtensionsAndVehiclesToBuy.length; i < n; i++) {
    console.log('(' + i + ') ' + buildingExtensionsAndVehiclesToBuy[i].caption + ' - ' + buildingExtensionsAndVehiclesToBuy[i].id);

    if (buildingExtensionsAndVehiclesToBuy[i].level > 0 && buildingExtensionsAndVehiclesToBuy[i].levelsToBuy > 0) {
      if (buildingExtensionsAndVehiclesToBuy[i].buildingType === 13 || buildingExtensionsAndVehiclesToBuy[i].buildingType === 5 || buildingExtensionsAndVehiclesToBuy[i].buildingType === 28) {
        for (let j = 0, m = buildingExtensionsAndVehiclesToBuy[i].vehicles.length; j < m; j++) {
          await buyExtensions(buildingExtensionsAndVehiclesToBuy[i].id, 1);
        }
      } else {
        await buyExtensions(buildingExtensionsAndVehiclesToBuy[i].id, buildingExtensionsAndVehiclesToBuy[i].level - 1);
      }
    }

    if (buildingExtensionsAndVehiclesToBuy[i].vehicles.length > 0) {
      for (let j = 0, m = buildingExtensionsAndVehiclesToBuy[i].vehicles.length; j < m; j++) {
        await buyVehicle(buildingExtensionsAndVehiclesToBuy[i].id, buildingExtensionsAndVehiclesToBuy[i].vehicles[j]);
      }
    }

    if (i !== 0 && i % 100 === 0) {
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  if (errors > 0) {
    alert(`Fahrzeugkauf abgeschlossen. Es sind ${errors} Fehler aufgetreten. Nach ein paar Minuten erneut ausführen.`);
  } else {
    alert('Fahrzeugkauf erfolgreich abgeschlossen.');
  }

  async function buyVehicle(buildingId, vehicleId) {
    const response = await fetch(`/buildings/${buildingId}/vehicle/${buildingId}/${vehicleId}/credits?building=${buildingId}`, {
      redirect: 'manual'
    });

    await new Promise(r => setTimeout(r, 150));

    if (response.status >= 400) {
      errors++;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  async function buyExtensions(buildingId, level) {
    const response = await fetch(`/buildings/${buildingId}/expand_do/credits?level=${level}`, {
      redirect: 'manual'
    });

    await new Promise(r => setTimeout(r, 150));

    if (response.status >= 400) {
      errors++;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
})();
