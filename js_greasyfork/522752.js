// ==UserScript==
// @name               NGA domain redirect
// @name:zh-CN         NGA 域名重定向
// @namespace          nga-redirect
// @version            2025.01.30
// @description        Automatically redirect NGA domains to bbs.nga.cn
// @description:zh-CN  自动重定向 NGA 域名到 bbs.nga.cn
// @author             Amelia
// @license            MIT
// @run-at             document-start
// @match              *://g.nga.cn/*
// @match              *://nga.178.com/*
// @match              *://ngabbs.com/*
// @match              *://ngacn.cc/*
// @icon               https://bbs.nga.cn/favicon.ico
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/522752/NGA%20domain%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/522752/NGA%20domain%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.hostname != "bbs.nga.cn") {
        window.location.hostname = "bbs.nga.cn";
    }
})();