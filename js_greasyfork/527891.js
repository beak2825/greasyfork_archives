// ==UserScript==
// @name         Bird PSA
// @namespace    http://greasyfork.org/
// @version      1.0
// @license MIT
// @description  Alerts if "bird" is found in the URL or page content.
// @author       LiyahMackenzie
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527891/Bird%20PSA.user.js
// @updateURL https://update.greasyfork.org/scripts/527891/Bird%20PSA.meta.js
// ==/UserScript==

(function() {
    'use strict';

//checking
function checkForBird() {
        let found = false;

//url checking
if (window.location.href.toLowerCase().includes("bird")) {
            found = true;
        }

        let bodyText = document.body.innerText.toLowerCase();
        if (bodyText.includes("bird")) {
            found = true;
        }

//alert
        if (found) {
            alert("Note: birds are not real. They are government drones that disguise themselves in cuteness.");
        }
    }

//run
window.addEventListener("load", checkForBird);
})();