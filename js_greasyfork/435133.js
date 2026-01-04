// ==UserScript==
// @name         防止B站直播在后台自动暂停
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  防止Bilibili直播在后台自动暂停
// @author       xfgryujk
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435133/%E9%98%B2%E6%AD%A2B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%9C%A8%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/435133/%E9%98%B2%E6%AD%A2B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%9C%A8%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    let realSetTimeout = window.setTimeout
    let realSetInterval = window.setInterval
    window.setTimeout = function (func, ...args) {
        let code = func.toString()
        if (code.indexOf('triggerSleepCallback') !== -1) {
            console.log(code)
            console.log('fuck bilibili PM')
            return null
        }
        return realSetTimeout.call(this, func, ...args)
    }
    window.setInterval = function (func, ...args) {
        let code = func.toString()
        if (code.indexOf('triggerSleepCallback') !== -1) {
            console.log(code)
            console.log('fuck bilibili PM')
            return null
        }
        return realSetInterval.call(this, func, ...args)
    }
})();