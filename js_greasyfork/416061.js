// ==UserScript==
// @name         Zombs.io Zoom
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zoom
// @author       Apex
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416061/Zombsio%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/416061/Zombsio%20Zoom.meta.js
// ==/UserScript==

let dimension = 1;

const onWindowResize = () => {
    const renderer = Game.currentGame.renderer;
    let canvasWidth = window.innerWidth * window.devicePixelRatio;
    let canvasHeight = window.innerHeight * window.devicePixelRatio;
    let ratio = Math.max(canvasWidth / (1920 * dimension), canvasHeight / (1080 * dimension));
    renderer.scale = ratio;
    renderer.entities.setScale(ratio);
    renderer.ui.setScale(ratio);
    renderer.renderer.resize(canvasWidth, canvasHeight);
    renderer.viewport.width = renderer.renderer.width / renderer.scale + 2 * renderer.viewportPadding;
    renderer.viewport.height = renderer.renderer.height / renderer.scale + 2 * renderer.viewportPadding;
}

onWindowResize();

window.onresize = onWindowResize;

window.onwheel = e => {
    if (e.deltaY > 0) {
        dimension = Math.min(1.35, dimension + 0.01);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.1, dimension - 0.01);
        onWindowResize();
    }
}