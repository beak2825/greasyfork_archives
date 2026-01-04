// ==UserScript==
// @name         pvp master
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  let your pvp better--jk:D||press "F" when pvp||copy by Advanced zoom->https://update.greasyfork.org/scripts/493029/Advanced%20zoom.user.js
// @author       You
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496989/pvp%20master.user.js
// @updateURL https://update.greasyfork.org/scripts/496989/pvp%20master.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define constants for zoom levels and increment
    const minZoom = -100; // 100%
    const maxZoom = -100; // 500% (adjusted maximum zoom)
    const zoomIncrement = 20; // 20% (increased for faster zooming)

    // Initial zoom level
    let zoomLevel = -100; // 100%

    // Function to smoothly zoom the canvas
    function zoomCanvas(zoom) {
        const canvas = document.querySelector('canvas');

        if (!canvas) {
            console.error('Canvas not found.');
            return;
        }

        // Calculate the new zoom level within the allowed range
        zoomLevel = Math.min(Math.max(zoomLevel + zoom, minZoom), maxZoom);

        // Apply the zoom transformation with a smooth transition
        canvas.style.transition = 'transform 0.5s ease';
        canvas.style.transform = `scale(${zoomLevel / 100})`;
    }
    // Function to handle zooming when 'F' key is pressed
    function handleZoom(event) {
        if (event.key === 'f' || event.key === 'F') {
            if (event.type === 'keydown') {
                // Zoom in when 'F' key is pressed
                zoomCanvas(zoomIncrement);
            } else if (event.type === 'keyup') {
                // Reset zoom to 100% when 'F' key is released
                zoomCanvas(100 - zoomLevel);
            }
        }
    }

    // Add event listeners for keydown and keyup events to handle zooming with 'F' key
    window.addEventListener('keydown', handleZoom);
    window.addEventListener('keyup', handleZoom);

    // Event listener for zooming with mouse wheel
    document.addEventListener('wheel', function(event) {
        // Prevent the default scroll behavior
        event.preventDefault();

        // Determine the direction of the scroll
        const direction = event.deltaY > 0 ? -1 : 1;

        // Zoom the canvas if zooming is active
        if (event.key === 'f' || event.key === 'F') {
            if (document.hasFocus()) {
                zoomCanvas(zoomIncrement * direction);
            }
        }
    })
})();