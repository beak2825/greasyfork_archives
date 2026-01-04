// ==UserScript==
// @name         Kimai Time Backwards
// @namespace    https://foliovision.com/
// @version      1.0
// @description  Enhancements for Kimai time tracking. Now when one enters a time in Duration that it moves the start time back by the number of minutes entered (one cannot predict the amount of time one has worked, one enters time after work).
// @author       Foliovision
// @match        https://kimai.foliovision.com/*
// @grant        GPLv3
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488711/Kimai%20Time%20Backwards.user.js
// @updateURL https://update.greasyfork.org/scripts/488711/Kimai%20Time%20Backwards.meta.js
// ==/UserScript==
( function() {
    document.addEventListener( 'shown.bs.modal', function() {
        console.log( 'FV Kimai Tweaks: Modal window was open...' );

        var duration_field = document.querySelector("#timesheet_edit_form_duration");
        if ( duration_field ) {
            console.log( 'FV Kimai Tweaks: Found duration field...' );

            duration_field.addEventListener("change", event );
            duration_field.addEventListener("keyup", event );
        }
    });

    function event() {
        var input = this;
        setTimeout( function() {
            var duration = parseTime( input.value );

            if ( duration ) {
                set_time( '#timesheet_edit_form_end_time', new Date() );

                var start = new Date();
                start.setMinutes( start.getMinutes() - duration );
                set_time( '#timesheet_edit_form_begin_time', start );
            }
        }, 10 );
    }

    function set_time( selector, time ) {
        time = roundToNearestFiveMinutes( time );
        
        var hours = time.getHours();
        var minutes = time.getMinutes();

        // Pad minute value with leading zero if it's less than 10
        minutes = minutes < 10 ? '0' + minutes : minutes;

        var formattedTime = hours + ":" + minutes;
        document.querySelector( selector).value = formattedTime;
    }

    function parseTime(timeStr) {

        var totalMinutes = 0;

        // If format like 10m (minutes only)
        var match = timeStr.match(/^(\d+)\s*m$/);
        if (match) {
            totalMinutes = Number(match[1]);
        }

        // If format is like 10:10 (hours:minutes)
        match = timeStr.match(/^(\d+):(\d+)$/);
        if (match) {
            totalMinutes = Number(match[1]) * 60 + Number(match[2]); // Convert hours to minutes
        }

        // If format like 10 (hours only)
        match = timeStr.match(/^(\d+)$/);
        if (match) {
            totalMinutes = Number(match[1]) * 60; // Convert hours to minutes
        }

        console.log( 'FV Kimai Tweaks: ' + timeStr + ' is ' + totalMinutes + ' minutes...' );

        return totalMinutes;
    }

    function roundToNearestFiveMinutes(date) {
        let minutes = date.getMinutes();
        let roundedMinutes = Math.floor(minutes / 5) * 5;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes);
    }

})();