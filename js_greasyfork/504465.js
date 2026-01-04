// ==UserScript==
// @name         Stop redirect to TBD home and use custom main domain
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  This script will stop the redirect to the home page if TBD is loaded from any other website With a Main domain feature.
// @author       EviL.
// @match        https://www.torrentbd.net/*
// @match        https://www.torrentbd.com/*
// @match        https://www.torrentbd.me/*
// @match        https://www.torrentbd.org/*
// @icon         https://static.torrentbd.net/bf68ee5a32904d2ca12f3050f9efbf91.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504465/Stop%20redirect%20to%20TBD%20home%20and%20use%20custom%20main%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/504465/Stop%20redirect%20to%20TBD%20home%20and%20use%20custom%20main%20domain.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // User define section Starts

    const mainDomain = "torrentbd.net"; //Define which Domain you want to use as your main domain
    const wantToredirect = true; // in here use true if you want to redirect to your defined domain or stay on loaded domain if not then use false

    // User define section Ends

    const currentDomain = window.location.hostname;
    const currentUrl = window.location.href;
    var isMainDomain = currentUrl.includes(mainDomain);
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    const validDomains = ["torrentbd.net", "torrentbd.com", "torrentbd.org", "torrentbd.me"];
    const isValidReferrer = validDomains.some(domain => referrer.includes(domain));
    const isValidMainDomain = validDomains.some(domain => mainDomain.includes(domain));
    const isFromOtherDomain = referrer.includes(mainDomain);

    if (!isValidReferrer) {
        window.location.reload();
    }
    else if (!isMainDomain && isValidMainDomain && wantToredirect) {
        const newUrl = window.location.href.replace(currentDomain, mainDomain);
        window.location.replace(newUrl);
    }
    else if (!isFromOtherDomain && isValidMainDomain && wantToredirect) {
        window.location.reload();
    }

})();
