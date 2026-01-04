// ==UserScript==
// @name         Highlight CAT Pools in OTS
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlight the td elements containing specific link texts
// @author       Rob Clayton
// @match        https://workplace.plus.net/reports/tickets/open_tickets_report.html?strLocation=Sheffield
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524126/Highlight%20CAT%20Pools%20in%20OTS.user.js
// @updateURL https://update.greasyfork.org/scripts/524126/Highlight%20CAT%20Pools%20in%20OTS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of link texts to match
    const targetTexts = [
        'BOT - Phone Faults - Disabled AND Vulnerable Customers',
        'BOT - Phone Faults - Welfare Cases',
        'CAT - EL Escalations',
        'Faults - CAT',
        'Faults - Dialler',
        'Faults - Update',
        'Prov - Jeopardy',
        'Prov - Update',
        'Prov - Welfare',
        'Early Life - Dialler',
        'Faults - Jeopardy'
    ];

    // Select all td elements with class 'column-data'
    const tds = document.querySelectorAll('td.column-data');

    // Loop through each td to check for the specific link text
    tds.forEach(td => {
        const link = td.querySelector('a');
        if (link && targetTexts.includes(link.textContent)) {
            // Apply highlighting style if text matches
            td.style.backgroundColor = 'yellow'; // You can customize this color
        }
    });
})();
