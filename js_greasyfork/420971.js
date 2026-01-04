// ==UserScript==
// @name         哔哩哔哩直播间挂机小助手
// @namespace    https://www.bilibili.com/
// @version      5.441
// @description  bilibili/直播间挂机小助手
// @author       HoshiTsu，LinMuwang
// @copyright    YinLeRen，Oreo
// @match        *://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420971/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420971/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    let realSetTimeout = window.setTimeout
    let realSetInterval = window.setInterval
    window.setTimeout = function (func, ...args) {
        let code = func.toString()
        if (code.indexOf('triggerSleepCallback') !== -1) {
            return null
        }
        return realSetTimeout.call(this, func, ...args)
    }
    window.setInterval = function (func, ...args) {
        let code = func.toString()
        if (code.indexOf('triggerSleepCallback') !== -1) {
            return null
        }
        return realSetInterval.call(this, func, ...args)
    }
})();