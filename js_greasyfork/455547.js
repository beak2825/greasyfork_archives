// ==UserScript==
// @name         AMD FidelityFX™
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  AMD FidelityFX™ for Video
// @author       TGSAN
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/455547/AMD%20FidelityFX%E2%84%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/455547/AMD%20FidelityFX%E2%84%A2.meta.js
// ==/UserScript==

let hasLoaded = false;
(function() {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[AMD FidelityFX™] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[AMD FidelityFX™] use window mode (your userscript extensions not support unsafeWindow)");
    }

    if (window.AMDFidelityFXHasLoaded) {
        return;
    }
    window.AMDFidelityFXHasLoaded = true;

    let menuCommandList = [];
    let testVideo = windowCtx.document.createElement("video");
    let supportedVideoProcessingTypes = testVideo.msGetVideoProcessingTypes();
    function changeVideoProcessing() {
        let selected = GM_getValue("MS_VIDEO_PROCESSING");
        let tags = windowCtx.document.getElementsByTagName("video");
        for(let i = 0; i < tags.length; i++) {
            if (tags[i].msVideoProcessing != selected) {
                tags[i].msVideoProcessing = selected;
            }
        }
    }
    function checkHardwareRenderer() {
        let canvas = windowCtx.document.createElement('canvas');
        let isHardwareRenderer = false;
        try {
            let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer.toString().toLowerCase().indexOf("swiftshader") === -1) {
                isHardwareRenderer = true;
            }
        } catch (e) {
        }
        return isHardwareRenderer;
    }
    function checkSelected(type) {
        let selected = GM_getValue("MS_VIDEO_PROCESSING");
        if (type == "default" && !selected) {
            return true;
        }
        return type == selected;
    }
    function registerSelectableVideoProcessingMenuCommand(name, type) {
        return GM_registerMenuCommand((checkSelected(type) ? "✅" : "🔲") + " " + name, function() {
            GM_setValue("MS_VIDEO_PROCESSING", type);
            changeVideoProcessing();
            updateMenuCommand();
        });
    }
    async function updateMenuCommand() {
        for(let command of menuCommandList) {
            await GM_unregisterMenuCommand(command);
        }
        menuCommandList = [];
        if (windowCtx.HTMLVideoElement.prototype.hasOwnProperty("msGetVideoProcessingTypes") && windowCtx.HTMLVideoElement.prototype.hasOwnProperty("msVideoProcessing")) {
            if (checkHardwareRenderer()) {
                menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("原始画面", "default"));
                if (supportedVideoProcessingTypes.includes("msSuperResolution")) {
                    menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("Microsoft Super Resolution", "msSuperResolution"));
                }
                if (supportedVideoProcessingTypes.includes("msGraphicsDriverEnhancement")) {
                    menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("NVIDIA RTX Video Super Resolution", "msGraphicsDriverEnhancement"));
                }
                if (supportedVideoProcessingTypes.includes("fsr")) {
                    menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("FidelityFX™ Super Resolution", "fsr"));
                }
                if (supportedVideoProcessingTypes.includes("cas")) {
                    menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("FidelityFX™ CAS Low", "cas:0.1"));
                    menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("FidelityFX™ CAS Medium", "cas:0.5"));
                    menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("FidelityFX™ CAS High", "cas:0.8"));
                    menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("FidelityFX™ CAS Super", "cas:1.0"));
                }
            } else {
                menuCommandList.push(await GM_registerMenuCommand("浏览器未开启硬件加速", function() {
                    alert("浏览器未开启硬件加速，可能未安装显卡或显卡驱动，也可能是在浏览器设置中关闭了\"使用硬件加速\"");
                }));
            }
        } else {
            menuCommandList.push(await GM_registerMenuCommand("此浏览器不支持 AMD FidelityFX™ 技术", function() {
                alert("此浏览器不支持 AMD FidelityFX 技术\r\n\r\n需要使用 Windows 版 Microsoft Edge 浏览器");
            }));
        }
    }
    setInterval(() => {
        changeVideoProcessing();
    }, 2500);
    windowCtx.document.addEventListener("readystatechange", (event) => {
        // 防止双重载入（第二次一般不会有interactive，直接complete）
        if (event.target.readyState === "interactive") {
            // 防止在框架内再次载入
            if (!windowCtx.frameElement) {
                if (!hasLoaded) {
                    hasLoaded = true;
                    updateMenuCommand();
                }
            }
        }
    });

})();