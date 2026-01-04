// ==UserScript==
// @name         Fps
// @namespace    ok
// @version      3.4
// @description  idk
// @author       Umeyr
// @match        zombs.io
// @license      umeyr
// @icon         https://i.pinimg.com/736x/15/16/ce/1516cef68f1e859003a73508d3dcd899.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461048/Fps.user.js
// @updateURL https://update.greasyfork.org/scripts/461048/Fps.meta.js
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
        dimension = Math.min(dimension + 0.01);
        onWindowResize();
    } else if (e.deltaY < 0) {
        dimension = Math.max(0.1, dimension - 0.01);
        onWindowResize();
    }
}
// rendering code
window.SRG = () => {
    window.sub = !window.sub;
    if (window.sub) {
        game.renderer.ground.setVisible(false)

    } else {
        game.renderer.ground.setVisible(true)


    }
}
game.network.addRpcHandler("ReceiveChatMessage", e => {
    if(e.message == "!ground") {
        window.a = ! window.a;
        window.SRG();
        game.ui.components.PopupOverlay.showHint(`Ground Toggle is Now ${window.a}`);
    };
    if(e.message == "!npc") {
        window.b = ! window.b;
        window.SRN();
        game.ui.components.PopupOverlay.showHint(`NPC's toggle is Now ${window.b}`);
    };
    if(e.message == "!env") {
        window.c = ! window.c;
        window.SRE();
        game.ui.components.PopupOverlay.showHint(`Enviroment Toggle is Now ${window.c}`);
    };
    if(e.message == "!proj") {
        window.d = ! window.d;
        window.SRP();
    };

    if(e.message == "!everything") {
        window.e = ! window.e;
        window.SREV();
        game.ui.components.PopupOverlay.showHint(`Everything Toggle is Now ${window.e}`);
    };

});