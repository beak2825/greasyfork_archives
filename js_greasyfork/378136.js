// ==UserScript==
// @name         YoutubeClock
// @namespace    https://oxodao.fr/
// @version      1
// @description  Add a simple clock to the youtube bar so that you don't need to close fullscreen to see it.
// @author       Nathan <Oxodao> JANCZEWSKI
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378136/YoutubeClock.user.js
// @updateURL https://update.greasyfork.org/scripts/378136/YoutubeClock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bar = document.getElementsByClassName("ytp-right-controls")[0];
    let clock = document.createElement("span");
    clock.classList.add("ytp-time-display");
    clock.innerText = "Toto";

    function clockTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;
        clock.innerText = h + ":" + m + ":" + s;
        setTimeout(clockTime, 500);
    }

    clockTime();

    bar.insertBefore(clock, bar.childNodes[0]);
})();