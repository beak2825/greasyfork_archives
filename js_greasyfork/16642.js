// ==UserScript==
// @name        LINK GET
// @namespace   joaopauloxe3@gmail.com
// @include     https://kissanime.to/Anime/*/E*
// @version     1
// @description:en KissAnime GET
// @grant       none
// @description KissAnime GET
// @downloadURL https://update.greasyfork.org/scripts/16642/LINK%20GET.user.js
// @updateURL https://update.greasyfork.org/scripts/16642/LINK%20GET.meta.js
// ==/UserScript==
 
window.onload = function () {
  var c = document.getElementById("divDownload").children[1];
  c.setAttribute('download', '');
  var t = document.getElementById("divFileName").innerHTML.substring(document.getElementById("divFileName").innerHTML.indexOf('/b>')+3, document.getElementById("divFileName").innerHTML.indexOf('<div')-2).trim();
  document.write("<div id='hi'></div>");
  document.getElementById("hi").innerHTML += "<p>" + t + "</p>";
  document.getElementById("hi").appendChild(c);
}