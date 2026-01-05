// ==UserScript==
// @name         Premium-Link.ninja用スキッパー
// @namespace    http://plg4u.blog.fc2.com/
// @version      0.1
// @description  問題があるようでしたら削除します
// @author       hk
// @match        https://premium-link.ninja/*
// @exclude      https://premium-link.ninja/
// @exclude      https://premium-link.ninja/download
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18799/Premium-Linkninja%E7%94%A8%E3%82%B9%E3%82%AD%E3%83%83%E3%83%91%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/18799/Premium-Linkninja%E7%94%A8%E3%82%B9%E3%82%AD%E3%83%83%E3%83%91%E3%83%BC.meta.js
// ==/UserScript==

f = document.getElementsByTagName("button");
g = document.getElementsByClassName("g-recaptcha");
if(typeof swal !== "function" && f.length > 0 && g.length === 0) f[0].click();