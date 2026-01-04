// ==UserScript==
// @name         ShopGoodwill Auction End Time Calculator
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Calculate and display the actual end time for auctions on ShopGoodwill
// @author       Your Name
// @match        https://shopgoodwill.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527494/ShopGoodwill%20Auction%20End%20Time%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/527494/ShopGoodwill%20Auction%20End%20Time%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script started');

    let lastUrl = location.href; // Store the initial URL

    function checkUrlChange() {
        if (location.href !== lastUrl) {
            console.log('URL changed:', location.href);
            lastUrl = location.href;
            handlePageChange();
        }
    }

    setInterval(checkUrlChange, 1000); // Check for URL changes every second

    function handlePageChange() {
        if (location.pathname.startsWith("/item/")) {
            console.log('Detected an item page, running script');
            observeDOM();
        }
    }

    function calculateEndTime(timeLeft) {
        console.log('Calculating end time for:', timeLeft);
        const now = new Date();
        const timeParts = timeLeft.split(' ');

        let days = 0, hours = 0, minutes = 0, seconds = 0;

        timeParts.forEach(part => {
            if (part.includes('d')) days = parseInt(part.replace('d', ''), 10);
            else if (part.includes('h')) hours = parseInt(part.replace('h', ''), 10);
            else if (part.includes('m')) minutes = parseInt(part.replace('m', ''), 10);
            else if (part.includes('s')) seconds = parseInt(part.replace('s', ''), 10);
        });

        // Calculate end time
        const endTime = new Date(now.getTime() +
            (days * 24 * 60 * 60 * 1000) +
            (hours * 60 * 60 * 1000) +
            (minutes * 60 * 1000) +
            (seconds * 1000)
        );

        console.log('Calculated end time:', endTime);
        return formatEndTime(endTime, days, hours, minutes, seconds);
    }

    function formatEndTime(endTime, days, hours, minutes, seconds) {
        let hour = endTime.getHours() % 12 || 12; // Convert 24h to 12h format
        let minute = endTime.getMinutes().toString().padStart(2, '0');
        let second = endTime.getSeconds().toString().padStart(2, '0');
        let period = endTime.getHours() >= 12 ? "PM" : "AM";

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        if (days > 0) {
            return `(${daysOfWeek[endTime.getDay()]} ${hour} ${period}) `;
        } else if (hours > 0 || minutes > 0) {
            return `(${hour}:${minute} ${period}) `;
        } else {
            return `(${minute}:${second}) `;
        }
    }

    function updateTimeLeftElement() {
        console.log('Updating time left element');
        let timeLeftElement = document.querySelector('.border-top > span:nth-child(1) > span:nth-child(2)') ||
                              document.querySelector('span.text-danger');

        if (timeLeftElement && !timeLeftElement.dataset.processed) {
            console.log('Time left element found:', timeLeftElement);
            const timeLeft = timeLeftElement.textContent.trim();
            console.log('Time left text:', timeLeft);

            // Calculate and append the end time once
            const endTimeText = calculateEndTime(timeLeft);
            timeLeftElement.textContent = `${timeLeft} ${endTimeText}`;
            timeLeftElement.dataset.processed = "true"; // Prevent duplicate processing
            console.log('Updated time left element:', timeLeftElement.textContent);
        } else {
            console.error('Time left element not found or already processed!');
        }
    }

    function observeDOM() {
        console.log('Starting DOM observation');
        updateTimeLeftElement(); // Run immediately

        const observer = new MutationObserver((mutations, obs) => {
            let timeLeftElement = document.querySelector('.border-top > span:nth-child(1) > span:nth-child(2)') ||
                                  document.querySelector('span.text-danger');

            if (timeLeftElement && !timeLeftElement.dataset.processed) {
                console.log('Target element found, stopping observer');
                obs.disconnect();
                updateTimeLeftElement();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    handlePageChange(); // Run once at the start

})();
