// ==UserScript==
// @name        OSRS - Accurate Polls
// @namespace   OSRSAccuratePolls
// @description Gives more accurate results to Old School RuneScape polls, including decimals in vote percentages, and colour-coded to show what's passing and failing.
// @include     *runescape.com/m=poll/*results.ws?id=*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5215/OSRS%20-%20Accurate%20Polls.user.js
// @updateURL https://update.greasyfork.org/scripts/5215/OSRS%20-%20Accurate%20Polls.meta.js
// ==/UserScript==

$("fieldset.question").each(function() {
  yesText = $("table tbody tr:first-of-type td:last-of-type", this).text();
  noText = $("table tbody tr:nth-of-type(2) td:last-of-type", this).text();
  skipText = $("table tbody tr:nth-of-type(3) td:last-of-type", this).text();
  yesSplit = yesText.split("(");
  yesVotes = parseInt(yesSplit[1].split(" votes)"));
  noSplit = noText.split("(");
  noVotes = parseInt(noSplit[1].split(" votes)"));
  skipSplit = skipText.split("(");
  skipVotes = parseInt(skipSplit[1].split(" votes)"));
  totalVotes = +yesVotes + +noVotes;
  yesPercent = (100 / totalVotes) * yesVotes;
  noPercent = (100 / totalVotes) * noVotes;
  $("table tbody tr:first-of-type td:last-of-type", this).text(yesPercent.toFixed(4) + "% (" + yesVotes + " votes)");
  $("table tbody tr:nth-of-type(2) td:last-of-type", this).text(noPercent.toFixed(4) + "% (" + noVotes + " votes)");
  $("table tbody tr:nth-of-type(3) td:last-of-type", this).text(skipVotes + " votes");
  $("table colgroup col:first-of-type", this).width("30%");
  if(yesPercent >= 75) {
    $(this).css({"background": "rgba(0, 255, 0, 0.2)"});
  } else {
    $(this).css({"background": "rgba(255, 0, 0, 0.2)"});
  }
});