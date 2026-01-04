// ==UserScript==
// @name         DoorDash Invert Mapbox Canvas Color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Invert the color of the mapbox canvas on DoorDash
// @author       YourName
// @match        https://www.doordash.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502220/DoorDash%20Invert%20Mapbox%20Canvas%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/502220/DoorDash%20Invert%20Mapbox%20Canvas%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Wait for the mapboxgl-canvas to load
    const waitForElement = setInterval(function() {
        const canvas = document.querySelector('.mapboxgl-canvas');
        const canvasgoogle = document.querySelector('.sc-7bcfdeb4-0');

        if (canvas) {
            clearInterval(waitForElement);
            canvas.style.filter = 'invert(94%)';
             console.log('inverting');
        }
        if (canvasgoogle) {
            clearInterval(waitForElement);
            canvasgoogle.style.filter = 'invert(94%)';
             console.log('inverting');
        }
            console.log('checking');
    }, 1000);
})();
