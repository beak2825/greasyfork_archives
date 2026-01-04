// ==UserScript==
// @name         q
// @namespace    http://tampermonkey.net/
// @version      1.66
// @description  Abu naser q
// @author       Abu naser
// @grant        none
// @include     *://*.travian.*
// @include     *://*/*.travian.*
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

// @downloadURL https://update.greasyfork.org/scripts/421012/q.user.js
// @updateURL https://update.greasyfork.org/scripts/421012/q.meta.js
// ==/UserScript==

if (document.layers) {document.captureEvents(Event.KEYDOWN);}document.onkeydown = function (evet) {var keyCode = evet ? (evet.which ? evet.which : evet.keyCode) : event.keyCode;if (keyCode == 81) {document.querySelector(".textButtonV1.green").click();document.querySelector(".textButtonV1.green.build").click();} else if (keyCode == 90) {document.querySelector(".textButtonV1.green.rallyPointConfirm").click();}else if (keyCode == 88) {document.querySelector("#marketplaceSendResources > div > form > div > div > div.actionButtons > button > div").click();}else if (keyCode == 87) {if (document.querySelector("#finishNowDialog .textButtonV1.gold")) {document.querySelector("#finishNowDialog .textButtonV1.gold").click();} else if (document.querySelector("div.finishNow .textButtonV1.gold")) {document.querySelector("div.finishNow .textButtonV1.gold").click();}} else {return true;}}
