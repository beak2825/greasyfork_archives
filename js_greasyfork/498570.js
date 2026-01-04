// ==UserScript==
// @name         Remove Hoobuy Overlays
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the risk warning and additional overlays from hoobuy.com
// @author       Nawid Wafa
// @match        *://*.hoobuy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498570/Remove%20Hoobuy%20Overlays.user.js
// @updateURL https://update.greasyfork.org/scripts/498570/Remove%20Hoobuy%20Overlays.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the overlays
    function removeOverlays() {
        const riskOverlay = document.querySelector('div.risk-warning-wrapper.hoobuy-dialog-wrapper');
        const additionalOverlay = document.querySelector('div.el-overlay[style*="z-index: 2004;"]');
        
        if (riskOverlay) {
            riskOverlay.remove();
        }

        if (additionalOverlay) {
            additionalOverlay.remove();
        }
    }

    // Remove the overlays once the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', removeOverlays);

    // Also try to remove the overlays every 500ms in case they load after DOMContentLoaded
    const intervalId = setInterval(removeOverlays, 500);

    // Stop trying to remove the overlays after 10 seconds
    setTimeout(() => clearInterval(intervalId), 10000);
})();
