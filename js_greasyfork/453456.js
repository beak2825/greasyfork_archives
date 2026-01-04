// ==UserScript==
// @name                zhiwang redirector
// @name:en-US          Zhiwang Redirector
// @name:zh-CN          知网 重定向
// @description         Automatically redirect 知网 domains to 海外知网
// @description:en-US   Automatically redirect zhiwang domains to chn.oversea.cnki.net
// @description:zh-CN   自动重定向 知网 域名到 海外知网
// @namespace           zhiwang-redirector
// @version             1.0
// @author              Big 1ce
// @license             MIT License
// @run-at              document-start
// @match               *://www.cnki.net/*
// @match               *://kns.cnki.net/*
// @match               *://r.cnki.net/*
// @downloadURL https://update.greasyfork.org/scripts/453456/zhiwang%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/453456/zhiwang%20redirector.meta.js
// ==/UserScript==

"use strict";

window.location.replace(location.href.replace(location.hostname, "chn.oversea.cnki.net"));