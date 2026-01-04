// ==UserScript==
// @name         Disable scope (SHELL SHOCKERS)
// @version      0.3
// @description  Removes the black borders that occur whenever you scope in!
// @match        *://shellshock.io/*
// @author       A3+++
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/815159
// @downloadURL https://update.greasyfork.org/scripts/432512/Disable%20scope%20%28SHELL%20SHOCKERS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432512/Disable%20scope%20%28SHELL%20SHOCKERS%29.meta.js
// ==/UserScript==
(function () {
    window.XMLHttpRequest = class extends window.XMLHttpRequest {
        constructor(){super(...arguments)}
        open() {
            if (arguments[1] && arguments[1].includes("js/shellshock.js"))this.scriptMatch = true;
            super.open(...arguments);}
        get response(){
            if (this.scriptMatch) {
                let responseText = super.response;
                let matches = [responseText.match(/.push\((\w+)\),\w+.maxZ=100/),responseText.match(/this.crosshairs.position.z=2/)];
                if (matches[0]) responseText = responseText.replace(matches[0][0], matches[0][0] + `,window.fixCamera(${matches[0][1]})`);
                if (matches[1]) responseText = responseText.replace(matches[1][0], matches[1][0] + `;return`)
                return responseText
            }
            return super.response;
        }
    };
 
    window.fixCamera = function (camera) {
        let border = document.getElementById("scopeBorder");
        Object.defineProperties(camera.viewport, {
            width: {
                set: () => border.style.display = "none",
                get: () => 1
            },
            x: {
                get: () => 0
            }
        });
    }
}())