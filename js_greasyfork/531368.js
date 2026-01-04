// ==UserScript==
// @name         Google Flights Dynamic NRW Holiday Highlight
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Dynamically highlights national holidays on Google Flights using an API.
// @license      MIT
// @match        https://www.google.com/travel/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531368/Google%20Flights%20Dynamic%20NRW%20Holiday%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/531368/Google%20Flights%20Dynamic%20NRW%20Holiday%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiURL = 'https://get.api-feiertage.de/?states=nw'; // API URL for North Rhine-Westphalia (NW)

    GM_xmlhttpRequest({
        method: "GET",
        url: apiURL,
        onload: function(response) {
            if (response.status === 200) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.status === "success" && data.feiertage) {
                        let holidayDates = data.feiertage.map(holiday => holiday.date);
                        // Filter out dates that are not within a reasonable future range (e.g., next few years)
                        const currentYear = new Date().getFullYear();
                        const futureYears = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];
                        holidayDates = holidayDates.filter(date => {
                            const year = parseInt(date.substring(0, 4));
                            return futureYears.includes(year);
                        });

                        if (holidayDates.length > 0) {
                            const selectors = holidayDates.map(date => `[data-iso="${date}"]`).join(',\n');
                            const css = `
                                ${selectors} {
                                    outline: 1px dashed #19e100;
                                    border-radius: 100px;
                                }
                            `;
                            GM_addStyle(css);
                        } else {
                            console.log("No holiday dates found in the API response for the near future.");
                        }
                    } else {
                        console.error("API response format is unexpected:", data);
                    }
                } catch (error) {
                    console.error("Error parsing API response:", error);
                }
            } else {
                console.error("Failed to fetch holiday data from the API. Status:", response.status);
            }
        },
        onerror: function(error) {
            console.error("Error during API request:", error);
        }
    });
})();