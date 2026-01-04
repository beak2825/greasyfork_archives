// ==UserScript==
// @name         Help
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  seriously
// @author       You
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/450248/Help.user.js
// @updateURL https://update.greasyfork.org/scripts/450248/Help.meta.js
// ==/UserScript==
/* globals $ */

//let document load fully
(function() {
    'use strict';

    window.onload = function updateTime() {

        // get all parts of the current time
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        setInterval(updateTime, 1000);

        // add leading zero's to minutes and seconds
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        // get time of day (am or pm)
        if (hours >= 12 && hours < 24) {
            var timeOfDay = 'pm';
        }
        else {
            var timeOfDay = 'am';
        }

        // convert hours from 24-hour time to 12-hour time
        if (hours > 12) {
            hours = hours - 12;
        }

        // splice them together into a character string named "currentTime"
        var currentTime = hours + ':' + minutes + ':' + seconds + ' ' + timeOfDay;

        // get the clock div
        var myClock = document.getElementById('clock');

        // write the currentTime string to the clock div
        myClock.innerHTML = currentTime;

    };

    $("#view").on('click', function() {
        $("#clock").toggle();
    });

    $('body').append(`<div id="btn"><button id="view">Click</button><p><div id="clock"></div></p></div>`);

    $('head').append(`<style>
#btn {
       position: absolute;
       right: 200px;
       top: 20px;
       color: #000;
       font-size: 12px;
       background-color: #fff !important;
       text-align: center;
       display: block;
       height: 50px;
       width: 115px;
       border: 1px solid #000;
       padding-bottom: 40px;
 }
 #clock {
       color: #fff;
       font-size: 12px;
       background-color: #000 !important;
       text-align: center;
       display: block;
       height: 20px;
 }
</style>`);
})();