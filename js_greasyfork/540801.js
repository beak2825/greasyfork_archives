// ==UserScript==
// @name         Lichess Custom Board Colors
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Unique embedded UI with profile support that allows you to pick any board colors.
// @author       ObnubiladO
// @match        https://lichess.org/*
// @icon         https://emoji-palette.com/wp-content/uploads/platform/microsoft-artist-palette-emoji.png
// @grant        GM_addStyle
// @grant        GM_addElement
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/540801/Lichess%20Custom%20Board%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/540801/Lichess%20Custom%20Board%20Colors.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colorTileMap = {};

    const profiles = [
        { value: 'profile1', label: 'Profile 1' },
        { value: 'profile2', label: 'Profile 2' },
        { value: 'profile3', label: 'Profile 3' }
    ];

    const defaultActiveProfile = profiles[0].value;
    const themeName = "brown";

    const defaultLightColor = "#eae9d2";
    const defaultDarkColor = "#4b7399";
    const defaultLastMoveColor = "#ffbf00";
    const defaultLastMoveOpacity = "0.5";

    function storageKey(profileValue, suffix) {
        return `tm.customTheme.${profileValue}.${suffix}`;
    }
    function getActiveProfile() {
        return localStorage.getItem("tm.customTheme.activeProfile") || defaultActiveProfile;
    }
    function setActiveProfile(profileValue) {
        localStorage.setItem("tm.customTheme.activeProfile", profileValue);
    }

    function loadColorSetting(profileValue, colorKey, defaultVal) {
        const key = storageKey(profileValue, colorKey);
        const val = localStorage.getItem(key);
        if (val === null) {
            localStorage.setItem(key, defaultVal);
            return defaultVal;
        } else {
            return val;
        }
    }

    function loadAllSettings(profileValue) {
        return {
            lightColor: loadColorSetting(profileValue, "lightColor", defaultLightColor),
            darkColor: loadColorSetting(profileValue, "darkColor", defaultDarkColor),
            lastMoveColor: loadColorSetting(profileValue, "lastMoveColor", defaultLastMoveColor),
            lastMoveOpacity: loadColorSetting(profileValue, "lastMoveOpacity", defaultLastMoveOpacity),
        };
    }

    function getThemeStyles(lightColor, darkColor, lastMoveColor, lastMoveOpacity) {
        const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink"
     viewBox="0 0 8 8" shape-rendering="crispEdges">
  <g id="a">
    <g id="b">
      <g id="c">
        <g id="d">
          <rect width="1" height="1" fill="${lightColor}" id="e"/>
          <use x="1" y="1" href="#e" x:href="#e"/>
          <rect y="1" width="1" height="1" fill="${darkColor}" id="f"/>
          <use x="1" y="-1" href="#f" x:href="#f"/>
        </g>
        <use x="2" href="#d" x:href="#d"/>
      </g>
      <use x="4" href="#c" x:href="#c"/>
    </g>
    <use y="2" href="#b" x:href="#b"/>
  </g>
  <use y="4" href="#a" x:href="#a"/>
</svg>`;

        let base64SVG = btoa(svg);

        return `
        body[data-board=${themeName}] .is2d cg-board::before {
            background-image: url("data:image/svg+xml;base64,${base64SVG}") !important;
        }
        #dasher_app .board.d2 .${themeName} {
            background-image: url("data:image/svg+xml;base64,${base64SVG}") !important;
            background-size: 256px !important;
        }
        body[data-board=${themeName}] .is2d cg-board .last-move:not(.current-premove) {
            background-color: ${lastMoveColor} !important;
            opacity: ${lastMoveOpacity} !important;
        }`;
    }

    let addedStyleElement = GM_addStyle("");
    applyInitialTheme();

    function applyInitialTheme() {
        const profile = getActiveProfile();
        const s = loadAllSettings(profile);
        const css = getThemeStyles(s.lightColor, s.darkColor, s.lastMoveColor, s.lastMoveOpacity);
        addedStyleElement.innerHTML = css;
    }

    function updateTheme() {
        const profile = getActiveProfile();
        const light = document.getElementById("tmLightColor");
        const dark = document.getElementById("tmDarkColor");
        const lastMove = document.getElementById("tmLastMoveColor");
        const opacityElem = document.getElementById("tmLastMoveOpacity");

        if (!light || !dark || !lastMove || !opacityElem) return;

        const lightColor = light.value;
        const darkColor = dark.value;
        const lastMoveColor = lastMove.value;
        const lastMoveOpacity = opacityElem.value;

        const css = getThemeStyles(lightColor, darkColor, lastMoveColor, lastMoveOpacity);
        addedStyleElement.innerHTML = css;

        localStorage.setItem(storageKey(profile, "lightColor"), light.value);
        localStorage.setItem(storageKey(profile, "darkColor"), dark.value);
        localStorage.setItem(storageKey(profile, "lastMoveColor"), lastMove.value);
        localStorage.setItem(storageKey(profile, "lastMoveOpacity"), opacityElem.value);
    }

    function createColorTile(id, defaultColor) {
        const container = document.createElement("div");
        container.style.width = "36px";
        container.style.height = "36px";
        container.style.borderRadius = "4px";
        container.style.cursor = "pointer";
        container.style.background = defaultColor;
        container.style.border = "2px solid transparent";
        container.style.boxSizing = "border-box";
        container.style.position = "relative";

        const input = document.createElement("input");
        input.type = "color";
        input.id = id;
        input.value = defaultColor;
        input.style.opacity = "0";
        input.style.position = "absolute";
        input.style.inset = "0";
        input.style.pointerEvents = "none";
        input.style.width = "100%";
        input.style.height = "100%";

        container.addEventListener("click", () => input.click());
        input.addEventListener("input", () => {
            container.style.background = input.value;
            updateTheme();
        });

        container.appendChild(input);
        container.dataset.colorTileId = id;
        colorTileMap[id] = container;

        return container;
    }

    function createLabeledTile(labelText, tileId, defaultColor, includeOpacity = false) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.fontSize = "12px";
        container.style.color = "var(--text)";
        container.style.gap = "4px";

        const label = document.createElement("div");
        label.textContent = labelText;

        container.appendChild(label);

        if (includeOpacity) {
            // Special horizontal group for color tile + slider
            const horizontalGroup = document.createElement("div");
            horizontalGroup.style.display = "flex";
            horizontalGroup.style.flexDirection = "row";
            horizontalGroup.style.alignItems = "center";
            horizontalGroup.style.gap = "12px";

            const tile = createColorTile(tileId, defaultColor);

            const sliderGroup = document.createElement("div");
            sliderGroup.style.display = "flex";
            sliderGroup.style.flexDirection = "column";
            sliderGroup.style.alignItems = "center";

            const opacityLabel = document.createElement("div");
            opacityLabel.id = "tmLastMoveOpacityLabel";  // ADD ID so we can update it later
            opacityLabel.textContent = `Opacity: ${defaultLastMoveOpacity}`;
            opacityLabel.style.fontSize = "11px";
            opacityLabel.style.marginBottom = "2px";

            const slider = document.createElement("input");
            slider.type = "range";
            slider.id = "tmLastMoveOpacity";
            slider.min = "0";
            slider.max = "1";
            slider.step = "0.05";
            slider.value = defaultLastMoveOpacity;
            slider.style.width = "80px";

            slider.addEventListener("input", () => {
                opacityLabel.textContent = `Opacity: ${slider.value}`;
                updateTheme();
            });

            sliderGroup.appendChild(opacityLabel);
            sliderGroup.appendChild(slider);

            horizontalGroup.appendChild(tile);
            horizontalGroup.appendChild(sliderGroup);
            container.appendChild(horizontalGroup);
        } else {
            const tile = createColorTile(tileId, defaultColor);
            container.appendChild(tile);
        }

        return container;
    }

    function applyProfileToUI(profileValue) {
        const settings = loadAllSettings(profileValue);
        const updateTile = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
            if (colorTileMap[id]) colorTileMap[id].style.background = value;
        };

        updateTile("tmLightColor", settings.lightColor);
        updateTile("tmDarkColor", settings.darkColor);
        updateTile("tmLastMoveColor", settings.lastMoveColor);

        const opacitySlider = document.getElementById("tmLastMoveOpacity");
        const opacityLabel = document.getElementById("tmLastMoveOpacityLabel");

        if (opacitySlider) opacitySlider.value = settings.lastMoveOpacity;
        if (opacityLabel) opacityLabel.textContent = `Opacity: ${settings.lastMoveOpacity}`;
    }

    function buildUI(container) {
        if (!container) return;

        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.gap = "8px";
        container.appendChild(wrapper);

        const profileSelect = GM_addElement(wrapper, "select", {
            id: "tmProfileSelect",
            className: "select large",
            style: "width: 100%;"
        });

        profiles.forEach((p) => {
            const opt = document.createElement("option");
            opt.value = p.value;
            opt.textContent = p.label;
            profileSelect.appendChild(opt);
        });
        profileSelect.value = getActiveProfile();

        profileSelect.addEventListener("change", () => {
            const newProfile = profileSelect.value;
            setActiveProfile(newProfile);
            applyProfileToUI(newProfile);
            updateTheme();
        });

        const colorRow = document.createElement("div");
        colorRow.style.display = "flex";
        colorRow.style.gap = "12px";
        colorRow.style.marginBottom = "8px";

        colorRow.appendChild(createLabeledTile("Light", "tmLightColor", defaultLightColor));
        colorRow.appendChild(createLabeledTile("Dark", "tmDarkColor", defaultDarkColor));
        colorRow.appendChild(createLabeledTile("Last Move", "tmLastMoveColor", defaultLastMoveColor, true));
        wrapper.appendChild(colorRow);
    }

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    callback(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function main() {
        const observer = new MutationObserver(() => {
            const boardSettings = document.querySelector("#dasher_app .sub.board.d2");
            if (boardSettings && !boardSettings.dataset.tmInjected) {
                boardSettings.dataset.tmInjected = "true";

                const uiContainer = document.createElement("div");
                uiContainer.style.marginTop = "10px";

                const title = document.createElement("div");
                title.textContent = "🎨 Board Color Controls";
                title.style.fontWeight = "bold";
                title.style.marginBottom = "6px";
                title.style.color = "var(--text)";
                uiContainer.appendChild(title);

                buildUI(uiContainer);

                const boardGrid = boardSettings.querySelector(".list");
                if (boardGrid) {
                    boardSettings.insertBefore(uiContainer, boardGrid);
                } else {
                    boardSettings.appendChild(uiContainer);
                }

                applyProfileToUI(getActiveProfile());
                updateTheme();
            }
        });

        waitForElement("#dasher_app", (dasherApp) => {
            observer.observe(dasherApp, { childList: true, subtree: true });
        });

        waitForElement("cg-board", (boardElem) => {
            const boardObserver = new MutationObserver(() => {
                updateTheme();
            });
            boardObserver.observe(boardElem.parentElement, { childList: true, subtree: true });
            updateTheme();
        });
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        main();
    } else {
        document.addEventListener("DOMContentLoaded", main);
    }
})();