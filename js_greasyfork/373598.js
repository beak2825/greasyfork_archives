// ==UserScript==
// @name         Westjet Checkin
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Check in for your westjet flight, at a specific time
// @author       Libby Robinson
// @match        https://checkin.westjet.com/WSOCI/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373598/Westjet%20Checkin.user.js
// @updateURL https://update.greasyfork.org/scripts/373598/Westjet%20Checkin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var findResoHeader$ = $('#leader h1');
    if(!findResoHeader$ || findResoHeader$.text().indexOf('Check in: Find reservation') === -1) {
        return;
    }

    $('#search').append('<div class="row" style="color: red;">' +
                        '<div class="col-xs-12 col-md-12 col-lg-12"><label for="checkInTime" style="color: red;">Check in time (when the "Continue" button should automatically be clicked)</label></div>' +
                        '<div class="col-xs-12 col-md-4 col-lg-3"><input type="text" id="checkInTime" placeholder="eg: 14:35"></div>' +
                        '</div>');

    var departureCity$ = $('#departureCity');
    departureCity$.val(sessionStorage.getItem('departureCity'));
    departureCity$.change(function(){
        sessionStorage.setItem('departureCity', departureCity$.val());
    });

    var firstName$ = $('#firstName');
    firstName$.val(sessionStorage.getItem('firstName'));
    firstName$.change(function(){
        sessionStorage.setItem('firstName', firstName$.val());
    });

    var lastName$ = $('#lastName');
    lastName$.val(sessionStorage.getItem('lastName'));
    lastName$.change(function(){
        sessionStorage.setItem('lastName', lastName$.val());
    });

    var recordLocator$ = $('#recordLocator');
    recordLocator$.val(sessionStorage.getItem('recordLocator'));
    recordLocator$.change(function(){
        sessionStorage.setItem('recordLocator', recordLocator$.val());
    });

    var checkTime;
    var initAutoCheckIn = function() {
        clearInterval(checkTime);
        var checkInTime = sessionStorage.getItem('checkInTime');
        if(!checkInTime) return;

        var checkInDate = new Date($.now());
        checkInDate.setHours(checkInTime.split(':')[0]);
        checkInDate.setMinutes(checkInTime.split(':')[1]);
        checkInDate.setSeconds(0);
        checkInDate.setMilliseconds(0);

        checkTime = setInterval(function() {
            if(new Date($.now()) >= checkInDate) {
                clearInterval(checkTime);
                $('#continue').click();
            }
        }, 20);
    };

    var checkInTime$ = $('#checkInTime');
    checkInTime$.val(sessionStorage.getItem('checkInTime'));
    checkInTime$.change(function(){
        sessionStorage.setItem('checkInTime', checkInTime$.val());
        initAutoCheckIn();
    });

    initAutoCheckIn();
})();