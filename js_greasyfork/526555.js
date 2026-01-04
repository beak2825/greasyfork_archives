// ==UserScript==
// @name         c.pc.qq.com redirect
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  腾讯 QQ/TIM 打开网页被拦截时，自动跳转到打开的链接。
// @author       isixe
// @license      MIT
// @supportURL   https://blog.itea.dev
// @match        http://c.pc.qq.com/middlem.html?pfurl=*
// @match        https://c.pc.qq.com/middlem.html?pfurl=*
// @match        https://c.pc.qq.com/pc.html?*
// @downloadURL https://update.greasyfork.org/scripts/526555/cpcqqcom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/526555/cpcqqcom%20redirect.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const url = getParams("pfurl") || getParams("url");
    url && (window.location.href = url);
})();
