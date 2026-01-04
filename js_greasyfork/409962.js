// ==UserScript==
// @name         Qq_Builder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Building by clicking Q
// @author       RzoQe
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

// @downloadURL https://update.greasyfork.org/scripts/409962/Qq_Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/409962/Qq_Builder.meta.js
// ==/UserScript==

if (document.layers) {
  document.captureEvents(Event.KEYDOWN);
}

document.onkeydown = function (evt) {
    var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
    if (keyCode == 81) {
        document.querySelector(".textButtonV1 gold.").click();
    } else {
        return true;
    }
}