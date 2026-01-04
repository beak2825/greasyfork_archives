// ==UserScript==
// @name         Bau-Hotkey
// @namespace    leeSalami.lss
// @version      1.0.2
// @description  Ermöglicht das Setzen von Gebäuden und POIs mittels Tastenkürzel.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/516760/Bau-Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/516760/Bau-Hotkey.meta.js
// ==/UserScript==

(() => {
  'use strict'

  // You can customize the hotkeys according to your needs. Helpful tool to find the codes: https://www.toptal.com/developers/keycode
  const BUILD_HOTKEY = 'KeyK';

  const observerBuildingStart = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(mutation => {
      if (!mutation.target.querySelector('#new_building') || !mutation.addedNodes.length) {
        return;
      }

      observerBuildingStart.disconnect();
      observeBuilding(observerEnd);
      document.addEventListener('keydown', setBuilding);
    });
  });

  const observerPoiStart = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(mutation => {
      if (!mutation.target.querySelector('#new_mission_position') || !mutation.addedNodes.length) {
        return;
      }

      observerPoiStart.disconnect();
      observeBuilding(observerEnd);
      document.addEventListener('keydown', setPoi);
    });
  });

  const observerEnd = new MutationObserver(mutationRecords => {
    mutationRecords.forEach(mutation => {
      if (!mutation.target.querySelector('#build_new_building') || !mutation.addedNodes.length) {
        return;
      }

      observerEnd.disconnect();
      observeBuilding(observerBuildingStart);
      observeBuilding(observerPoiStart);
      document.removeEventListener('keydown', setPoi);
      document.removeEventListener('keydown', setBuilding);
    });
  });

  function observeBuilding(observer) {
    observer.observe(document.getElementById('buildings'), {
      childList: true,
    });
  }

  observeBuilding(observerBuildingStart);
  observeBuilding(observerPoiStart);

  function setPoi(event) {
    if (event.code !== BUILD_HOTKEY || inputHasFocus()) {
      return;
    }

    document.getElementById('new_mission_position').querySelector('.form-actions > input[type="submit"]')?.click();
  }

  function setBuilding(event) {
    if (event.code !== BUILD_HOTKEY || inputHasFocus()) {
      return;
    }

    document.querySelector('.building_build_costs_active > div > input[id^="build_credits_"]')?.click();
  }

  function inputHasFocus() {
    const inputs = document.querySelectorAll('input[type="text"]');

    for (let i = 0, n = inputs.length; i < n; i++) {
      if (inputs[i] === document.activeElement) {
        return true;
      }
    }

    return false;
  }
})()
