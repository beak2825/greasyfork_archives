// ==UserScript==
// @name         Rock Paper Scroll
// @version      0.2.2
// @description  Rock, Paper, Shotgun's new design adds a horizontal scroll, for no good reason.
// @author       Ross Angus
// @match        https://www.rockpapershotgun.com/*
// @grant        GM_addStyle
// @license MIT
// @namespace https://greasyfork.org/users/226099
// @downloadURL https://update.greasyfork.org/scripts/374409/Rock%20Paper%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/374409/Rock%20Paper%20Scroll.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.body.removeAttribute('data-version');
  GM_addStyle('.nav_main { max-width: 100%; display: flex; flex-wrap: wrap; }');
  GM_addStyle('.leaderboard_container:not(.sticky) { width: auto; height: auto; }');
  GM_addStyle('.logo { flex-basis: 40%; margin: 0 0 1em; }');
  GM_addStyle('.app_header .nav_primary ul, .app_header .nav_secondary ul { display: block; }');
  GM_addStyle('.nav_primary li, .nav_secondary li { display: inline-block; }');
  GM_addStyle('body:not([data-version="hd"]) .nav_trending ul { flex-wrap: wrap; }');
})();