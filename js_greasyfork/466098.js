// ==UserScript==
// @name         Bonk resolution setter
// @version      0.3
// @author       Salama
// @description  Adds a resolution setter box to the settings
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/466098/Bonk%20resolution%20setter.user.js
// @updateURL https://update.greasyfork.org/scripts/466098/Bonk%20resolution%20setter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let newResolution = null;
    let maxResolution = window.parent.devicePixelRatio;
    let resolutionScale = 1/maxResolution;
    window.devicePixelRatio = localStorage.getItem("salamaResolution") || window.devicePixelRatio;
    let setting = document.createElement("div");
    document.getElementById("settingsContainer").appendChild(setting);
    setting.outerHTML = `
<div id="salama_resolution" style="
    top: 345px;
    left: 255px;
    position: absolute;
    display: flex;
    font-family: futurept_b1;
">
    <div style="
        margin-right: 10px;
    ">Quality [20-100]</div>
    <input id="salama_resolution_input" class="mapeditor_field fieldShadow" value="${window.devicePixelRatio * 100}" autocomplete="off">
</div>`;
    document.getElementById("salama_resolution_input").addEventListener("change", e => {
        let v = e.target.value;
        if(v < 20) v = 20;
        if(v > maxResolution * 100 * resolutionScale) v = maxResolution * 100 * resolutionScale;
        newResolution = v / (100 * resolutionScale);
        e.target.value = v;
    });
    document.getElementById("settings_saveButton").addEventListener("click", e => {
        if(newResolution) {
            window.devicePixelRatio = newResolution;
            localStorage.setItem("salamaResolution", window.devicePixelRatio);
            newResolution = null;
            // This needs to change to reload graphics
            let old = document.getElementById("settings_graphicsquality").selectedIndex;
            document.getElementById("settings_graphicsquality").selectedIndex = (old === 2 ? 0 : 2);
            document.getElementById("settings_graphicsquality").onchange();
            e.target.click();
            document.getElementById("settings_graphicsquality").selectedIndex = old;
            document.getElementById("settings_graphicsquality").onchange();
        }
    });
})();