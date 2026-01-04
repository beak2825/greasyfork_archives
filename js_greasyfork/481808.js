// ==UserScript==
// @name         Torion Rank Adder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add ranks
// @author       Terekhov
// @match        https://torion.npowned.net/factions
// @match        https://torion.npowned.net/factions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npowned.net
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/481808/Torion%20Rank%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/481808/Torion%20Rank%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add Rank # header cell
    let headerRank = $("<th>Rank #</th>");
    headerRank.addClass('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider');
    headerRank.attr('scope', 'col');
    $('main div div div table thead')[0].children[0].children[0].before(headerRank[0]);

    // Add rank # to each row
    let numRows = $('main div div div table tbody:first tr').length;

    for (let i = 0; i < numRows; i++) {
        console.log(i);
        let currentRank = $("<td>" + (i+1) + " / " + numRows + "</td>");
        currentRank.addClass('px-6 py-4 whitespace-nowrap text-sm text-gray-500')
        $('main div div div table tbody tr')[i].children[0].before(currentRank[0])
    }
})();