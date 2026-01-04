// ==UserScript==
// @name         Agma.io Visual Skin & Name Color Changer - SENSE
// @namespace    SENSE
// @version      1.0
// @description  Visual-only skin and name color changer for Agma.io | Author: SENSE
// @license      MIT
// @author       S E N S E
// @match        *://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545642/Agmaio%20Visual%20Skin%20%20Name%20Color%20Changer%20-%20SENSE.user.js
// @updateURL https://update.greasyfork.org/scripts/545642/Agmaio%20Visual%20Skin%20%20Name%20Color%20Changer%20-%20SENSE.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 S E N S E

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // ==== CONFIG ====
    const skins = [
        "skin1", "skin2", "skin3", "skin4" // replace with actual skin IDs/names
    ];
    const nameColors = [
        "#ff0000", "#00ff00", "#0000ff", "#ffff00" // red, green, blue, yellow
    ];
    const changeInterval = 1000; // 1 second
    // ===============

    let skinIndex = 0;
    let colorIndex = 0;
    let enabled = true;

    // Create menu
    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.top = "20px";
    menu.style.left = "20px";
    menu.style.background = "rgba(0,0,0,0.6)";
    menu.style.color = "#fff";
    menu.style.padding = "10px";
    menu.style.fontFamily = "Arial, sans-serif";
    menu.style.fontSize = "14px";
    menu.style.borderRadius = "8px";
    menu.style.zIndex = "99999";
    menu.innerHTML = `<b>S E N S E</b><br>
        <button id="toggleSense" style="margin-top:5px;padding:3px 8px;">ON</button>`;
    document.body.appendChild(menu);

    document.getElementById("toggleSense").onclick = function() {
        enabled = !enabled;
        this.textContent = enabled ? "ON" : "OFF";
    };

    // Change skin & name color every interval
    setInterval(() => {
        if (!enabled) return;
        try {
            // Change skin visually
            let skinInput = document.querySelector("#skin"); // adjust if different
            if (skinInput) {
                skinInput.value = skins[skinIndex];
                skinIndex = (skinIndex + 1) % skins.length;
            }

            // Change name color visually
            let nameInput = document.querySelector("#nick");
            if (nameInput) {
                nameInput.style.color = nameColors[colorIndex];
                colorIndex = (colorIndex + 1) % nameColors.length;
            }
        } catch (err) {
            console.error("SENSE script error:", err);
        }
    }, changeInterval);

})();