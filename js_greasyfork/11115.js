// ==UserScript==
// @name           CS to Wikipedia
// @namespace      CSW
// @description    Changes all links from CS Monitor tags to Wikipedia articles.
// @include        http://*.csmonitor.com/*
// @version 0.0.1.20150721225245
// @downloadURL https://update.greasyfork.org/scripts/11115/CS%20to%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/11115/CS%20to%20Wikipedia.meta.js
// ==/UserScript==


// change this: http://www.csmonitor.com/tags/topic/Charlie+Sheen
//     to this: https://en.wikipedia.org/wiki/Charlie_Sheen

var links = document.getElementsByTagName("a"); //array
var regex = /^http:\/\/www\.csmonitor\.com\/tags\/topic\/(.+)$/i;
var regex2 = /\+/g;
for (var i=0,imax=links.length; i<imax; i++) {
   links[i].href = links[i].href.replace(regex,"https://en.wikipedia.org/wiki/$1").replace(regex2, "_");
}