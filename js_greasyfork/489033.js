// ==UserScript==
// @name         [KPX] Auto-join jobs in CartelEmpire
// @namespace    https://cartelempire.online/
// @version      0.3
// @description  Automate job actions on Cartel Empire
// @author       KPCX
// @match        https://cartelempire.online/*obs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489033/%5BKPX%5D%20Auto-join%20jobs%20in%20CartelEmpire.user.js
// @updateURL https://update.greasyfork.org/scripts/489033/%5BKPX%5D%20Auto-join%20jobs%20in%20CartelEmpire.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.click();
            return true;
        }
        return false;
    }

    function randomDelay(min, max) {
        return Math.random() * (max - min) + min;
    }

    function checkButtons() {
        if (clickButton('form[action="/jobs/agavestorage"] button')) { // /arson /agavestorage /farmrobbery
            console.log("Start button clicked");
            setTimeout(checkButtons, 3000);
        } else if (document.querySelector('button[id="cancelButton"]')) {
            let delay = randomDelay(20000, 35000);
            console.log("Cancel button found, waiting for " + (delay / 1000) + " seconds...");
            setTimeout(checkButtons, delay);
        } else if (clickButton('form[action="/jobs/finish"] input[type="submit"]')) {
            console.log("Complete button clicked");
            setTimeout(checkButtons, 3000);
        } else {
            setTimeout(checkButtons, 3000);
        }
    }

    setTimeout(checkButtons, 3000);
})();