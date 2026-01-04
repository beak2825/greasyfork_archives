// ==UserScript==
// @name         TimeHookerLite
// @namespace    https://cozian.timehooker.com
// @version      1.4
// @description  Set adjustable playback speed on selected websites
// @author       cozian
// @license      MIT
// @include      *
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/515322/TimeHookerLite.user.js
// @updateURL https://update.greasyfork.org/scripts/515322/TimeHookerLite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve include list and playback speed, or initialize defaults
    let includeList = GM_getValue("includeList", []);
    let playbackSpeed = GM_getValue("playbackSpeed", 10); // Default speed of 10x

    // Function to add the current site to the include list
    function addToIncludeList() {
        const currentSite = window.location.hostname;
        if (!includeList.includes(currentSite)) {
            includeList.push(currentSite);
            GM_setValue("includeList", includeList);
            alert(`Added ${currentSite} to include list.`);
        } else {
            alert(`${currentSite} is already in the include list.`);
        }
    }

    // Function to set a new playback speed
    function setPlaybackSpeed() {
        const newSpeed = prompt("Enter the new playback speed (e.g., 10 for 10x):", playbackSpeed);
        if (newSpeed && !isNaN(newSpeed)) {
            playbackSpeed = parseFloat(newSpeed);
            GM_setValue("playbackSpeed", playbackSpeed);
            alert(`Playback speed set to ${playbackSpeed}x.`);
        } else {
            alert("Invalid speed value. Please enter a numeric value.");
        }
    }

    // Register menu commands for adding sites and setting playback speed
    GM_registerMenuCommand("Add this site to TimeHookerLite Include List", addToIncludeList);
    GM_registerMenuCommand("Set TimeHookerLite Playback Speed", setPlaybackSpeed);

    // Check if the current site is in the include list before running the script
    if (!includeList.includes(window.location.hostname)) {
        return;
    }

    // Override setInterval to accelerate intervals based on the playback speed
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        return originalSetInterval(callback, delay / playbackSpeed, ...args);
    };

    // Override setTimeout to accelerate timeouts based on the playback speed
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay, ...args) {
        return originalSetTimeout(callback, delay / playbackSpeed, ...args);
    };

    // Override Date.now to simulate accelerated time
    const originalDateNow = Date.now;
    Date.now = function() {
        return originalDateNow() * playbackSpeed;
    };

    // Override performance.now to simulate accelerated time
    const originalPerformanceNow = performance.now.bind(performance);
    performance.now = function() {
        return originalPerformanceNow() * playbackSpeed;
    };
})();