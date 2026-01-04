// ==UserScript==
// @name         超星学习通解除作业粘贴限制
// @namespace    http://tampermonkey.net/
// @version      9.92
// @description  南阳理工学院计算机与软件学院专用脚本，外校仅供参考！！！！！！
// @author       Mr.Tan
// @match        *://mooc1.chaoxing.com/mooc2/work/dowork?*
// @match        *://mooc1.chaoxing.com/work/doHomeWorkNew?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444965/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%A3%E9%99%A4%E4%BD%9C%E4%B8%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/444965/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%A3%E9%99%A4%E4%BD%9C%E4%B8%9A%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //解除作业粘贴限制，仅限南工软件学院专业作业
    for (var editorName in UE.instants) { UE.instants[editorName].__allListeners.beforepaste = null }
})();