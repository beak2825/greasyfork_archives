// ==UserScript==
// @name         Show All Kompas.com
// @namespace    https://greasyfork.org/en/users/221437
// @version      0.3
// @description  Automatically shows all page for Kompas.com.
// @author       channelorange
// @match        *://*.kompas.com/*
// @match        *://*.tribunnews.com/*
// @match        *://*.gridoto.com/*
// @exclude      *://www.kompas.com/
// @exclude      *://www.tribunnews.com/
// @exclude      *://www.gridoto.com/
// @run-at       document-start
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @downloadURL https://update.greasyfork.org/scripts/373617/Show%20All%20Kompascom.user.js
// @updateURL https://update.greasyfork.org/scripts/373617/Show%20All%20Kompascom.meta.js
// ==/UserScript==

if (window.location.href.toString().indexOf("?page=all") != -1) return false;

var pathLama = window.location.pathname;
if (!/\?page=all$/.test(pathLama)) {
    var pathBaru = pathLama + "?page=all";
    window.location.replace(pathBaru);
}