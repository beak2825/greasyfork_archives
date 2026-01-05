// ==UserScript==
// @name        Make JIRA Ticket Links Open Detailed View
// @namespace   chriskim06
// @description Clicking a ticket id on a board opens the detailed ticket view in a new tab
// @include     https://*jira*com/secure/*Board*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @version     1.1.3
// @grant       none
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/16478/Make%20JIRA%20Ticket%20Links%20Open%20Detailed%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/16478/Make%20JIRA%20Ticket%20Links%20Open%20Detailed%20View.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {

  waitForKeyElements(".js-key-link", addOnClick);

  function addOnClick(jNode) {
    var url = window.location.href.match(/https:\/\/.*jira.*com/g)[0];
    jNode.on('click', function(e) {
      var link = url + jNode.attr('href');
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
      return false;
    });
  }

});
