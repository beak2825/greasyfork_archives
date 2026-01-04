// ==UserScript==
// @name         CellCraft FPS Boost with Menu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  FPS boost for CellCraft by disabling effects + adding a toggle menu + S E N S E branding
// @author       S E N S E
// @license      S E N S E
// @match        *://cellcraft.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545510/CellCraft%20FPS%20Boost%20with%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/545510/CellCraft%20FPS%20Boost%20with%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fpsBoost = false;

    function setBoostMode(enable) {
        if (enable) {
            document.body.style.setProperty("image-rendering", "pixelated", "important");
            let styles = `
                * {
                    transition: none !important;
                    animation: none !important;
                }
                canvas {
                    filter: brightness(1.1) contrast(1.05);
                }
            `;
            let styleSheet = document.createElement("style");
            styleSheet.id = "fpsBoostStyles";
            styleSheet.innerHTML = styles;
            document.head.appendChild(styleSheet);
        } else {
            document.getElementById("fpsBoostStyles")?.remove();
            document.body.style.removeProperty("image-rendering");
        }
        fpsBoost = enable;
        showBanner(fpsBoost ? "FPS Boost by S E N S E: ON" : "FPS Boost: OFF", fpsBoost ? "green" : "red");
    }

    function createMenu() {
        let menu = document.createElement("div");
        menu.id = "fpsMenu";
        menu.style.position = "fixed";
        menu.style.top = "10px";
        menu.style.right = "10px";
        menu.style.zIndex = "9999";
        menu.style.background = "rgba(0,0,0,0.7)";
        menu.style.color = "#fff";
        menu.style.padding = "8px";
        menu.style.borderRadius = "6px";
        menu.style.fontSize = "14px";
        menu.style.fontFamily = "Arial, sans-serif";
        menu.style.textAlign = "center";
        menu.innerHTML = `
            <b>FPS Boost</b><br>
            <button id="toggleFPSBoost" style="margin-top:5px;">OFF</button>
            <div style="font-size:12px; margin-top:4px; opacity:0.7;">By S E N S E</div>
        `;
        document.body.appendChild(menu);

        document.getElementById("toggleFPSBoost").onclick = function() {
            setBoostMode(!fpsBoost);
            this.innerText = fpsBoost ? "ON" : "OFF";
            this.style.background = fpsBoost ? "green" : "";
        };
    }

    function showBanner(text, color) {
        let banner = document.createElement("div");
        banner.innerText = text;
        banner.style.position = "fixed";
        banner.style.top = "50px";
        banner.style.right = "50%";
        banner.style.transform = "translateX(50%)";
        banner.style.background = color;
        banner.style.color = "#fff";
        banner.style.padding = "10px 20px";
        banner.style.borderRadius = "8px";
        banner.style.fontSize = "14px";
        banner.style.zIndex = "10000";
        banner.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        document.body.appendChild(banner);
        setTimeout(() => {
            banner.remove();
        }, 2500);
    }

    window.addEventListener("load", createMenu);
})();