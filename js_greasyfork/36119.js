// ==UserScript==
// @name        Okoun Check Ultralight
// @namespace   ocl.okoun.cz
// @description Automatický reload oblíbených na okoun.cz
// @include     https://www.okoun.cz/favourites.jsp*
// @author      BALCARENKO
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36119/Okoun%20Check%20Ultralight.user.js
// @updateURL https://update.greasyfork.org/scripts/36119/Okoun%20Check%20Ultralight.meta.js
// ==/UserScript==

(function() {
  
  // automaticky reload
  window.setTimeout(function(){location.reload(true)}, 77*1000);
  
})();

