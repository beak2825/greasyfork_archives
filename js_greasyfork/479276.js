// ==UserScript==
// @name         ERNIE Bot Crack Debugger
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  ERNIE Bot Developer Console Debugger Unlimited Loop Cracking
// @description:zh-CN   文心一言开发者控制台调试Debugger无限循环破解
// @AuThor       AndyWu
// @license      LGPLv3
// @match        https://yiyan.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/479276/ERNIE%20Bot%20Crack%20Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/479276/ERNIE%20Bot%20Crack%20Debugger.meta.js
// ==/UserScript==

Function.prototype.apply = function (thisArg, argsArray=[]) {
    if (thisArg && typeof thisArg.toString === 'function') {
        if(this.name === 'anonymous' && this.toString() === 'function anonymous(\n) {\ndebugger\n}'){
            return;
        }
    }
    return this.call(thisArg, ...argsArray);
}