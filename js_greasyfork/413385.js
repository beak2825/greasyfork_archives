// ==UserScript==
// @name                NGA Redirector
// @name:en-US          NGA Redirector
// @name:zh-CN          NGA 重定向
// @description         Automatically redirect NGA domains to bbs.nga.cn
// @description:en-US   Automatically redirect NGA domains to bbs.nga.cn
// @description:zh-CN   自动重定向 NGA 域名到 bbs.nga.cn
// @namespace           nga-redirector
// @version             2022.10.18
// @author              Akatsuki Rui
// @license             MIT License
// @run-at              document-start
// @match               *://g.nga.cn/*
// @match               *://nga.178.com/*
// @match               *://ngabbs.com/*
// @match               *://ngacn.cc/*
// @match               *://yues.org/*
// @downloadURL https://update.greasyfork.org/scripts/413385/NGA%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/413385/NGA%20Redirector.meta.js
// ==/UserScript==

"use strict";

window.location.replace(location.href.replace(location.hostname, "bbs.nga.cn"));
