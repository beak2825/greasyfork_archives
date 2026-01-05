// ==UserScript==
// @name        VITAcad
// @namespace   
// @description Rid of marquees
// @include     https://vtop.vit.ac.in/student/stud_home.asp
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17101/VITAcad.user.js
// @updateURL https://update.greasyfork.org/scripts/17101/VITAcad.meta.js
// ==/UserScript==



var a = document.getElementsByTagName("MARQUEE")[0];
var b = document.getElementsByTagName("MARQUEE")[1];

console.log(a.length);
console.log(b.length);

var c = document.createElement('DIV');
var d = document.createElement('DIV');

c.innerHTML = a.innerHTML;
d.innerHTML = b.innerHTML;

a.parentNode.replaceChild(c, a);
b.parentNode.replaceChild(d, b);
