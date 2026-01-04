// ==UserScript==
// @name         cdnjs跳转
// @version      0.03
// @description  用于请求cdnjs域名自动跳转加速地址
// @namespace    https://greasyfork.org/en/users/362330-ooi-asuka
// @match		*://cdnjs.cloudflare.com/*
// @match		*://ooi.moe/*
// @match		*://*.ooi.moe/*
// @grant        none
// @inject-into  auto
// @run-at       document-start
// @license      暂无
// @downloadURL https://update.greasyfork.org/scripts/450284/cdnjs%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/450284/cdnjs%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
window.location.replace(location.href.replace(location.hostname, "cdn.bootcdn.net"));