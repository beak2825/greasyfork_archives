// ==UserScript==
// @name  Mturk Dashboard Privacy
// @namespace  whatever
// @description Hide sensitive areas of your mturk dashboard with a Ctrl-click.
// @include  https://www.mturk.com/mturk/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version  1.03
// @grant  none
// @author limcid
// @downloadURL https://update.greasyfork.org/scripts/14215/Mturk%20Dashboard%20Privacy.user.js
// @updateURL https://update.greasyfork.org/scripts/14215/Mturk%20Dashboard%20Privacy.meta.js
// ==/UserScript==

$(document).ready(function () {
  
// set default value for hiding
var hideDefault = false

// hide by default?
if (hideDefault) {
  $("td.container-content").slice(0,3).hide();  // Total Earnings, Your HIT Status
  $("#expandedHeader").hide(); // Transfer Balance on all mturk pages
  $("td.title_orange_text span.reward").hide();  // Total Earned amount displayed on HIT pages
}
  
  // listen for Ctrl-click to toggle visiblity
  $("body").click(function(e) {

    if (e.ctrlKey) {
      // elements to hide
      $("td.container-content").slice(0,3).toggle();  // Total Earnings, Your HIT Status
      $("#expandedHeader").toggle(); // Transfer Balance on all mturk pages
      $("td.title_orange_text span.reward").toggle();  // Total Earned amount displayed on HIT pages
    }

  });
 
});