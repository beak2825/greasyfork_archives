// ==UserScript==
// @name        No Backspace
// @namespace   reddit_nobackspace
// @description Prevents you from using the backspace key on reddit.com/r/nobackspace. Code by /u/Mad_Gouki.
// @include     http*://www.reddit.com/r/nobackspace
// @include     http*://www.reddit.com/r/nobackspace/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2762/No%20Backspace.user.js
// @updateURL https://update.greasyfork.org/scripts/2762/No%20Backspace.meta.js
// ==/UserScript==
$(document).on('keydown', function(evt) {
var keycode = evt.charCode || evt.keyCode;
  if (keycode == 8 || keycode == 46 || keycode == 45 || (keycode >= 33 && keycode <= 40) ) {
    evt.preventDefault()
  }
})