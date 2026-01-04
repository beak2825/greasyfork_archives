// ==UserScript==
// @name         Fishtank.live remove junk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This removes all the junk on fishtank.live so its just the cameras
// @author       Jamesbannister
// @match        https://www.fishtank.live/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466214/Fishtanklive%20remove%20junk.user.js
// @updateURL https://update.greasyfork.org/scripts/466214/Fishtanklive%20remove%20junk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to delete all nodes that are not the specified div or its children
    function modifyNodes() {
        const main = document.querySelector('main');
        if (!main) return;

        const keep = main.querySelector("[class^='MainPanel_main-panel']");
        if (!keep) return;

        // Iterate over all child nodes of main
        Array.from(main.childNodes).forEach(child => {
            // If the child node is not the one to keep, remove it
            if (child !== keep) {
                child.remove();
            }
        });

        // Make the kept div occupy the full viewport width and height
        keep.style.width = '100vw';
        keep.style.height = '100vh';

        // Set the grid-column property of the kept div
        keep.style.gridColumn = '1/3';
    }

    // Function to wait until the DOM nodes are present before running the script
    function waitForElement() {
        if (document.querySelector("[class^='MainPanel_main-panel']") && document.querySelector("[class^='Chat_chat']")) {
            modifyNodes();
        } else {
            setTimeout(waitForElement, 300);
        }
    }

    // Run the function on page load
    window.onload = waitForElement;
})();
