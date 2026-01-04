// ==UserScript==
// @name         Apes.io King
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simple ESP for apes.io
// @author       November2246
// @match        https://apes.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apes.io
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/534856/Apesio%20King.user.js
// @updateURL https://update.greasyfork.org/scripts/534856/Apesio%20King.meta.js
// ==/UserScript==

const WebGL = WebGL2RenderingContext.prototype;
WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
    apply(target, thisArgs, args) {
        let [shader, src] = args;
        if (src.includes('gl_Position = u_mvp * vertexPos;') && src.includes('write_gbuffer_ape') && (src.includes('#define MAX_BONES') || src.includes('u_boneMatrices'))) {
            src = src.replace('gl_Position = u_mvp * vertexPos;', 'gl_Position = u_mvp * vertexPos;\ngl_Position.z *= 0.75;');
        }
        args[1] = src;
        return Reflect.apply(...arguments);
    }
});