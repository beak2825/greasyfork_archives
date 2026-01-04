// ==UserScript==
// @name         GeoHuntr
// @namespace    https://github.com/crunny/geohuntr/
// @version      1
// @description  A simple GeoGuessr Tool
// @author       crunny
// @match        http*://www.geoguessr.com/game/*
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright    2024+, crunny (https://github.com/crunny/)
// @homepage     https://github.com/crunny/geohuntr/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485590/GeoHuntr.user.js
// @updateURL https://update.greasyfork.org/scripts/485590/GeoHuntr.meta.js
// ==/UserScript==
// Note - You must initially refresh the page after game has loaded to enable the gui

(function () {
    let lat = 0;
    let long = 0;

    function convertCoords(lat, long) {
        const latResult = Math.abs(lat);
        const longResult = Math.abs(long);
        const dmsResult =
            Math.floor(latResult) + "°" + convertToMinutes(latResult % 1) + "'" + convertToSeconds(latResult % 1) + '"' + getLatDirection(lat) +
            "+" +
            Math.floor(longResult) + "°" + convertToMinutes(longResult % 1) + "'" + convertToSeconds(longResult % 1) + '"' + getLongDirection(long);
        return dmsResult;
    }

    function convertToMinutes(decimal) {
        return Math.floor(decimal * 60);
    }

    function convertToSeconds(decimal) {
        return (decimal * 3600 % 60).toFixed(1);
    }

    function getLatDirection(lat) {
        return lat >= 0 ? "N" : "S";
    }

    function getLongDirection(long) {
        return long >= 0 ? "E" : "W";
    }

    var originalXHR = window.XMLHttpRequest;
    var newXHR = function () {
        var xhr = new originalXHR();
        xhr.addEventListener('loadend', function () {
            if (xhr.responseURL == 'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') {
                const respObj = JSON.parse(xhr.responseText);
                lat = respObj[1][0][5][0][1][0][2];
                long = respObj[1][0][5][0][1][0][3];
            }
        });
        return xhr;
    };
    window.XMLHttpRequest = newXHR;

    async function getCoordInfo() {
        try {
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.display_name;
        } catch (error) {
            console.error('Error:', error);
            return 'Error retrieving location information';
        }
    }

    const guiButton = document.createElement('button');
    guiButton.textContent = 'GeoHuntr';
    guiButton.style.position = 'fixed';
    guiButton.style.bottom = '220px';
    guiButton.style.left = '25px';
    guiButton.style.padding = '10px 15px';
    guiButton.style.borderRadius = '10px';
    guiButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    guiButton.style.color = 'white';
    guiButton.style.fontWeight = 'bold';
    guiButton.style.fontSize = '16px';
    guiButton.style.cursor = 'help';
    guiButton.style.transition = 'background-color 0.1s';

    guiButton.addEventListener('click', function () {
        window.open(`https://www.google.be/maps/search/${convertCoords(lat, long)}`);
    });

    guiButton.addEventListener('mouseover', function () {
        guiButton.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    });

    guiButton.addEventListener('mouseout', function () {
        guiButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    });

    document.body.appendChild(guiButton);
})();
