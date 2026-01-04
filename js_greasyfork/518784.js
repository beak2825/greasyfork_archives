// ==UserScript==
// @name         FMS 6-Umschalter
// @namespace    leeSalami.lss
// @version      1.0.4
// @description  De-/Aktiviert alle oder einzelne Fahrzeuge einer Wache (FMS 2 ↔ 6)
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/buildings/*
// @exclude      /expand$/
// @exclude      /new$/
// @exclude      /personals$/
// @exclude      /hire$/
// @exclude      /edit$/
// @exclude      /move$/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518784/FMS%206-Umschalter.user.js
// @updateURL https://update.greasyfork.org/scripts/518784/FMS%206-Umschalter.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const buildingDetailsElement = document.querySelector('.building-title ~ dl.dl-horizontal');
  const vehicleTable = document.getElementById('vehicle_table');

  if (!buildingDetailsElement || !vehicleTable || document.querySelector('h1[building_type="14"]')) {
    return;
  }

  createListButtons();
  createGeneralButtons();

  function createGeneralButtons() {
    const dtElement = document.createElement('dt');
    const dtTextElement = document.createElement('strong');
    dtTextElement.innerText = 'FMS festlegen:';
    dtElement.appendChild(dtTextElement);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const fms2Button = document.createElement('a');
    fms2Button.className = 'btn btn-default btn-xs fms-switch-all' + ((!vehicleTable.querySelectorAll('td:has(a:not(.disabled)):has(.building_list_fms_6)')?.length) ? ' disabled' : '');
    fms2Button.innerText = 'FMS 2';
    fms2Button.href = '';
    fms2Button.dataset.fms = '2';
    fms2Button.addEventListener('click', fmsAllClick);
    buttonGroup.appendChild(fms2Button);

    const fms6Button = document.createElement('a');
    fms6Button.className = 'btn btn-default btn-xs fms-switch-all' + ((!vehicleTable.querySelectorAll('td:has(a:not(.disabled)):has(.building_list_fms_2)')?.length) ? ' disabled' : '');
    fms6Button.innerText = 'FMS 6';
    fms6Button.href = '';
    fms6Button.dataset.fms = '6';
    fms6Button.addEventListener('click', fmsAllClick);
    buttonGroup.appendChild(fms6Button);

    const ddElement = document.createElement('dd');
    ddElement.appendChild(buttonGroup);

    buildingDetailsElement.appendChild(dtElement);
    buildingDetailsElement.appendChild(ddElement);
  }

  function createListButtons() {
    const fmsCells = vehicleTable.querySelectorAll('tbody td:nth-child(4)');

    for (let i = 0, n = fmsCells.length; i < n; i++) {
      const currentFmsElement = fmsCells[i].querySelector('.building_list_fms');

      if (!currentFmsElement) {
        continue;
      }

      if (currentFmsElement.classList.contains('building_list_fms_6')) {
        fmsCells[i].appendChild(createFmsButton('2'));
      } else if (currentFmsElement.classList.contains('building_list_fms_2') && !currentFmsElement.parentElement.innerText.includes('Am Bereitstellungsraum')) {
        fmsCells[i].appendChild(createFmsButton('6'));
      } else {
        fmsCells[i].appendChild(createFmsButton('6', true));
      }
    }
  }

  function createFmsButton(fms, disabled = false) {
    const fmsButton = document.createElement('a');
    fmsButton.className = 'btn btn-default btn-xs fms-switch';
    fmsButton.innerText = 'FMS ' + fms;
    fmsButton.href = '';
    fmsButton.dataset.fms = fms;
    fmsButton.addEventListener('click', fmsClick);

    if (disabled) {
      fmsButton.classList.add('disabled');
    }

    return fmsButton;
  }

  async function fmsAllClick(e) {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    const fms = currentTarget.dataset.fms;
    const currentFms = fms === '2' ? '6' : '2';
    const fmsElements = vehicleTable.querySelectorAll(`td:has(a:not(.disabled)):has(.building_list_fms_${currentFms})`);
    disableButtons();

    for (let i = 0, n = fmsElements.length; i < n; i++) {
      const vehicleId = getVehicleId(fmsElements[i].parentElement);

      if (!vehicleId) {
        continue;
      }

      await setVehicleFms(fms, vehicleId, (i === n - 1));
      await new Promise(r => setTimeout(r, 100));
    }

    enableButtons();
  }

  async function fmsClick(e) {
    e.preventDefault();
    disableButtons();
    const currentTarget = e.currentTarget;
    const fms = currentTarget.dataset.fms;
    const vehicleId = getVehicleId(currentTarget.parentElement.parentElement);

    if (!vehicleId) {
      return;
    }

    await setVehicleFms(fms, vehicleId, true);
  }

  function disableButtons() {
    const buttons = document.querySelectorAll('.fms-switch:not(.disabled), .fms-switch-all:not(.disabled)');

    for (let i = 0, n = buttons.length; i < n; i++) {
      buttons[i].classList.add('disabled', 'temporarily-disabled');
    }
  }

  function enableButtons() {
    const buttons = document.querySelectorAll('#vehicle_table td:has(.building_list_fms_2, .building_list_fms_6) .fms-switch.temporarily-disabled, .fms-switch-all.temporarily-disabled');

    for (let i = 0, n = buttons.length; i < n; i++) {
      buttons[i].classList.remove('disabled', 'temporarily-disabled');
    }
  }

  async function setVehicleFms(fms, vehicleId, reload) {
    try {
      const response = await fetch(`/vehicles/${vehicleId}/set_fms/${fms}`, { redirect: 'manual' });
      if (response.status >= 400) {
        enableButtons();
      } else if (reload) {
        location.reload();
      }
    } catch (e) {
      enableButtons();
    }
  }

  function getVehicleId(element) {
    const vehicleButtonHrefParts = element.querySelector('a[href^="/vehicles/"]')?.href?.split('/');

    if (!vehicleButtonHrefParts) {
      return null;
    }

    return vehicleButtonHrefParts[vehicleButtonHrefParts.length - 1];
  }
})()
