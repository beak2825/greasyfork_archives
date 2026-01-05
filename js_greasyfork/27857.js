// ==UserScript==
// @name         Accurate Aim Cursor
// @namespace    vertix.io
// @version      1.0
// @description  Karnage cursor
// @author       Meatman2tasty
// @match        http://vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27857/Accurate%20Aim%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/27857/Accurate%20Aim%20Cursor.meta.js
// ==/UserScript==

$("html, body").css("cursor","url(http://i.imgur.com/19WETkn.png) 34 34, default");

window.oncontextmenu = function () {
   return false;
};