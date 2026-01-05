// ==UserScript==
// @name        funkyQQMusic
// @namespace   scturtle
// @description bypass IP limit of QQMusic
// @include     http://y.qq.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11715/funkyQQMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/11715/funkyQQMusic.meta.js
// ==/UserScript==

setCookie("ip_limit", 1);
g_musicMain.IP_limit.isLimit = function(c){c && c(1)};