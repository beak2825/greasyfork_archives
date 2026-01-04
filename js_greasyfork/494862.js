// ==UserScript==
// @name         Redirect Bing Maps to Google Maps
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically redirect Bing Maps to Google Maps
// @author       Your Name
// @match        https://www.bing.com/maps*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494862/Redirect%20Bing%20Maps%20to%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/494862/Redirect%20Bing%20Maps%20to%20Google%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the query parameters from the Bing Maps URL
    function getBingMapQuery() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || params.get('where') || params.get('ss') || '';
        return query;
    }

    // Redirect to Google Maps with the extracted query
    function redirectToGoogleMaps() {
        const query = getBingMapQuery();
        if (query) {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            window.location.replace(googleMapsUrl);
        }
    }

    // Execute the redirection function
    redirectToGoogleMaps();
})();
