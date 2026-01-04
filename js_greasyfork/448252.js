// ==UserScript==
// @name         V2EX 重定向
// @namespace    V2EX Redirect
// @run-at      start
// @match       *://v2ex.com
// @version     1.1
// @author      uJZk
// @description v2ex.com 重定向至 www.v2ex.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448252/V2EX%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448252/V2EX%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

window.location.replace(document.location.href.replace("v2ex.com","www.v2ex.com"));