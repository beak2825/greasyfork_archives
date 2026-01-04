// ==UserScript==
// @name        No Real Jobs
// @namespace   Archimedes
// @include     *.torn.com/userlist.php?*
// @description:en  Show only people with no job or city jobs
// @version     1.0.1
// @description Show only people with no job or city jobs
// @downloadURL https://update.greasyfork.org/scripts/383738/No%20Real%20Jobs.user.js
// @updateURL https://update.greasyfork.org/scripts/383738/No%20Real%20Jobs.meta.js
// ==/UserScript==

document.addEventListener('DOMNodeInserted', function() {

document.querySelectorAll('.user-info-list-wrap > li').forEach(element => {
  if (element.querySelector('[id^="icon27"]') !== null || element.querySelector('[id^="icon73"]') !== null || element.querySelector('[id^="icon70"]') !== null) {
    element.style.display = 'none';
  }
})

}, false);
