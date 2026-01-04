// ==UserScript==
// @name         NitroMath Bot With Session Break
// @namespace    https://singdev.wixsite.com/sing-developments
// @version      0.1
// @description  Automate interactions on NitroMath, this bot does not allow accuracy settings, and will play for hours on end WITH a captcha solver added. It will wait for 30 minutes every 100 games it playes.
// @author       Sing Developments
// @match        https://www.nitromath.com/play
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480892/NitroMath%20Bot%20With%20Session%20Break.user.js
// @updateURL https://update.greasyfork.org/scripts/480892/NitroMath%20Bot%20With%20Session%20Break.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let gamesCounter = 0;

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function moveMouseRandomly() {
        const body = document.body;
        const offsetX = getRandomNumber(0, body.offsetWidth);
        const offsetY = getRandomNumber(0, body.offsetHeight);

        const event = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: offsetX,
            clientY: offsetY
        });

        body.dispatchEvent(event);
    }

    function reloadPage() {
        location.reload();
    }

    setInterval(function() {
        gamesCounter++;

        if (gamesCounter % 100 === 0) {
            console.log("Waiting for 30 minutes...");
            setTimeout(function() {
                console.log("Resuming after 30 minutes...");
            }, 30 * 60 * 1000); // 30 minutes in milliseconds
        }

        moveMouseRandomly();
    }, 1000);

    setInterval(reloadPage, 100000);

})();
