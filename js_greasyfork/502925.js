// ==UserScript==
// @name         French Republican Calendar Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert dates and times to the French Republican Calendar and Decimal Time with original date as tooltip
// @author       https://lagomor.ph
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502925/French%20Republican%20Calendar%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/502925/French%20Republican%20Calendar%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Conversion scripts
    const months = [
        "Vendémiaire", "Brumaire", "Frimaire", "Nivôse", "Pluviôse", "Ventôse", "Germinal", "Floreal", "Prairial", "Messidor", "Thermidor", "Fructidor"
    ];

    function isLeapYear(year) {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) && (year % 4000 !== 0);
    }

    function toRepublicanCalendar(year, month, day) {
        let startYear = year;
        if (month < 9 || (month === 9 && day < 22)) {
            startYear--;
        }

        const startRepublican = new Date(startYear, 8, 22);
        const currentDate = new Date(year, month - 1, day);
        let dayOfYear = Math.floor((currentDate - startRepublican) / (24 * 60 * 60 * 1000));

        if (isLeapYear(startYear)) {
            dayOfYear++;
        }

        const republicanMonth = Math.floor(dayOfYear / 30);
        const republicanDay = dayOfYear % 30 + 1;
        return { day: republicanDay, month: months[republicanMonth], year: startYear - 1791 };
    }

    function toDecimalTime(hours, minutes, seconds) {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const decimalSeconds = totalSeconds / 0.864;
        const decimalHours = Math.floor(decimalSeconds / 10000);
        const decimalMinutes = Math.floor((decimalSeconds % 10000) / 100);
        const decimalFinalSeconds = Math.floor(decimalSeconds % 100);

        return `${decimalHours}:${decimalMinutes.toString().padStart(2, '0')}:${decimalFinalSeconds.toString().padStart(2, '0')}`;
    }

    function isValidDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return !isNaN(date.getTime());
    }

    // Replace dates and times in <time> tags
    window.addEventListener('load', function() {
        const timeTags = document.getElementsByTagName('time');
        for (const timeTag of timeTags) {
            if (timeTag.dateTime && isValidDateTime(timeTag.dateTime)) {
                const originalContent = timeTag.textContent;
                const dateTime = new Date(timeTag.dateTime);
                const republicanDate = toRepublicanCalendar(dateTime.getFullYear(), dateTime.getMonth() + 1, dateTime.getDate());
                const decimalTime = toDecimalTime(dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds());
                timeTag.textContent = `${republicanDate.day} ${republicanDate.month} ${republicanDate.year} ${decimalTime}`;
                timeTag.title = originalContent; // Set the original content as tooltip
            }
        }
    });
})();