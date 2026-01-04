// ==UserScript==
// @name         More shortcut keys to your websiteMap-Making
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhanced script for GeoGuessr map making - press space to save, press 'q' and 'e' to facing the opposite road
// @author       lemures
// @match        https://map-making.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484994/More%20shortcut%20keys%20to%20your%20websiteMap-Making.user.js
// @updateURL https://update.greasyfork.org/scripts/484994/More%20shortcut%20keys%20to%20your%20websiteMap-Making.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateClick(element) {
        if (element) {
            element.click();
        }
    }

    function clickAllMatching(selector) {
        document.querySelectorAll(selector).forEach(simulateClick);
    }

    const SELECTORS = {
        ' ': 'button.button.button--primary[type="button"]',
        'q': 'button.compass-control__link:nth-child(3)',
        'e': 'button.compass-control__link:nth-child(2)',
        'c': '.location-preview__actions > button:nth-child(2)',
        'v': 'div.tool-block:nth-child(2) > header:nth-child(1) > button:nth-child(4)',
        'd': 'button.button:nth-child(3)'
    };

    document.addEventListener('keydown', event => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        if (SELECTORS[event.key]) {
            const element = document.querySelector(SELECTORS[event.key]);
            simulateClick(element);
        }
    });

})();