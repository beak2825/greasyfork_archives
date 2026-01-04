// ==UserScript==
// @name         Toggleable (Key V) ESP for Shell Shockers (PROOF OF CONCEPT)
// @version      0.3
// @author       A3+++
// @description  Only to be used for TESTING purposes, in private lobbies.
// @match        https://shellshock.io/*
// @grant        none
// @namespace    https://greasyfork.org/users/815159
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/433187/Toggleable%20%28Key%20V%29%20ESP%20for%20Shell%20Shockers%20%28PROOF%20OF%20CONCEPT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433187/Toggleable%20%28Key%20V%29%20ESP%20for%20Shell%20Shockers%20%28PROOF%20OF%20CONCEPT%29.meta.js
// ==/UserScript==

(function () {
    "use strict"
    window.espEnabled = false;
    window.espKey = "V";
    window.addEventListener("keydown", function (e) {
        if (extern.inGame) {
            if (e.key.toUpperCase() == window.espKey) {
                window.espEnabled = !window.espEnabled
            }
        } else {
            window.espEnabled = false
        }
    })
    XMLHttpRequest = class extends XMLHttpRequest {
        constructor() {
            super(...arguments)
        }
        open() {
            if (arguments[1] && arguments[1].includes("js/shellshock.js")) {
                this.scriptMatch = true;
                window[atob("Y29uc29sZQ==")]["log"](atob('RVNQIElOIFVTRS4='));
            }

            super.open(...arguments)
        }
        get response() {
            if (this.scriptMatch) {
                let responseText = super.response;
                responseText = responseText.replace(/.prototype.setVisible=function\(\w\){/, `.prototype.setVisible=function(eee){asda=document;arguments[0]=true;asda.title=atob('U2hlbGwgU2hvY2tlcnMgfCBBbHQgVVJMOiBFU1AgSU4gVVNF');this.getChildTransformNodes().forEach(child=>child.setRenderingGroupId&&child.setRenderingGroupId(window.espEnabled?1:0));`);

                return responseText;
            }
            return super.response;
        }
    };
}())