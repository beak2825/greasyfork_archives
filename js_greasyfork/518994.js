// ==UserScript==
// @name         Battle
// @namespace    http://tampermonkey.net/
// @match        *://waifugame.com/quests/*
// @match        *://waifugame.com/battle/*
// @grant        none
// @version      1.6
// @description  Enables the disabled fight buttons on quest and battle pages and modifies game functions
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518994/Battle.user.js
// @updateURL https://update.greasyfork.org/scripts/518994/Battle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable both buttons
    function enableButtons() {
        var secondaryButton = document.querySelector('button.btn.btn-secondary.btn-block.mt-4');
        if (secondaryButton) {
            secondaryButton.removeAttribute('disabled');
        }

        var primaryButton = document.querySelector('button.btn.btn-primary.btn-block.mt-4');
        if (primaryButton) {
            primaryButton.removeAttribute('disabled');
        }
    }

    // Function to handle navigation and page load events
    function handlePageLoad() {
        enableButtons();
    }

    // Modify game functions with eval
    try {
        eval(`narate = ${narate.toString().slice(0,170)}${narate.toString().slice(171)}`);
        eval(`playSequence = ${playSequence.toString().slice(0,324)}this.d /= 10;${playSequence.toString().slice(323)}`);
    } catch (error) {
        console.error('Error modifying game functions:', error);
    }

    // Listen for popstate event (back/forward navigation)
    window.addEventListener('popstate', function(event) {
        handlePageLoad();
    });

    // Listen for pageshow event (back/forward navigation)
    window.addEventListener('pageshow', function(event) {
        handlePageLoad();
    });

    // Listen for DOMContentLoaded (initial page load)
    document.addEventListener('DOMContentLoaded', handlePageLoad);

    // Trigger the function on script execution
    handlePageLoad();

})();
