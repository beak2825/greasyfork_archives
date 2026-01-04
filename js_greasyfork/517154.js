// ==UserScript==
// @name         Nachlader
// @namespace    leeSalami.lss
// @version      1.1
// @description  Lädt Fahrzeuge nach, bis die gewählte AAO verfügbar ist.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/missions/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/517154/Nachlader.user.js
// @updateURL https://update.greasyfork.org/scripts/517154/Nachlader.meta.js
// ==/UserScript==

(() => {
  'use strict'

  /**
   * Maximale Distanz der Fahrzeuge in Kilometern, bis zu der Nachgeladen wird. 0 Kilometer entspricht keinem Limit.
   * @type {number}
   */
  const MAX_DISTANCE = 0;

  const vehicleTable = document.getElementById('vehicle_show_table_all');

  if (!vehicleTable) {
    return true;
  }

  const aaoButtons = $('.aao');
  aaoButtons.off('click');
  const loadButton = document.querySelector('.missing_vehicles_load');
  const maxDistanceFormatted = parseInt('999999999999' + String(MAX_DISTANCE * 100));

  if (MAX_DISTANCE !== 0) {
    const aaoClickHandlerOrig = aaoClickHandler;
    aaoClickHandler = (element) => {
      disableFarVehicles();
      aaoClickHandlerOrig(element);
      enableVehicleCheckboxes();
    }
  }

  for (let i = 0, n = aaoButtons.length; i < n; i++) {
    aaoButtons[i].addEventListener('click', async (e) => {
      e.preventDefault()
      const currentTarget = e.currentTarget;
      while (!isAaoAvailable(currentTarget) && document.querySelector('.missing_vehicles_load.btn-warning') && (MAX_DISTANCE === 0 || !isTooFar())) {
        loadButton.click();
        await waitForElm('.missing_vehicles_load[style*="display: none"]:not(.btn-warning), .missing_vehicles_load.btn-warning');
        await new Promise(r => setTimeout(r, 100));
        if (MAX_DISTANCE !== 0) {
          disableFarVehicles();
        }
      }

      return aaoClickHandler($(currentTarget));
    })
  }

  function isAaoAvailable(element) {
    return !element.querySelector('span.label-danger');
  }

  function isTooFar() {
    const lastVehicleDistance = vehicleTable.querySelector(':scope > tbody > tr:last-of-type > td[id^="vehicle_sort_"]')?.getAttribute('sortvalue');

    return !lastVehicleDistance || parseInt(lastVehicleDistance) > maxDistanceFormatted;
  }

  function disableFarVehicles() {
    const vehicleDistanceElements = vehicleTable.querySelectorAll(':scope > tbody > tr:has(input[type="checkbox"]:not(:disabled)) > td[id^="vehicle_sort_"][sortvalue^="99999"]');

    for (let i = 0, n = vehicleDistanceElements.length; i < n; i++) {
      if (parseInt(vehicleDistanceElements[i].getAttribute('sortvalue')) > maxDistanceFormatted) {
        const vehicleCheckbox = vehicleDistanceElements[i].parentElement.querySelector(':scope > td > input[type="checkbox"]:not(:disabled)');
        vehicleCheckbox.classList.add('temporarily-disabled');
        vehicleCheckbox.disabled = true;
      }
    }
  }

  function enableVehicleCheckboxes() {
    const vehicleCheckboxes = vehicleTable.querySelectorAll('.temporarily-disabled');

    for (let i = 0, n = vehicleCheckboxes.length; i < n; i++) {
      vehicleCheckboxes[i].disabled = false;
      vehicleCheckboxes[i].classList.remove('temporarily-disabled');
    }
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
        childList: true,
        subtree: true
      });
    });
  }
})();
