// ==UserScript==
// @name         Sky Color by CN Clan (improved)
// @namespace    http://tampermonkey.net/
// @version      2025-02-02
// @description  fixed the bug;p
// @author       intdgy
// @match        https://narrow.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=narrow.one
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538316/Sky%20Color%20by%20CN%20Clan%20%28improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538316/Sky%20Color%20by%20CN%20Clan%20%28improved%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true;

    function log(...args) {
        if (DEBUG) {
            console.log('[颜色修改器]', ...args);
        }
    }

    const uniformInfo = new Map();
    const TARGET_COLOR = [0, 0, 0]; // 黑色

    // 需要修改的uniform名称
    const TARGET_UNIFORMS = {
        sky: ['skyHighCol', 'skyMidCol', 'skyLowCol'],
        hit: ['hitFlashTimes[0]', 'hitFlashPositions[0]'],
        bow: ['bowMorphAmount']
    };

    let originalFunctions = {
        getContext: HTMLCanvasElement.prototype.getContext,
        getUniformLocation: null,
        uniform3f: null,
        uniform4f: null,
        uniform3fv: null,
        uniform4fv: null
    };

    function handleGetUniformLocation(context) {
        const original = context.getUniformLocation;
        originalFunctions.getUniformLocation = original;

        return function(program, name) {
            const location = original.apply(this, arguments);
            if (location) {
                uniformInfo.set(location, {
                    name: name,
                    type: Object.entries(TARGET_UNIFORMS).find(([type, names]) =>
                        names.includes(name))?.[0] || 'other'
                });
            }
            return location;
        };
    }

    function handleUniform3f(context) {
        const original = context.uniform3f;
        originalFunctions.uniform3f = original;

        return function(location, v1, v2, v3) {
            const info = uniformInfo.get(location);
            if (info && Object.values(TARGET_UNIFORMS).flat().includes(info.name)) {
                log(`修改颜色 [${info.type}]: ${info.name} [${v1}, ${v2}, ${v3}] -> [0,0,0]`);
                return original.call(this, location, ...TARGET_COLOR);
            }
            return original.apply(this, arguments);
        };
    }

    function handleUniform4f(context) {
        const original = context.uniform4f;
        originalFunctions.uniform4f = original;

        return function(location, v1, v2, v3, v4) {
            const info = uniformInfo.get(location);
            if (info && Object.values(TARGET_UNIFORMS).flat().includes(info.name)) {
                log(`修改颜色 [${info.type}]: ${info.name} [${v1}, ${v2}, ${v3}, ${v4}] -> [0,0,0,${v4}]`);
                return original.call(this, location, ...TARGET_COLOR, v4);
            }
            return original.apply(this, arguments);
        };
    }

    function handleUniform3fv(context) {
        const original = context.uniform3fv;
        originalFunctions.uniform3fv = original;

        return function(location, value) {
            const info = uniformInfo.get(location);
            if (info && Object.values(TARGET_UNIFORMS).flat().includes(info.name)) {
                log(`修改颜色 [${info.type}]: ${info.name} [${value}] -> [0,0,0]`);
                return original.call(this, location, new Float32Array(TARGET_COLOR));
            }
            return original.apply(this, arguments);
        };
    }

    function handleUniform4fv(context) {
        const original = context.uniform4fv;
        originalFunctions.uniform4fv = original;

        return function(location, value) {
            const info = uniformInfo.get(location);
            if (info && Object.values(TARGET_UNIFORMS).flat().includes(info.name)) {
                log(`修改颜色 [${info.type}]: ${info.name} [${value}] -> [0,0,0,${value[3]}]`);
                return original.call(this, location, new Float32Array([...TARGET_COLOR, value[3]]));
            }
            return original.apply(this, arguments);
        };
    }

    function hookWebGL() {
        log('开始注入WebGL钩子');

        HTMLCanvasElement.prototype.getContext = function() {
            const context = originalFunctions.getContext.apply(this, arguments);

            if ((arguments[0] === 'webgl' || arguments[0] === 'webgl2') && !context._hooked) {
                log('创建WebGL上下文');

                if (!context._hooked) {
                    context.getUniformLocation = handleGetUniformLocation(context);
                    context.uniform3f = handleUniform3f(context);
                    context.uniform4f = handleUniform4f(context);
                    context.uniform3fv = handleUniform3fv(context);
                    context.uniform4fv = handleUniform4fv(context);
                    context._hooked = true;
                    log('钩子注入完成');
                }
            }

            return context;
        };
    }

    function initialize() {
        try {
            log('脚本开始初始化');
            hookWebGL();

            // 添加调试命令
            unsafeWindow.showModifiedUniforms = function() {
                log('已修改的uniforms:');
                const modified = new Set();
                for (const [_, info] of uniformInfo.entries()) {
                    if (Object.values(TARGET_UNIFORMS).flat().includes(info.name)) {
                        modified.add(`${info.type}: ${info.name}`);
                    }
                }
                modified.forEach(name => log(name));
            };

            log('初始化完成');
        } catch (error) {
            console.error('[颜色修改器] 初始化失败:', error);
        }
    }

    initialize();
})();