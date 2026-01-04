// ==UserScript==
// @name         Google Maps Satellite View Auto-Toggle
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automatically toggle to satellite view in Google Maps
// @author       You
// @match        *://www.google.com/maps*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497441/Google%20Maps%20Satellite%20View%20Auto-Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/497441/Google%20Maps%20Satellite%20View%20Auto-Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateClick(element) {
        const evt = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(evt);
    }

    function activateSatelliteView() {
        // Locate the button by its 'aria-labelledby' attribute pointing to 'widget-minimap-icon-overlay'
        const layerButton = document.querySelector('button[aria-labelledby="widget-minimap-icon-overlay"]');
        if (layerButton) {
            simulateClick(layerButton);  // This should toggle the satellite view directly
        }
    }

    setTimeout(activateSatelliteView, 3000); // Delay initial run to ensure elements are loaded
})();
