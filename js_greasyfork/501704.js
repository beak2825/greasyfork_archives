// ==UserScript==
// @name         No Google Maps Crap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes google maps crap replacing it with OSM
// @author       Anonim
// @match        https://*.google.com/maps/*
// @match        https://maps.google.com/*
// @match        https://maps.app.goo.gl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501704/No%20Google%20Maps%20Crap.user.js
// @updateURL https://update.greasyfork.org/scripts/501704/No%20Google%20Maps%20Crap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Display "redirecting..." message
    document.documentElement.innerHTML = '<html><body><h1>Redirecting...</h1></body></html>';

    // Redirect to OpenStreetMap
    function redirectToOSM(url) {
        setTimeout(() => {
            window.location.replace(url);
        }, 1000); // Delay to reduce bugs
    }

    // Parser
    function getQueryParams(url) {
        let params = {};
        let parser = new URL(url);
        parser.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

    // Check for Crap Maps with coordinates in the query string
    if (window.location.href.includes("maps.google.com") || window.location.href.includes("maps.app.goo.gl")) {
        const params = getQueryParams(window.location.href);
        if (params.q) {
            const [lat, lon] = params.q.split(',');
            const osmUrl = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
            redirectToOSM(osmUrl);
        }
    }

    // Check for crappy Maps place link
    if (window.location.href.includes("/maps/place/")) {
        const match = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
            const lat = match[1];
            const lon = match[2];
            const osmUrl = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
            redirectToOSM(osmUrl);
        }
    }

    // Check for shitty Maps short links (maps.app.goo.gl)
    if (window.location.href.includes("maps.app.goo.gl")) {
        // As short links redirect to longer URLs, set an interval to handle redirection after the URL changes
        const interval = setInterval(() => {
            const match = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                clearInterval(interval);
                const lat = match[1];
                const lon = match[2];
                const osmUrl = `https://www.openstreetmap.org/#map=18/${lat}/${lon}`;
                redirectToOSM(osmUrl);
            }
        }, 500);
    }
})();
