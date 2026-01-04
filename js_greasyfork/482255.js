// ==UserScript==
// @name         Kick.com - Auto select best quality
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      1.1
// @author       Trilla_G
// @description  Auto select best quality
// @match        *://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482255/Kickcom%20-%20Auto%20select%20best%20quality.user.js
// @updateURL https://update.greasyfork.org/scripts/482255/Kickcom%20-%20Auto%20select%20best%20quality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the quality option is selected and click it if not
    let checkQuality = () => {
        let qualityOption = document.querySelector("div.betterhover\\:hover\\:text-primary:nth-child(2)");
        
        if (qualityOption) {
            let isSelected = qualityOption.parentNode.getAttribute("aria-checked") === "true";
            if (!isSelected) {
                console.log("Selecting 1080p60 quality...");
                qualityOption.click();
                qualityOption.dispatchEvent(new Event('click', { bubbles: true }));
            }
            return true;
        }
        return false;
    };

    // Wait for the quality menu to load, then apply the selection
    let setStreamQuality = () => {
        if (!checkQuality()) {
            console.log("Quality option not found yet, retrying...");
        }
    };

    // Run the setStreamQuality function every 500ms
    let interval = setInterval(setStreamQuality, 500);

    // Stop checking after 10 seconds to prevent unnecessary loops
    setTimeout(() => {
        clearInterval(interval);
    }, 10000);
})();
