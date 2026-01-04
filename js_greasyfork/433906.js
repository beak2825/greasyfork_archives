// ==UserScript==
// @name         Change the Sky Color of Shell Shockers
// @version      0.2
// @author       A3+++
// @description  Change the color of the sky in shell shockers!
// @match        *://shellshock.io/*
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/815159
// @downloadURL https://update.greasyfork.org/scripts/433906/Change%20the%20Sky%20Color%20of%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/433906/Change%20the%20Sky%20Color%20of%20Shell%20Shockers.meta.js
// ==/UserScript==

(function () {
    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : null;
    }

    window.data = {
        set scene(e) { this.gameScene = e },
        gameScene: null,
        skyColor: "#FFFFFF",
        mesh: null,
        updateSky: function () {
            if (!this.mesh && this.gameScene) {
                this.mesh = this.gameScene.getMeshByID("skyBox");
            }
            if (this.mesh) {

                const color = hexToRgb(this.skyColor);
                this.mesh.material.emissiveColor.r = color.r;
                this.mesh.material.emissiveColor.g = color.g;
                this.mesh.material.emissiveColor.b = color.b;

                this.mesh.material.reflectionTexture = null;

            }
        }
    }

    window.XMLHttpRequest = class extends window.XMLHttpRequest {
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
                if (match) responseText = responseText.replace(match[0], match[0] + `data.scene=${match[1]};`);
                return responseText;
            }
            return super.response;
        }
    };


    let html = [`<div><p>Sky Color: <input type="color" value="#0000ff" id="colorPicker"></div>`].join();


    let interval = setInterval(function () {
        let pauseButtons = document.getElementById("pauseButtons");
        if (pauseButtons) {
            clearInterval(interval);
            let skyColorDiv = document.createElement("div");
            skyColorDiv.innerHTML = '<br>' + html;
            pauseButtons.appendChild(skyColorDiv);

            let colorPicker = document.getElementById("colorPicker");

            colorPicker.addEventListener("input", function () {
                data.skyColor = this.value;
                data.updateSky()
            });

        }

    }, 1000);
}())