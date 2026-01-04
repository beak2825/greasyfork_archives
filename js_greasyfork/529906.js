// ==UserScript==
// @name         P&W Auto Set Ship Amount 
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Instantly sets ship amount to 1 on the naval battle page in Politics and War
// @author       MangoTheGoat
// @match        https://politicsandwar.com/nation/war/navalbattle/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529906/PW%20Auto%20Set%20Ship%20Amount.user.js
// @updateURL https://update.greasyfork.org/scripts/529906/PW%20Auto%20Set%20Ship%20Amount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setShipAmount() {
        let shipInput = document.querySelector('input#attShips, input[name="attShips"]');

        if (shipInput) {
            shipInput.value = 1;
            shipInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Ship amount set to 1 automatically.");
        } else {
            console.error("Ship quantity input field not found!");
        }
    }

    let attempts = 0;
    let interval = setInterval(() => {
        if (document.readyState === "complete" || attempts >= 20) {
            clearInterval(interval);
            setShipAmount();
        }
        attempts++;
    }, 100);

})();
