// ==UserScript==
// @name         禁止miassav窗口失焦自动暂停
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以禁止miassav窗口失焦自动暂停
// @author       poco
// @match        https://missav.com/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/472187/%E7%A6%81%E6%AD%A2miassav%E7%AA%97%E5%8F%A3%E5%A4%B1%E7%84%A6%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/472187/%E7%A6%81%E6%AD%A2miassav%E7%AA%97%E5%8F%A3%E5%A4%B1%E7%84%A6%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if(args.length!==0&&args[0]=='blur'){
            console.log('劫持blur成功')
            return;
        }
    return oldadd.call(this,...args)
}
})();