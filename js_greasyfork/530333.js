// ==UserScript==
// @name         Timer Accelerator1000X
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @license      GNU AGPLv3
// @description  Accelerate JavaScript timers with safety checks. Edit @match entries for your required websites. Else, the script runs globally.
// @author       Ex_Dr.Perimentz
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/n2gw8pb22uojb56dqox9ja5gg90f
// @match        *://online-stopwatch.com/*
// @match        *://downloadsite.com/*
// @match        *://otherdownloadsite.com/files/*
// @match        *://keedabankingnews.com/*
// @match        *://healthvainsure.site/*
// @grant        none
// @run-at       document-start
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      brave

// Copyright (C) 2025 Ex_Dr.Perimentz
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


// @downloadURL https://update.greasyfork.org/scripts/530333/Timer%20Accelerator1000X.user.js
// @updateURL https://update.greasyfork.org/scripts/530333/Timer%20Accelerator1000X.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the acceleration factor (e.g., 1000x speedup means 1000ms becomes 1ms)
    const accelerationFactor = 1000;

    // Define a minimum delay to avoid extremely short intervals that may be clamped by the browser
    const minimumDelay = 4; // milliseconds

    // Store original timer functions to call later
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    // Override the global setTimeout function
    window.setTimeout = function(callback, delay, ...args) {
        // Ensure the delay is a number. If not, default to 0.
        delay = Number(delay) || 0;

        // If the delay is positive, accelerate it by dividing by the acceleration factor,
        // while ensuring it doesn't drop below the minimumDelay.
        if (delay > 0) {
            delay = Math.max(minimumDelay, delay / accelerationFactor);
        }

        // Call the original setTimeout with the modified delay
        return originalSetTimeout(callback, delay, ...args);
    };

    // Override the global setInterval function similarly
    window.setInterval = function(callback, delay, ...args) {
        // Coerce delay to a number, defaulting to 0 if necessary.
        delay = Number(delay) || 0;

        // Accelerate the delay if it's a positive number, while ensuring a minimum delay
        if (delay > 0) {
            delay = Math.max(minimumDelay, delay / accelerationFactor);
        }

        // Call the original setInterval with the modified delay
        return originalSetInterval(callback, delay, ...args);
    };

    // Log a message in the console to indicate that the timers have been accelerated
    console.log(`Timers accelerated by ${accelerationFactor}x.`);
})();
