// ==UserScript==
// @name         Besatzungslimit
// @namespace    leeSalami.lss
// @version      1.2.3
// @description  Limitiert die Besatzung der Fahrzeuge oder stellt die maximale Besatzungsanzahl wieder her
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/buildings/*
// @exclude      /expand$/
// @exclude      /new$/
// @exclude      /personals$/
// @exclude      /hire$/
// @exclude      /edit$/
// @exclude      /move$/
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @downloadURL https://update.greasyfork.org/scripts/513540/Besatzungslimit.user.js
// @updateURL https://update.greasyfork.org/scripts/513540/Besatzungslimit.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const buildingDetailsElement = document.querySelector('.building-title ~ dl.dl-horizontal');
  const vehicleTable = document.getElementById('vehicle_table');

  if (!buildingDetailsElement || !vehicleTable || document.querySelector('h1[building_type="14"]')) {
    return;
  }

  const minButtonClass = 'personnel-limit-min';
  const maxButtonClass = 'personnel-limit-max';
  let csrfToken = null;
  let db;
  await init();
  createGeneralButtons();

  function createGeneralButtons() {
    const dtElement = document.createElement('dt');
    const dtTextElement = document.createElement('strong');
    dtTextElement.innerText = 'Besatzungslimit:';
    dtElement.appendChild(dtTextElement);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const anchorMin = document.createElement('a');
    anchorMin.className = 'btn btn-default btn-xs personnel-limit' + ((!vehicleTable.querySelectorAll('td a.personnel-limit-min:not(.disabled)')?.length) ? ' disabled' : '');
    anchorMin.innerText = 'Minimum';
    anchorMin.href = '';
    anchorMin.dataset.buttonClassName = minButtonClass;
    anchorMin.addEventListener('click', personnelAllClick);
    buttonGroup.appendChild(anchorMin);

    const anchorMax = document.createElement('a');
    anchorMax.className = 'btn btn-default btn-xs personnel-limit' + ((!vehicleTable.querySelectorAll('td a.personnel-limit-max:not(.disabled)')?.length) ? ' disabled' : '');
    anchorMax.innerText = 'Maximum';
    anchorMax.href = '';
    anchorMax.dataset.buttonClassName = maxButtonClass;
    anchorMax.addEventListener('click', personnelAllClick);
    buttonGroup.appendChild(anchorMax);

    const ddElement = document.createElement('dd');
    ddElement.appendChild(buttonGroup);

    buildingDetailsElement.appendChild(dtElement);
    buildingDetailsElement.appendChild(ddElement);
  }

  function createMinMaxButtons(vehiclePersonnel, disabled = null) {
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const anchorMin = document.createElement('a');
    anchorMin.className = `btn btn-default btn-xs personnel-limit ${minButtonClass}`;
    anchorMin.innerText = 'Min.';
    anchorMin.href = '';
    anchorMin.dataset.value = vehiclePersonnel.min;
    anchorMin.addEventListener('click', personnelClick);
    buttonGroup.appendChild(anchorMin);

    const anchorMax = document.createElement('a');
    anchorMax.className = `btn btn-default btn-xs personnel-limit ${maxButtonClass}`;
    anchorMax.innerText = 'Max.';
    anchorMax.href = '';
    anchorMax.dataset.value = vehiclePersonnel.max;
    anchorMax.addEventListener('click', personnelClick);
    buttonGroup.appendChild(anchorMax);

    if (disabled === true || disabled === 'min') {
      anchorMin.classList.add('disabled');
    }

    if (disabled === true || disabled === 'max') {
      anchorMax.classList.add('disabled');
    }

    return buttonGroup;
  }

  async function personnelAllClick(e) {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    const buttonClassName = currentTarget.dataset.buttonClassName;
    const buttons = vehicleTable.querySelectorAll(`td a.${buttonClassName}:not(.disabled)`);

    if (!buttons) {
      return;
    }

    disableButtons();

    for (let i = 0, n = buttons.length; i < n; i++) {
      const desiredPersonnel = buttons[i].dataset.value;
      await setVehiclePersonnel(desiredPersonnel, getVehicleId(buttons[i].parentElement.parentElement.parentElement), false);
      await new Promise(r => setTimeout(r, 100));
    }

    location.reload();
  }

  async function personnelClick(e) {
    e.preventDefault();
    const currentTarget = e.currentTarget;

    if (currentTarget.classList.contains('disabled')) {
      return;
    }

    disableButtons();
    const vehicleId = getVehicleId(currentTarget.parentElement.parentElement.parentElement);
    const desiredPersonnel = currentTarget.dataset.value;
    await setVehiclePersonnel(desiredPersonnel, vehicleId, true);
  }

  async function init() {
    csrfToken = document.querySelector("meta[name=csrf-token]")?.content;
    const buildingVehicleRows = vehicleTable.querySelectorAll(':scope > tbody > tr');

    if (!db) {
      db = await openDb();
      await updateVehicleTypes(db);
    }

    for (let i = 0, n = buildingVehicleRows.length; i < n; i++) {
      const personnelCell = buildingVehicleRows[i].querySelector(':scope > td:last-child');

      if (!personnelCell) {
        continue;
      }

      const vehiclePersonnel = await getVehiclePersonnel(buildingVehicleRows[i]);

      if (!vehiclePersonnel) {
        personnelCell.appendChild(createMinMaxButtons({'min': 0, 'max': 0, 'current': 0}, true));
        continue;
      }

      const vehicleTypeIdElement = buildingVehicleRows[i].querySelector('[vehicle_type_id]');
      const vehicleTypeId = vehicleTypeIdElement?.getAttribute('vehicle_type_id');

      if (!vehicleTypeId) {
        personnelCell.appendChild(createMinMaxButtons(vehiclePersonnel, true));
        continue;
      }

      const disabled = vehiclePersonnel.max === vehiclePersonnel.current ? 'max' : vehiclePersonnel.min === vehiclePersonnel.current ? 'min' : null;
      personnelCell.appendChild(createMinMaxButtons(vehiclePersonnel, disabled));
      vehicleTypeIdElement.setAttribute('vehicle_personnel', vehiclePersonnel.current.toString())
    }
  }

  function disableButtons() {
    const buttons = document.querySelectorAll('.personnel-limit:not(.disabled)');

    for (let i = 0, n = buttons.length; i < n; i++) {
      buttons[i].classList.add('disabled', 'temporarily-disabled');
    }
  }

  function enableButtons() {
    const buttons = document.querySelectorAll('.personnel-limit.temporarily-disabled');

    for (let i = 0, n = buttons.length; i < n; i++) {
      buttons[i].classList.remove('disabled', 'temporarily-disabled');
    }
  }

  async function setVehiclePersonnel(amount, vehicleId, single) {
    if (!csrfToken) {
      return;
    }

    const formData = new FormData();
    formData.append('utf8', '✓');
    formData.append('_method', 'put');
    formData.append('authenticity_token', csrfToken);
    formData.append('vehicle[personal_max]', amount);
    formData.append('commit', 'Speichern');

    try {
      const response = await fetch(`/vehicles/${vehicleId}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams(formData).toString(),
        redirect: 'manual'
      });

      if (response.status >= 400) {
        enableButtons();
      } else if (single) {
        location.reload();
      }
    } catch (e) {
      enableButtons();
    }
  }

  async function getVehiclePersonnel(vehicleRow) {
    const vehicleTypeId = vehicleRow.querySelector('[vehicle_type_id]')?.getAttribute('vehicle_type_id');

    if (!vehicleTypeId) {
      return null;
    }

    const vehicleCurrentMaxPersonnel = vehicleRow.querySelector(':scope > td:last-child')?.innerText?.trim();

    if (!vehicleCurrentMaxPersonnel) {
      return null;
    }

    const currentMinMax = await getMinMaxPersonnel(parseInt(vehicleTypeId, 10));

    if (currentMinMax.min === currentMinMax.max) {
      return null;
    } else {
      currentMinMax.current = parseInt(vehicleCurrentMaxPersonnel, 10);
      return currentMinMax;
    }
  }

  async function getMinMaxPersonnel(typeId) {
    const vehicle = await getData(db, 'vehicleTypes', typeId);

    if (!vehicle) {
      return {'min': 0, 'max': 0, 'current': 0};
    }

    return {
      'min': vehicle['minPersonnel'],
      'max': vehicle['maxPersonnel'],
      'current': 0
    };
  }

  function getVehicleId(element) {
    const vehicleButtonHrefParts = element.querySelector('td a[href^="/vehicles/"]')?.href?.split('/');

    if (vehicleButtonHrefParts === null) {
      return null;
    }

    return vehicleButtonHrefParts[vehicleButtonHrefParts.length - 1];
  }
})();
