// ==UserScript==
// @name         Shellshock/Shellshockers FPS Unlocker
// @version      0.1
// @author       Pluh
// @description  CREDITS TO A3+++
// @match        *://shellshock.io/*
// @run-at       document-start
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/en/users/1236917-pluh
// @downloadURL https://update.greasyfork.org/scripts/482760/ShellshockShellshockers%20FPS%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/482760/ShellshockShellshockers%20FPS%20Unlocker.meta.js
// ==/UserScript==
(function () {
    unsafeWindow.hookScene = function () {
        BABYLON.Scene = new Proxy(BABYLON.Scene, {
            construct: function (func, args) {
                const product = new func(...args);
 
                ["probesEnabled", "particlesEnabled", "texturesEnabled", "fogDisabled", "lightsEnabled", "postProcessesEnabled", "lensFlaresEnabled", "renderTargetsEnabled", "shadowsDisabled", "proceduralTexturesEnabled"].forEach(a => Object.defineProperty(product, a, {
                    get: () => false
                }));
 
                return product;
            },
        })
    }
    unsafeWindow.XMLHttpRequest = class extends XMLHttpRequest {
        constructor() {
            super(...arguments)
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
 
                let match = responseText.match(/else console.log\(window\),"undefined"==typeof window\?(\w).BABYLON=(\w\(\w,\w,\w\)).(\w)=\w\(\w,\w,\w\)/);
                if (match) {
                    responseText = responseText.replace(match[0], `else{${match[1]}.BABYLON=${match[2]};${match[3]}=${match[1]}.BABYLON,window.hookScene()}`);
                }
                return responseText;
            }
            return super.response;
        }
    };
}())