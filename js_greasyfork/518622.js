// ==UserScript==
// @name         Google Maps Coordinates Copy
// @namespace    http://rant.li/boson
// @version      1.2
// @description  Monitor Google Maps for requests and copy formatted coordinates to four decimal places wherever you click on page
// @author       Boson
// @match        https://www.google.com/maps/*
// @grant        GM_setClipboard
// @license      GNU AGPLv3

// @downloadURL https://update.greasyfork.org/scripts/518622/Google%20Maps%20Coordinates%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/518622/Google%20Maps%20Coordinates%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    function extractCoordinates(url) {
        const regex = /!([23])d([-+]?\d+\.\d+)!([34])d([-+]?\d+\.\d+)/g;
        let match;
        let lastMatch = null;
        while ((match = regex.exec(url)) !== null) {
            lastMatch = match;
        }
        if (lastMatch) {
            let latitude, longitude;
            if (lastMatch[1] === '3') {
                latitude = parseFloat(lastMatch[2]);
                longitude = parseFloat(lastMatch[4]);
            } else {
                latitude = parseFloat(lastMatch[4]);
                longitude = parseFloat(lastMatch[2]);
            }
            latitude = latitude.toFixed(4);
            longitude = longitude.toFixed(4);
            return `${latitude}, ${longitude}`;
        }
        return null;
    }

    function copyCoordinates(coordinates) {
        if (coordinates) {
            GM_setClipboard(coordinates);
        }
    }

    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                const coordinates = extractCoordinates(url);
                copyCoordinates(coordinates);
            });
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

})();
