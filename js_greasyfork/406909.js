// ==UserScript==
// @name        Remove twitter trends
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @grant       none
// @version     1.0
// @author      qsniyg
// @description Removes the Trending section from twitter
// @downloadURL https://update.greasyfork.org/scripts/406909/Remove%20twitter%20trends.user.js
// @updateURL https://update.greasyfork.org/scripts/406909/Remove%20twitter%20trends.meta.js
// ==/UserScript==

setInterval(function() {
  var sections = document.getElementsByTagName("section");
  
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    if (section.children.length !== 2)
      continue;
    
    if (section.children[0].innerText.indexOf("Trending") >= 0) {
      section.style.display = "none";
    }
  }
}, 1000);