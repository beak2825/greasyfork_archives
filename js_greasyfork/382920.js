// ==UserScript==
// @name         Brewness color indicator extension
// @namespace    https://brewness.com/
// @version      1.0.1
// @description  Adds EBC to the beer color indicator, fixes text color for low SRM/EBC values.
// @author       Jonasz
// @match        https://brewness.com/*/recipe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382920/Brewness%20color%20indicator%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/382920/Brewness%20color%20indicator%20extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var srmProgress = null;
    var findSrmProgressInterval = setInterval(function() {
        srmProgress = document.getElementById('srm-progress');
        if (srmProgress !== undefined) {
            clearInterval(findSrmProgressInterval);
        }
    }, 1000);
    setInterval(function() {
        if (srmProgress && !srmProgress.innerText.includes('EBC')) {
            var srm = parseFloat(srmProgress.innerText);
            var ebc = Number(srm * 1.97).toFixed(1);
            srmProgress.innerText += ' / ' + ebc + ' EBC';
            if (srm < 5) {
                srmProgress.style.color = '#000000';
            } else {
                srmProgress.style.color = '#ffffff';
            }
        }
    }, 1000);
})();