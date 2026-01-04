// ==UserScript==
// @version 0.1
// @namespace matastic
// @name ZET.hr timetable hider
// @description Hide timetables that are in past, showing only recent and future ones
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.23.0/moment.min.js
// @include *://www.zet.hr/raspored-voznji/*
// @downloadURL https://update.greasyfork.org/scripts/377075/ZEThr%20timetable%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/377075/ZEThr%20timetable%20hider.meta.js
// ==/UserScript==

$( document ).ready(function () {
  $('tr').filter(function(key, item) {
    var $item = $(item);

    $item = $item.find('td a');
    var itemMoment = moment($item.html(), 'HH:mm:ss');
    var nowMoment = moment().subtract('30', 'minutes');

    return itemMoment <= nowMoment;
  }).hide();
});