// ==UserScript==
// @name         OpenWeatherMap JSON Formatter
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Improve the readability of JSON data from OpenWeatherMap API
// @author       chaoscreater
// @match        https://api.openweathermap.org/data/2.5/forecast?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485789/OpenWeatherMap%20JSON%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/485789/OpenWeatherMap%20JSON%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert Unix timestamp to NZDT
    function convertToNZDT(unixTimestamp) {
        const nzdtOffset = 13 * 60 * 60 * 1000; // NZDT is UTC+13
        const date = new Date(unixTimestamp * 1000 + nzdtOffset);
        return date.toISOString().replace('T', ' ').replace('.000Z', '');
    }

    // Function to convert Unix timestamp to NZDT with AM/PM and determine if it's TODAY or TOMORROW
    function convertToNZDTWithAMPM(unixTimestamp) {
        const nzdtOffset = 13 * 60 * 60 * 1000; // NZDT is UTC+13
        const date = new Date(unixTimestamp * 1000);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true // Use 12-hour time format with AM/PM
        };
        const nzdtTime = date.toLocaleString('en-NZ', options).toUpperCase();

        // Determine if it's TODAY or TOMORROW
        const today = new Date();
        const todayOrTomorrow = date.getDate() === today.getDate() ? 'TODAY' : date.getDate() === today.getDate() + 1 ? 'TOMORROW' : '';

        return { nzdtTimeWithAMPM: nzdtTime, todayOrTomorrow: todayOrTomorrow };
    }

    // Check if the content type is JSON
    if (document.contentType === "application/json" || document.contentType === "text/plain") {
        // Parse the JSON
        let rawData = document.body.textContent;
        let jsonData = JSON.parse(rawData);

        // Check if jsonData contains a list array
        if (jsonData && jsonData.list && Array.isArray(jsonData.list)) {

            // Append a separator property and modify dt and dt_txt to include NZDT with AM/PM and TODAY/TOMORROW
            jsonData.list = jsonData.list.map(item => {
                const nzdtTime = convertToNZDT(item.dt);
                const { nzdtTimeWithAMPM, todayOrTomorrow } = convertToNZDTWithAMPM(item.dt);

                // Convert "pop" to a percentage in parentheses
                const popPercentage = (item.pop * 100).toFixed(2) + " %";

                return {
                    ...item,
                    dt: item.dt + ' --- (' + nzdtTime + ' NZDT) --- (' + nzdtTimeWithAMPM + ' NZDT) --- ' + '(' + todayOrTomorrow + ')',
                    dt_txt: item.dt_txt + ' --- (' + nzdtTime + ' NZDT) --- (' + nzdtTimeWithAMPM + ' NZDT) --- ' + '(' + todayOrTomorrow + ')',
                    pop: item.pop + ' --- (' + popPercentage + ')',
                    _separator: '------------------------------------------------------------------------------------------------'
                };
            });
        }

        // Convert the JSON to a formatted string
        let formattedJSON = JSON.stringify(jsonData, null, 2);

        // Replace the braces after the separator with the separator itself
        formattedJSON = formattedJSON.replace(/"_separator": ""/g, '------------------------------------------------------------------------------------------------');

        // Create a container to display formatted JSON
        let container = document.createElement('pre');
        container.style = "overflow-wrap: break-word; white-space: pre-wrap; background-color: black; padding: 10px; border-radius: 5px; color: white;";

        // Set the formatted JSON
        container.textContent = formattedJSON;

        // Clear the body and append the formatted JSON
        document.body.innerHTML = '';
        document.body.appendChild(container);
    }

})();
