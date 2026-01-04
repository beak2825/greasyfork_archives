// ==UserScript==
// @name         osiem_godzin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adds button to calendar
// @author       You
// @match        https://rcp.raltech.pl/pl/calendar/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426052/osiem_godzin.user.js
// @updateURL https://update.greasyfork.org/scripts/426052/osiem_godzin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var targetNode = document.getElementById('remote_form_modal');
    var config = { attributes: true, childList: true, subtree: true };

    var callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        var osiem_exists = document.getElementById('osiem');
        if ( osiem_exists == null )
        {
            console.log('ADDING Osiem');
            var date_duration_input = document.getElementById('timesheet_edit_form_duration');
            //console.log('date ');
            //console.log(date_duration_input);
            var parent_div = date_duration_input.parentElement;
            var input_btn = document.createElement("button");
            input_btn.id = 'osiem';
            input_btn.textContent = 'osiem godzin';
            parent_div.appendChild(input_btn);
            input_btn.onclick = function (){
                //document.getElementById('timesheet_edit_form_duration').focus();
                var begin_value = document.getElementById('timesheet_edit_form_begin');
                console.log('DATE BEGIN '+ begin_value.value);
                var osma_rano = begin_value.value.substring(0,13) + '08:00';
                console.log('OSMA RANO '+ osma_rano);
                document.getElementById('timesheet_edit_form_begin').value = osma_rano;
                changedBegin(osma_rano);
                document.getElementById('timesheet_edit_form_duration').value = '08:00';
                changedDuration('08:00');
                //document.getElementById('timesheet_edit_form_tags').focus();
            }
            //document.getElementById('timesheet_edit_form_duration')
        }
        console.log('MUTATION');
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

})();