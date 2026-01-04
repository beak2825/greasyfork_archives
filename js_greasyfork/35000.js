// ==UserScript==
// @name Collapse instances for Hackage
// @namespace Violentmonkey Scripts
// @description:en Automatically collapse all instances on Hackage.
// @match *://hackage.haskell.org/package/*/docs/*.html
// @grant none
// @version 0.0.1.20171110153442
// @description Automatically collapse all instances on Hackage.
// @downloadURL https://update.greasyfork.org/scripts/35000/Collapse%20instances%20for%20Hackage.user.js
// @updateURL https://update.greasyfork.org/scripts/35000/Collapse%20instances%20for%20Hackage.meta.js
// ==/UserScript==

(function(){
  "use strict";
  window.addEventListener('load', function() {
    document.querySelectorAll("p.collapser")
      .forEach(function (node) { 
          node.click();
      });
  });
})();
