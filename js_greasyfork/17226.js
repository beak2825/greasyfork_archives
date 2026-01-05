// ==UserScript==
// @name          Facebook - News feed killer
// @namespace     com.facebook.newsfeedkiller
// @description	  Removes the ticker, news feed, etc.
// @author        Xzer, keehun (original)
// @include       http://facebook.com/*
// @include       https://facebook.com/*
// @include       http://*.facebook.com/*
// @include       https://*.facebook.com/*
// @run-at        document-start
// @version       1.2
// @downloadURL https://update.greasyfork.org/scripts/17226/Facebook%20-%20News%20feed%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/17226/Facebook%20-%20News%20feed%20killer.meta.js
// ==/UserScript==

// This userscript (1.1, "Old") is a slightly modified version of https://userstyles.org/styles/101805
// (I replaced "display: none" with "visibility: hidden", since Facebook will continuously try to load content with the former)
// 1.2: Added a few lines for the July 2020 Facebook redesign.


// New (1.2)
(function(){
  var css = 'div[role="main"]{ visibility: hidden !important }';
  addCSS(css);
})();


// Old
(function(){
  var css = [
    "div[id*=\"topnews\"], /* News feed */",
    //"#u_0_1q, /* News feed: empty loading indicator items */",
    "#pagelet_bookmark_nav, /* Left column: Bookmarks */",
    "a[href*=\"lists\"], /* Left column: Lists like \'Close Friends\' */",
    "div[id*=\"ticker\"] /* Right column / Chat sidebar: news ticker */",
    "{",
    "  	visibility: hidden !important;",
    "}"
	].join("\n");
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
