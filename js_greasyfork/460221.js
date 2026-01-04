// ==UserScript==
// @name        知乎日报 title显示nav
// @namespace   Violentmonkey Scripts
// @match       https://daily.zhihu.com/story/*
// @grant       ShowLe_e
// @version     1.2
// @author      -
// @license     MIT
// @run-at      document-end
// @description 2023/2/18 10:29:55
// @require        https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/460221/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%20title%E6%98%BE%E7%A4%BAnav.user.js
// @updateURL https://update.greasyfork.org/scripts/460221/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%20title%E6%98%BE%E7%A4%BAnav.meta.js
// ==/UserScript==

setTimeout(function() {
var nTit = $("p.DailyHeader-title").text();
document.title = nTit + " - 知乎日报";
}, 1000);