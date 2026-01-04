// ==UserScript==
// @name         Agma.io Helper + Freeze + FPS Boost
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds free freeze, FPS boost, zoom, and menu for Agma.io
// @author       S E N S E
// @license      S E N S E
// @match        *://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545513/Agmaio%20Helper%20%2B%20Freeze%20%2B%20FPS%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/545513/Agmaio%20Helper%20%2B%20Freeze%20%2B%20FPS%20Boost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let freeze = false;
    let fpsBoost = false;
    let savedX = 0, savedY = 0;

    // Track mouse when not frozen
    document.addEventListener("mousemove", function(e) {
        if (!freeze) {
            savedX = e.clientX;
            savedY = e.clientY;
        }
    }, true);

    // Fake freeze by locking mouse position
    const origGetBoundingClientRect = HTMLCanvasElement.prototype.getBoundingClientRect;
    HTMLCanvasElement.prototype.getBoundingClientRect = function() {
        const rect = origGetBoundingClientRect.apply(this, arguments);
        if (freeze) {
            return new DOMRect(savedX, savedY, rect.width, rect.height);
        }
        return rect;
    };

    // Keyboard controls
    document.addEventListener("keydown", function(e) {
        if (e.key.toLowerCase() === "f") {
            freeze = !freeze;
            showBanner(freeze ? "FREEZE: ON" : "FREEZE: OFF", freeze ? "red" : "green");
        }
        if (e.key === "+") {
            window.agar.zoomValue *= 1.1;
        }
        if (e.key === "-") {
            window.agar.zoomValue /= 1.1;
        }
    });

    // Toggle FPS boost
    function setBoostMode(enable) {
        if (enable) {
            let styles = `
                * { transition: none !important; animation: none !important; }
                canvas { image-rendering: pixelated; filter: brightness(1.1) contrast(1.05); }
            `;
            let styleSheet = document.createElement("style");
            styleSheet.id = "fpsBoostStyles";
            styleSheet.innerHTML = styles;
            document.head.appendChild(styleSheet);
        } else {
            document.getElementById("fpsBoostStyles")?.remove();
        }
        fpsBoost = enable;
    }

    // Menu UI
    function createMenu() {
        let menu = document.createElement("div");
        menu.style.position = "fixed";
        menu.style.top = "10px";
        menu.style.right = "10px";
        menu.style.background = "rgba(0,0,0,0.7)";
        menu.style.color = "#fff";
        menu.style.padding = "8px";
        menu.style.borderRadius = "6px";
        menu.style.zIndex = "9999";
        menu.innerHTML = `
            <b>Agma Helper</b><br>
            <button id="toggleFPS" style="margin-top:5px;">FPS Boost: OFF</button>
            <div style="font-size:12px; margin-top:4px; opacity:0.7;">By S E N S E</div>
            <div style="font-size:11px;margin-top:4px;">F = Freeze<br>+/- = Zoom</div>
        `;
        document.body.appendChild(menu);

        document.getElementById("toggleFPS").onclick = function() {
            setBoostMode(!fpsBoost);
            this.innerText = fpsBoost ? "FPS Boost: ON" : "FPS Boost: OFF";
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
        banner.style.padding = "8px 16px";
        banner.style.borderRadius = "8px";
        banner.style.fontSize = "14px";
        banner.style.zIndex = "10000";
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 2000);
    }

    window.addEventListener("load", createMenu);
})();