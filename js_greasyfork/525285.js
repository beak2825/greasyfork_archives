// ==UserScript==
// @name         Alle Fahrzeuge zuweisen
// @namespace    leeSalami.lss
// @version      1.2.7
// @license      All Rights Reserved
// @description  Ermöglicht das Zuweisen von Personal für alle Fahrzeuge mit fehlenden Zuweisungen. Die Einstellungen zu diesem Skript befinden sich unter Profil -> Einstellungen (https://www.leitstellenspiel.de/settings/index).
// @author       leeSalami
// @require      https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js?v=1
// @match        https://*.leitstellenspiel.de/
// @match        https://*.leitstellenspiel.de/buildings/*
// @match        https://*.leitstellenspiel.de/vehicles/*/zuweisung
// @match        https://*.leitstellenspiel.de/settings/index*
// @match        https://*.meldkamerspel.com/buildings/*
// @match        https://*.meldkamerspel.com/vehicles/*/zuweisung
// @match        https://*.meldkamerspel.com/settings/index*
// @exclude      /expand$/
// @exclude      /new$/
// @exclude      /personals$/
// @exclude      /hire$/
// @exclude      /edit$/
// @exclude      /move$/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/525285/Alle%20Fahrzeuge%20zuweisen.user.js
// @updateURL https://update.greasyfork.org/scripts/525285/Alle%20Fahrzeuge%20zuweisen.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const buildingTypeId = parseInt(document.querySelector('h1[building_type]')?.getAttribute('building_type'), 10);

  if (buildingTypeId === 14 || document.getElementById('schooling')) {
    return;
  }

  const HOTKEY_START_STORAGE_KEY = 'hotkey_start';
  const HOTKEY_START_DEFAULT = {
    'key': 'K',
    'code': 'KeyK',
    'ctrlKey': false,
    'altKey': false,
    'shiftKey': false,
    'metaKey': false
  };
  const HOTKEY_STOP_STORAGE_KEY = 'hotkey_stop';
  const HOTKEY_STOP_DEFAULT = {
    'key': 'K',
    'code': 'KeyK',
    'ctrlKey': false,
    'altKey': false,
    'shiftKey': true,
    'metaKey': false
  };
  const HOTKEY_GLOBAL_STORAGE_KEY = 'hotkey_global';
  const HOTKEY_GLOBAL_DEFAULT = {
    'key': 'K',
    'code': 'KeyK',
    'ctrlKey': true,
    'altKey': false,
    'shiftKey': false,
    'metaKey': false
  };
  const SKIP_FMS_6_VEHICLES_STORAGE_KEY = 'skip_fms_6_vehicles';
  const SKIP_FMS_6_VEHICLE_DEFAULT = true;
  const LIMIT_TO_DISPATCH_CENTERS_STORAGE_KEY = 'limit_to_dispatch_centers';
  const LIMIT_TO_BUILDINGS_STORAGE_KEY = 'limit_to_buildings';
  const LIMIT_TO_VEHICLE_TYPES_STORAGE_KEY = 'limit_to_vehicle_types';
  const EXCLUDED_VEHICLE_TYPES_STORAGE_KEY = 'exclude_vehicle_types';
  const LIMIT_TO_BUILDING_TYPES_STORAGE_KEY = 'limit_to_building_types';
  const EXCLUDED_BUILDING_TYPES_STORAGE_KEY = 'exclude_building_types';
  const INCOMPLETE_VEHICLES_TO_FMS_6_STORAGE_KEY = 'incomplete_vehicles_to_fms_6';
  const INCOMPLETE_VEHICLES_TO_FMS_6_DEFAULT = true;
  const COMPLETE_VEHICLES_TO_FMS_2_STORAGE_KEY = 'complete_vehicles_to_fms_2';
  const SET_TO_MINIMUM_VEHICLE_CAPACITY_STORAGE_KEY = 'set_to_minimum_vehicle_capacity';
  const SET_TO_MAXIMUM_VEHICLE_CAPACITY_STORAGE_KEY = 'set_to_maximum_vehicle_capacity';

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'assign_all_vehicles_config',
      'title': 'Alle Fahrzeuge zuweisen',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
        },
        {
          'type': 'hotkey',
          'key': HOTKEY_START_STORAGE_KEY,
          'default': HOTKEY_START_DEFAULT,
          'label': 'Hotkey zum Starten der Zuweisung'
        },
        {
          'type': 'hotkey',
          'key': HOTKEY_STOP_STORAGE_KEY,
          'default': HOTKEY_STOP_DEFAULT,
          'label': 'Hotkey zum Stoppen der Zuweisung'
        },
        {
          'type': 'select',
          'selectType': 'vehicle_types',
          'key': LIMIT_TO_VEHICLE_TYPES_STORAGE_KEY,
          'label': 'Auf folgende Fahrzeugtypen beschränken',
          'title': 'Fahrzeugtypen',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'vehicle_types',
          'key': EXCLUDED_VEHICLE_TYPES_STORAGE_KEY,
          'label': 'Folgende Fahrzeugtypen überspringen',
          'title': 'Fahrzeugtypen',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'building_types',
          'key': LIMIT_TO_BUILDING_TYPES_STORAGE_KEY,
          'label': 'Auf folgende Gebäudetypen beschränken',
          'title': 'Gebäudetypen',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'building_types',
          'key': EXCLUDED_BUILDING_TYPES_STORAGE_KEY,
          'label': 'Folgende Gebäudetypen überspringen',
          'title': 'Gebäudetypen',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'mission_generating_buildings',
          'key': LIMIT_TO_BUILDINGS_STORAGE_KEY,
          'label': 'Auf folgende Gebäude beschränken',
          'title': 'Gebäude',
          'multiple': true
        },
        {
          'type': 'checkbox',
          'key': SKIP_FMS_6_VEHICLES_STORAGE_KEY,
          'label': 'Fahrzeuge im FMS 6 überspringen',
          'default': SKIP_FMS_6_VEHICLE_DEFAULT
        },
        {
          'type': 'checkbox',
          'key': INCOMPLETE_VEHICLES_TO_FMS_6_STORAGE_KEY,
          'label': 'Unvollständig zugewiesene Fahrzeuge in FMS 6 setzen',
          'default': INCOMPLETE_VEHICLES_TO_FMS_6_DEFAULT
        },
        {
          'type': 'checkbox',
          'key': COMPLETE_VEHICLES_TO_FMS_2_STORAGE_KEY,
          'label': 'Vollständig zugewiesene Fahrzeuge in FMS 2 setzen. (Option "Fahrzeuge im FMS 6 überspringen" muss deaktiviert sein)'
        },
        {
          'type': 'checkbox',
          'key': SET_TO_MINIMUM_VEHICLE_CAPACITY_STORAGE_KEY,
          'label': 'Fahrzeuge auf min. Personal setzen'
        },
        {
          'type': 'checkbox',
          'key': SET_TO_MAXIMUM_VEHICLE_CAPACITY_STORAGE_KEY,
          'label': 'Fahrzeuge auf max. Personal setzen'
        },
        {
          'type': 'header',
          'text': 'Vollständige Zuweisung'
        },
        {
          'type': 'hotkey',
          'key': HOTKEY_GLOBAL_STORAGE_KEY,
          'default': HOTKEY_GLOBAL_DEFAULT,
          'label': 'Hotkey zum Starten der vollständigen Zuweisung'
        },
        {
          'type': 'select',
          'selectType': 'dispatch_centers',
          'key': LIMIT_TO_DISPATCH_CENTERS_STORAGE_KEY,
          'label': 'Auf folgende Leitstellen beschränken',
          'title': 'Leitstellen',
          'multiple': true
        }
      ]
    });
    return;
  }

  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  let hotkeyStart = await GM.getValue(HOTKEY_START_STORAGE_KEY);

  if (hotkeyStart === undefined) {
    hotkeyStart = HOTKEY_START_DEFAULT;
  } else {
    hotkeyStart = JSON.parse(hotkeyStart);
  }

  let hotkeyStop = await GM.getValue(HOTKEY_STOP_STORAGE_KEY);

  if (hotkeyStop === undefined) {
    hotkeyStop = HOTKEY_STOP_DEFAULT;
  } else {
    hotkeyStop = JSON.parse(hotkeyStop);
  }

  let hotkeyGlobal = await GM.getValue(HOTKEY_GLOBAL_STORAGE_KEY);

  if (hotkeyGlobal === undefined) {
    hotkeyGlobal = HOTKEY_GLOBAL_DEFAULT;
  } else {
    hotkeyGlobal = JSON.parse(hotkeyGlobal);
  }

  unsafeWindow.resetIncompleteVehicles = true;

  const AAV_DB_NAME = 'lss-assign-all-vehicles-storage';
  const AAV_DB_VERSION = 1;

  const runStoreId = 'aav-run';
  const db = await openDb();
  const aavDb = await openAavDb();
  const personnelTable = document.getElementById('personal_table');
  const body = document.querySelector('body');
  let incorrectVehicles = [];
  let buildingId = null;
  let dispatchCenterId = null;
  let isGlobal = false;
  let totalToAssign = 0;
  let totalAssigned = 0;
  let complete = 0;
  let incomplete = 0;
  let currentStateSpan;
  let progressBar;
  let progressBarIncomplete;
  let iframe;
  let skipFms6Vehicles;
  let limitToDispatchCenters;
  let limitToBuildings;
  let limitToVehicleTypes;
  let excludeVehicleTypes;
  let limitToBuildingTypes;
  let excludeBuildingTypes;
  let incompleteVehiclesToFms6;
  let completeVehiclesToFms2;
  let setToMinimumVehicleCapacity;
  let setToMaximumVehicleCapacity;

  document.addEventListener('keydown', async (e) => {
    if (e.code === hotkeyStop.code && e.ctrlKey === hotkeyStop.ctrlKey && e.altKey === hotkeyStop.altKey && e.shiftKey === hotkeyStop.shiftKey && e.metaKey === hotkeyStop.metaKey && await GM.getValue(runStoreId, false) && sessionStorage.getItem(runStoreId)) {
      await abortAssigning();
      return;
    } else if (e.code === hotkeyStart.code && e.ctrlKey === hotkeyStart.ctrlKey && e.altKey === hotkeyStart.altKey && e.shiftKey === hotkeyStart.shiftKey && e.metaKey === hotkeyStart.metaKey) {
      if (buildingTypeId === 7) {
        dispatchCenterId = getBuildingId();
      } else {
        buildingId = getBuildingId();
      }
    } else if (e.code === hotkeyGlobal.code && e.ctrlKey === hotkeyGlobal.ctrlKey && e.altKey === hotkeyGlobal.altKey && e.shiftKey === hotkeyGlobal.shiftKey && e.metaKey === hotkeyGlobal.metaKey) {
      isGlobal = true;
    } else {
      return;
    }

    if (await GM.getValue(runStoreId, false) && !sessionStorage.getItem(runStoreId)) {
      createNavbar();
      currentStateSpan.className = 'label label-danger';
      currentStateSpan.innerText = 'Zuweisung läuft bereits in einem anderen Tab';
      return;
    } else if (await GM.getValue(runStoreId, false) && sessionStorage.getItem(runStoreId)) {
      return;
    }

    await startAssigning();
  });

  if (personnelTable) {
    await waitFor('personnelInit');
  } else {
    createBuildingButtons();
  }

  if (sessionStorage.getItem(runStoreId)) {
    await assignPersonnel();
  }

  async function stopAssigning() {
    sessionStorage.removeItem(runStoreId);
    await GM.deleteValue(runStoreId);
    window.removeEventListener('message', handleMessage);
    iframe?.remove();
    buildingId = null;
    dispatchCenterId = null;
    isGlobal = false;
    totalToAssign = 0;
    totalAssigned = 0;
    complete = 0;
    incomplete = 0;
  }

  async function abortAssigningEvent(event) {
    event.preventDefault();
    await abortAssigning();
  }

  async function abortAssigning(message = 'Abgebrochen', type = 'danger') {
    await stopAssigning();
    createNavbar();
    currentStateSpan.className = `label label-${type}`;
    currentStateSpan.innerText = message;
  }

  async function startAssigning() {
    document.addEventListener('unload', stopAssigning);
    createNavbar();
    resetProgress();

    setToMinimumVehicleCapacity = await GM.getValue(SET_TO_MINIMUM_VEHICLE_CAPACITY_STORAGE_KEY, false);
    setToMaximumVehicleCapacity = await GM.getValue(SET_TO_MAXIMUM_VEHICLE_CAPACITY_STORAGE_KEY, false);

    if (setToMinimumVehicleCapacity && setToMaximumVehicleCapacity) {
      await abortAssigning();
      alert('Die Optionen "Fahrzeuge auf min. Personal setzen" und "Fahrzeuge auf max. Personal setzen" dürfen nicht gleichzeitig aktiv sein.');
      return;
    } else if (setToMinimumVehicleCapacity && (isGlobal || buildingTypeId === 7) && !confirm(`Vor der Zuweisung werden alle Fahrzeuge ${isGlobal ? '(globale Zuweisung)' : 'dieser Leitstelle'} auf das jeweils minimale Personal eingestellt. Fortfahren?`)) {
      await abortAssigning();
      return;
    } else if (setToMaximumVehicleCapacity && (isGlobal || buildingTypeId === 7) && !confirm(`Vor der Zuweisung werden alle Fahrzeuge ${isGlobal ? '(globale Zuweisung)' : 'dieser Leitstelle'} auf das jeweils maximale Personal eingestellt. Fortfahren?`)) {
      await abortAssigning();
      return;
    }

    skipFms6Vehicles = await GM.getValue(SKIP_FMS_6_VEHICLES_STORAGE_KEY, SKIP_FMS_6_VEHICLE_DEFAULT);
    incompleteVehiclesToFms6 = await GM.getValue(INCOMPLETE_VEHICLES_TO_FMS_6_STORAGE_KEY, INCOMPLETE_VEHICLES_TO_FMS_6_DEFAULT);
    completeVehiclesToFms2 = await GM.getValue(COMPLETE_VEHICLES_TO_FMS_2_STORAGE_KEY, false);
    limitToBuildings = JSON.parse(await GM.getValue(LIMIT_TO_BUILDINGS_STORAGE_KEY, '[]'));
    limitToVehicleTypes = JSON.parse(await GM.getValue(LIMIT_TO_VEHICLE_TYPES_STORAGE_KEY, '[]'));
    excludeVehicleTypes = JSON.parse(await GM.getValue(EXCLUDED_VEHICLE_TYPES_STORAGE_KEY, '[]'));
    limitToBuildingTypes = JSON.parse(await GM.getValue(LIMIT_TO_BUILDING_TYPES_STORAGE_KEY, '[]'));
    excludeBuildingTypes = JSON.parse(await GM.getValue(EXCLUDED_BUILDING_TYPES_STORAGE_KEY, '[]'));

    if (isGlobal) {
      limitToDispatchCenters = JSON.parse(await GM.getValue(LIMIT_TO_DISPATCH_CENTERS_STORAGE_KEY, '[]'));
    } else {
      limitToDispatchCenters = [];
    }

    sessionStorage.setItem(runStoreId, 'true');
    await GM.setValue(runStoreId, true);
    currentStateSpan.className = 'label label-info';
    currentStateSpan.innerText = 'Fahrzeuge werden geladen...';
    await fetchIncompleteVehicles(buildingId, dispatchCenterId);

    if (!sessionStorage.getItem(runStoreId)) {
      return;
    }

    updateProgress();
    createIframe();
    await assignPersonnel();
  }

  function createIframe() {
    iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    window.addEventListener('message', handleMessage);
    body.append(iframe);
  }

  function createNavbar() {
    if (document.getElementById('assign-all-vehicles-nav')) {
      return;
    }

    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-default navbar-fixed-bottom';
    nav.id = 'assign-all-vehicles-nav';

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'row';
    wrapper.style.justifyContent = 'space-between';
    wrapper.style.alignItems = 'center';
    wrapper.style.marginLeft = '15px';
    wrapper.style.marginRight = '15px';

    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.marginRight = '75px';

    const cancelButton = document.createElement('input');
    cancelButton.type = 'submit';
    cancelButton.className = 'btn btn-default navbar-btn';
    cancelButton.value = 'Abbrechen';
    cancelButton.style.marginLeft = '15px';
    cancelButton.addEventListener('click', abortAssigningEvent);

    buttonWrapper.append(cancelButton);
    wrapper.append(buttonWrapper);

    currentStateSpan = document.createElement('span');
    currentStateSpan.className = 'label label-success';
    currentStateSpan.style.minWidth = '250px';
    currentStateSpan.style.fontSize = '14px';
    currentStateSpan.style.marginRight = '15px';
    currentStateSpan.innerText = 'Bereit';

    const progressWrapper = document.createElement('div');
    progressWrapper.className = 'progress';
    progressWrapper.style.marginBottom = '0';
    progressWrapper.style.flex = '1';

    progressBar = document.createElement('div');
    progressBar.className = 'progress-bar progress-bar-success';
    progressBar.style.width = '0%';

    progressBarIncomplete = document.createElement('div');
    progressBarIncomplete.className = 'progress-bar progress-bar-danger';
    progressBarIncomplete.style.width = '0%';

    progressWrapper.append(progressBar, progressBarIncomplete);

    nav.append(wrapper);
    wrapper.append(currentStateSpan, progressWrapper);
    body.append(nav);
  }

  function resetProgress() {
    currentStateSpan.className = 'label label-success';
    currentStateSpan.innerText = 'Bereit';
    progressBar.style.width = '0%';
    progressBarIncomplete.style.width = '0%';
  }

  function updateProgress() {
    currentStateSpan.className = 'label label-warning';
    currentStateSpan.innerText = `${totalAssigned.toLocaleString()}/${totalToAssign.toLocaleString()} Fahrzeuge`;
    progressBar.style.width = `${complete / totalToAssign * 100}%`;
    progressBarIncomplete.style.width = `${incomplete / totalToAssign * 100}%`;

    if (totalAssigned === totalToAssign) {
      currentStateSpan.className = 'label label-success';
      currentStateSpan.innerText = `${totalAssigned.toLocaleString()}/${totalToAssign.toLocaleString()} Fahrzeuge zugewiesen`;
    }
  }

  async function handleMessage(event) {
    if (event.data.status === 'assigned') {
      totalAssigned++;
      updateProgress();
    } else if (event.data.status === 'assignment-finished-success') {
      updateProgress();
      await stopAssigning();
    } else if (event.data.status === 'incomplete') {
      incomplete++
      updateProgress();
      if (incompleteVehiclesToFms6 && event.data.vehicle.fms_real === 2) {
        await disableVehicle(event.data.vehicle.id);
      }
    } else if (event.data.status === 'complete') {
      complete++
      updateProgress();
      if (completeVehiclesToFms2 && event.data.vehicle.fms_real === 6) {
        await enableVehicle(event.data.vehicle.id);
      }
    }
  }

  async function assignPersonnel() {
    incorrectVehicles = await getAllVehicles(aavDb);

    if (incorrectVehicles.length > 0) {
      if (personnelTable) {
        const vehicleId = getVehicleId();

        if (incorrectVehicles[0].id === vehicleId) {
          document.getElementById('back_to_vehicle').setAttribute('vehicle_type_id', incorrectVehicles[0].vehicle_type);
          if (incorrectVehicles[0].assigned_personnel_count) {
            await reset();
          } else {
            await assign();
          }
        } else {
          await new Promise(r => setTimeout(r, 50));
          iframe.src = `${window.location.origin}/vehicles/${incorrectVehicles[0].id}/zuweisung`
        }
      } else {
        await new Promise(r => setTimeout(r, 50));
        iframe.src = `${window.location.origin}/vehicles/${incorrectVehicles[0].id}/zuweisung`
      }
    } else {
      sessionStorage.removeItem(runStoreId);
      await GM.deleteValue(runStoreId);
    }
  }

  async function assign() {
    document.addEventListener('personnel-assignment-incomplete', () => {
      window.parent.postMessage({'status': 'incomplete', 'vehicle': incorrectVehicles[0]});
    });
    document.addEventListener('personnel-assignment-complete', () => {
      window.parent.postMessage({'status': 'complete', 'vehicle': incorrectVehicles[0]});
    });
    document.addEventListener('personnel-assigned', assignPersonnelFinish);
    await new Promise(r => setTimeout(r, 20));
    document.getElementById('assign_personnel')?.click();
  }

  async function reset() {
    document.addEventListener('personnel-reset', assign);
    await new Promise(r => setTimeout(r, 20));
    document.getElementById('reset_assigned_personnel')?.click();
  }

  async function disableVehicle(vehicleId){
    await fetch(`/vehicles/${vehicleId}/set_fms/6`, { redirect: 'manual' });
    await new Promise(r => setTimeout(r, 50));
  }

  async function enableVehicle(vehicleId){
    await fetch(`/vehicles/${vehicleId}/set_fms/2`, { redirect: 'manual' });
    await new Promise(r => setTimeout(r, 50));
  }

  async function assignPersonnelFinish() {
    await deleteVehicle(aavDb, incorrectVehicles[0].id);
    incorrectVehicles.shift();
    window.parent.postMessage({'status': 'assigned'});

    if (incorrectVehicles.length > 0) {
      await new Promise(r => setTimeout(r, 50));
      location.assign(`${window.location.origin}/vehicles/${incorrectVehicles[0].id}/zuweisung`);
    } else {
      window.parent.postMessage({'status': 'assignment-finished-success'});
    }
  }

  async function fetchIncompleteVehicles(buildingId = null, dispatchCenterId = null) {
    let dispatchCenterIds = [];
    let buildingIds = [];

    if (dispatchCenterId && !buildingId) {
      dispatchCenterIds = [dispatchCenterId];
    } else if (limitToDispatchCenters.length > 0 && !buildingId) {
      dispatchCenterIds = limitToDispatchCenters;
    }

    if (buildingId) {
      buildingIds = [buildingId];
    } else if (limitToBuildings.length > 0) {
      buildingIds = limitToBuildings;
    }

    await updateVehicleTypes(db);

    if (!sessionStorage.getItem(runStoreId)) {
      return;
    }

    if (dispatchCenterIds.length > 0) {
      await updateBuildings(db, 60);
    }

    if (!sessionStorage.getItem(runStoreId)) {
      return;
    }

    let vehicles;
    if (buildingId) {
      await updateVehiclesByBuildingId(db, buildingId);
      vehicles = await getDataByIndex(db, 'vehicles', 'building_id', IDBKeyRange.only(buildingId));
    } else {
      await updateVehicles(db, 60);
      vehicles = await getAllData(db, 'vehicles');
    }

    if (!sessionStorage.getItem(runStoreId)) {
      return;
    }

    await clearVehicles(aavDb);
    currentStateSpan.className = 'label label-info';
    currentStateSpan.innerText = 'Fahrzeuge werden vorbereitet...';
    const buildings = {};

    for (let i = 0, n = vehicles.length; i < n; i++) {
      if (!sessionStorage.getItem(runStoreId)) {
        return;
      }

      if (
        (buildingId !== null && vehicles[i].building_id !== buildingId) ||
        (skipFms6Vehicles && vehicles[i].fms_real === 6) ||
        (buildingIds.length > 0 && !buildingIds.includes(vehicles[i].building_id)) ||
        (limitToVehicleTypes.length > 0 && !limitToVehicleTypes.includes(vehicles[i].vehicle_type)) ||
        (excludeVehicleTypes.length > 0 && excludeVehicleTypes.includes(vehicles[i].vehicle_type))
      ) {
        continue;
      }

      if (dispatchCenterIds.length > 0) {
        if (!buildings.hasOwnProperty(vehicles[i].building_id)) {
          buildings[vehicles[i].building_id] = await getData(db, 'buildings', IDBKeyRange.only(vehicles[i].building_id));
        }

        if (!dispatchCenterIds.includes(buildings[vehicles[i].building_id].leitstelle_building_id)) {
          continue;
        }
      }

      if (limitToBuildingTypes.length > 0 || excludeBuildingTypes.length > 0) {
        if (!buildings.hasOwnProperty(vehicles[i].building_id)) {
          buildings[vehicles[i].building_id] = await getData(db, 'buildings', IDBKeyRange.only(vehicles[i].building_id));
        }

        if (!limitToBuildingTypes.includes(buildings[vehicles[i].building_id].building_type) || excludeBuildingTypes.includes(buildings[vehicles[i].building_id].building_type)) {
          continue;
        }
      }

      let vehicleType = {};
      let maxPersonnel = 0;

      if (vehicles[i].max_personnel_override === null || setToMinimumVehicleCapacity || setToMaximumVehicleCapacity) {
        vehicleType = await getData(db, 'vehicleTypes', vehicles[i].vehicle_type);
      }

      if (setToMinimumVehicleCapacity && vehicleType.minPersonnel !== vehicleType.maxPersonnel && vehicles[i].max_personnel_override !== vehicleType.minPersonnel) {
        await new Promise(r => setTimeout(r, 150));
        await setVehicleCapacity(vehicles[i].id, vehicleType.minPersonnel);
        vehicles[i].max_personnel_override = vehicleType.minPersonnel;
      } else if (setToMaximumVehicleCapacity && vehicleType.minPersonnel !== vehicleType.maxPersonnel && vehicles[i].max_personnel_override !== null && vehicles[i].max_personnel_override !== vehicleType.maxPersonnel) {
        await new Promise(r => setTimeout(r, 150));
        await setVehicleCapacity(vehicles[i].id, vehicleType.maxPersonnel);
        vehicles[i].max_personnel_override = vehicleType.maxPersonnel;
      }

      if (vehicles[i].max_personnel_override === null) {
        if (vehicleType.maxPersonnel) {
          maxPersonnel = vehicleType.maxPersonnel;
        }
      } else {
        maxPersonnel = vehicles[i].max_personnel_override;
      }

      if (maxPersonnel === 0 || (vehicles[i].assigned_personnel_count === maxPersonnel && (!completeVehiclesToFms2 || vehicles[i].fms_real !== 6))) {
        continue;
      }

      totalToAssign++;
      await storeVehicles(aavDb, vehicles[i]);
    }
  }

  function createBuildingButtons() {
    const buildingDetailsElement = document.querySelector('.building-title ~ dl.dl-horizontal');

    if (!buildingDetailsElement) {
      return;
    }

    const dtElement = document.createElement('dt');
    const dtTextElement = document.createElement('strong');
    dtTextElement.innerText = 'Fahrzeuge zuweisen:';
    dtElement.appendChild(dtTextElement);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const anchorStart = document.createElement('a');
    anchorStart.className = 'btn btn-default btn-xs';
    anchorStart.innerText = 'Alle zuweisen';
    anchorStart.href = '';
    anchorStart.addEventListener('click', e => {
      e.preventDefault();
      if (buildingTypeId === 7) {
        dispatchCenterId = getBuildingId();
      } else {
        buildingId = getBuildingId();
      }
      startAssigning()
    });
    buttonGroup.appendChild(anchorStart);

    const anchorSettings = document.createElement('a');
    anchorSettings.className = 'btn btn-default btn-xs';
    anchorSettings.href = '/settings/index#assign_all_vehicles_config';
    anchorSettings.target = '_blank';

    const spanSettings = document.createElement('span');
    spanSettings.className = 'glyphicon glyphicon-cog';
    spanSettings.title = 'Einstellungen';
    anchorSettings.appendChild(spanSettings);
    buttonGroup.appendChild(anchorSettings);

    const ddElement = document.createElement('dd');
    ddElement.appendChild(buttonGroup);

    buildingDetailsElement.appendChild(dtElement);
    buildingDetailsElement.appendChild(ddElement);
  }

  async function setVehicleCapacity(vehicleId, amount) {
    const formData = new FormData();
    formData.append('utf8', '✓');
    formData.append('_method', 'put');
    formData.append('authenticity_token', csrfToken);
    formData.append('vehicle[personal_max]', amount);
    formData.append('commit', 'Speichern');

    await fetch(`/vehicles/${vehicleId}`, {
      method: 'POST',
      body: new URLSearchParams(formData),
      redirect: 'manual'
    });
  }

  function getVehicleId() {
    const backToVehicleButtonHrefParts = document.getElementById('back_to_vehicle')?.href?.split('/');

    if (!backToVehicleButtonHrefParts) {
      return null;
    }

    return parseInt(backToVehicleButtonHrefParts[backToVehicleButtonHrefParts.length - 1]);
  }

  function getBuildingId() {
    const regex = /^\/buildings\/(\d+)/;
    const matches = location.pathname.match(regex);
    return matches ? parseInt(matches[1], 10) : null;
  }

  function waitFor(variable) {
    return new Promise(resolve => {
      const loop = () => unsafeWindow[variable] !== undefined ? resolve(unsafeWindow[variable]) : setTimeout(loop)
      loop();
    });
  }

  async function openAavDb() {
    return navigator.locks.request('aav-open-db', () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(AAV_DB_NAME, AAV_DB_VERSION);

        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          if (event.oldVersion < 1) {
            db.createObjectStore('vehicles', { keyPath: 'id' });
          }

          event.target.transaction.oncomplete = () => resolve(db);
          event.target.transaction.onerror = event => reject(event.target);
        };
      });
    });
  }

  async function storeVehicles(db, data) {
    let success = true;

    return new Promise((resolve, reject) => {
      const store = db
        .transaction('vehicles', 'readwrite')
        .objectStore('vehicles');

      const request = store.put(data);

      request.onerror = () => {
        success = false;
      };

      if (success) {
        resolve('Data stored');
      } else {
        reject('Unable to store data');
      }
    });
  }

  async function clearVehicles(db) {
    let success = true;

    return new Promise((resolve, reject) => {
      const store = db
        .transaction('vehicles', 'readwrite')
        .objectStore('vehicles');

      const request = store.clear();

      request.onerror = () => {
        success = false;
      };

      if (success) {
        resolve('Data cleared');
      } else {
        reject('Unable to clear data');
      }
    });
  }

  async function deleteVehicle(db, key) {
    let success = true;

    return new Promise((resolve, reject) => {
      const store = db
        .transaction('vehicles', 'readwrite')
        .objectStore('vehicles');

      const request = store.delete(key);

      request.onerror = () => {
        success = false;
      };

      if (success) {
        resolve('Data deleted');
      } else {
        reject('Unable to delete data');
      }
    });
  }

  async function getAllVehicles(db) {
    return new Promise((resolve, reject) => {
      const request = db
        .transaction('vehicles', 'readonly')
        .objectStore('vehicles')
        .getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = () => {
        reject('Error getting data');
      };
    });
  }
})();
