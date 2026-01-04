// ==UserScript==
// @name remove furigana neat-reader
// @namespace autoremoverttags
// @author iniquitousx
// @description Automatically remove rt and rp tags
// @match https://*.neat-reader.com/webapp
// @license MIT
// @version 1.1
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/470976/remove%20furigana%20neat-reader.user.js
// @updateURL https://update.greasyfork.org/scripts/470976/remove%20furigana%20neat-reader.meta.js
// ==/UserScript==


var intv = setInterval(function() {

var rtTags = document.getElementsByTagName("rt");

if(rtTags.length < 1){

return false;

}

clearInterval(intv);

while (typeof rtTags !== "undefined" && rtTags.length>0){

rtTags[0].parentNode.removeChild(rtTags[0]);

}

var rpTags = document.getElementsByTagName("rp");

while (typeof rpTags !== "undefined" && rpTags.length>0) {

rpTags[0].parentNode.removeChild(rpTags[0]);

}

var pTags = document.getElementsByTagName("p");

for (let i = 0; i < pTags.length; i++) {

if (pTags[i].textContent) {

pTags[i].innerHTML = pTags[i].textContent;

var fixedpHTML = pTags[i].getHTML()

fixedpHTML = fixedpHTML.replaceAll('<ruby>','')

fixedpHTML = fixedpHTML.replaceAll('<rb>','')

pTags[i].setHTMLUnsafe(fixedpHTML)

}

}

}, 300);