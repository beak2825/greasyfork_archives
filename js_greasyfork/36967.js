// ==UserScript==
// @name         WebAssign Genius PAV II
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Iterates through PAV to find Answer
// @author       Erik Toor
// @include      /(http://www.webassign.net)\/.....\/(student/)practice\..*/
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/36967/WebAssign%20Genius%20PAV%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/36967/WebAssign%20Genius%20PAV%20II.meta.js
// ==/UserScript==

var htmlString = document.getElementsByTagName('html')[0].innerHTML;
console.log(htmlString);


var x = htmlString.match(/[A-Z][A-Z]_\d*_\d_\d_\d*/g);
var y = 0; 

document.getElementById(x[y]).value = "My value1";

while (y<x.length) { 
    document.getElementById(x[y]).value = "12";
    y += 1 ;
}

if (document.getElementById(x[0]).value == "12") {
document.querySelectorAll("input[type='submit']")[0].click();
document.querySelectorAll("input[type='submit']")[1].click();
// if question == question on original page click the query selector at index one and break 
// else click button at index 2 
document.querySelectorAll("input[type='submit']")[2].click();
}

