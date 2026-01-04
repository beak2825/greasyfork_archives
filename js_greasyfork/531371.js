// ==UserScript==
// @name         Google Flights School NRW Holiday
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlights school holidays on Google Flights using an API.
// @license MIT
// @match        https://www.google.com/travel/flights*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531371/Google%20Flights%20School%20NRW%20Holiday.user.js
// @updateURL https://update.greasyfork.org/scripts/531371/Google%20Flights%20School%20NRW%20Holiday.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiURL = 'https://ferien-api.de/api/v1/holidays/NW'; // API URL for North Rhine-Westphalia (NW)

    function getDatesInRange(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            dates.push(`${year}-${month}-${day}`);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: apiURL,
        onload: function(response) {
            if (response.status === 200) {
                try {
                    const holidays = JSON.parse(response.responseText);
                    let schoolHolidayDates = [];

                    const currentYear = new Date().getFullYear();
                    const futureYears = [currentYear, currentYear + 1, currentYear + 2];

                    holidays.forEach(holiday => {
                        const startYear = parseInt(holiday.start.substring(0, 4));
                        if (futureYears.includes(startYear)) {
                            const dates = getDatesInRange(holiday.start, holiday.end);
                            schoolHolidayDates.push(...dates);
                        }
                    });

                    if (schoolHolidayDates.length > 0) {
                        const uniqueSchoolHolidayDates = [...new Set(schoolHolidayDates)]; // Remove duplicates
                        const selectors = uniqueSchoolHolidayDates.map(date => `[data-iso="${date}"]`).join(',\n');
                        const css = `
                            ${selectors} {
                               background-color: rgb(255 0 0 / 15%);
                            }
                        `;
                        GM_addStyle(css);
                    } else {
                        console.log("No school holiday dates found in the API response for the near future.");
                    }

                } catch (error) {
                    console.error("Error parsing API response:", error);
                }
            } else {
                console.error("Failed to fetch school holiday data from the API. Status:", response.status);
            }
        },
        onerror: function(error) {
            console.error("Error during API request:", error);
        }
    });
})();