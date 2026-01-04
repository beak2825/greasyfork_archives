// ==UserScript==
// @name        APL Staff PM Notifier
// @namespace   https://helifreak.club
// @description Adds a counter next to staff PM link with open count.
// @include     https://apollo.rip/index.php
// @include     https://apollo.rip/staffpm.php*
// @version     1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35329/APL%20Staff%20PM%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/35329/APL%20Staff%20PM%20Notifier.meta.js
// ==/UserScript==

var pmElem;

$(document).ready(function() {
  pmElem = $("#nav_staffinbox > a")
  check();
  setInterval(check, 60 * 1000);
});

function check() {
  $.get("https://apollo.rip/staffpm.php?view=unanswered", function(data) {
    var index = data.indexOf("No messages");
    if (index === -1) {
      var data = $(data);
      var count = $(".message_table > tbody > tr", data).length;
      pmElem.text("Staff Inbox (" + (count - 1) + ")");
    } else {
      pmElem.text("Staff Inbox");
    }
  });
}
