// ==UserScript==
// @name         Twitch Add Timer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a watch timer next to the follow icon so you can see how long you are watching the stream. Resets automatically on page changes.
// @author       RichardG
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523052/Twitch%20Add%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/523052/Twitch%20Add%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timerElement = document.createElement("div");
    timerElement.style.cssText = "position:absolute; bottom: 5px; left: -20px";
    timerElement.innerHTML = "<p>00:00:00</p>";

    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let lastHref = window.location.href;

    function updateTimer() {
        if(lastHref != window.location.href) {
            seconds = 0;
            minutes = 0;
            hours = 0;
            lastHref = window.location.href;
        }
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }

        // Format the time to always show two digits
        const formattedTime =
              String(hours).padStart(2, '0') + ':' +
              String(minutes).padStart(2, '0') + ':' +
              String(seconds).padStart(2, '0');

        timerElement.textContent = formattedTime;
    }

    setInterval(() => {
        try {
            document.querySelector('[data-target="channel-header-right"]').childNodes[0].appendChild(timerElement);
        }
        catch(e) {
        }
    }, 3000);

    // Update the timer every 1000 milliseconds (1 second)
    setInterval(updateTimer, 1000);

})();