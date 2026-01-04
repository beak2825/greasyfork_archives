// ==UserScript==
// @name Arras.io Invisible Viewer Script
// @description Makes invisible tanks detected my memory more easy to see. Uses Arras Memory Analyzer.
// @match *://arras.io/*
// @version 0.0.1.20221125145843
// @namespace https://greasyfork.org/users/812261
// @downloadURL https://update.greasyfork.org/scripts/455405/Arrasio%20Invisible%20Viewer%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/455405/Arrasio%20Invisible%20Viewer%20Script.meta.js
// ==/UserScript==
requestAnimationFrame(function run() {
    let c = DMA.scan.f64(24.125);
    for (let count = 0; count < c.length; count++) {
        if (DMA.$(c[count] - 8).f64 < 0.5) {
            DMA.$(c[count] - 8).f64 = 0.5
        }
    }
    requestAnimationFrame(run);
});