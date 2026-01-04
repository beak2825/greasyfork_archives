// ==UserScript==
// @name         New Item Market Sale Event Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Notify when a new event appears in the Item Market within the last 5 minutes
// @author       Kwyy [2054]
// @license      MIT
// @match        https://cartelempire.online/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      cartelempire.online
// @downloadURL https://update.greasyfork.org/scripts/525797/New%20Item%20Market%20Sale%20Event%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/525797/New%20Item%20Market%20Sale%20Event%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurable API endpoint and interval
    const API_KEY = "APIKEYHERE";
    const API_URL = `https://cartelempire.online/api/user?type=events&category=Item%20Market&key=${API_KEY}`;
    const PROPERTY_PAGE_URL = "https://cartelempire.online/Property";
    const CHECK_INTERVAL = 2 * 1000; // 2 seconds in milliseconds
    const TIME_WINDOW = 10 * 1000; // 10 seconds in milliseconds

    // Keep track of the latest event timestamp to avoid duplicate notifications
    let lastEventTimestamp = parseInt(localStorage.getItem('lastEventTimestamp'), 10) || 0;
    let notifiedEvents = new Set(); // Track notified event IDs or timestamps

    function checkForNewEvents() {
        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (data && Array.isArray(data.events)) {
                        const now = Date.now();

                        // Find the most recent event
                        const recentEvent = data.events.find(event => {
                            const eventTime = event.created * 1000; // Convert to milliseconds
                            return eventTime > lastEventTimestamp && (now - eventTime <= TIME_WINDOW);
                        });

                        if (recentEvent) {
                            lastEventTimestamp = recentEvent.created * 1000;
                                localStorage.setItem('lastEventTimestamp', lastEventTimestamp); // Update last seen timestamp
                            if (!notifiedEvents.has(recentEvent.created)) {
                                const strippedDescription = recentEvent.description.replace(/<[^>]*>/g, ''); // Strip HTML tags
                                notifyUser(strippedDescription);
                                notifiedEvents.add(recentEvent.created);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error parsing API response:", error);
                }
            },
            onerror: function(error) {
                console.error("Error fetching API data:", error);
            }
        });
    }

    function notifyUser(description) {
        GM_notification({
            title: "New Item Market Event",
            text: description || "A new event has been detected! Click to view.",
            onclick: function() {
                window.open(PROPERTY_PAGE_URL, "_blank");
            }
        });
    }

    // Start the interval to check for new events
    setInterval(checkForNewEvents, CHECK_INTERVAL);
})();