// ==UserScript==
// @name         Auto-Personalzuweiser
// @namespace    leeSalami.lss
// @version      1.1.6
// @description  Weist Personal zu allen Fahrzeugen einer Wache hinzu
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/
// @match        https://*.leitstellenspiel.de/buildings/*
// @match        https://*.leitstellenspiel.de/vehicles/*/zuweisung
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js?v=1
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/508103/Auto-Personalzuweiser.user.js
// @updateURL https://update.greasyfork.org/scripts/508103/Auto-Personalzuweiser.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  /**
   * WICHTIG!
   * Personalzuweiser-Skript (https://update.greasyfork.org/scripts/482930/%2A%20Personalzuweiser.user.js) muss installiert sein (Version 2.5 oder neuer).
   */

  // You can customize the hotkeys according to your needs. Helpful tool to find the codes: https://www.toptal.com/developers/keycode
  const ASSIGN_PERSONNEL_HOTKEY = 'KeyK';

  const vehicleIdsStoreId = 'ava-vehicle-ids'
  const incompleteVehicleIdsStoreId = 'ava-incomplete-vehicle-ids'
  let buildingId;
  let buildingVehicles = null;
  let vehiclesWithMissingPersonnel = await getStoredValue(vehicleIdsStoreId);
  let incompleteVehicleIds = await getStoredValue(incompleteVehicleIdsStoreId);

  if (document.getElementById('personal_table') && vehiclesWithMissingPersonnel.length > 0) {
    const vehicleId = getVehicleId();
    const vehicle = vehiclesWithMissingPersonnel.find(vehicle => vehicle.id === vehicleId);

    if (vehicle) {
      document.getElementById('back_to_vehicle').setAttribute('vehicle_type_id', vehicle.vehicle_type);
      if (window.personnelInit === true) {
        await assignPersonnel();
      } else {
        document.addEventListener('personnel-init', assignPersonnel);
      }

      return;
    }
  }

  const hireButton = document.querySelector('dl > dd a[href$="/hire"]');

  if (!hireButton || !document.querySelectorAll('#vehicle_table tbody tr')?.length) {
    return;
  }

  vehiclesWithMissingPersonnel = [];
  setStoredValue(vehicleIdsStoreId, vehiclesWithMissingPersonnel);
  createButton();
  markIncompleteVehicles();

  function createButton() {
    const anchor = document.createElement('a');
    anchor.className = 'btn btn-default btn-xs';
    anchor.innerText = 'Zuweisen';
    anchor.href = '';
    anchor.addEventListener('click', assignPersonnelClick);

    hireButton.parentNode.insertBefore(anchor, hireButton.nextSibling);

    document.addEventListener('keydown', (e) => {
      if (e.code === ASSIGN_PERSONNEL_HOTKEY) {
        assignPersonnelStart();
      }
    });
  }

  function markIncompleteVehicles() {
    if (!incompleteVehicleIds.length) {
      return;
    }

    for (let i = 0, n = incompleteVehicleIds.length; i < n; i++) {
      const vehicleElement = document.querySelector('#vehicle_table tbody td > a[href$="' + incompleteVehicleIds[i] + '"');
      const vehicleRowElement = vehicleElement.parentElement.parentElement;
      vehicleRowElement.querySelector('td:nth-of-type(2) > a').style.color = '#ff0000';
      vehicleRowElement.querySelector('td:last-of-type').style.color = '#ff0000';
    }

    deleteStoredValue(incompleteVehicleIdsStoreId);
    alert('Nicht alle Fahrzeuge konnten vollständig besetzt werden.')
  }

  async function assignPersonnelClick(e) {
    e.preventDefault();
    await assignPersonnelStart();
  }

  async function assignPersonnelStart() {
    buildingId = getBuildingId();
    buildingVehicles = await fetchBuildingVehicles(buildingId);

    vehiclesWithMissingPersonnel = await getVehiclesWithMissingPersonnel();
    setStoredValue(vehicleIdsStoreId, vehiclesWithMissingPersonnel);

    if (vehiclesWithMissingPersonnel.length > 0) {
      location.assign(`${window.location.origin}/vehicles/${vehiclesWithMissingPersonnel[0].id}/zuweisung`);
    }
  }

  async function assignPersonnel() {
    const counterElement = document.getElementById('count_personal');
    const vehicleCapacity = parseInt(counterElement.parentElement.firstElementChild.innerText);
    const assignedPersonnel = parseInt(counterElement.innerText);
    await new Promise(r => setTimeout(r, 50));

    if (assignedPersonnel > 0 && assignedPersonnel !== vehicleCapacity) {
      document.addEventListener('personnel-reset', assignPersonnel);
      document.getElementById('reset_assigned_personnel')?.click();
    } else if(assignedPersonnel !== vehicleCapacity) {
      document.addEventListener('personnel-assignment-incomplete', assignmentIncomplete);
      document.addEventListener('personnel-assigned', assignPersonnelFinish);
      document.getElementById('assign_personnel')?.click();
    } else {
      await assignPersonnelFinish();
    }
  }

  function assignmentIncomplete() {
    incompleteVehicleIds.push(getVehicleId());
    setStoredValue(incompleteVehicleIdsStoreId, incompleteVehicleIds);
  }

  async function assignPersonnelFinish() {
    vehiclesWithMissingPersonnel.shift();
    setStoredValue(vehicleIdsStoreId, vehiclesWithMissingPersonnel);
    await new Promise(r => setTimeout(r, 50));

    if (vehiclesWithMissingPersonnel.length > 0) {
      location.assign(`${window.location.origin}/vehicles/${vehiclesWithMissingPersonnel[0].id}/zuweisung`);
    } else {
      document.querySelector('.breadcrumb a[href^="/buildings/"]')?.click();
    }
  }

  function getBuildingId() {
    const hireButtonHrefParts = hireButton.href.split('/');

    return hireButtonHrefParts[hireButtonHrefParts.length - 2];
  }

  function getVehicleId() {
    const backToVehicleButtonHrefParts = document.getElementById('back_to_vehicle')?.href?.split('/');

    if (!backToVehicleButtonHrefParts) {
      return null;
    }

    return parseInt(backToVehicleButtonHrefParts[backToVehicleButtonHrefParts.length - 1]);
  }

  async function getVehiclesWithMissingPersonnel() {
    const db = await openDb();
    await updateVehicleTypes(db);
    let vehiclesWithMissingPersonnel = [];

    for (let i = 0, n = buildingVehicles.length; i < n; i++) {
      const vehicle = await getData(db, 'vehicleTypes', buildingVehicles[i]['vehicle_type']);
      const neededPersonnelCount = buildingVehicles[i]['max_personnel_override'] ?? vehicle['maxPersonnel'];

      if (vehicle['maxPersonnel'] !== 0 && buildingVehicles[i]['assigned_personnel_count'] !== neededPersonnelCount) {
        vehiclesWithMissingPersonnel.push({'id': buildingVehicles[i]['id'], 'vehicle_type': buildingVehicles[i]['vehicle_type']});
      }
    }

    return vehiclesWithMissingPersonnel;
  }

  async function fetchBuildingVehicles(buildingId) {
    let vehicles = null;

    try {
      const buildingVehicles = await (await fetch(`/api/v2/buildings/${buildingId}/vehicles`)).json();

      if (buildingVehicles.result) {
        vehicles = buildingVehicles.result
      }
    } catch(e) {
      return null;
    }

    return vehicles;
  }

  async function getStoredValue(storeId) {
    return JSON.parse(await GM.getValue(storeId, '[]'));
  }

  function setStoredValue(storeId, value) {
    GM.setValue(storeId, JSON.stringify(value));
  }

  function deleteStoredValue(storeId) {
    GM.deleteValue(storeId);
  }
})()
