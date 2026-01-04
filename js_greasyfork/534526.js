// ==UserScript==
// @name         GTM-Vorschaumodus erzwingen
// @namespace    http://tampermonkey.net/
// @version      2025-04-30
// @description  This JavaScript code reloads the current page with a gtm_debug query parameter set to the current timestamp.
// @author       Vanakh Chea
// @match        http*://*/*
// @grant        none
// @run-at       context-menu
// @grant        none
// @noframes
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/534526/GTM-Vorschaumodus%20erzwingen.user.js
// @updateURL https://update.greasyfork.org/scripts/534526/GTM-Vorschaumodus%20erzwingen.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // Get the current timestamp including milliseconds
        const timestamp = Date.now();

        // Get the current URL
        let currentUrl = new URL(window.location.href);

        // Set the 'gtm_debug' parameter with the current timestamp
        currentUrl.searchParams.set('gtm_debug', timestamp);


        // Reload the page with the new URL
        window.location.href = currentUrl.toString();

})();