// ==UserScript==
// @name        Add a tags to Keyboardco.com
// @description Fix KeyboardCo onclick heavy homepage. They use divs with onclick, making navigation very difficult and cumbersome.
// @namespace   I don't want to be emailed #132#
// @include     htt*://*keyboardco.com/*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/14615/Add%20a%20tags%20to%20Keyboardcocom.user.js
// @updateURL https://update.greasyfork.org/scripts/14615/Add%20a%20tags%20to%20Keyboardcocom.meta.js
// ==/UserScript==

$( ".borderoff" ).wrap(function() {
    var hrf = $(this).attr("onclick").split("'")[1];
  return "<a href='" + hrf + "'></a>";
});