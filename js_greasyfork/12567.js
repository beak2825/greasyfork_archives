// ==UserScript==
// @name        SteamGifts - GOG.com Gift Club - Mark Users Below Difference Threshold
// @author      Adam Biser
// @description Marks users in the group list who are below the difference threshold based upon their sent amount.
// @namespace   steamgifts.goggift
// @include     http://www.steamgifts.com/group/f2hXw/goggift/users*
// @include     https://www.steamgifts.com/group/f2hXw/goggift/users*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12567/SteamGifts%20-%20GOGcom%20Gift%20Club%20-%20Mark%20Users%20Below%20Difference%20Threshold.user.js
// @updateURL https://update.greasyfork.org/scripts/12567/SteamGifts%20-%20GOGcom%20Gift%20Club%20-%20Mark%20Users%20Below%20Difference%20Threshold.meta.js
// ==/UserScript==

/*
Change log:

2019-10-17 - v3 - Added jquery @require so it works on Firefox again.

*/

/*
SENT / DIFFERENCE 
================= 
0 - 2   = -5
3 - 5   = -7
6 - 10  = -10
11 - 20 = -13
21 - 30 = -17
31 - 40 = -20
41 - 50 = -23
51 - 60 = -26
61+     = -30
*/

$("div.table__row-outer-wrap > div.table__row-inner-wrap").each(function() {
  var sentDiv = $(this).find("div.table__column--width-small:eq(0)");
  //var receivedDiv = $(this).find("div.table__column--width-small:eq(1)");
  var differenceDiv = $(this).find("div.table__column--width-small:eq(2)");
  var sent = sentDiv.text().match(/[0-9]+\.[0-9]/);
  //var received = receivedDiv.text().match(/[0-9]+\.[0-9]/);
  var difference = differenceDiv.text().match(/(?:\+|-)[0-9]+\.[0-9]/);
  var needed;
  if (sent <= 2) {
    needed = -5;
  } else if (sent <= 5) {
    needed = -7;
  } else if (sent <= 10) {
    needed = -10;
  } else if (sent <= 20) {
    needed = -13;
  } else if (sent <= 30) {
    needed = -17;
  } else if (sent <= 40) {
    needed = -20;
  } else if (sent <= 50) {
    needed = -23;
  } else if (sent <= 60) {
    needed = -26;
  } else {
    needed = -30;
  }
  differenceDiv.append("<br>Needs &gt; " + needed);
  if (difference < needed) {
    differenceDiv.css(({'color':'red'}));
  }
});