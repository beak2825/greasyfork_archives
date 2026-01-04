// ==UserScript==
// @name        No Overdues!
// @namespace   Violentmonkey Scripts
// @match       https://www.myedio.com/*
// @license     CC BY-NC
// @grant       none
// @version     1.1
// @author      Unknown Hacker
// @description Being Submitted...
// @downloadURL https://update.greasyfork.org/scripts/521168/No%20Overdues%21.user.js
// @updateURL https://update.greasyfork.org/scripts/521168/No%20Overdues%21.meta.js
// ==/UserScript==

/*
  _   _          ___                    _                   _
 | \ | | ___    / _ \__   _____ _ __ __| |_   _  ___  ___  | |
 |  \| |/ _ \  | | | \ \ / / _ \ '__/ _` | | | |/ _ \/ __| | |
 | |\  | (_) | | |_| |\ V /  __/ | | (_| | |_| |  __/\__ \ |_|
 |_| \_|\___/   \___/  \_/ \___|_|  \__,_|\__,_|\___||___/ (_)
*/

(function() {
    'use strict';

      // === User Configurable Settings ===


// Set this to true to enable console logging, or false to disable it.
    const enableLogging = true;

    // === End Of Configurable Settings ===

    function logScriptEnabled() {
        if (enableLogging) { // Only log if logging is enabled
            const logStyle = [
                'color: white',
                'background: linear-gradient(90deg, #ff5722, #ff9800)',
                'padding: 10px',
                'border-radius: 5px',
                'font-size: 16px',
                'font-weight: bold'
            ].join(';');

            console.log('%cScript Enabled: There are no set keys to disable.', logStyle);
        }
    }

    function removeElementsAndChangeText() {
        const calendarElements = document.querySelectorAll('.c-calendar-list-accordion');
        calendarElements.forEach(element => element.remove());

        const mediumSmallElements = document.querySelectorAll('.-mediumsmall.-neutral-darkest');
        mediumSmallElements.forEach(element => element.remove());

        const overdueElements = document.querySelectorAll('.-overdue');
        overdueElements.forEach(element => element.remove());

        const warningOverduesElements = document.querySelectorAll('.c-tag.-warning.-status-warning');
        warningOverduesElements.forEach(element => element.remove());

        const tagElements = document.querySelectorAll('.c-tag.-neutral-lightest');
        tagElements.forEach(tag => {
            tag.textContent = '0 OVERDUE';
        });
    }

    logScriptEnabled();
    setInterval(removeElementsAndChangeText, 10);

})();
