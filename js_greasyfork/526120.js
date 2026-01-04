// ==UserScript==
// @name         BePo-Werber 2
// @namespace    leeSalami.lss
// @version      2.2.1
// @description  Wählt unausgebildetes Personal von anderen Wachen aus, bis das gewünschte Soll erreicht ist. Die Einstellungen zu diesem Skript befinden sich unter Profil -> Einstellungen (https://www.leitstellenspiel.de/settings/index).
// @author       leeSalami
// @license      All Rights Reserved
// @match        https://*.leitstellenspiel.de/buildings/*
// @match        https://*.leitstellenspiel.de/settings/index*
// @match        https://*.meldkamerspel.com/buildings/*
// @match        https://*.meldkamerspel.com/settings/index*
// @exclude      /expand$/
// @exclude      /new$/
// @exclude      /personals$/
// @exclude      /edit$/
// @exclude      /move$/
// @exclude      /hire$/
// @require      https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/526120/BePo-Werber%202.user.js
// @updateURL https://update.greasyfork.org/scripts/526120/BePo-Werber%202.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const HOTKEY_START_STORAGE_KEY = 'hotkey_start';
  const HOTKEY_START_DEFAULT = {
    'key': 'H',
    'code': 'KeyH',
    'ctrlKey': false,
    'altKey': false,
    'shiftKey': false,
    'metaKey': false
  };
  const HOTKEY_STOP_STORAGE_KEY = 'hotkey_stop';
  const HOTKEY_STOP_DEFAULT = {
    'key': 'H',
    'code': 'KeyH',
    'ctrlKey': false,
    'altKey': false,
    'shiftKey': true,
    'metaKey': false
  };
  const TARGET_PERSONNEL_STORAGE_KEY = 'target_personnel';
  const TARGET_PERSONNEL_DEFAULT = 0;
  const MIN_POLICE_PERSONNEL_STORAGE_KEY = 'min_police_personnel';
  const MIN_POLICE_PERSONNEL_DEFAULT = 36;
  const MIN_BEPO_PERSONNEL_STORAGE_KEY = 'min_bepo_personnel';
  const MIN_BEPO_PERSONNEL_DEFAULT = 244;
  const EXCLUDED_TARGET_BUILDINGS_STORAGE_KEY = 'excluded_target_buildings';
  const EXCLUDED_SOURCE_DISPATCH_CENTERS_STORAGE_KEY = 'excluded_source_dispatch_centers';
  const EXCLUDED_GENERATING_BUILDINGS_STORAGE_KEY = 'excluded_generating_buildings';
  const LIMIT_TO_SOURCE_DISPATCH_CENTERS_STORAGE_KEY = 'limit_to_source_dispatch_centers';

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'bepo_recruiter',
      'title': 'BePo-Werber',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
        },
        {
          'type': 'hotkey',
          'key': HOTKEY_START_STORAGE_KEY,
          'default': HOTKEY_START_DEFAULT,
          'label': 'Hotkey zum Starten des Werbens'
        },
        {
          'type': 'hotkey',
          'key': HOTKEY_STOP_STORAGE_KEY,
          'default': HOTKEY_STOP_DEFAULT,
          'label': 'Hotkey zum Stoppen des Werbens'
        },
        {
          'type': 'number',
          'key': TARGET_PERSONNEL_STORAGE_KEY,
          'label': 'Zielpersonal der BePo-Wachen',
          'min': 0,
          'max': 400,
          'default': TARGET_PERSONNEL_DEFAULT
        },
        {
          'type': 'number',
          'key': MIN_POLICE_PERSONNEL_STORAGE_KEY,
          'label': 'Min. Personal von Polizweiwachen',
          'min': 2,
          'max': 400,
          'default': MIN_POLICE_PERSONNEL_DEFAULT
        },
        {
          'type': 'number',
          'key': MIN_BEPO_PERSONNEL_STORAGE_KEY,
          'label': 'Min. Personal von BePo-Wachen',
          'min': 0,
          'max': 400,
          'default': MIN_BEPO_PERSONNEL_DEFAULT
        },
        {
          'type': 'select',
          'selectType': 'bepo_buildings',
          'key': EXCLUDED_TARGET_BUILDINGS_STORAGE_KEY,
          'label': 'Gebäude die nicht aufgefüllt werden sollen',
          'title': 'Gebäude',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'bepo_personnel_generating_buildings',
          'key': EXCLUDED_GENERATING_BUILDINGS_STORAGE_KEY,
          'label': 'Gebäude von denen kein Personal abgeworben werden soll',
          'title': 'Gebäude',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'dispatch_centers',
          'key': EXCLUDED_SOURCE_DISPATCH_CENTERS_STORAGE_KEY,
          'label': 'Leitstellen von denen kein Personal abgeworben werden soll',
          'title': 'Leitstellen',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'dispatch_centers',
          'key': LIMIT_TO_SOURCE_DISPATCH_CENTERS_STORAGE_KEY,
          'label': 'Abwerben auf diese Leitstellen beschränken',
          'title': 'Leitstellen',
          'multiple': true
        }
      ]
    });
    return;
  }

  const buildingTypeId = parseInt(document.querySelector('h1[building_type]')?.getAttribute('building_type'), 10);

  if (buildingTypeId !== 11 && buildingTypeId !== 7) {
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

  const BW_DB_NAME = 'lss-bepo-recruiter-storage';
  const BW_DB_VERSION = 1;
  const runStoreId = 'bw-run';
  const body = document.querySelector('body');
  const buildingsToUpdate = [];
  let incorrectBuildings = [];
  let successCount = 0;
  let errorCount = 0;
  let totalCount = 0;
  let availablePersonnel = 0;
  let selectedPersonnel = 0;
  let personnelToHireIds = [];
  let db;
  let bwDb;
  let currentStateSpan;
  let progressBar;
  let progressBarIncomplete;
  let buildingId = null;
  let dispatchCenterId = null;
  let targetPersonnel;
  let minPolicePersonnel;
  let minBepoPersonnel;
  let excludeTargetBuildings;
  let excludeSourceDispatchCenters;
  let excludeGeneratingBuildings;
  let limitToSourceDispatchCenters;
  let csrfToken;

  document.addEventListener('keydown', async (e) => {
    if (e.code === hotkeyStop.code && e.ctrlKey === hotkeyStop.ctrlKey && e.altKey === hotkeyStop.altKey && e.shiftKey === hotkeyStop.shiftKey && e.metaKey === hotkeyStop.metaKey && await GM.getValue(runStoreId, false) && sessionStorage.getItem(runStoreId)) {
      await abort();
    } else if (e.code === hotkeyStart.code && e.ctrlKey === hotkeyStart.ctrlKey && e.altKey === hotkeyStart.altKey && e.shiftKey === hotkeyStart.shiftKey && e.metaKey === hotkeyStart.metaKey) {
      await startHiring();
    }
  });

  createBuildingButtons();

  async function stopHiring() {
    sessionStorage.removeItem(runStoreId);
    await GM.deleteValue(runStoreId);
    totalCount = 0;
    successCount = 0;
    errorCount = 0;
    availablePersonnel = 0;
  }

  async function abortEvent() {
    await abort();
  }

  async function abort(message = 'Abgebrochen', type = 'danger') {
    await stopHiring();
    createNavbar();
    currentStateSpan.className = `label label-${type}`;
    currentStateSpan.innerText = message;
  }
  async function startHiringEvent(event) {
    event.preventDefault();
    await startHiring();
  }

  async function startHiring() {
    if (await GM.getValue(runStoreId, false) && !sessionStorage.getItem(runStoreId)) {
      createNavbar();
      currentStateSpan.className = 'label label-danger';
      currentStateSpan.innerText = 'BePo-Werbung läuft bereits in einem anderen Tab';
      return;
    } else if (await GM.getValue(runStoreId, false) && sessionStorage.getItem(runStoreId)) {
      return;
    }

    window.addEventListener('pagehide', stopHiring);
    createNavbar();

    if (buildingTypeId === 7) {
      dispatchCenterId = getBuildingId();
    } else {
      buildingId = getBuildingId();
    }

    targetPersonnel = await GM.getValue(TARGET_PERSONNEL_STORAGE_KEY, TARGET_PERSONNEL_DEFAULT);
    minPolicePersonnel = Math.max(await GM.getValue(MIN_POLICE_PERSONNEL_STORAGE_KEY, MIN_POLICE_PERSONNEL_DEFAULT), 2);
    minBepoPersonnel = await GM.getValue(MIN_BEPO_PERSONNEL_STORAGE_KEY, MIN_BEPO_PERSONNEL_DEFAULT);
    excludeTargetBuildings = JSON.parse(await GM.getValue(EXCLUDED_TARGET_BUILDINGS_STORAGE_KEY, '[]'));
    excludeSourceDispatchCenters = JSON.parse(await GM.getValue(EXCLUDED_SOURCE_DISPATCH_CENTERS_STORAGE_KEY, '[]'));
    excludeGeneratingBuildings = JSON.parse(await GM.getValue(EXCLUDED_GENERATING_BUILDINGS_STORAGE_KEY, '[]'));
    limitToSourceDispatchCenters = JSON.parse(await GM.getValue(LIMIT_TO_SOURCE_DISPATCH_CENTERS_STORAGE_KEY, '[]'));

    sessionStorage.setItem(runStoreId, 'true');
    await GM.setValue(runStoreId, true);
    currentStateSpan.className = 'label label-info';
    currentStateSpan.innerText = 'Gebäude werden geladen...';

    db = await openDb();
    bwDb = await openBwDb();
    await updateBuildings(db, 60);

    if (!sessionStorage.getItem(runStoreId)) {
      return;
    }

    await fetchBuildings();

    if (!sessionStorage.getItem(runStoreId)) {
      return;
    }

    updateProgress();
    await hirePersonnel();
  }

  function createNavbar() {
    if (document.getElementById('bepo-hire-nav')) {
      return;
    }

    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-default navbar-fixed-bottom';
    nav.id = 'bepo-hire-nav';

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
    cancelButton.addEventListener('click', abortEvent);

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

  function updateProgress() {
    const totalHired = successCount + errorCount;
    currentStateSpan.className = 'label label-warning';
    currentStateSpan.innerText = `${totalHired.toLocaleString()}/${totalCount.toLocaleString()} Gebäude`;
    currentStateSpan.title = `Verfügbares Personal: ${availablePersonnel.toLocaleString()}`;
    progressBar.style.width = `${successCount / totalCount * 100}%`;
    progressBarIncomplete.style.width = `${errorCount / totalCount * 100}%`;

    if (totalHired === totalCount) {
      currentStateSpan.className = 'label label-success';
      currentStateSpan.innerText = `${totalHired.toLocaleString()}/${totalCount.toLocaleString()} Gebäude geworben`;
    }
  }

  function createBuildingButtons() {
    const buildingDetailsElement = document.querySelector('.building-title ~ dl.dl-horizontal');

    if (!buildingDetailsElement) {
      return;
    }

    const dtElement = document.createElement('dt');
    const dtTextElement = document.createElement('strong');
    dtTextElement.innerText = 'Personal werben:';
    dtElement.appendChild(dtTextElement);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const anchorStart = document.createElement('a');
    anchorStart.className = 'btn btn-default btn-xs';
    anchorStart.innerText = 'BePo-Personal werben';
    anchorStart.href = '';
    anchorStart.addEventListener('click', startHiringEvent);
    buttonGroup.appendChild(anchorStart);

    const anchorSettings = document.createElement('a');
    anchorSettings.className = 'btn btn-default btn-xs';
    anchorSettings.href = '/settings/index#bepo_recruiter';
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

  async function hirePersonnel() {
    csrfToken = document.querySelector('meta[name=csrf-token]').content;
    incorrectBuildings = await getBuildingsWithMissingPersonnel(bwDb);

    for (let i = 0, n = incorrectBuildings.length; i < n; i++) {
      if (!sessionStorage.getItem(runStoreId)) {
        return;
      }

      personnelToHireIds = [];

      if (await getPersonnel(incorrectBuildings[i]) && personnelToHireIds.length > 0) {
        await Promise.all([
          await updateAvailableBuildingPersonnel(),
          await new Promise(r => setTimeout(r, 100))
        ]);
        await sendHireRequest(incorrectBuildings[i].id);
      } else {
        errorCount++;
        updateProgress();
      }
    }

    updateProgress();
    await stopHiring();
  }

  async function getPersonnel(buildingWithNeededPersonnel) {
    if (buildingWithNeededPersonnel.needed_personnel <= 0) {
      return;
    }

    const buildingsWithAvailablePersonnel = await getBuildingsWithAvailablePersonnel();
    let foundRequiredPersonnel = false;
    selectedPersonnel = 0;

    for (let i = 0, n = buildingsWithAvailablePersonnel.length; i < n; i++) {
      if (!sessionStorage.getItem(runStoreId)) {
        return;
      }

      const response = await fetch(`/buildings/${buildingsWithAvailablePersonnel[i].id}/schooling_personal_select`, {
        headers: {
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        }
      });

      if (response.status >= 400) {
        await new Promise(r => setTimeout(r, 100));
        continue;
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(await response.text(), 'text/html');

      if (getPersonnelIds(doc, buildingsWithAvailablePersonnel[i], buildingWithNeededPersonnel)) {
        foundRequiredPersonnel = true;
        break;
      }

      await new Promise(r => setTimeout(r, 100));
    }

    return foundRequiredPersonnel;
  }

  function getPersonnelIds(doc, buildingWithAvailablePersonnel, buildingWithNeededPersonnel) {
    const nodeSnapshots = doc.evaluate(`//table[@id="personal_table_${buildingWithAvailablePersonnel.id}"]/tbody/tr[td[3][normalize-space()=""] and td[4][normalize-space()=""] and td[1][input]]/td[1]/input`, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let complete = false;
    let personnelSelected = false;

    for (let i = 0, n = nodeSnapshots.snapshotLength; i < n; i++) {
      personnelToHireIds.push(nodeSnapshots.snapshotItem(i).getAttribute('value'));
      personnelSelected = true;
      buildingWithNeededPersonnel.needed_personnel--;
      buildingWithNeededPersonnel.personal_count++;
      buildingWithAvailablePersonnel.available_personnel--;
      selectedPersonnel++;

      if (buildingWithNeededPersonnel.needed_personnel <= 0) {
        complete = true;
        break;
      } else if (buildingWithAvailablePersonnel.available_personnel <= 0) {
        buildingWithAvailablePersonnel.available_personnel = 0;
        break;
      }
    }

    if (personnelSelected) {
      buildingsToUpdate.push(buildingWithNeededPersonnel);
      buildingsToUpdate.push(buildingWithAvailablePersonnel);
    }

    return complete;
  }

  async function fetchBuildings() {
    currentStateSpan.className = 'label label-info';
    currentStateSpan.innerText = 'Gebäude werden verarbeitet...';

    await clearBuildings(bwDb);
    const buildings = await getDataByIndex(db, 'buildings', 'building_type', IDBKeyRange.bound(6, 11));
    const isLimitedToSourceDispatchCenters = limitToSourceDispatchCenters.length > 0;

    for (let i = 0, n = buildings.length; i < n; i++) {
      if (buildings[i].building_type !== 6 && buildings[i].building_type !== 11) {
        continue;
      }

      buildings[i].available_personnel = 0;
      buildings[i].needed_personnel = 0;

      if (buildings[i].building_type === 11) {
        buildings[i].needed_personnel = Math.max(targetPersonnel - buildings[i].personal_count, 0);
      }

      if (buildings[i].needed_personnel > 0 && !excludeTargetBuildings.includes(buildings[i].id) && (buildingId === buildings[i].id || (dispatchCenterId !== null && dispatchCenterId === buildings[i].leitstelle_building_id))) {
        totalCount++;
        await storeBuilding(bwDb, buildings[i]);
        continue;
      } else if (excludeSourceDispatchCenters.includes(buildings[i].leitstelle_building_id) || excludeGeneratingBuildings.includes(buildings[i].id) || (isLimitedToSourceDispatchCenters && !limitToSourceDispatchCenters.includes(buildings[i].leitstelle_building_id))) {
        continue;
      }

      if (buildings[i].building_type === 11) {
        buildings[i].available_personnel = Math.max(buildings[i].personal_count - minBepoPersonnel, 0);
      } else {
        buildings[i].available_personnel = Math.max(buildings[i].personal_count - minPolicePersonnel, 0);
      }

      if (buildings[i].available_personnel > 0) {
        buildings[i].needed_personnel = 0;
        availablePersonnel += buildings[i].available_personnel;
        await storeBuilding(bwDb, buildings[i]);
      }
    }
  }

  async function getBuildingsWithMissingPersonnel() {
    const buildingsWithMissingPersonnel = await getDataByIndex(bwDb, 'buildings', 'needed_personnel', IDBKeyRange.lowerBound(1));
    buildingsWithMissingPersonnel.sort((a, b) => a.id - b.id);
    return buildingsWithMissingPersonnel;
  }

  async function getBuildingsWithAvailablePersonnel() {
    const buildingsWithAvailablePersonnel = await getDataByIndex(bwDb, 'buildings', 'available_personnel', IDBKeyRange.lowerBound(1));
    buildingsWithAvailablePersonnel.sort((a, b) => b.available_personnel - a.available_personnel);
    return buildingsWithAvailablePersonnel;
  }

  async function updateAvailableBuildingPersonnel() {
    for (let i = 0, n = buildingsToUpdate.length; i < n; i++) {
      await storeBuilding(bwDb, buildingsToUpdate[i]);
    }
  }

  function getBuildingId() {
    const pathnameParts = window.location.pathname.split('/');
    return parseInt(pathnameParts[pathnameParts.length - 1], 10);
  }

  async function sendHireRequest(buildingId) {
    const form = new FormData();
    form.append('utf8', '✓');
    form.append('authenticity_token', csrfToken);

    for (let i = 0, n = personnelToHireIds.length; i < n; i++) {
      form.append('personal_ids[]', personnelToHireIds[i]);
    }

    form.append('commit', 'Personal übernehmen');

    const response = await fetch(`/buildings/${buildingId}/adopt`, {
      method: 'POST',
      body: new URLSearchParams(form),
      redirect: 'manual'
    });

    if (response.status >= 400) {
      errorCount++;
      updateProgress();
    } else {
      successCount++;

      if (sessionStorage.getItem(runStoreId)) {
        availablePersonnel -= selectedPersonnel;

        if (availablePersonnel <= 0) {
          await abort('Kein freies Personal vorhanden');
        }
      }

      updateProgress();
    }
  }

  async function openBwDb() {
    return navigator.locks.request('bw-open-db', () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(BW_DB_NAME, BW_DB_VERSION);

        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          if (event.oldVersion < 1) {
            const buildingsStore = db.createObjectStore('buildings', { keyPath: 'id' });
            buildingsStore.createIndex('available_personnel', 'available_personnel', { unique: false });
            buildingsStore.createIndex('needed_personnel', 'needed_personnel', { unique: false });
          }

          event.target.transaction.oncomplete = () => resolve(db);
          event.target.transaction.onerror = event => reject(event.target);
        };
      });
    });
  }

  async function storeBuilding(db, data) {
    let success = true;

    return new Promise((resolve, reject) => {
      const store = db
        .transaction('buildings', 'readwrite')
        .objectStore('buildings');

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

  async function clearBuildings(db) {
    let success = true;

    return new Promise((resolve, reject) => {
      const store = db
        .transaction('buildings', 'readwrite')
        .objectStore('buildings');

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
})();
