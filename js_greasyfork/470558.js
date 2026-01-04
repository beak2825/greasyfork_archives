// ==UserScript==
// @name         Invert SDQL Table
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Invert SDQL Table for Killersports.com queries results
// @author       Swain Scheps
// @match        https://killersports.com/nfl/query*
// @match        https://killersports.com/mlb/query*
// @match        https://killersports.com/nba/query*
// @match        https://killersports.com/nhl/query*
// @match        https://killersports.com/ncaabb/query*
// @match        https://killersports.com/ncaafb/query*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470558/Invert%20SDQL%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/470558/Invert%20SDQL%20Table.meta.js
// ==/UserScript==
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

/* global $ */

$(document).ready(function() {
  var rows = $('#DT_Table tbody tr').get();

  rows.sort(function(a, b) {
    var A = new Date($(a).children('td').first().text().trim());
    var B = new Date($(b).children('td').first().text().trim());

    if(A < B) {
      return 1;
    }

    if(A > B) {
      return -1;
    }

    return 0;
  });

  $.each(rows, function(index, row) {
    $('#DT_Table').children('tbody').append(row);
  });
});
