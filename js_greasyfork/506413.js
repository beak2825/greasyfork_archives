// ==UserScript==
// @name         Auto-Reload on Timeout
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @author       Rob Clayton
// @description  Automatically reload the page if it becomes unresponsive for 10 minutes
// @match        https://my.btwholesale.com/*
// @match        http://my.btwholesale.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506413/Auto-Reload%20on%20Timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/506413/Auto-Reload%20on%20Timeout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Time period to wait before reloading (10 minutes)
    const TIMEOUT_PERIOD = 10 * 60 * 1000; // 10 minutes in milliseconds

    let timeoutHandle;

    // Function to reload the page
    function reloadPage() {
        window.location.reload();
    }

    // Function to reset the timeout
    function resetTimeout() {
        clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(reloadPage, TIMEOUT_PERIOD);
    }

    // Start the initial timeout
    resetTimeout();

    // Listen for user activity to reset the timeout
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    window.addEventListener('scroll', resetTimeout);
    window.addEventListener('click', resetTimeout);

    // Also reset the timeout periodically (e.g., every minute)
    setInterval(resetTimeout, 60 * 1000); // Check every minute
})();
