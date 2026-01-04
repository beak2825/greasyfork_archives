// ==UserScript==
// @name         禁止miassav窗口失焦自动暂停
// @version      4.0
// @namespace    http://tampermonkey.net/
// @description  可以禁止miassav窗口失焦自动暂停
// @author       haoyinhaoyin
// @match        https://missav.com/*
// @match        https://missav123.com/*
// @match        https://missav.ws/*
// @match        https://missav.ai/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/475040/%E7%A6%81%E6%AD%A2miassav%E7%AA%97%E5%8F%A3%E5%A4%B1%E7%84%A6%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/475040/%E7%A6%81%E6%AD%A2miassav%E7%AA%97%E5%8F%A3%E5%A4%B1%E7%84%A6%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if (args.length !== 0 && (args[0] === 'blur' || args[0] === 'visibilitychange')) {
            console.log(`阻止监听事件：${args[0]}`);
            return;
        }
    return oldadd.call(this,...args)
}
})();