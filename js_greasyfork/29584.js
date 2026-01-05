// ==UserScript==
// @name         WK fix 'Next Day'
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the WK Dashboard's "Next Day" to "Next 24 hours"
// @author       TenderWaffles
// @match        https://www.wanikani.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29584/WK%20fix%20%27Next%20Day%27.user.js
// @updateURL https://update.greasyfork.org/scripts/29584/WK%20fix%20%27Next%20Day%27.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('one-day')[0].childNodes[4].data = " Next 24 Hours";
})();