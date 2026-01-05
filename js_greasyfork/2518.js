// ==UserScript==
// @name        GSMArena Highlight Compare Differences
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description See https://greasyfork.org/forum/discussion/449/gsmarena-com-a-script-to-highlight-rows-with-differences-when-comparing-phones
// @license     BSD 3-clause
// @include     http://www.gsmarena.com/compare.php3*
// @version     0.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2518/GSMArena%20Highlight%20Compare%20Differences.user.js
// @updateURL https://update.greasyfork.org/scripts/2518/GSMArena%20Highlight%20Compare%20Differences.meta.js
// ==/UserScript==

// Only run if a second phone was selected (check for presence of nfo2 entries)
var test = document.getElementsByClassName("nfo2");
if (test.length > 0){
  // Add rules to style rows designated as having differences
  var s = document.createElement("style");
  s.setAttribute("type", "text/css");
  s.appendChild(document.createTextNode(".hcdiff .ttl, .hcdiff .nfo, .hcdiff .nfo2{background:#ffb !important; box-shadow:inset 0 0 .45em #ee0 !important;}"));
  document.body.appendChild(s);
  // Check all rows under #specs-list (there are numerous tables in here)
  var rows = document.querySelectorAll("#specs-list tr");
  for (var i=0; i<rows.length; i++){
    if (rows[i].children.length > 1){
      // Compare the last cell in the row to the send-to-last (needed because numbers of cells can vary)
      if (rows[i].lastElementChild.innerHTML != rows[i].lastElementChild.previousElementSibling.innerHTML){
        rows[i].className = "hcdiff";
      }
    }
  }
}