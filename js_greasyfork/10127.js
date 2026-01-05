// ==UserScript==
// @name        Delete All Uploads
// @namespace   PXgamer
// @description Remove all user's comments
// @include     *kat.cr/user/*/uploads/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10127/Delete%20All%20Uploads.user.js
// @updateURL https://update.greasyfork.org/scripts/10127/Delete%20All%20Uploads.meta.js
// ==/UserScript==

$('th.center:nth-child(3)').append('  <span id="deleteAll"><i class="ka ka16 ka-delete ka-red"></i></span>');

console.log($('[id^="del_"] a').length);
$('[id^="del_"] a').each( function() {
  $(this).attr('onclick', $(this).attr('onclick').split(')) ')[1]);
});
console.log('Done!');
$(document).delegate('#deleteAll', 'click', function delThis() {
  $('[id^="del_"] a').each( function() {
    $(this).click();
  });
});