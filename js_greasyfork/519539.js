// ==UserScript==
// @name         Video frame size updater
// @namespace    http://tampermonkey.net/
// @version      2024-12-02
// @description  Is called upon to solve the problem with invisible Rumble player controls after fullscreen mode due to the incorrect frame dimensions
// @license      MIT
// @author       AlekseyMko
// @match        https://app.jointherealworld.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jointherealworld.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519539/Video%20frame%20size%20updater.user.js
// @updateURL https://update.greasyfork.org/scripts/519539/Video%20frame%20size%20updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set iframe width based on screen width
    function setIframeWidth() {
        let iframe = document.querySelector('div.flex.w-full.flex-1 iframe');
        if (iframe) {
            iframe.style.width = (window.innerWidth - 380) + 'px'; // 380px is a left sidebar max width
            iframe.style.height = '700px'; // Adjust height if needed
        }
    }

    // Run the function every 100ms using setInterval
    setInterval(setIframeWidth, 100);
})();