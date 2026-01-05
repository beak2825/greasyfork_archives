// ==UserScript==
// @name        Delete All Comments From User IP
// @namespace   PXgamer
// @description Kill That IP's Comments
// @include     *kat.cr/moderator/listusers/*/comments/
// @include     *kickass.to/moderator/listusers/*/comments/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10125/Delete%20All%20Comments%20From%20User%20IP.user.js
// @updateURL https://update.greasyfork.org/scripts/10125/Delete%20All%20Comments%20From%20User%20IP.meta.js
// ==/UserScript==

$('th.lasttd').append('  <span id="deleteAll"><i class="ka ka16 ka-delete ka-red"></i></span>');

$(document).delegate('#deleteAll', 'click', function delThis() {
  $('.lasttd.nobr a').each( function() { 
    $(this).click();
  });
});