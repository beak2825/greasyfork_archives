// ==UserScript==
// @name         Web Features Disabler
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用于禁用某些 Web 功能
// @author       TGSAN
// @include      /.*/
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/537718/Web%20Features%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/537718/Web%20Features%20Disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[Web Features Disabler] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[Web Features Disabler] use window mode (your userscript extensions not support unsafeWindow)");
    }

    let WEB_FEATURES_DISABLER_GLOBAL_OPTIONS = {
        webgl: false,
        webgpu: false,
        wasm: false,
        webcodec: false,
    };

    const menuItems = [
        ["webgl", "禁用 WebGL"],
        ["webgpu", "禁用 WebGPU"],
        ["wasm", "禁用 WebAssembly"],
        ["webcodec", "禁用 WebCodec"],
    ];

    let menuCommandList = [];

    // Your code here...

    async function init() {
        await loadOptions();
        if (WEB_FEATURES_DISABLER_GLOBAL_OPTIONS.webgpu) {
            Object.defineProperty(windowCtx.navigator, 'gpu', {
                value: undefined
            });
        }
        if (WEB_FEATURES_DISABLER_GLOBAL_OPTIONS.webgl) {
            windowCtx.HTMLCanvasElement.prototype.originalGetContextWebFeaturesDisabler = windowCtx.HTMLCanvasElement.prototype.getContext;
            windowCtx.HTMLCanvasElement.prototype.getContext = function(...args) {
                if (args[0] == "webgl") {
                    return undefined;
                }
            }
        }
        if (WEB_FEATURES_DISABLER_GLOBAL_OPTIONS.wasm) {
            delete windowCtx.WebAssembly;
        }
        if (WEB_FEATURES_DISABLER_GLOBAL_OPTIONS.webcodec) {
			delete windowCtx.VideoDecoder;
            delete windowCtx.AudioDecoder;
		}
    }

    async function checkSelected(type) {
        let selected = await GM_getValue("WEB_FEATURES_DISABLER_" + type);
        if (typeof selected == "boolean") {
            return selected;
        } else {
            return WEB_FEATURES_DISABLER_GLOBAL_OPTIONS[type];
        }
    }

    async function loadOptions() {
        for (let menuItem of menuItems) {
            let type = menuItem[0];
            let selected = await checkSelected(type);
            WEB_FEATURES_DISABLER_GLOBAL_OPTIONS[type] = selected;
        }
    }

    async function registerSelectableVideoProcessingMenuCommand(name, type) {
        let selected = await checkSelected(type);
        WEB_FEATURES_DISABLER_GLOBAL_OPTIONS[type] = selected;
        return await GM_registerMenuCommand((await checkSelected(type) ? "✅" : "🔲") + " " + name, async function () {
            await GM_setValue("WEB_FEATURES_DISABLER_" + type, !selected);
            WEB_FEATURES_DISABLER_GLOBAL_OPTIONS[type] = !selected;
            updateMenuCommand();
        });
    }

    async function updateMenuCommand() {
        for (let command of menuCommandList) {
            await GM_unregisterMenuCommand(command);
        }
        menuCommandList = [];
        for (let menuItem of menuItems) {
            menuCommandList.push(await registerSelectableVideoProcessingMenuCommand(menuItem[1], menuItem[0]));
        }
    }

    init();
    updateMenuCommand();
})();