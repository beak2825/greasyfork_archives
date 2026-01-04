// ==UserScript==
// @name         Doppeltes Alarmieren vermeiden
// @namespace    leeSalami.lss
// @version      0.3
// @description  Verhindert doppeltes Alarmieren von Fahrzeugen, wenn mehrere Missionen in verschiedenen Tabs geöffnet sind.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/missions/*
// @downloadURL https://update.greasyfork.org/scripts/525091/Doppeltes%20Alarmieren%20vermeiden.user.js
// @updateURL https://update.greasyfork.org/scripts/525091/Doppeltes%20Alarmieren%20vermeiden.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const missionSubmitButtons = document.querySelectorAll('.vehicle_amount_selected_title, .alert_next, .alert_next_alliance, #alert_btn');

  if (!missionSubmitButtons.length) {
    return;
  }

  const vehicleList = document.getElementById('vehicle_list_step');

  if (!vehicleList) {
    return;
  }

  const aaoButtons = document.querySelectorAll('.aao_btn');
  let usedVehicleIds = [];

  const bc = new BroadcastChannel('mission_used_vehicle_ids');
  bc.onmessage = (event) => {
    toggleAlarmButtons(true);
    toggleAaoButtons(true);
    usedVehicleIds = [...new Set(usedVehicleIds.concat(event.data))];
    removeUsedVehicles();
    toggleAaoButtons(false);
  };

  for (let  i = 0, n = missionSubmitButtons.length; i < n; i++) {
    missionSubmitButtons[i].addEventListener('click', broadcastVehicleIds);
  }

  document.addEventListener('keypress', (event) => {
      if (event.code === 'KeyX' || event.code === 'KeyS' || event.code === 'KeyE') {
        broadcastVehicleIds();
      }
    }
  );

  const loadButtons = document.querySelectorAll('.missing_vehicles_load');
  for (let  i = 0, n = loadButtons.length; i < n; i++) {
    loadButtons[i].addEventListener('click', loadButtonClick);
  }


  function broadcastVehicleIds() {
     const vehicleElements = vehicleList.querySelectorAll(':scope table tbody td input:checked');

    for (let  i = 0, n = vehicleElements.length; i < n; i++) {
      usedVehicleIds.push(vehicleElements[i].getAttribute('value'));
    }

    bc.postMessage(usedVehicleIds);
  }

  function removeUsedVehicles() {
    let selector = '';
    for (let  i = 0, n = usedVehicleIds.length; i < n; i++) {
      selector += `:scope table tbody td input[value="${usedVehicleIds[i]}"],`;
    }

    if (selector === '') {
      return;
    }

    selector = selector.replace(/,+$/, '');
    const usedVehicleElements = vehicleList.querySelectorAll(selector);
    for (let  i = 0, n = usedVehicleElements.length; i < n; i++) {
      usedVehicleElements[i].parentElement.parentElement.remove();
    }

    aaoCheckAvailable(true);
  }

  function toggleAlarmButtons(disable = false) {
    for (let  i = 0, n = missionSubmitButtons.length; i < n; i++) {
      missionSubmitButtons[i].classList.toggle('disabled', disable);
      missionSubmitButtons[i].toggleAttribute('disabled', disable);

      if (disable) {
        document.addEventListener('keydown', disableClick, true);
      } else {
        document.removeEventListener('keydown', disableClick, true);
      }
    }

    if (disable) {
      setTimeout(toggleAlarmButtons, 1010);
    }
  }

  function toggleAaoButtons(disable = false) {
    for (let  i = 0, n = aaoButtons.length; i < n; i++) {
      aaoButtons[i].classList.toggle('disabled', disable);
      aaoButtons[i].toggleAttribute('disabled', disable);
    }
  }

  async function loadButtonClick() {
    await new Promise(r => setTimeout(r, 100));
    await waitForElm('.missing_vehicles_load[style*="display: none"]:not(.btn-warning), .missing_vehicles_load.btn-warning');
    removeUsedVehicles();
  }

  function disableClick(event) {
    if (event.code === 'KeyX' || event.code === 'KeyS' || event.code === 'KeyE') {
      event.stopPropagation();
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
