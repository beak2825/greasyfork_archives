// ==UserScript==
// @name         Azubiheft.de - auto select 8 hours
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto select 8 hours in a azubiheft.de report
// @author       Tim Gromeyer <tim.gromeyer@gmail.com>
// @match        *://www.azubiheft.de/Azubi/Tagesbericht.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azubiheft.de
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475572/Azubiheftde%20-%20auto%20select%208%20hours.user.js
// @updateURL https://update.greasyfork.org/scripts/475572/Azubiheftde%20-%20auto%20select%208%20hours.meta.js
// ==/UserScript==

function onClassChange(element, callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        callback(mutation.target);
      }
    });
  });
  observer.observe(element, { attributes: true });
  return observer.disconnect;
}

var dialog = document.getElementById("Taetigkeit_Pannel");
onClassChange(dialog, (node) => {
  if (node.classList.contains('msgBoxShow')) {
      let time = document.getElementById("cmdDauer");
      time.textContent = '08:00'
}});
