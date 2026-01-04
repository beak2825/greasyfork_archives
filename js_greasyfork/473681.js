// ==UserScript==
// @name           Ubik Academy - make me shamelessly proud of (appearing) working relentlessly..
// @version        0.1
// @namespace      nil
// @author         nil
// @grant          none
// @description    [EN] Convince Ubik Academy tracking that I'm right there
// @include        https://lexfo.ubik.academy/*
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473681/Ubik%20Academy%20-%20make%20me%20shamelessly%20proud%20of%20%28appearing%29%20working%20relentlessly.user.js
// @updateURL https://update.greasyfork.org/scripts/473681/Ubik%20Academy%20-%20make%20me%20shamelessly%20proud%20of%20%28appearing%29%20working%20relentlessly.meta.js
// ==/UserScript==

(function nil_greasemonkey_ubik() {
  "use strict";
  function lookUpAndClickTheStillThereButton() {
    let elt = document.getElementById("btn-dialogBox");
    if (!elt ||
        !elt.classList.contains("ultp-course-timer-modal")
        ) { return; }
    let elts = elt.getElementsByClassName("dialog-btn-confirm");
    if (1 !== elts.length) { return; }
    let stillThereButton = elts.item(0);
    stillThereButton.click();
    console.log("clicked the stillThereButton!");
  }
  
  window.setInterval(lookUpAndClickTheStillThereButton, 30000);
})();