// ==UserScript==
// @name         Melvor Prayer Sets
// @version      0.1.0
// @description  Saves/loads active prayers with your equipment set
// @author       8992
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/420635/Melvor%20Prayer%20Sets.user.js
// @updateURL https://update.greasyfork.org/scripts/420635/Melvor%20Prayer%20Sets.meta.js
// ==/UserScript==

function loadScript() {
  const _setEquipmentSet = setEquipmentSet;
  window.setEquipmentSet = function (set, bypass = false) {
    const activePrayers = activePrayer.reduce((arr, on, i) => (on ? [...arr, i] : arr), []);
    window.localStorage.setItem("prayerSet" + currentCharacter + selectedEquipmentSet, JSON.stringify(activePrayers));
    _setEquipmentSet(set, (bypass = false));
    const choice = JSON.parse(window.localStorage.getItem("prayerSet" + currentCharacter + selectedEquipmentSet));
    if (Array.isArray(choice)) changePrayers(choice);
  };
  const choice = JSON.parse(window.localStorage.getItem("prayerSet" + currentCharacter + selectedEquipmentSet));
  if (Array.isArray(choice)) changePrayers(choice);
  console.log("Prayer sets loaded");
}

function changePrayers(choice = []) {
  for (let i = 0; i < activePrayer.length; i++) {
    if (activePrayer[i]) {
      choice.includes(i) ? choice.splice(choice.findIndex(a => a == i), 1) : togglePrayer(i);
    }
  }
  for (const prayer of choice) togglePrayer(prayer);
}

let loadCheckInterval = setInterval(() => {
  if (isLoaded) {
    clearInterval(loadCheckInterval);
    loadScript();
  }
}, 200);
