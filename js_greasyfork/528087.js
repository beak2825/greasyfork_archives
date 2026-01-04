// ==UserScript==
// @name         Torn OC Highlighter
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Highlights the selected OC and dims others for better accessibility
// @author       YourName
// @match        https://www.torn.com/oc.php?selected=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528087/Torn%20OC%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/528087/Torn%20OC%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function () {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedOC = urlParams.get("selected");

        if (selectedOC) {
            const ocElements = document.querySelectorAll(".oc-container"); // Update selector if needed

            ocElements.forEach(oc => {
                if (oc.dataset.ocId === selectedOC) {
                    oc.classList.add("highlight-oc"); 
                } else {
                    oc.classList.add("dim-oc"); 
                }
            });
        }
    });

    // CSS to improve visibility
    const style = document.createElement("style");
    style.innerHTML = `
        .highlight-oc {
            border: 3px solid yellow !important; 
            background-color: rgba(255, 255, 0, 0.2);
            padding: 10px;
            transition: 0.3s ease-in-out;
        }
        .dim-oc {
            opacity: 0.4; 
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
})();
