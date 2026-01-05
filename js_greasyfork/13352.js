// ==UserScript==
// @name        Clear Wall
// @namespace   PXgamer
// @description Clears the wall - https://kat.cr/ideabox/show/ability-to-clean-wall/
// @include     *kat.cr/user/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13352/Clear%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/13352/Clear%20Wall.meta.js
// ==/UserScript==

$('div.buttonsline').append(' <a class="siteButton bigButton redButton" id="clearWall"><span>clear wall</span> <span class="ka ka-delete ka16 ka-red"></span></a> <style> a#clearWall span.ka-red { height: 12px !important; background: none !important;  text-shadow: none !important;} </style>');

$(document).delegate(function() {
  $('[href^"javascript: DeleteComment"]').each (function() {
    $(this).click();
  });
});

