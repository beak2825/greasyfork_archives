// ==UserScript==
// @name         statista-image-thief
// @namespace    http://tampermonkey.net/
// @version      2025-01-26-5
// @description  Display statista hidden images
// @author       Sheïk
// @match        https://www.statista.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=statista.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524855/statista-image-thief.user.js
// @updateURL https://update.greasyfork.org/scripts/524855/statista-image-thief.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!window.location.href.includes("https://www.statista.com")) return;
        const secretToken = "DQoNCg0KDQprbWltaW5hYWFhYSA8Mw0KDQoNCg0KDQoNCg=="
        console.log(atob(secretToken))
        const removePaywall = () => {
            try {
            const previewContainer = document.getElementById('statisticContainer');
            if (previewContainer !== null) {
                const img = previewContainer.querySelector('img'); // Unique selector
                previewContainer.innerHTML = ''; // Clear all content
                previewContainer.appendChild(img); // Add only the image back
            }
            } catch (e) {
                console.log(e)
            }

            try {
                const boxPaywalls = document.getElementsByClassName("xmoChartBoxPaywall")
                if (boxPaywalls.length === 0) {console.log("No Box Paywalls")}
                else {
                    for (var i = 0; i < boxPaywalls.length; i++){
                        boxPaywalls[i].innerHTML = ''
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    removePaywall()

    setTimeout(removePaywall, 1000);
    setTimeout(removePaywall, 2000);
    setTimeout(removePaywall, 3000);
    setTimeout(removePaywall, 4000);
    setTimeout(removePaywall, 5000);

    // Your code here...
})();