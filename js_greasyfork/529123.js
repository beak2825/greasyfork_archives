// ==UserScript==
// @name         DMY Nekoweb Dates
// @namespace    http://tampermonkey.net/
// @version      2025-03-07
// @description  This script converts MDY dates on Nekoweb feed posts to DMY and adds a zero to single-digit months and days.
// @author       Sen Choi
// @match        https://nekoweb.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nekoweb.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529123/DMY%20Nekoweb%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/529123/DMY%20Nekoweb%20Dates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function reformatDate(dateString) {
        let match = dateString.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (match) {
            let month = match[1].padStart(2, '0');
            let day = match[2].padStart(2, '0');
            let year = match[3];
            return `${day}/${month}/${year}`;
        }
        return dateString;
    }

    function updateDates() {
        document.querySelectorAll('.post-date').forEach(span => {
            span.textContent = reformatDate(span.textContent);
        });
    }

    updateDates();
})();