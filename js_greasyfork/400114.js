// ==UserScript==
// @name         VPN Date Converter
// @namespace    http://networkmaine.net
// @version      0.2.1
// @description  Converts UTC dates on VPN page to EST
// @author       Dawsin Blanchard
// @match        https://vpn.net.maine.edu/dashboard.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400114/VPN%20Date%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/400114/VPN%20Date%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';    
    //create regex to match dates
    const regex = RegExp(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/, 'i');

    //get all cells
    const cells = document.querySelectorAll('td');
    //for each cell
    cells.forEach(cell => {
        //if cell contains a date call changedate on it
        if (regex.test(cell.innerHTML)) {
            changeDate(cell)}
        }
    )
})();

//converts the date within a given cell
function changeDate(cell) {
    //get date from cell
    let rawDate = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.exec(cell.innerHTML)[0];
    //replace dashes with whitespace
    rawDate = rawDate.replace(/-/g, ' ');
    //add UTC
    rawDate += ' UTC';

    //convert date to UTC
    let UTCDate = new Date(Date.parse(rawDate));
    //convert UTC date to EST
    let ESTDate = UTCDate.toLocaleString('en-US', {timeZone: 'America/New_York'}) + ' EST';

    //replace old date with EST date
    cell.innerHTML = cell.innerHTML.replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, ESTDate);
};