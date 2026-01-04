// ==UserScript==
// @name         Ethos Boost.ink Bypasser
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Bypasses Boost.ink using the Ethos API and redirects the user to the bypassed link.
// @author       Shehajeez
// @match        https://boost.ink/*
// @exclude      https://boost.ink
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/490735/Ethos%20Boostink%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/490735/Ethos%20Boostink%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currenturl = window.location.href;

    fetch('https://ethos-testing.vercel.app/api/boostink/bypass?link=' + currenturl)
        .then(response => response.json())
        .then(data => {
            console.log('redirecting to the bypassed link:', data.bypassed);
            window.location.href = data.bypassed;
        })
        .catch(error => console.error('error:', error));
})();