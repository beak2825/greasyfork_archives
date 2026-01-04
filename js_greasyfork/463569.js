// ==UserScript==
// @name         iGPU Activator
// @name:zh-CN   iGPU Activator
// @version      0.1
// @description  Fix annoying lag for integrated iGPU!
// @description:zh-cn 解决Intel核显导致的浏览器卡顿！
// @author       MapleRecall
// @icon         https://ark.intel.com/etc.clientlibs/settings/wcm/designs/intel/default/resources/favicon-32x32.png
// @match        *://*/*
// @grant        none
// @noframes
// @namespace https://greasyfork.org/users/53
// @downloadURL https://update.greasyfork.org/scripts/463569/iGPU%20Activator.user.js
// @updateURL https://update.greasyfork.org/scripts/463569/iGPU%20Activator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 100000000;
    canvas.style.isolation = "isolate";
    canvas.style.pointerEvents = "none";
    document.body.append(canvas);

    const gl = canvas.getContext("webgl");
    function draw() {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    let drawTimer;
    let idleTimer;
    function stopDraw() {
        canvas.style.display = "none";
        clearTimeout(idleTimer);
        clearInterval(drawTimer);
    }

    function startDraw() {
        stopDraw();
        if (document.hidden || document.fullscreenElement) return;

        canvas.style.display = "";
        drawTimer = setInterval(draw, 200);
    }

    document.addEventListener("visibilitychange", startDraw);
    document.addEventListener("fullscreenchange", startDraw);
    document.addEventListener("mouseenter", startDraw);
    document.addEventListener("mouseleave", () => { idleTimer = setTimeout(stopDraw, 60000) });

    startDraw();
})();