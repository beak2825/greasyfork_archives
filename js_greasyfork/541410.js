// ==UserScript==
// @name         Anti browser virtual machine detection
// @namespace    http://tampermonkey.net/
// @version      2.3
// @author       louk78
// @license      MIT
// @description  Anti-browser virtual machine detection. Some website security systems detect whether the system is a virtual machine, and risk control will be triggered in virtual environments. Developer mode needs to be enabled.
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541410/Anti%20browser%20virtual%20machine%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/541410/Anti%20browser%20virtual%20machine%20detection.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //Here you can customize the graphics card manufacturer and model
    const FAKE_RENDERER = "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 (0x00002705) Direct3D11 vs_5_0 ps_5_0, D3D11)";
    const FAKE_VENDOR = "Google Inc. (NVIDIA)";
    let forgedMemory = 16; 
    let forgedCores = 8; 
    let forgedWidth = 1920;
    let forgedHeight = 1080;
    let forgedDpr = 1.875;

    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    const originalGetExtension = WebGLRenderingContext.prototype.getExtension;

    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
        if (type === 'webgl' || type === 'webgl2') {
            const gl = originalGetContext.apply(this, arguments);
            if (!gl)
                return null;

            gl.getExtension = function (name) {
                const extension = originalGetExtension.apply(this, arguments);
                if (name === 'WEBGL_debug_renderer_info') {
                    return {
                        UNMASKED_RENDERER_WEBGL: 0x9246,
                        UNMASKED_VENDOR_WEBGL: 0x9245,
                        __proto__: extension
                    };
                }
                return extension;
            };

            gl.getParameter = function (pname) {
                if (pname === 0x9246)
                    return FAKE_RENDERER;
                if (pname === 0x9245)
                    return FAKE_VENDOR;
                return originalGetParameter.apply(this, arguments);
            };

            return gl;
        }
        return originalGetContext.apply(this, arguments);
    };

    Object.defineProperty(navigator, 'deviceMemory', {
        value: forgedMemory,
        writable: false,
        configurable: false,
        enumerable: true
    });

    Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: forgedCores,
        writable: false,
        configurable: false,
        enumerable: true
    });

    Object.defineProperty(screen, 'width', {
        value: forgedWidth,
        writable: false,
        configurable: false,
        enumerable: true
    });

    Object.defineProperty(screen, 'height', {
        value: forgedHeight,
        writable: false,
        configurable: false,
        enumerable: true
    });


    Object.defineProperty(window, 'devicePixelRatio', {
        value: parseFloat(dpr),
        writable: false,
        configurable: false,
        enumerable: true
    });

})();
