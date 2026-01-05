// ==UserScript==
// @name        Apollo [FIXED]
// @namespace   by Mirai
// @description Adds [FIXED] to the title, locks the thread, and moves the thread to Trash.
// @include     https://apollo.rip/forums.php?action=*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26389/Apollo%20%5BFIXED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/26389/Apollo%20%5BFIXED%5D.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function () {
  var threadTitle = $('#thread_title_textbox').val();
  $('#thread_title_textbox').val('[FIXED] ' + threadTitle);
  $('#locked_thread_checkbox').prop('checked', true);
  $('#move_thread_selector').val('4');
}, false);
