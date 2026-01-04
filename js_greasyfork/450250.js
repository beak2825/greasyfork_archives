// ==UserScript==
// @name         Restore Virgin Atlantic Monthly Low Fare Calendar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Restore the now-hidden month-long view of lowest fares on virginatlantic.com
// @author       David Carter
// @match        *://www.virginatlantic.com/flight-search/flexible-dates?*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450250/Restore%20Virgin%20Atlantic%20Monthly%20Low%20Fare%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/450250/Restore%20Virgin%20Atlantic%20Monthly%20Low%20Fare%20Calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var newURL = window.location.origin
    + window.location.pathname.replace("flexible-dates", "flexible-calendar")
    + window.location.search + window.location.hash;
    /*-- replace() puts the new page in the history instead of the
        old page.
    */
    window.location.replace (newURL);

})();