// ==UserScript==
// @name         YouTube Button Reposition
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Move YouTube buttons to different positions
// @author       You
// @match        *://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508201/YouTube%20Button%20Reposition.user.js
// @updateURL https://update.greasyfork.org/scripts/508201/YouTube%20Button%20Reposition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to move buttons around
    function moveButtons() {
        // Wait until the page is fully loaded
        if (document.readyState === 'complete') {
            const watchActions = document.querySelector('#actions');
            const title = document.querySelector('.title yt-formatted-string');
            const channel = document.querySelector('#owner-name');
            const subscribe = document.querySelector('#subscribe-button');
            const join = document.querySelector('#join-button');

            if (watchActions && title && channel && subscribe && join) {
                // Move buttons
                const buttons = watchActions.querySelectorAll('ytd-menu-renderer, ytd-button-renderer');
                const rightSection = document.querySelector('.style-scope.ytd-watch-metadata');
                const leftSection = document.querySelector('#info-contents');

                buttons.forEach(button => {
                    rightSection.appendChild(button);
                });

                leftSection.insertBefore(subscribe, leftSection.firstChild);
                leftSection.insertBefore(join, leftSection.firstChild);
            }
        }
    }

    // Run the function when the page is loaded
    window.addEventListener('load', moveButtons);
})();
