// ==UserScript==
// @name         RUTRACKER ※ Remove Russian Characters
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes all russian characters from links, makes it easier for those who don't speak русский to find what they're looking for.
// @author       kitsuneDEV
// @match        https://rutracker.org/forum/*
// @match        http://rutracker.org/forum/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380748/RUTRACKER%20%E2%80%BB%20Remove%20Russian%20Characters.user.js
// @updateURL https://update.greasyfork.org/scripts/380748/RUTRACKER%20%E2%80%BB%20Remove%20Russian%20Characters.meta.js
// ==/UserScript==

(function() {
  //'use strict';

  // Your code here...
  $('table a').each(function(i, v) {
    var $title = $(this).text();
      console.log($(this).text());
    // REMOVE CRYILLIC
    $title = $title.toLowerCase().replace(/[\u0400-\u04FF]/gi, "");
    // EXTRA HIDE INFO BETWEEN BRACKETS
    $title = $title.replace("/\(([^)]+)\)/", "");
    // KEYWORD REMOVE
    $title = $title.replace("lossless", "").replace("flac", "").replace(",", "").replace(".", "").replace("-", "");
    // BRACKET INFO BOTH [] AND ()
    $title = $title.replace(/\[.*\]/g, " ").replace(/ *\([^)]*\) */g, " ");
    $(this).text($title.toUpperCase());
  });
})();