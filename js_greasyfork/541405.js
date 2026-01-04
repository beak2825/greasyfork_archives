// ==UserScript==
// @name         反浏览器虚拟机检测
// @namespace    http://tampermonkey.net/
// @version      2.2
// @author       louk78
// @license      MIT
// @description  反浏览器虚拟机检测，有些网站安全系统会检测系统是否虚拟机，如在虚拟机会启动风控，需要启用开发者模式
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541405/%E5%8F%8D%E6%B5%8F%E8%A7%88%E5%99%A8%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541405/%E5%8F%8D%E6%B5%8F%E8%A7%88%E5%99%A8%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //这里可以自己定义显卡的生产商和显卡型号
    const FAKE_RENDERER = "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 (0x00002705) Direct3D11 vs_5_0 ps_5_0, D3D11)";
    const FAKE_VENDOR = "Google Inc. (NVIDIA)";
    // 默认伪造值
    let forgedMemory = 16; // GB
    let forgedCores = 8; // 核心数
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

    // 伪造设备像素比
    Object.defineProperty(window, 'devicePixelRatio', {
        value: parseFloat(dpr),
        writable: false,
        configurable: false,
        enumerable: true
    });

})();
