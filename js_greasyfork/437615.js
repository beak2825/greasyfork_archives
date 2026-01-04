// ==UserScript==
// @name         ElektroSpeedUp+Skip
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Generates time from thin air
// @author       Anon
// @include      https://elearning.uni-obuda.hu/main/mod/eduplayer/*
// @include      https://elearning.uni-obuda.hu/main/mod/resource/view.php*
// @include      https://elearning.uni-obuda.hu/main_archive/mod/eduplayer/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437615/ElektroSpeedUp%2BSkip.user.js
// @updateURL https://update.greasyfork.org/scripts/437615/ElektroSpeedUp%2BSkip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        function getElements(attrib) {
            return document.querySelectorAll('[' + attrib + ']')[0];
        }
        function round(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }

        // Creating buttons
        var myInstOfPlayer = getElements('role="main"');
        var spdUpBtn = document.createElement("BUTTON");
        spdUpBtn.innerHTML = 'Elalszom';
        var spdDownBtn = document.createElement("BUTTON");
        spdDownBtn.innerHTML = 'Hóó Hóó';
        var skipBackwardBtn = document.createElement("BUTTON");
        skipBackwardBtn.innerHTML = '<<';
        var skipForwardBtn = document.createElement("BUTTON");
        skipForwardBtn.innerHTML = '>>';
        var dipsTxt = document.createElement("P");

        // Skipping with keyboard
        document.onkeydown = function(event) {
            switch (event.keyCode) {
                case 37:
                    event.preventDefault();
                    document.querySelector('video').currentTime -= 10;
                    break;
                case 39:
                    event.preventDefault();
                    document.querySelector('video').currentTime += 10;
                    break;
            }
        };

        // Button functions
        spdUpBtn.addEventListener("click", function(){
             document.querySelector('video').playbackRate += 0.2;
             dipsTxt.innerHTML = "playback rate: " + round(document.querySelector('video').playbackRate,2);
        });
        spdDownBtn.addEventListener("click", function(){
             document.querySelector('video').playbackRate -= 0.2;
             dipsTxt.innerHTML = "playback rate: " + round(document.querySelector('video').playbackRate,2);
        });
        skipBackwardBtn.addEventListener("click", function(){
             document.querySelector('video').currentTime -= 10;
        });
        skipForwardBtn.addEventListener("click", function(){
             document.querySelector('video').currentTime += 10;
        });

        myInstOfPlayer.parentNode.insertBefore(skipForwardBtn, myInstOfPlayer.nextSibling);
        myInstOfPlayer.parentNode.insertBefore(skipBackwardBtn, myInstOfPlayer.nextSibling);
        myInstOfPlayer.parentNode.insertBefore(spdUpBtn, myInstOfPlayer.nextSibling);
        myInstOfPlayer.parentNode.insertBefore(spdDownBtn, myInstOfPlayer.nextSibling);
        myInstOfPlayer.parentNode.insertBefore(dipsTxt, myInstOfPlayer.nextSibling);
        dipsTxt.innerHTML = "playback rate: 1.0";
    }, false);

})();