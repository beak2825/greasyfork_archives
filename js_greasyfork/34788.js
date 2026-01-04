// ==UserScript==
// @name        Bingo Popout Text Fix
// @description Fixes popout text for firefox on various bingo sites.
// @author      PsyMarth
// @namespace   psymarth
// @include     http://www.speedrunslive.com/tools/bingo-popout.html*
// @include     http://bingo.giuocob.com/popout*
// @include     http://www.srlbingo.com/popout*
// @include     http://www.everalert.net/bingo/popout*
// @include     http://bingo-ocr.herokuapp.com/etc/bingo-popout*
// @include     http://*buzzplugg.com/bryan/vchildbingo/test/popout.html*
// @include     http://*speedruntools.com/bingo/bingo-popout*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/34788/Bingo%20Popout%20Text%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/34788/Bingo%20Popout%20Text%20Fix.meta.js
// ==/UserScript==
function fixText() {
  var goals = document.querySelectorAll('td');
  for (i = 0, len = goals.length; i < len; i++) {
    var goal = goals[i];
    goal.innerHTML = decodeURI(goal.innerHTML);
  }
}
fixText();