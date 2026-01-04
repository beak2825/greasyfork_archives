// ==UserScript==
// @name         BIT-Moodle-Video-Speed-Up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  北理乐学视频倍率播放
// @author       Skaimid
// @include      http://lexue.bit.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396818/BIT-Moodle-Video-Speed-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/396818/BIT-Moodle-Video-Speed-Up.meta.js
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


        if (document.querySelector('video') != null) {

            var myInstOfPlayer = getElements('role="main"');

            var spdUpBtn = document.createElement("BUTTON");
            spdUpBtn.innerHTML = '加速 0.1x';
            var spdDownBtn = document.createElement("BUTTON");
            spdDownBtn.innerHTML = '减速 0.1x';

            var dipsTxt = document.createElement("P");

            spdUpBtn.addEventListener("click", function() {
                document.querySelector('video').playbackRate += 0.1;
                dipsTxt.innerHTML = "倍率: " + round(document.querySelector('video').playbackRate, 2);
            });

            spdDownBtn.addEventListener("click", function() {
                document.querySelector('video').playbackRate -= 0.1;
                dipsTxt.innerHTML = "倍率: " + round(document.querySelector('video').playbackRate, 2);
            });

            myInstOfPlayer.parentNode.insertBefore(spdUpBtn, myInstOfPlayer.nextSibling);
            myInstOfPlayer.parentNode.insertBefore(spdDownBtn, myInstOfPlayer.nextSibling);
            myInstOfPlayer.parentNode.insertBefore(dipsTxt, myInstOfPlayer.nextSibling);
            dipsTxt.innerHTML = "倍率: " + "1";

        }
    }, false);

})();