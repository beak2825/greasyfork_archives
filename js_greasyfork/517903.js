// ==UserScript==
// @name         Narrow.one King
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Player ESP
// @author       November2246
// @match        https://narrow.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=narrow.one
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/517903/Narrowone%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/517903/Narrowone%20King.meta.js
// ==/UserScript==

Object.defineProperty(Object.prototype, 'name', {
    get() {
        return this._name;
    },
    set(v) {
        this._name = v;
        if (v === 'player') {
            removeDepthTest(this.material);
        }
    }
});

function removeDepthTest(material) {
    if (!material) return;
    if (Array.isArray(material)) {
        material.forEach(mat => removeDepthTest(mat));
    } else {
        material.depthTest = false;
    }
}