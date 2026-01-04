// ==UserScript==
// @name        Skripteinstellungen
// @namespace   leeSalami.lss
// @version     1.1
// @license     All Rights Reserved
// @author      leeSalami
// @match       https://*.leitstellenspiel.de/settings/index*
// @description Basis für zentrale Einstellung verschiedener Skripte unter Profil -> Einstellungen
// @require     https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @updateURL https://update.greasyfork.org/scripts/528065/Skripteinstellungen.meta.js
// ==/UserScript==

'use strict';

async function addOptions(options) {
  const anchor = createTab(options.identifier, options.title);
  const pane = createTabPane(options.identifier);

  for (let i = 0, n = options.settings.length; i < n; i++) {
    if (options.settings[i].type === 'header') {
      addHeader(options.settings[i], pane);
    } else if (options.settings[i].type === 'text') {
      await addTextInput(options.settings[i], i, pane);
    } else if (options.settings[i].type === 'number') {
      await addNumberInput(options.settings[i], i, pane);
    } else if (options.settings[i].type === 'checkbox') {
      await addCheckbox(options.settings[i], i, pane);
    } else if (options.settings[i].type === 'select') {
      addSelect(options.settings[i], i, pane);
    } else if (options.settings[i].type === 'hotkey') {
      await addTextInput(options.settings[i], i, pane, 'hotkeyListener');
    } else if (options.settings[i].type === 'time') {
      await addTimeInput(options.settings[i], i, pane);
    }
  }

  if (location.hash === `#${options.identifier}`) {
    anchor.click();
  }
}

function createTab(settingType, settingName) {
  const tabs = document.getElementById('tabs');

  if (!tabs) {
    return;
  }

  const tab = document.createElement('li');
  tab.className = 'settings';
  tab.role = 'presentation';

  const anchor = document.createElement('a');
  anchor.href = `#${settingType}`;
  anchor.ariaControls = settingType;
  anchor.role = 'tab';
  anchor.dataset.toggle = 'tab';
  anchor.innerText = settingName;
  tab.append(anchor);

  tabs.insertAdjacentElement('beforeend', tab);

  return anchor;
}

function createTabPane(settingType) {
  const settingsTabs = document.getElementById('settings-tabs');

  if (!settingsTabs) {
    return;
  }

  const pane = document.createElement('div');
  pane.id = settingType;
  pane.className = 'tab-pane';
  pane.role = 'tabpanel';

  const settings = document.createElement('div');
  settings.className = 'settings';

  const body = document.createElement('div');
  body.className = 'settings-tab-body';

  const nav = document.createElement('nav');
  nav.className = 'navbar navbar-default navbar-fixed-bottom';

  body.append(nav);
  settings.append(body);
  pane.append(settings);
  settingsTabs.insertAdjacentElement('beforeend', pane);

  return body;
}

function addHeader(option, pane) {
  const header = document.createElement(option.hasOwnProperty('header') ? option.header : 'h2');
  header.innerText = option.text;
  pane.insertAdjacentElement('beforeend', header);
}

async function addTextInput(option, id, pane, listener = null) {
  const container = document.createElement('div');
  container.className = 'select-container';

  const group = document.createElement('div');
  group.className = 'form-group';

  const column = document.createElement('div');
  column.className = 'col-sm-6';

  const label = document.createElement('label');
  label.className = 'string';
  label.for = `input_${option.key}_${id}`;
  label.innerText = option.label;

  const input = document.createElement('input');
  input.className = 'string form-control';
  input.id = `input_${option.key}_${id}`;
  input.type = 'text';
  input.placeholder = option.placeholder ?? '';

  if (listener !== null) {
    input.value = hotkeyToString(JSON.parse(await GM.getValue(option.key, JSON.stringify(option.default))));
    input.addEventListener('keydown', (e) => listeners[listener](e, option.key));
  } else {
    input.value = await GM.getValue(option.key, option.default ?? '');
    input.addEventListener('change', (e) => GM.setValue(option.key, e.target.value));
  }

  column.append(label, input);

  if (option.hasOwnProperty('info')) {
    const info = document.createElement('span');
    info.className = 'text-muted';
    info.innerText = option.info;
    column.append(info);
  }

  group.append(column);

  pane.insertAdjacentElement('beforeend', group);
}

async function addNumberInput(option, id, pane) {
  const container = document.createElement('div');
  container.className = 'select-container';

  const group = document.createElement('div');
  group.className = 'form-group';

  const column = document.createElement('div');
  column.className = 'col-sm-6';

  const label = document.createElement('label');
  label.className = 'string';
  label.for = `input_${option.key}_${id}`;
  label.innerText = option.label;

  const input = document.createElement('input');
  input.className = 'string form-control';
  input.id = `input_${option.key}_${id}`;
  input.type = 'number';
  input.placeholder = option.placeholder ?? '';
  input.value = await GM.getValue(option.key, option.default ?? '');
  input.addEventListener('change', (e) => GM.setValue(option.key, parseInt(e.target.value, 10)));

  if (option.hasOwnProperty('max')) {
    input.max = option.max.toString();
  }

  if (option.hasOwnProperty('min')) {
    input.min = option.min.toString();
  }

  column.append(label, input);

  if (option.hasOwnProperty('info')) {
    const info = document.createElement('span');
    info.className = 'text-muted';
    info.innerText = option.info;
    column.append(info);
  }

  group.append(column);

  pane.insertAdjacentElement('beforeend', group);
}

async function addTimeInput(option, id, pane) {
  const container = document.createElement('div');
  container.className = 'select-container';

  const group = document.createElement('div');
  group.className = 'form-group';

  const column = document.createElement('div');
  column.className = 'col-sm-6';

  const label = document.createElement('label');
  label.className = 'string';
  label.for = `input_${option.key}_${id}`;
  label.innerText = option.label;

  const input = document.createElement('input');
  input.className = 'string form-control';
  input.id = `input_${option.key}_${id}`;
  input.type = 'time';
  input.placeholder = option.placeholder ?? '';
  input.value = await GM.getValue(option.key, option.default ?? '');
  input.addEventListener('change', (e) => GM.setValue(option.key, e.target.value));

  if (option.hasOwnProperty('max')) {
    input.max = option.max;
  }

  if (option.hasOwnProperty('min')) {
    input.min = option.min;
  }

  column.append(label, input);

  if (option.hasOwnProperty('info')) {
    const info = document.createElement('span');
    info.className = 'text-muted';
    info.innerText = option.info;
    column.append(info);
  }

  group.append(column);

  pane.insertAdjacentElement('beforeend', group);
}

async function addCheckbox(option, id, pane) {
  const label = document.createElement('label');
  label.className = 'check-box-label';
  label.for = `input_${option.key}_${id}`;

  const input = document.createElement('input');
  input.className = 'form-check-input';
  input.id = `input_${option.key}_${id}`;
  input.type = 'checkbox';
  input.checked = await GM.getValue(option.key, option.default ?? option.default ?? false);
  input.addEventListener('change', (e) => GM.setValue(option.key, e.currentTarget.checked));

  label.append(input);
  label.append(` ${option.label}`);

  pane.insertAdjacentElement('beforeend', label);
  pane.insertAdjacentElement('beforeend', document.createElement('br'));
}

function addSelect(option, id, pane) {
  const container = document.createElement('div');
  container.className = 'select-container';

  const label = document.createElement('label');
  label.className = 'integer';
  label.for = `input_${option.key}_${id}`;
  label.innerText = option.label;

  const group = document.createElement('div');
  group.className = 'form-group';

  const column = document.createElement('div');
  column.className = 'col-sm-6';

  const span = document.createElement('span');
  span.innerText = 'Lade...'

  const select = document.createElement('select');
  select.className = 'selectpicker select form-control';
  select.id = `input_${option.key}_${id}`;
  select.multiple = option.multiple ?? false;
  select.title = option.title ?? '';
  select.dataset.liveSearch = 'true';
  select.dataset.container = 'body';
  select.dataset.actionsBox = 'true';
  select.addEventListener('change', (e) => GM.setValue(option.key, JSON.stringify(Array.from(e.target.selectedOptions).map(el => parseInt(el.value, 10)))));

  container.append(label);
  group.append(column);
  column.append(span);
  container.append(group);

  pane.insertAdjacentElement('beforeend', container);

  if (option.hasOwnProperty('options')) {
    addSelectOptions(column, select, span, option.key, null, option.options);
  } else if (option.hasOwnProperty('selectType')) {
    addSelectOptions(column, select, span, option.key, option.selectType);
  }
}

async function addSelectOptions(column, select, loadingElement, key, selectType, options = null) {
  if (selectType === 'mission_generating_buildings') {
    options = await getBuildingOptions(null, true);
  } else if (selectType === 'dispatch_centers') {
    options = await getBuildingOptions(7);
  } else if (selectType === 'bepo_buildings') {
    options = await getBuildingOptions(11);
  } else if (selectType === 'bepo_personnel_generating_buildings') {
    options = await getBuildingOptions([6, 11]);
  } else if (selectType === 'vehicle_types') {
    options = await getVehicleTypeOptions();
  } else if (selectType === 'building_types') {
    options = await getBuildingTypeOptions();
  } else if (selectType === 'missions') {
    options = await getMissionOptions();
  } else if (selectType === 'missions_normal') {
    options = await getMissionOptions(false, true, false);
  } else if (selectType === 'missions_sw') {
    options = await getMissionOptions(true, false, false);
  }

  const selectedOptions = JSON.parse(await GM.getValue(key, '[]'));

  for (let i = 0, n = options.length; i < n; i++) {
    const selectOption = document.createElement('option');
    selectOption.value = options[i].value;
    selectOption.innerText = options[i].name;

    if (selectedOptions.includes(options[i].value)) {
      selectOption.selected = true;
    }

    select.append(selectOption);
  }

  loadingElement.remove();
  column.append(select);
  $(select).selectpicker();
}

const listeners = {
  hotkeyListener: async (event, key) => {
    event.preventDefault();
    const target = event.target;

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight' || event.code === 'ControlLeft' || event.code === 'ControlRight' || event.code === 'AltLeft' || event.code === 'AltRight' || event.code === 'MetaLeft' || event.code === 'MetaRight') {
      return;
    }

    const config = {
      'key': event.key.toUpperCase(),
      'code': event.code,
      'ctrlKey': event.ctrlKey,
      'altKey': event.altKey,
      'shiftKey': event.shiftKey,
      'metaKey': event.metaKey
    };
    target.value = hotkeyToString(config);
    target.blur();
    await GM.setValue(key, JSON.stringify(config))
  }
}

function hotkeyToString(hotkey) {
  if (!hotkey) {
    return '';
  }

  let hotkeyString = '';

  if (hotkey.ctrlKey) {
    hotkeyString += 'STRG + '
  }

  if (hotkey.altKey) {
    hotkeyString += 'ALT + '
  }

  if (hotkey.metaKey) {
    hotkeyString += 'META + '
  }

  if (hotkey.shiftKey) {
    hotkeyString += 'UMSCHALT + '
  }

  hotkeyString += hotkey.key;

  return hotkeyString;
}

async function getVehicleTypeOptions() {
  const db = await openDb();
  await updateVehicleTypes(db);
  const vehicleTypes = await getAllData(db, 'vehicleTypes');
  db.close();
  const vehicleTypeOptions = [];

  for (let i = 0, n = vehicleTypes.length; i < n; i++) {
    vehicleTypeOptions.push({'name': vehicleTypes[i].caption, 'value': vehicleTypes[i].id});
  }

  vehicleTypeOptions.sort((a, b) => a.name.localeCompare(b.name));

  return vehicleTypeOptions;
}

async function getBuildingTypeOptions() {
  const db = await openDb();
  await updateBuildingTypes(db);
  const buildingTypes = await getAllData(db, 'buildingTypes');
  db.close();
  const buildingTypeOptions = [];

  for (let i = 0, n = buildingTypes.length; i < n; i++) {
    buildingTypeOptions.push({'name': buildingTypes[i].caption, 'value': buildingTypes[i].id});
  }

  buildingTypeOptions.sort((a, b) => a.name.localeCompare(b.name));

  return buildingTypeOptions;
}

async function getBuildingOptions(buildingTypeIds = null, missionGeneratingBuildings = false) {
  const db = await openDb();
  await updateBuildings(db);
  let buildings;
  const hasMultipleBuildingTypeIds = Array.isArray(buildingTypeIds);

  if (hasMultipleBuildingTypeIds && buildingTypeIds.length > 1) {
    buildings = await getDataByIndex(db, 'buildings', 'building_type', IDBKeyRange.bound(buildingTypeIds[0], buildingTypeIds[buildingTypeIds.length - 1]));
  } else if (buildingTypeIds !== null) {
    buildings = await getDataByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(buildingTypeIds));
  } else {
    buildings = await getAllData(db, 'buildings');
  }

  db.close();
  const buildingOptions = [];

  for (let i = 0, n = buildings.length; i < n; i++) {
    if (missionGeneratingBuildings && (!buildings[i].hasOwnProperty('generates_mission_categories') || buildings[i].generates_mission_categories.length === 0)) {
      continue;
    }

    if (hasMultipleBuildingTypeIds && !buildingTypeIds.includes(buildings[i].building_type)) {
      continue;
    }

    buildingOptions.push({'name': buildings[i].caption, 'value': buildings[i].id});
  }

  buildingOptions.sort((a, b) => a.name.localeCompare(b.name));

  return buildingOptions;
}

async function getMissionOptions(includeGuardMissions = true, includeNormalMissions = true, allianceMissions = true) {
  const db = await openDb();
  await updateMissions(db);
  const missions = await getAllData(db, 'missions');
  db.close();
  const missionTypeOptions = [];

  for (let i = 0, n = missions.length; i < n; i++) {
    if (!missionTypeOptions.find(mission => mission.value === missions[i].base_mission_id) && (includeGuardMissions || !missions[i].additional.duration) && (includeNormalMissions || missions[i].additional.duration) && (allianceMissions || !missions[i].additional.only_alliance_mission)) {
      missionTypeOptions.push({'name': `${missions[i].name} (ID: ${missions[i].base_mission_id})`, 'value': missions[i].base_mission_id});
    }
  }

  missionTypeOptions.sort((a, b) => a.name.localeCompare(b.name));

  return missionTypeOptions;
}
