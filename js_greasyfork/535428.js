// ==UserScript==
// @name         New PLan: Wattpad viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removing Wattpad's force log in page
// @author       RAVEN
// @include      https://www.wattpad.com/*
// @include      http://www.wattpad.com/*
// @include      https://embed.wattpad.com/
// @include      http://embed.wattpad.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wattpad.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/535428/New%20PLan%3A%20Wattpad%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535428/New%20PLan%3A%20Wattpad%20viewer.meta.js
// ==/UserScript==


function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSixteenTimes() {
  for (let i = 0; i < 16; i++) {
    document.body.style.overflow = "visible";
    document.querySelectorAll('#modals').forEach(el => el.remove());
    document.querySelectorAll('div.uWKBG.kKnZc.UCQAd').forEach(el => el.remove());
    document.querySelectorAll('.modal-backdrop.fade.in').forEach(el => el.remove());
    console.log(`Run ${i + 1}: overflow set to visible`);

    if (i < 15) {
      await wait(200); // Wait 10 seconds between runs, but not after the last one
    }
  }
}

runSixteenTimes();