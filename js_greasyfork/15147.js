// ==UserScript==
// @name        Default to All Branches Page (GitHub)
// @namespace   https://github.com/chriskim06/userscripts
// @description Changes the link so that clicking branches takes you to the all branches page
// @match       https://github.com/*/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @version     1.5.0
// @downloadURL https://update.greasyfork.org/scripts/15147/Default%20to%20All%20Branches%20Page%20%28GitHub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/15147/Default%20to%20All%20Branches%20Page%20%28GitHub%29.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {

  waitForKeyElements('.repository-content ul.numbers-summary > li:nth-child(2) > a', function(jNode) {
    var href = jNode.attr('href');
    if (!href.endsWith('/all')) {
      jNode.attr('href', href + '/all');
    }
  });

});

