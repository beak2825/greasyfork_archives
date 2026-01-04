// ==UserScript==
// @name         Erev RW Improve
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Improve RW opening
// @author       Sky
// @match        https://www.erevollution.com/*/country/region/*
// @icon         https://www.google.com/s2/favicons?domain=erevollution.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439884/Erev%20RW%20Improve.user.js
// @updateURL https://update.greasyfork.org/scripts/439884/Erev%20RW%20Improve.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var FINE_TUNE = 2000; // (miliseconds) Increase by 100 if it clicks to late. Decrease by 100 if it clicks to fast
    var now = new Date(serverdate);
    var rw = $("tr td:contains(Start a resistance war) strong");

    if (rw.text() !== '') {
        var timeElems = rw.text().slice(1, -1).split(":");
        var h = parseInt(timeElems[0]) * 60 * 60 * 1000;
        var m = parseInt(timeElems[1]) * 60 * 1000;
        var s = parseInt(timeElems[2]) * 1000;
        var target = new Date(now);
        target.setMilliseconds(now.getMilliseconds() + (h + m + s));

        var timerDiv = $('<div>')
        .attr('id', 'timerDiv')
        .css({
            'background-color': 'white',
            'border': '1px solid black',
            'margin': '15px 100px',
            'text-align': 'center',
            'padding': '10px',
        })
        .text('Will auto click in: ');

        var timerTxt = $('<span>')
        .attr('id', 'timerTxt')
        .text('[XX:XX:XX]');

        timerDiv.append(timerTxt);
        $('.modal-dialog').append(timerDiv);

        var tick = 100;

        var x = setInterval(function() {
            // Find the distance between now and the count down date
            var distance = target - FINE_TUNE - serverdate;


            // click to auto-start RW if conditions are met
            if (distance <= 0) {
                clearInterval(x);
                console.log("Triggered: " + serverdate + ". Checked. Distance: " + distance);
                var submitButtonElement = $('button.buttonT[type="submit"]');
                submitButtonElement?.trigger('click');
            } else if(distance < 800 && distance >= 600) {
                tick = 50;
            } else if(isNaN(distance)) {
                console.log('end');
                clearInterval(x);
            } else {
                // console.log("Now: " + serverdate + ". Checked: " + isAutoRWChecked + ". Distance: " + distance);
            }

            // Time calculations for hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the timer
            rw.text("[" + formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds) + "]");
            timerTxt.text("[" + formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds) + "]");

        }, 100);
    }

    function formatTime(timeVal) {
        var dt = "00";
        if (timeVal > 0 && timeVal < 10) {
            dt = "0" + timeVal;
        } else if (timeVal > 9) {
            dt = "" + timeVal
        }
        return dt;
    }

})();