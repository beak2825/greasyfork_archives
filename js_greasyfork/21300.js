// ==UserScript==
// @name        RewriteSpaceLinks
// @namespace   EasyMigration
// @description ReplaceSpaceLinks
// @include     https://ecsuki.atlassian.net/wiki/spacedirectory/view.action
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21300/RewriteSpaceLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/21300/RewriteSpaceLinks.meta.js
// ==/UserScript==

$(document).ready(function() {
  setTimeout(function() {
    $('a').each(function() { 
      var $this = $(this),
      aHref = $this.attr('href'); 
      $this.attr('href', aHref.replace('viewspace','editspacelabels')); 
    });
  }, 1500);
});