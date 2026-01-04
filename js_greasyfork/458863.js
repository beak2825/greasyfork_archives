// ==UserScript==
// @name         ARM Rip Elapsed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show elapsed time of current rip
// @author       thompcha
// @include      http://*.*.*.*:8080/history
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js
// @license      FSFAP
// @downloadURL https://update.greasyfork.org/scripts/458863/ARM%20Rip%20Elapsed.user.js
// @updateURL https://update.greasyfork.org/scripts/458863/ARM%20Rip%20Elapsed.meta.js
// ==/UserScript==

$( document ).ready(function() {

    var start = $('tr:eq(1) td:first').text();
    var start_parsed = moment(start,'DD-MM-YYYY hh:mm:ss')

    setInterval(function(){
        var elapsed = moment.duration(moment().diff(start_parsed));
        var elapsed_formatted = moment.utc(elapsed.as('milliseconds')).format('H:mm:ss');
        $('tr:eq(1) td:eq(2)').html(elapsed_formatted);
    }, 1000);

});