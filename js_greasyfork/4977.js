// ==UserScript==
// @name       Display Timesheet Comments as <p>
// @namespace  http://canto.com
// @version    0.1
// @description  Displays the Comments of Kimble Timesheet entries withour the need to hover over them.
// @copyright  2014+, Carsten Hoffmann
// @include    https://kimbleone.*.visual.force.com/apex/TimesheetApprove*
// @downloadURL https://update.greasyfork.org/scripts/4977/Display%20Timesheet%20Comments%20as%20%3Cp%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/4977/Display%20Timesheet%20Comments%20as%20%3Cp%3E.meta.js
// ==/UserScript==

$("td img").each( function (i, element) {
  if (!!$(this).attr('title')) {
   console.log($(this).attr('title'));
   $(this).after($(this).attr('title'));
   $(this).remove();
  }
});