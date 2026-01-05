// ==UserScript==
// @name        Delete All Comments
// @namespace   PXgamer
// @description Remove all user's comments
// @include     *kat.cr/user/*/comments/
// @include     *kickass.to/user/*/comments/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10124/Delete%20All%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/10124/Delete%20All%20Comments.meta.js
// ==/UserScript==

$('th.lasttd:nth-child(4)').append('  <span id="deleteAll"><i class="ka ka16 ka-delete ka-red"></i></span>');

$(document).delegate('#deleteAll', 'click', function delThis() {
  $('.lasttd.nobr a').each( function() { 
    $(this).click();
  });
});