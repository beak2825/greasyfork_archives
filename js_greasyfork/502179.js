// ==UserScript==
// @name         Date Display Full Timestamp for jpg4.su / jpg5.su / JPG Fish / imgbb.com / ibb.co
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Replace relative time with actual date from title attribute on jpg4.su / jpg5.su / jpg6.su / JPG Fish / imgbb.com / ibb.co
// @match        https://jpg4.su/*
// @match        https://jpg5.su/*
// @match        https://jpg6.su/*
// @match        https://imgbb.com/*
// @match        https://ibb.co/*
// @grant        none
// @author       Aligator
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502179/Date%20Display%20Full%20Timestamp%20for%20jpg4su%20%20jpg5su%20%20JPG%20Fish%20%20imgbbcom%20%20ibbco.user.js
// @updateURL https://update.greasyfork.org/scripts/502179/Date%20Display%20Full%20Timestamp%20for%20jpg4su%20%20jpg5su%20%20JPG%20Fish%20%20imgbbcom%20%20ibbco.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateDateDisplay() {
        const elements = document.querySelectorAll('.description-meta');
        elements.forEach(element => {
            const span = element.querySelector('span[title]');
            if (span && span.title) {
                span.textContent = span.title;
            }
        });
    }

    // Run the function when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateDateDisplay);
    } else {
        updateDateDisplay();
    }

    // Run the function periodically in case of dynamic content loading
    setInterval(updateDateDisplay, 5000);
})();