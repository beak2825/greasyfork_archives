// ==UserScript==
// @name         Arras.io Placeholder Mod Menu
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Visual-only placeholder mod menu for Arras.io (press L to toggle)
// @author       Jasper
// @match        *://arras.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538347/Arrasio%20Placeholder%20Mod%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/538347/Arrasio%20Placeholder%20Mod%20Menu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement("style");
    style.textContent = `
    #modMenu, .subMenu {
        position: fixed;
        top: 80px;
        width: 250px;
        background: #1e1e2f;
        border: 1px solid #444;
        color: #fff;
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(255,255,255,0.05);
        z-index: 9999;
    }

    #modMenu {
        right: 20px;
    }

    .subMenu {
        right: 290px;
        max-height: 300px;
        overflow-y: auto;
        display: none;
    }

    .modButton {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        background: #2a2a3f;
        border: none;
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .modButton:hover {
        background: #3a3a5f;
    }

    .checkboxContainer, .sliderContainer {
        margin-top: 8px;
    }

    .subMenuHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .closeButton {
        background: none;
        border: none;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
    }

    .sliderLabels {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 5px;
    }

    .sliderMiddle {
        text-align: center;
        font-size: 16px;
        margin-bottom: 10px;
        color: #ccc;
        font-weight: bold;
    }

    input[type="range"] {
        width: 100%;
    }

    ::-webkit-scrollbar {
        width: 6px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius: 10px;
    }
    `;
    document.head.appendChild(style);

    const html = `
        <div id="modMenu" style="display:none;">
            <strong style="display:block; text-align:center; margin-bottom:10px;">Mod Menu (Placeholder)</strong>
            <button class="modButton" id="speedhackButton">Speedhack</button>
            <button class="modButton" id="espButton">ESP</button>
            <button class="modButton" id="invisibleButton">Invisible</button>
            <button class="modButton" id="noclipButton">NOclip</button>
            <button class="modButton" id="devButton">Dev Commands</button>
            <button class="modButton" id="tokenButton">BetaTester Token</button>
            <button class="modButton" id="zoomButton">Zoom</button>
            <button class="modButton" id="spawnButton">Spawn</button>
        </div>

        <!-- Spawn Submenu -->
        <div class="subMenu" id="spawnSubMenu">
            <div class="subMenuHeader">
                <strong>Spawn Options</strong>
                <button class="closeButton" data-close="spawnSubMenu">&times;</button>
            </div>
            ${["Egg", "Square", "Triangle", "Pentagon", "Alpha Pentagon", "Shadow Alpha Pentagon", "Rainbow Alpha Pentagon", "Trans Alpha Pentagon", "God Pentagon"]
                .map(type => `<div class="checkboxContainer"><input type="checkbox" /> Spawn ${type}</div>`).join('')}
        </div>

        <!-- Speedhack Submenu -->
        <div class="subMenu" id="speedhackSubMenu">
            <div class="subMenuHeader">
                <strong>Speedhack</strong>
                <button class="closeButton" data-close="speedhackSubMenu">&times;</button>
            </div>
            <div class="sliderMiddle" id="speedValue">1x</div>
            <div class="sliderLabels">
                <span>0.1x</span>
                <span>10x</span>
            </div>
            <input type="range" min="0.1" max="10" step="0.1" value="1" id="speedSlider" />
        </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const modMenu = document.getElementById("modMenu");
    const menuButtons = {
        speedhackButton: "speedhackSubMenu",
        spawnButton: "spawnSubMenu",
        espButton: null,
        invisibleButton: null,
        noclipButton: null,
        devButton: null,
        tokenButton: null,
        zoomButton: null
    };

    let menuVisible = false;

    function hideAllSubMenus() {
        document.querySelectorAll('.subMenu').forEach(m => m.style.display = 'none');
    }

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "l") {
            menuVisible = !menuVisible;
            modMenu.style.display = menuVisible ? "block" : "none";
            if (!menuVisible) hideAllSubMenus();
        }
    });

    // Attach button handlers
    for (const [btnId, menuId] of Object.entries(menuButtons)) {
        const btn = document.getElementById(btnId);
        if (!btn) continue;
        btn.addEventListener("click", () => {
            hideAllSubMenus();
            if (menuId) {
                const menu = document.getElementById(menuId);
                if (menu) menu.style.display = "block";
            }
        });
    }

    // Close buttons on submenus
    document.querySelectorAll(".closeButton").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-close");
            document.getElementById(target).style.display = "none";
        });
    });

    // Speed slider live label
    const speedSlider = document.getElementById("speedSlider");
    const speedValue = document.getElementById("speedValue");
    speedSlider.addEventListener("input", () => {
        speedValue.textContent = parseFloat(speedSlider.value).toFixed(1) + "x";
    });
})();