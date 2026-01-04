// ==UserScript==
// @name         OC 2.0 REJOIN REMINDER
// @namespace    http://tampermonkey.net/
// @version      2025-02-23.5
// @description  REMINDS YOU TO ENTER AN OC
// @author       MEDICROVIN
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/loader.php?sid=attack*
// @exclude      https://www.torn.com/pc.php*
// @exclude      https://www.torn.com/level2.php*
// @grant        none
// @license      MedicRovin
// @downloadURL https://update.greasyfork.org/scripts/527880/OC%2020%20REJOIN%20REMINDER.user.js
// @updateURL https://update.greasyfork.org/scripts/527880/OC%2020%20REJOIN%20REMINDER.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        setTimeout(function() {
            var OC = document.querySelector("[aria-label^='Organized Crime:']");
            if (OC == null) {
                let message = $('<div id="strobeMessage" style="background-color: blue; position:fixed; top:0; width:100%; z-index:999999; padding: 20px;margin-top: 0px; text-align: center; color: white; opacity: 1;">YOU ARE NOT IN AN OC</div>');
                $("body").append(message);

                let interval = 500; // Blink speed (in milliseconds)
                let duration = 2000; // Total strobe duration (1 seconds)
                let endTime = Date.now() + duration;

                let strobeEffect = setInterval(() => {
                    message.css("opacity", message.css("opacity") == "1" ? "0" : "1");

                    // Stop strobing after 2 seconds and make message stay visible
                    if (Date.now() >= endTime) {
                        clearInterval(strobeEffect);
                        message.css("opacity", "1"); // Ensure it stays visible
                    }
                }, interval);
            }
        }, 5000);
    });
})();


