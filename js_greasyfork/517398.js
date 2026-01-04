// ==UserScript==
// @name         Wachenfilter für Schulen
// @namespace    leeSalami.lss
// @version      1.1
// @license      MIT
// @description  Erlaubt das Filtern nach Leitstellen in den Schulen.
// @author       leeSalami
// @match        https://*.leitstellenspiel.de/buildings/*
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @downloadURL https://update.greasyfork.org/scripts/517398/Wachenfilter%20f%C3%BCr%20Schulen.user.js
// @updateURL https://update.greasyfork.org/scripts/517398/Wachenfilter%20f%C3%BCr%20Schulen.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const schoolingElement = document.getElementById('schooling');

  if (!schoolingElement) {
    return;
  }

  const schoolBuildingTypeId = document.querySelector('.building-title > h1[building_type]')?.getAttribute('building_type');

  if (!schoolBuildingTypeId) {
    return;
  }

  const db = await openDb();
  await updateBuildingTypes(db);
  const buildingTypeIdInt = parseInt(schoolBuildingTypeId, 10);
  const schoolBuildingType = await getData(db, 'buildingTypes', buildingTypeIdInt);

  if (schoolBuildingType === undefined || !schoolBuildingType.hasOwnProperty('school')) {
    return;
  }

  let buildingElements = [];
  let filteredDispatchCenters = [];
  let dispatchCentersTotalCount = 0;

  const buildingsForSchoolType = await getBuildingsForSchoolType(buildingTypeIdInt);
  const buildingTypeIdsForSchoolType = buildingsForSchoolType.map(building => building.id);

  await updateBuildings(db);
  const relevantBuildings = (await getDataByIndex(db, 'buildings', 'building_type', IDBKeyRange.bound(buildingTypeIdsForSchoolType[0], buildingTypeIdsForSchoolType[buildingTypeIdsForSchoolType.length - 1]))).filter(building => buildingTypeIdsForSchoolType.includes(building.building_type));
  const dispatchCenters = await getDataByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(7));
  dispatchCenters.sort((a, b) => a.caption.localeCompare(b.caption));

  await waitForElm('#accordion');
  await addBuildingDataToBuildings();
  createFilterButtons(dispatchCenters);

  async function addBuildingDataToBuildings() {
    buildingElements = document.querySelectorAll('.panel.panel-default > .personal-select-heading[building_id]');

    for (let i = buildingElements.length - 1; i >= 0; i--) {
      const buildingId = parseInt(buildingElements[i].getAttribute('building_id'), 10);
      const building = relevantBuildings.find(building => building.id === buildingId);

      if (!building) {
        buildingElements.splice(i, 1);
        continue;
      }

      buildingElements[i].setAttribute('leitstelle_building_id', building.leitstelle_building_id);
    }
  }

  function createFilterButtons(dispatchCenters) {
    const selectGroup = document.createElement('div');
    selectGroup.className = 'btn-group';

    const dispatchCenterSelect = document.createElement('select');
    dispatchCenterSelect.id = 'select_dispatch_center';
    dispatchCenterSelect.className = 'selectpicker btn-group dispatch-center-filter';
    dispatchCenterSelect.multiple = true;
    dispatchCenterSelect.title = 'Leitstellen';
    dispatchCenterSelect.dataset.liveSearch = 'true';
    dispatchCenterSelect.dataset.container = 'body';
    dispatchCenterSelect.addEventListener('change', (event) => {
      filteredDispatchCenters = [];
      for (let i = 0, n = event.target.selectedOptions.length; i < n; i++) {
        filteredDispatchCenters.push(event.target.selectedOptions[i].value);
      }
      filterBuildings();
      dispatchCenterSelect.dispatchEvent(new CustomEvent('scroll', { bubbles: true }));
    });
    selectGroup.append(dispatchCenterSelect);

    for (let i = 0, n = dispatchCenters.length; i < n; i++) {
      dispatchCenterSelect.append(createDispatchCenterSelectOption(dispatchCenters[i]));
      dispatchCentersTotalCount++;
    }

    document.getElementById('btn-group-building-select').insertAdjacentElement('beforeend', selectGroup);
    $('.selectpicker.dispatch-center-filter').selectpicker();
  }

  function createDispatchCenterSelectOption(dispatchCenter) {
    const option = document.createElement('option');
    option.value = dispatchCenter.id;
    option.innerText = dispatchCenter.caption;

    return option;
  }

  async function filterBuildings() {
    const filteredDispatchCentersCount = filteredDispatchCenters.length;

    for (let i = 0, n = buildingElements.length; i < n; i++) {
      if (filteredDispatchCentersCount > 0 && filteredDispatchCentersCount !== dispatchCentersTotalCount && !filteredDispatchCenters.includes(buildingElements[i].getAttribute('leitstelle_building_id'))) {
        buildingElements[i].parentElement.classList.add('hidden');
      } else {
        buildingElements[i].parentElement.classList.remove('hidden');
      }
    }
  }

  async function getBuildingsForSchoolType(buildingTypeId) {
    const buildingTypes = await getAllData(db, 'buildingTypes');
    return buildingTypes.filter(buildingType => (buildingType.hasOwnProperty('schools') && buildingType['schools'].includes(buildingTypeId)));
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
        childList: true, subtree: true
      });
    });
  }
})();
