// ==UserScript==
// @name         freeth.in Auto Freeroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates freeroll play with optimized interactions
// @author       Cubensys999
// @match        https://freeth.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/536895/freethin%20Auto%20Freeroll.user.js
// @updateURL https://update.greasyfork.org/scripts/536895/freethin%20Auto%20Freeroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Generate a random integer within a range
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to safely click an element
    function safeClick(selector) {
        const element = $(selector);
        if (element.length > 0 && element.is(":visible")) {
            element[0].click();
            console.log(`[${new Date().toLocaleTimeString()}] Clicked on ${selector}`);
        } else {
            console.warn(`[${new Date().toLocaleTimeString()}] Element not found or not visible: ${selector}`);
        }
    }

    // Track elapsed time in minutes
    let count_min = 1;

    $(document).ready(function() {
        console.log(`[${new Date().toLocaleTimeString()}] Status: Page loaded.`);

        setTimeout(() => {
            safeClick('#play_without_captchas_button');
            safeClick('#free_play_form_button');
            console.log(`[${new Date().toLocaleTimeString()}] Status: Button ROLL clicked.`);
        }, random(2000, 4000));

        setInterval(() => {
            console.log(`[${new Date().toLocaleTimeString()}] Status: Elapsed time ${count_min} minutes`);
            count_min++;
        }, 60000);

        setTimeout(() => {
            safeClick('.close-reveal-modal');
            console.log(`[${new Date().toLocaleTimeString()}] Status: Button CLOSE POPUP clicked.`);
        }, random(12000, 18000));

        setInterval(() => {
            safeClick('#free_play_form_button');
            console.log(`[${new Date().toLocaleTimeString()}] Status: Button ROLL clicked again.`);
        }, random(3605000, 3615000));
    });

})();