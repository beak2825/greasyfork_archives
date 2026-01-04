// ==UserScript==
// @name         ElektroSpeedUp
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include        https://elearning.uni-obuda.hu/main/mod/eduplayer/*
// @include        https://elearning.uni-obuda.hu/main/mod/resource/view.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40555/ElektroSpeedUp.user.js
// @updateURL https://update.greasyfork.org/scripts/40555/ElektroSpeedUp.meta.js
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

        var myInstOfPlayer = getElements('role="main"');

        var spdUpBtn = document.createElement("BUTTON");
        spdUpBtn.innerHTML = 'Elalszom';
        var spdDownBtn = document.createElement("BUTTON");
        spdDownBtn.innerHTML = 'Hóó Hóó';

        var dipsTxt = document.createElement("P");

        spdUpBtn.addEventListener("click", function(){
             document.querySelector('video').playbackRate += 0.2;
             dipsTxt.innerHTML =  round(document.querySelector('video').playbackRate,2);
        });

        spdDownBtn.addEventListener("click", function(){
             document.querySelector('video').playbackRate -= 0.2;
             dipsTxt.innerHTML = round(document.querySelector('video').playbackRate,2);
        });

        myInstOfPlayer.parentNode.insertBefore(spdUpBtn, myInstOfPlayer.nextSibling);
        myInstOfPlayer.parentNode.insertBefore(spdDownBtn, myInstOfPlayer.nextSibling);
        myInstOfPlayer.parentNode.insertBefore(dipsTxt, myInstOfPlayer.nextSibling);
        dipsTxt.innerHTML = "1";


    }, false);

})();