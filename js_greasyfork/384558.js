// ==UserScript==
// @name         Non Destructive Timesheet Day selection
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  Set the currently selected day on load to the first day with less than 8 hours allocated
// @author       You
// @match        https://timesheets.dialoggroup.biz/TSEntry.asp*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/384558/Non%20Destructive%20Timesheet%20Day%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/384558/Non%20Destructive%20Timesheet%20Day%20selection.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if($('input[name="txtHours"]')[0].value == '') {
    // A collection of the html tags within which the hours are printed along the 'Existing Timesheet Entries' row.
    var row = $('form[name*="ListEntries"] > table > tbody > tr:nth-of-type(3) center');
    // The 'Day' dropdown
    var dd = $('select[name="cmbDay"]');

    for(var i = 0; i < 5; i++) {
        if(parseFloat(row[i].innerHTML) < 7.6 && !dd[0][i].disabled) {
            dd[0].value = dd[0][i].value;
            break;
        }
    }
}
})();