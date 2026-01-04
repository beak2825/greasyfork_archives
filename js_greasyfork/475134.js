// ==UserScript==
// @name         SRM Color Code Test vs Production
// @namespace    http://tampermonkey.net/
// @version      2023.06.30.1
// @description  Changes background color to reduce mistakes working between Test and Production
// @author       Vance M. Allen
// @match        https://srm.sde.idaho.gov/srm/*
// @match        https://srmtest.sde.idaho.gov/srm/*
// @match        https://srm2.sde.idaho.gov/srm/*
// @match        https://srmtest2.sde.idaho.gov/srm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475134/SRM%20Color%20Code%20Test%20vs%20Production.user.js
// @updateURL https://update.greasyfork.org/scripts/475134/SRM%20Color%20Code%20Test%20vs%20Production.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Determine what site we're running on.
    let host = window.location.host.split('.')[0];

    // When a test server, use another color.
    if(/test/.test(host)) {
        let color = 'lightgreen';
        document.getElementsByTagName('body').item(0).style.backgroundColor = color;
        console.warn('Background color set by "SRM Color Code Test vs Production" script.');
    }
})();