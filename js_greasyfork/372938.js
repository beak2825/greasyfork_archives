// ==UserScript==
// @name         破解超星作业编辑器粘贴限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Zeng Xiangfei
// @homepage     https://github.com/zxf1023818103/enable-chaoxing-editor-paste
// @supportURL   https://github.com/zxf1023818103/enable-chaoxing-editor-paste/issues
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @description  破解超星作业编辑器粘贴限制。
// @license      MIT
// @match        https://mooc1-2.chaoxing.com/work/doHomeWorkNew?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372938/%E7%A0%B4%E8%A7%A3%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A%E7%BC%96%E8%BE%91%E5%99%A8%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/372938/%E7%A0%B4%E8%A7%A3%E8%B6%85%E6%98%9F%E4%BD%9C%E4%B8%9A%E7%BC%96%E8%BE%91%E5%99%A8%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    for (var editorName in UE.instants) { UE.instants[editorName].__allListeners.beforepaste = null }
})();