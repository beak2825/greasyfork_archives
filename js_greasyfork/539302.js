// ==UserScript==
// @name         Open Medium premium links with Freedium.cfd
// @namespace    
// @version      1.0
// @description  Adds a button to open the current Medium article with freedium.cfd
// @match        *://medium.com/*
// @match        *://*.medium.com/*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539302/Open%20Medium%20premium%20links%20with%20Freediumcfd.user.js
// @updateURL https://update.greasyfork.org/scripts/539302/Open%20Medium%20premium%20links%20with%20Freediumcfd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        let paragraphs = document.querySelectorAll("p");
        let found = false;

        paragraphs.forEach(p => {
            if (p.textContent.includes("Member-only") && !found) {
                found = true;

                let btn = document.createElement('button');
                btn.textContent = "Open with freedium";
                btn.style.marginLeft = "10px";
                btn.style.padding = "5px";
                btn.style.backgroundColor = "#ff6600";
                btn.style.color = "#fff";
                btn.style.border = "none";
                btn.style.borderRadius = "5px";
                btn.style.cursor = "pointer";

                // Define the button action
                btn.addEventListener('click', () => {
                    let currentURL=encodeURIComponent(window.location.href);
                    window.open(`https://freedium.cfd/${currentURL}`, '_blank');
                });

                p.appendChild(btn);
            }
        });

        if (!found) {
            console.log("Target div not found.");
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', addButton);
})();