// ==UserScript==
// @name         Gebäude nach Stadt benennen
// @namespace    leeSalami.lss
// @version      0.2
// @description  Erlaubt das automatische Benennen von Gebäuden während dem Bau
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/500836/Geb%C3%A4ude%20nach%20Stadt%20benennen.user.js
// @updateURL https://update.greasyfork.org/scripts/500836/Geb%C3%A4ude%20nach%20Stadt%20benennen.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const buildingNameMapping = {
    '0': 'FW',
    '1': 'FS',
    '2': 'RW',
    '3': 'RS',
    '4': 'KH',
    '5': 'RHS',
    '6': 'POL',
    '7': 'LS',
    '8': 'PS',
    '9': 'THW',
    '10': 'THW BS',
    '11': 'BePo',
    '12': 'SEG',
    '13': 'PHS',
    '14': 'BR',
    '15': 'WR',
    '17': 'POL SE',
    '18': 'FW',
    '19': 'POL',
    '20': 'RW',
    '21': 'Hund',
    '24': 'RS',
    '25': 'BW'
  };

  setObserver();

  function setObserver() {
    let buildingTypeId= '';
    const config = {childList: true, subtree: true};
    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        const buildingAddressInput = document.getElementById('building_address');

        if (buildingAddressInput) {
          document.getElementById('building_building_type').addEventListener('change', (e) => {
            buildingTypeId = e.currentTarget.value
          })

          const buildingLatitude = document.getElementById('building_latitude');
          const buildingLongitude = document.getElementById('building_longitude');
          const addressForm = document.getElementById('address_forms');

          if (!buildingLatitude || !buildingLongitude || !addressForm) {
            return;
          }

          updateAddress = function updateAddress() {
            try {
              $.get('/reverse_address?latitude=' + buildingLatitude.value + "&longitude=" + buildingLongitude.value, (data) => {
                buildingAddressInput.value = data;
                addressForm.style.display = 'block';
                setBuildingName(data, buildingTypeId);
              });
            } catch (e) {

            }
          }
        }
      }
    };

    const observerTarget = document.getElementById('buildings');
    const observer = new MutationObserver(callback);
    observer.observe(observerTarget, config);
  }

  function setBuildingName(address, buildingTypeId) {
    const buildingName = document.getElementById('building_name');

    if (!buildingName || !buildingTypeId) {
      return;
    }

    let buildingNamePrefix = '';

    if (buildingTypeId in buildingNameMapping) {
      buildingNamePrefix = buildingNameMapping[buildingTypeId] + ' ';
    }

    buildingName.value = buildingNamePrefix + address.match(/[0-9]{5}(?:|,) (\D+?)$/)[1]
  }
})();
