// ==UserScript==
// @name        Photon Link on Solscan.io
// @namespace   Violentmonkey Scripts
// @match       https://solscan.io/account/*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 17.07.2024, 19:01:59
// @downloadURL https://update.greasyfork.org/scripts/500962/Photon%20Link%20on%20Solscanio.user.js
// @updateURL https://update.greasyfork.org/scripts/500962/Photon%20Link%20on%20Solscanio.meta.js
// ==/UserScript==
const sleep = (ms) => new Promise(res => setTimeout(res, ms))

async function init() {
  while(true) {
    const isBalanceChangeTabActive = document.querySelector('[data-state="active"][id*=balanceChanges]');

    if (isBalanceChangeTabActive) {
      applyLinks()
    }

    await sleep(1000);
  }
}

init();

function applyLinks() {
  const tableRows = document.querySelectorAll('tbody > tr');

  for (const row of tableRows) {
    const token = row.querySelector('[href*="/token/"]')?.getAttribute('href').replace('/token/','');
    if (!token) continue;

    const linkToPhoton = row.querySelector('a.photon');
    if (linkToPhoton) continue;

    const lastColumn = row.querySelector('td:last-child');

    let child = document.createElement('div');
    child.innerHTML = `<a class="photon text-link border-transparent ml-1" target="_blank" href="https://photon-sol.tinyastro.io/en/lp/${token}">| Photon</a>`;
    child = child.firstChild;

    lastColumn.appendChild(child)
  }

}

