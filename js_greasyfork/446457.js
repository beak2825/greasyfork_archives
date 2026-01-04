// ==UserScript==
// @name         FirefoxBLiveForceHEVC
// @namespace    moe.kuriko
// @version      0.1
// @description  强制B站直播使用HEVC wasm软解。(重振 Firefox 的荣光，吾辈义不容辞！)
// @author       Kuriko Moe
// @match        https://live.bilibili.com/*
// @match        https://www.bilibili.com/*
// @run-at       document-start 
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446457/FirefoxBLiveForceHEVC.user.js
// @updateURL https://update.greasyfork.org/scripts/446457/FirefoxBLiveForceHEVC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.__ENABLE_WASM_PLAYER__ = true;
    const entry = "bwphevc_live_supported";
    const fake_data = {"version":"4.7.7","ua":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5026.0 Safari/537.36 Edg/103.0.1254.0","supported":true,"supportInfo":{"browser":true,"browserHEVC":false,"cpu":true,"gpu":true,"gpuInfo":{"vendor":"Google Inc. (NVIDIA)","renderer":"ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0)"},"simd":true,"pthread":true,"hardwareConcurrency":24},"cached":false,"date":1655122190340}
    let d = fake_data;
    try {
        d = JSON.parse(localStorage.getItem(entry));
    }catch(e) {
        console.log("Use fake data to bypass hevc check");
    }
    d.supported = true;
    d = JSON.stringify(d);
    localStorage.setItem(entry, d);

    // Remove loading screen
    setInterval(function() {
        document.querySelectorAll('.web-player-loading').forEach(function (e) {
            console.log("removing loading icons")
            return e.remove();
        });
    }, 1000);
})();