// ==UserScript==
// @name         Voxiom.io scary hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  this is a verry scary voxiom.io hack
// @author       Tomask4
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?domain=voxiom.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/453067/Voxiomio%20scary%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/453067/Voxiomio%20scary%20hack.meta.js
// ==/UserScript==
const wireFrame = false

const original_push = Array.prototype.push;
Array.prototype.push = function(...args) {
    original_push.apply(this, args);
    if (args[0] && args[0].material && args[0].type == "SkinnedMesh") {
        if(wireFrame) {args[0].material.wireframe = true}
        args[0].material.alphaTest = 1;
        args[0].material.depthTest = false;
        args[0].material.fog = false;
        args[0].material.color.r = 0;
        args[0].material.color.g = 1;
        args[0].material.color.b = 0;
        console.log(args[0])
    }
}