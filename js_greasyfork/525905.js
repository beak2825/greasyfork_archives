// ==UserScript==
// @name         CyphrNX Animated Bedwars Crosshair
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  A modern, animated, futuristic Bedwars-style crosshair for Bloxd.io
// @author       CyphrNX
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525905/CyphrNX%20Animated%20Bedwars%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/525905/CyphrNX%20Animated%20Bedwars%20Crosshair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCustomCrosshair() {
        // Remove the default crosshair
        const defaultCrosshair = document.querySelector(".CrossHair");
        if (defaultCrosshair) defaultCrosshair.style.display = "none";

        // Check if custom crosshair already exists
        if (document.getElementById("cyphrnx-crosshair")) return;

        // Create crosshair container
        const crosshair = document.createElement("div");
        crosshair.id = "cyphrnx-crosshair";
        crosshair.style.position = "fixed";
        crosshair.style.top = "50%";
        crosshair.style.left = "50%";
        crosshair.style.transform = "translate(-50%, -50%)";
        crosshair.style.width = "50px";
        crosshair.style.height = "50px";
        crosshair.style.pointerEvents = "none"; // Prevent interference
        crosshair.style.zIndex = "9999"; // Ensure it's on top
        crosshair.style.display = "flex";
        crosshair.style.justifyContent = "center";
        crosshair.style.alignItems = "center";

        // Add futuristic crosshair elements with animations
        crosshair.innerHTML = `
            <style>
                @keyframes glow {
                    0% { box-shadow: 0 0 4px cyan; }
                    50% { box-shadow: 0 0 12px cyan; }
                    100% { box-shadow: 0 0 4px cyan; }
                }

                @keyframes expand {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                .crosshair-line {
                    position: absolute;
                    background-color: cyan;
                    box-shadow: 0 0 8px cyan;
                    border-radius: 2px;
                    animation: glow 1.5s infinite alternate, expand 1s infinite alternate;
                    transition: all 0.2s ease-in-out;
                }
                
                /* Top Line */
                .top { width: 2px; height: 10px; top: -15px; }
                /* Bottom Line */
                .bottom { width: 2px; height: 10px; bottom: -15px; }
                /* Left Line */
                .left { width: 10px; height: 2px; left: -15px; }
                /* Right Line */
                .right { width: 10px; height: 2px; right: -15px; }
            </style>
            <div class="crosshair-line top"></div>
            <div class="crosshair-line bottom"></div>
            <div class="crosshair-line left"></div>
            <div class="crosshair-line right"></div>
        `;

        // Append to body
        document.body.appendChild(crosshair);
    }

    // Run once on script start
    createCustomCrosshair();

    // Observe changes dynamically to ensure it stays
    const observer = new MutationObserver(createCustomCrosshair);
    observer.observe(document.body, { childList: true, subtree: true });

})();
