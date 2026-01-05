// ==UserScript==
// @name        Auto-Save Message [WIP]
// @namespace   PXgamer
// @description Auto-Saves message on accidental click.
// @include     *kat.cr/*
// @include     *kickass.to/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13342/Auto-Save%20Message%20%5BWIP%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/13342/Auto-Save%20Message%20%5BWIP%5D.meta.js
// ==/UserScript==

var saved = "";

$(document).delegate('#fancybox-overlay', 'click', function () {
  if ($('[id^="message_content_"]').length) {
    saved = $('[id^="message_content_"]').val();
    confirm(`Are you sure you wanted to remove your carefully constructed message? \n \n` + saved);
  }
});