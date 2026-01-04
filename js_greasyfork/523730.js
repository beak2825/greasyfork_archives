// ==UserScript==
// @name         Advanced Anti-Fingerprinting Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       saiHy
// @description  Advanced measures to reduce browser fingerprinting
// @match        *://*/*
// @grant        none
// @license     MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523730/Advanced%20Anti-Fingerprinting%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/523730/Advanced%20Anti-Fingerprinting%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 扩展 Canvas 防护
    function advancedCanvasProtection() {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, contextAttributes) {
            const ctx = originalGetContext.call(this, type, contextAttributes);
            if (ctx) {
                const randomOffset = Math.random() * 100;
                const randomFactor = Math.random();
                ['save', 'restore', 'fillRect', 'strokeRect', 'clearRect', 'fill', 'stroke', 'fillText', 'strokeText'].forEach(method => {
                    const originalMethod = ctx[method];
                    ctx[method] = function(...args) {
                        if (method.includes('Text')) {
                            args[1] += randomOffset; // 改变文本位置
                            args[2] += randomOffset;
                        } else if (method.includes('Rect')) {
                            args[1] += randomOffset * randomFactor; // 改变矩形位置
                            args[2] += randomOffset * randomFactor;
                            args[3] *= randomFactor; // 改变大小
                            args[4] *= randomFactor;
                        }
                        return originalMethod.apply(this, args);
                    };
                });
            }
            return ctx;
        };
    }

    // 增强 WebGL 防护
    function advancedWebGLProtection() {
        try {
            const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(param) {
                // 提供通用或随机化的信息
                switch(param) {
                    case 0x9245: // WebGL_VERSION
                        return 'WebGL 1.0';
                    case 0x8B31: // RENDERER
                        return 'Generic GPU';
                    case 0x8B30: // VENDOR
                        return 'Anonymous Vendor';
                    case 0x9242: // SHADING_LANGUAGE_VERSION
                        return 'WebGL GLSL ES 1.0';
                    case 0x9246: // UNMASKED_VENDOR_WEBGL
                    case 0x9247: // UNMASKED_RENDERER_WEBGL
                        return 'Anonymous';
                    default:
                        return originalGetParameter.call(this, param);
                }
            };

            // 屏蔽更多 WebGL 扩展
            const originalGetExtension = WebGLRenderingContext.prototype.getExtension;
            WebGLRenderingContext.prototype.getExtension = function(name) {
                if (['WEBGL_debug_renderer_info', 'WEBGL_compressed_texture_s3tc', 'WEBGL_depth_texture'].includes(name)) return null;
                return originalGetExtension.call(this, name);
            };
        } catch (e) {} // 如果不支持 WebGL 则忽略错误
    }

    // 进一步混淆浏览器信息
    function furtherObscureBrowserInfo() {
        // 语言信息
        Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

        // 时区
        const offset = -new Date().getTimezoneOffset() / 60;
        Object.defineProperty(Intl, 'DateTimeFormat', {
            value: function() {
                return {
                    resolvedOptions: () => ({
                        timeZone: 'UTC'
                    })
                };
            }
        });

        // 插件信息
        Object.defineProperty(navigator, 'plugins', { get: () => [{ name: 'Generic Plugin', description: 'Generic Plugin' }] });

        // 字体
        const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;
        CanvasRenderingContext2D.prototype.measureText = function() {
            const result = originalMeasureText.apply(this, arguments);
            result.width = 100 * Math.random(); // 随机化文本宽度
            return result;
        };

        // 屏幕尺寸
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        Object.defineProperty(window.screen, 'width', { get: () => Math.floor(screenWidth / 100) * 100 });
        Object.defineProperty(window.screen, 'height', { get: () => Math.floor(screenHeight / 100) * 100 });

        // 硬件并发数
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); // 假设所有人都有4核

        // 浏览器特性
        Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
        Object.defineProperty(navigator, 'appVersion', { get: () => '5.0 (Windows)' });
        Object.defineProperty(navigator, 'userAgent', { get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36' });
    }

    // 执行所有防护措施
    advancedCanvasProtection();
    advancedWebGLProtection();
    furtherObscureBrowserInfo();

})();