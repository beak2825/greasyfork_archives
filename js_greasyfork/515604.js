// ==UserScript==
// @name        Baubeschleuniger
// @namespace   leeSalami.lss
// @version     1.1.5
// @license     MIT
// @author      leeSalami
// @description Beschleunigt das Bauen von neuen Gebäuden.
// @match       https://*.leitstellenspiel.de
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/515604/Baubeschleuniger.user.js
// @updateURL https://update.greasyfork.org/scripts/515604/Baubeschleuniger.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let csrfToken = '';
  let newMarkers = [];

  function buildingNameCountUp() {
    const regex = /(\d+)$/;
    const titleElement = document.getElementById('building_name');
    const titleNumber = titleElement.value.match(regex)

    if (titleNumber !== null) {
      const newNumber = String(parseInt(titleNumber[0]) + 1);
      const newNumberDigitCount = newNumber.length;
      let leadingZeroes = (titleNumber[0].match(/^0+/) || [''])[0];
      const oldNumberDigitCount = titleNumber[0].toString().length;
      leadingZeroes = leadingZeroes.substring(newNumberDigitCount - oldNumberDigitCount + leadingZeroes.length);
      const newTitleNumber = leadingZeroes + newNumber
      titleElement.value = titleElement.value.replace(regex, newTitleNumber);
    }
  }

  async function createBuilding() {
    const form = new FormData(document.getElementById('new_building'));
    form.delete('build_another');
    const response = await fetch('/buildings', {
      headers: {
        'X-CSRF-Token': csrfToken,
        'X-Requested-With': 'XMLHttpRequest'
      },
      method: 'POST',
      body: new URLSearchParams(form),
      redirect: 'manual'
    });

    if (response.status >= 400) {
      const alertElement = document.createElement('div');
      alertElement.id = 'alert_building_creation';
      alertElement.className = 'alert alert-danger';
      alertElement.innerText = 'Fehler beim Erstellen des Gebäudes!';
      document.getElementById('select_building_type_step').parentElement.insertAdjacentElement('afterbegin', alertElement);

      return;
    }

    buildingNameCountUp();
    const iconUrl = OTHER_BUILDING_ICONS[form.get('building[building_type]')].replace('_other.png', '.png');
    const coordinates = building_new_marker.getLatLng();

    if (iconUrl) {
      const markerOptions = {
        icon: L.icon({
          iconUrl: iconUrl,
          iconSize: [32, 37],
          iconAnchor: [16, 37],
          popupAnchor: [0, -37]
        }),
        title: form.get('building[name]')
      };
      newMarkers.push(L.marker([coordinates.lat, coordinates.lng], markerOptions).addTo(map));
    } else {
      newMarkers.push(L.marker([coordinates.lat, coordinates.lng]).addTo(map));
    }
  }

  function checkFields() {
    let valid = true;

    const nameField = document.getElementById('building_name');
    document.getElementById('building-name-error')?.remove();

    if (nameField.value.length < 2) {
      valid = false;

      const errorLabel = document.createElement('span');
      errorLabel.id = 'building-name-error';
      errorLabel.className = 'label label-danger';
      errorLabel.innerText = 'ist zu kurz (nicht weniger als 2 Zeichen)';
      nameField.insertAdjacentElement('afterend', errorLabel);
    }

    return valid;
  }

  async function buildButtonClickEvent(event) {
    event.preventDefault();

    if (!checkFields()) {
      return;
    }

    const buildButton = event.target;
    buildButton.disabled = true;

    document.getElementById('alert_building_creation')?.remove();

    await createBuilding();

    buildButton.disabled = false;
  }

  function addEventListeners() {
    const buildButtons = document.querySelectorAll('input[type=submit].build_with_credits_step, input[type=submit].coins_activate, input[type=submit].alliance_activate');

    for (let i = 0, n = buildButtons.length; i < n; i++) {
      buildButtons[i].addEventListener('click', buildButtonClickEvent);
    }

    document.getElementById('building_back_button').addEventListener('click', () => {
      deleteNewMarkers();
    });
  }

  function deleteNewMarkers() {
    for (let i = 0, n = newMarkers.length; i < n; i++) {
      newMarkers[i].remove();
    }
  }

  const observer = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(mutation => {
      if (!mutation.target.querySelector('#new_building')) {
        return;
      }

      csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      addEventListeners();

      const element = document.getElementById('building_new_info_message');
      if (element) {
        element.remove();
      }
    });
  });

  observer.observe(document.getElementById('buildings'), {
    childList: true,
  });
})();
