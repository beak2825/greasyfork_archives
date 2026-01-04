// ==UserScript==
// @name         AURA CLIENT Universal Wireframe
// @description  Adds a wireframe view mode to most unity games
// @author       AURA CLIENT
// @match        *://*deadshot.io/*
// @match        *://*cryzen.io/*
// @match        *://*kirka.io/*
// @match        *://*kour.io/*
// @match        *://*narrow.one/*
// @match        *://*.io/*
// @license      MIT
// @run-at       document-start
// @version 0.0.1.20250728180343
// @namespace https://greasyfork.org/users/1499252
// @downloadURL https://update.greasyfork.org/scripts/543908/AURA%20CLIENT%20Universal%20Wireframe.user.js
// @updateURL https://update.greasyfork.org/scripts/543908/AURA%20CLIENT%20Universal%20Wireframe.meta.js
// ==/UserScript==

const settings = {
    wireframe: false,
};


const WebGL = WebGL2RenderingContext.prototype;


HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
    apply(target, thisArgs, args) {
        if (args[1]) {
            args[1].preserveDrawingBuffer = false;
        }
        return Reflect.apply(...arguments);
    }
});

const handler = {
    apply(target, thisArgs, args) {
        const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
        args[0] = settings.wireframe && !program.isUIProgram && args[1] > 6 ? thisArgs.LINES : args[0];
        try {
            return Reflect.apply(...arguments);
        } catch (error) {
            console.error('Drawing elements failed:', error);
        }
    }
};

WebGL.drawElements = new Proxy(WebGL.drawElements, handler);
WebGL.drawElementsInstanced = new Proxy(WebGL.drawElementsInstanced, handler);

window.addEventListener('keyup', function (event) {
    if (document.activeElement && document.activeElement.value !== undefined) return;
    if (event.code === 'KeyQ') {
        settings.wireframe = !settings.wireframe;
    }
});
