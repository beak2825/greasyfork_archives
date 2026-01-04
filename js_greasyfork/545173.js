// ==UserScript==
// @name         c.pc.qq.com redirect
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  腾讯 QQ/TIM 打开网页被拦截时，自动跳转到打开的链接。已优化匹配规则
// @author       isixe & Clansty
// @license      MIT
// @supportURL   https://blog.itea.dev
// @match        *://c.pc.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/545173/cpcqqcom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/545173/cpcqqcom%20redirect.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const url = getParams("pfurl") || getParams("url");
    url && (window.location.href = url);
})();
