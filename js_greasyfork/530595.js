// ==UserScript==
// @name         反浏览器指纹追踪
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  干扰常见浏览器指纹采集行为，保护隐私
// @author       KevinHu
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530595/%E5%8F%8D%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8C%87%E7%BA%B9%E8%BF%BD%E8%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/530595/%E5%8F%8D%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8C%87%E7%BA%B9%E8%BF%BD%E8%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成随机整数
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 生成随机UserAgent
    const fakeUserAgent = (() => {
        const browsers = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15'
        ];
        const version = `${randomInt(90, 107)}.0.${randomInt(4200, 5300)}.${randomInt(100, 200)}`;
        return browsers[Math.floor(Math.random() * browsers.length)].replace('${version}', version);
    })();

    // 重写Navigator属性
    const overrideNavigator = () => {
        const navigatorProps = {
            userAgent: fakeUserAgent,
            platform: navigator.platform.includes('Win') ? 'Win32' : 'MacIntel',
            language: 'zh-CN',
            languages: ['zh-CN', 'zh'],
            hardwareConcurrency: randomInt(2, 8),
            deviceMemory: randomInt(4, 16),
            maxTouchPoints: 0
        };

        Object.entries(navigatorProps).forEach(([prop, value]) => {
            Object.defineProperty(navigator, prop, {
                value: value,
                writable: false,
                configurable: false
            });
        });
    };

    // 重写Screen属性
    const overrideScreen = () => {
        const screenProps = {
            width: randomInt(1280, 1920),
            height: randomInt(720, 1080),
            colorDepth: 24,
            availWidth: randomInt(1280, 1920),
            availHeight: randomInt(720, 1080)
        };

        Object.entries(screenProps).forEach(([prop, value]) => {
            Object.defineProperty(screen, prop, { value });
        });
    };

    // 处理Canvas指纹
    const overrideCanvas = () => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, attributes) {
            if (type === '2d') {
                const ctx = originalGetContext.call(this, type, attributes);
                const originalFillText = ctx.fillText;
                
                // 干扰文字绘制
                ctx.fillText = function(...args) {
                    args[0] = args[0] + ' ' + Math.random().toString(36).substr(2, 5);
                    return originalFillText.apply(this, args);
                };

                // 干扰toDataURL输出
                const originalToDataURL = ctx.canvas.toDataURL;
                ctx.canvas.toDataURL = function(type, encoderOptions) {
                    const imageData = originalToDataURL.call(this, type, encoderOptions);
                    return type === 'image/jpeg' ? imageData : imageData.split('').reverse().join('');
                };
            }
            return originalGetContext.apply(this, arguments);
        };
    };

    // 处理WebGL指纹
    const overrideWebGL = () => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, attributes) {
            if (type === 'webgl' || type === 'experimental-webgl') {
                const gl = originalGetContext.apply(this, arguments);
                if (!gl) return null;

                const originalGetParameter = gl.getParameter;
                gl.getParameter = function(pname) {
                    // 干扰WebGL参数
                    switch(pname) {
                        case gl.VENDOR:
                        case gl.UNMASKED_VENDOR_WEBGL:
                            return 'FakeVendor';
                        case gl.RENDERER:
                        case gl.UNMASKED_RENDERER_WEBGL:
                            return 'FakeRenderer';
                        default:
                            return originalGetParameter.call(this, pname);
                    }
                };
                return gl;
            }
            return originalGetContext.apply(this, arguments);
        };
    };

    // 执行所有重写
    overrideNavigator();
    overrideScreen();
    overrideCanvas();
    overrideWebGL();

    // 阻止WebRTC泄露真实IP
    window.RTCPeerConnection = undefined;
    window.webkitRTCPeerConnection = undefined;
})();