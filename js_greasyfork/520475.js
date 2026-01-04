// ==UserScript==
// @name         Torn Custom Race Organizer 
// @namespace    https://greasyfork.org
// @license      MIT
// @version      2.9
// @description  Debugging: Move 1-lap races with 1/2 drivers to top and highlight when new race data is loaded
// @author       yoyoYossarian and ChatGPT
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520475/Torn%20Custom%20Race%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/520475/Torn%20Custom%20Race%20Organizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[Torn Custom Race Organizer] Script is running...");

    // Function to rearrange races
    function rearrangeRaces() {
        console.log("[Torn Custom Race Organizer] Attempting to rearrange races...");

        const eventList = document.querySelector('ul.events-list');
        if (!eventList) {
            console.warn("[Torn Custom Race Organizer] No event list found.");
            return;
        }

        const races = Array.from(eventList.children);
        console.log(`[Torn Custom Race Organizer] Found ${races.length} races in the list.`);

        const priorityRaces = [];

        races.forEach((race, index) => {
            const trackElement = race.querySelector('li.track');
            const lapsElement = trackElement?.querySelector('span.laps');
            const driversElement = race.querySelector('li.drivers');

            if (trackElement && lapsElement && driversElement) {
                const laps = lapsElement.textContent.trim();
                const driverCountText = driversElement.textContent.replace(/\s+/g, ' ').trim();
                const match = driverCountText.match(/(\d+)\s*\/\s*(\d+)/);
                const currentDrivers = match ? parseInt(match[1], 10) : null;
                const maxDrivers = match ? parseInt(match[2], 10) : null;

                console.log(`[Torn Custom Race Organizer] Race ${index + 1}: Laps=${laps}, Drivers=${currentDrivers}/${maxDrivers}`);

                if (laps.includes("1 lap") && currentDrivers === 1 && maxDrivers === 2) {
                    race.style.backgroundColor = 'rgba(152, 251, 152, 0.5)'; // Highlight
                    priorityRaces.push(race);
                    console.log(`[Torn Custom Race Organizer] Highlighting and prioritizing race ${index + 1}`);
                }
            } else {
                console.warn(`[Torn Custom Race Organizer] Could not extract race info for race ${index + 1}`);
            }
        });

        if (priorityRaces.length > 0) {
            console.log(`[Torn Custom Race Organizer] Moving ${priorityRaces.length} priority races to the top.`);
            priorityRaces.forEach((race) => eventList.prepend(race));
        } else {
            console.log("[Torn Custom Race Organizer] No priority races found.");
        }

        console.log(`[Torn Custom Race Organizer] Rearrangement complete at ${new Date().toLocaleTimeString()}`);
    }

    // Function to monitor network requests for new race data
    function monitorNetworkRequests() {
        console.log("[Torn Custom Race Organizer] Monitoring network requests for race updates...");

        // Intercept XMLHttpRequests (XHR)
        const originalXHR = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function (method, url) {
            if (url.includes("loader.php?sid=racing&tab=customrace")) {
                console.log(`[Torn Custom Race Organizer] Detected XHR request for race updates: ${url}`);
                setTimeout(() => {
                    console.log("[Torn Custom Race Organizer] Running rearrangeRaces() after XHR request.");
                    rearrangeRaces();
                }, 1000); // Delay to allow Torn to update the UI
            }
            return originalXHR.apply(this, arguments);
        };

        // Intercept Fetch API calls (modern alternative to XHR)
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
            if (typeof url === "string" && url.includes("loader.php?sid=racing&tab=customrace")) {
                console.log(`[Torn Custom Race Organizer] Detected Fetch request for race updates: ${url}`);
                setTimeout(() => {
                    console.log("[Torn Custom Race Organizer] Running rearrangeRaces() after Fetch request.");
                    rearrangeRaces();
                }, 1000);
            }
            return originalFetch.apply(this, arguments);
        };
    }

    // Initial setup: Wait for the event list and monitor network requests
    function waitForElement(selector, callback) {
        console.log(`[Torn Custom Race Organizer] Waiting for ${selector} to appear...`);
        const checkInterval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(checkInterval);
                console.log(`[Torn Custom Race Organizer] Found ${selector}!`);
                callback(element);
            }
        }, 100);
    }

    waitForElement('ul.events-list', (element) => {
        console.log('[Torn Custom Race Organizer] Event list detected! Running initial sorting.');
        rearrangeRaces();
        monitorNetworkRequests();
    });

})();
