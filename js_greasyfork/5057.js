// ==UserScript==
// @name        Save Chirbit
// @namespace   http://chirb.it
// @description Add a button to save Chirbits
// @include     http://www.chirb.it*
// @include     http://chirb.it*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5057/Save%20Chirbit.user.js
// @updateURL https://update.greasyfork.org/scripts/5057/Save%20Chirbit.meta.js
// ==/UserScript==

var doc = document.documentElement.innerHTML;
var file = doc.match("http://audio\.chirbit\.com/.*\.mp3");
if (file != null) {
  var linkloc = document.body.innerHTML.indexOf("<div id=\"chirbits\">") - 5;
  var end = document.body.innerHTML.slice(linkloc);
  var begin = document.body.innerHTML.slice(0,linkloc);
  var link = "<hr>\n<center><h2><a href=\"" + file + "\">Download Chirbit</a></h2></center>";
  document.body.innerHTML = begin + link + end;
}