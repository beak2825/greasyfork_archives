// ==UserScript==
// @name         Get better FPS in shell shockers!
// @version      0.3
// @author       A3+++
// @description  May or may not improve your fps in shell shockers.
// @match        *://shellshock.io/*
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/815159
// @downloadURL https://update.greasyfork.org/scripts/432688/Get%20better%20FPS%20in%20shell%20shockers%21.user.js
// @updateURL https://update.greasyfork.org/scripts/432688/Get%20better%20FPS%20in%20shell%20shockers%21.meta.js
// ==/UserScript==
(function () {
    window.XMLHttpRequest = class extends window.XMLHttpRequest {
        constructor(){super(...arguments) }
        open() {
            if (arguments[1] && arguments[1].includes("js/shellshock.js"))
                this.aaaaa = 1;
            super.open(...arguments);
        }
        get response() {
            if (this.aaaaa) {
                let responseText = super.response;
                let match = responseText.match(/(\w).Skeleton.prototype.disableBlending/);
                if (match) {responseText = responseText.replace(match[0], `(function(babe){babe.Scene = new Proxy(babe.Scene, {construct: function (func, args) {const product = new func(...args);["probesEnabled", "particlesEnabled", "texturesEnabled", "fogEnabled", "lightsEnabled", "postProcessesEnabled", "lensFlaresEnabled", "renderTargetsEnabled", "shadowsEnabled", "proceduralTexturesEnabled"].forEach(a => Object.defineProperty(product, a, {get: () => false}));return product}})}(${match[1]}));${match[0]}`)}
                return responseText;
            }
            return super.response;
        }
    };
}())

