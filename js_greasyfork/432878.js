// ==UserScript==
// @name                Idle Detection Bypasser
// @name:zh             绕过 Idle Detection
// @name:zh-CN          绕过 Idle Detection
// @namespace           https://github.com/flyhaozi
// @version             0.2.1
// @description         Give a fake active response to the caller of the Idle Detection API
// @description:zh      给 Idle Detection API 的调用者一个虚假的 active 响应
// @description:zh-CN   给 Idle Detection API 的调用者一个虚假的 active 响应
// @author              flyhaozi
// @match               https://*/*
// @match               http://*/*
// @run-at              document-start
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/432878/Idle%20Detection%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/432878/Idle%20Detection%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // https://wicg.github.io/idle-detection/#api
    // https://chromium.googlesource.com/chromium/src/+/01971188f2f12266e0e4d119a294c52f4a3b0f41/third_party/blink/renderer/modules/idle/idle_detector.h
    // https://chromium.googlesource.com/chromium/src/+/01971188f2f12266e0e4d119a294c52f4a3b0f41/third_party/blink/renderer/modules/idle/idle_detector.cc
    const fakeDetector = function() {
        this.userState = null;
        this.screenState = null;
    };

    fakeDetector.requestPermission = async function() {
        return Promise.resolve('granted');
    };

    fakeDetector.prototype = Object.create(EventTarget.prototype);
    
    fakeDetector.prototype.start = async function(options) {
        this.userState = 'active';
        this.screenState = 'unlocked';
        this.dispatchEvent(new Event('change'));
    };

    Object.defineProperty(window, 'IdleDetector', { value: fakeDetector, configurable: false, writable: false });
    console.log('Idle Detector Hijacked!');
})();
