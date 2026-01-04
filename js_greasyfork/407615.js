// ==UserScript==
// @name        HLTV - no news on matches page
// @description Removes news sidebar from matches page
// @namespace   https://www.hltv.org
// @match       https://www.hltv.org/matches
// @grant       none
// @version     1.1
// @author      spmn
// @downloadURL https://update.greasyfork.org/scripts/407615/HLTV%20-%20no%20news%20on%20matches%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/407615/HLTV%20-%20no%20news%20on%20matches%20page.meta.js
// ==/UserScript==

let matches = document.getElementsByClassName("newMatches");

if (matches !== undefined) {
  let pageGrid = matches[0].getElementsByClassName("standardPageGrid");
  let content  = matches[0].getElementsByClassName("mainContent");

  if (content !== undefined) {
    matches[0].appendChild(content[0]);
  }
  
  if (pageGrid !== undefined) {
    pageGrid[0].remove();
  }
}
