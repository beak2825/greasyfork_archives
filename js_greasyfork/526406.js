// ==UserScript==
// @name         CyphrNX Ultra-Crosshair
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Sci-fi crosshair with rotating, fading effects for Bloxd.io
// @author       CyphrNX
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526406/CyphrNX%20Ultra-Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/526406/CyphrNX%20Ultra-Crosshair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeDefaultCrosshair() {
        const defaultCrosshair = document.querySelector(".CrossHair");
        if (defaultCrosshair) {
            defaultCrosshair.remove();
        }
    }

    function createCustomCrosshair() {
        if (document.getElementById("cyphrnx-crosshair")) return;

        const crosshair = document.createElement("div");
        crosshair.id = "cyphrnx-crosshair";
        crosshair.style.position = "fixed";
        crosshair.style.top = "50%";
        crosshair.style.left = "50%";
        crosshair.style.transform = "translate(-50%, -50%)";
        crosshair.style.pointerEvents = "none";
        crosshair.style.zIndex = "9999";
        crosshair.style.display = "flex";
        crosshair.style.justifyContent = "center";
        crosshair.style.alignItems = "center";
        crosshair.style.animation = "rotateCrosshair 5s linear infinite, fadeEffect 3s infinite alternate";

        crosshair.innerHTML = `
            <style>
                @keyframes sciFiPulse {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 5px red; }
                    50% { transform: scale(1.4); opacity: 0.7; box-shadow: 0 0 15px red; }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 5px red; }
                }
                @keyframes rotateCrosshair {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes fadeEffect {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                .crosshair-line {
                    position: absolute;
                    background-color: red;
                    box-shadow: 0 0 6px red;
                    border-radius: 1px;
                    animation: sciFiPulse 1.5s infinite alternate ease-in-out;
                }
                .top { width: 2px; height: 10px; top: -12px; }
                .bottom { width: 2px; height: 10px; bottom: -12px; }
                .left { width: 10px; height: 2px; left: -12px; }
                .right { width: 10px; height: 2px; right: -12px; }
                .dot {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background-color: red;
                    border-radius: 50%;
                    box-shadow: 0 0 10px red;
                    animation: sciFiPulse 1.5s infinite alternate ease-in-out, fadeEffect 3s infinite alternate;
                }
            </style>
            <div class="crosshair-line top"></div>
            <div class="crosshair-line bottom"></div>
            <div class="crosshair-line left"></div>
            <div class="crosshair-line right"></div>
            <div class="dot"></div>
        `;
        document.body.appendChild(crosshair);
    }

    window.addEventListener("load", () => {
        setTimeout(() => {
            removeDefaultCrosshair();
            createCustomCrosshair();
        }, 500);
    });
})();
