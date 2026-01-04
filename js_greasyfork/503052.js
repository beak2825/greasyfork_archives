// ==UserScript==
// @name         4khd 去广告
// @namespace    http://fxxkads.xxx/
// @license      WTFPL
// @version      2025-12-11
// @description  4khd 会出现页面广告和点击广告，移除这种恼人的特性；同时解除 devtool 调试限制。
// @author       underbed
// @match        https://4khd.com/*
// @match        https://*.4khd.com/*
// @match        https://doofl.xxtt.info/*
// @match        https://*.doofl.xxtt.info/*
// @match        https://iwmqt.uuss.uk/*
// @match        https://*.iwmqt.uuss.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4khd.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/503052/4khd%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503052/4khd%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

GM_addStyle("div.popup{display: none;}");
GM_addStyle("div.centbtd{display: none;}");

let __oldAddEventListener__ = unsafeWindow.addEventListener;
unsafeWindow.addEventListener = function (type, listener, options) {
    if (type == "load") {
        if (listener.toString().includes("popMagic")) {
            console.log("已经屏蔽的方法:", listener);
            return;
        }
    }
    if (arguments.length < 3) {
        __oldAddEventListener__(type, listener, false);
    } else {
        __oldAddEventListener__(type, listener, options);
    }
};

let __oldQuerySelector__ = unsafeWindow.document.querySelector;
unsafeWindow.document.querySelector = function (selector) {
    if (selector == "[disable-devtool-auto]") {
        console.log("中断禁用 devtool 的代码执行");
        return null;
    }
    return __oldQuerySelector__(selector);
};
