// ==UserScript==
// @name         MIP Reporting Assist
// @namespace    EPS Developments
// @version      0.2
// @description  Automate parts of filling out MIP Search.
// @author       EPS
// @match        http://mip.indot.in.gov/discoverer*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31172/MIP%20Reporting%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/31172/MIP%20Reporting%20Assist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css');

    document.getElementsByTagName("head")[0].appendChild(link);

    //$.datepicker.setDefaults( $.datepicker.formatDate( 'dd-M-yy' ));

    // Retrieve all the input boxes used to enter dates.
    var dateTextboxesTR = $( 'label:contains(Date), label:contains(date)' ).parent().parent().parent(),
        dateTextboxes = $( '.OraFormFieldText', dateTextboxesTR );

    // Add the datepicker functionality to each date input box.    
    $.each(dateTextboxes, function(index){    
        $(this).datepicker({
            dateFormat: "d-M-yy",
            defaultDate: "-1m"
        });    
    });
})();