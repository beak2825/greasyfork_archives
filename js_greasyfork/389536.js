// ==UserScript==
// @name         Show All detik.com
// @namespace    https://greasyfork.org/en/users/221437
// @version      0.1
// @description  Automatically shows all page for detik.com.
// @author       channelorange
// @match        *://*.detik.com/*
// @exclude      *://news.detik.com/
// @exclude      *://news.detik.com/?tag_from=wp_news_logo
// @run-at       document-start
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @downloadURL https://update.greasyfork.org/scripts/389536/Show%20All%20detikcom.user.js
// @updateURL https://update.greasyfork.org/scripts/389536/Show%20All%20detikcom.meta.js
// ==/UserScript==

if (window.location.href.toString().indexOf("?single=1") != -1) return false;

var pathLama = window.location.pathname;
if (!/\?single=1$/.test(pathLama)) {
    var pathBaru = pathLama + "?single=1";
    window.location.replace(pathBaru);
}
