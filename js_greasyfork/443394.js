// ==UserScript==
// @name         破解无限debugger
// @namespace    https://github.com/qianjiachun
// @version      0.0.1
// @description  用于破解网页无限debugger
// @author       小淳
// @match        *://*/*
// @include      *://*/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443394/%E7%A0%B4%E8%A7%A3%E6%97%A0%E9%99%90debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/443394/%E7%A0%B4%E8%A7%A3%E6%97%A0%E9%99%90debugger.meta.js
// ==/UserScript==

var constructorHook = constructor;
Function.prototype.constructor = function(s) {
    if (s == "debugger") {
        return function() {}
    }
    return constructorHook(s);
}