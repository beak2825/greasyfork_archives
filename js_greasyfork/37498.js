// ==UserScript==
// @name Instapaper Reading Time
// @namespace   hghwng
// @match *://*.instapaper.com/*
// @grant none
// @description Prints item count and total time of current item list in title 
// @version 0.0.1.20250213111519
// @downloadURL https://update.greasyfork.org/scripts/37498/Instapaper%20Reading%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/37498/Instapaper%20Reading%20Time.meta.js
// ==/UserScript==


(function() {
  var items = Array.from(document.querySelectorAll('.title_meta .read_time'));
  var minutes = items.map(x => parseInt(x.innerHTML.match(/(\d+) min/)[1]));
  var total = minutes.reduce((x, y) => (x + y));
  document.title += `: ${items.length} items in ${total} min`;
})();