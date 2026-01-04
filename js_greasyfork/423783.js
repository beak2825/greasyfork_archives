// ==UserScript==
// @name         fixedTime
// @version      0.1
// @description  set position of system time block to fixed
// @author       Alex Kochetov
// @grant        none
// @include        *://*.travian.*
// @include        *://*/*.travian.*
// @exclude     *://*.travian*.*/hilfe.php*
// @exclude     *://*.travian*.*/log*.php*
// @exclude     *://*.travian*.*/index.php*
// @exclude     *://*.travian*.*/anleitung.php*
// @exclude     *://*.travian*.*/impressum.php*
// @exclude     *://*.travian*.*/anmelden.php*
// @exclude     *://*.travian*.*/gutscheine.php*
// @exclude     *://*.travian*.*/spielregeln.php*
// @exclude     *://*.travian*.*/links.php*
// @exclude     *://*.travian*.*/geschichte.php*
// @exclude     *://*.travian*.*/tutorial.php*
// @exclude     *://*.travian*.*/manual.php*
// @exclude     *://*.travian*.*/ajax.php*
// @exclude     *://*.travian*.*/ad/*
// @exclude     *://*.travian*.*/chat/*
// @exclude     *://forum.travian*.*
// @exclude     *://board.travian*.*
// @exclude     *://shop.travian*.*
// @exclude     *://*.travian*.*/activate.php*
// @exclude     *://*.travian*.*/support.php*
// @exclude     *://help.travian*.*
// @exclude     *://*.answers.travian*.*
// @exclude     *.css
// @exclude     *.js
// @namespace https://greasyfork.org/users/750280
// @downloadURL https://update.greasyfork.org/scripts/423783/fixedTime.user.js
// @updateURL https://update.greasyfork.org/scripts/423783/fixedTime.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const serverTime = document.querySelector(".stime");
    serverTime.style.position = "fixed";
    serverTime.style.top = "10px";
    serverTime.style.left = "218px";
    serverTime.style.zIndex = "999999";
    serverTime.style.color = "lightgreen";
    serverTime.style.fontWeight = "700";



})();