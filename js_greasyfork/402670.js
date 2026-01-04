// ==UserScript==
// @name         RandomScript
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  This is a useless script. If you use this, there will be some error, but the game will not crash, and ur computer won't break. While your parent is using the toilet, don't even think about it. Now download the script or leave.
// @author       Entity_303™
// @include     *://arras.io/*
// @connect     arras.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402670/RandomScript.user.js
// @updateURL https://update.greasyfork.org/scripts/402670/RandomScript.meta.js
// ==/UserScript==

var cursorStyle = "wait";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "wait"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "wait"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "wait"; cursorRefresh(); } };

//**hack**//
var ArrasHackSystem
var systemHacksarecool