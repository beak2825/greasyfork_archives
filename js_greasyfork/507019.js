// ==UserScript==
// @name         Hide Tumblr Elements
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide specific Tumblr elements by class names and selectors
// @author       LeoTruza
// @match        *://www.tumblr.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/507019/Hide%20Tumblr%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/507019/Hide%20Tumblr%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements by their CSS class names
    function hideElements() {
        // Hide element
        const hlDotElements = document.querySelectorAll('.hlDot');
        hlDotElements.forEach(element => {
            element.style.display = 'none';
        });

        // Hiding Some More Elements 
        const headerElements = document.querySelectorAll('header._3kR_');
        headerElements.forEach(element => {
            element.style.display = 'none';
        });

        // Additional selectors to hide
        const additionalSelectors = [
            '.wttFd',
            '.BSUG4.WaV4Y.wmRou',
            '.kk3cQ.f68ED.EvhBA',
            '.Mk7yS.SbeG8',
            '.Ut4iZ > .BPf9u',
            'aside > div.FZkjV > div > .hF8Wr',
            '.PwJi6',
            '.I_SFh',
            '[href="/about"]',
            '[href="/apps"]',
            '[href="/policy/terms-of-service"]',
            '[href="/policy/privacy"]',
            '[href="/help"]',
            '.EcpO3.TRX6J > .EvhBA > svg',
            '.JhOLN.TRX6J',
            '.qKOfy',
            '.VHoKL',
            '.McUMJ.YmIEY',
            '.w8SBf.Z2xdy',
            '.gUAKZ',
            '.rR_oZ.KDoiW',
            'div.W45iW.KYCZY.rZlUD:nth-of-type(11)'
        ];
        // Hiding the Rest Of the Elements
        additionalSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
            });
        });
    }

    // Run the function when the DOM is fully loaded
    window.addEventListener('load', hideElements);
    document.addEventListener('pjax:end', hideElements);  // For Tumblr's dynamic page loading
})();
