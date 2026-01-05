// ==UserScript==
// @name        HTML5 on Youtube
// @namespace   notconform@gmail.com
// @description Makes Youtube use HTML5
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21211/HTML5%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/21211/HTML5%20on%20Youtube.meta.js
// ==/UserScript==
var myURL = location.href;
var watch  = myURL.indexOf("watch");
var enableOrnot = myURL.indexOf("html5");
if (watch > 0 && enableOrnot == -1){
   location.href += "&html5=1";
}