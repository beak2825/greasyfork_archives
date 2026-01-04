// ==UserScript==
// @name          YouTube - Recommended videos killer
// @namespace     com.youtube.recommendedkiller
// @description	  Removes the recommended videos list
// @author        StellarSkylark, Xzer (FB News Feed Killer), keehun (original)
// @include       http://youtube.com/*
// @include       https://youtube.com/*
// @include       http://*.youtube.com/*
// @include       https://*.youtube.com/*
// @run-at        document-idle
// @version       1.0
// @license       GPLv3
// @downloadURL https://update.greasyfork.org/scripts/445203/YouTube%20-%20Recommended%20videos%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/445203/YouTube%20-%20Recommended%20videos%20killer.meta.js
// ==/UserScript==

// This userscript is an adapted version of https://greasyfork.org/en/scripts/17226-facebook-news-feed-killer for YouTube.

(function(){
  var css = '#contents.style-scope.ytd-rich-grid-renderer{ visibility: hidden !important }' + // Hide recommended on homepage
    '#container.style-scope.ytd-search{ visibility: visible !important}' + // Explicitly don't hide search results
    '#secondary.style-scope.ytd-watch-flexy{ visibility: hidden !important}'; // Hide recommended on watch page
  addCSS(css);
})();

function addCSS(css){
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node); 
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }
}