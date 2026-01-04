// ==UserScript==
// @name         滚动平滑
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  平滑的滚动
// @author       share121
// @match        *
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-body
// @homepageURL  https://greasyfork.org/zh-CN/scripts/455965
// @supportURL   https://greasyfork.org/zh-CN/scripts/455965/feedback
// @downloadURL https://update.greasyfork.org/scripts/455965/%E6%BB%9A%E5%8A%A8%E5%B9%B3%E6%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/455965/%E6%BB%9A%E5%8A%A8%E5%B9%B3%E6%BB%91.meta.js
// ==/UserScript==

GM_addStyle("*{scroll-behavior:smooth;}")