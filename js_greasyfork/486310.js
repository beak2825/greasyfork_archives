// ==UserScript==
// @name         Grocer.nz Checkbox Ticker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tick specific checkboxes on grocer.nz/stores after 2 seconds of page load
// @author       chaoscreater
// @match        https://grocer.nz/stores
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486310/Grocernz%20Checkbox%20Ticker.user.js
// @updateURL https://update.greasyfork.org/scripts/486310/Grocernz%20Checkbox%20Ticker.meta.js
// ==/UserScript==

// Function to find and tick the checkboxes based on their names
function tickCheckboxes(names) {
    names.forEach(function (name) {
        var checkbox = Array.from(document.querySelectorAll('span.name')).find(function (span) {
            return span.textContent.trim() === name;
        });
        if (checkbox) {
            checkbox.parentElement.querySelector('input[type="checkbox"]').checked = true;
        }
    });
}

// Function to run after 2 seconds of page load
function runAfterDelay() {
    // Names of checkboxes to tick
    var checkboxesToTick = [
        'Countdown Botany',
        'Countdown Greenlane',
        'Countdown Highland Park',
        'Countdown Howick',
        'Countdown Mt Eden',
        'Countdown Newmarket',
        'Countdown Pakuranga',
        'Countdown Ponsonby',
        'Countdown St Lukes',
        'Woolworths Grey Lynn',
        'Woolworths Mt Roskill',
        'Woolworths Pt Chevalier',
        'New World Botany',
        'New World Howick',
        'New World Mt Roskill',
        'New World Victoria Park',
        'PAK\'nSAVE Botany',
        'PAK\'nSAVE Mt Albert',
        'PAK\'nSAVE Sylvia Park',
        'The Warehouse'
    ];

    // Tick checkboxes after 2 seconds
    tickCheckboxes(checkboxesToTick);
}

// Delay execution by 2 seconds
setTimeout(runAfterDelay, 2000);
