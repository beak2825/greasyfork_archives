// ==UserScript==
// @name         Fog Mod for Shell Shockers
// @version      0.2
// @author       A3+++
// @description  Adjust Density and Color of the Fog in shell shockers!
// @match        *://shellshock.io/*
// @run-at       document-start
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/815159
// @downloadURL https://update.greasyfork.org/scripts/432575/Fog%20Mod%20for%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/432575/Fog%20Mod%20for%20Shell%20Shockers.meta.js
// ==/UserScript==

(function () {
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : null;
    }
    const savedData = [0.01, "#FFFFFF", {}, null, null, null];

    unsafeWindow.adjustObj = function (e) {

        savedData[2] = e;
        savedData[0] = savedData[2].fogDensity;
        savedData[1] = savedData[2].fogColor;

        savedData[3].innerText = savedData[0];
        savedData[4].value = savedData[0];
        savedData[5].value = savedData[1].toHexString();

    }
    unsafeWindow.reset = function () {
        savedData[2].fogDensity = savedData[0];
        savedData[3].innerText = savedData[2].fogDensity;
        savedData[4].value = savedData[2].fogDensity;

        savedData[2].fogColor = savedData[1];
        savedData[5].value = savedData[1].toHexString();
    }
    unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
        constructor() {
            super(...arguments);
        }
        open() {
            if (arguments[1] && arguments[1].includes("js/shellshock.js")) {
                this.scriptMatch = true;
            }

            super.open(...arguments);
        }
        get response() {

            if (this.scriptMatch) {
                let responseText = super.response;

                let match = responseText.match(/([A-z][A-z])\.fogDensity=.01\);/);
                if (match) responseText = responseText.replace(match[0], match[0] + `window.adjustObj(${match[1]});`);
                return responseText;
            }
            return super.response;
        }
    };


    let html = [`<div class="slidecontainer"><p>Fog Density: <span id="fogDisplay"></span></p><input type="range" min="0" max="1" step="0.0001" value="0.001" class="slider" id="fogSlider"></p></div>`,
        `<div><p>Fog Color: <input type="color" value="#0000ff" id="colorPicker"></div>`,
        `<div class="btn-container"><button id='resetBtn' onclick='window.reset()' class="ss_button btn_small btn_pink bevel_yolk"><center>Reset</center></button></div>`
    ].join();

    let interval = setInterval(function () {
        let pauseButtons = document.getElementById("pauseButtons");
        if (pauseButtons) {
            clearInterval(interval);
            let fogDiv = document.createElement("div");
            fogDiv.innerHTML = '<br>' + html;
            pauseButtons.appendChild(fogDiv);


            savedData[3] = document.getElementById("fogDisplay");
            savedData[4] = document.getElementById("fogSlider");
            savedData[5] = document.getElementById("colorPicker");

            savedData[3].innerText = savedData[0];

            savedData[4].addEventListener("input",  function () {
                let newFog = parseFloat(this.value);
                savedData[3].innerText = newFog;
                savedData[2].fogDensity = newFog;
            });
            savedData[5].addEventListener("input", function () {
                savedData[2].fogColor = hexToRgb(this.value);
            });

        }

    }, 1000);
}())
