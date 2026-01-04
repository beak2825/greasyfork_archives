// ==UserScript==
// @name         Evades.io FPSboost ForBetterPcs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Should make fps more stable, allows playing zoomed out (higher resolution) (ctrl and -) without lag
// @author       JoniJoni
// @match        *://evades.io/*
// @match        *://evades.online/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542003/Evadesio%20FPSboost%20ForBetterPcs.user.js
// @updateURL https://update.greasyfork.org/scripts/542003/Evadesio%20FPSboost%20ForBetterPcs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('[UltraFPS]', ...args);

    const patchWebGL = () => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;

        HTMLCanvasElement.prototype.getContext = function (type, attrs = {}) {
            if (type !== 'webgl' && type !== 'experimental-webgl') {
                return originalGetContext.call(this, type, attrs);
            }

            Object.assign(attrs, {
                alpha: false,
                antialias: false,
                depth: false,
                stencil: false,
                preserveDrawingBuffer: false,
            });

            const ctx = originalGetContext.call(this, type, attrs);
            if (!ctx) return ctx;

            log('WebGL context hijacked: apocalypse mode enabled');

            const originalShaderSource = ctx.shaderSource;
            ctx.shaderSource = function (shader, source) {
                if (/glow|blur|light|bloom|fog|shadow|tone|post|fx|vignette|transition/i.test(source)) {
                    log('⛔ Shader nuked');
                    return;
                }
                return originalShaderSource.call(this, shader, source);
            };

            const originalDrawElements = ctx.drawElements;
            ctx.drawElements = function (mode, count, ...rest) {
                if (count < 1200) return; 
                return originalDrawElements.call(this, mode, count, ...rest);
            };

            const originalDrawArrays = ctx.drawArrays;
            ctx.drawArrays = function (mode, first, count) {
                if (count < 8) return;
                return originalDrawArrays.call(this, mode, first, count);
            };

            const originalEnable = ctx.enable;
            ctx.enable = function (cap) {
                const killList = [
                    ctx.BLEND,
                    ctx.DITHER,
                    ctx.DEPTH_TEST,
                    ctx.STENCIL_TEST,
                    ctx.SAMPLE_COVERAGE,
                    ctx.SAMPLE_ALPHA_TO_COVERAGE,
                ];
                if (killList.includes(cap)) return;
                return originalEnable.call(this, cap);
            };

            const blockedUniforms = ["light", "shadow", "glow", "fog", "tone", "bloom", "vignette", "fx"];
            const wrapUniform = (name) => {
                const original = ctx[name];
                ctx[name] = function (...args) {
                    try {
                        const loc = args[0];
                        const program = ctx.getParameter(ctx.CURRENT_PROGRAM);
                        const info = ctx.getActiveUniform?.(program, loc);
                        if (info && blockedUniforms.some(k => info.name.toLowerCase().includes(k))) {
                            return;
                        }
                    } catch (_) {}
                    return original.apply(this, args);
                };
            };
            ['uniform1f', 'uniform1i', 'uniform2f', 'uniform3f', 'uniform4f'].forEach(wrapUniform);

            return ctx;
        };
    };

    const init = () => {
        patchWebGL();
    };

    window.addEventListener('load', () => {
        setTimeout(init, 300); 
    });
})();



//turtleeeeeeeeeee