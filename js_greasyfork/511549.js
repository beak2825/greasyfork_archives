// ==UserScript==
// @name         Warehouse mobile total usage
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Calculate total usage in Warehouse mobile website.
// @author       dont-be-evil
// @match        https://myaccount.warehousemobile.co.nz/usage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=warehousemobile.co.nz
// @grant        none
// @run-at       context-menu
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/511549/Warehouse%20mobile%20total%20usage.user.js
// @updateURL https://update.greasyfork.org/scripts/511549/Warehouse%20mobile%20total%20usage.meta.js
// ==/UserScript==

function extract_data_usage(x) {
    // Split the input string into value and unit
    let parts = x.split(" ");
    let value = parseFloat(parts[0]); // Convert the numeric part to a floating-point number
    let unit = parts[1].toUpperCase(); // Get the unit and convert to uppercase for consistency

    // Check if the unit is MB or KB and convert accordingly
    if (unit === "MB") {
        return value * 1024; // Convert MB to KB
    } else if (unit === "KB") {
        return value; // No conversion needed for KB
    }
}

(function() {
    'use strict';
    let usage_type = document.querySelectorAll("span.multiselect__single")[1].textContent;
    const container = document.querySelectorAll('div.container')[2];
    let usage_p = container.querySelector('p');
    if (!usage_p) {
        let new_p = document.createElement('p');
        container.appendChild(new_p);
        usage_p = new_p;
    }
    if (["Calls & Texts", "Calls Only", "Texts Only"].includes(usage_type)) {
        let usage = 0;
        for (let row of document.querySelector("div.usage-table").querySelectorAll("div.usage-table__row:not(.usage-table__header)")) {
            usage = usage + parseFloat(row.lastChild.textContent.replace(/^\$/, ''));
        }
        usage_p.textContent = `Total charge: $${usage}`;
    } else if (["Data"].includes(usage_type)) {
        let usage_kb = 0;
        for (let row of document.querySelector("div.usage-table").querySelectorAll("div.usage-table__row:not(.usage-table__header)")) {
            usage_kb = usage_kb + parseFloat(extract_data_usage(row.children[1].textContent));
        }
        let usage_mb = Math.round(usage_kb / 1024);
        usage_p.textContent = `Total data usage: ${usage_mb} MB`;
    }

})();