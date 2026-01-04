// ==UserScript==
// @name         Speed Randomizer
// @namespace    http://tampermonkey.net/
// @version      2025-04-07-2
// @description  Fun tool that will randomly change the speed of media
// @author       CCGameing
// @match        file://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532093/Speed%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/532093/Speed%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.vid = document.querySelector("video");

    var vid = window.vid;

    var scriptActive = true;

    var min = 0.2;

    function validateMax(num) {
        if (num < 0 || isNaN(num)) return 0;
        if (num > 16) return 1;
        if (num < 16 && num > 0) return 2;
    }

    var loop = true;

    while (loop) {
        var input = prompt("How fast can the vid go? \nMin = 0.2, Max = 16, Default = 8", 8)

        if (input == null) {
            scriptActive = false
            loop = false
            break
        }

        var max = input - min;

        switch (validateMax(max)) {
            case 2:
                alert("Using values: Min = 0.2, Max = " + (min + max))
                loop = false;
                break;
            case 1:
                max = 16 - min;
                alert("Using values: Min = 0.2, Max = " + (min + max));
                loop = false;
                break;
            case 0:
                alert("Please enter a number!")
        }
    }

    var fileTitle = window.location.href.split('/').pop()

    function update() {
        vid.playbackRate = min + (Math.random() * max);

        document.title = "x" + (Math.round(vid.playbackRate * 100) / 100) + ": " + fileTitle
        console.log("Video Looped! current speed = " + vid.playbackRate)
    }

    if (scriptActive) {
        update()
    }

    vid.onended = () => {
        if (scriptActive) {
            update()
        }
        vid.play()
    }

    vid.onpause = () => {
        if (scriptActive) {
            update()
        }
    }

    window.updateVid = update

    // Your code here...
})();