// ==UserScript==
// @name         NGA域名重定向
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  NGA社区域名重定向到nga.178.com，不然不显示评论。
// @author       imgreasy
// @match	 *://bbs.nga.cn/*
// @match	 *://ngabbs.com/*
// @match	 *://*.ngacn.cc/*
// @match	 *://ngacn.cc/*
// @match	 *://g.nga.cn/*
// @match	 *://yues.org/*
// @grant        none
// @license      MIT
// @run-at	 document-start
// @downloadURL https://update.greasyfork.org/scripts/451644/NGA%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/451644/NGA%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    window.location.replace(location.href.replace(location.hostname, "nga.178.com"));
})();