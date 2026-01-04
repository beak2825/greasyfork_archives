// ==UserScript==
// @name         Voxiom.io Enhanced Experience
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance your Voxiom.io experience
// @author       Tomask4
// @match        *://voxiom.io/*
// @icon         https://www.google.com/s2/favicons?domain=voxiom.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/484104/Voxiomio%20Enhanced%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/484104/Voxiomio%20Enhanced%20Experience.meta.js
// ==/UserScript==

// Enable wireframe mode (true for enabled, false for disabled)
const wireFrameEnabled = false;

// Override Array.prototype.push to customize SkinnedMesh materials
const originalPush = Array.prototype.push;
Array.prototype.push = function (...args) {
    originalPush.apply(this, args);
    if (args[0] && args[0].material && args[0].type === "SkinnedMesh") {
        if (wireFrameEnabled) {
            args[0].material.wireframe = true;
        }
        args[0].material.alphaTest = 1;
        args[0].material.depthTest = false;
        args[0].material.fog = false;
        args[0].material.color.setRGB(1, 0, 0);
        console.log(args[0]);
    }
};
