// ==UserScript==
// @name         Melvor Notification Ding
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Plays a ding sound when a notification is displayed for farming or slayer.
// @author       Krosis
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405321/Melvor%20Notification%20Ding.user.js
// @updateURL https://update.greasyfork.org/scripts/405321/Melvor%20Notification%20Ding.meta.js
// ==/UserScript==
// jshint esversion: 6

(function() {
    'use strict';
    // Save off the default notify function.
    var origNotify = window.notifyPlayer;
    var ding = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect.mp3");
    ding.volume = 0.5;
    var lastDing = -1;
    function newNotify(skill, ...args) {
        // Pass through arguments to the original notify function.
        origNotify(skill, ...args);
        if ((skill == CONSTANTS.skill.Farming) || (skill == CONSTANTS.skill.Slayer)) {
            // Only ding at most every 20 seconds. This reduces spam when farming tasks complete.
            var now = Date.now();
            if (now - lastDing >= 20000) {
                ding.play();
                lastDing = now;
            }
        }
    }
    // Use this custom function in game.
    window.notifyPlayer = newNotify;
})();