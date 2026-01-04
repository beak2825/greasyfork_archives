// ==UserScript==
// @name         Add UoE Pleasance Online Booking Confirmation to Outlook Calendar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add event to Outlook Calendar based on receipt information
// @author       You
// @match        https://www.sport.ed.ac.uk/online-booking-payment/Receipt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478646/Add%20UoE%20Pleasance%20Online%20Booking%20Confirmation%20to%20Outlook%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/478646/Add%20UoE%20Pleasance%20Online%20Booking%20Confirmation%20to%20Outlook%20Calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // Extracting information from the receipt
        const className = document.querySelector('.ActivityField .small').childNodes[2].textContent.trim();
        const dateText = document.querySelector('.Date p').textContent.trim();
        const time = document.querySelector('.Time p').textContent.trim();
        const duration = document.querySelector('.Duration p').textContent.trim();

        // Parsing the date string assuming DD/MM/YYYY format
        const [day, month, year] = dateText.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        // Parsing the time and duration
        const [hours, minutes] = time.split(':').map(Number);
        date.setHours(hours, minutes);
        const durationMinutes = parseInt(duration.split(' ')[0]);
        const endDateTime = new Date(date.getTime() + durationMinutes * 60000);

        // Formatting dates to UTC string
        const start = date.toISOString().replace(/\.\d{3}Z$/, 'Z'); // Removing milliseconds
        const end = endDateTime.toISOString().replace(/\.\d{3}Z$/, 'Z'); // Removing milliseconds

        // Generating the Outlook Calendar link
        const subject = encodeURIComponent(`Class: ${className}`);
        const outlookLink = `https://outlook.live.com/calendar/0/action/compose/?rru=addevent&startdt=${start}&enddt=${end}&subject=${subject}`;

        // Creating a link element
        const link = document.createElement('a');
        link.href = outlookLink;
        link.textContent = 'Add to Outlook Calendar';
        link.target = '_blank';

        // Appending the link to the receipt div
        const receiptDiv = document.getElementById('receipt');
        receiptDiv.appendChild(link)

})();
