// ==UserScript==
// @name         New Mouse Aim Cursor
// @namespace    Lexi
// @version      1.9
// @description  vertix cursor
// @author       Infinite 
// @match        http://vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27854/New%20Mouse%20Aim%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/27854/New%20Mouse%20Aim%20Cursor.meta.js
// ==/UserScript==

$("html, body").css("cursor","url(http://i.imgur.com/QQCMh1x.png) 34 34, default");

window.oncontextmenu = function () {
   return false;
};