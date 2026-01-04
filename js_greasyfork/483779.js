// ==UserScript==
// @name         ANT - Orbs per GiB on Adoption Table
// @description  Adds Column with Orbs per GiB on Adoption Table
// @version      0.8
// @author       BovBrew
// @license      MIT
// @namespace    BovBrewANT
// @icon         https://anthelion.me/favicon.ico
// @match        http*://anthelion.me/torrents.php?*type=adoption*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483779/ANT%20-%20Orbs%20per%20GiB%20on%20Adoption%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/483779/ANT%20-%20Orbs%20per%20GiB%20on%20Adoption%20Table.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var table = document.querySelector('.torrent_table.cats');
    var rowCount = 0;

    if (table) {
        var rows = table.querySelectorAll('tr');

        rows.forEach(function(row) {
            var tds          = row.querySelectorAll('td');
            var fileSize     = convertFileSizeToGiB(tds[1].textContent);
            var bounty       = convertStringWithCommasToNumber(tds[2].textContent);
            var bountyPerGiB = Math.round((bounty / fileSize) * 100) / 100;
            if (tds.length >= 3) {
                var newTd = document.createElement('td');
                newTd.textContent = rowCount === 0 ?  'Orbs/GiB' : bountyPerGiB;
                tds[2].parentNode.insertBefore(newTd, tds[2].nextSibling);
            };
            rowCount++;
        });
    };

    function convertFileSizeToGiB(fileSize) {
        var sizeUnit  = fileSize.slice(-3);
        var sizeValue = parseFloat(fileSize);

        // Convert the file size to GiB based on the unit
        switch (sizeUnit.toUpperCase()) {
            case 'KIB':
                return sizeValue / 1024 / 1024;
            case 'MIB':
                return sizeValue / 1024;
            case 'GIB':
                return sizeValue;
            case 'TIB':
                return sizeValue * 1024;
            default:
                return NaN; // Invalid size unit
        };
    };

    function convertStringWithCommasToNumber(value) {
        // Remove commas and convert to a number
        return parseFloat(value.replace(/,/g, ''));
    };

})();