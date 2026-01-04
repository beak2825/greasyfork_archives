// ==UserScript==
// @name         DePaul MyCDM Tutoring Page Formatter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  none
// @author       Maskar
// @match        https://my.cdm.depaul.edu/v2/Hours/HoursHome/SlotManagement
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424591/DePaul%20MyCDM%20Tutoring%20Page%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/424591/DePaul%20MyCDM%20Tutoring%20Page%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#notificationCallout').hide();
    $('#leftnav').toggleClass('nav_collapse');
    $('#content').toggleClass('nav_collapse');

    //window.setTimeout(function() {
    //    $('#currentAppointmentTable').find('tr td:nth-child(1),td:nth-child(4),td:nth-child(5)').hide();
    //    $('#pastAppointmentTable').find('tr td:nth-child(1),td:nth-child(4),td:nth-child(5)').hide();
    //}, 1000);

    $('<style>').text("\
                      #currentAppointmentTable tr td:nth-child(4),td:nth-child(5){display: none;}\
                      #pastAppointmentTable tr td:nth-child(4),td:nth-child(5){display: none;}\
                      ").appendTo(document.head)

    $('#currentAppointmentTable').on('DOMSubtreeModified', function () {
        $('.slotRow').filter(function(index){
            return $(this).attr('data-appointmentdate') != $(this).next().attr('data-appointmentdate')
        }).css('border-bottom','solid darkblue');
    });

    $('#pastAppointmentTable').on('DOMSubtreeModified', function () {
        $('.slotRow').filter(function(index){
            return $(this).children('td').eq(1).text() != $(this).next().children('td').eq(1).text()
        }).css('border-bottom','solid darkblue');
    });



})();