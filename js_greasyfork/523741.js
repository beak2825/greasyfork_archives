// ==UserScript==
// @name         Cos波蕾 / 虹圖 去广告
// @namespace    http://fxxkads.xxx/
// @license      WTFPL
// @version      2025-01-14
// @description  Cos波蕾 / 虹圖 会出现页面广告和点击广告，移除这种恼人的特性；同时解除 devtool 调试限制。
// @author       underbed
// @match        https://cn.cosblay.com/*
// @match        https://*.cosblay.com/*
// @match        https://www.hongimg.com/*
// @match        https://*.hongimg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cosblay.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523741/Cos%E6%B3%A2%E8%95%BE%20%20%E8%99%B9%E5%9C%96%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/523741/Cos%E6%B3%A2%E8%95%BE%20%20%E8%99%B9%E5%9C%96%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
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
