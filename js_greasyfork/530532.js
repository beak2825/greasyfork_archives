// ==UserScript==
// @name         iPhone指纹保护
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  高级随机化浏览器指纹参数
// @author       KevinHu
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530532/iPhone%E6%8C%87%E7%BA%B9%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/530532/iPhone%E6%8C%87%E7%BA%B9%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设备参数池
    const devicePool = {
        models: [
            'iPhone12,1', 'iPhone12,3', 'iPhone12,5',
            'iPhone13,1', 'iPhone13,2', 'iPhone13,4',
            'iPhone14,2', 'iPhone14,3', 'iPhone14,4',
            'iPhone15,2', 'iPhone15,3', 'iPhone15,4',
            'iPhone16,1', 'iPhone16,2'
        ],
        resolutions: [
            [1170, 2532], [1284, 2778], 
            [1179, 2556], [1290, 2796],
            [1200, 2600], [1320, 2850]
        ],
        memories: [4, 6, 8],
        concurrency: [4, 6]
    };

    // 随机参数生成器
    const randomConfig = {
        device: () => ({
            model: devicePool.models[Math.floor(Math.random() * devicePool.models.length)],
            res: devicePool.resolutions[Math.floor(Math.random() * devicePool.resolutions.length)],
            memory: devicePool.memories[Math.floor(Math.random() * devicePool.memories.length)],
            concurrency: devicePool.concurrency[Math.floor(Math.random() * devicePool.concurrency.length)]
        }),
        osVersion: () => {
            const major = Math.floor(Math.random() * 5) + 15; // iOS 15-19
            const minor = Math.floor(Math.random() * 3);
            const patch = Math.floor(Math.random() * 2);
            return `${major}_${minor}_${patch}`;
        },
        webkitVersion: () => 605 + Math.floor(Math.random() * 15),
        fonts: () => {
            const fontLib = ["Helvetica Neue", "Gill Sans", "Menlo", "Arial", 
                            "Georgia", "San Francisco", "New York", "SF Pro"];
            return fontLib.sort(() => Math.random() - 0.5).slice(0, 4);
        }
    };

    // 生成指纹配置
    const generateFingerprint = () => {
        const device = randomConfig.device();
        return {
            userAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS ${randomConfig.osVersion()} like Mac OS X) ` +
                     `AppleWebKit/${randomConfig.webkitVersion()}.1.15 (KHTML, like Gecko) ` +
                     `Version/${randomConfig.webkitVersion() - 600} Mobile/15E148 Safari/${randomConfig.webkitVersion()}`,
            resolution: device.res,
            deviceMemory: device.memory,
            hardwareConcurrency: device.concurrency,
            fonts: randomConfig.fonts()
        };
    };

    // 应用指纹修改
    const applyFingerprint = (() => {
        const fp = generateFingerprint();

        // 屏幕参数修改
        const redefineScreenProp = (prop, value) => {
            Object.defineProperty(window.screen, prop, {
                get: () => value
            });
        };
        redefineScreenProp('width', fp.resolution[0]);
        redefineScreenProp('height', fp.resolution[1]);

        // UserAgent修改
        Object.defineProperty(navigator, 'userAgent', {
            value: fp.userAgent,
            configurable: false,
            writable: false
        });

        // 硬件信息修改
        const redefineNavigatorProp = (prop, value) => {
            Object.defineProperty(navigator, prop, {
                get: () => value,
                configurable: true
            });
        };
        redefineNavigatorProp('deviceMemory', fp.deviceMemory);
        redefineNavigatorProp('hardwareConcurrency', fp.hardwareConcurrency);

        // 字体列表修改
        const originalFontsQuery = navigator.fonts?.query;
        if (originalFontsQuery) {
            navigator.fonts.query = () => Promise.resolve(
                fp.fonts.map(font => new FontFace(font, ''))
            );
        }

        // WebGL指纹保护
        const wrapWebGL = () => {
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                switch(parameter) {
                    case 37445: // UNMASKED_VENDOR_WEBGL
                        return 'Apple Inc.';
                    case 37446: // UNMASKED_RENDERER_WEBGL
                        return 'Apple GPU';
                    default:
                        return getParameter.call(this, parameter);
                }
            };
        };
        wrapWebGL();

        // 音频指纹保护
        const wrapAudioContext = () => {
            const originalCreateOscillator = AudioContext.prototype.createOscillator;
            AudioContext.prototype.createOscillator = function() {
                const oscillator = originalCreateOscillator.call(this);
                oscillator.frequency.setValueAtTime(
                    440 + Math.random() * 200 - 100, 
                    this.currentTime
                );
                return oscillator;
            };
        };
        wrapAudioContext();
    })();

})();