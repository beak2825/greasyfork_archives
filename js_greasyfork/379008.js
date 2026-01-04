// ==UserScript==
// @name         Excel at JOL
// @namespace    https://github.com/shmup
// @version      1.0.0
// @description  Mouse on, mouse off
// @include	 https://deckserver.net/jol/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/379008/Excel%20at%20JOL.user.js
// @updateURL https://update.greasyfork.org/scripts/379008/Excel%20at%20JOL.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

/* Written for https://tampermonkey.net */
/* https://greasyfork.org/en/scripts/379008-excel-at-jol */

GM_addStyle("#screensaver {width: 100%;height: 100%;position: fixed;top: 0;left: 0;background: white url('https://i.imgur.com/UdGenYq.png') no-repeat center center fixed;background-size: auto;background-size: cover; pointer-events: none; }");
GM_addStyle("body:hover #screensaver { display: none; }");

(function(window) {
  'use strict';

  document.body.innerHTML += "<div id='screensaver' />";

})(window);