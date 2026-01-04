// ==UserScript==
// @name         跨域请求
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  实现跨域请求
// @author       share121
// @match        *://*/*
// @run-at       document-start
// @license      MIT
// @connect      *
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/460225/%E8%B7%A8%E5%9F%9F%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/460225/%E8%B7%A8%E5%9F%9F%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest || GM.xmlhttpRequest;