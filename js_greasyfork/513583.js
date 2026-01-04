// ==UserScript==
// @name         Remove Ad and Dash Elements
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes every element containing "ad-" in its class or ID, "--" in its class, and hides iframes outside body for kemono.su, coomer.su, and all their subdomains.
// @author       YourName
// @match        *://*.kemono.su/*
// @match        *://kemono.su/*
// @match        *://*.coomer.su/*
// @match        *://coomer.su/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513583/Remove%20Ad%20and%20Dash%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/513583/Remove%20Ad%20and%20Dash%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAdAndDashElements() {
        const adElements = document.querySelectorAll('[id*="ad-"], [class*="ad-"]');
        const dashElements = document.querySelectorAll('[class*="root--"]');
        const iframesOutsideBody = document.querySelectorAll('iframe:not(body iframe)');

        // Remove elements containing "ad-" in id or class
        adElements.forEach(el => el.remove());

        // Remove elements containing "--" in class
        dashElements.forEach(el => el.remove());

        // Set iframes outside body to hidden and 0px width
        iframesOutsideBody.forEach(iframe => {
            iframe.style.width = '0px';
            iframe.style.height = '0px';
            iframe.style.visibility = 'hidden';
        });
    }

    // Run the removal function as soon as possible (even before DOM is fully loaded)
    removeAdAndDashElements();

    // Continue running the removal function every 100ms to capture dynamically added elements
    setInterval(removeAdAndDashElements, 100);
})();
