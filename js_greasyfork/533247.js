// ==UserScript==
// @name                 Prime Video Mobile Optimize
// @name:zh-CN           Prime Video 移动版优化
// @namespace            http://tampermonkey.net/
// @version              0.0.3
// @description          Optimize the user experience of Prime Video on the mobile web
// @description:zh-CN    优化 Prime Video 在移动版网页上的体验
// @author               TGSAN
// @match                *://*.primevideo.com/*
// @include              /https?:\/\/.*.?amazon\..+\/(.+\/)?gp\/video\/.*?/
// @include              /https?:\/\/.*.?amazon\..+\/(.+\/)?Amazon-Video\/.*?/
// @icon                 https://www.google.com/s2/favicons?sz=64&domain=www.primevideo.com
// @run-at               document-start
// @grant                unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/533247/Prime%20Video%20Mobile%20Optimize.user.js
// @updateURL https://update.greasyfork.org/scripts/533247/Prime%20Video%20Mobile%20Optimize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("[Prime Video Mobile Optimize] use unsafeWindow mode");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("[Prime Video Mobile Optimize] use window mode (your userscript extensions not support unsafeWindow)");
    }

    function HookProperty(object, property, value)
    {
        Object.defineProperty(object, property, {
            value: value
        });
    }

    HookProperty(windowCtx.navigator, "userAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0");
    HookProperty(windowCtx.navigator, "appVersion", "5.0 (Windows)");
    HookProperty(windowCtx.navigator, "platform", "Win32");
    HookProperty(windowCtx.navigator, "appName", "Netscape");
    HookProperty(windowCtx.navigator, "appCodeName", "Mozilla");
    HookProperty(windowCtx.navigator, "product", "Gecko");
    HookProperty(windowCtx.navigator, "vendor", "");
    HookProperty(windowCtx.navigator, "vendorSub", "");
    HookProperty(windowCtx.navigator, "maxTouchPoints", 0);
    HookProperty(windowCtx.navigator, "userAgentData", undefined);

    windowCtx.document.addEventListener("fullscreenchange", (event) => {
        if (document.fullscreenElement) {
            if (windowCtx.screen?.orientation?.lock) windowCtx.screen?.orientation?.lock("landscape");
            if (windowCtx.screen?.lockOrientation) windowCtx.screen?.lockOrientation("landscape");
        } else {
            if (windowCtx.screen?.orientation?.unlock) windowCtx.screen.orientation.unlock();
            if (windowCtx.screen?.unlockOrientation) windowCtx.screen.unlockOrientation();
        }
    });
})();