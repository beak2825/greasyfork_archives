// ==UserScript==
// @name         OpenWeatherMap JSON Formatter (table)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Improve the readability of JSON data from OpenWeatherMap API
// @author       chaoscreater
// @match        https://api.openweathermap.org/data/2.5/forecast?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486301/OpenWeatherMap%20JSON%20Formatter%20%28table%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486301/OpenWeatherMap%20JSON%20Formatter%20%28table%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to parse JSON from the <pre> tag
    function parseJSONFromPreTag() {
        const preTag = document.querySelector('pre');
        if (preTag) {
            return JSON.parse(preTag.innerText);
        }
        return null;
    }

    // Function to convert temperature from Kelvin to Celsius
    function kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }

    // Function to create a table from JSON data
    function createTableFromJSON(jsonData) {
        let table = '<table border="1" style="border-collapse: collapse; width: 62%;">';
        table += '<tr><th>Date and Time</th><th>Weather</th><th>Probability of Precipitation (%)</th><th>Temperature (°C)</th><th>Cloudiness (%)</th><th>Wind Speed (m/s)</th></tr>';

        jsonData.list.forEach(item => {
            table += `<tr>
                        <td>${item.dt_txt}</td>
                        <td>${item.weather.map(w => w.main).join(', ')}</td>
                        <td>${(parseFloat(item.pop) * 100).toFixed(2)} %</td> <!-- Updated this line -->
                        <td>${kelvinToCelsius(item.main.temp).toFixed(2)} C</td>
                        <td>${item.clouds.all} %</td>
                        <td>${item.wind.speed} m/s</td>
                      </tr>`;
        });

        table += '</table>';
        return table;
    }


    // Parse the JSON data
    const jsonData = parseJSONFromPreTag();

    // Check if jsonData is valid and has a list array
    if (jsonData && jsonData.list) {
        // Create a table from JSON data
        const tableHTML = createTableFromJSON(jsonData);

        // Create a new container for the table
        const container = document.createElement('div');
        container.innerHTML = tableHTML;

        // Replace the <pre> tag with the new table
        const preTag = document.querySelector('pre');
        if (preTag) {
            preTag.parentNode.replaceChild(container, preTag);
        }
    }
})();
