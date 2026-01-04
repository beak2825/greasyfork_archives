// ==UserScript==
// @name         Title__
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  Move the viewer back back to under the stream (WIP)
// @author       MasterSamwise
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520503/Title__.user.js
// @updateURL https://update.greasyfork.org/scripts/520503/Title__.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // wait for page load
    window.addEventListener('load', function() {
        // find the stupud fucking top bar
        const elementToHide = document.querySelector('.dOwqqa');

        // hide that shit
        if (elementToHide) {
            elementToHide.style.display = 'none'; // Hides the element
        }

        setTimeout(() => {
            const interval = setInterval(() => {
                // find bar content
                const bar = document.querySelector('.kRMWIJ');

                // find the empty div cos they lazy and left it for us
                const sectionToPrepend = document.querySelector('.ceRgzg');

                if (bar && sectionToPrepend) {
                    // move the bar content to the empty div
                    sectionToPrepend.parentNode.insertBefore(bar, sectionToPrepend);

                    // stop looking for the bar now, we done it lols
                    clearInterval(interval);
                } else {
                    console.log('Still waiting for section or empty div...');
                }
            }, 1000); // Check every 1 second cos page load times blah blah
        }, 5000);
    });
})();
