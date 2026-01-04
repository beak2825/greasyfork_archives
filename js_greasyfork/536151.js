// ==UserScript==
// @name         zhihu_force_comment_modal
// @namespace    http://tampermonkey.net/
// @version      2025-05-16
// @description  劫持resource，强制comment通过modal打开!
// @author       https://github.com/Hojondo
// @run-at       document-start
// @match        https://www.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536151/zhihu_force_comment_modal.user.js
// @updateURL https://update.greasyfork.org/scripts/536151/zhihu_force_comment_modal.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
 
    const waitForChunkReady = (maxAttempts = 150, interval = 50) => {
        let attempts = 0;
 
        const tryHook = () => {
            if (window.webpackChunkheifetz) {
                patchWebpackChunkSystem();
                return;
            }
 
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryHook, interval);
            } else {
                console.warn("❌ 未找到 window.webpackChunkheifetz");
            }
        };
 
        tryHook();
    };
 
    const FEATURE_STRING = 'fixed:"modal",bottom:"list"';
 
    const patchWebpackChunkSystem = () => {
        // const chunkKey = Object.keys(window).find(k => k.startsWith("webpackChunk"));
        const globalChunk = window.webpackChunkheifetz;
 
        const originalPush = globalChunk.push;
 
        Object.defineProperty(globalChunk, "push", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: function (args) {
                try {
                    const [chunkId, modules] = args;
 
                    for (const key in modules) {
                        const factory = modules[key];
                        if (
                            typeof factory === "function" &&
                            factory.toString().includes(FEATURE_STRING)
                        ) {
                            // console.log(`🎯 匹配到目标模块 ${key} in chunk ${chunkId}`);
 
                            const wrappedFactory = function (module, exports, require) {
                                factory.call(this, module, exports, require);
 
                                // 截取原始函数引用
                                const original = module.exports.default;
                                if (typeof original === 'function') {
                                    module.exports = {
                                        __esModule: true,
                                        default: function (...args) {
                                            const result = original.apply(this, args);
                                            const props = result?.props;
 
                                            if (props && typeof props === 'object' && 'commentPattern' in props) {
                                                props.commentPattern = 'fixed';
                                                // console.log('✅ 成功注入 commentPattern = "fixed"');
                                            }
 
                                            return result;
                                        }
                                    };
                                }
                            };
 
                            modules[key] = wrappedFactory;
                        }
                    }
                } catch (err) {
                    console.error("❌ Webpack patch error:", err);
                }
 
                return originalPush.call(this, args);
            },
        });
 
        // console.log(
        //     "✅ Webpack chunk push hook injected (default function override)"
        // );
    };
 
    const enableChunkErrorRecovery = () => {
        window.addEventListener("error", function (e) {
            const msg = e?.message || "";
            if (msg.includes("ChunkLoadError") || msg.includes("Loading chunk")) {
                console.warn("💥 Chunk load error detected, reloading...");
                setTimeout(() => location.reload(), 1000);
            }
        });
    };
 
    window.addEventListener("DOMContentLoaded", () => {
        waitForChunkReady();
    });
    enableChunkErrorRecovery();
    /* - close modal by click mask container - */
    document.addEventListener('click', (e) => {
        const referSpanNode = document.querySelector('span[data-focus-scope-start]');
        if(!referSpanNode) return;
        const maskNode = referSpanNode.nextElementSibling.firstChild;
        if (e.target === maskNode) {
            const closeBtn = maskNode.nextElementSibling.lastChild;
            closeBtn.click();
        }
    });
})();
