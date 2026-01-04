// ==UserScript==
// @name         Disable WebGL
// @description  Отключает WebGL на всех сайтах
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       M-A-Z-2005
// @include      *
// @license MIT
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/468437/Disable%20WebGL.user.js
// @updateURL https://update.greasyfork.org/scripts/468437/Disable%20WebGL.meta.js
// ==/UserScript==

const nativeCtx = HTMLCanvasElement.prototype.getContext;
unsafeWindow.HTMLCanvasElement.prototype.getContext = function getContext(contextId, attributes) {
    if (contextId == "2d") return nativeCtx.call(this, contextId, attributes);
    else return null;
}