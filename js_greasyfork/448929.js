// ==UserScript==
// @name         太空公司NG（NG Space Company）暴露资源存储变量到全局
// @version      0.1-Demo
// @description 【友情提示】如果看不懂使用方法，不建议使用本脚本，可以直接用加速脚本修改游戏【使用方法】控制台输入resource或resourceALL可打印出资源存储变量，从而修改资源。【脚本原理】通过劫持Proxy方法暴露变量。对VUE3一窍不通，第一次写关于VUE3的劫持，可能存在各种问题。
// @author       DreamNya
// @match        https://g8hh.github.io/NGSpaceCompany/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/448929/%E5%A4%AA%E7%A9%BA%E5%85%AC%E5%8F%B8NG%EF%BC%88NG%20Space%20Company%EF%BC%89%E6%9A%B4%E9%9C%B2%E8%B5%84%E6%BA%90%E5%AD%98%E5%82%A8%E5%8F%98%E9%87%8F%E5%88%B0%E5%85%A8%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/448929/%E5%A4%AA%E7%A9%BA%E5%85%AC%E5%8F%B8NG%EF%BC%88NG%20Space%20Company%EF%BC%89%E6%9A%B4%E9%9C%B2%E8%B5%84%E6%BA%90%E5%AD%98%E5%82%A8%E5%8F%98%E9%87%8F%E5%88%B0%E5%85%A8%E5%B1%80.meta.js
// ==/UserScript==

const oldParse = window.JSON.parse; //劫持汉化JSON
window.JSON.parse = function (args) {
    let res = oldParse(args)
    if (res.donatingPane) {
        window.chs = res
        window.JSON.parse = oldParse
    }
    return res
}

const oldProxy = window.Proxy; //劫持资源存储变量
window.resourceALL = {} //原始全部资源存储变量
window.resource = {} //优化后部分资源存储变量
window.Proxy = function (...args) {
    if (args[0].id != void 0 && args[0].unlocked != void 0) {
        window.resourceALL[args[0].id] = args[0]
        if (/star\d+/.test(args[0].id) == false && typeof args[0].count == 'number' && window.chs[args[0].id] && args[0].max == void 0) {
            window.resource[window.chs[args[0].id] + (args[0].id.includes("S1") ? window.chs[args[0].id.split("S1")[0]] : "")] = args[0]
        }
    }
    return new oldProxy(...args)
}
