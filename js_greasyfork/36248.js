// ==UserScript==
// @name         BodyMindLife Timetable Fixer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description  Improves BodyMindLife.com class timetable to include weekday
// @author       pelmeshkin
// @include      https://www.bodymindlife.com/*
// @downloadURL https://update.greasyfork.org/scripts/36248/BodyMindLife%20Timetable%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/36248/BodyMindLife%20Timetable%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    $('section.banner').hide();
    $('#sitewide-notification').hide();
    $('.timetable-section .timetable-header-container').find('.col:eq(2)').each(function(index, value){
        var date = $(value).text();
        var day = date.split('/')[0];
        if(day < 10) { day = '0' + day; }
        var month = date.split('/')[1];
        var year = (new Date()).getFullYear();
        var yyyymmdd = new Date(year + '-' + month + '-' + day);
        var weekday = weekdays[yyyymmdd.getDay()];
        $(value).css('width', '7.6%').text(weekday + ' ' + day + '/' + month);
    });
})();