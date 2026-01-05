// ==UserScript==
// @name         Overwatch to HF-MTS
// @namespace    http://kadauchi.com/
// @version      1.0.5
// @description  Converts Overwatch's list to a HF-MTS import/export.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @match        https://worker.mturk.com/overwatch_export
// @grant        GM_log
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/26117/Overwatch%20to%20HF-MTS.user.js
// @updateURL https://update.greasyfork.org/scripts/26117/Overwatch%20to%20HF-MTS.meta.js
// ==/UserScript==

const HITFINDER = {};
const OVERWATCH = JSON.parse(localStorage.getItem('OverwatchDB'));

if (OVERWATCH) {
  for (let key in OVERWATCH.serDB) {
    HITFINDER[key] = {
      match: key,
      name: OVERWATCH.serDB[key].userName,
      type: "voice",
      sound: true,
      notification: true,
      pushbullet: true
    };
  }

  for (let key in OVERWATCH.idDB) {
    HITFINDER[key] = {
      match: key,
      name: OVERWATCH.idDB[key].userName,
      type: "voice",
      sound: true,
      notification: true,
      pushbullet: true
    };
  }

  GM_setClipboard(JSON.stringify(HITFINDER));
  alert('Overwatch to HF-MTS has succeeded export and the import/export has been copied to your clipboard');
}
else {
  alert('Overwatch to HF-MTS has failed.');
}
