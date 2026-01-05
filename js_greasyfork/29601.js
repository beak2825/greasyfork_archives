// ==UserScript==
// @name        rarbg-auto-focus
// @namespace   rarbg-auto-focus
// @include     *rarbg.to*
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @description rarbg autofocus
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/29601/rarbg-auto-focus.user.js
// @updateURL https://update.greasyfork.org/scripts/29601/rarbg-auto-focus.meta.js
// ==/UserScript==

$(function() {
  var input = $('#searchinput');
  
  input.removeAttr('autocomplete').focus();
});