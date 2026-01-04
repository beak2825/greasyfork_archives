// ==UserScript==
// @name         OpenStreetMap to Google Maps
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add button to redirect to Google Maps from OpenStreetMap and allow dragging
// @author       Aoi
// @match        https://www.openstreetmap.org/edit*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/494747/OpenStreetMap%20to%20Google%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/494747/OpenStreetMap%20to%20Google%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve button position from storage or set default
    var buttonX = GM_getValue('buttonX', '50%');
    var buttonY = GM_getValue('buttonY', '20px');

    // Create button element
    var googleMapsButton = document.createElement('button');
    googleMapsButton.textContent = 'View on Google Maps';
    googleMapsButton.style.position = 'fixed';
    googleMapsButton.style.left = buttonX;
    googleMapsButton.style.top = buttonY;
    googleMapsButton.style.zIndex = '9999';
    googleMapsButton.style.cursor = 'move';
    googleMapsButton.style.padding = '10px';
    googleMapsButton.style.backgroundColor = '#fff';
    googleMapsButton.style.border = '1px solid #000';
    googleMapsButton.style.borderRadius = '5px';

    // Function to handle button drag
    function handleDrag(event) {
        event.preventDefault();
        var offsetX = event.clientX - startX;
        var offsetY = event.clientY - startY;
        var newX = buttonStartX + offsetX;
        var newY = buttonStartY + offsetY;
        googleMapsButton.style.left = newX + 'px';
        googleMapsButton.style.top = newY + 'px';
        GM_setValue('buttonX', newX + 'px');
        GM_setValue('buttonY', newY + 'px');
    }

    // Function to handle mouse release
    function handleRelease(event) {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleRelease);
    }

    // Variables to track mouse movement
    var startX, startY, buttonStartX, buttonStartY;

    // Event listener for mouse down on the button
    googleMapsButton.addEventListener('mousedown', function(event) {
        event.preventDefault();
        startX = event.clientX;
        startY = event.clientY;
        buttonStartX = googleMapsButton.offsetLeft;
        buttonStartY = googleMapsButton.offsetTop;
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleRelease);
    });

    // Event listener for button click
    googleMapsButton.addEventListener('click', function() {
        // Get the latitude, longitude, and zoom from the URL
        var url = window.location.href;
        var matches = url.match(/#map=(\d+)\/([-\d.]+)\/([-\d.]+)/);
        if (matches && matches.length >= 4) {
            var zoom = matches[1];
            var lat = matches[2];
            var lon = matches[3];

            // Construct the Google Maps URL and open in new tab
            var googleMapsURL = `https://www.google.com/maps/@${lat},${lon},${zoom}z`;
            window.open(googleMapsURL, '_blank');
        }
    });

    // Append button to the document body
    document.body.appendChild(googleMapsButton);
})();
