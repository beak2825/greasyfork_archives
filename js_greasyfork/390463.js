// ==UserScript==
// @name     Stop dumb Crystal TOD alerts
// @description Crystal TOD should stop sniffling glue and start googling how to program
// @version  1
// @grant    none
// @include https://*.crystal-tod.com/rider/
// @include http://*.crystal-tod.com/rider/
// @run-at  document-idle
// @namespace ptrharmonic.crystaltod
// @downloadURL https://update.greasyfork.org/scripts/390463/Stop%20dumb%20Crystal%20TOD%20alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/390463/Stop%20dumb%20Crystal%20TOD%20alerts.meta.js
// ==/UserScript==

let alertdivs = document.getElementsByClassName("alert-container");

console.log(alertdivs);

for (let i=0; i<alertdivs.length; i++) {
  console.log(i, alertdivs[i]);
  alertdivs[i].remove();
}
