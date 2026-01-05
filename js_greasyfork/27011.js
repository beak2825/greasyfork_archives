// ==UserScript==
// @name        Hide ad at top
// @namespace   shutupslashdot
// @description Hide the damn ad at the top of slashdot that gets in the way of articles
// @include     https://slashdot.org/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27011/Hide%20ad%20at%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/27011/Hide%20ad%20at%20top.meta.js
// ==/UserScript==

var fuckoff = document.getElementsByClassName("adwrap");
var l = fuckoff.length;
for(var i = 0; i < l; i++)
{
   var fuck = fuckoff[i];
  fuck.hidden = true;
  fuck.display = "none";
  fuck.height=0;
  fuck.width = 0;
}