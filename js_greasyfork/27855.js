// ==UserScript==
// @name         Vertix.io
// @namespace    Lexi
// @version      3.0
// @description  Karnage cursor
// @author       Infinite 
// @match        http://vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27855/Vertixio.user.js
// @updateURL https://update.greasyfork.org/scripts/27855/Vertixio.meta.js
// ==/UserScript==

$("html, body").css("cursor","url(http://i.imgur.com/QQCMh1x.png) 34 34, default");

window.oncontextmenu = function () {
   return false;
};