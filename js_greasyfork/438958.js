// ==UserScript==
// @name                NGA 重定向
// @namespace           http://tampermonkey.net/
// @description         重定向到 ngabbs.com
// @version             2021.10.29
// @author              azuki
// @license MIT
// @match               *://nga.178.com/*
// @match               *://bbs.nga.cn/*
// @match               *://g.nga.cn/*
// @match               *://ngacn.cc/*
// @match               *://yues.org/*
// @downloadURL https://update.greasyfork.org/scripts/438958/NGA%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/438958/NGA%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    "use strict";
    window.location.replace(location.href.replace(location.hostname, "ngabbs.com"));
})();