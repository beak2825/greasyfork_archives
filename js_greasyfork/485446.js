// ==UserScript==
// @name         Sprechwunschfilter
// @namespace    leeSalami.lss
// @version      1.3.2
// @description  Fügt Filter für Sprechwünsche hinzu
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/vehicles/*
// @exclude      /zuweisung$/
// @exclude      /stats$/
// @exclude      /move$/
// @exclude      /edit$/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485446/Sprechwunschfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/485446/Sprechwunschfilter.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const AUTO_GO_TO_NEXT = true;

  let freePlaces, fees, transportationDistance, special;
  const nextButton = document.getElementById('next-vehicle-fms-5');

  if (document.querySelector('div[data-transport-request-type="patient"]')) {
    freePlaces = await GM.getValue('beds', false);
    fees = await GM.getValue('fees', '');
    transportationDistance = await GM.getValue('distance', '');
    special = await GM.getValue('special', false);

    setStyle();
    setButtons(true);
    filterHospitals();
  } else if (document.querySelector('div[data-transport-request-type="prisoner"]')) {
    freePlaces = await GM.getValue('cells', false);
    transportationDistance = await GM.getValue('jailDistance', '');
    fees = await GM.getValue('jailFees', '');

    setStyle();
    setButtons();
    filterCells();
  } else if (AUTO_GO_TO_NEXT === true && nextButton !== null) {
    nextButton.click();
  }

  function setButtons(hospital = false) {
    const container = document.createElement('div');
    container.className = 'vehicle-transport-request-filter-box';

    const titleContainer = document.createElement('div');
    titleContainer.className = 'vehicle-transport-request-filter-title-container';

    const title = document.createElement('strong');
    title.className = 'vehicle-transport-request-filter-title';
    title.textContent = 'Sprechwunschfilter';
    titleContainer.append(title);
    container.append(titleContainer);

    const select = document.createElement('select');
    select.id = 'transport_request_fee';
    select.className = 'selectpicker transport-request transport-request-filter';
    select.dataset.container = 'body';

    const options = ['', '0', '10', '20', '30', '40', '50'];

    for (let i = 0, n = options.length; i < n; i++) {
      const option = document.createElement('option');
      option.value = options[i];

      if (options[i] !== '') {
        option.text = 'max. ' + options[i] + ' %';
      } else {
        option.text = 'Unbegrenzte Abgabe';
      }

      if (fees === options[i]) {
        option.selected = true;
      }

      select.append(option);
    }

    container.append(select);

    const distanceSelect = document.createElement('select');
    distanceSelect.id = 'transport_request_distance';
    distanceSelect.className = 'selectpicker transport-request transport-request-distance-filter';
    distanceSelect.dataset.container = 'body';

    const distanceOptions = ['', '5', '10', '15', '20', '25', '50', '75', '100'];

    for (let i = 0, n = distanceOptions.length; i < n; i++) {
      const option = document.createElement('option');
      option.value = distanceOptions[i];

      if (distanceOptions[i] !== '') {
        option.text = 'max. ' + distanceOptions[i] + ' km';
      } else {
        option.text = 'Unbegrenzte Entfernung';
      }

      if (transportationDistance === distanceOptions[i]) {
        option.selected = true;
      }

      distanceSelect.append(option);
    }

    container.append(distanceSelect);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    if (hospital) {
      const specialDepartmentToggle = document.createElement('a');
      specialDepartmentToggle.className = 'btn';
      specialDepartmentToggle.id = 'special_department_toggle';
      specialDepartmentToggle.title = 'Grün = Es wird nach Fachabteilung gefiltert. Rot = Es wird nicht nach Fachabteilung gefiltert.';
      specialDepartmentToggle.textContent = 'Fachabteilung';
      specialDepartmentToggle.addEventListener('click', patientConfigChange);

      if (special === true) {
        specialDepartmentToggle.classList.add('btn-success');
      } else {
        specialDepartmentToggle.classList.add('btn-default');
      }

      buttonGroup.append(specialDepartmentToggle);
    }

    const freePlacesToggle = document.createElement('a');
    freePlacesToggle.className = 'btn';
    freePlacesToggle.id = 'free_places_toggle';

    if (hospital) {
      select.addEventListener('change', patientConfigChange);
      distanceSelect.addEventListener('change', patientConfigChange);

      freePlacesToggle.title = 'Grün = Es wird nach freien Betten gefiltert. Rot = Es wird nicht nach freien Betten gefiltert.';
      freePlacesToggle.textContent = 'Freie Betten';
      freePlacesToggle.addEventListener('click', patientConfigChange);
    } else {
      select.addEventListener('change', prisonerConfigChange);
      distanceSelect.addEventListener('change', prisonerConfigChange);

      freePlacesToggle.title = 'Grün = Es wird nach freien Zellen gefiltert. Rot = Es wird nicht nach freien Zellen gefiltert.';
      freePlacesToggle.textContent = 'Freie Zellen';
      freePlacesToggle.addEventListener('click', prisonerConfigChange);
    }

    if (freePlaces === true) {
      freePlacesToggle.classList.add('btn-success');
    } else {
      freePlacesToggle.classList.add('btn-default');
    }

    buttonGroup.append(freePlacesToggle);
    container.append(buttonGroup);

    if (hospital) {
      document.querySelector('div[data-transport-request-type] .alert.alert-info').after(container);
    } else {
      document.querySelector('div[data-transport-request-type] .alert.alert-info').before(container);
    }

    $('.selectpicker.transport-request').selectpicker();
  }

  async function patientConfigChange(e) {
    if (e.currentTarget.classList.contains('btn-success')) {
      e.currentTarget.classList.replace('btn-success', 'btn-default');
    } else if (e.currentTarget.classList.contains('btn-default')) {
      e.currentTarget.classList.replace('btn-default', 'btn-success');
    }

    freePlaces = !document.getElementById('free_places_toggle').classList.contains('btn-default');
    special = !document.getElementById('special_department_toggle').classList.contains('btn-default');
    fees = document.getElementById('transport_request_fee').value;
    transportationDistance = document.getElementById('transport_request_distance').value;
    filterHospitals();
    await GM.setValue('beds', freePlaces);
    await GM.setValue('fees', fees);
    await GM.setValue('distance', transportationDistance);
    await GM.setValue('special', special);
  }

  async function prisonerConfigChange(e) {
    if (e.currentTarget.classList.contains('btn-success')) {
      e.currentTarget.classList.replace('btn-success', 'btn-default');
    } else if (e.currentTarget.classList.contains('btn-default')) {
      e.currentTarget.classList.replace('btn-default', 'btn-success');
    }

    freePlaces = !document.getElementById('free_places_toggle').classList.contains('btn-default');
    fees = document.getElementById('transport_request_fee').value;
    transportationDistance = document.getElementById('transport_request_distance').value;

    filterCells();
    await GM.setValue('cells', freePlaces);
    await GM.setValue('jailFees', fees);
    await GM.setValue('jailDistance', transportationDistance);
  }

  function filterCells() {
    const cellList = document.querySelectorAll('a[href*="/gefangener/"]');

    for (let i = 0, n = cellList.length; i < n; i++) {
      const freeCells = cellList[i].textContent.match(/Freie Zellen: (.*?),/)[1];
      const cellFee = cellList[i].textContent.match(/Abgabe an Besitzer: (.*?)%/);
      const cellDistance = parseFloat(cellList[i].textContent.match(/Entfernung: (\d+(([,.])\d+)?) km/)[1].replace(',', '.'));

      if (fees !== '' && cellFee && cellFee[1] > fees) {
        cellList[i].style.display = 'none';
      } else if (transportationDistance !== '' && cellDistance && cellDistance > transportationDistance) {
        cellList[i].style.display = 'none';
      } else if (freePlaces && freeCells === '0') {
        cellList[i].style.display = 'none';
      } else {
        cellList[i].style.display = '';
      }
    }
  }

  function filterHospitals() {
    const tableRows = document.querySelectorAll('#own-hospitals > tbody > tr, #alliance-hospitals > tbody > tr');

    for (let i = 0, n = tableRows.length; i < n; i++) {
      let hospitalFee = null;
      let specialDepartment = null;
      const hospitalDistance = parseFloat(tableRows[i].querySelector('td:nth-child(2)')?.textContent?.match(/\d+(([,.])\d+)?/)[0].replace(',', '.'));
      const freeBeds = parseInt(tableRows[i].querySelector('td:nth-child(3)')?.textContent?.match(/[0-9]{1,2}/)[0]);

      if (tableRows[i].parentElement.parentElement.id === 'alliance-hospitals') {
        hospitalFee = parseInt(tableRows[i].querySelector('td:nth-child(4)')?.textContent?.match(/([0-9]{1,2}) %/)[1]);
        specialDepartment = tableRows[i].querySelector('td:nth-child(5)')?.innerHTML?.match(/(Ja|Nein)/)[0];
      } else {
        specialDepartment = tableRows[i].querySelector('td:nth-child(4)')?.innerHTML?.match(/(Ja|Nein)/)[0];
      }

      if (fees !== '' && hospitalFee && hospitalFee > fees) {
        tableRows[i].style.display = 'none';
      } else if (transportationDistance !== '' && hospitalDistance && hospitalDistance > transportationDistance) {
        tableRows[i].style.display = 'none';
      } else if (freePlaces && freeBeds === 0) {
        tableRows[i].style.display = 'none';
      } else if (special && specialDepartment === "Nein") {
        tableRows[i].style.display = 'none';
      } else {
        tableRows[i].style.display = '';
      }
    }
  }

  function setStyle() {
    GM_addStyle(`
    .vehicle-transport-request-filter-box {
      margin-bottom: 23px;
    }

    .vehicle-transport-request-filter-title-container {
      margin-top: 8px;
      margin-right: 15px;
    }

    .transport-request-filter,
    .transport-request-distance-filter,
    .vehicle-transport-request-filter-box .btn-group {
      margin-top: 8px;
    }

    .transport-request-distance-filter,
    .transport-request-filter {
      margin-right: 15px;
    }`);
  }
})();
