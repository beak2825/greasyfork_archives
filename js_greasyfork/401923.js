// ==UserScript==
// @name         Torn City - warn before flight
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Confirm twice if you really want to fly out when an OC is due
// @author       Telasig [2307282]
// @match        https://www.torn.com/travelagency.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401923/Torn%20City%20-%20warn%20before%20flight.user.js
// @updateURL https://update.greasyfork.org/scripts/401923/Torn%20City%20-%20warn%20before%20flight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('.travel-agency').addEventListener('click', event => {
        if (event.target.matches('button')) {
            var parent = [...event.path].find(path => path.matches('.travel-wrap'));
            if (parent.querySelector('.travel-question .t-red')) {
                var confirm = window.confirm("OC is due, are you sure you want to travel?");
                if (!confirm) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }, true);
})();