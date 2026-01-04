// ==UserScript==
// @name         Tesla Order VIN finder - new 2025
// @namespace    http://tampermonkey.net/
// @version      2025-02-25
// @description  Find hidden VIN on manage your order page. This will show box in lower left corner
// @author       InToSSH
// @match        https://www.tesla.com/*/teslaaccount/order/*/manage
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528026/Tesla%20Order%20VIN%20finder%20-%20new%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/528026/Tesla%20Order%20VIN%20finder%20-%20new%202025.meta.js
// ==/UserScript==

try {
    var data = window.Tesla.App.Order;

    const box = document.createElement('div');
    box.textContent = "Found VIN: " + ((typeof data.vin !== 'undefined' && data.vin !== null && data.vin !== '') ? data.vin : 'No VIN yet');

    box.style.position = 'fixed';
    box.style.bottom = '0';
    box.style.left = '0';
    box.style.backgroundColor = 'lightgray';
    box.style.padding = '10px';
    box.style.border = '1px solid black';

    document.body.appendChild(box);
}
catch (e) {
    console.log(`Failed: `, e);
    return;
}