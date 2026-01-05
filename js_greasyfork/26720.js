// ==UserScript==
// @name         Karnage Accurate Aim Cursor+disable right click
// @namespace    meatman2tasty
// @version      1.8
// @description  Karnage cursor
// @author       Meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26720/Karnage%20Accurate%20Aim%20Cursor%2Bdisable%20right%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/26720/Karnage%20Accurate%20Aim%20Cursor%2Bdisable%20right%20click.meta.js
// ==/UserScript==

$("html, body").css("cursor","url(http://i.imgur.com/19WETkn.png) 17 17, default");

window.oncontextmenu = function () {
   return false;
};