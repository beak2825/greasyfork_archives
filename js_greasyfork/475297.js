// ==UserScript==
// @name         tools.mscststs.com 越狱
// @namespace    mscststs
// @version      0.1
// @description  本脚本将会向 tools.mscststs.com 注入来自浏览器插件的 “更高权限” 的 HTTP 调用方法，包括越过浏览器的 CSP 和 同源策略，请在你完全理解此功能的情况下才安装此脚本，在适当的时候，脚本管理器会在新页面向你询问是否允许跨域。
// @author       mscststs
// @match        *://localhost:5173/*
// @match        *://tools.mscststs.com/*
// @source       https://tools.mscststs.com
// @icon         https://tools.mscststs.com/favicon.svg
// @license      MIT
// @connect      image.nmc.cn
// @connect      *
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475297/toolsmscststscom%20%E8%B6%8A%E7%8B%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/475297/toolsmscststscom%20%E8%B6%8A%E7%8B%B1.meta.js
// ==/UserScript==

(() => {
  unsafeWindow.escape = {
    version: "0.1",
    GM_xmlhttpRequest: (...args) => GM_xmlhttpRequest(...args),
  };
})();
