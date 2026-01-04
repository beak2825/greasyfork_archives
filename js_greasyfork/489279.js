// ==UserScript==
// @name         Freelist Fill Button
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  Add a button beneath the day dropdown to fill the remainder of the selected day with a freelist entry.
// @author       You
// @match        https://timesheets.dialoggroup.biz/TSEntry.asp*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/489279/Freelist%20Fill%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/489279/Freelist%20Fill%20Button.meta.js
// ==/UserScript==

function applyRemainderToFields(dayTotal) {
    // A collection of the html tags within which the hours are printed along the 'Existing Timesheet Entries' row.
    var row = $('form[name*="ListEntries"] > table > tbody > tr:nth-of-type(3) center');
    console.log(row);
    var drop = $('select[name="cmbDay"]')[0];
    console.log(drop);
    var day = -1;
    for (var i = 0; i < 5; i++) {
        if(drop.value == drop[i].value) {
            day = i;
            break;
        }
    }
    console.log('Day: ' + day);
    var hoursleft = (dayTotal- parseFloat(row[day].innerHTML)).toFixed(1);
    console.log('Remainder: ' + hoursleft);
    var hoursBox = $('input[name="txtHours"]')[0];
    var hoursCurrent = parseFloat(hoursBox.value);
    console.log('Current: ' + hoursCurrent);
    if(!isNaN(hoursCurrent)) {
        hoursBox.value = hoursleft;
    } else {
        hoursBox.value=hoursleft;
    }
    return false;
}

(function() {
    'use strict';

    if(location.search.search('mode=day') > -1){
        // The 'Day' dropdown
        var dd = $('select[name="cmbDay"]');

        var br = document.createElement('BR');
        dd.after(br);
        var button = document.createElement('BUTTON');
        button.innerHTML = "Full Calc Remainder";
        button.id = "fullRemainderButton";
        br.after(button);

        var newbutton = document.createElement('BUTTON');
        newbutton.innerHTML = "38h Calc Remainder";
        newbutton.id = "38hRemainderButton";
        br.after(newbutton);
        var nbr = document.createElement('BR');
        button.before(nbr);

        $('#fullRemainderButton').click(function() {
            return applyRemainderToFields(8);
        });

        $('#38hRemainderButton').click(function() {
            return applyRemainderToFields(7.6);
        });
    }
})();