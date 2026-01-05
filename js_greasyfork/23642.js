// ==UserScript==
// @name        ESPN Fantasy Football
// @namespace   https://github.com/chriskim06/userscripts
// @description Moves the projected points column next to the opponent column
// @match       http://games.espn.com/ffl/clubhouse?leagueId=*&teamId=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/23642/ESPN%20Fantasy%20Football.user.js
// @updateURL https://update.greasyfork.org/scripts/23642/ESPN%20Fantasy%20Football.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {

  waitForKeyElements('#playerTableHeader > ul > li:first-child[id="current"]', rearrange);

  function rearrange(jNode) {
    if ($('#playertable_0').length) {
      $('#playertable_0 tr').each(function() {
        if ($(this).hasClass('playerTableBgRowHead')) {
          $(this).children(':eq(2)').attr('colspan', 3);
        } else {
          $(this).children(':eq(4)').after($(this).children(':eq(12)'));
        }
      });
    }
  }

});

