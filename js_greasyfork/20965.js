// ==UserScript==
// @name        GameFAQs - Print Version FAQ links
// @namespace   rudicron
// @description Adds the string '?print=1' to all of the FAQ links on a game's FAQ page, making them point to the lightweight print version.
// @include     http://www.gamefaqs.com/*/*/faqs
// @include     https://www.gamefaqs.com/*/*/faqs
// @include     http://gamefaqs.gamespot.com/*/*/faqs
// @include     https://gamefaqs.gamespot.com/*/*/faqs
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20965/GameFAQs%20-%20Print%20Version%20FAQ%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/20965/GameFAQs%20-%20Print%20Version%20FAQ%20links.meta.js
// ==/UserScript==

var aList = document.body.querySelectorAll("td.ctitle > a");

for (var a of aList) {
  var link = a.getAttribute("href");
  if (link.includes("?")) {
    if (! link.toLowerCase().includes("print=1") ) {
      a.setAttribute("href", link.concat("&print=1"));
    }
  } else {
    a.setAttribute("href", link.concat("?print=1"));
  }
}
