// ==UserScript==
// @name         GMX redirect after logout
// @namespace    graphen
// @version      2.0.0
// @description  From logout lounge to main page
// @author       Graphen
// @match        https://www.gmx.net/logoutlounge/*
// @match        https://www.gmx.net/?status=session-expired
// @match        https://www.gmx.net/consent-management/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/414029/GMX%20redirect%20after%20logout.user.js
// @updateURL https://update.greasyfork.org/scripts/414029/GMX%20redirect%20after%20logout.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function (doc) {
    'use strict';

    function redirect() {
        window.location.replace("https://www.gmx.net/?origin=lpc");
    }

    setTimeout(redirect(), 500);

})(document);
