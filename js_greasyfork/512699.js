// ==UserScript==
// @name         洛谷自动报错器
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  QWQ
// @author       _s_z_y_
// @match        https://www.luogu.com.cn/*
// @exclude        https://www.luogu.com.cn/
// @match        https://www.luogu.com/*
// @exclude        https://www.luogu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512699/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E6%8A%A5%E9%94%99%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/512699/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E6%8A%A5%E9%94%99%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    _feInstance.currentData.errorMessage='洛谷报错了'
    _feInstance.realRoot.currentTemplate='InternalError'
})();