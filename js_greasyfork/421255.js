// ==UserScript==
// @name        Disable WebGL API
// @description Disables WebGL support, keeping only basic 2D canvas. That reduces potential exploits via OpenGL and broken drivers but can break many websites requiring OpenGL. Some most common ones are excluded. 
// @namespace   disablewebglapi
// @author      k3abird
// @include     *
// @exclude     https://*.google.com/*
// @exclude     https://github.com/*
// @exclude     https://www.shadertoy.com/*
// @exclude     https://www.youtube.com/*
// @version     1.0
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/421255/Disable%20WebGL%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/421255/Disable%20WebGL%20API.meta.js
// ==/UserScript==
(function() {
    console.log("disable-webgl-api: will remove canvas and webGL support");

    const kb_canvas_getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(name) {
        if (name == "webgl" || name == "experimental-webgl" || name == "webgl2") {
            console.log("disable-webgl-api: disabled "+name)
            return null;
        }
        console.log("disable-webgl-api: allowing context of type "+name)
        return kb_canvas_getContext.apply(this, arguments);
    }
})();
