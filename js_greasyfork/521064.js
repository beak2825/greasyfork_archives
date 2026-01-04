// ==UserScript==
// @name        Lichess Analysis Bigger Move Font
// @namespace   Violentmonkey Scripts
// @match       *://lichess.org/*
// @grant       none
// @version     1.1
// @author      soup_steward
// @description 12/17/2024, 6:12:53 PM
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/521064/Lichess%20Analysis%20Bigger%20Move%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/521064/Lichess%20Analysis%20Bigger%20Move%20Font.meta.js
// ==/UserScript==


$(window).on('load', function() {
  $('move').css({"font-size": "150%"});
});