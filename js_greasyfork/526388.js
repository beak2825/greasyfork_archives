// ==UserScript==
// @name         BBDC Booking Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhance BBDC booking experience with mobile and desktop notifications, logging
// @author       You
// @match        https://booking.bbdc.sg/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526388/BBDC%20Booking%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/526388/BBDC%20Booking%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptActive = true; // Control variable to terminate script
    const AUTO_REFRESH_ENABLED = true; // Control variable to enable/disable auto-refresh
    const REFRESH_INTERVAL = 20000; // Interval for auto-refresh in milliseconds
    const NAVIGATION_DELAY = 5000; // Delay between navigating from one month to the next in milliseconds

    const TARGET_MONTH = "Aug 2025"; // Change this value to target a different month
    const PUSHOVER_USER_KEY = 'u3bnjwsu5poeavbh5m8gj83zp7bpvs'; // Replace with your Pushover User Key
    const PUSHOVER_API_TOKEN = 'abeus1pekibf3ypzc9bpisvr9mj9s7'; // Replace with your Pushover API Token
    const NOTIFICATIONS_ENABLED = true; // Toggle notifications on/off
    const DESKTOP_NOTIFICATIONS_ENABLED = true; // Toggle desktop notifications on/off

    // Request notification permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Function to trigger desktop notification
    function triggerDesktopNotification(message) {
        if (DESKTOP_NOTIFICATIONS_ENABLED && Notification.permission === "granted") {
            new Notification("BBDC Booking Helper", {
                body: message,
                icon: "https://www.bbdc.sg/favicon.ico"
            });
        }
    }

    // Function to send a Pushover notification
    function sendNotification(message) {
        if (!NOTIFICATIONS_ENABLED || !scriptActive) return;

        fetch('https://api.pushover.net/1/messages.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: PUSHOVER_API_TOKEN,
                user: PUSHOVER_USER_KEY,
                message: message
            })
        }).then(response => {
            if (response.ok) {
                console.log('Notification sent successfully!');
            } else {
                console.error('Failed to send notification.');
            }
        });

        triggerDesktopNotification(message);
    }

    // Function to log available dates to localStorage (appending new entries)
    function logToLocalStorage(availableDays) {
        if (!scriptActive) return;

        const timestamp = new Date().toLocaleString();
        const logData = `Time: ${timestamp}, Month: ${TARGET_MONTH}, Available Days: ${availableDays.join(', ')}\n`;

        const existingLogs = localStorage.getItem('available_slots_log') || '';
        const updatedLogs = existingLogs + logData;
        localStorage.setItem('available_slots_log', updatedLogs);

        console.log('Log updated in localStorage.');
    }

    // Function to download the log file
    function downloadLogFile() {
        const logs = localStorage.getItem('available_slots_log') || '';
        const blob = new Blob([logs], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'available_slots_log.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to clear the stored logs
    function clearLogs() {
        localStorage.removeItem('available_slots_log');
        console.log('Logs cleared from localStorage.');
    }

    // Add buttons to the page
    function addButtons() {
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Logs';
        downloadButton.style.position = 'fixed';
        downloadButton.style.top = '10px';
        downloadButton.style.right = '10px';
        downloadButton.style.zIndex = 1000;
        downloadButton.addEventListener('click', downloadLogFile);
        document.body.appendChild(downloadButton);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Logs';
        clearButton.style.position = 'fixed';
        clearButton.style.top = '40px';
        clearButton.style.right = '10px';
        clearButton.style.zIndex = 1000;
        clearButton.addEventListener('click', clearLogs);
        document.body.appendChild(clearButton);
    }

    // Utility function to poll for an element
    function waitForElement(selectorFn, callback, interval = 500, timeout = 10000) {
        const startTime = Date.now();
        const timer = setInterval(() => {
            if (!scriptActive) {
                clearInterval(timer);
                return;
            }
            const element = selectorFn();
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.log(`Timeout: Element not found for selector.`);
            }
        }, interval);
    }

    // Utility function to wait for a specific URL
    function waitForUrl(targetUrl, callback, interval = 500) {
        const timer = setInterval(() => {
            if (!scriptActive) {
                clearInterval(timer);
                return;
            }
            if (window.location.href.startsWith(targetUrl)) {
                clearInterval(timer);
                callback();
            }
        }, interval);
    }

    // Function to refresh the page after a fixed interval
    function autoRefreshPage() {
        if (!scriptActive || !AUTO_REFRESH_ENABLED) return;

        console.log(`Next refresh in ${REFRESH_INTERVAL / 1000} seconds.`);
        setTimeout(() => {
            if (scriptActive) location.reload();
        }, REFRESH_INTERVAL);
    }

    // Function to navigate to the target month
    function navigateToTargetMonth() {
        if (!scriptActive) return;

        waitForElement(
            () => document.querySelector('button.mdi-chevron-right'),
            (rightButton) => {
                const timer = setInterval(() => {
                    if (!scriptActive) {
                        clearInterval(timer);
                        return;
                    }
                    const currentMonth = document.querySelector('div.calendar-row span');
                    if (currentMonth && currentMonth.textContent.trim() === TARGET_MONTH) {
                        clearInterval(timer);
                        console.log(`Reached target month: ${TARGET_MONTH}`);
                        analyzeDaysInMonth();
                        autoRefreshPage();
                    } else {
                        rightButton.click();
                        console.log('Navigating to the next month...');
                    }
                }, NAVIGATION_DELAY); // Delay between clicks
            }
        );
    }

    // Function to analyze days in the target month
    function analyzeDaysInMonth() {
        if (!scriptActive) return;

        waitForElement(
            () => document.querySelectorAll('.v-calendar-weekly__day-label span'),
            () => {
                const unavailableDays = [];
                const availableDays = [];
                const availableButtons = [];

                document.querySelectorAll('.v-calendar-weekly__day').forEach(day => {
                    const dayNumber = day.querySelector('.v-calendar-weekly__day-label span');
                    const button = day.querySelector('button');

                    if (dayNumber) {
                        const dayText = dayNumber.textContent.trim();

                        if (button) {
                            availableDays.push(dayText); // Available days
                            availableButtons.push(button); // Store the button for clicking
                        } else {
                            unavailableDays.push(dayText); // Unavailable days
                        }
                    }
                });

                console.log(`Unavailable days (gray): ${unavailableDays.join(', ')}`);
                console.log(`Available days (blue): ${availableDays.join(', ')}`);

                if (availableDays.length > 0) {
                    sendNotification(`Available slots found in ${TARGET_MONTH}: ${availableDays.join(', ')}`);
                    logToLocalStorage(availableDays);

                    // Click on the first available day
                    if (availableButtons.length > 0) {
                        availableButtons[0].click();
                        console.log(`Clicked on the first available day: ${availableDays[0]}`);

                        // Wait for session slots to load and click the first visible one
                        waitForElement(
                            () => Array.from(document.querySelectorAll('.sessionCard')).find(session => session.offsetParent !== null),
                            (session) => {
                                if (session) {
                                    session.click();
                                    console.log('Clicked on the first visible available session.');
                                    if (!AUTO_REFRESH_ENABLED) {
                                        scriptActive = false; // Stop the script if auto-refresh is disabled
                                    }
                                }
                            }
                        );
                    }
                }
            }
        );
    }

    // Wait for the DOM to fully load
    window.addEventListener('load', () => {
        console.log('BBDC Booking Helper Loaded');

        if (!scriptActive) return;

        function isOnHomePage() {
            return window.location.href === 'https://booking.bbdc.sg/#/home/index';
        }

        // Function to check if on the practical booking page
        function isOnPracticalBookingPage() {
            return window.location.href === 'https://booking.bbdc.sg/#/booking/practical';
        }

        function isOnChooseSlotPage() {
            return window.location.href.startsWith('https://booking.bbdc.sg/#/booking/chooseSlot');
        }

        // Function to simulate click on the "Booking" button
        function clickBookingButton() {
            waitForElement(
                () => [...document.querySelectorAll('.v-list-item__title')].find(el => el.textContent.trim() === 'Booking'),
                (bookingButton) => {
                    bookingButton.click();
                    console.log('Booking button clicked.');
                    clickPracticalButton();
                }
            );
        }

        // Function to simulate click on the "Practical" button
        function clickPracticalButton() {
            waitForElement(
                () => [...document.querySelectorAll('.v-list-item__title')].find(el => el.textContent.trim() === 'Practical'),
                (practicalButton) => {
                    practicalButton.click();
                    console.log('Practical button clicked.');
                    checkPracticalBookingPage();
                }
            );
        }

        // Function to confirm if the practical booking page has loaded
        function checkPracticalBookingPage() {
            const timer = setInterval(() => {
                if (isOnPracticalBookingPage()) {
                    clearInterval(timer);
                    console.log('You are on the Practical Booking page.');
                    clickBookSlotButton();
                }
            }, 500);
        }

        // Function to simulate click on the "Book Slot" button
        function clickBookSlotButton() {
            waitForElement(
                () => [...document.querySelectorAll('.v-btn__content')].find(el => el.textContent.trim() === 'Book Slot'),
                (bookSlotButton) => {
                    bookSlotButton.click();
                    console.log('Book Slot button clicked.');
                    selectInstructorAndClickNext();
                }
            );
        }

        // Function to select "Book without fixed instructor" and click "Next"
        function selectInstructorAndClickNext() {
            waitForElement(
                () => [...document.querySelectorAll('.v-label')].find(el => el.textContent.trim() === 'Book without fixed instructor'),
                (withoutFixedInstructor) => {
                    withoutFixedInstructor.click();
                    console.log('Selected "Book without fixed instructor".');

                    waitForElement(
                        () => [...document.querySelectorAll('.v-btn__content')].find(el => el.textContent.trim() === 'NEXT'),
                        (nextButton) => {
                            nextButton.click();
                            console.log('Next button clicked.');

                            waitForUrl('https://booking.bbdc.sg/#/booking/chooseSlot', navigateToTargetMonth);
                        }
                    );
                }
            );
        }

        if (isOnHomePage()) {
            console.log('You are on the BBDC home page.');
            clickBookingButton()
        } else if (isOnChooseSlotPage()) {
            console.log('You are on the Choose Slot page.');
            navigateToTargetMonth();
        } else {
            console.log('You are not on the BBDC home page.');
        }

        // Add the buttons to the page
        addButtons();
    });
})();