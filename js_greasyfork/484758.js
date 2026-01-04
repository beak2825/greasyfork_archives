// ==UserScript==
// @name         ApvGuessr
// @namespace    apv
// @version      0.1
// @description  apv
// @author       You
// @match		 http*://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484758/ApvGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/484758/ApvGuessr.meta.js
// ==/UserScript==

(function () {
    let lat = 0;
    let long = 0;
    let coordInfo = '';

    function convertCoords(lat, long) {
        var latResult, longResult, dmsResult;
        latResult = Math.abs(lat);
        longResult = Math.abs(long);
        dmsResult = Math.floor(latResult) + "°" + convertToMinutes(latResult % 1) + "'" + convertToSeconds(latResult % 1) + '"' + getLatDirection(lat);
        dmsResult += "+" + Math.floor(longResult) + "°" + convertToMinutes(longResult % 1) + "'" + convertToSeconds(longResult % 1) + '"' + getLongDirection(long);
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

    document.addEventListener('keydown', async function (event) {
        if (lat == 0 && long == 0) return;
        if (event.ctrlKey && event.shiftKey && event.code === 'Space') {
            window.open(`https://www.google.be/maps/search/${convertCoords(lat, long)}`);
        }
        if (event.ctrlKey && event.shiftKey && event.altKey) {
            alert(await getCoordInfo());
        }
    });
})();
