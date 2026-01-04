// ==UserScript==
// @name         Narodmon.com Sensors Location Redirector
// @namespace    https://violentmonkey.github.io/
// @version      1.3
// @description  Automatically select sensors of desired location instead of default selection based on geolocation
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        https://narodmon.com/*
// @match        https://narodmon.ru/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482498/Narodmoncom%20Sensors%20Location%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/482498/Narodmoncom%20Sensors%20Location%20Redirector.meta.js
// ==/UserScript==

// To select sensors for a certain area, you need specify initial sensor number in the url. For example https://narodmon.com/101806
// You will be redirected to a general map view with all the sensors in the nearby area

(function () {
    'use strict';

    // Run only on direct sensor pages: https://narodmon.com/12345
    if (!/^\/\d+$/.test(location.pathname)) return;

    let hasRedirected = false;

    // Selector for the very first (legacy) popup close button that appears only on the first load
    const legacyPopupCloseBtn = 'div.sprite[style*="background-position:-144px -16px"][onclick="HideDlg()"]';

    // Selector for the modern sensor data window close button (the one that appears second or immediately in new tabs)
    // This is NOT a Google Maps InfoWindow — it's narodmon's own overlay
    const sensorDataWindowCloseBtn = 'button.gm-ui-hover-effect[aria-label="Close"], button[title="Close"].gm-ui-hover-effect';

    // Final redirect to the main map view
    const redirectToMap = () => {
        if (hasRedirected) return;
        hasRedirected = true;
        location.href = location.protocol + '//' + location.host + '/';
    };

    // Try to close the sensor data window (the one with actual sensor readings)
    const tryCloseSensorDataWindow = () => {
        const btn = document.querySelector(sensorDataWindowCloseBtn);
        if (btn && btn.offsetParent !== null) { // button exists and is visible
            btn.click();
            // Small delay to let the closing animation finish smoothly
            setTimeout(redirectToMap, 300);
            return true;
        }
        return false;
    };

    // Try to close the legacy first popup (only appears on very first visit)
    const tryCloseLegacyPopup = () => {
        const btn = document.querySelector(legacyPopupCloseBtn);
        if (btn) {
            btn.click();
            return true;
        }
        return false;
    };

    // Immediate attempt — in case elements are already in DOM
    if (tryCloseSensorDataWindow()) return;
    tryCloseLegacyPopup();

    // Watch for dynamic DOM changes (most reliable way on this site)
    const observer = new MutationObserver(() => {
        if (hasRedirected) {
            observer.disconnect();
            return;
        }

        // Close sensor data window as soon as it appears
        if (tryCloseSensorDataWindow()) {
            observer.disconnect();
            return;
        }

        // Close legacy popup if it's still there (will trigger sensor data window)
        tryCloseLegacyPopup();
    });

    // Start observing as early as possible
    if (document.documentElement) {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Force redirect after 8 seconds if something gets stuck
    setTimeout(() => {
        if (!hasRedirected) {
            console.warn('Narodmon Timeout — forcing redirect to map');
            redirectToMap();
        }
    }, 8000);

})();