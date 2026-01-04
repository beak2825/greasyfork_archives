// ==UserScript==
// @name         Auto Expand Cytube Videos
// @namespace    http://tampermonkey.net/
// @version      20240317
// @description  Automatically expand Cytube videos on page load. Can specify a custom number of clicks.
// @author       Alp
// @match        https://cytu.be/*
// @match        http://cytu.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cytu.be
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488017/Auto%20Expand%20Cytube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/488017/Auto%20Expand%20Cytube%20Videos.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function simulateClick(element, numberOfClicks, index) {
        if (index < numberOfClicks) {
            element.click();
            index++;
            requestAnimationFrame(() => simulateClick(element, numberOfClicks, index));
        }
    }

    function init() {
        var element = document.getElementById('resize-video-larger');
        var numberOfClicks = 2; // specify the number of times to click the element

        if (element) {
            simulateClick(element, numberOfClicks, 0);
        }
    }

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Tab is visible, restart the script
            init();
        }
    });

    init(); // Run the script initially
})();