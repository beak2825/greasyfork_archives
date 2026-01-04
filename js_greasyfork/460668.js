// ==UserScript==
// @name         RDR2 Map Pro
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Give you the Pro access.
// @author       Whitie White
// @match        https://rdr2map.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rdr2map.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/460668/RDR2%20Map%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/460668/RDR2%20Map%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the node that will be observed for mutations
    const targetNode = document;

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList' && mutation.target.id === "app") {
                window.user = {
                    "id": 0,
                    "role": "user",
                    "locations": [],
                    "gameLocationsCount": 0,
                    "hasPro": true,
                    "trackedCategoryIds": [],
                    "suggestions": [],
                    "presets": []
                };
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    addEventListener("load", () => {
        console.log(window.user);
        console.log("%cI can be P-R-O as I want 🖕", "font-size: 18px; font-weight: bold; color: teal;");
    });
})();