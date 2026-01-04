// ==UserScript==
// @name         B站直播低延迟
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  降低B站直播延迟
// @author       TGSAN
// @match        *://live.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/474269/B%E7%AB%99%E7%9B%B4%E6%92%AD%E4%BD%8E%E5%BB%B6%E8%BF%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/474269/B%E7%AB%99%E7%9B%B4%E6%92%AD%E4%BD%8E%E5%BB%B6%E8%BF%9F.meta.js
// ==/UserScript==

let hasLoaded = false;
(function () {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[Live Buffer Skip] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[Live Buffer Skip] use window mode (your userscript extensions not support unsafeWindow)");
    }

    if (window.BILILIVEBUFFERSKIPHasLoaded) {
        return;
    }
    window.BILILIVEBUFFERSKIPHasLoaded = true;

    let menuCommandList = [];
    function doSkipBuffer() {
        let selected = GM_getValue("BILI_LIVE_BUFFERSKIP");
        let videoElement = windowCtx?.livePlayer?.getVideoEl();
        let bufferSec = 0.0;
        switch (selected) {
            case "YouTube-LL":
                bufferSec = 4.0;
                break;
            case "YouTube-ULL":
                bufferSec = 2.0;
                break;
            case "SuperLL":
                bufferSec = 1.0;
                break;
            case "FLVSuperLL":
                bufferSec = 0.25;
                break;
        }
        if (videoElement && videoElement.duration == Infinity && bufferSec > 0) {
            let curBuffer = videoElement.buffered.end(videoElement.buffered.length - 1) - videoElement.currentTime;
            if (curBuffer > bufferSec + 1.0) {
                videoElement.currentTime += curBuffer - bufferSec;
                console.warn("降低延迟");
            }
        }

    }
    function checkSelected(type) {
        let selected = GM_getValue("BILI_LIVE_BUFFERSKIP");
        if (type == "YouTube-LL" && !selected) {
            return true;
        }
        return type == selected;
    }
    function registerSelectableVideoProcessingMenuCommand(name, type) {
        return GM_registerMenuCommand((checkSelected(type) ? "✅" : "🔲") + " " + name, function () {
            GM_setValue("BILI_LIVE_BUFFERSKIP", type);
            doSkipBuffer();
            updateMenuCommand();
        });
    }
    async function updateMenuCommand() {
        for (let command of menuCommandList) {
            await GM_unregisterMenuCommand(command);
        }
        menuCommandList = [];
        menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("YouTube 低延迟模式", "YouTube-LL"));
        menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("YouTube 超低延迟模式", "YouTube-ULL"));
        menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("暴力低延迟（如果网络不好会卡）", "SuperLL"));
        menuCommandList.push(await registerSelectableVideoProcessingMenuCommand("FLV 专用暴力低延迟（如果网络不好或者 HLS 会卡）", "FLVSuperLL"));
    }
    setInterval(() => {
        doSkipBuffer();
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