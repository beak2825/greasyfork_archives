// ==UserScript==
// @name         Google Location
// @name:fr      Localisation Google
// @namespace    https://lumixsf.site
// @version      1.6
// @description  Removes location and city information displayed on Google
// @description:fr Supprime les informations de localisation et de ville affichées sur Google
// @author       Lumix
// @match        *://www.google.com/*
// @match        *://www.google.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516435/Google%20Location.user.js
// @updateURL https://update.greasyfork.org/scripts/516435/Google%20Location.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLocationInfo() {
        const locationInfo = document.querySelector('#footer .A6mth');
        const ipInfo = document.querySelector('div[role="contentinfo"] span'); 

        if (locationInfo) {
            locationInfo.remove();
        }

        if (ipInfo) {
            ipInfo.remove();
        }

        const resultForElements = document.querySelectorAll('span.gm7Ysb');

        resultForElements.forEach(element => {
            const parent = element.closest('div'); 
            if (parent) {
                parent.remove();
            }
        });
    }

    removeLocationInfo();

    const observer = new MutationObserver(removeLocationInfo);
    observer.observe(document.body, { childList: true, subtree: true });
})();
