// ==UserScript==
// @name				Correct Legend Order for 7 Dreamers' Schedule
// @namespace		https://duckofduckness.com/
// @description	Sets the order for the schedule legend to the official order of the Dreamcatcher members, with 'Group' first.
// @author			DuckOfDuckness https://twitter.com/DuckOfDuckness
// @match				https://7-dreamers.com/schedule/
// @require  		http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant 			GM_addStyle
// @version			1
// @downloadURL https://update.greasyfork.org/scripts/390040/Correct%20Legend%20Order%20for%207%20Dreamers%27%20Schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/390040/Correct%20Legend%20Order%20for%207%20Dreamers%27%20Schedule.meta.js
// ==/UserScript==

var classOrder  = [
  "tribe-events-category-group",
  "tribe-events-category-jiu",
  "tribe-events-category-sua",
  "tribe-events-category-siyeon",
  "tribe-events-category-handong",
  "tribe-events-category-yoohyeon",
  "tribe-events-category-dami",
  "tribe-events-category-gahyeon"
];
var containerNd = $("div.teccc-legend > ul");


for (var J = 0, L = classOrder.length;  J < L;  J++) {
  var targetNode  = containerNd.find ('li.' + classOrder[J]);
  containerNd.append (targetNode);
}