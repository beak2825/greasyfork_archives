// ==UserScript==
// @name         Diep.io Pointer for Aim
// @namespace    diepiormod\
// @description  Better and improved aim. Don't let the "wait" style cursor intimidate you. It helps IMPROVE aim, not hurt it. No pop-ups saying you can get banned or your screen going black because of a diep.io not allowing a mod in the game. It has been self tested and results are POSITIVE. Hope this mod is FUN :) Thanks _BARLEYER_ for a reference.
// @author       _Nate_
// @version      3.14159265359
// @icon         https://vignette.wikia.nocookie.net/diepio/images/7/7f/New_Piskel_%281%29.gif/revision/latest?cb=20161221002456
// @include      http://diep.io/*
// @include      https://diep.io/*
// @include      diep.io*
// @connect      greasyfork.org
// @connect      diep.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375172/Diepio%20Pointer%20for%20Aim.user.js
// @updateURL https://update.greasyfork.org/scripts/375172/Diepio%20Pointer%20for%20Aim.meta.js
// ==/UserScript==
var cursorStyle = "wait";
var cursorRefresh = function() { document.getElementById("canvas").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "wait"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "wait"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor != cursorStyle ) { cursorStyle = "wait"; cursorRefresh(); } };