// ==UserScript==
// @name         Surviv.io FPS Booster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script will help the game can have the highest FPS that your device can
// @author       vnbpm YT
// @license MIT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446490/Survivio%20FPS%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/446490/Survivio%20FPS%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

(function () {
    unsafeWindow.hookScene = function () {
        BABYLON.Scene = new Proxy(BABYLON.Scene, {
            construct: function (func, args) {
                const product = new func(...args);

                ["probesEnabled", "particlesEnabled", "texturesEnabled", "fogEnabled", "lightsEnabled", "postProcessesEnabled", "lensFlaresEnabled", "renderTargetsEnabled", "shadowsEnabled", "proceduralTexturesEnabled"].forEach(a => Object.defineProperty(product, a, {
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
            if (arguments[1] && arguments[1].includes("src/shellshock.js")) {
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
})();