// ==UserScript==
// @name        upc
// @namespace   DCI
// @description wutevs
// @include     https://www.mturk.com/mturk/submit
// @include     https://www.mturk.com/mturk/continue*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5284/upc.user.js
// @updateURL https://update.greasyfork.org/scripts/5284/upc.meta.js
// ==/UserScript==


var upc = document.getElementsByTagName('h3')[1];
var upc2 = upc.innerHTML;
var upc3 = upc2.replace('Product barcode value: ','');

window.open("http://www.digit-eyes.com/cgi-bin/digiteyes.fcgi?upcCode=" + encodeURIComponent(upc3),"Digit-Eyes"); 
window.open("http://www.upcdatabase.com/item/" + encodeURIComponent(upc3),"UPC Database");
window.open("http://www.upcindex.com/" + encodeURIComponent(upc3),"upcindex");
window.open("http://www.upcdatabase.com/item/" + encodeURIComponent(upc3),"UPC Database");
window.open("http://searchupc.com/default.aspx?q=" + encodeURIComponent(upc3),"searchupc");
window.open("https://encrypted.google.com/search?q=" + encodeURIComponent(upc3),"Google");