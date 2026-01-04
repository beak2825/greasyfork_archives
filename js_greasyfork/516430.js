// ==UserScript==
// @name         Stabfish.io Hack
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Stabfish.io Everything Unlocked
// @author       Only Hacker
// @match        https://stabfish.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516430/Stabfishio%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/516430/Stabfishio%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your expected data
    const expectedUnlockedBodiesData = "[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]";
    const expectedUnlockedFacesData = "[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]";
    const expectedUnlockedHatsData = "[true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]";
    const expectedUnlockedSpearsData = "[3,3,3,3,3,3]";

    // Function to compare stored data with expected data
    function checkAndInjectData() {
        let dataMismatch = false;

        // Check and inject data as necessary
        if (localStorage.getItem("unlockedBodies") !== expectedUnlockedBodiesData) {
            localStorage.setItem("unlockedBodies", expectedUnlockedBodiesData);
            dataMismatch = true;
        }
        if (localStorage.getItem("unlockedFaces") !== expectedUnlockedFacesData) {
            localStorage.setItem("unlockedFaces", expectedUnlockedFacesData);
            dataMismatch = true;
        }
        if (localStorage.getItem("unlockedHats") !== expectedUnlockedHatsData) {
            localStorage.setItem("unlockedHats", expectedUnlockedHatsData);
            dataMismatch = true;
        }
        if (localStorage.getItem("unlockedSpears") !== expectedUnlockedSpearsData) {
            localStorage.setItem("unlockedSpears", expectedUnlockedSpearsData);
            dataMismatch = true;
        }

        // Refresh the page if any data was injected or updated
        if (dataMismatch) {
            location.reload();
        }
    }

    // Call the function to check and inject data
    checkAndInjectData();
})();