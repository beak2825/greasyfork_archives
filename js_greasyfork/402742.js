// ==UserScript==
// @name         Errors
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  This code doesn't break a device or game, but there will be a error.
// @author       Entity_303
// @match        http://arras.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402742/Errors.user.js
// @updateURL https://update.greasyfork.org/scripts/402742/Errors.meta.js
// ==/UserScript==
var cursorStyle = "wait";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "wait"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "wait"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "wait"; cursorRefresh(); } };

//**hacksAreCool**//
var ArrasHackIsCool
var BackgroundHackScript

//**Don'tUseThis**//
var StyxError
var NullErron
var SinstaxError
var RiverStyxError

//**Errors**//
var Error1
var Error2
var Error3