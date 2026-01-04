// ==UserScript==
// @name         EV.io King
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Player ESP, Wireframe
// @author       November2246
// @match        https://ev.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poki.com
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/507216/EVio%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/507216/EVio%20King.meta.js
// ==/UserScript==

const enableESP = true; // Toggle for player ESP
const useColoredESP = true; // Set to false to not color the players
const espColor = [255, 0, 255]; // RGB values to use for colored ESP
const enableWireframe = false; // Toggle for wireframe view

/////

Object.defineProperty(Object.prototype, 'parent', {
    get() {
        return this._parent;
    },
    set(v) {
        this._parent = v;
        if (this.type == 'SkinnedMesh' && (this?.parent?.name === 'body_base_new' || this?.parent?.name === 'Default_Armor')) {
            if (enableESP) {
                setESPMaterial(this);
            }
        } else if (this.material) {
            if (enableWireframe) {
                if (Array.isArray(this.material)) {
                    this.material.forEach(material => {
                        material.wireframe = true;
                    });
                } else {
                    this.material.wireframe = true;
                }
            }
        }
    },
});

let espColorObject;
function setESPMaterial(target) {
    target.material.forEach(material => {
        material.depthTest = false;
        material.transparent = true;

        if (useColoredESP) {
            if (!espColorObject) {
                espColorObject = material.emissive.constructor(...espColor);
            }
            material.emissive = espColorObject;
        }
    });
}