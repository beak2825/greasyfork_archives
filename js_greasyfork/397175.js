// ==UserScript==
// @name         Readsy ETA
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display remaining time on readsy
// @author       Liam Wang
// @match        http://www.readsy.co/*
// @include https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397175/Readsy%20ETA.user.js
// @updateURL https://update.greasyfork.org/scripts/397175/Readsy%20ETA.meta.js
// ==/UserScript==

var interval = 5;
(function() {
    'use strict';
    var t=setInterval(runFunction, interval*1000);
    var b=setInterval(updateLabel, 1000);

    //$('.locked-step').removeClass('locked-step').addClass('showStepsButton')
    $("p#wordCounter").children('small').append("<span id=\"minuteNumber\">0</span> minutes and <span id=\"secondNumber\">0</span> seconds remaining...");
})();

var numSaved = 1;
var pastDifferenceArray = [];
var soFar = 0;
var outOf = 0;

var last = 0;

var wordsPerSecond = 0;

function runFunction() {
    var soFarTemp = $('span#wordNumber').text();
    if (soFarTemp) {
        soFar = soFarTemp;
    }
    var outOfTemp = $('span#wordTotal').text();
    if (outOfTemp) {
        outOf = outOfTemp;
    }
    var diff = soFar-last;
    if (diff > 0 && diff < 9000) {
        pastDifferenceArray.push(diff);
    }
    last = soFar;
    if (pastDifferenceArray.length > numSaved) {
        pastDifferenceArray.shift();
    }
    //console.log(pastDifferenceArray);

    var total = 0;
    for(var i = 0; i < pastDifferenceArray.length; i++) {
        total += pastDifferenceArray[i];
    }
    wordsPerSecond = total / pastDifferenceArray.length / interval;

    //console.log(secondsRemaining + " total")


}

function updateLabel() {
    var soFarTemp = $('span#wordNumber').text();
    if (soFarTemp) {
        soFar = soFarTemp;
    }
    var outOfTemp = $('span#wordTotal').text();
    if (outOfTemp) {
        outOf = outOfTemp;
    }
    var toGo = outOf-soFar;
    var secondsRemaining = toGo/wordsPerSecond;
    //console.log(secondsRemaining + " total")
    var minutes = Math.floor(secondsRemaining / 60);
    var seconds = secondsRemaining % 60;

    $('span#minuteNumber').text(Math.round(minutes))
    $('span#secondNumber').text(Math.round(seconds))
}



