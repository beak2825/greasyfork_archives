// ==UserScript==
// @name         Freelist Fill Button (Week)
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  Add a button next to the 'reset' button, to fill the remainder of each day with the calculated hours remaining for that day.
// @author       You
// @match        https://timesheets.dialoggroup.biz/TSEntry.asp*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/384557/Freelist%20Fill%20Button%20%28Week%29.user.js
// @updateURL https://update.greasyfork.org/scripts/384557/Freelist%20Fill%20Button%20%28Week%29.meta.js
// ==/UserScript==

function applyRemainder(dayTotal) {
    // A collection of the html tags within which the hours are printed along the 'Existing Timesheet Entries' row.
    var row = $('form[name*="ListEntries"] > table > tbody > tr:nth-of-type(3) center');
    console.log(row);


    for (var i = 0; i < 5; i++) {
        document.querySelector('input[tabIndex="'+(i+3)+'"]').value = "";
        var currentHours = parseFloat(row[i].innerHTML);
        if(currentHours < parseFloat(dayTotal)) {
            document.querySelector('input[tabIndex="'+(i+3)+'"]').value = (parseFloat(dayTotal)-currentHours).toFixed(1);
        }
    }

    return false;
}

(function() {
    'use strict';

    if(location.search.search('mode=week') > -1){
        var btnReset = document.querySelector('input[type*="reset"]');

        var button = document.createElement('BUTTON');
        button.innerHTML = "Full Calc Remainder";
        button.id = "fullRemainderButton";
        btnReset.after(button);

        var newbutton = document.createElement('BUTTON');
        newbutton.innerHTML = "38h Calc Remainder";
        newbutton.id = "38hRemainderButton";
        btnReset.after(newbutton);

        $('#fullRemainderButton').click(function() {
            return applyRemainder(8);
        });

        $('#38hRemainderButton').click(function() {
            return applyRemainder(7.6);
        });
    }
})();