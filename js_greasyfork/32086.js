// ==UserScript==
// @name Hidden DHR Gmail Box
// @namespace Violentmonkey Scripts
// @match       *://mail.google.com/*
// @version      1.1
// @description  Hidden ad box in mail footer
// @author       surenkid
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/32086/Hidden%20DHR%20Gmail%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/32086/Hidden%20DHR%20Gmail%20Box.meta.js
// ==/UserScript==

(function() {
var css = ".hi { display:none; }; ";

// add CSS styles
if (typeof GM_addStyle != "undefined") {
  GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
  addStyle(css);
} else {
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    heads[0].appendChild(node); 
  }
}
})();

//(function() {
//window.setInterval(function() {
//Array.from(document.getElementsByClassName("hi")).forEach(function(element, index, array) {
//element.style.display = 'none';
//});
//}, 2000);
//})();