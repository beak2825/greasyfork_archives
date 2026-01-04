// ==UserScript==
// @name         Nummerierung der Gebäudenamen beim Bau
// @namespace    leeSalami.lss
// @version      0.5.1
// @description  Erlaubt das automatische Benennen von Gebäuden während dem Bau
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @require      https://update.greasyfork.org/scripts/517781/PLZ-Bundesland-Mapping.user.js
// @require      https://update.greasyfork.org/scripts/526080/Country-ISO-Code-Mapping.user.js
// @downloadURL https://update.greasyfork.org/scripts/522850/Nummerierung%20der%20Geb%C3%A4udenamen%20beim%20Bau.user.js
// @updateURL https://update.greasyfork.org/scripts/522850/Nummerierung%20der%20Geb%C3%A4udenamen%20beim%20Bau.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const buildingNameMapping = {
    '0': 'FW',
    '1': 'FW-SCHULE',
    '2': 'RD-SCHULE',
    '3': 'RS',
    '4': 'KH',
    '5': 'RTH',
    '6': 'POL',
    '7': 'LS',
    '8': 'POL-SCHULE',
    '9': 'THW',
    '10': 'THW-SCHULE',
    '11': 'BEPO',
    '12': 'SEG',
    '13': 'PH',
    '14': 'BR',
    '15': 'WR',
    '16': 'JVA',
    '17': 'POL-SE',
    '18': 'FW',
    '19': 'POL',
    '20': 'RW',
    '21': 'HUND',
    '24': 'RS',
    '25': 'BW',
    '26': 'SEE',
    '27': 'SEE-SCHULE',
    '28': 'SEE-HUB'
  };

  let db;
  let buildingCount = 0;
  let buildingTypeId= '';
  let countNumberCode = false;
  let state = '';
  let previousName = '';

  function buildingNameCountUp() {
    const buildingNameElement = document.getElementById('building_name');

    if (!buildingNameElement || !buildingTypeId) {
      return;
    }

    const newName = buildingNameMapping[buildingTypeId] + '-' + leadingZeros(buildingCount + 1) + '-' + state
    buildingNameElement.value = buildingNameElement.value.replace(previousName, newName);
    previousName = newName;
  }

  async function setBuildingName() {
    const buildingNameElement = document.getElementById('building_name');
    const latitude = document.getElementById('building_latitude')?.value;
    const longitude = document.getElementById('building_longitude')?.value;

    if (!buildingNameElement || !latitude || !longitude || !buildingTypeId) {
      return;
    }

    let buildingName = '';

    if (buildingTypeId in buildingNameMapping) {
      const address = await getNominatimAddress(latitude, longitude);
      let numberCode = '01';
      state = 'XX';
      const addressCountryCode = address.country_code.toUpperCase();
      const isoAlpha2CodesReversed = Object.fromEntries(Object.entries(isoAlpha2Codes).map(a => a.reverse()))

      if (address && address.country === 'Germany') {
        numberCode = address.postcode.substring(0, 2);

        if (!Object.hasOwn(doubleZipCodes, address.postcode) && Object.hasOwn(zipCodes, address.postcode)) {
          state = zipCodes[address.postcode];
        }
      } else if (Object.hasOwn(isoAlpha2CodesReversed, addressCountryCode)) {
        state = isoAlpha3Codes[isoAlpha2CodesReversed[addressCountryCode]];
        const previousNumberCode = parseInt(buildingNameElement.value.slice(-2), 10);

        if (!isNaN(previousNumberCode)) {
          numberCode = leadingZeros(previousNumberCode, 3);
        }
      }

      previousName = buildingNameMapping[buildingTypeId] + '-' + leadingZeros(buildingCount + 1) + '-' + state
      buildingName = previousName + numberCode;
    }

    buildingNameElement.value = buildingName;
    countNumberCode = false;
  }

  async function getNominatimAddress(latitude, longitude) {
    const data = await (await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`)).json();
    return data.address ?? null;
  }

  function leadingZeros(number, maxLength = 5) {
    return String(number).padStart(maxLength, '0')
  }

  function buildButtonClickEvent() {
    buildingCount++;
    countNumberCode = true;
    buildingNameCountUp();
  }

  function addEventListeners() {
    const buildButtons = document.querySelectorAll('input[type=submit].build_with_credits_step');

    for (let i = 0, n = buildButtons.length; i < n; i++) {
      buildButtons[i].addEventListener('click', buildButtonClickEvent);
    }

    document.getElementById('building_building_type').addEventListener('change', changeBuildingType)
  }

  function disableBuildButtons() {
    const buildButtons = document.querySelectorAll('input[type=submit].build_with_credits_step:not(:disabled), input[type=submit].coins_activate:not(:disabled), input[type=submit].alliance_activate:not(:disabled), #building_building_type, #building_name');

    for (let i = 0, n = buildButtons.length; i < n; i++) {
      buildButtons[i].classList.add('builder-disabled');
      buildButtons[i].disabled = true;
    }
  }

  function enableBuildButtons() {
    const buildButtons = document.querySelectorAll('input[type=submit].builder-disabled.build_with_credits_step, input[type=submit].builder-disabled.coins_activate, input[type=submit].builder-disabled.alliance_activate, #building_building_type, #building_name');

    for (let i = 0, n = buildButtons.length; i < n; i++) {
      buildButtons[i].classList.remove('builder-disabled');
      buildButtons[i].disabled = false;
    }
  }

  async function changeBuildingType(e) {
    buildingTypeId = e.currentTarget.value;
    buildingCount = await getCountByIndex(db, 'buildings', 'building_type', IDBKeyRange.only(parseInt(buildingTypeId, 10)));
    await setBuildingName();
  }

  const observer = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(async (mutation) => {
      if (!mutation.target.querySelector('#new_building')) {
        return;
      }

      updateAddress = updateAddress = () => {
        try {
          const buildingAddressInput = document.getElementById('building_address');

          if (buildingAddressInput) {
            const latitude = document.getElementById('building_latitude')?.value;
            const longitude = document.getElementById('building_longitude')?.value;
            const addressForm = document.getElementById('address_forms');

            if (!latitude || !longitude || !addressForm) {
              return;
            }

            $.get(`/reverse_address?latitude=${latitude}&longitude=${longitude}`, (data) => {
              buildingAddressInput.value = data;
              addressForm.style.display = 'block';
              setBuildingName();
            });
          }
        } catch (e) {
        }
      }

      disableBuildButtons();
      db = await openDb();
      await updateBuildings(db, 60);
      addEventListeners();
      enableBuildButtons();
    });
  });

  observer.observe(document.getElementById('buildings'), {
    childList: true,
  });
})();
