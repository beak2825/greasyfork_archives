// ==UserScript==
// @name Toto
// @namespace http://tampermonkey.net/
// @version 0.2
// @description try to take over the world!
// @author You
// @match http://www.ss-dugo-selo.skole.hr/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/27783/Toto.user.js
// @updateURL https://update.greasyfork.org/scripts/27783/Toto.meta.js
// ==/UserScript==
(function(start) {
'use strict';
var images = document.getElementsByTagName('img');
for (var n = images.length; n--> 0;) {
  var img = images[n];
  img.setAttribute("src", "");
}
var i = 0;
var elements = document.getElementsByName('radiobutton_glasaj');
for (i;i<elements.length;i++) {
if(elements[i].value == "38") {
elements[i].checked = true;
document.getElementsByName("anketaGlasaj")[0].click();
}
}
window.addEventListener('load', function() { 
window.open("http://www.ss-dugo-selo.skole.hr","_self");
}, false);
})();