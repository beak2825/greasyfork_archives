// ==UserScript==
// @name         Remove All Holiday Elements from macserialjunkie.com
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Removes snow animation, santa hat, Christmas lights, and other holiday theme elements from macserialjunkie.com
// @author       sharmanhall
// @match        *://*.macserialjunkie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=macserialjunkie.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482152/Remove%20All%20Holiday%20Elements%20from%20macserialjunkiecom.user.js
// @updateURL https://update.greasyfork.org/scripts/482152/Remove%20All%20Holiday%20Elements%20from%20macserialjunkiecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the snowflake CSS
    function removeSnowflakeCSS() {
        const cssLink = document.querySelector('link[href*="snowflakes.css"]');
        if (cssLink) {
            cssLink.remove();
        }
    }

    // Function to remove santa hat
    function removeSantaHat() {
        const hatDiv = document.getElementById('santahat');
        if (hatDiv) {
            hatDiv.remove();
        }
    }

    // Function to remove specific snowflake elements and set their display to none
    function removeSpecificSnowElements() {
        const lightsDiv = document.getElementById('lights');
        if (lightsDiv) {
            lightsDiv.remove();
        }

        const snowflakeContainer = document.querySelector('.snowflakes');
        if (snowflakeContainer) {
            snowflakeContainer.remove();
        }

        GM_addStyle('.snowflake { display: none !important; }');
    }

    // Function to remove dynamically loaded snowflake elements
    function removeDynamicSnowflakes() {
        const snowflakes = document.querySelectorAll('div[style*="position: absolute"]');
        snowflakes.forEach(flake => {
            if (flake.textContent.trim() === '❄') {
                flake.remove();
            }
        });
    }

    // MutationObserver to handle dynamic loading of snowflakes and other elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                removeSpecificSnowElements();
                removeDynamicSnowflakes();
            }
        });
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Execute removal functions
    removeSnowflakeCSS();
    removeSantaHat();
    removeSpecificSnowElements();
    removeDynamicSnowflakes();
})();
