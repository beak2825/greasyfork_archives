// ==UserScript==
// @name        Fix old FR site titles
// @namespace   flight_titles
// @description Fixes page titles for old site
// @include     http://flightrising.com/main.php?p=*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23488/Fix%20old%20FR%20site%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/23488/Fix%20old%20FR%20site%20titles.meta.js
// ==/UserScript==

$(document).ready(function(){
  var foo = document.title;
  if (foo == "Flight Rising") {
    var bar = $($("span[style*='font-size:22px;']").contents()[0]).text();
    document.title = bar+" | "+foo;
  };
});