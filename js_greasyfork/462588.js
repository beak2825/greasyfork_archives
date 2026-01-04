// ==UserScript==
// @name         Discord Timestamp with Seconds
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  This script provides users with the capability to view seconds in the timestamps of Discord messages, allows users to view the time that has elapsed since a message was sent, and enhances the date formatting.
// @author       Sam (and ChatGPT lol; yes, ChatGPT helped me with this. With the help of many others listed on the "History" section of the GreasyFork page of this script. (https://greasyfork.org/en/scripts/462588-discord-timestamp-with-seconds-and-date)
// @match        https://discord.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462588/Discord%20Timestamp%20with%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/462588/Discord%20Timestamp%20with%20Seconds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to format the timestamp with seconds in 12-hour format
    function formatTimestampWithSeconds12Hour(datetime) {
        const date = new Date(datetime);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        return `${hours}:${minutes}:${seconds} ${ampm}`;
    }

    // Function to format the timestamp with seconds in 24-hour format
    function formatTimestampWithSeconds24Hour(datetime) {
        const date = new Date(datetime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // Function to calculate the relative time
    function getRelativeTime(datetime) {
        const now = new Date();
        const date = new Date(datetime);
        const diff = now - date;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) {
            return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        } else if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (days < 7) {
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else if (weeks < 4) {
            return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        } else if (months < 12) {
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        } else {
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        }
    }

    // Function to detect if the user prefers 24-hour format
    function prefers24HourFormat() {
        const testDate = new Date(Date.UTC(2020, 0, 1, 13, 0, 0));
        const testDateString = testDate.toLocaleTimeString([], { hour: '2-digit' });
        return !testDateString.match(/AM|PM/i);
    }

    // Function to update timestamps
    function updateTimestamps() {
        const timeElements = document.querySelectorAll('time');
        const use24HourFormat = prefers24HourFormat();

        timeElements.forEach(timeElement => {
            const datetime = timeElement.getAttribute('datetime');
            if (datetime) {
                const originalLabel = timeElement.getAttribute('aria-label');
                const formattedTime = use24HourFormat
                    ? formatTimestampWithSeconds24Hour(datetime)
                    : formatTimestampWithSeconds12Hour(datetime);
                const relativeTime = getRelativeTime(datetime);

                if (timeElement.parentElement.classList.contains('timestampVisibleOnHover_f9f2ca')) {
                    // For hover timestamps, only show time without relative time
                    timeElement.textContent = formattedTime;
                    timeElement.setAttribute('aria-label', formattedTime);
                } else {
                    // For normal timestamps, preserve the original format and add relative time
                    if (!originalLabel.includes(formattedTime)) {
                        timeElement.textContent = `${originalLabel.replace(/(\d+:\d+(:\d+)?\s*[APM]{2})/, formattedTime)} (${relativeTime})`;
                        timeElement.setAttribute('aria-label', `${originalLabel.replace(/(\d+:\d+(:\d+)?\s*[APM]{2})/, formattedTime)} (${relativeTime})`);
                    } else {
                        // Update only the relative time
                        const baseLabel = originalLabel.split(' (')[0];
                        timeElement.textContent = `${baseLabel} (${relativeTime})`;
                        timeElement.setAttribute('aria-label', `${baseLabel} (${relativeTime})`);
                    }
                }
            }
        });
    }

    // Observer to monitor DOM changes
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const timeElements = node.querySelectorAll('time');
                        timeElements.forEach(timeElement => {
                            const datetime = timeElement.getAttribute('datetime');
                            const originalLabel = timeElement.getAttribute('aria-label');
                            const use24HourFormat = prefers24HourFormat();

                            if (datetime && originalLabel) {
                                const formattedTime = use24HourFormat
                                    ? formatTimestampWithSeconds24Hour(datetime)
                                    : formatTimestampWithSeconds12Hour(datetime);
                                const relativeTime = getRelativeTime(datetime);

                                if (timeElement.parentElement.classList.contains('timestampVisibleOnHover_f9f2ca')) {
                                    // For hover timestamps, only show time without relative time
                                    timeElement.textContent = formattedTime;
                                    timeElement.setAttribute('aria-label', formattedTime);
                                } else {
                                    // For normal timestamps, preserve the original format and add relative time
                                    if (!originalLabel.includes(formattedTime)) {
                                        timeElement.textContent = `${originalLabel.replace(/(\d+:\d+(:\d+)?\s*[APM]{2})/, formattedTime)} (${relativeTime})`;
                                        timeElement.setAttribute('aria-label', `${originalLabel.replace(/(\d+:\d+(:\d+)?\s*[APM]{2})/, formattedTime)} (${relativeTime})`);
                                    } else {
                                        // Update only the relative time
                                        const baseLabel = originalLabel.split(' (')[0];
                                        timeElement.textContent = `${baseLabel} (${relativeTime})`;
                                        timeElement.setAttribute('aria-label', `${baseLabel} (${relativeTime})`);
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Refresh relative times every second
    setInterval(updateTimestamps, 1000);

    // Initial timestamp update
    updateTimestamps();

})();
