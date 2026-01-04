// ==UserScript==
// @name         Nyaa Timestamp 12-Hour Format
// @namespace    https://nyaa.si/
// @version      1.0
// @description  Converts Nyaa.si torrent timestamps from 24-hour to 12-hour format
// @icon         https://nyaa.si/static/favicon.png
// @author       MDTI
// @match        https://nyaa.si/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544306/Nyaa%20Timestamp%2012-Hour%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/544306/Nyaa%20Timestamp%2012-Hour%20Format.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function convertTo12Hour(time24) {
        const [date, time] = time24.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${date} ${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    function updateTimestamps() {
        const tdElements = document.querySelectorAll('td.text-center');

        tdElements.forEach(td => {
            const text = td.textContent.trim();
            if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(text)) {
                td.textContent = convertTo12Hour(text);
            }
        });
    }

    updateTimestamps();

    const observer = new MutationObserver(updateTimestamps);
    observer.observe(document.body, { childList: true, subtree: true });
})();
