// ==UserScript==
// @name         防沉迷终结者(4399专用, 精简无比)
// @description  代码量极少, 页游也能到点不被踢出
// @namespace    https://fcmsb250.github.io/
// @version      0.1.1
// @icon         https://dsy4567.github.io/Anti-addiction-terminator/extension/icon/logo.svg
// @author       dsy4567 https://greasyfork.org/zh-CN/users/822325 / dsy4567 https://github.com/dsy4567
// @run-at       document-start
// @license      GPL-3.0
// @match        *://*.4399.com/*
// @match        *://*.aiwan4399.com/*
// @match        *://*.iwan4399.com/*
// @grant        unsafeWindow
// @homepageURL  https://fcmsb250.github.io/
// @supportURL   https://github.com/dsy4567/Fucking-Anti-Indulgence/
// @downloadURL https://update.greasyfork.org/scripts/444198/%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%284399%E4%B8%93%E7%94%A8%2C%20%E7%B2%BE%E7%AE%80%E6%97%A0%E6%AF%94%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444198/%E9%98%B2%E6%B2%89%E8%BF%B7%E7%BB%88%E7%BB%93%E8%80%85%284399%E4%B8%93%E7%94%A8%2C%20%E7%B2%BE%E7%AE%80%E6%97%A0%E6%AF%94%29.meta.js
// ==/UserScript==
try {
    Object.defineProperty(unsafeWindow, "smevent", {
        value: null, // 原来是Function, 这样做可以使防沉迷报错
        writable: false,
    });
} catch (e) {}
try {
    Object.defineProperty(unsafeWindow, "PageWebApiSdk", {
        value: null,
        writable: false,
    });
} catch (e) {}
try {
    Object.defineProperty(unsafeWindow, "getBizid", {
        value: null,
        writable: false,
    });
} catch (e) {}
