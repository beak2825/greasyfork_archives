// ==UserScript==
// @name        WaniKani TAB Key to Info click
// @namespace   https://www.wanikani.com
// @description Binds the Item Info button to the TAB key
// @include     https://www.wanikani.com/review/session
// @include     http://www.wanikani.com/review/session
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38002/WaniKani%20TAB%20Key%20to%20Info%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/38002/WaniKani%20TAB%20Key%20to%20Info%20click.meta.js
// ==/UserScript==
// by that other guy, updated to include event.preventDefault() so it actually works

jQuery(document).on('keydown', function (event) {

  if (event.keyCode==9) {
      event.preventDefault();
    if ( $("#information").is(":visible") ) {
      $('#all-info').click();
    } else {
      $('#option-item-info').click();
    }
    return false;
  }
});