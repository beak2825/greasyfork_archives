// ==UserScript==
// @name         NGA重定向到178
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  由于种种原因我们需要访问nga.178.com来浏览NGA
// @author       Souma
// @match	 *://ngabbs.com/*
// @match	 *://*.ngacn.cc/*
// @match	 *://ngacn.cc/*
// @match	 *://g.nga.cn/*
// @match	 *://bbs.nga.cn/*
// @icon         https://nga.178.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450377/NGA%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0178.user.js
// @updateURL https://update.greasyfork.org/scripts/450377/NGA%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0178.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace(location.href.replace(location.hostname, "nga.178.com"));
})();