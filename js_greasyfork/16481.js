// ==UserScript==
// @name        JIRA - Show Total Number of Points for Each Column
// @namespace   chriskim06
// @description Displays the total amount of points in each column of your board
// @include     https://*jira*com/secure/*Board*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @version     1.0.2
// @grant       none
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/16481/JIRA%20-%20Show%20Total%20Number%20of%20Points%20for%20Each%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/16481/JIRA%20-%20Show%20Total%20Number%20of%20Points%20for%20Each%20Column.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

waitForKeyElements('#ghx-pool', getNumPoints);

// jNode is the board
function getNumPoints(jNode) {

  var columns = {};
  var columnHeaders = $('#ghx-column-headers');
  columnHeaders.children('li').each(function() {
    // Initialize each of the values to 0
    columns[$(this).attr('data-id')] = 0;
  });

  // For each swimlane...
  jNode.find('.ghx-columns').each(function() {
    // Get each column...
    $(this).children('li').each(function() {
      var id = $(this).attr('data-column-id');
      // For each ticket in the column...
      $(this).children('div').each(function() {
        // Add its point value to the total for the column
        var points = parseInt($(this).find('.ghx-end').find('span.aui-badge').html(), 10);
        if (points > 0) {
          columns[id] += points;
        }
      });
    });
  });

  // Append the total point value for this column to the column's name
  columnHeaders.children('li').each(function() {
    var columnId = $(this).attr('data-id');
    $(this).find('h2').append(' (' + columns[columnId] + ')');
  });

}
