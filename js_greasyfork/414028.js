// ==UserScript==
// @name         WEB.DE redirect after logout
// @namespace    graphen
// @version      2.0.0
// @description  From logout lounge to main page
// @author       Graphen
// @match        https://web.de/logoutlounge/*
// @match        https://web.de/?status=session-expired
// @match        https://web.de/consent-management/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/414028/WEBDE%20redirect%20after%20logout.user.js
// @updateURL https://update.greasyfork.org/scripts/414028/WEBDE%20redirect%20after%20logout.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function (doc) {
    'use strict';

    function redirect() {
        window.location.replace("https://web.de/?origin=lpc");
    }

    setTimeout(redirect(), 500);

})(document);
