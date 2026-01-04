// ==UserScript==
// @name            yopale
// @namespace       yout.cm
// @version         1.0
// @description     e i kop mk
// @include         *
// @author          teb
// @match           http://*/*
// @run-at          document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/439131/yopale.user.js
// @updateURL https://update.greasyfork.org/scripts/439131/yopale.meta.js
// ==/UserScript==
/**
 * ---------------------------
 * Time: 2022/11/20 19:28.
 * Author: teb
 * View: j.go
 * ---------------------------
 */

/**
 * 1. em
 * 2. set configurable: true
 * 3. dn
 * 4. od
 */


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayedGreeting() {
  document.title = '1'
  await sleep(2000);
  console.log("Printed 1!")
  document.title = '2'
  console.log("Printed 2!")
  await sleep(2000);
  document.title = '3'
  console.log("Printed 3!")
  await sleep(2000);
  document.title = '4'
  console.log("Printed 4!")
  await sleep(2000);
  document.title = '5'
  console.log("Printed 5!")
  await sleep(2000);
  document.title = '6'
  console.log("Printed 6!")
}

delayedGreeting();